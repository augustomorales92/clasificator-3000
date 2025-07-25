'use client'

import { useSession } from '@/lib/auth-client' // Asumo que esto te da el ID del usuario
import type { Task } from '@/lib/schema' // Tu tipo Drizzle para Task
import { supabaseClient } from '@/lib/supabase-client'
import { RealtimeChannel } from '@supabase/supabase-js'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export function useTasksRealtime() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { data: session } = useSession() // Obtiene la sesión del usuario
  const userId = session?.user?.id

  const tasksRef = useRef<Task[]>(tasks)
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

  useEffect(() => {
    if (!userId) {
      setTasks([])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    let tasksChannel: RealtimeChannel | null = null

    const initializeAndSubscribe = async () => {
      try {
        const initialResponse = await fetch(`/api/tasks?userId=${userId}`)
        if (!initialResponse.ok) {
          throw new Error('Failed to fetch initial tasks.')
        }
        const initialTasks: Task[] = await initialResponse.json()
        setTasks(initialTasks)

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
              setTasks((prevTasks) => {
                let currentTasks = [...prevTasks]

                if (payload.eventType === 'INSERT') {
                  const newTask = payload.new as Task
                  currentTasks.push(newTask)
                } else if (payload.eventType === 'UPDATE') {
                  const updatedTask = payload.new as Task
                  const previousTask = tasksRef.current.find(
                    (t) => t.id === updatedTask.id
                  )

                  if (previousTask) {
                    notifyTaskStatusChange(previousTask, updatedTask)
                    currentTasks = currentTasks.map((task) =>
                      task.id === updatedTask.id ? updatedTask : task
                    )
                  }
                } else if (payload.eventType === 'DELETE') {
                  const deletedTaskId = payload.old?.id
                  if (deletedTaskId) {
                    currentTasks = currentTasks.filter(
                      (task) => task.id !== deletedTaskId
                    )
                    toast.info(
                      `Task removed: ${payload.old?.serviceName || 'Task'}`
                    )
                  }
                }
                return currentTasks
              })
            }
          )
          .subscribe((status, err) => {
            if (status === 'SUBSCRIBED') {
              console.log(`Subscribed to Realtime for user ${userId}`)
              setLoading(false)
            }
            if (status === 'CHANNEL_ERROR') {
              console.error('Supabase Realtime Channel Error:', err)
              setError('Realtime connection error. Please refresh.')
              setLoading(false)
            }
          })
      } catch (err: any) {
        console.error('Error fetching initial tasks or subscribing:', err)
        setError(
          err.message ||
            'Failed to load tasks and establish realtime connection.'
        )
        setLoading(false)
      }
    }

    initializeAndSubscribe()

    return () => {
      if (tasksChannel) {
        supabaseClient.removeChannel(tasksChannel)
        console.log(`Unsubscribed Realtime for user ${userId}`)
      }
    }
  }, [userId, notifyTaskStatusChange])

  const triggerTaskAction = useCallback(
    async (jobId: string, method: string, body?: object) => {
      if (!userId) {
        toast.error('Authentication required.')
        return false
      }
      setLoading(true)
      try {
        const response = await fetch(
          `/api/tasks?taskId=${jobId}&userId=${userId}`,
          {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify(body) : undefined,
          }
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(
            errorData.message || `Failed to ${method.toLowerCase()} task`
          )
        }
        setLoading(false)
        return true
      } catch (error: any) {
        console.error(`Error ${method.toLowerCase()}ing job:`, error)
        toast.error(error.message || `Failed to ${method.toLowerCase()} job`)
        setLoading(false)
        return false
      }
    },
    [userId]
  )

  const retryTask = useCallback(
    async (jobId: string) => {
      const success = await triggerTaskAction(jobId, 'PUT', { status: 'queue' })
      if (success) toast.success('Task queued for retry.')
    },
    [triggerTaskAction]
  )

  const cancelTask = useCallback(
    async (jobId: string) => {
      const success = await triggerTaskAction(jobId, 'PUT', {
        status: 'failed',
        errorMessage: 'Cancelled by user',
      })
      if (success) toast.success('Task cancelled.')
    },
    [triggerTaskAction]
  )

  const deleteTask = useCallback(
    async (jobId: string) => {
      const success = await triggerTaskAction(jobId, 'DELETE')
      if (success) toast.success('Task deleted.')
    },
    [triggerTaskAction]
  )

  return {
    tasks,
    loading,
    error,
    retryTask,
    cancelTask,
    deleteTask,
  }
}
