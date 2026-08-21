import { advancedDecks, advancedFrameworkReferences, advancedWordMetadata } from './advancedWords'
import { advancedEditorialMetadata } from './advancedEditorialMetadata'
import { commonDecks } from './commonWords'
import { examGapDecks } from './examWords'
import { canonicalArticleByTarget, canonicalEditorialMetadata, canonicalUsageNoteByTarget } from './editorialMetadata'
import { intermediateDecks } from './intermediateWords'
import { intermediateEditorialMetadata } from './intermediateEditorialMetadata'
import { legacyFrameworkMetadata, legacyLexicalMetadata } from './legacyLexicalMetadata'
import { expansionDecks } from './lexiconExpansion'
import { newcomerDecks } from './newcomerWords'
import { vidaMobilityTargets } from './vidaMobility'
import { vidaSettlingTargets } from './vidaSettling'
import { vidaDailyTargets } from './vidaDaily'
import { vidaSupermarketDecks, vidaSupermarketExistingTargets, type ContentAccess, type LexiconRoute, type LifeModule, type LifePlacement, type LifeTier } from './vidaWords'

export type LessonLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type LessonScene = '基础' | '日常' | '餐厅' | '旅行' | '购物' | '住宿' | '时间' | '家庭' | '城市' | '健康' | '学习' | '工作' | '社会' | '科技' | '环境' | '行政' | '情绪'
export type LessonKind = '单词' | '短语' | '动词原形'

export type LessonWord = {
  spanish: string
  chinese: string
  practiceId?: string
  lemma?: string
  partOfSpeech?: 'noun' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'conjunction' | 'verb' | 'numeral' | 'fixed-expression'
  frequencyRank?: number
  frameworkReference?: string
  reviewKey?: string
  article?: string
  example?: string
  exampleChinese?: string
  note?: string
  routes?: LexiconRoute[]
  lifeModule?: LifeModule
  lifeTier?: LifeTier
  access?: ContentAccess
  lifePlacements?: LifePlacement[]
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

export const ADVANCED_SOURCE = {
  name: 'Teclea Español C1–C2 候选教学选词 · 参考 Instituto Cervantes PCIC',
  url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_c1-c2.htm',
  license: 'PCIC 课程框架参考；中文释义与教学编组 GPL-3.0',
  checkedAt: '2026-08-19',
} as const

export const EXPANSION_SOURCE = {
  name: 'Teclea Español 扩库批次 · wordfreq + PCIC 编辑映射',
  url: 'https://github.com/YoYo1248/teclea-espanol/blob/main/docs/lexicon/PIPELINE.md',
  license: '频率与词典数据依各来源许可；中文释义、例句与编组 GPL-3.0',
  checkedAt: '2026-08-20',
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
    description: '祝餐、特殊需求和外带表达', color: '#bd7653',
    words: [
      word('buen provecho', '祝你用餐愉快', 'Buen provecho a todos.', '祝大家用餐愉快。'),
      word('sin azúcar', '不加糖', 'Un té sin azúcar.', '一杯不加糖的茶。'),
      word('para llevar', '打包带走', 'Un café para llevar, por favor.', '请给我一杯外带咖啡。'),
    ],
  },
  {
    id: 'de-viaje', level: 'A2', scene: '旅行', kind: '短语', eyebrow: 'A2 · 短语 · 旅行', title: '交通与问路',
    description: '方向和往返票表达', color: '#4f6fae',
    words: [
      word('todo recto', '一直走', 'Siga todo recto.', '请一直走。'),
      word('a la derecha', '在右边 / 向右', 'Gira a la derecha.', '向右转。'),
      word('a la izquierda', '在左边 / 向左', 'Está a la izquierda.', '它在左边。'),
      word('ida y vuelta', '往返', 'Necesito un billete de ida y vuelta.', '我需要一张往返票。'),
    ],
  },
  {
    id: 'de-compras', level: 'A2', scene: '购物', kind: '短语', eyebrow: 'A2 · 短语 · 购物', title: '购物付款',
    description: '比较价格、试穿和做决定', color: '#9a6a9e',
    words: [
      word('me lo llevo', '我买了 / 我带走', 'Me gusta; me lo llevo.', '我喜欢，我买了。'),
      word('muy barato', '很便宜', 'Este bolso es muy barato.', '这个包很便宜。'),
      word('demasiado caro', '太贵了', 'Me parece demasiado caro.', '我觉得太贵了。'),
      word('me lo pruebo', '我试穿一下', 'Me lo pruebo antes de pagar.', '我付款前试穿一下。'),
    ],
  },
  {
    id: 'en-el-hotel', level: 'A2', scene: '住宿', kind: '短语', eyebrow: 'A2 · 短语 · 住宿', title: '酒店入住',
    description: '询问空房、设施和延迟退房', color: '#337b85',
    words: [
      word('habitación disponible', '空房 / 可用房间', '¿Hay una habitación disponible?', '有空房吗？'),
      word('ascensor', '电梯', 'El ascensor está al fondo.', '电梯在最里面。', { article: 'el' }),
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
    level: commonLevelOverrides[spanish] ?? deck.level,
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

const newcomerLessons: Lesson[] = newcomerDecks.map((deck, deckIndex) => ({
  id: deck.id,
  level: deck.level,
  scene: deck.scene,
  kind: deck.kind,
  eyebrow: `${deck.level} · ${deck.kind} · ${deck.scene}`,
  title: deck.title,
  description: `${deck.description} · ${deck.words.length} 项`,
  color: ['#397868', '#566fa3', '#9a6b55', '#78658f'][deckIndex % 4],
  words: deck.words.map(({ spanish, chinese, example, exampleChinese, note }) => ({
    spanish,
    chinese,
    example,
    exampleChinese,
    note,
    source: { ...deck.source },
  })),
}))

const advancedLessons: Lesson[] = advancedDecks.map((deck, deckIndex) => ({
  id: deck.id,
  level: deck.level,
  scene: deck.scene,
  kind: deck.kind,
  eyebrow: `${deck.level} · ${deck.kind} · ${deck.scene}`,
  title: deck.title,
  description: `${deck.description} · ${deck.words.length} 项`,
  color: ['#79564e', '#426e68', '#53648d', '#765d82'][deckIndex % 4],
  words: deck.words.map(([spanish, chinese]) => ({
    spanish,
    chinese,
    ...advancedWordMetadata[spanish],
    reviewKey: advancedWordMetadata[spanish] ? 'advanced-editorial-batch-001' : undefined,
    frameworkReference: advancedFrameworkReferences[deck.level],
    source: { ...ADVANCED_SOURCE },
  })),
}))

const expansionLessons: Lesson[] = expansionDecks.map((deck, deckIndex) => ({
  id: deck.id,
  level: deck.level,
  scene: deck.scene,
  kind: '单词',
  eyebrow: `${deck.level} · 单词 · ${deck.scene}`,
  title: deck.title,
  description: `${deck.description} · ${deck.words.length} 项`,
  color: ['#d46d4f', '#437e6d', '#516fa6', '#936a91'][deckIndex % 4],
  words: deck.words.map(({ spanish, chinese, example, exampleChinese, lemma, partOfSpeech, frequencyRank }) => ({
    spanish,
    chinese,
    example,
    exampleChinese,
    lemma,
    partOfSpeech,
    frequencyRank,
    frameworkReference: deck.frameworkReference,
    source: { ...EXPANSION_SOURCE },
  })),
}))

const examGapLessons: Lesson[] = examGapDecks.map((deck, deckIndex) => ({
  id: deck.id,
  level: deck.level,
  scene: deck.scene,
  kind: deck.kind,
  eyebrow: `${deck.level} · ${deck.kind} · ${deck.scene}`,
  title: deck.title,
  description: `${deck.description} · ${deck.words.length} 项`,
  color: ['#516fa6', '#426e68', '#79564e'][deckIndex % 3],
  words: deck.words.map((word) => ({
    ...word,
    reviewKey: deck.reviewKey,
    frameworkReference: deck.frameworkReference,
    source: { ...deck.source },
  })),
}))

const vidaLessons: Lesson[] = vidaSupermarketDecks.map((deck, deckIndex) => ({
  id: deck.id,
  level: deck.level,
  scene: deck.scene,
  kind: deck.kind,
  eyebrow: `${deck.level} · ${deck.kind} · ${deck.scene}`,
  title: deck.title,
  description: `${deck.description} · ${deck.words.length} 项`,
  color: ['#d46d4f', '#437e6d', '#516fa6', '#936a91'][deckIndex % 4],
  words: deck.words.map(({ routes, ...word }) => ({
    ...word,
    routes,
    reviewKey: deck.reviewKey,
    lifeModule: deck.lifeModule,
    lifeTier: deck.lifeTier,
    access: deck.access,
    lifePlacements: [{ module: deck.lifeModule, tier: deck.lifeTier, access: deck.access }],
    frameworkReference: deck.frameworkReference,
    source: { ...deck.source },
  })),
}))

const catalogLessons: Lesson[] = [...dialogueLessons, ...commonLessons, ...intermediateLessons, ...newcomerLessons, ...advancedLessons, ...expansionLessons, ...examGapLessons, ...vidaLessons]
const normalizeCatalogTarget = (spanish: string) => spanish.toLocaleLowerCase('es-ES').normalize('NFC').replace(/[¿?¡!.,;:]/g, '').replace(/\s+/g, ' ').trim()
type VidaExistingOverlay = LifePlacement & { spanish: string; example?: string; exampleChinese?: string }
const vidaExistingTargets: VidaExistingOverlay[] = [
  ...vidaSupermarketExistingTargets.map((item) => ({ ...item, module: 'supermarket' as const, tier: item.lifeTier })),
  ...vidaMobilityTargets,
  ...vidaSettlingTargets,
  ...vidaDailyTargets,
]
const vidaExistingTargetsBySpanish = new Map<string, typeof vidaExistingTargets>()
for (const item of vidaExistingTargets) {
  const target = normalizeCatalogTarget(item.spanish)
  vidaExistingTargetsBySpanish.set(target, [...(vidaExistingTargetsBySpanish.get(target) ?? []), item])
}

export const lessons: Lesson[] = catalogLessons.map((lesson) => ({
  ...lesson,
  words: lesson.words.map((word) => {
    const target = normalizeCatalogTarget(word.spanish)
    const editorialWord = {
      ...word,
      ...canonicalEditorialMetadata[target],
      ...intermediateEditorialMetadata[target],
      ...advancedEditorialMetadata[target],
      ...(legacyLexicalMetadata[word.spanish] ?? legacyLexicalMetadata[target]),
      ...(legacyFrameworkMetadata[word.spanish] ?? legacyFrameworkMetadata[target]),
      article: word.article ?? canonicalArticleByTarget[target],
      note: word.note ?? canonicalUsageNoteByTarget[target],
    }
    const inferredPartOfSpeech = editorialWord.partOfSpeech
      ?? (lesson.kind === '短语' || target.includes(' ') ? 'fixed-expression' : lesson.kind === '动词原形' ? 'verb' : undefined)
    const structuredWord = {
      ...editorialWord,
      lemma: editorialWord.lemma ?? (inferredPartOfSpeech ? target : undefined),
      partOfSpeech: inferredPartOfSpeech,
    }
    const existingRoutes = structuredWord.routes ?? ['exam']
    const vidaOverlays = vidaExistingTargetsBySpanish.get(target) ?? []
    const existingPlacements = structuredWord.lifePlacements ?? (structuredWord.lifeModule && structuredWord.lifeTier && structuredWord.access
      ? [{ module: structuredWord.lifeModule, tier: structuredWord.lifeTier, access: structuredWord.access }]
      : [])
    const placements = [...existingPlacements]
    for (const overlay of vidaOverlays) {
      if (!placements.some((placement) => placement.module === overlay.module)) {
        placements.push({ module: overlay.module, tier: overlay.tier, access: overlay.access })
      }
    }
    if (!placements.length) return { ...structuredWord, routes: existingRoutes }
    const primaryPlacement = placements[0]
    const exampleOverlay = vidaOverlays.find((overlay) => overlay.example)
    return {
      ...structuredWord,
      routes: [...new Set([...existingRoutes, 'life' as const])],
      lifeModule: primaryPlacement.module,
      lifeTier: primaryPlacement.tier,
      access: primaryPlacement.access,
      lifePlacements: placements,
      example: structuredWord.example ?? exampleOverlay?.example,
      exampleChinese: structuredWord.exampleChinese ?? exampleOverlay?.exampleChinese,
    }
  }),
}))

export function lessonsForRoute(route: LexiconRoute) {
  return lessons.flatMap((lesson) => {
    const words = lesson.words.filter((word) => word.routes?.includes(route))
    return words.length ? [{ ...lesson, words }] : []
  })
}

export function lessonsForLifeModule(module: LifeModule) {
  return lessons.flatMap((lesson) => {
    const words = lesson.words.filter((word) => word.lifePlacements?.some((placement) => placement.module === module))
    return words.length ? [{ ...lesson, words }] : []
  })
}

export const examLessons = lessonsForRoute('exam')
export const lifeLessons = lessonsForRoute('life')
export const totalPracticeCards = lessons.reduce((sum, lesson) => sum + lesson.words.length, 0)
export const lessonLevels: Array<'全部' | LessonLevel> = ['全部', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']
export const lessonScenes: Array<'全部' | LessonScene> = ['全部', '基础', '日常', '时间', '家庭', '餐厅', '城市', '旅行', '购物', '住宿', '健康', '学习', '工作', '社会', '科技', '环境', '行政', '情绪']
