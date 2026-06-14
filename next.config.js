import createMDX from '@next/mdx'

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: [['rehype-pretty-code', { theme: 'github-dark-dimmed', keepBackground: false }]]
  }
})

export default withMDX({
  reactStrictMode: true,
  cleanDistDir: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx']
})
