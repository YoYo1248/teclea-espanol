import fs from 'node:fs'
import path from 'node:path'
import { createServer } from 'vite'
import { normalizeTarget, parseArgs, percentage, readJson, tokenCount, writeJson } from './lexicon-utils.mjs'
import { auditProfessionalReviews } from './professional-review-utils.mjs'

const args = parseArgs(process.argv.slice(2))
const jsonOutput = path.resolve(String(args.json ?? 'docs/lexicon/RELEASE_READINESS.json'))
const markdownOutput = path.resolve(String(args.markdown ?? 'docs/lexicon/RELEASE_READINESS.md'))
const strict = args.strict === true || args.strict === 'true'
const policy = readJson(path.resolve('data/lexicon/catalog-policy.json'))
const sourceManifest = readJson(path.resolve('data/lexicon/sources.json'))
const MODULES = ['supermarket', 'mobility', 'settling', 'daily']
const MODULE_LABELS = { supermarket: '超市采购', mobility: '城市出行', settling: '在西班牙安顿', daily: '高频日常' }

function markdownTable(headers, rows) {
  const header = `| ${headers.join(' | ')} |`
  const divider = `| ${headers.map(() => '---').join(' | ')} |`
  return [header, divider, ...rows.map((row) => `| ${row.join(' | ')} |`)].join('\n')
}

function gate(id, scope, label, actual, required, passed, evidence) {
  return { id, scope, label, actual, required, passed, evidence }
}

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } })
try {
  const { lessons } = await server.ssrLoadModule('/src/data.ts')
  const cards = lessons.flatMap((lesson) => lesson.words.map((word) => ({
    ...word,
    lessonId: lesson.id,
    level: lesson.level,
    scene: lesson.scene,
    kind: lesson.kind,
    normalizedTarget: normalizeTarget(word.spanish),
    routes: word.routes ?? ['exam'],
    lifePlacements: word.lifePlacements ?? (word.lifeModule && word.lifeTier && word.access
      ? [{ module: word.lifeModule, tier: word.lifeTier, access: word.access }]
      : []),
    hasSource: Boolean(word.source?.name && word.source?.url && word.source?.license && word.source?.checkedAt),
    hasExample: Boolean(word.example && word.exampleChinese),
    hasStructuredLexicalMetadata: Boolean(word.lemma && word.partOfSpeech),
    hasFrameworkReference: Boolean(word.frameworkReference),
  })))
  const lifeCards = cards.filter((card) => card.routes.includes('life'))
  const examCards = cards.filter((card) => card.routes.includes('exam'))
  const professionalReviewAudit = auditProfessionalReviews(cards)
  if (professionalReviewAudit.errors.length) throw new Error(`专业复核记录无效:\n${professionalReviewAudit.errors.join('\n')}`)

  const targetCounts = new Map()
  cards.forEach((card) => targetCounts.set(card.normalizedTarget, (targetCounts.get(card.normalizedTarget) ?? 0) + 1))
  const duplicateTargets = [...targetCounts.entries()].filter(([, count]) => count > 1)
  const overlongTargets = cards.filter((card) => tokenCount(card.spanish) > policy.maximumWordsPerTarget)
  const multiModuleCards = lifeCards.filter((card) => card.lifePlacements.length > 1)
  const accessConflicts = multiModuleCards.filter((card) => new Set(card.lifePlacements.map((placement) => placement.access)).size > 1)
  const tierConflicts = multiModuleCards.filter((card) => new Set(card.lifePlacements.map((placement) => placement.tier)).size > 1)
  const advancedCandidates = cards.filter((card) => card.level === 'C1' || card.level === 'C2')
  const advancedEditorialReady = advancedCandidates.filter((card) => card.hasExample && card.hasStructuredLexicalMetadata)

  const moduleRows = MODULES.map((module) => {
    const subset = lifeCards.filter((card) => card.lifePlacements.some((placement) => placement.module === module))
    const passed = subset.filter((card) => professionalReviewAudit.passedTargets.has(card.normalizedTarget))
    return {
      module,
      label: MODULE_LABELS[module],
      cards: subset.length,
      sourceCoverage: percentage(subset.filter((card) => card.hasSource).length, subset.length),
      exampleCoverage: percentage(subset.filter((card) => card.hasExample).length, subset.length),
      structuredMetadataCoverage: percentage(subset.filter((card) => card.hasStructuredLexicalMetadata).length, subset.length),
      professionalReviewCoverage: percentage(passed.length, subset.length),
    }
  })

  const gates = [
    gate('canonical-unique', 'catalog', 'canonical 输入目标唯一', duplicateTargets.length, 0, duplicateTargets.length === 0, 'scripts/validate_catalog.mjs'),
    gate('target-length', 'catalog', `训练目标不超过 ${policy.maximumWordsPerTarget} 个词`, overlongTargets.length, 0, overlongTargets.length === 0, 'scripts/validate_catalog.mjs'),
    gate('source-complete', 'formal-publication', '所有卡具有来源四要素', cards.filter((card) => card.hasSource).length, cards.length, cards.every((card) => card.hasSource), 'docs/lexicon/COVERAGE_REPORT.json'),
    gate('examples-complete', 'formal-publication', '所有卡具有双语例句', cards.filter((card) => card.hasExample).length, cards.length, cards.every((card) => card.hasExample), 'docs/lexicon/COVERAGE_REPORT.json'),
    gate('structured-metadata-complete', 'formal-publication', '所有卡具有 lemma 与词类', cards.filter((card) => card.hasStructuredLexicalMetadata).length, cards.length, cards.every((card) => card.hasStructuredLexicalMetadata), 'docs/lexicon/COVERAGE_REPORT.json'),
    gate('framework-reference-complete', 'formal-publication', '所有卡具有 PCIC 框架参考', cards.filter((card) => card.hasFrameworkReference).length, cards.length, cards.every((card) => card.hasFrameworkReference), 'docs/lexicon/COVERAGE_REPORT.json'),
    gate('professional-review-complete', 'formal-publication', '所有当前卡通过具名专业复核', professionalReviewAudit.passedTargets.size, policy.professionalReviewRequired ? cards.length : 0, !policy.professionalReviewRequired || professionalReviewAudit.passedTargets.size === cards.length, 'data/lexicon/professional-reviews/*.jsonl'),
    gate('professional-review-issues', 'formal-publication', '没有当前待修订或拒绝项', professionalReviewAudit.issueRecords.length, 0, professionalReviewAudit.issueRecords.length === 0, 'data/lexicon/professional-reviews/*.jsonl'),
    gate('advanced-candidate-exit', 'formal-publication', 'C1–C2 候选已完成编辑与专业复核', advancedCandidates.filter((card) => card.hasExample && card.hasStructuredLexicalMetadata && professionalReviewAudit.passedTargets.has(card.normalizedTarget)).length, advancedCandidates.length, advancedCandidates.every((card) => card.hasExample && card.hasStructuredLexicalMetadata && professionalReviewAudit.passedTargets.has(card.normalizedTarget)), 'src/advancedWords.ts + professional review records'),
    gate('life-source-complete', 'life-v1-content', 'Vida 全部卡具有来源四要素', lifeCards.filter((card) => card.hasSource).length, lifeCards.length, lifeCards.every((card) => card.hasSource), 'docs/lexicon/LIFE_ROUTE_AUDIT.json'),
    gate('life-examples-complete', 'life-v1-content', 'Vida 全部卡具有双语例句', lifeCards.filter((card) => card.hasExample).length, lifeCards.length, lifeCards.every((card) => card.hasExample), 'docs/lexicon/LIFE_ROUTE_AUDIT.json'),
    gate('life-structured-metadata-complete', 'life-v1-content', 'Vida 全部卡具有 lemma 与词类', lifeCards.filter((card) => card.hasStructuredLexicalMetadata).length, lifeCards.length, lifeCards.every((card) => card.hasStructuredLexicalMetadata), 'docs/lexicon/LIFE_ROUTE_AUDIT.json'),
    gate('life-placement-conflicts', 'life-v1-content', 'Vida 没有访问级别或 L 等级冲突', accessConflicts.length + tierConflicts.length, 0, accessConflicts.length === 0 && tierConflicts.length === 0, 'docs/lexicon/LIFE_ROUTE_AUDIT.json'),
  ]

  const catalogValid = gates.filter((item) => item.scope === 'catalog').every((item) => item.passed)
  const lifeV1ContentReady = gates.filter((item) => item.scope === 'life-v1-content').every((item) => item.passed)
  const formalPublicationReady = gates.filter((item) => item.scope === 'formal-publication').every((item) => item.passed)
  const report = {
    schemaVersion: 1,
    generatedAt: sourceManifest.checkedAt,
    status: {
      catalogValid,
      lifeV1ContentReady,
      formalPublicationReady,
      meaning: {
        catalogValid: 'Structural and canonical invariants represented in this report pass. Run npm run check for the complete engineering validation suite.',
        lifeV1ContentReady: 'The four Vida modules meet their current V1 source, example, structured-metadata and placement baselines; this does not include professional approval or payment implementation.',
        formalPublicationReady: 'All formal content gates pass, including current-content professional review. False means the catalog must remain labelled candidate/editorial.',
      },
    },
    scope: {
      cards: cards.length,
      examCards: examCards.length,
      lifeCards: lifeCards.length,
      advancedCandidates: advancedCandidates.length,
      advancedEditorialReady: advancedEditorialReady.length,
      commonA1EditorialReady: cards.filter((card) => card.reviewKey === 'common-a1-connectors-editorial-001').length,
      commonA1TimeEditorialReady: cards.filter((card) => card.reviewKey === 'common-a1-time-editorial-002').length,
      commonA1QuantityEditorialReady: cards.filter((card) => card.reviewKey === 'common-a1-quantity-editorial-003').length,
      commonA1FamilyEditorialReady: cards.filter((card) => card.reviewKey === 'common-a1-family-editorial-004').length,
      commonA1HomeEditorialReady: cards.filter((card) => card.reviewKey === 'common-a1-home-editorial-005').length,
      commonA1CityEditorialReady: cards.filter((card) => card.reviewKey === 'common-a1-city-editorial-006').length,
      commonA1FoodEditorialReady: cards.filter((card) => card.reviewKey === 'common-a1-food-editorial-007').length,
      commonA1VerbEditorialReady: cards.filter((card) => card.reviewKey === 'common-a1-verbs-editorial-008').length,
      commonA1DialogueEditorialReady: cards.filter((card) => card.reviewKey === 'common-a1-dialogue-editorial-009').length,
      commonA1ShoppingHealthEditorialReady: cards.filter((card) => card.reviewKey === 'common-a1-shopping-health-editorial-010').length,
      commonA1StudyWorkEditorialReady: cards.filter((card) => card.reviewKey === 'common-a1-study-work-editorial-011').length,
      commonA1ActionsTwoEditorialReady: cards.filter((card) => card.reviewKey === 'common-a1-actions-two-editorial-012').length,
      commonA1TravelEditorialReady: cards.filter((card) => card.reviewKey === 'common-a1-travel-editorial-013').length,
      commonA1EditorialReadyTotal: cards.filter((card) => card.reviewKey?.startsWith('common-a1-')).length,
    },
    coverage: {
      sources: { cards: cards.filter((card) => card.hasSource).length, percentage: percentage(cards.filter((card) => card.hasSource).length, cards.length) },
      examples: { cards: cards.filter((card) => card.hasExample).length, percentage: percentage(cards.filter((card) => card.hasExample).length, cards.length) },
      structuredLexicalMetadata: { cards: cards.filter((card) => card.hasStructuredLexicalMetadata).length, percentage: percentage(cards.filter((card) => card.hasStructuredLexicalMetadata).length, cards.length) },
      frameworkReferences: { cards: cards.filter((card) => card.hasFrameworkReference).length, percentage: percentage(cards.filter((card) => card.hasFrameworkReference).length, cards.length) },
      professionalReview: { cards: professionalReviewAudit.passedTargets.size, percentage: percentage(professionalReviewAudit.passedTargets.size, cards.length), staleRecords: professionalReviewAudit.staleRecords.length, issueTargets: professionalReviewAudit.issueRecords.length },
    },
    moduleRows,
    gates,
    blockers: gates.filter((item) => !item.passed),
    interpretation: [
      'npm run check proves engineering and catalog invariants, not formal linguistic publication readiness.',
      'Vida V1 content readiness means its current module, source, example and placement baselines pass; it does not mean professional review or paid entitlement exists.',
      'CEFR and PCIC do not provide an exhaustive official word-count denominator, so formalPublicationReady never means official DELE completeness.',
    ],
  }

  writeJson(jsonOutput, report)
  fs.mkdirSync(path.dirname(markdownOutput), { recursive: true })
  const statusLabel = (value) => value ? 'READY' : 'NOT READY'
  const markdown = `# Teclea / Vida 词库发布就绪审计（${sourceManifest.checkedAt}）

## 结论

| 层级 | 状态 | 含义 |
| --- | --- | --- |
| 目录结构 | **${statusLabel(catalogValid)}** | canonical 唯一性和训练目标长度等本报告结构门槛；完整工程检查仍以 \`npm run check\` 为准 |
| Vida V1 内容基线 | **${statusLabel(lifeV1ContentReady)}** | 四个生活模块的来源、例句、lemma/词类和 placement 边界达到当前 V1 约定，不包含专业批准与购买实现 |
| 正式词库发布 | **${statusLabel(formalPublicationReady)}** | 必须同时满足完整内容字段、当前卡具名专业复核和高级候选退出条件 |

因此，当前可以准确称为“工程有效、Vida V1 内容基线已形成的候选／编辑词库”，不能称为已经专业审校完毕或官方完整的正式考试词库。

## 发布门槛

${markdownTable(
    ['范围', '门槛', '当前', '要求', '结果'],
    gates.map((item) => [item.scope, item.label, item.actual, item.required, item.passed ? 'PASS' : 'BLOCKED']),
  )}

## Vida 四模块

${markdownTable(
    ['模块', '卡片', '来源', '例句', 'lemma/词类', '专业复核'],
    moduleRows.map((row) => [row.label, row.cards, `${row.sourceCoverage}%`, `${row.exampleCoverage}%`, `${row.structuredMetadataCoverage}%`, `${row.professionalReviewCoverage}%`]),
  )}

Vida 的生活内容基线通过，但 ${lifeCards.length} 项专业复核仍是 0%。\`access\` 仍只是内容元数据，不表示付费权益已经实现。

## 当前正式发布阻断项

${report.blockers.map((item) => `- **${item.label}**：当前 ${item.actual}，要求 ${item.required}。证据：\`${item.evidence}\`。`).join('\n')}

## 口径

- \`npm run check\` 继续用于工程、目录、路线和构建回归；它通过不等于语言内容正式发布就绪。
- \`npm run lexicon:release-readiness\` 生成本报告且正常退出，方便持续观察进度。
- \`npm run validate:lexicon-release\` 使用严格模式；任何正式门槛未满足都会以非零状态退出。当前预期失败，直到真实专业复核完成。
- CEFR / PCIC 没有穷尽式官方等级词数分母；即使所有项目门槛通过，也不能宣称“官方 DELE 词表 100% 完整”。
`
  fs.writeFileSync(markdownOutput, markdown)
  console.log(JSON.stringify({
    jsonOutput,
    markdownOutput,
    catalogValid,
    lifeV1ContentReady,
    formalPublicationReady,
    blockers: report.blockers.map((item) => item.id),
  }, null, 2))
  if (strict && !formalPublicationReady) process.exitCode = 1
} finally {
  await server.close()
}
