import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import type {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from '@taskly/types';
import { projectsQueryKeys } from '../constants/query-keys';
import { projectsService } from '../services/projects.service';

export interface CreateProjectMutationParams {
  workspaceId: string;
  input: CreateProjectInput;
}

export interface UpdateProjectMutationParams {
  workspaceId: string;
  projectId: string;
  input: UpdateProjectInput;
}

export interface DeleteProjectMutationParams {
  projectId: string;
  workspaceId: string;
}

/**
 * Fetch projects that belong to the provided workspace id
 */
export function useWorkspaceProjects(workspaceId?: string) {
  return useQuery<Project[]>({
    queryKey: workspaceId
      ? projectsQueryKeys.workspace(workspaceId)
      : projectsQueryKeys.list(),
    queryFn: () => projectsService.getByWorkspace(workspaceId as string),
    enabled: !!workspaceId,
  });
}

export function useSuspenseWorkspaceProjects(workspaceId: string) {
  return useSuspenseQuery<Project[]>({
    queryKey: projectsQueryKeys.workspace(workspaceId),
    queryFn: () => projectsService.getByWorkspace(workspaceId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Create project hook tied to react-query cache
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, input }: CreateProjectMutationParams) =>
      projectsService.create(workspaceId, input),
    onSuccess: (project) => {
      queryClient.invalidateQueries({
        queryKey: projectsQueryKeys.workspace(project.workspaceId),
      });
    },
  });
}

/**
 * Update project hook tied to react-query cache
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      input,
    }: UpdateProjectMutationParams) =>
      projectsService.update(workspaceId, projectId, input),
    onSuccess: (project) => {
      queryClient.invalidateQueries({
        queryKey: projectsQueryKeys.workspace(project.workspaceId),
      });
    },
  });
}

/**
 * Delete project hook tied to react-query cache
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, workspaceId }: DeleteProjectMutationParams) =>
      projectsService.delete(workspaceId, projectId),
    onSuccess: (_data, { workspaceId }) => {
      queryClient.invalidateQueries({
        queryKey: projectsQueryKeys.workspace(workspaceId),
      });
    },
  });
}
