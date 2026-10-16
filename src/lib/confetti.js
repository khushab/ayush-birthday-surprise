// Confetti and emoji particles on one shared full-screen canvas.
// Call burst(), cannons() or rain() from anywhere in the app.

const COLORS = ['#ff3d7f', '#ffd23f', '#3bceac', '#4d9de0', '#9b5de5', '#ff8c42']
const RISE_GRAVITY = 0.28
const MAX_FALL = { confetti: 3.2, emoji: 6 }
const LIFESPAN = 420

let canvas = null
let ctx = null
let w = 0
let h = 0
let raf = 0
let parts = []
let rainUntil = 0
let rainEmojis = null

function setup() {
  if (canvas) return true
  canvas = document.createElement('canvas')
  canvas.className = 'fx-confetti'
  canvas.setAttribute('aria-hidden', 'true')
  document.body.appendChild(canvas)
  ctx = canvas.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
  return true
}

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  w = window.innerWidth
  h = window.innerHeight
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const pick = (list) => list[(Math.random() * list.length) | 0]

function spawn(x, y, vx, vy, emoji = null) {
  parts.push({
    x,
    y,
    vx,
    vy,
    emoji,
    size: emoji ? 22 + Math.random() * 14 : 7 + Math.random() * 7,
    color: pick(COLORS),
    rot: Math.random() * 6.3,
    spin: (Math.random() - 0.5) * 0.3,
    wobble: Math.random() * 6.3,
    life: 0,
  })
}

function loop() {
  raf = 0
  ctx.clearRect(0, 0, w, h)
  const raining = performance.now() < rainUntil
  if (raining) spawn(Math.random() * w, -30, (Math.random() - 0.5) * 2, 2 + Math.random() * 2, pick(rainEmojis))

  for (const p of parts) {
    p.life++
    p.vy = Math.min(p.vy + RISE_GRAVITY, p.emoji ? MAX_FALL.emoji : MAX_FALL.confetti)
    p.vx *= 0.985
    p.x += p.vx + Math.sin(p.life / 12 + p.wobble) * (p.emoji ? 0.4 : 1)
    p.y += p.vy
    p.rot += p.spin
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rot)
    ctx.globalAlpha = Math.min(1, (LIFESPAN - p.life) / 60)
    if (p.emoji) {
      ctx.font = `${p.size}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(p.emoji, 0, 0)
    } else {
      ctx.scale(1, Math.cos(p.life / 7 + p.wobble))
      ctx.fillStyle = p.color
      ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66)
    }
    ctx.restore()
  }
  parts = parts.filter((p) => p.life < LIFESPAN && p.y < h + 60)

  if (parts.length || raining) raf = requestAnimationFrame(loop)
  else ctx.clearRect(0, 0, w, h)
}

function start() {
  if (!raf) raf = requestAnimationFrame(loop)
}

/** A round burst from one point (defaults to the screen centre). */
export function burst(x, y, { count = 80, power = 1, emojis = null } = {}) {
  if (calm() || !setup()) return
  const cx = x ?? w / 2
  const cy = y ?? h / 2
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = (2 + Math.random() * 7) * power
    spawn(cx, cy, Math.cos(angle) * speed, Math.sin(angle) * speed - 5 * power, emojis ? pick(emojis) : null)
  }
  start()
}

/** Two cannons firing up from the bottom corners. */
export function cannons({ count = 180, emojis = null } = {}) {
  if (calm() || !setup()) return
  const launch = Math.sqrt(2 * RISE_GRAVITY * h)
  for (let i = 0; i < count; i++) {
    const left = i % 2 === 0
    const angle = (left ? -Math.PI / 3 : (-2 * Math.PI) / 3) + (Math.random() - 0.5) * 0.6
    const speed = launch * (0.75 + Math.random() * 0.4)
    spawn(left ? 0 : w, h, Math.cos(angle) * speed, Math.sin(angle) * speed, emojis && i % 4 === 0 ? pick(emojis) : null)
  }
  start()
}

/** Remove every particle at once (used when the finale goes dark). */
export function clearConfetti() {
  parts = []
  rainUntil = 0
  if (ctx) ctx.clearRect(0, 0, w, h)
}

/** Emoji falling from the top of the screen for `ms` milliseconds. */
export function rain(emojis, ms = 2500) {
  if (calm() || !setup()) return
  rainEmojis = emojis
  rainUntil = performance.now() + ms
  start()
}
