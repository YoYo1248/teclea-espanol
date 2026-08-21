# Teclea / Vida 词库发布就绪审计（2026-08-21）

## 结论

| 层级 | 状态 | 含义 |
| --- | --- | --- |
| 目录结构 | **READY** | canonical 唯一性和训练目标长度等本报告结构门槛；完整工程检查仍以 `npm run check` 为准 |
| Vida V1 内容基线 | **READY** | 四个生活模块的来源、例句、lemma/词类和 placement 边界达到当前 V1 约定，不包含专业批准与购买实现 |
| 正式词库发布 | **NOT READY** | 必须同时满足完整内容字段、当前卡具名专业复核和高级候选退出条件 |

因此，当前可以准确称为“工程有效、Vida V1 内容基线已形成的候选／编辑词库”，不能称为已经专业审校完毕或官方完整的正式考试词库。

## 发布门槛

| 范围 | 门槛 | 当前 | 要求 | 结果 |
| --- | --- | --- | --- | --- |
| catalog | canonical 输入目标唯一 | 0 | 0 | PASS |
| catalog | 训练目标不超过 3 个词 | 0 | 0 | PASS |
| formal-publication | 所有卡具有来源四要素 | 2636 | 2636 | PASS |
| formal-publication | 所有卡具有双语例句 | 2636 | 2636 | PASS |
| formal-publication | 所有卡具有 lemma 与词类 | 2636 | 2636 | PASS |
| formal-publication | 所有卡具有 PCIC 框架参考 | 2636 | 2636 | PASS |
| formal-publication | 所有当前卡通过具名专业复核 | 0 | 2636 | BLOCKED |
| formal-publication | 没有当前待修订或拒绝项 | 0 | 0 | PASS |
| formal-publication | C1–C2 候选已完成编辑与专业复核 | 0 | 200 | BLOCKED |
| life-v1-content | Vida 全部卡具有来源四要素 | 975 | 975 | PASS |
| life-v1-content | Vida 全部卡具有双语例句 | 975 | 975 | PASS |
| life-v1-content | Vida 全部卡具有 lemma 与词类 | 975 | 975 | PASS |
| life-v1-content | Vida 没有访问级别或 L 等级冲突 | 0 | 0 | PASS |

## Vida 四模块

| 模块 | 卡片 | 来源 | 例句 | lemma/词类 | 专业复核 |
| --- | --- | --- | --- | --- | --- |
| 超市采购 | 356 | 100% | 100% | 100% | 0% |
| 城市出行 | 140 | 100% | 100% | 100% | 0% |
| 在西班牙安顿 | 196 | 100% | 100% | 100% | 0% |
| 高频日常 | 307 | 100% | 100% | 100% | 0% |

Vida 的生活内容基线通过，但 975 项专业复核仍是 0%。`access` 仍只是内容元数据，不表示付费权益已经实现。

## 当前正式发布阻断项

- **所有当前卡通过具名专业复核**：当前 0，要求 2636。证据：`data/lexicon/professional-reviews/*.jsonl`。
- **C1–C2 候选已完成编辑与专业复核**：当前 0，要求 200。证据：`src/advancedWords.ts + professional review records`。

## 口径

- `npm run check` 继续用于工程、目录、路线和构建回归；它通过不等于语言内容正式发布就绪。
- `npm run lexicon:release-readiness` 生成本报告且正常退出，方便持续观察进度。
- `npm run validate:lexicon-release` 使用严格模式；任何正式门槛未满足都会以非零状态退出。当前预期失败，直到真实专业复核完成。
- CEFR / PCIC 没有穷尽式官方等级词数分母；即使所有项目门槛通过，也不能宣称“官方 DELE 词表 100% 完整”。
