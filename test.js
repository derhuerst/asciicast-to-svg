'use strict'

const test = require('tape')

const {createRenderer} = require('.')

const asciicast = {
	version: 1,
	width: 12,
	height: 2,
	duration: .6,
	command: 'bash',
	title: '',
	env: {
		TERM: 'xterm-256color',
		SHELL: '/bin/bash'
	},
	stdout: [
		[.01, '\u001b[1;31mH'],
		[.02, 'e'],
		[.03, 'l'],
		[.04, 'l'],
		[.05, 'o'],
		[.06, ' '],
		[.11, '\u001b[32mW'],
		[.12, 'o'],
		[.13, 'r'],
		[.14, 'l'],
		[.15, 'd'],
		[.16, '!\u001b[0m']
	]
}

test('createRenderer', (t) => {
	t.plan(2)
	const render = createRenderer({width: asciicast.width, height: asciicast.height})

	let svg = ''
	for (let [delay, data] of asciicast.stdout) {
		svg = render(data)
	}

	t.strictEqual(typeof svg, 'string')
	t.ok(svg.indexOf('Hello World!') >= 0)
})
