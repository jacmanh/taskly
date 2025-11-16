'use client';

import { useDrawer } from '@taskly/design-system';
import { WorkspaceForm } from '@features/workspaces/components/WorkspaceForm';

export function useCreateWorkspaceDrawer() {
  const { openDrawer, closeDrawer } = useDrawer();

  const openCreateDrawer = () => {
    openDrawer({
      children: (
        <WorkspaceForm
          onSuccess={() => closeDrawer()}
          onCancel={() => closeDrawer()}
        />
      ),
    });
  };

  return {
    openCreateDrawer,
  };
}
