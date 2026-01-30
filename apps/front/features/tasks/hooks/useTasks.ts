import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
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
  return useQuery<Task[]>({
    queryKey: projectId
      ? tasksQueryKeys.project(projectId)
      : tasksQueryKeys.workspace(workspaceId ?? ''),
    queryFn: () =>
      tasksService.getByWorkspace(workspaceId ?? '', { projectId }),
    enabled: !!workspaceId && !!projectId,
  });
}

export function useSuspenseProjectTasks(
  workspaceId: string,
  projectId: string
) {
  return useSuspenseQuery<Task[]>({
    queryKey: tasksQueryKeys.project(projectId),
    queryFn: () => tasksService.getByWorkspace(workspaceId, { projectId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useWorkspaceTasks(
  workspaceId?: string,
  filters?: GetTasksFilters
) {
  return useQuery<Task[]>({
    queryKey: filters?.projectId
      ? tasksQueryKeys.project(filters.projectId)
      : tasksQueryKeys.workspace(workspaceId),
    queryFn: () => tasksService.getByWorkspace(workspaceId ?? '', filters),
    enabled: !!workspaceId,
  });
}

export function useTask(workspaceId?: string, taskId?: string) {
  return useQuery<Task>({
    queryKey: taskId ? tasksQueryKeys.detail(taskId) : ['tasks', 'none'],
    queryFn: () => tasksService.getById(workspaceId ?? '', taskId ?? ''),
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

interface CreateManyTasksMutationParams {
  workspaceId: string;
  inputs: CreateTaskInput[];
}

export function useCreateManyTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, inputs }: CreateManyTasksMutationParams) =>
      tasksService.createMany(workspaceId, inputs),
    onSuccess: (tasks) => {
      if (tasks.length > 0) {
        // Invalidate project and workspace queries
        queryClient.invalidateQueries({
          queryKey: tasksQueryKeys.project(tasks[0].projectId),
        });
        queryClient.invalidateQueries({
          queryKey: tasksQueryKeys.workspace(tasks[0].project.workspaceId),
        });
      }
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
    onMutate: async ({ taskId, input }) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: tasksQueryKeys.detail(taskId),
      });

      // Snapshot previous value for rollback
      const previousTask = queryClient.getQueryData<Task>(
        tasksQueryKeys.detail(taskId)
      );

      // Optimistically update the task detail cache
      if (previousTask) {
        // Convert date strings back to Date objects to maintain cache type integrity
        const processedInput = { ...input };
        if (
          processedInput.dueDate &&
          typeof processedInput.dueDate === 'string'
        ) {
          processedInput.dueDate = new Date(processedInput.dueDate) as any;
        }

        queryClient.setQueryData<Task>(tasksQueryKeys.detail(taskId), {
          ...previousTask,
          ...processedInput,
          updatedAt: new Date(),
        });
      }

      return { previousTask };
    },
    onError: (_err, { taskId }, context) => {
      // Rollback to previous value on error
      if (context?.previousTask) {
        queryClient.setQueryData(
          tasksQueryKeys.detail(taskId),
          context.previousTask
        );
      }
    },
    onSettled: (task) => {
      // Always refetch after mutation to ensure server state
      if (task) {
        queryClient.invalidateQueries({
          queryKey: tasksQueryKeys.detail(task.id),
        });
        queryClient.invalidateQueries({
          queryKey: tasksQueryKeys.project(task.projectId),
        });
      }
    },
  });
}

interface DeleteTaskMutationParams {
  workspaceId: string;
  taskId: string;
  projectId: string;
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, taskId }: DeleteTaskMutationParams) =>
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
