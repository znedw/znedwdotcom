'use client'

import { useEffect, useRef, useState } from 'react'

export default function PagefindSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [ready, setReady] = useState(false)
  const pagefind = useRef(null)

  useEffect(() => {
    let cancelled = false

    async function loadPagefind() {
      if (typeof window === 'undefined') return

      if (window.pagefind?.search) {
        pagefind.current = window.pagefind
        setReady(true)
        return
      }

      const script = document.createElement('script')
      script.src = '/_pagefind/pagefind.js'
      script.async = true
      script.onload = () => {
        if (!cancelled && window.pagefind?.search) {
          pagefind.current = window.pagefind
          setReady(true)
        }
      }
      script.onerror = () => {
        // pagefind not available in dev
      }
      document.body.appendChild(script)
    }

    loadPagefind()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleSearch(e) {
    const q = e.target.value
    setQuery(q)
    if (!q.trim() || !pagefind.current) {
      setResults([])
      return
    }
    const search = await pagefind.current.search(q)
    const data = await Promise.all(search.results.slice(0, 5).map(r => r.data()))
    setResults(data)
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="search"
        value={query}
        onChange={handleSearch}
        placeholder={ready ? 'Search...' : 'Search (build site to enable)'}
        disabled={!ready}
        style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'inherit', width: '160px' }}
      />
      {results.length > 0 && (
        <ul style={{ position: 'absolute', right: 0, top: '100%', background: 'var(--bg)', border: '1px solid var(--border-color)', borderRadius: '4px', listStyle: 'none', margin: 0, padding: '0.5rem', zIndex: 100, minWidth: '240px' }}>
          {results.map(r => (
            <li key={r.url} style={{ padding: '0.25rem 0' }}>
              <a href={r.url} style={{ textDecoration: 'none', color: 'inherit' }}>{r.meta?.title ?? r.url}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
