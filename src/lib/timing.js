import { READING_TIME } from '../content.js'

// Stretches a timer by READING_TIME (from content.js) so text that
// disappears or moves on by itself stays readable.
export const readMs = (ms) => Math.round(ms * READING_TIME)

// The same setting for CSS: animations multiply their timings by var(--read).
export function applyReadingTime() {
  document.documentElement.style.setProperty('--read', String(READING_TIME))
}
