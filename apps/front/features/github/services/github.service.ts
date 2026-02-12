import { axiosInstance } from '@taskly/data-access';

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  html_url: string;
  description: string | null;
  language: string | null;
}

export interface GitHubAuthResponse {
  authUrl: string;
}

export interface GitHubCallbackResponse {
  accessToken: string;
}

export interface AnalyzeRepositoryResponse {
  context: string;
}

export const githubService = {
  /**
   * Get GitHub OAuth authorization URL
   */
  async initiateAuth(): Promise<GitHubAuthResponse> {
    const { data } = await axiosInstance.get<GitHubAuthResponse>(
      '/github/auth/initiate'
    );
    return data;
  },

  /**
   * Exchange authorization code for access token
   */
  async handleCallback(
    code: string,
    state: string
  ): Promise<GitHubCallbackResponse> {
    const { data } = await axiosInstance.get<GitHubCallbackResponse>(
      '/github/auth/callback',
      {
        params: { code, state },
      }
    );
    return data;
  },

  /**
   * Get user's repositories
   */
  async getRepositories(accessToken: string): Promise<GitHubRepository[]> {
    const { data } = await axiosInstance.post<GitHubRepository[]>(
      '/github/repositories',
      { accessToken }
    );
    return data;
  },

  /**
   * Analyze a repository
   */
  async analyzeRepository(
    owner: string,
    repo: string,
    accessToken: string
  ): Promise<AnalyzeRepositoryResponse> {
    const { data } = await axiosInstance.post<AnalyzeRepositoryResponse>(
      '/github/analyze',
      { owner, repo, accessToken }
    );
    return data;
  },

  /**
   * Connect GitHub repository to workspace
   */
  async connectToWorkspace(
    workspaceId: string,
    owner: string,
    repo: string,
    accessToken: string
  ): Promise<any> {
    const { data } = await axiosInstance.post(
      `/workspaces/${workspaceId}/github/connect`,
      { owner, repo, accessToken }
    );
    return data;
  },
};
