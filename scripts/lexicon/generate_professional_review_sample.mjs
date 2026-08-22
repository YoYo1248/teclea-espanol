import fs from 'node:fs'
import path from 'node:path'
import { createServer } from 'vite'
import { KINDS, LEVELS, normalizeTarget, parseArgs } from './lexicon-utils.mjs'

const args = parseArgs(process.argv.slice(2))
const output = path.resolve(String(args.output ?? 'docs/lexicon/PROFESSIONAL_REVIEW_SAMPLE.csv'))
const LIFE_MODULES = ['supermarket', 'mobility', 'settling', 'daily']
const LIFE_TIERS = ['L1', 'L2', 'L3']

function csvCell(value) {
  const stringValue = value == null ? '' : String(value)
  return `"${stringValue.replaceAll('"', '""')}"`
}

function reviewBatchNumber(reviewKey) {
  const match = reviewKey?.match(/-(\d+)$/)
  return match ? Number(match[1]) : 0
}

function reviewPriority(card) {
  if (card.reviewKey === 'vida-supermarket-gap-editorial-004') return 1000
  return reviewBatchNumber(card.reviewKey)
}

function diversePick(candidates, count, usedTargets) {
  const selected = []
  while (selected.length < count) {
    const kindCounts = Object.fromEntries(KINDS.map((kind) => [kind, selected.filter((card) => card.kind === kind).length]))
    const lessonCounts = Object.fromEntries(candidates.map((card) => card.lessonId).map((lessonId) => [lessonId, selected.filter((card) => card.lessonId === lessonId).length]))
    const next = candidates
      .filter((card) => !usedTargets.has(card.normalizedTarget) && !selected.some((item) => item.normalizedTarget === card.normalizedTarget))
      .sort((left, right) => (
        Number(!left.reviewKey) - Number(!right.reviewKey)
        || reviewPriority(right) - reviewPriority(left)
        || right.reviewKey.localeCompare(left.reviewKey)
        || kindCounts[left.kind] - kindCounts[right.kind]
        || lessonCounts[left.lessonId] - lessonCounts[right.lessonId]
        || (left.frequencyRank ?? Number.MAX_SAFE_INTEGER) - (right.frequencyRank ?? Number.MAX_SAFE_INTEGER)
        || left.spanish.localeCompare(right.spanish, 'es')
      ))[0]
    if (!next) break
    selected.push(next)
  }
  selected.forEach((card) => usedTargets.add(card.normalizedTarget))
  return selected
}

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } })
try {
  const { lessons } = await server.ssrLoadModule('/src/data.ts')
  const cards = lessons.flatMap((lesson) => lesson.words.map((word) => ({
    lessonId: lesson.id,
    level: lesson.level,
    scene: lesson.scene,
    kind: lesson.kind,
    spanish: word.spanish,
    chinese: word.chinese,
    lemma: word.lemma ?? '',
    partOfSpeech: word.partOfSpeech ?? '',
    frequencyRank: word.frequencyRank ?? null,
    frameworkReference: word.frameworkReference ?? '',
    reviewKey: word.reviewKey ?? '',
    example: word.example ?? '',
    exampleChinese: word.exampleChinese ?? '',
    sourceName: word.source.name,
    sourceUrl: word.source.url,
    routes: word.routes ?? ['exam'],
    lifePlacements: word.lifePlacements ?? (word.lifeModule && word.lifeTier && word.access
      ? [{ module: word.lifeModule, tier: word.lifeTier, access: word.access }]
      : []),
    normalizedTarget: normalizeTarget(word.spanish),
  })))

  const usedTargets = new Set()
  const rows = []
  const reviewableCards = cards.filter((card) => card.example && card.exampleChinese)
  for (const module of LIFE_MODULES) {
    for (const tier of LIFE_TIERS) {
      const candidates = reviewableCards.filter((card) => card.lifePlacements.some((placement) => placement.module === module && placement.tier === tier))
      const freeCandidates = candidates.filter((card) => card.lifePlacements.some((placement) => placement.module === module && placement.tier === tier && placement.access === 'free'))
      const paidCandidates = candidates.filter((card) => card.lifePlacements.some((placement) => placement.module === module && placement.tier === tier && placement.access === 'paid'))
      const freeQuota = tier === 'L1' ? Math.min(2, freeCandidates.length) : 0
      const paidQuota = tier === 'L1' ? Math.min(2, paidCandidates.length) : 4 - freeQuota
      const selected = [
        ...diversePick(freeCandidates, freeQuota, usedTargets),
        ...diversePick(paidCandidates, paidQuota, usedTargets),
        ...diversePick(candidates, 4 - freeQuota - paidQuota, usedTargets),
      ]
      if (selected.length !== 4) throw new Error(`Unable to select 4 unique review cards for ${module}:${tier}`)
      selected.forEach((card) => rows.push({ ...card, reviewScope: `life:${module}:${tier}` }))
    }
  }

  for (const level of LEVELS) {
    const candidates = reviewableCards.filter((card) => card.level === level && card.routes.includes('exam') && card.lifePlacements.length === 0)
    const selected = diversePick(candidates, 4, usedTargets)
    if (selected.length !== 4) throw new Error(`Unable to select 4 unique exam-only review cards for ${level}`)
    selected.forEach((card) => rows.push({ ...card, reviewScope: `exam-only:${level}` }))
  }

  const headers = [
    'reviewScope', 'spanish', 'chinese', 'lemma', 'partOfSpeech', 'level', 'scene', 'kind', 'routes', 'lifePlacements',
    'frequencyRank', 'frameworkReference', 'example', 'exampleChinese', 'sourceName', 'sourceUrl',
    'spellingStatus', 'spanishNaturalnessStatus', 'chineseMeaningStatus', 'exampleStatus', 'levelStatus', 'lifeTierStatus',
    'decision', 'suggestedSpanish', 'suggestedChinese', 'suggestedExample', 'reviewNotes', 'reviewerName', 'reviewerRole', 'reviewedAt',
  ]
  const csvRows = rows.map((row) => ({
    ...row,
    routes: row.routes.join('|'),
    lifePlacements: row.lifePlacements.map((placement) => `${placement.module}:${placement.tier}:${placement.access}`).join('|'),
    spellingStatus: '',
    spanishNaturalnessStatus: '',
    chineseMeaningStatus: '',
    exampleStatus: '',
    levelStatus: '',
    lifeTierStatus: '',
    decision: '',
    suggestedSpanish: '',
    suggestedChinese: '',
    suggestedExample: '',
    reviewNotes: '',
    reviewerName: '',
    reviewerRole: '',
    reviewedAt: '',
  }))
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.writeFileSync(output, `${headers.map(csvCell).join(',')}\n${csvRows.map((row) => headers.map((header) => csvCell(row[header])).join(',')).join('\n')}\n`)
  console.log(JSON.stringify({
    output,
    rows: rows.length,
    lifeRows: rows.filter((row) => row.reviewScope.startsWith('life:')).length,
    examOnlyRows: rows.filter((row) => row.reviewScope.startsWith('exam-only:')).length,
    uniqueTargets: usedTargets.size,
    note: 'Blank reviewer fields are intentional. Generation prepares a sample; it never records or implies professional approval.',
  }, null, 2))
} finally {
  await server.close()
}
