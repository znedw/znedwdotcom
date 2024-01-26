import { relative } from 'path'

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => relative(process.cwd(), f))
    .join(' --file ')}`

export default {
  '*.{js,jsx,ts,tsx,mjs}': [buildEslintCommand],
  '**/*.(md|mdx)': (filenames) =>
    `yarn prettier --write ${filenames.join(' ')}`
}
