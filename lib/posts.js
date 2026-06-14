import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const POSTS_DIR = path.join(process.cwd(), 'app', 'posts', '(with-comments)')

export async function getPosts() {
  const entries = await fs.readdir(POSTS_DIR, { withFileTypes: true })
  const posts = await Promise.all(
    entries
      .filter(d => d.isDirectory())
      .map(async d => {
        const file = await fs.readFile(path.join(POSTS_DIR, d.name, 'page.mdx'), 'utf8')
        const { data, content } = matter(file)
        return {
          slug: d.name,
          route: `/posts/${d.name}`,
          title: data.title,
          frontMatter: data,
          readingTime: readingTime(content)
        }
      })
  )
  return posts.sort(
    (a, b) => new Date(b.frontMatter.date) - new Date(a.frontMatter.date)
  )
}

export async function getTags() {
  const posts = await getPosts()
  return posts.flatMap(p => p.frontMatter.tags ?? [])
}
