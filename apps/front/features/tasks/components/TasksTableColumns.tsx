'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { Task } from '@taskly/types';
import { TaskStatus, TaskPriority } from '@taskly/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function getStatusBadgeColor(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.TODO:
      return 'bg-neutral-100 text-neutral-700';
    case TaskStatus.IN_PROGRESS:
      return 'bg-accent-100 text-accent-700';
    case TaskStatus.DONE:
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-neutral-100 text-neutral-700';
  }
}

function getStatusLabel(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.TODO:
      return 'À faire';
    case TaskStatus.IN_PROGRESS:
      return 'En cours';
    case TaskStatus.DONE:
      return 'Terminé';
    default:
      return status;
  }
}

function getPriorityBadgeColor(priority: TaskPriority): string {
  switch (priority) {
    case TaskPriority.LOW:
      return 'bg-blue-100 text-blue-700';
    case TaskPriority.MEDIUM:
      return 'bg-yellow-100 text-yellow-700';
    case TaskPriority.HIGH:
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-neutral-100 text-neutral-700';
  }
}

function getPriorityLabel(priority: TaskPriority): string {
  switch (priority) {
    case TaskPriority.LOW:
      return 'Basse';
    case TaskPriority.MEDIUM:
      return 'Moyenne';
    case TaskPriority.HIGH:
      return 'Haute';
    default:
      return priority;
  }
}

export const tasksTableColumns: ColumnDef<Task>[] = [
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
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(status)}`}
        >
          {getStatusLabel(status)}
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
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeColor(priority)}`}
        >
          {getPriorityLabel(priority)}
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
            <img
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
        return <span className="text-neutral-400 text-sm italic">Aucune</span>;
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
];
