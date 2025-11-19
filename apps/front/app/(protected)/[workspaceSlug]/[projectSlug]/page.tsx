'use client';

import { useParams } from 'next/navigation';
import { useDrawer, Button } from '@taskly/design-system';
import { useWorkspaceContext } from '@features/workspaces/contexts/WorkspaceContext';
import { useSuspenseWorkspaceProjects } from '@features/projects/hooks/useProjects';
import { useSuspenseProjectTasks } from '@features/tasks/hooks/useTasks';
import { useCreateTaskDrawer } from '@features/tasks/hooks/useCreateTaskDrawer';
import { TasksTable } from '@features/tasks/components/TasksTable';
import { TaskDrawer } from '@features/tasks/components/TaskDrawer';
import { Plus } from 'lucide-react';
import type { Task } from '@taskly/types';
import { Suspense } from 'react';
import { FullPageLoading } from '../../../components/FullPageLoading';

function ProjectTasks({
  workspaceId,
  projectId,
}: {
  workspaceId: string;
  projectId: string;
}) {
  const { data: tasks = [] } = useSuspenseProjectTasks(workspaceId, projectId);
  const { openDrawer, closeDrawer } = useDrawer();
  const { currentWorkspace } = useWorkspaceContext();

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

  return <TasksTable tasks={tasks} onRowClick={handleRowClick} />;
}

function ProjectContent({
  workspaceId,
  projectSlug,
}: {
  workspaceId: string;
  projectSlug: string;
}) {
  const { data: projects = [] } = useSuspenseWorkspaceProjects(workspaceId);
  const project = projects.find((p) => p.slug === projectSlug);
  const { openCreateTaskDrawer } = useCreateTaskDrawer();

  if (!project) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Projet introuvable
            </h2>
            <p className="text-neutral-500">
              Le projet &ldquo;{projectSlug}&rdquo; n&apos;existe pas dans ce
              workspace.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateTask = () => {
    openCreateTaskDrawer(workspaceId, project.id);
  };

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
            </div>
            <Button variant="primary" onClick={handleCreateTask}>
              <Plus className="w-4 h-4" />
              Nouvelle tâche
            </Button>
          </div>

          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600"></div>
              </div>
            }
          >
            <ProjectTasks workspaceId={workspaceId} projectId={project.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const params = useParams<{
    workspaceSlug: string;
    projectSlug: string;
  }>();

  const { currentWorkspace } = useWorkspaceContext();

  if (!currentWorkspace) {
    return <FullPageLoading />;
  }

  return (
    <Suspense fallback={<FullPageLoading />}>
      <ProjectContent
        workspaceId={currentWorkspace.id}
        projectSlug={params?.projectSlug as string}
      />
    </Suspense>
  );
}
