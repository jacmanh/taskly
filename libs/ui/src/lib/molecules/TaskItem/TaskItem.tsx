import { Card } from '../../../lib/atoms/Card/Card'

/**
 * Props specific to the TaskItem UI component
 */
export interface TaskItemProps {
  task: {
    title: string
    description: string
    status: 'todo' | 'in_progress' | 'done'
    date: Date | string
  }
  displayStatus?: boolean
  className?: string
}

export const TaskItem = ({ task, displayStatus, className }: TaskItemProps) => {
  const statusClasses = {
    todo: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    done: 'bg-green-100 text-green-700',
  }[task.status]

  const statusLabels = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
  }

  // Format the date, handling both Date objects and ISO strings
  const formatDate = (dateValue: Date | string) => {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <Card className={className || 'min-w-64'}>
      <div className="text-sm text-gray-500 font-semibold">
        {formatDate(task.date)}
      </div>
      <div className="text-lg font-semibold">{task.title}</div>
      <div className="text-sm text-gray-500">{task.description}</div>
      {displayStatus && (
        <div className="mt-2">
          <span className={`text-xs px-2 py-1 rounded-full ${statusClasses}`}>
            {statusLabels[task.status]}
          </span>
        </div>
      )}
    </Card>
  )
}
