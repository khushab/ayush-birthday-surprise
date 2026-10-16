// Fireworks for the finale: rockets fly up and burst into sparks.
// createFireworks(canvas) returns controls the page can call.
import { sfx } from './sound.js'

const MAX_SPARKS = 1600

export function createFireworks(canvas) {
  const ctx = canvas.getContext('2d')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let w = 0
  let h = 0
  let rockets = []
  let sparks = []
  let raf = 0
  let showTimer = 0
  let alive = true

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = canvas.clientWidth
    h = canvas.clientHeight
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()
  window.addEventListener('resize', resize)

  function frame() {
    raf = 0
    // Fade what's already drawn instead of clearing it, which leaves glowing trails.
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)'
    ctx.fillRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'lighter'

    for (const r of rockets) {
      r.t = Math.min(1, r.t + 1 / r.frames)
      const e = 1 - (1 - r.t) ** 2
      const x = r.x0 + (r.tx - r.x0) * e
      const y = r.y0 + (r.ty - r.y0) * e
      ctx.fillStyle = `hsl(${r.hue} 100% 80%)`
      ctx.beginPath()
      ctx.arc(x, y, 2.5, 0, Math.PI * 2)
      ctx.fill()
      if (r.t >= 1) explode(r.tx, r.ty, r.hue)
    }
    rockets = rockets.filter((r) => r.t < 1)

    for (const s of sparks) {
      s.vx *= 0.975
      s.vy = s.vy * 0.975 + 0.05
      s.x += s.vx
      s.y += s.vy
      s.life -= s.decay
      ctx.fillStyle = `hsl(${s.hue} 100% ${s.light}% / ${Math.max(0, s.life)})`
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
      ctx.fill()
    }
    sparks = sparks.filter((s) => s.life > 0)

    if (rockets.length || sparks.length) raf = requestAnimationFrame(frame)
    else ctx.clearRect(0, 0, w, h)
  }

  function kick() {
    if (!raf && alive) raf = requestAnimationFrame(frame)
  }

  function explode(x, y, hue = Math.random() * 360, count = 90) {
    const n = Math.min(count, MAX_SPARKS - sparks.length)
    const ring = Math.random() < 0.3
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 + Math.random() * 0.12
      const speed = ring ? 4 + Math.random() * 0.4 : 0.8 + Math.random() * 5
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.011 + Math.random() * 0.012,
        hue: hue + Math.random() * 40 - 20,
        light: 55 + Math.random() * 25,
        size: 1.3 + Math.random() * 1.4,
      })
    }
    sfx.boom()
    kick()
  }

  function launch(tx = w * (0.15 + Math.random() * 0.7), ty = h * (0.12 + Math.random() * 0.33)) {
    if (reduced) return explode(tx, ty, undefined, 40)
    rockets.push({ x0: tx + (Math.random() - 0.5) * 80, y0: h + 10, tx, ty, t: 0, frames: 40 + Math.random() * 20, hue: Math.random() * 360 })
    sfx.launch()
    kick()
  }

  /** A few tiny sparks, used for the trail that follows the finger/cursor. */
  function sparkle(x, y) {
    if (sparks.length > MAX_SPARKS) return
    for (let i = 0; i < 3; i++) {
      sparks.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 2.4,
        vy: (Math.random() - 0.5) * 2.4 - 0.6,
        life: 0.9,
        decay: 0.03 + Math.random() * 0.03,
        hue: Math.random() * 360,
        light: 70,
        size: 1.6,
      })
    }
    kick()
  }

  /** Launch rockets automatically for `ms` milliseconds. */
  function show(ms = 8000, every = 650) {
    clearTimeout(showTimer)
    const end = performance.now() + ms
    const next = () => {
      if (!alive || performance.now() > end) return
      launch()
      if (Math.random() < 0.35) setTimeout(() => alive && launch(), 160)
      showTimer = setTimeout(next, every * (0.7 + Math.random() * 0.6))
    }
    next()
  }

  function stopShow() {
    clearTimeout(showTimer)
  }

  function destroy() {
    alive = false
    clearTimeout(showTimer)
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
  }

  return { launch, explode, sparkle, show, stopShow, destroy }
}
