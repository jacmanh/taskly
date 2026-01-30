'use client';

import { useRouter, useParams } from 'next/navigation';
import { useSuspenseProjectDraftBatches } from '../hooks/useTaskDrafts';
import type { TaskDraftBatch } from '@taskly/types';
import { DraftBatchesTable } from './DraftBatchesTable';

interface DraftBatchesTableViewProps {
  workspaceId: string;
  projectId: string;
}

export function DraftBatchesTableView({
  workspaceId,
  projectId,
}: DraftBatchesTableViewProps) {
  const { data: batches = [] } = useSuspenseProjectDraftBatches(
    workspaceId,
    projectId,
  );
  const router = useRouter();
  const params = useParams<{
    workspaceSlug: string;
    projectSlug: string;
  }>();

  const handleRowClick = (batch: TaskDraftBatch) => {
    router.push(
      `/${params?.workspaceSlug}/${params?.projectSlug}/drafts/${batch.id}`,
    );
  };

  return <DraftBatchesTable batches={batches} onRowClick={handleRowClick} />;
}
