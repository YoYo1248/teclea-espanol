import { createServer } from 'vite'
import { existsSync, readFileSync } from 'node:fs'

const catalogPolicy = JSON.parse(readFileSync(new URL('../data/lexicon/catalog-policy.json', import.meta.url), 'utf8'))
const frequencyArtifact = new URL('../artifacts/lexicon/wordfreq-es-top-6000.jsonl', import.meta.url)
const frequencyRankByTarget = existsSync(frequencyArtifact)
  ? new Map(readFileSync(frequencyArtifact, 'utf8').trim().split('\n').filter(Boolean).map((line) => {
      const candidate = JSON.parse(line)
      return [candidate.normalizedTarget, candidate.frequency.rank]
    }))
  : null

const server = await createServer({
  appType: 'custom',
  logLevel: 'silent',
  server: { middlewareMode: true },
})

try {
  const { lessons, totalPracticeCards } = await server.ssrLoadModule('/src/data.ts')
  const errors = []
  const lessonIds = new Set()
  const globalTargets = new Map()
  const expansionLemmas = new Map()
  let expansionCards = 0
  const kindCounts = { 单词: 0, 短语: 0, 动词原形: 0 }
  const levelCounts = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 }
  const nonVerbsEndingLikeInfinitives = new Set(['ayer', 'mujer', 'alquiler', 'bienestar', 'titular', 'molecular'])

  for (const lesson of lessons) {
    if (lessonIds.has(lesson.id)) errors.push(`重复课程 ID: ${lesson.id}`)
    lessonIds.add(lesson.id)
    if (!(lesson.kind in kindCounts)) errors.push(`未知类型: ${lesson.id} -> ${lesson.kind}`)
    if (!(lesson.level in levelCounts)) errors.push(`未知等级: ${lesson.id} -> ${lesson.level}`)
    if (lesson.words.length < catalogPolicy.lessonSize.minimum || lesson.words.length > catalogPolicy.lessonSize.maximum) errors.push(`课程长度应为 ${catalogPolicy.lessonSize.minimum}–${catalogPolicy.lessonSize.maximum} 项: ${lesson.id} -> ${lesson.words.length}`)
    if (lesson.id.startsWith('conjugation-')) errors.push(`脱离语境的变位课程不应进入当前词库: ${lesson.id}`)

    const targets = new Set()
    const recallClues = new Map()
    for (const word of lesson.words) {
      const target = word.spanish.toLocaleLowerCase('es-ES').normalize('NFC').replace(/[¿?¡!.,;:]/g, '').replace(/\s+/g, ' ').trim()
      const recallClue = `${word.chinese.normalize('NFC').replace(/\s+/g, ' ').trim()}::${Array.from(target).length}`
      if (!target) errors.push(`空训练目标: ${lesson.id}`)
      if (target.split(' ').length > catalogPolicy.maximumWordsPerTarget) errors.push(`超过 ${catalogPolicy.maximumWordsPerTarget} 个词: ${lesson.id} -> ${word.spanish}`)
      const looksLikeInfinitive = word.partOfSpeech
        ? word.partOfSpeech === 'verb'
        : !target.includes(' ') && /^(?:ir|[\p{L}]+(?:ar|er|ir)(?:se)?)$/u.test(target)
      if (lesson.kind === '动词原形' && !looksLikeInfinitive) errors.push(`动词原形分类包含非原形目标: ${lesson.id} -> ${word.spanish}`)
      if (lesson.kind !== '动词原形' && looksLikeInfinitive && !nonVerbsEndingLikeInfinitives.has(target)) errors.push(`孤立动词原形没有进入专项: ${lesson.id} -> ${word.spanish}`)
      if (targets.has(target)) errors.push(`课程内重复目标: ${lesson.id} -> ${word.spanish}`)
      targets.add(target)
      if (globalTargets.has(target)) errors.push(`词库跨课程重复目标: ${globalTargets.get(target)} / ${lesson.id} -> ${word.spanish}`)
      globalTargets.set(target, lesson.id)
      if (lesson.id.startsWith('expansion-')) {
        expansionCards += 1
        const lemma = word.lemma?.toLocaleLowerCase('es-ES').normalize('NFC').trim()
        if (!lemma) errors.push(`扩库卡片缺少 lemma: ${lesson.id} -> ${word.spanish}`)
        if (lemma !== target) errors.push(`扩库卡片必须使用 lemma 作为训练目标: ${lesson.id} -> ${word.spanish} / ${word.lemma}`)
        if (!word.partOfSpeech) errors.push(`扩库卡片缺少词性: ${lesson.id} -> ${word.spanish}`)
        if (!Number.isInteger(word.frequencyRank) || word.frequencyRank < 1) errors.push(`扩库卡片缺少有效词频排名: ${lesson.id} -> ${word.spanish}`)
        if (frequencyRankByTarget && frequencyRankByTarget.get(target) !== word.frequencyRank) errors.push(`扩库卡片词频排名与候选快照不一致: ${lesson.id} -> ${word.spanish} (${word.frequencyRank} / ${frequencyRankByTarget.get(target) ?? 'missing'})`)
        if (!word.frameworkReference?.startsWith('https://cvc.cervantes.es/')) errors.push(`扩库卡片缺少 PCIC 等级参考: ${lesson.id} -> ${word.spanish}`)
        if (!word.example || !word.exampleChinese) errors.push(`扩库卡片缺少中西例句: ${lesson.id} -> ${word.spanish}`)
        const exampleTokens = word.example?.toLocaleLowerCase('es-ES').normalize('NFC').split(/[^\p{L}áéíóúüñ]+/u).filter(Boolean) ?? []
        if (!exampleTokens.includes(target)) errors.push(`扩库例句没有使用目标原形: ${lesson.id} -> ${word.spanish}`)
        if (lemma && expansionLemmas.has(lemma)) errors.push(`扩库批次 lemma 重复: ${expansionLemmas.get(lemma)} / ${lesson.id} -> ${lemma}`)
        if (lemma) expansionLemmas.set(lemma, lesson.id)
      }
      if (recallClues.has(recallClue)) errors.push(`看义拼写提示与字符数冲突: ${lesson.id} -> ${recallClues.get(recallClue)} / ${word.spanish} (${word.chinese})`)
      recallClues.set(recallClue, word.spanish)
      kindCounts[lesson.kind] += 1
      levelCounts[lesson.level] += 1
    }
  }

  if (totalPracticeCards !== globalTargets.size) errors.push(`卡片总数与不重复目标数不一致: ${totalPracticeCards} / ${globalTargets.size}`)
  for (const [kind, minimum] of Object.entries(catalogPolicy.minimumCardsByKind)) {
    if (kindCounts[kind] < minimum) errors.push(`${kind} 不应低于扩库基线 ${minimum}，实际为 ${kindCounts[kind]}`)
  }
  for (const [level, minimum] of Object.entries(catalogPolicy.minimumCardsByLevel)) {
    if (levelCounts[level] < minimum) errors.push(`${level} 不应低于扩库基线 ${minimum}，实际为 ${levelCounts[level]}`)
  }
  if (errors.length) {
    console.error(errors.join('\n'))
    process.exitCode = 1
  } else {
    console.log(JSON.stringify({ lessons: lessons.length, cards: totalPracticeCards, expansionCards, kindCounts, levelCounts }, null, 2))
  }
} finally {
  await server.close()
}
