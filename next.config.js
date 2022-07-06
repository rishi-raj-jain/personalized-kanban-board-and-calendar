// This file was automatically added by layer0 init.
// You should commit this file to source control.
const { withLayer0, withServiceWorker } = require('@layer0/next/config')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const _preLayer0Export = withBundleAnalyzer({
  target: 'server',
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

module.exports = (phase, config) =>
  withLayer0(
    withServiceWorker({
      // Output sourcemaps so that stack traces have original source filenames and line numbers when tailing
      // the logs in the Layer0 developer console.
      layer0SourceMaps: true,
      // Disable Layer0 Devtools that are added
      // by default with a Next.js app in production
      // To be documented in Layer0 docs
      disableLayer0DevTools: true,
      // Existing Next.js Config
      ..._preLayer0Export,
    })
  )
