// The original implementation (https://github.com/webpack-contrib/svg-inline-loader) 
// removes the `title`, `desc`, `defs`, and `style` tags when the `removeTags` option 
// is set to `true`. This version, on the other hand, drops the `removeTags` option 
// altogether, and defers to the tags listed explicitly for removal.
module.exports = {
    classPrefix: null,
    idPrefix: null,
    removedTags: [],
    removedAttributes: [],
    removeRootSVGAttributes: true,
    warningTags: [],
    warningAttributes: []
};
