import classNames from 'classnames'
import React, { PropsWithChildren } from 'react'

type CardProps = PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>

export const Card = ({ children, ...props }: CardProps) => {
  return (
    <div
      {...props}
      className={classNames(
        'bg-white p-4 m-auto shadow shadow-gray-200 rounded-md border border-gray-200',
        props.className
      )}
    >
      {children}
    </div>
  )
}
