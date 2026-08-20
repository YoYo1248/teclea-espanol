# 扩库小批次 001：A2–B1 高频候选

本批最初用 12 项校准选词、中文释义、例句和等级判断；这些项目现已随第一生产批次进入正式课程。保留本文件和 JSONL 作为初始编辑快照，不要求产品用户逐词批准。

| 词 | 暂定等级 | 词性 | 中文 | 例句 | 频率排名 |
| --- | --- | --- | --- | --- | ---: |
| gente | A2 | 名词 | 人；人们 | Hay mucha gente aquí. | 92 |
| mundo | A2 | 名词 | 世界 | Quiero conocer el mundo. | 97 |
| nunca | A2 | 副词 | 从不；从来不 | Nunca llego tarde. | 110 |
| antes | A2 | 副词 | 以前；之前 | Antes vivía aquí. | 114 |
| lugar | A1 | 名词 | 地方；地点 | Es un lugar tranquilo. | 122 |
| aunque | B1 | 连词 | 虽然；即使 | Aunque llueve, salgo. | 128 |
| país | A1 | 名词 | 国家 | España es un país europeo. | 133 |
| historia | A1 | 名词 | 历史；故事 | Estudio la historia de España. | 172 |
| además | B1 | 副词 | 此外；而且 | Además, es muy práctico. | 192 |
| ley | B1 | 名词 | 法律 | Esta ley protege a los consumidores. | 204 |
| grupo | A2 | 名词 | 小组；群体 | Trabajo con un grupo pequeño. | 212 |
| sistema | B1 | 名词 | 系统；体系 | El sistema funciona bien. | 220 |

## 当前状态

- 12 项均已并入 `src/lexiconExpansion.ts`；生产文件带 lemma、词性、词频排名和双语例句，并受目录校验约束。
- 已排除动词变位、专名、外语噪声和过长表达。
- 词频值来自 `wordfreq-es-3.1.1`。
- 已在本地保存的 PCIC 材料中逐项确认：`lugar`、`país`、`historia` 属于 A1，`mundo` 属于 A2，`ley` 属于 B1；其余等级仍是第一轮编辑判断。
- `data/lexicon/review-batches/a2-b1-batch-001.jsonl` 保留为并入前的编辑快照，所以其中的 `editing/unverified` 不代表当前生产卡片状态。
- 第一生产批次共 48 项，扩到 A1/A2/B1；后续继续按小批次自动处理，不会把 6,000 条一次塞进正式词库。

## 本批自动处理结论

1. `país`、`lugar`、`historia` 已依据 PCIC 下调到 A1，`mundo` 保持 A2，`ley` 保持 B1。
2. `historia` 暂保留一个输入目标，用例句限定为“历史”义；不制造重复卡。
3. `aunque / además` 保持 B1，后续与同等级衔接词一起批量抽查。
4. 12 条例句均保持短句；高歧义或来源冲突项会由系统挂起，不转交用户逐词判断。
