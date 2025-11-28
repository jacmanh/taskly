'use client';

import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import { FullPageLoading } from '../../../components/FullPageLoading';

// Each feature is imported ONLY at the page level
import { useWorkspaceContext } from '@features/workspaces/contexts/WorkspaceContext';
import { ProjectContent } from '@features/projects/components/ProjectContent';
import { useSuspenseWorkspaceProjects } from '@features/projects/hooks/useProjects';
import { TasksTableView } from '@features/tasks/components/TasksTableView';
import { useCreateTaskDrawer } from '@features/tasks/hooks/useCreateTaskDrawer';
import { Workspace } from '@taskly/types';
import { Spinner } from '@taskly/design-system';

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
      <ProjectPageContent
        workspaceId={currentWorkspace.id}
        projectSlug={params?.projectSlug as string}
        workspace={currentWorkspace}
      />
    </Suspense>
  );
}

// Inner component to use hooks after Suspense boundary
function ProjectPageContent({
  workspaceId,
  projectSlug,
  workspace,
}: {
  workspaceId: string;
  projectSlug: string;
  workspace: Workspace;
}) {
  const { data: projects = [] } = useSuspenseWorkspaceProjects(workspaceId);
  const project = projects.find((p) => p.slug === projectSlug);
  const { openCreateTaskDrawer } = useCreateTaskDrawer();

  const handleCreateTask = () => {
    if (project) {
      openCreateTaskDrawer(workspaceId, project.id);
    }
  };

  return (
    <ProjectContent
      workspaceId={workspaceId}
      projectSlug={projectSlug}
      onCreateTask={handleCreateTask}
    >
      {project && (
        <Suspense fallback={<Spinner size="lg" />}>
          <TasksTableView
            workspaceId={workspaceId}
            projectId={project.id}
            workspace={workspace}
          />
        </Suspense>
      )}
    </ProjectContent>
  );
}
