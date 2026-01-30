'use client';

import {
  Drawer,
  EditableInput,
  EditableTextarea,
  EditableSelect,
  DatePicker,
  EditableAutocomplete,
  MarkdownRenderer,
} from '@taskly/design-system';
import type { Task, Workspace } from '@taskly/types';
import { TaskStatus, TaskPriority } from '@taskly/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import { useUpdateTask, useTask } from '../hooks/useTasks';
import {
  TaskFormData,
  taskFormSchema,
  zodFieldValidator,
} from '../schemas/taskFormSchema';
import { useTranslations } from 'next-intl';
import { getTaskPriorityLabel, getTaskStatusLabel } from '../utils/task-labels';
import { workspacesService } from '@taskly/data-access';

interface TaskDrawerProps {
  task: Task;
  workspace: Workspace;
}

export function TaskDrawer({ task: initialTask, workspace }: TaskDrawerProps) {
  const t = useTranslations('tasks');
  const { data: task = initialTask } = useTask(workspace.id, initialTask.id);

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

  // Async search function for user autocomplete - calls API endpoint
  const handleUserSearch = async (query: string, signal?: AbortSignal) => {
    const users = await workspacesService.getWorkspaceUsers(
      workspace.id,
      query,
      signal
    );

    // Map to AutocompleteOption format
    return users.map((user) => ({
      value: user.id,
      label: user.name || user.email,
    }));
  };

  return (
    <>
      <Drawer.Header
        title={task.title}
        description={`Créé le ${format(new Date(task.createdAt), 'dd MMMM yyyy', { locale: fr })}`}
      />

      <div className="w-full space-y-6">
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
          renderView={(value) => <MarkdownRenderer content={value} />}
          onSave={(value) => {
            handleUpdateTask('description', value as string);
          }}
        />

        {/* Status & Priority */}
        <div className="flex flex-col gap-2">
          <EditableSelect
            label="Statut"
            inline
            value={task.status}
            labelClassName="w-32"
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
            inline
            value={task.priority}
            labelClassName="w-32"
            options={Object.values(TaskPriority).map((priority) => ({
              value: priority,
              label: getTaskPriorityLabel(priority, t),
            }))}
            onSave={(value) => {
              handleUpdateTask('priority', value as TaskPriority);
            }}
          />
        </div>
      </div>

      {/* Assigned To */}

      <EditableAutocomplete
        label="Assigné à"
        labelClassName="w-32"
        value={task.assignedTo?.id}
        inline
        onSearch={handleUserSearch}
        onSave={(value) => {
          handleUpdateTask('assignedToId', value);
        }}
        renderValue={() => {
          return (
            task.assignedTo?.name || task.assignedTo?.email || 'Unassigned'
          );
        }}
        emptyPlaceholder="Unassigned"
      />

      {/* Due Date */}
      <DatePicker
        mode="single"
        label="Date d'échéance"
        inline
        labelClassName="w-32"
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

      <Drawer.Footer>
        <div className="text-xs text-neutral-500 space-y-1">
          <p>
            Créé par{' '}
            <span className="font-bold text-neutral-900">
              {task.createdBy.name || task.createdBy.email}
            </span>{' '}
            le{' '}
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
      </Drawer.Footer>
    </>
  );
}
