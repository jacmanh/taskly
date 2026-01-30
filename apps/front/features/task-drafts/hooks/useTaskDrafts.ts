import {
  useSuspenseQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import type { TaskDraftBatch, UpdateTaskDraftItemInput } from '@taskly/types';
import { taskDraftsService } from '../services/task-drafts.service';
import { taskDraftsQueryKeys } from '../constants/query-keys';
import { tasksQueryKeys } from '../../tasks/constants/query-keys';

export function useSuspenseProjectDraftBatches(
  workspaceId: string,
  projectId: string
) {
  return useSuspenseQuery<TaskDraftBatch[]>({
    queryKey: taskDraftsQueryKeys.project(projectId),
    queryFn: () =>
      taskDraftsService.getBatchesByProject(workspaceId, projectId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDraftBatch(workspaceId?: string, batchId?: string) {
  return useQuery<TaskDraftBatch>({
    queryKey: batchId
      ? taskDraftsQueryKeys.batch(batchId)
      : ['task-drafts', 'none'],
    queryFn: () =>
      taskDraftsService.getBatchById(workspaceId ?? '', batchId ?? ''),
    enabled: !!workspaceId && !!batchId && batchId !== 'new',
  });
}

interface UpdateDraftItemParams {
  workspaceId: string;
  itemId: string;
  input: UpdateTaskDraftItemInput;
  batchId: string;
}

export function useUpdateDraftItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, itemId, input }: UpdateDraftItemParams) =>
      taskDraftsService.updateItem(workspaceId, itemId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskDraftsQueryKeys.batch(variables.batchId),
      });
    },
  });
}

interface AcceptBatchParams {
  workspaceId: string;
  batchId: string;
  projectId: string;
}

export function useAcceptBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, batchId }: AcceptBatchParams) =>
      taskDraftsService.acceptBatch(workspaceId, batchId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskDraftsQueryKeys.batch(variables.batchId),
      });
      queryClient.invalidateQueries({
        queryKey: taskDraftsQueryKeys.project(variables.projectId),
      });
      queryClient.invalidateQueries({
        queryKey: tasksQueryKeys.project(variables.projectId),
      });
    },
  });
}

interface CancelBatchParams {
  workspaceId: string;
  batchId: string;
  projectId: string;
}

export function useCancelBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, batchId }: CancelBatchParams) =>
      taskDraftsService.cancelBatch(workspaceId, batchId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskDraftsQueryKeys.batch(variables.batchId),
      });
      queryClient.invalidateQueries({
        queryKey: taskDraftsQueryKeys.project(variables.projectId),
      });
    },
  });
}
