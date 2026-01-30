import { _Translator } from 'next-intl';
import { messages } from '@i18n/message-types';
import { TaskDraftBatchStatus } from '@taskly/types';

export const getDraftBatchesStatusLabel = (
  status: TaskDraftBatchStatus,
  t: _Translator<typeof messages, 'draftbatches'>
) => {
  switch (status) {
    case TaskDraftBatchStatus.PENDING:
      return t('status.pending');
    case TaskDraftBatchStatus.ACCEPTED:
      return t('status.accepted');
    case TaskDraftBatchStatus.CANCELLED:
      return t('status.cancelled');
  }
};
