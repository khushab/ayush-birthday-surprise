// Turns 'photos/x.jpg' (as written in content.js) into a URL that works
// both locally and on GitHub Pages, where the site lives in a sub-folder.
export function photoUrl(path) {
  if (!path) return ''
  if (/^(https?:|data:|blob:)/.test(path)) return path
  return import.meta.env.BASE_URL + path.replace(/^\.?\//, '')
}

export function loadImage(path) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = photoUrl(path)
  })
}

/** A colourful stand-in canvas used when a photo file is missing. */
export function placeholderImage(size = 96, emoji = '📸') {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  const hue = Math.random() * 360
  g.fillStyle = `hsl(${hue} 80% 65%)`
  g.fillRect(0, 0, size, size)
  g.font = `${size * 0.5}px serif`
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText(emoji, size / 2, size / 2)
  return c
}
