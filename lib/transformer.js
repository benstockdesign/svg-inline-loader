const assign = require("object-assign")
const conditions = require("./conditions")
const defaultConfig = require("../config")

function removeRootSizeAttributes(token) {
	if (!conditions.isSVGToken(token)) {
		return token
	}
	const notWidthOrHeight = conditions.isNotWidthOrHeightAttribute
	token.attributes = token.attributes.filter(notWidthOrHeight)
	return token
}

function createRemoveAttributeTransform(attributes) {
	attributes = attributes || []
	const hasNoAttributes = conditions.createHasNoAttributes(attributes)
	return function removeAttributes(token) {
		if (conditions.isStartTag(token)) {
			token.attributes = token.attributes.filter(hasNoAttributes)
		}
		return token
	}
}

function createWarningAttributeTransform(attributes) {
	attributes = attributes || []
	const hasNoAttributes = conditions.createHasAttributes(attributes)
	return function warningAttributes(token) {
		if (!conditions.isStartTag(token)) {
			return token
		}
		const attributePairs = token.attributes.filter(hasNoAttributes)
		if (attributePairs.length === 0) {
			return token
		}
		const attributeNames = attributePairs.map(([name,]) => name).join(", ")
		// const attributeNames = []
		// for (let i = 0; i < attributePairs.length; i += 1) {
		// 	const attr = attributePairs[i]
		// 	attributeNames.push(attr[0])
		// }
		console.warn(
			`[svg-inline-loader] Tag ${token.tagName} has ` +
			`forbidden attributes: ${attributeNames}`
		)
		return token
	}
}

// noinspection JSUnusedLocalSymbols
function isRemovedTag(removedTags, token) {
	return removedTags.indexOf(token.tagName) > -1
}

// noinspection JSUnusedLocalSymbols
function isWarningTag(warningTags, token) {
	return warningTags.indexOf(token.tagName) > -1
}

// FIXME: Due to limtation of parser, we need to implement our
// very own little state machine to express tree structure

function createRemovedTagTransform(tags) {
	tags = tags || []
	let removedTag = null
	
	return function removedTags(token) {
		if (removedTag == null) {
			if (tags.indexOf(token.tagName) > -1) {
				removedTag = token.tagName
			} else {
				return token
			}
			// if (isRemovedTag(tags, token)) {
			// 	removedTag = token.tagName
			// } else {
			// 	return token
			// }
		} else if (token.tagName === removedTag && token.type === "EndTag") {
			// Reached the end tag of a removedTag
			removedTag = null
		}
	}
}

function createWarningTagTransform(tags) {
	tags = tags || []
	return function warningTags(token) {
		// isWarningTag(tags, token)
		if (conditions.isStartTag(token) && tags.indexOf(token.tagName) > -1) {
			console.warn(`[svg-inline-loader] Forbidden tag: ${token.tagName}`)
		}
		return token
	}
}

function getAttributeIndex(token, name) {
	if (token.attributes !== undefined && token.attributes.length > 0) {
		// return token.attributes.findIndex(([n,]) => n === name)
		for (let i = 0; i < token.attributes.length; i += 1) {
			if (token.attributes[i][0] === name) return i
		}
	}
	return -1
}

function createClassPrefixTransform(prefix) {
	
	// See: https://bit.ly/31bgQDe
	const re = /\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)(?![^{]*})/g
	let inStyleTag = false

	return function prefixClasses(token) {
		if (inStyleTag) {
			let string = token.chars
			// push matches to an array so we can operate in reverse
			let match;
			const matches = []
			while ((match = re.exec(string))) {
				matches.push(match)
			}
			// update the string in reverse so our matches indices don't get off
			for (let i = matches.length - 1; i >= 0; i -= 1) {
				const splitIndex = matches[i].index + 1
				const prevPart = string.substring(0, splitIndex)
				const nextPart = string.substring(splitIndex)
				string = prevPart + prefix + nextPart
			}
			token.chars = string
			inStyleTag = false
		}
		else if (conditions.isStyleToken(token)) {
			inStyleTag = true
		}
		else {
			const index = getAttributeIndex(token, "class")
			if (index >= 0) {
				// Prefix classes when multiple classes are present
				let classes = token.attributes[index][1]
				let prefixedClass = ""
				classes = classes.replace(/[ ]+/, " ")
				classes = classes.split(" ")
				classes.forEach(function(className) {
					prefixedClass += prefix + className + " "
				})
				token.attributes[index][1] = prefixedClass
			}
		}
		return token
	}
}

function createIdPrefixTransform(prefix) {
	const urlPattern = /^url\(#.+\)$/i
	return function prefixIds(token) {
		let index = getAttributeIndex(token, "id")
		if (index !== -1) {
			// prefix id definitions
			token.attributes[index][1] = prefix + token.attributes[index][1]
		}
		if (token.tagName === "use") {
			// replace references via <use xlink:href="#foo">
			index = getAttributeIndex(token, "xlink:href")
			if (index !== -1) {
				const remaining = token.attributes[index][1].substring(1)
				token.attributes[index][1] = "#" + prefix + remaining
			}
		}
		if (token.attributes && token.attributes.length > 0) {
			// replace instances of url(#foo) in attributes
			token.attributes.forEach(function (attr) {
				if (attr[1].match(urlPattern)) {
					attr[1] = attr[1].replace(urlPattern, function (match) {
						const id = match.substring(5, match.length - 1)
						return `url(#${prefix}${id})`
					})
				}
			})
		}
		return token
	}
}

function transform(tokens, overrides) {
	const config = conditions.isNonEmptyObject(overrides)
		? assign({}, defaultConfig, overrides)
		: defaultConfig
	const transformations = []
	let value;
	if (typeof (value = config.classPrefix) === "string") {
		transformations.push(createClassPrefixTransform(value))
	}
	if (typeof (value = config.idPrefix) === "string") {
		transformations.push(createIdPrefixTransform(value))
	}
	if (config.removeRootSVGAttributes) {
		transformations.push(removeRootSizeAttributes)
	}
	if ((value = config.warningTags).length > 0) {
		transformations.push(createWarningTagTransform(value))
	}
	if ((value = config.removedTags).length > 0) {
		transformations.push(createRemovedTagTransform(value))
	}
	if ((value = config.warningAttributes).length > 0) {
		transformations.push(createWarningAttributeTransform(value))
	}
	if ((value = config.removedAttributes).length > 0) {
		transformations.push(createRemoveAttributeTransform(value))
	}
	transformations.forEach(transformation => {
		tokens = tokens.map(transformation)
	})
	return tokens.filter(token => token != null)
}

// noinspection JSUnusedGlobalSymbols
module.exports = {
	removeRootSizeAttributes,
	createRemovedTagTransform,
	createClassPrefixTransform,
	transform
}
