export const tasksQueryKeys = {
  all: ['tasks'] as const,
  list: () => [...tasksQueryKeys.all, 'list'] as const,
  workspace: (workspaceId: string) =>
    [...tasksQueryKeys.list(), 'workspace', workspaceId] as const,
  project: (projectId: string) =>
    [...tasksQueryKeys.list(), 'project', projectId] as const,
  detail: (taskId: string) =>
    [...tasksQueryKeys.all, 'detail', taskId] as const,
};
