import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import type { Task } from '@taskly/types';
import { useCreateTask, useUpdateTask } from './useTasks';
import {
  taskFormSchema,
  type TaskFormData,
  DEFAULT_TASK_VALUES,
} from '../schemas/taskFormSchema';

interface UseTaskFormProps {
  workspaceId: string;
  projectId: string;
  task?: Task;
  onSuccess?: (task: Task) => void;
}

export function useTaskForm({
  workspaceId,
  projectId,
  task,
  onSuccess,
}: UseTaskFormProps) {
  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description || '',
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate
            ? new Date(task.dueDate).toISOString().split('T')[0]
            : '',
          assignedToId: task.assignedToId || '',
        }
      : DEFAULT_TASK_VALUES,
    mode: 'onChange',
  });

  const onSubmit = useCallback(
    (data: TaskFormData) => {
      const input = {
        title: data.title,
        description: data.description || undefined,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        projectId,
        assignedToId: data.assignedToId || undefined,
      };

      if (task) {
        // Update existing task
        updateTask(
          {
            workspaceId,
            taskId: task.id,
            input,
          },
          {
            onSuccess: (updatedTask) => {
              form.reset();
              onSuccess?.(updatedTask);
            },
          }
        );
      } else {
        // Create new task
        createTask(
          {
            workspaceId,
            input,
          },
          {
            onSuccess: (createdTask) => {
              form.reset();
              onSuccess?.(createdTask);
            },
          }
        );
      }
    },
    [createTask, updateTask, form, workspaceId, projectId, task, onSuccess]
  );

  return {
    form,
    onSubmit,
    isPending: isCreating || isUpdating,
  };
}
