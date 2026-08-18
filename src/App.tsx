import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
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
import { FREQUENCY_SOURCE, INTERMEDIATE_SOURCE, lessonKinds, lessonLevels, lessonScenes, lessons, PHRASE_SOURCE, totalPracticeCards, WORD_SOURCE, type Lesson, type LessonKind, type LessonLevel, type LessonScene } from './data'

type Screen = 'home' | 'practice' | 'complete'
type Mode = 'copy' | 'recall' | 'listen'
type AccentMode = 'strict' | 'lenient'
type SpeechRate = 0.55 | 0.8 | 1
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
}
type MistakeRecord = {
  lessonId: string
  spanish: string
  chinese: string
  count: number
  lastWrongAt: number
  lastMode: Mode
}

const ACCENTS = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ']
const LENIENT_ACCENTS: Record<string, string> = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' }
const PRACTICE_STATE_KEY = 'teclea-practice-state'
const MISTAKE_BANK_KEY = 'teclea-mistake-bank'
const ACTIVE_SESSION_KEY = 'teclea-active-session-v2'
const PAUSED_MAIN_SESSION_KEY = 'teclea-paused-main-session-v2'
const SPEECH_RATE_KEY = 'teclea-speech-rate'
const LESSON_PAGE_SIZE = 12
const SPEECH_RATE_OPTIONS: Array<{ value: SpeechRate; label: string }> = [
  { value: 0.55, label: '慢速' },
  { value: 0.8, label: '标准' },
  { value: 1, label: '快速' },
]

function localDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function readInitialLevelFilter(): '全部' | LessonLevel {
  const level = new URLSearchParams(window.location.search).get('level')
  return level === 'A1' || level === 'A2' || level === 'B1' || level === 'B2' ? level : '全部'
}

function readInitialKindFilter(): '全部' | LessonKind {
  const kind = new URLSearchParams(window.location.search).get('kind')
  return kind === '单词' || kind === '短语' || kind === '变位' ? kind : '全部'
}

function readInitialMode(fallback: Mode): Mode {
  const mode = new URLSearchParams(window.location.search).get('mode')
  return mode === 'copy' || mode === 'recall' || mode === 'listen' ? mode : fallback
}

function readInitialAccentMode(): AccentMode {
  const accent = new URLSearchParams(window.location.search).get('accent')
  if (accent === 'strict' || accent === 'lenient') return accent
  return localStorage.getItem('teclea-accent-mode') === 'lenient' ? 'lenient' : 'strict'
}

function readSpeechRate(): SpeechRate {
  const stored = Number(localStorage.getItem(SPEECH_RATE_KEY))
  return stored === 0.55 || stored === 1 ? stored : 0.8
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
    return Object.values(stored).reduce<Record<string, MistakeRecord>>((bank, item) => {
      if (!item || typeof item.spanish !== 'string' || typeof item.chinese !== 'string' || typeof item.count !== 'number') return bank
      const target = getTypingTarget(item.spanish)
      const currentMatch = lessons.flatMap((lesson) => lesson.words.map((word) => ({ lesson, word }))).find(({ word }) => getTypingTarget(word.spanish) === target)
      if (!currentMatch) return bank
      const key = `${currentMatch.lesson.id}::${target}`
      const previous = bank[key]
      bank[key] = {
        ...item,
        lessonId: currentMatch.lesson.id,
        spanish: currentMatch.word.spanish,
        chinese: currentMatch.word.chinese,
        count: (previous?.count ?? 0) + item.count,
        lastWrongAt: Math.max(previous?.lastWrongAt ?? 0, item.lastWrongAt),
      }
      return bank
    }, {})
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
    return {
      lessonId: stored.lessonId,
      mode: stored.mode,
      order: stored.order,
      index: stored.index!,
      elapsedMs: typeof stored.elapsedMs === 'number' ? Math.max(0, stored.elapsedMs) : 0,
      correctKeystrokes: typeof stored.correctKeystrokes === 'number' ? Math.max(0, stored.correctKeystrokes) : 0,
      mistakes: typeof stored.mistakes === 'number' ? Math.max(0, stored.mistakes) : 0,
      completedWords: typeof stored.completedWords === 'number' ? Math.max(0, stored.completedWords) : stored.index!,
      mistakeWords: stored.mistakeWords && typeof stored.mistakeWords === 'object' ? stored.mistakeWords : {},
      reviewCorrectCount: typeof stored.reviewCorrectCount === 'number' ? Math.max(0, stored.reviewCorrectCount) : 0,
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

function shuffleWords(words: Lesson['words']) {
  const shuffled = [...words]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]]
  }
  if (shuffled.length > 1 && shuffled.every((word, index) => word === words[index])) {
    shuffled.push(shuffled.shift()!)
  }
  return shuffled
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
  const initialPracticeStateRef = useRef<PracticeState | null>(null)
  if (initialPracticeStateRef.current === null) {
    const storedPracticeState = readPracticeState()
    initialPracticeStateRef.current = { ...storedPracticeState, lastMode: readInitialMode(storedPracticeState.lastMode) }
  }
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
  const [accentMode, setAccentMode] = useState<AccentMode>(readInitialAccentMode)
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('teclea-sound-enabled') !== 'false')
  const [speechRate, setSpeechRate] = useState<SpeechRate>(readSpeechRate)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [levelFilter, setLevelFilter] = useState<'全部' | LessonLevel>(readInitialLevelFilter)
  const [kindFilter, setKindFilter] = useState<'全部' | LessonKind>(readInitialKindFilter)
  const [sceneFilter, setSceneFilter] = useState<'全部' | LessonScene>('全部')
  const [visibleLessonCount, setVisibleLessonCount] = useState(LESSON_PAGE_SIZE)
  const [inputEpoch, setInputEpoch] = useState(0)
  const [inputFocused, setInputFocused] = useState(false)
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0)
  const [completedWords, setCompletedWords] = useState(0)
  const [mistakeWords, setMistakeWords] = useState<Record<string, number>>({})
  const [mistakeBank, setMistakeBank] = useState<Record<string, MistakeRecord>>(readMistakeBank)
  const [activeSession, setActiveSession] = useState<ActivePracticeSession | null>(readActiveSession)
  const [pausedMainSession, setPausedMainSession] = useState<ActivePracticeSession | null>(() => readActiveSession(PAUSED_MAIN_SESSION_KEY))
  const [reviewCorrectCount, setReviewCorrectCount] = useState(0)
  const [timerNow, setTimerNow] = useState(Date.now())
  const [finalElapsedSeconds, setFinalElapsedSeconds] = useState(0)
  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('teclea-completed') || '[]') as unknown
      return Array.isArray(stored) ? stored.filter((id): id is string => typeof id === 'string' && lessons.some((lesson) => lesson.id === id)) : []
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
  const currentWordHadErrorRef = useRef(false)
  const sessionStartedAtRef = useRef<number | null>(null)
  const sessionElapsedBaseRef = useRef(0)
  const keyAudioRef = useRef<HTMLAudioElement | null>(null)
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null)
  const completeAudioRef = useRef<HTMLAudioElement | null>(null)
  const fullViewportHeightRef = useRef(window.visualViewport?.height ?? window.innerHeight)

  const word = lesson.words[index]
  const progress = ((index + (status === 'correct' ? 1 : 0)) / lesson.words.length) * 100

  useEffect(() => {
    if (screen !== 'practice') return
    window.scrollTo(0, 0)
    const focusTimer = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 120)
    return () => window.clearTimeout(focusTimer)
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
  }, [])

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
    if (screen === 'practice' && (mode === 'copy' || mode === 'listen')) speak(word.spanish, undefined, speechRate)
  }, [screen, mode, index, word.spanish, speechRate])

  useEffect(() => {
    setVisibleLessonCount(LESSON_PAGE_SIZE)
  }, [levelFilter, kindFilter, sceneFilter])

  useEffect(() => {
    if (window.location.hash !== '#courses') return
    window.setTimeout(() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }, [])

  const todayDone = practiceState.dailyWords[localDateKey()] ?? 0
  const streak = useMemo(() => learningStreak(practiceState.dailyWords), [practiceState.dailyWords])
  const filteredLessons = useMemo(
    () => lessons.filter((item) => (levelFilter === '全部' || item.level === levelFilter) && (kindFilter === '全部' || item.kind === kindFilter) && (sceneFilter === '全部' || item.scene === sceneFilter)),
    [levelFilter, kindFilter, sceneFilter],
  )
  const visibleLessons = filteredLessons.slice(0, visibleLessonCount)
  const hiddenLessonCount = Math.max(0, filteredLessons.length - visibleLessons.length)
  const modeLabel = mode === 'listen' ? '听写' : mode === 'recall' ? '中文回忆' : '跟写'
  const mistakeLesson = useMemo<Lesson | null>(() => {
    const entries = Object.entries(mistakeBank).sort(([, left], [, right]) => right.lastWrongAt - left.lastWrongAt)
    if (!entries.length) return null
    return {
      id: 'mistake-review',
      level: 'A1',
      scene: '基础',
      kind: '短语',
      eyebrow: '错题库 · 本轮随机顺序',
      title: '错题复习',
      description: '答对一题清除一题，仍答错的继续保留',
      color: '#b9674f',
      words: entries.map(([reviewKey, record]) => {
        const originalLesson = lessons.find((item) => item.id === record.lessonId)
        const originalWord = originalLesson?.words.find((item) => item.spanish === record.spanish)
        return originalWord
          ? { ...originalWord, reviewKey }
          : { spanish: record.spanish, chinese: record.chinese, reviewKey, source: { ...PHRASE_SOURCE } }
      }),
    }
  }, [mistakeBank])
  const mistakeAttempts = useMemo(() => Object.values(mistakeBank).reduce((total, item) => total + item.count, 0), [mistakeBank])
  const activeReviewWasTrimmed = activeSession?.lessonId === 'mistake-review' && Boolean(mistakeLesson) && activeSession.order.length !== mistakeLesson!.words.length
  const continueLabel = activeSession
    ? `${activeSession.lessonId === 'mistake-review' ? '继续错题复习' : '继续上次练习'} · ${activeReviewWasTrimmed ? 1 : activeSession.index + 1}/${activeReviewWasTrimmed ? mistakeLesson!.words.length : activeSession.order.length}`
    : '开始今日练习'

  const elapsedSeconds = screen === 'complete'
    ? finalElapsedSeconds
    : Math.floor((sessionElapsedBaseRef.current + (sessionStartedAtRef.current ? timerNow - sessionStartedAtRef.current : 0)) / 1000)
  const totalKeystrokes = correctKeystrokes + mistakes
  const accuracy = totalKeystrokes ? Math.round(correctKeystrokes / totalKeystrokes * 100) : 100
  const wpm = elapsedSeconds ? Math.round((correctKeystrokes / 5) / (elapsedSeconds / 60)) : 0

  function playEffect(type: 'key' | 'wrong' | 'complete') {
    if (!soundEnabled) return
    const audio = type === 'key' ? keyAudioRef.current : type === 'wrong' ? wrongAudioRef.current : completeAudioRef.current
    if (!audio) return
    audio.currentTime = 0
    void audio.play().catch(() => undefined)
  }

  function savePracticeState(update: (current: PracticeState) => PracticeState) {
    setPracticeState((current) => {
      const nextState = update(current)
      localStorage.setItem(PRACTICE_STATE_KEY, JSON.stringify(nextState))
      return nextState
    })
  }

  function saveMistakeBank(update: (current: Record<string, MistakeRecord>) => Record<string, MistakeRecord>) {
    setMistakeBank((current) => {
      const nextBank = update(current)
      localStorage.setItem(MISTAKE_BANK_KEY, JSON.stringify(nextBank))
      return nextBank
    })
  }

  function persistActiveSession(nextSession: ActivePracticeSession | null) {
    setActiveSession(nextSession)
    if (nextSession) localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(nextSession))
    else localStorage.removeItem(ACTIVE_SESSION_KEY)
  }

  function persistPausedMainSession(nextSession: ActivePracticeSession | null) {
    setPausedMainSession(nextSession)
    if (nextSession) localStorage.setItem(PAUSED_MAIN_SESSION_KEY, JSON.stringify(nextSession))
    else localStorage.removeItem(PAUSED_MAIN_SESSION_KEY)
  }

  function currentElapsedMs() {
    return sessionElapsedBaseRef.current + (sessionStartedAtRef.current ? Date.now() - sessionStartedAtRef.current : 0)
  }

  function recordMistake() {
    const reviewKey = word.reviewKey ?? `${lesson.id}::${getTypingTarget(word.spanish)}`
    saveMistakeBank((current) => ({
      ...current,
      [reviewKey]: {
        lessonId: current[reviewKey]?.lessonId ?? lesson.id,
        spanish: word.spanish,
        chinese: word.chinese,
        count: (current[reviewKey]?.count ?? 0) + 1,
        lastWrongAt: Date.now(),
        lastMode: mode,
      },
    }))
  }

  function clearReviewedMistakes(reviewKeys: string[]) {
    saveMistakeBank((current) => {
      const nextBank = { ...current }
      reviewKeys.forEach((reviewKey) => delete nextBank[reviewKey])
      return nextBank
    })
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
    if (nextLevel !== '全部' && sceneFilter !== '全部' && !lessons.some((item) => item.level === nextLevel && item.scene === sceneFilter)) {
      setSceneFilter('全部')
    }
  }

  function resetFilters() {
    setKindFilter('全部')
    setLevelFilter('全部')
    setSceneFilter('全部')
  }

  function chooseKindFilter(nextKind: '全部' | LessonKind) {
    setKindFilter(nextKind)
    if (nextKind !== '全部' && sceneFilter !== '全部' && !lessons.some((item) => item.kind === nextKind && item.scene === sceneFilter)) {
      setSceneFilter('全部')
    }
  }

  function chooseSceneFilter(nextScene: '全部' | LessonScene) {
    setSceneFilter(nextScene)
    if (nextScene !== '全部' && levelFilter !== '全部' && !lessons.some((item) => item.scene === nextScene && item.level === levelFilter)) {
      setLevelFilter('全部')
    }
    if (nextScene !== '全部' && kindFilter !== '全部' && !lessons.some((item) => item.scene === nextScene && item.kind === kindFilter)) {
      setKindFilter('全部')
    }
  }

  function openPractice(nextLesson: Lesson, session: ActivePracticeSession) {
    flowTokenRef.current += 1
    window.clearTimeout(resetTimerRef.current)
    window.speechSynthesis?.cancel()
    isComposingRef.current = false
    compositionCommittedValueRef.current = null
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
    setMistakeWords(session.mistakeWords)
    setReviewCorrectCount(session.reviewCorrectCount)
    currentWordHadErrorRef.current = false
    setFinalElapsedSeconds(0)
    sessionElapsedBaseRef.current = session.elapsedMs
    sessionStartedAtRef.current = null
    setTimerNow(Date.now())
    setStatus('idle')
    setWrongAt(null)
    setRevealAnswer(false)
    setInputEpoch((value) => value + 1)
    setInputFocused(false)
    setScreen('practice')
  }

  function begin(nextLesson: Lesson, nextMode: Mode = mode) {
    if (nextLesson.id === 'mistake-review' && activeSession?.lessonId !== 'mistake-review') {
      if (activeSession) persistPausedMainSession(activeSession)
    } else if (nextLesson.id !== 'mistake-review') {
      persistPausedMainSession(null)
    }
    const orderedWords = shuffleWords(nextLesson.words)
    const session: ActivePracticeSession = {
      lessonId: nextLesson.id,
      mode: nextMode,
      order: orderedWords.map((word) => sessionCardId(nextLesson.id, word)),
      index: 0,
      elapsedMs: 0,
      correctKeystrokes: 0,
      mistakes: 0,
      completedWords: 0,
      mistakeWords: {},
      reviewCorrectCount: 0,
    }
    openPractice({ ...nextLesson, words: orderedWords }, session)
  }

  function resumePracticeSession(session: ActivePracticeSession | null) {
    if (!session) return false
    const baseLesson = session.lessonId === 'mistake-review'
      ? mistakeLesson
      : lessons.find((item) => item.id === session.lessonId) ?? null
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
          mistakeWords: {},
          reviewCorrectCount: 0,
        }
      : { ...session, index: validPriorCount }
    openPractice({ ...baseLesson, words: orderedWords }, restoredSession)
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
    if (mistakeLesson) begin(mistakeLesson)
  }

  function continuePractice() {
    if (resumeActivePractice()) return
    const lastLesson = lessons.find((item) => item.id === practiceState.lastLessonId) ?? lessons[0]
    begin(lastLesson, practiceState.lastMode)
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
    begin(nextLesson)
  }

  function exitPractice() {
    flowTokenRef.current += 1
    window.clearTimeout(resetTimerRef.current)
    window.speechSynthesis?.cancel()
    if (activeSession) persistActiveSession({ ...activeSession, elapsedMs: currentElapsedMs() })
    setScreen('home')
  }

  function next() {
    flowTokenRef.current += 1
    const nextCompletedWords = completedWords + 1
    const cleanReviewAnswer = lesson.id === 'mistake-review' && !currentWordHadErrorRef.current && Boolean(word.reviewKey)
    const nextReviewCorrectCount = reviewCorrectCount + (cleanReviewAnswer ? 1 : 0)
    const elapsedMs = currentElapsedMs()
    setCompletedWords(nextCompletedWords)
    if (cleanReviewAnswer) {
      clearReviewedMistakes([word.reviewKey!])
      setReviewCorrectCount(nextReviewCorrectCount)
    }
    recordCompletedWord()
    if (index === lesson.words.length - 1) {
      if (lesson.id === 'mistake-review' && pausedMainSession) {
        persistActiveSession(pausedMainSession)
        persistPausedMainSession(null)
      } else {
        persistActiveSession(null)
        if (lesson.id !== 'mistake-review') persistPausedMainSession(null)
      }
      const seconds = Math.max(1, Math.round(elapsedMs / 1000))
      setFinalElapsedSeconds(seconds)
      if (lessons.some((item) => item.id === lesson.id)) {
        const nextCompleted = Array.from(new Set([...completed, lesson.id]))
        setCompleted(nextCompleted)
        localStorage.setItem('teclea-completed', JSON.stringify(nextCompleted))
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
      })
    }
    currentWordHadErrorRef.current = false
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
    if (activeSession) persistActiveSession({ ...activeSession, mode: nextMode })
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
  }

  function chooseSpeechRate(nextRate: SpeechRate) {
    setSpeechRate(nextRate)
    localStorage.setItem(SPEECH_RATE_KEY, String(nextRate))
    speak('escuchar y repetir', undefined, nextRate)
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
      if (lesson.id === 'mistake-review') currentWordHadErrorRef.current = true
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
          <div className="brand-copy"><strong>Teclea Español</strong><span>每天敲进一点西语</span></div>
          <button className="icon-button" aria-label="设置" onClick={() => setSettingsOpen(true)}><Settings2 size={21} /></button>
        </header>

        <main className="home-content">
          <div className="home-overview">
            <section className="hero-card">
              <div className="hero-glow" />
              <div className="streak-pill"><Flame size={15} fill="currentColor" /> {streak > 0 ? `连续学习 ${streak} 天` : '从今天开始连续学习'}</div>
              <p className="eyebrow">BUENOS DÍAS · 早上好</p>
              <h1>让西语从<br /><em>手指</em>进入记忆</h1>
              <p className="hero-subtitle">听、看、完整拼写。{totalPracticeCards} 张单词、短语与变位练习卡，练对重音和真实表达。</p>
              <button className="primary-button" onClick={continuePractice}>
                {continueLabel} <ArrowRight size={19} />
              </button>
            </section>

            <section className="daily-row">
              <div><span className="section-kicker">今日进度</span><strong>{todayDone}<small>{todayDone >= 12 ? ' 项 · 已达标' : ' / 12 项'}</small></strong></div>
              <div className="mini-ring" style={{ '--percent': `${Math.min(todayDone / 12, 1) * 360}deg` } as React.CSSProperties}><span>{todayDone >= 12 ? '达标' : `${Math.round(todayDone / 12 * 100)}%`}</span></div>
            </section>
          </div>

          <div className="home-actions">
            <section className={`mistake-card ${mistakeLesson ? '' : 'empty'}`}>
              <div className="mistake-icon"><RotateCcw size={22} /></div>
              <div>
                <span className="section-kicker">错题库</span>
                <h3>{mistakeLesson ? `${mistakeLesson.words.length} 个待复习` : '目前没有错题'}</h3>
                <p>{mistakeLesson ? `累计错 ${mistakeAttempts} 次 · 答对一题清除一题` : '输错的单词和短语会自动出现在这里。'}</p>
                {activeSession?.lessonId === 'mistake-review' && pausedMainSession && (
                  <button className="resume-main-link" onClick={resumePausedMainPractice}>返回普通练习 · {pausedMainSession.index + 1}/{pausedMainSession.order.length}</button>
                )}
              </div>
              <button disabled={!mistakeLesson} aria-label={activeSession?.lessonId === 'mistake-review' ? '继续错题复习' : '开始错题复习'} onClick={continueMistakeReview}><ArrowRight size={19} /></button>
            </section>
            <section className="mode-card">
              <div className="mode-icon"><Headphones size={23} /></div>
              <div><span className="section-kicker">听写挑战</span><h3>只听发音，写出西语</h3><p>把提示藏起来，测试真实记忆。</p></div>
              <button aria-label="开始听写" onClick={() => begin(filteredLessons[0] ?? lessons[0], 'listen')}><ArrowRight size={19} /></button>
            </section>
          </div>

          <section className="course-section" id="courses">
            <div className="section-heading"><div><span className="section-kicker">开放词库 · {totalPracticeCards} 张卡</span><h2>按类型、等级与场景选择</h2></div><button onClick={resetFilters}>重置</button></div>
            <div className="course-filters" aria-label="词库筛选">
              <div><span>类型</span>{lessonKinds.map((kind) => <button key={kind} className={kindFilter === kind ? 'active' : ''} onClick={() => chooseKindFilter(kind)}>{kind}</button>)}</div>
              <div><span>难度</span>{lessonLevels.map((level) => <button key={level} className={levelFilter === level ? 'active' : ''} onClick={() => chooseLevelFilter(level)}>{level}</button>)}</div>
              <div><span>场景</span>{lessonScenes.map((scene) => <button key={scene} className={sceneFilter === scene ? 'active' : ''} onClick={() => chooseSceneFilter(scene)}>{scene}</button>)}</div>
            </div>
            <p className="filter-result" aria-live="polite">找到 {filteredLessons.length} 组练习{hiddenLessonCount > 0 ? ` · 先显示 ${visibleLessons.length} 组` : ''} · 打开课程后使用{modeLabel}{accentMode === 'strict' ? '并严格检查重音' : ''}</p>
            <div className="lesson-list">
              {visibleLessons.map((item) => {
                const isDone = completed.includes(item.id)
                const resumableSession = activeSession?.lessonId === item.id
                  ? activeSession
                  : activeSession?.lessonId === 'mistake-review' && pausedMainSession?.lessonId === item.id
                    ? pausedMainSession
                    : null
                return (
                  <button className={`lesson-card ${resumableSession ? 'in-progress' : ''}`} key={item.id} onClick={() => openLesson(item)} aria-label={`${resumableSession ? '继续' : '开始'}${item.level} ${item.title}`}>
                    <span className="lesson-number" style={{ background: item.color }}>{isDone ? <Check size={19} /> : item.level}</span>
                    <span className="lesson-copy"><small>{resumableSession ? `进行中 · ${resumableSession.index + 1}/${resumableSession.order.length}` : item.eyebrow}</small><strong>{item.title}</strong><span>{item.description}</span></span>
                    <span className="lesson-meta"><b>{resumableSession ? <ArrowRight size={19} /> : item.words.length}</b><small>{resumableSession ? '继续' : '项'}</small></span>
                  </button>
                )
              })}
            </div>
            {hiddenLessonCount > 0 && (
              <button className="show-more-lessons" onClick={() => setVisibleLessonCount((count) => count + LESSON_PAGE_SIZE)}>
                再显示 {Math.min(LESSON_PAGE_SIZE, hiddenLessonCount)} 组 <small>还剩 {hiddenLessonCount} 组</small>
              </button>
            )}
            {!filteredLessons.length && <p className="empty-lessons">这个组合暂时没有课程，试试减少一个筛选条件。</p>}
            <div className="word-sources">
              <a className="word-source" href={FREQUENCY_SOURCE.url} target="_blank" rel="noreferrer">词频排序：{FREQUENCY_SOURCE.name} · {FREQUENCY_SOURCE.license}</a>
              <a className="word-source" href={WORD_SOURCE.url} target="_blank" rel="noreferrer">词形与变位：{WORD_SOURCE.name} · {WORD_SOURCE.license}</a>
              <a className="word-source" href={INTERMEDIATE_SOURCE.url} target="_blank" rel="noreferrer">B1–B2 框架参考：Instituto Cervantes PCIC · 项目教学选词</a>
              <a className="word-source" href={PHRASE_SOURCE.url} target="_blank" rel="noreferrer">短语、中文释义与例句：项目教学编辑 · 制作说明</a>
            </div>
          </section>

          <footer className="project-legal">
            <nav className="learning-guide-links" aria-label="免费西语学习指南">
              <a href="/spanish-dictation-practice.html">西语听写</a>
              <a href="/spanish-conjugation-practice.html">动词变位</a>
              <a href="/spanish-accent-practice.html">重音拼写</a>
              <a href="/a1-spanish-vocabulary.html">A1</a>
              <a href="/a2-spanish-vocabulary.html">A2</a>
              <a href="/b1-spanish-vocabulary.html">B1</a>
              <a href="/b2-spanish-vocabulary.html">B2</a>
              <a href="/methodology.html">词库方法</a>
            </nav>
            <div className="project-meta">
              <span>GPL-3.0 开源项目</span>
              <a href="/privacy.html">隐私说明</a>
              <a href="https://github.com/RealKai42/qwerty-learner" target="_blank" rel="noreferrer">基于 Qwerty Learner 修改</a>
            </div>
          </footer>
        </main>

        {settingsOpen && (
          <div className="modal-backdrop" role="presentation" onClick={() => setSettingsOpen(false)}>
            <section className="settings-sheet" role="dialog" aria-modal="true" aria-label="训练设置" onClick={(event) => event.stopPropagation()}>
              <div className="sheet-handle" />
              <div className="sheet-heading"><div><span className="section-kicker">训练偏好</span><h2>怎么判定“打对”</h2></div><button className="icon-button" onClick={() => setSettingsOpen(false)} aria-label="关闭设置"><X size={20} /></button></div>
              <button className="setting-row" onClick={toggleAccentMode}>
                <span><strong>重音判定</strong><small>ñ、ü 始终作为独立字母</small></span>
                <b>{accentMode === 'strict' ? '严格拼写' : '忽略 á é í ó ú'}</b>
              </button>
              <button className="setting-row" onClick={toggleSound}>
                <span><strong>打字音效</strong><small>正确按键、错误和完成提示</small></span>
                <b>{soundEnabled ? '已开启' : '已关闭'}</b>
              </button>
              <div className="setting-rate">
                <span><strong>西语发音速度</strong><small>进入每张卡会自动朗读，也可随时点 ES 重听</small></span>
                <div className="rate-options" aria-label="西语发音速度">
                  {SPEECH_RATE_OPTIONS.map((option) => (
                    <button key={option.value} className={speechRate === option.value ? 'active' : ''} onClick={() => chooseSpeechRate(option.value)} aria-pressed={speechRate === option.value}>
                      {option.label}<small>{option.value}×</small>
                    </button>
                  ))}
                </div>
              </div>
              <p className="settings-note">忽略重音时，输入 <b>camion</b> 可以通过 <b>camión</b>；但 <b>n</b> 不能代替 <b>ñ</b>。</p>
              <div className="legal-box">
                <strong>开源与修改声明</strong>
                <p>本项目是基于 Qwerty Learner 训练机制制作的手机西语修改版本，2026-08-14 起修改，并以 GPL-3.0 发布。无担保；源码入口放在这里，不占用首页。</p>
                <div className="legal-links">
                  <a href="https://github.com/YoYo1248/teclea-espanol" target="_blank" rel="noreferrer">本项目源代码</a>
                  <a href="https://github.com/RealKai42/qwerty-learner" target="_blank" rel="noreferrer">上游项目</a>
                  <a href="https://github.com/YoYo1248/teclea-espanol/blob/main/DATA_LICENSE.md" target="_blank" rel="noreferrer">词库许可</a>
                </div>
              </div>
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
          <p className="eyebrow">本组完成</p>
          <h1>{lesson.title}</h1>
          <p>你完成了 {lesson.words.length} 个表达，出现 {mistakes} 次重试。</p>
          {lesson.id === 'mistake-review' && (
            <p className={`review-result ${reviewCorrectCount === lesson.words.length ? 'clean' : ''}`}>
              {reviewCorrectCount === lesson.words.length
                ? '本轮全部答对，这组错题已清除。'
                : `本轮清除 ${reviewCorrectCount} 个；答错过的 ${lesson.words.length - reviewCorrectCount} 个继续保留。`}
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
          <button className="primary-button" onClick={() => setScreen('home')}>回到今天 <Home size={19} /></button>
          {lesson.id !== 'mistake-review' && <button className="text-button" onClick={() => begin(lesson, 'listen')}><RotateCcw size={17} /> 用听写再来一遍</button>}
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
        <button className="icon-button" onClick={exitPractice} aria-label="退出练习"><ArrowLeft size={22} /></button>
        <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
        <span className="counter">{index + 1}/{lesson.words.length}</span>
      </header>

      <main className="practice-main">
        <div className="mode-switch" role="group" aria-label="练习模式">
          <button className={mode === 'copy' ? 'active' : ''} onClick={() => changeMode('copy')}><Keyboard size={15} />跟打</button>
          <button aria-label="看中文写西语" className={mode === 'recall' ? 'active' : ''} onClick={() => changeMode('recall')}><BookOpen size={15} />看中文写</button>
          <button className={mode === 'listen' ? 'active' : ''} onClick={() => changeMode('listen')}><Headphones size={15} />听写</button>
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
            <button aria-label="严格拼写" className={accentMode === 'strict' ? 'active' : ''} onClick={() => chooseAccentMode('strict')}>严格</button>
            <button aria-label="忽略重音符号" className={accentMode === 'lenient' ? 'active' : ''} onClick={() => chooseAccentMode('lenient')}>忽略重音</button>
          </div>
          <button className="sound-toggle" onClick={toggleSound} aria-label={soundEnabled ? '关闭打字音效' : '开启打字音效'}>
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
        </div>

        <section className={`typing-stage ${status} ${targetLetters.length > 18 ? 'long-target' : ''}`} onClick={() => inputRef.current?.focus()}>
          <span className="word-label">{mode === 'copy' ? '逐字母输入' : mode === 'recall' ? '根据中文拼写' : '仅凭发音拼写'}</span>
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
            key={`${lesson.id}-${mode}-${inputEpoch}`}
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
            aria-label="逐字母输入"
          />
          <button className="sound-button" onClick={(event) => { event.stopPropagation(); speak(word.spanish, undefined, speechRate); inputRef.current?.focus() }} aria-label={`播放西语发音，${speechRate} 倍速`}><Volume2 size={20} /> <span>ES · {speechRate}×</span></button>
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
            {status === 'idle' && <span>{hideSpanish ? isTouchDevice ? '长按字符槽查看拼写' : '按住 Tab 查看拼写' : '越快、越准，成绩越高'}</span>}
          </div>
        </section>
      </main>

      <footer className="practice-footer">
        <button className="keyboard-prompt" onClick={() => inputRef.current?.focus()}>
          <Keyboard size={18} />
          <span>{status === 'wrong' ? '正在重置…' : status === 'correct' ? '正确，查看词义后进入下一个…' : inputFocused ? '键盘已就绪，直接输入' : '键盘未出现？点一下继续'}</span>
        </button>
      </footer>
    </div>
  )
}

export default App
