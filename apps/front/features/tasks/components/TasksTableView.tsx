'use client';

import { useSuspenseProjectTasks } from '../hooks/useTasks';
import { useDrawer } from '@taskly/design-system';
import type { Task, Workspace } from '@taskly/types';
import { TasksTable } from './TasksTable';
import { TaskDrawer } from './TaskDrawer';

interface TasksTableViewProps {
  workspaceId: string;
  projectId: string;
  workspace: Workspace;
}

export function TasksTableView({
  workspaceId,
  projectId,
  workspace,
}: TasksTableViewProps) {
  const { data: tasks = [] } = useSuspenseProjectTasks(workspaceId, projectId);
  const { openDrawer, closeDrawer } = useDrawer();

  const handleRowClick = (task: Task) => {
    openDrawer({
      children: (
        <TaskDrawer task={task} workspace={workspace} onClose={closeDrawer} />
      ),
    });
  };

  return <TasksTable tasks={tasks} onRowClick={handleRowClick} />;
}
