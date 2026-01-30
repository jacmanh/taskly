import { useMutation } from '@tanstack/react-query';
import { aiService } from '../services/ai.service';

interface GenerateTasksParams {
  workspaceId: string;
  projectId: string;
  prompt: string;
}

export function useGenerateTasks() {
  return useMutation({
    mutationFn: ({ workspaceId, projectId, prompt }: GenerateTasksParams) =>
      aiService.generateTasks(workspaceId, { projectId, prompt }),
  });
}
