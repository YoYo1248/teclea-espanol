export type LessonWord = {
  spanish: string
  chinese: string
  article?: string
  example: string
  exampleChinese: string
  note?: string
}

export type Lesson = {
  id: string
  eyebrow: string
  title: string
  description: string
  color: string
  words: LessonWord[]
}

export const lessons: Lesson[] = [
  {
    id: 'primeros-pasos',
    eyebrow: 'A1 · 第 1 组',
    title: '初次见面',
    description: '问候、礼貌表达和最常用的开场白',
    color: '#ef6a4c',
    words: [
      { spanish: 'hola', chinese: '你好', example: 'Hola, ¿cómo estás?', exampleChinese: '你好，你怎么样？' },
      { spanish: 'gracias', chinese: '谢谢', example: 'Muchas gracias por tu ayuda.', exampleChinese: '非常感谢你的帮助。' },
      { spanish: 'por favor', chinese: '请', example: 'Un café, por favor.', exampleChinese: '请给我一杯咖啡。' },
      { spanish: 'perdón', chinese: '对不起 / 劳驾', example: 'Perdón, ¿dónde está el metro?', exampleChinese: '劳驾，地铁在哪里？', note: '重音在最后一个音节：-dón' },
      { spanish: 'encantado', chinese: '很高兴认识你（男性说）', example: 'Encantado de conocerte.', exampleChinese: '很高兴认识你。', note: '女性通常说 encantada' },
      { spanish: 'adiós', chinese: '再见', example: 'Adiós, hasta mañana.', exampleChinese: '再见，明天见。' },
    ],
  },
  {
    id: 'cada-dia',
    eyebrow: 'A1 · 第 2 组',
    title: '每天都用',
    description: '生活里最常见的名词与动作',
    color: '#3d7b69',
    words: [
      { spanish: 'la casa', chinese: '家 / 房子', article: 'la', example: 'Mi casa está cerca.', exampleChinese: '我家在附近。', note: '连同冠词一起记忆名词性别' },
      { spanish: 'el trabajo', chinese: '工作', article: 'el', example: 'Voy al trabajo a las ocho.', exampleChinese: '我八点去上班。' },
      { spanish: 'comer', chinese: '吃', example: 'Quiero comer algo.', exampleChinese: '我想吃点东西。' },
      { spanish: 'beber', chinese: '喝', example: 'Necesito beber agua.', exampleChinese: '我需要喝水。' },
      { spanish: 'mañana', chinese: '明天 / 早晨', example: 'Nos vemos mañana.', exampleChinese: '我们明天见。', note: 'ñ 是独立字母，不等于 n' },
      { spanish: 'también', chinese: '也', example: 'Yo también hablo español.', exampleChinese: '我也会说西班牙语。' },
    ],
  },
  {
    id: 'por-la-ciudad',
    eyebrow: 'A1 · 第 3 组',
    title: '在城市里',
    description: '问路、交通和简单需求',
    color: '#4f6fae',
    words: [
      { spanish: 'dónde', chinese: '在哪里', example: '¿Dónde está la estación?', exampleChinese: '车站在哪里？', note: '单词训练不考句子两端的 ¿ ?；例句中仍需正确使用' },
      { spanish: 'derecha', chinese: '右边', example: 'Gira a la derecha.', exampleChinese: '向右转。' },
      { spanish: 'izquierda', chinese: '左边', example: 'Está a la izquierda.', exampleChinese: '它在左边。' },
      { spanish: 'la estación', chinese: '车站', article: 'la', example: 'La estación está lejos.', exampleChinese: '车站很远。' },
      { spanish: 'el billete', chinese: '票', article: 'el', example: 'Quiero un billete a Madrid.', exampleChinese: '我想要一张去马德里的票。' },
      { spanish: 'cerca', chinese: '近 / 附近', example: '¿Hay un banco cerca?', exampleChinese: '附近有银行吗？' },
    ],
  },
]
