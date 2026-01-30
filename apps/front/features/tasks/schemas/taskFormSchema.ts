import { z } from 'zod';
import { TaskStatus, TaskPriority } from '@taskly/types';

/**
 * Creates a validation function from a Zod schema for use with EditableInput
 */
export const zodFieldValidator = <T extends z.ZodType>(schema: T) => {
  return (value: string | number): string | undefined => {
    const result = schema.safeParse(value);
    return result.success ? undefined : result.error.issues[0].message;
  };
};

export const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  description: z
    .string()
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
