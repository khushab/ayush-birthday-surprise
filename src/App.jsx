import { useCallback, useEffect, useState } from 'react'
import MuteButton from './components/MuteButton.jsx'
import Transition from './components/Transition.jsx'
import { TEASERS } from './content.js'
import { sfx, unlockAudio } from './lib/sound.js'
import Finale from './pages/Finale.jsx'
import Gate from './pages/Gate.jsx'
import Hook from './pages/Hook.jsx'
import PhotoUniverse from './pages/PhotoUniverse.jsx'
import TeamReveal from './pages/TeamReveal.jsx'

// The pages, in order. The URL hash (#photos, #team…) remembers where
// he is, so a refresh doesn't restart the whole surprise.
const PAGES = { gate: Gate, hook: Hook, photos: PhotoUniverse, team: TeamReveal, finale: Finale }

function pageFromHash() {
  const id = window.location.hash.slice(1)
  return PAGES[id] ? id : 'gate'
}

export default function App() {
  const [page, setPage] = useState(pageFromHash)
  const [teaser, setTeaser] = useState(null)
  const [eggFound, setEggFound] = useState(false)

  // Phones only allow sound after a tap; after a refresh mid-way, the
  // first tap anywhere switches it back on.
  useEffect(() => {
    window.addEventListener('pointerdown', unlockAudio, { once: true })
    return () => window.removeEventListener('pointerdown', unlockAudio)
  }, [])

  useEffect(() => {
    const onPop = () => setPage(pageFromHash())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const go = useCallback((next) => {
    const swap = () => {
      setPage(next)
      window.scrollTo(0, 0)
      const url = next === 'gate' ? window.location.pathname : `#${next}`
      window.history.pushState(null, '', url)
    }
    const card = TEASERS[next]
    if (!card) return swap()
    sfx.whoosh()
    setTeaser({ ...card, key: Date.now() })
    setTimeout(swap, 700)
    setTimeout(() => setTeaser(null), 1900)
  }, [])

  const Page = PAGES[page]

  return (
    <>
      <MuteButton />
      <div key={page} className="page-root">
        <Page go={go} eggFound={eggFound} onEggFound={() => setEggFound(true)} />
      </div>
      {teaser && <Transition key={teaser.key} teaser={teaser} />}
    </>
  )
}
