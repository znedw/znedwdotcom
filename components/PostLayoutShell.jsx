'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CusdisComments from '@/components/CusdisComments'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export default function PostLayoutShell({ children, posts }) {
  const pathname = usePathname()
  const slug = pathname?.split('/').filter(Boolean).at(-1)
  const post = posts.find(p => p.slug === slug)

  return (
    <article>
      {post && (
        <header style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundImage: 'linear-gradient(90deg,#7928CA,#FF0080)',
              marginBottom: '0.5rem'
            }}
          >
            {post.title}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.25rem 0' }}>
            Last updated at {formatDate(post.frontMatter.date)}
            {post.readingTime && ` · ${post.readingTime.text}`}
          </p>
          {post.frontMatter.tags && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.5rem' }}>
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
      <div style={{ marginTop: '3rem' }}>
        <CusdisComments
          appId="be704988-9e39-4a6a-aa0a-78c5f4f7fb4a"
          pageId={slug ?? 'unknown'}
          pageTitle={post?.title ?? ''}
        />
      </div>
    </article>
  )
}
