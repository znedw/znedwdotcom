import type { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import ThemeProvider from '@/components/ThemeProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PagefindSearch from '@/components/PagefindSearch'
import ThemeSwitch from '@/components/ThemeSwitch'
import './globals.css'

export const metadata = {
  title: { default: 'Zach Nedwich', template: '%s - znedw.com' },
  description: 'my website (borat voice)',
  openGraph: {
    siteName: 'Zach Nedwich',
    description: 'my website (borat voice)',
    title: 'Zach Nedwich',
    images: [{ url: 'https://znedw.com/images/lho.jpg' }],
    url: 'https://znedw.com'
  },
  twitter: {
    card: 'summary_large_image',
    site: '@znedw',
    title: 'Zach Nedwich',
    description: 'my website (borat voice)',
    images: ['https://znedw.com/images/lho.jpg']
  },
  robots: 'follow, index'
}

const buildHash = process.env.NEXT_PUBLIC_GIT_COMMIT_SHA ?? 'local'

export default async function RootLayout({ children }: { children: ReactNode }) {
  let commitMsg: string | null = null
  try {
    const data = await fetch(
      `https://api.github.com/repos/znedw/znedwdotcom/commits/${buildHash}`,
      { next: { revalidate: 3600 } }
    )
    const commit = await data.json()
    commitMsg = commit?.commit?.message ?? null
  } catch {
    // ignore fetch errors (e.g. in dev without network)
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body id="top">
        <ThemeProvider>
          <div className="layout">
            <Navbar>
              <PagefindSearch />
              <ThemeSwitch />
            </Navbar>
            <main>{children}</main>
            <Footer>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <abbr
                  title="This site and all its content are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License."
                  style={{ cursor: 'help' }}
                >
                  CC BY-NC 4.0
                </abbr>{' '}
                {new Date().getFullYear()} © Zach NEDWICH.
                <a
                  href={`https://github.com/znedw/znedwdotcom/commit/${buildHash}`}
                  title={commitMsg ?? undefined}
                >
                  {buildHash.slice(0, 7)}
                </a>
                <a href="#top">TOP</a>
                <a href="/rss.xml">RSS</a>
              </div>
            </Footer>
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
