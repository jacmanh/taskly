import { z } from 'zod';

export const generateTasksSchema = z.object({
  prompt: z
    .string()
    .min(1, 'Le prompt est requis')
    .max(1000, 'Le prompt ne peut pas dépasser 1000 caractères'),
});

export type GenerateTasksFormData = z.infer<typeof generateTasksSchema>;
