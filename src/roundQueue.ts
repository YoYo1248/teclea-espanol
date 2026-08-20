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
