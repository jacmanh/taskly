import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task, InlineEditableField, InlineEditPayload } from '@taskly/types';
import { tasksService } from '../services/tasks.service';
import { tasksQueryKeys } from '../constants/query-keys';
import { trackEvent } from '@taskly/telemetry';
import {
  TASK_INLINE_EDIT_EVENTS,
  buildInlineEditEvent,
  type InlineEditOutcome,
  type TaskInlineEditAttributes,
} from '@taskly/telemetry';
import { useAuth } from '@features/auth/hooks/useAuth';
import { ConflictException } from '@/lib/exceptions';

interface InlineEditMutationParams {
  workspaceId: string;
  taskId: string;
  field: InlineEditableField;
  value: unknown;
  previousValue: unknown;
  updatedAt?: string; // For optimistic concurrency control
}

interface UseInlineTaskEditOptions {
  onSuccess?: (task: Task) => void;
  onError?: (error: Error, context: InlineEditMutationParams) => void;
  onConflict?: (latestTask: Task) => void;
}

/**
 * React Query mutation hook for inline task field editing.
 *
 * Features:
 * - Optimistic updates for instant UI feedback
 * - Automatic cache invalidation and rollback on error
 * - Telemetry tracking for SC-001, SC-002, SC-003
 * - Conflict detection (409) with latest task data
 * - Type-safe field editing with InlineEditableField union
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useInlineTaskEdit();
 *
 * const handleSaveTitle = (newTitle: string) => {
 *   mutate({
 *     workspaceId: 'workspace-123',
 *     taskId: 'task-456',
 *     field: 'title',
 *     value: newTitle,
 *     previousValue: task.title,
 *     updatedAt: task.updatedAt,
 *   });
 * };
 * ```
 */
export function useInlineTaskEdit(options?: UseInlineTaskEditOptions) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      workspaceId,
      taskId,
      field,
      value,
      updatedAt,
    }: InlineEditMutationParams): Promise<Task> => {
      const startTime = Date.now();

      // Track edit started event
      trackEvent(
        buildInlineEditEvent(TASK_INLINE_EDIT_EVENTS.started, {
          taskId,
          field,
          userId: user?.id,
        })
      );

      try {
        // Build update payload with only the changed field
        const updateInput: Partial<Task> = {
          [field]: value,
        };

        // Include updatedAt for optimistic concurrency control
        if (updatedAt) {
          updateInput.updatedAt = updatedAt;
        }

        const updatedTask = await tasksService.update(
          workspaceId,
          taskId,
          updateInput
        );

        const durationMs = Date.now() - startTime;

        // Track successful save
        trackEvent(
          buildInlineEditEvent(TASK_INLINE_EDIT_EVENTS.saved, {
            taskId,
            field,
            durationMs,
            outcome: 'success',
            userId: user?.id,
          })
        );

        return updatedTask;
      } catch (error: any) {
        const durationMs = Date.now() - startTime;
        let outcome: InlineEditOutcome = 'network_error';
        let statusCode: number | undefined;
        let errorMessage: string = error.message || 'Unknown error';

        // Classify error for telemetry
        if (error.response) {
          statusCode = error.response.status;

          switch (statusCode) {
            case 400:
              outcome = 'validation_error';
              errorMessage = error.response.data?.message || 'Validation failed';
              break;
            case 403:
              outcome = 'permission_error';
              errorMessage =
                error.response.data?.message ||
                'You do not have permission to edit this task';
              break;
            case 409:
              outcome = 'conflict';
              errorMessage =
                error.response.data?.message ||
                'Task was modified by another user';
              break;
            default:
              outcome = 'network_error';
          }
        } else if (error.message?.includes('offline') || error.code === 'ECONNABORTED') {
          outcome = 'offline';
        }

        // Track failure event
        trackEvent(
          buildInlineEditEvent(TASK_INLINE_EDIT_EVENTS.failed, {
            taskId,
            field,
            durationMs,
            outcome,
            userId: user?.id,
            errorMessage,
            statusCode,
          })
        );

        throw error;
      }
    },

    onMutate: async ({
      taskId,
      field,
      value,
    }: InlineEditMutationParams) => {
      // Cancel outgoing refetches to prevent overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: tasksQueryKeys.detail(taskId),
      });

      // Snapshot current value for rollback
      const previousTask = queryClient.getQueryData<Task>(
        tasksQueryKeys.detail(taskId)
      );

      // Optimistically update the cache
      if (previousTask) {
        queryClient.setQueryData<Task>(tasksQueryKeys.detail(taskId), {
          ...previousTask,
          [field]: value,
          updatedAt: new Date().toISOString(), // Optimistic timestamp
        });
      }

      // Return context for rollback
      return { previousTask };
    },

    onSuccess: (updatedTask, variables) => {
      // Update detail cache with server response
      queryClient.setQueryData<Task>(
        tasksQueryKeys.detail(updatedTask.id),
        updatedTask
      );

      // Invalidate list queries to refresh with new data
      queryClient.invalidateQueries({
        queryKey: tasksQueryKeys.project(updatedTask.projectId),
      });

      queryClient.invalidateQueries({
        queryKey: tasksQueryKeys.workspace(variables.workspaceId),
      });

      options?.onSuccess?.(updatedTask);
    },

    onError: (error: any, variables, context) => {
      // Rollback optimistic update on error
      if (context?.previousTask) {
        queryClient.setQueryData<Task>(
          tasksQueryKeys.detail(variables.taskId),
          context.previousTask
        );
      }

      // Handle 409 conflict specially
      if (error.response?.status === 409 && error.response?.data?.latest) {
        const latestTask: Task = error.response.data.latest;

        // Update cache with latest server data
        queryClient.setQueryData<Task>(
          tasksQueryKeys.detail(variables.taskId),
          latestTask
        );

        options?.onConflict?.(latestTask);
      }

      options?.onError?.(error, variables);
    },

    retry: (failureCount, error: any) => {
      // Don't retry on client errors or conflicts
      const status = error.response?.status;
      if (status && status >= 400 && status < 500) {
        return false;
      }

      // Retry up to 2 times for network errors
      return failureCount < 2;
    },
  });
}

/**
 * Track inline edit cancellation.
 * Call this when user explicitly cancels an edit (Escape key, cancel button).
 *
 * @example
 * ```tsx
 * const handleCancel = () => {
 *   trackInlineEditCancelled({
 *     taskId: 'task-123',
 *     field: 'title',
 *     durationMs: Date.now() - editStartTime,
 *   });
 * };
 * ```
 */
export function trackInlineEditCancelled(params: {
  taskId: string;
  field: string;
  durationMs?: number;
  userId?: string;
}) {
  trackEvent(
    buildInlineEditEvent(TASK_INLINE_EDIT_EVENTS.cancelled, {
      ...params,
      outcome: 'cancelled',
    })
  );
}
