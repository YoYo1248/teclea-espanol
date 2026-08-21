# Teclea / Vida 专业复核样本

## 用途

[`PROFESSIONAL_REVIEW_SAMPLE.csv`](PROFESSIONAL_REVIEW_SAMPLE.csv) 是一份交给真实西语教师的 **72 项分层样本**，不是已经完成的审核记录：

- 生活路线 48 项：四个模块各 12 项，每个 L1–L3 各 4 项；L1 明确各抽 2 个免费项和 2 个付费项；
- 考试路线 24 项：A1–C2 各 4 项，只抽尚未进入生活路线的 canonical 卡；
- 选择时优先保留词汇、短语和动词原形差异，并确保 72 个输入目标不重复。
- 只把已经具备中西双语例句的卡放进可通过复核样本；C1/C2 首批各 4 项已先完成项目编辑补缺，但仍须由复核人判断自然度和等级。
- 同一分层内优先抽取带 `reviewKey` 的最新编辑就绪批次，再从其他成熟卡补足，确保教师时间首先用于核对刚新增的项目编辑内容。

重新生成：

```bash
npm run lexicon:prepare-professional-review
```

## 复核人填写规则

状态字段统一填写 `pass`、`revise`、`reject` 或 `not-applicable`，不要把空白理解为通过。至少检查：

1. 西语拼写、重音和在西班牙语境下的自然度；
2. 中文核心义是否准确，是否会误导华语学习者；
3. 西语例句及中文例句是否自然、对应；
4. A1–C2 难度建议是否合理；
5. 生活卡的 L1–L3 任务顺序是否合理；
6. 最终 `decision`，以及需要修改时的建议文本和原因。

每条有效复核必须有 `reviewerName`、`reviewerRole` 和 ISO 日期 `reviewedAt`。完成后的文件应另存为带日期和批次 ID 的复核记录；不能直接覆盖原始空白样本。任何 `revise` 或 `reject` 必须先回到 canonical 卡修正并重新跑目录验证，不能只改报告。

复核人可以只填写一部分行；完全空白的行在导入时会跳过，但只要某一行开始填写，该行的六项状态、最终结论、复核人和日期就必须完整。导入命令只写入可重建的暂存区：

```bash
npm run lexicon:import-professional-review -- --input <完成的复核表.csv>
npm run validate:professional-reviews
```

先人工检查 `artifacts/lexicon/staged-professional-reviews.jsonl`，再把确认过的记录另存为按日期命名的 JSONL 批次，放入 `data/lexicon/professional-reviews/`。空白样本、自评、没有真实身份与角色的记录不得进入该目录。

每条记录保存被审核内容的完整快照及 SHA-256 摘要。词义、例句、等级、路线或生活 placement 此后只要发生变化，旧记录仍保留为历史，但自动变成 stale，不再计入当前专业复核覆盖率。

## 证据边界

生成 CSV 只证明“样本已准备”，当前专业复核覆盖率仍然是 0%。只有收到真实复核人填写的记录、核对身份与日期、通过导入校验并加入不可变批次后，覆盖报告才会增加当前有效的专业复核数量。
