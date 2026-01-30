'use client';

import { ColumnDef, RowData } from '@tanstack/react-table';
import type { TaskDraftItem } from '@taskly/types';
import { TaskPriority } from '@taskly/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  MarkdownRenderer,
} from '@taskly/design-system';
import { EllipsisIcon, Eye, EyeOff } from 'lucide-react';

import '@features/tasks/styles/tasks.css';

const PRIORITY_BADGE_CLASSES: Record<string, string> = {
  [TaskPriority.LOW]: 'badge-low',
  [TaskPriority.MEDIUM]: 'badge-medium',
  [TaskPriority.HIGH]: 'badge-high',
};

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    toggleEnabled?: (item: TaskDraftItem, e: React.MouseEvent) => void;
  }
}

export const draftItemsTableColumns: ColumnDef<TaskDraftItem>[] = [
  {
    accessorKey: 'title',
    header: 'Titre',
    cell: ({ row }) => (
      <span className="font-medium text-neutral-900">{row.original.title}</span>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <div className="text-sm text-neutral-600 truncate max-w-xs">
        {row.original.description ? (
          <MarkdownRenderer
            content={row.original.description}
            className="line-clamp-2"
          />
        ) : (
          <span className="italic text-neutral-400">Aucune</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'priority',
    header: 'Priorité',
    cell: ({ row }) => {
      const priority = row.original.priority;
      return (
        <span className={`badge ${PRIORITY_BADGE_CLASSES[priority]}`}>
          {priority}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: '',
    enableSorting: false,
    size: 50,
    maxSize: 50,
    cell: ({ row, table }) => {
      const item = row.original;
      const toggleEnabled = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        table.options.meta?.toggleEnabled?.(item, e);
      };

      return (
        <div className="flex justify-end group">
          <DropdownMenu>
            <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity rounded-md p-1 hover:bg-neutral-100 focus:bg-neutral-100 outline-none">
              <EllipsisIcon size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={toggleEnabled}>
                {item.enabled ? (
                  <>
                    <EyeOff size={16} className="mr-2" />
                    <span>Désactiver</span>
                  </>
                ) : (
                  <>
                    <Eye size={16} className="mr-2" />
                    <span>Activer</span>
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
