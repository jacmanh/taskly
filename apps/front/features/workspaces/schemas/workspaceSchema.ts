import { z } from 'zod';

/**
 * Schéma de validation pour la création/édition d'un workspace
 */
export const workspaceFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  context: z
    .string()
    .max(500, 'Le contexte ne peut pas dépasser 500 caractères')
    .optional()
    .or(z.literal('')),
});

export type WorkspaceFormData = z.infer<typeof workspaceFormSchema>;
