# sendkeys

[![npm](https://img.shields.io/npm/v/sendkeys.svg?style=flat-square)](https://www.npmjs.com/package/sendkeys)
[![npm](https://img.shields.io/npm/dm/sendkeys.svg?style=flat-square)](https://www.npmjs.com/package/sendkeys)
[![npm](https://img.shields.io/npm/l/sendkeys.svg?style=flat-square)](https://www.npmjs.com/package/sendkeys)

Emulate the keyboard over node.

No external module needed, but depends on Powershell being in the PATH.

## usage

```javascript

const sendkeys = require('sendkeys')
import sendkeys from 'sendkeys'

sendkeys('foobar')
  .then(() => console.log('success'))

sendkeys.sync('this is synchronous')
```
