'use client'

import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'

function subscribe() {
  return () => {}
}

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(subscribe, () => true, () => false)

  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0.25rem' }}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
