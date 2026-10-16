// Tiny synthesizer for every sound effect, built with the Web Audio API,
// so there are no audio files to download. Phones only allow sound after
// a tap, so unlockAudio() must run inside a click/tap handler first.

const STORAGE_KEY = 'ayush-surprise-muted'

let ctx = null
let master = null
let noiseBuffer = null
let muted = readMuted()
const listeners = new Set()

function readMuted() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function isMuted() {
  return muted
}

export function setMuted(value) {
  muted = value
  try {
    localStorage.setItem(STORAGE_KEY, value ? '1' : '0')
  } catch {
    // private browsing: the choice just isn't remembered
  }
  if (master) master.gain.setTargetAtTime(value ? 0 : 1, ctx.currentTime, 0.02)
  listeners.forEach((fn) => fn())
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function unlockAudio() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    try {
      // Lets sound play even when an iPhone's silent switch is on (Safari 16.4+).
      if (navigator.audioSession) navigator.audioSession.type = 'playback'
    } catch {
      // not supported: fine
    }
    ctx = new AudioCtx()
    master = ctx.createGain()
    master.gain.value = muted ? 0 : 1
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
}

const ready = () => ctx && !muted && ctx.state !== 'closed'

function tone(freq, { type = 'sine', dur = 0.15, vol = 0.2, at = 0, slide, attack = 0.006 } = {}) {
  if (!ready()) return
  const t = ctx.currentTime + at
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (slide) osc.frequency.exponentialRampToValueAtTime(slide, t + dur)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(vol, t + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(gain).connect(master)
  osc.start(t)
  osc.stop(t + dur + 0.05)
}

function noise({ dur = 0.3, vol = 0.3, at = 0, filter = 'lowpass', freq = 1000, q = 1, sweepTo } = {}) {
  if (!ready()) return
  if (!noiseBuffer) {
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  }
  const t = ctx.currentTime + at
  const src = ctx.createBufferSource()
  const biquad = ctx.createBiquadFilter()
  const gain = ctx.createGain()
  src.buffer = noiseBuffer
  biquad.type = filter
  biquad.frequency.setValueAtTime(freq, t)
  biquad.Q.value = q
  if (sweepTo) biquad.frequency.exponentialRampToValueAtTime(sweepTo, t + dur)
  gain.gain.setValueAtTime(vol, t)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(biquad).connect(gain).connect(master)
  src.start(t, Math.random() * Math.max(0, 1.9 - dur))
  src.stop(t + dur + 0.05)
}

let lastBoom = 0

export const sfx = {
  click: () => tone(660, { type: 'square', dur: 0.05, vol: 0.06 }),
  tick: () => tone(1100 + Math.random() * 400, { type: 'square', dur: 0.03, vol: 0.04 }),
  key: () => tone(1700 + Math.random() * 700, { type: 'square', dur: 0.018, vol: 0.025 }),
  back: () => tone(420, { type: 'sawtooth', dur: 0.55, vol: 0.1, slide: 110 }),
  error: () => {
    tone(180, { type: 'square', dur: 0.18, vol: 0.12 })
    tone(120, { type: 'square', dur: 0.3, vol: 0.12, at: 0.16 })
  },
  buzz: () => tone(95, { type: 'sawtooth', dur: 0.35, vol: 0.2 }),
  glitch: () => {
    for (let i = 0; i < 8; i++) tone(100 + Math.random() * 1600, { type: 'square', dur: 0.05, vol: 0.08, at: i * 0.05 })
    noise({ dur: 0.45, vol: 0.22, filter: 'bandpass', freq: 2200, q: 0.7 })
  },
  static: () => noise({ dur: 0.6, vol: 0.18, filter: 'highpass', freq: 1500 }),
  whoosh: () => noise({ dur: 0.5, vol: 0.3, filter: 'bandpass', freq: 300, q: 1.2, sweepTo: 3600 }),
  pop: () => tone(480, { dur: 0.12, vol: 0.28, slide: 1150 }),
  flip: () => noise({ dur: 0.12, vol: 0.22, filter: 'bandpass', freq: 3200, q: 2 }),
  clap: () => {
    noise({ dur: 0.07, vol: 0.5, filter: 'highpass', freq: 1400 })
    tone(220, { type: 'triangle', dur: 0.08, vol: 0.2 })
  },
  boing: () => {
    tone(140, { dur: 0.18, vol: 0.32, slide: 640 })
    tone(640, { dur: 0.35, vol: 0.25, slide: 180, at: 0.17 })
  },
  honk: () => {
    tone(330, { type: 'sawtooth', dur: 0.22, vol: 0.14 })
    tone(415, { type: 'sawtooth', dur: 0.22, vol: 0.1 })
    tone(330, { type: 'sawtooth', dur: 0.3, vol: 0.14, at: 0.26 })
    tone(415, { type: 'sawtooth', dur: 0.3, vol: 0.1, at: 0.26 })
  },
  airhorn: () => {
    ;[0, 0.2, 0.4].forEach((at, n) =>
      [415, 523, 622].forEach((f) => tone(f, { type: 'sawtooth', dur: n === 2 ? 0.8 : 0.16, vol: 0.07, at })),
    )
  },
  squeak: () => tone(1700, { type: 'triangle', dur: 0.16, vol: 0.18, slide: 2700 }),
  tada: () =>
    [523, 659, 784, 1047].forEach((f, i) => tone(f, { type: 'triangle', dur: i === 3 ? 0.9 : 0.16, vol: 0.18, at: i * 0.09 })),
  sparkle: () =>
    [1568, 2093, 2637, 3136, 2637, 3520].forEach((f, i) => tone(f, { dur: 0.3, vol: 0.06, at: i * 0.06 })),
  unlock: () =>
    [523, 784, 1047, 1568].forEach((f, i) => tone(f, { type: 'triangle', dur: 0.35, vol: 0.16, at: i * 0.1 })),
  secret: () =>
    [784, 988, 1175, 1568, 1976, 2349].forEach((f, i) => tone(f, { type: 'triangle', dur: 0.4, vol: 0.12, at: i * 0.07 })),
  stamp: () => {
    noise({ dur: 0.2, vol: 0.6, filter: 'lowpass', freq: 500 })
    tone(90, { dur: 0.16, vol: 0.4, slide: 45 })
  },
  rattle: () => {
    for (let i = 0; i < 5; i++) noise({ dur: 0.06, vol: 0.25, filter: 'bandpass', freq: 900, q: 3, at: i * 0.11 })
  },
  blow: () => noise({ dur: 0.9, vol: 0.35, filter: 'lowpass', freq: 900, sweepTo: 200 }),
  heartbeat: () => {
    tone(62, { dur: 0.16, vol: 0.55, slide: 40 })
    tone(58, { dur: 0.2, vol: 0.45, slide: 36, at: 0.24 })
  },
  newsSting: () => {
    ;[
      [196, 0, 0.18],
      [196, 0.22, 0.18],
      [147, 0.45, 1.3],
    ].forEach(([f, at, dur]) => {
      tone(f, { type: 'sawtooth', dur, vol: 0.14, at })
      tone(f * 2, { type: 'square', dur, vol: 0.05, at })
    })
    noise({ dur: 1.3, vol: 0.3, filter: 'lowpass', freq: 220, at: 0.45 })
  },
  launch: () => noise({ dur: 0.55, vol: 0.08, filter: 'bandpass', freq: 700, q: 5, sweepTo: 3000 }),
  boom: () => {
    if (!ready() || ctx.currentTime - lastBoom < 0.12) return
    lastBoom = ctx.currentTime
    noise({ dur: 1.1, vol: 0.45, filter: 'lowpass', freq: 900, sweepTo: 60 })
    for (let i = 0; i < 6; i++) noise({ dur: 0.04, vol: 0.1, filter: 'highpass', freq: 3500, at: 0.25 + Math.random() * 0.6 })
  },
}

// "Happy Birthday to You" (public domain) on a little music-box synth.
const NOTES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
const noteFreq = (n) => 440 * 2 ** ((NOTES[n[0]] + (Number(n[1]) + 1) * 12 - 69) / 12)

const HAPPY_BIRTHDAY = [
  ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
  ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
  ['G4', 0.75], ['G4', 0.25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
  ['F5', 0.75], ['F5', 0.25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 3],
]

export function playHappyBirthday(beat = 0.45) {
  if (!ready()) return
  let at = 0.15
  for (const [note, beats] of HAPPY_BIRTHDAY) {
    const f = noteFreq(note)
    tone(f, { type: 'triangle', dur: Math.max(0.5, beats * beat * 1.8), vol: 0.16, at })
    tone(f * 2, { dur: beats * beat, vol: 0.04, at })
    at += beats * beat
  }
}
