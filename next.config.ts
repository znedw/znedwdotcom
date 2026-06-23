import createMDX from '@next/mdx'
import type { NextConfig } from 'next'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      remarkGfm,
      remarkFrontmatter,
      [remarkMdxFrontmatter, { name: 'metadata' }]
    ],
    rehypePlugins: [
      [rehypePrettyCode, { theme: 'github-dark-dimmed', keepBackground: false }]
    ]
  }
})

const nextConfig: NextConfig = {
  reactStrictMode: true,
  cleanDistDir: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx']
}

export default withMDX(nextConfig)
