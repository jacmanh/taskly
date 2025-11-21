import type { Workspace, CreateWorkspaceInput, UpdateWorkspaceInput } from '@taskly/types';
import { axiosInstance } from '@features/auth/services/axios';

export const workspacesService = {
  /**
   * Get all workspaces for the current user
   */
  async getMyWorkspaces(): Promise<Workspace[]> {
    const { data } = await axiosInstance.get<Workspace[]>('/workspaces');
    return data;
  },

  /**
   * Create a new workspace
   */
  async createWorkspace(input: CreateWorkspaceInput): Promise<Workspace> {
    const { data } = await axiosInstance.post<Workspace>('/workspaces', input);
    return data;
  },

  /**
   * Update a workspace
   */
  async updateWorkspace(
    id: string,
    input: UpdateWorkspaceInput
  ): Promise<Workspace> {
    const { data } = await axiosInstance.patch<Workspace>(
      `/workspaces/${id}`,
      input
    );
    return data;
  },

  /**
   * Delete a workspace
   */
  async deleteWorkspace(id: string): Promise<void> {
    await axiosInstance.delete(`/workspaces/${id}`);
  },
};
