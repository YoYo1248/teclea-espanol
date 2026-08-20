import { readFileSync } from 'node:fs'
import { masteryRecommendation } from '../src/masteryRouting.ts'
import { adaptiveRoundSize } from '../src/roundSizing.ts'
import { bucketByRecentQueues, hasCompletedIntroduction, itemsNeedingIntroduction } from '../src/roundQueue.ts'
import { normalizeWordEvidence } from '../src/wordEvidence.ts'

const failures = []
const assert = (condition, message) => {
  if (!condition) failures.push(message)
}

assert(!hasCompletedIntroduction(undefined), '缺少证据时不应视为已完成首次跟打')
assert(!hasCompletedIntroduction({ copyCompletedAt: 0 }), '无效时间戳不应视为已完成首次跟打')
assert(hasCompletedIntroduction({ copyCompletedAt: 1 }), '有效首次跟打时间戳应被识别')

const migratedEvidence = normalizeWordEvidence({
  oldRecall: { recall: true, lastCorrectAt: 123 },
  newRecall: { recall: true },
}, { legacy: true, completedCardIds: ['legacyCompleted'] })
assert(migratedEvidence.oldRecall.copyCompletedAt === 123, '旧版看义证据应迁移为已完成首次跟打')
assert(migratedEvidence.newRecall.copyCompletedAt === 1, '旧版无时间戳证据应获得兼容标记')
assert(migratedEvidence.legacyCompleted.copyCompletedAt === 1, '旧版已完成课程应保留首次跟打状态')
const currentEvidence = normalizeWordEvidence({ recallOnly: { recall: true } }, { legacy: false })
assert(!currentEvidence.recallOnly.copyCompletedAt, '新版看义证据不能替代首次跟打证据')

const mixedQueue = [
  { id: 'weak-old', evidence: { copyCompletedAt: 10 } },
  { id: 'new-a', evidence: undefined },
  { id: 'new-b', evidence: undefined },
  { id: 'stable-old', evidence: { copyCompletedAt: 20 } },
]
assert(
  itemsNeedingIntroduction(mixedQueue, (item) => item.evidence).map((item) => item.id).join(',') === 'new-a,new-b',
  '混合队列只能预热未完成首次跟打的项目',
)

const recentBuckets = bucketByRecentQueues(
  [{ id: 'fresh' }, { id: 'earlier' }, { id: 'immediate' }],
  [new Set(['immediate']), new Set(['earlier'])],
  (item) => item.id,
)
assert(recentBuckets.fresh.map((item) => item.id).join(',') === 'fresh', '新鲜候选分桶错误')
assert(recentBuckets.earlier.map((item) => item.id).join(',') === 'earlier', '上上轮候选分桶错误')
assert(recentBuckets.immediate.map((item) => item.id).join(',') === 'immediate', '上一轮候选分桶错误')

assert(masteryRecommendation(69, true) === 'repeat', '69% 应继续当前模式')
assert(masteryRecommendation(70, true) === 'reinforce', '70% 应进入薄弱项巩固')
assert(masteryRecommendation(89, true) === 'reinforce', '89% 应进入薄弱项巩固')
assert(masteryRecommendation(90, true) === 'advance', '90% 应推进到下一阶段')
assert(masteryRecommendation(100, false) === 'repeat', '切换模式或使用提示后不应获得推进')

assert(adaptiveRoundSize('recall', []) === 8, '无计时历史时应使用 8 项初始轮次')
assert(adaptiveRoundSize('recall', [
  { mode: 'recall', items: 10, elapsedMs: 100_000, completedAt: 1 },
  { mode: 'recall', items: 10, elapsedMs: 100_000, completedAt: 2 },
]) === 12, '快速用户的轮次应受 12 项上限约束')
assert(adaptiveRoundSize('listen', [
  { mode: 'listen', items: 6, elapsedMs: 300_000, completedAt: 1 },
  { mode: 'listen', items: 6, elapsedMs: 300_000, completedAt: 2 },
]) === 6, '慢速用户的轮次应受 6 项下限约束')

const recommendationDoc = readFileSync(new URL('../docs/PRACTICE_RECOMMENDATION.md', import.meta.url), 'utf8')
for (const requiredSection of ['首次跟打完成', '近期重复层', '新内容预热', '模式推进阈值', '队列持久化']) {
  assert(recommendationDoc.includes(requiredSection), `抽取规则文档缺少章节：${requiredSection}`)
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log('Practice routing validation passed: introduction, recency, thresholds, sizing, and documentation.')
}
