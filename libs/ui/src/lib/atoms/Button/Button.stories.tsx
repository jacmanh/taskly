import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from '@storybook/test'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Atoms/Button',
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: /primary button/i })
    
    // Test that the button renders correctly
    expect(button).toBeInTheDocument()
    
    // Test that the button is clickable
    await userEvent.click(button)
    expect(args.onClick).toHaveBeenCalled()
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: /secondary button/i })
    
    // Test that the button renders correctly
    expect(button).toBeInTheDocument()
    
    // Test that the button is clickable
    await userEvent.click(button)
    expect(args.onClick).toHaveBeenCalled()
  },
}

export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Disabled Button',
    disabled: true,
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: /disabled button/i })
    
    // Test that the button renders correctly
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
    
    // Test that the button is not clickable when disabled
    await userEvent.click(button)
    expect(args.onClick).not.toHaveBeenCalled()
  },
}

export const Small: Story = {
  args: {
    variant: 'primary',
    children: 'Small Button',
    className: 'text-sm py-1 px-2',
    onClick: fn(),
  },
}

export const Large: Story = {
  args: {
    variant: 'primary',
    children: 'Large Button',
    className: 'text-lg py-3 px-6',
    onClick: fn(),
  },
}
