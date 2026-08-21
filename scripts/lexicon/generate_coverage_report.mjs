import fs from 'node:fs'
import path from 'node:path'
import { createServer } from 'vite'
import { LEVELS, KINDS, looksLikeInfinitive, normalizeTarget, parseArgs, percentage, readJson, readJsonLines, tokenCount, writeJson } from './lexicon-utils.mjs'

const args = parseArgs(process.argv.slice(2))
const jsonOutput = path.resolve(String(args.json ?? 'docs/lexicon/COVERAGE_REPORT.json'))
const markdownOutput = path.resolve(String(args.markdown ?? 'docs/lexicon/COVERAGE_REPORT.md'))
const candidatePath = path.resolve(String(args.candidates ?? 'artifacts/lexicon/wordfreq-es-top-6000.jsonl'))
const candidateAuditPath = path.resolve(String(args.audit ?? 'artifacts/lexicon/candidate-audit.json'))
const framework = readJson(path.resolve('data/lexicon/framework.json'))
const sourceManifest = readJson(path.resolve('data/lexicon/sources.json'))

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
    normalizedTarget: normalizeTarget(word.spanish),
    wordCount: tokenCount(word.spanish),
    characterCount: Array.from(normalizeTarget(word.spanish)).length,
    hasAccent: /[áéíóú]/u.test(word.spanish),
    hasEnye: /ñ/u.test(word.spanish),
    hasDiaeresis: /ü/u.test(word.spanish),
    hasExample: Boolean(word.example && word.exampleChinese),
    hasSource: Boolean(word.source?.name && word.source?.url && word.source?.license && word.source?.checkedAt),
    sourceName: word.source?.name ?? '未记录',
    isExplicitAdvancedCandidate: lesson.level === 'C1' || lesson.level === 'C2',
    isExpansionBatch: lesson.id.startsWith('expansion-'),
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

  let frequencySurfaceCoverage = null
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
  }
  const candidateAudit = fs.existsSync(candidateAuditPath) ? readJson(candidateAuditPath).summary : null

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
      cardsWithTraceableSource: cards.filter((card) => card.hasSource).length,
      cardsWithExamples: cards.filter((card) => card.hasExample).length,
      cardsWithStructuredLemma: cards.filter((card) => card.lemma && card.partOfSpeech).length,
      cardsWithFrameworkReference: cards.filter((card) => card.frameworkReference).length,
      cardsWithAuditableProfessionalReview: 0,
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
    candidateAudit,
    definitions: {
      card: 'One unique Spanish typing target; a fixed phrase counts as one card.',
      sourceCoverage: 'A card has name, URL, license and checked-at metadata. It does not prove professional linguistic review.',
      professionalReviewCoverage: 'Only review records with a named reviewer and review date count. Current catalog cards do not yet carry those fields.',
      pcicCoverage: 'Broad editorial category and level mapping against PCIC domains; not copied-entry coverage or official certification.',
    },
    sourceManifest: 'data/lexicon/sources.json',
  }

  writeJson(jsonOutput, report)
  fs.mkdirSync(path.dirname(markdownOutput), { recursive: true })
  const frequencySection = frequencySurfaceCoverage
    ? `## 词频表面命中率只是候选池诊断，不是 CEFR 覆盖率\n\n${frequencySurfaceCoverage.definition}\n\n${markdownTable(
      ['wordfreq 排名前 N', '有效单词 token', '当前词库精确命中', '表面命中率'],
      frequencySurfaceCoverage.tiers.map((row) => [row.rankLimit, row.validTokens, row.matchedCatalogTargets, `${row.coverage}%`]),
    )}\n\n该指标会低估 lemma 覆盖（例如屈折形式尚未归并），也会被功能词、专名和语料噪声影响。它只用于决定“下一批候选从哪里挑”，不能写成“已经掌握了多少 CEFR 词汇”。${candidateAudit ? ` 原始 ${candidateAudit.inputRows} 条候选中有 ${candidateAudit.alreadyInCatalog} 条已在目录；剩余候选必须补齐词形、框架映射和批次编辑字段才能进入生产目录，不能直接发布。` : ''}\n\n`
    : '## 词频候选池尚未生成，当前只能报告目录结构\n\n安装 `requirements-lexicon.txt` 并运行 `npm run lexicon:export-frequency` 后，本报告会增加 wordfreq 前 1,000 / 3,000 / 6,000 项的精确表面命中诊断。缺少这一输入不影响目录完整性检查。\n\n'

  const markdown = `# HolaDone 词库覆盖基线（${sourceManifest.checkedAt}）

## 技术摘要

当前运行目录包含 **${cards.length} 张卡、${targetCounts.size} 个不重复输入目标、${lessons.length} 个内部短轮次单元**。前十七批生产扩库已新增 **${cards.filter((card) => card.isExpansionBatch).length} 张**带 lemma、词性、词频排名和双语短例句的 A1–B2 卡片，但整个目录仍不能称为 A1–C2 完整词库。后续扩库继续使用同一字段和质量闸门。

**官方完整度不计算。** [CEFR](https://www.coe.int/en/web/common-european-framework-reference-languages/introduction-and-context) 是非规定性能力框架，[PCIC](https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/introduccion.htm) 是需要按教学场景调整的西语参考清单，两者都没有给出可作为分母的单一、穷尽式官方等级词数。报告只计算可复核的目录指标和词频候选池命中率。

## 等级分布用于教学导航，不代表官方完整度

${markdownTable(
    ['等级', '总卡片', '单词', '短语', '动词原形', '目录占比', '例句覆盖'],
    levelRows.map((row) => [row.level, row.total, row.words, row.phrases, row.infinitives, `${row.catalogShare}%`, `${row.exampleCoverage}%`]),
  )}

A1–B2 已形成首个广覆盖目录，其中 A2 为 ${levelRows.find((row) => row.level === 'A2').total} 项、B1 为 ${levelRows.find((row) => row.level === 'B1').total} 项、B2 为 ${levelRows.find((row) => row.level === 'B2').total} 项。C1–C2 的 ${report.headline.explicitAdvancedCandidates} 项仍明确标记为候选内容。各等级数字只描述当前教学编组，不能解读为官方 CEFR 完整度或考试词表覆盖率。

## 六个宽分类已覆盖浏览结构，但不能替代 PCIC 逐项映射

${markdownTable(
    ['宽分类', '所含细场景', '卡片', '已出现等级', '目录占比'],
    categoryRows.map((row) => [row.category, row.scenes, row.total, row.levelsPresent || '无', `${row.catalogShare}%`]),
  )}

六类是 HolaDone 的产品浏览层，不是 Instituto Cervantes 的官方栏目。每个新候选仍需保存具体 PCIC 清单链接或章节引用，才能说明为什么把它放进某个等级和领域。

${frequencySection}## 目录仍有明显的结构化元数据缺口

- 来源四要素（名称、URL、许可、核对日期）：${report.headline.cardsWithTraceableSource}/${cards.length}。
- 中西例句成对记录：${report.headline.cardsWithExamples}/${cards.length}。
- 结构化 lemma 与词性：${report.headline.cardsWithStructuredLemma}/${cards.length}（目前来自前十七批生产扩库）。
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
- 当前已生成前 6,000 频率候选并完成十七批生产扩库，另完成一轮 48 项新居民高任务价值补缺。2,200 项已经越过首个广覆盖规模里程碑，但不宣称官方完整；后续仍按明确的日常或框架缺口分批补充，不用低质量词形追求 3,000 的整数目标。

## 尚未解决的边界

- 当前内部编辑通过不等于具名语言专家复核，专业复核覆盖仍单独报告为 0。
- 用词暂以中性、跨地区可理解的西语为主；明显地域词需要在后续批次单独标注。
- CORPES 下载列表在再分发许可明确前只作查询和聚合统计依据，不随 GPL 项目提交原始列表。
`
  fs.writeFileSync(markdownOutput, markdown)
  console.log(JSON.stringify({ jsonOutput, markdownOutput, cards: cards.length, candidates: frequencySurfaceCoverage?.candidateRows ?? 0 }, null, 2))
} finally {
  await server.close()
}
