#!/usr/bin/env node
'use strict'

const minimist = require('minimist')
const toString = require('vdom-to-html')

const pkg = require('./package.json')
const renderAt = require('.')

const argv = minimist(process.argv.slice(2))

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    asciicast-to-svg [time]

Arguments:
    time   Which frame to render, in seconds.

Examples:
    cat some-asciicast.json | asciicast-to-svg 2.3 > some-asciicast.svg
\n`)
	process.exit(0)
}

if (argv.version || argv.v) {
	process.stdout.write(`asciicast-to-svg v${pkg.version}\n`)
	process.exit(0)
}

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

let asciicast = ''
process.stdin
.on('error', showError)
.on('data', (d) => {
	asciicast += d.toString('utf8')
})
.once('end', () => {
	try {
		asciicast = JSON.parse(asciicast)

		let seconds = parseFloat(argv._[0])
		if (Number.isNaN(seconds)) seconds = asciicast.duration

		const svg = toString(renderAt(asciicast, seconds))
		process.stdout.write(svg)
	} catch (err) {
		return showError(err)
	}
})
