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
		x: x + '',
		y: y + '',
		style: {
			color: fg,
			backgroundColor: bg,
			fontWeight: bold ? 'bold' : 'normal',
			textDecoration: underline ? 'underline' : 'none'
		}
	}, text)
}

const createRenderer = (meta) => {
	const t = new Terminal(meta.width, meta.height)

	const render = (diff) => {
		t.write(diff)
		// const text = t.displayBuffer.toString()
		const b = t.displayBuffer

		const cells = []
		for (let y = 0; y < meta.height; y++) {
			for (let x = 0; x < meta.width; x++) {
				const [raw, text] = b.getCell(y, x)
				if (!text || text === ' ') continue

				const inverse = !!((raw & masks.inverse) >> shifts.inverse)
				const underline = !!((raw & masks.underline) >> shifts.underline)
				const bold = !!((raw & masks.bold) >> shifts.bold)
				const fg = '#' + (colors.fg[(raw & masks.fg) >> shifts.fg] || 'fff')
				const bg = '#' + (colors.bg[(raw & masks.bg) >> shifts.bg] || '000')

				cells.push(renderCell(x, y, text, fg, bg, inverse, underline, bold))
			}
		}

		return h('svg', {
			xmlns: 'http://www.w3.org/2000/svg',
			width: meta.width,
			height: meta.height,
			viewBox: `0 0 ${meta.width} ${meta.height}`,
			style: {backgroundColor: '#000'}
		}, cells)
	}

	return render
}

module.exports = {createRenderer}
