'use client';

import { useDeleteTask, useSuspenseProjectTasks } from '../hooks/useTasks';
import { useConfirmationModal, useDrawer } from '@taskly/design-system';
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
  const { openDrawer } = useDrawer();

  const { mutate: deleteTask } = useDeleteTask();
  const { show: showConfirmationModal } = useConfirmationModal();

  const handleDeleteTask = async (
    task: Task,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const isConfirmed = await showConfirmationModal({
      title: `Delete task "${task.title}"?`,
      description:
        'Are you sure you want to delete this task? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'destructive',
    });

    if (isConfirmed) {
      deleteTask({
        workspaceId,
        taskId: task.id,
        projectId: task.projectId,
      });
    }
  };

  const handleRowClick = (task: Task) => {
    openDrawer({
      children: <TaskDrawer task={task} workspace={workspace} />,
    });
  };

  return (
    <TasksTable
      tasks={tasks}
      onRowClick={handleRowClick}
      deleteTask={handleDeleteTask}
    />
  );
}
