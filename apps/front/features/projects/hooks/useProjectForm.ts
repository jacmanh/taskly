'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useCreateProject } from './useProjects';
import {
  ProjectFormData,
  projectFormSchema,
} from '../schemas/projectFormSchema';

const DEFAULT_VALUES: ProjectFormData = {
  name: '',
  description: '',
};

export function useProjectForm(workspaceId?: string) {
  const { mutate: createProject, isPending } = useCreateProject();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  });

  const onSubmit = useCallback(
    (onSuccess?: () => void) => {
      return (data: ProjectFormData) => {
        if (!workspaceId) return;

        createProject(
          {
            workspaceId,
            input: {
              name: data.name,
              description: data.description || undefined,
            },
          },
          {
            onSuccess: () => {
              form.reset();
              onSuccess?.();
            },
          }
        );
      };
    },
    [createProject, form, workspaceId]
  );

  return {
    form,
    onSubmit,
    isPending,
    isDisabled: !workspaceId,
  };
}
