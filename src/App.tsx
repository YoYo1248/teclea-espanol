import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
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
  Timer,
  VolumeX,
  Volume2,
  X,
} from 'lucide-react'
import { FREQUENCY_SOURCE, lessonKinds, lessonLevels, lessons, PHRASE_SOURCE, SPORTS_SOURCE, totalPracticeCards, WORD_SOURCE, type Lesson, type LessonKind, type LessonLevel, type LessonScene } from './data'
import { filterEnglish, lessonEnglishCopy, type DisplayLanguage, type SpeechRate } from './english'
import { createSyncQr, formatSyncCode, generateSyncCode, normalizeSyncCode, pullSync, pushSync, SYNC_CODE_KEY, type SyncSnapshot } from './sync'

type Screen = 'home' | 'practice' | 'complete'
type Mode = 'copy' | 'recall' | 'listen'
type AccentMode = 'strict' | 'lenient'
type PracticeState = {
  lastMode: Mode
  lastLessonId: string
  dailyWords: Record<string, number>
}
type MistakeRecord = {
  lessonId: string
  spanish: string
  chinese: string
  english?: string
  count: number
  lastWrongAt: number
  lastMode: Mode
  cleanRounds?: number
  lastReviewedAt?: number
  masteredAt?: number
}
type ReviewOutcome = { mastered: number; remaining: number; hadErrors: boolean }
type SceneFilter = '全部' | '日常交流' | '生活办事' | '出行旅游' | '学习工作' | '驾考' | '球类' | '语法'

const ACCENTS = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ']
const LENIENT_ACCENTS: Record<string, string> = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' }
const SCENE_FILTERS: SceneFilter[] = ['全部', '日常交流', '生活办事', '出行旅游', '学习工作', '驾考', '球类', '语法']
const SCENES_BY_FILTER: Record<Exclude<SceneFilter, '全部'>, LessonScene[]> = {
  日常交流: ['基础', '日常', '时间', '家庭'],
  生活办事: ['餐厅', '购物', '住宿', '健康'],
  出行旅游: ['城市', '旅行'],
  学习工作: ['学习', '工作'],
  驾考: ['驾考'],
  球类: ['球类'],
  语法: ['语法'],
}
const PRACTICE_STATE_KEY = 'teclea-practice-state'
const MISTAKE_BANK_KEY = 'teclea-mistake-bank'
const LOCAL_UPDATED_KEY = 'teclea-local-updated-at'

function matchesSceneFilter(scene: LessonScene, filter: SceneFilter) {
  return filter === '全部' || SCENES_BY_FILTER[filter].includes(scene)
}

function initialSyncCode() {
  const hashCode = new URLSearchParams(window.location.hash.replace(/^#/, '')).get('sync')
  const code = normalizeSyncCode(hashCode ?? localStorage.getItem(SYNC_CODE_KEY) ?? '')
  if (hashCode) history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
  return code.length === 20 ? code : ''
}

function initialLocalUpdatedAt() {
  const stored = Number(localStorage.getItem(LOCAL_UPDATED_KEY))
  if (stored > 0) return stored
  const hasLegacyProgress = [PRACTICE_STATE_KEY, MISTAKE_BANK_KEY, 'teclea-completed'].some((key) => localStorage.getItem(key) !== null)
  return hasLegacyProgress ? Date.now() : 0
}

function mergeDailyWords(local: Record<string, number>, remote: Record<string, number>) {
  const merged = { ...local }
  Object.entries(remote).forEach(([date, count]) => { merged[date] = Math.max(merged[date] ?? 0, count) })
  return merged
}

function recordActivity(record: MistakeRecord) {
  return Math.max(record.lastWrongAt, record.lastReviewedAt ?? 0, record.masteredAt ?? 0)
}

function mergeMistakeBanks(local: Record<string, MistakeRecord>, remote: Record<string, MistakeRecord>) {
  const merged = { ...local }
  Object.entries(remote).forEach(([key, remoteRecord]) => {
    const localRecord = merged[key]
    if (!localRecord) {
      merged[key] = remoteRecord
      return
    }
    const newest = recordActivity(remoteRecord) > recordActivity(localRecord) ? remoteRecord : localRecord
    merged[key] = { ...newest, count: Math.max(localRecord.count, remoteRecord.count), lastWrongAt: Math.max(localRecord.lastWrongAt, remoteRecord.lastWrongAt) }
  })
  return merged
}

function mergeSnapshots(local: SyncSnapshot, remote: SyncSnapshot): SyncSnapshot {
  const remoteIsNewer = remote.updatedAt > local.updatedAt
  return {
    version: 1,
    updatedAt: Math.max(local.updatedAt, remote.updatedAt, Date.now()),
    practiceState: {
      ...(remoteIsNewer ? remote.practiceState : local.practiceState),
      dailyWords: mergeDailyWords(local.practiceState.dailyWords, remote.practiceState.dailyWords),
    },
    mistakeBank: mergeMistakeBanks(local.mistakeBank, remote.mistakeBank),
    completed: Array.from(new Set([...local.completed, ...remote.completed])),
    accentMode: remoteIsNewer ? remote.accentMode : local.accentMode,
    soundEnabled: remoteIsNewer ? remote.soundEnabled : local.soundEnabled,
    displayLanguage: remoteIsNewer ? (remote.displayLanguage ?? local.displayLanguage) : local.displayLanguage,
    speechRate: remoteIsNewer ? (remote.speechRate ?? local.speechRate) : local.speechRate,
  }
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function readPracticeState(): PracticeState {
  const fallback: PracticeState = { lastMode: 'copy', lastLessonId: lessons[0].id, dailyWords: {} }
  try {
    const stored = JSON.parse(localStorage.getItem(PRACTICE_STATE_KEY) || '{}') as Partial<PracticeState>
    const lastMode = stored.lastMode === 'recall' || stored.lastMode === 'listen' ? stored.lastMode : 'copy'
    const lastLessonId = lessons.some((item) => item.id === stored.lastLessonId) ? stored.lastLessonId! : fallback.lastLessonId
    const dailyWords = stored.dailyWords && typeof stored.dailyWords === 'object' ? stored.dailyWords : {}
    return { lastMode, lastLessonId, dailyWords }
  } catch {
    return fallback
  }
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
    const stored = JSON.parse(localStorage.getItem(MISTAKE_BANK_KEY) || '{}') as Record<string, MistakeRecord>
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {}
    return Object.fromEntries(Object.entries(stored)
      .filter(([, item]) => item && typeof item.spanish === 'string' && typeof item.chinese === 'string' && typeof item.count === 'number')
      .map(([key, item]) => {
        const currentWord = lessons.find((lesson) => lesson.id === item.lessonId)?.words.find((word) => word.spanish === item.spanish)
        return [key, { ...item, english: item.english ?? currentWord?.english }]
      }))
  } catch {
    return {}
  }
}

function normalize(value: string) {
  return value.toLocaleLowerCase('es-ES').normalize('NFC')
}

function getTypingTarget(value: string) {
  return normalize(value).replace(/[¿?¡!.,;:]/g, '').replace(/\s+/g, ' ').trim()
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

function spanishVoiceScore(voice: SpeechSynthesisVoice) {
  const language = voice.lang.toLowerCase()
  const name = voice.name.toLowerCase()
  let score = language === 'es-es' ? 100 : language.startsWith('es') ? 60 : 0
  if (/(mónica|monica|jorge|paulina|natural|premium|enhanced|siri|google español)/i.test(name)) score += 35
  if (voice.localService) score += 5
  return score
}

function speak(text: string, rate: SpeechRate, onDone?: () => void) {
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
  const initialPracticeStateRef = useRef<PracticeState | null>(null)
  if (initialPracticeStateRef.current === null) initialPracticeStateRef.current = readPracticeState()
  const initialPracticeState = initialPracticeStateRef.current
  const [screen, setScreen] = useState<Screen>('home')
  const [practiceState, setPracticeState] = useState<PracticeState>(initialPracticeState)
  const [lesson, setLesson] = useState<Lesson>(() => lessons.find((item) => item.id === initialPracticeState.lastLessonId) ?? lessons[0])
  const [mode, setMode] = useState<Mode>(initialPracticeState.lastMode)
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [inputDraft, setInputDraft] = useState('')
  const [mistakes, setMistakes] = useState(0)
  const [status, setStatus] = useState<'idle' | 'wrong' | 'correct'>('idle')
  const [wrongAt, setWrongAt] = useState<number | null>(null)
  const [revealAnswer, setRevealAnswer] = useState(false)
  const [isTouchDevice] = useState(() => window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0)
  const [accentMode, setAccentMode] = useState<AccentMode>(() => localStorage.getItem('teclea-accent-mode') === 'lenient' ? 'lenient' : 'strict')
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('teclea-sound-enabled') !== 'false')
  const [displayLanguage, setDisplayLanguage] = useState<DisplayLanguage>(() => localStorage.getItem('teclea-display-language') === 'en' ? 'en' : 'zh')
  const [speechRate, setSpeechRate] = useState<SpeechRate>(() => {
    const stored = Number(localStorage.getItem('teclea-speech-rate'))
    return stored === 0.7 || stored === 1 ? stored : 0.86
  })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [mistakesOpen, setMistakesOpen] = useState(false)
  const [syncCode, setSyncCode] = useState(initialSyncCode)
  const [syncInput, setSyncInput] = useState('')
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle')
  const [syncMessage, setSyncMessage] = useState('')
  const [syncQr, setSyncQr] = useState('')
  const [showSyncCode, setShowSyncCode] = useState(false)
  const [syncLastAt, setSyncLastAt] = useState<number | null>(null)
  const [levelFilter, setLevelFilter] = useState<'全部' | LessonLevel>('全部')
  const [kindFilter, setKindFilter] = useState<'全部' | LessonKind>('全部')
  const [sceneFilter, setSceneFilter] = useState<SceneFilter>('全部')
  const [inputEpoch, setInputEpoch] = useState(0)
  const [inputFocused, setInputFocused] = useState(false)
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0)
  const [completedWords, setCompletedWords] = useState(0)
  const [mistakeWords, setMistakeWords] = useState<Record<string, number>>({})
  const [reviewOutcome, setReviewOutcome] = useState<ReviewOutcome | null>(null)
  const [mistakeBank, setMistakeBank] = useState<Record<string, MistakeRecord>>(readMistakeBank)
  const [timerNow, setTimerNow] = useState(Date.now())
  const [finalElapsedSeconds, setFinalElapsedSeconds] = useState(0)
  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('teclea-completed') || '[]')
    } catch {
      return []
    }
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const resetTimerRef = useRef<number | undefined>(undefined)
  const revealTimerRef = useRef<number | undefined>(undefined)
  const isComposingRef = useRef(false)
  const compositionCommittedValueRef = useRef<string | null>(null)
  const flowTokenRef = useRef(0)
  const reviewErrorsRef = useRef<Set<string>>(new Set())
  const localUpdatedAtRef = useRef(initialLocalUpdatedAt())
  const syncCodeRef = useRef(syncCode)
  const latestSnapshotRef = useRef<SyncSnapshot | null>(null)
  const syncTimerRef = useRef<number | undefined>(undefined)
  const syncRunningRef = useRef(false)
  const syncInitializedRef = useRef(false)
  const sessionStartedAtRef = useRef<number | null>(null)
  const keyAudioRef = useRef<HTMLAudioElement | null>(null)
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null)
  const completeAudioRef = useRef<HTMLAudioElement | null>(null)
  const fullViewportHeightRef = useRef(window.visualViewport?.height ?? window.innerHeight)

  const word = lesson.words[index]
  const progress = ((index + (status === 'correct' ? 1 : 0)) / lesson.words.length) * 100

  syncCodeRef.current = syncCode
  latestSnapshotRef.current = {
    version: 1,
    updatedAt: localUpdatedAtRef.current,
    practiceState,
    mistakeBank,
    completed,
    accentMode,
    soundEnabled,
    displayLanguage,
    speechRate,
  }

  useEffect(() => {
    if (screen === 'practice') setTimeout(() => inputRef.current?.focus(), 120)
  }, [screen, index])

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
    window.clearTimeout(revealTimerRef.current)
    window.clearTimeout(syncTimerRef.current)
  }, [])

  useEffect(() => {
    if (!syncCodeRef.current) return
    void syncNow(syncCodeRef.current, true)
  }, [])

  useEffect(() => {
    if (!showSyncCode || !syncCode) {
      setSyncQr('')
      return
    }
    void createSyncQr(syncCode).then(setSyncQr).catch(() => setSyncQr(''))
  }, [showSyncCode, syncCode])

  useEffect(() => {
    if (screen !== 'practice') return
    const showOnTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      event.preventDefault()
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
  }, [screen])

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
    if (screen === 'practice' && mode !== 'copy') speak(word.spanish, speechRate)
  }, [screen, mode, index, word.spanish, speechRate])

  useEffect(() => {
    document.documentElement.lang = displayLanguage === 'en' ? 'en' : 'zh-CN'
  }, [displayLanguage])

  const todayDone = practiceState.dailyWords[localDateKey()] ?? 0
  const streak = useMemo(() => learningStreak(practiceState.dailyWords), [practiceState.dailyWords])
  const filteredLessons = useMemo(
    () => lessons.filter((item) => (levelFilter === '全部' || item.level === levelFilter) && (kindFilter === '全部' || item.kind === kindFilter) && matchesSceneFilter(item.scene, sceneFilter)),
    [levelFilter, kindFilter, sceneFilter],
  )
  const activeMistakeEntries = useMemo(
    () => Object.entries(mistakeBank)
      .filter(([, record]) => !record.masteredAt)
      .sort(([, left], [, right]) => right.count - left.count || right.lastWrongAt - left.lastWrongAt),
    [mistakeBank],
  )
  const mistakeLesson = useMemo<Lesson | null>(() => {
    if (!activeMistakeEntries.length) return null
    const reviewQueue = [0, 1, 2].flatMap((round) => activeMistakeEntries.filter(([, record]) => round < (record.count >= 6 ? 3 : record.count >= 3 ? 2 : 1)))
    return {
      id: 'mistake-review',
      level: 'A1',
      scene: '基础',
      kind: '短句',
      eyebrow: '错题库 · 按错误次数与最近出错排序',
      title: '错题复习',
      description: '高错词重复出现，连续两轮零错误后掌握',
      color: '#b9674f',
      words: reviewQueue.map(([reviewKey, record]) => {
        const originalLesson = lessons.find((item) => item.id === record.lessonId)
        const originalWord = originalLesson?.words.find((item) => item.spanish === record.spanish)
        return originalWord
          ? { ...originalWord, reviewKey }
          : { spanish: record.spanish, chinese: record.chinese, english: record.english ?? record.chinese, reviewKey, source: { ...PHRASE_SOURCE } }
      }),
    }
  }, [activeMistakeEntries])
  const activeMistakeCount = activeMistakeEntries.length
  const masteredMistakeCount = useMemo(() => Object.values(mistakeBank).filter((item) => item.masteredAt).length, [mistakeBank])
  const mistakeAttempts = useMemo(() => Object.values(mistakeBank).reduce((total, item) => total + item.count, 0), [mistakeBank])

  const elapsedSeconds = screen === 'complete'
    ? finalElapsedSeconds
    : sessionStartedAtRef.current
      ? Math.max(1, Math.floor((timerNow - sessionStartedAtRef.current) / 1000))
      : 0
  const totalKeystrokes = correctKeystrokes + mistakes
  const accuracy = totalKeystrokes ? Math.round(correctKeystrokes / totalKeystrokes * 100) : 100
  const wpm = elapsedSeconds ? Math.round((correctKeystrokes / 5) / (elapsedSeconds / 60)) : 0
  const isEnglish = displayLanguage === 'en'
  const tr = (chinese: string, english: string) => isEnglish ? english : chinese
  const wordMeaning = (item: { chinese: string; english?: string }) => isEnglish ? (item.english || item.chinese) : item.chinese
  const localizedLesson = (item: Lesson) => {
    if (!isEnglish) return { title: item.title, description: item.description, eyebrow: item.eyebrow }
    if (item.id === 'mistake-review') return { title: 'Mistake review', description: 'Hard items repeat until you complete two clean rounds', eyebrow: 'Mistakes · priority review' }
    const tense = item.id.startsWith('conjugation-') ? item.id.split('-')[1] : undefined
    const group = Number(item.title.match(/\d+/)?.[0] ?? 1)
    return lessonEnglishCopy(item.id, { title: item.title, description: item.description, level: item.level }, tense, group)
  }

  function playEffect(type: 'key' | 'wrong' | 'complete') {
    if (!soundEnabled) return
    const audio = type === 'key' ? keyAudioRef.current : type === 'wrong' ? wrongAudioRef.current : completeAudioRef.current
    if (!audio) return
    audio.currentTime = 0
    void audio.play().catch(() => undefined)
  }

  function scheduleSync() {
    localUpdatedAtRef.current = Date.now()
    localStorage.setItem(LOCAL_UPDATED_KEY, String(localUpdatedAtRef.current))
    if (!syncCodeRef.current || !syncInitializedRef.current) return
    window.clearTimeout(syncTimerRef.current)
    syncTimerRef.current = window.setTimeout(() => void syncNow(syncCodeRef.current), 1400)
  }

  function applySyncSnapshot(snapshot: SyncSnapshot) {
    localUpdatedAtRef.current = snapshot.updatedAt
    localStorage.setItem(LOCAL_UPDATED_KEY, String(snapshot.updatedAt))
    localStorage.setItem(PRACTICE_STATE_KEY, JSON.stringify(snapshot.practiceState))
    localStorage.setItem(MISTAKE_BANK_KEY, JSON.stringify(snapshot.mistakeBank))
    localStorage.setItem('teclea-completed', JSON.stringify(snapshot.completed))
    localStorage.setItem('teclea-accent-mode', snapshot.accentMode)
    localStorage.setItem('teclea-sound-enabled', String(snapshot.soundEnabled))
    const nextLanguage = snapshot.displayLanguage ?? displayLanguage
    const nextSpeechRate = snapshot.speechRate ?? speechRate
    localStorage.setItem('teclea-display-language', nextLanguage)
    localStorage.setItem('teclea-speech-rate', String(nextSpeechRate))
    setPracticeState(snapshot.practiceState)
    setMistakeBank(snapshot.mistakeBank)
    setCompleted(snapshot.completed)
    setAccentMode(snapshot.accentMode)
    setSoundEnabled(snapshot.soundEnabled)
    setDisplayLanguage(nextLanguage)
    setSpeechRate(nextSpeechRate)
    setLesson(lessons.find((item) => item.id === snapshot.practiceState.lastLessonId) ?? lessons[0])
    setMode(snapshot.practiceState.lastMode)
  }

  async function syncNow(code = syncCodeRef.current, initial = false) {
    const normalized = normalizeSyncCode(code)
    if (normalized.length !== 20 || syncRunningRef.current || !latestSnapshotRef.current) return
    syncRunningRef.current = true
    setSyncStatus('syncing')
    setSyncMessage(tr('正在合并两台设备的学习记录…', 'Merging learning records from both devices…'))
    try {
      const local = latestSnapshotRef.current
      const remote = await pullSync(normalized)
      const merged = remote ? mergeSnapshots(local, remote) : { ...local, updatedAt: Math.max(local.updatedAt, Date.now()) }
      applySyncSnapshot(merged)
      await pushSync(normalized, merged)
      setSyncCode(normalized)
      syncCodeRef.current = normalized
      localStorage.setItem(SYNC_CODE_KEY, normalized)
      setSyncLastAt(Date.now())
      setSyncStatus('synced')
      setSyncMessage(remote ? tr('学习进度已合并并同步。', 'Learning progress merged and synced.') : tr('同步空间已创建。', 'Sync space created.'))
    } catch (error) {
      setSyncStatus('error')
      setSyncMessage(isEnglish ? 'Sync failed. Please try again.' : error instanceof Error ? error.message : '同步失败，请稍后再试')
    } finally {
      syncRunningRef.current = false
      syncInitializedRef.current = true
      if (initial && !localStorage.getItem(SYNC_CODE_KEY)) setSyncCode('')
    }
  }

  function createSyncSpace() {
    const code = generateSyncCode()
    setSyncCode(code)
    syncCodeRef.current = code
    localStorage.setItem(SYNC_CODE_KEY, code)
    setShowSyncCode(true)
    void syncNow(code)
  }

  function connectSyncSpace() {
    const code = normalizeSyncCode(syncInput)
    if (code.length !== 20) {
      setSyncStatus('error')
      setSyncMessage(tr('请输入完整的20位同步码。', 'Enter the complete 20-character sync code.'))
      return
    }
    setSyncCode(code)
    syncCodeRef.current = code
    localStorage.setItem(SYNC_CODE_KEY, code)
    setSyncInput('')
    setShowSyncCode(false)
    void syncNow(code)
  }

  function stopSync() {
    window.clearTimeout(syncTimerRef.current)
    localStorage.removeItem(SYNC_CODE_KEY)
    syncCodeRef.current = ''
    syncInitializedRef.current = false
    setSyncCode('')
    setSyncStatus('idle')
    setSyncMessage(tr('已停止同步；本机学习记录仍会保留。', 'Sync stopped. This device keeps its learning records.'))
    setShowSyncCode(false)
  }

  async function copySyncCode() {
    if (!syncCode) return
    try {
      await navigator.clipboard.writeText(formatSyncCode(syncCode))
      setSyncMessage(tr('同步码已复制。', 'Sync code copied.'))
    } catch {
      setSyncMessage(tr('无法自动复制，请长按同步码复制。', 'Could not copy automatically. Press and hold the code to copy it.'))
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

  function recordMistake() {
    const reviewKey = word.reviewKey ?? `${lesson.id}::${getTypingTarget(word.spanish)}`
    saveMistakeBank((current) => ({
      ...current,
      [reviewKey]: {
        lessonId: current[reviewKey]?.lessonId ?? lesson.id,
        spanish: word.spanish,
        chinese: word.chinese,
        english: word.english,
        count: (current[reviewKey]?.count ?? 0) + 1,
        lastWrongAt: Date.now(),
        lastMode: mode,
        cleanRounds: 0,
        masteredAt: undefined,
      },
    }))
  }

  function finishMistakeReview() {
    const reviewedKeys = Array.from(new Set(lesson.words.flatMap((item) => item.reviewKey ? [item.reviewKey] : [])))
    const errorKeys = reviewErrorsRef.current
    const now = Date.now()
    let mastered = 0
    let remaining = 0
    const next = { ...mistakeBank }
    reviewedKeys.forEach((reviewKey) => {
      const record = next[reviewKey]
      if (!record) return
      const cleanRounds = errorKeys.has(reviewKey) ? 0 : (record.cleanRounds ?? 0) + 1
      const masteredAt = cleanRounds >= 2 ? now : undefined
      if (masteredAt) mastered += 1
      else remaining += 1
      next[reviewKey] = { ...record, cleanRounds, lastReviewedAt: now, masteredAt }
    })
    saveMistakeBank(() => next)
    setReviewOutcome({ mastered, remaining, hadErrors: errorKeys.size > 0 })
  }

  function recordCompletedWord() {
    const today = localDateKey()
    savePracticeState((current) => ({
      ...current,
      dailyWords: { ...current.dailyWords, [today]: (current.dailyWords[today] ?? 0) + 1 },
    }))
  }

  function chooseLevelFilter(nextLevel: '全部' | LessonLevel) {
    setLevelFilter(nextLevel)
    if (nextLevel !== '全部' && sceneFilter !== '全部' && !lessons.some((item) => item.level === nextLevel && matchesSceneFilter(item.scene, sceneFilter))) {
      setSceneFilter('全部')
    }
  }

  function chooseKindFilter(nextKind: '全部' | LessonKind) {
    setKindFilter(nextKind)
    if (nextKind !== '全部' && sceneFilter !== '全部' && !lessons.some((item) => item.kind === nextKind && matchesSceneFilter(item.scene, sceneFilter))) {
      setSceneFilter('全部')
    }
  }

  function chooseSceneFilter(nextScene: SceneFilter) {
    setSceneFilter(nextScene)
    if (nextScene !== '全部' && levelFilter !== '全部' && !lessons.some((item) => matchesSceneFilter(item.scene, nextScene) && item.level === levelFilter)) {
      setLevelFilter('全部')
    }
    if (nextScene !== '全部' && kindFilter !== '全部' && !lessons.some((item) => matchesSceneFilter(item.scene, nextScene) && item.kind === kindFilter)) {
      setKindFilter('全部')
    }
  }

  function begin(nextLesson: Lesson, nextMode: Mode = mode) {
    flowTokenRef.current += 1
    window.clearTimeout(resetTimerRef.current)
    isComposingRef.current = false
    compositionCommittedValueRef.current = null
    setLesson(nextLesson)
    setMode(nextMode)
    savePracticeState((current) => ({
      ...current,
      lastLessonId: lessons.some((item) => item.id === nextLesson.id) ? nextLesson.id : current.lastLessonId,
      lastMode: nextMode,
    }))
    setIndex(0)
    setTyped('')
    setInputDraft('')
    setMistakes(0)
    setCorrectKeystrokes(0)
    setCompletedWords(0)
    setMistakeWords({})
    setReviewOutcome(null)
    reviewErrorsRef.current = new Set()
    setFinalElapsedSeconds(0)
    sessionStartedAtRef.current = null
    setTimerNow(Date.now())
    setStatus('idle')
    setWrongAt(null)
    setRevealAnswer(false)
    setInputEpoch((value) => value + 1)
    setInputFocused(false)
    setScreen('practice')
  }

  function next() {
    flowTokenRef.current += 1
    setCompletedWords((value) => value + 1)
    recordCompletedWord()
    if (index === lesson.words.length - 1) {
      if (lesson.id === 'mistake-review') finishMistakeReview()
      const seconds = sessionStartedAtRef.current ? Math.max(1, Math.round((Date.now() - sessionStartedAtRef.current) / 1000)) : 0
      setFinalElapsedSeconds(seconds)
      if (lessons.some((item) => item.id === lesson.id)) {
        const nextCompleted = Array.from(new Set([...completed, lesson.id]))
        setCompleted(nextCompleted)
        localStorage.setItem('teclea-completed', JSON.stringify(nextCompleted))
        scheduleSync()
      }
      setScreen('complete')
      return
    }
    setIndex((value) => value + 1)
    setTyped('')
    setInputDraft('')
    setStatus('idle')
    setWrongAt(null)
  }

  function changeMode(nextMode: Mode) {
    if (nextMode === mode) return
    flowTokenRef.current += 1
    window.clearTimeout(resetTimerRef.current)
    isComposingRef.current = false
    compositionCommittedValueRef.current = null
    inputRef.current?.blur()
    setMode(nextMode)
    savePracticeState((current) => ({ ...current, lastMode: nextMode }))
    setTyped('')
    setInputDraft('')
    setStatus('idle')
    setWrongAt(null)
    setRevealAnswer(false)
    setInputEpoch((value) => value + 1)
    window.setTimeout(() => inputRef.current?.focus(), 80)
  }

  function chooseAccentMode(nextMode: AccentMode) {
    if (nextMode === accentMode) return
    flowTokenRef.current += 1
    window.clearTimeout(resetTimerRef.current)
    isComposingRef.current = false
    compositionCommittedValueRef.current = null
    inputRef.current?.blur()
    setAccentMode(nextMode)
    localStorage.setItem('teclea-accent-mode', nextMode)
    scheduleSync()
    setTyped('')
    setInputDraft('')
    setStatus('idle')
    setWrongAt(null)
    setInputEpoch((value) => value + 1)
    window.setTimeout(() => inputRef.current?.focus(), 80)
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

  function chooseDisplayLanguage(nextLanguage: DisplayLanguage) {
    setDisplayLanguage(nextLanguage)
    localStorage.setItem('teclea-display-language', nextLanguage)
    document.documentElement.lang = nextLanguage === 'en' ? 'en' : 'zh-CN'
    scheduleSync()
  }

  function chooseSpeechRate(nextRate: SpeechRate) {
    setSpeechRate(nextRate)
    localStorage.setItem('teclea-speech-rate', String(nextRate))
    scheduleSync()
    speak('Hola, ¿cómo estás?', nextRate)
  }

  function handleCharacters(rawValue: string) {
    if (status !== 'idle') return

    if (sessionStartedAtRef.current === null) {
      sessionStartedAtRef.current = Date.now()
      setTimerNow(Date.now())
    }

    const targetCharacters = Array.from(getTypingTarget(word.spanish))
    const currentCharacters = Array.from(normalize(typed))
    const incomingValue = rawValue.toLocaleLowerCase('es-ES').normalize('NFC')
    const incomingCharacters = Array.from(incomingValue)
    if (incomingCharacters.length <= currentCharacters.length) return

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
      if (lesson.id === 'mistake-review' && word.reviewKey) reviewErrorsRef.current.add(word.reviewKey)
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
        const started = speak(word.spanish, speechRate, advance)
        resetTimerRef.current = window.setTimeout(advance, started ? 2600 : minimumFeedbackMs)
      }, 130)
    } else if (newlyCorrect) {
      playEffect('key')
    }
  }

  function insertAccent(character: string) {
    handleCharacters(typed + character)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  function startTouchReveal() {
    window.clearTimeout(revealTimerRef.current)
    revealTimerRef.current = window.setTimeout(() => setRevealAnswer(true), 420)
  }

  function stopTouchReveal() {
    window.clearTimeout(revealTimerRef.current)
    setRevealAnswer(false)
  }

  if (screen === 'home') {
    return (
      <div className="app-shell">
        <header className="topbar">
          <div className="brand-mark">T</div>
          <div className="brand-copy"><strong>Teclea Español</strong><span>{tr('每天敲进一点西语', 'Type a little Spanish every day')}</span></div>
          <button className="icon-button" aria-label={tr('设置', 'Settings')} onClick={() => setSettingsOpen(true)}><Settings2 size={21} /></button>
        </header>

        <main className="home-content">
          <div className="home-overview">
            <section className="hero-card">
              <div className="hero-glow" />
              <div className="streak-pill"><Flame size={15} fill="currentColor" /> {streak > 0 ? tr(`连续学习 ${streak} 天`, `${streak}-day learning streak`) : tr('从今天开始连续学习', 'Start your learning streak today')}</div>
              <p className="eyebrow">BUENOS DÍAS · {tr('早上好', 'GOOD MORNING')}</p>
              <h1>{isEnglish ? <>Build Spanish<br />into <em>muscle</em> memory</> : <>让西语从<br /><em>手指</em>进入记忆</>}</h1>
              <p className="hero-subtitle">{tr(`听、看、完整拼写。${totalPracticeCards} 张高频、对话与变位练习卡，练对重音和真实表达。`, `Listen, read and type every letter. ${totalPracticeCards} cards cover frequent words, real phrases and verb forms.`)}</p>
              <button className="primary-button" onClick={() => begin(lesson)}>
                {tr('继续今日练习', 'Continue today’s practice')} <ArrowRight size={19} />
              </button>
            </section>

            <section className="daily-row">
              <div><span className="section-kicker">{tr('今日进度', 'TODAY')}</span><strong>{todayDone}<small> / 12 {tr('个词', 'items')}</small></strong></div>
              <div className="mini-ring" style={{ '--percent': `${Math.min(todayDone / 12, 1) * 360}deg` } as React.CSSProperties}><span>{Math.min(Math.round(todayDone / 12 * 100), 100)}%</span></div>
            </section>
          </div>

          <div className="home-actions">
            <section className={`mistake-card ${mistakeLesson ? '' : 'empty'}`}>
              <div className="mistake-icon"><RotateCcw size={22} /></div>
              <div><span className="section-kicker">{tr('重点复习 · 错题本', 'PRIORITY REVIEW · MISTAKES')}</span><h3>{mistakeLesson ? tr(`${activeMistakeCount} 个待复习`, `${activeMistakeCount} to review`) : tr('目前没有待复习错题', 'No mistakes to review')}</h3><p>{mistakeAttempts ? tr(`按错误次数优先练习 · 累计错 ${mistakeAttempts} 次 · 已掌握 ${masteredMistakeCount} 个`, `Prioritised by error count · ${mistakeAttempts} total errors · ${masteredMistakeCount} mastered`) : tr('输错的词和短句会自动进入这里，集中重复练习。', 'Mistyped words and phrases appear here automatically for focused review.')}</p></div>
              <button disabled={!mistakeAttempts} aria-label={tr('查看错题库', 'Open mistake review')} onClick={() => setMistakesOpen(true)}><ArrowRight size={19} /></button>
            </section>
          </div>

          <section className="course-section">
            <div className="section-heading"><div><span className="section-kicker">{tr(`开放词库 · ${totalPracticeCards} 张卡`, `OPEN LIBRARY · ${totalPracticeCards} CARDS`)}</span><h2>{tr('按类型、等级与场景选择', 'Choose by type, level and situation')}</h2></div><button onClick={() => { setKindFilter('全部'); setLevelFilter('全部'); setSceneFilter('全部') }}>{tr('重置', 'Reset')}</button></div>
            <div className="course-filters" aria-label={tr('词库筛选', 'Library filters')}>
              <div><span>{tr('类型', 'Type')}</span>{lessonKinds.map((kind) => <button key={kind} className={kindFilter === kind ? 'active' : ''} onClick={() => chooseKindFilter(kind)}>{isEnglish ? filterEnglish.kinds[kind] : kind}</button>)}</div>
              <div><span>{tr('难度', 'Level')}</span>{lessonLevels.map((level) => <button key={level} className={levelFilter === level ? 'active' : ''} onClick={() => chooseLevelFilter(level)}>{isEnglish && level === '全部' ? 'All' : level}</button>)}</div>
              <div><span>{tr('场景', 'Situation')}</span>{SCENE_FILTERS.map((scene) => <button key={scene} className={sceneFilter === scene ? 'active' : ''} onClick={() => chooseSceneFilter(scene)}>{isEnglish ? filterEnglish.scenes[scene] : scene}</button>)}</div>
            </div>
            <div className="lesson-list">
              {filteredLessons.map((item) => {
                const isDone = completed.includes(item.id)
                const itemCopy = localizedLesson(item)
                return (
                  <button className="lesson-card" key={item.id} onClick={() => begin(item)}>
                    <span className="lesson-number" style={{ background: item.color }}>{isDone ? <Check size={19} /> : item.level}</span>
                    <span className="lesson-copy"><small>{itemCopy.eyebrow}</small><strong>{itemCopy.title}</strong><span>{itemCopy.description}</span></span>
                    <span className="lesson-meta"><b>{item.words.length}</b><small>{tr('词', 'items')}</small></span>
                  </button>
                )
              })}
            </div>
            <div className="word-sources">
              <a className="word-source" href={FREQUENCY_SOURCE.url} target="_blank" rel="noreferrer">{tr('词频排序：', 'Frequency order: ')}{FREQUENCY_SOURCE.name} · {isEnglish ? FREQUENCY_SOURCE.license.replace('（数据）', ' (data)') : FREQUENCY_SOURCE.license}</a>
              <a className="word-source" href={WORD_SOURCE.url} target="_blank" rel="noreferrer">{tr('词形与变位：', 'Word forms and conjugations: ')}{WORD_SOURCE.name} · {WORD_SOURCE.license}</a>
              <a className="word-source" href={PHRASE_SOURCE.url} target="_blank" rel="noreferrer">{tr('生活短句：项目原创；驾考表达参考 DGT · 制作说明', 'Life phrases: original project content; driving-test language references DGT · Notes')}</a>
              <a className="word-source" href={SPORTS_SOURCE.url} target="_blank" rel="noreferrer">{tr('球类运动：板式网球参考 FIP / FEP；网球参考 RFET · 制作说明', 'Ball sports: padel references FIP / FEP; tennis references RFET · Notes')}</a>
            </div>
          </section>

          <footer className="project-legal">
            <span>{tr('GPL-3.0 开源项目', 'GPL-3.0 open-source project')}</span>
            <a href="https://github.com/RealKai42/qwerty-learner" target="_blank" rel="noreferrer">{tr('基于 Qwerty Learner 修改', 'Modified from Qwerty Learner')}</a>
          </footer>
        </main>

        {settingsOpen && (
          <div className="modal-backdrop" role="presentation" onClick={() => setSettingsOpen(false)}>
            <section className="settings-sheet" role="dialog" aria-modal="true" aria-label={tr('训练设置', 'Practice settings')} onClick={(event) => event.stopPropagation()}>
              <div className="sheet-handle" />
              <div className="sheet-heading"><div><span className="section-kicker">{tr('训练偏好', 'PREFERENCES')}</span><h2>{tr('学习与发音设置', 'Learning and audio')}</h2></div><button className="icon-button" onClick={() => setSettingsOpen(false)} aria-label={tr('关闭设置', 'Close settings')}><X size={20} /></button></div>
              <div className="setting-choice">
                <span><strong>{tr('显示语言', 'Display language')}</strong><small>{tr('用中文或英文理解西语', 'Learn Spanish through Chinese or English')}</small></span>
                <div className="setting-segments" role="group" aria-label={tr('显示语言', 'Display language')}>
                  <button className={displayLanguage === 'zh' ? 'active' : ''} onClick={() => chooseDisplayLanguage('zh')}>中文</button>
                  <button className={displayLanguage === 'en' ? 'active' : ''} onClick={() => chooseDisplayLanguage('en')}>English</button>
                </div>
              </div>
              <div className="setting-choice">
                <span><strong>{tr('西语语速', 'Spanish speech speed')}</strong><small>{tr('选择后会播放一条试听', 'A sample plays when you choose')}</small></span>
                <div className="setting-segments rate" role="group" aria-label={tr('西语语速', 'Spanish speech speed')}>
                  {([0.7, 0.86, 1] as SpeechRate[]).map((rate) => <button key={rate} className={speechRate === rate ? 'active' : ''} onClick={() => chooseSpeechRate(rate)}>{rate === 0.7 ? tr('慢速', 'Slow') : rate === 0.86 ? tr('标准', 'Standard') : tr('原速', 'Natural')}</button>)}
                </div>
              </div>
              <button className="setting-row" onClick={toggleAccentMode}>
                <span><strong>{tr('重音判定', 'Accent checking')}</strong><small>{tr('ñ、ü 始终作为独立字母', 'ñ and ü always remain distinct letters')}</small></span>
                <b>{accentMode === 'strict' ? tr('严格拼写', 'Strict') : tr('忽略 á é í ó ú', 'Ignore á é í ó ú')}</b>
              </button>
              <button className="setting-row" onClick={toggleSound}>
                <span><strong>{tr('打字音效', 'Typing sounds')}</strong><small>{tr('正确按键、错误和完成提示', 'Feedback for keys, errors and completion')}</small></span>
                <b>{soundEnabled ? tr('已开启', 'On') : tr('已关闭', 'Off')}</b>
              </button>
              <p className="settings-note">{isEnglish ? <>When accents are ignored, <b>camion</b> is accepted for <b>camión</b>; but <b>n</b> cannot replace <b>ñ</b>.</> : <>忽略重音时，输入 <b>camion</b> 可以通过 <b>camión</b>；但 <b>n</b> 不能代替 <b>ñ</b>。</>}</p>
              <div className="sync-box">
                <div className="sync-heading"><span><Cloud size={18} /><strong>{tr('跨设备同步', 'Cross-device sync')}</strong></span><small>{syncCode ? tr('无需账号', 'No account') : tr('手机与电脑共享进度', 'Share progress across devices')}</small></div>
                {syncCode ? (
                  <>
                    <button className="sync-code-toggle" onClick={() => setShowSyncCode((value) => !value)}>
                      <span>{showSyncCode ? formatSyncCode(syncCode) : '•••••-•••••-•••••-•••••'}</span>
                      {showSyncCode ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                    {showSyncCode && (
                      <div className="sync-secret">
                        {syncQr && <img src={syncQr} alt={tr('跨设备同步二维码', 'Cross-device sync QR code')} />}
                        <p>{tr('在另一台设备扫码，或输入上面的同步码。拿到同步码的人可以读取并修改这份学习进度，请不要公开分享。', 'Scan on another device or enter the code above. Anyone with this code can read and change this learning record, so keep it private.')}</p>
                      </div>
                    )}
                    <div className="sync-actions">
                      <button onClick={copySyncCode}><Copy size={15} />{tr('复制同步码', 'Copy code')}</button>
                      <button onClick={() => void syncNow()} disabled={syncStatus === 'syncing'}><RotateCcw size={15} />{tr('立即同步', 'Sync now')}</button>
                      <button className="danger" onClick={stopSync}>{tr('停止', 'Stop')}</button>
                    </div>
                  </>
                ) : (
                  <>
                    <button className="sync-create" onClick={createSyncSpace}>{tr('创建我的同步空间', 'Create my sync space')}</button>
                    <div className="sync-connect">
                      <input value={syncInput} onChange={(event) => setSyncInput(formatSyncCode(event.target.value))} placeholder={tr('输入另一台设备的同步码', 'Enter a sync code')} inputMode="text" autoCapitalize="characters" />
                      <button onClick={connectSyncSpace}>{tr('连接', 'Connect')}</button>
                    </div>
                  </>
                )}
                {syncMessage && <p className={`sync-message ${syncStatus}`}>{syncMessage}{syncLastAt && syncStatus === 'synced' ? ` · ${new Date(syncLastAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}` : ''}</p>}
              </div>
              <div className="legal-box">
                <strong>{tr('开源与修改声明', 'Open-source notice')}</strong>
                <p>{tr('本项目是基于 Qwerty Learner 训练机制制作的手机西语修改版本，2026-08-14 起修改，并以 GPL-3.0 发布。无担保；源码入口放在这里，不占用首页。', 'This mobile-first Spanish adaptation uses the Qwerty Learner training mechanism. Modified since 14 August 2026 and released under GPL-3.0, without warranty.')}</p>
                <div className="legal-links">
                  <a href="https://github.com/YoYo1248/teclea-espanol" target="_blank" rel="noreferrer">{tr('本项目源代码', 'Project source')}</a>
                  <a href="https://github.com/RealKai42/qwerty-learner" target="_blank" rel="noreferrer">{tr('上游项目', 'Upstream project')}</a>
                  <a href="https://github.com/YoYo1248/teclea-espanol/blob/main/DATA_LICENSE.md" target="_blank" rel="noreferrer">{tr('词库许可', 'Word-list licences')}</a>
                </div>
              </div>
            </section>
          </div>
        )}

        {mistakesOpen && (
          <div className="modal-backdrop" role="presentation" onClick={() => setMistakesOpen(false)}>
            <section className="mistake-sheet" role="dialog" aria-modal="true" aria-label={tr('错题库', 'Mistake review')} onClick={(event) => event.stopPropagation()}>
              <div className="sheet-handle" />
              <div className="sheet-heading"><div><span className="section-kicker">{tr('累计错误记录', 'CUMULATIVE ERRORS')}</span><h2>{tr('错题库', 'Mistake review')}</h2></div><button className="icon-button" onClick={() => setMistakesOpen(false)} aria-label={tr('关闭错题库', 'Close mistake review')}><X size={20} /></button></div>
              <div className="mistake-strategy">
                <strong>{tr('怎么安排复习', 'How review is scheduled')}</strong>
                <p>{tr('每次错误都会累计。错3次以上会在一轮中出现2次，错6次以上出现3次；按错误次数优先，再看最近出错时间。连续两轮复习零错误后标记为已掌握，再次出错会自动回来。', 'Every error counts. Items with 3+ errors appear twice per round; 6+ errors appear three times. More frequent and recent errors come first. Two clean rounds mark an item mastered, and a later error brings it back.')}</p>
              </div>
              <div className="mistake-bank-stats"><span><b>{activeMistakeCount}</b>{tr('待复习', 'to review')}</span><span><b>{mistakeAttempts}</b>{tr('累计错误', 'total errors')}</span><span><b>{masteredMistakeCount}</b>{tr('已掌握', 'mastered')}</span></div>
              <div className="mistake-bank-list">
                {activeMistakeEntries.length ? activeMistakeEntries.slice(0, 30).map(([key, record]) => (
                  <div className="mistake-bank-row" key={key}>
                    <div><strong>{record.spanish}</strong><span>{wordMeaning(record)}</span></div>
                    <small>{tr(`错 ${record.count} 次`, `${record.count} errors`)}<br />{tr('掌握', 'mastery')} {record.cleanRounds ?? 0}/2</small>
                  </div>
                )) : <p className="mistake-empty">{tr('当前错题都已掌握。以后再次输错时会自动回到这里。', 'All current mistakes are mastered. Any item you mistype later will return here.')}</p>}
              </div>
              <button className="primary-button mistake-start" disabled={!mistakeLesson} onClick={() => { setMistakesOpen(false); if (mistakeLesson) begin(mistakeLesson) }}>{tr('开始错题复习', 'Start mistake review')} <ArrowRight size={18} /></button>
            </section>
          </div>
        )}
      </div>
    )
  }

  if (screen === 'complete') {
    return (
      <div className="app-shell completion-screen">
        <main>
          <div className="completion-burst"><span>¡Muy bien!</span><Check size={44} strokeWidth={2.5} /></div>
          <p className="eyebrow">{tr('本组完成', 'SET COMPLETE')}</p>
          <h1>{localizedLesson(lesson).title}</h1>
          <p>{tr(`你完成了 ${lesson.words.length} 个表达，出现 ${mistakes} 次重试。`, `You completed ${lesson.words.length} expressions with ${mistakes} retries.`)}</p>
          {lesson.id === 'mistake-review' && (
            <p className={`review-result ${reviewOutcome && !reviewOutcome.hadErrors ? 'clean' : ''}`}>
              {reviewOutcome?.hadErrors
                ? tr('本轮有表达再次出错，相关词的连续正确进度已重置。', 'Some items were missed again, so their clean-round progress was reset.')
                : reviewOutcome?.mastered
                  ? tr(`${reviewOutcome.mastered} 个表达已连续两轮零错误，标记为已掌握。`, `${reviewOutcome.mastered} items completed two clean rounds and are now mastered.`)
                  : tr('本轮全部正确；再保持一轮零错误即可掌握。', 'A clean round. Complete one more clean round to master these items.')}
            </p>
          )}
          <div className="result-grid">
            <div><strong>{completedWords}</strong><span>{tr('完成词数', 'Items completed')}</span></div>
            <div><strong>{accuracy}%</strong><span>{tr('按键正确率', 'Key accuracy')}</span></div>
            <div><strong>{wpm}</strong><span>WPM</span></div>
            <div><strong>{formatTime(elapsedSeconds)}</strong><span>{tr('总用时', 'Total time')}</span></div>
          </div>
          {Object.keys(mistakeWords).length > 0 && (
            <div className="mistake-summary">
              <span>{tr('需要再练', 'Practise again')}</span>
              {Object.entries(mistakeWords).map(([name, count]) => <b key={name}>{name}<small>{count} {tr('次', 'times')}</small></b>)}
            </div>
          )}
          <button className="primary-button" onClick={() => setScreen('home')}>{tr('回到今天', 'Back to today')} <Home size={19} /></button>
          {lesson.id !== 'mistake-review' && <button className="text-button" onClick={() => begin(lesson, 'listen')}><RotateCcw size={17} /> {tr('切换听写再练一遍', 'Repeat in listening mode')}</button>}
        </main>
      </div>
    )
  }

  const hideSpanish = mode !== 'copy'
  const targetText = getTypingTarget(word.spanish)
  const targetLetters = Array.from(targetText)
  const targetTokens = targetText.split(' ')
  const typedLength = Array.from(typed).length
  return (
    <div className={`app-shell practice-screen ${keyboardOpen ? 'keyboard-open' : ''}`}>
      <header className="practice-header">
        <button className="icon-button" onClick={() => setScreen('home')} aria-label={tr('退出练习', 'Exit practice')}><ArrowLeft size={22} /></button>
        <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
        <span className="counter">{index + 1}/{lesson.words.length}</span>
      </header>

      <main className="practice-main">
        <div className="mode-switch" role="group" aria-label={tr('练习模式', 'Practice mode')}>
          <button className={mode === 'copy' ? 'active' : ''} onClick={() => changeMode('copy')}><Keyboard size={15} />{tr('跟打', 'Copy')}</button>
          <button aria-label={tr('看中文写西语', 'Recall Spanish from the meaning')} className={mode === 'recall' ? 'active' : ''} onClick={() => changeMode('recall')}><BookOpen size={15} />{tr('看中文写', 'Recall')}</button>
          <button className={mode === 'listen' ? 'active' : ''} onClick={() => changeMode('listen')}><Headphones size={15} />{tr('听写', 'Listen')}</button>
        </div>

        <div className="live-stats" aria-label={tr('实时训练数据', 'Live practice statistics')}>
          <span><Timer size={14} /><b>{formatTime(elapsedSeconds)}</b><small>{tr('用时', 'Time')}</small></span>
          <span><Gauge size={14} /><b>{wpm}</b><small>WPM</small></span>
          <span><Check size={14} /><b>{accuracy}%</b><small>{tr('正确率', 'Accuracy')}</small></span>
          <span><X size={14} /><b>{mistakes}</b><small>{tr('错误', 'Errors')}</small></span>
        </div>

        <div className="spelling-rule">
          <div className="rule-heading"><span>{tr('重音', 'Accents')}</span><small>{tr('判定规则', 'Rule')}</small></div>
          <div className="rule-options" role="group" aria-label={tr('重音判定规则', 'Accent checking rule')}>
            <button aria-label={tr('严格拼写', 'Strict spelling')} className={accentMode === 'strict' ? 'active' : ''} onClick={() => chooseAccentMode('strict')}>{tr('严格', 'Strict')}</button>
            <button aria-label={tr('忽略重音符号', 'Ignore accent marks')} className={accentMode === 'lenient' ? 'active' : ''} onClick={() => chooseAccentMode('lenient')}>{tr('忽略重音', 'Ignore')}</button>
          </div>
          <button className="sound-toggle" onClick={toggleSound} aria-label={soundEnabled ? tr('关闭打字音效', 'Turn typing sounds off') : tr('开启打字音效', 'Turn typing sounds on')}>
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
        </div>

        <section className={`typing-stage ${status} ${targetLetters.length > 18 ? 'long-target' : ''}`} onClick={() => inputRef.current?.focus()}>
          <span className="word-label">{mode === 'copy' ? tr('逐字母输入', 'TYPE EVERY LETTER') : mode === 'recall' ? tr('根据中文拼写', 'RECALL FROM THE MEANING') : tr('仅凭发音拼写', 'SPELL FROM AUDIO ONLY')}</span>
          {mode === 'recall' && <p className="recall-prompt">{wordMeaning(word)}</p>}
          <div
            className="letter-word"
            aria-label={hideSpanish ? tr(`${targetLetters.length} 个字符`, `${targetLetters.length} characters`) : word.spanish}
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
            key={`${lesson.id}-${mode}-${inputEpoch}`}
            ref={inputRef}
            id="typing-input"
            className="keyboard-capture"
            value={inputDraft}
            onChange={(event) => {
              setInputDraft(event.target.value)
              if (isComposingRef.current || (event.nativeEvent as InputEvent).isComposing) return
              if (compositionCommittedValueRef.current === event.target.value) {
                compositionCommittedValueRef.current = null
                return
              }
              compositionCommittedValueRef.current = null
              handleCharacters(event.target.value)
            }}
            onCompositionStart={() => {
              isComposingRef.current = true
              compositionCommittedValueRef.current = null
            }}
            onCompositionEnd={(event) => {
              isComposingRef.current = false
              compositionCommittedValueRef.current = event.currentTarget.value
              handleCharacters(event.currentTarget.value)
            }}
            onBlur={() => {
              isComposingRef.current = false
              compositionCommittedValueRef.current = null
              setInputFocused(false)
            }}
            onFocus={() => setInputFocused(true)}
            onKeyDown={(event) => { if (event.key === 'Backspace') event.preventDefault() }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            inputMode="text"
            autoFocus
            aria-label={tr('逐字母输入', 'Type every letter')}
          />
          <button className="sound-button" onClick={(event) => { event.stopPropagation(); speak(word.spanish, speechRate); inputRef.current?.focus() }} aria-label={tr('播放西语发音', 'Play Spanish pronunciation')}><Volume2 size={20} /> <span>ES</span></button>
          {(mode === 'copy' || status === 'correct') && (
            <p className={`translation ${status === 'correct' && mode !== 'copy' ? 'revealed-meaning' : ''}`}>
              {status === 'correct' && mode !== 'copy' && <span>{tr('意思', 'MEANING')}</span>}
              {wordMeaning(word)}
            </p>
          )}

          <div className="accent-strip" aria-label={tr('西语特殊字符', 'Special Spanish characters')}>
            {ACCENTS.map((character) => <button type="button" key={character} onMouseDown={(event) => event.preventDefault()} onClick={() => insertAccent(character)}>{character}</button>)}
          </div>
          <div className="typing-feedback" aria-live="polite">
            {status === 'wrong' && <><X size={16} /><strong>{tr('这个字母错了，整词重来', 'Wrong letter — restart the whole item')}</strong></>}
            {status === 'correct' && <><Check size={16} /><strong>¡Perfecto! · {tr('已显示词义', 'meaning shown')}</strong></>}
            {status === 'idle' && <span>{hideSpanish ? isTouchDevice ? tr('长按字符槽查看拼写', 'Press and hold the letter slots to peek') : tr('按住 Tab 查看拼写', 'Hold Tab to peek at the spelling') : tr('越快、越准，成绩越高', 'Faster and more accurate earns a better score')}</span>}
          </div>
        </section>
      </main>

      <footer className="practice-footer">
        <button className="keyboard-prompt" onClick={() => inputRef.current?.focus()}>
          <Keyboard size={18} />
          <span>{status === 'wrong' ? tr('正在重置…', 'Resetting…') : status === 'correct' ? tr('正确，查看词义后进入下一个…', 'Correct — review the meaning, then continue…') : inputFocused ? tr('键盘已就绪，直接输入', 'Keyboard ready — start typing') : tr('键盘未出现？点一下继续', 'No keyboard? Tap here to continue')}</span>
        </button>
      </footer>
    </div>
  )
}

export default App
