import { useDrawer } from '@taskly/design-system';
import type { Task } from '@taskly/types';
import { TaskForm } from '../components/TaskForm';

export function useCreateTaskDrawer() {
  const { openDrawer, closeDrawer } = useDrawer();

  const openCreateTaskDrawer = (
    workspaceId: string,
    projectId: string,
    onSuccess?: (task: Task) => void
  ) => {
    openDrawer({
      children: (
        <TaskForm
          workspaceId={workspaceId}
          projectId={projectId}
          onSuccess={(task) => {
            onSuccess?.(task);
            closeDrawer();
          }}
          onCancel={closeDrawer}
        />
      ),
    });
  };

  return { openCreateTaskDrawer };
}
