import { HttpService } from '@app/front/core/httpService'
import { User } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'

/**
 * Hook to get the current user's profile
 */
export const useGetMe = () =>
  useQuery<User>({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      return await HttpService.get<User>('/api/user/me')
    },
  })

/**
 * Hook to get a user by ID
 */
export const useGetUserById = (id: string) =>
  useQuery<User>({
    queryKey: ['user', id],
    queryFn: async () => {
      return await HttpService.get<User>(`/api/user/${id}`)
    },
    enabled: !!id,
  })
