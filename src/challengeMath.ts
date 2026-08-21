import type { RoundTimingRecord, TimingMode } from './roundSizing'

export type ChallengePracticeMode = 'recall' | 'listen'

function parseLocalDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return Date.UTC(year, month - 1, day)
}

export function remainingChallengeDays(today: string, dueOn: string) {
  return Math.max(1, Math.round((parseLocalDate(dueOn) - parseLocalDate(today)) / 86_400_000) + 1)
}

export function dailyChallengeTarget(remainingRequired: number, remainingDays: number, eligibleMistakes: number) {
  if (remainingRequired <= 0) return 0
  const mistakeBuffer = Math.max(eligibleMistakes, Math.ceil(remainingRequired * 0.1))
  return Math.ceil((remainingRequired + mistakeBuffer) / Math.max(1, remainingDays))
}

export function challengeTodayTarget(remainingRequired: number, completedToday: number, remainingDays: number, eligibleMistakes: number) {
  return dailyChallengeTarget(
    Math.max(0, remainingRequired) + Math.max(0, completedToday),
    remainingDays,
    eligibleMistakes,
  )
}

export function challengePendingCardIds(
  cardIds: readonly string[],
  mode: ChallengePracticeMode,
  recallCompleted: Readonly<Record<string, true>>,
  dictationCounts: Readonly<Record<string, number>>,
  dictationRepetitions: number,
) {
  const safeRepetitions = Math.max(1, Math.floor(dictationRepetitions))
  const pending = cardIds.filter((cardId) => mode === 'recall'
    ? !recallCompleted[cardId]
    : (dictationCounts[cardId] ?? 0) < safeRepetitions)

  if (mode === 'recall') return pending
  return pending
    .map((cardId, index) => ({ cardId, index, completed: Math.max(0, dictationCounts[cardId] ?? 0) }))
    .sort((left, right) => left.completed - right.completed || left.index - right.index)
    .map((item) => item.cardId)
}

export function challengeRoundSize(baseRoundSize: number, todayRemaining: number, pendingCount: number) {
  if (pendingCount <= 0 || todayRemaining <= 0) return 0
  return Math.min(
    Math.max(1, Math.floor(baseRoundSize)),
    Math.max(1, Math.floor(todayRemaining)),
    Math.max(1, Math.floor(pendingCount)),
  )
}

const FALLBACK_SECONDS_PER_ITEM: Record<TimingMode, number> = {
  copy: 10,
  recall: 18.75,
  listen: 18.75,
}

function median(values: number[]) {
  const sorted = [...values].sort((left, right) => left - right)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}

function secondsPerItem(mode: TimingMode, history: readonly RoundTimingRecord[]) {
  const relevant = history
    .filter((item) => item.mode === mode && item.items > 0 && item.elapsedMs > 0)
    .slice(-8)
  if (relevant.length < 2) return { seconds: FALLBACK_SECONDS_PER_ITEM[mode], personalized: false }
  return {
    seconds: median(relevant.map((item) => item.elapsedMs / item.items / 1000)),
    personalized: true,
  }
}

export function challengeDailyPlan(
  cardCount: number,
  days: number,
  dictationRepetitions: number,
  history: readonly RoundTimingRecord[],
  progress: {
    remainingItems?: number
    remainingCopyItems?: number
    remainingRecallActions?: number
    remainingListenActions?: number
    eligibleMistakes?: number
  } = {},
) {
  const safeCardCount = Math.max(0, Math.floor(cardCount))
  const safeDays = Math.max(1, Math.floor(days))
  const safeRepetitions = Math.max(1, Math.floor(dictationRepetitions))
  const totalMasteryActions = safeCardCount * (safeRepetitions + 1)
  const remainingRecallActions = Math.max(0, progress.remainingRecallActions ?? safeCardCount)
  const remainingListenActions = Math.max(0, progress.remainingListenActions ?? safeCardCount * safeRepetitions)
  const remainingMasteryActions = remainingRecallActions + remainingListenActions
  const remainingItems = Math.max(0, progress.remainingItems ?? safeCardCount)
  const remainingCopyItems = Math.max(0, progress.remainingCopyItems ?? remainingItems)
  const dailyItems = Math.ceil(remainingItems / safeDays)
  const dailyCopyItems = Math.ceil(remainingCopyItems / safeDays)
  const dailyMasteryActions = dailyChallengeTarget(remainingMasteryActions, safeDays, Math.max(0, progress.eligibleMistakes ?? 0))
  const copyTiming = secondsPerItem('copy', history)
  const recallTiming = secondsPerItem('recall', history)
  const listenTiming = secondsPerItem('listen', history)
  const averageMasterySeconds = remainingMasteryActions
    ? (recallTiming.seconds * remainingRecallActions + listenTiming.seconds * remainingListenActions) / remainingMasteryActions
    : 0
  const estimatedSeconds = dailyCopyItems * copyTiming.seconds + dailyMasteryActions * averageMasterySeconds
  const personalizedModes = [copyTiming, recallTiming, listenTiming].filter((item) => item.personalized).length
  return {
    dailyItems,
    dailyMasteryActions,
    estimatedMinutes: estimatedSeconds > 0 ? Math.max(1, Math.ceil(estimatedSeconds / 60)) : 0,
    totalMasteryActions,
    remainingMasteryActions,
    personalizedModes,
  }
}
