'use client';

import { WorkspaceForm } from './WorkspaceForm';

interface CreateWorkspaceDrawerContentProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateWorkspaceDrawerContent({
  onSuccess,
  onCancel,
}: CreateWorkspaceDrawerContentProps) {
  return <WorkspaceForm onSuccess={onSuccess} onCancel={onCancel} />;
}
