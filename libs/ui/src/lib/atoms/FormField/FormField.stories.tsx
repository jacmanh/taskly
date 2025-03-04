import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { Field } from '../Field/Field'
import { FormField } from './FormField'

const meta: Meta<typeof FormField> = {
  component: FormField,
  title: 'Atoms/FormField',
  argTypes: {
    label: { control: 'text' },
    inline: { control: 'boolean' },
    errorMessage: { control: 'text' },
    hint: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof FormField>

export const Default: Story = {
  args: {
    label: 'Username',
    children: <Field type="text" placeholder="Enter your username" />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test that the label is rendered correctly
    const label = canvas.getByText('Username')
    expect(label).toBeInTheDocument()
    
    // Test that the input field is rendered correctly
    const input = canvas.getByPlaceholderText('Enter your username')
    expect(input).toBeInTheDocument()
    
    // Test that the input is interactive
    await userEvent.type(input, 'testuser')
    expect(input).toHaveValue('testuser')
  },
}

export const WithHint: Story = {
  args: {
    label: 'Password',
    hint: 'Password must be at least 8 characters long',
    children: <Field type="password" placeholder="Enter your password" />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test that the label is rendered correctly
    const label = canvas.getByText('Password')
    expect(label).toBeInTheDocument()
    
    // Test that the hint is rendered correctly
    const hint = canvas.getByText('Password must be at least 8 characters long')
    expect(hint).toBeInTheDocument()
    
    // Test that the input field is rendered correctly
    const input = canvas.getByPlaceholderText('Enter your password')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'password')
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    errorMessage: 'Please enter a valid email address',
    children: <Field type="email" placeholder="Enter your email" />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test that the label is rendered correctly
    const label = canvas.getByText('Email')
    expect(label).toBeInTheDocument()
    
    // Test that the error message is rendered correctly
    const error = canvas.getByText('Please enter a valid email address')
    expect(error).toBeInTheDocument()
    expect(error).toHaveClass('text-red-500')
    
    // Test that the input field is rendered correctly
    const input = canvas.getByPlaceholderText('Enter your email')
    expect(input).toBeInTheDocument()
  },
}

export const Inline: Story = {
  args: {
    label: 'Remember me',
    inline: true,
    children: <input type="checkbox" />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test that the label is rendered correctly
    const label = canvas.getByText('Remember me')
    expect(label).toBeInTheDocument()
    
    // Test that the checkbox is rendered correctly
    const checkbox = canvas.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    
    // Test that the checkbox is interactive
    expect(checkbox).not.toBeChecked()
    await userEvent.click(checkbox)
    expect(checkbox).toBeChecked()
  },
}

export const CompleteForm: Story = {
  render: () => (
    <form className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Registration Form</h2>
      <FormField label="Full Name">
        <Field type="text" placeholder="Enter your full name" />
      </FormField>
      <FormField label="Email Address" hint="We'll never share your email with anyone else">
        <Field type="email" placeholder="Enter your email" />
      </FormField>
      <FormField label="Password" hint="Password must be at least 8 characters long">
        <Field type="password" placeholder="Enter your password" />
      </FormField>
      <FormField label="Remember me" inline>
        <input type="checkbox" />
      </FormField>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Register
      </button>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test that the form title is rendered correctly
    const title = canvas.getByText('Registration Form')
    expect(title).toBeInTheDocument()
    
    // Test that all form fields are rendered correctly
    const nameInput = canvas.getByPlaceholderText('Enter your full name')
    const emailInput = canvas.getByPlaceholderText('Enter your email')
    const passwordInput = canvas.getByPlaceholderText('Enter your password')
    const checkbox = canvas.getByRole('checkbox')
    const submitButton = canvas.getByRole('button', { name: /register/i })
    
    expect(nameInput).toBeInTheDocument()
    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
    expect(checkbox).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
    
    // Test form interaction
    await userEvent.type(nameInput, 'John Doe')
    await userEvent.type(emailInput, 'john@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.click(checkbox)
    
    expect(nameInput).toHaveValue('John Doe')
    expect(emailInput).toHaveValue('john@example.com')
    expect(passwordInput).toHaveValue('password123')
    expect(checkbox).toBeChecked()
  },
}
