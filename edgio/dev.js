const { createDevServer } = require('@edgio/core/dev')

module.exports = function () {
  return createDevServer({
    label: '[Next.js]',
    command: (port) => `PORT=${port} npm run dev`,
    ready: [/localhost:/i],
  })
}
