'use client';

import {
  Drawer,
  Button,
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@taskly/design-system';
import { useTaskForm } from '../hooks/useTaskForm';
import type { Task } from '@taskly/types';
import { TaskStatus, TaskPriority } from '@taskly/types';
import { Controller } from 'react-hook-form';

interface TaskFormProps {
  workspaceId: string;
  projectId: string;
  task?: Task;
  onSuccess?: (task: Task) => void;
  onCancel?: () => void;
}

export function TaskForm({
  workspaceId,
  projectId,
  task,
  onSuccess,
  onCancel,
}: TaskFormProps) {
  const { form, onSubmit, isPending } = useTaskForm({
    workspaceId,
    projectId,
    task,
    onSuccess,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = form;

  const isEditing = !!task;

  return (
    <>
      <Drawer.Header
        title={isEditing ? 'Modifier la tâche' : 'Créer une tâche'}
        description={
          isEditing
            ? 'Modifiez les informations de la tâche'
            : 'Ajoutez nouvelle tâche au projet'
        }
      />

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-5">
        {/* Title */}
        <Input
          label="Titre"
          placeholder="Titre de la tâche"
          error={errors.title?.message}
          required
          {...register('title')}
        />

        {/* Description */}
        <Textarea
          label="Description"
          placeholder="Description de la tâche (optionnel)"
          error={errors.description?.message}
          rows={4}
          {...register('description')}
        />

        {/* Status */}
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <div>
              <label
                htmlFor="status"
                className="mb-1 block text-sm font-medium text-neutral-700"
              >
                Statut
              </label>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isPending}
              >
                <SelectTrigger id="status" aria-label="Statut de la tâche">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaskStatus.TODO}>À faire</SelectItem>
                  <SelectItem value={TaskStatus.IN_PROGRESS}>
                    En cours
                  </SelectItem>
                  <SelectItem value={TaskStatus.DONE}>Terminé</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="mt-1 text-sm text-error-600">
                  {errors.status.message}
                </p>
              )}
            </div>
          )}
        />

        {/* Priority */}
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <div>
              <label
                htmlFor="priority"
                className="mb-1 block text-sm font-medium text-neutral-700"
              >
                Priorité
              </label>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isPending}
              >
                <SelectTrigger id="priority" aria-label="Priorité de la tâche">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaskPriority.LOW}>Basse</SelectItem>
                  <SelectItem value={TaskPriority.MEDIUM}>Moyenne</SelectItem>
                  <SelectItem value={TaskPriority.HIGH}>Haute</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="mt-1 text-sm text-error-600">
                  {errors.priority.message}
                </p>
              )}
            </div>
          )}
        />

        {/* Due Date */}
        <Input
          label="Date d'échéance"
          type="date"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />
      </form>

      <Drawer.Footer>
        <Button
          variant="outline"
          onClick={() => {
            reset();
            onCancel?.();
          }}
          disabled={isPending}
        >
          Annuler
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={isPending}
        >
          {isPending ? 'En cours...' : isEditing ? 'Modifier' : 'Créer'}
        </Button>
      </Drawer.Footer>
    </>
  );
}
