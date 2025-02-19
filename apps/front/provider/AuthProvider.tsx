'use client'

import { User } from '@prisma/client'
import { createContext, PropsWithChildren } from 'react'

type AuthUser = Omit<User, 'password'>
export const AuthContext = createContext<AuthUser | undefined>(undefined)

type AuthProviderProps = PropsWithChildren<{
  user?: AuthUser
}>

export const AuthProvider = ({ user, children }: AuthProviderProps) => {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}
