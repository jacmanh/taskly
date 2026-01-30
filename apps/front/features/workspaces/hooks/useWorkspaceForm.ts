'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useCreateWorkspace } from './useWorkspaces';
import {
  workspaceFormSchema,
  type WorkspaceFormData,
} from '../schemas/workspaceSchema';

const DEFAULT_VALUES: WorkspaceFormData = {
  name: '',
  context: '',
};

export function useWorkspaceForm() {
  const { mutate: createWorkspace, isPending } = useCreateWorkspace();

  const form = useForm<WorkspaceFormData>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  });

  const onSubmit = useCallback(
    (onSuccess?: () => void) => {
      return (data: WorkspaceFormData) => {
        createWorkspace(data, {
          onSuccess: () => {
            form.reset();
            onSuccess?.();
          },
        });
      };
    },
    [createWorkspace, form]
  );

  return {
    form,
    onSubmit,
    isPending,
  };
}
