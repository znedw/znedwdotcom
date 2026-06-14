'use client'

import { ReactCusdis } from 'react-cusdis'

interface CusdisCommentsProps {
  appId: string
  pageId: string
  pageTitle: string
}

export default function CusdisComments({ appId, pageId, pageTitle }: CusdisCommentsProps) {
  return (
    <ReactCusdis
      attrs={{
        host: 'https://cusdis.com',
        appId,
        pageId,
        pageTitle,
        pageUrl: typeof window !== 'undefined' ? window.location.href : ''
      }}
    />
  )
}
