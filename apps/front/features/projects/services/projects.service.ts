import type {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from '@taskly/types';
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

  /**
   * Update a project
   */
  async update(
    workspaceId: string,
    projectId: string,
    input: UpdateProjectInput
  ): Promise<Project> {
    const { data } = await axiosInstance.patch<Project>(
      `/workspaces/${workspaceId}/projects/${projectId}`,
      input
    );

    return data;
  },

  /**
   * Delete a project
   */
  async delete(workspaceId: string, projectId: string): Promise<void> {
    await axiosInstance.delete(
      `/workspaces/${workspaceId}/projects/${projectId}`
    );
  },
};
