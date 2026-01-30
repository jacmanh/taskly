import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aiService } from '../services/ai.service';
import { taskDraftsQueryKeys } from '../../task-drafts/constants/query-keys';

interface GenerateTasksParams {
  workspaceId: string;
  projectId: string;
  prompt: string;
}

export function useGenerateTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, projectId, prompt }: GenerateTasksParams) =>
      aiService.generateTasks(workspaceId, { projectId, prompt }),
    onSuccess: (batch) => {
      queryClient.invalidateQueries({
        queryKey: taskDraftsQueryKeys.project(batch.projectId),
      });
    },
  });
}

interface RegenerateBatchParams {
  workspaceId: string;
  batchId: string;
  projectId: string;
  prompt: string;
}

export function useRegenerateBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      batchId,
      projectId,
      prompt,
    }: RegenerateBatchParams) =>
      aiService.regenerateBatch(workspaceId, batchId, { projectId, prompt }),
    onSuccess: (batch) => {
      queryClient.invalidateQueries({
        queryKey: taskDraftsQueryKeys.batch(batch.id),
      });
      queryClient.invalidateQueries({
        queryKey: taskDraftsQueryKeys.project(batch.projectId),
      });
    },
  });
}
