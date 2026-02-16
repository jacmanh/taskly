'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  RadioGroup,
  RadioGroupItem,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@taskly/design-system';
import { DeleteStrategy } from '@taskly/types';
import { useCurrentWorkspace } from '../hooks/useCurrentWorkspace';
import { useUpdateWorkspace } from '../hooks/useWorkspaces';
import { GitHubIntegration } from './GitHubIntegration';

interface WorkspaceSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WorkspaceSettingsModal({
  open,
  onOpenChange,
}: WorkspaceSettingsModalProps) {
  const { currentWorkspace: workspace } = useCurrentWorkspace();
  const { mutate: updateWorkspace, isPending } = useUpdateWorkspace();
  const [strategy, setStrategy] = useState<DeleteStrategy>(DeleteStrategy.SOFT);

  useEffect(() => {
    if (workspace) {
      setStrategy(workspace.deleteStrategy);
    }
  }, [workspace]);

  const handleSave = () => {
    if (!workspace) return;

    updateWorkspace(
      {
        id: workspace.id,
        input: {
          deleteStrategy: strategy,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Paramètres du workspace</DialogTitle>
          <DialogDescription>
            Gérez les préférences de votre espace de travail.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="github">GitHub</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="space-y-4 py-4">
            <div className="space-y-4">
              <h4 className="font-medium leading-none">Suppression des tâches</h4>
              <RadioGroup
                value={strategy}
                onValueChange={(value) => setStrategy(value as DeleteStrategy)}
              >
                <div className="flex items-start space-x-3 space-y-0">
                  <RadioGroupItem value={DeleteStrategy.SOFT} id="soft" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="soft" className="font-medium">
                      Soft Delete (Par défaut)
                    </Label>
                    <p className="text-sm text-neutral-500">
                      La description est supprimée, mais la tâche reste visible
                      avec ses métadonnées.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-y-0">
                  <RadioGroupItem value={DeleteStrategy.HARD} id="hard" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="hard" className="font-medium">
                      Hard Delete
                    </Label>
                    <p className="text-sm text-neutral-500">
                      La tâche est définitivement supprimée de la base de données.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Annuler
              </Button>
              <Button onClick={handleSave} loading={isPending}>
                Enregistrer
              </Button>
            </DialogFooter>
          </TabsContent>
          <TabsContent value="github" className="space-y-4 py-4">
            <GitHubIntegration />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
