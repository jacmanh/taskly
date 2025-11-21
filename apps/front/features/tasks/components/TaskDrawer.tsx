'use client';

import { Drawer, Button, useConfirmationModal } from '@taskly/design-system';
import type { Task, Workspace } from '@taskly/types';
import { TaskStatus, TaskPriority } from '@taskly/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, User, Flag, CheckCircle2, Clock } from 'lucide-react';
import { useDeleteTask } from '../hooks/useTasks';

interface TaskDrawerProps {
  task: Task;
  workspace: Workspace;
  onClose: () => void;
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

export function TaskDrawer({ task, workspace, onClose }: TaskDrawerProps) {
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const { show: showConfirmationModal } = useConfirmationModal();

  const handleDelete = async () => {
    const confirmed = await showConfirmationModal({
      title: `Supprimer "${task.title}" ?`,
      description: 'Cette action ne peut pas être annulée.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'destructive',
    });

    if (!confirmed) return;

    deleteTask(
      { workspaceId: workspace.id, taskId: task.id, projectId: task.projectId },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <>
      <Drawer.Header
        title={task.title}
        description={`Créé le ${format(new Date(task.createdAt), 'dd MMMM yyyy', { locale: fr })}`}
      />

      <div className="space-y-6">
        {/* Description */}
        {task.description && (
          <div>
            <h3 className="text-sm font-medium text-neutral-700 mb-2">
              Description
            </h3>
            <p className="text-sm text-neutral-600 whitespace-pre-wrap">
              {task.description}
            </p>
          </div>
        )}

        {/* Status & Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              Statut
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(task.status)}`}
            >
              {getStatusLabel(task.status)}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
              <Flag className="w-4 h-4" />
              Priorité
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}
            >
              {getPriorityLabel(task.priority)}
            </span>
          </div>
        </div>

        {/* Assigned To */}
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
            <User className="w-4 h-4" />
            Assigné à
          </div>
          {task.assignedTo ? (
            <div className="flex items-center gap-2">
              {task.assignedTo.avatar && (
                <img
                  src={task.assignedTo.avatar}
                  alt={task.assignedTo.name || task.assignedTo.email}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  {task.assignedTo.name || 'Sans nom'}
                </p>
                <p className="text-xs text-neutral-500">
                  {task.assignedTo.email}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-neutral-500 italic">Non assigné</p>
          )}
        </div>

        {/* Due Date */}
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
            <Calendar className="w-4 h-4" />
            Date d&apos;échéance
          </div>
          {task.dueDate ? (
            <p className="text-sm text-neutral-900">
              {format(new Date(task.dueDate), 'dd MMMM yyyy', { locale: fr })}
            </p>
          ) : (
            <p className="text-sm text-neutral-500 italic">
              Aucune date d&apos;échéance
            </p>
          )}
        </div>

        {/* Sprint */}
        {task.sprint && (
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
              <Clock className="w-4 h-4" />
              Sprint
            </div>
            <p className="text-sm text-neutral-900">{task.sprint.name}</p>
          </div>
        )}

        {/* Created By */}
        <div>
          <div className="text-sm font-medium text-neutral-700 mb-2">
            Créé par
          </div>
          <div className="flex items-center gap-2">
            {task.createdBy.avatar && (
              <img
                src={task.createdBy.avatar}
                alt={task.createdBy.name || task.createdBy.email}
                className="w-6 h-6 rounded-full"
              />
            )}
            <span className="text-sm text-neutral-700">
              {task.createdBy.name || task.createdBy.email}
            </span>
          </div>
        </div>

        {/* Metadata */}
        <div className="pt-4 border-t border-neutral-200">
          <div className="text-xs text-neutral-500 space-y-1">
            <p>
              Créé le{' '}
              {format(new Date(task.createdAt), 'dd MMMM yyyy à HH:mm', {
                locale: fr,
              })}
            </p>
            <p>
              Modifié le{' '}
              {format(new Date(task.updatedAt), 'dd MMMM yyyy à HH:mm', {
                locale: fr,
              })}
            </p>
          </div>
        </div>
      </div>

      <Drawer.Footer>
        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onClose}
            disabled={isDeleting}
          >
            Fermer
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
            loading={isDeleting}
          >
            Supprimer la tâche
          </Button>
        </div>
      </Drawer.Footer>
    </>
  );
}
