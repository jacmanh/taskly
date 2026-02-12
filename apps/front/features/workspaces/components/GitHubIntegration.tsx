'use client';

import { useState } from 'react';
import { Button, Select, Label, Spinner } from '@taskly/design-system';
import { useCurrentWorkspace } from '../hooks/useCurrentWorkspace';
import { useGitHubAuth, useGitHubRepositories, useConnectGitHubToWorkspace } from '../../github/hooks/useGitHub';
import type { GitHubRepository } from '../../github/services/github.service';

export function GitHubIntegration() {
  const { currentWorkspace: workspace } = useCurrentWorkspace();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(null);

  const { mutate: initiateAuth, isPending: isAuthPending } = useGitHubAuth();
  const { data: repositories, isLoading: isLoadingRepos } = useGitHubRepositories(accessToken);
  const { mutate: connectRepo, isPending: isConnecting } = useConnectGitHubToWorkspace();

  const handleConnectGitHub = () => {
    initiateAuth(undefined, {
      onSuccess: () => {
        // Listen for OAuth callback message from popup window
        const handleMessage = (event: MessageEvent) => {
          if (event.data.type === 'github-auth-success' && event.data.accessToken) {
            setAccessToken(event.data.accessToken);
            window.removeEventListener('message', handleMessage);
          }
        };
        window.addEventListener('message', handleMessage);
      },
    });
  };

  const handleSelectRepository = (repoFullName: string) => {
    const repo = repositories?.find((r) => r.full_name === repoFullName);
    if (repo) {
      setSelectedRepo(repo);
    }
  };

  const handleAnalyzeAndConnect = () => {
    if (!workspace || !selectedRepo || !accessToken) return;

    connectRepo(
      {
        workspaceId: workspace.id,
        owner: selectedRepo.owner.login,
        repo: selectedRepo.name,
        accessToken,
      },
      {
        onSuccess: () => {
          // Reset state after successful connection
          setAccessToken(null);
          setSelectedRepo(null);
        },
      }
    );
  };

  const isConnected = !!workspace?.githubRepoUrl;

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium leading-none mb-2">Intégration GitHub</h4>
        <p className="text-sm text-neutral-500 mb-4">
          Connectez un dépôt GitHub pour permettre à l'IA d'analyser votre
          projet et générer des user stories pertinentes.
        </p>
      </div>

      {isConnected ? (
        <div className="rounded-lg border border-neutral-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Dépôt connecté</p>
              <a
                href={workspace.githubRepoUrl || ''}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {workspace.githubOwner}/{workspace.githubRepoName}
              </a>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Disconnect logic - clear GitHub fields
                // You can implement this by calling updateWorkspace
              }}
            >
              Déconnecter
            </Button>
          </div>
          
          {workspace.aiGeneratedContext && (
            <div className="mt-3 pt-3 border-t border-neutral-200">
              <p className="text-sm font-medium mb-2">Contexte IA généré:</p>
              <div className="text-sm text-neutral-700 bg-neutral-50 rounded p-3 max-h-48 overflow-y-auto">
                {workspace.aiGeneratedContext}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {!accessToken ? (
            <Button
              onClick={handleConnectGitHub}
              loading={isAuthPending}
              className="w-full"
            >
              Connecter GitHub
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="repository">Sélectionner un dépôt</Label>
                {isLoadingRepos ? (
                  <div className="flex items-center justify-center py-4">
                    <Spinner size="sm" />
                    <span className="ml-2 text-sm text-neutral-500">
                      Chargement des dépôts...
                    </span>
                  </div>
                ) : (
                  <Select
                    id="repository"
                    value={selectedRepo?.full_name || ''}
                    onValueChange={handleSelectRepository}
                  >
                    <option value="">-- Choisir un dépôt --</option>
                    {repositories?.map((repo) => (
                      <option key={repo.id} value={repo.full_name}>
                        {repo.full_name}
                        {repo.description && ` - ${repo.description}`}
                      </option>
                    ))}
                  </Select>
                )}
              </div>

              {selectedRepo && (
                <div className="rounded-lg border border-neutral-200 p-3 bg-neutral-50">
                  <p className="text-sm font-medium">{selectedRepo.full_name}</p>
                  {selectedRepo.description && (
                    <p className="text-sm text-neutral-600 mt-1">
                      {selectedRepo.description}
                    </p>
                  )}
                  {selectedRepo.language && (
                    <p className="text-xs text-neutral-500 mt-2">
                      Langage: {selectedRepo.language}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAccessToken(null);
                    setSelectedRepo(null);
                  }}
                  disabled={isConnecting}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleAnalyzeAndConnect}
                  disabled={!selectedRepo}
                  loading={isConnecting}
                  className="flex-1"
                >
                  Analyser et connecter
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
