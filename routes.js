// This file was automatically added by layer0 deploy.
// You should commit this file to source control.
const { Router } = require('@layer0/core/router')
const { nextRoutes } = require('@layer0/next')

module.exports = new Router()
  .match('/service-worker.js', ({ serviceWorker }) => {
    return serviceWorker('.next/static/service-worker.js')
  })
  // All pages can be cached as all of them would be client side rendered
  .match('/tasks', ({ cache }) => {
    cache({ edge: { maxAgeSeconds: 60 * 60 * 24 * 365 } })
  })
  .match('/task/:path', ({ cache }) => {
    cache({ edge: { maxAgeSeconds: 60 * 60 * 24 * 365 } })
  })
  .match('/calendar', ({ cache }) => {
    cache({ edge: { maxAgeSeconds: 60 * 60 * 24 * 365 } })
  })
  .use(nextRoutes) // automatically adds routes for all files under /pages
