import classNames from 'classnames'
import { PropsWithChildren } from 'react'
import { Icon } from '../../atoms/Icon/Icon'
import { useModal } from './ModalProvider'

type ModalHeaderProps = PropsWithChildren<{
  displayCloseButton?: boolean
  className?: string
}>

export const ModalHeader = ({
  children,
  className,
  displayCloseButton = true,
}: ModalHeaderProps) => {
  const { closeModal: handleModalClose } = useModal()

  return (
    <div className={classNames('flex items-center justify-between font-bold text-xl', className)}>
      {children}
      {displayCloseButton && (
        <button
          type="button"
          aria-label="Close"
          className="text-gray-500 hover:text-gray-700"
          onClick={handleModalClose}
        >
          <Icon name="close" />
        </button>
      )}
    </div>
  )
}
