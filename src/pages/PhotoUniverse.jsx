import { useEffect, useRef, useState } from 'react'
import Photo from '../components/Photo.jsx'
import { EASTER_EGG, FLIP_CARDS, MOSAIC, MOVIES, NAME, POSTER_PHOTOS, UNIVERSE } from '../content.js'
import { burst } from '../lib/confetti.js'
import { loadImage, placeholderImage } from '../lib/photos.js'
import { sfx } from '../lib/sound.js'
import './PhotoUniverse.css'

// Page 2, the photo universe: flip cards → photo mosaic → movie posters.
// The hidden Easter egg (a tiny 🍞) lives in the starry header.
export default function PhotoUniverse({ go, onEggFound }) {
  const rootRef = useRef(null)
  const [eggOpen, setEggOpen] = useState(false)

  // Slide elements marked data-reveal into view as he scrolls.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        }),
      { threshold: 0.15 },
    )
    rootRef.current.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  function findEgg() {
    sfx.secret()
    burst(undefined, undefined, { count: 40, emojis: ['🍞', '🧈', '✨'] })
    setEggOpen(true)
    onEggFound()
  }

  return (
    <div className="universe" ref={rootRef}>
      <div className="stars" aria-hidden="true" />

      <header className="u-hero">
        <Orbit photos={UNIVERSE.orbit} />
        <h1 className="u-title">
          {UNIVERSE.title}
          <span>{UNIVERSE.titleBig}</span>
        </h1>
        <p className="u-sub">{UNIVERSE.subtitle}</p>
        <p className="u-scroll" aria-hidden="true">
          {UNIVERSE.scrollHint}
        </p>
        {/* 🥚 The hidden Easter egg: a tiny piece of bread pretending to be a star. */}
        <button type="button" className="egg-bread" onClick={findEgg} aria-label="A suspicious piece of bread">
          🍞
        </button>
      </header>

      <section className="u-section">
        <span className="u-kicker" data-reveal>
          {UNIVERSE.flipKicker}
        </span>
        <h2 className="u-h2" data-reveal>
          {UNIVERSE.flipTitle}
        </h2>
        <p className="u-p" data-reveal>
          {UNIVERSE.flipHint}
        </p>
        <div className="flip-grid">
          {FLIP_CARDS.map((card, i) => (
            <FlipCard key={card.photo + i} card={card} index={i} />
          ))}
        </div>
      </section>

      <p className="u-teaser" data-reveal>
        {UNIVERSE.teaser1}
      </p>

      <Mosaic />

      <p className="u-teaser" data-reveal>
        {UNIVERSE.teaser2}
      </p>

      <section className="u-section">
        <span className="u-kicker" data-reveal>
          {UNIVERSE.postersKicker}
        </span>
        <h2 className="u-h2" data-reveal>
          {UNIVERSE.postersTitle}
        </h2>
        <p className="u-p" data-reveal>
          {UNIVERSE.postersHint}
        </p>
        <PosterShelf />
      </section>

      <footer className="u-footer">
        <p data-reveal>{UNIVERSE.outro}</p>
        <button type="button" className="btn-chunky" onClick={() => go('team')}>
          {UNIVERSE.next}
        </button>
      </footer>

      {eggOpen && <EggModal onClose={() => setEggOpen(false)} />}
    </div>
  )
}

// ---------------------------------------------------------------------
//  Header: little photos orbiting "planet 29"
// ---------------------------------------------------------------------

function Orbit({ photos }) {
  return (
    <div className="orbit" aria-hidden="true">
      <div className="orbit-ring">
        {photos.map((src, i) => (
          <span key={src} className="orbit-photo" style={{ '--a': `${(360 / photos.length) * i}deg` }}>
            <Photo src={src} eager />
          </span>
        ))}
      </div>
      <div className="orbit-planet">
        <span>29</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------
//  Exhibit A: flip cards
// ---------------------------------------------------------------------

const TILTS = [-3, 2.5, 2, -2, -2.5, 3, 1.5, -1.5]

function FlipCard({ card, index }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="flip-slot" data-reveal style={{ '--delay': `${(index % 2) * 0.12}s` }}>
      <button
        type="button"
        className={`flip ${flipped ? 'is-flipped' : ''}`}
        style={{ '--tilt': `${TILTS[index % TILTS.length]}deg` }}
        onClick={() => {
          sfx.flip()
          setFlipped((f) => !f)
        }}
        aria-pressed={flipped}
        aria-label={flipped ? card.caption : 'Flip this photo'}
      >
        <span className="flip-inner">
          <span className="flip-face flip-front">
            <Photo src={card.photo} />
            <span className="flip-hint">tap me</span>
          </span>
          <span className="flip-face flip-back">
            <span className="flip-caption">{card.caption}</span>
          </span>
        </span>
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------
//  Exhibit B: the photo mosaic
//  His photo is rebuilt from every tiny photo. Each grid cell gets a tile
//  that roughly matches its colour, tinted towards the real colour.
//  Scrolling (or tapping) flies the tiles into place.
// ---------------------------------------------------------------------

async function buildMosaic({ photo, tiles, columns }) {
  const main = await loadImage(photo).catch(() => placeholderImage(480, '🎂'))
  const cols = columns
  const rows = Math.max(4, Math.round((cols * main.height) / main.width))

  // The average colour of each cell = the main photo shrunk to cols × rows pixels.
  const probe = document.createElement('canvas')
  probe.width = cols
  probe.height = rows
  const pctx = probe.getContext('2d', { willReadFrequently: true })
  pctx.drawImage(main, 0, 0, cols, rows)
  const px = pctx.getImageData(0, 0, cols, rows).data

  const loaded = await Promise.all(tiles.map((t) => loadImage(t).catch(() => null)))
  const found = loaded.filter(Boolean)
  const pool = found.length ? found : Array.from({ length: 12 }, () => placeholderImage(96))
  const tileColors = pool.map((img) => {
    pctx.drawImage(img, 0, 0, 1, 1)
    const d = pctx.getImageData(0, 0, 1, 1).data
    return [d[0], d[1], d[2]]
  })

  const cx = (cols - 1) / 2
  const cy = (rows - 1) / 2
  const maxDist = Math.hypot(cx, cy)
  const cells = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = (r * cols + c) * 4
      const rgb = [px[i], px[i + 1], px[i + 2]]
      // Best colour match out of a random handful keeps the tiles varied.
      let best = 0
      let bestDist = Infinity
      for (let k = 0; k < 10; k++) {
        const j = (Math.random() * pool.length) | 0
        const t = tileColors[j]
        const dist = (t[0] - rgb[0]) ** 2 + (t[1] - rgb[1]) ** 2 + (t[2] - rgb[2]) ** 2
        if (dist < bestDist) {
          bestDist = dist
          best = j
        }
      }
      cells.push({
        c,
        r,
        img: pool[best],
        color: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
        // centre tiles land first, then a wave outwards
        delay: (Math.hypot(c - cx, r - cy) / maxDist) * 0.42 + Math.random() * 0.14,
        sx: Math.random(),
        sy: Math.random(),
        rot: (Math.random() - 0.5) * 2.4,
        scale: 0.5 + Math.random() * 0.9,
      })
    }
  }
  return { main, cols, rows, cells }
}

function Mosaic() {
  const wrapRef = useRef(null)
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const api = useRef({ scrollP: 0, autoP: 0, schedule: () => {} })
  const [status, setStatus] = useState('loading') // loading → ready → done

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let model = null
    let cancelled = false
    let finished = false
    let raf = 0
    let lastWidth = 0
    let W = 0
    let H = 0

    function layout(force = false) {
      if (!model) return
      const stage = stageRef.current
      if (!force && stage.clientWidth === lastWidth) return // ignore mobile URL-bar height changes
      lastWidth = stage.clientWidth
      const ratio = model.rows / model.cols
      const cssW = Math.max(180, Math.min(stage.clientWidth, 440, stage.clientHeight / ratio))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.style.width = `${cssW}px`
      canvas.style.height = `${cssW * ratio}px`
      W = canvas.width = Math.round(cssW * dpr)
      H = canvas.height = Math.round(cssW * ratio * dpr)
      schedule()
    }

    function draw() {
      raf = 0
      if (!model) return
      const p = Math.max(api.current.scrollP, api.current.autoP)
      const cw = W / model.cols
      const ch = H / model.rows
      ctx.clearRect(0, 0, W, H)
      for (const cell of model.cells) {
        const t = Math.min(1, Math.max(0, (p - cell.delay) / 0.4))
        const e = 1 - (1 - t) ** 3
        const sx = cell.sx * (W - cw)
        const sy = cell.sy * (H - ch)
        const x = sx + (cell.c * cw - sx) * e
        const y = sy + (cell.r * ch - sy) * e
        const s = cell.scale + (1 - cell.scale) * e
        ctx.save()
        ctx.translate(x + cw / 2, y + ch / 2)
        ctx.rotate(cell.rot * (1 - e))
        ctx.scale(s, s)
        ctx.drawImage(cell.img, -cw / 2, -ch / 2, cw + 0.5, ch + 0.5)
        ctx.globalAlpha = 0.2 + 0.45 * e
        ctx.fillStyle = cell.color
        ctx.fillRect(-cw / 2, -ch / 2, cw + 0.5, ch + 0.5)
        ctx.restore()
      }
      // At the very end, fade the real photo in on top so his face pops.
      const reveal = Math.min(1, Math.max(0, (p - 0.86) / 0.14))
      if (reveal > 0) {
        ctx.globalAlpha = reveal * 0.42
        ctx.drawImage(model.main, 0, 0, W, H)
        ctx.globalAlpha = 1
      }
      if (p >= 1 && !finished) {
        finished = true
        setStatus('done')
        sfx.sparkle()
        const r = canvas.getBoundingClientRect()
        burst(r.left + r.width / 2, r.top + r.height / 2, { count: 70 })
      }
    }

    function schedule() {
      if (!raf) raf = requestAnimationFrame(draw)
    }
    api.current.schedule = schedule

    function onScroll() {
      const r = wrapRef.current.getBoundingClientRect()
      const scrollable = r.height - window.innerHeight
      const p = scrollable > 0 ? -r.top / scrollable : 0
      api.current.scrollP = Math.min(1, Math.max(0, (p - 0.08) / 0.78))
      schedule()
    }

    const onResize = () => layout()

    buildMosaic(MOSAIC).then((m) => {
      if (cancelled) return
      model = m
      setStatus('ready')
      layout(true)
      onScroll()
    })

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  function assemble() {
    if (status !== 'ready') return
    sfx.whoosh()
    const start = performance.now()
    const from = api.current.autoP
    const step = (now) => {
      const k = Math.min(1, (now - start) / 2400)
      api.current.autoP = from + (1 - from) * k
      api.current.schedule()
      if (k < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  const statusText =
    status === 'done'
      ? UNIVERSE.mosaicDone(MOSAIC.tiles.length)
      : status === 'loading'
        ? 'Collecting memories…'
        : UNIVERSE.mosaicHint

  return (
    <section className="mosaic" ref={wrapRef}>
      <div className="mosaic-sticky">
        <div className="mosaic-head">
          <span className="u-kicker">{UNIVERSE.mosaicKicker}</span>
          <h2 className="u-h2">{UNIVERSE.mosaicTitle}</h2>
          <p className="mosaic-status" role="status">
            {statusText}
          </p>
        </div>
        <div className="mosaic-stage" ref={stageRef}>
          <canvas
            ref={canvasRef}
            className="mosaic-canvas"
            onClick={assemble}
            role="img"
            aria-label={`A photo of ${NAME} made from ${MOSAIC.tiles.length} tiny photos`}
          />
        </div>
        <button type="button" className="mosaic-btn" onClick={assemble} disabled={status !== 'ready'}>
          {status === 'done' ? '✨ Legend assembled' : '✨ Assemble him'}
        </button>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------
//  Exhibit C: movie posters (the "Remake" button swaps in a new movie)
// ---------------------------------------------------------------------

function PosterShelf() {
  const [slots, setSlots] = useState(() =>
    POSTER_PHOTOS.map((photo, i) => ({ photo, movie: MOVIES[i % MOVIES.length], take: 0 })),
  )

  function remake(index) {
    sfx.clap()
    setSlots((prev) => {
      const showing = new Set(prev.map((s) => s.movie.title))
      const options = MOVIES.filter((m) => !showing.has(m.title))
      const movie = options.length ? options[(Math.random() * options.length) | 0] : prev[index].movie
      return prev.map((s, i) => (i === index ? { ...s, movie, take: s.take + 1 } : s))
    })
  }

  return (
    <div className="poster-shelf">
      {slots.map((slot, i) => (
        <div className="poster-slot" key={i} data-reveal style={{ '--delay': `${i * 0.08}s` }}>
          <Poster key={`${slot.movie.title}-${slot.take}`} movie={slot.movie} photo={slot.photo} />
          <button type="button" className="poster-remake" onClick={() => remake(i)}>
            🎲 Remake this movie
          </button>
        </div>
      ))}
    </div>
  )
}

function Poster({ movie, photo }) {
  return (
    <article className={`poster poster--${movie.genre}`}>
      <Photo src={photo} className="poster-photo" />
      <div className="poster-shade" aria-hidden="true" />
      <p className="poster-presents">{UNIVERSE.posterPresents}</p>
      <span className="poster-rating">{movie.rating}</span>
      <div className="poster-bottom">
        <p className="poster-star">{NAME}</p>
        <h3 className="poster-title">{movie.title}</h3>
        <p className="poster-tagline">{movie.tagline}</p>
        <p className="poster-billing">{UNIVERSE.posterBilling}</p>
        <p className="poster-date">{movie.date}</p>
      </div>
    </article>
  )
}

// ---------------------------------------------------------------------
//  The Easter egg pop-up
// ---------------------------------------------------------------------

function EggModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="egg-backdrop" onClick={onClose}>
      <div
        className="egg-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="egg-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="egg-title">{EASTER_EGG.title}</h2>
        <div className="egg-photo">
          <Photo src={EASTER_EGG.photo} alt={`A throwback photo of ${NAME}`} eager />
        </div>
        <p>{EASTER_EGG.message}</p>
        <button type="button" className="btn-chunky" onClick={onClose} autoFocus>
          {EASTER_EGG.close}
        </button>
      </div>
    </div>
  )
}
