import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import readingTime, { ReadTimeResults } from 'reading-time'

const POSTS_DIR = path.join(process.cwd(), 'app', 'posts', '(with-comments)')

export interface PostFrontMatter {
  title: string
  date: string
  description?: string
  tags?: string[]
  [key: string]: unknown
}

export interface Post {
  slug: string
  route: string
  title: string
  frontMatter: PostFrontMatter
  readingTime: ReadTimeResults
}

export async function getPosts(): Promise<Post[]> {
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
          title: data.title as string,
          frontMatter: data as PostFrontMatter,
          readingTime: readingTime(content)
        }
      })
  )
  return posts.sort(
    (a, b) => new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime()
  )
}

export async function getTags(): Promise<string[]> {
  const posts = await getPosts()
  return posts.flatMap(p => p.frontMatter.tags ?? [])
}
