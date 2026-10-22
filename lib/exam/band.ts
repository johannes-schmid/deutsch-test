import type { Level } from "./types"

// Official DTZ Teilergebnis bands (research/dtz-blueprint.md §4–6, g.a.s.t. Übungssatz 2 pp. 47–48).
// Hören + Lesen: 33–45 B1, 20–32 A2 of 45. On a 10-item free test the same share is only a rough guide; the UI says so.
const B1 = 33 / 45
const A2 = 20 / 45

export function indicativeLevel(correct: number, total: number): Level {
  const share = total ? correct / total : 0
  return share >= B1 ? "B1" : share >= A2 ? "A2" : "unter A2"
}

/** Schreiben, 0–20 points: 15–20 B1, 7–14 A2. */
export const writingLevel = (points: number): Level => (points >= 15 ? "B1" : points >= 7 ? "A2" : "unter A2")

/** Sprechen, 0–100 points: 75–100 B1, 35–74.5 A2. */
export const speakingLevel = (points: number): Level => (points >= 75 ? "B1" : points >= 35 ? "A2" : "unter A2")
