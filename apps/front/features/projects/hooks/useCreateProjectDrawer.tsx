'use client';

import { useDrawer } from '@taskly/design-system';
import type { Project } from '@taskly/types';
import { ProjectForm } from '../components/ProjectForm';

export function useCreateProjectDrawer() {
  const { openDrawer, closeDrawer } = useDrawer();

  const openCreateProjectDrawer = (
    workspaceId: string,
    onSuccess?: (project: Project) => void
  ) => {
    openDrawer({
      children: (
        <ProjectForm
          workspaceId={workspaceId}
          onSuccess={(project) => {
            onSuccess?.(project);
            closeDrawer();
          }}
          onCancel={() => closeDrawer()}
        />
      ),
    });
  };

  return {
    openCreateProjectDrawer,
  };
}
