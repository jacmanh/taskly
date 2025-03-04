import { Task, TaskStatus } from '@prisma/client'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TaskColumn } from './TaskColumn'

const meta: Meta<typeof TaskColumn> = {
  component: TaskColumn,
  title: 'Features/Tasks/TaskColumn',
  decorators: [
    (Story) => (
      <DndProvider backend={HTML5Backend}>
        <div className="w-80">
          <Story />
        </div>
      </DndProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof TaskColumn>

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the project',
    status: TaskStatus.todo,
    date: new Date(),
    authorId: 'user1',
    companyId: 'company1',
    assigneeId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Fix navigation bug',
    description: 'Fix the navigation bug in the header component',
    status: TaskStatus.todo,
    date: new Date(),
    authorId: 'user1',
    companyId: 'company1',
    assigneeId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const TodoColumn: Story = {
  args: {
    title: 'To Do',
    status: TaskStatus.todo,
    tasks: mockTasks,
    bgColor: 'bg-gray-100',
    onTaskMoved: (taskId, newStatus) => {
      console.log(`Task ${taskId} moved to ${newStatus}`)
    },
  },
}

export const InProgressColumn: Story = {
  args: {
    title: 'In Progress',
    status: TaskStatus.in_progress,
    tasks: [
      {
        ...mockTasks[0],
        id: '3',
        title: 'Implement drag and drop',
        description: 'Add drag and drop functionality to the task board',
        status: TaskStatus.in_progress,
      },
    ],
    bgColor: 'bg-blue-50',
    onTaskMoved: (taskId, newStatus) => {
      console.log(`Task ${taskId} moved to ${newStatus}`)
    },
  },
}

export const DoneColumn: Story = {
  args: {
    title: 'Done',
    status: TaskStatus.done,
    tasks: [
      {
        ...mockTasks[0],
        id: '4',
        title: 'Set up project structure',
        description: 'Create initial project structure and configuration',
        status: TaskStatus.done,
      },
    ],
    bgColor: 'bg-green-50',
    onTaskMoved: (taskId, newStatus) => {
      console.log(`Task ${taskId} moved to ${newStatus}`)
    },
  },
}

export const EmptyColumn: Story = {
  args: {
    title: 'Empty Column',
    status: TaskStatus.todo,
    tasks: [],
    bgColor: 'bg-gray-100',
    onTaskMoved: (taskId, newStatus) => {
      console.log(`Task ${taskId} moved to ${newStatus}`)
    },
  },
}
