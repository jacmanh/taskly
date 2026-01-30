import { axiosInstance } from '@taskly/data-access';

export interface GeneratedTask {
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

interface GenerateTasksInput {
  projectId: string;
  prompt: string;
}

export const aiService = {
  async generateTasks(
    workspaceId: string,
    input: GenerateTasksInput
  ): Promise<GeneratedTask[]> {
    const { data } = await axiosInstance.post<GeneratedTask[]>(
      `/workspaces/${workspaceId}/ai/generate-tasks`,
      input
    );
    return data;
  },
};
