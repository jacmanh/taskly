import type { Preview } from '@storybook/react'
import React from 'react'
import '../libs/ui/src/global.css'
import './storybook.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      autodocs: false,
    },
    options: {
      storySort: {
        order: ['Atoms', 'Molecules', 'Organisms', 'Templates', 'Pages', 'Features'],
      },
    },
  },
  decorators: [
    (Story) => {
      return React.createElement(
        'div',
        { className: 'storybook-container p-4' },
        React.createElement(Story, null)
      )
    },
  ],
}

export default preview
