# asciicast-to-svg

**Render frames of [Asciicasts](https://github.com/asciinema/asciinema/blob/master/doc/asciicast-v1.md) as [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG)s.**

[![npm version](https://img.shields.io/npm/v/asciicast-to-svg.svg)](https://www.npmjs.com/package/asciicast-to-svg)
[![build status](https://img.shields.io/travis/derhuerst/asciicast-to-svg.svg)](https://travis-ci.org/derhuerst/asciicast-to-svg)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/asciicast-to-svg.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)


## Installing

```shell
npm install -g derhuerst/asciicast-to-svg
```


## Usage

### CLI

```txt
Usage:
    asciicast-to-svg [time]

Arguments:
    time   Which frame to render, in seconds.

Examples:
    cat some-asciicast.json | asciicast-to-svg 2.3 > some-asciicast.svg
```


### JavaScript API

To render an Asciicast at a specific time, use `renderAt`:

```js
const renderAt = require('asciicast-to-svg')
const toString = require('virtual-dom-stringify')

const asciicast = { /* … */ }

console.log(toString(renderAt(asciicast, 2.3))) // at 2.3 seconds
```

You can also render individual frames by using `createRenderer`. This example will render all frames:

```js
const {createRenderer} = require('asciicast-to-svg')

const renderer = createRenderer({width: asciicast.width, height: asciicast.height})
for (let [delay, data] of asciicast.stdout) {
	renderer.write(data)
	console.log(toString(renderer.render()))
}
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/asciicast-to-svg/issues).
