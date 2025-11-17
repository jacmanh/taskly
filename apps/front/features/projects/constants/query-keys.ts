export const projectsQueryKeys = {
  all: ['projects'] as const,
  list: () => [...projectsQueryKeys.all, 'list'] as const,
  workspace: (workspaceId: string) =>
    [...projectsQueryKeys.list(), 'workspace', workspaceId] as const,
  detail: (projectId: string) =>
    [...projectsQueryKeys.all, 'detail', projectId] as const,
};
