'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronDown, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Spinner,
} from '@taskly/design-system';
import { useCurrentWorkspace } from '../hooks/useCurrentWorkspace';
import { useCreateWorkspaceDrawer } from '../hooks/useCreateWorkspaceDrawer';

export function WorkspaceDropdown() {
  const [mounted, setMounted] = useState(false);
  const { currentWorkspace, workspaces, setCurrentWorkspace, isLoading } =
    useCurrentWorkspace();
  const { openCreateDrawer } = useCreateWorkspaceDrawer();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2">
        <Spinner size="sm" />
        <span className="text-sm text-neutral-500">Loading...</span>
      </div>
    );
  }

  if (!currentWorkspace) {
    return (
      <button
        onClick={openCreateDrawer}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
      >
        <span>No workspace</span>
        <Plus size={16} />
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {currentWorkspace.icon && (
            <span className="text-base flex-shrink-0">
              {currentWorkspace.icon}
            </span>
          )}
          <span className="truncate">{currentWorkspace.name}</span>
        </div>
        <ChevronDown size={16} className="flex-shrink-0 text-neutral-500" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Your Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {workspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onClick={() => setCurrentWorkspace(workspace)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {workspace.icon && (
                <span className="text-base flex-shrink-0">
                  {workspace.icon}
                </span>
              )}
              <span className="truncate">{workspace.name}</span>
            </div>
            {currentWorkspace.id === workspace.id && (
              <Check size={16} className="text-accent-600 flex-shrink-0" />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={openCreateDrawer}
          className="flex items-center gap-2 text-accent-600 cursor-pointer"
        >
          <Plus size={16} />
          <span>Create workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
