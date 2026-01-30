import { axiosInstance } from '@taskly/data-access';
import type { TaskDraftBatch } from '@taskly/types';

interface GenerateTasksInput {
  projectId: string;
  prompt: string;
}

export const aiService = {
  async generateTasks(
    workspaceId: string,
    input: GenerateTasksInput,
  ): Promise<TaskDraftBatch> {
    const { data } = await axiosInstance.post<TaskDraftBatch>(
      `/workspaces/${workspaceId}/ai/generate-tasks`,
      input,
    );
    return data;
  },

  async regenerateBatch(
    workspaceId: string,
    batchId: string,
    input: GenerateTasksInput,
  ): Promise<TaskDraftBatch> {
    const { data } = await axiosInstance.post<TaskDraftBatch>(
      `/workspaces/${workspaceId}/ai/generate-tasks/${batchId}/regenerate`,
      input,
    );
    return data;
  },
};
