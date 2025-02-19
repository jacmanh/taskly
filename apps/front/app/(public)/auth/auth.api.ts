import { User } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { SignInParams } from '@taskly/shared'
import { AxiosError } from 'axios'
import { HttpService } from '../../../core/httpService'

type SignInResponse = {
  success: boolean
  user: User
}
export const useSignIn = () =>
  useMutation<SignInResponse, AxiosError, SignInParams>({
    mutationFn: async ({ email, password }) =>
      await HttpService.post('/api/auth/signin', {
        email,
        password,
      }),
  })

export const useLogout = () =>
  useMutation<SignInResponse, AxiosError>({
    mutationFn: async () => await HttpService.post('/api/auth/logout', {}),
  })
