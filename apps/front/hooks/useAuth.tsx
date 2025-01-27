'use client'

import { AuthContext } from '@app/front/provider/AuthProvider'
import { useContext } from 'react'

export const useAuth = () => {
  return useContext(AuthContext)
}
