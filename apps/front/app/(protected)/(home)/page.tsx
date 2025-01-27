'use client'

import { useLogout } from '@app/front/app/(public)/auth/auth.api'
import { useAuth } from '@app/front/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function Index() {
  const user = useAuth()
  const router = useRouter()
  const { mutateAsync: logOut } = useLogout()

  const handleLogOut = async () => {
    await logOut()
    router.push('/auth/signin')
  }

  return (
    <div>
      Hello {user?.username}! <button onClick={handleLogOut}>Logout</button>{' '}
    </div>
  )
}
