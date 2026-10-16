import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Photo from '../components/Photo.jsx'
import { GIFTS, HACK, HACK_LINES, RED_BUTTON, TEAM } from '../content.js'
import { burst, cannons, rain } from '../lib/confetti.js'
import { sfx } from '../lib/sound.js'
import './TeamReveal.css'

// Page 3, the team reveal: the red button → a friendly "hack" → gift boxes.
export default function TeamReveal({ go }) {
  const [stage, setStage] = useState('button')
  const toHack = useCallback(() => setStage('hack'), [])
  const toGifts = useCallback(() => {
    window.scrollTo(0, 0)
    setStage('gifts')
  }, [])

  return (
    <div className="team">
      {stage === 'button' && <RedButton onGiveUp={toHack} />}
      {stage === 'hack' && <HackerTerminal onDone={toGifts} />}
      {stage === 'gifts' && <GiftRoom onFinale={() => go('finale')} />}
    </div>
  )
}

const pickOne = (list) => list[(Math.random() * list.length) | 0]

// ---------------------------------------------------------------------
//  1. DO NOT CLICK THIS
// ---------------------------------------------------------------------

// What happens on each press, in order. The last one starts the "hack".
const PRESS_EFFECTS = ['confetti', 'run', 'shake', 'shrink', 'decoys', 'run', 'final']
const BUTTON_SIZE = 170

function RedButton({ onGiveUp }) {
  const arenaRef = useRef(null)
  const realRef = useRef(null)
  const dodges = useRef(0)
  const [presses, setPresses] = useState(0)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [mood, setMood] = useState('') // '' | 'shake' | 'tiny' | 'final'
  const [decoys, setDecoys] = useState([])
  const [toast, setToast] = useState(null)

  const taunt = RED_BUTTON.taunts[Math.min(presses, RED_BUTTON.taunts.length - 1)]
  const nextEffect = PRESS_EFFECTS[Math.min(presses, PRESS_EFFECTS.length - 1)]

  // A random spot inside the arena, kept below the speech bubble.
  function randomSpot() {
    const a = arenaRef.current.getBoundingClientRect()
    const maxX = Math.max(0, a.width / 2 - BUTTON_SIZE / 2 - 6)
    const maxY = Math.max(0, a.height / 2 - BUTTON_SIZE / 2 - 6)
    return { x: (Math.random() * 2 - 1) * maxX, y: (Math.random() * 1.5 - 0.5) * maxY }
  }

  // Four spots in a 2×2 grid, shuffled: one for the real button, three for decoys.
  function gridSpots() {
    const a = arenaRef.current.getBoundingClientRect()
    const dx = Math.min(a.width / 4, a.width / 2 - BUTTON_SIZE / 2 - 4)
    const dy = Math.min(a.height / 4, 125)
    const spots = [
      { x: -dx, y: -dy * 0.6 },
      { x: dx, y: -dy * 0.6 },
      { x: -dx, y: dy },
      { x: dx, y: dy },
    ]
    return spots.sort(() => Math.random() - 0.5)
  }

  function compliment() {
    setToast({ text: pickOne(RED_BUTTON.compliments), key: Date.now() })
  }

  function press(e) {
    if (mood === 'final') return
    const r = e.currentTarget.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    setPresses((n) => n + 1)
    setDecoys([])
    setMood('')
    dodges.current = 0

    switch (nextEffect) {
      case 'confetti':
        sfx.honk()
        burst(cx, cy, { count: 90 })
        break
      case 'run':
        sfx.boing()
        setPos(randomSpot())
        compliment()
        break
      case 'shake':
        sfx.airhorn()
        setMood('shake')
        rain(['🎂', '🎉', '🥳', '🍞'], 1800)
        break
      case 'shrink':
        sfx.squeak()
        setMood('tiny')
        compliment()
        break
      case 'decoys': {
        sfx.boing()
        const [real, ...fakes] = gridSpots()
        setPos(real)
        setDecoys(fakes.map((spot, i) => ({ id: `${Date.now()}-${i}`, ...spot, popped: false })))
        break
      }
      default:
        sfx.glitch()
        setMood('final')
        setTimeout(onGiveUp, 1500)
    }
  }

  function popDecoy(id) {
    sfx.buzz()
    setDecoys((list) => list.map((d) => (d.id === id ? { ...d, popped: true } : d)))
  }

  // With a mouse, the button dodges the cursor a couple of times on "run" turns.
  function maybeDodge(e) {
    if (e.pointerType !== 'mouse' || nextEffect !== 'run' || dodges.current >= 2) return
    const r = realRef.current.getBoundingClientRect()
    const dist = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2))
    if (dist < 120) {
      dodges.current += 1
      sfx.boing()
      setPos(randomSpot())
    }
  }

  return (
    <section className={`rb ${mood === 'final' ? 'is-final' : ''}`}>
      <h1 className="rb-title">{RED_BUTTON.title}</h1>

      <div className="rb-arena" ref={arenaRef} onPointerMove={maybeDodge}>
        <p key={presses} className="rb-bubble" role="status">
          {taunt}
        </p>

        {decoys.map((d) => (
          <div key={d.id} className="rb-pos" style={{ '--x': `${d.x}px`, '--y': `${d.y}px` }}>
            {d.popped ? (
              <span className="rb-nope">nope 😜</span>
            ) : (
              <button type="button" className="big-red" onClick={() => popDecoy(d.id)} aria-label={RED_BUTTON.label}>
                <span className="big-red-base" aria-hidden="true" />
                <span className="big-red-cap">{RED_BUTTON.label}</span>
              </button>
            )}
          </div>
        ))}

        <div className="rb-pos" style={{ '--x': `${pos.x}px`, '--y': `${pos.y}px` }}>
          <button ref={realRef} type="button" className={`big-red ${mood ? `is-${mood}` : ''}`} onClick={press}>
            <span className="big-red-base" aria-hidden="true" />
            <span className="big-red-cap">{mood === 'final' ? 'FINE. 😤' : RED_BUTTON.label}</span>
          </button>
        </div>
      </div>

      <p className="rb-count">Rule violations: {presses}</p>

      {toast && (
        <p key={toast.key} className="toast" role="status">
          <small>🎁 Free compliment</small>
          {toast.text}
        </p>
      )}
    </section>
  )
}

// ---------------------------------------------------------------------
//  2. The friendly hacker terminal
// ---------------------------------------------------------------------

function HackerTerminal({ onDone }) {
  const lines = useMemo(() => {
    const device = window.matchMedia('(pointer: coarse)').matches ? 'PHONE' : 'COMPUTER'
    return HACK_LINES.map((line) => ({
      ...line,
      text: line.text.replaceAll('{device}', device).replaceAll('{count}', String(TEAM.length)),
    }))
  }, [])
  const [breach, setBreach] = useState(true)
  const [lineIndex, setLineIndex] = useState(0)
  const [chars, setChars] = useState(0)
  const fast = useRef(false)
  const endRef = useRef(null)
  const finished = lineIndex >= lines.length

  // A red "SYSTEM BREACH" flash before the typing starts.
  useEffect(() => {
    sfx.glitch()
    const t = setTimeout(() => setBreach(false), 1700)
    return () => clearTimeout(t)
  }, [])

  // Type the current line one character at a time (a tap fast-forwards it).
  useEffect(() => {
    if (breach || finished) return
    const line = lines[lineIndex]
    if (chars < line.text.length) {
      const t = setTimeout(() => {
        if (chars % 2 === 0) sfx.key()
        setChars(fast.current ? line.text.length : chars + 1)
      }, line.speed ?? 24)
      return () => clearTimeout(t)
    }
    if (line.kind === 'big') {
      sfx.tada()
      burst(undefined, undefined, { count: 30, emojis: ['❤️', '💚', '💛', '💜'] })
    }
    const t = setTimeout(
      () => {
        fast.current = false
        setLineIndex(lineIndex + 1)
        setChars(0)
      },
      fast.current ? 120 : (line.pause ?? 260),
    )
    return () => clearTimeout(t)
  }, [breach, finished, lines, lineIndex, chars])

  useEffect(() => {
    if (finished) sfx.unlock()
  }, [finished])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [lineIndex])

  const current = finished ? null : lines[lineIndex]

  return (
    <section className="hack" onClick={() => (fast.current = true)}>
      {breach && (
        <div className="breach" role="alert">
          <strong>{HACK.breach}</strong>
        </div>
      )}

      <div className="term">
        {lines.slice(0, lineIndex).map((line, i) => (
          <p key={i} className={`term-line term-line--${line.kind}`}>
            {line.text}
          </p>
        ))}
        {current && !breach && (
          <p className={`term-line term-line--${current.kind}`}>
            {current.text.slice(0, chars)}
            <span className="term-cursor" aria-hidden="true" />
          </p>
        )}
        {finished && (
          <div className="term-actions">
            <button type="button" className="btn-hack" onClick={onDone}>
              {HACK.accept}
            </button>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {!finished && !breach && <p className="term-skip">{HACK.skip}</p>}
    </section>
  )
}

// ---------------------------------------------------------------------
//  3. Gift boxes: one per teammate. The finale unlocks when all are open.
// ---------------------------------------------------------------------

function GiftRoom({ onFinale }) {
  const [opened, setOpened] = useState([])
  const [opening, setOpening] = useState(null)
  const [noteIndex, setNoteIndex] = useState(null)
  const [nudges, setNudges] = useState(0)
  const celebrated = useRef(false)
  const total = TEAM.length
  const allOpen = opened.length === total

  function openBox(index, e) {
    if (opened.includes(index)) {
      sfx.pop()
      setNoteIndex(index)
      return
    }
    if (opening !== null) return
    const r = e.currentTarget.getBoundingClientRect()
    setOpening(index)
    sfx.rattle()
    setTimeout(() => {
      sfx.pop()
      burst(r.left + r.width / 2, r.top + r.height * 0.3, { count: 50 })
      setOpened((list) => [...list, index])
      setOpening(null)
      setTimeout(() => setNoteIndex(index), 450)
    }, 650)
  }

  function closeNote() {
    setNoteIndex(null)
    if (allOpen && !celebrated.current) {
      celebrated.current = true
      sfx.unlock()
      cannons()
    }
  }

  function tryFinale() {
    if (allOpen) return onFinale()
    sfx.buzz()
    setNudges((n) => n + 1)
  }

  return (
    <section className="gifts">
      <h1 className="gifts-title">{GIFTS.title}</h1>
      <p className="gifts-sub">{GIFTS.subtitle}</p>
      <p className="gifts-counter" role="status">
        {GIFTS.counter(opened.length, total)}
      </p>
      <div className="gift-meter" aria-hidden="true">
        <span style={{ width: `${(opened.length / total) * 100}%` }} />
      </div>

      <ul className="gift-grid">
        {TEAM.map((member, i) => {
          const isOpen = opened.includes(i)
          return (
            <li key={member.name} style={{ '--i': i }}>
              <button
                type="button"
                className={`gbox ${isOpen ? 'is-open' : ''} ${opening === i ? 'is-opening' : ''}`}
                style={{ '--gift': member.color }}
                onClick={(e) => openBox(i, e)}
                aria-label={isOpen ? `Read ${member.name}'s note again` : `Open ${member.name}'s present`}
              >
                <span className="gbox-body">{isOpen && <span className="gbox-done">{member.name} ✓</span>}</span>
                {isOpen && (
                  <span className="gbox-letter" aria-hidden="true">
                    💌
                  </span>
                )}
                <span className="gbox-lid">
                  <span className="gbox-bow" aria-hidden="true" />
                  <span className="gbox-tag">
                    {member.photo ? (
                      <Photo src={member.photo} className="gbox-face" />
                    ) : (
                      <span aria-hidden="true">{member.emoji}</span>
                    )}{' '}
                    {member.name}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <button
        key={nudges}
        type="button"
        className={`btn-chunky finale-lock ${allOpen ? 'is-unlocked' : ''} ${nudges ? 'is-nudged' : ''}`}
        onClick={tryFinale}
      >
        {allOpen ? GIFTS.unlocked : GIFTS.locked(opened.length, total)}
      </button>
      {nudges > 0 && !allOpen && (
        <p key={`nudge-${nudges}`} className="gifts-nudge">
          {GIFTS.lockedNudge}
        </p>
      )}

      {noteIndex !== null && <NoteModal member={TEAM[noteIndex]} onClose={closeNote} />}
    </section>
  )
}

function NoteModal({ member, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="note-backdrop" onClick={onClose}>
      <div
        className="note-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-name"
        style={{ '--gift': member.color }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="note-head">
          <span className="note-avatar">{member.photo ? <Photo src={member.photo} /> : member.emoji}</span>
          <div>
            <small>A note from</small>
            <strong id="note-name">{member.name}</strong>
          </div>
        </div>
        <p className="note-text">{member.note}</p>
        <p className="note-sign">
          — {member.name} {member.emoji}
        </p>
        <button type="button" className="btn-chunky note-close" onClick={onClose} autoFocus>
          {GIFTS.close}
        </button>
      </div>
    </div>
  )
}
