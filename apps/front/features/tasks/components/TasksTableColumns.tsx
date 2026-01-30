'use client';

import { ColumnDef, RowData } from '@tanstack/react-table';
import type { Task } from '@taskly/types';
import { TaskStatus, TaskPriority } from '@taskly/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getTaskPriorityLabel, getTaskStatusLabel } from '../utils/task-labels';
import { _Translator } from 'next-intl';
import { messages } from '@i18n/message-types';
import Image from 'next/image';

import '../styles/tasks.css';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@taskly/design-system';
import { EllipsisIcon, Trash } from 'lucide-react';

const STATUS_BADGE_CLASSES = {
  [TaskStatus.TODO]: 'status-badge-todo',
  [TaskStatus.IN_PROGRESS]: 'status-badge-in-progress',
  [TaskStatus.DONE]: 'status-badge-done',
};

const PRIORITY_BADGE_CLASSES = {
  [TaskPriority.LOW]: 'badge-low',
  [TaskPriority.MEDIUM]: 'badge-medium',
  [TaskPriority.HIGH]: 'badge-high',
  default: 'badge-neutral',
};

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData = Task> {
    deleteTask?: (task: Task, e: React.MouseEvent<HTMLDivElement>) => void;
  }
}

export const getTasksTableColumns = (
  t: _Translator<typeof messages, 'tasks'>
): ColumnDef<Task>[] => {
  return [
    {
      accessorKey: 'title',
      header: 'Titre',
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <span className="font-medium text-neutral-900">
              {row.original.title}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span className={`badge ${STATUS_BADGE_CLASSES[status]}`}>
            {getTaskStatusLabel(status, t)}
          </span>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'priority',
      header: 'Priorité',
      cell: ({ row }) => {
        const priority = row.original.priority;
        return (
          <span className={`badge ${PRIORITY_BADGE_CLASSES[priority]}`}>
            {getTaskPriorityLabel(priority, t)}
          </span>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'assignedTo',
      header: 'Assigné à',
      cell: ({ row }) => {
        const assignedTo = row.original.assignedTo;
        if (!assignedTo) {
          return (
            <span className="text-neutral-400 text-sm italic">Non assigné</span>
          );
        }
        return (
          <div className="flex items-center gap-2">
            {assignedTo.avatar && (
              <Image
                width={24}
                height={24}
                src={assignedTo.avatar}
                alt={assignedTo.name || assignedTo.email}
                className="w-6 h-6 rounded-full"
              />
            )}
            <span className="text-sm text-neutral-700">
              {assignedTo.name || assignedTo.email}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'dueDate',
      header: "Date d'échéance",
      cell: ({ row }) => {
        const dueDate = row.original.dueDate;
        if (!dueDate) {
          return (
            <span className="text-neutral-400 text-sm italic">Aucune</span>
          );
        }
        return (
          <span className="text-sm text-neutral-700">
            {format(new Date(dueDate), 'dd MMM yyyy', { locale: fr })}
          </span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Créé le',
      cell: ({ row }) => {
        return (
          <span className="text-sm text-neutral-500">
            {format(new Date(row.original.createdAt), 'dd MMM yyyy', {
              locale: fr,
            })}
          </span>
        );
      },
    },
    // ---- Action column ----
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      enableHiding: false,
      size: 50,
      maxSize: 50,
      cell: ({ row, table }) => {
        const deleteTask = (e: React.MouseEvent<HTMLDivElement>) =>
          table.options.meta?.deleteTask?.(row.original, e);

        return (
          <div className="flex justify-end group">
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity rounded-md p-1 hover:bg-neutral-100 focus:bg-neutral-100 outline-none">
                  <EllipsisIcon size={20} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="text-error-600 focus:text-error-600"
                    onClick={(e) => deleteTask(e)}
                  >
                    <Trash size={16} className="mr-2" />
                    <span>Supprimer</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      },
    },
  ];
};
