export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  context: string | null;
  color: string | null;
  icon: string | null;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  context?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  context?: string;
  color?: string;
  icon?: string;
}
