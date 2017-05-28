'use strict'

const Benchmark = require('benchmark')

const {createRenderer} = require('.')
const asciicast = require('./example.json')

const empty = createRenderer(asciicast)
const simple = createRenderer(asciicast)
for (let [delay, data] of asciicast.stdout) simple.write(data)

const suite = new Benchmark.Suite()

.add('empty renderer.render()', () => {
	empty.render()
})

.add('simple renderer.render()', () => {
	simple.render()
})

.add('renderAt()', () => {
	renderAt(asciicast, .3)
})

.on('cycle', (e) => console.log(e.target.toString()))
.run({async: true})
