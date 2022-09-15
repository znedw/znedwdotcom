const path = require('path')

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`

module.exports = {
  '*.{js,jsx,ts,tsx,mjs}': [buildEslintCommand],
  '**/*.(md|mdx)': (filenames) =>
    `yarn prettier --write ${filenames.join(' ')}`
}
