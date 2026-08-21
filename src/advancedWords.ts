export type AdvancedDeck = {
  id: string
  level: 'C1' | 'C2'
  scene: '基础' | '日常' | '学习' | '工作' | '城市' | '社会' | '科技' | '环境' | '行政' | '情绪'
  kind: '单词' | '短语' | '动词原形'
  title: string
  description: string
  words: Array<[spanish: string, chinese: string]>
}

export type AdvancedWordMetadata = {
  lemma: string
  partOfSpeech: 'noun' | 'adverb' | 'preposition' | 'verb'
  example: string
  exampleChinese: string
}

export const advancedFrameworkReferences = {
  C1: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_c1-c2.htm',
  C2: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_c1-c2.htm',
} as const

// First advanced editorial-completion batch. These examples and grammatical
// labels are project-authored drafts prepared for named professional review;
// they are not Instituto Cervantes examples or approvals.
export const advancedWordMetadata: Record<string, AdvancedWordMetadata> = {
  'a fin de': {
    lemma: 'a fin de', partOfSpeech: 'preposition',
    example: 'Reformaron el proceso a fin de reducir los plazos.',
    exampleChinese: '他们改革了流程，以缩短期限。',
  },
  abolir: {
    lemma: 'abolir', partOfSpeech: 'verb',
    example: 'El parlamento decidió abolir aquella norma.',
    exampleChinese: '议会决定废除那项规定。',
  },
  adaptación: {
    lemma: 'adaptación', partOfSpeech: 'noun',
    example: 'La adaptación al nuevo sistema llevó varios meses.',
    exampleChinese: '适应新系统花了几个月。',
  },
  'a grandes rasgos': {
    lemma: 'a grandes rasgos', partOfSpeech: 'adverb',
    example: 'A grandes rasgos, el informe confirma la tendencia.',
    exampleChinese: '总体而言，报告证实了这一趋势。',
  },
  'a decir verdad': {
    lemma: 'a decir verdad', partOfSpeech: 'adverb',
    example: 'A decir verdad, el resultado no me sorprendió.',
    exampleChinese: '说实话，这个结果并没有让我意外。',
  },
  abastecer: {
    lemma: 'abastecer', partOfSpeech: 'verb',
    example: 'La red debe abastecer de agua a toda la comarca.',
    exampleChinese: '该管网必须为整个地区供水。',
  },
  abastecimiento: {
    lemma: 'abastecimiento', partOfSpeech: 'noun',
    example: 'El temporal interrumpió el abastecimiento de alimentos.',
    exampleChinese: '暴风雨中断了食品供应。',
  },
  'a la postre': {
    lemma: 'a la postre', partOfSpeech: 'adverb',
    example: 'La medida, a la postre, resultó contraproducente.',
    exampleChinese: '这项措施最终适得其反。',
  },
}

// Original candidate selection for Teclea Español. Topic and level boundaries
// were checked against the Instituto Cervantes PCIC C1-C2 inventories. The
// selection, Chinese glosses and grouping are editorial and still require a
// qualified Spanish-language review before being treated as a finished list.
export const advancedDecks: AdvancedDeck[] = [
  {
    id: 'c1-discourse-links', level: 'C1', scene: '基础', kind: '短语', title: '严密衔接观点', description: '组织论证、说明依据和收束观点的固定搭配',
    words: [
      ['a fin de', '为了'], ['con respecto a', '关于 / 就……而言'], ['en virtud de', '根据 / 凭借'], ['a raíz de', '由于 / 自……之后'], ['en definitiva', '归根结底'],
      ['de ahí que', '因此 / 由此导致'], ['ahora bien', '不过 / 话虽如此'], ['por consiguiente', '因此'], ['a grandes rasgos', '大致地'], ['en cierta medida', '在一定程度上'],
    ],
  },
  {
    id: 'c1-analysis', level: 'C1', scene: '基础', kind: '单词', title: '分析与论证', description: '辨别观点结构、证据质量和表达细微差别',
    words: [
      ['matiz', '细微差别'], ['planteamiento', '思路 / 问题设定'], ['coherencia', '连贯性'], ['ambigüedad', '歧义 / 模糊性'], ['premisa', '前提'],
      ['sesgo', '偏差 / 倾向性'], ['relevancia', '相关性 / 重要性'], ['alcance', '范围 / 影响程度'], ['hallazgo', '研究发现'], ['criterio', '标准 / 判断依据'],
    ],
  },
  {
    id: 'c1-work-leadership', level: 'C1', scene: '工作', kind: '单词', title: '组织与领导', description: '讨论职业发展、决策和团队运行',
    words: [
      ['desempeño', '工作表现'], ['directriz', '指导方针'], ['jerarquía', '层级 / 等级制度'], ['consenso', '共识'], ['competencia', '能力 / 竞争'],
      ['incentivo', '激励措施'], ['viabilidad', '可行性'], ['prioridad', '优先事项'], ['contrapartida', '代价 / 对应回报'], ['trayectoria', '职业历程 / 发展轨迹'],
    ],
  },
  {
    id: 'c1-society', level: 'C1', scene: '社会', kind: '单词', title: '社会与公共治理', description: '讨论公平、制度信任和社会参与',
    words: [
      ['equidad', '公平 / 公正'], ['vulnerabilidad', '脆弱性'], ['precariedad', '不稳定 / 生活困窘'], ['cohesión', '凝聚力'], ['pluralismo', '多元主义'],
      ['ciudadanía', '公民身份 / 公民群体'], ['gobernanza', '治理机制'], ['transparencia', '透明度'], ['legitimidad', '正当性'], ['inclusión', '包容 / 纳入'],
    ],
  },
  {
    id: 'c1-media', level: 'C1', scene: '科技', kind: '单词', title: '媒体与公共表达', description: '理解新闻传播、公开声明和舆论反应',
    words: [
      ['comunicado', '公告 / 声明'], ['titular', '新闻标题'], ['editorial', '社论 / 编辑的'], ['credibilidad', '可信度'], ['repercusión', '反响 / 影响'],
      ['divulgación', '知识传播 / 科普'], ['portavoz', '发言人'], ['testimonio', '证词 / 亲历陈述'], ['audiencia', '受众 / 听众'], ['controversia', '争议'],
    ],
  },
  {
    id: 'c1-research', level: 'C1', scene: '学习', kind: '单词', title: '研究与知识', description: '阅读研究、讨论方法和解释结果',
    words: [
      ['hipótesis', '假设'], ['metodología', '方法论'], ['variable', '变量'], ['muestra', '样本'], ['correlación', '相关性'],
      ['tendencia', '趋势'], ['innovación', '创新'], ['fundamento', '依据 / 基础'], ['paradigma', '范式 / 思维模式'], ['empírico', '实证的'],
    ],
  },
  {
    id: 'c1-environment', level: 'C1', scene: '环境', kind: '单词', title: '环境与应对策略', description: '讨论生态压力、减缓措施和适应能力',
    words: [
      ['mitigación', '减缓'], ['adaptación', '适应 / 调整'], ['ecosistema', '生态系统'], ['degradación', '退化 / 恶化'], ['escasez', '短缺'],
      ['huella', '足迹 / 痕迹'], ['renovable', '可再生的'], ['conservación', '保护 / 保存'], ['contaminante', '污染物 / 污染性的'], ['resiliencia', '恢复力 / 韧性'],
    ],
  },
  {
    id: 'c1-personality', level: 'C1', scene: '情绪', kind: '单词', title: '性格与态度', description: '更准确地描述人的品格、反应与处事方式',
    words: [
      ['austeridad', '节制 / 朴素'], ['humildad', '谦逊'], ['integridad', '正直 / 完整性'], ['susceptibilidad', '敏感 / 易受影响'], ['indiferencia', '冷漠 / 不在意'],
      ['coraje', '勇气'], ['altruista', '利他的'], ['versátil', '多才多用的'], ['frívolo', '轻浮的 / 肤浅的'], ['prepotente', '傲慢强势的'],
    ],
  },
  {
    id: 'c1-formal-affairs', level: 'C1', scene: '行政', kind: '单词', title: '制度与经济事务', description: '处理正式文件、公共资源和经营判断',
    words: [
      ['jurisdicción', '管辖权 / 司法辖区'], ['dictamen', '正式意见 / 鉴定结论'], ['alegación', '申辩 / 陈述理由'], ['subvención', '补贴 / 资助'], ['licitación', '招标'],
      ['proveedor', '供应商'], ['patrimonio', '资产 / 遗产'], ['rentabilidad', '盈利能力 / 收益率'], ['solvencia', '偿付能力 / 可靠性'], ['liquidez', '流动性'],
    ],
  },
  {
    id: 'c1-core-verbs', level: 'C1', scene: '日常', kind: '动词原形', title: '高级表达动词', description: '用于论证、传播、管理和知识处理的高价值原形',
    words: [
      ['fomentar', '促进 / 鼓励'], ['suscitar', '引起 / 激起'], ['abolir', '废除'], ['corroborar', '证实 / 印证'], ['contrastar', '对比 / 核实'],
      ['divulgar', '传播 / 普及'], ['agilizar', '加快 / 简化'], ['delegar', '委派'], ['asimilar', '吸收 / 理解'], ['desvelar', '揭示 / 透露'],
    ],
  },
  {
    id: 'c2-discourse-links', level: 'C2', scene: '基础', kind: '短语', title: '精细控制语气', description: '表达让步、补充、判断和隐含立场的固定搭配',
    words: [
      ['en última instancia', '归根结底'], ['a todas luces', '显而易见地'], ['habida cuenta de', '考虑到'], ['a sabiendas', '明知地'], ['sin perjuicio de', '在不影响……的前提下'],
      ['a la postre', '最终'], ['ni mucho menos', '远非 / 更不用说'], ['por añadidura', '此外 / 再者'], ['en resumidas cuentas', '总而言之'], ['a decir verdad', '说实话'],
    ],
  },
  {
    id: 'c2-precision', level: 'C2', scene: '基础', kind: '单词', title: '精确判断与证据', description: '区分论证力度、可见程度和不可回避性',
    words: [
      ['notorio', '众所周知的 / 显著的'], ['manifiesto', '明显的 / 公开声明'], ['exhaustivo', '详尽的'], ['pormenorizado', '逐项详尽的'], ['fehaciente', '确凿可信的'],
      ['fidedigno', '可靠真实的'], ['subyacente', '潜在的 / 深层的'], ['intrínseco', '内在固有的'], ['contundente', '有力明确的'], ['insoslayable', '不可回避的'],
    ],
  },
  {
    id: 'c2-law-institutions', level: 'C2', scene: '行政', kind: '单词', title: '法律与制度细节', description: '理解正式程序、裁决和制度性文件',
    words: [
      ['instauración', '设立 / 建立'], ['derogación', '废止 / 撤销'], ['fallo', '裁决 / 判决结果'], ['enmienda', '修正案 / 修改'], ['mandato', '授权 / 任期'],
      ['fuero', '司法特权 / 管辖制度'], ['litigio', '诉讼争议'], ['arbitraje', '仲裁'], ['comparecencia', '出庭 / 正式到场'], ['jurisprudencia', '判例法 / 司法实践'],
    ],
  },
  {
    id: 'c2-media-rumor', level: 'C2', scene: '科技', kind: '单词', title: '传闻与信息操控', description: '辨别非正式消息、歪曲和公开更正',
    words: [
      ['bulo', '假消息 / 谣言'], ['habladuría', '闲言碎语'], ['cotilleo', '八卦 / 说闲话'], ['chisme', '闲话 / 小道消息'], ['veracidad', '真实性'],
      ['tergiversación', '歪曲 / 曲解'], ['réplica', '回应 / 反驳'], ['retractación', '撤回声明 / 更正'], ['primicia', '独家新闻'], ['anonimato', '匿名状态'],
    ],
  },
  {
    id: 'c2-personality', level: 'C2', scene: '情绪', kind: '单词', title: '复杂性格与气质', description: '描述强烈、矛盾或带有社会评价的性格',
    words: [
      ['afable', '和蔼可亲的'], ['colérico', '易怒的 / 暴躁的'], ['visceral', '出于本能的 / 强烈的'], ['impertinente', '无礼冒失的'], ['controvertido', '有争议的'],
      ['talante', '态度 / 气度'], ['temperamento', '性情 / 气质'], ['compulsivo', '强迫性的'], ['absorbente', '过度占有的 / 费神的'], ['repelente', '令人反感的'],
    ],
  },
  {
    id: 'c2-economy', level: 'C2', scene: '社会', kind: '单词', title: '经济与市场结构', description: '理解资本、税费、市场权力和供应关系',
    words: [
      ['conglomerado', '企业集团 / 聚合体'], ['accionista', '股东'], ['plusvalía', '资本增值 / 剩余价值'], ['gravamen', '税费 / 负担'], ['arancel', '关税'],
      ['monopolio', '垄断'], ['cotización', '报价 / 行情'], ['morosidad', '拖欠 / 逾期率'], ['abastecimiento', '供应 / 补给'], ['intermediario', '中间商 / 中介'],
    ],
  },
  {
    id: 'c2-science', level: 'C2', scene: '学习', kind: '单词', title: '科学与专业概念', description: '处理跨学科文本中的专业基础概念',
    words: [
      ['microorganismo', '微生物'], ['epidermis', '表皮'], ['cromosoma', '染色体'], ['neuronal', '神经元的'], ['molecular', '分子的'],
      ['patente', '专利 / 明显的'], ['incógnita', '未知数 / 未解之谜'], ['ecuación', '方程'], ['algoritmo', '算法'], ['analítico', '分析性的'],
    ],
  },
  {
    id: 'c2-city', level: 'C2', scene: '城市', kind: '单词', title: '城市空间与规划', description: '理解城市形态、土地和行人空间的精确词汇',
    words: [
      ['metrópoli', '大都市'], ['transeúnte', '过路人'], ['viandante', '行人'], ['bocacalle', '街口'], ['calzada', '车行道'],
      ['arrabal', '城郊旧区'], ['descampado', '城市空地'], ['parcela', '地块'], ['urbanístico', '城市规划的'], ['inmediaciones', '附近区域'],
    ],
  },
  {
    id: 'c2-culture-education', level: 'C2', scene: '学习', kind: '单词', title: '教育与文化评论', description: '讨论知识传统、艺术潮流和文化支持',
    words: [
      ['sílabo', '课程纲要'], ['claustro', '教师委员会 / 回廊'], ['pedagogía', '教育学'], ['didáctica', '教学法'], ['erudición', '博学'],
      ['retórica', '修辞学 / 华丽辞藻'], ['canon', '经典体系 / 准则'], ['legado', '文化遗产 / 留下的影响'], ['vanguardia', '先锋派 / 前沿'], ['mecenazgo', '艺术赞助'],
    ],
  },
  {
    id: 'c2-core-verbs', level: 'C2', scene: '日常', kind: '动词原形', title: '高阶精确动词', description: '用于揭示、驳斥、制度变更和资源供应的原形',
    words: [
      ['aflorar', '浮现 / 显露'], ['emerger', '出现 / 涌现'], ['instaurar', '建立 / 实施'], ['suprimir', '取消 / 删除'], ['rebatir', '反驳'],
      ['desmentir', '否认 / 辟谣'], ['acallar', '压制 / 使安静'], ['abastecer', '供应 / 补给'], ['surtir', '供应 / 产生效果'], ['patentar', '申请专利'],
    ],
  },
]
