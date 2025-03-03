'use client'

import {
  Avatar,
  Dropdown,
  DropdownItem,
  Icon,
  IconProps,
  Typography,
} from '@taskly/ui'
import classNames from 'classnames'
import Link, { LinkProps } from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { useLogout } from '../../app/(public)/auth/auth.api'
import { useAuth } from '../../hooks/useAuth'
import styles from './Navbar.module.css'

type NavbarItem = {
  name: string
  href: LinkProps<string>['href']
  icon?: IconProps['name']
}

const navbarItems: Array<NavbarItem> = [
  {
    name: 'Dashboard',
    href: '/',
    icon: 'home',
  },
  {
    name: 'Tasks',
    href: '/list',
    icon: 'list',
  },
]

export const Navbar = () => {
  const user = useAuth()
  const currentPath = usePathname()

  const router = useRouter()
  const { mutateAsync: logOut } = useLogout()

  const handleLogOut = async () => {
    await logOut()
    router.push('/auth/signin')
  }

  return (
    <nav className="flex flex-col pl-2 text-gray-800 h-full">
      <ul>
        {navbarItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={classNames(
                'flex items-center mb-2 p-2 gap-2',
                styles.navbarItem,
                {
                  [styles.navbarItemActive]: currentPath === item.href,
                }
              )}
            >
              {item.icon && <Icon name={item.icon} />}
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      <Dropdown
        trigger={
          <button
            className={classNames(
              'flex gap-2 items-center mt-auto p-2',
              styles.navbarItem
            )}
          >
            <Avatar />
            <Typography as="b">{user?.username}</Typography>
          </button>
        }
      >
        <DropdownItem onClick={handleLogOut}>Logout</DropdownItem>
      </Dropdown>
    </nav>
  )
}
