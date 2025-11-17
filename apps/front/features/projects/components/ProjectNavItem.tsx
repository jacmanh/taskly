'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Project, Workspace } from '@taskly/types';
import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@taskly/design-system';
import { MoreHorizontal } from 'lucide-react';
import { useMemo } from 'react';
import { appRoutes } from '../../../lib/routes';

interface ProjectNavItemProps {
  project: Project;
  workspace?: Workspace | null;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  className?: string;
}

export function ProjectNavItem({
  project,
  workspace,
  onEdit,
  onDelete,
  className,
}: ProjectNavItemProps) {
  const pathname = usePathname();

  const indicatorColor = useMemo(
    () => project.color ?? '#a1a1aa',
    [project.color]
  );

  const projectHref =
    workspace?.slug && project.slug
      ? appRoutes.workspaceProject(workspace.slug, project.slug)
      : undefined;

  const isActive = projectHref ? pathname === projectHref : false;

  const linkContent = (
    <>
      <span
        className="h-2 w-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: indicatorColor }}
      />
      <span className="truncate">{project.name}</span>
    </>
  );

  return (
    <div
      className={cn(
        'sidebar-nav-item gap-2 text-neutral-700',
        isActive && 'bg-accent-100 text-accent-700',
        className
      )}
    >
      {projectHref ? (
        <Link
          href={projectHref}
          className="flex ml-3 items-center gap-2 flex-1 min-w-0 text-left"
        >
          {linkContent}
        </Link>
      ) : (
        <div className="flex ml-3 items-center gap-2 flex-1 min-w-0 text-left">
          {linkContent}
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={`Actions pour ${project.name}`}
            variant="ghost"
            size="icon"
            className="text-neutral-500 hover:text-neutral-900"
          >
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuItem onClick={() => onEdit?.(project)}>
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn('text-error-600 focus:text-error-600')}
            onClick={() => onDelete?.(project)}
          >
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
