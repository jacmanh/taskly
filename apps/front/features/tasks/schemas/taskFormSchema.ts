import { z } from 'zod';
import { TaskStatus, TaskPriority } from '@taskly/types';

export const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  description: z
    .string()
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .optional()
    .or(z.literal('')),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  dueDate: z.string().optional().or(z.literal('')),
  assignedToId: z.string().optional().or(z.literal('')),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;

export const DEFAULT_TASK_VALUES: TaskFormData = {
  title: '',
  description: '',
  status: TaskStatus.TODO,
  priority: TaskPriority.MEDIUM,
  dueDate: '',
  assignedToId: '',
};
