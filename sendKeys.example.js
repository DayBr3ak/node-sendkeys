'use strict'

const sendKeys = require('./sendKeys')

sendKeys('I took over your keyboard!').then(() => {
  console.log('Hello world!')
})
