// create a node that will compile to HTML
const element = (tagName, classes = [], children = [], properties = {}) => {
  properties.className = classes.length ? classes : properties.className
  return {
    type: 'admonitionHTML',
    data: {
      hName: tagName,
      hProperties: classes.length
        ? {
            className: classes
          }
        : {},
      hProperties: properties
    },
    children
  }
}
exports.element = element
