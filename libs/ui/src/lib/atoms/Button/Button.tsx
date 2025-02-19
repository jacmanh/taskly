import classNames from 'classnames'
import { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import styles from './Button.module.css'

type ButtonProps = PropsWithChildren<
  {
    variant?: 'primary' | 'secondary'
  } & ButtonHTMLAttributes<HTMLButtonElement>
>

export const Button = ({ variant, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={classNames(
        styles.button,
        {
          [styles.buttonPrimary]: variant === 'primary',
          [styles.buttonSecondary]: variant === 'secondary',
        },
        props.className
      )}
    />
  )
}
