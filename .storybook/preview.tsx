import React from 'react';
import type { Preview } from '@storybook/react'

import { Layout } from '../app/layout.tsx'
import * as data from '../lib/data.mock.ts';
import { http, HttpResponse } from 'msw'
import { initialize, mswLoader } from 'msw-storybook-addon';

initialize({ onUnhandledRequest: 'warn' })

const preview: Preview = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://hacker-news.firebaseio.com/v0/topstories.json', () => {
          const result = data.postIds();
          return HttpResponse.json(result);
        }),
        http.get('https://hacker-news.firebaseio.com/v0/item/:id.json', ({ params }) => {
          const { id: idParam } = params;
          const id = parseInt(Array.isArray(idParam) ? idParam[0] : idParam, 10);
          return HttpResponse.json(data.getItem(id));
        }),
      ]
    },
    viewport: {
      viewports: {
        small: { name: "Small", styles: { width: "640px", height: "800px" } },
        large: { name: "Large", styles: { width: "1024px", height: "1000px" } },
      },
    },
    chromatic: {
      modes: {
        mobile: { viewport: "small" },
        // desktop: { viewport: "large" },
      }
    }
  },
  loaders: [mswLoader],
  decorators: [(Story) => <Layout><Story /></Layout>],
}

export default preview
