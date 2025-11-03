import { relative } from 'path'

const buildEslintCommand = (filenames) =>
  `eslint --fix ${filenames
    .map((f) => relative(process.cwd(), f))
    .join(' ')}`

const config = {
  '*.{js,jsx,ts,tsx,mjs}': [buildEslintCommand],
  '**/*.(md|mdx)': (filenames) =>
    `yarn prettier --write ${filenames.join(' ')}`
}

export default config;