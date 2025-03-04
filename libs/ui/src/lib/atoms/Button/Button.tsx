import classNames from 'classnames'
import { ButtonHTMLAttributes, forwardRef, PropsWithChildren } from 'react'
import styles from './Button.module.css'

type ButtonProps = PropsWithChildren<
  {
    variant?: 'primary' | 'secondary'
  } & ButtonHTMLAttributes<HTMLButtonElement>
>

export const Button = forwardRef(
  ({ variant, ...props }: ButtonProps, ref: React.Ref<HTMLButtonElement>) => {
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
        ref={ref}
      />
    )
  }
)
