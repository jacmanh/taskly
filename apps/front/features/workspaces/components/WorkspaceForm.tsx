'use client';

import { Input, Drawer, cn, Button } from '@taskly/design-system';
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
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Loading...
              </span>
            ) : (
              'Créer'
            )}
          </Button>
        </div>
      </Drawer.Footer>
    </>
  );
}
