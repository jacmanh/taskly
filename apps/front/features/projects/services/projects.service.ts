import type { CreateProjectInput, Project } from '@taskly/types';
import { axiosInstance } from '@features/auth/services/axios';

export const projectsService = {
  /**
   * Get all projects that belong to a specific workspace
   */
  async getByWorkspace(workspaceId: string): Promise<Project[]> {
    const { data } = await axiosInstance.get<Project[]>(
      `/workspaces/${workspaceId}/projects`
    );

    return data;
  },

  /**
   * Create a project within the given workspace
   */
  async create(
    workspaceId: string,
    input: CreateProjectInput
  ): Promise<Project> {
    const { data } = await axiosInstance.post<Project>(
      `/workspaces/${workspaceId}/projects`,
      input
    );

    return data;
  },
};
