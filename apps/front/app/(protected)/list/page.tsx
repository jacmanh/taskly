'use client'

import { useGetUserTasks, useUpdateTaskStatus } from '@app/front/features/tasks/api/tasks.api'
import { TaskColumn } from '@app/front/features/tasks/components/TaskColumn'
import { Task, TaskStatus } from '@prisma/client'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const ListPage = () => {
  const { data: tasks, isLoading } = useGetUserTasks()
  const updateTaskStatus = useUpdateTaskStatus()

  // Handle task movement between columns
  const handleTaskMoved = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus.mutate({ taskId, status: newStatus })
  }

  // Group tasks by status
  const groupedTasks: Record<TaskStatus, Task[]> = {
    [TaskStatus.todo]: [],
    [TaskStatus.in_progress]: [],
    [TaskStatus.done]: [],
  }

  // Fill the groups with tasks
  if (tasks) {
    tasks.forEach((task) => {
      groupedTasks[task.status].push(task)
    })
  }

  // Column configuration
  const columns = [
    {
      title: 'To Do',
      status: TaskStatus.todo,
      bgColor: 'bg-gray-100',
      tasks: groupedTasks[TaskStatus.todo],
    },
    {
      title: 'In Progress',
      status: TaskStatus.in_progress,
      bgColor: 'bg-yellow-50',
      tasks: groupedTasks[TaskStatus.in_progress],
    },
    {
      title: 'Done',
      status: TaskStatus.done,
      bgColor: 'bg-green-50',
      tasks: groupedTasks[TaskStatus.done],
    },
  ]

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">Task Board</h3>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading tasks...</p>
        </div>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => (
              <TaskColumn
                key={column.status}
                title={column.title}
                status={column.status}
                tasks={column.tasks}
                bgColor={column.bgColor}
                onTaskMoved={handleTaskMoved}
              />
            ))}
          </div>
        </DndProvider>
      )}
    </div>
  )
}

export default ListPage
