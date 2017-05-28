'use strict'

const Terminal = require('headless-terminal')
const colors = require('./colors')
const h = require('virtual-dom/virtual-hyperscript/svg')

// bit masks, see https://github.com/dtinth/screen-buffer#cell-attributes
const flags = [
	['bg', 9],
	['fg', 9],
	['bold', 1],
	['underline', 1],
	['inverse', 1]
]

const shifts = {}
const masks = {}

let offset = 0
for (let [name, size] of flags) {
	shifts[name] = offset
	masks[name] = parseInt('1'.repeat(size) + '0'.repeat(offset), 2)
	offset += size
}

const projectX = (x) => Math.round(x * .5 * 2000) / 100
const projectY = (y) => Math.round(y * 2000) / 100

const renderCell = (x, y, text, fg, bg, inverse, underline, bold) => {
	const s = {fill: fg}
	if (underline) s.textDecoration = 'underline'
	if (bold) s.fontWeight = 'bold'
	if (bg && bg !== '#000') s.backgroundColor = bg

	// todo: inverse
	return h('text', {
		x: projectX(x) + '',
		y: projectY(y + .8) + '',
		style: s
	}, text)
}

const createRenderer = (meta) => {
	const t = new Terminal(meta.width, meta.height)

	const write = (diff) => {
		t.write(diff)
	}

	const text = () => t.displayBuffer.toString()

	const render = () => {
		const b = t.displayBuffer

		const cells = []
		for (let y = 0; y < meta.height; y++) {
			for (let x = 0; x < meta.width; x++) {
				const [raw, text] = b.getCell(y, x)
				if (!text || text === ' ') continue

				const inverse = !!((raw & masks.inverse) >> shifts.inverse)
				const underline = !!((raw & masks.underline) >> shifts.underline)
				const bold = !!((raw & masks.bold) >> shifts.bold)
				const fg = colors[(raw & masks.fg) >> shifts.fg] || '#fff'
				const bg = colors[(raw & masks.bg) >> shifts.bg]

				cells.push(renderCell(x, y, text, fg, bg, inverse, underline, bold))
			}
		}

		const width = projectY(.5) + projectX(meta.width)
		const height = projectY(.5) + projectY(meta.height)

		return h('svg', {
			xmlns: 'http://www.w3.org/2000/svg',
			width: width + '',
			height: height + '',
			viewBox: [-projectY(.25), -projectY(.25), width, height].join(' '),
			style: {
				backgroundColor: '#000',
				fontFamily: "Consolas, Menlo, 'Bitstream Vera Sans Mono', monospace, 'Powerline Symbols'",
				fontSize: projectY(.8),
				stroke: 'none'
			}
		}, cells)
	}

	return {write, text, render}
}

const renderAt = (asciicast, time) => {
	const renderer = createRenderer(asciicast)

	let t = 0
	for (let [delay, data] of asciicast.stdout) {
		t += delay
		if (t > time) break

		renderer.write(data)
	}

	return renderer.render()
}

renderAt.createRenderer = createRenderer
module.exports = renderAt
