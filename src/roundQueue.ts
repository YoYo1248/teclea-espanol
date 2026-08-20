export function bucketByRecentQueues<T>(items: T[], recentQueues: ReadonlyArray<ReadonlySet<string>>, getId: (item: T) => string) {
  const immediateIds = recentQueues[0] ?? new Set<string>()
  const earlierIds = new Set<string>()
  recentQueues.slice(1).forEach((queue) => queue.forEach((id) => earlierIds.add(id)))

  return {
    fresh: items.filter((item) => !immediateIds.has(getId(item)) && !earlierIds.has(getId(item))),
    earlier: items.filter((item) => !immediateIds.has(getId(item)) && earlierIds.has(getId(item))),
    immediate: items.filter((item) => immediateIds.has(getId(item))),
  }
}

export type IntroductionEvidence = { copyCompletedAt?: number }

export function hasCompletedIntroduction(evidence: IntroductionEvidence | undefined) {
  return typeof evidence?.copyCompletedAt === 'number' && Number.isFinite(evidence.copyCompletedAt) && evidence.copyCompletedAt > 0
}

export function itemsNeedingIntroduction<T>(items: readonly T[], getEvidence: (item: T) => IntroductionEvidence | undefined) {
  return items.filter((item) => !hasCompletedIntroduction(getEvidence(item)))
}

export const NEW_WORD_SHARE = 2 / 3

export function mixAdaptiveRound<T>(newItems: readonly T[], reviewItems: readonly T[], roundSize: number) {
  const safeRoundSize = Math.max(0, Math.floor(roundSize))
  const newTarget = Math.min(newItems.length, Math.ceil(safeRoundSize * NEW_WORD_SHARE))
  const selectedNew = newItems.slice(0, newTarget)
  const selectedReview = reviewItems.slice(0, Math.max(0, safeRoundSize - selectedNew.length))
  const remainingSlots = safeRoundSize - selectedNew.length - selectedReview.length
  const extraNew = newItems.slice(selectedNew.length, selectedNew.length + remainingSlots)
  const remainingAfterNew = remainingSlots - extraNew.length
  const extraReview = reviewItems.slice(selectedReview.length, selectedReview.length + remainingAfterNew)
  const newQueue = [...selectedNew, ...extraNew]
  const reviewQueue = [...selectedReview, ...extraReview]
  const mixed: T[] = []

  while (newQueue.length || reviewQueue.length) {
    if (newQueue.length) mixed.push(newQueue.shift()!)
    if (newQueue.length) mixed.push(newQueue.shift()!)
    if (reviewQueue.length) mixed.push(reviewQueue.shift()!)
  }

  return mixed.slice(0, safeRoundSize)
}

export function shouldMarkWordWeak(mode: 'copy' | 'recall' | 'listen', hadError: boolean, usedHint: boolean) {
  return mode === 'copy' ? hadError : hadError || usedHint
}
