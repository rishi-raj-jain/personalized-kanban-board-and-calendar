// This file was automatically added by layer0 init.
// You should commit this file to source control.

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const _preLayer0Export = withBundleAnalyzer({
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/edit',
        destination: '/create',
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tasks',
        permanent: true,
      },
    ]
  },
})

module.exports = _preLayer0Export
