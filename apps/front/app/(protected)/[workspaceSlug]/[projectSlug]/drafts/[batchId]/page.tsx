'use client';

import { useParams, useRouter } from 'next/navigation';
import { Suspense, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Spinner, Textarea, useDrawer } from '@taskly/design-system';
import { ArrowLeft, Sparkles, Check, X } from 'lucide-react';

import { useWorkspaceContext } from '@features/workspaces/contexts/WorkspaceContext';
import { useSuspenseWorkspaceProjects } from '@features/projects/hooks/useProjects';
import {
  useGenerateTasks,
  useRegenerateBatch,
} from '@features/ai/hooks/useGenerateTasks';
import {
  useDraftBatch,
  useUpdateDraftItem,
  useAcceptBatch,
  useCancelBatch,
} from '@features/task-drafts/hooks/useTaskDrafts';
import { DraftItemsTable } from '@features/task-drafts/components/DraftItemsTable';
import { TaskDraftDrawer } from '@features/task-drafts/components/TaskDraftDrawer';
import { FullPageLoading } from '../../../../../components/FullPageLoading';
import type { TaskDraftItem } from '@taskly/types';

const promptSchema = z.object({
  prompt: z.string().min(1, 'Le prompt est requis').max(1000),
});

type PromptFormData = z.infer<typeof promptSchema>;

export default function DraftPage() {
  const { currentWorkspace } = useWorkspaceContext();

  if (!currentWorkspace) {
    return <FullPageLoading />;
  }

  return (
    <Suspense fallback={<FullPageLoading />}>
      <DraftPageContent workspaceId={currentWorkspace.id} />
    </Suspense>
  );
}

function DraftPageContent({ workspaceId }: { workspaceId: string }) {
  const params = useParams<{
    workspaceSlug: string;
    projectSlug: string;
    batchId: string;
  }>();
  const router = useRouter();
  const { openDrawer } = useDrawer();

  const isNew = params?.batchId === 'new';
  const batchId = isNew ? undefined : params?.batchId;

  const { data: projects = [] } = useSuspenseWorkspaceProjects(workspaceId);
  const project = projects.find((p) => p.slug === params?.projectSlug);

  const { data: batch, isLoading: isBatchLoading } = useDraftBatch(
    workspaceId,
    batchId
  );

  const { mutate: generateTasks, isPending: isGenerating } = useGenerateTasks();
  const { mutate: regenerateBatch, isPending: isRegenerating } =
    useRegenerateBatch();
  const { mutate: updateDraftItem } = useUpdateDraftItem();
  const { mutate: acceptBatch, isPending: isAccepting } = useAcceptBatch();
  const { mutate: cancelBatch, isPending: isCancelling } = useCancelBatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
    defaultValues: { prompt: batch?.prompt || '' },
    values: batch ? { prompt: batch.prompt } : undefined,
  });

  const onSubmit = useCallback(
    (data: PromptFormData) => {
      if (!project) return;

      if (isNew) {
        generateTasks(
          {
            workspaceId,
            projectId: project.id,
            prompt: data.prompt,
          },
          {
            onSuccess: (newBatch) => {
              router.replace(
                `/${params?.workspaceSlug}/${params?.projectSlug}/drafts/${newBatch.id}`
              );
            },
          }
        );
      } else if (batchId) {
        regenerateBatch({
          workspaceId,
          batchId,
          projectId: project.id,
          prompt: data.prompt,
        });
      }
    },
    [
      project,
      isNew,
      generateTasks,
      regenerateBatch,
      workspaceId,
      batchId,
      params?.workspaceSlug,
      params?.projectSlug,
      router,
    ]
  );

  const handleToggleEnabled = useCallback(
    (item: TaskDraftItem, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!batchId) return;
      updateDraftItem({
        workspaceId,
        itemId: item.id,
        batchId,
        input: { enabled: !item.enabled },
      });
    },
    [workspaceId, batchId, updateDraftItem]
  );

  const handleRowClick = useCallback(
    (item: TaskDraftItem) => {
      if (!batchId) return;
      openDrawer({
        children: (
          <TaskDraftDrawer
            item={item}
            workspaceId={workspaceId}
            batchId={batchId}
          />
        ),
      });
    },
    [workspaceId, batchId, openDrawer]
  );

  const handleAccept = useCallback(() => {
    if (!batchId || !project) return;
    acceptBatch(
      {
        workspaceId,
        batchId,
        projectId: project.id,
      },
      {
        onSuccess: () => {
          router.push(
            `/${params?.workspaceSlug}/${params?.projectSlug}/drafts`
          );
        },
      }
    );
  }, [
    workspaceId,
    batchId,
    project,
    acceptBatch,
    router,
    params?.workspaceSlug,
    params?.projectSlug,
  ]);

  const handleCancel = useCallback(() => {
    if (!batchId || !project) return;
    cancelBatch(
      {
        workspaceId,
        batchId,
        projectId: project.id,
      },
      {
        onSuccess: () => {
          router.push(
            `/${params?.workspaceSlug}/${params?.projectSlug}/drafts`
          );
        },
      }
    );
  }, [
    workspaceId,
    batchId,
    project,
    cancelBatch,
    router,
    params?.workspaceSlug,
    params?.projectSlug,
  ]);

  const isPending = isGenerating || isRegenerating;
  const isBatchPending = batch?.status === 'PENDING';

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back link */}
        <button
          onClick={() =>
            router.push(
              `/${params?.workspaceSlug}/${params?.projectSlug}/drafts`
            )
          }
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux brouillons
        </button>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              {batch?.title || 'Nouvelle génération IA'}
            </h1>
          </div>
          {batch && isBatchPending && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isCancelling}
              >
                <X className="w-4 h-4" />
                {isCancelling ? 'Annulation...' : 'Annuler'}
              </Button>
              <Button
                variant="primary"
                onClick={handleAccept}
                disabled={isAccepting}
              >
                <Check className="w-4 h-4" />
                {isAccepting ? 'Acceptation...' : 'Accepter les tâches'}
              </Button>
            </div>
          )}
        </div>

        {/* Prompt form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-lg border border-neutral-200 p-4"
        >
          <Textarea
            label="Prompt"
            placeholder="Décrivez les tâches à créer, ex: Implémenter l'authentification avec login, inscription et reset mot de passe"
            error={errors.prompt?.message}
            rows={10}
            disabled={isPending}
            {...register('prompt')}
          />
          <div className="flex justify-end">
            <Button variant="primary" type="submit" disabled={isPending}>
              <Sparkles className="w-4 h-4" />
              {isPending
                ? 'Génération en cours...'
                : isNew
                  ? 'Générer'
                  : 'Régénérer'}
            </Button>
          </div>
          {isPending && (
            <div className="flex items-center gap-3 rounded-lg bg-accent-50 p-4">
              <Spinner size="sm" />
              <span className="text-sm text-accent-700">
                Génération en cours...
              </span>
            </div>
          )}
        </form>

        {/* Items table */}
        {isBatchLoading && !isNew && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {batch?.items && batch.items.length > 0 && (
          <DraftItemsTable
            items={batch.items}
            onRowClick={handleRowClick}
            onToggleEnabled={handleToggleEnabled}
          />
        )}
      </div>
    </div>
  );
}
