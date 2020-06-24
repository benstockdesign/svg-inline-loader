const simpleHTMLTokenizer = require('simple-html-tokenizer')
// noinspection JSUnresolvedVariable
const stringToTokens = simpleHTMLTokenizer.tokenize
// noinspection JSUnresolvedVariable
const tokensToString = simpleHTMLTokenizer.generate
const utils = require('loader-utils')
const assign = require('object-assign')

const conditions = require('./lib/conditions')
const transformer = require('./lib/transformer')

/**
 * The replacements array contains several pattern-replacement pairs that are
 * used when sanitizing the initial SVG content.
 * 
 * The following details each entry:
 * 
 * - Replaces XML element tag(s) with empty strings.
 * - Replaces doctype declaration(s) with empty strings.
 * - Replaces comments with empty strings.
 * - Replaces self-closing XML SVG tags with explicitly-closed HTML5 SVG tags.
 * - Replaces runs of whitespace characters with a single space.
 * - Replaces space characters between tags with empty strings.
 * 
 * @type {[[RegExp, string]]}
 */
const replacements = [
	[/<\?xml[\s\S]*?>/gi, ""],                  
	[/<!doctype[\s\S]*?>/gi, ""],               
	[/<!--.*-->/gi, ""],                        
	[/<([A-Za-z]+)([^>]*)\/>/g, "<$1$2></$1>"], 
	[/\s+/g, " "],                              
	[/> </g, "><"]                              
]

/**
 * The default hash token used for prefixes explicitly set to empty strings.
 * 
 * @type {string}
 */
const defaultPrefixHashToken = "__[hash:base64:7]__"

/**
 * Extract and transform SVG content from a given string, and return the result.
 * 
 * @param {string} content - A string containing SVG markup.
 * 
 * @param {Object?} options - An optional object containing settings to use
 *        when extracting the SVG.
 *        
 * @return {string} A string containing the processed SVG data from `content`.
 */
function extractSVG(content, options) {
	let config, tokens
	
	// If options are specified, create a copy of them.
	if (options) {
		config = assign({}, options)
		// Interpolate hashes for `classPrefix` and `idPrefix` options
		for (const key of ["classPrefix", "idPrefix"]) {
			let name = config[key]
			if (typeof name !== "string") continue
			if (name.length === 0) {
				name = defaultPrefixHashToken
			}
			config[key] = utils.interpolateName({}, name, {content})
		}
	}
	
    // Clean up string before tokenization.
	for (const [pattern, replacement] of replacements) {
		content = content.replace(pattern, replacement)
	}
	content = content.trim()
    
	// Tokenize the string, falling back to the sanitized result upon failure.
    try {
        tokens = stringToTokens(content)
    } catch (_) { 
        console.warn("[svg-inline-loader] Invalid SVG: tokenization failed")
        return content
    }
    
	// Apply transformations to HTML tokens according to configuration options.
	tokens = transformer.transform(tokens, config)
	
	// Convert transformed tokens back into string form, and return the result.
    return tokensToString(tokens)
}

/**
 * @param {string} content
 * @return {string}
 */
function SVGInlineLoader(content) {
    if (this.cacheable) {
        this.cacheable()
    }
    // noinspection JSUnusedGlobalSymbols
	this.value = content
    const options = utils.getOptions(this)
    const result = extractSVG(content, options)
    return `module.exports = ${JSON.stringify(result)}`
}

SVGInlineLoader.getExtractedSVG = extractSVG
SVGInlineLoader.conditions = conditions
SVGInlineLoader.replacements = replacements

module.exports = SVGInlineLoader
