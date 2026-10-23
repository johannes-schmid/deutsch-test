// Small helpers the Modelltest authors share (DTZ and telc).

// Seeded, so a re-run of the same set reshuffles the same way.
export function rng(seed: string) {
  let h = 2166136261
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

export const shuffle = <T>(xs: T[], r: () => number) => {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Balanced target letters for k a/b/c items. */
export const targets = (k: number, r: () => number) => shuffle(Array.from({ length: k }, (_, i) => "abc"[i % 3]), r)
/** Balanced richtig/falsch pattern. */
export const rfPattern = (k: number, r: () => number) => shuffle(Array.from({ length: k }, (_, i) => (i % 2 ? "falsch" : "richtig")), r)

/** Balanced richtig/falsch that reads as random: two of the same in a row are fine, three are not, and a strict
 * richtig/falsch alternation (too regular to look random) is rejected too. */
export function mixedPattern(k: number, r: () => number) {
  for (;;) {
    const p = rfPattern(k, r)
    const noTriple = p.every((x, i) => i < 2 || x !== p[i - 1] || x !== p[i - 2])
    const alternating = k >= 4 && p.every((x, i) => i === 0 || x !== p[i - 1])
    if (noTriple && !alternating) return p
  }
}

/** Moves the correct option to `to` and keeps the others in order. */
export function place(options: string[], correct: string, to: string, letters = "abcdefgh") {
  const i = letters.indexOf(correct)
  const right = options[i]
  const rest = options.filter((_, j) => j !== i)
  const t = letters.indexOf(to)
  return [...rest.slice(0, t), right, ...rest.slice(t)]
}

const norm = (t: string) => t.toLowerCase().replace(/-\s*\n\s*/g, "").replace(/[^a-zäöüß0-9]+/g, " ").trim().split(" ")
/** Every run of n words in a text. */
export const grams = (t: string, n = 6) => {
  const w = norm(t)
  return new Set(w.slice(0, Math.max(0, w.length - n + 1)).map((_, i) => w.slice(i, i + n).join(" ")))
}
