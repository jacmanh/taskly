import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateWorkspaceInput } from '@taskly/types';
import { workspacesService } from '../services/workspaces.service';
import { workspacesQueryKeys } from '../constants/query-keys';
import { useProtectedQuery } from '@features/auth/hooks/useProtectedQuery';

/**
 * Hook to fetch all workspaces for the current user
 */
export function useWorkspaces() {
  return useProtectedQuery({
    queryKey: workspacesQueryKeys.list(),
    queryFn: () => workspacesService.getMyWorkspaces(),
  });
}

/**
 * Hook to create a new workspace
 */
export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateWorkspaceInput) =>
      workspacesService.createWorkspace(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspacesQueryKeys.all });
    },
  });
}

/**
 * Hook to update a workspace
 */
export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<CreateWorkspaceInput>;
    }) => workspacesService.updateWorkspace(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspacesQueryKeys.all });
    },
  });
}

/**
 * Hook to delete a workspace
 */
export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workspacesService.deleteWorkspace(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspacesQueryKeys.all });
    },
  });
}
