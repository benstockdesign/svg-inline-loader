/**
 * @param {Token?} token - A token to test.
 *
 * @return {boolean} `true` if `token` is an opening tag; else, `false`.
 */
function isStartTag(token) {
    return token !== undefined && token.type === "StartTag"
}

/**
 * @param {Token?} token - A token to test.
 *
 * @return {boolean} `true` if `token` is a start `"svg"` tag; else, `false`.
 */
function isSVGToken(token) {
	return isStartTag(token) && token.tagName === "svg"
}

/**
 * @param {Token?} token - A token to test.
 * 
 * @return {boolean} `true` if `token` is a start `"style"` tag; else, `false`.
 */
function isStyleToken(token) {
    return isStartTag(token) && token.tagName === "style"
}

/**
 * @param {Object?} object - A value to test.
 * 
 * @return {boolean} `true` if `object` is a non-`null` object with at least
 *         one key specified for an own property; otherwise, `false`.
 */
function isNonEmptyObject(object) {
	return object != null
		&& typeof object === "object"
		&& Object.keys(object).length !== 0
}

/**
 * @param {AttributePair} token - An attribute name-value pair to test.
 * 
 * @return {boolean} `true` if the attribute specified by `token` does *not*
 *         have a name of `"width"` or `"height"`.
 */
function isNotWidthOrHeightAttribute(token) {
	return token[0] !== "width" && token[0] !== "height"
}

/**
 * @param {Array<string>} attributes - An array of attribute names to search.
 *
 * @return {function(token: AttributePair): boolean} A function that returns a
 *         Boolean value indicating whether a given attribute does not exist in 
 *         the source array of attributes.
 */
function createHasNoAttributes(attributes) {
	return function hasNoAttributes(token) {
		return attributes.indexOf(token[0]) === -1
	}
}

/**
 * @param {Array<string>} attributes - An array of attribute names to search.
 * 
 * @return {function(token: AttributePair): boolean} A function that returns a
 *         Boolean value indicating whether a given attribute exists in the
 *         source array of attributes.
 */
function createHasAttributes(attributes) {
	return function hasAttributes(token) {
		return attributes.indexOf(token[0]) > -1
	}
}

module.exports = {
	isSVGToken,
	isStyleToken,
	isNonEmptyObject,
	isNotWidthOrHeightAttribute,
	createHasNoAttributes,
	createHasAttributes,
	isStartTag
}

// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------

/**
 * @typedef {Array<string>} AttributePair
 * @property {string} 0 - The name of the attribute.
 * @property {string} 1 - The value of the attribute.
 */

/**
 * @typedef {Array<AttributePair>} AttributeList
 */

/**
 * @typedef {Object} StartTag
 * @property {string} type - The type of token ("StartTag").
 * @property {string} tagName - The name of tag.
 * @property {AttributeList} attributes - The tag’s attributes.
 * @property {boolean} selfClosing - Whether the tag is self closing.
 */

/**
 * @typedef {Object} EndTag
 * @property {string} type - The type of token ("EndTag")
 * @property {string} tagName - The name of the tag.
 */

/**
 * @typedef {Object} Chars
 * @property {string} type - The type of token ("Chars").
 * @property {string} chars - The character data.
 */

/**
 * @typedef {Object} Comment
 * @property {string} type - The type of token ("Comment").
 * @property {string} chars - The contents of the comment.
 */

/**
 * @typedef {StartTag|EndTag|Chars|Comment} Token
 */
