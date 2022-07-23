const { createDevServer } = require('@layer0/core/dev')

module.exports = function () {
  return createDevServer({
    label: 'Next.js',
    command: (port) => `PORT=${port} npm run dev`,
    ready: [/localhost:/i],
    filterOutput: (line) => !line.includes('localhost:')
  })
}
