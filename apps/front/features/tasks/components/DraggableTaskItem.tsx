import { Task, TaskStatus } from '@prisma/client'
import { TaskItem, TaskItemProps } from '@taskly/ui'
import classNames from 'classnames'
import { useRef } from 'react'
import { useDrag } from 'react-dnd'

// Extend the TaskItemProps but replace the task property with our Prisma Task type
export interface DraggableTaskItemProps extends Omit<TaskItemProps, 'task'> {
  task: Task
  onTaskMoved?: (taskId: string, newStatus: TaskStatus) => void
  onClick?: () => void
}

interface DragItem {
  id: string
  status: TaskStatus
}

export const DraggableTaskItem = ({ task, ...props }: DraggableTaskItemProps) => {
  const dragRef = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>(() => ({
    type: 'TASK',
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  // Connect the drag ref to our React ref
  drag(dragRef)

  // Convert Prisma Task to TaskItemProps task format
  const uiTask = {
    title: task.title,
    description: task.description,
    status: task.status,
    date: task.date,
  }

  return (
    <div
      ref={dragRef}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={classNames(
        'transition-all duration-200',
        'cursor-pointer hover:cursor-pointer',
        'hover:shadow-md',
        { 'shadow-lg': isDragging }
      )}
    >
      <TaskItem task={uiTask} {...props} onClick={props.onClick} />
    </div>
  )
}
