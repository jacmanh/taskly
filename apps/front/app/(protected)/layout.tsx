import { Navbar } from '@app/front/components/Navbar/Navbar'
import { HttpService } from '@app/front/core/httpService'
import { AuthProvider } from '@app/front/provider/AuthProvider'
import { User } from '@prisma/client'
import { Typography } from '@taskly/ui'
import { getCookie } from 'cookies-next/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'
import './layout.css'

const fetchUser = async () => {
  try {
    const token = await getCookie('auth_token', { cookies })
    if (!token) {
      return undefined
    }

    return await HttpService.get<User>(`${process.env.NEXT_PUBLIC_API_URL}/api/user/me`, {
      Cookie: `auth_token=${token}`,
    })
  } catch (error) {
    console.log(error)
    return undefined
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await fetchUser()

  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <AuthProvider user={user}>
      <div className="app-layout flex mb-0 rounded-md border-2 border-white">
        <aside className="flex flex-col w-1/6 max-w-52 py-2">
          <div className="flex items-center p-2">
            <Typography as="h3" className="italic">
              Taskly
            </Typography>
          </div>
          <Navbar />
        </aside>
        <main className="w-full p-2">
          <div className="w-full h-full bg-white rounded-md border border-gray-200">{children}</div>
        </main>
      </div>
    </AuthProvider>
  )
}
