import PostCard from '@/components/PostCard'
import { getPosts, getTags } from '@/lib/posts'

interface TagParams {
  tag: string
}

export async function generateMetadata(props: { params: Promise<TagParams> }) {
  const params = await props.params
  return {
    title: `Posts Tagged with "${decodeURIComponent(params.tag)}"`
  }
}

export async function generateStaticParams() {
  const allTags = await getTags()
  return [...new Set(allTags)].map(tag => ({ tag }))
}

export default async function TagPage(props: { params: Promise<TagParams> }) {
  const params = await props.params
  const { title } = await generateMetadata({ params: Promise.resolve(params) })
  const posts = await getPosts()
  return (
    <>
      <h1>{title}</h1>
      {posts
        .filter(post =>
          (post.frontMatter.tags ?? []).includes(decodeURIComponent(params.tag))
        )
        .map(post => (
          <PostCard key={post.route} post={post} />
        ))}
    </>
  )
}
