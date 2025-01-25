import { User } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { HttpService } from '../../../core/httpService'

export const useGetMe = () =>
  useQuery<User>({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      console.log('query')
      return await HttpService.get('/api/user/me')
    },
  })
