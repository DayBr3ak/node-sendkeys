'use strict'
const { spawn, spawnSync } = require('child_process')

const csSource = `
  public static class StartUp {
    public static void Invoke(string keys) {
      System.Windows.Forms.Clipboard.SetDataObject(keys);
      System.Windows.Forms.SendKeys.SendWait("^v");
    }
  }
`

const scriptFactory = csSource => keys => `
$source=@"${csSource}\n"@;
Add-Type -ReferencedAssemblies System.Windows.Forms -TypeDefinition $source;
[StartUp]::Invoke("${keys}");
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
  argumentChecker,
  csSource
}
