import type { Meta, StoryObj } from '@storybook/react'
import { Typography } from './Typography'

const meta: Meta<typeof Typography> = {
  component: Typography,
  title: 'Atoms/Typography',
  argTypes: {
    as: {
      control: { type: 'select' },
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div'],
    },
    className: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof Typography>

export const Heading1: Story = {
  args: {
    as: 'h1',
    children: 'Heading 1',
    className: 'text-4xl font-bold',
  },
}

export const Heading2: Story = {
  args: {
    as: 'h2',
    children: 'Heading 2',
    className: 'text-3xl font-bold',
  },
}

export const Heading3: Story = {
  args: {
    as: 'h3',
    children: 'Heading 3',
    className: 'text-2xl font-bold',
  },
}

export const Paragraph: Story = {
  args: {
    as: 'p',
    children:
      'This is a paragraph of text. Typography component allows you to render any HTML element with the appropriate styling.',
    className: 'text-base',
  },
}

export const Small: Story = {
  args: {
    as: 'span',
    children: 'Small text',
    className: 'text-sm text-gray-500',
  },
}

export const TypographySystem: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography as="h1" className="text-4xl font-bold">
        Heading 1
      </Typography>
      <Typography as="h2" className="text-3xl font-bold">
        Heading 2
      </Typography>
      <Typography as="h3" className="text-2xl font-bold">
        Heading 3
      </Typography>
      <Typography as="h4" className="text-xl font-bold">
        Heading 4
      </Typography>
      <Typography as="h5" className="text-lg font-bold">
        Heading 5
      </Typography>
      <Typography as="h6" className="text-base font-bold">
        Heading 6
      </Typography>
      <Typography as="p" className="text-base">
        Regular paragraph text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in
        dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.
      </Typography>
      <Typography as="span" className="text-sm text-gray-500">
        Small text / Caption
      </Typography>
    </div>
  ),
}
