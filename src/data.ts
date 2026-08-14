import conjugations from './generated/conjugations.json'
import { commonDecks } from './commonWords'
import { conjugationMeaning, englishMeaning } from './english'

export type LessonLevel = 'A1' | 'A2'
export type LessonScene = '基础' | '日常' | '餐厅' | '旅行' | '购物' | '住宿' | '时间' | '家庭' | '城市' | '健康' | '学习' | '工作' | '驾考' | '语法'
export type LessonKind = '对话' | '短句' | '高频' | '变位'

export type LessonWord = {
  spanish: string
  chinese: string
  english: string
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

export const DRIVING_SOURCE = {
  name: 'DGT 路考项目参考 + Teclea Español 教学编辑',
  url: 'https://www.dgt.es/nuestros-servicios/permisos-de-conducir/obtener-un-nuevo-permiso-de-conducir/examen-practico/',
  license: '官方资料参考；原创教学表达 GPL-3.0',
  checkedAt: '2026-08-14',
} as const

function word(
  spanish: string,
  chinese: string,
  example: string,
  exampleChinese: string,
  options: { article?: string; note?: string } = {},
): LessonWord {
  return { spanish, chinese, english: englishMeaning(spanish), example, exampleChinese, ...options, source: { ...WORD_SOURCE } }
}

function phrase(spanish: string, chinese: string, note?: string): LessonWord {
  return { spanish, chinese, english: englishMeaning(spanish), note, source: { ...PHRASE_SOURCE } }
}

function drivingPhrase(spanish: string, chinese: string, note?: string): LessonWord {
  return { spanish, chinese, english: englishMeaning(spanish), note, source: { ...DRIVING_SOURCE } }
}

const dialogueLessons: Lesson[] = [
  {
    id: 'primeros-pasos', level: 'A1', scene: '基础', kind: '对话', eyebrow: 'A1 · 对话 · 基础', title: '初次见面',
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
    id: 'cada-dia', level: 'A1', scene: '日常', kind: '对话', eyebrow: 'A1 · 对话 · 日常', title: '每天都用',
    description: '家、工作和生活里的高频动作', color: '#3d7b69',
    words: [
      word('la casa', '家 / 房子', 'Mi casa está cerca.', '我家在附近。', { article: 'la', note: '连同冠词一起记忆名词性别' }),
      word('el trabajo', '工作', 'Voy al trabajo a las ocho.', '我八点去上班。', { article: 'el' }),
      word('comer', '吃', 'Quiero comer algo.', '我想吃点东西。'),
      word('beber', '喝', 'Necesito beber agua.', '我需要喝水。'),
      word('mañana', '明天 / 早晨', 'Nos vemos mañana.', '我们明天见。', { note: 'ñ 是独立字母，不等于 n' }),
      word('también', '也', 'Yo también hablo español.', '我也会说西班牙语。'),
      word('dormir', '睡觉', 'Quiero dormir temprano.', '我想早点睡。'),
      word('la familia', '家庭 / 家人', 'Mi familia vive aquí.', '我的家人住在这里。', { article: 'la' }),
    ],
  },
  {
    id: 'en-el-restaurante', level: 'A1', scene: '餐厅', kind: '对话', eyebrow: 'A1 · 对话 · 餐厅', title: '点餐吃饭',
    description: '看菜单、点饮料和结账', color: '#bd7653',
    words: [
      word('el menú', '菜单', '¿Me trae el menú, por favor?', '请把菜单给我好吗？', { article: 'el' }),
      word('la mesa', '桌子', 'Una mesa para dos, por favor.', '请给我们一张两人桌。', { article: 'la' }),
      word('el agua', '水', 'Quiero una botella de agua.', '我想要一瓶水。', { article: 'el', note: 'agua 是阴性名词，单数前常用 el' }),
      word('el café', '咖啡', 'Tomo un café con leche.', '我要一杯牛奶咖啡。', { article: 'el' }),
      word('la cuenta', '账单', 'La cuenta, por favor.', '请结账。', { article: 'la' }),
      word('delicioso', '美味的', 'El arroz está delicioso.', '米饭很好吃。'),
      word('sin azúcar', '不加糖', 'Un té sin azúcar.', '一杯不加糖的茶。'),
      word('tengo hambre', '我饿了', 'Tengo hambre, vamos a comer.', '我饿了，我们去吃饭吧。'),
    ],
  },
  {
    id: 'de-viaje', level: 'A2', scene: '旅行', kind: '对话', eyebrow: 'A2 · 对话 · 旅行', title: '交通与问路',
    description: '车站、方向和旅途中的需求', color: '#4f6fae',
    words: [
      word('dónde', '在哪里', '¿Dónde está la estación?', '车站在哪里？', { note: '单词训练不考句子两端的 ¿ ?；例句仍保留' }),
      word('derecha', '右边', 'Gira a la derecha.', '向右转。'),
      word('izquierda', '左边', 'Está a la izquierda.', '它在左边。'),
      word('la estación', '车站', 'La estación está lejos.', '车站很远。', { article: 'la' }),
      word('el billete', '票', 'Quiero un billete a Madrid.', '我想要一张去马德里的票。', { article: 'el' }),
      word('el andén', '站台', 'El tren sale del andén cuatro.', '火车从四号站台出发。', { article: 'el' }),
      word('el equipaje', '行李', 'Mi equipaje es muy pesado.', '我的行李很重。', { article: 'el' }),
      word('ida y vuelta', '往返', 'Necesito un billete de ida y vuelta.', '我需要一张往返票。'),
    ],
  },
  {
    id: 'de-compras', level: 'A2', scene: '购物', kind: '对话', eyebrow: 'A2 · 对话 · 购物', title: '购物付款',
    description: '价格、尺寸、试穿和付款', color: '#9a6a9e',
    words: [
      word('cuánto cuesta', '多少钱', '¿Cuánto cuesta esta camisa?', '这件衬衫多少钱？'),
      word('barato', '便宜的', 'Este bolso es barato.', '这个包很便宜。'),
      word('caro', '昂贵的', 'Me parece demasiado caro.', '我觉得太贵了。'),
      word('la talla', '尺码', '¿Tiene una talla más grande?', '有大一码的吗？', { article: 'la' }),
      word('probarse', '试穿', 'Quiero probarme estos zapatos.', '我想试穿这双鞋。'),
      word('la tarjeta', '银行卡', 'Voy a pagar con tarjeta.', '我要刷卡付款。', { article: 'la' }),
      word('el efectivo', '现金', 'Solo aceptan efectivo.', '这里只收现金。', { article: 'el' }),
      word('el recibo', '收据', '¿Necesita el recibo?', '您需要收据吗？', { article: 'el' }),
    ],
  },
  {
    id: 'en-el-hotel', level: 'A2', scene: '住宿', kind: '对话', eyebrow: 'A2 · 对话 · 住宿', title: '酒店入住',
    description: '预订、入住和客房需求', color: '#337b85',
    words: [
      word('la reserva', '预订', 'Tengo una reserva a nombre de Li.', '我用李的名字订了房。', { article: 'la' }),
      word('la habitación', '房间', 'La habitación está en el segundo piso.', '房间在二楼。', { article: 'la' }),
      word('la llave', '钥匙', 'Aquí tiene la llave.', '这是您的钥匙。', { article: 'la' }),
      word('el desayuno', '早餐', '¿A qué hora es el desayuno?', '早餐几点开始？', { article: 'el' }),
      word('una noche', '一晚', 'Nos quedamos una noche.', '我们住一晚。'),
      word('disponible', '有空的 / 可用的', '¿Hay una habitación disponible?', '有空房吗？'),
      word('el ascensor', '电梯', 'El ascensor está al fondo.', '电梯在最里面。', { article: 'el' }),
      word('salida tardía', '延迟退房', '¿Es posible una salida tardía?', '可以延迟退房吗？'),
    ],
  },
]

const phraseLessons: Lesson[] = [
  {
    id: 'frases-presentarse', level: 'A1', scene: '基础', kind: '短句', eyebrow: 'A1 · 短句 · 基础', title: '介绍自己',
    description: '姓名、国籍、住处和语言情况', color: '#d85f4b',
    words: [
      phrase('Me llamo Ana.', '我叫安娜。'),
      phrase('Mi apellido es Li.', '我姓李。'),
      phrase('Soy de China.', '我来自中国。'),
      phrase('Vivo en Madrid.', '我住在马德里。'),
      phrase('Tengo treinta años.', '我三十岁。'),
      phrase('¿Cómo te llamas?', '你叫什么名字？'),
      phrase('¿Cuál es tu apellido?', '你姓什么？'),
      phrase('¿De dónde eres?', '你来自哪里？'),
      phrase('¿Dónde vives?', '你住在哪里？'),
      phrase('¿Cómo se escribe?', '这个怎么拼写？'),
      phrase('¿Puedes repetirlo?', '你可以再说一遍吗？'),
      phrase('Estoy aprendiendo español.', '我正在学习西班牙语。'),
    ],
  },
  {
    id: 'frases-contacto-fechas', level: 'A1', scene: '时间', kind: '短句', eyebrow: 'A1 · 短句 · 时间', title: '电话、生日与约时间',
    description: '交换联系方式，说日期和约见面', color: '#4d806f',
    words: [
      phrase('¿Cuál es tu número de teléfono?', '你的电话号码是多少？'),
      phrase('Mi número de teléfono es...', '我的电话号码是……', '练熟句型后，把结尾换成自己的号码'),
      phrase('¿Me das tu número?', '可以把你的号码给我吗？'),
      phrase('Te mando un mensaje.', '我给你发一条消息。'),
      phrase('¿Cuál es tu correo electrónico?', '你的电子邮箱是什么？'),
      phrase('Mi correo es...', '我的邮箱是……'),
      phrase('¿Cuándo es tu cumpleaños?', '你的生日是什么时候？'),
      phrase('Mi cumpleaños es el cinco de mayo.', '我的生日是五月五日。', '把日期换成自己的生日'),
      phrase('Nací el cinco de mayo.', '我出生于五月五日。'),
      phrase('Hoy es catorce de agosto.', '今天是八月十四日。'),
      phrase('Son las tres y media.', '现在三点半。'),
      phrase('Quedamos a las seis.', '我们六点见。'),
    ],
  },
  {
    id: 'frases-direccion-entrega', level: 'A2', scene: '住宿', kind: '短句', eyebrow: 'A2 · 短句 · 住宿', title: '住址与收快递',
    description: '说楼层、门牌，和快递员沟通', color: '#5575a5',
    words: [
      phrase('¿Cuál es la dirección?', '地址是什么？'),
      phrase('La dirección es correcta.', '地址是正确的。'),
      phrase('Vivo en el quinto piso.', '我住在五楼。'),
      phrase('Es el portal cinco.', '是五号楼门。', '在西班牙，portal 常指楼栋入口或单元门'),
      phrase('Es el quinto C.', '是五楼 C 户。'),
      phrase('Toca el timbre del quinto C.', '请按五楼 C 户的门铃。'),
      phrase('Estoy en casa.', '我在家。'),
      phrase('Ahora bajo.', '我现在下楼。'),
      phrase('¿Puedes subir?', '你可以上楼吗？'),
      phrase('Déjalo en la puerta.', '请把它放在门口。'),
      phrase('Llama cuando llegues.', '到了以后请打电话。'),
      phrase('No encuentro la entrada.', '我找不到入口。'),
    ],
  },
  {
    id: 'frases-supervivencia', level: 'A1', scene: '日常', kind: '短句', eyebrow: 'A1 · 短句 · 日常', title: '没听懂时怎么说',
    description: '请求重复、放慢速度和解决眼前需求', color: '#9b6b91',
    words: [
      phrase('No entiendo.', '我不明白。'),
      phrase('Más despacio, por favor.', '请说慢一点。'),
      phrase('¿Puede repetirlo?', '您可以再说一遍吗？'),
      phrase('¿Cómo se dice esto?', '这个怎么说？'),
      phrase('¿Qué significa?', '这是什么意思？'),
      phrase('Necesito ayuda.', '我需要帮助。'),
      phrase('Busco esta dirección.', '我在找这个地址。'),
      phrase('Quiero pedir una cita.', '我想预约。'),
      phrase('Tengo una reserva.', '我有预订。'),
      phrase('Pago con tarjeta.', '我用银行卡付款。'),
      phrase('¿Dónde está el baño?', '洗手间在哪里？'),
      phrase('Un momento, por favor.', '请稍等。'),
    ],
  },
  {
    id: 'frases-examen-conducir-ruta', level: 'A2', scene: '驾考', kind: '短句', eyebrow: 'A2 · 短句 · 驾考', title: '路考指令：方向与路线',
    description: '听懂考官让你直行、转弯、出环岛和变道', color: '#3f6f86',
    words: [
      drivingPhrase('Cuando pueda, inicie la marcha.', '可以安全起步时，请起步。', 'cuando pueda 表示在合法、安全且条件允许时操作'),
      drivingPhrase('Siga de frente.', '继续直行。'),
      drivingPhrase('Gire a la derecha.', '向右转。'),
      drivingPhrase('Gire a la izquierda.', '向左转。'),
      drivingPhrase('Tome la primera calle a la derecha.', '进入右边第一条街。'),
      drivingPhrase('Tome la segunda calle a la izquierda.', '进入左边第二条街。'),
      drivingPhrase('En la rotonda, tome la primera salida.', '在环岛走第一个出口。'),
      drivingPhrase('En la rotonda, tome la tercera salida.', '在环岛走第三个出口。'),
      drivingPhrase('Cambie al carril de la izquierda.', '变到左侧车道。'),
      drivingPhrase('Cambie al carril de la derecha.', '变到右侧车道。'),
      drivingPhrase('Incorpórese a la autovía.', '驶入高速公路。'),
      drivingPhrase('Tome la próxima salida.', '走下一个出口。'),
    ],
  },
  {
    id: 'frases-examen-conducir-maniobras', level: 'A2', scene: '驾考', kind: '短句', eyebrow: 'A2 · 短句 · 驾考', title: '路考指令：操作与确认',
    description: '停车、掉头、重新起步，以及没听清时确认', color: '#79669b',
    words: [
      drivingPhrase('Cuando pueda, estacione.', '条件允许时，请停车入位。', 'estacionar 指停车停放，不等同于临时停一下'),
      drivingPhrase('Estacione detrás de ese vehículo.', '停在那辆车后面。'),
      drivingPhrase('Pare junto al bordillo.', '靠路缘停车。'),
      drivingPhrase('Realice un cambio de sentido cuando pueda.', '条件允许时，请掉头。'),
      drivingPhrase('Reanude la marcha.', '重新起步，继续行驶。'),
      drivingPhrase('Siga las indicaciones de las señales.', '按照交通标志指示行驶。'),
      drivingPhrase('Encienda las luces de cruce.', '打开近光灯。'),
      drivingPhrase('Active el limpiaparabrisas.', '打开雨刷器。'),
      drivingPhrase('¿Ha dicho la primera salida?', '您说的是第一个出口吗？'),
      drivingPhrase('¿Puede repetir la indicación?', '您可以重复一下指令吗？'),
      drivingPhrase('¿Giro en esta calle?', '是在这条街转弯吗？'),
      drivingPhrase('¿Sigo de frente?', '我要继续直行吗？'),
    ],
  },
]

const commonLessons: Lesson[] = commonDecks.map((deck, index) => ({
  ...deck,
  kind: '高频',
  eyebrow: `${deck.level} · 高频 · ${deck.scene}`,
  color: ['#d46d4f', '#437e6d', '#516fa6', '#936a91'][index % 4],
  words: deck.words.map(([spanish, chinese]) => ({ spanish, chinese, english: englishMeaning(spanish), source: { ...FREQUENCY_SOURCE } })),
}))

const tenseNames: Record<string, string> = {
  present: '现在时',
  preterite: '简单过去时',
  imperfect: '过去未完成时',
}

const conjugationGroups = conjugations.reduce<Record<string, typeof conjugations>>((groups, item) => {
  const tenseIndex = conjugations.filter((candidate) => candidate.tense === item.tense).indexOf(item)
  const key = `${item.tense}-${Math.floor(tenseIndex / 30)}`
  ;(groups[key] ??= []).push(item)
  return groups
}, {})

const conjugationLessons: Lesson[] = Object.entries(conjugationGroups).map(([key, batch], index) => {
  const first = batch[0]
  const verbs = Array.from(new Set(batch.map((item) => item.lemma)))
  const tenseName = tenseNames[first.tense]
  return {
    id: `conjugation-${key}`,
    level: first.level as LessonLevel,
    scene: '语法',
    kind: '变位',
    eyebrow: `${first.level} · 变位 · ${tenseName}`,
    title: `${tenseName} ${Math.floor(index % 4) + 1}`,
    description: `${verbs.join('、')}：六个人称逐字练习`,
    color: ['#6f5b9b', '#456e9f', '#a15e70', '#5f7b55'][index % 4],
    words: batch.map((item) => ({
      spanish: item.spanish,
      chinese: item.chinese,
      english: conjugationMeaning(item.lemma, item.tense, item.person),
      source: { ...WORD_SOURCE },
    })),
  }
})

export const lessons: Lesson[] = [...phraseLessons, ...dialogueLessons, ...commonLessons, ...conjugationLessons]
export const totalPracticeCards = lessons.reduce((sum, lesson) => sum + lesson.words.length, 0)
export const lessonLevels: Array<'全部' | LessonLevel> = ['全部', 'A1', 'A2']
export const lessonKinds: Array<'全部' | LessonKind> = ['全部', '短句', '对话', '高频', '变位']
export const lessonScenes: Array<'全部' | LessonScene> = ['全部', '基础', '日常', '时间', '家庭', '餐厅', '城市', '旅行', '购物', '住宿', '健康', '学习', '工作', '驾考', '语法']
