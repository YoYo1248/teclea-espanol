export type LearningStage = 'not-started' | 'newcomer-in-progress' | 'established'

export type LearningStageStorage = Pick<Storage, 'getItem'>

export type NewcomerStageConfig = {
  lessonId: string
  cardIds: readonly string[]
  isKnownLessonId: (lessonId: string) => boolean
}

export type StoredLearningSession = {
  lessonId: string
  mode: 'copy' | 'recall' | 'listen'
  order: string[]
  index: number
  completedWords?: number
  onboarding?: boolean
}

const PRACTICE_STATE_KEY = 'teclea-practice-state'
const ACTIVE_SESSION_KEY = 'teclea-active-session-v2'
const PAUSED_MAIN_SESSION_KEY = 'teclea-paused-main-session-v2'
const MASTERY_PROGRESS_KEY = 'teclea-mastery-progress-v2'
const MISTAKE_BANK_KEY = 'teclea-mistake-bank'
const LEGACY_ONBOARDING_DONE_KEY = 'teclea-first-three-complete-v1'
const NEWCOMER_ROUND_DONE_KEY = 'teclea-first-round-complete-v1'
const LEGACY_ONBOARDING_CARD_COUNT = 3
const WORD_EVIDENCE_KEY = 'teclea-word-evidence-v2'
const LEGACY_WORD_EVIDENCE_KEY = 'teclea-word-evidence-v1'
const ROUND_HISTORY_KEY = 'teclea-round-history-v1'
const CHALLENGE_KEY = 'teclea-challenge-v1'
const COMPLETED_LESSONS_KEY = 'teclea-completed'

function parseJson(storage: LearningStageStorage, key: string): unknown {
  try {
    return JSON.parse(storage.getItem(key) ?? 'null') as unknown
  } catch {
    return null
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function positiveNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
}

function storedSession(storage: LearningStageStorage, key: string): StoredLearningSession | null {
  const value = parseJson(storage, key)
  if (!isRecord(value)
    || typeof value.lessonId !== 'string'
    || (value.mode !== 'copy' && value.mode !== 'recall' && value.mode !== 'listen')
    || !Array.isArray(value.order)
    || !value.order.length
    || !value.order.every((cardId) => typeof cardId === 'string')
    || !Number.isInteger(value.index)
    || (value.index as number) < 0
    || (value.index as number) >= value.order.length) return null
  return {
    lessonId: value.lessonId,
    mode: value.mode,
    order: value.order as string[],
    index: value.index as number,
    ...(positiveNumber(value.completedWords) ? { completedWords: value.completedWords as number } : {}),
    ...(value.onboarding === true ? { onboarding: true } : {}),
  }
}

export function isNewcomerSession(session: StoredLearningSession | null, config: NewcomerStageConfig) {
  if (!session
    || !config.cardIds.length
    || session.lessonId !== config.lessonId
    || session.mode !== 'copy'
    || !session.order.length
    || session.order.length > config.cardIds.length) return false
  return session.order.every((cardId, index) => config.cardIds[index] === cardId)
}

export function newcomerSessionCompletedItems(session: StoredLearningSession | null, config: NewcomerStageConfig) {
  if (!isNewcomerSession(session, config)) return 0
  return Math.min(config.cardIds.length, session!.order.length, Math.max(session!.index, session!.completedWords ?? 0))
}

function evidenceRecords(storage: LearningStageStorage) {
  const legacy = parseJson(storage, LEGACY_WORD_EVIDENCE_KEY)
  const current = parseJson(storage, WORD_EVIDENCE_KEY)
  const merged: Record<string, unknown> = { ...(isRecord(legacy) ? legacy : {}) }
  if (isRecord(current)) {
    Object.entries(current).forEach(([cardId, value]) => {
      merged[cardId] = isRecord(value) && isRecord(merged[cardId])
        ? { ...merged[cardId], ...value }
        : value
    })
  }
  return merged
}

function completedNewcomerEvidencePrefix(storage: LearningStageStorage, config: NewcomerStageConfig) {
  const evidence = evidenceRecords(storage)
  let completed = 0
  for (const cardId of config.cardIds) {
    const record = evidence[cardId]
    if (!isRecord(record) || !positiveNumber(record.copyCompletedAt)) break
    completed += 1
  }
  return completed
}

export function readNewcomerCompletedItems(storage: LearningStageStorage, config: NewcomerStageConfig) {
  if (!config.cardIds.length) return 0
  const activeSession = storedSession(storage, ACTIVE_SESSION_KEY)
  const legacyCompleted = storage.getItem(LEGACY_ONBOARDING_DONE_KEY) === 'true'
    ? Math.min(LEGACY_ONBOARDING_CARD_COUNT, config.cardIds.length)
    : 0
  const completed = Math.max(
    newcomerSessionCompletedItems(activeSession, config),
    completedNewcomerEvidencePrefix(storage, config),
    legacyCompleted,
    storage.getItem(NEWCOMER_ROUND_DONE_KEY) === 'true' ? config.cardIds.length : 0,
  )
  return Math.min(config.cardIds.length, completed)
}

function hasIndependentOrBeyondNewcomerEvidence(storage: LearningStageStorage, config: NewcomerStageConfig, newcomerCount: number) {
  const newcomerIndex = new Map(config.cardIds.map((cardId, index) => [cardId, index]))
  return Object.entries(evidenceRecords(storage)).some(([cardId, value]) => {
    if (!isRecord(value)) return false
    if (value.recall === true || value.listen === true) return true
    if (!positiveNumber(value.copyCompletedAt)) return false
    const index = newcomerIndex.get(cardId)
    return index === undefined || index >= newcomerCount
  })
}

function completedLessonExists(storage: LearningStageStorage, config: NewcomerStageConfig) {
  const completed = parseJson(storage, COMPLETED_LESSONS_KEY)
  return Array.isArray(completed) && completed.some((lessonId) => typeof lessonId === 'string' && config.isKnownLessonId(lessonId))
}

function masteryEvidenceExists(storage: LearningStageStorage, config: NewcomerStageConfig) {
  const mastery = parseJson(storage, MASTERY_PROGRESS_KEY)
  return isRecord(mastery) && Object.entries(mastery).some(([lessonId, value]) => config.isKnownLessonId(lessonId)
    && isRecord(value)
    && (value.recall === true || value.listen === true))
}

function independentMistakeRecoveryExists(storage: LearningStageStorage) {
  const bank = parseJson(storage, MISTAKE_BANK_KEY)
  if (!isRecord(bank)) return false
  return Object.values(bank).some((value) => {
    if (!isRecord(value)) return false
    const correctCounts = value.independentCorrectCounts
    if (isRecord(correctCounts) && Object.values(correctCounts).some(positiveNumber)) return true
    const review = value.review
    return isRecord(review) && Object.values(review).some((progress) => isRecord(progress) && positiveNumber(progress.recoveryCount))
  })
}

function completedRoundExists(storage: LearningStageStorage) {
  const rounds = parseJson(storage, ROUND_HISTORY_KEY)
  return Array.isArray(rounds) && rounds.some((round) => isRecord(round) && positiveNumber(round.items) && positiveNumber(round.elapsedMs))
}

function challengeEvidenceExists(storage: LearningStageStorage) {
  const challenge = parseJson(storage, CHALLENGE_KEY)
  if (!isRecord(challenge)) return false
  const recallCompleted = challenge.recallCompleted
  if (isRecord(recallCompleted) && Object.values(recallCompleted).some((value) => value === true)) return true
  const dictationCounts = challenge.dictationCounts
  if (isRecord(dictationCounts) && Object.values(dictationCounts).some(positiveNumber)) return true
  const dailyCompleted = challenge.dailyCompleted
  return isRecord(dailyCompleted) && Object.values(dailyCompleted).some(positiveNumber)
}

function totalCompletedWords(storage: LearningStageStorage) {
  const practiceState = parseJson(storage, PRACTICE_STATE_KEY)
  if (!isRecord(practiceState) || !isRecord(practiceState.dailyWords)) return 0
  return Object.values(practiceState.dailyWords).reduce<number>((total, value) => total + (positiveNumber(value) ? value as number : 0), 0)
}

function completedNonNewcomerSessionExists(storage: LearningStageStorage, config: NewcomerStageConfig) {
  return [ACTIVE_SESSION_KEY, PAUSED_MAIN_SESSION_KEY].some((key) => {
    const session = storedSession(storage, key)
    if (!session || !config.isKnownLessonId(session.lessonId) || isNewcomerSession(session, config)) return false
    return Math.max(session.index, session.completedWords ?? 0) > 0
  })
}

export function readLearningStage(storage: LearningStageStorage, config: NewcomerStageConfig): LearningStage {
  const newcomerCount = readNewcomerCompletedItems(storage, config)

  if (config.cardIds.length > 0 && newcomerCount === config.cardIds.length) return 'established'

  const durableProgressBeyondNewcomer = completedLessonExists(storage, config)
    || masteryEvidenceExists(storage, config)
    || hasIndependentOrBeyondNewcomerEvidence(storage, config, newcomerCount)
    || independentMistakeRecoveryExists(storage)
    || completedRoundExists(storage)
    || challengeEvidenceExists(storage)
    || completedNonNewcomerSessionExists(storage, config)
  if (durableProgressBeyondNewcomer) return 'established'

  const completedWords = totalCompletedWords(storage)
  const completedWordsOnlyExplainNewcomer = newcomerCount > 0 && newcomerCount < config.cardIds.length && completedWords <= newcomerCount
  if (completedWords > 0 && !completedWordsOnlyExplainNewcomer) return 'established'
  if (newcomerCount > 0) return 'newcomer-in-progress'
  return 'not-started'
}

export function shouldResumeActiveSession(stage: LearningStage, session: StoredLearningSession | null, config: NewcomerStageConfig) {
  if (!session) return false
  return (stage === 'established' && config.isKnownLessonId(session.lessonId)) || isNewcomerSession(session, config)
}
