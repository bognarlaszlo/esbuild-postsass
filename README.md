# esbuild-postsass

An [esbuild](https://esbuild.github.io/) plugin for styling with SASS & PostCSS

## Install
`npm i -D esbuild-postsass`

## Usage
```js
import esbuild from 'esbuild'
import postcssConfig from './postcss.config.js'

esbuild.build({
    plugins: [
        postsass(postsassConfig)
    ]
})
```

If this PostCSS plugin helped you in any way please consider buying me a book @ my buymeacoffee.com page

[!["Buy Me A Coffee"][bmc-badge]][bmc-page]

### TODO:
- Include tests

[bmc-page]: https://www.buymeacoffee.com/bognarlaszlo
[bmc-badge]: https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-1.svg
