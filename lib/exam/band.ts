import type { Level } from "./types"

// TODO(hannes): indicative only. Derived from the commonly cited DTZ cut-offs for Hören + Lesen
// (about 33 of 45 points for B1, about 20 of 45 for A2), which are NOT yet verified against the
// official Prüfungsordnung. On 10 items this is a rough guide; the UI says so.
const B1 = 33 / 45
const A2 = 20 / 45

export function indicativeLevel(correct: number, total: number): Level {
  const share = total ? correct / total : 0
  return share >= B1 ? "B1" : share >= A2 ? "A2" : "unter A2"
}
