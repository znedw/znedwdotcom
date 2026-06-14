import { getPosts } from '@/lib/posts'
import PostLayoutShell from '@/components/PostLayoutShell'

export default async function PostLayout({ children }) {
  const posts = await getPosts()

  return <PostLayoutShell posts={posts}>{children}</PostLayoutShell>
}
