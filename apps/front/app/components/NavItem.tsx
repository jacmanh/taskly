'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { Button, cn } from '@taskly/design-system';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  href: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  actionIcon?: ReactNode;
  actionAriaLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
}

export function NavItem({
  href,
  icon,
  children,
  className,
  actionIcon,
  actionAriaLabel,
  onAction,
  actionDisabled = false,
}: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const hasAction = typeof onAction === 'function' && actionIcon;

  return (
    <li>
      <div
        className={cn(
          'sidebar-nav-item',
          isActive && 'active',
          hasAction && 'gap-2',
          className
        )}
      >
        <Link href={href} className="flex items-center gap-3 flex-1 min-w-0">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span className="truncate">{children}</span>
        </Link>

        {hasAction && (
          <Button
            aria-label={actionAriaLabel}
            onClick={onAction}
            disabled={actionDisabled}
            variant="subtle"
            size="icon"
            className={cn(
              'shrink-0 border-none shadow-none',
              isActive
                ? 'bg-white/70 text-accent-700 hover:bg-white'
                : 'text-neutral-500 hover:bg-neutral-100'
            )}
          >
            {actionIcon}
          </Button>
        )}
      </div>
    </li>
  );
}
