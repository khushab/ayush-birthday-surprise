import { useCallback, useEffect, useRef, useState } from 'react'
import Photo from '../components/Photo.jsx'
import {
  BLUE_SCREEN,
  CRASH_TEXT,
  DESKTOP_ICONS,
  ERROR_ROASTS,
  LOADING_SCRIPT,
  NAME,
  NEWS,
  WANTED,
  WINDOW_TAUNTS,
} from '../content.js'
import { burst } from '../lib/confetti.js'
import { sfx } from '../lib/sound.js'
import { readMs } from '../lib/timing.js'
import './Hook.css'

// Page 1, the hook:
// fake age calculator → crash + roast pop-ups → blue screen → breaking news → wanted poster
export default function Hook({ go }) {
  const [stage, setStage] = useState('loading')
  const toBlueScreen = useCallback(() => setStage('bsod'), [])
  const toNews = useCallback(() => setStage('news'), [])
  const toWanted = useCallback(() => {
    window.scrollTo(0, 0)
    setStage('wanted')
  }, [])

  return (
    <div className="hook">
      {stage === 'loading' && <AgeCalculator onDone={toBlueScreen} />}
      {stage === 'bsod' && <BlueScreen onDone={toNews} />}
      {stage === 'news' && <BreakingNews onDone={toWanted} />}
      {stage === 'wanted' && <WantedPoster onNext={() => go('photos')} />}
    </div>
  )
}

// ---------------------------------------------------------------------
//  1. The age calculator
// ---------------------------------------------------------------------

// Turn the script into timed segments: when each starts and where the bar starts from.
const TIMELINE = (() => {
  let start = 0
  let from = 0
  return LOADING_SCRIPT.map((step) => {
    const ms = readMs(step.ms)
    const segment = { ...step, ms, start, from }
    start += ms
    from = step.to
    return segment
  })
})()
const TOTAL_MS = TIMELINE.at(-1).start + TIMELINE.at(-1).ms
const FIRST_POPUP_MS = readMs(1500) // time to read the crash message first
const POPUP_GAP_MS = readMs(1300) // time to read each roast (tapping OK skips ahead)
const LAST_POPUP_MS = readMs(1500) // time to read the last roast before the blue screen

function AgeCalculator({ onDone }) {
  const [pct, setPct] = useState(0)
  const [step, setStep] = useState(0)
  const [crashed, setCrashed] = useState(false)
  const [popups, setPopups] = useState(0)
  const [fakeAge, setFakeAge] = useState(17)
  const [toast, setToast] = useState(null)

  // Move the progress bar along the script: stalls, jumps and backwards bits included.
  useEffect(() => {
    const t0 = performance.now()
    let raf = 0
    let lastStep = -1
    let lastTick = 0
    const frame = (now) => {
      const elapsed = now - t0
      if (elapsed >= TOTAL_MS) {
        setPct(99)
        setCrashed(true)
        sfx.error()
        return
      }
      const i = TIMELINE.findIndex((s) => elapsed < s.start + s.ms)
      const seg = TIMELINE[i]
      const k = (elapsed - seg.start) / seg.ms
      const eased = seg.to < seg.from ? k : 1 - (1 - k) ** 3
      setPct(seg.from + (seg.to - seg.from) * eased)
      if (i !== lastStep) {
        lastStep = i
        setStep(i)
        if (seg.to < seg.from) sfx.back()
      }
      if (seg.to > seg.from && now - lastTick > 90) {
        lastTick = now
        sfx.tick()
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Scramble the age readout while it "calculates".
  useEffect(() => {
    if (crashed) return
    const id = setInterval(() => setFakeAge(10 + Math.floor(Math.random() * 90)), 90)
    return () => clearInterval(id)
  }, [crashed])

  // After the crash: roast pop-ups appear one by one, then the blue screen.
  useEffect(() => {
    if (!crashed) return
    if (popups >= ERROR_ROASTS.length) {
      const t = setTimeout(onDone, LAST_POPUP_MS)
      return () => clearTimeout(t)
    }
    const t = setTimeout(nextPopup, popups === 0 ? FIRST_POPUP_MS : POPUP_GAP_MS)
    return () => clearTimeout(t)
  }, [crashed, popups, onDone])

  function nextPopup() {
    sfx.error()
    setPopups((n) => Math.min(n + 1, ERROR_ROASTS.length))
  }

  function taunt(text) {
    sfx.buzz()
    setToast({ text, key: Date.now() })
  }

  return (
    <section className="desk">
      <ul className="desk-icons" aria-hidden="true">
        {DESKTOP_ICONS.map((d) => (
          <li key={d.label}>
            <span>{d.icon}</span>
            <small>{d.label}</small>
          </li>
        ))}
      </ul>

      <div className={`win ${crashed ? 'is-crashed' : ''}`} role="dialog" aria-label="Age calculator">
        <div className="win-title">
          <span>🎂 AgeCalculator.exe</span>
          <span className="win-ctrls">
            <button type="button" aria-label="Minimize" onClick={() => taunt(WINDOW_TAUNTS.minimize)}>
              _
            </button>
            <button type="button" aria-label="Close" onClick={() => taunt(WINDOW_TAUNTS.close)}>
              ✕
            </button>
          </span>
        </div>
        <div className="win-body">
          <p className="calc-label">Calculating {NAME}&apos;s age…</p>
          <div className="calc-readout" aria-hidden="true">
            {crashed ? 'ERR' : fakeAge}
          </div>
          <div className="win-progress">
            <div className="win-progress-bar" style={{ width: `${pct}%` }} />
          </div>
          <div className="calc-meta">
            <span>{Math.floor(pct)}%</span>
            <span>{crashed ? 'FATAL ERROR' : 'Please wait…'}</span>
          </div>
          <p className={`calc-status ${crashed ? 'is-error' : ''}`} role="status">
            {crashed ? CRASH_TEXT : TIMELINE[step].text}
          </p>
        </div>
      </div>

      {ERROR_ROASTS.slice(0, popups).map((text, i) => (
        <ErrorPopup key={text} text={text} index={i} onOk={nextPopup} />
      ))}

      {toast && (
        <p key={toast.key} className="win-toast" role="status">
          {toast.text}
        </p>
      )}
    </section>
  )
}

// Scattered (not neatly stacked) so older roasts stay partly visible.
const POPUP_SPOTS = [
  { x: 2, r: -2 },
  { x: 12, r: 1.5 },
  { x: 4, r: -1 },
  { x: 14, r: 2 },
  { x: 6, r: -1.5 },
  { x: 10, r: 1 },
]

function ErrorPopup({ text, index, onOk }) {
  const [clicks, setClicks] = useState(0)
  const labels = ['OK', 'It’s not OK', 'Still not OK']
  const spot = POPUP_SPOTS[index % POPUP_SPOTS.length]
  return (
    <div
      className="err-pop"
      style={{ '--i': index, '--x': `${spot.x}vw`, '--r': `${spot.r}deg` }}
      role="alertdialog"
      aria-label="Error"
    >
      <div className="win-title">
        <span>Error</span>
        <span className="win-ctrls">
          <button type="button" aria-hidden="true" tabIndex={-1}>
            ✕
          </button>
        </span>
      </div>
      <div className="err-pop-body">
        <span className="err-icon" aria-hidden="true">
          ✕
        </span>
        <p>{text}</p>
      </div>
      <div className="err-pop-actions">
        <button
          type="button"
          onClick={() => {
            setClicks((c) => c + 1)
            onOk()
          }}
        >
          {labels[Math.min(clicks, labels.length - 1)]}
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------
//  2. The blue screen
// ---------------------------------------------------------------------

function BlueScreen({ onDone }) {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    sfx.glitch()
    const id = setInterval(() => setPct((p) => Math.min(100, p + 6 + Math.floor(Math.random() * 12))), readMs(280))
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (pct < 100) return
    const t = setTimeout(onDone, readMs(900))
    return () => clearTimeout(t)
  }, [pct, onDone])

  return (
    <button type="button" className="bsod" onClick={onDone}>
      <span className="bsod-face" aria-hidden="true">
        :(
      </span>
      <span className="bsod-lead">{BLUE_SCREEN.lead}</span>
      <strong className="bsod-error">{BLUE_SCREEN.error}</strong>
      <span className="bsod-pct">{pct}% complete</span>
      <span className="bsod-meta">
        Stop code: {BLUE_SCREEN.stopCode}
        <br />
        What failed: {BLUE_SCREEN.whatFailed}
      </span>
      <span className="bsod-tap">tap to reboot</span>
    </button>
  )
}

// ---------------------------------------------------------------------
//  3. Breaking news
// ---------------------------------------------------------------------

// A burst of TV static when the broadcast "cuts in".
function TvStatic() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    sfx.static()
    const canvas = ref.current
    const g = canvas.getContext('2d')
    const img = g.createImageData(canvas.width, canvas.height)
    let raf = 0
    const draw = () => {
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (Math.random() * 255) | 0
        img.data[i] = v
        img.data[i + 1] = v
        img.data[i + 2] = v
        img.data[i + 3] = 255
      }
      g.putImageData(img, 0, 0)
      raf = requestAnimationFrame(draw)
    }
    draw()
    const t = setTimeout(() => {
      cancelAnimationFrame(raf)
      setVisible(false)
    }, 650)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
    }
  }, [])

  if (!visible) return null
  return <canvas ref={ref} className="tv-static" width="90" height="160" aria-hidden="true" />
}

function BreakingNews({ onDone }) {
  const [sub, setSub] = useState(0)
  const [ready, setReady] = useState(false)
  const [clock, setClock] = useState(() => new Date())

  useEffect(() => {
    sfx.newsSting()
    const rotate = setInterval(() => setSub((s) => (s + 1) % NEWS.subheadlines.length), readMs(3400))
    const tick = setInterval(() => setClock(new Date()), 1000)
    const show = setTimeout(() => setReady(true), readMs(5200))
    return () => {
      clearInterval(rotate)
      clearInterval(tick)
      clearTimeout(show)
    }
  }, [])

  return (
    <section className="news">
      <TvStatic />
      <header className="news-top">
        <span className="news-logo">BBN</span>
        <span className="news-channel">{NEWS.channel}</span>
      </header>

      <div className="news-feed">
        <Photo src={NEWS.photo} alt={`${NAME}, caught on camera`} eager className="news-photo" />
        <span className="news-live">● LIVE</span>
        <span className="news-label">{NEWS.feedLabel}</span>
        <span className="news-clock">{clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>

      <p className="news-banner">BREAKING NEWS</p>
      <h1 className="news-headline">{NEWS.headline}</h1>

      <div className="news-sub">
        <span className="news-sub-tag">DEVELOPING</span>
        <p key={sub} className="news-sub-text">
          {NEWS.subheadlines[sub]}
        </p>
      </div>

      <div className={`news-next ${ready ? 'is-ready' : ''}`}>
        <button type="button" className="btn-chunky" onClick={onDone} disabled={!ready}>
          {NEWS.next}
        </button>
      </div>

      <div className="news-ticker" aria-hidden="true">
        <span className="news-ticker-label">BREAKING</span>
        <div className="news-ticker-window">
          <div className="news-ticker-track">
            {[...NEWS.ticker, ...NEWS.ticker].map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------
//  4. The wanted poster
// ---------------------------------------------------------------------

function WantedPoster({ onNext }) {
  const [caught, setCaught] = useState(false)

  useEffect(() => {
    sfx.whoosh()
  }, [])

  function catchHim(e) {
    if (caught) return
    setCaught(true)
    sfx.stamp()
    const r = e.currentTarget.getBoundingClientRect()
    burst(r.left + r.width / 2, r.top + r.height / 2, { count: 36, emojis: ['🚨', '⭐', '🤠'] })
  }

  return (
    <section className="wanted-wall">
      <p className="wanted-intro">{WANTED.intro}</p>

      <div className="wanted-hang">
        <span className="wanted-nail" aria-hidden="true" />
        <article className="wanted">
          <h1 className="wanted-title">WANTED</h1>
          <p className="wanted-crime">{WANTED.crime}</p>
          <button type="button" className="wanted-photo" onClick={catchHim} aria-label={`Catch ${NAME}`}>
            <Photo src={WANTED.photo} alt={NAME} eager />
            {caught && <span className="wanted-stamp">CAUGHT!</span>}
          </button>
          <p className="wanted-name">{NAME.toUpperCase()}</p>
          <p className="wanted-doa">
            <s>DEAD OR ALIVE</s>
            <span>{WANTED.correction}</span>
          </p>
          <div className="wanted-reward">
            <span>REWARD</span>
            <strong>{WANTED.reward}</strong>
          </div>
          <p className="wanted-seen">
            <b>LAST SEEN:</b> {WANTED.lastSeen}
          </p>
          <ul className="wanted-charges" aria-label="Charges">
            {WANTED.charges.map((charge) => (
              <li key={charge}>{charge}</li>
            ))}
          </ul>
        </article>
      </div>

      <p className="wanted-hint" role="status">
        {caught ? WANTED.caughtText : WANTED.tapHint}
      </p>
      <button type="button" className="btn-chunky" onClick={onNext}>
        {WANTED.next}
      </button>
    </section>
  )
}
