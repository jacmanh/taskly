'use client'

import { useAuth } from '@app/front/hooks/useAuth'

export default function Index() {
  const user = useAuth()

  return <div>Hello {user?.username}!</div>
}
