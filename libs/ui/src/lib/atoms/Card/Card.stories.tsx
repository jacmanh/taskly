import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'

const meta: Meta<typeof Card> = {
  component: Card,
  title: 'Atoms/Card',
  argTypes: {
    className: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    children: 'This is a simple card with default styling',
  },
}

export const WithTitle: Story = {
  args: {
    children: (
      <>
        <h3 className="text-lg font-semibold mb-2">Card Title</h3>
        <p>This is a card with a title and some content.</p>
      </>
    ),
  },
}

export const WithFooter: Story = {
  args: {
    children: (
      <div className="flex flex-col">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold mb-2">Card with Footer</h3>
          <p className="mb-4">This card has a footer with actions.</p>
        </div>
        <div className="border-t pt-3 mt-3 flex justify-end space-x-2">
          <button className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
          <button className="px-3 py-1 bg-blue-500 text-white rounded">Save</button>
        </div>
      </div>
    ),
  },
}

export const CustomStyling: Story = {
  args: {
    className: 'bg-blue-50 border-blue-200 p-6',
    children: 'This card has custom styling applied through className',
  },
}
