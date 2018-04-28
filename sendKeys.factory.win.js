'use strict'
const spawn = require('child_process').spawn

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

const sendKeysFactory = (script, spawn, argumentChecker) => keys => {
  return Promise.resolve().then(() => {
    argumentChecker(keys, 'string')
    const command = script(keys)
    return spawn(command)
  })
}

module.exports = {
  sendKeysFactory,
  spawnPowershellScript,
  scriptFactory,
  argumentChecker,
  csSource
}
