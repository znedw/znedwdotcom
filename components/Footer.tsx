import type { ReactNode } from 'react'

export default function Footer({ children }: { children: ReactNode }) {
  return (
    <footer style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', fontSize: '0.875rem' }}>
      {children}
    </footer>
  )
}
