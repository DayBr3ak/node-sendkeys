'use strict'
const { spawn, spawnSync } = require('child_process')

const scriptFactory = () => keys => `
$wshell = New-Object -ComObject wscript.shell;
$wshell.SendKeys("${keys}");
`

const argumentChecker = (arg, type) => {
  if (typeof arg !== type) {
    throw new Error('Argument must be of type ' + type)
  }
}

const accum = stream => {
  const buffers = []
  stream.on('data', data => buffers.push(data))
  return () => Buffer.concat(buffers).toString()
}

const spawnPowershellScript = command => {
  const p = spawn('powershell', ['-command', command], {
    stdio: 'pipe'
  })
  const errData = accum(p.stderr)

  return new Promise((resolve, reject) => {
    p.on('close', code => {
      if (code !== 0) {
        return reject(errData())
      }
      resolve()
    })
  })
}

const spawnPowershellScriptSync = command => {
  const { stderr, status } = spawnSync('powershell', ['-command', command])
  if (status !== 0) {
    throw stderr
  }
}

const sendKeysFactory = (isSync, script, spawn, argumentChecker) => {
  const sendKeys = keys => {
    argumentChecker(keys, 'string')
    const command = script(keys)
    return spawn(command)
  }
  if (isSync) {
    return sendKeys
  }
  return keys => Promise.resolve().then(() => sendKeys(keys))
}

module.exports = {
  sendKeysFactory,
  spawnPowershellScript,
  spawnPowershellScriptSync,
  scriptFactory,
  argumentChecker
}
