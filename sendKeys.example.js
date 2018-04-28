'use strict'

const sendKeys = require('./sendKeys')

sendKeys('I took over your keyboard!').then(() => {
  console.log('sendKey over!')
})

sendKeys.sync('Mr Foo! ')
console.log('sendKeySync over!')
