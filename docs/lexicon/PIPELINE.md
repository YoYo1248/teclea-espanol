# HolaDone 可审计扩库管线

## 目标与边界

这条管线把“官方框架”和“真实词频”分工处理：

- CEFR 只提供 A1–C2 能力框架，不是官方词表；
- Instituto Cervantes PCIC 提供西语的等级、交际功能和概念领域参考，但不能原样当课程导入；
- RAE CORPES XXI 用于核对当代真实使用，不在许可未明确时再分发原始列表；
- wordfreq 生成可复算的频率候选，数据快照约截至 2021 年；
- Kaikki / English Wiktionary 核对重音、词性、lemma 和屈折关系；
- 中文释义、例句、宽分类与最终等级仍是 HolaDone 的教学编辑结果，必须保留复核记录。
- canonical 学习项只保存一次，再以 `life` 与 `exam` 路线标签生成不同产品视图；路线标签不复制卡片或掌握证据。
- 学习卡身份固定为 canonical `lessonId::normalizedTarget`；`reviewKey` 只标识编辑／专业复核批次，不能作为用户进度 ID。动态轮次通过临时 `practiceId` 继续指向原 canonical 卡。

来源的版本、用途、许可和禁止事项统一保存在 [`data/lexicon/sources.json`](../../data/lexicon/sources.json)。

## 数据流

```text
wordfreq 候选
    ↓ 频率 rank / Zipf + 来源 ID
自动预检
    ↓ 去掉已收录、重复、超长和不支持字符
Kaikki 词形核验
    ↓ lemma / 词性 / 原形 / 重音 / entry URL
PCIC 编辑映射
    ↓ 等级候选 / 宽分类 / 细场景 / 具体清单引用
路线编辑
    ↓ exam / life；生活模块、L1–L3 与免费／付费边界
中文教学编辑
    ↓ 释义 / 西语例句 / 中文例句
批次编辑与抽检
    ↓ reviewer / reviewedAt / approved（不要求产品用户逐词签字）
零阻断暂存
    ↓ approved-decks.json（仍不自动进入应用）
批量目录验证与抽样检查
```

## 运行方式

wordfreq 是离线扩库工具，不是 Web 应用依赖：

```bash
python3 -m venv .venv-lexicon
.venv-lexicon/bin/pip install -r requirements-lexicon.txt
.venv-lexicon/bin/python scripts/lexicon/export_wordfreq_candidates.py \
  --limit 6000 \
  --output artifacts/lexicon/wordfreq-es-top-6000.jsonl
```

审计原始候选：

```bash
npm run lexicon:audit
npm run lexicon:prepare-review
```

原始 wordfreq 行会正常全部处于阻断状态，因为它们还没有 lemma、词性、PCIC 映射、中文教学内容和复核记录。审计的作用是把阻断原因量化，而不是假装频率表已经能发布。

`lexicon:prepare-review` 只从已排除目录重复、重复候选和明显字符噪声的项目中提取前 300 条审阅队列。它仍然不是 A2–B2 正式列表；等级要在 Kaikki 词形核验与 PCIC 编辑映射之后才能确定。

完成编辑后，把记录保存到 `artifacts/lexicon/reviewed-candidates.jsonl`，再运行：

```bash
npm run lexicon:stage
```

只有以下条件全部满足才会输出：

- `lexical.status` 为 `verified`；
- lemma 与词性已记录；
- 动词目标必须是原形并进入“动词原形”专项；
- PCIC 等级、宽分类、细场景和具体引用已记录；
- 中文释义和中西例句齐全；
- `editorial.status` 为 `approved`，并有 `reviewedBy` 与 `reviewedAt`；
- 与当前目录和同批候选不重复；
- 训练目标不超过 3 个词。

候选可以另外记录 `routeCandidates`。进入 `life` 的项目使用 `lifeCandidates[]` 分别记录每个模块的 `module`、`tier` 和 `access`；旧的单值 `lifeCandidate` 暂留作兼容，但新候选不得用它表达多个模块。进入 `exam` 仍必须保留等级与 PCIC 映射。详见 [`ROUTES.md`](ROUTES.md)。

`approved-decks.json` 仍是待合并中间产物。把它合并进 `src/data.ts`、`src/commonWords.ts`、`src/intermediateWords.ts` 或 `src/advancedWords.ts` 时执行批量目录验证和抽样检查；不要求产品用户逐词批准。

对已经进入 canonical 目录的内容，运行 `npm run lexicon:prepare-professional-review` 会生成 72 项跨路线、等级和生活模块的空白专业复核样本。填写后用 `npm run lexicon:import-professional-review -- --input <completed.csv>` 严格校验并暂存；确认过的不可变 JSONL 批次才进入 `data/lexicon/professional-reviews/`。覆盖报告只统计内容摘要仍匹配、当前有效结论为 `pass` 的具名记录；旧审核不会在卡片修改后被静默继承。填写规范和证据边界见 [`PROFESSIONAL_REVIEW.md`](PROFESSIONAL_REVIEW.md)。

## 批次批准责任

- 词典与框架证据由管线记录，明显噪声、变位、专名和重复项自动拒绝。
- 中文释义、例句和等级按批次编辑，并对高歧义、地区性或来源冲突项单独挂起。
- 产品用户只看批次统计、随机样本和异常项；不会收到逐词审批任务。
- `approved` 表示通过 HolaDone 当前编辑与自动规则，不表示 Instituto Cervantes、RAE 或专业考试机构认证。

## 去重原则

- 精确输入目标在整个应用目录只能出现一次；
- 名词冠词保存在 `article` 元数据，不把 `el / la / un / una + 裸词形` 建成第二张语义卡；历史重复卡必须保留显式 ID 重定向，先迁移学习证据再移除目录项；
- 同一个目标属于两条路线时使用两个路线标签，不生成两个课程副本；
- 同一 lemma 在候选池中重复会警告，便于选一个最合适的教学目标；
- 单独的动词屈折形式不能作为基础词卡，必须还原为原形；
- 固定短语作为整体保存，最多 3 个词；
- 同一 lemma 每轮最多一次仍由练习抽取逻辑保证。

## 覆盖口径

运行 `npm run lexicon:coverage` 会生成 Markdown 与 JSON 两份同源报告。主要指标是：

- 运行目录卡片数与不重复输入目标；
- 按等级、类型、宽分类分布；
- 来源元数据、例句、lemma 和专业复核记录覆盖；
- 与 wordfreq 前 1,000 / 3,000 / 6,000 token 的精确表面命中；
- 重复、长短语、错误动词轨道和 Unicode NFC 完整性。

“精确表面命中”不等于 lemma 覆盖，也不等于 CEFR 完整度。CEFR 和 PCIC 没有提供单一穷尽词数分母，因此报告禁止输出虚假的“官方覆盖百分比”。

## 工程通过与正式发布不是同一个状态

`npm run check` 验证代码构建、目录不变量、路线基线和复核记录格式，但不会因为真实专业复核仍为 0 而阻止日常开发。`npm run lexicon:release-readiness` 单独生成 [`RELEASE_READINESS.md`](RELEASE_READINESS.md)，明确区分：

- 目录结构是否有效；
- Vida V1 内容基线是否形成；
- 语言内容是否达到正式发布门槛。

需要把第三项作为 CI 或发布闸门时运行 `npm run validate:lexicon-release`。该严格命令在任一正式门槛未满足时返回非零；当前预期失败，不能把普通工程检查通过写成“词库已经专业审校完成”。

## 当前批次节奏

按每批约 60–100 项连续处理 A2–B2，而不是一次发布数千项或要求产品用户逐词审批；批量大小是可审查节奏，不是产品承诺：

1. 先补 wordfreq 高频但当前未收录、且可明确映射到 PCIC 的实用词；
2. 优先填补当前数量明显偏薄的 A2；
3. 再补 B1/B2 的生活、学习、工作、行政和抽象表达；
4. C1/C2 在现有 200 项完成专业复核前，不继续追求数量。
