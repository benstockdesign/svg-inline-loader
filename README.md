<a href="https://github.com/webpack/webpack">
    <img src="https://cdn.rawgit.com/webpack/media/e7485eb2/logo/icon.svg" 
	     alt="Webpack icon" 
	     width="200" 
	     height="200">
</a>

# SVG Inline Loader for Webpack (BSD Edition)
A modified version of [Webpack SVG Inline Loader](https://github.com/webpack-contrib/svg-inline-loader) that inlines SVG as a module.

## Installation

```bash
npm install svg-inline-loader --save-dev
```

## Configuration

Simply add configuration object to `module.loaders` like this.

```js
{
    test: /\.svg$/,
    loader: "svg-inline-loader"
}
```

or

```js
{
    test: /\.svg$/,
    loader: "svg-inline-loader",
    options: {
        classPrefix: "icon-",
        removedTags: ["style"]
    }
}
```

### Options

#### `classPrefix`: `string|null` (default: `null`)  
A prefix to apply to class names to avoid name collisions between SVG files.  
  
#### `idPrefix`: `string|null` (default: `null`)  
A prefix to apply to IDs to avoid name collisions between SVG files.  
  
#### `removedTags`: `[...string]` (default: `[]`)  
An array of tags that should be removed from the resulting SVG.  
  
#### `removeRootSVGAttributes`: `boolean` (default: `true`)  
A Boolean value indicating whether the `width` and `height` attributes should be removed from the resulting `<svg>` element.  
  
#### `removedAttributes`: `[...string]` (default: `[]`)  
An array containing the names of attributes to remove from elements found within the root `<svg>` element.  
  
#### `warningTags`: `[...string]` (default: `[]`)  
An array of tags for which warnings should be output to the console, e.g., `['desc', 'defs', 'style']`.  
  
#### `warningAttributes`: `[...string]` (default: `[]`)  
An array containing the names of attributes to emit warnings for when encountered on children of the root `<svg>` element.  
  
## Usage

### Configured

#### Simple
Set up inline SVG loading using default configuration.

**webpack.config.js**
```js
{
    test: /\.svg$/,
    loader: "svg-inline-loader"
}
```

**path/to/some/file.js**
```js
// Set `icon` to contents of "path/to/some/icon.svg"
const icon = require("./icon.svg")
```

### Inline

#### Override Configured Loaders
Set constant `icon` to the contents of file *icon.svg* overriding any `loaders`, `preLoaders`, and `postLoaders` specified in the webpack configuration.
```js
const icon = require("!svg-inline-loader!./icon.svg")
console.log(icon)
// Prints: "<svg> ... </svg>"
```

#### Default Hashed Prefix
```js
// Using default hashed prefix (__[hash:base64:7]__)
var logoTwo = require('svg-inline-loader?classPrefix!./logo_two.svg');
```
#### Custom Class Prefix
```js
// Using custom string
var logoOne = require('svg-inline-loader?classPrefix=my-prefix-!./logo_one.svg');
```

#### Custom Class Prefix and Hash
```js
// Using custom string and hash
var logoThree = require('svg-inline-loader?classPrefix=__prefix-[sha512:hash:hex:5]__!./logo_three.svg');
```

---

See [loader-utils](https://github.com/webpack/loader-utils#interpolatename) for hash options.

Preferred usage is via a `module.loaders`:
```js
{
    test: /\.svg$/,
    loader: "svg-inline-loader",
	options: {
		classPrefix: "",
		warningAttributes: ["style", "name"]
	}
}
```
