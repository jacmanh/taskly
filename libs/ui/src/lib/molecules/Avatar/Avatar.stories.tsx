import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  component: Avatar,
  title: 'Molecules/Avatar',
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  args: {},
}

export const AvatarGroup: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar />
      <Avatar />
      <Avatar />
      <div className="w-10 h-10 text-sm bg-gray-300 flex items-center justify-center rounded-full">
        +3
      </div>
    </div>
  ),
}
