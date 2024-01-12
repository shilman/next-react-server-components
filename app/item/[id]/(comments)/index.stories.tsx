import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent } from '@storybook/test'

import Layout from '../layout'
import Item from './page'
import ItemLoading from './loading'

import { createPost, setup } from '../../../../lib/data.mock'

const meta = {
  title: 'app/Item',
  component: Item,
  decorators: [
    (Story, { args }) => (
      <Layout params={args.params}>
        <Story />
      </Layout>
    )
  ]
} satisfies Meta<typeof Item>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  loaders: [
    ({
      args: {
        params: { id },
        commentCount
      }
    }) => {
      setup()
      createPost({ kidCount: commentCount, id })
    }
  ],
  args: {
    params: {
      id: 9999
    },
    commentCount: 10
  }
}

export const Voted: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const vote = await canvas.findByText('▲')
    await userEvent.click(vote)
  }
}

export const CommentCollapsed: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const votes = await canvas.findAllByText('[-]')
    await userEvent.click(votes[0])
  }
}

export const NoComments: Story = {
  ...Default,
  args: {
    ...Default.args,
    commentCount: 0
  }
}

export const Loading: Story = {
  ...Default,
  render: ItemLoading,
  args: {
    params: {
      id: 9999
    }
  }
}
