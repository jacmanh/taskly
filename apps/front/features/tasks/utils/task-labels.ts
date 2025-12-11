import { messages } from '@i18n/message-types';
import { TaskPriority, TaskStatus } from '@taskly/types';
import { _Translator } from 'next-intl';

export const getTaskStatusLabel = (
  status: TaskStatus,
  t: _Translator<typeof messages, 'tasks'>
) => {
  switch (status) {
    case TaskStatus.TODO:
      return t('statusOptions.todo');
    case TaskStatus.IN_PROGRESS:
      return t('statusOptions.inProgress');
    case TaskStatus.DONE:
      return t('statusOptions.done');
    default:
      return status;
  }
};

export const getTaskPriorityLabel = (
  priority: TaskPriority,
  t: _Translator<typeof messages, 'tasks'>
) => {
  switch (priority) {
    case TaskPriority.LOW:
      return t('priorityOptions.low');
    case TaskPriority.MEDIUM:
      return t('priorityOptions.medium');
    case TaskPriority.HIGH:
      return t('priorityOptions.high');
    default:
      return priority;
  }
};
