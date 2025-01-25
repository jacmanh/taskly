import { useMutation } from '@tanstack/react-query'
import { SignInParams } from '@taskly/shared'
import { HttpService } from '../../../core/httpService'

export const useSignIn = () =>
  useMutation<unknown, object, SignInParams>({
    mutationFn: async ({ email, password }) => {
      return await HttpService.post('/api/auth/signin', { email, password })
    },
  })
