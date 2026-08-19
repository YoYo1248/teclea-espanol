export type TimingMode = 'copy' | 'recall' | 'listen'
export type RoundTimingRecord = { mode: TimingMode; items: number; elapsedMs: number; completedAt: number }

export const INITIAL_ROUND_ITEMS = 8
export const MIN_ROUND_ITEMS = 6
export const MAX_ROUND_ITEMS = 12
export const TARGET_ROUND_MS = 150_000

function median(values: number[]) {
  const sorted = [...values].sort((left, right) => left - right)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}

export function adaptiveRoundSize(mode: TimingMode, history: RoundTimingRecord[]) {
  const relevant = history.filter((item) => item.mode === mode).slice(-8)
  if (relevant.length < 2) return INITIAL_ROUND_ITEMS
  const medianMsPerItem = median(relevant.map((item) => item.elapsedMs / item.items))
  return Math.max(MIN_ROUND_ITEMS, Math.min(MAX_ROUND_ITEMS, Math.round(TARGET_ROUND_MS / medianMsPerItem)))
}

export function medianItemLength(values: number[]) {
  return median(values)
}
