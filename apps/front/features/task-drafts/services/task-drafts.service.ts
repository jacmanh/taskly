import { axiosInstance } from '@taskly/data-access';
import type {
  TaskDraftBatch,
  TaskDraftItem,
  UpdateTaskDraftItemInput,
} from '@taskly/types';

export const taskDraftsService = {
  async getBatchesByProject(
    workspaceId: string,
    projectId: string,
  ): Promise<TaskDraftBatch[]> {
    const { data } = await axiosInstance.get<TaskDraftBatch[]>(
      `/workspaces/${workspaceId}/task-drafts?projectId=${projectId}`,
    );
    return data;
  },

  async getBatchById(
    workspaceId: string,
    batchId: string,
  ): Promise<TaskDraftBatch> {
    const { data } = await axiosInstance.get<TaskDraftBatch>(
      `/workspaces/${workspaceId}/task-drafts/${batchId}`,
    );
    return data;
  },

  async updateItem(
    workspaceId: string,
    itemId: string,
    input: UpdateTaskDraftItemInput,
  ): Promise<TaskDraftItem> {
    const { data } = await axiosInstance.patch<TaskDraftItem>(
      `/workspaces/${workspaceId}/task-drafts/items/${itemId}`,
      input,
    );
    return data;
  },

  async acceptBatch(
    workspaceId: string,
    batchId: string,
  ): Promise<{ accepted: boolean; tasksCreated: number }> {
    const { data } = await axiosInstance.post(
      `/workspaces/${workspaceId}/task-drafts/${batchId}/accept`,
    );
    return data;
  },

  async cancelBatch(
    workspaceId: string,
    batchId: string,
  ): Promise<{ cancelled: boolean }> {
    const { data } = await axiosInstance.post(
      `/workspaces/${workspaceId}/task-drafts/${batchId}/cancel`,
    );
    return data;
  },
};
