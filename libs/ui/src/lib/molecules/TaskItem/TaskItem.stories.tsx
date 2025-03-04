import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { TaskItem } from './TaskItem'

const meta: Meta<typeof TaskItem> = {
  component: TaskItem,
  title: 'Molecules/TaskItem',
  argTypes: {
    displayStatus: { control: 'boolean' },
    className: { control: 'text' },
    task: {
      control: 'object',
    },
  },
}

export default meta
type Story = StoryObj<typeof TaskItem>

const baseTask = {
  title: 'Complete project documentation',
  description:
    'Write comprehensive documentation for the project including API references and examples',
  date: new Date('2025-03-15'),
}

export const TodoTask: Story = {
  args: {
    task: {
      ...baseTask,
      status: 'todo',
    },
    displayStatus: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test that the task title is rendered correctly
    const title = canvas.getByText('Complete project documentation')
    expect(title).toBeInTheDocument()
    
    // Test that the task description is rendered correctly
    const description = canvas.getByText('Write comprehensive documentation for the project including API references and examples')
    expect(description).toBeInTheDocument()
    
    // Test that the date is rendered correctly
    const date = canvas.getByText('March 15, 2025')
    expect(date).toBeInTheDocument()
    
    // Test that the status badge is rendered correctly
    const status = canvas.getByText('To Do')
    expect(status).toBeInTheDocument()
    expect(status).toHaveClass('bg-gray-100')
    expect(status).toHaveClass('text-gray-700')
  },
}

export const InProgressTask: Story = {
  args: {
    task: {
      ...baseTask,
      title: 'Implement user authentication',
      description: 'Add login, registration, and password reset functionality',
      status: 'in_progress',
    },
    displayStatus: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test that the task title is rendered correctly
    const title = canvas.getByText('Implement user authentication')
    expect(title).toBeInTheDocument()
    
    // Test that the task description is rendered correctly
    const description = canvas.getByText('Add login, registration, and password reset functionality')
    expect(description).toBeInTheDocument()
    
    // Test that the status badge is rendered correctly
    const status = canvas.getByText('In Progress')
    expect(status).toBeInTheDocument()
    expect(status).toHaveClass('bg-yellow-100')
    expect(status).toHaveClass('text-yellow-700')
  },
}

export const DoneTask: Story = {
  args: {
    task: {
      ...baseTask,
      title: 'Setup project structure',
      description: 'Initialize repository and configure build tools',
      status: 'done',
    },
    displayStatus: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test that the task title is rendered correctly
    const title = canvas.getByText('Setup project structure')
    expect(title).toBeInTheDocument()
    
    // Test that the task description is rendered correctly
    const description = canvas.getByText('Initialize repository and configure build tools')
    expect(description).toBeInTheDocument()
    
    // Test that the status badge is rendered correctly
    const status = canvas.getByText('Done')
    expect(status).toBeInTheDocument()
    expect(status).toHaveClass('bg-green-100')
    expect(status).toHaveClass('text-green-700')
  },
}

export const WithoutStatus: Story = {
  args: {
    task: {
      ...baseTask,
      status: 'todo',
    },
    displayStatus: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test that the task title is rendered correctly
    const title = canvas.getByText('Complete project documentation')
    expect(title).toBeInTheDocument()
    
    // Test that the task description is rendered correctly
    const description = canvas.getByText('Write comprehensive documentation for the project including API references and examples')
    expect(description).toBeInTheDocument()
    
    // Test that the status badge is NOT rendered
    const statusElement = canvas.queryByText('To Do')
    expect(statusElement).not.toBeInTheDocument()
  },
}

export const WithCustomWidth: Story = {
  args: {
    task: {
      ...baseTask,
      status: 'todo',
    },
    displayStatus: true,
    className: 'w-96',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test that the card has the custom width class
    const card = canvasElement.querySelector('.w-96')
    expect(card).toBeInTheDocument()
    
    // Test that all content is still rendered correctly
    const title = canvas.getByText('Complete project documentation')
    const description = canvas.getByText('Write comprehensive documentation for the project including API references and examples')
    const status = canvas.getByText('To Do')
    
    expect(title).toBeInTheDocument()
    expect(description).toBeInTheDocument()
    expect(status).toBeInTheDocument()
  },
}
