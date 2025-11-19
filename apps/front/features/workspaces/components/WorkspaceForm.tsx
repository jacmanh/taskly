'use client';

import { Input, Drawer, Button } from '@taskly/design-system';
import { useWorkspaceForm } from '../hooks/useWorkspaceForm';

interface WorkspaceFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function WorkspaceForm({ onSuccess, onCancel }: WorkspaceFormProps) {
  const { form, onSubmit, isPending } = useWorkspaceForm();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = form;

  return (
    <>
      <Drawer.Header
        title="Créer un nouveau workspace"
        description="Configurez votre nouveau workspace pour organiser vos tâches"
      />

      <div className="space-y-5">
        {/* Workspace Name */}
        <div>
          <Input
            id="name"
            label="Nom du workspace"
            placeholder="Mon super projet"
            disabled={isPending}
            required
            autoFocus
            error={errors.name?.message}
            {...register('name')}
          />
          {!errors.name && (
            <p className="mt-1 text-xs text-secondary-500">
              Le nom de votre workspace
            </p>
          )}
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
          Créer
        </Button>
      </Drawer.Footer>
    </>
  );
}
