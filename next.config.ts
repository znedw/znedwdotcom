import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      'remark-gfm',
      'remark-frontmatter',
      ['remark-mdx-frontmatter', { name: 'metadata' }]
    ],
    rehypePlugins: [
      ['rehype-pretty-code', { theme: 'github-dark-dimmed', keepBackground: false }]
    ]
  }
})

const nextConfig: NextConfig = {
  reactStrictMode: true,
  cleanDistDir: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx']
}

export default withMDX(nextConfig)
