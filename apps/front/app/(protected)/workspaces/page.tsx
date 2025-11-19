'use client';

import { useAuth } from '@features/auth/hooks/useAuth';
import {
  useWorkspaces,
  useDeleteWorkspace,
} from '@features/workspaces/hooks/useWorkspaces';
import { WorkspaceList } from '@features/workspaces/components/WorkspaceList';
import { useCreateWorkspaceDrawer } from '@features/workspaces/hooks/useCreateWorkspaceDrawer';
import { Button } from '@taskly/design-system';

export default function WorkspacesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: workspaces = [], isLoading, error } = useWorkspaces();
  const { mutate: deleteWorkspace, isPending: isDeleting } =
    useDeleteWorkspace();
  const { openCreateDrawer } = useCreateWorkspaceDrawer();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">
          Chargement de l&apos;authentification...
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Middleware will redirect
  }

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce workspace?')) {
      deleteWorkspace(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Mes Workspaces
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Gérez tous vos workspaces et collaborez avec votre équipe
              </p>
            </div>
            <Button
              variant="primary"
              onClick={openCreateDrawer}
            >
              + Créer un workspace
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                Erreur lors du chargement des workspaces. Veuillez réessayer.
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-gray-600">Chargement des workspaces...</div>
            </div>
          ) : (
            <>
              {/* Workspaces List */}
              <WorkspaceList
                workspaces={workspaces}
                onDelete={handleDelete}
                isDeleting={isDeleting}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
