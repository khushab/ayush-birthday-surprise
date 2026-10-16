import { useEffect, useRef } from 'react'

const COLORS = ['#ff6b8b', '#ffd166', '#06d6a0', '#4cc9f0', '#b388ff', '#ff9f43']
const GRAVITY = 0.3
const LIFESPAN = 260

// Fires two confetti cannons from the bottom corners every time `burst` changes.
export default function Confetti({ burst }) {
  const canvasRef = useRef(null)
  const particles = useRef([])
  const frame = useRef(0)

  useEffect(() => {
    if (!burst) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const launch = Math.sqrt(2 * GRAVITY * h)
    for (let i = 0; i < 180; i++) {
      const fromLeft = i % 2 === 0
      const angle = (fromLeft ? -Math.PI / 3 : (-2 * Math.PI) / 3) + (Math.random() - 0.5) * 0.7
      const speed = launch * (0.75 + Math.random() * 0.45)
      particles.current.push({
        x: fromLeft ? 0 : w,
        y: h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 7 + Math.random() * 7,
        color: COLORS[i % COLORS.length],
        rot: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.3,
        life: 0,
      })
    }

    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      particles.current = particles.current.filter((p) => p.life < LIFESPAN && p.y < h + 60)
      for (const p of particles.current) {
        p.vy += GRAVITY
        p.vx *= 0.985
        p.x += p.vx + Math.sin(p.life / 12) * 0.6
        p.y += p.vy
        p.rot += p.spin
        p.life++
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.globalAlpha = Math.max(0, 1 - p.life / LIFESPAN)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        ctx.restore()
      }
      if (particles.current.length) frame.current = requestAnimationFrame(tick)
    }

    cancelAnimationFrame(frame.current)
    tick()
    return () => cancelAnimationFrame(frame.current)
  }, [burst])

  return <canvas ref={canvasRef} className="confetti" aria-hidden="true" />
}
