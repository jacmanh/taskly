'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@taskly/design-system';
import type { ReactNode } from 'react';

interface NavItemProps {
  href: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function NavItem({ href, icon, children, className }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        isActive
          ? 'bg-accent-100 text-accent-700'
          : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900',
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </Link>
  );
}
