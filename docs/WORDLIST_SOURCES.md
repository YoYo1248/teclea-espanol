# 词库来源与制作说明

## 当前版本的真实状态（2026-08-20）

当前共有 2,200 张 A1–C2 练习卡：

- 48 张场景单词与短语卡；
- 300 张 A1–A2 高频基础词与短表达卡；
- 200 张 B1–B2 常用词与短语卡（B1、B2 各 100 张）。
- 200 张 C1–C2 候选高级词与短语卡（C1、C2 各 100 张，仍待专业复核）。
- 48 张面向西班牙新居民的高任务价值补缺卡，依据住房、教育、就业、居留和银行官方页面核对任务用语；
- 1,404 张前十七个生产扩库批次卡（A1 +140、A2 +398、B1 +458、B2 +408）。

按当前训练类型统计为 1,971 张单词、124 张短语和 105 张常用动词原形。A1–C2 所有孤立的原形目标都进入动词专项；词库校验同时拒绝跨课程同形重复。原先从 20 个动词展开的 340 张人称/时态词形已从课程和错题来源中移除：它们会虚增词量，也缺少判断时态所必需的语境。原始数据与生成脚本仍保留，未来只用于“短语境提示 + 输入一个目标变位词”的独立模块。

当前等级主线数量为：A1 词汇与短语 389 张 + 动词原形 33 张；A2 主线 457 + 动词 7；B1 主线 562 + 动词 28；B2 主线 507 + 动词 17；C1 主线 90 + 动词 10；C2 主线 90 + 动词 10。底层轮次仅用于保存进度、练习节奏和间隔练习；产品层级保持为等级、少量宽分类，用户无需先选一个轮次。

逐字输入目标只保留单词或不超过 3 个词的短语。此前 72 张句子长度的生活/驾考卡不再进入应用课程目录；例句可以作为理解上下文，但不作为需要完整敲写的目标。

这些内容：

- 高频教学顺序参考 wordfreq 的西语频率数据；
- 西语词形、重音、冠词与动词原形以 Kaikki 的 English Wiktionary 结构化西语数据核对；
- 中文释义和例句由本项目自行编写，不复制商业词典或教材；
- A1–C2 的主题、词汇和交际功能边界参考 Instituto Cervantes《Plan curricular》对应等级的清单，并结合词频、使用价值和逐字输入适配性重新编组；具体选词、中文释义和卡片标签仍是项目教学编辑判断，不是官方认证；
- 尚未经过西语教师或专业语言编辑逐条审核，因此仍是候选学习词库。

### 分级框架

课程主题与 A1–C2 边界参考 Instituto Cervantes《Plan curricular》的“Nociones específicas”“Nociones generales”和“Funciones”清单。该框架包含单词、搭配和多词词汇单位，不等于一张可以机械套用到所有学习者的官方逐词表。

- A1–A2 具体概念清单：https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_a1-a2.htm
- A1–A2 一般概念清单：https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/08_nociones_generales_inventario_a1-a2.htm
- A1–A2 交际功能清单：https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/05_funciones_inventario_a1-a2.htm
- B1–B2 具体概念清单：https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_b1-b2.htm
- B1–B2 一般概念清单：https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/08_nociones_generales_inventario_b1-b2.htm
- B1–B2 交际功能清单：https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/05_funciones_inventario_b1-b2.htm
- C1–C2 具体概念清单：https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_c1-c2.htm
- C1–C2 一般概念清单：https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/08_nociones_generales_inventario_c1-c2.htm
- C1–C2 交际功能清单：https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/05_funciones_inventario_c1-c2.htm

新增 B1–B2 词库按“高使用价值 + 覆盖官方主题和交际功能 + 适合逐字输入”筛选：工作与项目、租房与行政、健康、教育、信息技术、社会议题、环境以及论证衔接等。每个等级仍是 100 张；经过原形抽取后再分成适合连续输入的短轮次。它不是从 PCIC 大段复制的内容，也不宣称覆盖考试全部词汇。

新增 C1–C2 候选词库沿用相同边界，每个等级 100 张，其中 90 张词汇或不超过 3 个词的固定搭配、10 张动词原形。C1 优先论证、研究、组织、社会治理、媒体和环境；C2 增加精确语气、制度法律、信息操控、市场结构、城市规划和文化评论。它不是官方 DELE 词表，且在专业复核前只应视为项目候选内容。

## 已采用的开放来源

### 1. 高频顺序

使用 wordfreq 的西语词频数据帮助决定常见词的教学优先级。程序代码使用 Apache-2.0；可再分发的频率数据使用 CC BY-SA 4.0。完整语料来源和 SUBTLEX 等署名要求见 wordfreq 的 `CREDITS.md`。

词频并不等于教学价值：专名、单字母、粗俗词、新闻政治词和歧义严重的屈折形式不会因为频率高就自动进入课程；所有生产卡仍由项目按批编辑筛选，2,000–3,000 只作为日常覆盖规模参考，不是硬性凑数目标。

### 2. 词形、词性和发音信息

使用 Wiktionary 的结构化提取数据（Wiktextract / Kaikki），并在每个词条中保留来源、核对日期和许可字段。

用途：

- 校验西语拼写与重音；
- 区分词性；
- 获取名词性别和动词原形；
- 筛选可用的发音文件。

仓库仍保留 `scripts/generate_conjugations.py` 和生成结果，作为未来语境化变位模块的资料来源。当前应用不导入这份生成结果，也不把任何人称/时态形式算作独立词汇卡。

### 3. 未来可选的西语例句及中西翻译配对

如果未来导入 Tatoeba，其下载文本默认以 CC BY 2.0 FR 发布，必须逐句保留作者和句子 ID，不能只在应用底部笼统写一次来源。当前版本没有使用 Tatoeba 句子。

用途：

- 筛选短、自然、适合对应等级的真实句子；
- 构建西语—中文配对；
- 生成逐句 attribution 清单。

Tatoeba 自身不保证所有句子或翻译经过专业审核，因此导入后仍需人工复核。

### 4. 难度与教学顺序（项目编辑）

不直接复制受版权保护的教材词表。项目自行建立分级规则：

- 沟通场景：问候、身份、家庭、饮食、交通、购物、时间等；
- 语法负担：名词性别、规则动词、常用不规则动词、代词与介词；
- 拼写训练价值：重音、`ñ`、`ü`、`j/g`、`b/v`、`ll/y` 等；
- 词频与现实使用价值；
- 普通词汇与动词原形组控制在 5–10 项，避免一次堆叠过多目标。

## 当前数据保留的关键字段

```ts
{
  spanish: string
  chinese: string
  article?: string
  example?: string
  exampleChinese?: string
  note?: string
  source: {
    name: string
    url: string
    license: string
    checkedAt: string
  }
}
```

`level`、`kind` 与 `scene` 保存在课程组级别。A1–C2 是学习顺序建议，不是官方 CEFR 认证。后续专业复核时再增加 `reviewedBy` 与 `reviewedAt`。

## 发布门槛

一个词库只有同时满足以下条件才能从“候选”改成“正式”：

1. 拼写、重音、词性和性别校验通过；
2. 中文释义符合具体语境，不是机器翻译堆砌；
3. 例句自然且适合标注等级；
4. 来源、许可和 attribution 可追踪；
5. 至少一名具备西语能力的人逐条复核。

## 扩库管线与覆盖口径

从 2026-08-19 起，批量扩库使用独立候选区，不再直接把频率表内容写进课程：

- `data/lexicon/sources.json` 固定来源版本、用途、许可和禁止事项；
- `candidate.schema.json` 要求每条候选保存频率、lemma、词性、PCIC 映射、中文教学内容与复核记录；
- `audit_candidates.mjs` 量化缺失字段、现有目录重复、长短语和动词屈折形式；
- `stage_approved_candidates.mjs` 只输出零阻断且具名批准的候选，不自动改动应用课程；
- `generate_coverage_report.mjs` 生成当前目录覆盖基线和 wordfreq 表面命中诊断。

详见 [`docs/lexicon/PIPELINE.md`](lexicon/PIPELINE.md) 和 [`docs/lexicon/COVERAGE_REPORT.md`](lexicon/COVERAGE_REPORT.md)。报告不计算“官方 CEFR 词汇覆盖率”，因为 CEFR 与 PCIC 都没有提供一个穷尽式官方等级词数分母。
