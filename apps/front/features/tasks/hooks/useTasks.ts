import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useProtectedQuery, useProtectedSuspenseQuery } from '@features/auth/hooks/useProtectedQuery';
import type { Task, CreateTaskInput, UpdateTaskInput } from '@taskly/types';
import { tasksService } from '../services/tasks.service';
import { tasksQueryKeys } from '../constants/query-keys';

interface GetTasksFilters {
  projectId?: string;
  sprintId?: string;
  assignedToId?: string;
  status?: string;
  priority?: string;
  includeArchived?: boolean;
}

export function useProjectTasks(workspaceId?: string, projectId?: string) {
  return useProtectedQuery<Task[]>({
    queryKey: projectId
      ? tasksQueryKeys.project(projectId)
      : tasksQueryKeys.workspace(workspaceId!),
    queryFn: () => tasksService.getByWorkspace(workspaceId!, { projectId }),
    enabled: !!workspaceId && !!projectId,
  });
}

export function useSuspenseProjectTasks(workspaceId: string, projectId: string) {
  return useProtectedSuspenseQuery<Task[]>({
    queryKey: tasksQueryKeys.project(projectId),
    queryFn: () => tasksService.getByWorkspace(workspaceId, { projectId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useWorkspaceTasks(
  workspaceId?: string,
  filters?: GetTasksFilters
) {
  return useProtectedQuery<Task[]>({
    queryKey: filters?.projectId
      ? tasksQueryKeys.project(filters.projectId)
      : tasksQueryKeys.workspace(workspaceId!),
    queryFn: () => tasksService.getByWorkspace(workspaceId!, filters),
    enabled: !!workspaceId,
  });
}

export function useTask(workspaceId?: string, taskId?: string) {
  return useProtectedQuery<Task>({
    queryKey: taskId ? tasksQueryKeys.detail(taskId) : ['tasks', 'none'],
    queryFn: () => tasksService.getById(workspaceId!, taskId!),
    enabled: !!workspaceId && !!taskId,
  });
}

interface CreateTaskMutationParams {
  workspaceId: string;
  input: CreateTaskInput;
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, input }: CreateTaskMutationParams) =>
      tasksService.create(workspaceId, input),
    onSuccess: (task) => {
      queryClient.invalidateQueries({
        queryKey: tasksQueryKeys.project(task.projectId),
      });
      queryClient.invalidateQueries({
        queryKey: tasksQueryKeys.workspace(task.project.workspaceId),
      });
    },
  });
}

interface UpdateTaskMutationParams {
  workspaceId: string;
  taskId: string;
  input: UpdateTaskInput;
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, taskId, input }: UpdateTaskMutationParams) =>
      tasksService.update(workspaceId, taskId, input),
    onSuccess: (task) => {
      queryClient.invalidateQueries({
        queryKey: tasksQueryKeys.project(task.projectId),
      });
      queryClient.invalidateQueries({
        queryKey: tasksQueryKeys.detail(task.id),
      });
    },
  });
}

interface ArchiveTaskMutationParams {
  workspaceId: string;
  taskId: string;
  projectId: string;
}

export function useArchiveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, taskId }: ArchiveTaskMutationParams) =>
      tasksService.delete(workspaceId, taskId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: tasksQueryKeys.project(variables.projectId),
      });
      queryClient.invalidateQueries({
        queryKey: tasksQueryKeys.workspace(variables.workspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: tasksQueryKeys.detail(variables.taskId),
      });
    },
  });
}
