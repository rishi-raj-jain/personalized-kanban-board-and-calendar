// This file was automatically added by layer0 deploy.
// You should commit this file to source control.
const { Router } = require('@layer0/core/router')

module.exports = new Router()
  // All pages can be cached as all of them would be client side rendered
  .match('/fonts/:path*', ({ cache }) => {
    cache({ edge: { maxAgeSeconds: 60 * 60 * 24 * 365 } })
  })
  .match('/icons/:path*', ({ cache }) => {
    cache({ edge: { maxAgeSeconds: 60 * 60 * 24 * 365 } })
  })
  .match('/tasks', ({ cache }) => {
    cache({ edge: { maxAgeSeconds: 60 * 60 * 24 * 365 } })
  })
  .match('/task/:path', ({ cache }) => {
    cache({ edge: { maxAgeSeconds: 60 * 60 * 24 * 365 } })
  })
  .match('/calendar', ({ cache }) => {
    cache({ edge: { maxAgeSeconds: 60 * 60 * 24 * 365 } })
  })
  .fallback(({ renderWithApp }) => {
    renderWithApp()
  })
