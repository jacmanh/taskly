import type { Meta, StoryObj } from '@storybook/react'
import { Field } from './Field'

const meta: Meta<typeof Field> = {
  component: Field,
  title: 'Atoms/Field',
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'password', 'email', 'number', 'date'],
    },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
}

export default meta
type Story = StoryObj<typeof Field>

export const Text: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
  },
}

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter email address...',
  },
}

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
}

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter a number...',
  },
}

export const Date: Story = {
  args: {
    type: 'date',
  },
}

export const Disabled: Story = {
  args: {
    type: 'text',
    placeholder: 'Disabled field',
    disabled: true,
  },
}

export const Required: Story = {
  args: {
    type: 'text',
    placeholder: 'Required field',
    required: true,
  },
}
