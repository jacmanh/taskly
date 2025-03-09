import { ToastProvider } from '@app/front/provider/ToastProvider'
import React from 'react'
import ReactQueryProvider from '../provider/ReactQueryProvider'
import { GoogleAnalytics } from '../components/GoogleAnalytics'
import { PageTracker } from '../components/PageTracker'

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
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

  return (
    <ReactQueryProvider>
      <html lang="en">
        <head>
          <GoogleAnalytics measurementId={gaId} />
        </head>
        <body>
          <PageTracker />
          <ToastProvider>{children}</ToastProvider>
        </body>
      </html>
    </ReactQueryProvider>
  )
}
