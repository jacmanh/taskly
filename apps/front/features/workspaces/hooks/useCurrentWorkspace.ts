import { useWorkspaceContext } from '../contexts/WorkspaceContext';

/**
 * Hook to access the currently selected workspace
 * @returns The current workspace context
 */
export function useCurrentWorkspace() {
  return useWorkspaceContext();
}
