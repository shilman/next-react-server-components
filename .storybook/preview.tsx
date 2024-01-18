import React from 'react'
import type { Preview } from '@storybook/react'

import { Layout } from '../app/layout.tsx'
import { postIds, getItem } from '../lib/data.mock.ts'
import { http, HttpResponse } from 'msw'
import { initialize, mswLoader } from 'msw-storybook-addon'

initialize({ onUnhandledRequest: 'warn' })

const preview: Preview = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://hacker-news.firebaseio.com/v0/topstories.json', () =>
          HttpResponse.json(postIds())
        ),
        http.get<{ id: string }>(
          'https://hacker-news.firebaseio.com/v0/item/:id.json',
          ({ params }) => HttpResponse.json(getItem(parseInt(params.id, 10)))
        )
      ]
    },
    viewport: {
      viewports: {
        small: { name: 'Small', styles: { width: '640px', height: '800px' } },
        large: { name: 'Large', styles: { width: '1024px', height: '1000px' } }
      }
    },
    chromatic: {
      modes: {
        mobile: { viewport: 'small' },
        desktop: { viewport: 'large' }
      }
    }
  },
  decorators: [
    (Story) => (
      <Layout>
        <Story />
      </Layout>
    )
  ],
  loaders: [mswLoader]
}

export default preview
