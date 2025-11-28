export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  projectId: string;
  assignedId: string | null;
  sprintId: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  // Relations (populated by API)
  project?: {
    id: string;
    name: string;
    slug: string;
    workspaceId: string;
  };
  assignedTo?: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  } | null;
  sprint?: {
    id: string;
    name: string;
  } | null;
  createdBy?: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  };
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
  projectId: string;
  assignedId?: string;
  sprintId?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
  projectId?: string;
  assignedId?: string;
  sprintId?: string;
}

// Inline Edit Types
export type InlineEditableField =
  | 'title'
  | 'description'
  | 'status'
  | 'dueDate'
  | 'priority'
  | 'assignedId'
  | 'sprintId';

export interface InlineEditPayload {
  taskId: string;
  field: InlineEditableField;
  previousValue: string | null;
  newValue: string | null;
  updatedAt?: string; // ISO timestamp for optimistic concurrency
}

export interface InlineEditValidationError {
  field: InlineEditableField;
  message: string;
}

export interface InlineEditConflictResponse {
  message: string;
  latest: Task;
  conflictingFields: InlineEditableField[];
}

// Telemetry event types
export type InlineEditOutcome =
  | 'success'
  | 'validation_error'
  | 'permission_error'
  | 'conflict'
  | 'network_error'
  | 'cancelled';

export interface InlineEditEvent {
  eventName:
    | 'task_inline_edit_started'
    | 'task_inline_edit_saved'
    | 'task_inline_edit_cancelled'
    | 'task_inline_edit_failed';
  taskId: string;
  field: InlineEditableField;
  outcome?: InlineEditOutcome;
  durationMs?: number;
  userId?: string;
  timestamp: string; // ISO timestamp
  metadata?: Record<string, unknown>;
}
