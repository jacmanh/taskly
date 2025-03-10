import classNames from 'classnames'

export const ModalFooter = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={classNames('p-2 border-t', className)}>{children}</div>
}
