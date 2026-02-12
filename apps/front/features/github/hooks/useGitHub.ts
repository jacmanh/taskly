import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { githubService, type GitHubRepository } from '../services/github.service';
import { workspacesQueryKeys } from '../../workspaces/constants/query-keys';

/**
 * Hook to initiate GitHub OAuth flow
 */
export function useGitHubAuth() {
  return useMutation({
    mutationFn: () => githubService.initiateAuth(),
    onSuccess: (data) => {
      // Open GitHub authorization page in a new window
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      window.open(
        data.authUrl,
        'GitHub Authorization',
        `width=${width},height=${height},left=${left},top=${top}`
      );
    },
  });
}

/**
 * Hook to get user's GitHub repositories
 */
export function useGitHubRepositories(accessToken: string | null) {
  return useQuery({
    queryKey: ['github', 'repositories', accessToken],
    queryFn: () => githubService.getRepositories(accessToken!),
    enabled: !!accessToken,
  });
}

/**
 * Hook to analyze a GitHub repository
 */
export function useAnalyzeRepository() {
  return useMutation({
    mutationFn: ({
      owner,
      repo,
      accessToken,
    }: {
      owner: string;
      repo: string;
      accessToken: string;
    }) => githubService.analyzeRepository(owner, repo, accessToken),
  });
}

/**
 * Hook to connect GitHub repository to workspace
 */
export function useConnectGitHubToWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      owner,
      repo,
      accessToken,
    }: {
      workspaceId: string;
      owner: string;
      repo: string;
      accessToken: string;
    }) => githubService.connectToWorkspace(workspaceId, owner, repo, accessToken),
    onSuccess: () => {
      // Invalidate workspace queries to refresh the data
      queryClient.invalidateQueries({ queryKey: workspacesQueryKeys.all });
    },
  });
}
