'use strict'
const spawn = require('child_process').spawn

const csSource = `
  public static class StartUp {
    public static void Invoke(string keys) {
      System.Windows.Forms.SendKeys.SendWait(keys);
    }
  }
`

const script = keys => `
$source=@"${csSource}\n"@;
Add-Type -ReferencedAssemblies System.Windows.Forms -TypeDefinition $source;
[StartUp]::Invoke("${keys}");
`

const accum = stream => {
  const buffers = []
  stream.on('data', data => buffers.push(data))
  return () => Buffer.concat(buffers).toString()
}

const sendKeys = keys => {
  const command = script(keys)
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

module.exports = () => sendKeys
