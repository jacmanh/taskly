import { TaskStatus } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Task, TaskService } from '../services/task.service'

/**
 * Hook to get all tasks for the current user
 */
export const useGetUserTasks = () =>
  useQuery<Task[]>({
    queryKey: ['tasks', 'user'],
    queryFn: () => TaskService.getUserTasks(),
  })

/**
 * Hook to get all tasks for the company
 */
export const useGetCompanyTasks = () =>
  useQuery<Task[]>({
    queryKey: ['tasks', 'company'],
    queryFn: () => TaskService.getCompanyTasks(),
  })

/**
 * Hook to get a specific task by ID
 */
export const useGetTaskById = (id: string) =>
  useQuery<Task>({
    queryKey: ['tasks', id],
    queryFn: () => TaskService.getTaskById(id),
    enabled: !!id, // Only run the query if an ID is provided
  })

/**
 * Hook to update a task's status
 */
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: TaskStatus }) => {
      return await TaskService.updateTaskStatus(taskId, status)
    },
    onSuccess: () => {
      // Invalidate and refetch tasks queries
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
