import { Footer, Layout, Navbar, ThemeSwitch } from 'nextra-theme-blog'
import { Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import 'nextra-theme-blog/style.css'

export const meta = {
  title: 'Zach Nedwich',
  description: 'my website (borat voice)',
  image: 'https://znedw.com/images/lho.jpg',
  url: 'https://znedw.com',
  buildHash: process.env.NEXT_PUBLIC_GIT_COMMIT_SHA ?? 'local'
}

export default async function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head backgroundColor={{ dark: '#0f172a', light: '#fefce8' }}>
        {meta.description && (
          <meta name="description" content={meta.description} />
        )}
        {meta.tag && <meta name="keywords" content={meta.tag} />}
        {meta.author && <meta name="author" content={meta.author} />}

        <meta name="robots" content="follow, index" />
        <meta name="description" content={meta.description} />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.image} />
        <meta property="og:url" content={meta.url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@znedw" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} />
      </Head>
      <body>
        <Layout>
          <Navbar pageMap={await getPageMap()}>
            <Search />
            <ThemeSwitch />
          </Navbar>

          {children}

          <Footer>
            <abbr
              title="This site and all its content are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License."
              style={{ cursor: 'help' }}
            >
              CC BY-NC 4.0
            </abbr>{' '}
            {new Date().getFullYear()} © Zach NEDWICH.
            <br />
            {meta.buildHash !== 'local' && (
              <a
                href={
                  'https://github.com/znedw/znedwdotcom/commit/' +
                  meta.buildHash
                }
              >
                {meta.buildHash.slice(0, 7)}
              </a>
            )}
            <a href="#">TOP</a>
            <a href="/rss.xml" style={{ float: 'right' }}>
              RSS
            </a>
          </Footer>
        </Layout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
