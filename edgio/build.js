const { join } = require('path')
const { DeploymentBuilder } = require('@edgio/core/deploy')

const appDir = process.cwd()
const builder = new DeploymentBuilder(appDir)

module.exports = async function build({}) {
    builder.clearPreviousBuildOutput()
    await builder.exec('npm run build')
    builder.addJSAsset(join(appDir, '.next', 'standalone'), 'dist')
    builder.addJSAsset(join(appDir, '.next', 'static'), join('dist', '.next', 'static'))
    builder.addJSAsset(join(appDir, 'public'), join('dist', 'public'))
    await builder.build()
}
