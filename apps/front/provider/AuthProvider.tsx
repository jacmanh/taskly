'use client'

import { User } from '@prisma/client'
import { createContext, PropsWithChildren } from 'react'

export const AuthContext = createContext<User | undefined>(undefined)

type AuthProviderProps = PropsWithChildren<{
  user?: User
}>

export const AuthProvider = ({ user, children }: AuthProviderProps) => {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}
