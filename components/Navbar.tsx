'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'About' },
    { href: '/posts', label: 'Posts' }
  ]

  return (
    <header className="site-header" data-pagefind-ignore="all">
      <nav className="site-nav" aria-label="Primary">
        {links.map(link => {
          const isActive =
            link.href === '/'
              ? pathname === '/'
              : pathname === link.href || pathname?.startsWith(`${link.href}/`)

          return (
            <Link
              key={link.href}
              href={link.href}
              className="site-nav-link"
              aria-current={isActive ? 'page' : undefined}
              data-active={isActive}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="site-header-tools">{children}</div>
    </header>
  )
}
