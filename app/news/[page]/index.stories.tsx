import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent } from '@storybook/test'

import News from './page'
import ErrorPage from '../../error'
import { arr, createPost, setup } from '../../../lib/data.mock'

const meta = {
  title: 'app/News',
  component: News,
  argTypes: { postCount: { control: { type: 'range', min: 1, max: 100 } } }
} satisfies Meta<typeof News & { postCount: number }>
export default meta

type Story = StoryObj<typeof meta>

export const Home: Story = {
  loaders: [
    ({ args: { postCount } }) => {
      setup()
      arr(postCount).map(() => createPost())
    }
  ],
  args: {
    params: { page: 1 },
    postCount: 10
  }
}

export const Mocked = {
  loaders: [
    () => {
      setup()
      createPost({
        user: 'shilman',
        url: 'http://storybook.js.org',
        title: 'Storybook + Next.js = ❤️',
        score: 999
      })
    }
  ],
  args: {
    params: { page: 1 }
  }
}

export const Upvoted: Story = {
  ...Home,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const votes = await canvas.findAllByText('▲')
    await userEvent.click(votes[0])
  }
}

export const Empty: Story = {
  loaders: [
    () => {
      setup()
    }
  ],
  args: {
    params: { page: 1 }
  }
}

export const ErrorStory: Story = {
  name: 'Error',
  render: () => <ErrorPage error={new Error('Boom!')} />
}
