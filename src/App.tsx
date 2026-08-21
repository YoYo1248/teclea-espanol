import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Check,
  Cloud,
  Copy,
  Eye,
  EyeOff,
  Flame,
  Headphones,
  Home,
  Keyboard,
  Gauge,
  RotateCcw,
  Settings2,
  Share2,
  Timer,
  Trash2,
  Volume2,
  X,
} from 'lucide-react'
import { ADVANCED_SOURCE, FREQUENCY_SOURCE, INTERMEDIATE_SOURCE, lessonLevels, lessonScenes, lessons, PHRASE_SOURCE, totalPracticeCards, WORD_SOURCE, type Lesson, type LessonLevel, type LessonScene } from './data'
import { createSyncLink, createSyncQr, deleteSync, formatSyncCode, generateSyncCode, mergeSyncSnapshots, normalizeSyncCode, pullSync, pushSync, SYNC_CODE_KEY, type SyncSnapshot } from './sync'
import { challengeDailyPlan, dailyChallengeTarget, remainingChallengeDays } from './challengeMath'
import { masteryRecommendation } from './masteryRouting'
import { bucketByRecentQueues, hasCompletedIntroduction, itemsNeedingIntroduction, shouldMarkWordWeak } from './roundQueue'
import { adaptiveRoundSize, medianItemLength, type RoundTimingRecord } from './roundSizing'
import { normalizeWordEvidence, type WordEvidence } from './wordEvidence'
import { initializeAnalytics, isAnalyticsConfigured, readAnalyticsConsent, trackAnalytics, updateAnalyticsConsent, type AnalyticsConsent } from './analytics'
import { pressHoldInputDecision, type PressHoldPending } from './pressHoldInput'
import {
  activeReviewModes,
  answerCanRecover,
  hasActiveReview,
  isReviewDue,
  isTodayReview,
  normalizeMistakeRecord,
  mistakeSamplingWeight,
  recordIndependentCorrect,
  recordWrongAttempt,
  recoveryTarget,
  reviewAnswerMode,
  weightedReviewOrder,
  type MistakeRecord,
} from './mistakeReview'

type Screen = 'home' | 'practice' | 'complete'
type Mode = 'copy' | 'recall' | 'listen'
type MasteryMode = Exclude<Mode, 'copy'>
type PracticeTrack = 'main' | 'verbs'
type LessonCategory = '核心表达' | '吃住购物' | '出行城市' | '家庭身心' | '学习工作' | '社会世界'
type AccentMode = 'strict' | 'lenient'
type SpeechRate = 0.55 | 0.8 | 1
type LessonMastery = Partial<Record<MasteryMode, true>>
type MasteryProgress = Record<string, LessonMastery>
type PracticeState = {
  lastMode: Mode
  lastLessonId: string
  dailyWords: Record<string, number>
}
type ActivePracticeSession = {
  lessonId: string
  mode: Mode
  order: string[]
  index: number
  elapsedMs: number
  correctKeystrokes: number
  mistakes: number
  completedWords: number
  mistakeWords: Record<string, number>
  reviewCorrectCount: number
  masteryMode: MasteryMode | null
  usedHint: boolean
  onboarding?: boolean
  independentCorrect?: number
  weakWordIds?: string[]
  satisfiedModes?: LessonMastery
  followUpMode?: MasteryMode
  followUpOrder?: string[]
}
type ChallengeDailyRecord = {
  cardId: string
  mode: MasteryMode
  completedAt: number
}
type ChallengeState = {
  level: LessonLevel
  durationDays: number
  dictationRepetitions: number
  startedOn: string
  dueOn: string
  recallCompleted: Record<string, true>
  dictationCounts: Record<string, number>
  dailyCompleted: Record<string, number>
  dailyRecords: Record<string, ChallengeDailyRecord[]>
}
type RoundRecord = RoundTimingRecord
type RecentRoundQueues = Record<string, string[][]>
type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const ACCENTS = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ']
const LENIENT_ACCENTS: Record<string, string> = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' }
const PRESS_HOLD_REPLACEMENT_MS = 3000
const PRACTICE_STATE_KEY = 'teclea-practice-state'
const MISTAKE_BANK_KEY = 'teclea-mistake-bank'
const ACTIVE_SESSION_KEY = 'teclea-active-session-v2'
const PAUSED_MAIN_SESSION_KEY = 'teclea-paused-main-session-v2'
const SPEECH_RATE_KEY = 'teclea-speech-rate'
const MASTERY_PROGRESS_KEY = 'teclea-mastery-progress-v2'
const MISTAKE_RESOLVED_KEY = 'teclea-mistake-resolved-at-v1'
const LOCAL_UPDATED_KEY = 'teclea-local-updated-at-v2'
const CHALLENGE_KEY = 'teclea-challenge-v1'
const ONBOARDING_DONE_KEY = 'teclea-first-three-complete-v1'
const WORD_EVIDENCE_KEY = 'teclea-word-evidence-v2'
const LEGACY_WORD_EVIDENCE_KEY = 'teclea-word-evidence-v1'
const ROUND_HISTORY_KEY = 'teclea-round-history-v1'
const RECENT_ROUND_QUEUES_KEY = 'teclea-recent-round-queues-v1'
const PRIMARY_ORIGIN = 'https://www.holadone.com'
const LEGACY_HOST = 'teclea-espanol.vercel.app'
const LESSON_PAGE_SIZE = 12
const DEFAULT_LESSON = lessons[0]
const LEVEL_ORDER: LessonLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const PRACTICE_TRACKS: Array<{ value: PracticeTrack; label: string; shortLabel: string }> = [
  { value: 'main', label: '词汇与短语', shortLabel: '词汇主线' },
  { value: 'verbs', label: '常用动词专项', shortLabel: '动词专项' },
]
const LESSON_CATEGORIES: LessonCategory[] = ['核心表达', '吃住购物', '出行城市', '家庭身心', '学习工作', '社会世界']
const CATEGORY_SCENES: Record<LessonCategory, LessonScene[]> = {
  核心表达: ['基础', '日常', '时间'],
  吃住购物: ['餐厅', '购物', '住宿'],
  出行城市: ['城市', '旅行'],
  家庭身心: ['家庭', '健康', '情绪'],
  学习工作: ['学习', '工作'],
  社会世界: ['社会', '科技', '环境', '行政'],
}
const MERGED_LESSON_MIGRATIONS: Record<string, string[]> = {
  'b1-learning-digital': ['b1-education', 'b1-media-tech'],
  'b2-wellbeing-judgment': ['b2-wellbeing', 'b2-core-nuance'],
}
const LEGACY_LESSON_REDIRECTS = Object.fromEntries(
  Object.entries(MERGED_LESSON_MIGRATIONS).flatMap(([nextId, previousIds]) => previousIds.map((previousId) => [previousId, nextId])),
)
const SPEECH_RATE_OPTIONS: Array<{ value: SpeechRate; label: string }> = [
  { value: 0.55, label: '慢速' },
  { value: 0.8, label: '标准' },
  { value: 1, label: '快速' },
]

function readInitialSyncInvite() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const hashCode = hash.get('sync')
  const normalizedHashCode = normalizeSyncCode(hashCode ?? '')
  const storedCode = normalizeSyncCode(localStorage.getItem(SYNC_CODE_KEY) ?? '')
  const fromHash = Boolean(hashCode && normalizedHashCode.length === 20)
  const normalized = fromHash ? normalizedHashCode : storedCode
  if (hashCode) history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
  if (fromHash) localStorage.setItem(SYNC_CODE_KEY, normalized)
  return { code: normalized.length === 20 ? normalized : '', fromHash }
}

function lessonMatchesCategory(item: Lesson, category: '全部' | LessonCategory) {
  return category === '全部' || CATEGORY_SCENES[category].includes(item.scene)
}

function categoryForScene(scene: LessonScene): LessonCategory {
  return LESSON_CATEGORIES.find((category) => CATEGORY_SCENES[category].includes(scene)) ?? '核心表达'
}

function readInitialLocalUpdatedAt() {
  const stored = Number(localStorage.getItem(LOCAL_UPDATED_KEY))
  if (stored > 0) return stored
  const hasLocalProgress = [
    PRACTICE_STATE_KEY,
    MISTAKE_BANK_KEY,
    MASTERY_PROGRESS_KEY,
    ACTIVE_SESSION_KEY,
    PAUSED_MAIN_SESSION_KEY,
    'teclea-completed',
  ].some((key) => localStorage.getItem(key) !== null)
  return hasLocalProgress ? Date.now() : 0
}

function readMistakeResolvedAt() {
  try {
    const stored = JSON.parse(localStorage.getItem(MISTAKE_RESOLVED_KEY) || '{}') as unknown
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {}
    return Object.fromEntries(Object.entries(stored).filter((entry): entry is [string, number] => typeof entry[1] === 'number' && entry[1] > 0))
  } catch {
    return {}
  }
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addLocalDays(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + days)
  return localDateKey(date)
}

function challengeCardIds(level: LessonLevel) {
  return lessons
    .filter((item) => item.level === level)
    .flatMap((item) => item.words.map((word) => sessionCardId(item.id, word)))
}

function challengeWithExistingEvidence(challenge: ChallengeState, wordEvidence: WordEvidence): ChallengeState {
  const recallCompleted = { ...challenge.recallCompleted }
  const dictationCounts = { ...challenge.dictationCounts }
  challengeCardIds(challenge.level).forEach((cardId) => {
    if (wordEvidence[cardId]?.recall) recallCompleted[cardId] = true
    if (wordEvidence[cardId]?.listen) dictationCounts[cardId] = Math.max(1, dictationCounts[cardId] ?? 0)
  })
  return { ...challenge, recallCompleted, dictationCounts, dailyRecords: challenge.dailyRecords ?? {} }
}

function readChallengeDailyRecords(value: unknown): Record<string, ChallengeDailyRecord[]> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(Object.entries(value).flatMap(([date, records]) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Array.isArray(records)) return []
    const validRecords = records.filter((record): record is ChallengeDailyRecord => Boolean(record)
      && typeof record === 'object'
      && typeof (record as ChallengeDailyRecord).cardId === 'string'
      && ((record as ChallengeDailyRecord).mode === 'recall' || (record as ChallengeDailyRecord).mode === 'listen')
      && Number.isFinite((record as ChallengeDailyRecord).completedAt)
      && (record as ChallengeDailyRecord).completedAt > 0)
    return validRecords.length ? [[date, validRecords]] : []
  }))
}

function readChallenge(): ChallengeState | null {
  try {
    const stored = JSON.parse(localStorage.getItem(CHALLENGE_KEY) || 'null') as Partial<ChallengeState> | null
    if (!stored || !LEVEL_ORDER.includes(stored.level as LessonLevel)) return null
    if (!Number.isInteger(stored.durationDays) || stored.durationDays! < 1 || stored.durationDays! > 365) return null
    if (!Number.isInteger(stored.dictationRepetitions) || stored.dictationRepetitions! < 1 || stored.dictationRepetitions! > 10) return null
    if (typeof stored.startedOn !== 'string' || typeof stored.dueOn !== 'string') return null
    return {
      level: stored.level as LessonLevel,
      durationDays: stored.durationDays!,
      dictationRepetitions: stored.dictationRepetitions!,
      startedOn: stored.startedOn,
      dueOn: stored.dueOn,
      recallCompleted: stored.recallCompleted && typeof stored.recallCompleted === 'object' ? stored.recallCompleted : {},
      dictationCounts: stored.dictationCounts && typeof stored.dictationCounts === 'object' ? stored.dictationCounts : {},
      dailyCompleted: stored.dailyCompleted && typeof stored.dailyCompleted === 'object' ? stored.dailyCompleted : {},
      dailyRecords: readChallengeDailyRecords(stored.dailyRecords),
    }
  } catch {
    return null
  }
}

function hasLearningHistory() {
  return [PRACTICE_STATE_KEY, ACTIVE_SESSION_KEY, MASTERY_PROGRESS_KEY, 'teclea-completed', ONBOARDING_DONE_KEY]
    .some((key) => localStorage.getItem(key) !== null)
}

function readWordEvidence(): WordEvidence {
  try {
    const currentRaw = localStorage.getItem(WORD_EVIDENCE_KEY)
    const needsMigration = currentRaw === null
    const legacyRaw = needsMigration ? localStorage.getItem(LEGACY_WORD_EVIDENCE_KEY) : null
    const stored = JSON.parse(currentRaw ?? legacyRaw ?? '{}') as unknown
    const completedCardIds = needsMigration
      ? readCompletedLessons().flatMap((lessonId) => {
          const completedLesson = lessons.find((item) => item.id === lessonId)
          return completedLesson?.words.map((word) => sessionCardId(completedLesson.id, word)) ?? []
        })
      : []
    const migrated = normalizeWordEvidence(stored, { legacy: needsMigration, completedCardIds })
    if (needsMigration) {
      localStorage.setItem(WORD_EVIDENCE_KEY, JSON.stringify(migrated))
    }
    return migrated
  } catch {
    return {}
  }
}

function readRoundHistory(): RoundRecord[] {
  try {
    const stored = JSON.parse(localStorage.getItem(ROUND_HISTORY_KEY) || '[]') as unknown
    if (!Array.isArray(stored)) return []
    return stored.filter((item): item is RoundRecord => Boolean(item) && typeof item === 'object'
      && ['copy', 'recall', 'listen'].includes((item as RoundRecord).mode)
      && Number.isFinite((item as RoundRecord).items) && (item as RoundRecord).items > 0
      && Number.isFinite((item as RoundRecord).elapsedMs) && (item as RoundRecord).elapsedMs > 0)
  } catch {
    return []
  }
}

function readRecentRoundQueues(): RecentRoundQueues {
  try {
    const stored = JSON.parse(localStorage.getItem(RECENT_ROUND_QUEUES_KEY) || '{}') as unknown
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {}
    return Object.fromEntries(Object.entries(stored).flatMap(([key, value]) => {
      if (!Array.isArray(value)) return []
      const migratedQueues = value.every((item) => typeof item === 'string')
        ? [value.filter((item): item is string => typeof item === 'string')]
        : value
            .filter((item): item is unknown[] => Array.isArray(item))
            .map((queue) => queue.filter((item): item is string => typeof item === 'string'))
      const cleanQueues = migratedQueues.filter((queue) => queue.length).slice(0, 2)
      return cleanQueues.length ? [[key, cleanQueues]] : []
    }))
  } catch {
    return {}
  }
}

function adaptiveRoundQueueKey(level: LessonLevel, track: PracticeTrack, category: '全部' | LessonCategory, scene: '全部' | LessonScene) {
  return `${level}:${track}:${category}:${scene}`
}

function adaptiveLevelFromLessonId(lessonId: string): LessonLevel | null {
  const match = /^adaptive-(A1|A2|B1|B2|C1|C2)-/.exec(lessonId)
  return match ? match[1] as LessonLevel : null
}

function practiceSessionLevel(session: ActivePracticeSession) {
  return adaptiveLevelFromLessonId(session.lessonId) ?? lessons.find((item) => item.id === session.lessonId)?.level ?? null
}

function catalogWordById(cardId: string) {
  for (const item of lessons) {
    const matched = item.words.find((word) => sessionCardId(item.id, word) === cardId)
    if (matched) return { lesson: item, word: { ...matched, reviewKey: cardId } }
  }
  return null
}

function adaptiveLessonFromOrder(lessonId: string, order: string[]): Lesson | null {
  const level = adaptiveLevelFromLessonId(lessonId)
  if (!level) return null
  const words = order.flatMap((cardId) => {
    const matched = catalogWordById(cardId)
    return matched ? [matched.word] : []
  })
  if (!words.length) return null
  return {
    id: lessonId,
    level,
    scene: '基础',
    kind: lessonId.endsWith('-verbs') ? '动词原形' : '单词',
    eyebrow: `${level} · 本轮练习`,
    title: `${level} 本轮练习`,
    description: '根据当前进度动态抽取',
    color: '#347665',
    words,
  }
}

function practiceLessonFromOrder(lessonId: string, order: string[]): Lesson | null {
  const adaptiveLesson = adaptiveLessonFromOrder(lessonId, order)
  if (adaptiveLesson) return adaptiveLesson
  const catalogLesson = lessons.find((item) => item.id === lessonId)
  if (!catalogLesson) return null
  const words = order.flatMap((cardId) => {
    const matched = catalogWordById(cardId)
    return matched ? [matched.word] : []
  })
  return words.length ? { ...catalogLesson, words } : null
}

function readInitialLevelFilter(): '全部' | LessonLevel {
  const level = new URLSearchParams(window.location.search).get('level')
  return level === 'A1' || level === 'A2' || level === 'B1' || level === 'B2' || level === 'C1' || level === 'C2' ? level : '全部'
}

function readInitialTrackFilter(): PracticeTrack {
  const kind = new URLSearchParams(window.location.search).get('kind')
  if (kind === '动词原形') return 'verbs'
  if (kind === '单词' || kind === '短语') return 'main'
  try {
    const stored = JSON.parse(localStorage.getItem(PRACTICE_STATE_KEY) || '{}') as Partial<PracticeState>
    const lastLesson = lessons.find((lesson) => lesson.id === stored.lastLessonId)
    return lastLesson?.kind === '动词原形' ? 'verbs' : 'main'
  } catch {
    return 'main'
  }
}

function readInitialMode(fallback: Mode): Mode {
  const mode = new URLSearchParams(window.location.search).get('mode')
  return mode === 'copy' || mode === 'recall' || mode === 'listen' ? mode : fallback
}

function readInitialAccentMode(): AccentMode {
  const accent = new URLSearchParams(window.location.search).get('accent')
  if (accent === 'strict' || accent === 'lenient') return accent
  const storedMode = localStorage.getItem('teclea-accent-mode')
  return storedMode === 'strict' || storedMode === 'lenient' ? storedMode : 'lenient'
}

function readSpeechRate(): SpeechRate {
  const stored = Number(localStorage.getItem(SPEECH_RATE_KEY))
  return stored === 0.55 || stored === 1 ? stored : 0.8
}

function readPracticeState(): PracticeState {
  const fallback: PracticeState = { lastMode: 'copy', lastLessonId: DEFAULT_LESSON.id, dailyWords: {} }
  try {
    const stored = JSON.parse(localStorage.getItem(PRACTICE_STATE_KEY) || '{}') as Partial<PracticeState>
    const lastMode = stored.lastMode === 'recall' || stored.lastMode === 'listen' ? stored.lastMode : 'copy'
    const redirectedLessonId = typeof stored.lastLessonId === 'string' ? (LEGACY_LESSON_REDIRECTS[stored.lastLessonId] ?? stored.lastLessonId) : ''
    const lastLessonId = lessons.some((item) => item.id === redirectedLessonId) ? redirectedLessonId : fallback.lastLessonId
    const dailyWords = stored.dailyWords && typeof stored.dailyWords === 'object' ? stored.dailyWords : {}
    return { lastMode, lastLessonId, dailyWords }
  } catch {
    return fallback
  }
}

function readCompletedLessons() {
  try {
    const stored = JSON.parse(localStorage.getItem('teclea-completed') || '[]') as unknown
    if (!Array.isArray(stored)) return []
    const storedIds = stored.filter((id): id is string => typeof id === 'string')
    const completedIds = storedIds.filter((id) => lessons.some((lesson) => lesson.id === id))
    for (const [nextId, previousIds] of Object.entries(MERGED_LESSON_MIGRATIONS)) {
      if (previousIds.every((previousId) => storedIds.includes(previousId))) completedIds.push(nextId)
    }
    return Array.from(new Set(completedIds))
  } catch {
    return []
  }
}

function readMasteryProgress(): MasteryProgress {
  const progress: MasteryProgress = {}
  let storedProgress: Record<string, unknown> = {}
  try {
    const stored = JSON.parse(localStorage.getItem(MASTERY_PROGRESS_KEY) || '{}') as unknown
    if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
      storedProgress = stored as Record<string, unknown>
      for (const [lessonId, value] of Object.entries(stored)) {
        if (!lessons.some((lesson) => lesson.id === lessonId) || !value || typeof value !== 'object' || Array.isArray(value)) continue
        const candidate = value as Record<string, unknown>
        progress[lessonId] = {
          ...(candidate.recall === true ? { recall: true } : {}),
          ...(candidate.listen === true ? { listen: true } : {}),
        }
      }
    }
  } catch {
    // Fall back to the legacy completion list below.
  }

  for (const [nextId, previousIds] of Object.entries(MERGED_LESSON_MIGRATIONS)) {
    const previousValues = previousIds.map((previousId) => storedProgress[previousId]).filter((value): value is Record<string, unknown> => Boolean(value) && typeof value === 'object' && !Array.isArray(value))
    if (previousValues.length !== previousIds.length) continue
    progress[nextId] = {
      ...(previousValues.every((value) => value.recall === true) ? { recall: true } : {}),
      ...(previousValues.every((value) => value.listen === true) ? { listen: true } : {}),
    }
  }

  // Existing users already earned their checks under the former rule. Preserve
  // those checks as complete while applying the two-direction rule to new work.
  for (const lessonId of readCompletedLessons()) {
    progress[lessonId] = { recall: true, listen: true }
  }
  return progress
}

function learningStreak(dailyWords: Record<string, number>) {
  const cursor = new Date()
  if (!(dailyWords[localDateKey(cursor)] > 0)) cursor.setDate(cursor.getDate() - 1)
  let count = 0
  while (dailyWords[localDateKey(cursor)] > 0) {
    count += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return count
}

function readMistakeBank(): Record<string, MistakeRecord> {
  try {
    const stored = JSON.parse(localStorage.getItem(MISTAKE_BANK_KEY) || '{}') as Record<string, unknown>
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {}
    const validBank = Object.values(stored).reduce<Record<string, MistakeRecord>>((bank, rawItem) => {
      const item = normalizeMistakeRecord(rawItem)
      if (!item) return bank
      if (typeof item.lessonId === 'string' && item.lessonId.startsWith('conjugation-')) return bank
      const target = getTypingTarget(item.spanish)
      const currentMatch = lessons.flatMap((lesson) => lesson.words.map((word) => ({ lesson, word }))).find(({ word }) => getTypingTarget(word.spanish) === target)
      if (!currentMatch) return bank
      const key = `${currentMatch.lesson.id}::${target}`
      const remapped = normalizeMistakeRecord({
        ...item,
        lessonId: currentMatch.lesson.id,
        spanish: currentMatch.word.spanish,
        chinese: currentMatch.word.chinese,
      })
      if (!remapped) return bank
      const previous = bank[key]
      if (!previous) {
        bank[key] = remapped
        return bank
      }
      const latest = remapped.updatedAt >= previous.updatedAt ? remapped : previous
      bank[key] = {
        ...latest,
        count: previous.count + remapped.count,
        wrongCounts: {
          copy: previous.wrongCounts.copy + remapped.wrongCounts.copy,
          recall: previous.wrongCounts.recall + remapped.wrongCounts.recall,
          listen: previous.wrongCounts.listen + remapped.wrongCounts.listen,
        },
        independentCorrectCounts: {
          copy: previous.independentCorrectCounts.copy + remapped.independentCorrectCounts.copy,
          recall: previous.independentCorrectCounts.recall + remapped.independentCorrectCounts.recall,
          listen: previous.independentCorrectCounts.listen + remapped.independentCorrectCounts.listen,
        },
        review: Object.fromEntries((['copy', 'recall', 'listen'] as const).flatMap((reviewMode) => {
          const left = previous.review[reviewMode]
          const right = remapped.review[reviewMode]
          if (!left) return right ? [[reviewMode, right]] : []
          if (!right) return [[reviewMode, left]]
          return [[reviewMode, right.lastWrongAt >= left.lastWrongAt ? right : left]]
        })),
      }
      return bank
    }, {})
    return validBank
  } catch {
    return {}
  }
}

function readActiveSession(storageKey = ACTIVE_SESSION_KEY): ActivePracticeSession | null {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || 'null') as Partial<ActivePracticeSession> | null
    if (!stored || typeof stored.lessonId !== 'string' || !Array.isArray(stored.order) || !stored.order.every((item) => typeof item === 'string')) return null
    if (stored.mode !== 'copy' && stored.mode !== 'recall' && stored.mode !== 'listen') return null
    if (!Number.isInteger(stored.index) || stored.index! < 0 || stored.index! >= stored.order.length) return null
    const previousLessonId = stored.lessonId
    const lessonId = previousLessonId === 'mistake-review' ? previousLessonId : (LEGACY_LESSON_REDIRECTS[previousLessonId] ?? previousLessonId)
    if (lessonId !== 'mistake-review' && !adaptiveLevelFromLessonId(lessonId) && !lessons.some((lesson) => lesson.id === lessonId)) {
      return null
    }
    const order = lessonId === previousLessonId
      ? stored.order
      : stored.order.map((cardId) => cardId.replace(`${previousLessonId}::`, `${lessonId}::`))
    return {
      lessonId,
      mode: stored.mode,
      order,
      index: stored.index!,
      elapsedMs: typeof stored.elapsedMs === 'number' ? Math.max(0, stored.elapsedMs) : 0,
      correctKeystrokes: typeof stored.correctKeystrokes === 'number' ? Math.max(0, stored.correctKeystrokes) : 0,
      mistakes: typeof stored.mistakes === 'number' ? Math.max(0, stored.mistakes) : 0,
      completedWords: typeof stored.completedWords === 'number' ? Math.max(0, stored.completedWords) : stored.index!,
      mistakeWords: stored.mistakeWords && typeof stored.mistakeWords === 'object' ? stored.mistakeWords : {},
      reviewCorrectCount: typeof stored.reviewCorrectCount === 'number' ? Math.max(0, stored.reviewCorrectCount) : 0,
      masteryMode: stored.masteryMode === 'recall' || stored.masteryMode === 'listen'
        ? stored.masteryMode
        : stored.masteryMode === null
          ? null
          : stored.mode === 'recall' || stored.mode === 'listen'
            ? stored.mode
            : null,
      usedHint: stored.usedHint === true,
      onboarding: stored.onboarding === true,
      independentCorrect: typeof stored.independentCorrect === 'number' ? Math.max(0, stored.independentCorrect) : 0,
      weakWordIds: Array.isArray(stored.weakWordIds) ? stored.weakWordIds.filter((item): item is string => typeof item === 'string') : [],
      satisfiedModes: stored.satisfiedModes && typeof stored.satisfiedModes === 'object' ? {
        ...(stored.satisfiedModes.recall === true ? { recall: true } : {}),
        ...(stored.satisfiedModes.listen === true ? { listen: true } : {}),
      } : {},
      ...((stored.followUpMode === 'recall' || stored.followUpMode === 'listen')
        && Array.isArray(stored.followUpOrder)
        && stored.followUpOrder.every((item) => typeof item === 'string')
        && stored.followUpOrder.length
        ? { followUpMode: stored.followUpMode, followUpOrder: stored.followUpOrder }
        : {}),
    }
  } catch {
    return null
  }
}

function normalize(value: string) {
  return value.toLocaleLowerCase('es-ES').normalize('NFC')
}

function getTypingTarget(value: string) {
  return normalize(value).replace(/[¿?¡!.,;:]/g, '').replace(/\s+/g, ' ').trim()
}

function sessionCardId(lessonId: string, word: Lesson['words'][number]) {
  return word.reviewKey ?? `${lessonId}::${getTypingTarget(word.spanish)}`
}

function shuffleArray<T>(items: T[]) {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]]
  }
  if (shuffled.length > 1 && shuffled.every((item, index) => item === items[index])) {
    shuffled.push(shuffled.shift()!)
  }
  return shuffled
}

function shuffleWords(words: Lesson['words']) {
  return shuffleArray(words)
}

function charactersMatch(input: string, expected: string, mode: AccentMode) {
  if (input === expected) return true
  if (mode === 'strict') return false
  return (LENIENT_ACCENTS[input] ?? input) === (LENIENT_ACCENTS[expected] ?? expected)
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const seconds = (totalSeconds % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}

function masteryModeLabel(mode: MasteryMode) {
  return mode === 'recall' ? '看义拼写' : '听音拼写'
}

function pendingMasteryMode(progress: LessonMastery): MasteryMode | null {
  return !progress.recall ? 'recall' : !progress.listen ? 'listen' : null
}

function practiceTrackForLesson(lesson: Lesson): PracticeTrack {
  return lesson.kind === '动词原形' ? 'verbs' : 'main'
}

function practiceTrackLabel(track: PracticeTrack, short = false) {
  const option = PRACTICE_TRACKS.find((item) => item.value === track)!
  return short ? option.shortLabel : option.label
}

function lessonsForTrack(track: PracticeTrack) {
  return lessons
    .filter((lesson) => practiceTrackForLesson(lesson) === track)
    .sort((left, right) => LEVEL_ORDER.indexOf(left.level) - LEVEL_ORDER.indexOf(right.level))
}

function nextIncompleteLessonAfter(lessonId: string, completedLessonIds: Iterable<string>, lessonPool = lessons) {
  const completedSet = new Set(completedLessonIds)
  const currentIndex = lessonPool.findIndex((lesson) => lesson.id === lessonId)
  const startIndex = currentIndex >= 0 ? currentIndex + 1 : 0
  const wrappedLessons = [...lessonPool.slice(startIndex), ...lessonPool.slice(0, startIndex)]
  return wrappedLessons.find((lesson) => !completedSet.has(lesson.id)) ?? null
}

function recommendedLessonInPool(lastLessonId: string, completedLessonIds: Iterable<string>, lessonPool: Lesson[]) {
  const completedSet = new Set(completedLessonIds)
  const currentLesson = lessonPool.find((lesson) => lesson.id === lastLessonId)
  if (currentLesson && !completedSet.has(currentLesson.id)) return currentLesson
  return nextIncompleteLessonAfter(currentLesson?.id ?? lessonPool[lessonPool.length - 1]?.id ?? '', completedSet, lessonPool)
    ?? lessonPool[0]
    ?? DEFAULT_LESSON
}

function recommendedLesson(lastLessonId: string, completedLessonIds: Iterable<string>) {
  const currentLesson = lessons.find((lesson) => lesson.id === lastLessonId) ?? DEFAULT_LESSON
  return recommendedLessonInPool(lastLessonId, completedLessonIds, lessonsForTrack(practiceTrackForLesson(currentLesson)))
}

function spanishVoiceScore(voice: SpeechSynthesisVoice) {
  const language = voice.lang.toLowerCase()
  const name = voice.name.toLowerCase()
  let score = language === 'es-es' ? 100 : language.startsWith('es') ? 60 : 0
  if (/(mónica|monica|jorge|paulina|natural|premium|enhanced|siri|google español)/i.test(name)) score += 35
  if (voice.localService) score += 5
  return score
}

function speechFallbackMs(text: string, rate: SpeechRate) {
  return Math.max(2200, Math.min(5200, 900 + Array.from(getTypingTarget(text)).length * 105 / rate))
}

function speak(text: string, onDone?: () => void, rate: SpeechRate = 0.8) {
  if (!('speechSynthesis' in window)) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text.replace(/[¿?¡!]/g, ''))
  utterance.lang = 'es-ES'
  const voices = window.speechSynthesis.getVoices()
  const spanishVoice = voices
    .filter((voice) => voice.lang.toLowerCase().startsWith('es'))
    .sort((left, right) => spanishVoiceScore(right) - spanishVoiceScore(left))[0]
  if (spanishVoice) utterance.voice = spanishVoice
  utterance.volume = 1
  utterance.rate = rate
  utterance.pitch = 1
  if (onDone) {
    utterance.onend = onDone
    utterance.onerror = onDone
  }
  window.speechSynthesis.resume()
  window.speechSynthesis.speak(utterance)
  return true
}

function App() {
  const analyticsConfigured = isAnalyticsConfigured()
  const [analyticsConsent, setAnalyticsConsent] = useState<AnalyticsConsent>(readAnalyticsConsent)
  const [isFreshLearner] = useState(() => !hasLearningHistory())
  const [initialSyncInvite] = useState(readInitialSyncInvite)
  const initialPracticeStateRef = useRef<PracticeState | null>(null)
  if (initialPracticeStateRef.current === null) {
    const storedPracticeState = readPracticeState()
    initialPracticeStateRef.current = { ...storedPracticeState, lastMode: readInitialMode(storedPracticeState.lastMode) }
  }
  const initialPracticeState = initialPracticeStateRef.current
  const [screen, setScreen] = useState<Screen>('home')
  const [practiceState, setPracticeState] = useState<PracticeState>(initialPracticeState)
  const [lesson, setLesson] = useState<Lesson>(() => lessons.find((item) => item.id === initialPracticeState.lastLessonId) ?? DEFAULT_LESSON)
  const [mode, setMode] = useState<Mode>(initialPracticeState.lastMode)
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [inputDraft, setInputDraft] = useState('')
  const [mistakes, setMistakes] = useState(0)
  const [status, setStatus] = useState<'idle' | 'wrong' | 'correct'>('idle')
  const [wrongAt, setWrongAt] = useState<number | null>(null)
  const [revealAnswer, setRevealAnswer] = useState(false)
  const [isTouchDevice] = useState(() => window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0)
  const [accentMode, setAccentMode] = useState<AccentMode>(readInitialAccentMode)
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('teclea-sound-enabled') !== 'false')
  const [speechRate, setSpeechRate] = useState<SpeechRate>(readSpeechRate)
  const [settingsOpen, setSettingsOpen] = useState(initialSyncInvite.fromHash)
  const [dailyGoalOpen, setDailyGoalOpen] = useState(false)
  const [mistakeLogOpen, setMistakeLogOpen] = useState(false)
  const [challenge, setChallenge] = useState<ChallengeState | null>(readChallenge)
  const [challengeLevel, setChallengeLevel] = useState<LessonLevel>(() => readChallenge()?.level ?? 'A1')
  const [challengeDays, setChallengeDays] = useState(() => readChallenge()?.durationDays ?? 30)
  const [challengeRepetitions, setChallengeRepetitions] = useState(() => readChallenge()?.dictationRepetitions ?? 2)
  const [editingChallenge, setEditingChallenge] = useState(() => !readChallenge())
  const [isOnboardingRound, setIsOnboardingRound] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const [installHint, setInstallHint] = useState('')
  const [wordEvidence, setWordEvidence] = useState<WordEvidence>(readWordEvidence)
  const [roundHistory, setRoundHistory] = useState<RoundRecord[]>(readRoundHistory)
  const [recentRoundQueues, setRecentRoundQueues] = useState<RecentRoundQueues>(readRecentRoundQueues)
  const [syncCode, setSyncCode] = useState(initialSyncInvite.code)
  const [syncInput, setSyncInput] = useState('')
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle')
  const [syncMessage, setSyncMessage] = useState(initialSyncInvite.fromHash ? '已读取同步码，正在连接…' : '')
  const [syncQr, setSyncQr] = useState('')
  const [showSyncCode, setShowSyncCode] = useState(initialSyncInvite.fromHash)
  const [syncLastAt, setSyncLastAt] = useState<number | null>(null)
  const [legacyNoticeDismissed, setLegacyNoticeDismissed] = useState(false)
  const [levelFilter, setLevelFilter] = useState<'全部' | LessonLevel>(readInitialLevelFilter)
  const [trackFilter, setTrackFilter] = useState<PracticeTrack>(readInitialTrackFilter)
  const [categoryFilter, setCategoryFilter] = useState<'全部' | LessonCategory>('全部')
  const [sceneFilter, setSceneFilter] = useState<'全部' | LessonScene>('全部')
  const [visibleLessonCount, setVisibleLessonCount] = useState(LESSON_PAGE_SIZE)
  const [inputFocused, setInputFocused] = useState(false)
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0)
  const [completedWords, setCompletedWords] = useState(0)
  const [independentCorrect, setIndependentCorrect] = useState(0)
  const [weakWordIds, setWeakWordIds] = useState<string[]>([])
  const [roundSatisfiedModes, setRoundSatisfiedModes] = useState<LessonMastery>({})
  const [mistakeWords, setMistakeWords] = useState<Record<string, number>>({})
  const [masteryProgress, setMasteryProgress] = useState<MasteryProgress>(readMasteryProgress)
  const [roundMasteryMode, setRoundMasteryMode] = useState<MasteryMode | null>(null)
  const [roundUsedHint, setRoundUsedHint] = useState(false)
  const [mistakeBank, setMistakeBank] = useState<Record<string, MistakeRecord>>(readMistakeBank)
  const [mistakeResolvedAt, setMistakeResolvedAt] = useState<Record<string, number>>(readMistakeResolvedAt)
  const [activeSession, setActiveSession] = useState<ActivePracticeSession | null>(() => {
    const session = readActiveSession()
    if (session?.lessonId === 'mistake-review' && !Object.values(mistakeBank).some(hasActiveReview)) {
      return null
    }
    return session
  })
  const [pausedMainSession, setPausedMainSession] = useState<ActivePracticeSession | null>(() => readActiveSession(PAUSED_MAIN_SESSION_KEY))
  const [reviewCorrectCount, setReviewCorrectCount] = useState(0)
  const [timerNow, setTimerNow] = useState(Date.now())
  const [finalElapsedSeconds, setFinalElapsedSeconds] = useState(0)
  const [completed, setCompleted] = useState<string[]>(readCompletedLessons)
  const inputRef = useRef<HTMLInputElement>(null)
  const practiceMainRef = useRef<HTMLElement>(null)
  const resetTimerRef = useRef<number | undefined>(undefined)
  const pressHoldTimerRef = useRef<number | undefined>(undefined)
  const pressHoldPendingRef = useRef<PressHoldPending | null>(null)
  const revealTimerRef = useRef<number | undefined>(undefined)
  const isComposingRef = useRef(false)
  const compositionCommittedValueRef = useRef<string | null>(null)
  const flowTokenRef = useRef(0)
  const currentWordHadErrorRef = useRef(false)
  const currentWordUsedHintRef = useRef(false)
  const sessionStartedAtRef = useRef<number | null>(null)
  const sessionElapsedBaseRef = useRef(0)
  const keyAudioRef = useRef<HTMLAudioElement | null>(null)
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null)
  const completeAudioRef = useRef<HTMLAudioElement | null>(null)
  const fullViewportHeightRef = useRef(window.visualViewport?.height ?? window.innerHeight)
  const settingsButtonRef = useRef<HTMLButtonElement | null>(null)
  const settingsDialogRef = useRef<HTMLElement | null>(null)
  const dailyGoalButtonRef = useRef<HTMLButtonElement | null>(null)
  const dailyGoalDialogRef = useRef<HTMLElement | null>(null)
  const mistakeLogButtonRef = useRef<HTMLButtonElement | null>(null)
  const mistakeLogDialogRef = useRef<HTMLElement | null>(null)
  const completionMainRef = useRef<HTMLElement | null>(null)
  const localUpdatedAtRef = useRef(readInitialLocalUpdatedAt())
  const syncCodeRef = useRef(syncCode)
  const latestSnapshotRef = useRef<SyncSnapshot | null>(null)
  const syncTimerRef = useRef<number | undefined>(undefined)
  const syncRunningRef = useRef(false)
  const syncPendingRef = useRef(false)
  const syncInitializedRef = useRef(false)
  const bootHandledRef = useRef(false)

  const word = lesson.words[index]
  const progress = ((index + (status === 'correct' ? 1 : 0)) / lesson.words.length) * 100
  const isLegacyDomain = window.location.hostname === LEGACY_HOST

  syncCodeRef.current = syncCode
  latestSnapshotRef.current = {
    version: 3,
    updatedAt: localUpdatedAtRef.current,
    practiceState,
    mistakeBank,
    mistakeResolvedAt,
    completed,
    masteryProgress,
    activeSession,
    pausedMainSession,
    accentMode,
    soundEnabled,
    speechRate,
  }

  useEffect(() => {
    try {
      localStorage.setItem(MISTAKE_BANK_KEY, JSON.stringify(mistakeBank))
      localStorage.setItem(MISTAKE_RESOLVED_KEY, JSON.stringify(mistakeResolvedAt))
      localStorage.setItem(MASTERY_PROGRESS_KEY, JSON.stringify(masteryProgress))
      if (!activeSession) localStorage.removeItem(ACTIVE_SESSION_KEY)
      if (!pausedMainSession) localStorage.removeItem(PAUSED_MAIN_SESSION_KEY)
    } catch {
      // Keep the in-memory migration usable when browser storage is unavailable.
    }
  }, [])

  useEffect(() => {
    void initializeAnalytics()
  }, [])

  useEffect(() => {
    const captureInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as InstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', captureInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', captureInstallPrompt)
  }, [])

  useEffect(() => {
    if (bootHandledRef.current) return
    bootHandledRef.current = true
    trackAnalytics('app_opened', {
      has_learning_history: !isFreshLearner,
      has_active_session: Boolean(activeSession),
      domain_kind: window.location.hostname === LEGACY_HOST
        ? 'legacy'
        : window.location.origin === PRIMARY_ORIGIN
          ? 'primary'
          : 'other',
    })
    if (activeSession) {
      resumePracticeSession(activeSession)
      return
    }
    if (isFreshLearner) {
      begin(DEFAULT_LESSON, 'copy', { orderedWords: DEFAULT_LESSON.words, onboarding: true })
    }
  }, [])

  useEffect(() => {
    if (screen !== 'practice') return
    window.scrollTo(0, 0)
    const focusTimer = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 120)
    return () => window.clearTimeout(focusTimer)
  }, [screen, index])

  useEffect(() => {
    if (screen !== 'complete') return
    const focusTimer = window.setTimeout(() => completionMainRef.current?.querySelector<HTMLButtonElement>('.primary-button')?.focus(), 80)
    return () => window.clearTimeout(focusTimer)
  }, [screen])

  useEffect(() => {
    if (screen !== 'practice') {
      setKeyboardOpen(false)
      return
    }
    const viewport = window.visualViewport
    if (!viewport) return
    const updateKeyboardState = () => {
      const visibleHeight = viewport.height
      if (!inputFocused) fullViewportHeightRef.current = Math.max(fullViewportHeightRef.current, visibleHeight)
      const layoutGap = Math.max(0, window.innerHeight - visibleHeight - viewport.offsetTop)
      const heightLoss = Math.max(layoutGap, fullViewportHeightRef.current - visibleHeight)
      setKeyboardOpen(inputFocused && heightLoss > 120)
      document.documentElement.style.setProperty('--visible-viewport-height', `${visibleHeight}px`)
    }
    updateKeyboardState()
    viewport.addEventListener('resize', updateKeyboardState)
    viewport.addEventListener('scroll', updateKeyboardState)
    return () => {
      viewport.removeEventListener('resize', updateKeyboardState)
      viewport.removeEventListener('scroll', updateKeyboardState)
    }
  }, [screen, inputFocused])

  useEffect(() => () => {
    window.clearTimeout(resetTimerRef.current)
    window.clearTimeout(pressHoldTimerRef.current)
    pressHoldPendingRef.current = null
    window.clearTimeout(revealTimerRef.current)
    window.clearTimeout(syncTimerRef.current)
  }, [])

  useEffect(() => () => {
    window.clearTimeout(pressHoldTimerRef.current)
    pressHoldPendingRef.current = null
  }, [screen, mode, index, lesson.id, accentMode])

  useEffect(() => {
    if (!syncCodeRef.current) return
    void syncNow(syncCodeRef.current, true)
  }, [])

  useEffect(() => {
    if (!syncCode) return
    const syncWhenActive = () => {
      if (document.visibilityState === 'visible') void syncNow(syncCodeRef.current)
    }
    window.addEventListener('focus', syncWhenActive)
    window.addEventListener('online', syncWhenActive)
    document.addEventListener('visibilitychange', syncWhenActive)
    return () => {
      window.removeEventListener('focus', syncWhenActive)
      window.removeEventListener('online', syncWhenActive)
      document.removeEventListener('visibilitychange', syncWhenActive)
    }
  }, [syncCode])

  useEffect(() => {
    if (!showSyncCode || !syncCode) {
      setSyncQr('')
      return
    }
    const baseUrl = isLegacyDomain ? `${PRIMARY_ORIGIN}/` : window.location.href
    void createSyncQr(syncCode, baseUrl).then(setSyncQr).catch(() => setSyncQr(''))
  }, [showSyncCode, syncCode, isLegacyDomain])

  useEffect(() => {
    if (!settingsOpen) return
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const focusTimer = window.setTimeout(() => {
      settingsDialogRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus()
    }, 0)
    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setSettingsOpen(false)
        return
      }
      if (event.key !== 'Tab') return
      const focusableElements = Array.from(settingsDialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [])
      if (!focusableElements.length) return
      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleDialogKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', handleDialogKeyDown)
      previouslyFocused?.focus()
    }
  }, [settingsOpen])

  useEffect(() => {
    if (!dailyGoalOpen) return
    const closeButton = dailyGoalDialogRef.current?.querySelector<HTMLElement>('button')
    const focusTimer = window.setTimeout(() => closeButton?.focus(), 0)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setDailyGoalOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', handleKeyDown)
      dailyGoalButtonRef.current?.focus()
    }
  }, [dailyGoalOpen])

  useEffect(() => {
    if (!mistakeLogOpen) return
    const closeButton = mistakeLogDialogRef.current?.querySelector<HTMLElement>('button')
    const focusTimer = window.setTimeout(() => closeButton?.focus(), 0)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setMistakeLogOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', handleKeyDown)
      mistakeLogButtonRef.current?.focus()
    }
  }, [mistakeLogOpen])

  useEffect(() => {
    if (screen !== 'practice') return
    const showOnTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      event.preventDefault()
      markMasteryHintUsed()
      setRevealAnswer(true)
    }
    const hideOnTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      event.preventDefault()
      setRevealAnswer(false)
    }
    window.addEventListener('keydown', showOnTab)
    window.addEventListener('keyup', hideOnTab)
    return () => {
      window.removeEventListener('keydown', showOnTab)
      window.removeEventListener('keyup', hideOnTab)
    }
  }, [screen, mode, roundUsedHint, activeSession])

  useEffect(() => {
    keyAudioRef.current = new Audio('/sounds/key-sound/Default.wav')
    wrongAudioRef.current = new Audio('/sounds/beep.wav')
    completeAudioRef.current = new Audio('/sounds/correct.wav')
    keyAudioRef.current.volume = .72
    wrongAudioRef.current.volume = .58
    completeAudioRef.current.volume = .72
  }, [])

  useEffect(() => {
    if (screen !== 'practice') return
    const timer = window.setInterval(() => setTimerNow(Date.now()), 250)
    return () => window.clearInterval(timer)
  }, [screen])

  useEffect(() => {
    if (screen === 'practice' && (mode === 'copy' || mode === 'listen')) speak(word.spanish, undefined, speechRate)
  }, [screen, mode, index, word.spanish, speechRate])

  useEffect(() => {
    setVisibleLessonCount(LESSON_PAGE_SIZE)
  }, [levelFilter, trackFilter, sceneFilter])

  useEffect(() => {
    if (window.location.hash !== '#courses') return
    window.setTimeout(() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }, [])

  const todayDone = practiceState.dailyWords[localDateKey()] ?? 0
  const challengeProgress = useMemo(
    () => challenge ? challengeWithExistingEvidence(challenge, wordEvidence) : null,
    [challenge, wordEvidence],
  )
  const challengeIds = useMemo(() => new Set(challenge ? challengeCardIds(challenge.level) : []), [challenge?.level])
  const challengeStats = useMemo(() => {
    if (!challengeProgress) return null
    const ids = challengeCardIds(challengeProgress.level)
    const completedRecall = ids.filter((id) => challengeProgress.recallCompleted[id]).length
    const completedDictations = ids.reduce((sum, id) => sum + Math.min(challengeProgress.dictationCounts[id] ?? 0, challengeProgress.dictationRepetitions), 0)
    const totalRequired = ids.length * (challengeProgress.dictationRepetitions + 1)
    const completedRequired = completedRecall + completedDictations
    const remainingRequired = Math.max(0, totalRequired - completedRequired)
    const remainingDays = remainingChallengeDays(localDateKey(), challengeProgress.dueOn)
    const eligibleMistakes = Object.entries(mistakeBank).filter(([id, record]) => ids.includes(id) && hasActiveReview(record)).length
    const dailyTarget = dailyChallengeTarget(remainingRequired, remainingDays, eligibleMistakes)
    return {
      cardCount: ids.length,
      totalRequired,
      completedRequired,
      remainingRequired,
      remainingDays,
      dailyTarget,
      todayCompleted: challengeProgress.dailyCompleted[localDateKey()] ?? 0,
      percentage: totalRequired ? Math.round(completedRequired / totalRequired * 100) : 0,
    }
  }, [challengeProgress, mistakeBank])
  const challengeDraftPlan = useMemo(() => {
    const ids = challengeCardIds(challengeLevel)
    const existingChallenge = challengeProgress?.level === challengeLevel ? challengeProgress : null
    const recallDone = (cardId: string) => Boolean(existingChallenge?.recallCompleted[cardId] || wordEvidence[cardId]?.recall)
    const listenDone = (cardId: string) => Math.max(
      existingChallenge?.dictationCounts[cardId] ?? 0,
      wordEvidence[cardId]?.listen ? 1 : 0,
    )
    const remainingItems = ids.filter((cardId) => !recallDone(cardId) || listenDone(cardId) < challengeRepetitions).length
    const remainingCopyItems = ids.filter((cardId) => (
      !recallDone(cardId) || listenDone(cardId) < challengeRepetitions
    ) && !hasCompletedIntroduction(wordEvidence[cardId])).length
    const remainingRecallActions = ids.filter((cardId) => !recallDone(cardId)).length
    const remainingListenActions = ids.reduce(
      (total, cardId) => total + Math.max(0, challengeRepetitions - listenDone(cardId)),
      0,
    )
    const eligibleMistakes = Object.entries(mistakeBank).filter(([cardId, record]) => ids.includes(cardId) && hasActiveReview(record)).length
    return challengeDailyPlan(ids.length, challengeDays, challengeRepetitions, roundHistory, {
      remainingItems,
      remainingCopyItems,
      remainingRecallActions,
      remainingListenActions,
      eligibleMistakes,
    })
  }, [challengeLevel, challengeDays, challengeRepetitions, roundHistory, challengeProgress, wordEvidence, mistakeBank])
  const todayChallengeRecords = challengeProgress?.dailyRecords?.[localDateKey()] ?? []
  const todayChallengeDetails = useMemo(() => {
    const details = new Map<string, {
      cardId: string
      spanish: string
      chinese: string
      recall: number
      listen: number
      lastCompletedAt: number
    }>()
    todayChallengeRecords.forEach((record) => {
      const matched = catalogWordById(record.cardId)
      const previous = details.get(record.cardId)
      const fallbackSpanish = record.cardId.split('::').at(-1) ?? '已记录词条'
      const next = previous ?? {
        cardId: record.cardId,
        spanish: matched?.word.spanish ?? fallbackSpanish,
        chinese: matched?.word.chinese ?? '词库已更新',
        recall: 0,
        listen: 0,
        lastCompletedAt: 0,
      }
      next[record.mode] += 1
      next.lastCompletedAt = Math.max(next.lastCompletedAt, record.completedAt)
      details.set(record.cardId, next)
    })
    return Array.from(details.values()).sort((left, right) => right.lastCompletedAt - left.lastCompletedAt)
  }, [todayChallengeRecords])
  const undetailedTodayChallengeCount = Math.max(0, (challengeStats?.todayCompleted ?? 0) - todayChallengeRecords.length)
  const streak = useMemo(() => learningStreak(practiceState.dailyWords), [practiceState.dailyWords])
  const trackLessons = useMemo(() => lessonsForTrack(trackFilter), [trackFilter])
  const categorySummaries = useMemo(() => LESSON_CATEGORIES.map((category) => {
    const categoryLessons = trackLessons.filter((item) => (levelFilter === '全部' || item.level === levelFilter) && lessonMatchesCategory(item, category))
    return {
      category,
      groups: categoryLessons.length,
      cards: categoryLessons.reduce((sum, item) => sum + item.words.length, 0),
    }
  }), [levelFilter, trackLessons])
  const scopedTrackCardCount = useMemo(
    () => trackLessons.filter((item) => levelFilter === '全部' || item.level === levelFilter).reduce((sum, item) => sum + item.words.length, 0),
    [levelFilter, trackLessons],
  )
  const availableScenes = useMemo(
    () => lessonScenes.filter((scene): scene is LessonScene => scene !== '全部' && trackLessons.some((item) => (levelFilter === '全部' || item.level === levelFilter) && lessonMatchesCategory(item, categoryFilter) && item.scene === scene)),
    [categoryFilter, levelFilter, trackLessons],
  )
  const filteredLessons = useMemo(
    () => trackLessons.filter((item) => (levelFilter === '全部' || item.level === levelFilter) && lessonMatchesCategory(item, categoryFilter) && (sceneFilter === '全部' || item.scene === sceneFilter)),
    [categoryFilter, levelFilter, sceneFilter, trackLessons],
  )
  const levelPaths = useMemo(() => LEVEL_ORDER.flatMap((level) => {
    if (levelFilter !== '全部' && levelFilter !== level) return []
    const pathLessons = trackLessons.filter((item) => item.level === level && lessonMatchesCategory(item, categoryFilter) && (sceneFilter === '全部' || item.scene === sceneFilter))
    if (!pathLessons.length) return []
    const pathWords = pathLessons.flatMap((item) => item.words.map((word) => ({ item, word })))
    const masteredCards = pathWords.filter(({ item, word }) => {
      const evidence = wordEvidence[sessionCardId(item.id, word)]
      return Boolean(evidence?.recall && evidence.listen)
    }).length
    const partialCards = pathWords.filter(({ item, word }) => {
      const evidence = wordEvidence[sessionCardId(item.id, word)]
      return Boolean(evidence?.recall || evidence?.listen) && !(evidence?.recall && evidence?.listen)
    }).length
    return [{
      level,
      lessons: pathLessons,
      recommendation: recommendedLessonInPool(practiceState.lastLessonId, completed, pathLessons),
      totalCards: pathLessons.reduce((sum, item) => sum + item.words.length, 0),
      masteredCards,
      completedGroups: 0,
      partialGroups: partialCards,
    }]
  }), [categoryFilter, completed, levelFilter, practiceState.lastLessonId, sceneFilter, trackLessons, wordEvidence])
  const visibleLessons = filteredLessons.slice(0, visibleLessonCount)
  const hiddenLessonCount = Math.max(0, filteredLessons.length - visibleLessons.length)
  const modeLabel = mode === 'listen' ? '听音拼写' : mode === 'recall' ? '看义拼写' : '跟打'
  const recommendedMainLesson = useMemo(
    () => recommendedLesson(practiceState.lastLessonId, completed),
    [practiceState.lastLessonId, completed],
  )
  const recommendedMainMastery = masteryProgress[recommendedMainLesson.id] ?? {}
  const recommendedPendingMode = pendingMasteryMode(recommendedMainMastery)
  const recommendedPracticeMode: Mode = (recommendedMainMastery.recall || recommendedMainMastery.listen) && recommendedPendingMode
    ? recommendedPendingMode
    : practiceState.lastMode
  const reviewToday = localDateKey()
  const mistakeEntries = useMemo(
    () => Object.entries(mistakeBank).sort(([, left], [, right]) => right.lastWrongAt - left.lastWrongAt),
    [mistakeBank],
  )
  const activeMistakeEntries = mistakeEntries.filter(([, record]) => hasActiveReview(record))
  const dueMistakeEntries = activeMistakeEntries.filter(([, record]) => isReviewDue(record, reviewToday))
  const todayMistakeEntries = activeMistakeEntries.filter(([, record]) => isTodayReview(record, reviewToday))
  const laterMistakeEntries = activeMistakeEntries.filter(([, record]) => !isReviewDue(record, reviewToday) && !isTodayReview(record, reviewToday))
  const reviewPool = dueMistakeEntries.length ? dueMistakeEntries : activeMistakeEntries
  const plannedMistakeReviewMode: MasteryMode = reviewPool.some(([, record]) => reviewAnswerMode(record) === 'recall') ? 'recall' : 'listen'
  const mistakeReviewMode: MasteryMode = activeSession?.lessonId === 'mistake-review' && activeSession.mode !== 'copy'
    ? activeSession.mode
    : plannedMistakeReviewMode
  const mistakeLesson = useMemo<Lesson | null>(() => {
    const entries = reviewPool.filter(([, record]) => activeReviewModes(record).some((weakMode) => answerCanRecover(weakMode, mistakeReviewMode)))
    if (!entries.length) return null
    const reviewingDueItems = dueMistakeEntries.length > 0
    const reviewingTodayItems = !reviewingDueItems && todayMistakeEntries.length > 0
    return {
      id: 'mistake-review',
      level: 'A1',
      scene: '基础',
      kind: '短语',
      eyebrow: `${reviewingDueItems ? '到期错题' : reviewingTodayItems ? '今日错题' : '稍后复查'} · ${mistakeReviewMode === 'recall' ? '看义拼写' : '听音拼写'}`,
      title: reviewingDueItems ? '待复习错题' : reviewingTodayItems ? '今日错题巩固' : '稍后复查词巩固',
      description: reviewingDueItems ? '跨学习日独立答对，推进恢复进度' : reviewingTodayItems ? '今天可以继续练，明日再独立复查' : '已经完成今天的确认，继续练习不会重复累计',
      color: '#b9674f',
      words: entries.map(([reviewKey, record]) => {
        const originalLesson = lessons.find((item) => item.id === record.lessonId)
        const originalWord = originalLesson?.words.find((item) => item.spanish === record.spanish)
        return originalWord
          ? { ...originalWord, reviewKey }
          : { spanish: record.spanish, chinese: record.chinese, reviewKey, source: { ...PHRASE_SOURCE } }
      }),
    }
  }, [dueMistakeEntries.length, mistakeReviewMode, reviewPool, todayMistakeEntries.length])
  const mistakeAttempts = useMemo(() => Object.values(mistakeBank).reduce((total, item) => total + item.count, 0), [mistakeBank])
  const activeReviewWasTrimmed = activeSession?.lessonId === 'mistake-review' && Boolean(mistakeLesson) && activeSession.order.length !== mistakeLesson!.words.length
  const continueLabel = activeSession
    ? `${activeSession.lessonId === 'mistake-review' ? '继续错题复习' : '继续上次练习'} · ${activeReviewWasTrimmed ? 1 : activeSession.index + 1}/${activeReviewWasTrimmed ? mistakeLesson!.words.length : activeSession.order.length}`
    : (recommendedMainMastery.recall || recommendedMainMastery.listen) && recommendedPendingMode
      ? `继续${masteryModeLabel(recommendedPendingMode)} · ${recommendedMainLesson.title}`
      : completed.includes(practiceState.lastLessonId)
      ? `下一轮 · ${recommendedMainLesson.title}`
      : `开始精准练习 · ${recommendedMainLesson.title}`

  const elapsedSeconds = screen === 'complete'
    ? finalElapsedSeconds
    : Math.floor((sessionElapsedBaseRef.current + (sessionStartedAtRef.current ? timerNow - sessionStartedAtRef.current : 0)) / 1000)
  const totalKeystrokes = correctKeystrokes + mistakes
  const accuracy = totalKeystrokes ? Math.round(correctKeystrokes / totalKeystrokes * 100) : 100
  const independentRate = completedWords && mode !== 'copy' ? Math.round(independentCorrect / completedWords * 100) : null
  const wpm = elapsedSeconds ? Math.round((correctKeystrokes / 5) / (elapsedSeconds / 60)) : 0
  const adaptiveRound = Boolean(adaptiveLevelFromLessonId(lesson.id))
  const catalogLesson = adaptiveRound ? null : lessons.find((item) => item.id === lesson.id) ?? null
  const masteryScopeWords = catalogLesson?.words ?? lesson.words
  const itemEvidence: LessonMastery = lesson.id === 'mistake-review' ? {} : {
    ...(masteryScopeWords.every((item) => wordEvidence[item.reviewKey ?? sessionCardId(lesson.id, item)]?.recall) ? { recall: true as const } : {}),
    ...(masteryScopeWords.every((item) => wordEvidence[item.reviewKey ?? sessionCardId(lesson.id, item)]?.listen) ? { listen: true as const } : {}),
  }
  const legacyMastery = lesson.id === 'mistake-review' || adaptiveRound ? {} : (masteryProgress[lesson.id] ?? {})
  const masteryBeforeRound: LessonMastery = { ...itemEvidence, ...legacyMastery, ...roundSatisfiedModes }
  const cleanMasteryRound = lesson.id !== 'mistake-review'
    && mode !== 'copy'
    && roundMasteryMode === mode
    && independentRate === 100
  const masteryAfterRound: LessonMastery = masteryBeforeRound
  const lessonMasteredAfterRound = masteryAfterRound.recall === true && masteryAfterRound.listen === true
  const missingMasteryMode = pendingMasteryMode(masteryAfterRound)
  const nextPracticeMode: MasteryMode = missingMasteryMode ?? (mode === 'listen' ? 'listen' : 'recall')
  const nextPracticeButtonLabel = cleanMasteryRound
    ? `继续${masteryModeLabel(nextPracticeMode)}`
    : mode === nextPracticeMode
      ? `再练一次${masteryModeLabel(nextPracticeMode)}`
      : `开始${masteryModeLabel(nextPracticeMode)}`
  const continuationPool = lesson.id === 'mistake-review'
    ? []
    : lessonsForTrack(practiceTrackForLesson(lesson)).filter((item) => item.level === lesson.level)
  const nextLesson = lessonMasteredAfterRound
    ? nextIncompleteLessonAfter(lesson.id, new Set([...completed, lesson.id]), continuationPool)
    : null
  const masteryModeRound = lesson.id !== 'mistake-review' && mode !== 'copy'
  const masteryRoundCanRoute = masteryModeRound && roundMasteryMode === mode
  const roundRecommendation = masteryRecommendation(independentRate, masteryRoundCanRoute)
  const weakRoundWords = masteryModeRound
    ? lesson.words.filter((item) => weakWordIds.includes(item.reviewKey ?? sessionCardId(lesson.id, item)))
    : []
  const copyWeakRoundWords = mode === 'copy' && lesson.id !== 'mistake-review'
    ? lesson.words.filter((item) => weakWordIds.includes(item.reviewKey ?? sessionCardId(lesson.id, item)))
    : []
  const recallEvidenceCount = masteryAfterRound.recall
    ? masteryScopeWords.length
    : masteryScopeWords.filter((item) => wordEvidence[item.reviewKey ?? sessionCardId(lesson.id, item)]?.recall).length
  const listenEvidenceCount = masteryAfterRound.listen
    ? masteryScopeWords.length
    : masteryScopeWords.filter((item) => wordEvidence[item.reviewKey ?? sessionCardId(lesson.id, item)]?.listen).length

  function playEffect(type: 'key' | 'wrong' | 'complete') {
    if (!soundEnabled) return
    const audio = type === 'key' ? keyAudioRef.current : type === 'wrong' ? wrongAudioRef.current : completeAudioRef.current
    if (!audio) return
    audio.currentTime = 0
    void audio.play().catch(() => undefined)
  }

  function analyticsPracticeContext(targetLesson = lesson, targetMode = mode, session = activeSession) {
    return {
      level: targetLesson.level,
      mode: targetMode,
      track: practiceTrackForLesson(targetLesson),
      onboarding: session?.onboarding === true,
      mistake_review: targetLesson.id === 'mistake-review',
      queue_size: targetLesson.words.length,
    }
  }

  function chooseAnalyticsConsent(nextConsent: Exclude<AnalyticsConsent, 'pending'>) {
    setAnalyticsConsent(nextConsent)
    void updateAnalyticsConsent(nextConsent)
  }

  function scheduleSync() {
    localUpdatedAtRef.current = Math.max(Date.now(), localUpdatedAtRef.current + 1)
    localStorage.setItem(LOCAL_UPDATED_KEY, String(localUpdatedAtRef.current))
    if (!syncCodeRef.current || !syncInitializedRef.current) return
    window.clearTimeout(syncTimerRef.current)
    syncTimerRef.current = window.setTimeout(() => void syncNow(syncCodeRef.current), 1200)
  }

  function applySyncSnapshot(snapshot: SyncSnapshot) {
    localUpdatedAtRef.current = snapshot.updatedAt
    localStorage.setItem(LOCAL_UPDATED_KEY, String(snapshot.updatedAt))
    localStorage.setItem(PRACTICE_STATE_KEY, JSON.stringify(snapshot.practiceState))
    localStorage.setItem(MISTAKE_BANK_KEY, JSON.stringify(snapshot.mistakeBank))
    localStorage.setItem(MISTAKE_RESOLVED_KEY, JSON.stringify(snapshot.mistakeResolvedAt))
    localStorage.setItem('teclea-completed', JSON.stringify(snapshot.completed))
    localStorage.setItem(MASTERY_PROGRESS_KEY, JSON.stringify(snapshot.masteryProgress))
    if (snapshot.activeSession) localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(snapshot.activeSession))
    else localStorage.removeItem(ACTIVE_SESSION_KEY)
    if (snapshot.pausedMainSession) localStorage.setItem(PAUSED_MAIN_SESSION_KEY, JSON.stringify(snapshot.pausedMainSession))
    else localStorage.removeItem(PAUSED_MAIN_SESSION_KEY)
    localStorage.setItem('teclea-accent-mode', snapshot.accentMode)
    localStorage.setItem('teclea-sound-enabled', String(snapshot.soundEnabled))
    localStorage.setItem(SPEECH_RATE_KEY, String(snapshot.speechRate))

    const nextPracticeState = readPracticeState()
    const nextMistakeBank = readMistakeBank()
    const nextCompleted = readCompletedLessons()
    const nextMasteryProgress = readMasteryProgress()
    const storedActiveSession = readActiveSession()
    const nextActiveSession = storedActiveSession?.lessonId === 'mistake-review' && !Object.values(nextMistakeBank).some(hasActiveReview) ? null : storedActiveSession
    const nextPausedMainSession = readActiveSession(PAUSED_MAIN_SESSION_KEY)
    if (!nextActiveSession) localStorage.removeItem(ACTIVE_SESSION_KEY)

    setPracticeState(nextPracticeState)
    setMistakeBank(nextMistakeBank)
    setMistakeResolvedAt(snapshot.mistakeResolvedAt)
    setCompleted(nextCompleted)
    setMasteryProgress(nextMasteryProgress)
    setActiveSession(nextActiveSession)
    setPausedMainSession(nextPausedMainSession)
    setAccentMode(snapshot.accentMode)
    setSoundEnabled(snapshot.soundEnabled)
    setSpeechRate(snapshot.speechRate)
    if (screen === 'home') {
      setLesson(lessons.find((item) => item.id === nextPracticeState.lastLessonId) ?? DEFAULT_LESSON)
      setMode(nextActiveSession?.mode ?? nextPracticeState.lastMode)
    }
  }

  async function syncNow(code = syncCodeRef.current, initial = false): Promise<boolean> {
    const normalized = normalizeSyncCode(code)
    if (normalized.length !== 20 || !latestSnapshotRef.current) return false
    if (syncRunningRef.current) {
      syncPendingRef.current = true
      return false
    }
    syncRunningRef.current = true
    setSyncStatus('syncing')
    setSyncMessage(initial ? '正在连接并合并两台设备的学习记录…' : '正在同步学习记录…')
    try {
      const local = { ...latestSnapshotRef.current, updatedAt: localUpdatedAtRef.current }
      const remote = await pullSync(normalized)
      const merged = remote ? mergeSyncSnapshots(local, remote) : local
      applySyncSnapshot(merged)
      await pushSync(normalized, merged)
      setSyncCode(normalized)
      syncCodeRef.current = normalized
      localStorage.setItem(SYNC_CODE_KEY, normalized)
      setSyncLastAt(Date.now())
      setSyncStatus('synced')
      setSyncMessage(remote ? '手机与电脑的学习进度已合并。' : '同步空间已创建，可以连接另一台设备了。')
      return true
    } catch (error) {
      setSyncStatus('error')
      setSyncMessage(error instanceof Error ? error.message : '同步失败，请稍后再试')
      return false
    } finally {
      syncRunningRef.current = false
      syncInitializedRef.current = true
      if (syncPendingRef.current && syncCodeRef.current) {
        syncPendingRef.current = false
        window.clearTimeout(syncTimerRef.current)
        syncTimerRef.current = window.setTimeout(() => void syncNow(syncCodeRef.current), 100)
      }
    }
  }

  async function migrateLegacyProgress() {
    if (!isLegacyDomain || syncRunningRef.current) return
    let code = normalizeSyncCode(syncCodeRef.current)
    if (code.length !== 20) {
      code = generateSyncCode()
      localUpdatedAtRef.current = Math.max(Date.now(), localUpdatedAtRef.current + 1)
      localStorage.setItem(LOCAL_UPDATED_KEY, String(localUpdatedAtRef.current))
      if (latestSnapshotRef.current) latestSnapshotRef.current = { ...latestSnapshotRef.current, updatedAt: localUpdatedAtRef.current }
      setSyncCode(code)
      syncCodeRef.current = code
      localStorage.setItem(SYNC_CODE_KEY, code)
    }
    const migrated = await syncNow(code, true)
    if (migrated) window.location.assign(createSyncLink(code, `${PRIMARY_ORIGIN}/`))
  }

  function createSyncSpace() {
    const code = generateSyncCode()
    localUpdatedAtRef.current = Math.max(Date.now(), localUpdatedAtRef.current + 1)
    localStorage.setItem(LOCAL_UPDATED_KEY, String(localUpdatedAtRef.current))
    if (latestSnapshotRef.current) latestSnapshotRef.current = { ...latestSnapshotRef.current, updatedAt: localUpdatedAtRef.current }
    setSyncCode(code)
    syncCodeRef.current = code
    localStorage.setItem(SYNC_CODE_KEY, code)
    setShowSyncCode(true)
    void syncNow(code, true).then((synced) => {
      if (synced) trackAnalytics('sync_enabled', { method: 'created' })
    })
  }

  function connectSyncSpace() {
    const code = normalizeSyncCode(syncInput)
    if (code.length !== 20) {
      setSyncStatus('error')
      setSyncMessage('请输入完整的 20 位同步码。')
      return
    }
    setSyncCode(code)
    syncCodeRef.current = code
    localStorage.setItem(SYNC_CODE_KEY, code)
    setSyncInput('')
    setShowSyncCode(false)
    void syncNow(code, true).then((synced) => {
      if (synced) trackAnalytics('sync_enabled', { method: 'connected' })
    })
  }

  function stopSync() {
    window.clearTimeout(syncTimerRef.current)
    localStorage.removeItem(SYNC_CODE_KEY)
    syncCodeRef.current = ''
    syncPendingRef.current = false
    syncInitializedRef.current = false
    setSyncCode('')
    setSyncStatus('idle')
    setSyncMessage('已停止本机同步；本机和云端原有学习记录均保留。')
    setShowSyncCode(false)
  }

  async function removeCloudSync() {
    if (!syncCode || !window.confirm('确定删除云端同步数据吗？本机进度会保留。其他仍连接的设备如果再次同步，可能重新创建云端数据。')) return
    syncRunningRef.current = true
    setSyncStatus('syncing')
    setSyncMessage('正在删除云端同步数据…')
    try {
      await deleteSync(syncCode)
      window.clearTimeout(syncTimerRef.current)
      localStorage.removeItem(SYNC_CODE_KEY)
      syncCodeRef.current = ''
      syncPendingRef.current = false
      syncInitializedRef.current = false
      setSyncCode('')
      setShowSyncCode(false)
      setSyncStatus('idle')
      setSyncMessage('云端同步数据已删除，本机进度仍然保留。')
    } catch (error) {
      setSyncStatus('error')
      setSyncMessage(error instanceof Error ? error.message : '删除云端数据失败')
    } finally {
      syncRunningRef.current = false
    }
  }

  async function copySyncCode() {
    if (!syncCode) return
    try {
      await navigator.clipboard.writeText(formatSyncCode(syncCode))
      setSyncMessage('同步码已复制。')
    } catch {
      setSyncMessage('无法自动复制，请长按同步码复制。')
    }
  }

  async function shareSyncLink() {
    if (!syncCode) return
    const url = createSyncLink(syncCode, isLegacyDomain ? `${PRIMARY_ORIGIN}/` : window.location.href)
    const canShare = typeof navigator.share === 'function'
    try {
      if (canShare) await navigator.share({ title: 'HolaDone 跨设备同步', text: '在另一台设备打开这个私密链接以同步学习进度。', url })
      else await navigator.clipboard.writeText(url)
      setSyncMessage(canShare ? '已完成系统分享，请只发送给自己的设备。' : '私密同步链接已复制。')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setSyncMessage('无法分享，请改用二维码或复制同步码。')
    }
  }

  function savePracticeState(update: (current: PracticeState) => PracticeState) {
    scheduleSync()
    setPracticeState((current) => {
      const nextState = update(current)
      localStorage.setItem(PRACTICE_STATE_KEY, JSON.stringify(nextState))
      return nextState
    })
  }

  function saveMistakeBank(update: (current: Record<string, MistakeRecord>) => Record<string, MistakeRecord>) {
    scheduleSync()
    setMistakeBank((current) => {
      const nextBank = update(current)
      localStorage.setItem(MISTAKE_BANK_KEY, JSON.stringify(nextBank))
      return nextBank
    })
  }

  function saveMasteryProgress(nextProgress: MasteryProgress) {
    scheduleSync()
    setMasteryProgress(nextProgress)
    localStorage.setItem(MASTERY_PROGRESS_KEY, JSON.stringify(nextProgress))
  }

  function persistActiveSession(nextSession: ActivePracticeSession | null) {
    scheduleSync()
    setActiveSession(nextSession)
    if (nextSession) localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(nextSession))
    else localStorage.removeItem(ACTIVE_SESSION_KEY)
  }

  function persistPausedMainSession(nextSession: ActivePracticeSession | null) {
    scheduleSync()
    setPausedMainSession(nextSession)
    if (nextSession) localStorage.setItem(PAUSED_MAIN_SESSION_KEY, JSON.stringify(nextSession))
    else localStorage.removeItem(PAUSED_MAIN_SESSION_KEY)
  }

  function saveMistakeResolvedAt(update: (current: Record<string, number>) => Record<string, number>) {
    scheduleSync()
    setMistakeResolvedAt((current) => {
      const nextResolvedAt = update(current)
      localStorage.setItem(MISTAKE_RESOLVED_KEY, JSON.stringify(nextResolvedAt))
      return nextResolvedAt
    })
  }

  function currentElapsedMs() {
    return sessionElapsedBaseRef.current + (sessionStartedAtRef.current ? Date.now() - sessionStartedAtRef.current : 0)
  }

  function recordMistake() {
    const reviewKey = word.reviewKey ?? `${lesson.id}::${getTypingTarget(word.spanish)}`
    const now = Date.now()
    const originalLessonId = catalogWordById(reviewKey)?.lesson.id ?? lesson.id
    saveMistakeResolvedAt((current) => {
      if (!(reviewKey in current)) return current
      const nextResolvedAt = { ...current }
      delete nextResolvedAt[reviewKey]
      return nextResolvedAt
    })
    saveMistakeBank((current) => ({
      ...current,
      [reviewKey]: recordWrongAttempt(current[reviewKey], {
        lessonId: originalLessonId,
        spanish: word.spanish,
        chinese: word.chinese,
      }, mode, now, localDateKey(new Date(now))),
    }))
  }

  function recordMistakeRecovery(independentAnswer: boolean) {
    if (!independentAnswer) return false
    const reviewKey = currentPracticeCardId()
    const current = mistakeBank[reviewKey]
    if (!current) return false
    const wasActive = hasActiveReview(current)
    const now = Date.now()
    const result = recordIndependentCorrect(current, mode, now, localDateKey(new Date(now)))
    saveMistakeBank((bank) => ({ ...bank, [reviewKey]: result.record }))
    if (wasActive && result.resolved) {
      saveMistakeResolvedAt((resolved) => ({ ...resolved, [reviewKey]: now }))
    }
    return result.progressed
  }

  function recordCompletedWord() {
    const today = localDateKey()
    savePracticeState((current) => ({
      ...current,
      dailyWords: { ...current.dailyWords, [today]: (current.dailyWords[today] ?? 0) + 1 },
    }))
  }

  function saveChallenge(nextChallenge: ChallengeState | null) {
    setChallenge(nextChallenge)
    if (nextChallenge) localStorage.setItem(CHALLENGE_KEY, JSON.stringify(nextChallenge))
    else localStorage.removeItem(CHALLENGE_KEY)
  }

  function saveWordEvidence(nextEvidence: WordEvidence) {
    setWordEvidence(nextEvidence)
    localStorage.setItem(WORD_EVIDENCE_KEY, JSON.stringify(nextEvidence))
  }

  function currentPracticeCardId() {
    return word.reviewKey ?? sessionCardId(lesson.id, word)
  }

  function markCurrentWordWeak() {
    const cardId = currentPracticeCardId()
    setWeakWordIds((current) => current.includes(cardId) ? current : [...current, cardId])
  }

  function recordWordEvidence(independentAnswer: boolean) {
    const cardId = word.reviewKey ?? sessionCardId(lesson.id, word)
    const previous = wordEvidence[cardId] ?? {}
    if (mode === 'copy') {
      if (hasCompletedIntroduction(previous)) return wordEvidence
      const nextEvidence: WordEvidence = {
        ...wordEvidence,
        [cardId]: { ...previous, copyCompletedAt: Date.now() },
      }
      saveWordEvidence(nextEvidence)
      return nextEvidence
    }
    if (!independentAnswer) return wordEvidence
    const nextEvidence: WordEvidence = {
      ...wordEvidence,
      [cardId]: { ...previous, [mode]: true, lastCorrectAt: Date.now() },
    }
    saveWordEvidence(nextEvidence)
    return nextEvidence
  }

  function recordAdaptiveRound(elapsedMs: number) {
    if (!adaptiveLevelFromLessonId(lesson.id)) return
    const nextHistory = [...roundHistory, { mode, items: lesson.words.length, elapsedMs, completedAt: Date.now() }].slice(-40)
    setRoundHistory(nextHistory)
    localStorage.setItem(ROUND_HISTORY_KEY, JSON.stringify(nextHistory))
  }

  function balancedLengthOrder<T extends { word: Lesson['words'][number] }>(items: T[]) {
    if (items.length < 3) return shuffleArray(items)
    const lengthMedian = medianItemLength(items.map((item) => Array.from(getTypingTarget(item.word.spanish)).length))
    const shorter = shuffleArray(items.filter((item) => Array.from(getTypingTarget(item.word.spanish)).length <= lengthMedian))
    const longer = shuffleArray(items.filter((item) => Array.from(getTypingTarget(item.word.spanish)).length > lengthMedian))
    const mixed: T[] = []
    while (shorter.length || longer.length) {
      if (shorter.length) mixed.push(shorter.shift()!)
      if (longer.length) mixed.push(longer.shift()!)
    }
    return mixed
  }

  function beginAdaptiveRound(nextLevel: LessonLevel, nextTrack: PracticeTrack, nextMode: Mode, category: '全部' | LessonCategory = '全部', scene: '全部' | LessonScene = '全部') {
    const seenTargets = new Set<string>()
    const candidates = lessons
      .filter((item) => item.level === nextLevel
        && practiceTrackForLesson(item) === nextTrack
        && lessonMatchesCategory(item, category)
        && (scene === '全部' || item.scene === scene))
      .flatMap((item) => item.words.flatMap((word) => {
        const target = getTypingTarget(word.spanish)
        if (seenTargets.has(target)) return []
        seenTargets.add(target)
        return [{ lesson: item, word: { ...word, reviewKey: sessionCardId(item.id, word) } }]
      }))
    if (!candidates.length) return
    const queueKey = adaptiveRoundQueueKey(nextLevel, nextTrack, category, scene)
    const recentHistory = recentRoundQueues[queueKey] ?? []
    const recentSets = recentHistory.map((queue) => new Set(queue))
    const priorityOrder = (pool: typeof candidates) => {
      const isWeak = (item: (typeof candidates)[number]) => Boolean(mistakeBank[item.word.reviewKey!] && hasActiveReview(mistakeBank[item.word.reviewKey!]))
      const weakOrdered = weightedReviewOrder(pool.filter(isWeak), (item) => mistakeSamplingWeight(mistakeBank[item.word.reviewKey!], reviewToday))
      const unmasteredOrdered = balancedLengthOrder(pool.filter((item) => !isWeak(item) && !(wordEvidence[item.word.reviewKey!]?.recall && wordEvidence[item.word.reviewKey!]?.listen)))
      const stableOrdered = balancedLengthOrder(pool.filter((item) => !isWeak(item) && wordEvidence[item.word.reviewKey!]?.recall && wordEvidence[item.word.reviewKey!]?.listen))
      const guaranteedMix = weakOrdered.length && unmasteredOrdered.length ? [weakOrdered.shift()!, unmasteredOrdered.shift()!] : []
      return [...guaranteedMix, ...weakOrdered, ...unmasteredOrdered, ...stableOrdered]
    }
    const { fresh: freshCandidates, earlier: earlierCandidates, immediate: immediateCandidates } = bucketByRecentQueues(candidates, recentSets, (item) => item.word.reviewKey!)
    const roundSize = adaptiveRoundSize(nextMode, roundHistory)
    const ordered = [...priorityOrder(freshCandidates), ...priorityOrder(earlierCandidates), ...priorityOrder(immediateCandidates)]
    const roundWords = ordered.slice(0, roundSize).map((item) => item.word)
    const currentQueue = roundWords.map((item) => item.reviewKey ?? sessionCardId(`adaptive-${nextLevel}-${nextTrack}`, item))
    const nextRecentQueues = { ...recentRoundQueues, [queueKey]: [currentQueue, ...recentHistory].slice(0, 2) }
    setRecentRoundQueues(nextRecentQueues)
    localStorage.setItem(RECENT_ROUND_QUEUES_KEY, JSON.stringify(nextRecentQueues))
    const adaptiveLesson: Lesson = {
      id: `adaptive-${nextLevel}-${nextTrack}`,
      level: nextLevel,
      scene: scene === '全部' ? '基础' : scene,
      kind: nextTrack === 'verbs' ? '动词原形' : '单词',
      eyebrow: `${nextLevel} · ${practiceTrackLabel(nextTrack, true)} · 本轮`,
      title: `${nextLevel} 本轮练习`,
      description: '优先弱词与未掌握内容，再补充新词',
      color: '#347665',
      words: roundWords,
    }
    begin(adaptiveLesson, nextMode, { orderedWords: roundWords })
  }

  function recordChallengeSuccess(independentAnswer: boolean) {
    if (!challenge || (mode !== 'recall' && mode !== 'listen') || !independentAnswer) return
    const cardId = word.reviewKey ?? sessionCardId(lesson.id, word)
    if (!challengeIds.has(cardId)) return
    let earnedUnit = false
    const challengeWithEvidence = challengeWithExistingEvidence(challenge, wordEvidence)
    const nextChallenge: ChallengeState = {
      ...challengeWithEvidence,
      recallCompleted: { ...challengeWithEvidence.recallCompleted },
      dictationCounts: { ...challengeWithEvidence.dictationCounts },
      dailyCompleted: { ...challengeWithEvidence.dailyCompleted },
      dailyRecords: { ...challengeWithEvidence.dailyRecords },
    }
    if (mode === 'recall' && !nextChallenge.recallCompleted[cardId]) {
      nextChallenge.recallCompleted[cardId] = true
      earnedUnit = true
    }
    if (mode === 'listen' && (nextChallenge.dictationCounts[cardId] ?? 0) < nextChallenge.dictationRepetitions) {
      nextChallenge.dictationCounts[cardId] = (nextChallenge.dictationCounts[cardId] ?? 0) + 1
      earnedUnit = true
    }
    if (!earnedUnit) return
    const today = localDateKey()
    nextChallenge.dailyCompleted[today] = (nextChallenge.dailyCompleted[today] ?? 0) + 1
    nextChallenge.dailyRecords[today] = [
      ...(nextChallenge.dailyRecords[today] ?? []),
      { cardId, mode, completedAt: Date.now() },
    ]
    saveChallenge(nextChallenge)
  }

  function createOrUpdateChallenge() {
    const today = localDateKey()
    const keepProgress = challenge?.level === challengeLevel
    const challengeDraft: ChallengeState = {
      level: challengeLevel,
      durationDays: challengeDays,
      dictationRepetitions: challengeRepetitions,
      startedOn: keepProgress ? challenge.startedOn : today,
      dueOn: addLocalDays(today, challengeDays - 1),
      recallCompleted: keepProgress ? challenge.recallCompleted : {},
      dictationCounts: keepProgress ? challenge.dictationCounts : {},
      dailyCompleted: keepProgress ? challenge.dailyCompleted : {},
      dailyRecords: keepProgress ? (challenge.dailyRecords ?? {}) : {},
    }
    const nextChallenge = challengeWithExistingEvidence(challengeDraft, wordEvidence)
    saveChallenge(nextChallenge)
    trackAnalytics('challenge_saved', {
      level: challengeLevel,
      duration_days: challengeDays,
      dictation_repetitions: challengeRepetitions,
      is_update: Boolean(challenge),
    })
    setEditingChallenge(false)
  }

  function startOrContinueChallenge() {
    if (!challengeProgress) return
    setDailyGoalOpen(false)
    const targetLevel = challengeProgress.level

    if (activeSession
      && activeSession.lessonId !== 'mistake-review'
      && activeSession.mode !== 'copy'
      && practiceSessionLevel(activeSession) === targetLevel
      && resumePracticeSession(activeSession)) return

    const exactQueueKey = adaptiveRoundQueueKey(targetLevel, trackFilter, categoryFilter, sceneFilter)
    const matchingQueueKeys = Object.keys(recentRoundQueues)
      .filter((key) => key.startsWith(`${targetLevel}:`) && key !== exactQueueKey)
      .reverse()
    for (const queueKey of [exactQueueKey, ...matchingQueueKeys]) {
      const latestQueue = recentRoundQueues[queueKey]?.[0] ?? []
      const queueIds = latestQueue.filter((cardId) => challengeIds.has(cardId))
      if (!queueIds.length) continue
      const recallPending = queueIds.filter((cardId) => !challengeProgress.recallCompleted[cardId])
      const listenPending = queueIds.filter((cardId) => (challengeProgress.dictationCounts[cardId] ?? 0) < challengeProgress.dictationRepetitions)
      const targetMode: MasteryMode | null = recallPending.length ? 'recall' : listenPending.length ? 'listen' : null
      const targetOrder = targetMode === 'recall' ? recallPending : listenPending
      if (!targetMode || !targetOrder.length) continue
      const queueTrack: PracticeTrack = queueKey.split(':')[1] === 'verbs' ? 'verbs' : 'main'
      const roundLesson = adaptiveLessonFromOrder(`adaptive-${targetLevel}-${queueTrack}`, targetOrder)
      if (!roundLesson) continue
      setLevelFilter(targetLevel)
      setTrackFilter(queueTrack)
      setCategoryFilter('全部')
      setSceneFilter('全部')
      begin(roundLesson, targetMode, { orderedWords: roundLesson.words })
      return
    }

    const allIds = challengeCardIds(targetLevel)
    const recallPending = allIds.filter((cardId) => !challengeProgress.recallCompleted[cardId])
    const listenPending = allIds.filter((cardId) => (challengeProgress.dictationCounts[cardId] ?? 0) < challengeProgress.dictationRepetitions)
    const targetMode: MasteryMode = recallPending.length ? 'recall' : 'listen'
    const pendingIds = recallPending.length ? recallPending : listenPending
    if (!pendingIds.length) return
    const currentTrackPending = pendingIds.filter((cardId) => {
      const matched = catalogWordById(cardId)
      return matched && practiceTrackForLesson(matched.lesson) === trackFilter
    })
    const firstPending = catalogWordById((currentTrackPending[0] ?? pendingIds[0])!)
    const targetTrack = firstPending ? practiceTrackForLesson(firstPending.lesson) : 'main'
    setLevelFilter(targetLevel)
    setTrackFilter(targetTrack)
    setCategoryFilter('全部')
    setSceneFilter('全部')
    beginAdaptiveRound(targetLevel, targetTrack, targetMode)
  }

  function openChallengeCreator() {
    setScreen('home')
    setEditingChallenge(!challenge)
    setDailyGoalOpen(true)
  }

  function continueOnboardingRound() {
    if (activeSession && resumeActivePractice()) return
    // Backward compatibility for an unfinished three-word onboarding session
    // saved by versions before the tutorial became part of the full first round.
    const remainingWords = DEFAULT_LESSON.words.slice(3)
    if (remainingWords.length) {
      begin(DEFAULT_LESSON, 'copy', { orderedWords: remainingWords })
      return
    }
    begin(DEFAULT_LESSON, 'copy')
  }

  function chooseLevelAfterOnboarding() {
    setLevelFilter('全部')
    setTrackFilter('main')
    setCategoryFilter('全部')
    setSceneFilter('全部')
    setScreen('home')
    window.setTimeout(() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }

  function advanceAdaptiveStage() {
    if (missingMasteryMode) {
      const catalogRound = lessons.find((item) => item.id === lesson.id)
      const queueKey = adaptiveRoundQueueKey(lesson.level, practiceTrackForLesson(lesson), categoryFilter, sceneFilter)
      const adaptiveRoundLesson = adaptiveLessonFromOrder(lesson.id, recentRoundQueues[queueKey]?.[0] ?? [])
      const fullRound = catalogRound ?? adaptiveRoundLesson ?? lesson
      begin(fullRound, missingMasteryMode, { orderedWords: shuffleWords(fullRound.words), satisfiedModes: masteryAfterRound })
      return
    }
    beginAdaptiveRound(lesson.level, practiceTrackForLesson(lesson), 'recall', categoryFilter, sceneFilter)
  }

  function repeatAdaptiveMode() {
    begin(lesson, mode, { orderedWords: shuffleWords(lesson.words), satisfiedModes: masteryAfterRound })
  }

  function reinforceAdaptiveWeakWords() {
    if (!weakRoundWords.length) {
      repeatAdaptiveMode()
      return
    }
    begin({ ...lesson, words: weakRoundWords }, mode, { orderedWords: shuffleWords(weakRoundWords), satisfiedModes: masteryAfterRound })
  }

  function reinforceCopyWeakWords() {
    if (!copyWeakRoundWords.length) return
    begin({ ...lesson, words: copyWeakRoundWords }, 'copy', {
      orderedWords: shuffleWords(copyWeakRoundWords),
      satisfiedModes: masteryAfterRound,
      skipIntroduction: true,
    })
  }

  async function promptInstall() {
    if (installPrompt) {
      await installPrompt.prompt()
      const choice = await installPrompt.userChoice
      trackAnalytics('install_result', { outcome: choice.outcome })
      if (choice.outcome === 'accepted') setInstallHint('已添加，以后可以从主屏幕直接打开。')
      setInstallPrompt(null)
      return
    }
    trackAnalytics('install_result', { outcome: 'manual_instructions' })
    setInstallHint('在浏览器的“分享”菜单中选择“添加到主屏幕”。')
  }

  function markMasteryHintUsed() {
    if (mode === 'copy') return
    const cardId = currentPracticeCardId()
    const nextWeakWordIds = weakWordIds.includes(cardId) ? weakWordIds : [...weakWordIds, cardId]
    currentWordUsedHintRef.current = true
    setWeakWordIds(nextWeakWordIds)
    if (!roundUsedHint) setRoundUsedHint(true)
    if (activeSession) persistActiveSession({
      ...activeSession,
      usedHint: true,
      independentCorrect,
      weakWordIds: nextWeakWordIds,
    })
  }

  function chooseLevelFilter(nextLevel: '全部' | LessonLevel) {
    setLevelFilter(nextLevel)
    if (categoryFilter !== '全部' && !lessons.some((item) => (nextLevel === '全部' || item.level === nextLevel) && practiceTrackForLesson(item) === trackFilter && lessonMatchesCategory(item, categoryFilter))) {
      setCategoryFilter('全部')
      setSceneFilter('全部')
      return
    }
    if (nextLevel !== '全部' && sceneFilter !== '全部' && !lessons.some((item) => item.level === nextLevel && practiceTrackForLesson(item) === trackFilter && item.scene === sceneFilter)) {
      setSceneFilter('全部')
    }
  }

  function resetFilters() {
    setTrackFilter('main')
    setLevelFilter('全部')
    setCategoryFilter('全部')
    setSceneFilter('全部')
  }

  function chooseTrackFilter(nextTrack: PracticeTrack) {
    setTrackFilter(nextTrack)
    if (nextTrack === 'verbs') {
      setCategoryFilter('全部')
      setSceneFilter('全部')
      return
    }
    if (categoryFilter !== '全部' && !lessons.some((item) => practiceTrackForLesson(item) === nextTrack && (levelFilter === '全部' || item.level === levelFilter) && lessonMatchesCategory(item, categoryFilter))) {
      setCategoryFilter('全部')
      setSceneFilter('全部')
      return
    }
    if (sceneFilter !== '全部' && !lessons.some((item) => practiceTrackForLesson(item) === nextTrack && (levelFilter === '全部' || item.level === levelFilter) && item.scene === sceneFilter)) {
      setSceneFilter('全部')
    }
  }

  function chooseCategoryFilter(nextCategory: '全部' | LessonCategory) {
    setCategoryFilter(nextCategory)
    setSceneFilter('全部')
  }

  function chooseSceneFilter(nextScene: '全部' | LessonScene) {
    setSceneFilter(nextScene)
    if (nextScene !== '全部') setCategoryFilter(categoryForScene(nextScene))
  }

  function openPractice(nextLesson: Lesson, session: ActivePracticeSession, startKind: 'new' | 'resume') {
    flowTokenRef.current += 1
    window.clearTimeout(resetTimerRef.current)
    window.speechSynthesis?.cancel()
    isComposingRef.current = false
    compositionCommittedValueRef.current = null
    currentWordUsedHintRef.current = false
    setLesson(nextLesson)
    setMode(session.mode)
    savePracticeState((current) => ({
      ...current,
      lastLessonId: lessons.some((item) => item.id === nextLesson.id) ? nextLesson.id : current.lastLessonId,
      lastMode: session.mode,
    }))
    persistActiveSession(session)
    setIndex(session.index)
    setTyped('')
    setInputDraft('')
    setMistakes(session.mistakes)
    setCorrectKeystrokes(session.correctKeystrokes)
    setCompletedWords(session.completedWords)
    setIndependentCorrect(session.independentCorrect ?? 0)
    setWeakWordIds(session.weakWordIds ?? [])
    setRoundSatisfiedModes(session.satisfiedModes ?? {})
    setMistakeWords(session.mistakeWords)
    setReviewCorrectCount(session.reviewCorrectCount)
    setRoundMasteryMode(session.masteryMode)
    setRoundUsedHint(session.usedHint)
    setIsOnboardingRound(session.onboarding === true)
    currentWordHadErrorRef.current = false
    currentWordUsedHintRef.current = false
    setFinalElapsedSeconds(0)
    sessionElapsedBaseRef.current = session.elapsedMs
    sessionStartedAtRef.current = null
    setTimerNow(Date.now())
    setStatus('idle')
    setWrongAt(null)
    setRevealAnswer(false)
    setInputFocused(false)
    trackAnalytics('practice_started', {
      ...analyticsPracticeContext(nextLesson, session.mode, session),
      start_kind: startKind,
      introduction: Boolean(session.followUpMode && session.followUpOrder?.length),
      progress_index: session.index,
    })
    setScreen('practice')
  }

  function begin(nextLesson: Lesson, nextMode: Mode = mode, options: {
    orderedWords?: Lesson['words']
    onboarding?: boolean
    satisfiedModes?: LessonMastery
    skipIntroduction?: boolean
    followUpMode?: MasteryMode
    followUpOrder?: string[]
  } = {}) {
    if (nextLesson.id === 'mistake-review' && activeSession?.lessonId !== 'mistake-review') {
      if (activeSession) persistPausedMainSession(activeSession)
    } else if (nextLesson.id !== 'mistake-review') {
      persistPausedMainSession(null)
    }
    const fullOrderedWords = options.orderedWords ?? shuffleWords(nextLesson.words)
    const introductionWords = nextMode !== 'copy' && nextLesson.id !== 'mistake-review' && !options.skipIntroduction
      ? itemsNeedingIntroduction(fullOrderedWords, (item) => wordEvidence[item.reviewKey ?? sessionCardId(nextLesson.id, item)])
      : []
    const requiresIntroduction = introductionWords.length > 0
    const orderedWords = requiresIntroduction ? introductionWords : fullOrderedWords
    const sessionMode: Mode = requiresIntroduction ? 'copy' : nextMode
    const session: ActivePracticeSession = {
      lessonId: nextLesson.id,
      mode: sessionMode,
      order: orderedWords.map((word) => sessionCardId(nextLesson.id, word)),
      index: 0,
      elapsedMs: 0,
      correctKeystrokes: 0,
      mistakes: 0,
      completedWords: 0,
      mistakeWords: {},
      reviewCorrectCount: 0,
      masteryMode: sessionMode === 'recall' || sessionMode === 'listen' ? sessionMode : null,
      usedHint: false,
      onboarding: options.onboarding === true,
      independentCorrect: 0,
      weakWordIds: [],
      satisfiedModes: options.satisfiedModes ?? {},
      ...(requiresIntroduction ? {
        followUpMode: nextMode as MasteryMode,
        followUpOrder: fullOrderedWords.map((word) => sessionCardId(nextLesson.id, word)),
      } : options.followUpMode && options.followUpOrder?.length ? {
        followUpMode: options.followUpMode,
        followUpOrder: options.followUpOrder,
      } : {}),
    }
    openPractice({
      ...nextLesson,
      ...(requiresIntroduction ? { eyebrow: `${nextLesson.level} · 新词预热`, description: '先跟打本轮首次出现的内容' } : {}),
      words: orderedWords,
    }, session, 'new')
  }

  function resumePracticeSession(session: ActivePracticeSession | null) {
    if (!session) return false
    const baseLesson = session.lessonId === 'mistake-review'
      ? mistakeLesson
      : adaptiveLessonFromOrder(session.lessonId, session.order) ?? lessons.find((item) => item.id === session.lessonId) ?? null
    if (!baseLesson) {
      if (session === activeSession) persistActiveSession(null)
      return false
    }

    const availableWords = new Map(baseLesson.words.map((word) => [sessionCardId(baseLesson.id, word), word]))
    const validPriorCount = session.order.slice(0, session.index).filter((cardId) => availableWords.has(cardId)).length
    const orderedWords = session.order.flatMap((cardId) => {
      const matchedWord = availableWords.get(cardId)
      return matchedWord ? [matchedWord] : []
    })
    if (!orderedWords.length || validPriorCount >= orderedWords.length) {
      persistActiveSession(null)
      return false
    }

    const reviewWasTrimmed = baseLesson.id === 'mistake-review' && orderedWords.length !== session.order.length
    const restoredSession: ActivePracticeSession = reviewWasTrimmed
      ? {
          ...session,
          order: orderedWords.map((word) => sessionCardId(baseLesson.id, word)),
          index: 0,
          elapsedMs: 0,
          correctKeystrokes: 0,
          mistakes: 0,
          completedWords: 0,
          independentCorrect: 0,
          weakWordIds: [],
          satisfiedModes: {},
          mistakeWords: {},
          reviewCorrectCount: 0,
          masteryMode: session.mode === 'recall' || session.mode === 'listen' ? session.mode : null,
          usedHint: false,
        }
      : { ...session, index: validPriorCount }
    openPractice({ ...baseLesson, words: orderedWords }, restoredSession, 'resume')
    return true
  }

  function resumeActivePractice() {
    return resumePracticeSession(activeSession)
  }

  function resumePausedMainPractice() {
    if (!pausedMainSession) return
    const session = pausedMainSession
    persistPausedMainSession(null)
    resumePracticeSession(session)
  }

  function continueMistakeReview() {
    if (activeSession?.lessonId === 'mistake-review' && resumeActivePractice()) return
    if (mistakeLesson) begin(mistakeLesson, mistakeReviewMode, { skipIntroduction: true })
  }

  function continuePractice() {
    if (resumeActivePractice()) return
    beginAdaptiveRound(recommendedMainLesson.level, practiceTrackForLesson(recommendedMainLesson), recommendedPracticeMode)
  }

  function openLesson(nextLesson: Lesson) {
    if (activeSession?.lessonId === nextLesson.id) {
      resumeActivePractice()
      return
    }
    if (activeSession?.lessonId === 'mistake-review' && pausedMainSession?.lessonId === nextLesson.id) {
      resumePausedMainPractice()
      return
    }
    const nextLessonMastery = masteryProgress[nextLesson.id] ?? {}
    const nextPendingMode = pendingMasteryMode(nextLessonMastery)
    const nextMode = (nextLessonMastery.recall || nextLessonMastery.listen) && nextPendingMode ? nextPendingMode : mode
    begin(nextLesson, nextMode)
  }

  function openLevelPath(nextLevel: LessonLevel, pathLessons: Lesson[], recommendation: Lesson) {
    setLevelFilter(nextLevel)
    if (activeSession && adaptiveLevelFromLessonId(activeSession.lessonId) === nextLevel) {
      resumeActivePractice()
      return
    }
    if (activeSession?.lessonId !== 'mistake-review' && activeSession && pathLessons.some((item) => item.id === activeSession.lessonId)) {
      resumeActivePractice()
      return
    }
    if (activeSession?.lessonId === 'mistake-review' && pausedMainSession && pathLessons.some((item) => item.id === pausedMainSession.lessonId)) {
      resumePausedMainPractice()
      return
    }
    beginAdaptiveRound(nextLevel, trackFilter, mode, categoryFilter, sceneFilter)
  }

  function exitPractice() {
    flowTokenRef.current += 1
    window.clearTimeout(resetTimerRef.current)
    window.speechSynthesis?.cancel()
    const elapsedMs = currentElapsedMs()
    trackAnalytics('practice_exited', {
      ...analyticsPracticeContext(),
      completed_items: completedWords,
      mistakes,
      elapsed_seconds: Math.round(elapsedMs / 1000),
      progress_percent: Math.round(completedWords / Math.max(1, lesson.words.length) * 100),
    })
    if (activeSession) {
      persistActiveSession({
        ...activeSession,
        mode,
        index,
        elapsedMs,
        correctKeystrokes,
        mistakes,
        completedWords,
        mistakeWords,
        reviewCorrectCount,
        masteryMode: roundMasteryMode,
        usedHint: roundUsedHint,
        independentCorrect,
        weakWordIds,
        satisfiedModes: roundSatisfiedModes,
      })
    }
    setScreen('home')
  }

  function next() {
    flowTokenRef.current += 1
    const nextCompletedWords = completedWords + 1
    const independentAnswer = mode !== 'copy' && !currentWordHadErrorRef.current && !currentWordUsedHintRef.current
    const nextIndependentCorrect = independentCorrect + (independentAnswer ? 1 : 0)
    const completingRound = index === lesson.words.length - 1
    const nextIndependentRate = mode === 'copy' ? null : Math.round(nextIndependentCorrect / nextCompletedWords * 100)
    const currentModeSatisfied = completingRound
      && (mode === 'recall' || mode === 'listen')
      && roundMasteryMode === mode
      && masteryRecommendation(nextIndependentRate, true) === 'advance'
    const nextSatisfiedModes: LessonMastery = {
      ...roundSatisfiedModes,
      ...(currentModeSatisfied && mode === 'recall' ? { recall: true } : {}),
      ...(currentModeSatisfied && mode === 'listen' ? { listen: true } : {}),
    }
    const currentCardId = currentPracticeCardId()
    const currentWordIsWeak = shouldMarkWordWeak(mode, currentWordHadErrorRef.current, currentWordUsedHintRef.current)
    const nextWeakWordIds = !currentWordIsWeak || weakWordIds.includes(currentCardId) ? weakWordIds : [...weakWordIds, currentCardId]
    const reviewProgressed = recordMistakeRecovery(independentAnswer)
    const nextReviewCorrectCount = reviewCorrectCount + (reviewProgressed ? 1 : 0)
    const elapsedMs = currentElapsedMs()
    setCompletedWords(nextCompletedWords)
    setIndependentCorrect(nextIndependentCorrect)
    setWeakWordIds(nextWeakWordIds)
    if (completingRound) setRoundSatisfiedModes(nextSatisfiedModes)
    if (reviewProgressed) {
      setReviewCorrectCount(nextReviewCorrectCount)
    }
    recordCompletedWord()
    const nextWordEvidence = recordWordEvidence(independentAnswer)
    recordChallengeSuccess(independentAnswer)
    if (isOnboardingRound && index === 2 && lesson.words.length > 3 && activeSession) {
      trackAnalytics('onboarding_checkpoint_completed', {
        ...analyticsPracticeContext(),
        completed_items: nextCompletedWords,
        mistakes,
        elapsed_seconds: Math.max(1, Math.round(elapsedMs / 1000)),
      })
      localStorage.setItem(ONBOARDING_DONE_KEY, 'true')
      persistActiveSession({
        ...activeSession,
        mode,
        index: index + 1,
        elapsedMs,
        correctKeystrokes,
        mistakes,
        completedWords: nextCompletedWords,
        mistakeWords,
        reviewCorrectCount: nextReviewCorrectCount,
        masteryMode: roundMasteryMode,
        usedHint: roundUsedHint,
        onboarding: false,
        independentCorrect: nextIndependentCorrect,
        weakWordIds: nextWeakWordIds,
        satisfiedModes: roundSatisfiedModes,
      })
      setFinalElapsedSeconds(Math.max(1, Math.round(elapsedMs / 1000)))
      setScreen('complete')
      return
    }
    if (completingRound
      && mode === 'copy'
      && activeSession?.followUpMode
      && activeSession.followUpOrder?.length) {
      const copyWeakWords = lesson.words.filter((item) => nextWeakWordIds.includes(item.reviewKey ?? sessionCardId(lesson.id, item)))
      if (copyWeakWords.length) {
        begin({ ...lesson, words: copyWeakWords }, 'copy', {
          orderedWords: shuffleWords(copyWeakWords),
          satisfiedModes: roundSatisfiedModes,
          skipIntroduction: true,
          followUpMode: activeSession.followUpMode,
          followUpOrder: activeSession.followUpOrder,
        })
        return
      }
      const followUpLesson = practiceLessonFromOrder(activeSession.lessonId, activeSession.followUpOrder)
      if (followUpLesson) {
        trackAnalytics('practice_round_completed', {
          ...analyticsPracticeContext(),
          completion_kind: 'introduction',
          completed_items: nextCompletedWords,
          mistakes,
          elapsed_seconds: Math.max(1, Math.round(elapsedMs / 1000)),
          used_hint: roundUsedHint,
          independent_correct: nextIndependentCorrect,
          independent_rate: nextIndependentRate,
        })
        recordAdaptiveRound(elapsedMs)
        begin(followUpLesson, activeSession.followUpMode, {
          orderedWords: followUpLesson.words,
          satisfiedModes: roundSatisfiedModes,
          skipIntroduction: true,
        })
        return
      }
    }
    if (index === lesson.words.length - 1) {
      if (isOnboardingRound) localStorage.setItem(ONBOARDING_DONE_KEY, 'true')
      if (lesson.id === 'mistake-review' && pausedMainSession) {
        persistActiveSession(pausedMainSession)
        persistPausedMainSession(null)
      } else {
        persistActiveSession(null)
        if (lesson.id !== 'mistake-review') persistPausedMainSession(null)
      }
      const seconds = Math.max(1, Math.round(elapsedMs / 1000))
      setFinalElapsedSeconds(seconds)
      trackAnalytics('practice_round_completed', {
        ...analyticsPracticeContext(),
        completion_kind: 'round',
        completed_items: nextCompletedWords,
        mistakes,
        elapsed_seconds: seconds,
        used_hint: roundUsedHint,
        independent_correct: nextIndependentCorrect,
        independent_rate: nextIndependentRate,
      })
      recordAdaptiveRound(elapsedMs)
      const completedCatalogLesson = lessons.find((item) => item.id === lesson.id)
      if (completedCatalogLesson && (mode === 'recall' || mode === 'listen')) {
        const completedMode = mode
        const modeNowComplete = completedCatalogLesson.words.every((item) => nextWordEvidence[sessionCardId(completedCatalogLesson.id, item)]?.[completedMode])
        const nextLessonMastery: LessonMastery = {
          ...(masteryProgress[lesson.id] ?? {}),
          ...nextSatisfiedModes,
          ...(modeNowComplete ? { [completedMode]: true } : {}),
        }
        if (modeNowComplete || currentModeSatisfied) saveMasteryProgress({ ...masteryProgress, [lesson.id]: nextLessonMastery })
        if (nextLessonMastery.recall && nextLessonMastery.listen) {
          const nextCompleted = Array.from(new Set([...completed, lesson.id]))
          scheduleSync()
          setCompleted(nextCompleted)
          localStorage.setItem('teclea-completed', JSON.stringify(nextCompleted))
          const followingPool = lessonsForTrack(practiceTrackForLesson(lesson)).filter((item) => item.level === lesson.level)
          const followingLesson = nextIncompleteLessonAfter(lesson.id, nextCompleted, followingPool)
          if (followingLesson) {
            savePracticeState((current) => ({ ...current, lastLessonId: followingLesson.id }))
          }
        }
      }
      setScreen('complete')
      return
    }
    if (activeSession) {
      persistActiveSession({
        ...activeSession,
        index: index + 1,
        elapsedMs,
        correctKeystrokes,
        mistakes,
        completedWords: nextCompletedWords,
        mistakeWords,
        reviewCorrectCount: nextReviewCorrectCount,
        independentCorrect: nextIndependentCorrect,
        weakWordIds: nextWeakWordIds,
        satisfiedModes: roundSatisfiedModes,
      })
    }
    currentWordHadErrorRef.current = false
    currentWordUsedHintRef.current = false
    setIndex((value) => value + 1)
    setTyped('')
    setInputDraft('')
    setStatus('idle')
    setWrongAt(null)
  }

  function changeMode(nextMode: Mode) {
    if (nextMode === mode) return
    inputRef.current?.focus({ preventScroll: true })
    flowTokenRef.current += 1
    window.clearTimeout(resetTimerRef.current)
    isComposingRef.current = false
    compositionCommittedValueRef.current = null
    currentWordUsedHintRef.current = false
    const roundIsUntouched = completedWords === 0 && correctKeystrokes === 0 && mistakes === 0 && typed.length === 0 && !roundUsedHint
    const nextMasteryMode = roundIsUntouched && (nextMode === 'recall' || nextMode === 'listen') ? nextMode : null
    if (nextMode !== 'copy') {
      const fullOrder = activeSession?.followUpOrder?.length
        ? activeSession.followUpOrder
        : activeSession?.order?.length
          ? activeSession.order
          : lesson.words.map((item) => sessionCardId(lesson.id, item))
      const fullLesson = practiceLessonFromOrder(activeSession?.lessonId ?? lesson.id, fullOrder) ?? lesson
      const unintroducedWords = itemsNeedingIntroduction(
        fullLesson.words,
        (item) => wordEvidence[item.reviewKey ?? sessionCardId(fullLesson.id, item)],
      )
      if (unintroducedWords.length) {
        begin(fullLesson, nextMode, { orderedWords: fullLesson.words, satisfiedModes: roundSatisfiedModes })
        return
      }
    }
    setMode(nextMode)
    setRoundMasteryMode(nextMasteryMode)
    if (activeSession) {
      persistActiveSession({
        ...activeSession,
        mode: nextMode,
        index,
        elapsedMs: currentElapsedMs(),
        correctKeystrokes,
        mistakes,
        completedWords,
        mistakeWords,
        reviewCorrectCount,
        masteryMode: nextMasteryMode,
        usedHint: roundUsedHint,
        independentCorrect,
        weakWordIds,
        satisfiedModes: roundSatisfiedModes,
      })
    }
    savePracticeState((current) => ({ ...current, lastMode: nextMode }))
    setTyped('')
    setInputDraft('')
    setStatus('idle')
    setWrongAt(null)
    setRevealAnswer(false)
    window.requestAnimationFrame(() => {
      practiceMainRef.current?.scrollTo({ top: 0, behavior: 'auto' })
      inputRef.current?.focus({ preventScroll: true })
    })
  }

  function chooseAccentMode(nextMode: AccentMode) {
    if (nextMode === accentMode) return
    inputRef.current?.focus({ preventScroll: true })
    flowTokenRef.current += 1
    window.clearTimeout(resetTimerRef.current)
    isComposingRef.current = false
    compositionCommittedValueRef.current = null
    setAccentMode(nextMode)
    localStorage.setItem('teclea-accent-mode', nextMode)
    scheduleSync()
    setTyped('')
    setInputDraft('')
    setStatus('idle')
    setWrongAt(null)
    window.requestAnimationFrame(() => {
      practiceMainRef.current?.scrollTo({ top: 0, behavior: 'auto' })
      inputRef.current?.focus({ preventScroll: true })
    })
  }

  function toggleAccentMode() {
    chooseAccentMode(accentMode === 'strict' ? 'lenient' : 'strict')
  }

  function toggleSound() {
    const nextValue = !soundEnabled
    setSoundEnabled(nextValue)
    localStorage.setItem('teclea-sound-enabled', String(nextValue))
    scheduleSync()
  }

  function chooseSpeechRate(nextRate: SpeechRate) {
    setSpeechRate(nextRate)
    localStorage.setItem(SPEECH_RATE_KEY, String(nextRate))
    scheduleSync()
    speak('escuchar y repetir', undefined, nextRate)
  }

  function cyclePracticeSpeechRate() {
    const currentIndex = SPEECH_RATE_OPTIONS.findIndex((option) => option.value === speechRate)
    const nextOption = SPEECH_RATE_OPTIONS[(currentIndex + 1) % SPEECH_RATE_OPTIONS.length]
    setSpeechRate(nextOption.value)
    localStorage.setItem(SPEECH_RATE_KEY, String(nextOption.value))
    scheduleSync()
    if (mode === 'recall') markMasteryHintUsed()
    speak(word.spanish, undefined, nextOption.value)
    inputRef.current?.focus({ preventScroll: true })
  }

  function replayCurrentPronunciation() {
    if (mode === 'recall') markMasteryHintUsed()
    speak(word.spanish, undefined, speechRate)
    inputRef.current?.focus({ preventScroll: true })
  }

  function handleCharacters(rawValue: string) {
    if (status !== 'idle') return

    if (sessionStartedAtRef.current === null) {
      trackAnalytics('practice_input_started', {
        ...analyticsPracticeContext(),
        progress_index: index,
      })
      sessionStartedAtRef.current = Date.now()
      setTimerNow(Date.now())
    }

    const targetCharacters = Array.from(getTypingTarget(word.spanish))
    const currentCharacters = Array.from(normalize(typed))
    const incomingValue = rawValue.toLocaleLowerCase('es-ES').normalize('NFC')
    const incomingCharacters = Array.from(incomingValue)
    if (incomingCharacters.length === currentCharacters.length && incomingCharacters.every(
      (character, characterIndex) => charactersMatch(character, targetCharacters[characterIndex], accentMode),
    )) {
      setInputDraft(incomingValue)
      return
    }
    if (incomingCharacters.length <= currentCharacters.length) {
      setTyped('')
      setInputDraft('')
      setWrongAt(null)
      setStatus('idle')
      return
    }

    const incoming = incomingCharacters.slice(currentCharacters.length)
    const correctPrefix = [...currentCharacters]
    let acceptedRawLength = currentCharacters.length
    let newlyCorrect = 0

    for (const character of incoming) {
      const expected = targetCharacters[correctPrefix.length]
      if (charactersMatch(character, expected, accentMode)) {
        correctPrefix.push(expected)
        acceptedRawLength += 1
        newlyCorrect += 1
        continue
      }

      setTyped(correctPrefix.join(''))
      setInputDraft(incomingCharacters.slice(0, acceptedRawLength).join(''))
      if (newlyCorrect) setCorrectKeystrokes((value) => value + newlyCorrect)
      setWrongAt(correctPrefix.length)
      setStatus('wrong')
      setMistakes((value) => value + 1)
      setMistakeWords((value) => ({ ...value, [word.spanish]: (value[word.spanish] ?? 0) + 1 }))
      currentWordHadErrorRef.current = true
      markCurrentWordWeak()
      recordMistake()
      playEffect('wrong')
      resetTimerRef.current = window.setTimeout(() => {
        setTyped('')
        setInputDraft('')
        setWrongAt(null)
        setStatus('idle')
        inputRef.current?.focus()
      }, 320)
      return
    }

    setTyped(correctPrefix.join(''))
    setInputDraft(incomingCharacters.slice(0, acceptedRawLength).join(''))
    if (newlyCorrect) setCorrectKeystrokes((value) => value + newlyCorrect)
    if (correctPrefix.length === targetCharacters.length) {
      setStatus('correct')
      playEffect('complete')
      const completionToken = ++flowTokenRef.current
      const completedAt = Date.now()
      const minimumFeedbackMs = 1400
      const advance = () => {
        if (flowTokenRef.current !== completionToken) return
        const remainingFeedbackMs = minimumFeedbackMs - (Date.now() - completedAt)
        if (remainingFeedbackMs > 0) {
          resetTimerRef.current = window.setTimeout(advance, remainingFeedbackMs)
          return
        }
        window.clearTimeout(resetTimerRef.current)
        next()
      }
      resetTimerRef.current = window.setTimeout(() => {
        if (flowTokenRef.current !== completionToken) return
        const started = speak(word.spanish, advance, speechRate)
        resetTimerRef.current = window.setTimeout(advance, started ? speechFallbackMs(word.spanish, speechRate) : minimumFeedbackMs)
      }, 130)
    } else if (newlyCorrect) {
      playEffect('key')
    }
  }

  function cancelPressHoldReplacement() {
    window.clearTimeout(pressHoldTimerRef.current)
    pressHoldTimerRef.current = undefined
    pressHoldPendingRef.current = null
  }

  function handleCommittedInput(rawValue: string) {
    const decision = pressHoldInputDecision({
      rawValue,
      acceptedValue: typed,
      targetValue: getTypingTarget(word.spanish),
      strict: accentMode === 'strict',
      idle: status === 'idle',
      pending: pressHoldPendingRef.current,
    })
    if (decision.kind === 'keep-waiting') {
      setInputDraft(decision.pending.value)
      return
    }
    cancelPressHoldReplacement()
    if (decision.kind === 'wait') {
      pressHoldPendingRef.current = decision.pending
      setInputDraft(decision.pending.value)
      pressHoldTimerRef.current = window.setTimeout(() => {
        pressHoldTimerRef.current = undefined
        pressHoldPendingRef.current = null
        handleCharacters(decision.pending.value)
      }, PRESS_HOLD_REPLACEMENT_MS)
      return
    }
    handleCharacters(decision.value)
  }

  function insertAccent(character: string) {
    cancelPressHoldReplacement()
    handleCharacters(typed + character)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  function startTouchReveal() {
    window.clearTimeout(revealTimerRef.current)
    revealTimerRef.current = window.setTimeout(() => {
      markMasteryHintUsed()
      setRevealAnswer(true)
    }, 420)
  }

  function stopTouchReveal() {
    window.clearTimeout(revealTimerRef.current)
    setRevealAnswer(false)
  }

  const analyticsConsentBanner = analyticsConfigured && analyticsConsent === 'pending' ? (
    <aside className="analytics-consent" aria-label="匿名使用统计选择">
      <div>
        <strong>帮助改进练习</strong>
        <p>只记录练习开始、完成、退出、模式和汇总表现；不记录输入内容、具体词条或同步码。<a href="/privacy.html">查看隐私说明</a></p>
      </div>
      <div className="analytics-consent-actions">
        <button className="analytics-decline" onClick={() => chooseAnalyticsConsent('denied')}>仅必要功能</button>
        <button className="analytics-accept" onClick={() => chooseAnalyticsConsent('granted')}>允许匿名统计</button>
      </div>
    </aside>
  ) : null

  function mistakeRows(entries: Array<[string, MistakeRecord]>) {
    if (!entries.length) return <p className="mistake-empty-row">这里暂时没有内容。</p>
    return (
      <div className="mistake-record-list">
        {entries.map(([reviewKey, record]) => {
          const activeModes = activeReviewModes(record)
          const target = recoveryTarget(record.count)
          const modeName = (reviewMode: Mode) => reviewMode === 'copy' ? '跟打' : reviewMode === 'recall' ? '看义' : '听音'
          return (
            <article className="mistake-record-row" key={reviewKey}>
              <div><strong>{record.spanish}</strong><span>{record.chinese}</span></div>
              <p>累计错 {record.count} 次 · 跟打 {record.wrongCounts.copy} · 看义 {record.wrongCounts.recall} · 听音 {record.wrongCounts.listen}</p>
              <p>独立答对 · 看义 {record.independentCorrectCounts.recall} · 听音 {record.independentCorrectCounts.listen}</p>
              {activeModes.length ? (
                <div className="mistake-recovery-lines">
                  {activeModes.map((reviewMode) => {
                    const progress = record.review[reviewMode]!
                    return <span key={reviewMode}>{modeName(reviewMode)}恢复 {progress.recoveryCount}/{target}<small>{progress.dueOn <= reviewToday ? '现在可确认' : `${progress.dueOn} 后确认`}</small></span>
                  })}
                </div>
              ) : <b className="mistake-resolved">已完成当前短期复查 · 历史保留</b>}
            </article>
          )
        })}
      </div>
    )
  }

  if (screen === 'home') {
    return (
      <div className="app-shell">
        <header className="topbar">
          <div className="brand-mark">H</div>
          <div className="brand-copy"><strong>HolaDone</strong><span>每天敲进一点西语</span></div>
          <button ref={settingsButtonRef} className="icon-button" aria-label="设置" aria-haspopup="dialog" aria-expanded={settingsOpen} onClick={() => setSettingsOpen(true)}><Settings2 size={21} /></button>
        </header>

        {isLegacyDomain && !legacyNoticeDismissed && (
          <aside className="domain-migration" aria-label="网站新域名迁移提醒">
            <div>
              <span className="section-kicker">新网址已启用</span>
              <strong>www.holadone.com</strong>
              <p>{syncStatus === 'error' ? `迁移未完成：${syncMessage}。旧网址里的进度仍然保留。` : '先加密同步这里的学习记录，再安全前往新网址，进度不会丢。'}</p>
            </div>
            <button className="migration-button" onClick={() => void migrateLegacyProgress()} disabled={syncStatus === 'syncing'}>
              {syncStatus === 'syncing' ? '正在安全迁移…' : '迁移进度并前往'} <ArrowRight size={17} />
            </button>
            <button className="migration-dismiss" onClick={() => setLegacyNoticeDismissed(true)} aria-label="暂时关闭迁移提醒"><X size={17} /></button>
          </aside>
        )}

        <main className="home-content">
          <div className="home-overview">
            <section className="hero-card">
              <div className="hero-glow" />
              <div className="streak-pill"><Flame size={15} fill="currentColor" /> {streak > 0 ? `连续学习 ${streak} 天` : '从今天开始连续学习'}</div>
              <p className="eyebrow">BUENOS DÍAS · 早上好</p>
              <h1>让西语从<br /><em>手指</em>进入记忆</h1>
              <p className="hero-subtitle">听、看、完整拼写。{totalPracticeCards} 张单词、短语与动词原形练习卡，练对重音和真实表达。</p>
              <button className="primary-button" onClick={continuePractice}>
                {continueLabel} <ArrowRight size={19} />
              </button>
            </section>

            <button ref={dailyGoalButtonRef} type="button" className="daily-row" aria-haspopup="dialog" aria-expanded={dailyGoalOpen} onClick={() => setDailyGoalOpen(true)}>
              {challenge && challengeStats ? (
                <>
                  <div><span className="section-kicker">{challenge.level} 挑战</span><strong>{challengeStats.todayCompleted}<small> / {challengeStats.dailyTarget} 次</small></strong><span className="daily-hint">今日达标次数动态重算 · 剩余 {challengeStats.remainingDays} 天</span></div>
                  <div className="mini-ring" style={{ '--percent': `${Math.min(challengeStats.todayCompleted / Math.max(1, challengeStats.dailyTarget), 1) * 360}deg` } as React.CSSProperties}><span>{challengeStats.dailyTarget === 0 ? '已完成' : `${Math.round(Math.min(challengeStats.todayCompleted / challengeStats.dailyTarget, 1) * 100)}%`}</span></div>
                </>
              ) : (
                <>
                  <div><span className="section-kicker">今日练习</span><strong>{todayDone}<small> 项</small></strong><span className="daily-hint">还没创建挑战 · 按自己的节奏练</span></div>
                  <div className="mini-ring no-goal"><span>{todayDone ? '已练' : '开始'}</span></div>
                </>
              )}
            </button>
          </div>

          <div className="home-actions">
            <section className={`mistake-card ${activeMistakeEntries.length ? '' : 'empty'}`}>
              <div className="mistake-icon"><RotateCcw size={22} /></div>
              <div>
                <span className="section-kicker">错题本</span>
                <h3>{dueMistakeEntries.length
                  ? `${dueMistakeEntries.length} 个到期错题`
                  : activeMistakeEntries.length
                    ? `${activeMistakeEntries.length} 个待后续复查`
                    : mistakeEntries.length
                      ? '当前待复习已完成'
                      : '目前没有错题'}</h3>
                <p>{mistakeEntries.length
                  ? `今日错题 ${todayMistakeEntries.length} 个 · 全部记录 ${mistakeEntries.length} 个 · 累计错 ${mistakeAttempts} 次`
                  : '练习中输错的内容会自动出现在这里，并永久保留记录。'}</p>
                {activeMistakeEntries.length > 0 && (
                  <div className="mistake-statuses" aria-label="错题复习状态">
                    <span className={dueMistakeEntries.length ? 'due' : ''}>现在复习 {dueMistakeEntries.length}</span>
                    <span>今日／稍后 {activeMistakeEntries.length - dueMistakeEntries.length}</span>
                    <span>历史记录 {mistakeEntries.length}</span>
                  </div>
                )}
                {mistakeEntries.length > 0 && <button ref={mistakeLogButtonRef} className="mistake-record-link" onClick={() => setMistakeLogOpen(true)}>查看今日、待复习与全部记录</button>}
                {activeSession?.lessonId === 'mistake-review' && pausedMainSession && (
                  <button className="resume-main-link" onClick={resumePausedMainPractice}>返回普通练习 · {pausedMainSession.index + 1}/{pausedMainSession.order.length}</button>
                )}
              </div>
              <button disabled={!mistakeLesson} aria-label={activeSession?.lessonId === 'mistake-review' ? '继续错题复习' : dueMistakeEntries.length ? '开始到期错题复习' : todayMistakeEntries.length ? '巩固今日错题' : '巩固稍后复查词'} onClick={continueMistakeReview}><ArrowRight size={19} /></button>
            </section>
          </div>

          <section className="course-section" id="courses">
            <div className="section-heading"><div><span className="section-kicker">开放词库 · {totalPracticeCards} 张不重复练习卡</span><h2>{trackFilter === 'main' ? '先选等级，再选分类' : '选好等级，直接刷动词'}</h2></div><button onClick={resetFilters}>重置</button></div>
            <div className="course-filters primary-filters" role="group" aria-label="刷词主线筛选">
              <div><span>等级</span>{lessonLevels.map((level) => <button key={level} aria-pressed={levelFilter === level} className={levelFilter === level ? 'active' : ''} onClick={() => chooseLevelFilter(level)}>{level === '全部' ? '全部等级' : level}</button>)}</div>
              <div><span>主线</span>{PRACTICE_TRACKS.map((track) => <button key={track.value} aria-pressed={trackFilter === track.value} className={trackFilter === track.value ? 'active' : ''} onClick={() => chooseTrackFilter(track.value)}>{track.label}</button>)}</div>
            </div>

            {trackFilter === 'main' ? (
              <section className="category-browser" aria-labelledby="category-heading">
                <div className="category-heading"><strong id="category-heading">六大内容分类</strong><span>选中后，会在该分类内按等级连续刷</span></div>
                <div className="category-grid" role="group" aria-label="词汇与短语内容分类">
                  <button className={categoryFilter === '全部' ? 'active' : ''} aria-pressed={categoryFilter === '全部'} onClick={() => chooseCategoryFilter('全部')}>
                    <strong>全部分类</strong><span>{scopedTrackCardCount} 项</span>
                  </button>
                  {categorySummaries.map((summary) => (
                    <button key={summary.category} className={categoryFilter === summary.category ? 'active' : ''} aria-pressed={categoryFilter === summary.category} disabled={!summary.groups} onClick={() => chooseCategoryFilter(summary.category)}>
                      <strong>{summary.category}</strong><span>{summary.cards ? `${summary.cards} 项` : '该等级暂无'}</span>
                    </button>
                  ))}
                </div>
              </section>
            ) : (
              <div className="verb-track-note">
                <span><strong>动词专项按等级连续刷</strong><small>动词不按生活分类；直接选择等级，系统会从该等级的常用动词原形中安排短轮次。</small></span>
              </div>
            )}

            <div className={`level-paths ${levelFilter === '全部' ? '' : 'single'}`} aria-live="polite">
              {levelPaths.map((path) => {
                const percentage = path.totalCards ? Math.round(path.masteredCards / path.totalCards * 100) : 0
                const recommendationMastery = masteryProgress[path.recommendation.id] ?? {}
                const pendingMode = pendingMasteryMode(recommendationMastery)
                const resumableSession = activeSession?.lessonId !== 'mistake-review' && (adaptiveLevelFromLessonId(activeSession?.lessonId ?? '') === path.level || path.lessons.some((item) => item.id === activeSession?.lessonId))
                  ? activeSession
                  : activeSession?.lessonId === 'mistake-review' && pausedMainSession && path.lessons.some((item) => item.id === pausedMainSession.lessonId)
                    ? pausedMainSession
                    : null
                const isComplete = path.masteredCards === path.totalCards
                const actionLabel = resumableSession
                  ? `继续 ${resumableSession.index + 1}/${resumableSession.order.length}`
                  : !isComplete && (recommendationMastery.recall || recommendationMastery.listen) && pendingMode
                    ? `继续${masteryModeLabel(pendingMode)}`
                    : isComplete
                      ? '重新练习'
                      : path.completedGroups > 0
                        ? `继续刷 ${path.level}`
                        : `开始刷 ${path.level}`
                return (
                  <section className="level-path-card" key={path.level}>
                    <div className="level-path-heading"><span>{path.level}</span><div><small>{practiceTrackLabel(trackFilter, true)}{path.level === 'C1' || path.level === 'C2' ? ' · 候选词库' : ''}{categoryFilter !== '全部' ? ` · ${categoryFilter}` : ''}{sceneFilter !== '全部' ? ` · ${sceneFilter}` : ''}</small><strong>{path.totalCards} 项</strong></div><b>{percentage}%</b></div>
                    <div className="level-progress" aria-label={`${path.level} 已掌握 ${path.masteredCards} / ${path.totalCards}`}><span style={{ width: `${percentage}%` }} /></div>
                    <p>已掌握 {path.masteredCards} / {path.totalCards}{path.partialGroups ? ` · ${path.partialGroups} 轮进行中` : ' · 短轮次自动衔接'}</p>
                    <button onClick={() => openLevelPath(path.level, path.lessons, path.recommendation)}>{actionLabel}<ArrowRight size={17} /></button>
                  </section>
                )
              })}
            </div>

            {trackFilter === 'main' && (
              <details className="theme-browser">
                <summary><span>按细分场景浏览 <small>可选 · 默认仍练整个等级</small></span><b>{sceneFilter === '全部' ? '不限场景' : sceneFilter}</b></summary>
                <div className="theme-browser-content">
                  <div className="course-filters theme-filters" role="group" aria-label="可选主题筛选">
                    <div><span>细分</span><button aria-pressed={sceneFilter === '全部'} className={sceneFilter === '全部' ? 'active' : ''} onClick={() => chooseSceneFilter('全部')}>当前分类全部</button>{availableScenes.map((scene) => <button key={scene} aria-pressed={sceneFilter === scene} className={sceneFilter === scene ? 'active' : ''} onClick={() => chooseSceneFilter(scene)}>{scene}</button>)}</div>
                  </div>
                  <p className="filter-result" aria-live="polite">{sceneFilter === '全部' ? '未限定时，下一轮会从当前等级的全部合格内容中抽取。' : `已限定到“${sceneFilter}”；下一轮将优先弱词与未掌握内容。`}</p>
                  {!filteredLessons.length && <p className="empty-lessons">这个主题暂时没有练习，试试切换等级或主线。</p>}
                  <div className="word-sources">
                    <a className="word-source" href={FREQUENCY_SOURCE.url} target="_blank" rel="noreferrer">词频排序：{FREQUENCY_SOURCE.name} · {FREQUENCY_SOURCE.license}</a>
                    <a className="word-source" href={WORD_SOURCE.url} target="_blank" rel="noreferrer">拼写与词形：{WORD_SOURCE.name} · {WORD_SOURCE.license}</a>
                    <a className="word-source" href={INTERMEDIATE_SOURCE.url} target="_blank" rel="noreferrer">B1–B2 框架参考：Instituto Cervantes PCIC · 项目教学选词</a>
                    <a className="word-source" href={ADVANCED_SOURCE.url} target="_blank" rel="noreferrer">C1–C2 框架参考：Instituto Cervantes PCIC · 候选教学选词</a>
                    <a className="word-source" href={PHRASE_SOURCE.url} target="_blank" rel="noreferrer">短语、中文释义与例句：项目教学编辑 · 制作说明</a>
                  </div>
                </div>
              </details>
            )}
          </section>

          <footer className="project-legal">
            <nav className="learning-guide-links" aria-label="免费西语学习指南">
              <a href="/spanish-dictation-practice.html">西语听写</a>
              <a href="/spanish-infinitive-practice.html">动词原形</a>
              <a href="/spanish-accent-practice.html">重音拼写</a>
              <a href="/a1-spanish-vocabulary.html">A1</a>
              <a href="/a2-spanish-vocabulary.html">A2</a>
              <a href="/b1-spanish-vocabulary.html">B1</a>
              <a href="/b2-spanish-vocabulary.html">B2</a>
              <a href="/c1-spanish-vocabulary.html">C1</a>
              <a href="/c2-spanish-vocabulary.html">C2</a>
              <a href="/methodology.html">词库方法</a>
            </nav>
            <div className="project-meta">
              <span>GPL-3.0 开源项目</span>
              <a href="/privacy.html">隐私说明</a>
              <a href="https://github.com/RealKai42/qwerty-learner" target="_blank" rel="noreferrer">基于 Qwerty Learner 修改</a>
            </div>
          </footer>
        </main>

        {mistakeLogOpen && (
          <div className="modal-backdrop mistake-log-backdrop" role="presentation" onClick={() => setMistakeLogOpen(false)}>
            <section ref={mistakeLogDialogRef} className="settings-sheet mistake-log-sheet" role="dialog" aria-modal="true" aria-labelledby="mistake-log-title" onClick={(event) => event.stopPropagation()}>
              <div className="sheet-handle" />
              <div className="sheet-heading"><div><span className="section-kicker">错题本 + 永久错题库</span><h2 id="mistake-log-title">错题与恢复进度</h2></div><button className="icon-button" onClick={() => setMistakeLogOpen(false)} aria-label="关闭错题记录"><X size={20} /></button></div>
              <p className="mistake-log-note">今天答对只用于即时巩固；到下一个学习日再独立答对，才会推进恢复。离开错题本后，累计历史仍保留。</p>

              <section className="mistake-log-group due">
                <div><span>待复习</span><b>{dueMistakeEntries.length}</b></div>
                <small>昨日及更早已经到期，优先从这里开始</small>
                {mistakeRows(dueMistakeEntries)}
              </section>
              <section className="mistake-log-group today">
                <div><span>今日错题</span><b>{todayMistakeEntries.length}</b></div>
                <small>今天可以反复巩固，但不会靠短时记忆直接清除</small>
                {mistakeRows(todayMistakeEntries)}
              </section>
              {laterMistakeEntries.length > 0 && (
                <section className="mistake-log-group later">
                  <div><span>稍后复查</span><b>{laterMistakeEntries.length}</b></div>
                  <small>今天已经获得一次确认，等待下一个学习日</small>
                  {mistakeRows(laterMistakeEntries)}
                </section>
              )}
              <details className="mistake-history" open={!activeMistakeEntries.length}>
                <summary><span>全部错题库</span><b>{mistakeEntries.length} 个词 · 累计错 {mistakeAttempts} 次</b></summary>
                {mistakeRows(mistakeEntries)}
              </details>
              {mistakeLesson && <button className="primary-button" onClick={() => { setMistakeLogOpen(false); continueMistakeReview() }}>{dueMistakeEntries.length ? '开始到期错题复习' : todayMistakeEntries.length ? '继续巩固今日错题' : '继续巩固稍后复查词'} <ArrowRight size={18} /></button>}
            </section>
          </div>
        )}

        {settingsOpen && (
          <div className="modal-backdrop" role="presentation" onClick={() => setSettingsOpen(false)}>
            <section ref={settingsDialogRef} className="settings-sheet" role="dialog" aria-modal="true" aria-labelledby="settings-title" onClick={(event) => event.stopPropagation()}>
              <div className="sheet-handle" />
              <div className="sheet-heading"><div><span className="section-kicker">训练偏好</span><h2 id="settings-title">怎么判定“打对”</h2></div><button className="icon-button" onClick={() => setSettingsOpen(false)} aria-label="关闭设置"><X size={20} /></button></div>
              <button className="setting-row" aria-pressed={accentMode === 'strict'} onClick={toggleAccentMode}>
                <span><strong>重音判定</strong><small>ñ、ü 始终作为独立字母</small></span>
                <b>{accentMode === 'strict' ? '严格拼写' : '忽略 á é í ó ú'}</b>
              </button>
              <button className="setting-row" aria-pressed={soundEnabled} onClick={toggleSound}>
                <span><strong>打字音效</strong><small>正确按键、错误和完成提示</small></span>
                <b>{soundEnabled ? '已开启' : '已关闭'}</b>
              </button>
              <div className="setting-rate">
                <span><strong>西语发音速度</strong><small>跟打和听音拼写会自动朗读；练习页可随时重听并切换语速</small></span>
                <div className="rate-options" aria-label="西语发音速度">
                  {SPEECH_RATE_OPTIONS.map((option) => (
                    <button key={option.value} className={speechRate === option.value ? 'active' : ''} onClick={() => chooseSpeechRate(option.value)} aria-pressed={speechRate === option.value}>
                      {option.label}<small>{option.value}×</small>
                    </button>
                  ))}
                </div>
              </div>
              {analyticsConfigured && (
                <button className="setting-row" aria-pressed={analyticsConsent === 'granted'} onClick={() => chooseAnalyticsConsent(analyticsConsent === 'granted' ? 'denied' : 'granted')}>
                  <span><strong>匿名使用统计</strong><small>只记录行为事件与汇总表现，不记录输入内容</small></span>
                  <b>{analyticsConsent === 'granted' ? '已允许' : '未启用'}</b>
                </button>
              )}
              <p className="settings-note">忽略重音时，输入 <b>camion</b> 可以通过 <b>camión</b>；但 <b>n</b> 不能代替 <b>ñ</b>。</p>
              <div className="sync-box">
                <div className="sync-heading">
                  <span><Cloud size={18} /><strong>手机与电脑同步</strong></span>
                  <small>{syncCode ? '端到端加密 · 无需账号' : '共享进度与错题'}</small>
                </div>
                {syncCode ? (
                  <>
                    <button className="sync-code-toggle" onClick={() => setShowSyncCode((value) => !value)} aria-expanded={showSyncCode}>
                      <span>{showSyncCode ? formatSyncCode(syncCode) : '•••••-•••••-•••••-•••••'}</span>
                      {showSyncCode ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                    {showSyncCode && (
                      <div className="sync-secret">
                        {syncQr && <img src={syncQr} alt="跨设备同步二维码" />}
                        <p>在另一台设备扫码，或输入上面的同步码。同步码相当于密码，请只发送给自己的设备；丢失后无法替你找回。</p>
                      </div>
                    )}
                    <div className="sync-actions">
                      <button onClick={shareSyncLink}><Share2 size={15} />发到另一台设备</button>
                      <button onClick={copySyncCode}><Copy size={15} />复制同步码</button>
                      <button onClick={() => void syncNow()} disabled={syncStatus === 'syncing'}><RotateCcw size={15} />立即同步</button>
                    </div>
                    <div className="sync-secondary-actions">
                      <button onClick={stopSync} disabled={syncStatus === 'syncing'}>只停止本机同步</button>
                      <button className="danger" onClick={() => void removeCloudSync()} disabled={syncStatus === 'syncing'}><Trash2 size={14} />删除云端数据</button>
                    </div>
                  </>
                ) : (
                  <>
                    <button className="sync-create" onClick={createSyncSpace} disabled={syncStatus === 'syncing'}>创建我的加密同步空间</button>
                    <div className="sync-divider"><span>或连接已有设备</span></div>
                    <div className="sync-connect">
                      <label className="sr-only" htmlFor="sync-code-input">另一台设备的同步码</label>
                      <input id="sync-code-input" value={syncInput} onChange={(event) => setSyncInput(formatSyncCode(event.target.value))} placeholder="输入 20 位同步码" inputMode="text" autoCapitalize="characters" autoCorrect="off" maxLength={23} />
                      <button onClick={connectSyncSpace} disabled={syncStatus === 'syncing'}>连接</button>
                    </div>
                  </>
                )}
                <p className={`sync-message ${syncStatus}`} aria-live="polite">
                  {syncMessage || '创建一次后，打开页面、返回页面和完成练习时都会自动同步。'}
                  {syncLastAt && syncStatus === 'synced' ? ` · ${new Date(syncLastAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}` : ''}
                </p>
              </div>
              <div className="legal-box">
                <strong>开源与修改声明</strong>
                <p>本项目是基于 Qwerty Learner 训练机制制作的手机西语修改版本，2026-08-14 起修改，并以 GPL-3.0 发布。无担保；源码入口放在这里，不占用首页。</p>
                <div className="legal-links">
                  <a href="https://github.com/YoYo1248/holadone" target="_blank" rel="noreferrer">本项目源代码</a>
                  <a href="https://github.com/RealKai42/qwerty-learner" target="_blank" rel="noreferrer">上游项目</a>
                  <a href="https://github.com/YoYo1248/holadone/blob/main/DATA_LICENSE.md" target="_blank" rel="noreferrer">词库许可</a>
                </div>
              </div>
            </section>
          </div>
        )}

        {dailyGoalOpen && (
          <div className="modal-backdrop daily-goal-backdrop" role="presentation" onClick={() => setDailyGoalOpen(false)}>
            <section ref={dailyGoalDialogRef} className="settings-sheet daily-goal-sheet" role="dialog" aria-modal="true" aria-labelledby="daily-goal-title" onClick={(event) => event.stopPropagation()}>
              <div className="sheet-handle" />
              <div className="sheet-heading"><div><span className="section-kicker">{challenge && !editingChallenge ? `${challenge.level} · 进行中` : '按自己的节奏'}</span><h2 id="daily-goal-title">{challenge && !editingChallenge ? '我的学习挑战' : '创建学习挑战'}</h2></div><button className="icon-button" onClick={() => setDailyGoalOpen(false)} aria-label="关闭挑战设置"><X size={20} /></button></div>
              {challenge && challengeStats && !editingChallenge ? (
                <>
                  <div className="challenge-progress"><div><strong>{challengeStats.percentage}%</strong><span>已完成 {challengeStats.completedRequired} / {challengeStats.totalRequired} 次达标拼写</span></div><div className="level-progress"><span style={{ width: `${challengeStats.percentage}%` }} /></div></div>
                  <div className="challenge-summary-grid">
                    <span><b>{challengeStats.cardCount}</b><small>{challenge.level} 学习项</small></span>
                    <span><b>{challenge.dictationRepetitions}×</b><small>每项听写</small></span>
                    <span><b>{challengeStats.remainingDays}</b><small>剩余天数</small></span>
                  </div>
                  <div className="goal-definition mastery"><b>今日目标</b><strong>{challengeStats.todayCompleted} / {challengeStats.dailyTarget} 次达标拼写</strong><p>每个学习项需要：看义拼写独立答对 1 次，加上听音拼写独立答对 {challenge.dictationRepetitions} 次。跟打不计入；输错或查看答案的当次不计，之后独立答对仍会累计。漏练后会自动重算，不会清空旧进度。</p></div>
                  <details className="challenge-records">
                    <summary>
                      <span>今天练了哪些</span>
                      <small>{todayChallengeDetails.length
                        ? `${todayChallengeDetails.length} 个词 · ${todayChallengeRecords.length} 次`
                        : challengeStats.todayCompleted
                          ? `${challengeStats.todayCompleted} 次暂无词条明细`
                          : '完成后会逐条记录'}</small>
                    </summary>
                    <div className="challenge-records-body">
                      {undetailedTodayChallengeCount > 0 && (
                        <p className="challenge-records-note">今天较早的 {undetailedTodayChallengeCount} 次来自旧版累计记录，当时没有保存具体词条，无法准确反推；从现在起的新记录会列在下面。</p>
                      )}
                      {todayChallengeDetails.length ? (
                        <div className="challenge-records-list">
                          {todayChallengeDetails.map((item) => (
                            <div className="challenge-record-row" key={item.cardId}>
                              <span><strong>{item.spanish}</strong><small>{item.chinese}</small></span>
                              <div>
                                {item.recall > 0 && <b>看义 ×{item.recall}</b>}
                                {item.listen > 0 && <b>听音 ×{item.listen}</b>}
                                <small>{new Date(item.lastCompletedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</small>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : undetailedTodayChallengeCount === 0 ? (
                        <p className="challenge-records-empty">今天还没有达标记录。独立答对后，这里会显示词条和练习模式。</p>
                      ) : null}
                    </div>
                  </details>
                  <button className="primary-button" onClick={startOrContinueChallenge}>{challengeStats.completedRequired === 0 ? '开始挑战' : '继续挑战'}</button>
                  <button className="text-button" onClick={() => setEditingChallenge(true)}>调整期限或听写次数</button>
                </>
              ) : (
                <>
                  <div className="challenge-form">
                    <fieldset><legend>选择等级范围</legend><div className="challenge-levels">{LEVEL_ORDER.map((level) => <button type="button" key={level} className={challengeLevel === level ? 'active' : ''} aria-pressed={challengeLevel === level} onClick={() => setChallengeLevel(level)}>{level}<small>{challengeCardIds(level).length} 项</small></button>)}</div></fieldset>
                    <div className="challenge-parameters">
                      <label><span>希望多少天完成</span><input type="number" min="1" max="365" value={challengeDays} onChange={(event) => setChallengeDays(Math.min(365, Math.max(1, Number(event.target.value) || 1)))} /><small>天</small></label>
                      <label><span>每项听音拼写独立答对</span><input type="number" min="1" max="10" value={challengeRepetitions} onChange={(event) => setChallengeRepetitions(Math.min(10, Math.max(1, Number(event.target.value) || 1)))} /><small>次</small></label>
                    </div>
                  </div>
                  <section className="challenge-budget" aria-label="每日练习预算">
                    <span className="challenge-budget-kicker">按当前选择估算</span>
                    <div className="challenge-budget-grid">
                      <span><strong>{challengeDraftPlan.dailyItems}</strong><small>个不同学习项 / 天</small></span>
                      <span><strong>{challengeDraftPlan.dailyMasteryActions}</strong><small>次有效拼写 / 天</small></span>
                      <span><strong>约 {challengeDraftPlan.estimatedMinutes}</strong><small>分钟 / 天</small></span>
                    </div>
                    <p>{challengeDraftPlan.personalizedModes
                      ? `已使用你 ${challengeDraftPlan.personalizedModes} 种模式的近期速度；缺少历史的模式采用初始估算。`
                      : '暂无足够个人计时，先按跟打约 10 秒、看义或听音约 19 秒/项估算；积累至少两轮后会自动更新。'}</p>
                  </section>
                  <p className="challenge-estimate">每项需看义拼写独立答对 1 次，再听音拼写独立答对 {challengeRepetitions} 次；跟打只计时间、不计掌握。全部共 {challengeDraftPlan.totalMasteryActions} 次有效拼写，按现有进度还需 {challengeDraftPlan.remainingMasteryActions} 次；每日次数包含错题缓冲，漏练后会按剩余任务自动重算。</p>
                  <button className="primary-button" onClick={createOrUpdateChallenge}>{challenge ? '保存挑战调整' : '创建挑战'}</button>
                  {challenge && <button className="text-button" onClick={() => setEditingChallenge(false)}>取消调整</button>}
                </>
              )}
            </section>
          </div>
        )}
        {analyticsConsentBanner}
      </div>
    )
  }

  if (screen === 'complete') {
    return (
      <div className="app-shell completion-screen">
        <button className="completion-home-button" onClick={() => setScreen('home')} aria-label="回到首页">
          <Home size={18} />
          <span>回到首页</span>
        </button>
        <main ref={completionMainRef}>
          <div className={`completion-burst ${lessonMasteredAfterRound ? 'mastered' : ''}`}>
            <Check size={28} strokeWidth={2.7} />
            <span>{lessonMasteredAfterRound ? '¡Dominado!' : '¡Muy bien!'}<b>{isOnboardingRound ? '前三词已完成' : lesson.id === 'mistake-review' ? '错题复习完成' : lessonMasteredAfterRound ? '本轮内容已掌握' : '本轮完成'}</b></span>
          </div>
          <h1>{lesson.title}</h1>
          <p>你完成了 {isOnboardingRound ? completedWords : lesson.words.length} 个表达，出现 {mistakes} 次重试。</p>
          {lesson.id !== 'mistake-review' && (
            <>
              <div className="mastery-steps" aria-label="本轮掌握进度">
                <span className={masteryAfterRound.recall ? 'passed' : ''}><Check size={15} /><b>看义拼写</b><small>{masteryAfterRound.recall ? '已通过' : recallEvidenceCount ? `${recallEvidenceCount}/${masteryScopeWords.length} 项` : '待完成'}</small></span>
                <span className={masteryAfterRound.listen ? 'passed' : ''}><Check size={15} /><b>听音拼写</b><small>{masteryAfterRound.listen ? '已通过' : listenEvidenceCount ? `${listenEvidenceCount}/${masteryScopeWords.length} 项` : '待完成'}</small></span>
              </div>
            </>
          )}
          {lesson.id === 'mistake-review' && (
            <p className={`review-result ${reviewCorrectCount === lesson.words.length ? 'clean' : ''}`}>
              {reviewCorrectCount > 0
                ? `本轮有 ${reviewCorrectCount} 个获得一次跨日确认；达到各自恢复次数后才会离开错题本。`
                : '本轮完成了当天巩固；同日答对不会清除，下一学习日再独立复查。'}
            </p>
          )}
          <div className="result-grid">
            <div><strong>{completedWords}</strong><span>完成项数</span></div>
            <div><strong>{accuracy}%</strong><span>按键正确率</span></div>
            <div><strong>{wpm}</strong><span>WPM</span></div>
            <div><strong>{formatTime(elapsedSeconds)}</strong><span>总用时</span></div>
          </div>
          {Object.keys(mistakeWords).length > 0 && (
            <div className="mistake-summary">
              <span>需要再练</span>
              {Object.entries(mistakeWords).map(([name, count]) => <b key={name}>{name}<small>{count} 次</small></b>)}
            </div>
          )}
          {isOnboardingRound ? (
            <div className="onboarding-next">
              <div className="mode-intro"><span><Keyboard size={17} /><b>跟打</b><small>先熟悉词形，不计掌握</small></span><span><BookOpen size={17} /><b>看义拼写</b><small>确认你懂中文意思</small></span><span><Headphones size={17} /><b>听音拼写</b><small>挑战的核心证据</small></span></div>
              <button className="primary-button" onClick={continueOnboardingRound}>继续 A1 · 完成本轮 <ArrowRight size={19} /></button>
              <div className="onboarding-secondary"><button onClick={chooseLevelAfterOnboarding}>选择其他等级</button><button onClick={openChallengeCreator}>创建挑战</button></div>
              <button className="install-link" onClick={() => void promptInstall()}>添加到主屏幕</button>
              {installHint && <p className="install-hint" aria-live="polite">{installHint}</p>}
            </div>
          ) : lesson.id === 'mistake-review' ? (
            <button className="primary-button" onClick={() => setScreen('home')}>回到今天 <Home size={19} /></button>
          ) : copyWeakRoundWords.length ? (
            <>
              <button className="primary-button" onClick={reinforceCopyWeakWords}>先巩固跟打错词 · {copyWeakRoundWords.length} 项 <RotateCcw size={18} /></button>
              <p className="enter-hint">这些词先跟着再打一遍，全部打对后再进入看义拼写</p>
              <button className="text-button" onClick={() => setScreen('home')}><Home size={17} /> 暂时回到首页</button>
            </>
          ) : masteryModeRound && roundRecommendation === 'advance' ? (
            <>
              <button className="primary-button" onClick={advanceAdaptiveStage}>{missingMasteryMode ? `开始${masteryModeLabel(missingMasteryMode)}` : '开始下一轮'} <ArrowRight size={19} /></button>
              <p className="enter-hint">已独立答对 {independentRate}% · 按 Enter 直接继续</p>
              <button className="text-button" onClick={repeatAdaptiveMode}>再巩固一次</button>
            </>
          ) : masteryModeRound && roundRecommendation === 'reinforce' ? (
            <>
              <button className="primary-button" onClick={reinforceAdaptiveWeakWords}>巩固薄弱项{weakRoundWords.length ? ` · ${weakRoundWords.length} 项` : ''} <RotateCcw size={18} /></button>
              <p className="enter-hint">已独立答对 {independentRate}% · 先短复习更稳妥</p>
              {missingMasteryMode && missingMasteryMode !== mode
                ? <button className="text-button" onClick={advanceAdaptiveStage}>先练{masteryModeLabel(missingMasteryMode)}</button>
                : <button className="text-button" onClick={() => setScreen('home')}><Home size={17} /> 暂时回到首页</button>}
            </>
          ) : masteryModeRound ? (
            <>
              <button className="primary-button" onClick={repeatAdaptiveMode}>{roundMasteryMode === null ? `完整重练${masteryModeLabel(mode === 'listen' ? 'listen' : 'recall')}` : '继续巩固本轮'} <RotateCcw size={18} /></button>
              <p className="enter-hint">{roundMasteryMode === null ? '本轮中途切换过模式，本次只记练习。' : `已独立答对 ${independentRate ?? 0}% · 建议留在当前模式`}</p>
              {missingMasteryMode && missingMasteryMode !== mode
                ? <button className="text-button" onClick={advanceAdaptiveStage}>挑战{masteryModeLabel(missingMasteryMode)}</button>
                : <button className="text-button" onClick={() => setScreen('home')}><Home size={17} /> 暂时回到首页</button>}
            </>
          ) : lessonMasteredAfterRound && adaptiveRound ? (
            <>
              <button className="primary-button" onClick={() => beginAdaptiveRound(lesson.level, practiceTrackForLesson(lesson), 'recall', categoryFilter, sceneFilter)}>开始下一轮 <ArrowRight size={19} /></button>
              <button className="text-button" onClick={() => setScreen('home')}><Home size={17} /> 暂时回到首页</button>
            </>
          ) : lessonMasteredAfterRound && nextLesson ? (
            <>
              <div className="next-lesson-preview"><span>{lesson.level} · {practiceTrackLabel(practiceTrackForLesson(lesson), true)}继续</span><strong>{nextLesson.title}</strong><small>{nextLesson.eyebrow} · {nextLesson.words.length} 项</small></div>
              <button className="primary-button" onClick={() => begin(nextLesson, 'copy')}>继续刷 {lesson.level} <ArrowRight size={19} /></button>
              <button className="text-button" onClick={() => setScreen('home')}><Home size={17} /> 暂时回到首页</button>
            </>
          ) : lessonMasteredAfterRound ? (
            <button className="primary-button" onClick={() => setScreen('home')}>{lesson.level} {practiceTrackLabel(practiceTrackForLesson(lesson), true)}已完成 <Home size={19} /></button>
          ) : (
            <>
              <button className="primary-button" onClick={() => begin(lessons.find((item) => item.id === lesson.id) ?? lesson, nextPracticeMode)}>{nextPracticeButtonLabel} <RotateCcw size={18} /></button>
              <button className="text-button" onClick={() => setScreen('home')}><Home size={17} /> 暂时回到首页</button>
            </>
          )}
        </main>
        {analyticsConsentBanner}
      </div>
    )
  }

  const hideSpanish = mode !== 'copy'
  const isIntroductionPractice = mode === 'copy'
    && activeSession?.followUpMode !== undefined
    && Boolean(activeSession.followUpOrder?.length)
  const targetText = getTypingTarget(word.spanish)
  const targetLetters = Array.from(targetText)
  const targetTokens = targetText.split(' ')
  const typedLength = Array.from(typed).length
  return (
    <div className={`app-shell practice-screen ${keyboardOpen ? 'keyboard-open' : ''}`}>
      <header className="practice-header">
        <button className="practice-home-button" onClick={exitPractice} aria-label="回到首页">
          <Home size={18} />
          <span className="practice-home-label">回到首页</span>
          <span className="practice-home-label-short">首页</span>
        </button>
        <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
        <span className="counter">{index + 1}/{lesson.words.length}</span>
      </header>

      <main ref={practiceMainRef} className="practice-main">
        <div className="practice-controls">
          <div className="mode-switch" role="group" aria-label="练习模式">
            <button aria-pressed={mode === 'copy'} className={mode === 'copy' ? 'active' : ''} onPointerDown={(event) => event.preventDefault()} onClick={() => changeMode('copy')}><Keyboard size={15} />跟打</button>
            <button aria-label="看义拼写：看中文写西语" aria-pressed={mode === 'recall'} className={mode === 'recall' ? 'active' : ''} onPointerDown={(event) => event.preventDefault()} onClick={() => changeMode('recall')}><BookOpen size={15} />看义拼写</button>
            <button aria-label="听音拼写" aria-pressed={mode === 'listen'} className={mode === 'listen' ? 'active' : ''} onPointerDown={(event) => event.preventDefault()} onClick={() => changeMode('listen')}><Headphones size={15} />听音拼写</button>
          </div>

          <div className="live-stats" aria-label="实时训练数据">
            <span><Timer size={14} /><b>{formatTime(elapsedSeconds)}</b><small>用时</small></span>
            <span><Gauge size={14} /><b>{wpm}</b><small>WPM</small></span>
            <span><Check size={14} /><b>{accuracy}%</b><small>正确率</small></span>
            <span><X size={14} /><b>{mistakes}</b><small>错误</small></span>
          </div>

          <div className="spelling-rule">
            <div className="rule-heading"><span>重音</span><small>判定规则</small></div>
            <div className="rule-options" role="group" aria-label="重音判定规则">
              <button aria-label="严格拼写" aria-pressed={accentMode === 'strict'} className={accentMode === 'strict' ? 'active' : ''} onPointerDown={(event) => event.preventDefault()} onClick={() => chooseAccentMode('strict')}>严格</button>
              <button aria-label="忽略重音符号" aria-pressed={accentMode === 'lenient'} className={accentMode === 'lenient' ? 'active' : ''} onPointerDown={(event) => event.preventDefault()} onClick={() => chooseAccentMode('lenient')}>忽略重音</button>
            </div>
          </div>
        </div>

        <section className={`typing-stage ${status} ${targetLetters.length > 18 ? 'long-target' : ''}`} onClick={() => inputRef.current?.focus()}>
          <span className="word-label">{isOnboardingRound
            ? `边打边懂 · 第 ${index + 1}/3 个词`
            : isIntroductionPractice
              ? `新词预热 · ${index + 1}/${lesson.words.length}`
              : mode === 'copy'
                ? '逐字母输入'
                : mode === 'recall'
                  ? `根据中文拼写 · ${targetLetters.length} 个字符`
                  : `仅凭发音拼写 · ${targetLetters.length} 个字符`}</span>
          {mode === 'recall' && <p className="recall-prompt">{word.chinese}</p>}
          <div
            className="letter-word"
            aria-label={hideSpanish ? `${targetLetters.length} 个字符` : word.spanish}
            onPointerDown={startTouchReveal}
            onPointerUp={stopTouchReveal}
            onPointerCancel={stopTouchReveal}
            onPointerLeave={stopTouchReveal}
          >
            {targetTokens.map((token, tokenIndex) => {
              const tokenStart = targetTokens.slice(0, tokenIndex).reduce((total, item) => total + Array.from(item).length + 1, 0)
              const tokenLetters = [...Array.from(token), ...(tokenIndex < targetTokens.length - 1 ? [' '] : [])]
              return (
                <span className="letter-token" key={`${token}-${tokenIndex}`}>
                  {tokenLetters.map((letter, localIndex) => {
                    const letterIndex = tokenStart + localIndex
                    const isSpace = letter === ' '
                    const isCorrect = letterIndex < typedLength
                    const isWrong = status === 'wrong' && wrongAt === letterIndex
                    const isVisible = !hideSpanish || isCorrect || revealAnswer
                    return (
                      <span
                        key={`${letter}-${letterIndex}`}
                        className={`letter-slot ${isSpace ? 'space' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''} ${letterIndex === typedLength && status === 'idle' ? 'current' : ''}`}
                      >
                        {isSpace ? '·' : isVisible ? letter : '_'}
                      </span>
                    )
                  })}
                </span>
              )
            })}
          </div>
          <input
            key={`${lesson.id}-${index}`}
            ref={inputRef}
            id="typing-input"
            className="keyboard-capture"
            value={inputDraft}
            onChange={(event) => {
              if (isComposingRef.current || (event.nativeEvent as InputEvent).isComposing) {
                setInputDraft(event.target.value)
                return
              }
              if (compositionCommittedValueRef.current === event.target.value) {
                compositionCommittedValueRef.current = null
                return
              }
              compositionCommittedValueRef.current = null
              handleCommittedInput(event.target.value)
            }}
            onCompositionStart={() => {
              cancelPressHoldReplacement()
              isComposingRef.current = true
              compositionCommittedValueRef.current = null
            }}
            onCompositionEnd={(event) => {
              isComposingRef.current = false
              compositionCommittedValueRef.current = event.currentTarget.value
              handleCommittedInput(event.currentTarget.value)
            }}
            onBlur={() => {
              cancelPressHoldReplacement()
              setInputDraft(typed)
              isComposingRef.current = false
              compositionCommittedValueRef.current = null
              setInputFocused(false)
            }}
            onFocus={() => {
              setInputFocused(true)
              window.requestAnimationFrame(() => practiceMainRef.current?.scrollTo({ top: 0, behavior: 'auto' }))
            }}
            onKeyDown={(event) => {
              if (event.key === 'Backspace') event.preventDefault()
              if (event.key !== 'Enter') return
              event.preventDefault()
              if (status !== 'idle' || event.repeat || event.nativeEvent.isComposing || isComposingRef.current) return
              replayCurrentPronunciation()
            }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            inputMode="text"
            autoFocus
            aria-label="逐字母输入"
          />
          <div className="pronunciation-controls" role="group" aria-label="西语发音控制">
            <button
              className="pronunciation-button"
              onPointerDown={(event) => event.preventDefault()}
              onClick={(event) => {
                event.stopPropagation()
                replayCurrentPronunciation()
              }}
              aria-label={mode === 'recall' ? `播放发音提示，当前项不计独立答对，${speechRate} 倍速，快捷键 Enter` : `重听西语发音，不影响听写判定，${speechRate} 倍速，快捷键 Enter`}
            >
              <Volume2 size={19} />
              <span>{mode === 'recall' ? '发音提示' : '重听发音'}</span>
              <kbd>Enter</kbd>
            </button>
            <button
              className="speech-rate-button"
              onPointerDown={(event) => event.preventDefault()}
              onClick={(event) => {
                event.stopPropagation()
                cyclePracticeSpeechRate()
              }}
              aria-label={`切换发音速度，当前${SPEECH_RATE_OPTIONS.find((option) => option.value === speechRate)?.label ?? '标准'}${speechRate}倍；点击切换并重听`}
            >
              <span>语速</span>
              <b>{speechRate}×</b>
            </button>
          </div>
          {(mode === 'copy' || status === 'correct') && (
            <p className={`translation ${status === 'correct' && mode !== 'copy' ? 'revealed-meaning' : ''}`}>
              {status === 'correct' && mode !== 'copy' && <span>意思</span>}
              {word.chinese}
            </p>
          )}

          <div className="accent-strip" aria-label="西语特殊字符">
            {ACCENTS.map((character) => <button type="button" key={character} onMouseDown={(event) => event.preventDefault()} onClick={() => insertAccent(character)}>{character}</button>)}
          </div>
          <div className="typing-feedback" aria-live="polite">
            {status === 'wrong' && <><X size={16} /><strong>这个字母错了，整词重来</strong></>}
            {status === 'correct' && <><Check size={16} /><strong>¡Perfecto! · 已显示词义</strong></>}
            {status === 'idle' && <span>{roundMasteryMode === null && mode !== 'copy' ? '本轮切换过模式，只计练习' : roundUsedHint && mode !== 'copy' ? '本轮已使用提示，只计练习' : hideSpanish ? isTouchDevice ? '长按查看拼写 · 使用提示不计通过' : '按住 Tab 查看拼写 · 使用提示不计通过' : '错一个字母，当前词从头重来'}</span>}
          </div>
        </section>
      </main>

      <footer className="practice-footer">
        <button className="keyboard-prompt" onClick={() => inputRef.current?.focus()}>
          <Keyboard size={18} />
          <span>{status === 'wrong' ? '正在重置…' : status === 'correct' ? '正确，查看词义后进入下一个…' : inputFocused ? '键盘已就绪，直接输入' : '键盘未出现？点一下继续'}</span>
        </button>
      </footer>
      {analyticsConsentBanner}
    </div>
  )
}

export default App
