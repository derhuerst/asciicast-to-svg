'use strict'

const {createRenderer} = require('.')

const asciicast = require('./example.json')

const render = createRenderer(asciicast)

let svg = ''
for (let [delay, data] of asciicast.stdout) {
	svg = render(data)
}

process.stdout.write(svg)
