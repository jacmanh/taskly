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
  context?: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date | null;
  deleteStrategy: DeleteStrategy;
}

export interface CreateWorkspaceInput {
  name: string;
  context?: string;
}

export interface UpdateWorkspaceInput {
  name?: string;
  slug?: string;
  color?: string;
  icon?: string;
  context?: string;
  deleteStrategy?: DeleteStrategy;
}

export interface WorkspaceMember {
  user: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  };
}

export interface WorkspaceUser {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
}
