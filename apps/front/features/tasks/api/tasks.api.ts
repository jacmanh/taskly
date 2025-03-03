import { HttpService } from '@app/front/core/httpService'
import { Task, TaskStatus } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

/**
 * Hook to get all tasks for the current user
 */
export const useGetUserTasks = () =>
  useQuery<Task[]>({
    queryKey: ['tasks', 'user'],
    queryFn: async () => {
      return await HttpService.get<Task[]>('/api/task')
    },
  })

/**
 * Hook to get all tasks for the company
 */
export const useGetCompanyTasks = () =>
  useQuery<Task[]>({
    queryKey: ['tasks', 'company'],
    queryFn: async () => {
      return await HttpService.get<Task[]>('/api/task/company')
    },
  })

/**
 * Hook to get a specific task by ID
 */
export const useGetTaskById = (id: string) =>
  useQuery<Task>({
    queryKey: ['tasks', id],
    queryFn: async () => {
      return await HttpService.get<Task>(`/api/task/${id}`)
    },
    enabled: !!id, // Only run the query if an ID is provided
  })

/**
 * Hook to update a task's status
 */
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      taskId, 
      status 
    }: { 
      taskId: string; 
      status: TaskStatus 
    }) => {
      return await HttpService.put<Task>(`/api/task/${taskId}`, { status })
    },
    onSuccess: () => {
      // Invalidate and refetch tasks queries
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
