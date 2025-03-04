'use client'

import {
  flip,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react'
import { cloneElement, PropsWithChildren, ReactElement, useState } from 'react'

type DropdownProps = PropsWithChildren<{
  trigger: ReactElement
}>

/**
 * Dropdown component that displays content in a floating panel.
 * Uses floating-ui for positioning and interactions.
 */
export function Dropdown({ children, trigger }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context, placement } = useFloating({
    placement: 'bottom-start',
    middleware: [offset(6), flip(), shift()],
    open: isOpen,
    onOpenChange: setIsOpen,
  })

  const { isMounted, styles } = useTransitionStyles(context, {
    initial: ({ side }) => ({
      transform:
        side === 'top' ? 'translateY(-10px) scaleY(0.95)' : 'translateY(10px) scaleY(0.95)',
      opacity: 0,
    }),
    open: {
      transform: 'translateY(0) scaleY(1)',
      opacity: 1,
      transitionProperty: 'transform, opacity',
      transitionDuration: '150ms', // Reduced from 200ms for faster testing
      transitionTimingFunction: 'ease-out',
    },
    close: {
      transform: placement.startsWith('top')
        ? 'translateY(-10px) scaleY(0.95)'
        : 'translateY(10px) scaleY(0.95)',
      opacity: 0,
      transitionProperty: 'transform, opacity',
      transitionDuration: '100ms', // Reduced from 150ms for faster testing
      transitionTimingFunction: 'ease-in',
    },
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role])

  return (
    <>
      {cloneElement(trigger, {
        ref: refs.setReference,
        ...getReferenceProps(),
      })}
      {isMounted && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              zIndex: 1000, // Ensure dropdown appears above other content
            }}
            {...getFloatingProps()}
          >
            <div
              style={styles}
              className="mt-2 w-48 bg-white shadow-md rounded-md overflow-hidden border border-gray-200"
            >
              {children}
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  )
}
