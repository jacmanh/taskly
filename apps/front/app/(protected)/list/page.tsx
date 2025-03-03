'use client'

import { TaskItem } from '@taskly/ui'
import { useGetUserTasks } from '@app/front/features/tasks/api/tasks.api'

const ListPage = () => {
  const { data: tasks, isLoading } = useGetUserTasks()

  return (
    <div className="p-4">
      <h3>List Page</h3>

      <div className="bg-gray-100 flex flex-start gap-4 p-4 rounded-md">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          tasks?.map((task) => <TaskItem key={task.id} task={task} />)
        )}
      </div>
    </div>
  )
}

export default ListPage
