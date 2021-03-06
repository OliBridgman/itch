'use strict'

let os = require('../util/os')

let Log = require('../util/log')
let log = Log('dispatcher')
let opts = {logger: new Log.Logger({sinks: {console: !!process.env.MARCO_POLO}})}
let electron = require('electron')

let spammy = {
  CAVE_PROGRESS: true,
  GAMES_FETCHED: true
}

// This makes sure everything is dispatched to the node side, whatever happens
if (os.process_type() === 'renderer') {
  let ipc = electron.ipcRenderer

  // Using IPC over RPC because the latter breaks when passing instances of
  // Babel-compiled ES6 classes (only the fields seem to be exposed, not the methods)
  let self = {
    _callbacks: {},

    register: (name, cb) => {
      if (self._callbacks[name]) {
        throw new Error(`Can't register store twice (renderer-side): ${name}`)
      }
      log(opts, `Registering store ${name} renderer-side`)
      self._callbacks[name] = cb
    },

    dispatch: (payload) => {
      ipc.send('dispatcher-dispatch', payload)
    }
  }

  ipc.on('dispatcher-dispatch2', (ev, payload) => {
    Object.keys(self._callbacks).forEach((store_id) => {
      let cb = self._callbacks[store_id]
      cb(payload)
    })
  })

  module.exports = self
} else {
  let ipc = electron.ipcMain
  let BrowserWindow = electron.BrowserWindow

  // Adapted from https://github.com/parisleaf/flux-dispatcher
  // A Flux-style dispatcher with promise support and some amount of validation
  class Dispatcher {
    constructor () {
      this._callbacks = {}
      this._message_id_seed = 0
    }

    /**
     * Register an action callback, returns dispatch token
     */
    register (name, callback) {
      if (typeof name !== 'string') {
        throw new Error('Invalid store registration (non-string name)')
      }
      if (self._callbacks[name]) {
        throw new Error(`Can't register store twice (renderer-side): ${name}`)
      }
      log(opts, `Registering store ${name} node-side`)
      this._callbacks[name] = callback
    }

    /**
     * Expects payload to be an object with at least 'action_type', otherwise
     * will throw - helps debugging missing constants
     */
    dispatch (payload) {
      if (typeof payload.action_type === 'undefined') {
        throw new Error(`Trying to dispatch action with no type: ${JSON.stringify(payload, null, 2)}`)
      }

      if (!spammy[payload.action_type]) {
        if (payload.private) {
          log(opts, `dispatching ${payload.action_type}`)
        } else {
          log(opts, `dispatching: ${JSON.stringify(payload, null, 2)}`)
        }
      }

      Object.keys(this._callbacks).forEach((store_id) => {
        let callback = this._callbacks[store_id]
        if (typeof callback === 'function') {
          callback(payload)
        }
      })

      BrowserWindow.getAllWindows().forEach(w =>
        w.webContents.send('dispatcher-dispatch2', payload)
      )
    }
  }

  let self = new Dispatcher()

  ipc.on('dispatcher-dispatch', (ev, payload) => {
    self.dispatch(payload)
  })

  module.exports = self
}
