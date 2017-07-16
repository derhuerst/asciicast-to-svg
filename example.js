'use strict'

const toString = require('vdom-to-html')
const renderAt = require('.')

const asciicast = require('./example.json')

console.log(toString(renderAt(asciicast, .3)))
