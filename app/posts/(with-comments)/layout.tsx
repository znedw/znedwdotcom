import type { ReactNode } from 'react'
import { getPosts } from '@/lib/posts'
import PostLayoutShell from '@/components/PostLayoutShell'

export default async function PostLayout({ children }: { children: ReactNode }) {
  const posts = await getPosts()

  return <PostLayoutShell posts={posts}>{children}</PostLayoutShell>
}
