import { useState } from 'react'
import { GATE, NAME } from '../content.js'
import { sfx, unlockAudio } from '../lib/sound.js'
import './Gate.css'

// Page 0: a one-tap "identity check". Both answers continue, and the tap
// is what lets the phone play sound for the rest of the surprise.
export default function Gate({ go }) {
  const [reply, setReply] = useState(null)

  function answer(isYes) {
    if (reply) return
    unlockAudio()
    if (isYes) sfx.tada()
    else sfx.buzz()
    setReply(isYes ? GATE.yesReply : GATE.noReply)
    setTimeout(() => go('hook'), isYes ? 1900 : 2700)
  }

  return (
    <section className="gate">
      <div className="gate-card">
        <span className="gate-stamp">TOP SECRET</span>
        <div className="gate-eyes" aria-hidden="true">
          👀
        </div>
        <p className="gate-eyebrow">{GATE.eyebrow}</p>
        <h1 className="gate-title">
          Are you <span>{NAME}?</span>
        </h1>
        {reply ? (
          <p className="gate-reply" role="status">
            {reply}
          </p>
        ) : (
          <div className="gate-actions">
            <button type="button" className="btn-chunky" onClick={() => answer(true)}>
              {GATE.yes}
            </button>
            <button type="button" className="btn-chunky gate-no" onClick={() => answer(false)}>
              {GATE.no}
            </button>
          </div>
        )}
      </div>
      <p className="gate-sound">{GATE.soundHint}</p>
    </section>
  )
}
