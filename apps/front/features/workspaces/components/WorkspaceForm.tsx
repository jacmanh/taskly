'use client';

import { Controller } from 'react-hook-form';
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
    control,
    setValue,
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
              Le nom visible pour votre workspace
            </p>
          )}
        </div>

        {/* Workspace Slug */}
        <div>
          <Input
            id="slug"
            label="Slug"
            placeholder="mon-super-projet"
            disabled={isPending}
            required
            error={errors.slug?.message}
            {...register('slug', {
              onChange: (e) => {
                const slug = e.target.value.toLowerCase().replace(/\s+/g, '-');
                setValue('slug', slug);
              },
            })}
          />
          {!errors.slug && (
            <p className="mt-1 text-xs text-secondary-500">
              URL-friendly identifier (caractères minuscules et tirets)
            </p>
          )}
        </div>

        {/* Color Picker */}
        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium text-secondary-700">
                Couleur
              </label>
              <div className="mt-2 flex gap-2 flex-wrap">
                {[
                  '#0ea5e9', // sky
                  '#06b6d4', // cyan
                  '#10b981', // emerald
                  '#f59e0b', // amber
                  '#ef4444', // red
                  '#d946ef', // magenta
                  '#8b5cf6', // violet
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => field.onChange(color)}
                    disabled={isPending}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      field.value === color
                        ? 'border-secondary-900 scale-110'
                        : 'border-secondary-200'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          )}
        />

        {/* Icon Picker */}
        <Controller
          name="icon"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium text-secondary-700">
                Icône
              </label>
              <div className="mt-2 flex gap-2 flex-wrap">
                {['📋', '🎯', '🚀', '💼', '⚡', '🎨', '📊', '🔧'].map(
                  (icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => field.onChange(icon)}
                      disabled={isPending}
                      className={`text-2xl w-10 h-10 rounded-md border-2 transition-all flex items-center justify-center ${
                        field.value === icon
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-secondary-200'
                      }`}
                    >
                      {icon}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        />

        {/* Info Box */}
        <div className="p-3 bg-primary-50 border border-primary-200 rounded-md">
          <p className="text-xs text-primary-900">
            ℹ️ Vous serez automatiquement ajouté comme propriétaire du
            workspace.
          </p>
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
