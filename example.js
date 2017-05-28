'use strict'

const toString = require('virtual-dom-stringify')
const renderAt = require('.')

const asciicast = require('./example.json')

console.log(toString(renderAt(asciicast, .3)))
