import type { EditorialMetadata } from './editorialMetadata'

const C1_C2_FUNCTIONS = 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/05_funciones_inventario_c1-c2.htm'
const C1_C2_GENERAL_NOTIONS = 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/08_nociones_generales_inventario_c1-c2.htm'
const C1_C2_SPECIFIC_NOTIONS = 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_c1-c2.htm'
const C1_REVIEW_KEY = 'advanced-c1-editorial-002'
const C2_REVIEW_KEY = 'advanced-c2-editorial-003'

// Completion overlay for the remaining C1 candidates. These are project
// editorial drafts prepared for named review, not professional approvals.
export const advancedEditorialMetadata: Readonly<Record<string, EditorialMetadata>> = {
  'con respecto a': {
    lemma: 'con respecto a', partOfSpeech: 'fixed-expression', frameworkReference: C1_C2_FUNCTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'Con respecto a la vivienda, faltan datos recientes.', exampleChinese: '关于住房问题，目前缺少最新数据。',
  },
  'en virtud de': {
    lemma: 'en virtud de', partOfSpeech: 'fixed-expression', frameworkReference: C1_C2_FUNCTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El contrato se renovó en virtud de la cláusula quinta.', exampleChinese: '合同根据第五条条款得到续签。',
  },
  'a raíz de': {
    lemma: 'a raíz de', partOfSpeech: 'fixed-expression', frameworkReference: C1_C2_FUNCTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'A raíz de la avería, cerraron el edificio.', exampleChinese: '由于发生故障，他们关闭了大楼。',
  },
  'en definitiva': {
    lemma: 'en definitiva', partOfSpeech: 'fixed-expression', frameworkReference: C1_C2_FUNCTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'En definitiva, necesitamos otra solución.', exampleChinese: '归根结底，我们需要另一个解决方案。',
  },
  'de ahí que': {
    lemma: 'de ahí que', partOfSpeech: 'fixed-expression', frameworkReference: C1_C2_FUNCTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El plazo es breve, de ahí que debamos actuar ahora.', exampleChinese: '期限很短，因此我们必须现在行动。',
  },
  'ahora bien': {
    lemma: 'ahora bien', partOfSpeech: 'fixed-expression', frameworkReference: C1_C2_FUNCTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La propuesta es viable; ahora bien, requiere financiación.', exampleChinese: '这项提议可行，不过需要资金。',
  },
  'por consiguiente': {
    lemma: 'por consiguiente', partOfSpeech: 'fixed-expression', frameworkReference: C1_C2_FUNCTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'No hubo acuerdo; por consiguiente, continuó la negociación.', exampleChinese: '双方没有达成协议，因此谈判继续进行。',
  },
  'en cierta medida': {
    lemma: 'en cierta medida', partOfSpeech: 'fixed-expression', frameworkReference: C1_C2_FUNCTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La medida funcionó en cierta medida.', exampleChinese: '这项措施在一定程度上奏效了。',
  },
  matiz: {
    lemma: 'matiz', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El informe añade un matiz importante.', exampleChinese: '报告补充了一个重要的细微差别。',
  },
  planteamiento: {
    lemma: 'planteamiento', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El planteamiento del estudio es demasiado amplio.', exampleChinese: '这项研究的问题设定过于宽泛。',
  },
  coherencia: {
    lemma: 'coherencia', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El texto mantiene una buena coherencia.', exampleChinese: '这篇文章保持了良好的连贯性。',
  },
  ambigüedad: {
    lemma: 'ambigüedad', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La cláusula contiene una ambigüedad.', exampleChinese: '该条款存在一处歧义。',
  },
  premisa: {
    lemma: 'premisa', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La conclusión parte de una premisa falsa.', exampleChinese: '这个结论建立在一个错误前提上。',
  },
  sesgo: {
    lemma: 'sesgo', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La muestra introduce un sesgo importante.', exampleChinese: '该样本引入了明显偏差。',
  },
  relevancia: {
    lemma: 'relevancia', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'Debemos explicar la relevancia del hallazgo.', exampleChinese: '我们必须解释这一发现的重要性。',
  },
  alcance: {
    lemma: 'alcance', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El informe analiza el alcance de la reforma.', exampleChinese: '报告分析了改革的影响范围。',
  },
  hallazgo: {
    lemma: 'hallazgo', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El principal hallazgo contradice la hipótesis.', exampleChinese: '主要研究发现与假设相矛盾。',
  },
  criterio: {
    lemma: 'criterio', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'Aplicamos el mismo criterio a todos los casos.', exampleChinese: '我们对所有案例采用同一标准。',
  },
  desempeño: {
    lemma: 'desempeño', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'Evaluaron el desempeño del equipo.', exampleChinese: '他们评估了团队的工作表现。',
  },
  directriz: {
    lemma: 'directriz', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La nueva directriz prioriza la seguridad.', exampleChinese: '新的指导方针优先考虑安全。',
  },
  jerarquía: {
    lemma: 'jerarquía', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La decisión pasó por toda la jerarquía.', exampleChinese: '这项决定经过了整个层级体系。',
  },
  consenso: {
    lemma: 'consenso', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El comité alcanzó un consenso.', exampleChinese: '委员会达成了共识。',
  },
  competencia: {
    lemma: 'competencia', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La comunicación es una competencia clave.', exampleChinese: '沟通是一项关键能力。',
  },
  incentivo: {
    lemma: 'incentivo', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La ayuda sirve de incentivo para contratar.', exampleChinese: '这项补助可以促进招聘。',
  },
  viabilidad: {
    lemma: 'viabilidad', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El estudio confirma la viabilidad del proyecto.', exampleChinese: '研究证实了项目的可行性。',
  },
  prioridad: {
    lemma: 'prioridad', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La vivienda asequible es una prioridad.', exampleChinese: '可负担住房是一项优先事项。',
  },
  contrapartida: {
    lemma: 'contrapartida', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La flexibilidad tiene como contrapartida una menor estabilidad.', exampleChinese: '灵活性的代价是稳定性较低。',
  },
  trayectoria: {
    lemma: 'trayectoria', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'Su trayectoria profesional combina docencia e investigación.', exampleChinese: '他的职业经历结合了教学与研究。',
  },
  equidad: {
    lemma: 'equidad', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La reforma busca mejorar la equidad.', exampleChinese: '改革旨在改善公平性。',
  },
  vulnerabilidad: {
    lemma: 'vulnerabilidad', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La crisis aumentó la vulnerabilidad de muchas familias.', exampleChinese: '危机加剧了许多家庭的脆弱处境。',
  },
  precariedad: {
    lemma: 'precariedad', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La precariedad laboral afecta a los jóvenes.', exampleChinese: '就业不稳定影响年轻人。',
  },
  cohesión: {
    lemma: 'cohesión', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'Los servicios públicos refuerzan la cohesión social.', exampleChinese: '公共服务可以增强社会凝聚力。',
  },
  pluralismo: {
    lemma: 'pluralismo', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El pluralismo favorece el debate público.', exampleChinese: '多元主义有利于公共讨论。',
  },
  ciudadanía: {
    lemma: 'ciudadanía', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La ciudadanía pidió más transparencia.', exampleChinese: '公民群体要求提高透明度。',
  },
  gobernanza: {
    lemma: 'gobernanza', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La gobernanza del proyecto incluye a varias instituciones.', exampleChinese: '项目治理机制包含多个机构。',
  },
  transparencia: {
    lemma: 'transparencia', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La transparencia mejora la confianza pública.', exampleChinese: '透明度可以提升公众信任。',
  },
  legitimidad: {
    lemma: 'legitimidad', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La consulta reforzó la legitimidad de la decisión.', exampleChinese: '协商增强了这项决定的正当性。',
  },
  inclusión: {
    lemma: 'inclusión', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El programa promueve la inclusión educativa.', exampleChinese: '该项目促进教育包容。',
  },
  comunicado: {
    lemma: 'comunicado', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La empresa publicó un comunicado oficial.', exampleChinese: '公司发布了一份正式声明。',
  },
  titular: {
    lemma: 'titular', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El titular exagera el contenido de la noticia.', exampleChinese: '新闻标题夸大了报道内容。',
  },
  editorial: {
    lemma: 'editorial', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El editorial critica la falta de transparencia.', exampleChinese: '这篇社论批评缺乏透明度。',
  },
  credibilidad: {
    lemma: 'credibilidad', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El error dañó la credibilidad del medio.', exampleChinese: '这个错误损害了媒体的可信度。',
  },
  repercusión: {
    lemma: 'repercusión', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La entrevista tuvo gran repercusión.', exampleChinese: '这次采访引起了很大反响。',
  },
  divulgación: {
    lemma: 'divulgación', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La divulgación científica exige claridad.', exampleChinese: '科学传播需要表达清晰。',
  },
  portavoz: {
    lemma: 'portavoz', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La portavoz respondió a las preguntas.', exampleChinese: '发言人回答了问题。',
  },
  testimonio: {
    lemma: 'testimonio', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El tribunal escuchó su testimonio.', exampleChinese: '法庭听取了他的证词。',
  },
  audiencia: {
    lemma: 'audiencia', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El programa perdió audiencia este año.', exampleChinese: '这个节目今年流失了观众。',
  },
  controversia: {
    lemma: 'controversia', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La medida generó una fuerte controversia.', exampleChinese: '这项措施引发了激烈争议。',
  },
  hipótesis: {
    lemma: 'hipótesis', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'Los datos respaldan la hipótesis inicial.', exampleChinese: '数据支持最初的假设。',
  },
  metodología: {
    lemma: 'metodología', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La metodología combina entrevistas y encuestas.', exampleChinese: '研究方法结合了访谈与问卷。',
  },
  variable: {
    lemma: 'variable', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La edad es una variable relevante.', exampleChinese: '年龄是一个相关变量。',
  },
  muestra: {
    lemma: 'muestra', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La muestra incluye a quinientas personas.', exampleChinese: '样本包含五百人。',
  },
  correlación: {
    lemma: 'correlación', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El estudio observa una correlación moderada.', exampleChinese: '研究观察到中等程度的相关性。',
  },
  tendencia: {
    lemma: 'tendencia', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'Los resultados muestran una tendencia estable.', exampleChinese: '结果显示出稳定趋势。',
  },
  innovación: {
    lemma: 'innovación', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La innovación redujo el consumo de energía.', exampleChinese: '这项创新降低了能源消耗。',
  },
  fundamento: {
    lemma: 'fundamento', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La acusación carece de fundamento.', exampleChinese: '这项指控缺乏依据。',
  },
  paradigma: {
    lemma: 'paradigma', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La tecnología cambió el paradigma de trabajo.', exampleChinese: '技术改变了工作范式。',
  },
  empírico: {
    lemma: 'empírico', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El estudio aporta respaldo empírico.', exampleChinese: '该研究提供了实证支持。',
  },
  mitigación: {
    lemma: 'mitigación', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El plan incluye medidas de mitigación climática.', exampleChinese: '该计划包含气候减缓措施。',
  },
  ecosistema: {
    lemma: 'ecosistema', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La sequía alteró el ecosistema local.', exampleChinese: '干旱改变了当地生态系统。',
  },
  degradación: {
    lemma: 'degradación', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La degradación del suelo avanza rápidamente.', exampleChinese: '土壤退化正在迅速加剧。',
  },
  escasez: {
    lemma: 'escasez', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La región afronta una escasez de agua.', exampleChinese: '该地区面临水资源短缺。',
  },
  huella: {
    lemma: 'huella', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La empresa redujo su huella de carbono.', exampleChinese: '公司降低了碳足迹。',
  },
  renovable: {
    lemma: 'renovable', partOfSpeech: 'adjective', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El hidrógeno renovable requiere mucha energía.', exampleChinese: '可再生氢需要大量能源。',
  },
  conservación: {
    lemma: 'conservación', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La conservación del bosque protege la biodiversidad.', exampleChinese: '森林保护有助于维护生物多样性。',
  },
  contaminante: {
    lemma: 'contaminante', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'Este contaminante permanece años en el suelo.', exampleChinese: '这种污染物会在土壤中残留多年。',
  },
  resiliencia: {
    lemma: 'resiliencia', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La comunidad mostró una gran resiliencia.', exampleChinese: '社区展现了很强的恢复力。',
  },
  austeridad: {
    lemma: 'austeridad', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La austeridad marcó su estilo de vida.', exampleChinese: '节制塑造了他的生活方式。',
  },
  humildad: {
    lemma: 'humildad', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'Reconoció el error con humildad.', exampleChinese: '他谦逊地承认了错误。',
  },
  integridad: {
    lemma: 'integridad', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'Su integridad inspira confianza.', exampleChinese: '他的正直令人信任。',
  },
  susceptibilidad: {
    lemma: 'susceptibilidad', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'Su susceptibilidad dificulta la crítica constructiva.', exampleChinese: '他的敏感使建设性批评变得困难。',
  },
  indiferencia: {
    lemma: 'indiferencia', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'Respondió con indiferencia a la noticia.', exampleChinese: '他对这条消息反应冷淡。',
  },
  coraje: {
    lemma: 'coraje', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'Tuvo el coraje de denunciar el abuso.', exampleChinese: '他有勇气举报这种侵害。',
  },
  altruista: {
    lemma: 'altruista', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'Su comportamiento altruista ayudó a muchas personas.', exampleChinese: '他的利他行为帮助了许多人。',
  },
  versátil: {
    lemma: 'versátil', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'Es un profesional versátil y creativo.', exampleChinese: '他是一位多才多艺且富有创造力的专业人士。',
  },
  frívolo: {
    lemma: 'frívolo', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El comentario frívolo molestó al equipo.', exampleChinese: '轻浮的评论让团队感到不快。',
  },
  prepotente: {
    lemma: 'prepotente', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'Su tono prepotente bloqueó el diálogo.', exampleChinese: '他傲慢强势的语气阻碍了对话。',
  },
  jurisdicción: {
    lemma: 'jurisdicción', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El caso pertenece a otra jurisdicción.', exampleChinese: '该案件属于另一个司法辖区。',
  },
  dictamen: {
    lemma: 'dictamen', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El comité emitió un dictamen favorable.', exampleChinese: '委员会出具了有利意见。',
  },
  alegación: {
    lemma: 'alegación', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'Presentó una alegación dentro del plazo.', exampleChinese: '他在期限内提交了申辩。',
  },
  subvención: {
    lemma: 'subvención', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La asociación recibió una subvención municipal.', exampleChinese: '该协会获得了市政府补贴。',
  },
  licitación: {
    lemma: 'licitación', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La licitación quedó desierta.', exampleChinese: '这次招标无人中标。',
  },
  proveedor: {
    lemma: 'proveedor', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El proveedor entregó el material con retraso.', exampleChinese: '供应商延迟交付了材料。',
  },
  patrimonio: {
    lemma: 'patrimonio', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El museo conserva parte del patrimonio local.', exampleChinese: '博物馆保存了部分地方文化遗产。',
  },
  rentabilidad: {
    lemma: 'rentabilidad', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La rentabilidad del proyecto sigue siendo baja.', exampleChinese: '该项目的盈利能力仍然较低。',
  },
  solvencia: {
    lemma: 'solvencia', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El banco evaluó la solvencia del solicitante.', exampleChinese: '银行评估了申请人的偿付能力。',
  },
  liquidez: {
    lemma: 'liquidez', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La empresa necesita liquidez para pagar a sus proveedores.', exampleChinese: '公司需要流动资金支付供应商。',
  },
  fomentar: {
    lemma: 'fomentar', partOfSpeech: 'verb', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La medida busca fomentar el empleo estable.', exampleChinese: '这项措施旨在促进稳定就业。',
  },
  suscitar: {
    lemma: 'suscitar', partOfSpeech: 'verb', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La decisión puede suscitar nuevas dudas.', exampleChinese: '这项决定可能引发新的疑问。',
  },
  corroborar: {
    lemma: 'corroborar', partOfSpeech: 'verb', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'Los datos permiten corroborar la hipótesis.', exampleChinese: '数据可以证实这一假设。',
  },
  contrastar: {
    lemma: 'contrastar', partOfSpeech: 'verb', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'Conviene contrastar la noticia con otras fuentes.', exampleChinese: '应当用其他来源核对这条新闻。',
  },
  divulgar: {
    lemma: 'divulgar', partOfSpeech: 'verb', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El museo quiere divulgar sus investigaciones.', exampleChinese: '博物馆希望传播其研究成果。',
  },
  agilizar: {
    lemma: 'agilizar', partOfSpeech: 'verb', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La plataforma pretende agilizar los trámites.', exampleChinese: '该平台旨在加快手续办理。',
  },
  delegar: {
    lemma: 'delegar', partOfSpeech: 'verb', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'La dirección decidió delegar esa tarea.', exampleChinese: '管理层决定委派这项任务。',
  },
  asimilar: {
    lemma: 'asimilar', partOfSpeech: 'verb', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'Necesito tiempo para asimilar la información.', exampleChinese: '我需要时间消化这些信息。',
  },
  desvelar: {
    lemma: 'desvelar', partOfSpeech: 'verb', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C1_REVIEW_KEY,
    example: 'El informe promete desvelar nuevos datos.', exampleChinese: '报告有望揭示新的数据。',
  },
  'en última instancia': {
    lemma: 'en última instancia', partOfSpeech: 'fixed-expression', frameworkReference: C1_C2_FUNCTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'En última instancia, la decisión corresponde al tribunal.', exampleChinese: '归根结底，这项决定应由法院作出。',
  },
  'a todas luces': {
    lemma: 'a todas luces', partOfSpeech: 'fixed-expression', frameworkReference: C1_C2_FUNCTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'A todas luces, el plazo resulta insuficiente.', exampleChinese: '显而易见，这个期限不够。',
  },
  'habida cuenta de': {
    lemma: 'habida cuenta de', partOfSpeech: 'fixed-expression', frameworkReference: C1_C2_FUNCTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'Habida cuenta de los riesgos, aplazaron la obra.', exampleChinese: '考虑到风险，他们推迟了工程。',
  },
  'a sabiendas': {
    lemma: 'a sabiendas', partOfSpeech: 'fixed-expression', frameworkReference: C1_C2_FUNCTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'Actuó a sabiendas de que incumplía la norma.', exampleChinese: '他明知违反规定仍采取了行动。',
  },
  'sin perjuicio de': {
    lemma: 'sin perjuicio de', partOfSpeech: 'fixed-expression', frameworkReference: C1_C2_FUNCTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El acuerdo seguirá vigente sin perjuicio de futuras revisiones.', exampleChinese: '该协议继续有效，但不影响今后的修订。',
  },
  'ni mucho menos': {
    lemma: 'ni mucho menos', partOfSpeech: 'fixed-expression', frameworkReference: C1_C2_FUNCTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El resultado no es definitivo, ni mucho menos.', exampleChinese: '这个结果远远不是最终结论。',
  },
  'por añadidura': {
    lemma: 'por añadidura', partOfSpeech: 'fixed-expression', frameworkReference: C1_C2_FUNCTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El proyecto es viable y, por añadidura, reduce costes.', exampleChinese: '该项目可行，而且还能降低成本。',
  },
  'en resumidas cuentas': {
    lemma: 'en resumidas cuentas', partOfSpeech: 'fixed-expression', frameworkReference: C1_C2_FUNCTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'En resumidas cuentas, faltan recursos y tiempo.', exampleChinese: '总而言之，我们缺少资源和时间。',
  },
  notorio: {
    lemma: 'notorio', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El cambio es notorio incluso a corto plazo.', exampleChinese: '即使从短期看，变化也很明显。',
  },
  manifiesto: {
    lemma: 'manifiesto', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'Existe un conflicto manifiesto entre ambas normas.', exampleChinese: '两项规定之间存在明显冲突。',
  },
  exhaustivo: {
    lemma: 'exhaustivo', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El informe ofrece un análisis exhaustivo.', exampleChinese: '报告提供了详尽分析。',
  },
  pormenorizado: {
    lemma: 'pormenorizado', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'Presentaron un presupuesto pormenorizado.', exampleChinese: '他们提交了一份逐项详列的预算。',
  },
  fehaciente: {
    lemma: 'fehaciente', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'No existe una prueba fehaciente del pago.', exampleChinese: '没有确凿的付款证明。',
  },
  fidedigno: {
    lemma: 'fidedigno', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'Necesitamos un registro fidedigno de los hechos.', exampleChinese: '我们需要一份真实可靠的事实记录。',
  },
  subyacente: {
    lemma: 'subyacente', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El problema subyacente sigue sin resolverse.', exampleChinese: '深层问题仍未得到解决。',
  },
  intrínseco: {
    lemma: 'intrínseco', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La incertidumbre es un rasgo intrínseco del proceso.', exampleChinese: '不确定性是这一过程的内在特征。',
  },
  contundente: {
    lemma: 'contundente', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El tribunal dio una respuesta contundente.', exampleChinese: '法院给出了有力而明确的答复。',
  },
  insoslayable: {
    lemma: 'insoslayable', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La financiación es una cuestión insoslayable.', exampleChinese: '资金问题不可回避。',
  },
  instauración: {
    lemma: 'instauración', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La instauración del sistema exigió una reforma legal.', exampleChinese: '该制度的建立需要法律改革。',
  },
  derogación: {
    lemma: 'derogación', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El parlamento aprobó la derogación de la norma.', exampleChinese: '议会批准废止这项规定。',
  },
  fallo: {
    lemma: 'fallo', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El fallo confirmó la nulidad del contrato.', exampleChinese: '判决确认该合同无效。',
  },
  enmienda: {
    lemma: 'enmienda', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La comisión aceptó la enmienda.', exampleChinese: '委员会接受了修正案。',
  },
  mandato: {
    lemma: 'mandato', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El mandato del consejo expira en diciembre.', exampleChinese: '委员会的任期在十二月届满。',
  },
  fuero: {
    lemma: 'fuero', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El tribunal examinó qué fuero resultaba aplicable.', exampleChinese: '法院审查了应适用哪一种管辖制度。',
  },
  litigio: {
    lemma: 'litigio', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'Las partes resolvieron el litigio mediante un acuerdo.', exampleChinese: '双方通过协议解决了诉讼争议。',
  },
  arbitraje: {
    lemma: 'arbitraje', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El contrato prevé un procedimiento de arbitraje.', exampleChinese: '合同规定了仲裁程序。',
  },
  comparecencia: {
    lemma: 'comparecencia', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La comparecencia duró más de dos horas.', exampleChinese: '正式出席陈述持续了两个多小时。',
  },
  jurisprudencia: {
    lemma: 'jurisprudencia', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La sentencia cita jurisprudencia consolidada.', exampleChinese: '判决引用了已确立的判例。',
  },
  bulo: {
    lemma: 'bulo', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La plataforma retiró el bulo.', exampleChinese: '平台删除了这条假消息。',
  },
  habladuría: {
    lemma: 'habladuría', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La acusación nació de una simple habladuría.', exampleChinese: '这项指控源于一句闲话。',
  },
  cotilleo: {
    lemma: 'cotilleo', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El programa convirtió el asunto en cotilleo.', exampleChinese: '节目把这件事变成了八卦。',
  },
  chisme: {
    lemma: 'chisme', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El chisme se extendió por toda la oficina.', exampleChinese: '这条闲话传遍了办公室。',
  },
  veracidad: {
    lemma: 'veracidad', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'Nadie comprobó la veracidad del mensaje.', exampleChinese: '没有人核实这条消息的真实性。',
  },
  tergiversación: {
    lemma: 'tergiversación', partOfSpeech: 'noun', frameworkReference: C1_C2_FUNCTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La cita parcial produjo una tergiversación de sus palabras.', exampleChinese: '不完整的引用歪曲了他的话。',
  },
  réplica: {
    lemma: 'réplica', partOfSpeech: 'noun', frameworkReference: C1_C2_FUNCTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El autor publicó una réplica al día siguiente.', exampleChinese: '作者第二天发表了回应。',
  },
  retractación: {
    lemma: 'retractación', partOfSpeech: 'noun', frameworkReference: C1_C2_FUNCTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El periódico publicó una retractación.', exampleChinese: '报纸发表了撤回声明。',
  },
  primicia: {
    lemma: 'primicia', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El medio perdió la primicia por no verificar los datos.', exampleChinese: '该媒体因未核实数据而失去了独家新闻。',
  },
  anonimato: {
    lemma: 'anonimato', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La fuente pidió mantener el anonimato.', exampleChinese: '消息来源要求保持匿名。',
  },
  afable: {
    lemma: 'afable', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El director mantuvo un trato afable.', exampleChinese: '主任始终待人和蔼。',
  },
  colérico: {
    lemma: 'colérico', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'Su carácter colérico generaba conflictos.', exampleChinese: '他暴躁的性格经常引发冲突。',
  },
  visceral: {
    lemma: 'visceral', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'Su rechazo visceral impidió un debate sereno.', exampleChinese: '他强烈而本能的排斥阻碍了冷静讨论。',
  },
  impertinente: {
    lemma: 'impertinente', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La pregunta impertinente incomodó a la portavoz.', exampleChinese: '无礼的问题让发言人感到不适。',
  },
  controvertido: {
    lemma: 'controvertido', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El nombramiento sigue siendo controvertido.', exampleChinese: '这项任命仍然存在争议。',
  },
  talante: {
    lemma: 'talante', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'Mostró un talante abierto al diálogo.', exampleChinese: '他展现出开放对话的态度。',
  },
  temperamento: {
    lemma: 'temperamento', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'Su temperamento cambia bajo presión.', exampleChinese: '他的性情在压力下会发生变化。',
  },
  compulsivo: {
    lemma: 'compulsivo', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El comportamiento compulsivo requiere atención profesional.', exampleChinese: '强迫性行为需要专业关注。',
  },
  absorbente: {
    lemma: 'absorbente', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El proyecto resultó tan absorbente que descuidó el descanso.', exampleChinese: '这个项目过于耗费精力，以至于他忽视了休息。',
  },
  repelente: {
    lemma: 'repelente', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El olor repelente obligó a cerrar la sala.', exampleChinese: '令人反感的气味迫使人们关闭房间。',
  },
  conglomerado: {
    lemma: 'conglomerado', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El conglomerado controla varias empresas.', exampleChinese: '这个企业集团控制着多家公司。',
  },
  accionista: {
    lemma: 'accionista', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'Cada accionista recibió el informe anual.', exampleChinese: '每位股东都收到了年度报告。',
  },
  plusvalía: {
    lemma: 'plusvalía', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La venta generó una plusvalía considerable.', exampleChinese: '这次出售产生了可观的资本增值。',
  },
  gravamen: {
    lemma: 'gravamen', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El nuevo gravamen afecta a las importaciones.', exampleChinese: '新的税费影响进口商品。',
  },
  arancel: {
    lemma: 'arancel', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El país redujo el arancel sobre ese producto.', exampleChinese: '该国降低了这种产品的关税。',
  },
  monopolio: {
    lemma: 'monopolio', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La autoridad investigó un posible monopolio.', exampleChinese: '主管机构调查了可能存在的垄断。',
  },
  cotización: {
    lemma: 'cotización', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La cotización cayó tras el anuncio.', exampleChinese: '公告发布后，行情下跌。',
  },
  morosidad: {
    lemma: 'morosidad', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El banco vigila el aumento de la morosidad.', exampleChinese: '银行关注逾期率上升。',
  },
  intermediario: {
    lemma: 'intermediario', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El intermediario cobró una comisión elevada.', exampleChinese: '中间商收取了高额佣金。',
  },
  microorganismo: {
    lemma: 'microorganismo', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El laboratorio aisló un microorganismo desconocido.', exampleChinese: '实验室分离出一种未知微生物。',
  },
  epidermis: {
    lemma: 'epidermis', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La epidermis protege las capas internas de la piel.', exampleChinese: '表皮保护皮肤的内部层。',
  },
  cromosoma: {
    lemma: 'cromosoma', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'Cada cromosoma contiene numerosos genes.', exampleChinese: '每条染色体都包含许多基因。',
  },
  neuronal: {
    lemma: 'neuronal', partOfSpeech: 'adjective', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La actividad neuronal cambia durante el sueño.', exampleChinese: '神经元活动在睡眠期间会发生变化。',
  },
  molecular: {
    lemma: 'molecular', partOfSpeech: 'adjective', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El análisis molecular identificó la variante.', exampleChinese: '分子分析识别出了该变体。',
  },
  patente: {
    lemma: 'patente', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La universidad registró una patente.', exampleChinese: '大学登记了一项专利。',
  },
  incógnita: {
    lemma: 'incógnita', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El origen del fallo sigue siendo una incógnita.', exampleChinese: '故障原因仍是一个未解之谜。',
  },
  ecuación: {
    lemma: 'ecuación', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La ecuación tiene dos soluciones.', exampleChinese: '这个方程有两个解。',
  },
  algoritmo: {
    lemma: 'algoritmo', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El algoritmo ordena los resultados por relevancia.', exampleChinese: '算法按相关性对结果排序。',
  },
  analítico: {
    lemma: 'analítico', partOfSpeech: 'adjective', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El método analítico distingue varias etapas.', exampleChinese: '分析方法区分出多个阶段。',
  },
  metrópoli: {
    lemma: 'metrópoli', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La metrópoli atrae población de toda la región.', exampleChinese: '这座大都市吸引着整个地区的人口。',
  },
  transeúnte: {
    lemma: 'transeúnte', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'Un transeúnte avisó a la policía.', exampleChinese: '一名过路人通知了警方。',
  },
  viandante: {
    lemma: 'viandante', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El viandante cruzó por el paso señalizado.', exampleChinese: '行人从有标识的人行横道过街。',
  },
  bocacalle: {
    lemma: 'bocacalle', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La tienda está en la siguiente bocacalle.', exampleChinese: '商店在下一个街口。',
  },
  calzada: {
    lemma: 'calzada', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La calzada quedó cerrada al tráfico.', exampleChinese: '车行道已禁止车辆通行。',
  },
  arrabal: {
    lemma: 'arrabal', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El antiguo arrabal quedó integrado en la ciudad.', exampleChinese: '旧城郊区已融入城市。',
  },
  descampado: {
    lemma: 'descampado', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'Construyeron viviendas en el antiguo descampado.', exampleChinese: '他们在原来的城市空地上建造了住房。',
  },
  parcela: {
    lemma: 'parcela', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La parcela se destinará a un parque público.', exampleChinese: '这块地将用于建设公共公园。',
  },
  urbanístico: {
    lemma: 'urbanístico', partOfSpeech: 'adjective', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El plan urbanístico reserva espacio para zonas verdes.', exampleChinese: '城市规划为绿地预留了空间。',
  },
  inmediaciones: {
    lemma: 'inmediación', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'No se puede aparcar en las inmediaciones del estadio.', exampleChinese: '体育场附近禁止停车。',
  },
  sílabo: {
    lemma: 'sílabo', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El sílabo detalla los objetivos y las lecturas.', exampleChinese: '课程纲要详细列出了目标和阅读材料。',
  },
  claustro: {
    lemma: 'claustro', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El claustro aprobó el nuevo plan docente.', exampleChinese: '教师委员会批准了新的教学计划。',
  },
  pedagogía: {
    lemma: 'pedagogía', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La pedagogía del curso prioriza la práctica.', exampleChinese: '这门课程的教学理念优先重视实践。',
  },
  didáctica: {
    lemma: 'didáctica', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La didáctica de lenguas combina teoría y práctica.', exampleChinese: '语言教学法结合理论与实践。',
  },
  erudición: {
    lemma: 'erudición', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'Su erudición no impide que escriba con claridad.', exampleChinese: '他的博学并不妨碍他清晰写作。',
  },
  retórica: {
    lemma: 'retórica', partOfSpeech: 'noun', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La retórica del discurso ocultó la falta de propuestas.', exampleChinese: '演讲中的华丽辞藻掩盖了缺少具体提议的问题。',
  },
  canon: {
    lemma: 'canon', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La autora cuestiona el canon literario tradicional.', exampleChinese: '这位作者质疑传统文学经典体系。',
  },
  legado: {
    lemma: 'legado', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La exposición revisa el legado de la vanguardia.', exampleChinese: '展览重新审视先锋派的文化遗产。',
  },
  vanguardia: {
    lemma: 'vanguardia', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La artista se situó a la vanguardia del movimiento.', exampleChinese: '这位艺术家处于该运动的前沿。',
  },
  mecenazgo: {
    lemma: 'mecenazgo', partOfSpeech: 'noun', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El museo depende en parte del mecenazgo privado.', exampleChinese: '博物馆部分依赖私人艺术赞助。',
  },
  aflorar: {
    lemma: 'aflorar', partOfSpeech: 'verb', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'Las tensiones pueden aflorar durante la negociación.', exampleChinese: '紧张关系可能在谈判期间显露出来。',
  },
  emerger: {
    lemma: 'emerger', partOfSpeech: 'verb', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'Nuevas prioridades empezaron a emerger.', exampleChinese: '新的优先事项开始出现。',
  },
  instaurar: {
    lemma: 'instaurar', partOfSpeech: 'verb', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El gobierno pretende instaurar un nuevo sistema.', exampleChinese: '政府打算建立一个新制度。',
  },
  suprimir: {
    lemma: 'suprimir', partOfSpeech: 'verb', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La reforma propone suprimir ese requisito.', exampleChinese: '改革建议取消这项要求。',
  },
  rebatir: {
    lemma: 'rebatir', partOfSpeech: 'verb', frameworkReference: C1_C2_FUNCTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'El informe aporta datos para rebatir la acusación.', exampleChinese: '报告提供了反驳指控的数据。',
  },
  desmentir: {
    lemma: 'desmentir', partOfSpeech: 'verb', frameworkReference: C1_C2_FUNCTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La empresa tuvo que desmentir el rumor.', exampleChinese: '公司不得不辟谣。',
  },
  acallar: {
    lemma: 'acallar', partOfSpeech: 'verb', frameworkReference: C1_C2_FUNCTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La presión no logró acallar las críticas.', exampleChinese: '压力未能压制批评声音。',
  },
  surtir: {
    lemma: 'surtir', partOfSpeech: 'verb', frameworkReference: C1_C2_GENERAL_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La medida empezó a surtir efecto.', exampleChinese: '这项措施开始产生效果。',
  },
  patentar: {
    lemma: 'patentar', partOfSpeech: 'verb', frameworkReference: C1_C2_SPECIFIC_NOTIONS, reviewKey: C2_REVIEW_KEY,
    example: 'La empresa decidió patentar el procedimiento.', exampleChinese: '公司决定为该流程申请专利。',
  },
}
