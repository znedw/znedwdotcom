import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import RSS from 'rss'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function generate() {
  const feed = new RSS({
    title: 'Zach Nedwich',
    site_url: 'https://znedw.com',
    feed_url: 'https://znedw.com/feed.xml'
  })

  const posts = await readdir(join(__dirname, '..', 'pages', 'posts'))

  await Promise.all(
    posts.map(async (name) => {
      if (name.startsWith('index.')) return

      const content = await readFile(
        join(__dirname, '..', 'pages', 'posts', name)
      )
      const frontmatter = matter(content)

      feed.item({
        title: frontmatter.data.title,
        url: `${feed.site_url}/posts/${name.replace(/\.mdx?/, '')}`,
        date: frontmatter.data.date,
        description: frontmatter.data.description,
        categories: frontmatter.data.tag.split(', '),
        author: frontmatter.data.author
      })
    })
  )

  await writeFile('./public/feed.xml', feed.xml({ indent: true }))
}

await generate()
