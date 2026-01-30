import { TaskStatus, TaskPriority } from './task';

export enum TaskDraftBatchStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
}

export interface TaskDraftItem {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  enabled: boolean;
  batchId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskDraftBatch {
  id: string;
  title: string;
  prompt: string;
  status: TaskDraftBatchStatus;
  projectId: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  items?: TaskDraftItem[];
  _count?: { items: number };
}

export interface UpdateTaskDraftItemInput {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  enabled?: boolean;
}
