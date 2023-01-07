const { Router } = require('@edgio/core/router')

// All pages can be cached as all of them would be client side rendered
const pages = ['/fonts/:path*', '/icons/:path*', '/tasks', '/task/:path*', 'calendar']

const router = new Router()

pages.forEach((i) => {
  router.match(i, ({ cache }) => {
    cache({ edge: { maxAgeSeconds: 60 * 60 * 24 * 365 } })
  })
})

router.fallback(({ renderWithApp }) => {
  renderWithApp()
})

export default router
