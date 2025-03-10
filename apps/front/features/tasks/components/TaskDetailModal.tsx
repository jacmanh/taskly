'use client'

import { useGetTaskById } from '@app/front/features/tasks/api/tasks.api'
import { TaskStatus } from '@prisma/client'
import { ModalHeader } from '@taskly/ui'
import classNames from 'classnames'

interface TaskDetailModalProps {
  taskId: string
}

export const TaskDetailModal = ({ taskId }: TaskDetailModalProps) => {
  const { data: task, isLoading } = useGetTaskById(taskId)

  if (isLoading) {
    return <div className="p-4">Loading task details...</div>
  }

  if (!task) {
    return <div className="p-4 text-red-500">Task not found</div>
  }

  const taskStatusClassNames: Record<TaskStatus, string> = {
    todo: 'bg-gray-200',
    in_progress: 'bg-yellow-100',
    done: 'bg-green-100',
  }

  return (
    <div className="w-[50vh] h-[50vh] p-4 flex flex-col overflow-hidden">
      <ModalHeader>
        <div className="text-2xl">{task.title}</div>
      </ModalHeader>
      <div className="flex-1 overflow-y-auto mt-4">
        <div className="w-full">
          <div className="flex flex-col space-y-2">
            <div className="flex">
              <span className="text-sm text-gray-400 w-24">Created at:</span>
              <span className="text-sm">{task.createdAt.toDateString()}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-400 w-24">Status:</span>
              <span
                className={classNames(
                  'text-center capitalize rounded-md px-2 py-1 text-sm font-semibold',
                  taskStatusClassNames[task.status]
                )}
              >
                {task.status}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {task.description || 'No description provided.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
