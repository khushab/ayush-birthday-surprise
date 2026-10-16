import { useSyncExternalStore } from 'react'
import { isMuted, setMuted, subscribe, unlockAudio } from '../lib/sound.js'

// Always-visible sound toggle in the top-right corner.
export default function MuteButton() {
  const muted = useSyncExternalStore(subscribe, isMuted)

  return (
    <button
      type="button"
      className="mute-btn"
      onClick={() => {
        unlockAudio()
        setMuted(!muted)
      }}
      aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
      aria-pressed={muted}
    >
      <span aria-hidden="true">{muted ? '🔇' : '🔊'}</span>
    </button>
  )
}
