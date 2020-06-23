<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" vspace="" hspace="25"
      src="https://cdn.rawgit.com/webpack/media/e7485eb2/logo/icon.svg">
  </a>
  <h1>SVG Inline Loader for Webpack</h1>
  <p>This Webpack loader inlines SVG as module. If you use Adobe suite or Sketch to export SVGs, you will get auto-generated, unneeded crusts. This loader removes it for you, too.<p>
</div>

## Installation

```bash
npm install svg-inline-loader --save-dev
```

## Configuration

Simply add configuration object to `module.loaders` like this.

```javascript
    {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
    }
```

### Options

- #### `classPrefix`: `string|null` (default: `null`)  
  A prefix to apply to class names to avoid name collisions between SVG files.  
  
- #### `idPrefix`: `string|null` (default: `null`)  
  A prefix to apply to IDs to avoid name collisions between SVG files.  
  
- #### `removedTags`: `[...string]` (default: `[]`)  
  An array of tags that should be removed from the resulting SVG.  
  
- #### `removeRootSVGAttributes`: `boolean` (default: `true`)  
  A Boolean value indicating whether the `width` and `height` attributes should be removed from the resulting `<svg>` element.  
  
- #### `removedAttributes`: `[...string]` (default: `[]`)  
  An array containing the names of attributes to remove from elements found within the root `<svg>` element.  
  
- #### `warningTags`: `[...string]` (default: `[]`)  
  An array of tags for which warnings should be output to the console, e.g., `['desc', 'defs', 'style']`.  
  
- #### `warningAttributes`: `[...string]` (default: `[]`)  
  An array containing the names of attributes to emit warnings for when encountered on children of the root `<svg>` element.  
  
## Example Usage

```js
// Using default hashed prefix (__[hash:base64:7]__)
var logoTwo = require('svg-inline-loader?classPrefix!./logo_two.svg');

// Using custom string
var logoOne = require('svg-inline-loader?classPrefix=my-prefix-!./logo_one.svg');

// Using custom string and hash
var logoThree = require('svg-inline-loader?classPrefix=__prefix-[sha512:hash:hex:5]__!./logo_three.svg');
```
See [loader-utils](https://github.com/webpack/loader-utils#interpolatename) for hash options.

Preferred usage is via a `module.loaders`:
```js
    {
        test: /\.svg$/,
        loader: 'svg-inline-loader?classPrefix'
    }
```

[npm]: https://img.shields.io/npm/v/svg-inline-loader.svg
[npm-url]: https://npmjs.com/package/svg-inline-loader

[deps]: https://david-dm.org/webpack-contrib/svg-inline-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/svg-inline-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

[test]: https://travis-ci.org/webpack-contrib/svg-inline-loader.svg?branch=master
[test-url]: https://travis-ci.org/webpack-contrib/svg-inline-loader

[cover]: https://codecov.io/gh/webpack-contrib/svg-inline-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/svg-inline-loader
