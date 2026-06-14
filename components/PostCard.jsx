import Link from 'next/link'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export default function PostCard({ post }) {
  return (
    <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>
        <Link href={post.route} style={{ textDecoration: 'none', color: 'inherit' }}>
          {post.title}
        </Link>
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.25rem 0' }}>
        Last updated at {formatDate(post.frontMatter.date)}
      </p>
      {post.frontMatter.description && (
        <p style={{ margin: '0.5rem 0' }}>{post.frontMatter.description}</p>
      )}
      {post.frontMatter.tags && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.5rem' }}>
          {post.frontMatter.tags.map(tag => (
            <Link key={tag} href={`/tags/${tag}`} className="tag">
              {tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
