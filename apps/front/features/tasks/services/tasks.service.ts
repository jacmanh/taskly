import { axiosInstance } from '@features/auth/services/axios';
import type { Task, CreateTaskInput, UpdateTaskInput } from '@taskly/types';

interface GetTasksFilters {
  projectId?: string;
  sprintId?: string;
  assignedToId?: string;
  status?: string;
  priority?: string;
  includeArchived?: boolean;
}

export const tasksService = {
  async getByWorkspace(
    workspaceId: string,
    filters?: GetTasksFilters
  ): Promise<Task[]> {
    const params = new URLSearchParams();

    if (filters?.projectId) {
      params.append('projectId', filters.projectId);
    }
    if (filters?.sprintId) {
      params.append('sprintId', filters.sprintId);
    }
    if (filters?.assignedToId) {
      params.append('assignedToId', filters.assignedToId);
    }
    if (filters?.status) {
      params.append('status', filters.status);
    }
    if (filters?.priority) {
      params.append('priority', filters.priority);
    }
    if (filters?.includeArchived) {
      params.append('includeArchived', String(filters.includeArchived));
    }

    const queryString = params.toString();
    const url = `/workspaces/${workspaceId}/tasks${queryString ? `?${queryString}` : ''}`;

    const { data } = await axiosInstance.get<Task[]>(url);
    return data;
  },

  async getById(workspaceId: string, taskId: string): Promise<Task> {
    const { data } = await axiosInstance.get<Task>(
      `/workspaces/${workspaceId}/tasks/${taskId}`
    );
    return data;
  },

  async create(workspaceId: string, input: CreateTaskInput): Promise<Task> {
    const { data } = await axiosInstance.post<Task>(
      `/workspaces/${workspaceId}/tasks`,
      input
    );
    return data;
  },

  async update(
    workspaceId: string,
    taskId: string,
    input: UpdateTaskInput
  ): Promise<Task> {
    const { data } = await axiosInstance.patch<Task>(
      `/workspaces/${workspaceId}/tasks/${taskId}`,
      input
    );
    return data;
  },

  async delete(workspaceId: string, taskId: string): Promise<void> {
    await axiosInstance.delete(`/workspaces/${workspaceId}/tasks/${taskId}`);
  },
};
