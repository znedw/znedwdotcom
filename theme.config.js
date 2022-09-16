const YEAR = new Date().getFullYear()
const metaMightBeBroken = {
  title: 'Zach Nedwich',
  description: 'my website (borat voice)',
  image: 'https://znedw.com/images/lho.jpg'
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  footer: (
    <small
      style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        marginTop: '6rem'
      }}
    >
      <time>{YEAR}</time> © Zach Nedwich
      <a href="/feed.xml">RSS</a>
      <a href="#">TOP</a>
      <style jsx>{`
        @media screen and (max-width: 480px) {
          article {
            padding-top: 2rem;
            padding-bottom: 4rem;
          }
        }
      `}</style>
    </small>
  ),
  head: ({ _, meta }) => (
    <>
      {meta.description && (
        <meta name="description" content={meta.description} />
      )}
      {meta.tag && <meta name="keywords" content={meta.tag} />}
      {meta.author && <meta name="author" content={meta.author} />}

      <meta name="robots" content="follow, index" />
      <meta name="description" content={metaMightBeBroken.description} />
      <meta property="og:site_name" content={metaMightBeBroken.title} />
      <meta property="og:description" content={metaMightBeBroken.description} />
      <meta property="og:title" content={metaMightBeBroken.title} />
      <meta property="og:image" content={metaMightBeBroken.image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@znedw" />
      <meta name="twitter:title" content={metaMightBeBroken.title} />
      <meta
        name="twitter:description"
        content={metaMightBeBroken.description}
      />
      <meta name="twitter:image" content={metaMightBeBroken.image} />
    </>
  ),
  readMore: 'Read More →',
  titleSuffix: ' - znedw.com',
  postFooter: 'fin.',
  cusdis: {
    appId: 'be704988-9e39-4a6a-aa0a-78c5f4f7fb4a',
    host: 'http://znedw.com/'
  },
  darkMode: true
}
