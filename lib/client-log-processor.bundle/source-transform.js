'use babel'

import fs from 'fs'

let log = require('../log-prefix')('[client-log.sourcemap]')
let smfile = '/Users/lujingbo/src/rytongwork/ebank-poc/public/www/resource_dev/common/lua/eff.lua.sourcemap'
// let pattern = /\[string &quot\(function\(modules\)\.{3}&quot]:(\d+)/g
let pattern = /\[string &quot;([^&]+)&quot;]:(\d+)/g
let _sourcemap = {}

let load = () => {
  try {
    _sourcemap = JSON.parse(fs.readFileSync(smfile, 'utf8'))
  } catch (err) {
    _sourcemap = {}
    log(err.message)
  }
}

if (fs.existsSync(smfile)) {
  fs.watch(smfile, (event) => {
    if (event === 'change') {
      load()
    }
  })
  load()
}

export default function (source) {
  return source.replace(pattern, (orig, name, line) => {
    if (name !== '...') {
      let link = `<a href="#"
                     class="text-subtle"
                     file=${name}
                     line=${line}
                  >${name}:${line}</a>`

      return link
    } else {
      return '匿名脚本'
    }
  })
  // return source.replace(pattern, (orig, line) => {
  //   for (let file in _sourcemap) {
  //     let region = _sourcemap[file]
  //     if (line >= region[0] && line <= region[1]) {
  //       let lineno = line - region[0] - 2
  //       let bn = path.basename(file)
  //       return `<a href="#" class="text-subtle" file=${file} line=${lineno}>${bn}:${lineno}</a>`
  //     }
  //   }
  //
  //   return orig
  // })
}
