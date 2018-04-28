'use strict'
const {
  sendKeysFactory,
  spawnPowershellScript,
  spawnPowershellScriptSync,
  scriptFactory,
  argumentChecker,
  csSource
} = require('./sendKeys.factory.win')

const script = scriptFactory(csSource)

const sendKeys = sendKeysFactory(
  false,
  script,
  spawnPowershellScript,
  argumentChecker
)

const sendKeysSync = sendKeysFactory(
  true,
  script,
  spawnPowershellScriptSync,
  argumentChecker
)

sendKeys.default = sendKeys // ES6
sendKeys.sync = sendKeysSync

module.exports = sendKeys
