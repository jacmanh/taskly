'use client';

import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import { FullPageLoading } from '../../../../components/FullPageLoading';
import { useWorkspaceContext } from '@features/workspaces/contexts/WorkspaceContext';
import { ProjectContent } from '@features/projects/components/ProjectContent';
import { useSuspenseWorkspaceProjects } from '@features/projects/hooks/useProjects';
import { DraftBatchesTableView } from '@features/task-drafts/components/DraftBatchesTableView';
import { Spinner } from '@taskly/design-system';

export default function DraftsPage() {
  const { currentWorkspace } = useWorkspaceContext();

  if (!currentWorkspace) {
    return <FullPageLoading />;
  }

  return (
    <Suspense fallback={<FullPageLoading />}>
      <DraftsPageContent workspaceId={currentWorkspace.id} />
    </Suspense>
  );
}

function DraftsPageContent({ workspaceId }: { workspaceId: string }) {
  const params = useParams<{
    projectSlug: string;
  }>();

  const { data: projects = [] } = useSuspenseWorkspaceProjects(workspaceId);
  const project = projects.find((p) => p.slug === params?.projectSlug);

  return (
    <ProjectContent
      workspaceId={workspaceId}
      projectSlug={params?.projectSlug || ''}
      activeTab="drafts"
    >
      {project && (
        <Suspense fallback={<Spinner size="lg" />}>
          <DraftBatchesTableView
            workspaceId={workspaceId}
            projectId={project.id}
          />
        </Suspense>
      )}
    </ProjectContent>
  );
}
