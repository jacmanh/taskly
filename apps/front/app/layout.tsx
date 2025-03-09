import { ToastProvider } from '@app/front/provider/ToastProvider'
import React from 'react'
import ReactQueryProvider from '../provider/ReactQueryProvider'
import { GoogleAnalytics } from '../components/GoogleAnalytics'

export const metadata = {
  title: "Taskly'n Hutch",
  description:
    'This project is an experiment in combining technology, creativity, and structure to simulate the development of a startup.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ReactQueryProvider>
      <html lang="en">
        <head>
          <GoogleAnalytics />
        </head>
        <body>
          <ToastProvider>{children}</ToastProvider>
        </body>
      </html>
    </ReactQueryProvider>
  )
}
