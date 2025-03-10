import { Task, TaskStatus } from '@prisma/client'
import { useModal } from '@taskly/ui'
import classNames from 'classnames'
import { useRef, useState } from 'react'
import { useDrop } from 'react-dnd'
import { DraggableTaskItem } from './DraggableTaskItem'
import { TaskDetailModal } from './TaskDetailModal'

interface TaskColumnProps {
  title: string
  status: TaskStatus
  tasks: Task[]
  bgColor: string
  onTaskMoved: (taskId: string, newStatus: TaskStatus) => void
}

interface DragItem {
  id: string
  status: TaskStatus
}

export const TaskColumn = ({
  title,
  status,
  tasks,
  bgColor,
  onTaskMoved: handleTaskMoved,
}: TaskColumnProps) => {
  const { openModal } = useModal()
  const ref = useRef<HTMLDivElement>(null)
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(false)

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>(() => ({
    accept: 'TASK',
    drop: ({ id, status: droppedStatus }) => {
      if (droppedStatus !== status) {
        handleTaskMoved(id, status)
      }
      setIsPlaceholderVisible(false)
    },
    hover: ({ status: droppedStatus }) => {
      setIsPlaceholderVisible(droppedStatus !== status)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))

  drop(ref)

  return (
    <div
      ref={ref}
      className={classNames('rounded-lg p-4', bgColor, { 'ring-2 ring-blue-400': isOver })}
      onDragLeave={() => setIsPlaceholderVisible(false)}
    >
      <h4 className="font-semibold text-lg mb-3 flex items-center justify-between">
        {title}
        <span className="bg-white text-sm px-2 py-1 rounded-full">{tasks.length}</span>
      </h4>
      <div className="space-y-3 min-h-[200px]">
        {tasks.length === 0 && !isOver ? (
          <p className="text-gray-500 text-sm italic text-center py-4">No tasks in this column</p>
        ) : (
          tasks.map((task) => (
            <DraggableTaskItem
              key={task.id}
              task={task}
              displayStatus={false}
              className="w-full"
              onClick={() => openModal(<TaskDetailModal taskId={task.id} />)}
            />
          ))
        )}
        {isOver && isPlaceholderVisible && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg h-24 bg-gray-50 flex items-center justify-center">
            <p className="text-gray-400 text-sm">Drop here</p>
          </div>
        )}
      </div>
    </div>
  )
}
