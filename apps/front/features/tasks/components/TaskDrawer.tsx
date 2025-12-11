'use client';

import {
  Drawer,
  Button,
  useConfirmationModal,
  EditableInput,
  EditableTextarea,
  EditableSelect,
  DatePicker,
} from '@taskly/design-system';
import type { Task, Workspace } from '@taskly/types';
import { TaskStatus, TaskPriority } from '@taskly/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { User, Clock } from 'lucide-react';
import { useDeleteTask, useUpdateTask, useTask } from '../hooks/useTasks';
import {
  TaskFormData,
  taskFormSchema,
  zodFieldValidator,
} from '../schemas/taskFormSchema';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getTaskPriorityLabel, getTaskStatusLabel } from '../utils/task-labels';

interface TaskDrawerProps {
  task: Task;
  workspace: Workspace;
  onClose: () => void;
}

export function TaskDrawer({
  task: initialTask,
  workspace,
  onClose,
}: TaskDrawerProps) {
  const t = useTranslations('tasks');
  const { data: task = initialTask } = useTask(workspace.id, initialTask.id);

  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const { show: showConfirmationModal } = useConfirmationModal();

  const { mutate: updateTask } = useUpdateTask();

  const handleUpdateTask = (
    field: keyof TaskFormData,
    value?: string | Date
  ) => {
    let processedValue: string | null = null;

    if (value instanceof Date) {
      processedValue = value.toISOString();
    } else if (value !== undefined) {
      processedValue = value;
    }

    updateTask({
      workspaceId: workspace.id,
      taskId: task.id,
      input: { [field]: processedValue },
    });
  };

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
        <EditableInput
          label="Titre"
          value={task.title}
          validate={zodFieldValidator(taskFormSchema.shape.title)}
          onSave={(value) => {
            handleUpdateTask('title', value as string);
          }}
        />

        {/* Description */}
        <EditableTextarea
          label="Description"
          value={task.description || ''}
          validate={zodFieldValidator(taskFormSchema.shape.description)}
          onSave={(value) => {
            handleUpdateTask('description', value as string);
          }}
        />

        {/* Status & Priority */}
        <EditableSelect
          label="Statut"
          value={task.status}
          options={Object.values(TaskStatus).map((status) => ({
            value: status,
            label: getTaskStatusLabel(status, t),
          }))}
          onSave={(value) => {
            handleUpdateTask('status', value as TaskStatus);
          }}
        />
        <EditableSelect
          label="Priorité"
          value={task.priority}
          options={Object.values(TaskPriority).map((priority) => ({
            value: priority,
            label: getTaskPriorityLabel(priority, t),
          }))}
          onSave={(value) => {
            handleUpdateTask('priority', value as TaskPriority);
          }}
        />
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
              <Image
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
      <DatePicker
        mode="single"
        label="Date d'échéance"
        value={task.dueDate ? new Date(task.dueDate) : undefined}
        onChange={(date) => {
          handleUpdateTask('dueDate', date as Date);
        }}
      />

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
            <Image
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
