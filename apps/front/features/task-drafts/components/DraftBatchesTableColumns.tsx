'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { TaskDraftBatch } from '@taskly/types';
import { TaskDraftBatchStatus } from '@taskly/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { _Translator } from 'next-intl';
import { messages } from '@i18n/message-types';
import { getDraftBatchesStatusLabel } from '../utils/draft-batches-label';

const STATUS_BADGE_CLASSES: Record<string, string> = {
  [TaskDraftBatchStatus.PENDING]: 'badge badge-medium',
  [TaskDraftBatchStatus.ACCEPTED]: 'badge badge-low',
  [TaskDraftBatchStatus.CANCELLED]: 'badge badge-high',
};

export const draftBatchesTableColumns = (
  t: _Translator<typeof messages, 'draftbatches'>
): ColumnDef<TaskDraftBatch>[] => [
  {
    accessorKey: 'title',
    header: 'Titre',
    cell: ({ row }) => (
      <span className="font-medium text-neutral-900">{row.original.title}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span className={STATUS_BADGE_CLASSES[status]}>
          {getDraftBatchesStatusLabel(status, t)}
        </span>
      );
    },
  },
  {
    id: 'taskCount',
    header: 'Tâches',
    cell: ({ row }) => (
      <span className="text-sm text-neutral-600">
        {row.original._count?.items ?? row.original.items?.length ?? 0}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Créé le',
    cell: ({ row }) => (
      <span className="text-sm text-neutral-500">
        {format(new Date(row.original.createdAt), 'dd MMM yyyy', {
          locale: fr,
        })}
      </span>
    ),
  },
];
