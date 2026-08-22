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
  const { LEGACY_PRACTICE_CARD_ID_REDIRECTS, practiceCardId } = await server.ssrLoadModule('/src/cardIdentity.ts')
  const { vidaSupermarketExistingTargets } = await server.ssrLoadModule('/src/vidaWords.ts')
  const { vidaMobilityTargets } = await server.ssrLoadModule('/src/vidaMobility.ts')
  const { vidaSettlingTargets } = await server.ssrLoadModule('/src/vidaSettling.ts')
  const { vidaDailyTargets } = await server.ssrLoadModule('/src/vidaDaily.ts')
  const errors = []
  const lessonIds = new Set()
  const globalTargets = new Map()
  const globalWords = new Map()
  const practiceCardIds = new Set()
  const expansionLemmas = new Map()
  let expansionCards = 0
  const kindCounts = { 单词: 0, 短语: 0, 动词原形: 0 }
  const levelCounts = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 }
  const routeCounts = { exam: 0, life: 0 }
  let vidaSupermarketCards = 0
  let vidaNewSupermarketCards = 0
  let vidaSupermarketGapCards = 0
  let vidaSupermarketGapSharedWithExam = 0
  let vidaSupermarketGapLifeOnly = 0
  let supermarketFreeCards = 0
  const supermarketTierCounts = { L1: 0, L2: 0, L3: 0 }
  let vidaMobilityCards = 0
  let vidaSettlingCards = 0
  let vidaDailyCards = 0
  let examMobilityCards = 0
  let examStructuralGapCards = 0
  let examTransactionFunctionCards = 0
  let advancedEditorialReadyCards = 0
  let advancedC1EditorialReadyCards = 0
  let advancedC2EditorialReadyCards = 0
  let legacyLexicalMetadataCards = 0
  let structuredMetadataCards = 0
  let exampleCards = 0
  let frameworkReferenceCards = 0
  let commonA1EditorialReadyCards = 0
  let commonA1TimeEditorialReadyCards = 0
  let commonA1QuantityEditorialReadyCards = 0
  let commonA1FamilyEditorialReadyCards = 0
  let commonA1HomeEditorialReadyCards = 0
  let commonA1CityEditorialReadyCards = 0
  let commonA1FoodEditorialReadyCards = 0
  let commonA1VerbEditorialReadyCards = 0
  let commonA1DialogueEditorialReadyCards = 0
  let commonA1ShoppingHealthEditorialReadyCards = 0
  let commonA1StudyWorkEditorialReadyCards = 0
  let commonA1ActionsTwoEditorialReadyCards = 0
  let commonA1TravelEditorialReadyCards = 0
  let commonA1HealthRemainderEditorialReadyCards = 0
  let commonA2PracticalEditorialReadyCards = 0
  let intermediateB1EditorialReadyCards = 0
  let intermediateB2EditorialReadyCards = 0
  const nonVerbsEndingLikeInfinitives = new Set(['ayer', 'mujer', 'alquiler', 'bienestar', 'titular', 'molecular'])

  for (const lesson of lessons) {
    if (lessonIds.has(lesson.id)) errors.push(`重复课程 ID: ${lesson.id}`)
    lessonIds.add(lesson.id)
    if (!(lesson.kind in kindCounts)) errors.push(`未知类型: ${lesson.id} -> ${lesson.kind}`)
    if (!(lesson.level in levelCounts)) errors.push(`未知等级: ${lesson.id} -> ${lesson.level}`)
    const minimumLessonCards = catalogPolicy.minimumLessonCardsById?.[lesson.id] ?? catalogPolicy.lessonSize.minimum
    if (lesson.words.length < minimumLessonCards || lesson.words.length > catalogPolicy.lessonSize.maximum) errors.push(`课程长度应为 ${minimumLessonCards}–${catalogPolicy.lessonSize.maximum} 项: ${lesson.id} -> ${lesson.words.length}`)
    if (lesson.id.startsWith('conjugation-')) errors.push(`脱离语境的变位课程不应进入当前词库: ${lesson.id}`)

    const targets = new Set()
    const recallClues = new Map()
    for (const word of lesson.words) {
      const target = word.spanish.toLocaleLowerCase('es-ES').normalize('NFC').replace(/[¿?¡!.,;:]/g, '').replace(/\s+/g, ' ').trim()
      const cardId = practiceCardId(lesson.id, word)
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
      globalWords.set(target, word)
      if (word.practiceId) errors.push(`canonical 卡不应保存仅供动态轮次使用的 practiceId: ${lesson.id} -> ${word.spanish}`)
      if (practiceCardIds.has(cardId)) errors.push(`运行时学习卡 ID 重复: ${cardId}`)
      practiceCardIds.add(cardId)
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
      if (lesson.id.startsWith('newcomer-')) {
        if (!word.example || !word.exampleChinese) errors.push(`新居民任务卡缺少中西例句: ${lesson.id} -> ${word.spanish}`)
        if (!word.source?.url?.startsWith('https://')) errors.push(`新居民任务卡缺少可追踪来源: ${lesson.id} -> ${word.spanish}`)
      }
      const routes = word.routes ?? []
      if (!routes.length) errors.push(`学习项缺少路线标签: ${lesson.id} -> ${word.spanish}`)
      if (new Set(routes).size !== routes.length) errors.push(`学习项路线标签重复: ${lesson.id} -> ${word.spanish}`)
      for (const route of routes) {
        if (!(route in routeCounts)) errors.push(`未知词库路线: ${lesson.id} -> ${word.spanish}:${route}`)
        else routeCounts[route] += 1
      }
      if (routes.includes('life')) {
        if (!word.lifeModule || !word.lifeTier || !word.access) errors.push(`生活路线卡缺少模块、等级或访问边界: ${lesson.id} -> ${word.spanish}`)
        if (!word.lifePlacements?.length) errors.push(`生活路线卡缺少模块 placement: ${lesson.id} -> ${word.spanish}`)
        if (new Set(word.lifePlacements?.map((placement) => placement.module)).size !== word.lifePlacements?.length) errors.push(`生活路线卡模块 placement 重复: ${lesson.id} -> ${word.spanish}`)
        for (const placement of word.lifePlacements ?? []) {
          if (!['supermarket', 'mobility', 'settling', 'daily'].includes(placement.module)) errors.push(`生活路线卡包含未知模块: ${lesson.id} -> ${word.spanish}:${placement.module}`)
          if (!['L1', 'L2', 'L3'].includes(placement.tier)) errors.push(`生活路线卡包含未知生活等级: ${lesson.id} -> ${word.spanish}:${placement.tier}`)
          if (!['free', 'paid'].includes(placement.access)) errors.push(`生活路线卡包含未知访问边界: ${lesson.id} -> ${word.spanish}:${placement.access}`)
        }
        if (!word.example || !word.exampleChinese) errors.push(`生活路线卡缺少中西例句: ${lesson.id} -> ${word.spanish}`)
      }
      const supermarketPlacement = word.lifePlacements?.find((placement) => placement.module === 'supermarket')
      if (supermarketPlacement) {
        vidaSupermarketCards += 1
        supermarketTierCounts[supermarketPlacement.tier] += 1
        if (supermarketPlacement.access === 'free') supermarketFreeCards += 1
      }
      if (word.lifePlacements?.some((placement) => placement.module === 'mobility')) vidaMobilityCards += 1
      if (word.lifePlacements?.some((placement) => placement.module === 'settling')) vidaSettlingCards += 1
      if (word.lifePlacements?.some((placement) => placement.module === 'daily')) vidaDailyCards += 1
      if (lesson.id.startsWith('vida-')) {
        if (!word.lifePlacements?.some((placement) => placement.module === 'supermarket')) errors.push(`Vida 首批卡必须属于超市模块: ${lesson.id} -> ${word.spanish}`)
        if (!word.lemma || word.lemma !== target) errors.push(`Vida 卡必须保存 canonical lemma: ${lesson.id} -> ${word.spanish}`)
        if (!target.includes(' ') && !word.partOfSpeech) errors.push(`Vida 单词卡缺少词性: ${lesson.id} -> ${word.spanish}`)
        if (!word.frameworkReference?.startsWith('https://cvc.cervantes.es/')) errors.push(`Vida 卡缺少 PCIC 难度参考: ${lesson.id} -> ${word.spanish}`)
        if (!word.source?.url?.startsWith('https://')) errors.push(`Vida 卡缺少可追踪来源: ${lesson.id} -> ${word.spanish}`)
        vidaNewSupermarketCards += 1
      }
      if (lesson.id.startsWith('exam-')) {
        if (!routes.includes('exam')) errors.push(`考试路线补缺卡必须进入 exam 路线: ${lesson.id} -> ${word.spanish}`)
        if (!word.lemma || word.lemma !== target) errors.push(`考试路线补缺卡必须保存 canonical lemma: ${lesson.id} -> ${word.spanish}`)
        if (!target.includes(' ') && !word.partOfSpeech) errors.push(`考试路线补缺单词卡缺少词性: ${lesson.id} -> ${word.spanish}`)
        if (!word.frameworkReference?.startsWith('https://cvc.cervantes.es/')) errors.push(`考试路线补缺卡缺少 PCIC 难度参考: ${lesson.id} -> ${word.spanish}`)
        if (!word.example || !word.exampleChinese) errors.push(`考试路线补缺卡缺少中西例句: ${lesson.id} -> ${word.spanish}`)
        if (!word.source?.url?.startsWith('https://')) errors.push(`考试路线补缺卡缺少可追踪来源: ${lesson.id} -> ${word.spanish}`)
        const normalizedExample = word.example?.toLocaleLowerCase('es-ES').normalize('NFC') ?? ''
        if (!normalizedExample.includes(target)) errors.push(`考试路线补缺例句没有使用目标: ${lesson.id} -> ${word.spanish}`)
        if (lesson.id.startsWith('exam-mobility-')) examMobilityCards += 1
        else if (lesson.id.startsWith('exam-b1-')) examTransactionFunctionCards += 1
        else examStructuralGapCards += 1
      }
      if (word.reviewKey === 'advanced-editorial-batch-001') {
        if (!['C1', 'C2'].includes(lesson.level)) errors.push(`高级编辑补缺卡必须属于 C1–C2: ${lesson.id} -> ${word.spanish}`)
        if (!word.lemma || word.lemma !== target) errors.push(`高级编辑补缺卡必须保存 canonical lemma: ${lesson.id} -> ${word.spanish}`)
        if (!word.partOfSpeech) errors.push(`高级编辑补缺卡缺少词性: ${lesson.id} -> ${word.spanish}`)
        if (!word.frameworkReference?.startsWith('https://cvc.cervantes.es/')) errors.push(`高级编辑补缺卡缺少 PCIC 等级参考: ${lesson.id} -> ${word.spanish}`)
        if (!word.example || !word.exampleChinese) errors.push(`高级编辑补缺卡缺少中西例句: ${lesson.id} -> ${word.spanish}`)
        if (!word.example?.toLocaleLowerCase('es-ES').normalize('NFC').includes(target)) errors.push(`高级编辑补缺例句没有使用目标: ${lesson.id} -> ${word.spanish}`)
        advancedEditorialReadyCards += 1
      }
      if (word.reviewKey === 'vida-supermarket-gap-editorial-004') {
        if (!lesson.id.startsWith('vida-supermarket-') || !word.lifePlacements?.some((placement) => placement.module === 'supermarket')) errors.push(`Vida 超市第四批补缺卡必须属于超市模块: ${lesson.id} -> ${word.spanish}`)
        if (!['A1', 'A2'].includes(lesson.level)) errors.push(`Vida 超市第四批补缺卡必须属于 A1–A2: ${lesson.id} -> ${word.spanish}`)
        if (word.partOfSpeech !== 'noun' || !word.article) errors.push(`Vida 超市第四批名词卡必须保存词性与冠词: ${lesson.id} -> ${word.spanish}`)
        if (routes.includes('exam')) vidaSupermarketGapSharedWithExam += 1
        else vidaSupermarketGapLifeOnly += 1
        vidaSupermarketGapCards += 1
      }
      if (word.reviewKey === 'advanced-c1-editorial-002') {
        if (lesson.level !== 'C1') errors.push(`C1 候选编辑补缺卡必须属于 C1: ${lesson.id} -> ${word.spanish}`)
        if (!word.lemma) errors.push(`C1 候选编辑补缺卡缺少 lemma: ${lesson.id} -> ${word.spanish}`)
        if (!word.partOfSpeech) errors.push(`C1 候选编辑补缺卡缺少词性: ${lesson.id} -> ${word.spanish}`)
        if (!word.frameworkReference?.startsWith('https://cvc.cervantes.es/')) errors.push(`C1 候选编辑补缺卡缺少 PCIC 等级参考: ${lesson.id} -> ${word.spanish}`)
        if (!word.example || !word.exampleChinese) errors.push(`C1 候选编辑补缺卡缺少中西例句: ${lesson.id} -> ${word.spanish}`)
        const normalizedExample = word.example?.toLocaleLowerCase('es-ES').normalize('NFC') ?? ''
        if (!normalizedExample.includes(target)) errors.push(`C1 候选编辑补缺例句没有使用目标: ${lesson.id} -> ${word.spanish}`)
        advancedC1EditorialReadyCards += 1
      }
      if (word.reviewKey === 'advanced-c2-editorial-003') {
        if (lesson.level !== 'C2') errors.push(`C2 候选编辑补缺卡必须属于 C2: ${lesson.id} -> ${word.spanish}`)
        if (!word.lemma) errors.push(`C2 候选编辑补缺卡缺少 lemma: ${lesson.id} -> ${word.spanish}`)
        if (!word.partOfSpeech) errors.push(`C2 候选编辑补缺卡缺少词性: ${lesson.id} -> ${word.spanish}`)
        if (!word.frameworkReference?.startsWith('https://cvc.cervantes.es/')) errors.push(`C2 候选编辑补缺卡缺少 PCIC 等级参考: ${lesson.id} -> ${word.spanish}`)
        if (!word.example || !word.exampleChinese) errors.push(`C2 候选编辑补缺卡缺少中西例句: ${lesson.id} -> ${word.spanish}`)
        const normalizedExample = word.example?.toLocaleLowerCase('es-ES').normalize('NFC') ?? ''
        if (!normalizedExample.includes(target)) errors.push(`C2 候选编辑补缺例句没有使用目标: ${lesson.id} -> ${word.spanish}`)
        advancedC2EditorialReadyCards += 1
      }
      if (word.reviewKey === 'legacy-lexical-metadata-001') {
        if (!word.lemma) errors.push(`旧目录词条缺少 lemma: ${lesson.id} -> ${word.spanish}`)
        if (!word.partOfSpeech) errors.push(`旧目录词条缺少词性: ${lesson.id} -> ${word.spanish}`)
        if (!word.frameworkReference?.startsWith('https://cvc.cervantes.es/')) errors.push(`旧目录词条缺少 PCIC 等级参考: ${lesson.id} -> ${word.spanish}`)
        if (!word.example || !word.exampleChinese) errors.push(`旧目录词条缺少中西例句: ${lesson.id} -> ${word.spanish}`)
        legacyLexicalMetadataCards += 1
      }
      if (word.reviewKey?.startsWith('common-a1-')) {
        if (lesson.level !== 'A1') errors.push(`A1 基础编辑补缺卡必须属于 A1: ${lesson.id} -> ${word.spanish}`)
        if (!word.lemma || word.lemma !== target) errors.push(`A1 基础编辑补缺卡必须保存 canonical lemma: ${lesson.id} -> ${word.spanish}`)
        if (!word.partOfSpeech) errors.push(`A1 基础编辑补缺卡缺少词性: ${lesson.id} -> ${word.spanish}`)
        if (!word.frameworkReference?.startsWith('https://cvc.cervantes.es/')) errors.push(`A1 基础编辑补缺卡缺少 PCIC 等级参考: ${lesson.id} -> ${word.spanish}`)
        if (!word.example || !word.exampleChinese) errors.push(`A1 基础编辑补缺卡缺少中西例句: ${lesson.id} -> ${word.spanish}`)
        const normalizedExample = word.example?.toLocaleLowerCase('es-ES').normalize('NFC') ?? ''
        if (!normalizedExample.includes(target)) errors.push(`A1 基础编辑补缺例句没有使用目标: ${lesson.id} -> ${word.spanish}`)
        if (word.reviewKey === 'common-a1-connectors-editorial-001') commonA1EditorialReadyCards += 1
        else if (word.reviewKey === 'common-a1-time-editorial-002') commonA1TimeEditorialReadyCards += 1
        else if (word.reviewKey === 'common-a1-quantity-editorial-003') commonA1QuantityEditorialReadyCards += 1
        else if (word.reviewKey === 'common-a1-family-editorial-004') commonA1FamilyEditorialReadyCards += 1
        else if (word.reviewKey === 'common-a1-home-editorial-005') commonA1HomeEditorialReadyCards += 1
        else if (word.reviewKey === 'common-a1-city-editorial-006') commonA1CityEditorialReadyCards += 1
        else if (word.reviewKey === 'common-a1-food-editorial-007') commonA1FoodEditorialReadyCards += 1
        else if (word.reviewKey === 'common-a1-verbs-editorial-008') commonA1VerbEditorialReadyCards += 1
        else if (word.reviewKey === 'common-a1-dialogue-editorial-009') commonA1DialogueEditorialReadyCards += 1
        else if (word.reviewKey === 'common-a1-shopping-health-editorial-010') commonA1ShoppingHealthEditorialReadyCards += 1
        else if (word.reviewKey === 'common-a1-study-work-editorial-011') commonA1StudyWorkEditorialReadyCards += 1
        else if (word.reviewKey === 'common-a1-actions-two-editorial-012') commonA1ActionsTwoEditorialReadyCards += 1
        else if (word.reviewKey === 'common-a1-travel-editorial-013') commonA1TravelEditorialReadyCards += 1
        else if (word.reviewKey === 'common-a1-health-remainder-editorial-014') commonA1HealthRemainderEditorialReadyCards += 1
        else errors.push(`未知 A1 编辑补缺批次: ${lesson.id} -> ${word.spanish}:${word.reviewKey}`)
      }
      if (word.reviewKey === 'common-a2-practical-editorial-015') {
        if (lesson.level !== 'A2') errors.push(`A2 实用编辑补缺卡必须属于 A2: ${lesson.id} -> ${word.spanish}`)
        if (!word.lemma || word.lemma !== target) errors.push(`A2 实用编辑补缺卡必须保存 canonical lemma: ${lesson.id} -> ${word.spanish}`)
        if (!word.partOfSpeech) errors.push(`A2 实用编辑补缺卡缺少词性: ${lesson.id} -> ${word.spanish}`)
        if (!word.frameworkReference?.startsWith('https://cvc.cervantes.es/')) errors.push(`A2 实用编辑补缺卡缺少 PCIC 等级参考: ${lesson.id} -> ${word.spanish}`)
        if (!word.example || !word.exampleChinese) errors.push(`A2 实用编辑补缺卡缺少中西例句: ${lesson.id} -> ${word.spanish}`)
        const normalizedExample = word.example?.toLocaleLowerCase('es-ES').normalize('NFC') ?? ''
        if (!normalizedExample.includes(target)) errors.push(`A2 实用编辑补缺例句没有使用目标: ${lesson.id} -> ${word.spanish}`)
        commonA2PracticalEditorialReadyCards += 1
      }
      if (word.reviewKey === 'intermediate-b1-editorial-001') {
        if (lesson.level !== 'B1') errors.push(`B1 旧目录编辑补缺卡必须属于 B1: ${lesson.id} -> ${word.spanish}`)
        if (!word.lemma) errors.push(`B1 旧目录编辑补缺卡缺少 lemma: ${lesson.id} -> ${word.spanish}`)
        if (!word.partOfSpeech) errors.push(`B1 旧目录编辑补缺卡缺少词性: ${lesson.id} -> ${word.spanish}`)
        if (!word.frameworkReference?.startsWith('https://cvc.cervantes.es/')) errors.push(`B1 旧目录编辑补缺卡缺少 PCIC 等级参考: ${lesson.id} -> ${word.spanish}`)
        if (!word.example || !word.exampleChinese) errors.push(`B1 旧目录编辑补缺卡缺少中西例句: ${lesson.id} -> ${word.spanish}`)
        const normalizedExample = word.example?.toLocaleLowerCase('es-ES').normalize('NFC') ?? ''
        if (!normalizedExample.includes(target)) errors.push(`B1 旧目录编辑补缺例句没有使用目标: ${lesson.id} -> ${word.spanish}`)
        intermediateB1EditorialReadyCards += 1
      }
      if (word.reviewKey === 'intermediate-b2-editorial-002') {
        if (lesson.level !== 'B2') errors.push(`B2 旧目录编辑补缺卡必须属于 B2: ${lesson.id} -> ${word.spanish}`)
        if (!word.lemma) errors.push(`B2 旧目录编辑补缺卡缺少 lemma: ${lesson.id} -> ${word.spanish}`)
        if (!word.partOfSpeech) errors.push(`B2 旧目录编辑补缺卡缺少词性: ${lesson.id} -> ${word.spanish}`)
        if (!word.frameworkReference?.startsWith('https://cvc.cervantes.es/')) errors.push(`B2 旧目录编辑补缺卡缺少 PCIC 等级参考: ${lesson.id} -> ${word.spanish}`)
        if (!word.example || !word.exampleChinese) errors.push(`B2 旧目录编辑补缺卡缺少中西例句: ${lesson.id} -> ${word.spanish}`)
        const normalizedExample = word.example?.toLocaleLowerCase('es-ES').normalize('NFC') ?? ''
        if (!normalizedExample.includes(target)) errors.push(`B2 旧目录编辑补缺例句没有使用目标: ${lesson.id} -> ${word.spanish}`)
        intermediateB2EditorialReadyCards += 1
      }
      if (recallClues.has(recallClue)) errors.push(`看义拼写提示与字符数冲突: ${lesson.id} -> ${recallClues.get(recallClue)} / ${word.spanish} (${word.chinese})`)
      recallClues.set(recallClue, word.spanish)
      if (word.lemma && word.partOfSpeech) structuredMetadataCards += 1
      if (word.example && word.exampleChinese) exampleCards += 1
      if (word.frameworkReference?.startsWith('https://cvc.cervantes.es/')) frameworkReferenceCards += 1
      kindCounts[lesson.kind] += 1
      levelCounts[lesson.level] += 1
    }
  }

  if (totalPracticeCards !== globalTargets.size) errors.push(`卡片总数与不重复目标数不一致: ${totalPracticeCards} / ${globalTargets.size}`)
  if (totalPracticeCards !== practiceCardIds.size) errors.push(`卡片总数与唯一学习 ID 数不一致: ${totalPracticeCards} / ${practiceCardIds.size}`)
  for (const [target, lessonId] of globalTargets) {
    const articleMatch = /^(?:el|la|los|las|un|una|unos|unas)\s+(.+)$/u.exec(target)
    if (articleMatch && globalTargets.has(articleMatch[1])) {
      errors.push(`冠词不应制造第二张语义重复卡: ${lessonId} -> ${target} / ${globalTargets.get(articleMatch[1])} -> ${articleMatch[1]}`)
    }
  }
  const legacyRedirectEntries = Object.entries(LEGACY_PRACTICE_CARD_ID_REDIRECTS)
  if (legacyRedirectEntries.length !== (catalogPolicy.expectedLegacyPracticeCardRedirects ?? 0)) errors.push(`旧学习卡重定向数量不符合基线: ${legacyRedirectEntries.length} / ${catalogPolicy.expectedLegacyPracticeCardRedirects ?? 0}`)
  for (const [legacyCardId, canonicalCardId] of legacyRedirectEntries) {
    const separatorIndex = legacyCardId.indexOf('::')
    const legacyLessonId = legacyCardId.slice(0, separatorIndex)
    const legacyTarget = legacyCardId.slice(separatorIndex + 2)
    if (globalTargets.has(legacyTarget)) errors.push(`旧重复目标仍留在 canonical 目录: ${legacyCardId}`)
    if (!practiceCardIds.has(canonicalCardId)) errors.push(`旧学习卡重定向找不到 canonical 卡: ${legacyCardId} -> ${canonicalCardId}`)
    if (practiceCardId(legacyLessonId, { spanish: legacyTarget }) !== canonicalCardId) errors.push(`旧学习卡运行时重定向失效: ${legacyCardId} -> ${canonicalCardId}`)
  }
  const overlayTargets = new Set()
  for (const overlay of vidaSupermarketExistingTargets) {
    const target = overlay.spanish.toLocaleLowerCase('es-ES').normalize('NFC').replace(/[¿?¡!.,;:]/g, '').replace(/\s+/g, ' ').trim()
    if (overlayTargets.has(target)) errors.push(`Vida 既有卡映射重复: ${overlay.spanish}`)
    overlayTargets.add(target)
    const word = globalWords.get(target)
    if (!word) errors.push(`Vida 既有卡映射找不到 canonical 目标: ${overlay.spanish}`)
    else if (!word.routes?.includes('life') || !word.lifePlacements?.some((placement) => placement.module === 'supermarket')) errors.push(`Vida 既有卡映射未进入超市生活模块: ${overlay.spanish}`)
  }
  const mobilityOverlayTargets = new Set()
  const mobilityTierCounts = { L1: 0, L2: 0, L3: 0 }
  let mobilityFreeCards = 0
  for (const overlay of vidaMobilityTargets) {
    const target = overlay.spanish.toLocaleLowerCase('es-ES').normalize('NFC').replace(/[¿?¡!.,;:]/g, '').replace(/\s+/g, ' ').trim()
    if (mobilityOverlayTargets.has(target)) errors.push(`Vida 出行映射重复: ${overlay.spanish}`)
    mobilityOverlayTargets.add(target)
    const word = globalWords.get(target)
    if (!word) errors.push(`Vida 出行映射找不到 canonical 目标: ${overlay.spanish}`)
    else if (!word.routes?.includes('life') || !word.lifePlacements?.some((placement) => placement.module === 'mobility')) errors.push(`Vida 出行映射未进入生活路线: ${overlay.spanish}`)
    else if (!word.routes?.includes('exam')) errors.push(`Vida 出行 V1 应复用考试路线 canonical 卡: ${overlay.spanish}`)
    if (globalTargets.get(target)?.startsWith('vida-')) errors.push(`Vida 出行 V1 不应复制超市新增卡: ${overlay.spanish}`)
    mobilityTierCounts[overlay.tier] += 1
    if (overlay.access === 'free') mobilityFreeCards += 1
  }
  const settlingOverlayTargets = new Set()
  const settlingTierCounts = { L1: 0, L2: 0, L3: 0 }
  let settlingFreeCards = 0
  for (const overlay of vidaSettlingTargets) {
    const target = overlay.spanish.toLocaleLowerCase('es-ES').normalize('NFC').replace(/[¿?¡!.,;:]/g, '').replace(/\s+/g, ' ').trim()
    if (settlingOverlayTargets.has(target)) errors.push(`Vida 安顿映射重复: ${overlay.spanish}`)
    settlingOverlayTargets.add(target)
    const word = globalWords.get(target)
    if (!word) errors.push(`Vida 安顿映射找不到 canonical 目标: ${overlay.spanish}`)
    else if (!word.routes?.includes('life') || !word.lifePlacements?.some((placement) => placement.module === 'settling')) errors.push(`Vida 安顿映射未进入生活路线: ${overlay.spanish}`)
    else if (!word.routes?.includes('exam')) errors.push(`Vida 安顿 V1 应复用考试路线 canonical 卡: ${overlay.spanish}`)
    if (globalTargets.get(target)?.startsWith('vida-')) errors.push(`Vida 安顿 V1 不应复制超市新增卡: ${overlay.spanish}`)
    settlingTierCounts[overlay.tier] += 1
    if (overlay.access === 'free') settlingFreeCards += 1
  }
  const dailyOverlayTargets = new Set()
  const dailyTierCounts = { L1: 0, L2: 0, L3: 0 }
  let dailyFreeCards = 0
  let dailyRankedCards = 0
  for (const overlay of vidaDailyTargets) {
    const target = overlay.spanish.toLocaleLowerCase('es-ES').normalize('NFC').replace(/[¿?¡!.,;:]/g, '').replace(/\s+/g, ' ').trim()
    if (dailyOverlayTargets.has(target)) errors.push(`Vida 高频日常映射重复: ${overlay.spanish}`)
    dailyOverlayTargets.add(target)
    const word = globalWords.get(target)
    if (!word) errors.push(`Vida 高频日常映射找不到 canonical 目标: ${overlay.spanish}`)
    else if (!word.routes?.includes('life') || !word.lifePlacements?.some((placement) => placement.module === 'daily')) errors.push(`Vida 高频日常映射未进入生活路线: ${overlay.spanish}`)
    else if (!word.routes?.includes('exam')) errors.push(`Vida 高频日常 V1 应复用考试路线 canonical 卡: ${overlay.spanish}`)
    if (globalTargets.get(target)?.startsWith('vida-')) errors.push(`Vida 高频日常 V1 不应复制超市新增卡: ${overlay.spanish}`)
    dailyTierCounts[overlay.tier] += 1
    if (overlay.access === 'free') dailyFreeCards += 1
    if (Number.isInteger(word?.frequencyRank)) dailyRankedCards += 1
  }
  for (const [kind, minimum] of Object.entries(catalogPolicy.minimumCardsByKind)) {
    if (kindCounts[kind] < minimum) errors.push(`${kind} 不应低于扩库基线 ${minimum}，实际为 ${kindCounts[kind]}`)
  }
  for (const [level, minimum] of Object.entries(catalogPolicy.minimumCardsByLevel)) {
    if (levelCounts[level] < minimum) errors.push(`${level} 不应低于扩库基线 ${minimum}，实际为 ${levelCounts[level]}`)
  }
  for (const [route, minimum] of Object.entries(catalogPolicy.minimumCardsByRoute ?? {})) {
    if (routeCounts[route] < minimum) errors.push(`${route} 路线不应低于扩库基线 ${minimum}，实际为 ${routeCounts[route]}`)
  }
  if (vidaSupermarketCards < (catalogPolicy.minimumVidaSupermarketCards ?? 0)) errors.push(`Vida 超市模块不应低于扩库基线 ${catalogPolicy.minimumVidaSupermarketCards}，实际为 ${vidaSupermarketCards}`)
  if (vidaNewSupermarketCards < (catalogPolicy.minimumVidaNewSupermarketCards ?? 0)) errors.push(`Vida 超市新增卡不应低于扩库基线 ${catalogPolicy.minimumVidaNewSupermarketCards}，实际为 ${vidaNewSupermarketCards}`)
  if (vidaSupermarketGapCards < (catalogPolicy.minimumVidaSupermarketGapCards ?? 0)) errors.push(`Vida 超市第四批缺口卡不应低于基线 ${catalogPolicy.minimumVidaSupermarketGapCards}，实际为 ${vidaSupermarketGapCards}`)
  if (vidaSupermarketGapSharedWithExam < (catalogPolicy.minimumVidaSupermarketGapSharedWithExam ?? 0)) errors.push(`Vida 超市第四批考试路线共享卡不应低于基线 ${catalogPolicy.minimumVidaSupermarketGapSharedWithExam}，实际为 ${vidaSupermarketGapSharedWithExam}`)
  if (vidaSupermarketGapLifeOnly < (catalogPolicy.minimumVidaSupermarketGapLifeOnly ?? 0)) errors.push(`Vida 超市第四批生活专门卡不应低于基线 ${catalogPolicy.minimumVidaSupermarketGapLifeOnly}，实际为 ${vidaSupermarketGapLifeOnly}`)
  if (supermarketFreeCards < (catalogPolicy.minimumVidaSupermarketFreeCards ?? 0)) errors.push(`Vida 超市免费体验不应低于扩库基线 ${catalogPolicy.minimumVidaSupermarketFreeCards}，实际为 ${supermarketFreeCards}`)
  for (const [tier, minimum] of Object.entries(catalogPolicy.minimumVidaSupermarketCardsByTier ?? {})) {
    if (supermarketTierCounts[tier] < minimum) errors.push(`Vida 超市 ${tier} 不应低于扩库基线 ${minimum}，实际为 ${supermarketTierCounts[tier]}`)
  }
  if (vidaMobilityCards < (catalogPolicy.minimumVidaMobilityCards ?? 0)) errors.push(`Vida 出行模块不应低于扩库基线 ${catalogPolicy.minimumVidaMobilityCards}，实际为 ${vidaMobilityCards}`)
  if (mobilityFreeCards < (catalogPolicy.minimumVidaMobilityFreeCards ?? 0)) errors.push(`Vida 出行免费体验不应低于扩库基线 ${catalogPolicy.minimumVidaMobilityFreeCards}，实际为 ${mobilityFreeCards}`)
  for (const [tier, minimum] of Object.entries(catalogPolicy.minimumVidaMobilityCardsByTier ?? {})) {
    if (mobilityTierCounts[tier] < minimum) errors.push(`Vida 出行 ${tier} 不应低于扩库基线 ${minimum}，实际为 ${mobilityTierCounts[tier]}`)
  }
  if (vidaSettlingCards < (catalogPolicy.minimumVidaSettlingCards ?? 0)) errors.push(`Vida 安顿模块不应低于扩库基线 ${catalogPolicy.minimumVidaSettlingCards}，实际为 ${vidaSettlingCards}`)
  if (settlingFreeCards < (catalogPolicy.minimumVidaSettlingFreeCards ?? 0)) errors.push(`Vida 安顿免费体验不应低于扩库基线 ${catalogPolicy.minimumVidaSettlingFreeCards}，实际为 ${settlingFreeCards}`)
  for (const [tier, minimum] of Object.entries(catalogPolicy.minimumVidaSettlingCardsByTier ?? {})) {
    if (settlingTierCounts[tier] < minimum) errors.push(`Vida 安顿 ${tier} 不应低于扩库基线 ${minimum}，实际为 ${settlingTierCounts[tier]}`)
  }
  if (vidaDailyCards < (catalogPolicy.minimumVidaDailyCards ?? 0)) errors.push(`Vida 高频日常模块不应低于扩库基线 ${catalogPolicy.minimumVidaDailyCards}，实际为 ${vidaDailyCards}`)
  if (dailyFreeCards < (catalogPolicy.minimumVidaDailyFreeCards ?? 0)) errors.push(`Vida 高频日常免费体验不应低于扩库基线 ${catalogPolicy.minimumVidaDailyFreeCards}，实际为 ${dailyFreeCards}`)
  if (dailyRankedCards < (catalogPolicy.minimumVidaDailyRankedCards ?? 0)) errors.push(`Vida 高频日常带词频排名卡不应低于扩库基线 ${catalogPolicy.minimumVidaDailyRankedCards}，实际为 ${dailyRankedCards}`)
  for (const [tier, minimum] of Object.entries(catalogPolicy.minimumVidaDailyCardsByTier ?? {})) {
    if (dailyTierCounts[tier] < minimum) errors.push(`Vida 高频日常 ${tier} 不应低于扩库基线 ${minimum}，实际为 ${dailyTierCounts[tier]}`)
  }
  if (examMobilityCards < (catalogPolicy.minimumExamMobilityCards ?? 0)) errors.push(`考试路线出行补缺不应低于扩库基线 ${catalogPolicy.minimumExamMobilityCards}，实际为 ${examMobilityCards}`)
  if (examStructuralGapCards < (catalogPolicy.minimumExamStructuralGapCards ?? 0)) errors.push(`考试路线功能与生活主题补缺不应低于扩库基线 ${catalogPolicy.minimumExamStructuralGapCards}，实际为 ${examStructuralGapCards}`)
  if (examTransactionFunctionCards < (catalogPolicy.minimumExamTransactionFunctionCards ?? 0)) errors.push(`考试路线 B1 交易与功能补缺不应低于扩库基线 ${catalogPolicy.minimumExamTransactionFunctionCards}，实际为 ${examTransactionFunctionCards}`)
  if (advancedEditorialReadyCards < (catalogPolicy.minimumAdvancedEditorialReadyCards ?? 0)) errors.push(`C1–C2 编辑就绪卡不应低于基线 ${catalogPolicy.minimumAdvancedEditorialReadyCards}，实际为 ${advancedEditorialReadyCards}`)
  if (advancedC1EditorialReadyCards < (catalogPolicy.minimumAdvancedC1EditorialReadyCards ?? 0)) errors.push(`C1 候选编辑就绪卡不应低于基线 ${catalogPolicy.minimumAdvancedC1EditorialReadyCards}，实际为 ${advancedC1EditorialReadyCards}`)
  if (advancedC2EditorialReadyCards < (catalogPolicy.minimumAdvancedC2EditorialReadyCards ?? 0)) errors.push(`C2 候选编辑就绪卡不应低于基线 ${catalogPolicy.minimumAdvancedC2EditorialReadyCards}，实际为 ${advancedC2EditorialReadyCards}`)
  if (legacyLexicalMetadataCards < (catalogPolicy.minimumLegacyLexicalMetadataCards ?? 0)) errors.push(`旧目录结构化词条不应低于基线 ${catalogPolicy.minimumLegacyLexicalMetadataCards}，实际为 ${legacyLexicalMetadataCards}`)
  if (structuredMetadataCards !== totalPracticeCards) errors.push(`所有 canonical 卡必须具有 lemma 与词性，实际为 ${structuredMetadataCards}/${totalPracticeCards}`)
  if (exampleCards !== totalPracticeCards) errors.push(`所有 canonical 卡必须具有中西双语例句，实际为 ${exampleCards}/${totalPracticeCards}`)
  if (frameworkReferenceCards !== totalPracticeCards) errors.push(`所有 canonical 卡必须具有 PCIC 框架参考，实际为 ${frameworkReferenceCards}/${totalPracticeCards}`)
  if (commonA1EditorialReadyCards < (catalogPolicy.minimumCommonA1EditorialReadyCards ?? 0)) errors.push(`A1 基础编辑就绪卡不应低于基线 ${catalogPolicy.minimumCommonA1EditorialReadyCards}，实际为 ${commonA1EditorialReadyCards}`)
  if (commonA1TimeEditorialReadyCards < (catalogPolicy.minimumCommonA1TimeEditorialReadyCards ?? 0)) errors.push(`A1 时间编辑就绪卡不应低于基线 ${catalogPolicy.minimumCommonA1TimeEditorialReadyCards}，实际为 ${commonA1TimeEditorialReadyCards}`)
  if (commonA1QuantityEditorialReadyCards < (catalogPolicy.minimumCommonA1QuantityEditorialReadyCards ?? 0)) errors.push(`A1 数量编辑就绪卡不应低于基线 ${catalogPolicy.minimumCommonA1QuantityEditorialReadyCards}，实际为 ${commonA1QuantityEditorialReadyCards}`)
  if (commonA1FamilyEditorialReadyCards < (catalogPolicy.minimumCommonA1FamilyEditorialReadyCards ?? 0)) errors.push(`A1 家庭编辑就绪卡不应低于基线 ${catalogPolicy.minimumCommonA1FamilyEditorialReadyCards}，实际为 ${commonA1FamilyEditorialReadyCards}`)
  if (commonA1HomeEditorialReadyCards < (catalogPolicy.minimumCommonA1HomeEditorialReadyCards ?? 0)) errors.push(`A1 家居编辑就绪卡不应低于基线 ${catalogPolicy.minimumCommonA1HomeEditorialReadyCards}，实际为 ${commonA1HomeEditorialReadyCards}`)
  if (commonA1CityEditorialReadyCards < (catalogPolicy.minimumCommonA1CityEditorialReadyCards ?? 0)) errors.push(`A1 城市编辑就绪卡不应低于基线 ${catalogPolicy.minimumCommonA1CityEditorialReadyCards}，实际为 ${commonA1CityEditorialReadyCards}`)
  if (commonA1FoodEditorialReadyCards < (catalogPolicy.minimumCommonA1FoodEditorialReadyCards ?? 0)) errors.push(`A1 食物编辑就绪卡不应低于基线 ${catalogPolicy.minimumCommonA1FoodEditorialReadyCards}，实际为 ${commonA1FoodEditorialReadyCards}`)
  if (commonA1VerbEditorialReadyCards < (catalogPolicy.minimumCommonA1VerbEditorialReadyCards ?? 0)) errors.push(`A1 动词编辑就绪卡不应低于基线 ${catalogPolicy.minimumCommonA1VerbEditorialReadyCards}，实际为 ${commonA1VerbEditorialReadyCards}`)
  if (commonA1DialogueEditorialReadyCards < (catalogPolicy.minimumCommonA1DialogueEditorialReadyCards ?? 0)) errors.push(`A1 对话编辑就绪卡不应低于基线 ${catalogPolicy.minimumCommonA1DialogueEditorialReadyCards}，实际为 ${commonA1DialogueEditorialReadyCards}`)
  if (commonA1ShoppingHealthEditorialReadyCards < (catalogPolicy.minimumCommonA1ShoppingHealthEditorialReadyCards ?? 0)) errors.push(`A1 购物健康编辑就绪卡不应低于基线 ${catalogPolicy.minimumCommonA1ShoppingHealthEditorialReadyCards}，实际为 ${commonA1ShoppingHealthEditorialReadyCards}`)
  if (commonA1StudyWorkEditorialReadyCards < (catalogPolicy.minimumCommonA1StudyWorkEditorialReadyCards ?? 0)) errors.push(`A1 学习工作编辑就绪卡不应低于基线 ${catalogPolicy.minimumCommonA1StudyWorkEditorialReadyCards}，实际为 ${commonA1StudyWorkEditorialReadyCards}`)
  if (commonA1ActionsTwoEditorialReadyCards < (catalogPolicy.minimumCommonA1ActionsTwoEditorialReadyCards ?? 0)) errors.push(`A1 第二组动作编辑就绪卡不应低于基线 ${catalogPolicy.minimumCommonA1ActionsTwoEditorialReadyCards}，实际为 ${commonA1ActionsTwoEditorialReadyCards}`)
  if (commonA1TravelEditorialReadyCards < (catalogPolicy.minimumCommonA1TravelEditorialReadyCards ?? 0)) errors.push(`A1 出行编辑就绪卡不应低于基线 ${catalogPolicy.minimumCommonA1TravelEditorialReadyCards}，实际为 ${commonA1TravelEditorialReadyCards}`)
  if (commonA1HealthRemainderEditorialReadyCards < (catalogPolicy.minimumCommonA1HealthRemainderEditorialReadyCards ?? 0)) errors.push(`A1 健康收尾编辑就绪卡不应低于基线 ${catalogPolicy.minimumCommonA1HealthRemainderEditorialReadyCards}，实际为 ${commonA1HealthRemainderEditorialReadyCards}`)
  if (commonA2PracticalEditorialReadyCards < (catalogPolicy.minimumCommonA2PracticalEditorialReadyCards ?? 0)) errors.push(`A2 实用编辑就绪卡不应低于基线 ${catalogPolicy.minimumCommonA2PracticalEditorialReadyCards}，实际为 ${commonA2PracticalEditorialReadyCards}`)
  if (intermediateB1EditorialReadyCards < (catalogPolicy.minimumIntermediateB1EditorialReadyCards ?? 0)) errors.push(`B1 旧目录编辑就绪卡不应低于基线 ${catalogPolicy.minimumIntermediateB1EditorialReadyCards}，实际为 ${intermediateB1EditorialReadyCards}`)
  if (intermediateB2EditorialReadyCards < (catalogPolicy.minimumIntermediateB2EditorialReadyCards ?? 0)) errors.push(`B2 旧目录编辑就绪卡不应低于基线 ${catalogPolicy.minimumIntermediateB2EditorialReadyCards}，实际为 ${intermediateB2EditorialReadyCards}`)
  if (errors.length) {
    console.error(errors.join('\n'))
    process.exitCode = 1
  } else {
    console.log(JSON.stringify({ lessons: lessons.length, cards: totalPracticeCards, uniquePracticeCardIds: practiceCardIds.size, legacyPracticeCardRedirects: legacyRedirectEntries.length, expansionCards, vidaSupermarketCards, vidaNewSupermarketCards, vidaSupermarketGapCards, vidaSupermarketGapSharedWithExam, vidaSupermarketGapLifeOnly, supermarketFreeCards, supermarketTierCounts, vidaMobilityCards, mobilityFreeCards, mobilityTierCounts, vidaSettlingCards, settlingFreeCards, settlingTierCounts, vidaDailyCards, dailyFreeCards, dailyRankedCards, dailyTierCounts, examMobilityCards, examStructuralGapCards, examTransactionFunctionCards, advancedEditorialReadyCards, advancedC1EditorialReadyCards, advancedC2EditorialReadyCards, legacyLexicalMetadataCards, structuredMetadataCards, exampleCards, frameworkReferenceCards, commonA1EditorialReadyCards, commonA1TimeEditorialReadyCards, commonA1QuantityEditorialReadyCards, commonA1FamilyEditorialReadyCards, commonA1HomeEditorialReadyCards, commonA1CityEditorialReadyCards, commonA1FoodEditorialReadyCards, commonA1VerbEditorialReadyCards, commonA1DialogueEditorialReadyCards, commonA1ShoppingHealthEditorialReadyCards, commonA1StudyWorkEditorialReadyCards, commonA1ActionsTwoEditorialReadyCards, commonA1TravelEditorialReadyCards, commonA1HealthRemainderEditorialReadyCards, commonA2PracticalEditorialReadyCards, intermediateB1EditorialReadyCards, intermediateB2EditorialReadyCards, kindCounts, levelCounts, routeCounts }, null, 2))
  }
} finally {
  await server.close()
}
