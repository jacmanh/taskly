import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateProjectInput, Project } from '@taskly/types';
import { useProtectedQuery } from '@features/auth/hooks/useProtectedQuery';
import { projectsQueryKeys } from '../constants/query-keys';
import { projectsService } from '../services/projects.service';

/**
 * Fetch projects that belong to the provided workspace id
 */
export function useWorkspaceProjects(workspaceId?: string) {
  return useProtectedQuery<Project[]>({
    queryKey: workspaceId
      ? projectsQueryKeys.workspace(workspaceId)
      : projectsQueryKeys.list(),
    queryFn: () => projectsService.getByWorkspace(workspaceId as string),
    enabled: !!workspaceId,
  });
}

/**
 * Create project hook tied to react-query cache
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      input,
    }: {
      workspaceId: string;
      input: CreateProjectInput;
    }) => projectsService.create(workspaceId, input),
    onSuccess: (_project, { workspaceId }) => {
      queryClient.invalidateQueries({
        queryKey: projectsQueryKeys.workspace(workspaceId),
      });
    },
  });
}
