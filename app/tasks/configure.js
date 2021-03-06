'use strict'

let path = require('path')
let partial = require('underscore').partial

let os = require('../util/os')

let log = require('../util/log')('tasks/configure')

let CaveStore = require('../stores/cave-store')
let AppActions = require('../actions/app-actions')

let self = {
  configure: async function (app_path) {
    let platform = os.platform()

    switch (platform) {
      case 'win32':
      case 'darwin':
      case 'linux':
        return require(`./configure/${platform}`).configure(app_path)
      default:
        throw new Error(`Unsupported platform: ${platform}`)
    }
  },

  start: async function (opts) {
    let id = opts.id

    let app_path = CaveStore.app_path(id)
    log(opts, `configuring ${app_path}`)

    let executables = (await self.configure(app_path)).executables
    executables = executables.map(partial(path.relative, app_path))

    AppActions.cave_update(id, {executables})
    return executables.length + ' candidates'
  }
}

module.exports = self
