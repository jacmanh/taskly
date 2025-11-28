import {
  TASK_INLINE_EDIT_EVENTS,
  buildInlineEditEvent,
  type TaskInlineEditAttributes,
  type InlineEditOutcome,
} from './events';

/**
 * Integration tests for inline edit telemetry events.
 *
 * These tests ensure:
 * 1. Event structure matches telemetry schema
 * 2. All required attributes are present
 * 3. Event names are consistent with constants
 * 4. Success criteria metrics can be derived from events
 *
 * Per Constitution Principle IV: Observable Task Lifecycles
 * - All domain events must emit structured logs with correlation IDs
 * - Telemetry must support dashboard alerting within 5 minutes
 */
describe('Task Inline Edit Telemetry Events', () => {
  describe('Event Names', () => {
    it('should have unique event names for all inline edit actions', () => {
      const eventNames = Object.values(TASK_INLINE_EDIT_EVENTS);
      const uniqueNames = new Set(eventNames);
      expect(uniqueNames.size).toBe(eventNames.length);
    });

    it('should have consistent event name prefix', () => {
      const eventNames = Object.values(TASK_INLINE_EDIT_EVENTS);
      eventNames.forEach((name) => {
        expect(name).toMatch(/^task_inline_edit_/);
      });
    });

    it('should include all lifecycle events', () => {
      expect(TASK_INLINE_EDIT_EVENTS).toHaveProperty('started');
      expect(TASK_INLINE_EDIT_EVENTS).toHaveProperty('saved');
      expect(TASK_INLINE_EDIT_EVENTS).toHaveProperty('cancelled');
      expect(TASK_INLINE_EDIT_EVENTS).toHaveProperty('failed');
    });
  });

  describe('buildInlineEditEvent', () => {
    it('should build valid event for edit started', () => {
      const attributes: TaskInlineEditAttributes = {
        taskId: 'task-123',
        field: 'title',
        userId: 'user-456',
      };

      const event = buildInlineEditEvent(
        TASK_INLINE_EDIT_EVENTS.started,
        attributes
      );

      expect(event).toEqual({
        name: 'task_inline_edit_started',
        attributes: {
          taskId: 'task-123',
          field: 'title',
          userId: 'user-456',
        },
      });
    });

    it('should build valid event for successful save', () => {
      const attributes: TaskInlineEditAttributes = {
        taskId: 'task-123',
        field: 'title',
        durationMs: 450,
        outcome: 'success',
        userId: 'user-456',
      };

      const event = buildInlineEditEvent(
        TASK_INLINE_EDIT_EVENTS.saved,
        attributes
      );

      expect(event).toEqual({
        name: 'task_inline_edit_saved',
        attributes: {
          taskId: 'task-123',
          field: 'title',
          durationMs: 450,
          outcome: 'success',
          userId: 'user-456',
        },
      });

      // Verify SC-001 metrics can be derived
      expect(event.attributes.durationMs).toBeLessThan(1000); // <1s target
    });

    it('should build valid event for cancellation', () => {
      const attributes: TaskInlineEditAttributes = {
        taskId: 'task-123',
        field: 'description',
        durationMs: 2300,
        outcome: 'cancelled',
        userId: 'user-456',
      };

      const event = buildInlineEditEvent(
        TASK_INLINE_EDIT_EVENTS.cancelled,
        attributes
      );

      expect(event.name).toBe('task_inline_edit_cancelled');
      expect(event.attributes.outcome).toBe('cancelled');
    });

    it('should build valid event for validation error', () => {
      const attributes: TaskInlineEditAttributes = {
        taskId: 'task-123',
        field: 'title',
        durationMs: 150,
        outcome: 'validation_error',
        userId: 'user-456',
        errorMessage: 'Title cannot be empty',
      };

      const event = buildInlineEditEvent(
        TASK_INLINE_EDIT_EVENTS.failed,
        attributes
      );

      expect(event.name).toBe('task_inline_edit_failed');
      expect(event.attributes.outcome).toBe('validation_error');
      expect(event.attributes.errorMessage).toBe('Title cannot be empty');
    });

    it('should build valid event for conflict error (409)', () => {
      const attributes: TaskInlineEditAttributes = {
        taskId: 'task-123',
        field: 'status',
        durationMs: 520,
        outcome: 'conflict',
        userId: 'user-456',
        errorMessage: 'Task was modified by another user',
        statusCode: 409,
      };

      const event = buildInlineEditEvent(
        TASK_INLINE_EDIT_EVENTS.failed,
        attributes
      );

      expect(event.attributes.outcome).toBe('conflict');
      expect(event.attributes.statusCode).toBe(409);
    });

    it('should build valid event for network error', () => {
      const attributes: TaskInlineEditAttributes = {
        taskId: 'task-123',
        field: 'dueDate',
        durationMs: 5000,
        outcome: 'network_error',
        userId: 'user-456',
        errorMessage: 'Network request failed',
        statusCode: 0,
      };

      const event = buildInlineEditEvent(
        TASK_INLINE_EDIT_EVENTS.failed,
        attributes
      );

      expect(event.attributes.outcome).toBe('network_error');
      expect(event.attributes.statusCode).toBe(0);
    });

    it('should build valid event for permission error (403)', () => {
      const attributes: TaskInlineEditAttributes = {
        taskId: 'task-123',
        field: 'assignedId',
        durationMs: 280,
        outcome: 'permission_error',
        userId: 'user-456',
        errorMessage: 'You do not have permission to edit this task',
        statusCode: 403,
      };

      const event = buildInlineEditEvent(
        TASK_INLINE_EDIT_EVENTS.failed,
        attributes
      );

      expect(event.attributes.outcome).toBe('permission_error');
      expect(event.attributes.statusCode).toBe(403);
    });

    it('should build valid event for offline error', () => {
      const attributes: TaskInlineEditAttributes = {
        taskId: 'task-123',
        field: 'priority',
        durationMs: 1200,
        outcome: 'offline',
        userId: 'user-456',
        errorMessage: 'No internet connection',
        retryCount: 2,
      };

      const event = buildInlineEditEvent(
        TASK_INLINE_EDIT_EVENTS.failed,
        attributes
      );

      expect(event.attributes.outcome).toBe('offline');
      expect(event.attributes.retryCount).toBe(2);
    });
  });

  describe('Success Criteria Metric Support', () => {
    it('SC-001: should include duration for latency tracking', () => {
      const event = buildInlineEditEvent(TASK_INLINE_EDIT_EVENTS.saved, {
        taskId: 'task-123',
        field: 'title',
        durationMs: 750,
        outcome: 'success',
        userId: 'user-456',
      });

      // Verify p95 latency can be calculated from durationMs
      expect(event.attributes.durationMs).toBeDefined();
      expect(typeof event.attributes.durationMs).toBe('number');
      expect(event.attributes.durationMs).toBeGreaterThan(0);
    });

    it('SC-002: should support failure rate calculation', () => {
      // Success event
      const successEvent = buildInlineEditEvent(
        TASK_INLINE_EDIT_EVENTS.saved,
        {
          taskId: 'task-123',
          field: 'title',
          outcome: 'success',
          userId: 'user-456',
        }
      );

      // Failure event
      const failureEvent = buildInlineEditEvent(
        TASK_INLINE_EDIT_EVENTS.failed,
        {
          taskId: 'task-124',
          field: 'description',
          outcome: 'validation_error',
          userId: 'user-456',
          errorMessage: 'Validation failed',
        }
      );

      // Verify events can be aggregated for failure rate
      // Failure Rate = (failed events / total started events) * 100
      expect(successEvent.attributes.outcome).toBe('success');
      expect(failureEvent.attributes.outcome).toBe('validation_error');
    });

    it('SC-003: should track field-level usage for navigation reduction analysis', () => {
      const fields = ['title', 'description', 'status', 'priority', 'dueDate'];

      fields.forEach((field) => {
        const event = buildInlineEditEvent(TASK_INLINE_EDIT_EVENTS.saved, {
          taskId: 'task-123',
          field,
          outcome: 'success',
          userId: 'user-456',
        });

        expect(event.attributes.field).toBe(field);
      });
    });
  });

  describe('Attribute Validation', () => {
    it('should require taskId in all events', () => {
      const attributes: TaskInlineEditAttributes = {
        taskId: 'task-123',
        field: 'title',
      };

      const event = buildInlineEditEvent(
        TASK_INLINE_EDIT_EVENTS.started,
        attributes
      );

      expect(event.attributes.taskId).toBeDefined();
      expect(typeof event.attributes.taskId).toBe('string');
      expect(event.attributes.taskId.length).toBeGreaterThan(0);
    });

    it('should require field name in all events', () => {
      const validFields = [
        'title',
        'description',
        'status',
        'priority',
        'dueDate',
        'assignedId',
        'sprintId',
      ];

      validFields.forEach((field) => {
        const event = buildInlineEditEvent(TASK_INLINE_EDIT_EVENTS.started, {
          taskId: 'task-123',
          field,
        });

        expect(event.attributes.field).toBe(field);
      });
    });

    it('should include userId for user segmentation', () => {
      const event = buildInlineEditEvent(TASK_INLINE_EDIT_EVENTS.started, {
        taskId: 'task-123',
        field: 'title',
        userId: 'user-456',
      });

      expect(event.attributes.userId).toBe('user-456');
    });

    it('should support optional retry count tracking', () => {
      const event = buildInlineEditEvent(TASK_INLINE_EDIT_EVENTS.saved, {
        taskId: 'task-123',
        field: 'title',
        outcome: 'success',
        userId: 'user-456',
        retryCount: 1,
      });

      expect(event.attributes.retryCount).toBe(1);
    });
  });

  describe('Outcome Type Safety', () => {
    it('should accept all valid outcome values', () => {
      const outcomes: InlineEditOutcome[] = [
        'success',
        'cancelled',
        'validation_error',
        'conflict',
        'network_error',
        'permission_error',
        'offline',
      ];

      outcomes.forEach((outcome) => {
        const event = buildInlineEditEvent(TASK_INLINE_EDIT_EVENTS.failed, {
          taskId: 'task-123',
          field: 'title',
          outcome,
          userId: 'user-456',
        });

        expect(event.attributes.outcome).toBe(outcome);
      });
    });
  });

  describe('Event Lifecycle Completeness', () => {
    it('should track complete edit lifecycle from start to save', () => {
      const taskId = 'task-123';
      const field = 'title';
      const userId = 'user-456';
      const startTime = Date.now();

      // 1. User starts editing
      const startEvent = buildInlineEditEvent(
        TASK_INLINE_EDIT_EVENTS.started,
        {
          taskId,
          field,
          userId,
        }
      );

      // 2. User saves successfully
      const endTime = Date.now();
      const durationMs = endTime - startTime;

      const saveEvent = buildInlineEditEvent(TASK_INLINE_EDIT_EVENTS.saved, {
        taskId,
        field,
        durationMs,
        outcome: 'success',
        userId,
      });

      // Verify correlation
      expect(startEvent.attributes.taskId).toBe(saveEvent.attributes.taskId);
      expect(startEvent.attributes.field).toBe(saveEvent.attributes.field);
      expect(startEvent.attributes.userId).toBe(saveEvent.attributes.userId);
      expect(saveEvent.attributes.durationMs).toBeGreaterThanOrEqual(0);
    });

    it('should track complete edit lifecycle from start to cancel', () => {
      const taskId = 'task-123';
      const field = 'description';
      const userId = 'user-456';

      // 1. User starts editing
      const startEvent = buildInlineEditEvent(
        TASK_INLINE_EDIT_EVENTS.started,
        {
          taskId,
          field,
          userId,
        }
      );

      // 2. User cancels
      const cancelEvent = buildInlineEditEvent(
        TASK_INLINE_EDIT_EVENTS.cancelled,
        {
          taskId,
          field,
          durationMs: 1500,
          outcome: 'cancelled',
          userId,
        }
      );

      // Verify correlation
      expect(startEvent.attributes.taskId).toBe(cancelEvent.attributes.taskId);
      expect(startEvent.attributes.field).toBe(cancelEvent.attributes.field);
    });

    it('should track complete edit lifecycle with failure and retry', () => {
      const taskId = 'task-123';
      const field = 'status';
      const userId = 'user-456';

      // 1. User starts editing
      const startEvent = buildInlineEditEvent(
        TASK_INLINE_EDIT_EVENTS.started,
        {
          taskId,
          field,
          userId,
        }
      );

      // 2. First save attempt fails (network error)
      const failEvent = buildInlineEditEvent(TASK_INLINE_EDIT_EVENTS.failed, {
        taskId,
        field,
        durationMs: 300,
        outcome: 'network_error',
        userId,
        retryCount: 0,
      });

      // 3. Retry succeeds
      const retryEvent = buildInlineEditEvent(TASK_INLINE_EDIT_EVENTS.saved, {
        taskId,
        field,
        durationMs: 450,
        outcome: 'success',
        userId,
        retryCount: 1,
      });

      // Verify retry tracking
      expect(failEvent.attributes.retryCount).toBe(0);
      expect(retryEvent.attributes.retryCount).toBe(1);
    });
  });
});
