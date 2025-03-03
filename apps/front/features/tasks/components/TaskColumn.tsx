import { Task, TaskStatus } from '@prisma/client'
import classNames from 'classnames'
import { useRef, useState } from 'react'
import { useDrop } from 'react-dnd'
import { DraggableTaskItem } from './DraggableTaskItem'

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

export const TaskColumn = ({ title, status, tasks, bgColor, onTaskMoved }: TaskColumnProps) => {
  const dropRef = useRef<HTMLDivElement>(null)
  const [showPlaceholder, setShowPlaceholder] = useState(false)

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>(() => ({
    accept: 'TASK',
    drop: (item: DragItem) => {
      if (item.status !== status) {
        onTaskMoved(item.id, status)
      }
      setShowPlaceholder(false)
    },
    hover: (item) => {
      // Only show placeholder if the task is from a different column
      if (item.status !== status) {
        setShowPlaceholder(true)
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  // Connect the drop ref to our React ref
  drop(dropRef)

  return (
    <div
      ref={dropRef}
      className={classNames(
        'rounded-lg p-4',
        bgColor,
        { 'ring-2 ring-blue-400': isOver },
        'transition-all'
      )}
      onDragLeave={() => {
        setShowPlaceholder(false)
      }}
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
            <DraggableTaskItem key={task.id} task={task} displayStatus={false} className="w-full" />
          ))
        )}

        {/* Simple placeholder with gray dotted border */}
        {isOver && showPlaceholder && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg h-24 bg-gray-50 flex items-center justify-center">
            <p className="text-gray-400 text-sm">Drop here</p>
          </div>
        )}
      </div>
    </div>
  )
}
