'use client';

import { useDrawer } from '@taskly/design-system';
import { ProjectForm } from '../components/ProjectForm';
import type { Project } from '@taskly/types';

export function useUpdateProjectDrawer() {
  const { openDrawer, closeDrawer } = useDrawer();

  const openUpdateProjectDrawer = (
    project: Project,
    onSuccess?: (project: Project) => void,
  ) => {
    openDrawer({
      children: (
        <ProjectForm
          project={project}
          onSuccess={(updatedProject) => {
            onSuccess?.(updatedProject);
            closeDrawer();
          }}
          onCancel={() => closeDrawer()}
        />
      ),
    });
  };

  return {
    openUpdateProjectDrawer,
  };
}
