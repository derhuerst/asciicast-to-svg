# asciicast-to-svg

**Render frames of [Asciicasts](https://github.com/asciinema/asciinema/blob/master/doc/asciicast-v1.md) as [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG)s.**

[![npm version](https://img.shields.io/npm/v/asciicast-to-svg.svg)](https://www.npmjs.com/package/asciicast-to-svg)
[![build status](https://img.shields.io/travis/derhuerst/asciicast-to-svg.svg)](https://travis-ci.org/derhuerst/asciicast-to-svg)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/asciicast-to-svg.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)


## Installing

```shell
npm install derhuerst/asciicast-to-svg
```


## Usage

To render an individual frame, use `createRenderer`.

```js
const {createRenderer} = require('asciicast-to-svg')

const asciicast = { /* … */ }
const render = createRenderer({width: asciicast.width, height: asciicast.height})

let svg = ''
for (let i = 0; i < 3; i++) {
	const data = asciicast.stdout[i][1]
	svg = render(data)
}

console.log(svg)
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/asciicast-to-svg/issues).
