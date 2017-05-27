'use strict'

const toString = require('virtual-dom-stringify')
const {createRenderer} = require('.')

const asciicast = require('./example.json')

const render = createRenderer(asciicast)

let svg = null
for (let [delay, data] of asciicast.stdout) {
	svg = render(data)
}

console.log(toString(svg))
