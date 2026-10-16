// Full-screen card that wipes in between pages with a teaser line.
// The page underneath swaps while the card fully covers the screen.
export default function Transition({ teaser }) {
  return (
    <div className="transition" style={{ '--t-bg': teaser.color }} role="status" aria-live="polite">
      <div className="transition-inner">
        <span className="transition-emoji" aria-hidden="true">
          {teaser.emoji}
        </span>
        <p className="transition-text">{teaser.text}</p>
      </div>
    </div>
  )
}
