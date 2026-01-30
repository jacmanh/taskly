'use client';

import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Drawer, Button, Textarea, Spinner } from '@taskly/design-system';
import { TaskStatus, TaskPriority } from '@taskly/types';
import { useGenerateTasks } from '../hooks/useGenerateTasks';
import { useCreateManyTasks } from '@features/tasks/hooks/useTasks';
import {
  generateTasksSchema,
  GenerateTasksFormData,
} from '../schemas/generateTasksSchema';
import type { GeneratedTask } from '../services/ai.service';

import '@features/tasks/styles/tasks.css';

interface GenerateTasksFormProps {
  workspaceId: string;
  projectId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PRIORITY_BADGE_CLASSES: Record<string, string> = {
  LOW: 'badge-low',
  MEDIUM: 'badge-medium',
  HIGH: 'badge-high',
};

export function GenerateTasksForm({
  workspaceId,
  projectId,
  onSuccess,
  onCancel,
}: GenerateTasksFormProps) {
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([]);
  const { mutate: generateTasks, isPending: isGenerating } = useGenerateTasks();
  const { mutate: createManyTasks, isPending: isCreating } =
    useCreateManyTasks();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GenerateTasksFormData>({
    resolver: zodResolver(generateTasksSchema),
    defaultValues: { prompt: '' },
  });

  const onSubmit = useCallback(
    (data: GenerateTasksFormData) => {
      generateTasks(
        { workspaceId, projectId, prompt: data.prompt },
        {
          onSuccess: (tasks) => {
            setGeneratedTasks(tasks);
          },
        }
      );
    },
    [generateTasks, workspaceId, projectId]
  );

  const handleCreateAll = useCallback(() => {
    if (generatedTasks.length === 0) return;

    const inputs = generatedTasks.map((task) => ({
      title: task.title,
      description: task.description,
      priority: task.priority as TaskPriority,
      status: task.status as TaskStatus,
      projectId,
    }));

    createManyTasks(
      {
        workspaceId,
        inputs,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  }, [generatedTasks, createManyTasks, workspaceId, projectId, onSuccess]);

  const hasResults = generatedTasks.length > 0;

  return (
    <>
      <Drawer.Header
        title="Générer des tâches"
        description="Décrivez les tâches à générer par l'IA"
      />

      {!hasResults ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Textarea
            label="Prompt"
            placeholder="Décrivez les tâches à créer, ex: Implémenter l'authentification avec login, inscription et reset mot de passe"
            error={errors.prompt?.message}
            rows={6}
            disabled={isGenerating}
            {...register('prompt')}
          />

          {isGenerating && (
            <div className="flex items-center gap-3 rounded-lg bg-accent-50 p-4">
              <Spinner size="sm" />
              <span className="text-sm text-accent-700">
                Génération en cours...
              </span>
            </div>
          )}
        </form>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-neutral-500">
            {generatedTasks.length} tâche(s) générée(s)
          </p>
          <ul className="space-y-3">
            {generatedTasks.map((task, index) => (
              <li
                key={index}
                className="rounded-lg border border-neutral-200 p-4 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-neutral-900">
                    {task.title}
                  </span>
                  <span
                    className={`badge ${PRIORITY_BADGE_CLASSES[task.priority] ?? 'badge-neutral'}`}
                  >
                    {task.priority}
                  </span>
                </div>
                <p className="text-sm text-neutral-600">{task.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Drawer.Footer>
        <Button
          variant="outline"
          onClick={() => {
            reset();
            setGeneratedTasks([]);
            onCancel?.();
          }}
          disabled={isGenerating || isCreating}
        >
          Annuler
        </Button>

        {!hasResults ? (
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={isGenerating}
          >
            {isGenerating ? 'Génération...' : 'Générer'}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleCreateAll}
            disabled={isCreating}
          >
            {isCreating ? 'Création...' : 'Créer les tâches'}
          </Button>
        )}
      </Drawer.Footer>
    </>
  );
}
