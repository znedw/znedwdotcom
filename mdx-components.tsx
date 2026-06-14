import type { MDXComponents } from 'mdx/types'
import type { ReactNode } from 'react'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }: { children?: ReactNode }) => (
      <h1
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          backgroundImage: 'linear-gradient(90deg,#7928CA,#FF0080)'
        }}
      >
        {children}
      </h1>
    ),
    ...components
  }
}
