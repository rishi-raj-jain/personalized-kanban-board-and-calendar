const { join } = require('path')
const { exit } = require('process')
const { DeploymentBuilder } = require('@layer0/core/deploy')

const appDir = process.cwd()
const builder = new DeploymentBuilder(appDir)

module.exports = async function build(options) {
  try {
    builder.clearPreviousBuildOutput()
    let command = 'npm run build'
    await builder.exec(command)
    builder.addJSAsset(join(appDir, '.next', 'standalone'), 'dist')
    builder.addJSAsset(join(appDir, '.next', 'static'), join('dist', '.next', 'static'))
    builder.addJSAsset(join(appDir, 'public'), join('dist', 'public'))
    await builder.build()
  } catch (e) {
    console.log(e)
    exit()
  }
}
