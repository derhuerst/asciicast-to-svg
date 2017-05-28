'use strict'

const test = require('tape')
const h = require('virtual-dom/virtual-hyperscript/svg')

const {createRenderer} = require('.')
const renderAt = require('.')

const asciicast = {
	version: 1,
	width: 12,
	height: 2,
	duration: 1,
	command: 'bash',
	title: 'Demo Asciicast',
	env: {},
	stdout: [
		[.2, '\u001b[38;5;1mH'], // H
		[.2, 'e'], // He
		[.2, '\u001b[38;5;2mll'], // Hell
		[.2, 'o\u001b[0m'] // Hello
	]
}

const firstChar = h('text', {
	x: '0',
	y: '16',
	style: {
		fill: 'rgb(187,0,0)'
	}
}, 'H')
const secondChar = h('text', {
	x: '10',
	y: '16',
	style: {
		fill: 'rgb(187,0,0)'
	}
}, 'e')

test('createRenderer', (t) => {
	t.plan(4)
	const renderer = createRenderer(asciicast)
	for (let [delay, data] of asciicast.stdout) renderer.write(data)

	const text = renderer.text()
	t.strictEqual(typeof text, 'string')
	t.ok(text.indexOf('Hello') >= 0)

	const svg = renderer.render()
	t.deepEqual(svg.children[0], firstChar)
	t.deepEqual(svg.children[1], secondChar)
})

test('renderAt', (t) => {
	t.plan(2)
	const svg = renderAt(asciicast, .4)

	t.deepEqual(svg.children[0], firstChar)
	t.deepEqual(svg.children[1], secondChar)
})
