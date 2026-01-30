'use client';

import { useRouter, useParams } from 'next/navigation';
import { useSuspenseWorkspaceProjects } from '../hooks/useProjects';
import {
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@taskly/design-system';
import { Plus, Sparkles } from 'lucide-react';
import { ReactNode } from 'react';

interface ProjectContentProps {
  workspaceId: string;
  projectSlug: string;
  activeTab: 'backlog' | 'drafts';
  onCreateTask?: () => void;
  children?: ReactNode;
}

export const ProjectContent = ({
  workspaceId,
  projectSlug,
  activeTab,
  onCreateTask,
  children,
}: ProjectContentProps) => {
  const { data: projects = [] } = useSuspenseWorkspaceProjects(workspaceId);
  const project = projects.find((p) => p.slug === projectSlug);
  const router = useRouter();
  const params = useParams<{
    workspaceSlug: string;
    projectSlug: string;
  }>();

  if (!project) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Projet introuvable
            </h2>
            <p className="text-neutral-500">
              Le projet &ldquo;{projectSlug}&rdquo; n&apos;existe pas dans ce
              workspace.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleGenerateTasks = () => {
    router.push(
      `/${params?.workspaceSlug}/${params?.projectSlug}/drafts/new`
    );
  };

  const handleTabChange = (value: string) => {
    if (value === 'backlog') {
      router.push(`/${params?.workspaceSlug}/${params?.projectSlug}`);
    } else if (value === 'drafts') {
      router.push(`/${params?.workspaceSlug}/${params?.projectSlug}/drafts`);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {project.name}
          </h1>
          {project.description && (
            <p className="text-neutral-600 mt-1">{project.description}</p>
          )}
        </div>

        {/* Tasks Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Tâches</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleGenerateTasks}>
                <Sparkles className="w-4 h-4" />
                Générer des tâches
              </Button>
              {onCreateTask && (
                <Button variant="primary" onClick={onCreateTask}>
                  <Plus className="w-4 h-4" />
                  Nouvelle tâche
                </Button>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="backlog">Backlog</TabsTrigger>
              <TabsTrigger value="drafts">Brouillons IA</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab}>{children}</TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
