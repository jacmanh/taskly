import React from 'react'
import CheckIcon from './assets/check.svg'
import CloseIcon from './assets/close.svg'
import HomeIcon from './assets/home.svg'
import ListIcon from './assets/list.svg'
import UserIcon from './assets/user.svg'

export const IconList = {
  check: CheckIcon,
  home: HomeIcon,
  list: ListIcon,
  user: UserIcon,
  close: CloseIcon,
}

export type IconProps = {
  name: keyof typeof IconList
} & React.SVGProps<SVGSVGElement>

export const Icon = ({ name, ...props }: IconProps) => {
  const IconComponent = IconList[name]

  if (!IconComponent) {
    return null
  }

  return <IconComponent {...props} />
}
