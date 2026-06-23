'use client'

import { useEffect, useRef, useState } from 'react'

interface PagefindResult {
  url: string
  meta?: { title?: string }
}

interface Pagefind {
  search: (query: string) => Promise<{ results: Array<{ data: () => Promise<PagefindResult> }> }>
}

declare global {
  interface Window {
    pagefind?: Pagefind
  }
}

export default function PagefindSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PagefindResult[]>([])
  const [ready, setReady] = useState(false)
  const pagefind = useRef<Pagefind | null>(null)

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
          pagefind.current = window.pagefind ?? null
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

  async function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
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
    <div className="search-shell">
      <input
        type="search"
        value={query}
        onChange={handleSearch}
        placeholder="Search..."
        disabled={!ready}
        className="search-input"
      />
      <span className="search-shortcut" aria-hidden="true">
        CTRL K
      </span>
      {results.length > 0 && (
        <ul className="search-results">
          {results.map(r => (
            <li key={r.url}>
              <a href={r.url} className="search-result-link">
                {r.meta?.title ?? r.url}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
