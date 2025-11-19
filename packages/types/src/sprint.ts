export interface Sprint {
  id: string;
  name: string;
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
  workspaceId: string;
  projectId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSprintInput {
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  projectId?: string;
}

export interface UpdateSprintInput {
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  projectId?: string;
}
