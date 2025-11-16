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
  slug: z
    .string()
    .min(1, 'Le slug est requis')
    .min(3, 'Le slug doit contenir au moins 3 caractères')
    .max(50, 'Le slug ne peut pas dépasser 50 caractères')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets'
    ),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Couleur invalide'),
  icon: z.string().min(1, 'Icône requise'),
});

export type WorkspaceFormData = z.infer<typeof workspaceFormSchema>;
