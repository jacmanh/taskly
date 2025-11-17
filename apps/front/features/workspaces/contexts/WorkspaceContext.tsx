'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { Workspace } from '@taskly/types';
import { useWorkspaces } from '../hooks/useWorkspaces';

interface WorkspaceContextValue {
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  workspaces: Workspace[];
  isLoading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(
  undefined
);

const STORAGE_KEY = 'taskly_current_workspace_id';

interface WorkspaceProviderProps {
  children: ReactNode;
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const { data: workspaces = [], isLoading } = useWorkspaces();
  const [currentWorkspace, setCurrentWorkspaceState] =
    useState<Workspace | null>(null);

  // Load workspace from localStorage on mount
  useEffect(() => {
    if (isLoading || workspaces.length === 0) return;

    const savedWorkspaceId =
      typeof window !== 'undefined'
        ? localStorage.getItem(STORAGE_KEY)
        : null;

    if (savedWorkspaceId) {
      const saved = workspaces.find((w) => w.id === savedWorkspaceId);
      if (saved) {
        setCurrentWorkspaceState(saved);
        return;
      }
    }

    // Default to first workspace if none selected
    if (workspaces.length > 0 && !currentWorkspace) {
      setCurrentWorkspaceState(workspaces[0]);
    }
  }, [workspaces, isLoading, currentWorkspace]);

  // Save to localStorage when workspace changes
  const setCurrentWorkspace = (workspace: Workspace | null) => {
    setCurrentWorkspaceState(workspace);
    if (typeof window !== 'undefined') {
      if (workspace) {
        localStorage.setItem(STORAGE_KEY, workspace.id);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        setCurrentWorkspace,
        workspaces,
        isLoading,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error(
      'useWorkspaceContext must be used within a WorkspaceProvider'
    );
  }
  return context;
}
