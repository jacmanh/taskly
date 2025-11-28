import type { TelemetryAttributes, TelemetryEvent } from './index';

/**
 * Task Inline Edit Telemetry Events
 *
 * These events track user interactions with inline editable task fields in the task viewer.
 * They are used to measure success criteria SC-001 through SC-003:
 * - SC-001: <1s p95 latency for inline field saves
 * - SC-002: <5% failure rate on inline edits
 * - SC-003: 50%+ reduction in task viewer→edit page navigations
 *
 * Event Flow:
 * 1. `started` - User enters edit mode for a field (click/focus)
 * 2. `saved` - User successfully saves the edit (outcome: success)
 * 3. `cancelled` - User cancels the edit (outcome: cancelled)
 * 4. `failed` - Save operation fails (outcome: validation_error | conflict | network_error | permission_error)
 *
 * @example
 * ```ts
 * // When user starts editing
 * trackEvent(buildInlineEditEvent('task_inline_edit_started', {
 *   taskId: 'task-123',
 *   field: 'title',
 *   userId: 'user-456'
 * }));
 *
 * // When save succeeds
 * trackEvent(buildInlineEditEvent('task_inline_edit_saved', {
 *   taskId: 'task-123',
 *   field: 'title',
 *   durationMs: 450,
 *   outcome: 'success',
 *   userId: 'user-456'
 * }));
 * ```
 */
export const TASK_INLINE_EDIT_EVENTS = {
  /** User entered edit mode for a field */
  started: 'task_inline_edit_started',
  /** Edit was successfully saved */
  saved: 'task_inline_edit_saved',
  /** User cancelled the edit without saving */
  cancelled: 'task_inline_edit_cancelled',
  /** Save operation failed */
  failed: 'task_inline_edit_failed',
} as const;

export type TaskInlineEditEventName =
  (typeof TASK_INLINE_EDIT_EVENTS)[keyof typeof TASK_INLINE_EDIT_EVENTS];

/**
 * Outcome classification for inline edit operations.
 * Used for alerting and dashboard metrics.
 */
export type InlineEditOutcome =
  /** Edit saved successfully */
  | 'success'
  /** User explicitly cancelled */
  | 'cancelled'
  /** Client-side validation failed */
  | 'validation_error'
  /** Server detected concurrent edit conflict (409 response) */
  | 'conflict'
  /** Network failure or API error */
  | 'network_error'
  /** User lacks edit permission (403 response) */
  | 'permission_error'
  /** Offline/connectivity issue */
  | 'offline';

/**
 * Attributes attached to all inline edit telemetry events.
 */
export interface TaskInlineEditAttributes extends TelemetryAttributes {
  /** ID of the task being edited */
  taskId: string;
  /** Name of the field being edited (title, description, status, dueDate, etc.) */
  field: string;
  /** Time elapsed from edit start to save/cancel (milliseconds) */
  durationMs?: number;
  /** Outcome of the edit operation */
  outcome?: InlineEditOutcome;
  /** ID of the user performing the edit (for aggregation) */
  userId?: string;
  /** Error message if operation failed */
  errorMessage?: string;
  /** HTTP status code for API errors */
  statusCode?: number;
  /** Number of retry attempts */
  retryCount?: number;
}

/**
 * Build a telemetry event for inline edit tracking.
 *
 * @param name - Event name from TASK_INLINE_EDIT_EVENTS
 * @param attributes - Event attributes including taskId, field, outcome, etc.
 * @returns Structured telemetry event ready to send to analytics backend
 *
 * @example
 * ```ts
 * const event = buildInlineEditEvent('task_inline_edit_failed', {
 *   taskId: 'task-123',
 *   field: 'title',
 *   outcome: 'validation_error',
 *   durationMs: 230,
 *   userId: 'user-456',
 *   errorMessage: 'Title cannot be empty'
 * });
 * ```
 */
export function buildInlineEditEvent(
  name: TaskInlineEditEventName,
  attributes: TaskInlineEditAttributes
): TelemetryEvent<TaskInlineEditAttributes> {
  return {
    name,
    attributes,
  };
}
