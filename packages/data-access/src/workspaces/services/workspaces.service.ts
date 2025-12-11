import type {
  WorkspaceUser,
  Workspace,
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
} from '@taskly/types';
import { axiosInstance } from '../../client/axios';

export const workspacesService = {
  async getMyWorkspaces(): Promise<Workspace[]> {
    const { data } = await axiosInstance.get<Workspace[]>('/workspaces');
    return data;
  },

  async getWorkspaceUsers(
    workspaceId: string,
    searchTerm?: string,
    signal?: AbortSignal
  ): Promise<WorkspaceUser[]> {
    const { data } = await axiosInstance.get<WorkspaceUser[]>(
      `/workspaces/${workspaceId}/users`,
      {
        params: searchTerm ? { search: searchTerm } : undefined,
        signal,
      }
    );
    return data;
  },

  async createWorkspace(input: CreateWorkspaceInput): Promise<Workspace> {
    const { data } = await axiosInstance.post<Workspace>('/workspaces', input);
    return data;
  },

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

  async deleteWorkspace(id: string): Promise<void> {
    await axiosInstance.delete(`/workspaces/${id}`);
  },
};
