import { resolve } from 'path'
import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  stories: ['../app/**/*.mdx', '../app/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  },
  features: {
    experimentalNextRSC: true
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    return {
      ...config,
      // plugins: [
      //   ...(config.plugins || []),
      //   new IgnorePlugin({ resourceRegExp: /server-only$/ })
      // ]
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          'server-only$': resolve(__dirname, '../mocks/server-only.js')
        }
      }
    }
  }
}
export default config
