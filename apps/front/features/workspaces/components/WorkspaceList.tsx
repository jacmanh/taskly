import type { Workspace } from '@taskly/types';

interface WorkspaceListProps {
  workspaces: Workspace[];
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

export function WorkspaceList({
  workspaces,
  onDelete,
  isDeleting,
}: WorkspaceListProps) {
  if (workspaces.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          Aucun workspace créé. Commencez par en créer un!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workspaces.map((workspace) => (
        <div
          key={workspace.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4"
          style={{ borderLeftColor: workspace.color || '#3b82f6' }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {workspace.icon && (
                  <span className="text-2xl">{workspace.icon}</span>
                )}
                <h3 className="text-lg font-semibold text-gray-900">
                  {workspace.name}
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {workspace.slug}
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-3">
                Créé le{' '}
                {new Date(workspace.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          {onDelete && (
            <button
              onClick={() => onDelete(workspace.id)}
              disabled={isDeleting}
              className="mt-4 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
