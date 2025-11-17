'use client';

import { Home, Zap } from 'lucide-react';
import { NavItem } from './NavItem';
import { WorkspaceDropdown } from '@features/workspaces/components/WorkspaceDropdown';
import { WorkspaceSettingsDropdown } from '@features/workspaces/components/WorkspaceSettingsDropdown';
import { useAuth } from '@features/auth/hooks/useAuth';
import { useCurrentWorkspace } from '@features/workspaces/hooks/useCurrentWorkspace';
import { useWorkspaceProjects } from '@features/projects/hooks/useProjects';
import { ProjectMenu } from '@features/projects/components/ProjectMenu';

export function Sidebar() {
  const { user } = useAuth();
  const { currentWorkspace, isLoading: workspaceLoading } =
    useCurrentWorkspace();
  const {
    data: projects = [],
    isLoading: projectsLoading,
    isError: projectsError,
  } = useWorkspaceProjects(currentWorkspace?.id);

  return (
    <aside className="w-64 h-screen bg-neutral-50 border-r border-neutral-200 flex flex-col">
      {/* Header: Logo */}
      <div className="h-16 flex items-center px-4 border-b border-neutral-200">
        <h1 className="text-xl font-bold text-neutral-900">Taskly</h1>
      </div>

      {/* Workspace Dropdown */}
      <div className="px-3 py-3 border-b border-neutral-200">
        <WorkspaceDropdown />
      </div>

      {/* Scrollable Navigation Content */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        <ul className="space-y-1">
          <NavItem href="/dashboard" icon={<Home size={18} />}>
            Dashboard
          </NavItem>
        </ul>

        <div className="pt-4 pb-2">
          <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Workspace
          </h3>
        </div>

        <ProjectMenu
          projects={projects}
          projectsLoading={projectsLoading}
          projectsError={projectsError}
          workspace={currentWorkspace}
          isLoading={workspaceLoading}
        />

        <ul className="space-y-1">
          <NavItem href="/sprints" icon={<Zap size={18} />}>
            Sprints
          </NavItem>
        </ul>
      </nav>

      {/* Footer: Settings & User */}
      <div className="border-t border-neutral-200 px-3 py-3 space-y-2">
        <WorkspaceSettingsDropdown />

        {user && (
          <div className="px-3 py-2 text-xs text-neutral-500 truncate">
            {user.email}
          </div>
        )}
      </div>
    </aside>
  );
}
