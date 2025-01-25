'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { SignInParams, signInSchema } from '@taskly/shared'
import { useForm } from 'react-hook-form'
import { useSignIn } from '../auth.api'

const SignInPage = () => {
  const { mutateAsync: signIn } = useSignIn()

  const { handleSubmit, register } = useForm<SignInParams>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInParams) => {
    console.log(data)
    try {
      await signIn(data)
      console.log('ok')
    } catch (error) {
      console.error(error)
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
