import type { ReactNode } from 'react'

export default function Footer({ children }: { children: ReactNode }) {
  return (
    <footer className="site-footer" data-pagefind-ignore="all">
      {children}
    </footer>
  )
}
