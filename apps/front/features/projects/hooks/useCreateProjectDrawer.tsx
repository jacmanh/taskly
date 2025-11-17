'use client';

import { useDrawer } from '@taskly/design-system';
import { ProjectForm } from '../components/ProjectForm';

export function useCreateProjectDrawer() {
  const { openDrawer, closeDrawer } = useDrawer();

  const openCreateProjectDrawer = (workspaceId: string) => {
    openDrawer({
      children: (
        <ProjectForm
          workspaceId={workspaceId}
          onSuccess={() => closeDrawer()}
          onCancel={() => closeDrawer()}
        />
      ),
    });
  };

  return {
    openCreateProjectDrawer,
  };
}
