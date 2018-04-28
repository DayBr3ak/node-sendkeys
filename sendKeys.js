'use strict'
const {
  sendKeysFactory,
  spawnPowershellScript,
  scriptFactory,
  argumentChecker,
  csSource
} = require('./sendKeys.factory.win')

const sendKeys = sendKeysFactory(
  scriptFactory(csSource),
  spawnPowershellScript,
  argumentChecker
)
sendKeys.default = sendKeys // ES6

module.exports = sendKeys
