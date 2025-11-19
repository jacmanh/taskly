'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import type { Project } from '@taskly/types';
import { useCreateProject, useUpdateProject } from './useProjects';
import {
  ProjectFormData,
  projectFormSchema,
} from '../schemas/projectFormSchema';

const DEFAULT_VALUES: ProjectFormData = {
  name: '',
  description: '',
};

export function useProjectForm({
  workspaceId,
  project,
}: {
  workspaceId?: string;
  project?: Project;
}) {
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
  const isPending = isCreating || isUpdating;

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  });

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        description: project.description || '',
      });
    }
  }, [project, form]);

  const onSubmit = useCallback(
    (onSuccess?: (project: Project) => void) => {
      return (data: ProjectFormData) => {
        if (project) {
          updateProject(
            {
              workspaceId: project.workspaceId,
              projectId: project.id,
              input: {
                name: data.name,
                description: data.description || undefined,
              },
            },
            {
              onSuccess: (updatedProject) => {
                form.reset();
                onSuccess?.(updatedProject);
              },
            },
          );
        } else if (workspaceId) {
          createProject(
            {
              workspaceId,
              input: {
                name: data.name,
                description: data.description || undefined,
              },
            },
            {
              onSuccess: (newProject) => {
                form.reset();
                onSuccess?.(newProject);
              },
            },
          );
        }
      };
    },
    [createProject, updateProject, form, workspaceId, project],
  );

  return {
    form,
    onSubmit,
    isPending,
    isDisabled: !workspaceId && !project,
  };
}
