import Link from 'next/link'
import type { Post } from '@/lib/posts'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="post-card">
      <h2 className="post-card-title">
        <Link href={post.route} className="post-card-link">
          {post.title}
        </Link>
      </h2>
      <p className="post-meta">
        Last updated at {formatDate(post.frontMatter.date)}
      </p>
      {post.frontMatter.description && (
        <p>{post.frontMatter.description}</p>
      )}
      {post.frontMatter.tags && (
        <div className="tag-list">
          {post.frontMatter.tags.map(tag => (
            <Link key={tag} href={`/tags/${tag}`} className="tag">
              {tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  )
}
