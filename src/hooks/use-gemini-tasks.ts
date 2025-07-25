'use client'

import { useSession } from '@/lib/auth-client'
import type { GeminiTask } from '@/lib/schema'
import { useQuery } from '@tanstack/react-query'

export function useGeminiTasks(id?: string) {
  const { data: session, isPending: isSessionLoading } = useSession()
  const userId = session?.user?.id

  const {
    data: tasks,
    isLoading: isTasksLoading,
    error,
    refetch,
  } = useQuery<GeminiTask[]>({
    queryKey: ['gemini-tasks', userId],
    queryFn: async () => {
      if (!userId) return []
      const response = await fetch(`/api/gemini-tasks?userId=${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch Gemini tasks')
      }
      return response.json()
    },
    enabled: !!userId,
  })

  const isLoading = isSessionLoading || isTasksLoading || !tasks

  const task = tasks?.find((task) => task.id === id)

  return {
    tasks: tasks || [],
    isLoading,
    error,
    refetch,
    task,
  }
}
