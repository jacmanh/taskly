import classNames from 'classnames'
import { InputHTMLAttributes, PropsWithChildren } from 'react'

type FormFieldProps = PropsWithChildren<
  {
    label: string
    inline?: boolean
    errorMessage?: string
    hint?: string
  } & InputHTMLAttributes<HTMLInputElement>
>

export const FormField = ({
  inline,
  label,
  errorMessage,
  hint,
  children,
}: FormFieldProps) => {
  return (
    <div className="mb-4">
      <label
        className={classNames('flex gap-2', {
          'flex-row': inline,
          'flex-col': !inline,
          '[&>input]:border-red-500': errorMessage,
        })}
      >
        {label}
        {children}
      </label>
      {hint && <p className="text-gray-500 text-xs mt-1">{hint}</p>}
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  )
}
