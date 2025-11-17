import { z } from 'zod';

/**
 * Form validation schema for project creation
 */
export const projectFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(60, 'Le nom ne peut pas dépasser 60 caractères'),
  description: z
    .string()
    .max(200, 'La description ne peut pas dépasser 200 caractères')
    .optional()
    .or(z.literal('')),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;
