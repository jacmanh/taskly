import React from 'react'

type TypographyProps = {
  as?: React.ElementType
  children: React.ReactNode
} & React.HTMLAttributes<HTMLElement>

export const Typography = ({
  as: Component = 'p',
  children,
  ...props
}: TypographyProps) => {
  return <Component {...props}>{children}</Component>
}
