export const taskDraftsQueryKeys = {
  all: ['task-drafts'] as const,
  project: (projectId: string) =>
    [...taskDraftsQueryKeys.all, 'project', projectId] as const,
  batch: (batchId: string) =>
    [...taskDraftsQueryKeys.all, 'batch', batchId] as const,
};
