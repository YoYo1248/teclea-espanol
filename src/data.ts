export type LessonLevel = 'A1' | 'A2'
export type LessonScene = '基础' | '日常' | '餐厅' | '旅行' | '购物' | '住宿'

export type LessonWord = {
  spanish: string
  chinese: string
  article?: string
  example: string
  exampleChinese: string
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

function word(
  spanish: string,
  chinese: string,
  example: string,
  exampleChinese: string,
  options: { article?: string; note?: string } = {},
): LessonWord {
  return { spanish, chinese, example, exampleChinese, ...options, source: { ...WORD_SOURCE } }
}

export const lessons: Lesson[] = [
  {
    id: 'primeros-pasos', level: 'A1', scene: '基础', eyebrow: 'A1 · 基础', title: '初次见面',
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
    id: 'cada-dia', level: 'A1', scene: '日常', eyebrow: 'A1 · 日常', title: '每天都用',
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
    id: 'en-el-restaurante', level: 'A1', scene: '餐厅', eyebrow: 'A1 · 餐厅', title: '点餐吃饭',
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
    id: 'de-viaje', level: 'A2', scene: '旅行', eyebrow: 'A2 · 旅行', title: '交通与问路',
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
    id: 'de-compras', level: 'A2', scene: '购物', eyebrow: 'A2 · 购物', title: '购物付款',
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
    id: 'en-el-hotel', level: 'A2', scene: '住宿', eyebrow: 'A2 · 住宿', title: '酒店入住',
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

export const lessonLevels: Array<'全部' | LessonLevel> = ['全部', 'A1', 'A2']
export const lessonScenes: Array<'全部' | LessonScene> = ['全部', '基础', '日常', '餐厅', '旅行', '购物', '住宿']
