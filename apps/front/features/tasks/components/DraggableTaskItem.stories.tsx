import { Task, TaskStatus } from '@prisma/client'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DraggableTaskItem } from './DraggableTaskItem'

const meta: Meta<typeof DraggableTaskItem> = {
  component: DraggableTaskItem,
  title: 'Features/Tasks/DraggableTaskItem',
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
type Story = StoryObj<typeof DraggableTaskItem>

const mockTask: Task = {
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
}

export const Todo: Story = {
  args: {
    task: mockTask,
  },
}

export const InProgress: Story = {
  args: {
    task: {
      ...mockTask,
      id: '2',
      title: 'Implement drag and drop',
      description: 'Add drag and drop functionality to the task board',
      status: TaskStatus.in_progress,
    },
  },
}

export const Done: Story = {
  args: {
    task: {
      ...mockTask,
      id: '3',
      title: 'Set up project structure',
      description: 'Create initial project structure and configuration',
      status: TaskStatus.done,
    },
  },
}

export const WithCallback: Story = {
  args: {
    task: mockTask,
    onTaskMoved: (taskId, newStatus) => {
      console.log(`Task ${taskId} moved to ${newStatus}`)
    },
  },
}
