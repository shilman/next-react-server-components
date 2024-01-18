import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent } from '@storybook/test'
import { http, HttpResponse } from 'msw'

import News from './page'
import ErrorPage from '../../error'
import { range, createPost, reset } from '../../../lib/data.mock'

// FIXME: Need help getting the types working @kasperpeulen
const Wrapper = ({ params, postCount }: { params: any; postCount: number }) => (
  <News params={params} />
)

const meta = {
  title: 'app/News',
  component: Wrapper,
  argTypes: { postCount: { control: { type: 'range', min: 1, max: 100 } } },
  args: {
    params: { page: 1 },
    postCount: 10
  }
} satisfies Meta<typeof Wrapper>
export default meta

type Story = StoryObj<typeof meta>

// Note that after we set up MSW globally, our orginal story is broken
export const Home: Story = {}

export const Mocked: Story = {
  ...Home,
  parameters: {
    msw: {
      handlers: [
        http.get(
          'https://hacker-news.firebaseio.com/v0/topstories.json',
          () => {
            return HttpResponse.json([1])
          }
        ),
        http.get('https://hacker-news.firebaseio.com/v0/item/1.json', () => {
          return HttpResponse.json({
            id: 1,
            time: Date.now(),
            user: 'shilman',
            url: 'http://storybook.js.org',
            title: 'Storybook + Next.js = ❤️',
            score: 999
          })
        })
      ]
    }
  }
}

export const MockedNew = {
  ...Home,
  loaders: [
    () => {
      reset()
      createPost({
        id: -1,
        user: 'shilman',
        url: 'http://storybook.js.org',
        title: 'Storybook + Next.js = ❤️',
        score: 999
      })
    }
  ]
}

export const FullPage = {
  args: {
    postCount: 30
  },
  loaders: [
    ({ args: { postCount } }) => {
      reset()
      range(postCount).map(() => createPost())
    }
  ]
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
      reset()
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
