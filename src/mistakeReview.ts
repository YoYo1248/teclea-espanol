export type ReviewMode = 'copy' | 'recall' | 'listen'
export type MemoryReviewMode = Exclude<ReviewMode, 'copy'>

export type ModeCounts = Record<ReviewMode, number>

export type ReviewProgress = {
  active: boolean
  recoveryCount: number
  lastRecoveryDay?: string
  dueOn: string
  lastWrongAt: number
}

export type MaintenanceProgress = {
  active: boolean
  stage: number
  dueOn: string
  lastReviewDay?: string
  completedAt?: number
}

export type MistakeRecord = {
  lessonId: string
  spanish: string
  chinese: string
  count: number
  lastWrongAt: number
  lastMode: ReviewMode
  wrongCounts: ModeCounts
  independentCorrectCounts: ModeCounts
  lastCorrectAt?: number
  updatedAt: number
  review: Partial<Record<ReviewMode, ReviewProgress>>
  maintenance: Partial<Record<MemoryReviewMode, MaintenanceProgress>>
}

const EMPTY_COUNTS: ModeCounts = { copy: 0, recall: 0, listen: 0 }
export const MAINTENANCE_INTERVAL_DAYS = [3, 7, 21, 60] as const

function isMode(value: unknown): value is ReviewMode {
  return value === 'copy' || value === 'recall' || value === 'listen'
}

function finiteNonNegative(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : 0
}

function dateKeyAt(timestamp: number) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addReviewDays(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + days)
  return dateKeyAt(date.getTime())
}

export function recoveryTarget(totalWrongCount: number) {
  return Math.min(3, Math.max(1, Math.floor(totalWrongCount)))
}

export function mistakeSamplingWeight(record: MistakeRecord, today: string) {
  const errorWeight = Math.min(2.5, Math.log2(record.count + 1))
  const dueWeight = isReviewDue(record, today) || isMaintenanceDue(record, today) ? 2 : 0
  return 1 + errorWeight + dueWeight
}

export function weightedReviewOrder<T>(items: readonly T[], getWeight: (item: T) => number, random = Math.random) {
  return items
    .map((item) => ({ item, key: -Math.log(Math.max(Number.EPSILON, random())) / Math.max(.01, getWeight(item)) }))
    .sort((left, right) => left.key - right.key)
    .map(({ item }) => item)
}

function normalizeCounts(value: unknown, legacyMode: ReviewMode, legacyCount: number) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { ...EMPTY_COUNTS, [legacyMode]: legacyCount }
  }
  const counts = value as Partial<ModeCounts>
  return {
    copy: finiteNonNegative(counts.copy),
    recall: finiteNonNegative(counts.recall),
    listen: finiteNonNegative(counts.listen),
  }
}

function normalizeReview(value: unknown, lastMode: ReviewMode, lastWrongAt: number) {
  const fallbackDueOn = addReviewDays(dateKeyAt(lastWrongAt), 1)
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {
      [lastMode]: { active: true, recoveryCount: 0, dueOn: fallbackDueOn, lastWrongAt },
    } satisfies MistakeRecord['review']
  }
  const stored = value as Partial<Record<ReviewMode, Partial<ReviewProgress>>>
  return (['copy', 'recall', 'listen'] as const).reduce<MistakeRecord['review']>((result, mode) => {
    const progress = stored[mode]
    if (!progress || typeof progress !== 'object') return result
    const progressLastWrongAt = finiteNonNegative(progress.lastWrongAt) || lastWrongAt
    result[mode] = {
      active: progress.active === true,
      recoveryCount: Math.floor(finiteNonNegative(progress.recoveryCount)),
      ...(typeof progress.lastRecoveryDay === 'string' ? { lastRecoveryDay: progress.lastRecoveryDay } : {}),
      dueOn: typeof progress.dueOn === 'string' ? progress.dueOn : addReviewDays(dateKeyAt(progressLastWrongAt), 1),
      lastWrongAt: progressLastWrongAt,
    }
    return result
  }, {})
}

function scheduleMaintenance(today: string): MaintenanceProgress {
  return { active: true, stage: 0, dueOn: addReviewDays(today, MAINTENANCE_INTERVAL_DAYS[0]) }
}

function normalizeMaintenance(
  value: unknown,
  review: MistakeRecord['review'],
  wrongCounts: ModeCounts,
  lastCorrectAt: number,
) {
  const stored = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Partial<Record<MemoryReviewMode, Partial<MaintenanceProgress>>>
    : {}
  const fallbackDay = lastCorrectAt > 0 ? dateKeyAt(lastCorrectAt) : ''
  return (['recall', 'listen'] as const).reduce<MistakeRecord['maintenance']>((result, mode) => {
    const progress = stored[mode]
    if (progress && typeof progress === 'object') {
      const stage = Math.min(MAINTENANCE_INTERVAL_DAYS.length, Math.floor(finiteNonNegative(progress.stage)))
      result[mode] = {
        active: progress.active === true && stage < MAINTENANCE_INTERVAL_DAYS.length,
        stage,
        dueOn: typeof progress.dueOn === 'string'
          ? progress.dueOn
          : fallbackDay
            ? addReviewDays(fallbackDay, MAINTENANCE_INTERVAL_DAYS[Math.min(stage, MAINTENANCE_INTERVAL_DAYS.length - 1)])
            : '',
        ...(typeof progress.lastReviewDay === 'string' ? { lastReviewDay: progress.lastReviewDay } : {}),
        ...(positiveTimestamp(progress.completedAt) ? { completedAt: progress.completedAt as number } : {}),
      }
      return result
    }
    if (wrongCounts[mode] > 0 && review[mode]?.active === false && fallbackDay) {
      result[mode] = scheduleMaintenance(fallbackDay)
    }
    return result
  }, {})
}

function positiveTimestamp(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
}

export function normalizeMistakeRecord(value: unknown): MistakeRecord | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const stored = value as Partial<MistakeRecord>
  if (typeof stored.lessonId !== 'string' || typeof stored.spanish !== 'string' || typeof stored.chinese !== 'string') return null
  const lastMode = isMode(stored.lastMode) ? stored.lastMode : 'recall'
  const count = Math.max(1, Math.floor(finiteNonNegative(stored.count)))
  const lastWrongAt = finiteNonNegative(stored.lastWrongAt)
  if (!lastWrongAt) return null
  const wrongCounts = normalizeCounts(stored.wrongCounts, lastMode, count)
  const lastCorrectAt = finiteNonNegative(stored.lastCorrectAt)
  const review = normalizeReview(stored.review, lastMode, lastWrongAt)
  return {
    lessonId: stored.lessonId,
    spanish: stored.spanish,
    chinese: stored.chinese,
    count,
    lastWrongAt,
    lastMode,
    wrongCounts,
    independentCorrectCounts: stored.independentCorrectCounts
      ? normalizeCounts(stored.independentCorrectCounts, lastMode, 0)
      : { ...EMPTY_COUNTS },
    ...(lastCorrectAt ? { lastCorrectAt } : {}),
    updatedAt: finiteNonNegative(stored.updatedAt) || lastWrongAt,
    review,
    maintenance: normalizeMaintenance(stored.maintenance, review, wrongCounts, lastCorrectAt),
  }
}

export function hasActiveReview(record: MistakeRecord) {
  return Object.values(record.review).some((progress) => progress?.active)
}

export function isReviewDue(record: MistakeRecord, today: string) {
  return Object.values(record.review).some((progress) => progress?.active && progress.dueOn <= today)
}

export function hasActiveMaintenance(record: MistakeRecord) {
  return Object.values(record.maintenance).some((progress) => progress?.active)
}

export function isMaintenanceModeDue(record: MistakeRecord, mode: MemoryReviewMode, today: string) {
  const progress = record.maintenance[mode]
  return Boolean(progress?.active && progress.dueOn <= today)
}

export function isMaintenanceDue(record: MistakeRecord, today: string) {
  return (['recall', 'listen'] as const).some((mode) => isMaintenanceModeDue(record, mode, today))
}

export function maintenanceAnswerMode(record: MistakeRecord, today: string): MemoryReviewMode {
  return isMaintenanceModeDue(record, 'recall', today) ? 'recall' : 'listen'
}

export function isTodayReview(record: MistakeRecord, today: string) {
  return hasActiveReview(record) && dateKeyAt(record.lastWrongAt) === today
}

export function mistakeReviewBucket(record: MistakeRecord, today: string): 'due' | 'today' | 'later' | 'resolved' {
  if (!hasActiveReview(record)) return 'resolved'
  if (isReviewDue(record, today)) return 'due'
  if (isTodayReview(record, today)) return 'today'
  return 'later'
}

export function activeReviewModes(record: MistakeRecord) {
  return (['copy', 'recall', 'listen'] as const).filter((mode) => record.review[mode]?.active)
}

export function isReviewModeDue(record: MistakeRecord, mode: ReviewMode, today: string) {
  const progress = record.review[mode]
  return Boolean(progress?.active && progress.dueOn <= today)
}

export function reviewAnswerMode(record: MistakeRecord, today?: string): Exclude<ReviewMode, 'copy'> {
  const isEligible = (mode: ReviewMode) => record.review[mode]?.active && (!today || isReviewModeDue(record, mode, today))
  if (isEligible('recall') || isEligible('copy')) return 'recall'
  if (isEligible('listen')) return 'listen'
  if (record.review.recall?.active || record.review.copy?.active) return 'recall'
  return 'listen'
}

export function answerCanRecover(weakMode: ReviewMode, answerMode: ReviewMode) {
  if (answerMode === 'copy') return false
  if (weakMode === 'copy') return true
  return weakMode === answerMode
}

export function recordWrongAttempt(
  current: MistakeRecord | undefined,
  word: Pick<MistakeRecord, 'lessonId' | 'spanish' | 'chinese'>,
  mode: ReviewMode,
  now: number,
  today: string,
) {
  const nextCount = (current?.count ?? 0) + 1
  const dueOn = addReviewDays(today, 1)
  const existingReview = current?.review ?? {}
  const maintenance = { ...(current?.maintenance ?? {}) }
  if (mode === 'recall' || mode === 'listen') delete maintenance[mode]
  const review = (['copy', 'recall', 'listen'] as const).reduce<MistakeRecord['review']>((result, reviewMode) => {
    const previous = existingReview[reviewMode]
    if (!previous?.active && reviewMode !== mode) return result
    result[reviewMode] = {
      active: true,
      recoveryCount: 0,
      dueOn,
      lastWrongAt: reviewMode === mode ? now : previous?.lastWrongAt ?? now,
    }
    return result
  }, {})
  return {
    lessonId: current?.lessonId ?? word.lessonId,
    spanish: word.spanish,
    chinese: word.chinese,
    count: nextCount,
    lastWrongAt: now,
    lastMode: mode,
    wrongCounts: {
      ...(current?.wrongCounts ?? EMPTY_COUNTS),
      [mode]: (current?.wrongCounts[mode] ?? 0) + 1,
    },
    independentCorrectCounts: current?.independentCorrectCounts ?? { ...EMPTY_COUNTS },
    ...(current?.lastCorrectAt ? { lastCorrectAt: current.lastCorrectAt } : {}),
    updatedAt: now,
    review,
    maintenance,
  } satisfies MistakeRecord
}

export function recordIndependentCorrect(
  current: MistakeRecord,
  answerMode: ReviewMode,
  now: number,
  today: string,
) {
  const target = recoveryTarget(current.count)
  let progressed = false
  const newlyRecoveredModes: MemoryReviewMode[] = []
  const review = (['copy', 'recall', 'listen'] as const).reduce<MistakeRecord['review']>((result, weakMode) => {
    const previous = current.review[weakMode]
    if (!previous) return result
    if (!previous.active || !answerCanRecover(weakMode, answerMode) || previous.dueOn > today || previous.lastRecoveryDay === today) {
      result[weakMode] = previous
      return result
    }
    progressed = true
    const recoveryCount = previous.recoveryCount + 1
    result[weakMode] = {
      ...previous,
      active: recoveryCount < target,
      recoveryCount,
      lastRecoveryDay: today,
      dueOn: recoveryCount < target ? addReviewDays(today, 1) : previous.dueOn,
    }
    if (recoveryCount >= target && (weakMode === 'recall' || weakMode === 'listen')) newlyRecoveredModes.push(weakMode)
    return result
  }, {})
  const maintenance: MistakeRecord['maintenance'] = { ...current.maintenance }
  newlyRecoveredModes.forEach((mode) => {
    maintenance[mode] = scheduleMaintenance(today)
  })
  let maintenanceProgressed = false
  let maintenanceCompleted = false
  if (answerMode === 'recall' || answerMode === 'listen') {
    const previous = current.maintenance[answerMode]
    if (previous?.active
      && previous.dueOn <= today
      && previous.lastReviewDay !== today
      && !newlyRecoveredModes.includes(answerMode)) {
      maintenanceProgressed = true
      progressed = true
      const nextStage = previous.stage + 1
      if (nextStage >= MAINTENANCE_INTERVAL_DAYS.length) {
        maintenanceCompleted = true
        maintenance[answerMode] = {
          ...previous,
          active: false,
          stage: MAINTENANCE_INTERVAL_DAYS.length,
          lastReviewDay: today,
          completedAt: now,
        }
      } else {
        maintenance[answerMode] = {
          ...previous,
          stage: nextStage,
          dueOn: addReviewDays(today, MAINTENANCE_INTERVAL_DAYS[nextStage]),
          lastReviewDay: today,
        }
      }
    }
  }
  const record: MistakeRecord = {
    ...current,
    independentCorrectCounts: {
      ...current.independentCorrectCounts,
      [answerMode]: current.independentCorrectCounts[answerMode] + 1,
    },
    lastCorrectAt: now,
    updatedAt: now,
    review,
    maintenance,
  }
  return { record, progressed, resolved: !hasActiveReview(record), maintenanceProgressed, maintenanceCompleted }
}

export function deactivateReview(record: MistakeRecord, resolvedAt: number): MistakeRecord {
  const maintenance: MistakeRecord['maintenance'] = { ...record.maintenance }
  ;(['recall', 'listen'] as const).forEach((mode) => {
    if (record.review[mode]?.active && !maintenance[mode]) maintenance[mode] = scheduleMaintenance(dateKeyAt(resolvedAt))
  })
  return {
    ...record,
    updatedAt: Math.max(record.updatedAt, resolvedAt),
    review: Object.fromEntries(Object.entries(record.review).map(([mode, progress]) => [mode, progress ? { ...progress, active: false } : progress])),
    maintenance,
  }
}
