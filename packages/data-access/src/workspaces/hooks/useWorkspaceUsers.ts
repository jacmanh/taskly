import { useQuery } from '@tanstack/react-query';
import { workspacesService } from '../services/workspaces.service';
import { workspacesQueryKeys } from '../query-keys';

export function useWorkspaceUsers(workspaceId: string) {
  return useQuery({
    queryKey: workspacesQueryKeys.users(workspaceId),
    queryFn: () => workspacesService.getWorkspaceUsers(workspaceId),
  });
}
