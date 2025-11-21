export enum DeleteStrategy {
  SOFT = 'SOFT',
  HARD = 'HARD',
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date | null;
  deleteStrategy: DeleteStrategy;
}

export interface CreateWorkspaceInput {
  name: string;
}

export interface UpdateWorkspaceInput {
  name?: string;
  slug?: string;
  color?: string;
  icon?: string;
  deleteStrategy?: DeleteStrategy;
}
