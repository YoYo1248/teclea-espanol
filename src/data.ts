import { commonDecks } from './commonWords'
import { intermediateDecks } from './intermediateWords'

export type LessonLevel = 'A1' | 'A2' | 'B1' | 'B2'
export type LessonScene = '基础' | '日常' | '餐厅' | '旅行' | '购物' | '住宿' | '时间' | '家庭' | '城市' | '健康' | '学习' | '工作' | '社会' | '科技' | '环境' | '行政' | '情绪'
export type LessonKind = '单词' | '短语' | '动词原形'

export type LessonWord = {
  spanish: string
  chinese: string
  reviewKey?: string
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

export type Lesson = {
  id: string
  level: LessonLevel
  scene: LessonScene
  kind: LessonKind
  eyebrow: string
  title: string
  description: string
  color: string
  words: LessonWord[]
}

export const WORD_SOURCE = {
  name: 'Kaikki / English Wiktionary',
  url: 'https://kaikki.org/dictionary/Spanish/index.html',
  license: 'CC BY-SA 4.0 / GFDL',
  checkedAt: '2026-08-14',
} as const

export const FREQUENCY_SOURCE = {
  name: 'wordfreq + Kaikki / Wiktionary',
  url: 'https://github.com/rspeer/wordfreq',
  license: 'CC BY-SA 4.0（数据）',
  checkedAt: '2026-08-14',
} as const

export const PHRASE_SOURCE = {
  name: 'Teclea Español 生活表达教学编辑',
  url: 'https://github.com/YoYo1248/teclea-espanol/blob/main/docs/WORDLIST_SOURCES.md',
  license: 'GPL-3.0（原创教学内容）',
  checkedAt: '2026-08-14',
} as const

export const INTERMEDIATE_SOURCE = {
  name: 'Teclea Español B1–B2 教学选词 · 参考 Instituto Cervantes PCIC',
  url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_b1-b2.htm',
  license: 'PCIC 课程框架参考；中文释义与教学编组 GPL-3.0',
  checkedAt: '2026-08-17',
} as const

function word(
  spanish: string,
  chinese: string,
  example: string,
  exampleChinese: string,
  options: { article?: string; note?: string } = {},
): LessonWord {
  return { spanish, chinese, example, exampleChinese, ...options, source: { ...WORD_SOURCE } }
}

const dialogueLessons: Lesson[] = [
  {
    id: 'primeros-pasos', level: 'A1', scene: '基础', kind: '短语', eyebrow: 'A1 · 短语 · 基础', title: '初次见面',
    description: '问候、感谢和最常用的开场白', color: '#ef6a4c',
    words: [
      word('hola', '你好', 'Hola, ¿cómo estás?', '你好，你怎么样？'),
      word('gracias', '谢谢', 'Muchas gracias por tu ayuda.', '非常感谢你的帮助。'),
      word('por favor', '请', 'Un café, por favor.', '请给我一杯咖啡。'),
      word('perdón', '对不起 / 劳驾', 'Perdón, ¿dónde está el metro?', '劳驾，地铁在哪里？', { note: '重音在最后一个音节：-dón' }),
      word('encantado', '很高兴认识你（男性说）', 'Encantado de conocerte.', '很高兴认识你。', { note: '女性通常说 encantada' }),
      word('adiós', '再见', 'Adiós, hasta mañana.', '再见，明天见。'),
      word('bienvenido', '欢迎（男性）', 'Bienvenido a Madrid.', '欢迎来到马德里。', { note: '女性通常说 bienvenida' }),
      word('hasta luego', '回头见', 'Hasta luego, Ana.', '回头见，安娜。'),
    ],
  },
  {
    id: 'cada-dia', level: 'A1', scene: '日常', kind: '短语', eyebrow: 'A1 · 短语 · 日常', title: '每天都用',
    description: '一天的节奏和日常生活搭配', color: '#3d7b69',
    words: [
      word('en casa', '在家', 'Hoy trabajo en casa.', '我今天在家工作。'),
      word('al trabajo', '去上班 / 到工作地点', 'Voy al trabajo a las ocho.', '我八点去上班。', { note: 'al = a + el' }),
      word('todos los días', '每天', 'Camino todos los días.', '我每天走路。'),
      word('por la mañana', '在早上', 'Estudio por la mañana.', '我早上学习。', { note: 'ñ 是独立字母，不等于 n' }),
      word('por la tarde', '在下午', 'Trabajo por la tarde.', '我下午工作。'),
      word('por la noche', '在晚上', 'Leo por la noche.', '我晚上读书。'),
      word('con mi familia', '和我的家人一起', 'Ceno con mi familia.', '我和家人一起吃晚饭。'),
      word('tiempo libre', '空闲时间', 'Tengo poco tiempo libre.', '我的空闲时间很少。'),
    ],
  },
  {
    id: 'en-el-restaurante', level: 'A1', scene: '餐厅', kind: '短语', eyebrow: 'A1 · 短语 · 餐厅', title: '点餐吃饭',
    description: '看菜单、点饮料和结账', color: '#bd7653',
    words: [
      word('el menú', '菜单', '¿Me trae el menú, por favor?', '请把菜单给我好吗？', { article: 'el' }),
      word('la mesa', '桌子', 'Una mesa para dos, por favor.', '请给我们一张两人桌。', { article: 'la' }),
      word('el agua', '水', 'Quiero una botella de agua.', '我想要一瓶水。', { article: 'el', note: 'agua 是阴性名词，单数前常用 el' }),
      word('el café', '咖啡', 'Tomo un café con leche.', '我要一杯牛奶咖啡。', { article: 'el' }),
      word('la cuenta', '账单', 'La cuenta, por favor.', '请结账。', { article: 'la' }),
      word('buen provecho', '祝你用餐愉快', 'Buen provecho a todos.', '祝大家用餐愉快。'),
      word('sin azúcar', '不加糖', 'Un té sin azúcar.', '一杯不加糖的茶。'),
      word('para llevar', '打包带走', 'Un café para llevar, por favor.', '请给我一杯外带咖啡。'),
    ],
  },
  {
    id: 'de-viaje', level: 'A2', scene: '旅行', kind: '短语', eyebrow: 'A2 · 短语 · 旅行', title: '交通与问路',
    description: '车站、方向和旅途中的需求', color: '#4f6fae',
    words: [
      word('todo recto', '一直走', 'Siga todo recto.', '请一直走。'),
      word('a la derecha', '在右边 / 向右', 'Gira a la derecha.', '向右转。'),
      word('a la izquierda', '在左边 / 向左', 'Está a la izquierda.', '它在左边。'),
      word('la estación', '车站', 'La estación está lejos.', '车站很远。', { article: 'la' }),
      word('el billete', '票', 'Quiero un billete a Madrid.', '我想要一张去马德里的票。', { article: 'el' }),
      word('el andén', '站台', 'El tren sale del andén cuatro.', '火车从四号站台出发。', { article: 'el' }),
      word('el equipaje', '行李', 'Mi equipaje es muy pesado.', '我的行李很重。', { article: 'el' }),
      word('ida y vuelta', '往返', 'Necesito un billete de ida y vuelta.', '我需要一张往返票。'),
    ],
  },
  {
    id: 'de-compras', level: 'A2', scene: '购物', kind: '短语', eyebrow: 'A2 · 短语 · 购物', title: '购物付款',
    description: '价格、尺寸、试穿和付款', color: '#9a6a9e',
    words: [
      word('me lo llevo', '我买了 / 我带走', 'Me gusta; me lo llevo.', '我喜欢，我买了。'),
      word('muy barato', '很便宜', 'Este bolso es muy barato.', '这个包很便宜。'),
      word('demasiado caro', '太贵了', 'Me parece demasiado caro.', '我觉得太贵了。'),
      word('la talla', '尺码', '¿Tiene una talla más grande?', '有大一码的吗？', { article: 'la' }),
      word('me lo pruebo', '我试穿一下', 'Me lo pruebo antes de pagar.', '我付款前试穿一下。'),
      word('la tarjeta', '银行卡', 'Voy a pagar con tarjeta.', '我要刷卡付款。', { article: 'la' }),
      word('el efectivo', '现金', 'Solo aceptan efectivo.', '这里只收现金。', { article: 'el' }),
      word('el recibo', '收据', '¿Necesita el recibo?', '您需要收据吗？', { article: 'el' }),
    ],
  },
  {
    id: 'en-el-hotel', level: 'A2', scene: '住宿', kind: '短语', eyebrow: 'A2 · 短语 · 住宿', title: '酒店入住',
    description: '预订、入住和客房需求', color: '#337b85',
    words: [
      word('la reserva', '预订', 'Tengo una reserva a nombre de Li.', '我用李的名字订了房。', { article: 'la' }),
      word('la habitación', '房间', 'La habitación está en el segundo piso.', '房间在二楼。', { article: 'la' }),
      word('la llave', '钥匙', 'Aquí tiene la llave.', '这是您的钥匙。', { article: 'la' }),
      word('el desayuno', '早餐', '¿A qué hora es el desayuno?', '早餐几点开始？', { article: 'el' }),
      word('una noche', '一晚', 'Nos quedamos una noche.', '我们住一晚。'),
      word('habitación disponible', '空房 / 可用房间', '¿Hay una habitación disponible?', '有空房吗？'),
      word('el ascensor', '电梯', 'El ascensor está al fondo.', '电梯在最里面。', { article: 'el' }),
      word('salida tardía', '延迟退房', '¿Es posible una salida tardía?', '可以延迟退房吗？'),
    ],
  },
]


const commonLevelOverrides: Record<string, LessonLevel> = Object.fromEntries([
  // Instituto Cervantes places basic transport and travel objects in A1.
  'viaje', 'estación', 'aeropuerto', 'tren', 'autobús', 'metro', 'taxi', 'coche', 'avión', 'billete',
  'maleta', 'equipaje', 'mapa', 'hotel', 'reserva', 'pasaporte', 'andén', 'asiento', 'ida', 'vuelta',
  // Basic shopping, study, work and classroom language used from the first level.
  'precio', 'dinero', 'tarjeta', 'barato', 'caro', 'grande', 'pequeño', 'talla', 'color', 'rojo',
  'azul', 'blanco', 'negro', 'nuevo', 'libro', 'página', 'palabra', 'pregunta', 'idioma', 'español',
  'chino', 'inglés', 'clase', 'profesor', 'profesora', 'estudiante', 'ejemplo', 'fácil', 'difícil',
  'trabajo', 'oficina', 'empresa', 'jefe', 'compañero', 'correo', 'mensaje', 'información', 'fecha',
  'ojo', 'boca', 'salud', 'médico', 'enfermo', 'mal', 'ayuda', 'tomar', 'llevar', 'necesitar', 'usar', 'comprar', 'pagar', 'pedir', 'abrir',
  'cerrar', 'leer', 'escribir', 'escuchar', 'entender',
].map((word) => [word, 'A1']))

function balancedBatches<T>(items: T[], maximumSize = 10) {
  const batchCount = Math.ceil(items.length / maximumSize)
  if (!batchCount) return []
  const baseSize = Math.floor(items.length / batchCount)
  const largerBatchCount = items.length % batchCount
  let cursor = 0
  return Array.from({ length: batchCount }, (_, index) => {
    const size = baseSize + (index < largerBatchCount ? 1 : 0)
    const batch = items.slice(cursor, cursor + size)
    cursor += size
    return batch
  })
}

const commonLessons: Lesson[] = commonDecks.flatMap((deck, deckIndex) => {
  const lessonKind: LessonKind = deck.id.startsWith('common-actions-') ? '动词原形' : deck.id === 'common-dialogue' ? '短语' : '单词'
  const leveledWords = deck.words.map(([spanish, chinese]) => ({
    spanish,
    chinese,
    level: deck.id === 'common-dialogue' ? 'A1' as const : commonLevelOverrides[spanish] ?? deck.level,
  }))

  return (['A1', 'A2'] as const).flatMap((level) => {
    const levelWords = leveledWords.filter((word) => word.level === level)
    const batches = balancedBatches(levelWords)
    return batches.map((batch, batchIndex) => ({
      id: `${deck.id}-${level.toLowerCase()}-${batchIndex + 1}`,
      level,
      scene: deck.scene,
      kind: lessonKind,
      eyebrow: `${level} · ${lessonKind} · ${deck.scene}`,
      title: `${deck.title} · ${level}${batches.length > 1 ? `-${batchIndex + 1}` : ''}`,
      description: `${deck.description} · ${batch.length} 项`,
      color: ['#d46d4f', '#437e6d', '#516fa6', '#936a91'][deckIndex % 4],
      words: batch.map(({ spanish, chinese }) => ({ spanish, chinese, source: { ...FREQUENCY_SOURCE } })),
    }))
  })
})

const intermediateNonVerbsEndingLikeInfinitives = new Set(['alquiler', 'bienestar'])

function isStandaloneInfinitive(spanish: string, declaredKind: LessonKind) {
  if (declaredKind === '动词原形') return true
  const target = spanish.toLocaleLowerCase('es-ES').normalize('NFC').trim()
  if (target.includes(' ') || intermediateNonVerbsEndingLikeInfinitives.has(target)) return false
  return /(?:ar|er|ir|arse|erse|irse)$/u.test(target)
}

const unmergedIntermediateLessons: Lesson[] = intermediateDecks.flatMap((deck, deckIndex) => {
  const retainedWords = deck.kind === '动词原形'
    ? deck.words
    : deck.words.filter(([spanish]) => !isStandaloneInfinitive(spanish, deck.kind))
  if (!retainedWords.length) return []
  return [{
    id: deck.id,
    level: deck.level,
    scene: deck.scene,
    kind: deck.kind,
    eyebrow: `${deck.level} · ${deck.kind} · ${deck.scene}`,
    title: deck.title,
    description: `${deck.description} · ${retainedWords.length} 项`,
    color: ['#a85f45', '#3f7569', '#4c699d', '#82628e'][deckIndex % 4],
    words: retainedWords.map(([spanish, chinese]) => ({ spanish, chinese, source: { ...INTERMEDIATE_SOURCE } })),
  }]
})

function combineIntermediateLessons(
  firstId: string,
  secondId: string,
  details: Pick<Lesson, 'id' | 'scene' | 'title' | 'description'>,
) {
  const first = unmergedIntermediateLessons.find((lesson) => lesson.id === firstId)!
  const second = unmergedIntermediateLessons.find((lesson) => lesson.id === secondId)!
  return {
    ...first,
    ...details,
    eyebrow: `${first.level} · ${first.kind} · ${details.scene}`,
    words: [...first.words, ...second.words],
  }
}

const mergedIntermediateIds = new Set(['b1-education', 'b1-media-tech', 'b2-wellbeing', 'b2-core-nuance'])
const intermediateMainLessons: Lesson[] = [
  ...unmergedIntermediateLessons.filter((lesson) => !mergedIntermediateIds.has(lesson.id)),
  combineIntermediateLessons('b1-education', 'b1-media-tech', {
    id: 'b1-learning-digital',
    scene: '学习',
    title: '学习与数字生活',
    description: '课程、考试和日常数字工具 · 11 项',
  }),
  combineIntermediateLessons('b2-wellbeing', 'b2-core-nuance', {
    id: 'b2-wellbeing-judgment',
    scene: '情绪',
    title: '身心状态与精确判断',
    description: '谈压力、支持和更精确的状态判断 · 10 项',
  }),
]

const extractedIntermediateVerbLessons: Lesson[] = (['B1', 'B2'] as const).flatMap((level) => {
  const verbWords = intermediateDecks
    .filter((deck) => deck.level === level && deck.kind !== '动词原形')
    .flatMap((deck) => deck.words.filter(([spanish]) => isStandaloneInfinitive(spanish, deck.kind)))
  const batches = balancedBatches(verbWords)
  return batches.map((batch, batchIndex) => ({
    id: `${level.toLowerCase()}-practical-verbs-${batchIndex + 1}`,
    level,
    scene: '日常',
    kind: '动词原形',
    eyebrow: `${level} · 动词原形 · 专项`,
    title: `常用动词专项 · ${level}-${batchIndex + 1}`,
    description: `从工作、学习与日常表达中整理的常用原形 · ${batch.length} 项`,
    color: level === 'B1' ? '#3f7569' : '#82628e',
    words: batch.map(([spanish, chinese]) => ({ spanish, chinese, source: { ...INTERMEDIATE_SOURCE } })),
  }))
})

const intermediateLessons: Lesson[] = [...intermediateMainLessons, ...extractedIntermediateVerbLessons]

export const lessons: Lesson[] = [...dialogueLessons, ...commonLessons, ...intermediateLessons]
export const totalPracticeCards = lessons.reduce((sum, lesson) => sum + lesson.words.length, 0)
export const lessonLevels: Array<'全部' | LessonLevel> = ['全部', 'A1', 'A2', 'B1', 'B2']
export const lessonScenes: Array<'全部' | LessonScene> = ['全部', '基础', '日常', '时间', '家庭', '餐厅', '城市', '旅行', '购物', '住宿', '健康', '学习', '工作', '社会', '科技', '环境', '行政', '情绪']
