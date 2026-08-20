import fs from 'node:fs'
import { auditCandidate } from './lexicon/candidate-rules.mjs'
import { KINDS, LEVELS, readJson, readJsonLines } from './lexicon/lexicon-utils.mjs'

const errors = []
const sources = readJson('data/lexicon/sources.json')
const framework = readJson('data/lexicon/framework.json')
const policy = readJson('data/lexicon/catalog-policy.json')
const schema = readJson('data/lexicon/candidate.schema.json')
const examples = readJsonLines('data/lexicon/candidates.example.jsonl')
const sourceIds = new Set(sources.sources.map((source) => source.id))
const reviewBatchDirectory = 'data/lexicon/review-batches'
const reviewBatchFiles = fs.existsSync(reviewBatchDirectory)
  ? fs.readdirSync(reviewBatchDirectory).filter((file) => file.endsWith('.jsonl')).sort()
  : []
const reviewBatchRows = reviewBatchFiles.flatMap((file) => readJsonLines(`${reviewBatchDirectory}/${file}`))

for (const required of ['cefr-coe', 'pcic-cervantes', 'corpes-rae-1.5', 'wordfreq-es-3.1.1', 'kaikki-es-2026-08-16']) {
  if (!sourceIds.has(required)) errors.push(`缺少来源定义: ${required}`)
}
if (sources.sources.some((source) => source.redistributeRawData && !source.license)) errors.push('允许再分发的来源必须记录许可')
if (sources.sources.find((source) => source.id === 'corpes-rae-1.5')?.redistributeRawData !== false) errors.push('CORPES 原始列表在许可明确前不得标记为可再分发')
if (JSON.stringify(framework.levels) !== JSON.stringify(LEVELS)) errors.push('框架等级与应用等级不一致')
const mappedScenes = framework.categories.flatMap((category) => category.scenes)
if (new Set(mappedScenes).size !== mappedScenes.length) errors.push('宽分类之间存在重复细场景')
if (policy.maximumWordsPerTarget !== 3) errors.push('当前产品约束应保持最多 3 个词')
if (JSON.stringify(Object.keys(policy.minimumCardsByLevel)) !== JSON.stringify(LEVELS)) errors.push('目录最低等级基线不完整')
if (JSON.stringify(Object.keys(policy.minimumCardsByKind)) !== JSON.stringify(KINDS)) errors.push('目录最低类型基线不完整')
if (schema.properties?.frequency?.properties?.sourceId?.const !== 'wordfreq-es-3.1.1') errors.push('候选 schema 的频率来源漂移')
if (!examples.length) errors.push('候选示例不能为空')
for (const example of examples) {
  for (const key of schema.required ?? []) if (!(key in example)) errors.push(`候选示例缺少字段: ${key}`)
  for (const sourceId of example.sourceIds ?? []) if (!sourceIds.has(sourceId)) errors.push(`候选示例引用未知来源: ${sourceId}`)
}
const reviewCandidateIds = new Set()
const reviewTargets = new Set()
for (const candidate of reviewBatchRows) {
  for (const key of schema.required ?? []) if (!(key in candidate)) errors.push(`复核批次候选缺少字段: ${candidate.candidateId ?? 'unknown'}:${key}`)
  if (reviewCandidateIds.has(candidate.candidateId)) errors.push(`复核批次候选 ID 重复: ${candidate.candidateId}`)
  reviewCandidateIds.add(candidate.candidateId)
  if (reviewTargets.has(candidate.normalizedTarget)) errors.push(`复核批次输入目标重复: ${candidate.normalizedTarget}`)
  reviewTargets.add(candidate.normalizedTarget)
  for (const sourceId of candidate.sourceIds ?? []) if (!sourceIds.has(sourceId)) errors.push(`复核批次引用未知来源: ${candidate.candidateId}:${sourceId}`)
  if (candidate.editorial?.status === 'approved' && candidate.lexical?.status !== 'verified') {
    errors.push(`词典未核验的候选不得批准: ${candidate.candidateId}`)
  }
}

if (!fs.existsSync('scripts/lexicon/export_wordfreq_candidates.py')) errors.push('缺少 wordfreq 导出脚本')
if (!fs.existsSync('scripts/lexicon/audit_candidates.mjs')) errors.push('缺少候选审计脚本')
if (!fs.existsSync('scripts/lexicon/prepare_review_queue.mjs')) errors.push('缺少人工复核队列脚本')
if (!fs.existsSync('scripts/lexicon/stage_approved_candidates.mjs')) errors.push('缺少批准候选暂存脚本')

const validCandidate = {
  schemaVersion: 1,
  candidateId: 'validation-noun',
  spanish: 'lexema',
  normalizedTarget: 'lexema',
  lemma: 'lexema',
  partOfSpeech: 'noun',
  kindCandidate: '单词',
  frequency: { sourceId: 'wordfreq-es-3.1.1', rank: 6001, zipf: 1 },
  lexical: { sourceId: 'kaikki-es-2026-08-16', status: 'verified', checkedAt: '2026-08-19', entryUrl: 'https://kaikki.org/' },
  framework: { sourceId: 'pcic-cervantes', levelCandidate: 'B1', categoryCandidate: '学习工作', sceneCandidate: '学习', references: ['validation-only'] },
  editorial: { status: 'approved', chinese: '词位', example: 'Es un lexema.', exampleChinese: '这是一个词位。', reviewedBy: 'validation', reviewedAt: '2026-08-19', notes: [] },
  sourceIds: ['wordfreq-es-3.1.1', 'kaikki-es-2026-08-16', 'pcic-cervantes'],
}
function ruleContext() {
  return { maximumWordsPerTarget: 3, categories: framework.categories, catalogTargets: new Set(), seenTargets: new Map(), seenLemmas: new Map() }
}
const validAudit = auditCandidate(validCandidate, ruleContext())
if (validAudit.blockers.length) errors.push(`完整批准候选被错误阻断: ${validAudit.blockers.join(', ')}`)
const inflectedAudit = auditCandidate({ ...validCandidate, candidateId: 'validation-verb', spanish: 'hablo', normalizedTarget: 'hablo', lemma: 'hablar', partOfSpeech: 'verb', kindCandidate: '动词原形' }, ruleContext())
if (!inflectedAudit.blockers.includes('inflected_verb_target')) errors.push('动词屈折形式没有被阻断')
const unreviewedAudit = auditCandidate({ ...validCandidate, candidateId: 'validation-unreviewed', editorial: { ...validCandidate.editorial, status: 'unreviewed', reviewedBy: null, reviewedAt: null } }, ruleContext())
if (!unreviewedAudit.blockers.includes('editorial_approval_required')) errors.push('未批准候选没有被阻断')
const longPhraseAudit = auditCandidate({ ...validCandidate, candidateId: 'validation-long', spanish: 'uno dos tres cuatro', normalizedTarget: 'uno dos tres cuatro', lemma: 'uno dos tres cuatro', partOfSpeech: 'phrase', kindCandidate: '短语' }, ruleContext())
if (!longPhraseAudit.blockers.includes('too_many_words')) errors.push('超过三个词的候选没有被阻断')

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(JSON.stringify({
    sources: sources.sources.length,
    levels: framework.levels.length,
    categories: framework.categories.length,
    examples: examples.length,
    reviewBatches: reviewBatchFiles.length,
    reviewCandidates: reviewBatchRows.length,
  }, null, 2))
}
