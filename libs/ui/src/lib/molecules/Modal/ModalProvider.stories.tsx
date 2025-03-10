import { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { ModalBody } from './ModalBody'
import { ModalFooter } from './ModalFooter'
import { ModalHeader } from './ModalHeader'
import { ModalProvider, useModal } from './ModalProvider'

const meta: Meta<typeof ModalProvider> = {
  component: ModalProvider,
  title: 'Molecules/Modal',
  decorators: [
    (Story) => (
      <div>
        <ModalProvider>
          <Story />
        </ModalProvider>
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof ModalProvider>

export const Default: Story = {
  render: () => {
    const { openModal } = useModal()
    return <button onClick={() => openModal(<div>Modal Content</div>)}>Open Modal</button>
  },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Open Modal' })
    await userEvent.click(button)
    expect(canvasElement).toHaveTextContent('Modal Content')
  },
}

export const WithComposition: Story = {
  render: () => {
    const { openModal, closeModal } = useModal()
    return (
      <button
        onClick={() =>
          openModal(
            <div>
              <ModalHeader>Modal Header</ModalHeader>
              <ModalBody>Modal Content</ModalBody>
              <ModalFooter className="flex justify-end gap-2">
                <button onClick={() => closeModal()}>Close</button>
                <button onClick={() => closeModal()}>Submit</button>
              </ModalFooter>
            </div>
          )
        }
      >
        Open Modal
      </button>
    )
  },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Open Modal' })
    await userEvent.click(button)
    expect(canvasElement).toHaveTextContent('Modal Content')
    const close = within(canvasElement).getByRole('button', { name: 'Close' })
    await userEvent.click(close)
    expect(canvasElement).not.toHaveTextContent('Modal Content')
  },
}
