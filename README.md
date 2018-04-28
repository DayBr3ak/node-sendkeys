# sendkeys

Emulate the keyboard over node.

Only on windows. (uses System.Windows.Forms)

No external module needed, but depends on Powershell being in the PATH and .NET with System.Windows.Forms

## usage

```javascript

const sendkeys = require('sendkeys')
import sendkeys from 'sendkeys'

sendkeys('foobar')
  .then(() => console.log('success'))

```
