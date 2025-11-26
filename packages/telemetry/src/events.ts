import type { TelemetryAttributes, TelemetryEvent } from './index';

export const TASK_INLINE_EDIT_EVENTS = {
  started: 'task_inline_edit_started',
  saved: 'task_inline_edit_saved',
  cancelled: 'task_inline_edit_cancelled',
  failed: 'task_inline_edit_failed',
} as const;

export type TaskInlineEditEventName =
  (typeof TASK_INLINE_EDIT_EVENTS)[keyof typeof TASK_INLINE_EDIT_EVENTS];

export interface TaskInlineEditAttributes extends TelemetryAttributes {
  taskId: string;
  field: string;
  durationMs?: number;
  outcome?: 'success' | 'cancelled' | 'validation_error' | 'conflict' | 'offline';
}

export function buildInlineEditEvent(
  name: TaskInlineEditEventName,
  attributes: TaskInlineEditAttributes
): TelemetryEvent<TaskInlineEditAttributes> {
  return {
    name,
    attributes,
  };
}
