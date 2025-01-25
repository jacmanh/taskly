'use client'

import { User } from '@prisma/client'
import { createContext, PropsWithChildren } from 'react'
import { useGetMe } from '../../(protected)/user/user.api'

export const AuthContext = createContext<User | undefined>(undefined)

type AuthProviderProps = PropsWithChildren<unknown>

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { data: user } = useGetMe()

  console.log(user)
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}
