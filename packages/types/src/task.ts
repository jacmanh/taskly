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
  assignedToId: string | null;
  sprintId: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
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
  assignedToId?: string;
  sprintId?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
  projectId?: string;
  assignedToId?: string;
  sprintId?: string;
}
