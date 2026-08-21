# Vida 在西班牙安顿词库 V1

核对日期：2026-08-21。该模块面向准备或刚开始在西班牙长期生活的中文使用者，目标是完成问候、临时住宿、租房、学校、求职、居留、银行、消费争议和基础就医等语言任务。它不是法律、移民、金融、住房或医疗建议。

## 当前结果

当前模块共 196 个输入目标，全部复用现有 canonical 卡，没有生成平行词条。目录审计先发现 `casa`、`habitación`、`cocina`、`baño`、门窗和基础家具仍只在考试路线，因此定向补入 10 项；后续又补入完整的 15 个语言学习词、9 个工作联络词与 4 个基础银行操作，而不是按数量继续扩词。此前模块同时保存了 `la habitación` / `habitación` 和 `la llave` / `llave` 两组语义重复卡；现已各合并为一张裸词形 canonical 卡，冠词保留为词条属性，旧学习证据通过 ID 重定向继续有效：

- 48 项来自已经按西班牙官方页面核对的新居民批次；
- 48 项来自考试路线的住房、消费者事务和医疗服务补缺批次；
- 4 项来自考试路线的 B1 基础银行操作补缺；
- 96 项来自已有基础、住宿、健康、教育、工作、行政与词频扩库课程，其中包含 10 项 A1 住处／家具补缺和 24 项语言学习／工作联络补缺；
- 免费体验 32 项，覆盖问候、临时住宿、身体部位、基础就医和最常见办事询问；
- 标记为未来付费内容 164 项；
- L1 80 项、L2 64 项、L3 52 项；
- 196 项全部同时属于 `exam` 路线；其中 8 项社区选址词也属于 Vida 城市出行模块，9 项问候与早餐词同时属于高频日常模块。

三重归属不会生成三张卡。`src/vidaSettling.ts` 只保存模块 placement；训练目标、课程 ID、释义、例句、来源和学习证据继续由统一 canonical 目录提供。

## 任务范围

### L1：开始沟通与解决眼前问题

- 问候、感谢、道歉、欢迎和告别；
- 预订、房间、钥匙、早餐、电梯和延迟退房；
- 房子、厨房、卫生间、门窗、桌椅和床等入住后立即会用到的住处词；
- 书、页面、单词、课堂、语言、师生和难易程度；
- 工作、办公室、公司、上司、同事、邮件、消息、信息和日期；
- 常见身体部位、受伤、医生和紧急情况；
- 预约、考试、证件、收入、包裹、学校和住房等基础办事词。

### L2：独立处理常见生活事务

- 房东、中介、租赁双方、住址登记、月租和房屋损坏；
- 托儿、入学、学校类型、食堂、导师和学生群体；
- 招聘信息、合同类型、试用期、工作许可和自雇／受雇；
- 社区选择、公共交通、生活成本、学区和社区医疗；
- 租赁合同、物业费用、住房产权、开通服务和住宅保险；
- 商品保修、撤销购买、客服、交付期限和运费；
- 基础医疗、专科医疗、病历、知情同意、副作用和复诊；
- 身份证明、使馆、户籍地址、国籍、文件、银行和法院。

### L3：理解正式文件和复杂流程

- 按揭、估价、工资单、积蓄、公证和保险事故；
- NIE、TIE、延期、社会保障待遇、提前预约和就业登记；
- 建筑维修、业主分摊费、欠款与租赁关系；
- 消费撤约、符合约定、履约失败和争议调解；
- 康复、处方、照护、转诊和长期医疗；
- 规章、义务、禁止、登记、续期和专科人员。

## 免费与付费边界

免费 32 项让用户在最初几天完成基本礼貌沟通、入住、描述身体不适并理解少量常见办事词。其余 164 项先标记为付费内容，因为它们服务于更完整的住处、语言学习、学校、工作联络、租房、求职、居留、银行、消费和就医任务。38 项定向补缺中，`habitación` 与 `llave` 合并后沿用原酒店体验的免费边界，其余 36 项留在付费侧；这避免同一个概念一张免费、一张付费。

付费标签只是内容元数据，购买功能尚未上线。是否值得单独收费仍需通过真实任务完成率、模块复访率和付费意向验证；不能用“手续很复杂”替代需求证据。

## 来源与限制

- 租房与中介用语参考[西班牙消费者事务部门的房地产中介说明](https://portal-cec.consumo.gob.es/sites/default/files/documentos/NI_AGENCIAS_INMOBILIARIAS_23_10_2024.pdf)和 [BOE 城市租赁法合并文本](https://www.boe.es/buscar/act.php?id=BOE-A-1994-26003)。
- 住房贷款与保险用语参考 [Banco de España](https://clientebancario.bde.es/pcb/es/menu-horizontal/productosservici/financiacion/hipotecas/guia-textual/primerospasoscon/Seguros_hipotecarios.html)。
- 入学用语参考[西班牙教育部](https://educagob.educacionfpydeportes.gob.es/equidad/escolarizacion-cpub-cconc.html)。
- 求职与劳动合同用语参考 [SEPE](https://sepe.es/HomeSepe/encontrar-trabajo/ofertas-empleo)。
- 居留登记用语参考[西班牙政府行政门户](https://administracion.gob.es/pag_Home/Tu-espacio-europeo/derechos-obligaciones/ciudadanos/residencia/obtencion-residencia/inscribirte-residente.html)。
- 消费者事务参考[西班牙欧洲消费者中心](https://portal-cec.consumo.gob.es/es/informacion-general/temas-de-consumo/garantias)，医疗服务参考[西班牙卫生部](https://www.sanidad.gob.es/profesionales/prestacionesSanitarias/CarteraDeServicios/ContenidoCS/2AtencionPrimaria/home.htm)。
- CEFR / PCIC 只用于能力和难度映射，不提供官方逐词清单。

官方页面会更新，地方办理要求也可能不同。卡片只训练语言，不替代阅读当前官方流程、专业意见或个人情况核实。模块尚无具名西语教师逐条复核和真实新居民任务测试。
