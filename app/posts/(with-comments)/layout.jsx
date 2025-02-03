import { Comments } from 'nextra-theme-blog'

export default function CommentsLayout({ children }) {
  return (
    <>
      {children}
      <Comments lang="en" appId="be704988-9e39-4a6a-aa0a-78c5f4f7fb4a" />
    </>
  )
}
