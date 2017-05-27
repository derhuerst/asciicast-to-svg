'use strict'

const Terminal = require('headless-terminal')
const colors = require('./colors')

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

const renderCell = (text, fg, bg, inverse, underline, bold) => {
	return text
}

const createRenderer = (meta) => {
	const t = new Terminal(meta.width, meta.height)

	const render = (diff) => {
		t.write(diff)
		// const text = t.displayBuffer.toString()
		const b = t.displayBuffer

		const out = []
		for (let y = 0; y < meta.height; y++) {
			for (let x = 0; x < meta.width; x++) {
				const [raw, text] = b.getCell(y, x)
				if (!text || text === ' ') continue

				const inverse = !!((raw & masks.inverse) >> shifts.inverse)
				const underline = !!((raw & masks.underline) >> shifts.underline)
				const bold = !!((raw & masks.bold) >> shifts.bold)
				const fg = colors.fg[(raw & masks.fg) >> shifts.fg]
				const bg = colors.bg[(raw & masks.bg) >> shifts.bg]

				out.push(renderCell(text, fg, bg, inverse, underline, bold))
			}
		}

		return out
	}

	return render
}

module.exports = {createRenderer}
