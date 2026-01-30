'use client';

import {
  Drawer,
  EditableInput,
  EditableTextarea,
  EditableSelect,
  MarkdownRenderer,
} from '@taskly/design-system';
import type { TaskDraftItem } from '@taskly/types';
import { TaskPriority } from '@taskly/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useUpdateDraftItem } from '../hooks/useTaskDrafts';

interface TaskDraftDrawerProps {
  item: TaskDraftItem;
  workspaceId: string;
  batchId: string;
}

export function TaskDraftDrawer({
  item,
  workspaceId,
  batchId,
}: TaskDraftDrawerProps) {
  const { mutate: updateItem } = useUpdateDraftItem();

  const handleUpdate = (field: string, value?: string) => {
    updateItem({
      workspaceId,
      itemId: item.id,
      batchId,
      input: { [field]: value ?? null },
    });
  };

  return (
    <>
      <Drawer.Header
        title={item.title}
        description={`Créé le ${format(new Date(item.createdAt), 'dd MMMM yyyy', { locale: fr })}`}
      />

      <div className="w-full space-y-6">
        <EditableInput
          label="Titre"
          value={item.title}
          onSave={(value) => handleUpdate('title', value as string)}
        />

        <EditableTextarea
          label="Description"
          value={item.description || ''}
          onSave={(value) => handleUpdate('description', value as string)}
          renderView={(value) => <MarkdownRenderer content={value} />}
        />

        <div className="flex flex-col gap-2">
          <EditableSelect
            label="Priorité"
            inline
            value={item.priority}
            labelClassName="w-32"
            options={Object.values(TaskPriority).map((priority) => ({
              value: priority,
              label: priority,
            }))}
            onSave={(value) => handleUpdate('priority', value as string)}
          />
        </div>
      </div>

      <Drawer.Footer>
        <div className="text-xs text-neutral-500">
          <p>
            Modifié le{' '}
            {format(new Date(item.updatedAt), 'dd MMMM yyyy à HH:mm', {
              locale: fr,
            })}
          </p>
        </div>
      </Drawer.Footer>
    </>
  );
}
