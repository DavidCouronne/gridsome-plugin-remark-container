# gridsome-plugin-remark-container
 gridsome plugin remark container


Based on [remark-container](https://github.com/zWingz/remark-container) and [markdown-it-container](https://github.com/markdown-it/markdown-it-container)

## Example

``` markdown
::: tip
content
:::
```

``` markdown
::: tip title
content

muliti line
:::
```

## Usage

`npm install gridsome-plugin-remark-container`
or
`yarn gridsome-plugin-remark-container`

```md
::: tip title
hello
:::
```

output

```html
<div class="custom-block tip">
  <p class="custom-block-title">title</p>
  <p>hello</p>
</div>
```