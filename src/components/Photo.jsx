import { useState } from 'react'
import { photoUrl } from '../lib/photos.js'

// A lazy-loaded photo. If the file is missing it shows a fun placeholder
// instead of a broken-image icon, so photos can be added later.
export default function Photo({ src, alt = '', className = '', eager = false }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <span className={`photo-ph ${className}`} role="img" aria-label={alt || 'Photo coming soon'}>
        <span aria-hidden="true">📸</span>
        <small>photo too powerful to display</small>
      </span>
    )
  }

  return (
    <img
      className={className}
      src={photoUrl(src)}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
