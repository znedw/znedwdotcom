import type { ReactNode } from 'react'

export default function Footer({ children }: { children: ReactNode }) {
  return (
    <small style={{ marginTop: '8rem', display: 'block', fontSize: '0.875rem' }} data-pagefind-ignore="all">
      {children}
    </small>
  )
}
