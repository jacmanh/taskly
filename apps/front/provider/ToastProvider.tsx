import { PropsWithChildren } from 'react'
import { ToastContainer } from 'react-toastify'

export const ToastProvider = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <>
      {children}
      <ToastContainer stacked autoClose={2000} />
    </>
  )
}
