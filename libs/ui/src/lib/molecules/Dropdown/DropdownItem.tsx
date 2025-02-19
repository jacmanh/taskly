import { PropsWithChildren } from 'react'

type DropdownItemProps = PropsWithChildren<{
  onClick?: () => void
}>

export function DropdownItem({ children, onClick }: DropdownItemProps) {
  return (
    <div
      onClick={onClick}
      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
    >
      {children}
    </div>
  )
}
