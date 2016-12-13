'use babel'

import path from 'path'
import fs from 'fs'
import menu from './menu'
import { getLinter } from './syntax-checker.bundle'

let log = require('./log-prefix')('[EDE]')
require('./animate-jquery')

export default {

  callbacks: {
    activate: [],
    deactivate: [],
    serialize: [],

    onFileVisibleInTree: [],
    consumeStatusBar: []
  },

  activate (state) {
    require('atom-package-deps')
      .install('emp-frontend-devtool')
      .then(() => {
        console.log('All dependencies installed, good to go')
      })

    fs.readdirSync(__dirname)
      .filter(file => {
        return fs.statSync(path.join(__dirname, file))
                 .isDirectory()
      })
      .filter(file => {
        return file.endsWith('.bundle')
      })
      .forEach(file => {
        log('Loading bundle:', file)

        let bundle = require('./' + file)

        for (let callback in this.callbacks) {
          if (bundle[callback]) {
            bundle[callback].this = bundle
            this.callbacks[callback].push(bundle[callback])
          }
        }
      })

    log('Activate bundles')

    this.callbacks.activate.forEach((callback) => {
      callback.call(callback.this, state)
    })
  },

  deactivate () {
    log('Deactivate bundles')

    this.callbacks.deactivate.forEach((callback) => {
      callback.call(callback.this)
    })
    // lp.stop(this.luaPack)
  },

  serialize () {
    let state = {}

    this.callbacks.serialize.forEach((callback) => {
      let _state = callback.call(callback.this)

      if (Array.isArray(_state)) {
        state[_state[0]] = _state[1]
      }
    })

    return state
  },

  onFileVisibleInTree () {
    let provider = {
      iconClassForPath: file => {
        // log('file visible in tree view:', file)

        this.callbacks
            .onFileVisibleInTree
            .forEach(callback => {
              callback.call(callback.this, file)
            })
        return 'icon-file-text'
      },
      onWillDeactivate: () => ({ dispose: () => {} })
    }

    return provider
  },

  provideLinter: () => ({
    name: 'Luaparse',
    grammarScopes: ['source.lua'],
    scope: 'file',
    lintOnFly: true,
    lint: getLinter
  }),

  consumeStatusBar (statusBar) {
    this.callbacks.consumeStatusBar.forEach(callback => {
      callback.call(callback.this, statusBar)
    })
  },

  consumeToolBar (getToolBar) {
    let toolBar = getToolBar('emp-frontend-devtool')
    menu.draw(toolBar)
  }

}