'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CusdisComments from '@/components/CusdisComments'
import type { Post } from '@/lib/posts'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export default function PostLayoutShell({ children, posts }: { children: ReactNode; posts: Post[] }) {
  const pathname = usePathname()
  const slug = pathname?.split('/').filter(Boolean).at(-1)
  const post = posts.find(p => p.slug === slug)

  return (
    <article>
      {post && (
        <header className="page-header" data-pagefind-ignore="all">
          <h1 className="post-title">{post.title}</h1>
          <p className="page-meta">
            Last updated at {formatDate(post.frontMatter.date)}
            {post.readingTime && ` · ${post.readingTime.text}`}
          </p>
          {post.frontMatter.tags && (
            <div className="tag-list">
              {post.frontMatter.tags.map(tag => (
                <Link key={tag} href={`/tags/${tag}`} className="tag">
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>
      )}
      {children}
      <div className="post-comments">
        <CusdisComments
          appId="be704988-9e39-4a6a-aa0a-78c5f4f7fb4a"
          pageId={slug ?? 'unknown'}
          pageTitle={post?.title ?? ''}
        />
      </div>
    </article>
  )
}
