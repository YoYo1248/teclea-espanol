import { readFileSync } from 'node:fs'
import { masteryRecommendation } from '../src/masteryRouting.ts'
import { challengeDailyPlan } from '../src/challengeMath.ts'
import { adaptiveRoundSize } from '../src/roundSizing.ts'
import { bucketByRecentQueues, hasCompletedIntroduction, itemsNeedingIntroduction, mixAdaptiveRound, shouldMarkWordWeak } from '../src/roundQueue.ts'
import { normalizeWordEvidence } from '../src/wordEvidence.ts'
import { pressHoldInputDecision } from '../src/pressHoldInput.ts'
import {
  hasActiveReview,
  isReviewDue,
  mistakeSamplingWeight,
  normalizeMistakeRecord,
  recordIndependentCorrect,
  recordWrongAttempt,
  recoveryTarget,
  weightedReviewOrder,
} from '../src/mistakeReview.ts'

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

assert(!shouldMarkWordWeak('copy', false, false), '干净完成的跟打项不应进入薄弱集合')
assert(shouldMarkWordWeak('copy', true, false), '跟打输错的项目应先留在跟打模式巩固')
assert(shouldMarkWordWeak('recall', false, true), '看义使用提示的项目应进入薄弱集合')
assert(shouldMarkWordWeak('listen', true, false), '听音输错的项目应进入薄弱集合')

const mananaBase = pressHoldInputDecision({ rawValue: 'man', acceptedValue: 'ma', targetValue: 'mañana', strict: true, idle: true, pending: null })
assert(mananaBase.kind === 'wait' && mananaBase.pending.value === 'man', 'mañana 输入基础 n 时应进入等待而不是立即判错')
const mananaRepeat = pressHoldInputDecision({ rawValue: 'mannn', acceptedValue: 'ma', targetValue: 'mañana', strict: true, idle: true, pending: mananaBase.kind === 'wait' ? mananaBase.pending : null })
assert(mananaRepeat.kind === 'keep-waiting', '长按 n 产生的重复基础字母事件应继续等待')
const mananaReplacement = pressHoldInputDecision({ rawValue: 'mañ', acceptedValue: 'ma', targetValue: 'mañana', strict: true, idle: true, pending: mananaBase.kind === 'wait' ? mananaBase.pending : null })
assert(mananaReplacement.kind === 'commit' && mananaReplacement.value === 'mañ', 'n 替换为 ñ 后应立即提交正确输入')
const mananaContinued = pressHoldInputDecision({ rawValue: 'mana', acceptedValue: 'ma', targetValue: 'mañana', strict: true, idle: true, pending: mananaBase.kind === 'wait' ? mananaBase.pending : null })
assert(mananaContinued.kind === 'commit', '等待期间继续输入其他字符应立即交回正常判定')

const reviewWord = { lessonId: 'a1-basics', spanish: 'hola', chinese: '你好' }
const firstWrong = recordWrongAttempt(undefined, reviewWord, 'recall', Date.parse('2026-08-20T10:00:00'), '2026-08-20')
assert(firstWrong.count === 1 && firstWrong.wrongCounts.recall === 1, '首次错误应永久累计到对应模式')
assert(firstWrong.review.recall?.dueOn === '2026-08-21', '今日错题应在下一学习日到期')
assert(!isReviewDue(firstWrong, '2026-08-20') && isReviewDue(firstWrong, '2026-08-21'), '同日不应成为可清除的到期错题')
const sameDayCorrect = recordIndependentCorrect(firstWrong, 'recall', Date.parse('2026-08-20T11:00:00'), '2026-08-20')
assert(!sameDayCorrect.progressed && hasActiveReview(sameDayCorrect.record), '同日独立答对只能巩固，不能推进跨日恢复')
const nextDayCorrect = recordIndependentCorrect(sameDayCorrect.record, 'recall', Date.parse('2026-08-21T10:00:00'), '2026-08-21')
assert(nextDayCorrect.progressed && nextDayCorrect.resolved, '累计错一次应在下一学习日独立答对后离开错题本')
assert(nextDayCorrect.record.count === 1 && nextDayCorrect.record.independentCorrectCounts.recall === 2, '离开错题本后应保留永久错误与答对统计')

const copyWrong = recordWrongAttempt(undefined, reviewWord, 'copy', Date.parse('2026-08-20T10:00:00'), '2026-08-20')
assert(!recordIndependentCorrect(copyWrong, 'copy', Date.parse('2026-08-21T09:00:00'), '2026-08-21').progressed, '跟打答对不能作为独立恢复证据')
assert(recordIndependentCorrect(copyWrong, 'recall', Date.parse('2026-08-21T09:00:00'), '2026-08-21').resolved, '看义独立答对应能恢复跟打错误')
assert(!recordIndependentCorrect(firstWrong, 'listen', Date.parse('2026-08-21T09:00:00'), '2026-08-21').progressed, '听音答对不能替代看义错误的模式确认')

const secondWrong = recordWrongAttempt(firstWrong, reviewWord, 'recall', Date.parse('2026-08-21T12:00:00'), '2026-08-21')
assert(recoveryTarget(secondWrong.count) === 2 && secondWrong.review.recall?.recoveryCount === 0, '累计错两次应重置并要求两次跨日确认')
const recoveryOne = recordIndependentCorrect(secondWrong, 'recall', Date.parse('2026-08-22T09:00:00'), '2026-08-22')
const duplicateSameDay = recordIndependentCorrect(recoveryOne.record, 'recall', Date.parse('2026-08-22T12:00:00'), '2026-08-22')
assert(recoveryOne.progressed && !recoveryOne.resolved && !duplicateSameDay.progressed, '同一学习日最多累计一次恢复确认')
const recoveryTwo = recordIndependentCorrect(duplicateSameDay.record, 'recall', Date.parse('2026-08-23T09:00:00'), '2026-08-23')
assert(recoveryTwo.resolved, '累计错两次应在两个不同学习日确认后离开错题本')
assert(recoveryTarget(10) === 3, '反复错误的恢复次数应封顶三次')
assert(mistakeSamplingWeight(secondWrong, '2026-08-22') > mistakeSamplingWeight(firstWrong, '2026-08-20'), '错误更多且已到期的词应获得更高抽取权重')
assert(weightedReviewOrder([firstWrong, secondWrong], (item) => mistakeSamplingWeight(item, '2026-08-22'), () => .5)[0] === secondWrong, '加权排序应让高权重错词更容易排在前面')

const legacyMistake = normalizeMistakeRecord({ ...reviewWord, count: 4, lastWrongAt: Date.parse('2026-08-19T10:00:00'), lastMode: 'listen' })
assert(legacyMistake?.wrongCounts.listen === 4 && legacyMistake.review.listen?.active, '旧错题数据应迁移为永久统计与活跃复习状态')

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

const abundantNewWords = Array.from({ length: 12 }, (_, index) => `new-${index + 1}`)
const abundantReviewWords = Array.from({ length: 12 }, (_, index) => `review-${index + 1}`)
assert(mixAdaptiveRound(abundantNewWords, abundantReviewWords, 6).filter((item) => item.startsWith('new-')).length === 4, '6 项普通轮次应至少安排 4 个新词')
assert(mixAdaptiveRound(abundantNewWords, abundantReviewWords, 8).filter((item) => item.startsWith('new-')).length === 6, '8 项普通轮次应至少安排 6 个新词')
assert(mixAdaptiveRound(abundantNewWords, abundantReviewWords, 12).filter((item) => item.startsWith('new-')).length === 8, '12 项普通轮次应至少安排 8 个新词')
assert(mixAdaptiveRound(['new-only'], abundantReviewWords, 8).length === 8, '新词不足时应使用复习词补满轮次')
assert(mixAdaptiveRound(abundantNewWords, [], 8).length === 8, '没有复习词时应继续使用新词补满轮次')

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

const defaultChallengePlan = challengeDailyPlan(422, 30, 2, [])
assert(defaultChallengePlan.dailyItems === 15, 'A1 30 天计划应估算每天 15 个不同学习项')
assert(defaultChallengePlan.dailyMasteryActions === 47, 'A1 30 天计划应包含 10% 错题缓冲')
assert(defaultChallengePlan.estimatedMinutes === 18, '无历史时应使用透明的初始时间估算')
assert(defaultChallengePlan.personalizedModes === 0, '无历史时不应标记为个人速度')

const personalizedChallengePlan = challengeDailyPlan(100, 10, 2, [
  { mode: 'copy', items: 10, elapsedMs: 100_000, completedAt: 1 },
  { mode: 'copy', items: 10, elapsedMs: 100_000, completedAt: 2 },
  { mode: 'recall', items: 10, elapsedMs: 200_000, completedAt: 3 },
  { mode: 'recall', items: 10, elapsedMs: 200_000, completedAt: 4 },
  { mode: 'listen', items: 10, elapsedMs: 300_000, completedAt: 5 },
  { mode: 'listen', items: 10, elapsedMs: 300_000, completedAt: 6 },
])
assert(personalizedChallengePlan.estimatedMinutes === 17, '个人模式速度应参与每日时间估算')
assert(personalizedChallengePlan.personalizedModes === 3, '三种模式历史充分时应标记为完整个人速度')

const inProgressChallengePlan = challengeDailyPlan(100, 10, 2, [], {
  remainingItems: 40,
  remainingCopyItems: 10,
  remainingRecallActions: 20,
  remainingListenActions: 40,
})
assert(inProgressChallengePlan.dailyItems === 4, '已有进度时每天学习项应只按剩余项目计算')
assert(inProgressChallengePlan.dailyMasteryActions === 7, '已有进度时每日拼写应只按剩余动作和缓冲计算')
assert(inProgressChallengePlan.remainingMasteryActions === 60, '已有进度时应显示准确剩余动作数')

const recommendationDoc = readFileSync(new URL('../docs/PRACTICE_RECOMMENDATION.md', import.meta.url), 'utf8')
for (const requiredSection of ['首次跟打完成', '近期重复层', '新内容预热', '模式推进阈值', '队列持久化', '跨学习日错题恢复']) {
  assert(recommendationDoc.includes(requiredSection), `抽取规则文档缺少章节：${requiredSection}`)
}

const appSource = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8')
assert(appSource.includes('const PRESS_HOLD_REPLACEMENT_MS = 3000'), '长按重音替换窗口应为 3 秒')
assert(
  /onBlur=\{\(\) => \{\s*cancelPressHoldReplacement\(\)/.test(appSource),
  '输入框失焦时应取消长按重音等待',
)
assert(
  /onCompositionEnd=\{\(event\) => \{[\s\S]*?handleCommittedInput\(event\.currentTarget\.value\)/.test(appSource),
  '组合输入提交也必须经过长按重音等待判断',
)
assert(/function cancelPressHoldReplacement\(\)[\s\S]*?pressHoldPendingRef\.current = null/.test(appSource), '取消长按等待时应同时清理待替换状态')

if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log('Practice routing validation passed: introduction, recency, spaced mistake recovery, thresholds, sizing, and documentation.')
}
