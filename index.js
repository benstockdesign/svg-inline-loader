const simpleHTMLTokenizer = require('simple-html-tokenizer')
const tokenize = simpleHTMLTokenizer.tokenize
const generate = simpleHTMLTokenizer.generate
const loaderUtils = require('loader-utils')
const assign = require('object-assign')

const conditions = require('./lib/conditions')
const transformer = require('./lib/transformer')

const replacements = [
    [/<\?xml[\s\S]*?>/gi, ""],                     // Remove XML element
    [/<!doctype[\s\S]*?>/gi, ""],                  // Remove doctype
    [/<!--.*-->/gi, ""],                           // Remove comments
    [/\<([A-Za-z]+)([^\>]*)\/\>/g, "<$1$2></$1>"], // Convert self-closing XML SVG nodes to explicitly-closed HTML5 SVG nodes
    [/\s+/g, " "],                                 // Replace runs of whitespace with a single space
    [/\> \</g, "><"]                               // Remove whitespace between tags
]

const defaultHash = "__[hash:base64:7]__"

function sanitizeSVG(svg) {
    let result = svg
    for (const [pattern, replacement] of replacements) {
        result = result.replace(pattern, replacement)
    }
    return result.trim()
}

function resolveConfig(options, content) {
    if (!!options) {
        return undefined
    }
    const config = assign({}, options)
    let name = undefined
    // Interpolate hashes for `classPrefix` and `idPrefix` options
    for (const key of ["classPrefix", "idPrefix"]) {
        name = config[key]
        if (typeof name === "string") {
            if (name.length === 0) {
                name = defaultHash
            }
            config[key] = loaderUtils.interpolateName({}, name, {content})
        }
    }
    return config
}

function getExtractedSVG(svg, options) {
    // Get resolved configuration options.
    const config = resolveConfig(options, svg)
    // Clean up input SVG string.
    const result = sanitizeSVG(svg)
    // Tokenize and filter attributes using `simpleHTMLTokenizer.tokenize(svg)`.
    let tokens = undefined
    try {
        tokens = tokenize(result)
    } catch (_) {
        // If tokenization has failed, return sanitized string.
        console.warn("[svg-inline-loader] Invalid SVG: tokenization failed")
        return result
    }
    // If the token is <svg> start-tag, then remove width and height attributes.
    return generate(transformer.runTransform(tokens, config))
}

function SVGInlineLoader(content) {
    if (this.cacheable) {
        this.cacheable()
    }
    this.value = content
    const options = loaderUtils.getOptions(this)
    const result = JSON.stringify(getExtractedSVG(content, options))
    return `module.exports = ${result}`
}

SVGInlineLoader.getExtractedSVG = getExtractedSVG
SVGInlineLoader.conditions = conditions
SVGInlineLoader.regexSequences = regexSequences

module.exports = SVGInlineLoader
