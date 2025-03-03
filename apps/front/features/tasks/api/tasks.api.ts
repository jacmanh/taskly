import { HttpService } from '@app/front/core/httpService'
import { Task } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'

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
