import Link from 'next/link'

export default function Navbar({ children }) {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
      <Link href="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>znedw.com</Link>
      <Link href="/posts" style={{ textDecoration: 'none', color: 'inherit' }}>Posts</Link>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {children}
      </div>
    </nav>
  )
}
