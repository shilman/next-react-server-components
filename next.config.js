const { withStorybook } = require('@storybook/nextjs-server/next-config')

/** @type {import('next').NextConfig} */
const nextConfig = withStorybook()({
  productionBrowserSourceMaps: true
  // async rewrites() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/news/1'
  //     }
  //   ]
  // }
})

module.exports = nextConfig
