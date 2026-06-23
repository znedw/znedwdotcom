import type { ReactNode } from 'react'
import Link from 'next/link'

export default function Navbar({ children }: { children: ReactNode }) {
  return (
    <header style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-end', marginBottom: '2rem' }} data-pagefind-ignore="all">
      <Link href="/" style={{ fontWeight: 500, textDecoration: 'none', color: 'inherit' }}>znedw.com</Link>
      <Link href="/posts" style={{ textDecoration: 'none', color: 'inherit' }}>Posts</Link>
      {children}
    </header>
  )
}
