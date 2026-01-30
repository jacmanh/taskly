import { useSuspenseWorkspaceProjects } from '../hooks/useProjects';
import { Button } from '@taskly/design-system';
import { Plus, Sparkles } from 'lucide-react';
import { ReactNode } from 'react';

interface ProjectContentProps {
  workspaceId: string;
  projectSlug: string;
  onCreateTask?: () => void;
  onGenerateTasks?: () => void;
  children?: ReactNode; // Slot for tasks
}

export const ProjectContent = ({
  workspaceId,
  projectSlug,
  onCreateTask,
  onGenerateTasks,
  children,
}: ProjectContentProps) => {
  const { data: projects = [] } = useSuspenseWorkspaceProjects(workspaceId);
  const project = projects.find((p) => p.slug === projectSlug);

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
              {onGenerateTasks && (
                <Button variant="outline" onClick={onGenerateTasks}>
                  <Sparkles className="w-4 h-4" />
                  Générer des tâches
                </Button>
              )}
              {onCreateTask && (
                <Button variant="primary" onClick={onCreateTask}>
                  <Plus className="w-4 h-4" />
                  Nouvelle tâche
                </Button>
              )}
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
