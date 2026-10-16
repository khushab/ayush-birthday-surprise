import { useEffect, useState } from 'react'
import Confetti from './Confetti.jsx'
import { config } from './config.js'
import './App.css'

const PALETTE = ['#ff6b8b', '#ffd166', '#06d6a0', '#4cc9f0', '#b388ff', '#ff9f43']

function Balloons() {
  return (
    <div className="balloons" aria-hidden="true">
      {PALETTE.map((color, i) => (
        <span key={color} className="balloon" style={{ '--color': color, '--i': i }} />
      ))}
    </div>
  )
}

function Gift({ opening, onOpen }) {
  return (
    <button
      type="button"
      className={`gift ${opening ? 'is-opening' : ''}`}
      onClick={onOpen}
      disabled={opening}
      aria-label="Open your present"
    >
      <span className="gift-lid">
        <span className="gift-bow" />
      </span>
      <span className="gift-box" />
    </button>
  )
}

function Cake({ candles, lit }) {
  return (
    <div className="cake" aria-hidden="true">
      <div className="candles">
        {Array.from({ length: candles }, (_, i) => (
          <span key={i} className="candle">
            <span className={`flame ${i < lit ? '' : 'is-out'}`} />
          </span>
        ))}
      </div>
      <div className="cake-top" />
      <div className="cake-layer" />
      <div className="cake-plate" />
    </div>
  )
}

export default function App() {
  const [stage, setStage] = useState('gift') // gift → opening → party
  const [lit, setLit] = useState(config.candles)
  const [blowing, setBlowing] = useState(false)
  const [burst, setBurst] = useState(0)

  // Blow the candles out one at a time, then celebrate.
  useEffect(() => {
    if (!blowing) return
    const timer = setTimeout(() => {
      if (lit === 1) {
        setBlowing(false)
        setBurst((b) => b + 1)
      }
      setLit(lit - 1)
    }, 300)
    return () => clearTimeout(timer)
  }, [blowing, lit])

  function openGift() {
    setStage('opening')
    setTimeout(() => {
      setStage('party')
      setBurst((b) => b + 1)
    }, 900)
  }

  function replay() {
    setStage('gift')
    setLit(config.candles)
    setBlowing(false)
  }

  const wished = lit === 0

  return (
    <>
      <Balloons />
      <Confetti burst={burst} />

      <main className="page">
        {stage !== 'party' ? (
          <section className="intro">
            <p className="eyebrow">Psst… {config.name} 👀</p>
            <h1 className="intro-title">Someone left a present for you.</h1>
            <Gift opening={stage === 'opening'} onOpen={openGift} />
            <p className="hint">Tap the gift to open it</p>
          </section>
        ) : (
          <section className="party">
            <h1 className="title">
              <span className="title-small">Happy Birthday,</span>
              <span className="sr-only">{config.name}</span>
              <span className="title-name" aria-hidden="true">
                {[...config.name].map((ch, i) => (
                  <span key={i} style={{ '--i': i, '--c': PALETTE[i % PALETTE.length] }}>
                    {ch}
                  </span>
                ))}
              </span>
            </h1>
            <p className="message">{config.message}</p>

            <Cake candles={config.candles} lit={lit} />

            {!wished ? (
              <button type="button" className="btn" onClick={() => setBlowing(true)} disabled={blowing}>
                {blowing ? 'Blowing…' : 'Make a wish & blow out the candles'}
              </button>
            ) : (
              <>
                <p className="wished">Wish made! Here are a few more from me 👇</p>
                <ul className="wishes">
                  {config.wishes.map((wish, i) => (
                    <li key={wish.text} className="wish" style={{ '--i': i }}>
                      <span className="wish-emoji" aria-hidden="true">{wish.emoji}</span>
                      {wish.text}
                    </li>
                  ))}
                </ul>
                <p className="signoff">With love, {config.from}</p>
                <button type="button" className="btn btn-ghost" onClick={replay}>
                  Open it again
                </button>
              </>
            )}
          </section>
        )}
      </main>
    </>
  )
}
