'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { SignInParams, signInSchema } from '@taskly/shared'
import { isAxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useSignIn } from '../auth.api'

const SignInPage = () => {
  const router = useRouter()
  const { mutateAsync: signIn } = useSignIn()

  const { handleSubmit, register } = useForm<SignInParams>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInParams) => {
    try {
      const response = await signIn(data)
      if (response.success) {
        router.push('/')
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message)
      }
    }
  }

  return (
    <div>
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <label>
          Email
          <input className="border" {...register('email')} />
        </label>
        <label>
          Password
          <input type="password" className="border" {...register('password')} />
        </label>
        <button type="submit">Sign in</button>
      </form>
    </div>
  )
}

export default SignInPage
