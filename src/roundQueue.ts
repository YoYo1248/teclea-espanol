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
