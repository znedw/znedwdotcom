export const metadata = {
  title: 'About'
}

export default function AboutPage() {
  return (
    <article className="page">
      <header className="page-header" data-pagefind-ignore="all">
        <h1 className="page-title">About</h1>
        <p className="page-meta">1 min read</p>
      </header>

      <div className="page-content">
        <p>👋</p>
        <p>Hi, my name is Zach.</p>
        <div className="about-links">
          <p>
            Twitter{' '}
            <a href="https://twitter.com/znedw" target="_blank" rel="noreferrer">
              @znedw ↗
            </a>
          </p>
          <p>
            GitHub{' '}
            <a href="https://github.com/znedw" target="_blank" rel="noreferrer">
              @znedw ↗
            </a>
          </p>
          <p>
            Instagram{' '}
            <a href="https://instagram.com/znedw" target="_blank" rel="noreferrer">
              @znedw ↗
            </a>
          </p>
          <p>
            Email <a href="mailto:zach@znedw.com">zach@znedw.com</a>
          </p>
        </div>
      </div>
    </article>
  )
}
