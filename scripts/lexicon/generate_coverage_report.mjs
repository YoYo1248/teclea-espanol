import fs from 'node:fs'
import path from 'node:path'
import { createServer } from 'vite'
import { LEVELS, KINDS, looksLikeInfinitive, normalizeTarget, parseArgs, percentage, readJson, readJsonLines, tokenCount, writeJson } from './lexicon-utils.mjs'
import { auditProfessionalReviews } from './professional-review-utils.mjs'

const args = parseArgs(process.argv.slice(2))
const jsonOutput = path.resolve(String(args.json ?? 'docs/lexicon/COVERAGE_REPORT.json'))
const markdownOutput = path.resolve(String(args.markdown ?? 'docs/lexicon/COVERAGE_REPORT.md'))
const candidatePath = path.resolve(String(args.candidates ?? 'artifacts/lexicon/wordfreq-es-top-6000.jsonl'))
const candidateAuditPath = path.resolve(String(args.audit ?? 'artifacts/lexicon/candidate-audit.json'))
const framework = readJson(path.resolve('data/lexicon/framework.json'))
const sourceManifest = readJson(path.resolve('data/lexicon/sources.json'))
const catalogPolicy = readJson(path.resolve('data/lexicon/catalog-policy.json'))
const previousReport = fs.existsSync(jsonOutput) ? readJson(jsonOutput) : null

function blankKindCounts() {
  return Object.fromEntries(KINDS.map((kind) => [kind, 0]))
}

function categoryForScene(scene) {
  return framework.categories.find((item) => item.scenes.includes(scene))?.label ?? '未映射'
}

function markdownTable(headers, rows) {
  const header = `| ${headers.join(' | ')} |`
  const divider = `| ${headers.map(() => '---').join(' | ')} |`
  return [header, divider, ...rows.map((row) => `| ${row.join(' | ')} |`)].join('\n')
}

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } })
try {
  const { lessons } = await server.ssrLoadModule('/src/data.ts')
  const cards = lessons.flatMap((lesson) => lesson.words.map((word) => ({
    lessonId: lesson.id,
    level: lesson.level,
    scene: lesson.scene,
    category: categoryForScene(lesson.scene),
    kind: lesson.kind,
    spanish: word.spanish,
    chinese: word.chinese,
    lemma: word.lemma ?? null,
    partOfSpeech: word.partOfSpeech ?? null,
    frequencyRank: word.frequencyRank ?? null,
    frameworkReference: word.frameworkReference ?? null,
    reviewKey: word.reviewKey ?? null,
    normalizedTarget: normalizeTarget(word.spanish),
    wordCount: tokenCount(word.spanish),
    characterCount: Array.from(normalizeTarget(word.spanish)).length,
    hasAccent: /[áéíóú]/u.test(word.spanish),
    hasEnye: /ñ/u.test(word.spanish),
    hasDiaeresis: /ü/u.test(word.spanish),
    hasExample: Boolean(word.example && word.exampleChinese),
    example: word.example ?? '',
    exampleChinese: word.exampleChinese ?? '',
    hasSource: Boolean(word.source?.name && word.source?.url && word.source?.license && word.source?.checkedAt),
    sourceName: word.source?.name ?? '未记录',
    routes: word.routes ?? ['exam'],
    lifeModule: word.lifeModule ?? null,
    lifeTier: word.lifeTier ?? null,
    access: word.access ?? null,
    lifePlacements: word.lifePlacements ?? (word.lifeModule && word.lifeTier && word.access
      ? [{ module: word.lifeModule, tier: word.lifeTier, access: word.access }]
      : []),
    isExplicitAdvancedCandidate: lesson.level === 'C1' || lesson.level === 'C2',
    isExpansionBatch: lesson.id.startsWith('expansion-'),
    isExamMobilityBatch: lesson.id.startsWith('exam-mobility-'),
    isExamTransactionFunctionBatch: lesson.id.startsWith('exam-b1-'),
    isExamStructuralBatch: lesson.id.startsWith('exam-') && !lesson.id.startsWith('exam-mobility-') && !lesson.id.startsWith('exam-b1-'),
  })))

  const targetCounts = new Map()
  cards.forEach((card) => targetCounts.set(card.normalizedTarget, (targetCounts.get(card.normalizedTarget) ?? 0) + 1))
  const duplicateTargets = [...targetCounts.entries()].filter(([, count]) => count > 1).map(([target, count]) => ({ target, count }))
  const levelRows = LEVELS.map((level) => {
    const subset = cards.filter((card) => card.level === level)
    const kinds = blankKindCounts()
    subset.forEach((card) => { kinds[card.kind] += 1 })
    return {
      level,
      total: subset.length,
      words: kinds.单词,
      phrases: kinds.短语,
      infinitives: kinds.动词原形,
      catalogShare: percentage(subset.length, cards.length),
      exampleCoverage: percentage(subset.filter((card) => card.hasExample).length, subset.length),
      structuredMetadataCoverage: percentage(subset.filter((card) => card.lemma && card.partOfSpeech).length, subset.length),
      frameworkReferenceCoverage: percentage(subset.filter((card) => card.frameworkReference).length, subset.length),
    }
  })
  const categoryRows = framework.categories.map((category) => {
    const subset = cards.filter((card) => card.category === category.label)
    return {
      category: category.label,
      scenes: category.scenes.join('、'),
      total: subset.length,
      levelsPresent: LEVELS.filter((level) => subset.some((card) => card.level === level)).join('、'),
      catalogShare: percentage(subset.length, cards.length),
    }
  })
  const sourceRows = [...new Set(cards.map((card) => card.sourceName))].sort().map((sourceName) => ({
    sourceName,
    cards: cards.filter((card) => card.sourceName === sourceName).length,
  }))
  const routeRows = ['exam', 'life'].map((route) => ({
    route,
    cards: cards.filter((card) => card.routes.includes(route)).length,
    exclusive: cards.filter((card) => card.routes.length === 1 && card.routes.includes(route)).length,
  }))
  const vidaSupermarketCards = cards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'supermarket'))
  const vidaNewSupermarketCards = vidaSupermarketCards.filter((card) => card.lessonId.startsWith('vida-'))
  const vidaSupermarketGapCards = vidaSupermarketCards.filter((card) => card.reviewKey === 'vida-supermarket-gap-editorial-004')
  const vidaMobilityCards = cards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'mobility'))
  const vidaSettlingCards = cards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'settling'))
  const vidaDailyCards = cards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'daily'))
  const examMobilityCards = cards.filter((card) => card.isExamMobilityBatch)
  const examStructuralCards = cards.filter((card) => card.isExamStructuralBatch)
  const examTransactionFunctionCards = cards.filter((card) => card.isExamTransactionFunctionBatch)
  const professionalReviewAudit = auditProfessionalReviews(cards)
  if (professionalReviewAudit.errors.length) throw new Error(`专业复核记录无效:\n${professionalReviewAudit.errors.join('\n')}`)
  const professionallyReviewedCards = cards.filter((card) => professionalReviewAudit.passedTargets.has(card.normalizedTarget))
  levelRows.forEach((row) => {
    const subset = cards.filter((card) => card.level === row.level)
    row.professionalReviewCoverage = percentage(subset.filter((card) => professionalReviewAudit.passedTargets.has(card.normalizedTarget)).length, subset.length)
  })

  let frequencySurfaceCoverage = previousReport?.frequencySurfaceCoverage ?? null
  let frequencyCoverageRecomputed = false
  if (fs.existsSync(candidatePath)) {
    const candidates = readJsonLines(candidatePath)
    const catalogSingleTargets = new Set(cards.filter((card) => card.wordCount === 1).map((card) => card.normalizedTarget))
    const validFrequencyRows = candidates.filter((candidate) => {
      const target = normalizeTarget(candidate.spanish)
      return tokenCount(target) === 1 && /^[a-záéíóúüñ]+$/u.test(target) && target.length > 1
    })
    const tiers = [1000, 3000, 6000].filter((limit) => candidates.some((candidate) => candidate.frequency?.rank <= limit))
    frequencySurfaceCoverage = {
      sourceId: 'wordfreq-es-3.1.1',
      candidateRows: candidates.length,
      definition: 'Exact normalized surface-form overlap between current single-word targets and valid wordfreq tokens. This is not lemma coverage or CEFR completeness.',
      tiers: tiers.map((limit) => {
        const tier = validFrequencyRows.filter((candidate) => candidate.frequency.rank <= limit)
        const matched = new Set(tier.map((candidate) => normalizeTarget(candidate.spanish)).filter((target) => catalogSingleTargets.has(target)))
        return {
          rankLimit: limit,
          validTokens: tier.length,
          matchedCatalogTargets: matched.size,
          coverage: percentage(matched.size, tier.length),
        }
      }),
    }
    frequencyCoverageRecomputed = true
  }
  const candidateAudit = fs.existsSync(candidateAuditPath) ? readJson(candidateAuditPath).summary : previousReport?.candidateAudit ?? null

  const report = {
    schemaVersion: 1,
    generatedAt: sourceManifest.checkedAt,
    scope: {
      catalogCards: cards.length,
      lessons: lessons.length,
      levels: LEVELS,
      denominator: 'Current application catalog after runtime lesson construction',
    },
    headline: {
      uniqueTargets: targetCounts.size,
      explicitAdvancedCandidates: cards.filter((card) => card.isExplicitAdvancedCandidate).length,
      advancedEditorialReadyCards: cards.filter((card) => card.isExplicitAdvancedCandidate && card.hasExample && card.lemma && card.partOfSpeech).length,
      advancedC1EditorialReadyCards: cards.filter((card) => card.reviewKey === 'advanced-c1-editorial-002').length,
      advancedC2EditorialReadyCards: cards.filter((card) => card.reviewKey === 'advanced-c2-editorial-003').length,
      commonA1EditorialReadyCards: cards.filter((card) => card.reviewKey === 'common-a1-connectors-editorial-001').length,
      commonA1TimeEditorialReadyCards: cards.filter((card) => card.reviewKey === 'common-a1-time-editorial-002').length,
      commonA1QuantityEditorialReadyCards: cards.filter((card) => card.reviewKey === 'common-a1-quantity-editorial-003').length,
      commonA1FamilyEditorialReadyCards: cards.filter((card) => card.reviewKey === 'common-a1-family-editorial-004').length,
      commonA1HomeEditorialReadyCards: cards.filter((card) => card.reviewKey === 'common-a1-home-editorial-005').length,
      commonA1CityEditorialReadyCards: cards.filter((card) => card.reviewKey === 'common-a1-city-editorial-006').length,
      commonA1FoodEditorialReadyCards: cards.filter((card) => card.reviewKey === 'common-a1-food-editorial-007').length,
      commonA1VerbEditorialReadyCards: cards.filter((card) => card.reviewKey === 'common-a1-verbs-editorial-008').length,
      commonA1DialogueEditorialReadyCards: cards.filter((card) => card.reviewKey === 'common-a1-dialogue-editorial-009').length,
      commonA1ShoppingHealthEditorialReadyCards: cards.filter((card) => card.reviewKey === 'common-a1-shopping-health-editorial-010').length,
      commonA1StudyWorkEditorialReadyCards: cards.filter((card) => card.reviewKey === 'common-a1-study-work-editorial-011').length,
      commonA1ActionsTwoEditorialReadyCards: cards.filter((card) => card.reviewKey === 'common-a1-actions-two-editorial-012').length,
      commonA1TravelEditorialReadyCards: cards.filter((card) => card.reviewKey === 'common-a1-travel-editorial-013').length,
      commonA1HealthRemainderEditorialReadyCards: cards.filter((card) => card.reviewKey === 'common-a1-health-remainder-editorial-014').length,
      commonA2PracticalEditorialReadyCards: cards.filter((card) => card.reviewKey === 'common-a2-practical-editorial-015').length,
      intermediateB1EditorialReadyCards: cards.filter((card) => card.reviewKey === 'intermediate-b1-editorial-001').length,
      intermediateB2EditorialReadyCards: cards.filter((card) => card.reviewKey === 'intermediate-b2-editorial-002').length,
      cardsWithTraceableSource: cards.filter((card) => card.hasSource).length,
      cardsWithExamples: cards.filter((card) => card.hasExample).length,
      cardsWithStructuredLemma: cards.filter((card) => card.lemma && card.partOfSpeech).length,
      cardsWithFrameworkReference: cards.filter((card) => card.frameworkReference).length,
      cardsWithAuditableProfessionalReview: professionallyReviewedCards.length,
      professionalReview: {
        files: professionalReviewAudit.files.length,
        records: professionalReviewAudit.records.length,
        currentRecords: professionalReviewAudit.currentRecords.length,
        staleRecords: professionalReviewAudit.staleRecords.length,
        effectiveTargets: professionalReviewAudit.effectiveRecords.length,
        passedTargets: professionalReviewAudit.passedTargets.size,
        issueTargets: professionalReviewAudit.issueRecords.length,
        passedByRoute: Object.fromEntries(['exam', 'life'].map((route) => [route, professionallyReviewedCards.filter((card) => card.routes.includes(route)).length])),
        passedByLevel: Object.fromEntries(LEVELS.map((level) => [level, professionallyReviewedCards.filter((card) => card.level === level).length])),
      },
      routeRows,
      vidaSupermarket: {
        cards: vidaSupermarketCards.length,
        newCards: vidaNewSupermarketCards.length,
        gapBatchCards: vidaSupermarketGapCards.length,
        reusedCards: vidaSupermarketCards.length - vidaNewSupermarketCards.length,
        free: vidaSupermarketCards.filter((card) => card.access === 'free').length,
        paid: vidaSupermarketCards.filter((card) => card.access === 'paid').length,
        sharedWithExam: vidaSupermarketCards.filter((card) => card.routes.includes('exam')).length,
        lifeOnly: vidaSupermarketCards.filter((card) => !card.routes.includes('exam')).length,
      },
      vidaMobility: {
        cards: vidaMobilityCards.length,
        reusedCards: vidaMobilityCards.length,
        free: vidaMobilityCards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'mobility' && placement.access === 'free')).length,
        paid: vidaMobilityCards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'mobility' && placement.access === 'paid')).length,
        l1: vidaMobilityCards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'mobility' && placement.tier === 'L1')).length,
        l2: vidaMobilityCards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'mobility' && placement.tier === 'L2')).length,
        l3: vidaMobilityCards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'mobility' && placement.tier === 'L3')).length,
        sharedWithExam: vidaMobilityCards.filter((card) => card.routes.includes('exam')).length,
      },
      vidaSettling: {
        cards: vidaSettlingCards.length,
        reusedCards: vidaSettlingCards.length,
        free: vidaSettlingCards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'settling' && placement.access === 'free')).length,
        paid: vidaSettlingCards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'settling' && placement.access === 'paid')).length,
        l1: vidaSettlingCards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'settling' && placement.tier === 'L1')).length,
        l2: vidaSettlingCards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'settling' && placement.tier === 'L2')).length,
        l3: vidaSettlingCards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'settling' && placement.tier === 'L3')).length,
        sharedWithExam: vidaSettlingCards.filter((card) => card.routes.includes('exam')).length,
        sharedWithMobility: vidaSettlingCards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'mobility')).length,
      },
      vidaDaily: {
        cards: vidaDailyCards.length,
        reusedCards: vidaDailyCards.length,
        rankedCards: vidaDailyCards.filter((card) => Number.isInteger(card.frequencyRank)).length,
        free: vidaDailyCards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'daily' && placement.access === 'free')).length,
        paid: vidaDailyCards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'daily' && placement.access === 'paid')).length,
        l1: vidaDailyCards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'daily' && placement.tier === 'L1')).length,
        l2: vidaDailyCards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'daily' && placement.tier === 'L2')).length,
        l3: vidaDailyCards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'daily' && placement.tier === 'L3')).length,
        sharedWithExam: vidaDailyCards.filter((card) => card.routes.includes('exam')).length,
        sharedWithOtherLifeModules: vidaDailyCards.filter((card) => card.lifePlacements.some((placement) => placement.module !== 'daily')).length,
      },
      examMobilityBatch: {
        cards: examMobilityCards.length,
        a2: examMobilityCards.filter((card) => card.level === 'A2').length,
        b1: examMobilityCards.filter((card) => card.level === 'B1').length,
        b2: examMobilityCards.filter((card) => card.level === 'B2').length,
      },
      examStructuralBatch: {
        cards: examStructuralCards.length,
        a2: examStructuralCards.filter((card) => card.level === 'A2').length,
        b1: examStructuralCards.filter((card) => card.level === 'B1').length,
        b2: examStructuralCards.filter((card) => card.level === 'B2').length,
        sharedWithLife: examStructuralCards.filter((card) => card.routes.includes('life')).length,
        sharedWithSettling: examStructuralCards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'settling')).length,
        sharedWithDaily: examStructuralCards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'daily')).length,
        examOnly: examStructuralCards.filter((card) => !card.routes.includes('life')).length,
      },
      examTransactionFunctionBatch: {
        cards: examTransactionFunctionCards.length,
        b1: examTransactionFunctionCards.filter((card) => card.level === 'B1').length,
        transactionCards: examTransactionFunctionCards.filter((card) => card.lessonId.startsWith('exam-b1-transactions-')).length,
        functionCards: examTransactionFunctionCards.filter((card) => card.lessonId.startsWith('exam-b1-functions-')).length,
        sharedWithSupermarket: examTransactionFunctionCards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'supermarket')).length,
        sharedWithSettling: examTransactionFunctionCards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'settling')).length,
        sharedWithDaily: examTransactionFunctionCards.filter((card) => card.lifePlacements.some((placement) => placement.module === 'daily')).length,
        examOnly: examTransactionFunctionCards.filter((card) => !card.routes.includes('life')).length,
      },
      officialCompleteness: null,
      officialCompletenessReason: 'CEFR and PCIC do not publish one exhaustive official word-count denominator for each level.',
    },
    levelRows,
    categoryRows,
    sourceRows,
    orthography: {
      targetsWithWrittenAccent: cards.filter((card) => card.hasAccent).length,
      targetsWithEnye: cards.filter((card) => card.hasEnye).length,
      targetsWithDiaeresis: cards.filter((card) => card.hasDiaeresis).length,
    },
    integrity: {
      duplicateTargets,
      targetsOverThreeWords: cards.filter((card) => card.wordCount > 3).map((card) => card.spanish),
      isolatedInfinitivesOutsideVerbTrack: cards.filter((card) => card.kind !== '动词原形' && (card.partOfSpeech ? card.partOfSpeech === 'verb' : looksLikeInfinitive(card.spanish))).map((card) => card.spanish),
      nonNfcTargets: cards.filter((card) => card.spanish !== card.spanish.normalize('NFC')).map((card) => card.spanish),
    },
    frequencySurfaceCoverage,
    frequencyCoverageRecomputed,
    candidateAudit,
    definitions: {
      card: 'One unique Spanish typing target; a fixed phrase counts as one card.',
      sourceCoverage: 'A card has name, URL, license and checked-at metadata. It does not prove professional linguistic review.',
      professionalReviewCoverage: 'A target counts only when its latest review for the current content digest has decision=pass plus a named reviewer, role and ISO review date. Stale reviews remain historical records but do not count.',
      pcicCoverage: 'Broad editorial category and level mapping against PCIC domains; not copied-entry coverage or official certification.',
    },
    sourceManifest: 'data/lexicon/sources.json',
  }

  writeJson(jsonOutput, report)
  fs.mkdirSync(path.dirname(markdownOutput), { recursive: true })
  const frequencySection = frequencySurfaceCoverage
    ? `## 词频表面命中率只是候选池诊断，不是 CEFR 覆盖率\n\n${frequencySurfaceCoverage.definition}${frequencyCoverageRecomputed ? '' : ' 本次工作区缺少可重建的 wordfreq 候选文件，以下命中数沿用上一份汇总，未把最新 Vida 与考试路线补缺批次计入；目录数量与完整性指标仍按当前代码实时生成。'}\n\n${markdownTable(
      ['wordfreq 排名前 N', '有效单词 token', '当前词库精确命中', '表面命中率'],
      frequencySurfaceCoverage.tiers.map((row) => [row.rankLimit, row.validTokens, row.matchedCatalogTargets, `${row.coverage}%`]),
    )}\n\n该指标会低估 lemma 覆盖（例如屈折形式尚未归并），也会被功能词、专名和语料噪声影响。它只用于决定“下一批候选从哪里挑”，不能写成“已经掌握了多少 CEFR 词汇”。${candidateAudit ? ` 原始 ${candidateAudit.inputRows} 条候选中有 ${candidateAudit.alreadyInCatalog} 条已在目录；剩余候选必须补齐词形、框架映射和批次编辑字段才能进入生产目录，不能直接发布。` : ''}\n\n`
    : '## 词频候选池尚未生成，当前只能报告目录结构\n\n安装 `requirements-lexicon.txt` 并运行 `npm run lexicon:export-frequency` 后，本报告会增加 wordfreq 前 1,000 / 3,000 / 6,000 项的精确表面命中诊断。缺少这一输入不影响目录完整性检查。\n\n'

  const markdown = `# Teclea Español 词库覆盖基线（${sourceManifest.checkedAt}）

## 技术摘要

当前运行目录包含 **${cards.length} 张卡、${targetCounts.size} 个不重复输入目标、${lessons.length} 个内部短轮次单元**。前十七批生产扩库已新增 **${cards.filter((card) => card.isExpansionBatch).length} 张**带 lemma、词性、词频排名和双语短例句的 A1–B2 卡片；Vida 超市 V1 由 **${vidaNewSupermarketCards.length} 张新增卡和 ${vidaSupermarketCards.length - vidaNewSupermarketCards.length} 张既有卡复用**组成，其中最新 **${vidaSupermarketGapCards.length} 张**按明确的华人采购、调味食材和日用品缺口补入；Vida 城市出行、在西班牙安顿与高频日常 V1 又分别复用 **${vidaMobilityCards.length}、${vidaSettlingCards.length} 和 ${vidaDailyCards.length} 张**已有卡；考试路线三轮定向补缺共新增 **${examMobilityCards.length + examStructuralCards.length + examTransactionFunctionCards.length} 张**。既有目录编辑补缺现已覆盖 A1 收尾 **${report.headline.commonA1HealthRemainderEditorialReadyCards} 张**、A2 **${report.headline.commonA2PracticalEditorialReadyCards} 张**、B1 **${report.headline.intermediateB1EditorialReadyCards} 张**、B2 **${report.headline.intermediateB2EditorialReadyCards} 张**，以及 C1 **${report.headline.advancedC1EditorialReadyCards + cards.filter((card) => card.level === 'C1' && card.reviewKey === 'advanced-editorial-batch-001').length} 张**和 C2 **${report.headline.advancedC2EditorialReadyCards + cards.filter((card) => card.level === 'C2' && card.reviewKey === 'advanced-editorial-batch-001').length} 张**；全目录结构化字段和双语例句均已补齐，但仍需具名专业复核。${catalogPolicy.expectedLegacyPracticeCardRedirects} 张历史带冠词场景卡已合并回裸词形 canonical 卡，并保留显式学习证据重定向。整个目录仍不能称为官方完整或专业审校完成的 A1–C2 词库。

**官方完整度不计算。** [CEFR](https://www.coe.int/en/web/common-european-framework-reference-languages/introduction-and-context) 是非规定性能力框架，[PCIC](https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/introduccion.htm) 是需要按教学场景调整的西语参考清单，两者都没有给出可作为分母的单一、穷尽式官方等级词数。报告只计算可复核的目录指标和词频候选池命中率。

## 等级分布用于教学导航，不代表官方完整度

${markdownTable(
    ['等级', '总卡片', '单词', '短语', '动词原形', '目录占比', '例句', 'lemma/词类', '框架引用', '专业复核'],
    levelRows.map((row) => [row.level, row.total, row.words, row.phrases, row.infinitives, `${row.catalogShare}%`, `${row.exampleCoverage}%`, `${row.structuredMetadataCoverage}%`, `${row.frameworkReferenceCoverage}%`, `${row.professionalReviewCoverage}%`]),
  )}

A1–B2 已形成首个广覆盖目录，其中 A2 为 ${levelRows.find((row) => row.level === 'A2').total} 项、B1 为 ${levelRows.find((row) => row.level === 'B1').total} 项、B2 为 ${levelRows.find((row) => row.level === 'B2').total} 项。C1–C2 的 ${report.headline.explicitAdvancedCandidates} 项仍明确标记为候选内容。各等级数字只描述当前教学编组，不能解读为官方 CEFR 完整度或考试词表覆盖率。

## 一份 canonical 目录生成两条词库路线

${markdownTable(
    ['路线', '卡片', '仅该路线'],
    routeRows.map((row) => [row.route, row.cards, row.exclusive]),
  )}

Vida 超市模块现有 ${report.headline.vidaSupermarket.cards} 项：新增 ${report.headline.vidaSupermarket.newCards} 项（其中第四批明确缺口 ${report.headline.vidaSupermarket.gapBatchCards} 项）、复用既有卡 ${report.headline.vidaSupermarket.reusedCards} 项；免费体验 ${report.headline.vidaSupermarket.free} 项、标记为未来付费内容 ${report.headline.vidaSupermarket.paid} 项。其中 ${report.headline.vidaSupermarket.sharedWithExam} 项同时进入考试编辑路线，${report.headline.vidaSupermarket.lifeOnly} 项只进入生活路线。路线视图共享同一学习项和掌握证据，路线数量不能相加为不重复词量；付费标签也不表示购买功能已经上线。

Vida 城市出行 V1 现有 ${report.headline.vidaMobility.cards} 项，全部复用既有 canonical 卡：免费体验 ${report.headline.vidaMobility.free} 项、标记为未来付费内容 ${report.headline.vidaMobility.paid} 项；L1 ${report.headline.vidaMobility.l1} 项、L2 ${report.headline.vidaMobility.l2} 项、L3 ${report.headline.vidaMobility.l3} 项。全部 ${report.headline.vidaMobility.sharedWithExam} 项同时属于考试路线，因此从任一路线取得的有效学习证据都指向同一卡片，不增加目录总词数。

Vida 在西班牙安顿 V1 现有 ${report.headline.vidaSettling.cards} 项，也全部复用已有 canonical 卡：免费体验 ${report.headline.vidaSettling.free} 项、标记为未来付费内容 ${report.headline.vidaSettling.paid} 项；L1 ${report.headline.vidaSettling.l1} 项、L2 ${report.headline.vidaSettling.l2} 项、L3 ${report.headline.vidaSettling.l3} 项。全部 ${report.headline.vidaSettling.sharedWithExam} 项属于考试路线，其中 ${report.headline.vidaSettling.sharedWithMobility} 项同时属于城市出行模块；多模块 placement 不复制卡片或学习证据。

Vida 高频日常 V1 现有 ${report.headline.vidaDaily.cards} 项，全部复用已有 canonical 卡，其中 ${report.headline.vidaDaily.rankedCards} 项保存 wordfreq 排名，另外 ${report.headline.vidaDaily.cards - report.headline.vidaDaily.rankedCards} 项覆盖问候、作息、基础与 B1 功能表达，以及 A1 人物家庭、家居、点餐需求、核心动词、基础对话和健康补缺。免费体验 ${report.headline.vidaDaily.free} 项、标记为未来付费内容 ${report.headline.vidaDaily.paid} 项；L1 ${report.headline.vidaDaily.l1} 项、L2 ${report.headline.vidaDaily.l2} 项、L3 ${report.headline.vidaDaily.l3} 项。全部 ${report.headline.vidaDaily.sharedWithExam} 项属于考试路线，${report.headline.vidaDaily.sharedWithOtherLifeModules} 项同时属于其他 Vida 模块。

考试路线首个结构补缺批次有 ${report.headline.examMobilityBatch.cards} 项：A2 ${report.headline.examMobilityBatch.a2} 项、B1 ${report.headline.examMobilityBatch.b1} 项、B2 ${report.headline.examMobilityBatch.b2} 项。它补的是现有目录的出行与交通薄弱区，现已全部通过 placement 复用到 Vida 城市出行模块；这不是任何考试机构发布的逐词清单。审计依据与剩余缺口见 [EXAM_ROUTE_AUDIT.md](EXAM_ROUTE_AUDIT.md)。

第二个结构补缺批次有 ${report.headline.examStructuralBatch.cards} 项：A2 ${report.headline.examStructuralBatch.a2} 项、B1 ${report.headline.examStructuralBatch.b1} 项、B2 ${report.headline.examStructuralBatch.b2} 项，覆盖功能表达、住房、消费者事务和医疗服务。其中 ${report.headline.examStructuralBatch.sharedWithSettling} 项住房、消费和医疗卡复用到 Vida 安顿模块，${report.headline.examStructuralBatch.sharedWithDaily} 项 A2 基础功能表达复用到 Vida 高频日常模块；合计 ${report.headline.examStructuralBatch.sharedWithLife} 项进入生活路线，剩余 ${report.headline.examStructuralBatch.examOnly} 项功能表达仍只进入考试路线。

第三轮定向补缺新增 ${report.headline.examTransactionFunctionBatch.cards} 张 B1 卡：${report.headline.examTransactionFunctionBatch.sharedWithSupermarket} 张退换、价格与付款表达复用到 Vida 超市 L3，${report.headline.examTransactionFunctionBatch.sharedWithSettling} 张基础银行操作复用到 Vida 安顿 L3，${report.headline.examTransactionFunctionBatch.sharedWithDaily} 张礼貌询问、确认、评价与立场表达复用到 Vida 高频日常 L2；仅考试路线 ${report.headline.examTransactionFunctionBatch.examOnly} 张。三轮补缺都是基于框架能力要求与当前目录缺口的项目编辑，不是官方 DELE 逐词表。

## 六个宽分类已覆盖浏览结构，但不能替代 PCIC 逐项映射

${markdownTable(
    ['宽分类', '所含细场景', '卡片', '已出现等级', '目录占比'],
    categoryRows.map((row) => [row.category, row.scenes, row.total, row.levelsPresent || '无', `${row.catalogShare}%`]),
  )}

六类是 Teclea 的产品浏览层，不是 Instituto Cervantes 的官方栏目。每个新候选仍需保存具体 PCIC 清单链接或章节引用，才能说明为什么把它放进某个等级和领域。

${frequencySection}## 目录编辑字段已齐备，专业复核仍是正式发布门槛

- 来源四要素（名称、URL、许可、核对日期）：${report.headline.cardsWithTraceableSource}/${cards.length}。
- 中西例句成对记录：${report.headline.cardsWithExamples}/${cards.length}。
- 结构化 lemma 与词类：${report.headline.cardsWithStructuredLemma}/${cards.length}（全目录已覆盖；固定短语使用 \`fixed-expression\`，动词专项使用原形 lemma，无法安全推断的旧单词以逐条编辑元数据补齐，不凭词形猜测词性）。
- 明确 PCIC 等级清单参考：${report.headline.cardsWithFrameworkReference}/${cards.length}（是批次级编辑映射，不是逐条官方认证）。
- 带姓名和日期的专业复核记录：${report.headline.cardsWithAuditableProfessionalReview}/${cards.length}。
- 跨课程重复输入目标：${duplicateTargets.length}；超过 3 个词的目标：${report.integrity.targetsOverThreeWords.length}。

“有来源”只表示能追踪当前选择依据，不等于词义、等级和例句已经获得官方认证或专业审校。生产批次必须补全 lemma、词性、等级映射、中文释义与例句，并通过自动完整性检查；具名语言专家复核仍作为后续单独标记，不能由内部编辑冒充。

## 扩库管线以批次编辑和自动质量闸门为主

1. [wordfreq](https://github.com/rspeer/wordfreq) 生成带 rank、Zipf 值和来源 ID 的候选 JSONL；该频率快照约截至 2021 年。
2. [Kaikki / English Wiktionary](https://kaikki.org/dictionary/Spanish/index.html) 核验拼写、重音、词性、lemma 和屈折关系。
3. [PCIC](https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/introduccion.htm) 只用于等级、交际功能和概念领域映射，不批量复制其词条。
4. 自动规则拒绝重复目标、超过 3 个词、无 lemma、词频排名不一致、动词屈折形式冒充基础词以及缺少中文释义或例句的生产批次。
5. 批次通过检查后进入本地课程；用户只需抽看批次统计、样本和异常，不需要逐词批准。\`stage_approved_candidates.mjs\` 另行保留给需要具名外部复核记录的批次。

## 限制、稳健性与下一步

- [RAE CORPES XXI 1.5](https://www.rae.es/corpes/)（2026 年 6 月）可用于当代真实用法校验，但在再分发条款未明确前，管线不会提交其原始下载列表。
- [wordfreq](https://github.com/rspeer/wordfreq) 提供可复算频率，但数据快照约截至 2021 年；高频不等于教学价值。
- 精确表面命中不是 lemma 命中。只有接入 Kaikki 的 lemma 映射后，才能识别“同一动词不同变位”并计算更可靠的候选去重率。
- 当前已完成十七批词频生产扩库、一轮 48 项新居民高任务价值补缺、Vida 超市 ${vidaSupermarketCards.length} 项 V1、Vida 城市出行 ${vidaMobilityCards.length} 项 V1、Vida 在西班牙安顿 ${vidaSettlingCards.length} 项 V1、Vida 高频日常 ${vidaDailyCards.length} 项 V1，以及 ${examMobilityCards.length + examStructuralCards.length + examTransactionFunctionCards.length} 项考试路线定向补缺。${cards.length} 项已经越过首个广覆盖规模里程碑，但不宣称官方完整；后续仍按明确的生活任务或框架缺口分批补充，不用低质量词形追求整数目标。

## 尚未解决的边界

- 当前内部编辑通过不等于具名语言专家复核；专业复核覆盖由当前内容摘要仍匹配、且结论为 pass 的具名记录单独计算。现有通过项为 ${report.headline.cardsWithAuditableProfessionalReview}，过期历史记录为 ${report.headline.professionalReview.staleRecords}，待修订或拒绝项为 ${report.headline.professionalReview.issueTargets}。
- 用词暂以中性、跨地区可理解的西语为主；明显地域词需要在后续批次单独标注。
- CORPES 下载列表在再分发许可明确前只作查询和聚合统计依据，不随 GPL 项目提交原始列表。
`
  fs.writeFileSync(markdownOutput, markdown)
  console.log(JSON.stringify({
    jsonOutput,
    markdownOutput,
    cards: cards.length,
    frequencyCandidatesRecomputed: frequencyCoverageRecomputed ? frequencySurfaceCoverage?.candidateRows ?? 0 : 0,
  }, null, 2))
} finally {
  await server.close()
}
