'use client'

import { ReactCusdis } from 'react-cusdis'

export default function CusdisComments({ appId, pageId, pageTitle }) {
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
