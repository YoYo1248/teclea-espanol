import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { normalizeTarget, readJsonLines } from './lexicon-utils.mjs'

export const REVIEW_STATUSES = ['pass', 'revise', 'reject', 'not-applicable']
export const REVIEW_DECISIONS = ['pass', 'revise', 'reject']
export const REQUIRED_CHECKS = ['spelling', 'spanishNaturalness', 'chineseMeaning', 'example', 'level', 'lifeTier']

function stablePlacements(placements = []) {
  return placements
    .map(({ module, tier, access }) => ({ module, tier, access }))
    .sort((left, right) => `${left.module}:${left.tier}:${left.access}`.localeCompare(`${right.module}:${right.tier}:${right.access}`))
}

export function createCatalogReviewSnapshot(card) {
  return {
    spanish: card.spanish,
    normalizedTarget: normalizeTarget(card.spanish),
    chinese: card.chinese,
    lemma: card.lemma ?? '',
    partOfSpeech: card.partOfSpeech ?? '',
    level: card.level,
    scene: card.scene,
    kind: card.kind,
    routes: [...(card.routes ?? ['exam'])].sort(),
    lifePlacements: stablePlacements(card.lifePlacements),
    frameworkReference: card.frameworkReference ?? '',
    example: card.example ?? '',
    exampleChinese: card.exampleChinese ?? '',
  }
}

export function catalogReviewDigest(snapshot) {
  return crypto.createHash('sha256').update(JSON.stringify(snapshot)).digest('hex')
}

export function loadProfessionalReviewRecords(directory = 'data/lexicon/professional-reviews') {
  if (!fs.existsSync(directory)) return { files: [], records: [] }
  const files = fs.readdirSync(directory).filter((file) => file.endsWith('.jsonl')).sort()
  return {
    files,
    records: files.flatMap((file) => readJsonLines(path.join(directory, file)).map((record) => ({ ...record, recordFile: file }))),
  }
}

function requiredString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function validIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) return false
  return new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value
}

export function auditProfessionalReviews(cards, directory = 'data/lexicon/professional-reviews') {
  const { files, records } = loadProfessionalReviewRecords(directory)
  const errors = []
  const ids = new Set()
  const catalogByTarget = new Map(cards.map((card) => [normalizeTarget(card.spanish), card]))
  const audited = []

  for (const record of records) {
    const label = `${record.recordFile}:${record.reviewId ?? 'unknown'}`
    if (record.schemaVersion !== 1) errors.push(`${label}: schemaVersion 必须为 1`)
    if (!requiredString(record.reviewId)) errors.push(`${label}: 缺少 reviewId`)
    if (!requiredString(record.reviewScope)) errors.push(`${label}: 缺少 reviewScope`)
    if (!/^[a-f0-9]{64}$/.test(record.catalogDigest ?? '')) errors.push(`${label}: catalogDigest 格式无效`)
    if (ids.has(record.reviewId)) errors.push(`${label}: reviewId 重复`)
    ids.add(record.reviewId)
    if (!REVIEW_DECISIONS.includes(record.decision)) errors.push(`${label}: decision 无效`)
    if (!requiredString(record.reviewer?.name) || !requiredString(record.reviewer?.role)) errors.push(`${label}: 缺少复核人姓名或角色`)
    if (!validIsoDate(record.reviewedAt)) errors.push(`${label}: reviewedAt 必须为有效 ISO 日期`)
    for (const check of REQUIRED_CHECKS) {
      if (!REVIEW_STATUSES.includes(record.checks?.[check])) errors.push(`${label}: checks.${check} 无效`)
    }
    if (!record.reviewedContent || typeof record.reviewedContent !== 'object') {
      errors.push(`${label}: 缺少 reviewedContent 快照`)
      continue
    }
    for (const field of ['spanish', 'normalizedTarget', 'chinese', 'level', 'scene', 'kind', 'routes', 'lifePlacements', 'frameworkReference', 'example', 'exampleChinese']) {
      if (!(field in record.reviewedContent)) errors.push(`${label}: reviewedContent 缺少 ${field}`)
    }
    const normalizedTarget = normalizeTarget(record.reviewedContent.spanish)
    if (normalizedTarget !== record.normalizedTarget || normalizedTarget !== record.reviewedContent.normalizedTarget) {
      errors.push(`${label}: normalizedTarget 与复核快照不一致`)
    }
    const recordedDigest = catalogReviewDigest(record.reviewedContent)
    if (recordedDigest !== record.catalogDigest) errors.push(`${label}: catalogDigest 与复核快照不一致`)
    const isLifeCard = Array.isArray(record.reviewedContent.lifePlacements) && record.reviewedContent.lifePlacements.length > 0
    if (isLifeCard && record.checks?.lifeTier === 'not-applicable') errors.push(`${label}: 生活卡必须复核 lifeTier`)
    if (!isLifeCard && record.checks?.lifeTier !== 'not-applicable') errors.push(`${label}: 非生活卡的 lifeTier 应为 not-applicable`)
    if (record.decision === 'pass') {
      for (const check of ['spelling', 'spanishNaturalness', 'chineseMeaning', 'example', 'level']) {
        if (record.checks?.[check] !== 'pass') errors.push(`${label}: decision=pass 时 checks.${check} 必须为 pass`)
      }
      if (isLifeCard && record.checks?.lifeTier !== 'pass') errors.push(`${label}: decision=pass 的生活卡 lifeTier 必须为 pass`)
      if (!requiredString(record.reviewedContent.example) || !requiredString(record.reviewedContent.exampleChinese)) errors.push(`${label}: 缺少双语例句的卡不能通过专业复核`)
    }
    const hasSuggestion = ['spanish', 'chinese', 'example'].some((field) => requiredString(record.suggestions?.[field]))
    if (record.decision && record.decision !== 'pass' && !requiredString(record.notes) && !hasSuggestion) errors.push(`${label}: revise/reject 必须记录原因或修改建议`)
    const card = catalogByTarget.get(normalizedTarget)
    if (!card) {
      errors.push(`${label}: 复核目标已不在 canonical 目录`)
      continue
    }
    const currentSnapshot = createCatalogReviewSnapshot(card)
    const currentDigest = catalogReviewDigest(currentSnapshot)
    audited.push({ ...record, normalizedTarget, isCurrent: currentDigest === record.catalogDigest })
  }

  const currentRecords = audited.filter((record) => record.isCurrent)
  const staleRecords = audited.filter((record) => !record.isCurrent)
  const groupedByTarget = new Map()
  currentRecords.forEach((record) => groupedByTarget.set(record.normalizedTarget, [...(groupedByTarget.get(record.normalizedTarget) ?? []), record]))
  const effectiveRecords = []
  for (const [target, targetRecords] of groupedByTarget) {
    const latestDate = targetRecords.map((record) => record.reviewedAt).sort().at(-1)
    const latestRecords = targetRecords.filter((record) => record.reviewedAt === latestDate)
    const decisions = new Set(latestRecords.map((record) => record.decision))
    if (decisions.size > 1) errors.push(`${target}: 同一复核日期存在冲突结论`)
    effectiveRecords.push(latestRecords.sort((left, right) => left.reviewId.localeCompare(right.reviewId)).at(-1))
  }
  const passedTargets = new Set(effectiveRecords.filter((record) => record.decision === 'pass').map((record) => record.normalizedTarget))

  return {
    files,
    records,
    errors,
    currentRecords,
    staleRecords,
    effectiveRecords,
    passedTargets,
    issueRecords: effectiveRecords.filter((record) => record.decision !== 'pass'),
  }
}
