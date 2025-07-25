'use client'

import { useSession } from '@/lib/auth-client'
import type { Task } from '@/lib/schema'
import { supabaseClient } from '@/lib/supabase-client'
import { RealtimeChannel } from '@supabase/supabase-js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'

const TASKS_QUERY_KEY = 'tasks'

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

  // Fetch tasks using TanStack Query
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [TASKS_QUERY_KEY, userId],
    queryFn: () => (userId ? fetchTasks(userId) : Promise.resolve([])),
    enabled: !!userId,
  })

  // Keep reference updated for realtime notifications
  useEffect(() => {
    tasksRef.current = tasks
  }, [tasks])

  const notifyTaskStatusChange = useCallback(
    (previousTask: Task, updatedTask: Task) => {
      if (previousTask.status !== updatedTask.status) {
        if (updatedTask.status === 'completed') {
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

  // Set up realtime subscription
  useEffect(() => {
    if (!userId) return

    let tasksChannel: RealtimeChannel | null = null

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
            queryClient.setQueryData<Task[]>([TASKS_QUERY_KEY, userId], (old) =>
              old ? [...old, newTask] : [newTask]
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
              toast.info(`Task removed: ${payload.old?.serviceName || 'Task'}`)
            }
          }
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to Realtime for user ${userId}`)
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('Supabase Realtime Channel Error:', err)
          toast.error('Realtime connection error. Please refresh.')
        }
      })

    return () => {
      if (tasksChannel) {
        supabaseClient.removeChannel(tasksChannel)
        console.log(`Unsubscribed Realtime for user ${userId}`)
      }
    }
  }, [userId, notifyTaskStatusChange, queryClient])

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
