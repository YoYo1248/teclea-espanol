import crypto from 'node:crypto'
import path from 'node:path'
import fs from 'node:fs'
import { createServer } from 'vite'
import { normalizeTarget, parseArgs, writeJsonLines } from './lexicon-utils.mjs'
import { REVIEW_DECISIONS, REVIEW_STATUSES, catalogReviewDigest, createCatalogReviewSnapshot } from './professional-review-utils.mjs'

const args = parseArgs(process.argv.slice(2))
const input = path.resolve(String(args.input ?? 'docs/lexicon/PROFESSIONAL_REVIEW_SAMPLE.csv'))
const output = path.resolve(String(args.output ?? 'artifacts/lexicon/staged-professional-reviews.jsonl'))

function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        cell += '"'
        index += 1
      } else if (character === '"') quoted = false
      else cell += character
    } else if (character === '"') quoted = true
    else if (character === ',') {
      row.push(cell)
      cell = ''
    } else if (character === '\n') {
      row.push(cell.replace(/\r$/, ''))
      if (row.some((value) => value !== '')) rows.push(row)
      row = []
      cell = ''
    } else cell += character
  }
  if (quoted) throw new Error('CSV 结尾仍处于引号内')
  if (cell || row.length) {
    row.push(cell.replace(/\r$/, ''))
    if (row.some((value) => value !== '')) rows.push(row)
  }
  return rows
}

function parseList(value) {
  return String(value ?? '').split('|').map((item) => item.trim()).filter(Boolean).sort()
}

function parsePlacements(value) {
  return parseList(value).map((item) => {
    const [module, tier, access, ...rest] = item.split(':')
    if (!module || !tier || !access || rest.length) throw new Error(`lifePlacements 格式无效: ${item}`)
    return { module, tier, access }
  }).sort((left, right) => `${left.module}:${left.tier}:${left.access}`.localeCompare(`${right.module}:${right.tier}:${right.access}`))
}

function validIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) return false
  return new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right)
}

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } })
try {
  const csvRows = parseCsv(fs.readFileSync(input, 'utf8'))
  if (csvRows.length < 2) throw new Error('CSV 没有可导入的复核行')
  const headers = csvRows[0]
  const requiredHeaders = [
    'reviewScope', 'spanish', 'chinese', 'lemma', 'partOfSpeech', 'level', 'scene', 'kind', 'routes', 'lifePlacements', 'frameworkReference', 'example', 'exampleChinese',
    'spellingStatus', 'spanishNaturalnessStatus', 'chineseMeaningStatus', 'exampleStatus', 'levelStatus', 'lifeTierStatus',
    'decision', 'reviewNotes', 'reviewerName', 'reviewerRole', 'reviewedAt',
    'suggestedSpanish', 'suggestedChinese', 'suggestedExample',
  ]
  const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header))
  if (missingHeaders.length) throw new Error(`CSV 缺少列: ${missingHeaders.join(', ')}`)
  const tableRows = csvRows.slice(1).map((values, index) => {
    if (values.length !== headers.length) throw new Error(`CSV 第 ${index + 2} 行列数为 ${values.length}，应为 ${headers.length}`)
    return { rowNumber: index + 2, row: Object.fromEntries(headers.map((header, column) => [header, values[column]])) }
  })
  const reviewSignalHeaders = [
    'spellingStatus', 'spanishNaturalnessStatus', 'chineseMeaningStatus', 'exampleStatus', 'levelStatus', 'lifeTierStatus',
    'decision', 'suggestedSpanish', 'suggestedChinese', 'suggestedExample', 'reviewNotes', 'reviewerName', 'reviewerRole', 'reviewedAt',
  ]
  const submittedRows = tableRows.filter(({ row }) => reviewSignalHeaders.some((header) => row[header].trim()))
  if (!submittedRows.length) throw new Error(`CSV 的 ${tableRows.length} 行都是未填写样本；请由真实复核人填写后再导入`)

  const { lessons } = await server.ssrLoadModule('/src/data.ts')
  const cards = lessons.flatMap((lesson) => lesson.words.map((word) => ({
    ...word,
    level: lesson.level,
    scene: lesson.scene,
    kind: lesson.kind,
    routes: word.routes ?? ['exam'],
    lifePlacements: word.lifePlacements ?? (word.lifeModule && word.lifeTier && word.access
      ? [{ module: word.lifeModule, tier: word.lifeTier, access: word.access }]
      : []),
  })))
  const catalogByTarget = new Map(cards.map((card) => [normalizeTarget(card.spanish), card]))
  const errors = []
  const staged = []
  const seenTargets = new Set()

  submittedRows.forEach(({ row, rowNumber }) => {
    const target = normalizeTarget(row.spanish)
    const card = catalogByTarget.get(target)
    if (!card) {
      errors.push(`第 ${rowNumber} 行: ${row.spanish} 不在当前 canonical 目录`)
      return
    }
    if (seenTargets.has(target)) errors.push(`第 ${rowNumber} 行: 输入目标重复 ${row.spanish}`)
    seenTargets.add(target)
    const snapshot = createCatalogReviewSnapshot(card)
    const csvSnapshot = {
      spanish: row.spanish,
      normalizedTarget: target,
      chinese: row.chinese,
      lemma: row.lemma ?? '',
      partOfSpeech: row.partOfSpeech ?? '',
      level: row.level,
      scene: row.scene,
      kind: row.kind,
      routes: parseList(row.routes),
      lifePlacements: parsePlacements(row.lifePlacements),
      frameworkReference: row.frameworkReference,
      example: row.example,
      exampleChinese: row.exampleChinese,
    }
    if (!sameJson(snapshot, csvSnapshot)) {
      errors.push(`第 ${rowNumber} 行: ${row.spanish} 的待审快照与当前目录不同，请重新生成样本后再审`)
    }
    const checks = {
      spelling: row.spellingStatus,
      spanishNaturalness: row.spanishNaturalnessStatus,
      chineseMeaning: row.chineseMeaningStatus,
      example: row.exampleStatus,
      level: row.levelStatus,
      lifeTier: row.lifeTierStatus,
    }
    for (const [name, status] of Object.entries(checks)) {
      if (!REVIEW_STATUSES.includes(status)) errors.push(`第 ${rowNumber} 行: ${name} 状态无效或仍为空`)
    }
    if (!REVIEW_DECISIONS.includes(row.decision)) errors.push(`第 ${rowNumber} 行: decision 无效或仍为空`)
    if (!row.reviewerName.trim() || !row.reviewerRole.trim()) errors.push(`第 ${rowNumber} 行: 缺少复核人姓名或角色`)
    if (!validIsoDate(row.reviewedAt)) errors.push(`第 ${rowNumber} 行: reviewedAt 必须为有效 ISO 日期`)
    const lifeCard = snapshot.lifePlacements.length > 0
    if (lifeCard && checks.lifeTier === 'not-applicable') errors.push(`第 ${rowNumber} 行: 生活卡必须复核 lifeTier`)
    if (!lifeCard && checks.lifeTier !== 'not-applicable') errors.push(`第 ${rowNumber} 行: 非生活卡的 lifeTier 应为 not-applicable`)
    if (row.decision === 'pass') {
      for (const name of ['spelling', 'spanishNaturalness', 'chineseMeaning', 'example', 'level']) {
        if (checks[name] !== 'pass') errors.push(`第 ${rowNumber} 行: decision=pass 时 ${name} 必须为 pass`)
      }
      if (lifeCard && checks.lifeTier !== 'pass') errors.push(`第 ${rowNumber} 行: decision=pass 的生活卡 lifeTier 必须为 pass`)
      if (!snapshot.example || !snapshot.exampleChinese) errors.push(`第 ${rowNumber} 行: 缺少双语例句的卡不能通过专业复核`)
    }
    if (row.decision && row.decision !== 'pass' && !row.reviewNotes.trim() && !row.suggestedSpanish.trim() && !row.suggestedChinese.trim() && !row.suggestedExample.trim()) {
      errors.push(`第 ${rowNumber} 行: revise/reject 必须填写原因或修改建议`)
    }
    const digest = catalogReviewDigest(snapshot)
    const idDigest = crypto.createHash('sha256').update(`${target}|${row.reviewerName}|${row.reviewedAt}|${digest}`).digest('hex').slice(0, 16)
    staged.push({
      schemaVersion: 1,
      reviewId: `professional-${row.reviewedAt}-${idDigest}`,
      reviewScope: row.reviewScope,
      normalizedTarget: target,
      catalogDigest: digest,
      reviewedContent: snapshot,
      checks,
      decision: row.decision,
      suggestions: {
        spanish: row.suggestedSpanish,
        chinese: row.suggestedChinese,
        example: row.suggestedExample,
      },
      notes: row.reviewNotes,
      reviewer: { name: row.reviewerName.trim(), role: row.reviewerRole.trim() },
      reviewedAt: row.reviewedAt,
    })
  })

  if (errors.length) {
    const visibleErrors = errors.slice(0, 24)
    console.error(`${visibleErrors.join('\n')}${errors.length > visibleErrors.length ? `\n... 另有 ${errors.length - visibleErrors.length} 个错误；请先完整填写审核状态、结论、复核人和日期。` : ''}`)
    process.exitCode = 1
  } else {
    writeJsonLines(output, staged)
    console.log(JSON.stringify({
      input,
      output,
      staged: staged.length,
      skippedBlankRows: tableRows.length - submittedRows.length,
      passed: staged.filter((record) => record.decision === 'pass').length,
      needsRevision: staged.filter((record) => record.decision === 'revise').length,
      rejected: staged.filter((record) => record.decision === 'reject').length,
      note: 'Validated records are staged only. Inspect them before adding a dated JSONL batch under data/lexicon/professional-reviews/.',
    }, null, 2))
  }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
} finally {
  await server.close()
}
