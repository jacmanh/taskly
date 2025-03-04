/* eslint-disable jsx-a11y/anchor-is-valid */
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { Button } from '../../atoms/Button/Button'
import { Dropdown } from './Dropdown'

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
  title: 'Molecules/Dropdown',
  decorators: [
    (Story) => (
      <div style={{ padding: '3rem', height: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Dropdown>

export const Default: Story = {
  args: {
    trigger: (
      <Button variant="primary" data-testid="dropdown-trigger">
        Open Menu
      </Button>
    ),
    children: (
      <div data-testid="dropdown-content">
        <div className="py-1">
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            data-testid="profile-link"
          >
            Profile
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            data-testid="settings-link"
          >
            Settings
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            data-testid="signout-link"
          >
            Sign out
          </a>
        </div>
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // For elements in the portal, we need to search the entire document
    const body = within(document.body)

    // Test that the trigger button is rendered correctly
    const button = canvas.getByTestId('dropdown-trigger')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Open Menu')

    // Initially, the dropdown should be closed
    let dropdownContent = body.queryByTestId('dropdown-content')
    expect(dropdownContent).not.toBeInTheDocument()

    // Click the button to open the dropdown
    await userEvent.click(button)

    // Now the dropdown should be open
    dropdownContent = body.getByTestId('dropdown-content')
    expect(dropdownContent).toBeInTheDocument()

    // Check that the dropdown items are visible
    const profileLink = body.getByTestId('profile-link')
    const settingsLink = body.getByTestId('settings-link')
    const signOutLink = body.getByTestId('signout-link')

    expect(profileLink).toBeInTheDocument()
    expect(settingsLink).toBeInTheDocument()
    expect(signOutLink).toBeInTheDocument()

    // Click the button again to close the dropdown
    await userEvent.click(button)

    // Wait for the animation to complete
    await new Promise((resolve) => setTimeout(resolve, 150))

    // The dropdown should be closed again
    dropdownContent = body.queryByTestId('dropdown-content')
    expect(dropdownContent).not.toBeVisible()

    // Open the dropdown again
    await userEvent.click(button)
    dropdownContent = body.getByTestId('dropdown-content')
    expect(dropdownContent).toBeInTheDocument()

    // Click outside to close the dropdown (clicking on the container)
    await userEvent.click(canvasElement)

    // Wait for the animation to complete
    await new Promise((resolve) => setTimeout(resolve, 150))

    // The dropdown should be closed again
    dropdownContent = body.queryByTestId('dropdown-content')
    expect(dropdownContent).not.toBeVisible()
  },
}
