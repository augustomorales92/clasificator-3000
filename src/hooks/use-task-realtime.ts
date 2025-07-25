'use client'

import { useSession } from '@/lib/auth-client'
import type { Task } from '@/lib/schema'
import { supabaseClient } from '@/lib/supabase-client'
import { RealtimeChannel } from '@supabase/supabase-js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

const TASKS_QUERY_KEY = 'tasks'
const REALTIME_RETRY_DELAY = 5000 // 5 seconds
const SSE_RECONNECT_DELAY = 3000 // 3 seconds

async function fetchTasks(userId: string): Promise<Task[]> {
  const response = await fetch(`/api/tasks?userId=${userId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch tasks.')
  }
  return response.json()
}

export function useTasksRealtime() {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const queryClient = useQueryClient()
  const tasksRef = useRef<Task[]>([])
  const [useSSEFallback, setUseSSEFallback] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  // Fetch tasks using TanStack Query with periodic refresh
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [TASKS_QUERY_KEY, userId],
    queryFn: () => (userId ? fetchTasks(userId) : Promise.resolve([])),
    enabled: !!userId,
    refetchInterval: 30000, // Refresh every 30 seconds as a safety net
    refetchIntervalInBackground: true,
  })

  // Keep reference updated for realtime notifications
  useEffect(() => {
    tasksRef.current = tasks
  }, [tasks])

  const notifyTaskStatusChange = useCallback(
    (previousTask: Task, updatedTask: Task) => {
      if (previousTask.status !== updatedTask.status) {
        if (updatedTask.status === 'processing') {
          toast.info(`Processing started: ${updatedTask.serviceName}`)
        } else if (updatedTask.status === 'completed') {
          const duration =
            updatedTask.finishedAt && updatedTask.startedAt
              ? (new Date(updatedTask.finishedAt).getTime() -
                  new Date(updatedTask.startedAt).getTime()) /
                1000
              : undefined

          toast.success(`Processing completed: ${updatedTask.serviceName}`, {
            description: duration ? `Processed in ${duration}s` : undefined,
            action: {
              label: 'View Results',
              onClick: () =>
                window.open(`/dashboard/library/${updatedTask.id}`, '_blank'),
            },
          })
        } else if (updatedTask.status === 'failed') {
          toast.error(`Processing failed: ${updatedTask.serviceName}`, {
            description: updatedTask.errorMessage || 'Unknown error occurred',
          })
        }
      }
    },
    []
  )

  // Set up SSE connection
  const setupSSE = useCallback(() => {
    if (!userId || !useSSEFallback) return

    const eventSource = new EventSource(`/api/tasks/events?userId=${userId}`)
    eventSourceRef.current = eventSource

    eventSource.onmessage = (event) => {
      try {
        const newTasks = JSON.parse(event.data) as Task[]
        queryClient.setQueryData([TASKS_QUERY_KEY, userId], newTasks)

        // Check for status changes
        newTasks.forEach((newTask) => {
          const previousTask = tasksRef.current.find((t) => t.id === newTask.id)
          if (previousTask) {
            notifyTaskStatusChange(previousTask, newTask)
          }
        })
      } catch (error) {
        console.error('Error parsing SSE data:', error)
      }
    }

    eventSource.onerror = () => {
      eventSource.close()
      eventSourceRef.current = null
      // Attempt to reconnect after delay
      setTimeout(() => setupSSE(), SSE_RECONNECT_DELAY)
    }

    return () => {
      eventSource.close()
      eventSourceRef.current = null
    }
  }, [userId, useSSEFallback, queryClient, notifyTaskStatusChange])

  // Set up realtime subscription
  useEffect(() => {
    if (!userId) return

    let tasksChannel: RealtimeChannel | null = null
    let retryTimeout: NodeJS.Timeout

    const setupRealtimeSubscription = () => {
      tasksChannel = supabaseClient
        .channel(`user_tasks_${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tasks',
            filter: `userId=eq.${userId}`,
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const newTask = payload.new as Task
              queryClient.setQueryData<Task[]>(
                [TASKS_QUERY_KEY, userId],
                (old) => (old ? [...old, newTask] : [newTask])
              )
            } else if (payload.eventType === 'UPDATE') {
              const updatedTask = payload.new as Task
              const previousTask = tasksRef.current.find(
                (t) => t.id === updatedTask.id
              )

              if (previousTask) {
                notifyTaskStatusChange(previousTask, updatedTask)
                queryClient.setQueryData<Task[]>(
                  [TASKS_QUERY_KEY, userId],
                  (old) =>
                    old?.map((task) =>
                      task.id === updatedTask.id ? updatedTask : task
                    )
                )
              }
            } else if (payload.eventType === 'DELETE') {
              const deletedTaskId = payload.old?.id
              if (deletedTaskId) {
                queryClient.setQueryData<Task[]>(
                  [TASKS_QUERY_KEY, userId],
                  (old) => old?.filter((task) => task.id !== deletedTaskId)
                )
                toast.info(
                  `Task removed: ${payload.old?.serviceName || 'Task'}`
                )
              }
            }
          }
        )
        .subscribe((status, err) => {
          if (status === 'SUBSCRIBED') {
            console.log(`Subscribed to Realtime for user ${userId}`)
            setUseSSEFallback(false) // Disable SSE when Realtime is working
          }
          if (status === 'CHANNEL_ERROR') {
            console.error('Supabase Realtime Channel Error:', err)
            toast.error('Realtime connection error, falling back to SSE.')
            setUseSSEFallback(true)

            // Retry Realtime connection after delay
            retryTimeout = setTimeout(
              setupRealtimeSubscription,
              REALTIME_RETRY_DELAY
            )
          }
        })
    }

    setupRealtimeSubscription()

    return () => {
      if (tasksChannel) {
        supabaseClient.removeChannel(tasksChannel)
        console.log(`Unsubscribed Realtime for user ${userId}`)
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout)
      }
    }
  }, [userId, notifyTaskStatusChange, queryClient])

  // Set up SSE when needed
  useEffect(() => {
    return setupSSE()
  }, [setupSSE])

  // Task action mutations
  const retryMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await fetch(
        `/api/tasks?taskId=${jobId}&userId=${userId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'queue' }),
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to retry task')
      }
    },
    onSuccess: () => {
      toast.success('Task queued for retry.')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to retry task')
    },
  })

  const cancelMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await fetch(
        `/api/tasks?taskId=${jobId}&userId=${userId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'failed',
            errorMessage: 'Cancelled by user',
          }),
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to cancel task')
      }
    },
    onSuccess: () => {
      toast.success('Task cancelled.')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to cancel task')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await fetch(
        `/api/tasks?taskId=${jobId}&userId=${userId}`,
        {
          method: 'DELETE',
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete task')
      }
    },
    onSuccess: () => {
      toast.success('Task deleted.')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete task')
    },
  })

  console.log(tasks, 'tasks')

  return {
    tasks,
    loading:
      isLoading ||
      retryMutation.isPending ||
      cancelMutation.isPending ||
      deleteMutation.isPending,
    error: error?.message || null,
    retryTask: (jobId: string) => retryMutation.mutate(jobId),
    cancelTask: (jobId: string) => cancelMutation.mutate(jobId),
    deleteTask: (jobId: string) => deleteMutation.mutate(jobId),
  }
}
