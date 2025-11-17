'use client';

import { Input, Drawer, Button, cn, Textarea } from '@taskly/design-system';
import { useProjectForm } from '../hooks/useProjectForm';

interface ProjectFormProps {
  workspaceId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProjectForm({
  workspaceId,
  onSuccess,
  onCancel,
}: ProjectFormProps) {
  const { form, onSubmit, isPending } = useProjectForm(workspaceId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = form;

  return (
    <>
      <Drawer.Header
        title="Créer un projet"
        description="Ajoutez un projet à votre workspace actif."
      />

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
        <div className="flex gap-3 w-full">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              reset();
              onCancel?.();
            }}
            disabled={isPending}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium',
              'border border-secondary-300 text-secondary-700',
              'hover:bg-secondary-100 active:bg-secondary-200',
              'transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'w-full sm:w-auto'
            )}
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(onSubmit(onSuccess))}
            disabled={!isValid || isPending}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium',
              'bg-primary-600 text-white',
              'hover:bg-primary-700 active:bg-primary-800',
              'transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'w-full sm:w-auto'
            )}
          >
            {isPending ? 'Création...' : 'Créer'}
          </Button>
        </div>
      </Drawer.Footer>
    </>
  );
}
