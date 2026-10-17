import { useEffect, useRef, useState } from 'react'
import Photo from '../components/Photo.jsx'
import { AGE, EASTER_EGG, FINALE, READING_TIME, TEAM } from '../content.js'
import { cannons, clearConfetti } from '../lib/confetti.js'
import { createFireworks } from '../lib/fireworks.js'
import { playHappyBirthday, sfx } from '../lib/sound.js'
import './Finale.css'

const COLORS = ['#ff3d7f', '#ffd23f', '#3bceac', '#4d9de0', '#9b5de5', '#ff8c42']
const DARK_MS = 2000
// Letter pacing in seconds, stretched by READING_TIME (the CSS for
// .letter p in Finale.css uses the same 1.1s gap).
const PARAGRAPH_GAP = 1.1 * READING_TIME
const SIGNATURE_GAP = 0.3 * READING_TIME

// Page 4, the finale:
// 2 seconds of darkness → HAPPY BIRTHDAY + fireworks → make a wish → the group letter.
export default function Finale({ go, eggFound }) {
  const canvasRef = useRef(null)
  const fireworks = useRef(null)
  const cakeRef = useRef(null)
  const letterRef = useRef(null)
  const [stage, setStage] = useState('dark') // dark → party → wish → letter
  const [blown, setBlown] = useState(false)

  useEffect(() => {
    fireworks.current = createFireworks(canvasRef.current)
    return () => fireworks.current.destroy()
  }, [])

  // Suspense: darkness and two heartbeats, then everything at once.
  useEffect(() => {
    clearConfetti() // no leftover confetti from the gift room in the dark
    sfx.heartbeat()
    const beat = setTimeout(sfx.heartbeat, 1000)
    const reveal = setTimeout(() => {
      setStage('party')
      sfx.boom()
      sfx.tada()
      cannons({ count: 220 })
      fireworks.current.show(9000)
    }, DARK_MS)
    return () => {
      clearTimeout(beat)
      clearTimeout(reveal)
    }
  }, [])

  // Bring each new part of the finale into view.
  useEffect(() => {
    if (stage === 'wish') cakeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (stage === 'letter') letterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [stage])

  // Fireworks follow his taps; sparkles follow the cursor or a dragging finger.
  function onPointerDown(e) {
    if (stage === 'dark') return
    fireworks.current.explode(e.clientX, e.clientY, Math.random() * 360, 70)
  }

  function onPointerMove(e) {
    if (stage === 'dark') return
    if (e.pointerType === 'mouse' || e.buttons) fireworks.current.sparkle(e.clientX, e.clientY)
  }

  function blowCandles() {
    if (blown) return
    setBlown(true)
    sfx.blow()
    fireworks.current.stopShow()
    setTimeout(() => {
      setStage('letter')
      playHappyBirthday()
    }, 1500)
  }

  const paragraphs = FINALE.message.split(/\n\s*\n/)
  const sigStart = paragraphs.length * PARAGRAPH_GAP + 0.6
  const afterSigs = sigStart + TEAM.length * SIGNATURE_GAP
  const title = `${FINALE.line1} ${FINALE.line2}`

  return (
    <div className={`finale finale--${stage}`} onPointerDown={onPointerDown} onPointerMove={onPointerMove}>
      <canvas ref={canvasRef} className="fw-canvas" aria-hidden="true" />
      <div className={`finale-dark ${stage === 'dark' ? '' : 'is-gone'}`} aria-hidden="true" />

      <section className="finale-hero">
        {stage !== 'dark' && (
          <>
            <h1 className="hb" aria-label={title}>
              <BurstLine text={FINALE.line1} offset={0} className="hb-line1" />
              <BurstLine text={FINALE.line2} offset={FINALE.line1.length} className="hb-line2" />
            </h1>
            <p className="finale-tap">{FINALE.tapHint}</p>
            {stage === 'party' && (
              <button type="button" className="btn-chunky finale-more" onClick={() => setStage('wish')}>
                {FINALE.more}
              </button>
            )}
          </>
        )}
      </section>

      {(stage === 'wish' || stage === 'letter') && (
        <section className="finale-cake" ref={cakeRef}>
          <h2 className="finale-h2">{FINALE.wishTitle}</h2>
          <p className="finale-p">{FINALE.wishHint}</p>
          <button
            type="button"
            className={`cake29 ${blown ? 'is-blown' : ''}`}
            onClick={blowCandles}
            aria-label="Blow out the candles"
          >
            <span className="cake29-candles">
              {String(AGE)
                .split('')
                .map((digit, i) => (
                  <span key={i} className="num-candle">
                    <span className="num-flame" />
                    <span className="num-smoke" />
                    <span className="num-digit">{digit}</span>
                  </span>
                ))}
            </span>
            <span className="cake29-top" />
            <span className="cake29-body" />
            <span className="cake29-plate" />
          </button>
        </section>
      )}

      {stage === 'letter' && (
        <section className="finale-letter" ref={letterRef}>
          <article className="letter">
            {paragraphs.map((text, i) => (
              <p key={i} style={{ '--i': i }}>
                {text}
              </p>
            ))}
            <p className="letter-signoff" style={{ '--i': paragraphs.length }}>
              {FINALE.signoff}
            </p>
            <div className="letter-sigs">
              {TEAM.map((member, i) => (
                <span
                  key={member.name}
                  className="letter-sig"
                  style={{ '--c': member.color, '--d': `${sigStart + i * SIGNATURE_GAP}s` }}
                >
                  {member.name}
                </span>
              ))}
            </div>
          </article>

          <figure className="team-polaroid" style={{ '--d': `${afterSigs + 0.3}s` }}>
            <Photo src={FINALE.groupPhoto} alt="The whole team together" />
            <figcaption>{FINALE.groupCaption}</figcaption>
          </figure>

          <div className="finale-end" style={{ '--d': `${afterSigs + 1}s` }}>
            <button type="button" className="btn-chunky" onClick={() => go('gate')}>
              {FINALE.replay}
            </button>
            <p className="egg-hint">{eggFound ? EASTER_EGG.hintFound : EASTER_EGG.hintMissing}</p>
          </div>
        </section>
      )}
    </div>
  )
}

// Letters that fly in from random directions and then float. Each word is
// kept together so a line only ever breaks between words.
// The "random" offsets come from the letter's position so they never jump between renders.
function BurstLine({ text, offset, className }) {
  const words = text.split(' ')
  // index of each word's first letter across the whole title (+1 per space)
  const starts = words.map((_, w) => offset + words.slice(0, w).reduce((sum, word) => sum + word.length + 1, 0))
  return (
    <span className={className} aria-hidden="true">
      {words.map((word, w) => {
        const first = starts[w]
        return (
          <span key={w} className="hb-word">
            {[...word].map((ch, n) => {
              const i = first + n
              return (
                <span
                  key={n}
                  className="hb-letter"
                  style={{
                    '--i': i,
                    '--c': COLORS[i % COLORS.length],
                    '--fx': `${Math.round(Math.sin(i * 12.9898) * 260)}px`,
                    '--fy': `${Math.round(Math.cos(i * 78.233) * 260)}px`,
                    '--fr': `${Math.round(Math.sin(i * 3.7) * 200)}deg`,
                  }}
                >
                  {ch}
                </span>
              )
            })}
          </span>
        )
      })}
    </span>
  )
}
