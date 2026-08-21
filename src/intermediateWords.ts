export type IntermediateDeck = {
  id: string
  level: 'B1' | 'B2'
  scene: '基础' | '日常' | '旅行' | '住宿' | '健康' | '学习' | '工作' | '城市' | '社会' | '科技' | '环境' | '行政' | '情绪'
  kind: '单词' | '短语' | '动词原形'
  title: string
  description: string
  words: Array<[spanish: string, chinese: string]>
}

// Original teaching selection for HolaDone. The topic boundaries and
// level candidates were checked against Instituto Cervantes PCIC B1–B2
// inventories; ordering and Chinese glosses are editorial, not an official
// Instituto Cervantes word list or certification.
export const intermediateDecks: IntermediateDeck[] = [
  {
    id: 'b1-opinion-links', level: 'B1', scene: '基础', kind: '短语', title: '表达观点与衔接', description: '说明立场、转折与因果的常用短语',
    words: [
      ['en mi opinión', '在我看来'], ['sin embargo', '然而'], ['por eso', '因此'], ['de acuerdo', '同意 / 好的'], ['tener razón', '有道理'],
      ['depender de', '取决于'], ['darse cuenta', '意识到'], ['estar de acuerdo', '表示同意'], ['por una parte', '一方面'], ['por otro lado', '另一方面'],
    ],
  },
  {
    id: 'b1-emotions', level: 'B1', scene: '情绪', kind: '单词', title: '情绪与性格', description: '描述感受、态度和一个人的特点',
    words: [
      ['confianza', '信任 / 信心'], ['vergüenza', '羞耻 / 难为情'], ['ilusión', '期待 / 憧憬'], ['preocupación', '担忧'], ['orgulloso', '自豪的'],
      ['decepcionado', '失望的'], ['tranquilo', '平静的'], ['sincero', '真诚的'], ['paciente', '有耐心的'], ['optimista', '乐观的'],
    ],
  },
  {
    id: 'b1-work', level: 'B1', scene: '工作', kind: '单词', title: '求职与工作条件', description: '合同、岗位和职场沟通中的核心词',
    words: [
      ['contrato', '合同'], ['sueldo', '工资'], ['horario', '工作时间 / 时刻表'], ['entrevista', '面试 / 采访'], ['experiencia', '经验'],
      ['currículum', '简历'], ['jornada', '工作日 / 工时'], ['puesto', '职位 / 岗位'], ['solicitar', '申请'], ['contratar', '雇用 / 签约'],
    ],
  },
  {
    id: 'b1-housing-admin', level: 'B1', scene: '住宿', kind: '单词', title: '租房与居住手续', description: '租约、维修和搬家时经常遇到',
    words: [
      ['alquiler', '租金 / 租赁'], ['propietario', '房东 / 所有者'], ['inquilino', '租客'], ['fianza', '押金'], ['avería', '故障'],
      ['mudanza', '搬家'], ['empadronamiento', '住址登记'], ['renovar', '续期 / 更新'], ['formulario', '表格'], ['empadronarse', '办理住址登记'],
    ],
  },
  {
    id: 'b1-health', level: 'B1', scene: '健康', kind: '单词', title: '看病与恢复', description: '描述症状、治疗和身体状态',
    words: [
      ['síntoma', '症状'], ['tratamiento', '治疗'], ['receta', '处方'], ['alergia', '过敏'], ['lesión', '受伤 / 损伤'],
      ['músculo', '肌肉'], ['rodilla', '膝盖'], ['mareado', '头晕的'], ['recuperarse', '恢复'], ['empeorar', '恶化'],
    ],
  },
  {
    id: 'b1-travel-services', level: 'B1', scene: '旅行', kind: '单词', title: '出行与服务问题', description: '处理延误、路线和预订变化',
    words: [
      ['retraso', '延误'], ['destino', '目的地'], ['trayecto', '路程'], ['alojamiento', '住宿'], ['excursión', '短途旅行'],
      ['frontera', '边境'], ['reclamar', '投诉 / 索赔'], ['reservar', '预订'], ['cancelar', '取消'], ['transbordo', '换乘'],
    ],
  },
  {
    id: 'b1-education', level: 'B1', scene: '学习', kind: '单词', title: '课程与考试', description: '报名、学习和成绩相关的高频词',
    words: [
      ['matrícula', '注册 / 学费'], ['beca', '奖学金'], ['asignatura', '科目'], ['apuntes', '课堂笔记'], ['aprobar', '通过考试'],
      ['suspender', '考试不及格'], ['entregar', '提交 / 交付'], ['corregir', '批改 / 纠正'], ['memorizar', '记忆'], ['deducir', '推断'],
    ],
  },
  {
    id: 'b1-media-tech', level: 'B1', scene: '科技', kind: '单词', title: '信息与数字生活', description: '新闻、设备和线上操作常用词',
    words: [
      ['noticia', '新闻'], ['medios', '媒体 / 手段'], ['pantalla', '屏幕'], ['archivo', '文件'], ['contraseña', '密码'],
      ['descargar', '下载'], ['compartir', '分享'], ['conectar', '连接'], ['informado', '了解情况的'], ['enlace', '链接'],
    ],
  },
  {
    id: 'b1-society-city', level: 'B1', scene: '社会', kind: '单词', title: '城市与公共生活', description: '讨论社区、人口和日常公共议题',
    words: [
      ['barrio', '街区'], ['población', '人口'], ['tráfico', '交通流量'], ['contaminación', '污染'], ['reciclaje', '回收利用'],
      ['energía', '能源'], ['empleo', '就业 / 工作'], ['extranjero', '外国人 / 外国的'], ['ciudadano', '公民'], ['sostenible', '可持续的'],
    ],
  },
  {
    id: 'b1-core-verbs', level: 'B1', scene: '日常', kind: '动词原形', title: '推进表达的动词', description: '讲经历、问题和结果时反复使用',
    words: [
      ['conseguir', '获得 / 做到'], ['evitar', '避免'], ['permitir', '允许'], ['ocurrir', '发生'], ['mejorar', '改善'],
      ['elegir', '选择'], ['reconocer', '认出 / 承认'], ['resolver', '解决'], ['aprovechar', '利用 / 抓住'], ['comprobar', '核实 / 检查'],
    ],
  },
  {
    id: 'b2-discourse', level: 'B2', scene: '基础', kind: '短语', title: '论证与语气', description: '组织复杂观点并表达保留态度',
    words: [
      ['por lo tanto', '因此'], ['a pesar de', '尽管'], ['en cambio', '相反 / 而'], ['de hecho', '事实上'], ['en cuanto a', '关于'],
      ['desde luego', '当然'], ['al parecer', '看来'], ['tener en cuenta', '考虑到'], ['estar a favor', '赞成'], ['estar en contra', '反对'],
    ],
  },
  {
    id: 'b2-communication', level: 'B2', scene: '基础', kind: '单词', title: '表达与论述', description: '陈述、澄清和讨论中常见的抽象词',
    words: [
      ['afirmación', '陈述 / 断言'], ['aclaración', '澄清'], ['argumento', '论点 / 理由'], ['conclusión', '结论'], ['crítica', '批评 / 评论'],
      ['propuesta', '提议'], ['sugerencia', '建议'], ['destacar', '强调 / 突出'], ['resumir', '总结'], ['insistir', '坚持 / 强调'],
    ],
  },
  {
    id: 'b2-work-projects', level: 'B2', scene: '工作', kind: '单词', title: '项目与协作', description: '管理目标、资源与团队责任',
    words: [
      ['rendimiento', '表现 / 效率'], ['plazo', '期限'], ['presupuesto', '预算'], ['negociación', '谈判'], ['responsabilidad', '责任'],
      ['requisito', '要求 / 条件'], ['liderazgo', '领导力'], ['productividad', '生产率 / 效率'], ['coordinar', '协调'], ['asumir', '承担 / 假定'],
    ],
  },
  {
    id: 'b2-economy', level: 'B2', scene: '社会', kind: '单词', title: '经济与个人财务', description: '讨论收入、消费和经济选择',
    words: [
      ['desempleo', '失业'], ['ingresos', '收入'], ['gastos', '支出'], ['ahorro', '储蓄'], ['deuda', '债务'],
      ['impuesto', '税'], ['inversión', '投资'], ['consumo', '消费'], ['financiación', '融资 / 资金支持'], ['coste', '成本'],
    ],
  },
  {
    id: 'b2-society', level: 'B2', scene: '社会', kind: '单词', title: '社会与公民议题', description: '理解权利、共处和社会差异',
    words: [
      ['desigualdad', '不平等'], ['convivencia', '共同生活 / 和谐相处'], ['diversidad', '多样性'], ['solidaridad', '团结互助'], ['derecho', '权利 / 法律'],
      ['obligación', '义务'], ['legislación', '法律体系'], ['voluntariado', '志愿服务'], ['integración', '融入 / 整合'], ['discriminación', '歧视'],
    ],
  },
  {
    id: 'b2-media-digital', level: 'B2', scene: '科技', kind: '单词', title: '媒体与信息判断', description: '辨别来源、传播和数字隐私',
    words: [
      ['privacidad', '隐私'], ['fiabilidad', '可靠性'], ['fuente', '来源'], ['rumor', '传闻'], ['cobertura', '报道范围 / 覆盖'],
      ['publicación', '出版物 / 发布'], ['contenido', '内容'], ['difundir', '传播'], ['verificar', '核实'], ['actualizar', '更新'],
    ],
  },
  {
    id: 'b2-environment-science', level: 'B2', scene: '环境', kind: '单词', title: '环境与研究', description: '讨论生态问题和证据时常见',
    words: [
      ['sostenibilidad', '可持续性'], ['biodiversidad', '生物多样性'], ['especie', '物种'], ['recurso', '资源'], ['residuo', '废弃物'],
      ['emisiones', '排放'], ['sequía', '干旱'], ['investigación', '研究'], ['análisis', '分析'], ['evidencia', '证据'],
    ],
  },
  {
    id: 'b2-admin-legal', level: 'B2', scene: '行政', kind: '单词', title: '行政与法律程序', description: '办理正式手续和维护权益所需',
    words: [
      ['trámite', '手续'], ['solicitud', '申请'], ['resolución', '决定 / 决议'], ['autorización', '许可'], ['reclamación', '投诉 / 索赔'],
      ['denuncia', '举报 / 报案'], ['garantía', '保证 / 保修'], ['sanción', '处罚'], ['expediente', '档案 / 案卷'], ['normativa', '规章制度'],
    ],
  },
  {
    id: 'b2-wellbeing', level: 'B2', scene: '情绪', kind: '单词', title: '心理与人际关系', description: '谈压力、支持和应对困难',
    words: [
      ['autoestima', '自尊 / 自信'], ['ansiedad', '焦虑'], ['bienestar', '身心健康'], ['decepción', '失望'], ['incertidumbre', '不确定感'],
      ['compromiso', '承诺 / 投入'], ['conflicto', '冲突'], ['apoyo', '支持'], ['superar', '克服'], ['afrontar', '面对 / 应对'],
    ],
  },
  {
    id: 'b2-core-nuance', level: 'B2', scene: '日常', kind: '单词', title: '抽象动作与判断', description: '让表达更精确的常用动词和形容词',
    words: [
      ['provocar', '引起'], ['plantear', '提出 / 探讨'], ['establecer', '建立 / 规定'], ['desarrollar', '发展 / 制定'], ['mantener', '维持'],
      ['alcanzar', '达到'], ['valorar', '评价 / 重视'], ['adecuado', '合适的'], ['probable', '很可能的'], ['consciente', '意识到的'],
    ],
  },
]
