import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})
export type SignInParams = z.infer<typeof signInSchema>

export const signUpSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(8),
})
export type SignUpParams = z.infer<typeof signUpSchema>
