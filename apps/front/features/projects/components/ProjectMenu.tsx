'use client';

import type { ReactNode } from 'react';
import type { Project, Workspace } from '@taskly/types';
import { Button, Spinner, cn } from '@taskly/design-system';
import { Plus, FolderKanban } from 'lucide-react';
import { ProjectNavItem } from './ProjectNavItem';
import { useCreateProjectDrawer } from '../hooks/useCreateProjectDrawer';
import { usePathname } from 'next/navigation';

interface ProjectMenuProps {
  projects: Project[];
  projectsLoading: boolean;
  projectsError: boolean;
  workspace?: Workspace | null;
  isLoading: boolean;
}

export function ProjectMenu({
  projects,
  projectsLoading,
  projectsError,
  workspace,
  isLoading,
}: ProjectMenuProps) {
  const pathname = usePathname();
  const { openCreateProjectDrawer } = useCreateProjectDrawer();
  const workspaceId = workspace?.id;
  const isProjectsLinkActive = workspace?.slug
    ? pathname.startsWith(`/${workspace.slug}`)
    : false;

  const handleCreateProject = () => {
    if (!workspaceId) return;
    openCreateProjectDrawer(workspaceId);
  };

  const handleEditProject = (project: Project) => {
    console.log('Edit project', project.id);
  };

  const handleDeleteProject = (project: Project) => {
    console.log('Delete project', project.id);
  };

  let content: ReactNode = null;

  if (isLoading) {
    content = (
      <div className="flex items-center gap-2 -mx-3 px-3 py-2 text-xs text-neutral-500 rounded-lg">
        <Spinner size="sm" />
        <span>Loading workspace...</span>
      </div>
    );
  } else if (!workspaceId) {
    content = (
      <div className="-mx-3 px-3 py-2 text-xs text-neutral-500 rounded-lg">
        Select a workspace to see its projects.
      </div>
    );
  } else if (projectsLoading) {
    content = (
      <div className="flex items-center gap-2 -mx-3 px-3 py-2 text-xs text-neutral-500 rounded-lg">
        <Spinner size="sm" />
        <span>Loading projects...</span>
      </div>
    );
  } else if (projectsError) {
    content = (
      <div className="-mx-3 px-3 py-2 text-xs text-red-600 rounded-lg bg-red-50 border border-red-100">
        Unable to load projects. Please try again.
      </div>
    );
  } else if (projects.length === 0) {
    content = (
      <div className="-mx-3 px-3 py-2 text-xs text-neutral-500 rounded-lg">
        No projects in this workspace yet.
      </div>
    );
  } else {
    content = (
      <ul className="space-y-1">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectNavItem
              project={project}
              workspace={workspace}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
              className="pl-6"
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section aria-label="Projects menu" className="space-y-2">
      <div
        className={cn(
          'sidebar-nav-item gap-2',
          isProjectsLinkActive && 'bg-accent-100 text-accent-700'
        )}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <FolderKanban size={18} className="flex-shrink-0" />
          <span className="truncate">Projects</span>
        </div>

        <Button
          aria-label="Create project"
          onClick={handleCreateProject}
          disabled={!workspaceId || isLoading}
          variant="subtle"
          size="icon"
          className="shrink-0 border-none shadow-none"
        >
          <Plus size={16} />
        </Button>
      </div>

      <div className="space-y-1">{content}</div>
    </section>
  );
}
