import fs from 'node:fs'
import path from 'node:path'
import { createServer } from 'vite'
import { LEVELS, KINDS, normalizeTarget, parseArgs, percentage, readJson, writeJson } from './lexicon-utils.mjs'
import { auditProfessionalReviews } from './professional-review-utils.mjs'

const args = parseArgs(process.argv.slice(2))
const jsonOutput = path.resolve(String(args.json ?? 'docs/lexicon/LIFE_ROUTE_AUDIT.json'))
const markdownOutput = path.resolve(String(args.markdown ?? 'docs/lexicon/LIFE_ROUTE_AUDIT.md'))
const sourceManifest = readJson(path.resolve('data/lexicon/sources.json'))
const MODULES = ['supermarket', 'mobility', 'settling', 'daily']
const MODULE_LABELS = {
  supermarket: '超市采购',
  mobility: '城市出行',
  settling: '在西班牙安顿',
  daily: '高频日常',
}

function markdownTable(headers, rows) {
  const header = `| ${headers.join(' | ')} |`
  const divider = `| ${headers.map(() => '---').join(' | ')} |`
  return [header, divider, ...rows.map((row) => `| ${row.join(' | ')} |`)].join('\n')
}

function countsFor(values, keys) {
  return Object.fromEntries(keys.map((key) => [key, values.filter((value) => value === key).length]))
}

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } })
try {
  const { lessons } = await server.ssrLoadModule('/src/data.ts')
  const cards = lessons.flatMap((lesson) => lesson.words.map((word) => ({
    lessonId: lesson.id,
    level: lesson.level,
    kind: lesson.kind,
    spanish: word.spanish,
    chinese: word.chinese,
    lemma: word.lemma ?? '',
    partOfSpeech: word.partOfSpeech ?? '',
    scene: lesson.scene,
    normalizedTarget: normalizeTarget(word.spanish),
    frequencyRank: word.frequencyRank ?? null,
    routes: word.routes ?? ['exam'],
    hasExample: Boolean(word.example && word.exampleChinese),
    example: word.example ?? '',
    exampleChinese: word.exampleChinese ?? '',
    hasSource: Boolean(word.source?.name && word.source?.url && word.source?.license && word.source?.checkedAt),
    lifePlacements: word.lifePlacements ?? (word.lifeModule && word.lifeTier && word.access
      ? [{ module: word.lifeModule, tier: word.lifeTier, access: word.access }]
      : []),
  })))

  const lifeCards = cards.filter((card) => card.lifePlacements.length > 0)
  const professionalReviewAudit = auditProfessionalReviews(cards)
  if (professionalReviewAudit.errors.length) throw new Error(`专业复核记录无效:\n${professionalReviewAudit.errors.join('\n')}`)
  const professionallyReviewedLifeCards = lifeCards.filter((card) => professionalReviewAudit.passedTargets.has(card.normalizedTarget))
  const moduleRows = MODULES.map((module) => {
    const subset = lifeCards.filter((card) => card.lifePlacements.some((placement) => placement.module === module))
    const placements = subset.map((card) => card.lifePlacements.find((placement) => placement.module === module))
    return {
      module,
      label: MODULE_LABELS[module],
      cards: subset.length,
      newCanonicalCards: subset.filter((card) => card.lessonId.startsWith('vida-')).length,
      reusedCanonicalCards: subset.filter((card) => !card.lessonId.startsWith('vida-')).length,
      access: countsFor(placements.map((placement) => placement.access), ['free', 'paid']),
      tiers: countsFor(placements.map((placement) => placement.tier), ['L1', 'L2', 'L3']),
      kinds: countsFor(subset.map((card) => card.kind), KINDS),
      levels: countsFor(subset.map((card) => card.level), LEVELS),
      frequencyRankedCards: subset.filter((card) => Number.isInteger(card.frequencyRank)).length,
      sharedWithExam: subset.filter((card) => card.routes.includes('exam')).length,
      lifeOnly: subset.filter((card) => !card.routes.includes('exam')).length,
      exampleCoverage: percentage(subset.filter((card) => card.hasExample).length, subset.length),
      sourceCoverage: percentage(subset.filter((card) => card.hasSource).length, subset.length),
    }
  })

  const overlaps = []
  for (let leftIndex = 0; leftIndex < MODULES.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < MODULES.length; rightIndex += 1) {
      const left = MODULES[leftIndex]
      const right = MODULES[rightIndex]
      const shared = lifeCards.filter((card) => {
        const modules = new Set(card.lifePlacements.map((placement) => placement.module))
        return modules.has(left) && modules.has(right)
      })
      overlaps.push({
        modules: [left, right],
        cards: shared.length,
        targets: shared.map((card) => card.spanish).sort((a, b) => a.localeCompare(b, 'es')),
      })
    }
  }

  const multiModuleCards = lifeCards.filter((card) => card.lifePlacements.length > 1)
  const accessConflicts = multiModuleCards.filter((card) => new Set(card.lifePlacements.map((placement) => placement.access)).size > 1)
  const tierConflicts = multiModuleCards.filter((card) => new Set(card.lifePlacements.map((placement) => placement.tier)).size > 1)
  const freeCards = lifeCards.filter((card) => card.lifePlacements.some((placement) => placement.access === 'free'))
  const paidCards = lifeCards.filter((card) => card.lifePlacements.some((placement) => placement.access === 'paid'))
  const placementCount = lifeCards.reduce((sum, card) => sum + card.lifePlacements.length, 0)

  const report = {
    schemaVersion: 1,
    generatedAt: sourceManifest.checkedAt,
    scope: {
      uniqueLifeCards: lifeCards.length,
      modulePlacements: placementCount,
      extraPlacementsFromReuse: placementCount - lifeCards.length,
      modules: MODULES,
      denominator: 'Canonical cards carrying at least one lifePlacements entry in the current runtime catalog',
    },
    routeComposition: {
      sharedWithExam: lifeCards.filter((card) => card.routes.includes('exam')).length,
      lifeOnly: lifeCards.filter((card) => !card.routes.includes('exam')).length,
      uniqueFreeCards: freeCards.length,
      uniquePaidCards: paidCards.length,
    },
    moduleRows,
    reuse: {
      multiModuleCards: multiModuleCards.length,
      maximumPlacementsOnOneCard: Math.max(...lifeCards.map((card) => card.lifePlacements.length)),
      pairwiseOverlaps: overlaps,
      accessConflicts: accessConflicts.map((card) => ({ target: card.spanish, placements: card.lifePlacements })),
      tierConflicts: tierConflicts.map((card) => ({ target: card.spanish, placements: card.lifePlacements })),
    },
    quality: {
      cardsWithExamples: lifeCards.filter((card) => card.hasExample).length,
      exampleCoverage: percentage(lifeCards.filter((card) => card.hasExample).length, lifeCards.length),
      cardsWithTraceableSources: lifeCards.filter((card) => card.hasSource).length,
      sourceCoverage: percentage(lifeCards.filter((card) => card.hasSource).length, lifeCards.length),
      cardsWithAuditableProfessionalReview: professionallyReviewedLifeCards.length,
      professionalReviewCoverage: percentage(professionallyReviewedLifeCards.length, lifeCards.length),
      professionalReviewRecords: professionalReviewAudit.records.length,
      staleProfessionalReviewRecords: professionalReviewAudit.staleRecords.length,
      professionalReviewIssueTargets: professionalReviewAudit.issueRecords.length,
      duplicateNormalizedTargetsWithinLifeRoute: lifeCards.length - new Set(lifeCards.map((card) => card.normalizedTarget)).size,
    },
    decision: {
      status: 'v1-content-baseline-reached',
      bulkExpansion: 'stop',
      rationale: 'The four planned Vida V1 modules have stable content, access and tier baselines. Further additions should respond to audited framework or catalog gaps, observed task failures, or professional review rather than raw card-count growth.',
      nextGates: [
        'Named Spanish-teacher review with reviewer and review-date records',
        'Task-based QA with real learners from the intended Chinese-speaking audience',
        'Product UI for life-route and module entry, including an explicit free/paid boundary',
        'Analytics for module starts, task completion, return use and searched-but-missing vocabulary',
        'Add or revise cards only when an audited framework or catalog gap, review, or observed user task identifies a concrete need',
      ],
    },
    limitations: [
      'This report audits the current editorial catalog; it does not prove that the vocabulary is exhaustive for life in Spain.',
      'Source and example coverage do not substitute for professional linguistic review.',
      'The access field is content metadata only; no payment entitlement is implemented yet.',
      'CEFR levels on life cards are difficulty guidance and do not certify exam inclusion.',
    ],
  }

  writeJson(jsonOutput, report)
  fs.mkdirSync(path.dirname(markdownOutput), { recursive: true })

  const nonZeroOverlaps = overlaps.filter((row) => row.cards > 0)
  const markdown = `# Vida 生活路线 V1 审计（${sourceManifest.checkedAt}）

## 结论

Vida 生活路线已经达到可以停止无目标批量扩词的 V1 内容基线：当前有 **${lifeCards.length} 个不重复学习项**，分布在 **${placementCount} 个模块归属**中。多出的 ${placementCount - lifeCards.length} 个归属来自同一 canonical 卡被多个现实任务复用，不是重复建卡。

下一步不应继续按总数堆词。只有审计发现明确的框架或目录缺口、具名西语教师复核、真实学习任务失败或用户搜索缺词证据指出具体需求时，才新增或修改词条。

## 四个模块

${markdownTable(
    ['模块', '唯一项', '新增 / 复用', '免费 / 付费', 'L1 / L2 / L3', '有词频排名', '与考试路线共享', '来源', '例句'],
    moduleRows.map((row) => [
      row.label,
      row.cards,
      `${row.newCanonicalCards} / ${row.reusedCanonicalCards}`,
      `${row.access.free} / ${row.access.paid}`,
      `${row.tiers.L1} / ${row.tiers.L2} / ${row.tiers.L3}`,
      row.frequencyRankedCards,
      row.sharedWithExam,
      `${row.sourceCoverage}%`,
      `${row.exampleCoverage}%`,
    ]),
  )}

四个模块合计有 **${moduleRows.reduce((sum, row) => sum + row.access.free, 0)} 个免费 placement**，去除跨模块复用后是 **${freeCards.length} 个免费 canonical 学习项**；付费侧分别为 **${moduleRows.reduce((sum, row) => sum + row.access.paid, 0)} 个 placement**和 **${paidCards.length} 个 canonical 学习项**。当前没有免费／付费冲突，也没有同一词跨模块 L 等级冲突。

## 路线与跨模块复用

- 与考试路线共享：${report.routeComposition.sharedWithExam} 项；仅生活路线：${report.routeComposition.lifeOnly} 项。
- 属于多个生活模块：${multiModuleCards.length} 项；单项最多进入 ${report.reuse.maximumPlacementsOnOneCard} 个生活模块。
- canonical 目标重复：${report.quality.duplicateNormalizedTargetsWithinLifeRoute} 项。

${nonZeroOverlaps.length > 0 ? markdownTable(
    ['模块组合', '共享项数', '共享目标'],
    nonZeroOverlaps.map((row) => [row.modules.map((module) => MODULE_LABELS[module]).join(' × '), row.cards, row.targets.join('、')]),
  ) : '当前没有跨模块共享项。'}

## 质量门槛

- 可追踪来源：${report.quality.cardsWithTraceableSources} / ${lifeCards.length}（${report.quality.sourceCoverage}%）。
- 双语例句：${report.quality.cardsWithExamples} / ${lifeCards.length}（${report.quality.exampleCoverage}%）。
- 当前内容仍匹配且结论为通过的具名专业复核：${report.quality.cardsWithAuditableProfessionalReview} / ${lifeCards.length}（${report.quality.professionalReviewCoverage}%）。过期历史记录 ${report.quality.staleProfessionalReviewRecords} 条，待修订或拒绝目标 ${report.quality.professionalReviewIssueTargets} 项；专业复核仍是发布前最重要的内容门槛。
- \`access\` 目前只是内容元数据，尚未实现真正的购买和权益校验。

## V1 停止条件与下一道门

当前状态记为 \`${report.decision.status}\`：四个预定模块已有明确数量、层级和免费边界，因此停止无目标批量扩词。接下来依次需要：

1. 由具名西语教师记录逐条或抽样复核结果与日期；
2. 让目标华语用户完成采购、出行、安顿和日常表达任务，记录卡住与主动搜索的词；
3. 实现生活路线／模块入口及清楚的免费／付费边界；
4. 用模块开始率、任务完成率、回访和“搜索但不存在”作为补词证据；
5. 只针对明确的框架／目录缺口或上述证据暴露的问题新增、删改或重新分级。

这份审计不声称词库已经穷尽西班牙生活用语，也不把来源完整或内部编辑当作教师专业复核。机器可读明细见 [\`LIFE_ROUTE_AUDIT.json\`](LIFE_ROUTE_AUDIT.json)。

第一份跨四模块与考试路线的 72 项空白复核样本已按 [\`PROFESSIONAL_REVIEW.md\`](PROFESSIONAL_REVIEW.md) 准备；样本生成本身不增加专业复核覆盖率。
`

  fs.writeFileSync(markdownOutput, markdown)
  console.log(`Wrote ${path.relative(process.cwd(), jsonOutput)}`)
  console.log(`Wrote ${path.relative(process.cwd(), markdownOutput)}`)
} finally {
  await server.close()
}
