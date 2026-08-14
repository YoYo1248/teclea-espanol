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
  Sparkles,
  Timer,
  VolumeX,
  Volume2,
  X,
} from 'lucide-react'
import { lessonLevels, lessonScenes, lessons, WORD_SOURCE, type Lesson, type LessonLevel, type LessonScene } from './data'

type Screen = 'home' | 'practice' | 'complete'
type Mode = 'copy' | 'recall' | 'listen'
type AccentMode = 'strict' | 'lenient'

const ACCENTS = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ']
const LENIENT_ACCENTS: Record<string, string> = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' }

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

function speak(text: string, onDone?: () => void) {
  if (!('speechSynthesis' in window)) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text.replace(/[¿?¡!]/g, ''))
  utterance.lang = 'es-ES'
  utterance.rate = 0.82
  if (onDone) {
    utterance.onend = onDone
    utterance.onerror = onDone
  }
  window.speechSynthesis.speak(utterance)
  return true
}

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [lesson, setLesson] = useState<Lesson>(lessons[0])
  const [mode, setMode] = useState<Mode>('copy')
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
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [levelFilter, setLevelFilter] = useState<'全部' | LessonLevel>('全部')
  const [sceneFilter, setSceneFilter] = useState<'全部' | LessonScene>('全部')
  const [inputEpoch, setInputEpoch] = useState(0)
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0)
  const [completedWords, setCompletedWords] = useState(0)
  const [mistakeWords, setMistakeWords] = useState<Record<string, number>>({})
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
  const sessionStartedAtRef = useRef<number | null>(null)
  const keyAudioRef = useRef<HTMLAudioElement | null>(null)
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null)
  const completeAudioRef = useRef<HTMLAudioElement | null>(null)

  const word = lesson.words[index]
  const progress = ((index + (status === 'correct' ? 1 : 0)) / lesson.words.length) * 100

  useEffect(() => {
    if (screen === 'practice') setTimeout(() => inputRef.current?.focus(), 120)
  }, [screen, index])

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
    if (screen === 'practice' && mode === 'listen') speak(word.spanish)
  }, [screen, mode, index, word.spanish])

  const todayDone = useMemo(
    () => lessons.filter((item) => completed.includes(item.id)).reduce((total, item) => total + item.words.length, 0),
    [completed],
  )
  const filteredLessons = useMemo(
    () => lessons.filter((item) => (levelFilter === '全部' || item.level === levelFilter) && (sceneFilter === '全部' || item.scene === sceneFilter)),
    [levelFilter, sceneFilter],
  )

  const elapsedSeconds = screen === 'complete'
    ? finalElapsedSeconds
    : sessionStartedAtRef.current
      ? Math.max(1, Math.floor((timerNow - sessionStartedAtRef.current) / 1000))
      : 0
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

  function chooseLevelFilter(nextLevel: '全部' | LessonLevel) {
    setLevelFilter(nextLevel)
    if (nextLevel !== '全部' && sceneFilter !== '全部' && !lessons.some((item) => item.level === nextLevel && item.scene === sceneFilter)) {
      setSceneFilter('全部')
    }
  }

  function chooseSceneFilter(nextScene: '全部' | LessonScene) {
    setSceneFilter(nextScene)
    if (nextScene !== '全部' && levelFilter !== '全部' && !lessons.some((item) => item.scene === nextScene && item.level === levelFilter)) {
      setLevelFilter('全部')
    }
  }

  function begin(nextLesson: Lesson, nextMode: Mode = 'copy') {
    flowTokenRef.current += 1
    window.clearTimeout(resetTimerRef.current)
    isComposingRef.current = false
    compositionCommittedValueRef.current = null
    setLesson(nextLesson)
    setMode(nextMode)
    setIndex(0)
    setTyped('')
    setInputDraft('')
    setMistakes(0)
    setCorrectKeystrokes(0)
    setCompletedWords(0)
    setMistakeWords({})
    setFinalElapsedSeconds(0)
    sessionStartedAtRef.current = null
    setTimerNow(Date.now())
    setStatus('idle')
    setWrongAt(null)
    setRevealAnswer(false)
    setInputEpoch((value) => value + 1)
    setScreen('practice')
  }

  function next() {
    flowTokenRef.current += 1
    setCompletedWords((value) => value + 1)
    if (index === lesson.words.length - 1) {
      const seconds = sessionStartedAtRef.current ? Math.max(1, Math.round((Date.now() - sessionStartedAtRef.current) / 1000)) : 0
      setFinalElapsedSeconds(seconds)
      const nextCompleted = Array.from(new Set([...completed, lesson.id]))
      setCompleted(nextCompleted)
      localStorage.setItem('teclea-completed', JSON.stringify(nextCompleted))
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

  function handleCharacters(rawValue: string) {
    if (status !== 'idle') return

    if (sessionStartedAtRef.current === null) {
      sessionStartedAtRef.current = Date.now()
      setTimerNow(Date.now())
    }

    const target = getTypingTarget(word.spanish)
    const current = normalize(typed)
    const incomingValue = rawValue.toLocaleLowerCase('es-ES').normalize('NFC')
    if (!incomingValue.startsWith(current) || incomingValue.length <= current.length) return
    setInputDraft(incomingValue)

    const incoming = incomingValue.slice(current.length)
    let correctPrefix = current
    let newlyCorrect = 0

    for (const character of incoming) {
      const expected = target[correctPrefix.length]
      if (charactersMatch(character, expected, accentMode)) {
        correctPrefix += expected
        newlyCorrect += 1
        continue
      }

      setTyped(correctPrefix)
      setInputDraft(correctPrefix)
      if (newlyCorrect) setCorrectKeystrokes((value) => value + newlyCorrect)
      setWrongAt(correctPrefix.length)
      setStatus('wrong')
      setMistakes((value) => value + 1)
      setMistakeWords((value) => ({ ...value, [word.spanish]: (value[word.spanish] ?? 0) + 1 }))
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

    setTyped(correctPrefix)
    setInputDraft(correctPrefix)
    if (newlyCorrect) setCorrectKeystrokes((value) => value + newlyCorrect)
    if (correctPrefix.length === target.length) {
      setStatus('correct')
      playEffect('complete')
      const completionToken = ++flowTokenRef.current
      const advance = () => {
        if (flowTokenRef.current !== completionToken) return
        window.clearTimeout(resetTimerRef.current)
        next()
      }
      resetTimerRef.current = window.setTimeout(() => {
        if (flowTokenRef.current !== completionToken) return
        const started = speak(word.spanish, advance)
        resetTimerRef.current = window.setTimeout(advance, started ? 2400 : 650)
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
          <section className="hero-card">
            <div className="hero-glow" />
            <div className="streak-pill"><Flame size={15} fill="currentColor" /> 连续学习 3 天</div>
            <p className="eyebrow">BUENOS DÍAS · 早上好</p>
            <h1>让西语从<br /><em>手指</em>进入记忆</h1>
            <p className="hero-subtitle">听、看、完整拼写。每天 5 分钟，练对重音和真实表达。</p>
            <button className="primary-button" onClick={() => begin(lessons[0])}>
              继续今日练习 <ArrowRight size={19} />
            </button>
          </section>

          <section className="daily-row">
            <div><span className="section-kicker">今日进度</span><strong>{todayDone}<small> / 12 个词</small></strong></div>
            <div className="mini-ring" style={{ '--percent': `${Math.min(todayDone / 12, 1) * 360}deg` } as React.CSSProperties}><span>{Math.min(Math.round(todayDone / 12 * 100), 100)}%</span></div>
          </section>

          <section className="course-section">
            <div className="section-heading"><div><span className="section-kicker">开放词库</span><h2>按等级与场景选择</h2></div><button onClick={() => { setLevelFilter('全部'); setSceneFilter('全部') }}>重置</button></div>
            <div className="course-filters" aria-label="词库筛选">
              <div><span>难度</span>{lessonLevels.map((level) => <button key={level} className={levelFilter === level ? 'active' : ''} onClick={() => chooseLevelFilter(level)}>{level}</button>)}</div>
              <div><span>场景</span>{lessonScenes.map((scene) => <button key={scene} className={sceneFilter === scene ? 'active' : ''} onClick={() => chooseSceneFilter(scene)}>{scene}</button>)}</div>
            </div>
            <div className="lesson-list">
              {filteredLessons.map((item) => {
                const isDone = completed.includes(item.id)
                return (
                  <button className="lesson-card" key={item.id} onClick={() => begin(item)}>
                    <span className="lesson-number" style={{ background: item.color }}>{isDone ? <Check size={19} /> : item.level}</span>
                    <span className="lesson-copy"><small>{item.eyebrow}</small><strong>{item.title}</strong><span>{item.description}</span></span>
                    <span className="lesson-meta"><b>{item.words.length}</b><small>词</small></span>
                  </button>
                )
              })}
            </div>
            <a className="word-source" href={WORD_SOURCE.url} target="_blank" rel="noreferrer">词形核对：{WORD_SOURCE.name} · {WORD_SOURCE.license}</a>
          </section>

          <section className="mode-card">
            <div className="mode-icon"><Headphones size={23} /></div>
            <div><span className="section-kicker">挑战模式</span><h3>只听发音，写出西语</h3><p>把提示藏起来，测试真实记忆。</p></div>
            <button aria-label="开始听写" onClick={() => begin(filteredLessons[0] ?? lessons[0], 'listen')}><ArrowRight size={19} /></button>
          </section>
          <footer className="project-legal">
            <span>GPL-3.0 开源项目</span>
            <a href="https://github.com/RealKai42/qwerty-learner" target="_blank" rel="noreferrer">基于 Qwerty Learner 修改</a>
          </footer>
        </main>

        <nav className="bottom-nav" aria-label="主导航">
          <button className="active"><Home size={21} /><span>今天</span></button>
          <button><BookOpen size={21} /><span>词库</span></button>
          <button><Sparkles size={21} /><span>复习</span></button>
        </nav>
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
              <p className="settings-note">忽略重音时，输入 <b>camion</b> 可以通过 <b>camión</b>；但 <b>n</b> 不能代替 <b>ñ</b>。</p>
              <div className="legal-box">
                <strong>开源与修改声明</strong>
                <p>本项目是基于 Qwerty Learner 训练机制制作的手机西语修改版本，2026-08-14 起修改，并以 GPL-3.0 发布。无担保；你可以查看、复制和修改源代码。</p>
                <a href="https://github.com/RealKai42/qwerty-learner" target="_blank" rel="noreferrer">查看上游项目</a>
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
          <div className="result-grid">
            <div><strong>{completedWords}</strong><span>完成词数</span></div>
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
          <button className="text-button" onClick={() => begin(lesson, 'listen')}><RotateCcw size={17} /> 用听写再来一遍</button>
        </main>
      </div>
    )
  }

  const hideSpanish = mode !== 'copy'
  const targetLetters = Array.from(getTypingTarget(word.spanish))
  const typedLength = Array.from(typed).length
  return (
    <div className="app-shell practice-screen">
      <header className="practice-header">
        <button className="icon-button" onClick={() => setScreen('home')} aria-label="退出练习"><ArrowLeft size={22} /></button>
        <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
        <span className="counter">{index + 1}/{lesson.words.length}</span>
      </header>

      <main className="practice-main">
        <div className="mode-switch" role="group" aria-label="练习模式">
          <button className={mode === 'copy' ? 'active' : ''} onClick={() => changeMode('copy')}><Keyboard size={15} />跟打</button>
          <button className={mode === 'recall' ? 'active' : ''} onClick={() => changeMode('recall')}><BookOpen size={15} />回忆</button>
          <button className={mode === 'listen' ? 'active' : ''} onClick={() => changeMode('listen')}><Headphones size={15} />听写</button>
        </div>

        <div className="live-stats" aria-label="实时训练数据">
          <span><Timer size={14} /><b>{formatTime(elapsedSeconds)}</b><small>用时</small></span>
          <span><Gauge size={14} /><b>{wpm}</b><small>WPM</small></span>
          <span><Check size={14} /><b>{accuracy}%</b><small>正确率</small></span>
          <span><X size={14} /><b>{mistakes}</b><small>错误</small></span>
        </div>

        <div className="spelling-rule">
          <div className="rule-heading"><span>重音判定</span><small>可随时切换</small></div>
          <div className="rule-options" role="group" aria-label="重音判定规则">
            <button className={accentMode === 'strict' ? 'active' : ''} onClick={() => chooseAccentMode('strict')}>严格拼写</button>
            <button className={accentMode === 'lenient' ? 'active' : ''} onClick={() => chooseAccentMode('lenient')}>忽略 á é í ó ú</button>
          </div>
          <button className="sound-toggle" onClick={toggleSound} aria-label={soundEnabled ? '关闭打字音效' : '开启打字音效'}>
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
        </div>

        <section className={`typing-stage ${status}`} onClick={() => inputRef.current?.focus()}>
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
            {targetLetters.map((letter, letterIndex) => {
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
          </div>
          <input
            key={`${lesson.id}-${index}-${mode}-${inputEpoch}`}
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
            }}
            onKeyDown={(event) => { if (event.key === 'Backspace') event.preventDefault() }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            inputMode="text"
            aria-label="逐字母输入"
          />
          <button className="sound-button" onClick={(event) => { event.stopPropagation(); speak(word.spanish); inputRef.current?.focus() }} aria-label="播放西语发音"><Volume2 size={20} /> <span>ES</span></button>
          {mode === 'copy' && <p className="translation">{word.chinese}</p>}

          <div className="accent-strip" aria-label="西语特殊字符">
            {ACCENTS.map((character) => <button type="button" key={character} onMouseDown={(event) => event.preventDefault()} onClick={() => insertAccent(character)}>{character}</button>)}
          </div>
          <div className="typing-feedback" aria-live="polite">
            {status === 'wrong' && <><X size={16} /><strong>这个字母错了，整词重来</strong></>}
            {status === 'correct' && <><Check size={16} /><strong>¡Perfecto!</strong></>}
            {status === 'idle' && <span>{hideSpanish ? isTouchDevice ? '长按字符槽查看拼写' : '按住 Tab 查看拼写' : '越快、越准，成绩越高'}</span>}
          </div>
        </section>
      </main>

      <footer className="practice-footer">
        <button className="keyboard-prompt" onClick={() => inputRef.current?.focus()}>
          <Keyboard size={18} />
          <span>{status === 'wrong' ? '正在重置…' : status === 'correct' ? '正确，进入下一个…' : '点这里唤起键盘并开始'}</span>
        </button>
      </footer>
    </div>
  )
}

export default App
