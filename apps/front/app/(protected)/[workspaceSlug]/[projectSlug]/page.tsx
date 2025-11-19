'use client';

import { useParams } from 'next/navigation';
import { useDrawer, Button } from '@taskly/design-system';
import { useWorkspaceContext } from '@features/workspaces/contexts/WorkspaceContext';
import { useWorkspaceProjects } from '@features/projects/hooks/useProjects';
import { useProjectTasks } from '@features/tasks/hooks/useTasks';
import { useCreateTaskDrawer } from '@features/tasks/hooks/useCreateTaskDrawer';
import { TasksTable } from '@features/tasks/components/TasksTable';
import { TaskDrawer } from '@features/tasks/components/TaskDrawer';
import { Plus } from 'lucide-react';
import type { Task } from '@taskly/types';

export default function ProjectDetailPage() {
  const params = useParams<{
    workspaceSlug: string;
    projectSlug: string;
  }>();

  const { currentWorkspace } = useWorkspaceContext();
  const { data: projects = [], isLoading: isLoadingProjects } =
    useWorkspaceProjects(currentWorkspace?.id);

  // Find the project by slug
  const project = projects.find((p) => p.slug === params?.projectSlug);

  const {
    data: tasks = [],
    isLoading: isLoadingTasks,
    error: tasksError,
  } = useProjectTasks(currentWorkspace?.id, project?.id);

  const { openDrawer, closeDrawer } = useDrawer();
  const { openCreateTaskDrawer } = useCreateTaskDrawer();

  const handleRowClick = (task: Task) => {
    if (!currentWorkspace) return;
    openDrawer({
      children: (
        <TaskDrawer
          task={task}
          workspaceId={currentWorkspace.id}
          onClose={closeDrawer}
        />
      ),
    });
  };

  const handleCreateTask = () => {
    if (!currentWorkspace || !project) return;
    openCreateTaskDrawer(currentWorkspace.id, project.id);
  };

  if (isLoadingProjects) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Projet introuvable
            </h2>
            <p className="text-neutral-500">
              Le projet &ldquo;{params?.projectSlug}&rdquo; n&apos;existe pas
              dans ce workspace.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {project.name}
          </h1>
          {project.description && (
            <p className="text-neutral-600 mt-1">{project.description}</p>
          )}
        </div>

        {/* Tasks Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-neutral-900">Tâches</h2>
              <div className="text-sm text-neutral-500">
                {tasks.length} tâche{tasks.length > 1 ? 's' : ''}
              </div>
            </div>
            <Button variant="primary" onClick={handleCreateTask}>
              <Plus className="w-4 h-4" />
              Nouvelle tâche
            </Button>
          </div>

          {tasksError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">
                Une erreur s&apos;est produite lors du chargement des tâches.
              </p>
            </div>
          ) : (
            <TasksTable
              tasks={tasks}
              onRowClick={handleRowClick}
              isLoading={isLoadingTasks}
            />
          )}
        </div>
      </div>
    </div>
  );
}
