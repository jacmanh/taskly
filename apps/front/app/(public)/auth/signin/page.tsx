'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import { SignInParams, signInSchema } from '@taskly/shared'
import { Button, Card, Field, FormField, Icon, Typography } from '@taskly/ui'
import { isAxiosError } from 'axios'
import classNames from 'classnames'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSignIn } from '../auth.api'
import styles from './SignInPage.module.css'

const SignInPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  const { mutateAsync: signIn } = useSignIn()

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<SignInParams>({
    mode: 'onChange',
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: 'demo@company-demo.com',
      password: 'password',
    },
  })

  const onSubmit = async (data: SignInParams) => {
    try {
      const response = await signIn(data)
      if (response.success) {
        setUser(response.user)
        setTimeout(() => {
          router.push('/')
        }, 2000)
      }
    } catch (error) {
      if (isAxiosError(error)) {
        setError('email', {
          type: 'manual',
          message: error.response?.data.message || 'Something went wrong',
        })
      }
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full sm:w-96">
        <Card
          className={classNames('overflow-hidden', styles.animatedCard, {
            [styles.animatedCardLoading]: !!user,
          })}
        >
          <div className={styles.welcome}>
            <div className="text-5xl">
              <Icon name="check" />
            </div>
            <div className="text-xl">Welcome {user?.username}!</div>
          </div>
          <div className={styles.form}>
            <Typography
              as="h1"
              className="text-center border-b border-b-gray-200 pb-4 mb-4"
            >
              Sign in
            </Typography>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col relative"
            >
              <FormField label="Email" errorMessage={errors.email?.message}>
                <Field type="email" {...register('email')} />
              </FormField>
              <FormField label="Password">
                <Field type="password" {...register('password')} />
              </FormField>
              <Button type="submit" variant="primary">
                Sign in
              </Button>
            </form>
            <div className="bg-sky-100 text-sm p-2 mt-4 rounded-md">
              You can use the following credentials to sign in:
              <p>
                Email: <code>demo@company-demo.com</code>
                <br />
                Password: <code>password</code>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SignInPage
