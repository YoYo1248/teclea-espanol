import { readFileSync } from 'node:fs'
import { masteryRecommendation, nextStageAfterSkippedReinforcement } from '../src/masteryRouting.ts'
import { readLearningStage, readNewcomerCompletedItems, shouldResumeActiveSession } from '../src/learningStage.ts'
import { challengeDailyPlan, challengePendingCardIds, challengeRoundSize, challengeTodayTarget } from '../src/challengeMath.ts'
import { adaptiveRoundSize } from '../src/roundSizing.ts'
import { bucketByRecentQueues, firstModeAfterIntroduction, hasCompletedIntroduction, itemsNeedingIntroduction, mixAdaptiveRound, safePracticeResumeIndex, shouldMarkWordWeak } from '../src/roundQueue.ts'
import { decodeWordEvidence, encodeWordEvidence, mergeWordEvidence, normalizeWordEvidence } from '../src/wordEvidence.ts'
import { isConfirmedPressHold, pressHoldInputDecision, pressHoldKeyCandidate } from '../src/pressHoldInput.ts'
import { practiceWordClassLabel } from '../src/wordClass.ts'
import {
  canonicalPracticeTarget,
  LEGACY_PRACTICE_CARD_ID_REDIRECTS,
  migratePracticeCardId,
  migratePracticeCardIds,
  migratePracticeNumberRecord,
  migratePracticeTrueRecord,
  practiceCardId,
} from '../src/cardIdentity.ts'
import {
  addReviewDays,
  hasActiveReview,
  isMaintenanceDue,
  isMaintenanceModeDue,
  isReviewDue,
  isReviewModeDue,
  mistakeReviewBucket,
  mistakeSamplingWeight,
  maintenanceAnswerMode,
  MAINTENANCE_INTERVAL_DAYS,
  normalizeMistakeRecord,
  recordIndependentCorrect,
  recordWrongAttempt,
  recoveryTarget,
  reviewAnswerMode,
  weightedReviewOrder,
} from '../src/mistakeReview.ts'

const failures = []
const assert = (condition, message) => {
  if (!condition) failures.push(message)
}
const catalogPolicy = JSON.parse(readFileSync(new URL('../data/lexicon/catalog-policy.json', import.meta.url), 'utf8'))

const newcomerConfig = {
  lessonId: 'primeros-pasos',
  cardIds: [
    'primeros-pasos::hola',
    'primeros-pasos::gracias',
    'primeros-pasos::por favor',
    'primeros-pasos::perdón',
    'primeros-pasos::encantado',
    'primeros-pasos::adiós',
    'primeros-pasos::bienvenido',
    'primeros-pasos::hasta luego',
  ],
  isKnownLessonId: (lessonId) => lessonId === 'primeros-pasos' || lessonId === 'cada-dia' || lessonId === 'legacy-cada-dia' || /^adaptive-A1-main$/.test(lessonId),
}
const storage = (entries = {}) => ({ getItem: (key) => Object.prototype.hasOwnProperty.call(entries, key) ? entries[key] : null })
const session = (overrides = {}) => ({
  lessonId: 'primeros-pasos',
  mode: 'copy',
  order: [...newcomerConfig.cardIds],
  index: 0,
  completedWords: 0,
  correctKeystrokes: 0,
  mistakes: 0,
  ...overrides,
})

assert(readLearningStage(storage(), newcomerConfig) === 'not-started', '完全空白的本地状态应判定为未开始')
assert(readLearningStage(storage({
  'teclea-practice-state': JSON.stringify({ lastMode: 'copy', lastLessonId: 'primeros-pasos', dailyWords: {} }),
  'teclea-mistake-bank': '{}',
  'teclea-mastery-progress-v2': '{}',
  'teclea-completed': '[]',
  'teclea-word-evidence-v2': '{}',
}), newcomerConfig) === 'not-started', '空对象、空数组和默认练习状态不能冒充学习历史')

const openedOnlySession = session({ onboarding: true })
assert(readLearningStage(storage({ 'teclea-active-session-v2': JSON.stringify(openedOnlySession) }), newcomerConfig) === 'not-started', '仅打开自动创建的新手会话仍应判定为未开始')
assert(shouldResumeActiveSession('not-started', openedOnlySession, newcomerConfig), '仅打开后刷新应安全恢复固定八词会话')
const typedOnlySession = session({ onboarding: true, correctKeystrokes: 2 })
assert(readLearningStage(storage({ 'teclea-active-session-v2': JSON.stringify(typedOnlySession) }), newcomerConfig) === 'not-started', '只输入部分字符但未完成词条不构成有效进度')

const partialNewcomerSession = session({ onboarding: true, index: 1, completedWords: 1 })
const oneWordProgress = storage({
  'teclea-active-session-v2': JSON.stringify(partialNewcomerSession),
  'teclea-practice-state': JSON.stringify({ lastMode: 'copy', lastLessonId: 'primeros-pasos', dailyWords: { '2026-08-21': 1 } }),
  'teclea-word-evidence-v2': JSON.stringify({ 'primeros-pasos::hola': { copyCompletedAt: 123 } }),
})
assert(readLearningStage(oneWordProgress, newcomerConfig) === 'newcomer-in-progress', '完成一至七个固定词时应判定为新手首轮未完成')
assert(readNewcomerCompletedItems(oneWordProgress, newcomerConfig) === 1, '新手首轮应读取已完成的连续前缀')
assert(shouldResumeActiveSession('newcomer-in-progress', partialNewcomerSession, newcomerConfig), '刷新时应恢复固定八词的原位置')

const sevenWordProgress = storage({
  'teclea-active-session-v2': JSON.stringify(session({ onboarding: true, index: 7, completedWords: 7 })),
  'teclea-practice-state': JSON.stringify({ lastMode: 'copy', lastLessonId: 'primeros-pasos', dailyWords: { '2026-08-21': 7 } }),
  'teclea-word-evidence-v2': JSON.stringify(Object.fromEntries(newcomerConfig.cardIds.slice(0, 7).map((cardId) => [cardId, { copyCompletedAt: 123 }]))),
})
assert(readLearningStage(sevenWordProgress, newcomerConfig) === 'newcomer-in-progress', '完成七词后仍应留在未完成首轮阶段')
assert(readNewcomerCompletedItems(sevenWordProgress, newcomerConfig) === 7, '完成七词后刷新应从第八词恢复')

const legacyThreeWordSession = session({ order: newcomerConfig.cardIds.slice(0, 3), index: 2, completedWords: 2, onboarding: true })
assert(shouldResumeActiveSession('newcomer-in-progress', legacyThreeWordSession, newcomerConfig), '旧版三词前缀会话应可扩展并继续首轮')

const unrelatedUntouchedSession = session({ lessonId: 'adaptive-A1-main', order: ['cada-dia::en casa'], correctKeystrokes: 3 })
assert(readLearningStage(storage({ 'teclea-active-session-v2': JSON.stringify(unrelatedUntouchedSession) }), newcomerConfig) === 'not-started', '普通会话只输入未完成时仍没有有效学习进度')
assert(!shouldResumeActiveSession('not-started', unrelatedUntouchedSession, newcomerConfig), '未形成进度的普通会话不能绕过固定三词')
const completedActiveSession = session({ lessonId: 'adaptive-A1-main', order: ['cada-dia::en casa', 'cada-dia::al trabajo'], index: 1, completedWords: 1 })
assert(readLearningStage(storage({ 'teclea-active-session-v2': JSON.stringify(completedActiveSession) }), newcomerConfig) === 'established', '已完成学习项的有效普通会话应构成真实进度')
assert(shouldResumeActiveSession('established', completedActiveSession, newcomerConfig), '已形成进度的有效普通会话应安全恢复')
const removedLessonSession = session({ lessonId: 'removed-lesson', order: ['removed-lesson::残留'], index: 0, completedWords: 1 })
assert(readLearningStage(storage({ 'teclea-active-session-v2': JSON.stringify(removedLessonSession) }), newcomerConfig) === 'not-started', '已移除课程留下的孤立会话不能冒充有效进度')
assert(!shouldResumeActiveSession('established', removedLessonSession, newcomerConfig), '已移除课程会话不能被恢复')

const legacyDailyProgress = storage({
  'teclea-practice-state': JSON.stringify({ lastMode: 'recall', lastLessonId: 'cada-dia', dailyWords: { '2026-08-18': 4 } }),
  'teclea-active-session-v2': JSON.stringify(session({ lessonId: 'cada-dia', mode: 'recall', order: ['cada-dia::en casa'] })),
})
assert(readLearningStage(legacyDailyProgress, newcomerConfig) === 'established', '旧版正数 dailyWords 应保留为有效学习进度')
assert(shouldResumeActiveSession('established', JSON.parse(legacyDailyProgress.getItem('teclea-active-session-v2')), newcomerConfig), '有旧进度时当前有效会话应继续恢复')

assert(readLearningStage(storage({
  'teclea-practice-state': JSON.stringify({ lastMode: 'copy', lastLessonId: 'primeros-pasos', dailyWords: { '2026-08-21': 3 } }),
  'teclea-word-evidence-v2': JSON.stringify(Object.fromEntries(newcomerConfig.cardIds.slice(0, 3).map((cardId) => [cardId, { copyCompletedAt: 123 }]))),
}), newcomerConfig) === 'newcomer-in-progress', '只有固定前三词证据时应继续首轮而非提前进入普通学习')
const legacyCheckpoint = storage({ 'teclea-first-three-complete-v1': 'true' })
assert(readLearningStage(legacyCheckpoint, newcomerConfig) === 'newcomer-in-progress', '旧版三词完成标记只能表示首轮已到第 4 词')
assert(readNewcomerCompletedItems(legacyCheckpoint, newcomerConfig) === 3, '旧版三词完成标记应恢复为三个已完成项')
assert(readLearningStage(storage({
  'teclea-word-evidence-v2': JSON.stringify(Object.fromEntries(newcomerConfig.cardIds.map((cardId) => [cardId, { copyCompletedAt: 123 }]))),
}), newcomerConfig) === 'established', '固定八词都有完整跟打证据时才完成新手首轮')
assert(readLearningStage(storage({ 'teclea-first-round-complete-v1': 'true' }), newcomerConfig) === 'established', '明确的八词首轮完成标记应进入普通学习阶段')
assert(readLearningStage(storage({
  'teclea-first-three-complete-v1': 'true',
  'teclea-word-evidence-v2': JSON.stringify({ 'primeros-pasos::perdón': { copyCompletedAt: 123 } }),
}), newcomerConfig) === 'established', '旧三词后已有额外真实词条证据时应保留为旧用户')
assert(readLearningStage(storage({ 'teclea-first-three-complete-v1': 'false' }), newcomerConfig) === 'not-started', '仅存在 false 完成标记不能判定为老用户')
assert(readLearningStage(storage({
  'teclea-completed': JSON.stringify(['cada-dia']),
  'teclea-mastery-progress-v2': '{}',
}), newcomerConfig) === 'established', '旧版已完成课程应保持普通学习阶段')
assert(readLearningStage(storage({ 'teclea-completed': JSON.stringify(['legacy-cada-dia']) }), newcomerConfig) === 'established', '仍可迁移的旧课程 ID 应保持普通学习阶段')
assert(readLearningStage(storage({
  'teclea-completed': JSON.stringify(['removed-lesson']),
  'teclea-mastery-progress-v2': JSON.stringify({ 'removed-lesson': { recall: true } }),
}), newcomerConfig) === 'not-started', '已移除且无法迁移的课程残留不能冒充有效进度')

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
const compactEvidence = encodeWordEvidence({
  complete: { copyCompletedAt: 123, recall: true, listen: true, lastCorrectAt: 456 },
  recallOnly: { recall: true },
})
assert(compactEvidence.complete === 7 && compactEvidence.recallOnly === 2, '同步应把逐词证据编码为紧凑位标记')
const decodedEvidence = decodeWordEvidence(compactEvidence)
assert(decodedEvidence.complete.copyCompletedAt === 1 && decodedEvidence.complete.recall && decodedEvidence.complete.listen, '手机应能从同步位标记恢复三种逐词证据')
const mergedEvidence = mergeWordEvidence(
  { complete: { copyCompletedAt: 123, recall: true, lastCorrectAt: 456 } },
  { complete: { copyCompletedAt: 1, listen: true }, remoteOnly: { recall: true } },
)
assert(mergedEvidence.complete.copyCompletedAt === 123 && mergedEvidence.complete.lastCorrectAt === 456 && mergedEvidence.complete.listen, '同步应用时应保留本机详细时间并合并远端证据')
assert(mergedEvidence.remoteOnly.recall, '远端独有的逐词证据必须写入本机')

const firstDialogueCardId = practiceCardId('common-dialogue-a1-1', { spanish: 'buenos días' })
const secondDialogueCardId = practiceCardId('common-dialogue-a1-1', { spanish: 'buenas tardes' })
assert(firstDialogueCardId !== secondDialogueCardId, '同一编辑批次中的不同词必须拥有不同学习卡 ID')
assert(
  practiceCardId('adaptive-A1-main', { spanish: 'buenos días', practiceId: firstDialogueCardId }) === firstDialogueCardId,
  '动态轮次必须保留原 canonical 学习卡 ID',
)
assert(
  practiceCardId('common-dialogue-a1-1', { spanish: 'buenos días', reviewKey: 'common-a1-dialogue-editorial-009' }) === firstDialogueCardId,
  '专业复核批次键不得替代用户学习卡 ID',
)
assert(
  Object.keys(LEGACY_PRACTICE_CARD_ID_REDIRECTS).length === catalogPolicy.expectedLegacyPracticeCardRedirects,
  `带冠词旧卡应有 ${catalogPolicy.expectedLegacyPracticeCardRedirects} 条显式学习证据重定向`,
)
assert(canonicalPracticeTarget('El menú') === 'menú', '带冠词旧目标应解析为裸词形 canonical 目标')
assert(canonicalPracticeTarget('el ascensor') === 'ascensor', '酒店旧电梯目标应解析为裸词形 canonical 目标')
assert(migratePracticeCardId('de-viaje::la estación') === 'common-travel-a1-1::estación', '旧出行卡 ID 应迁移到 canonical 车站卡')
assert(migratePracticeCardId('en-el-hotel::el ascensor') === 'en-el-hotel::ascensor', '旧酒店电梯卡 ID 应迁移到规范化卡')
assert(
  practiceCardId('en-el-restaurante', { spanish: 'el agua' }) === 'common-food-a1-1::agua',
  '运行时遇到旧场景卡时也必须沿重定向复用 canonical 学习证据',
)
const mergedCanonicalEvidence = normalizeWordEvidence({
  'en-el-restaurante::el menú': { recall: true, copyCompletedAt: 20, lastCorrectAt: 100 },
  'common-food-a1-2::menú': { listen: true, copyCompletedAt: 10, lastCorrectAt: 200 },
}, { legacy: false, migrateCardId: migratePracticeCardId })
assert(Object.keys(mergedCanonicalEvidence).length === 1, '旧卡和 canonical 卡的证据应合并为一条')
assert(
  mergedCanonicalEvidence['common-food-a1-2::menú']?.recall
    && mergedCanonicalEvidence['common-food-a1-2::menú']?.listen
    && mergedCanonicalEvidence['common-food-a1-2::menú']?.copyCompletedAt === 10
    && mergedCanonicalEvidence['common-food-a1-2::menú']?.lastCorrectAt === 200,
  '证据合并应保留两个能力通道、最早首次跟打和最新独立答对时间',
)
assert(
  Object.keys(migratePracticeTrueRecord({ 'de-viaje::la estación': true, 'common-travel-a1-1::estación': true })).join(',') === 'common-travel-a1-1::estación',
  '挑战看义完成记录应合并旧卡与 canonical 卡',
)
assert(
  migratePracticeNumberRecord({ 'de-viaje::la estación': 2, 'common-travel-a1-1::estación': 1 })['common-travel-a1-1::estación'] === 2,
  '挑战听写次数迁移应取较大值，避免重复卡被相加后虚假达标',
)
assert(
  migratePracticeNumberRecord({ 'de-viaje::la estación': 2, 'common-travel-a1-1::estación': 1 }, 'sum')['common-travel-a1-1::estación'] === 3,
  '错题次数迁移应能合并旧卡与 canonical 卡的累计次数',
)
assert(
  migratePracticeCardIds(['de-viaje::la estación', 'common-travel-a1-1::estación'], true).length === 1,
  '近期轮次和薄弱队列迁移后应能去除同一卡的旧 ID 重复',
)

assert(!shouldMarkWordWeak('copy', false, false), '干净完成的跟打项不应进入薄弱集合')
assert(shouldMarkWordWeak('copy', true, false), '跟打输错的项目应先留在跟打模式巩固')
assert(shouldMarkWordWeak('recall', false, true), '看义使用提示的项目应进入薄弱集合')
assert(practiceWordClassLabel({ spanish: 'gente', chinese: '人', partOfSpeech: 'noun', source: {} }, '单词') === '名词', '已有词性应显示中文名称')
assert(practiceWordClassLabel({ spanish: 'hablar', chinese: '说', source: {} }, '动词原形') === '动词', '动词专项应可靠标为动词')
assert(practiceWordClassLabel({ spanish: 'por favor', chinese: '请', source: {} }, '短语') === '固定表达', '短语课程应显示为固定表达')
assert(practiceWordClassLabel({ spanish: 'mesa', chinese: '桌子', article: 'la', source: {} }, '单词') === '名词', '带冠词的旧词应可靠标为名词')
assert(practiceWordClassLabel({ spanish: 'mañana', chinese: '明天', source: {} }, '单词') === '单词', '未校验的旧词不应猜测具体词性')
assert(shouldMarkWordWeak('listen', true, false), '听音输错的项目应进入薄弱集合')

const mananaBase = pressHoldInputDecision({ rawValue: 'man', acceptedValue: 'ma', targetValue: 'mañana', strict: true, idle: true, pending: null })
assert(mananaBase.kind === 'wait' && mananaBase.pending.value === 'man', 'mañana 输入基础 n 时应进入等待而不是立即判错')
const mananaKeyCandidate = pressHoldKeyCandidate({ key: 'n', acceptedValue: 'ma', targetValue: 'mañana', strict: true, idle: true })
assert(mananaKeyCandidate?.value === 'man', 'macOS 长按应从 keydown 阶段预先记录 ñ 替换候选')
assert(pressHoldKeyCandidate({ key: 'x', acceptedValue: 'ma', targetValue: 'mañana', strict: true, idle: true }) === null, '普通错误按键不应进入长按等待')
assert(!isConfirmedPressHold(80, false), '短按并松开基础字母应立即判错')
assert(isConfirmedPressHold(450, false), '持续按住超过阈值应确认长按')
assert(isConfirmedPressHold(80, true), '系统重复键或组合输入信号应确认长按')
const mananaFromKeydown = pressHoldInputDecision({ rawValue: 'man', acceptedValue: 'ma', targetValue: 'mañana', strict: true, idle: true, pending: mananaKeyCandidate })
assert(mananaFromKeydown.kind === 'keep-waiting', 'keydown 预登记后收到基础 n 输入事件应继续等待')
const mananaCompositionCommit = pressHoldInputDecision({ rawValue: 'man\u0303', acceptedValue: 'ma', targetValue: 'mañana', strict: true, idle: true, pending: mananaKeyCandidate })
assert(mananaCompositionCommit.kind === 'commit' && mananaCompositionCommit.value === 'mañ', '组合输入的分解 ñ 应规范化并正确提交')
const mananaRepeat = pressHoldInputDecision({ rawValue: 'mannn', acceptedValue: 'ma', targetValue: 'mañana', strict: true, idle: true, pending: mananaBase.kind === 'wait' ? mananaBase.pending : null })
assert(mananaRepeat.kind === 'keep-waiting', '长按 n 产生的重复基础字母事件应继续等待')
const mananaReplacement = pressHoldInputDecision({ rawValue: 'mañ', acceptedValue: 'ma', targetValue: 'mañana', strict: true, idle: true, pending: mananaBase.kind === 'wait' ? mananaBase.pending : null })
assert(mananaReplacement.kind === 'commit' && mananaReplacement.value === 'mañ', 'n 替换为 ñ 后应立即提交正确输入')
const mananaContinued = pressHoldInputDecision({ rawValue: 'mana', acceptedValue: 'ma', targetValue: 'mañana', strict: true, idle: true, pending: mananaBase.kind === 'wait' ? mananaBase.pending : null })
assert(mananaContinued.kind === 'commit', '等待期间继续输入其他字符应立即交回正常判定')

const lenientMananaBase = pressHoldInputDecision({ rawValue: 'man', acceptedValue: 'ma', targetValue: 'mañana', strict: false, idle: true, pending: null })
assert(lenientMananaBase.kind === 'wait', '忽略元音重音时 n→ñ 仍应进入长按替换等待')
assert(pressHoldKeyCandidate({ key: 'n', acceptedValue: 'ma', targetValue: 'mañana', strict: false, idle: true })?.base === 'n', '宽松模式应从 keydown 识别 ñ 长按候选')
const lenientUmlautBase = pressHoldInputDecision({ rawValue: 'pingu', acceptedValue: 'ping', targetValue: 'pingüino', strict: false, idle: true, pending: null })
assert(lenientUmlautBase.kind === 'wait', '忽略元音重音时 u→ü 仍应进入长按替换等待')
assert(pressHoldKeyCandidate({ key: 'u', acceptedValue: 'ping', targetValue: 'pingüino', strict: false, idle: true })?.base === 'u', '宽松模式应从 keydown 识别 ü 长按候选')
assert(pressHoldInputDecision({ rawValue: 'cafe', acceptedValue: 'caf', targetValue: 'café', strict: false, idle: true, pending: null }).kind === 'commit', '宽松模式下 e→é 应直接提交，不进入长按等待')
assert(pressHoldKeyCandidate({ key: 'e', acceptedValue: 'caf', targetValue: 'café', strict: false, idle: true }) === null, '宽松模式不应拦截可忽略的元音重音')

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
assert(nextDayCorrect.record.maintenance.recall?.active && nextDayCorrect.record.maintenance.recall.dueOn === '2026-08-24', '看义错误恢复后应建立三天维护节点')
assert(!isMaintenanceDue(nextDayCorrect.record, '2026-08-23') && isMaintenanceModeDue(nextDayCorrect.record, 'recall', '2026-08-24'), '维护抽查只能在对应节点到期后推进')
assert(maintenanceAnswerMode(nextDayCorrect.record, '2026-08-24') === 'recall', '维护队列应选择真正到期的能力模式')

const earlyMaintenanceCorrect = recordIndependentCorrect(nextDayCorrect.record, 'recall', Date.parse('2026-08-22T10:00:00'), '2026-08-22')
assert(!earlyMaintenanceCorrect.maintenanceProgressed && earlyMaintenanceCorrect.record.maintenance.recall?.stage === 0, '提前在普通轮次答对不能推进维护节点')
const maintenanceThree = recordIndependentCorrect(earlyMaintenanceCorrect.record, 'recall', Date.parse('2026-08-24T10:00:00'), '2026-08-24')
assert(maintenanceThree.maintenanceProgressed && maintenanceThree.record.maintenance.recall?.stage === 1, '三天节点独立答对后应进入七天节点')
assert(maintenanceThree.record.maintenance.recall?.dueOn === addReviewDays('2026-08-24', MAINTENANCE_INTERVAL_DAYS[1]), '七天节点应从实际完成日计算')
const duplicateMaintenanceDay = recordIndependentCorrect(maintenanceThree.record, 'recall', Date.parse('2026-08-24T15:00:00'), '2026-08-24')
assert(!duplicateMaintenanceDay.maintenanceProgressed && duplicateMaintenanceDay.record.maintenance.recall?.stage === 1, '同一学习日不能重复推进维护节点')
const maintenanceSeven = recordIndependentCorrect(maintenanceThree.record, 'recall', Date.parse('2026-08-31T10:00:00'), '2026-08-31')
const maintenanceTwentyOneDay = maintenanceSeven.record.maintenance.recall?.dueOn
assert(maintenanceSeven.record.maintenance.recall?.stage === 2 && maintenanceTwentyOneDay === addReviewDays('2026-08-31', 21), '七天节点后应进入二十一天节点')
const maintenanceTwentyOne = recordIndependentCorrect(maintenanceSeven.record, 'recall', Date.parse(`${maintenanceTwentyOneDay}T10:00:00`), maintenanceTwentyOneDay)
const maintenanceSixtyDay = maintenanceTwentyOne.record.maintenance.recall?.dueOn
assert(maintenanceTwentyOne.record.maintenance.recall?.stage === 3 && maintenanceSixtyDay === addReviewDays(maintenanceTwentyOneDay, 60), '二十一天节点后应进入六十天节点')
const maintenanceSixty = recordIndependentCorrect(maintenanceTwentyOne.record, 'recall', Date.parse(`${maintenanceSixtyDay}T10:00:00`), maintenanceSixtyDay)
assert(maintenanceSixty.maintenanceCompleted && maintenanceSixty.record.maintenance.recall?.stage === 4 && !maintenanceSixty.record.maintenance.recall.active, '六十天节点完成后应进入稳定历史')
assert(!isMaintenanceDue(maintenanceSixty.record, addReviewDays(maintenanceSixtyDay, 365)), '稳定历史不能继续生成强制维护任务')
assert(!nextDayCorrect.record.maintenance.listen, '看义错误恢复不能误建听音维护节点')
assert(mistakeSamplingWeight(maintenanceThree.record, maintenanceThree.record.maintenance.recall.dueOn) > mistakeSamplingWeight(maintenanceSixty.record, maintenanceSixtyDay), '到期维护词在普通抽词中应获得额外权重')

const copyWrong = recordWrongAttempt(undefined, reviewWord, 'copy', Date.parse('2026-08-20T10:00:00'), '2026-08-20')
assert(!recordIndependentCorrect(copyWrong, 'copy', Date.parse('2026-08-21T09:00:00'), '2026-08-21').progressed, '跟打答对不能作为独立恢复证据')
const recoveredCopyWrong = recordIndependentCorrect(copyWrong, 'recall', Date.parse('2026-08-21T09:00:00'), '2026-08-21')
assert(recoveredCopyWrong.resolved, '看义独立答对应能恢复跟打错误')
assert(!recoveredCopyWrong.record.maintenance.recall, '单纯跟打错误恢复后不应生成长期维护任务')
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

const mixedModeReview = {
  ...secondWrong,
  lastWrongAt: Date.parse('2026-08-22T12:00:00'),
  review: {
    recall: { active: true, recoveryCount: 1, lastRecoveryDay: '2026-08-22', dueOn: '2026-08-23', lastWrongAt: secondWrong.lastWrongAt },
    listen: { active: true, recoveryCount: 0, dueOn: '2026-08-22', lastWrongAt: Date.parse('2026-08-22T12:00:00') },
  },
}
assert(isReviewModeDue(mixedModeReview, 'listen', '2026-08-22'), '应能识别词内具体到期的能力通道')
assert(!isReviewModeDue(mixedModeReview, 'recall', '2026-08-22'), '尚未到期的看义通道不应被当作今日任务')
assert(reviewAnswerMode(mixedModeReview, '2026-08-22') === 'listen', '看义尚未到期但听音已到期时应进入听音拼写')
assert(mistakeReviewBucket(mixedModeReview, '2026-08-22') === 'due', '同时符合今日错题与到期条件时只能进入优先级更高的待复习组')
assert(mistakeReviewBucket(firstWrong, '2026-08-20') === 'today', '尚未到期的当日错题应只进入今日错题组')
assert(mistakeReviewBucket(recoveryOne.record, '2026-08-22') === 'later', '今日已推进且等待明日确认的错题应只进入稍后复查组')

const legacyMistake = normalizeMistakeRecord({ ...reviewWord, count: 4, lastWrongAt: Date.parse('2026-08-19T10:00:00'), lastMode: 'listen' })
assert(legacyMistake?.wrongCounts.listen === 4 && legacyMistake.review.listen?.active, '旧错题数据应迁移为永久统计与活跃复习状态')
const migratedResolvedMistake = normalizeMistakeRecord({
  ...nextDayCorrect.record,
  maintenance: undefined,
})
assert(migratedResolvedMistake?.maintenance.recall?.dueOn === '2026-08-24', '已有恢复历史但缺少维护字段时应兼容生成三天节点')

const failedMaintenance = recordWrongAttempt(maintenanceThree.record, reviewWord, 'recall', Date.parse('2026-08-25T10:00:00'), '2026-08-25')
assert(failedMaintenance.review.recall?.active && failedMaintenance.review.recall.dueOn === '2026-08-26', '维护期间再次输错应重新激活次日错误恢复')
assert(!failedMaintenance.maintenance.recall, '维护期间再次输错应清除该能力通道的旧维护阶段')

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
assert(firstModeAfterIntroduction('listen') === 'recall' && firstModeAfterIntroduction('recall') === 'recall', '新词预热后必须先进入看义拼写，不能直接跳到听音')
assert(safePracticeResumeIndex(1, 0) === 0, '未完成任何词的异常 session 不能从第二词恢复')
assert(safePracticeResumeIndex(1, 1) === 1, '已经完成第一词的 session 应从第二词恢复')

assert(masteryRecommendation(69, true) === 'repeat', '69% 应继续当前模式')
assert(masteryRecommendation(70, true) === 'reinforce', '70% 应进入薄弱项巩固')
assert(masteryRecommendation(89, true) === 'reinforce', '89% 应进入薄弱项巩固')
assert(masteryRecommendation(90, true) === 'advance', '90% 应推进到下一阶段')
assert(masteryRecommendation(100, false) === 'repeat', '切换模式或使用提示后不应获得推进')
assert(nextStageAfterSkippedReinforcement('copy').mode === 'recall' && !nextStageAfterSkippedReinforcement('copy').startNewRound, '跳过跟打巩固应进入同组看义拼写')
assert(nextStageAfterSkippedReinforcement('recall').mode === 'listen' && !nextStageAfterSkippedReinforcement('recall').startNewRound, '跳过看义巩固应进入同组听音拼写')
assert(nextStageAfterSkippedReinforcement('listen').mode === 'recall' && nextStageAfterSkippedReinforcement('listen').startNewRound, '跳过听音巩固应开始下一组')

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

const challengeCards = ['one', 'two', 'three', 'four']
assert(challengePendingCardIds(challengeCards, 'recall', { one: true }, {}, 2).join(',') === 'two,three,four', '挑战看义轮只能抽尚未完成看义证据的词')
assert(challengePendingCardIds(challengeCards, 'listen', {}, { one: 1, two: 0, three: 2, four: 1 }, 2).join(',') === 'two,one,four', '挑战听写应排除已达次数的词并优先练完成次数更少的词')
assert(challengeRoundSize(8, 3, 20) === 3, '挑战轮不应超过今日剩余目标')
assert(challengeRoundSize(8, 10, 4) === 4, '挑战轮不应超过当前待完成词数')
assert(challengeTodayTarget(90, 10, 10, 0) === 11, '今日挑战目标不应因当天刚完成的次数被重复扣减而缩水')

const recommendationDoc = readFileSync(new URL('../docs/PRACTICE_RECOMMENDATION.md', import.meta.url), 'utf8')
for (const requiredSection of ['学习阶段判定', '首次跟打完成', '近期重复层', '新内容预热', '模式推进阈值', '队列持久化', '跨学习日错题恢复']) {
  assert(recommendationDoc.includes(requiredSection), `抽取规则文档缺少章节：${requiredSection}`)
}
const appSource = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8')
assert(appSource.includes('const NEWCOMER_WORDS = DEFAULT_LESSON.words'), '新手首轮应使用完整的默认八词课程')
assert(appSource.includes('const storedMatch = catalogWordById(storedKey)'), '历史错题必须优先按保存的 canonical 卡片 ID 恢复')
assert(appSource.includes('followUpMode: firstModeAfterIntroduction'), '预热会话必须把后续模式固定路由到看义拼写')
assert(appSource.includes('aria-label="正在恢复练习"'), '恢复 session 时应先稳定 lesson 和 index，避免首词闪烁后跳转')
assert(appSource.includes('本轮 ${activeSession?.followUpOrder?.length ?? lesson.words.length} 项'), '新词预热应同时显示完整轮次项目数')
assert(appSource.includes("localStorage.setItem(NEWCOMER_ROUND_DONE_KEY, 'true')"), '只有完整首轮结束后才应写入新完成标记')
assert(appSource.includes("localStorage.setItem(LEGACY_ONBOARDING_DONE_KEY, 'true')"), '完整首轮结束后应保留旧三词标记兼容性')
assert(appSource.includes("'首轮 8 词已完成'"), '首轮结果页应明确显示八词完成')
assert(!appSource.includes('/3 个词'), '新手进度标签不能再硬编码为三词')
assert(!appSource.includes('className="mode-intro"'), '首轮完成后不应再插入额外模式教学卡片')
assert(appSource.includes('continueRemainingMistakeReview') && appSource.includes("mistakeReviewMode === mode ? '继续完成' : '继续'"), '错题本应先完成同模式遗留项或继续下一到期通道')
assert(appSource.includes('const resumableMainSession = activeSession ?? pausedMainSession'), '错题复习后返回首页时应仍可恢复此前暂停的普通练习')
assert(appSource.includes('words: entries.map(([cardId, record]) =>'), '专门错题轮应保留当前能力通道内的完整错词集合')
assert(appSource.includes('const dueMaintenanceEntries =') && appSource.includes('开始历史巩固复查'), '恢复后的历史错词应进入独立的到期巩固队列')
assert(appSource.includes("hasActiveReview(mistake) || isMaintenanceDue(mistake, reviewToday)"), '普通自适应练习也应提高到期维护词的抽取优先级')
assert(appSource.includes('wordEvidence: encodeWordEvidence(wordEvidence)'), '同步快照必须包含电脑端逐词学习证据')
assert(appSource.includes('recentRoundQueues,') && appSource.includes('setRecentRoundQueues(readRecentRoundQueues())'), '同步快照必须携带并恢复最近两轮队列')
assert(appSource.includes('setWordEvidence(nextWordEvidence)'), '手机应用同步快照后必须立即刷新逐词学习证据')
assert(/function saveWordEvidence\(nextEvidence: WordEvidence\) \{\s*scheduleSync\(\)/.test(appSource), '逐词学习证据变化必须主动安排跨设备同步')
assert(recommendationDoc.includes('不按普通轮次的固定项数拆分'), '错题规则应记录保持完整连续轮次的产品决定')
const mistakePlanDoc = readFileSync(new URL('../docs/MISTAKE_REVIEW_PLAN.md', import.meta.url), 'utf8')
for (const requiredPlanSection of ['错误恢复（recovery）', '恢复后维护（maintenance）', '3／7／21／60', '历史数据兼容', '隐私与测量']) {
  assert(mistakePlanDoc.includes(requiredPlanSection), `错词双层复习方案缺少：${requiredPlanSection}`)
}

assert(appSource.includes('const PRESS_HOLD_REPLACEMENT_MS = 3000'), '长按重音替换窗口应为 3 秒')
assert(
  /onBlur=\{\(\) => \{\s*cancelPressHoldReplacement\(\)/.test(appSource),
  '输入框失焦时应取消长按重音等待',
)
assert(
  /onCompositionEnd=\{\(event\) => \{[\s\S]*?handleCommittedInput\(event\.currentTarget\.value\)/.test(appSource),
  '组合输入提交也必须经过长按重音等待判断',
)
assert(
  !/onCompositionStart=\{\(\) => \{\s*cancelPressHoldReplacement\(\)/.test(appSource),
  '系统开始组合输入时不应清除已登记的长按候选',
)
assert(/function cancelPressHoldReplacement\(\)[\s\S]*?pressHoldPendingRef\.current = null/.test(appSource), '取消长按等待时应同时清理待替换状态')
assert(appSource.includes('按住 <kbd>Tab</kbd> 或鼠标长按上方字母区查看答案'), '桌面练习页应明确提示 Tab 和鼠标长按查看答案')
assert(appSource.includes('长按上方字母区查看答案'), '触屏练习页应明确提示长按查看答案')
assert(/className="letter-word"[\s\S]*?onPointerDown=\{startTouchReveal\}[\s\S]*?onPointerUp=\{stopTouchReveal\}/.test(appSource), '字母区应保留按住显示、松开隐藏答案的交互')
assert(appSource.includes('暂不巩固，进入看义拼写') && appSource.includes('暂不巩固，进入听音拼写') && appSource.includes('暂不巩固，开始下一组'), '完成页应清楚标出跳过巩固后的下一阶段')
assert(appSource.includes("word.article ? ` · ${word.article}` : ''"), '名词冠词元数据应显示在练习页，但不进入拼写目标')
assert(appSource.includes('const normalizedMerged = applySyncSnapshot(merged)') && appSource.includes('pushSync(normalized, normalizedMerged)'), '云同步必须上传完成旧卡 ID 迁移后的快照')
assert(/function openLevelPath\(nextLevel: LessonLevel\) \{\s*setLevelFilter\(nextLevel\)\s*beginAdaptiveRound/.test(appSource), '首页等级卡应按当前选择开新一组，而不是自动恢复旧练习')
assert(appSource.includes("'challenge-active-home'") && appSource.includes('challenge-home-card'), '进行中的挑战应切换为挑战优先首页')
assert(appSource.includes('今天还需 <strong>{challengeTodayRemaining}</strong> 次') && appSource.includes('challengeMinutesRemaining'), '挑战首页应突出今日剩余次数与预计时间')
assert(appSource.includes('onClick={openChallengeSummary}>计划与明细</button>'), '挑战首页应保留计划与每日明细入口')
assert(appSource.includes('制定学习挑战') && appSource.includes('继续自由练习'), '未创建挑战时应同时保留自由练习与挑战入口')
assert(appSource.includes('每天打开，就知道今天该练什么') && appSource.includes('challenge-invite-card'), '未创建挑战时首页应提供清晰的计划型挑战入口')
assert(appSource.includes('hero-lexicon-meta') && appSource.includes('考试路线 {examRouteCardCount}') && appSource.includes('Vida 生活 {lifeRouteCardCount}') && appSource.includes('超市专题 {supermarketCardCount}'), '首页应显示动态双词库与 Vida 超市规模')
assert(appSource.includes('考试 {examRouteCardCount} · Vida {lifeRouteCardCount} · 超市 {supermarketCardCount}'), '挑战用户的首页词库栏也应显示 Vida 超市规模')
assert(appSource.includes('rightRemainingShare - leftRemainingShare'), '挑战入口应按主线与动词专项的相对欠账调度，不继承首页临时筛选')
assert(appSource.includes("lesson.id.startsWith('challenge-') && challengeTodayRemaining > 0"), '挑战完成页继续操作应回到挑战欠账调度，而不是退回普通抽词')
assert(appSource.includes("? '今日复习'") && appSource.includes('个错题已经到期'), '到期错题应在首页获得更明确的复习提醒')
assert(appSource.includes('<p className="completion-enter-shortcut"><kbd>Enter</kbd><span>直接继续</span></p>'), '所有完成页都应提示桌面用户可按 Enter 执行主操作')

if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log('Practice routing validation passed: introduction, recency, spaced mistake recovery, thresholds, sizing, and documentation.')
}
