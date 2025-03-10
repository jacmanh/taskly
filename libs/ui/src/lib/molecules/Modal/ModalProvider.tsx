'use client'

import {
  FloatingFocusManager,
  FloatingOverlay,
  useDismiss,
  useFloating,
  useInteractions,
  useTransitionStyles,
} from '@floating-ui/react'
import { createContext, ReactNode, useContext, useState } from 'react'

type ModalContextType = {
  openModal: (content: ReactNode) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [modalContent, setModalContent] = useState<ReactNode | null>(null)

  const handleOpenModal = (content: ReactNode) => {
    setIsOpen(true)
    setModalContent(content)
  }

  const handleModalClose = () => {
    setIsOpen(false)
    setModalContent(null)
  }

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  })

  const dismiss = useDismiss(context, {
    escapeKey: true,
    outsidePressEvent: 'mousedown',
  })

  const { getFloatingProps } = useInteractions([dismiss])

  const { isMounted, styles } = useTransitionStyles(context, {
    initial: { opacity: 0, transform: 'scale(0.95)' },
    open: { opacity: 1, transform: 'scale(1)' },
    close: { opacity: 0, transform: 'scale(0.95)' },
  })

  return (
    <ModalContext.Provider value={{ openModal: handleOpenModal, closeModal: handleModalClose }}>
      {children}
      {isMounted && (
        <FloatingOverlay
          lockScroll
          className="fixed inset-0 flex items-center justify-center bg-black/50"
        >
          <FloatingFocusManager context={context}>
            <div
              ref={refs.setFloating}
              {...getFloatingProps()}
              className="bg-white rounded shadow-lg outline-none"
              onClick={(e) => e.stopPropagation()}
              style={styles}
            >
              {modalContent}
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}
