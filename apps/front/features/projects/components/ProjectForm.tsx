'use client';

import type { Project } from '@taskly/types';
import { Input, Drawer, Button, Textarea } from '@taskly/design-system';
import { useProjectForm } from '../hooks/useProjectForm';

interface ProjectFormProps {
  project?: Project;
  workspaceId?: string;
  onSuccess?: (project: Project) => void;
  onCancel?: () => void;
}

export function ProjectForm({
  project,
  workspaceId,
  onSuccess,
  onCancel,
}: ProjectFormProps) {
  const isEditing = !!project;
  const { form, onSubmit, isPending } = useProjectForm({
    workspaceId,
    project,
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = form;

  const title = isEditing ? 'Modifier le projet' : 'Créer un projet';
  const description = isEditing
    ? 'Mettez à jour les informations de votre projet.'
    : 'Ajoutez un projet à votre workspace actif.';
  const submitButtonText = isEditing ? 'Sauvegarder' : 'Créer';

  return (
    <>
      <Drawer.Header title={title} description={description} />

      <div className="space-y-5">
        <div className="space-y-3">
          <Input
            id="project-name"
            label="Nom du projet"
            placeholder="Roadmap 2025"
            disabled={isPending}
            required
            autoFocus
            error={errors.name?.message}
            {...register('name')}
          />

          <Textarea
            id="project-description"
            label="Description"
            placeholder="Décrivez rapidement votre projet"
            disabled={isPending}
            rows={4}
            error={errors.description?.message}
            {...register('description')}
          />
        </div>
      </div>

      <Drawer.Footer>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset();
            onCancel?.();
          }}
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          Annuler
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleSubmit(onSubmit(onSuccess))}
          disabled={!isValid || isPending}
          loading={isPending}
          className="w-full sm:w-auto"
        >
          {submitButtonText}
        </Button>
      </Drawer.Footer>
    </>
  );
}
