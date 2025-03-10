'use client'

import { useGetTaskById } from '@app/front/features/tasks/api/tasks.api'
import { TaskStatus } from '@prisma/client'
import { useParams } from 'next/navigation'

const TaskDetailPage = ({ taskId: idParam }: { taskId?: string } = {}) => {
  const { id: idFromParams } = useParams() as { id: string }
  const id = idParam || idFromParams
  const { data: task, isLoading, error } = useGetTaskById(id)

  if (isLoading) {
    return <div className="p-4">Loading task details...</div>
  }

  if (error || !task) {
    return <div className="p-4 text-red-500">Error loading task details</div>
  }

  const formattedDate = task.date ? new Date(task.date).toLocaleDateString() : 'No date set'

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              task.status === TaskStatus.todo
                ? 'bg-gray-200'
                : task.status === TaskStatus.in_progress
                ? 'bg-yellow-100'
                : 'bg-green-100'
            }`}
          >
            {task.status === TaskStatus.todo
              ? 'To Do'
              : task.status === TaskStatus.in_progress
              ? 'In Progress'
              : 'Done'}
          </span>
          <span className="text-gray-500">{formattedDate}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">Description</h2>
        <p className="text-gray-700 whitespace-pre-wrap">
          {task.description || 'No description provided.'}
        </p>
      </div>
    </div>
  )
}

export default TaskDetailPage
