# gridsome-plugin-remark-container

gridsome plugin remark container

![image](https://github.com/DavidCouronne/gridsome-plugin-remark-container/blob/master/snapshots/snapshot_1.png?raw=true)

Based on [remarkable-admonitions](https://github.com/zWingz/remarkable-admonitions)

## Installation

`npm install gridsome-plugin-remark-container`
or
`yarn add gridsome-plugin-remark-container`

```js
// gridsome.config.js
module.exports = {
  transformers: {
    //Add markdown support to all file-system sources
    remark: {
      externalLinksTarget: "_blank",
      externalLinksRel: ["nofollow", "noopener", "noreferrer"],
      anchorClassName: "icon icon-link",
      plugins: [
        "gridsome-plugin-remark-container",
      ]
    }
  }
}
```

```js
// main.js
import 'gridsome-plugin-remark-container/themes/default.css'
//or
import 'gridsome-plugin-remark-container/themes/docusaurus.css'
//or
import 'gridsome-plugin-remark-container/themes/classic.css'
//or
import 'gridsome-plugin-remark-container/themes/vuepress.css'
```

## Usage

The general syntax is

```markdown
:::keyword optional title
some content
:::
```

For example,

```markdown
:::tip pro tip
`gridsome-plugin-remark-container` is pretty great!
:::
```

The default keywords are `important`, `tip`, `note`, `warning`, and `danger`.

## Samples

![image](https://github.com/DavidCouronne/gridsome-plugin-remark-container/blob/master/snapshots/snapshot_2.png?raw=true)

![image](https://github.com/DavidCouronne/gridsome-plugin-remark-container/blob/master/snapshots/snapshot_3.png?raw=true)

![image](https://github.com/DavidCouronne/gridsome-plugin-remark-container/blob/master/snapshots/snapshot_4.png?raw=true)

![image](https://github.com/DavidCouronne/gridsome-plugin-remark-container/blob/master/snapshots/snapshot_5.png?raw=true)

![image](https://github.com/DavidCouronne/gridsome-plugin-remark-container/blob/master/snapshots/snapshot_6.png?raw=true)

## Custom Types

The `customTypes` option can be used to add additional types. You can set the svg and emoji icons as well as the keyword. You only have to include the svg/emoji fields if you are using them.

For example, this will allow you to generate blocks with the `custom` keyword.

```js
\\\gridsome.config.js;
module.exports = {

  .....
  transformers: {
    //Add markdown support to all file-system sources
    remark: {

      plugins: [
        [
        "gridsome-plugin-remark-container",
        {
        customTypes: {
          custom: {
            emoji: "💻",
            svg:
              '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15 2H1c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h5.34c-.25.61-.86 1.39-2.34 2h8c-1.48-.61-2.09-1.39-2.34-2H15c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm0 9H1V3h14v8z"></path></svg>'
              }
            }
          }
        ]
      ]
    }
  }

};
```





# Credit

Syntax and classic theme based on [`remarkable-admonitions`](https://github.com/favoloso/remarkable-admonitions).

The SVG icons included are from [GitHub Octicons](https://octicons.github.com).
