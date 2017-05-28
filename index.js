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

const renderCell = (x, y, text, fg, bg, inverse, underline, bold) => {
	// todo: inverse
	return h('text', {
		x: (x * 8 / 10).toFixed(3).replace('.000', ''),
		y: y + '',
		style: {
			fill: fg,
			backgroundColor: bg,
			fontWeight: bold ? 'bold' : 'normal',
			textDecoration: underline ? 'underline' : 'none'
		}
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
				const bg = colors[(raw & masks.bg) >> shifts.bg] || '#000'

				cells.push(renderCell(x, y, text, fg, bg, inverse, underline, bold))
			}
		}

		return h('svg', {
			xmlns: 'http://www.w3.org/2000/svg',
			width: (meta.width * 10) + '',
			height: (meta.height * 10 * 8 / 10).toFixed(3),
			viewBox: `0 -1 ${meta.width} ${meta.height - 1}`,
			style: {
				backgroundColor: '#000',
				fontFamily: 'monospace',
				fontSize: '1',
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
