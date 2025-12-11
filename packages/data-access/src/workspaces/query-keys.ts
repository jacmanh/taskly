export const workspacesQueryKeys = {
  all: ['workspaces'] as const,
  list: () => [...workspacesQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...workspacesQueryKeys.all, 'detail', id] as const,
  users: (workspaceId: string) =>
    [...workspacesQueryKeys.all, 'users', workspaceId] as const,
};
