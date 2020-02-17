const { element } = require('./element')

const { types } = require('./types')

// handles different types of whitespace
const unified = require('unified')
const html = require('rehype-parse')
const visit = require('unist-util-visit')

const NEWLINE = '\n'

// default options for plugin
const defaultOptions = {
  customTypes: [], //custom types here.
  useDefaultTypes: true, //set to false if you don't want to use default types
  tag: ':::', 
  icons: 'svg', //can be 'emoji' or 'none'
  classMaster: 'admonition' //generate admonition-content, admonition-icon, admonition-heading
}

// override default options
const configure = options => {
  const { customTypes, ...baseOptions } = {
    ...defaultOptions,
    ...options
  }

  return {
    ...baseOptions,
    types: baseOptions.useDefaultTypes ? { ...types, ...customTypes } : {...customTypes}
  }
}

// escape regex special characters
function escapeRegExp(s) {
  return s.replace(new RegExp(`[-[\\]{}()*+?.\\\\^$|/]`, 'g'), '\\$&')
}

// helper: recursively replace nodes
const _nodes = ({
  tagName: hName,
  properties: hProperties,
  position,
  children
}) => {
  return {
    type: 'admonitionHTML',
    data: {
      hName,
      hProperties
    },
    position,
    children: children.map(_nodes)
  }
}

// convert HTML to MDAST (must be a single root element)
const nodes = markup => {
  return _nodes(
    unified()
      .use(html)
      .parse(markup).children[0].children[1].children[0]
  )
}

// create a simple text node
const text = value => {
  return {
    type: 'text',
    value
  }
}

// passed to unified.use()
// you have to use a named function for access to `this` :(
module.exports = function attacher(options) {
  const config = configure(options)

  // match to determine if the line is an opening tag
  const keywords = Object.keys(config.types)
    .map(escapeRegExp)
    .join('|')
  const tag = escapeRegExp(config.tag)
  const regex = new RegExp(`${tag}(${keywords})(?: *(.*))?\n`)
  const escapeTag = new RegExp(escapeRegExp(`\\${config.tag}`), 'g')

  // the tokenizer is called on blocks to determine if there is an admonition present and create tags for it
  function blockTokenizer(eat, value, silent) {
    // stop if no match or match does not start at beginning of line
    const match = regex.exec(value)
    if (!match || match.index !== 0) return false
    // if silent return the match
    if (silent) return true

    const now = eat.now()
    const [opening, keyword, title] = match
    const food = []
    const content = []

    // consume lines until a closing tag
    let idx = 0
    while ((idx = value.indexOf(NEWLINE)) !== -1) {
      // grab this line and eat it
      const next = value.indexOf(NEWLINE, idx + 1)
      const line =
        next !== -1 ? value.slice(idx + 1, next) : value.slice(idx + 1)
      food.push(line)
      value = value.slice(idx + 1)
      // the closing tag is NOT part of the content
      if (line.startsWith(config.tag)) break
      content.push(line)
    }

    // consume the processed tag and replace escape sequences
    const contentString = content.join(NEWLINE).replace(escapeTag, config.tag)
    const add = eat(opening + food.join(NEWLINE))

    // parse the content in block mode
    const exit = this.enterBlock()
    const contentNodes = element(
      'div',
      `${config.classMaster}-content`,
      this.tokenizeBlock(contentString, now)
    )
    exit()
    // parse the title in inline mode
    const titleNodes = this.tokenizeInline(title || keyword, now)
    // create the nodes for the icon
    const entry = config.types[keyword]
    const settings = typeof entry === 'string' ? config.types[entry] : entry
    let iconContainerNodes = []
    let iconNodes = ''
    if (settings.svg && settings.emoji) {
      iconNodes =
        config.icons === 'svg' ? nodes(settings.svg) : text(settings.emoji)
      iconContainerNodes =
        config.icons === 'none'
          ? []
          : [element('div', `${config.classMaster}-icon`, [iconNodes])]
    }

    // build the nodes for the full markup
    let admonition = element(
      'div',
      [`${config.classMaster}`, `${config.classMaster}-${keyword}`],
      [
        element('div', `${config.classMaster}-heading`, [
          element('h5', '', iconContainerNodes.concat(titleNodes))
        ]),
        contentNodes
      ]
    )
    if (settings.customBlock) {
      admonition = element(
        (tagName = settings.tagName),
        (classes = []),
        (children = settings.children
          ? eval(settings.children)
          : [contentNodes]),
        (properties = settings.properties ? settings.properties : {})
      )
    }

    return add(admonition)
  }

  // add tokenizer to parser after fenced code blocks
  const Parser = this.Parser.prototype
  Parser.blockTokenizers.admonition = blockTokenizer
  Parser.blockMethods.splice(
    Parser.blockMethods.indexOf('fencedCode') + 1,
    0,
    'admonition'
  )
  Parser.interruptParagraph.splice(
    Parser.interruptParagraph.indexOf('fencedCode') + 1,
    0,
    ['admonition']
  )
  Parser.interruptList.splice(
    Parser.interruptList.indexOf('fencedCode') + 1,
    0,
    ['admonition']
  )
  Parser.interruptBlockquote.splice(
    Parser.interruptBlockquote.indexOf('fencedCode') + 1,
    0,
    ['admonition']
  )

  // TODO: add compiler rules for converting back to markdown

  return function transformer(tree) {
    // escape everything except admonitionHTML nodes
    visit(
      tree,
      node => {
        return node.type !== 'admonitionHTML'
      },
      function visitor(node) {
        if (node.value) node.value = node.value.replace(escapeTag, config.tag)
        return node
      }
    )
  }
}
