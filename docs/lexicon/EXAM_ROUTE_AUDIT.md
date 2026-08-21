# CEFR / 考试路线结构审计与分批补缺

核对日期：2026-08-21。

## 结论先行

考试路线不应按一个假想的“官方 A1–C2 总词数”机械补齐。CEFR 是能力框架，PCIC 也明确需要按教学环境调整；两者都没有提供可用作分母的穷尽式官方逐级词表。因此本项目只比较自己的 canonical 目录结构，找出明显偏薄的等级 × 主题组合，再以可追踪来源分批补缺。

首轮审计发现，A2、B1、B2 的“出行城市”分别只有 20、15、12 项；首批因此新增 72 张 `exam`-only 出行卡。第二轮继续检查框架能力要求，而不是只看数量：PCIC 明确把住房租赁、消费退款、医疗咨询、投诉和观点协商列为 B1–B2 真实交际事务，但目录中 B2“吃住购物”只有 8 项房贷词，“家庭身心”只有 11 项情绪词。因此第二批再新增 72 项功能表达、住房、消费者事务和医疗服务卡。

第三轮审计进一步发现：B1 已有不少 `descuento`、`garantía`、`cuenta` 等孤立名词，但缺少“办理退换、确认价格、操作账户”和“礼貌询问、确认、评价、表达立场”所需的短表达。因此定向新增 32 项，其中 12 项复用到 Vida 超市 L3，4 项基础银行操作复用到 Vida 安顿 L3，16 项复用到 Vida 高频日常 L2。

三轮共新增 176 项，没有复制原目录已有的 `andén`、`equipaje`、`retraso`、`fianza`、`arrendatario`、`garantía`、`tratamiento` 等 canonical 目标。

## 补缺前后

下表是考试路线中各等级按 Teclea 六个产品宽分类统计的卡片数。它描述内部目录平衡，不是 CEFR 或 DELE 覆盖率。

| 等级 | 核心表达 | 吃住购物 | 出行城市（补缺前） | 出行城市（当前） | 家庭身心 | 学习工作 | 社会世界 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| A1 | 205 | 108 | 88 | 88 | 63 | 24 | 0 |
| A2 | 204 | 119 | 20 | 52 | 85 | 76 | 70 |
| B1 | 84 | 72 | 15 | 39 | 54 | 224 | 221 |
| B2 | 42 | 40 | 12 | 28 | 27 | 182 | 277 |
| C1 | 30 | 0 | 0 | 0 | 10 | 20 | 40 |
| C2 | 30 | 0 | 10 | 10 | 10 | 20 | 30 |

这次没有把所有格子补成相同数量。A1 已有较多基础出行词；B2 的“吃住购物”和“家庭身心”也偏薄，但需要先判断应当补固定表达、论述词还是现实任务词，不能仅凭数字下结论。A1 的“社会世界”为 0 也不自动代表错误：部分抽象社会议题本来就不适合作为 A1 逐字输入目标。

## 第一批 72 项：出行与交通

- A2 32 项：街道构成、停车与乘客设施、票种换乘、城市问路；
- B1 24 项：班次变化、机场流程、道路网络、行李问题和道路救援；
- B2 16 项：补偿与改签、无障碍、交通拥堵、可持续出行和旅客申诉。

每项保留 canonical lemma、课程等级、场景、PCIC 清单链接、双语短例句和来源元数据；短语继续限制为最多 3 个词。首批仍属于 `exam`，并已通过模块 placement 全部复用到 Vida 城市出行 V1；它们不会进入 Vida 超市模块，也没有复制学习证据。

## 第二批 72 项：功能表达与生活事务

- A2 8 项：询问类型、持续时间、用途以及简短确认和不确定表达；
- B1 8 项：邀请对方表态、表达一致和回应常见情绪；
- B2 8 项：确定程度、部分同意、限制、对照和观点立场；
- B2 16 项住房：租赁、工程、公共费用、产权和基础服务；
- B2 16 项消费者事务：法定／商业保修、撤销购买、商品缺陷、交付期限和争议处理；
- B2 16 项医疗服务：基础与专科医疗、转诊、康复、长期照护和知情同意。

这一批不是把法律或医学知识做成考试题，而是补足 B2 学习者描述问题、询问信息、理解服务流程和提出申诉时需要的语言。其中 48 项住房、消费者事务和医疗服务卡已通过 placement 复用到 Vida 在西班牙安顿 V1；8 项 A2 基础功能表达也复用到 Vida 高频日常 V1；剩余 16 项 B1–B2 功能表达仍只进入 `exam`。所有复用都指向同一 canonical 卡，没有复制学习证据。

## 第三轮 32 项：B1 交易任务与交际功能

- 16 项交易任务：`hacer una devolución`、`hacer un cambio`、`estar de oferta`、价格变化、付款和基础账户操作；
- 16 项交际功能：礼貌询问、时间范围、确认、评价、同意／反对以及观点衔接。

这批只补当前目录缺失、最多 3 个词的目标。交易表达中 12 项零售与付款任务复用到 Vida 超市 L3，4 项基础银行操作复用到 Vida 安顿 L3，16 项功能表达复用到 Vida 高频日常 L2；全部仍属于 `exam`，因此任一路线取得的看义与听写证据都落在同一 canonical 卡。PCIC 在 B1–B2 功能清单中列出间接询问、确认、评价和请求，在具体概念清单中列出购物、支付和基础金融服务；项目只把这些能力域作为编辑依据，不复制其完整示例。

## 用语核对来源

- [PCIC A1–A2 具体概念清单](https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_a1-a2.htm) 与 [B1–B2 清单](https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_b1-b2.htm)：只用于等级和出行领域映射，不批量复制词条。
- [Aena：安全检查](https://www.aena.es/es/pasajeros/equipajes-controles/control-seguridad.html) 与 [Barcelona-El Prat 出发区](https://www.aena.es/es/josep-tarradellas-barcelona-el-prat/servicios-del-aeropuerto/categorias-y-terminales/zona-de-salidas.html)：核对 `control de seguridad`、`equipaje de mano`、`facturación`、`tarjeta de embarque` 和登机流程用语。
- [Renfe Viajeros：一般运输条件](https://www.renfe.com/es/es/ayuda/informacion-legal-viajeros/condiciones-generales/condiciones-generales-renfe-viajeros)：核对旅客、车票、延误、取消、行程和退款语境。学习卡不是运输合同或权利建议。
- [DGT：交通违法与处罚](https://www.dgt.es/nuestros-servicios/multas-y-sanciones/conoce-los-tipos-de-infracciones-y-sanciones/)：核对 `infracción`、`multa`、`permiso de conducir`、速度和道路安全语境。学习卡不是驾驶或法律建议。
- [西班牙交通部：可持续出行](https://www.transportes.gob.es/transporte-terrestre/movilidad/movilidad-sostenible)：核对公共交通、步行骑行、无障碍和 `movilidad sostenible` 的政策语境。
- [PCIC B1–B2 目标描述](https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/01_objetivos_relacion_b1-b2.htm) 与 [功能清单](https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/05_funciones_inventario_b1-b2.htm)：核对退款、租房、就医、投诉、协商和观点表达能力；不复制完整示例句。
- [BOE：城市租赁法合并文本](https://www.boe.es/buscar/act.php?id=BOE-A-1994-26003)：核对租赁、租金、押金和合同关系用语。学习卡不是住房或法律建议。
- [西班牙欧洲消费者中心：Garantías](https://portal-cec.consumo.gob.es/es/informacion-general/temas-de-consumo/garantias)：核对法定保修、撤销购买、商品缺陷、维修／替换和减价语境。学习卡不是消费者维权建议。
- [西班牙卫生部：基础医疗服务目录](https://www.sanidad.gob.es/profesionales/prestacionesSanitarias/CarteraDeServicios/ContenidoCS/2AtencionPrimaria/home.htm)：核对基础医疗、专科协调、处方、康复和心理健康服务用语。学习卡不是医疗建议。

来源只证明“为什么选择这些任务用语”可以追踪，不证明等级归属或例句已获官方认证。中文释义、短例句与课程编组均为项目编辑内容。

## 质量边界与下一批

1. 当前批次通过自动重复、长度、lemma、词性、路线、PCIC 链接、来源和双语例句检查；具名西语教师逐条复核仍为 0。
2. C1–C2 暂停自动扩充。现有 200 项高级候选已具备 lemma、词性、PCIC 等级引用和项目原创双语例句，但在没有专业复核前继续堆高阶词会放大分级误差。
3. B1 交易／交际功能缺口已完成本轮定向补缺。下一批不再按分类数字自动扩充，只响应具名复核、真实任务失败或搜索缺词证据。
4. DELE 真题或商业备考资料不能直接复制成词表。若后续使用真题，只记录抽象题型、能力要求和人工归纳的候选，不提交受版权保护的原文集合。
