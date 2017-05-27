'use strict'

const Terminal = require('headless-terminal')

const createRenderer = (meta) => {
	const t = new Terminal(meta.width, meta.height)

	const render = (diff) => {
		t.write(diff)
		const text = t.displayBuffer.toString()
		return text
	}

	return render
}

module.exports = {createRenderer}
