import { useDrawer } from '@taskly/design-system';
import { GenerateTasksForm } from '../components/GenerateTasksForm';

export function useGenerateTasksDrawer() {
  const { openDrawer, closeDrawer } = useDrawer();

  const openGenerateTasksDrawer = (workspaceId: string, projectId: string) => {
    openDrawer({
      children: (
        <GenerateTasksForm
          workspaceId={workspaceId}
          projectId={projectId}
          onSuccess={closeDrawer}
          onCancel={closeDrawer}
        />
      ),
    });
  };

  return { openGenerateTasksDrawer };
}
