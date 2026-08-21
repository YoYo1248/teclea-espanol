export type EditorialMetadata = {
  lemma: string
  partOfSpeech: 'noun' | 'adjective' | 'adverb' | 'pronoun' | 'conjunction' | 'numeral' | 'verb' | 'fixed-expression'
  frameworkReference: string
  example?: string
  exampleChinese?: string
  reviewKey: string
}

const A1_A2_FUNCTIONS = 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/05_funciones_inventario_a1-a2.htm'
const reviewKey = 'common-a1-connectors-editorial-001'
const timeReviewKey = 'common-a1-time-editorial-002'
const quantityReviewKey = 'common-a1-quantity-editorial-003'
const familyReviewKey = 'common-a1-family-editorial-004'
const homeReviewKey = 'common-a1-home-editorial-005'
const cityReviewKey = 'common-a1-city-editorial-006'
const foodReviewKey = 'common-a1-food-editorial-007'
const verbReviewKey = 'common-a1-verbs-editorial-008'
const dialogueReviewKey = 'common-a1-dialogue-editorial-009'
const shoppingHealthReviewKey = 'common-a1-shopping-health-editorial-010'
const studyWorkReviewKey = 'common-a1-study-work-editorial-011'
const actionTwoReviewKey = 'common-a1-actions-two-editorial-012'
const travelReviewKey = 'common-a1-travel-editorial-013'
const a1HealthRemainderReviewKey = 'common-a1-health-remainder-editorial-014'
const a2PracticalReviewKey = 'common-a2-practical-editorial-015'
const A1_A2_GENERAL_NOTIONS = 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/08_nociones_generales_inventario_a1-a2.htm'
const A1_A2_SPECIFIC_NOTIONS = 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_a1-a2.htm'

// Articles are metadata, not part of the typing target. This lets one
// canonical card teach gender while being reused in scenes and Vida modules.
export const canonicalArticleByTarget: Readonly<Record<string, 'el' | 'la'>> = {
  viaje: 'el',
  estación: 'la',
  aeropuerto: 'el',
  tren: 'el',
  autobús: 'el',
  metro: 'el',
  taxi: 'el',
  coche: 'el',
  avión: 'el',
  billete: 'el',
  maleta: 'la',
  equipaje: 'el',
  mapa: 'el',
  hotel: 'el',
  reserva: 'la',
  pasaporte: 'el',
  andén: 'el',
  asiento: 'el',
  ida: 'la',
  vuelta: 'la',
  menú: 'el',
  mesa: 'la',
  agua: 'el',
  café: 'el',
  cuenta: 'la',
  talla: 'la',
  tarjeta: 'la',
  efectivo: 'el',
  recibo: 'el',
  habitación: 'la',
  llave: 'la',
  desayuno: 'el',
  noche: 'la',
  cambio: 'el',
  regalo: 'el',
  cabeza: 'la',
  cara: 'la',
  mano: 'la',
  brazo: 'el',
  pierna: 'la',
  pie: 'el',
  cuerpo: 'el',
  dolor: 'el',
  fiebre: 'la',
  medicina: 'la',
  respuesta: 'la',
  idea: 'la',
  error: 'el',
  nivel: 'el',
  reunión: 'la',
  proyecto: 'el',
  problema: 'el',
  solución: 'la',
  documento: 'el',
  equipo: 'el',
  casero: 'el',
  inmobiliaria: 'la',
  cláusula: 'la',
  arrendador: 'el',
  arrendatario: 'el',
  padrón: 'el',
  mensualidad: 'la',
  desperfecto: 'el',
  hipoteca: 'la',
  tasación: 'la',
  inmueble: 'el',
  nómina: 'la',
  notario: 'el',
  póliza: 'la',
  siniestro: 'el',
  guardería: 'la',
  admisión: 'la',
  comedor: 'el',
  tutor: 'el',
  uniforme: 'el',
  escolarización: 'la',
  alumnado: 'el',
  NIE: 'el',
  TIE: 'la',
  prórroga: 'la',
  prestación: 'la',
  subsidio: 'el',
  ascensor: 'el',
}

export const canonicalUsageNoteByTarget: Readonly<Record<string, string>> = {
  agua: 'agua 是阴性名词，单数前因重读 a- 通常用 el；复数仍是 las aguas。',
  mano: 'mano 是阴性名词，使用 la mano。',
  problema: 'problema 是阳性名词，使用 el problema。',
  cliente: 'cliente 可指男性或女性顾客，冠词随所指人物使用 el 或 la。',
}

// First legacy A1 editorial-completion batch. The canonical targets already
// existed; this overlay adds auditable metadata and project-authored examples
// without duplicating cards or progress. Named professional review is still
// required before these drafts count as formally approved.
export const canonicalEditorialMetadata: Record<string, EditorialMetadata> = {
  y: {
    lemma: 'y', partOfSpeech: 'conjunction', frameworkReference: A1_A2_FUNCTIONS, reviewKey,
    example: 'Ana y Luis viven aquí.', exampleChinese: '安娜和路易斯住在这里。',
  },
  o: {
    lemma: 'o', partOfSpeech: 'conjunction', frameworkReference: A1_A2_FUNCTIONS, reviewKey,
    example: '¿Quieres té o café?', exampleChinese: '你想要茶还是咖啡？',
  },
  pero: {
    lemma: 'pero', partOfSpeech: 'conjunction', frameworkReference: A1_A2_FUNCTIONS, reviewKey,
    example: 'Es pequeño, pero cómodo.', exampleChinese: '它很小，但是很舒适。',
  },
  porque: {
    lemma: 'porque', partOfSpeech: 'conjunction', frameworkReference: A1_A2_FUNCTIONS, reviewKey,
    example: 'No voy porque estoy cansado.', exampleChinese: '我不去，因为我累了。',
  },
  si: {
    lemma: 'si', partOfSpeech: 'conjunction', frameworkReference: A1_A2_FUNCTIONS, reviewKey,
    example: 'Si tienes tiempo, llámame.', exampleChinese: '如果你有时间，给我打电话。',
  },
  no: {
    lemma: 'no', partOfSpeech: 'adverb', frameworkReference: A1_A2_FUNCTIONS, reviewKey,
    example: 'No tengo coche.', exampleChinese: '我没有车。',
  },
  sí: {
    lemma: 'sí', partOfSpeech: 'adverb', frameworkReference: A1_A2_FUNCTIONS, reviewKey,
    example: 'Sí, estoy de acuerdo.', exampleChinese: '是的，我同意。',
  },
  también: {
    lemma: 'también', partOfSpeech: 'adverb', frameworkReference: A1_A2_FUNCTIONS, reviewKey,
    example: 'Yo también estudio español.', exampleChinese: '我也学习西班牙语。',
  },
  tampoco: {
    lemma: 'tampoco', partOfSpeech: 'adverb', frameworkReference: A1_A2_FUNCTIONS, reviewKey,
    example: 'Yo tampoco tengo hambre.', exampleChinese: '我也不饿。',
  },
  muy: {
    lemma: 'muy', partOfSpeech: 'adverb', frameworkReference: A1_A2_FUNCTIONS, reviewKey,
    example: 'La sopa está muy caliente.', exampleChinese: '汤很烫。',
  },
  más: {
    lemma: 'más', partOfSpeech: 'adverb', frameworkReference: A1_A2_FUNCTIONS, reviewKey,
    example: 'Necesito más tiempo.', exampleChinese: '我需要更多时间。',
  },
  menos: {
    lemma: 'menos', partOfSpeech: 'adverb', frameworkReference: A1_A2_FUNCTIONS, reviewKey,
    example: 'Hoy tengo menos trabajo.', exampleChinese: '我今天工作少一些。',
  },
  aquí: {
    lemma: 'aquí', partOfSpeech: 'adverb', frameworkReference: A1_A2_FUNCTIONS, reviewKey,
    example: 'La farmacia está aquí.', exampleChinese: '药店在这里。',
  },
  allí: {
    lemma: 'allí', partOfSpeech: 'adverb', frameworkReference: A1_A2_FUNCTIONS, reviewKey,
    example: 'Mi mochila está allí.', exampleChinese: '我的背包在那里。',
  },
  ahora: {
    lemma: 'ahora', partOfSpeech: 'adverb', frameworkReference: A1_A2_FUNCTIONS, reviewKey,
    example: 'Ahora no puedo hablar.', exampleChinese: '我现在不能说话。',
  },
  qué: {
    lemma: 'qué', partOfSpeech: 'pronoun', frameworkReference: A1_A2_FUNCTIONS, reviewKey,
    example: '¿Qué necesitas?', exampleChinese: '你需要什么？',
  },
  quién: {
    lemma: 'quién', partOfSpeech: 'pronoun', frameworkReference: A1_A2_FUNCTIONS, reviewKey,
    example: '¿Quién es ella?', exampleChinese: '她是谁？',
  },
  cómo: {
    lemma: 'cómo', partOfSpeech: 'adverb', frameworkReference: A1_A2_FUNCTIONS, reviewKey,
    example: '¿Cómo te llamas?', exampleChinese: '你叫什么名字？',
  },
  cuándo: {
    lemma: 'cuándo', partOfSpeech: 'adverb', frameworkReference: A1_A2_FUNCTIONS, reviewKey,
    example: '¿Cuándo llega el tren?', exampleChinese: '火车什么时候到？',
  },
  dónde: {
    lemma: 'dónde', partOfSpeech: 'adverb', frameworkReference: A1_A2_FUNCTIONS, reviewKey,
    example: '¿Dónde está el baño?', exampleChinese: '洗手间在哪里？',
  },
  hoy: {
    lemma: 'hoy', partOfSpeech: 'adverb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: timeReviewKey,
    example: 'Hoy trabajo en casa.', exampleChinese: '我今天在家工作。',
  },
  ayer: {
    lemma: 'ayer', partOfSpeech: 'adverb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: timeReviewKey,
    example: 'La cita fue ayer.', exampleChinese: '约会是在昨天。',
  },
  mañana: {
    lemma: 'mañana', partOfSpeech: 'adverb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: timeReviewKey,
    example: 'Mañana tenemos clase.', exampleChinese: '我们明天有课。',
  },
  día: {
    lemma: 'día', partOfSpeech: 'noun', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: timeReviewKey,
    example: 'Hoy es un buen día.', exampleChinese: '今天是美好的一天。',
  },
  semana: {
    lemma: 'semana', partOfSpeech: 'noun', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: timeReviewKey,
    example: 'Trabajo cinco días a la semana.', exampleChinese: '我每周工作五天。',
  },
  mes: {
    lemma: 'mes', partOfSpeech: 'noun', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: timeReviewKey,
    example: 'El curso empieza este mes.', exampleChinese: '课程这个月开始。',
  },
  año: {
    lemma: 'año', partOfSpeech: 'noun', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: timeReviewKey,
    example: 'Este año estudio español.', exampleChinese: '我今年学习西班牙语。',
  },
  hora: {
    lemma: 'hora', partOfSpeech: 'noun', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: timeReviewKey,
    example: 'La clase dura una hora.', exampleChinese: '这节课持续一个小时。',
  },
  minuto: {
    lemma: 'minuto', partOfSpeech: 'noun', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: timeReviewKey,
    example: 'Espera un minuto, por favor.', exampleChinese: '请等一分钟。',
  },
  lunes: {
    lemma: 'lunes', partOfSpeech: 'noun', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: timeReviewKey,
    example: 'La tienda cierra el lunes.', exampleChinese: '商店星期一关门。',
  },
  martes: {
    lemma: 'martes', partOfSpeech: 'noun', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: timeReviewKey,
    example: 'Tenemos clase el martes.', exampleChinese: '我们星期二有课。',
  },
  miércoles: {
    lemma: 'miércoles', partOfSpeech: 'noun', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: timeReviewKey,
    example: 'Viajo a Madrid el miércoles.', exampleChinese: '我星期三去马德里。',
  },
  jueves: {
    lemma: 'jueves', partOfSpeech: 'noun', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: timeReviewKey,
    example: 'La reunión es el jueves.', exampleChinese: '会议在星期四。',
  },
  viernes: {
    lemma: 'viernes', partOfSpeech: 'noun', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: timeReviewKey,
    example: 'Trabajo hasta el viernes.', exampleChinese: '我工作到星期五。',
  },
  sábado: {
    lemma: 'sábado', partOfSpeech: 'noun', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: timeReviewKey,
    example: 'El sábado voy al mercado.', exampleChinese: '我星期六去市场。',
  },
  domingo: {
    lemma: 'domingo', partOfSpeech: 'noun', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: timeReviewKey,
    example: 'El museo abre el domingo.', exampleChinese: '博物馆星期日开放。',
  },
  temprano: {
    lemma: 'temprano', partOfSpeech: 'adverb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: timeReviewKey,
    example: 'Me levanto temprano.', exampleChinese: '我起得早。',
  },
  tarde: {
    lemma: 'tarde', partOfSpeech: 'noun', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: timeReviewKey,
    example: 'La cita es por la tarde.', exampleChinese: '约会在下午。',
  },
  noche: {
    lemma: 'noche', partOfSpeech: 'noun', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: timeReviewKey,
    example: 'Leo por la noche.', exampleChinese: '我晚上阅读。',
  },
  siempre: {
    lemma: 'siempre', partOfSpeech: 'adverb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: timeReviewKey,
    example: 'Siempre llevo agua.', exampleChinese: '我总是带着水。',
  },
  cero: {
    lemma: 'cero', partOfSpeech: 'numeral', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: quantityReviewKey,
    example: 'La temperatura está a cero grados.', exampleChinese: '温度是零度。',
  },
  uno: {
    lemma: 'uno', partOfSpeech: 'numeral', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: quantityReviewKey,
    example: 'Quiero uno, por favor.', exampleChinese: '请给我一个。',
  },
  dos: {
    lemma: 'dos', partOfSpeech: 'numeral', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: quantityReviewKey,
    example: 'Necesito dos billetes.', exampleChinese: '我需要两张票。',
  },
  tres: {
    lemma: 'tres', partOfSpeech: 'numeral', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: quantityReviewKey,
    example: 'Aquí vivimos tres personas.', exampleChinese: '我们三个人住在这里。',
  },
  cuatro: {
    lemma: 'cuatro', partOfSpeech: 'numeral', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: quantityReviewKey,
    example: 'La mesa tiene cuatro sillas.', exampleChinese: '这张桌子配有四把椅子。',
  },
  cinco: {
    lemma: 'cinco', partOfSpeech: 'numeral', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: quantityReviewKey,
    example: 'Trabajo cinco días a la semana.', exampleChinese: '我每周工作五天。',
  },
  seis: {
    lemma: 'seis', partOfSpeech: 'numeral', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: quantityReviewKey,
    example: 'El tren sale a las seis.', exampleChinese: '火车六点出发。',
  },
  siete: {
    lemma: 'siete', partOfSpeech: 'numeral', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: quantityReviewKey,
    example: 'La tienda abre a las siete.', exampleChinese: '商店七点开门。',
  },
  ocho: {
    lemma: 'ocho', partOfSpeech: 'numeral', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: quantityReviewKey,
    example: 'La clase empieza a las ocho.', exampleChinese: '课程八点开始。',
  },
  nueve: {
    lemma: 'nueve', partOfSpeech: 'numeral', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: quantityReviewKey,
    example: 'Tenemos nueve mesas libres.', exampleChinese: '我们有九张空桌。',
  },
  diez: {
    lemma: 'diez', partOfSpeech: 'numeral', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: quantityReviewKey,
    example: 'Cuesta diez euros.', exampleChinese: '它售价十欧元。',
  },
  once: {
    lemma: 'once', partOfSpeech: 'numeral', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: quantityReviewKey,
    example: 'La reunión es a las once.', exampleChinese: '会议在十一点。',
  },
  doce: {
    lemma: 'doce', partOfSpeech: 'numeral', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: quantityReviewKey,
    example: 'El autobús llega a las doce.', exampleChinese: '公交车十二点到。',
  },
  veinte: {
    lemma: 'veinte', partOfSpeech: 'numeral', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: quantityReviewKey,
    example: 'Necesito veinte copias.', exampleChinese: '我需要二十份复印件。',
  },
  cien: {
    lemma: 'cien', partOfSpeech: 'numeral', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: quantityReviewKey,
    example: 'El hotel tiene cien habitaciones.', exampleChinese: '这家酒店有一百个房间。',
  },
  primero: {
    lemma: 'primero', partOfSpeech: 'adverb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: quantityReviewKey,
    example: 'Yo voy primero.', exampleChinese: '我先来。',
  },
  último: {
    lemma: 'último', partOfSpeech: 'adjective', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: quantityReviewKey,
    example: 'Este es el último asiento.', exampleChinese: '这是最后一个座位。',
  },
  mucho: {
    lemma: 'mucho', partOfSpeech: 'adverb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: quantityReviewKey,
    example: 'Trabajo mucho esta semana.', exampleChinese: '我这周工作很多。',
  },
  poco: {
    lemma: 'poco', partOfSpeech: 'adverb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: quantityReviewKey,
    example: 'Hoy duermo poco.', exampleChinese: '我今天睡得少。',
  },
  bastante: {
    lemma: 'bastante', partOfSpeech: 'adverb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: quantityReviewKey,
    example: 'La habitación es bastante grande.', exampleChinese: '这个房间相当大。',
  },
  persona: {
    lemma: 'persona', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: familyReviewKey,
    example: 'Hay una persona en la puerta.', exampleChinese: '门口有一个人。',
  },
  hombre: {
    lemma: 'hombre', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: familyReviewKey,
    example: 'El hombre lleva una chaqueta azul.', exampleChinese: '那个男人穿着一件蓝色夹克。',
  },
  mujer: {
    lemma: 'mujer', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: familyReviewKey,
    example: 'La mujer trabaja en el hospital.', exampleChinese: '那个女人在医院工作。',
  },
  niño: {
    lemma: 'niño', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: familyReviewKey,
    example: 'El niño juega en el parque.', exampleChinese: '男孩在公园里玩。',
  },
  niña: {
    lemma: 'niña', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: familyReviewKey,
    example: 'La niña lee un libro.', exampleChinese: '女孩在读一本书。',
  },
  amigo: {
    lemma: 'amigo', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: familyReviewKey,
    example: 'Mi amigo vive en Madrid.', exampleChinese: '我的朋友住在马德里。',
  },
  amiga: {
    lemma: 'amiga', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: familyReviewKey,
    example: 'Mi amiga estudia español.', exampleChinese: '我的朋友学习西班牙语。',
  },
  familia: {
    lemma: 'familia', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: familyReviewKey,
    example: 'Mi familia vive en China.', exampleChinese: '我的家人住在中国。',
  },
  padre: {
    lemma: 'padre', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: familyReviewKey,
    example: 'Mi padre cocina muy bien.', exampleChinese: '我父亲很会做饭。',
  },
  madre: {
    lemma: 'madre', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: familyReviewKey,
    example: 'Mi madre trabaja en una escuela.', exampleChinese: '我母亲在一所学校工作。',
  },
  hijo: {
    lemma: 'hijo', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: familyReviewKey,
    example: 'Su hijo tiene cinco años.', exampleChinese: '他的儿子五岁。',
  },
  hija: {
    lemma: 'hija', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: familyReviewKey,
    example: 'Mi hija va a la escuela.', exampleChinese: '我女儿去上学。',
  },
  hermano: {
    lemma: 'hermano', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: familyReviewKey,
    example: 'Mi hermano es más joven.', exampleChinese: '我弟弟年纪比我小。',
  },
  hermana: {
    lemma: 'hermana', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: familyReviewKey,
    example: 'Mi hermana vive cerca.', exampleChinese: '我妹妹住在附近。',
  },
  marido: {
    lemma: 'marido', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: familyReviewKey,
    example: 'Mi marido trabaja desde casa.', exampleChinese: '我丈夫在家办公。',
  },
  esposa: {
    lemma: 'esposa', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: familyReviewKey,
    example: 'Su esposa es médica.', exampleChinese: '他的妻子是医生。',
  },
  nombre: {
    lemma: 'nombre', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: familyReviewKey,
    example: 'Mi nombre es Ana.', exampleChinese: '我的名字是安娜。',
  },
  edad: {
    lemma: 'edad', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: familyReviewKey,
    example: 'Escribe tu edad aquí.', exampleChinese: '请在这里填写你的年龄。',
  },
  señor: {
    lemma: 'señor', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: familyReviewKey,
    example: 'El señor García está aquí.', exampleChinese: '加西亚先生在这里。',
  },
  señora: {
    lemma: 'señora', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: familyReviewKey,
    example: 'La señora López es mi profesora.', exampleChinese: '洛佩斯女士是我的老师。',
  },
  casa: {
    lemma: 'casa', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: homeReviewKey,
    example: 'Mi casa está cerca del centro.', exampleChinese: '我家在市中心附近。',
  },
  habitación: {
    lemma: 'habitación', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: homeReviewKey,
    example: 'La habitación tiene una ventana.', exampleChinese: '房间里有一扇窗户。',
  },
  cocina: {
    lemma: 'cocina', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: homeReviewKey,
    example: 'La cocina es pequeña.', exampleChinese: '厨房很小。',
  },
  baño: {
    lemma: 'baño', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: homeReviewKey,
    example: 'El baño está al final del pasillo.', exampleChinese: '卫生间在走廊尽头。',
  },
  puerta: {
    lemma: 'puerta', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: homeReviewKey,
    example: 'Cierra la puerta, por favor.', exampleChinese: '请把门关上。',
  },
  ventana: {
    lemma: 'ventana', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: homeReviewKey,
    example: 'Abre la ventana, por favor.', exampleChinese: '请把窗户打开。',
  },
  mesa: {
    lemma: 'mesa', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: homeReviewKey,
    example: 'Las llaves están sobre la mesa.', exampleChinese: '钥匙在桌子上。',
  },
  silla: {
    lemma: 'silla', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: homeReviewKey,
    example: 'Necesito otra silla.', exampleChinese: '我还需要一把椅子。',
  },
  cama: {
    lemma: 'cama', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: homeReviewKey,
    example: 'La cama está junto a la ventana.', exampleChinese: '床在窗户旁边。',
  },
  llave: {
    lemma: 'llave', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: homeReviewKey,
    example: 'No encuentro la llave.', exampleChinese: '我找不到钥匙。',
  },
  teléfono: {
    lemma: 'teléfono', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: homeReviewKey,
    example: 'Mi teléfono está en la bolsa.', exampleChinese: '我的手机在包里。',
  },
  ropa: {
    lemma: 'ropa', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: homeReviewKey,
    example: 'La ropa está limpia.', exampleChinese: '衣服是干净的。',
  },
  zapato: {
    lemma: 'zapato', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: homeReviewKey,
    example: 'Este zapato me queda bien.', exampleChinese: '这只鞋很合脚。',
  },
  bolsa: {
    lemma: 'bolsa', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: homeReviewKey,
  },
  cosa: {
    lemma: 'cosa', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: homeReviewKey,
    example: 'Tengo una cosa para ti.', exampleChinese: '我有一样东西要给你。',
  },
  limpio: {
    lemma: 'limpio', partOfSpeech: 'adjective', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: homeReviewKey,
  },
  sucio: {
    lemma: 'sucio', partOfSpeech: 'adjective', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: homeReviewKey,
  },
  abierto: {
    lemma: 'abierto', partOfSpeech: 'adjective', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: homeReviewKey,
    example: 'El supermercado está abierto.', exampleChinese: '超市开着门。',
  },
  cerrado: {
    lemma: 'cerrado', partOfSpeech: 'adjective', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: homeReviewKey,
    example: 'El banco está cerrado.', exampleChinese: '银行关门了。',
  },
  cerca: {
    lemma: 'cerca', partOfSpeech: 'adverb', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: homeReviewKey,
    example: 'La farmacia está cerca.', exampleChinese: '药店就在附近。',
  },
  calle: {
    lemma: 'calle', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: cityReviewKey,
    example: 'La farmacia está en esta calle.', exampleChinese: '药店在这条街上。',
  },
  plaza: {
    lemma: 'plaza', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: cityReviewKey,
    example: 'Nos vemos en la plaza.', exampleChinese: '我们在广场见。',
  },
  ciudad: {
    lemma: 'ciudad', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: cityReviewKey,
    example: 'Esta ciudad tiene buen transporte.', exampleChinese: '这座城市的交通很便利。',
  },
  centro: {
    lemma: 'centro', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: cityReviewKey,
    example: 'El hotel está en el centro.', exampleChinese: '酒店在市中心。',
  },
  tienda: {
    lemma: 'tienda', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: cityReviewKey,
    example: 'La tienda cierra a las ocho.', exampleChinese: '商店八点关门。',
  },
  mercado: {
    lemma: 'mercado', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: cityReviewKey,
    example: 'Compro fruta en el mercado.', exampleChinese: '我在市场买水果。',
  },
  banco: {
    lemma: 'banco', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: cityReviewKey,
    example: 'El banco está junto al metro.', exampleChinese: '银行在地铁站旁边。',
  },
  hospital: {
    lemma: 'hospital', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: cityReviewKey,
    example: 'El hospital está cerca.', exampleChinese: '医院就在附近。',
  },
  farmacia: {
    lemma: 'farmacia', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: cityReviewKey,
    example: 'Busco una farmacia abierta.', exampleChinese: '我在找一家营业中的药店。',
  },
  escuela: {
    lemma: 'escuela', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: cityReviewKey,
    example: 'La escuela está frente al parque.', exampleChinese: '学校在公园对面。',
  },
  derecha: {
    lemma: 'derecha', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: cityReviewKey,
    example: 'Gira a la derecha.', exampleChinese: '向右转。',
  },
  izquierda: {
    lemma: 'izquierda', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: cityReviewKey,
    example: 'El banco queda a la izquierda.', exampleChinese: '银行在左边。',
  },
  delante: {
    lemma: 'delante', partOfSpeech: 'adverb', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: cityReviewKey,
    example: 'La parada está delante del hotel.', exampleChinese: '车站在酒店前面。',
  },
  detrás: {
    lemma: 'detrás', partOfSpeech: 'adverb', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: cityReviewKey,
    example: 'El aparcamiento está detrás del edificio.', exampleChinese: '停车场在大楼后面。',
  },
  dentro: {
    lemma: 'dentro', partOfSpeech: 'adverb', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: cityReviewKey,
    example: 'El cajero está dentro del banco.', exampleChinese: '自动取款机在银行里面。',
  },
  fuera: {
    lemma: 'fuera', partOfSpeech: 'adverb', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: cityReviewKey,
    example: 'Te espero fuera de la estación.', exampleChinese: '我在车站外面等你。',
  },
  lejos: {
    lemma: 'lejos', partOfSpeech: 'adverb', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: cityReviewKey,
    example: 'El aeropuerto está lejos.', exampleChinese: '机场很远。',
  },
  camino: {
    lemma: 'camino', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: cityReviewKey,
    example: 'Este es el camino al centro.', exampleChinese: '这是去市中心的路。',
  },
  entrada: {
    lemma: 'entrada', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: cityReviewKey,
    example: 'La entrada está a la derecha.', exampleChinese: '入口在右边。',
  },
  salida: {
    lemma: 'salida', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: cityReviewKey,
    example: 'La salida está al fondo.', exampleChinese: '出口在最里面。',
  },
  agua: {
    lemma: 'agua', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: foodReviewKey,
  },
  café: {
    lemma: 'café', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: foodReviewKey,
  },
  té: {
    lemma: 'té', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: foodReviewKey,
  },
  leche: {
    lemma: 'leche', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: foodReviewKey,
  },
  pan: {
    lemma: 'pan', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: foodReviewKey,
  },
  arroz: {
    lemma: 'arroz', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: foodReviewKey,
  },
  carne: {
    lemma: 'carne', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: foodReviewKey,
  },
  pescado: {
    lemma: 'pescado', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: foodReviewKey,
  },
  pollo: {
    lemma: 'pollo', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: foodReviewKey,
  },
  huevo: {
    lemma: 'huevo', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: foodReviewKey,
  },
  fruta: {
    lemma: 'fruta', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: foodReviewKey,
  },
  verdura: {
    lemma: 'verdura', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: foodReviewKey,
  },
  desayuno: {
    lemma: 'desayuno', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: foodReviewKey,
    example: 'El desayuno está incluido.', exampleChinese: '包含早餐。',
  },
  comida: {
    lemma: 'comida', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: foodReviewKey,
    example: 'La comida está lista.', exampleChinese: '饭做好了。',
  },
  cena: {
    lemma: 'cena', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: foodReviewKey,
    example: 'La cena es a las nueve.', exampleChinese: '晚餐在九点。',
  },
  hambre: {
    lemma: 'hambre', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: foodReviewKey,
    example: 'Tengo hambre.', exampleChinese: '我饿了。',
  },
  sed: {
    lemma: 'sed', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: foodReviewKey,
    example: 'Tengo sed.', exampleChinese: '我渴了。',
  },
  menú: {
    lemma: 'menú', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: foodReviewKey,
    example: '¿Puedo ver el menú?', exampleChinese: '我可以看一下菜单吗？',
  },
  cuenta: {
    lemma: 'cuenta', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: foodReviewKey,
    example: 'La cuenta, por favor.', exampleChinese: '请结账。',
  },
  delicioso: {
    lemma: 'delicioso', partOfSpeech: 'adjective', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: foodReviewKey,
    example: 'Este plato está delicioso.', exampleChinese: '这道菜很好吃。',
  },
  ser: {
    lemma: 'ser', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: verbReviewKey,
    example: 'Quiero ser profesor.', exampleChinese: '我想成为一名老师。',
  },
  estar: {
    lemma: 'estar', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: verbReviewKey,
    example: 'Quiero estar cerca de la puerta.', exampleChinese: '我想待在门附近。',
  },
  tener: {
    lemma: 'tener', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: verbReviewKey,
    example: 'Quiero tener una bicicleta.', exampleChinese: '我想拥有一辆自行车。',
  },
  hacer: {
    lemma: 'hacer', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: verbReviewKey,
    example: 'Voy a hacer la cena.', exampleChinese: '我要做晚饭。',
  },
  ir: {
    lemma: 'ir', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: verbReviewKey,
    example: 'Quiero ir al mercado.', exampleChinese: '我想去市场。',
  },
  venir: {
    lemma: 'venir', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: verbReviewKey,
    example: '¿Puedes venir mañana?', exampleChinese: '你明天能来吗？',
  },
  poder: {
    lemma: 'poder', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: verbReviewKey,
    example: 'Quiero poder pagar con tarjeta.', exampleChinese: '我希望可以刷卡付款。',
  },
  querer: {
    lemma: 'querer', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: verbReviewKey,
    example: 'Es normal querer descansar.', exampleChinese: '想休息是很正常的。',
  },
  decir: {
    lemma: 'decir', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: verbReviewKey,
    example: 'No sé qué decir.', exampleChinese: '我不知道该说什么。',
  },
  hablar: {
    lemma: 'hablar', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: verbReviewKey,
    example: 'Necesito hablar con el médico.', exampleChinese: '我需要和医生谈谈。',
  },
  ver: {
    lemma: 'ver', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: verbReviewKey,
    example: 'Quiero ver el menú.', exampleChinese: '我想看一下菜单。',
  },
  dar: {
    lemma: 'dar', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: verbReviewKey,
    example: '¿Me puede dar un recibo?', exampleChinese: '您可以给我一张收据吗？',
  },
  saber: {
    lemma: 'saber', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: verbReviewKey,
    example: 'Quiero saber el precio.', exampleChinese: '我想知道价格。',
  },
  conocer: {
    lemma: 'conocer', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: verbReviewKey,
    example: 'Quiero conocer la ciudad.', exampleChinese: '我想了解这座城市。',
  },
  comer: {
    lemma: 'comer', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: verbReviewKey,
    example: 'Vamos a comer a las dos.', exampleChinese: '我们两点吃饭。',
  },
  beber: {
    lemma: 'beber', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: verbReviewKey,
    example: 'Necesito beber agua.', exampleChinese: '我需要喝水。',
  },
  vivir: {
    lemma: 'vivir', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: verbReviewKey,
    example: 'Quiero vivir cerca del centro.', exampleChinese: '我想住在市中心附近。',
  },
  dormir: {
    lemma: 'dormir', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: verbReviewKey,
    example: 'Necesito dormir ocho horas.', exampleChinese: '我需要睡八个小时。',
  },
  salir: {
    lemma: 'salir', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: verbReviewKey,
    example: 'Tengo que salir temprano.', exampleChinese: '我得早点出门。',
  },
  llegar: {
    lemma: 'llegar', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: verbReviewKey,
    example: 'Podemos llegar en metro.', exampleChinese: '我们可以坐地铁到达。',
  },
  'buenos días': {
    lemma: 'buenos días', partOfSpeech: 'fixed-expression', frameworkReference: A1_A2_FUNCTIONS, reviewKey: dialogueReviewKey,
    example: 'Buenos días, ¿tiene pan?', exampleChinese: '早上好，请问有面包吗？',
  },
  'buenas tardes': {
    lemma: 'buenas tardes', partOfSpeech: 'fixed-expression', frameworkReference: A1_A2_FUNCTIONS, reviewKey: dialogueReviewKey,
    example: 'Buenas tardes, tengo una reserva.', exampleChinese: '下午好，我有一个预订。',
  },
  'buenas noches': {
    lemma: 'buenas noches', partOfSpeech: 'fixed-expression', frameworkReference: A1_A2_FUNCTIONS, reviewKey: dialogueReviewKey,
    example: 'Buenas noches, hasta mañana.', exampleChinese: '晚安，明天见。',
  },
  'hasta mañana': {
    lemma: 'hasta mañana', partOfSpeech: 'fixed-expression', frameworkReference: A1_A2_FUNCTIONS, reviewKey: dialogueReviewKey,
    example: 'Adiós, hasta mañana.', exampleChinese: '再见，明天见。',
  },
  'muchas gracias': {
    lemma: 'muchas gracias', partOfSpeech: 'fixed-expression', frameworkReference: A1_A2_FUNCTIONS, reviewKey: dialogueReviewKey,
    example: 'Muchas gracias por su ayuda.', exampleChinese: '非常感谢您的帮助。',
  },
  'de nada': {
    lemma: 'de nada', partOfSpeech: 'fixed-expression', frameworkReference: A1_A2_FUNCTIONS, reviewKey: dialogueReviewKey,
    example: 'De nada, hasta luego.', exampleChinese: '不客气，回头见。',
  },
  'por supuesto': {
    lemma: 'por supuesto', partOfSpeech: 'fixed-expression', frameworkReference: A1_A2_FUNCTIONS, reviewKey: dialogueReviewKey,
    example: 'Por supuesto, puede pagar con tarjeta.', exampleChinese: '当然，您可以刷卡付款。',
  },
  'no sé': {
    lemma: 'no sé', partOfSpeech: 'fixed-expression', frameworkReference: A1_A2_FUNCTIONS, reviewKey: dialogueReviewKey,
    example: 'No sé dónde está la estación.', exampleChinese: '我不知道车站在哪里。',
  },
  'no entiendo': {
    lemma: 'no entiendo', partOfSpeech: 'fixed-expression', frameworkReference: A1_A2_FUNCTIONS, reviewKey: dialogueReviewKey,
    example: 'Perdone, no entiendo.', exampleChinese: '不好意思，我不明白。',
  },
  'otra vez': {
    lemma: 'otra vez', partOfSpeech: 'fixed-expression', frameworkReference: A1_A2_FUNCTIONS, reviewKey: dialogueReviewKey,
    example: '¿Puede decirlo otra vez?', exampleChinese: '您可以再说一遍吗？',
  },
  'más despacio': {
    lemma: 'más despacio', partOfSpeech: 'fixed-expression', frameworkReference: A1_A2_FUNCTIONS, reviewKey: dialogueReviewKey,
    example: 'Hable más despacio, por favor.', exampleChinese: '请说慢一点。',
  },
  'está bien': {
    lemma: 'está bien', partOfSpeech: 'fixed-expression', frameworkReference: A1_A2_FUNCTIONS, reviewKey: dialogueReviewKey,
    example: 'Sí, está bien.', exampleChinese: '好的，没问题。',
  },
  'tengo hambre': {
    lemma: 'tengo hambre', partOfSpeech: 'fixed-expression', frameworkReference: A1_A2_FUNCTIONS, reviewKey: dialogueReviewKey,
    example: 'Tengo hambre; vamos a comer.', exampleChinese: '我饿了，我们去吃饭吧。',
  },
  'tengo sed': {
    lemma: 'tengo sed', partOfSpeech: 'fixed-expression', frameworkReference: A1_A2_FUNCTIONS, reviewKey: dialogueReviewKey,
    example: 'Tengo sed; necesito agua.', exampleChinese: '我渴了，需要喝水。',
  },
  'me gusta': {
    lemma: 'me gusta', partOfSpeech: 'fixed-expression', frameworkReference: A1_A2_FUNCTIONS, reviewKey: dialogueReviewKey,
    example: 'Me gusta este mercado.', exampleChinese: '我喜欢这个市场。',
  },
  'no me gusta': {
    lemma: 'no me gusta', partOfSpeech: 'fixed-expression', frameworkReference: A1_A2_FUNCTIONS, reviewKey: dialogueReviewKey,
    example: 'No me gusta la comida fría.', exampleChinese: '我不喜欢凉的饭菜。',
  },
  'cuánto cuesta': {
    lemma: 'cuánto cuesta', partOfSpeech: 'fixed-expression', frameworkReference: A1_A2_FUNCTIONS, reviewKey: dialogueReviewKey,
    example: '¿Cuánto cuesta este billete?', exampleChinese: '这张票多少钱？',
  },
  'dónde está': {
    lemma: 'dónde está', partOfSpeech: 'fixed-expression', frameworkReference: A1_A2_FUNCTIONS, reviewKey: dialogueReviewKey,
    example: '¿Dónde está la farmacia?', exampleChinese: '药店在哪里？',
  },
  'qué hora es': {
    lemma: 'qué hora es', partOfSpeech: 'fixed-expression', frameworkReference: A1_A2_FUNCTIONS, reviewKey: dialogueReviewKey,
    example: 'Perdone, ¿qué hora es?', exampleChinese: '请问现在几点？',
  },
  'necesito ayuda': {
    lemma: 'necesito ayuda', partOfSpeech: 'fixed-expression', frameworkReference: A1_A2_FUNCTIONS, reviewKey: dialogueReviewKey,
    example: 'No encuentro mi maleta; necesito ayuda.', exampleChinese: '我找不到行李箱，需要帮助。',
  },
  precio: {
    lemma: 'precio', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: shoppingHealthReviewKey,
    example: 'Mira el precio por kilo.', exampleChinese: '看一下每公斤价格。',
  },
  dinero: {
    lemma: 'dinero', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: shoppingHealthReviewKey,
    example: 'Necesito dinero para el autobús.', exampleChinese: '我需要钱坐公交车。',
  },
  tarjeta: {
    lemma: 'tarjeta', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: shoppingHealthReviewKey,
    example: 'Voy a pagar con tarjeta.', exampleChinese: '我要刷卡付款。',
  },
  barato: {
    lemma: 'barato', partOfSpeech: 'adjective', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: shoppingHealthReviewKey,
    example: 'Este paquete es más barato.', exampleChinese: '这包更便宜。',
  },
  caro: {
    lemma: 'caro', partOfSpeech: 'adjective', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: shoppingHealthReviewKey,
    example: 'El aceite está demasiado caro.', exampleChinese: '这瓶油太贵了。',
  },
  grande: {
    lemma: 'grande', partOfSpeech: 'adjective', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: shoppingHealthReviewKey,
    example: 'Quiero una botella grande de agua.', exampleChinese: '我想要一大瓶水。',
  },
  pequeño: {
    lemma: 'pequeño', partOfSpeech: 'adjective', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: shoppingHealthReviewKey,
    example: 'Prefiero el paquete pequeño.', exampleChinese: '我更喜欢小包装。',
  },
  talla: {
    lemma: 'talla', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: shoppingHealthReviewKey,
    example: 'Esta talla me queda bien.', exampleChinese: '这个尺码我穿着合适。',
  },
  color: {
    lemma: 'color', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: shoppingHealthReviewKey,
    example: '¿Tiene este modelo en otro color?', exampleChinese: '这个款式有其他颜色吗？',
  },
  rojo: {
    lemma: 'rojo', partOfSpeech: 'adjective', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: shoppingHealthReviewKey,
    example: 'Quiero el pimiento rojo.', exampleChinese: '我想要红甜椒。',
  },
  azul: {
    lemma: 'azul', partOfSpeech: 'adjective', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: shoppingHealthReviewKey,
    example: 'Busco una camisa azul.', exampleChinese: '我在找一件蓝色衬衫。',
  },
  blanco: {
    lemma: 'blanco', partOfSpeech: 'adjective', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: shoppingHealthReviewKey,
    example: 'Necesito arroz blanco.', exampleChinese: '我需要白米。',
  },
  negro: {
    lemma: 'negro', partOfSpeech: 'adjective', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: shoppingHealthReviewKey,
    example: 'El bolso negro está de oferta.', exampleChinese: '黑色的包正在打折。',
  },
  nuevo: {
    lemma: 'nuevo', partOfSpeech: 'adjective', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: shoppingHealthReviewKey,
    example: 'Necesito un cepillo de dientes nuevo.', exampleChinese: '我需要一把新牙刷。',
  },
  ojo: {
    lemma: 'ojo', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: shoppingHealthReviewKey,
    example: 'Me duele el ojo derecho.', exampleChinese: '我的右眼疼。',
  },
  boca: {
    lemma: 'boca', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: shoppingHealthReviewKey,
    example: 'Abra la boca, por favor.', exampleChinese: '请张开嘴。',
  },
  salud: {
    lemma: 'salud', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: shoppingHealthReviewKey,
    example: 'Mi salud ha mejorado.', exampleChinese: '我的健康状况好转了。',
  },
  médico: {
    lemma: 'médico', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: shoppingHealthReviewKey,
    example: 'Necesito hablar con un médico.', exampleChinese: '我需要和医生谈谈。',
  },
  enfermo: {
    lemma: 'enfermo', partOfSpeech: 'adjective', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: shoppingHealthReviewKey,
    example: 'Hoy estoy enfermo y no voy a trabajar.', exampleChinese: '我今天生病了，不去上班。',
  },
  ayuda: {
    lemma: 'ayuda', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: shoppingHealthReviewKey,
    example: 'Necesito ayuda con esta cita.', exampleChinese: '这个预约我需要帮助。',
  },
  libro: {
    lemma: 'libro', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: 'Leo un libro en español.', exampleChinese: '我在读一本西班牙语书。',
  },
  página: {
    lemma: 'página', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: 'Abra el libro por la página diez.', exampleChinese: '请把书翻到第十页。',
  },
  palabra: {
    lemma: 'palabra', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: 'No entiendo esta palabra.', exampleChinese: '我不明白这个单词。',
  },
  pregunta: {
    lemma: 'pregunta', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: 'Tengo una pregunta.', exampleChinese: '我有一个问题。',
  },
  idioma: {
    lemma: 'idioma', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: '¿Qué idioma habla usted?', exampleChinese: '您说什么语言？',
  },
  español: {
    lemma: 'español', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: 'Estudio español todos los días.', exampleChinese: '我每天学习西班牙语。',
  },
  chino: {
    lemma: 'chino', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: 'En casa hablamos chino.', exampleChinese: '我们在家说中文。',
  },
  inglés: {
    lemma: 'inglés', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: 'También entiendo un poco de inglés.', exampleChinese: '我也懂一点英语。',
  },
  clase: {
    lemma: 'clase', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: 'La clase empieza a las nueve.', exampleChinese: '九点开始上课。',
  },
  profesor: {
    lemma: 'profesor', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: 'El profesor explica la lección.', exampleChinese: '男老师讲解这节课。',
  },
  profesora: {
    lemma: 'profesora', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: 'La profesora escribe en la pizarra.', exampleChinese: '女老师在黑板上写字。',
  },
  estudiante: {
    lemma: 'estudiante', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: 'Soy estudiante de español.', exampleChinese: '我是西班牙语学生。',
  },
  ejemplo: {
    lemma: 'ejemplo', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: '¿Puede darme un ejemplo?', exampleChinese: '您可以给我一个例子吗？',
  },
  fácil: {
    lemma: 'fácil', partOfSpeech: 'adjective', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: 'Este ejercicio es fácil.', exampleChinese: '这道练习很容易。',
  },
  difícil: {
    lemma: 'difícil', partOfSpeech: 'adjective', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: 'Esta palabra es difícil.', exampleChinese: '这个单词很难。',
  },
  trabajo: {
    lemma: 'trabajo', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: 'Busco trabajo en Madrid.', exampleChinese: '我在马德里找工作。',
  },
  oficina: {
    lemma: 'oficina', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: 'La oficina abre a las ocho.', exampleChinese: '办公室八点开门。',
  },
  empresa: {
    lemma: 'empresa', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: 'Trabajo en una empresa pequeña.', exampleChinese: '我在一家小公司工作。',
  },
  jefe: {
    lemma: 'jefe', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: 'Mi jefe está en una reunión.', exampleChinese: '我的上司正在开会。',
  },
  compañero: {
    lemma: 'compañero', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: 'Mi compañero me ayuda.', exampleChinese: '我的同事帮助我。',
  },
  correo: {
    lemma: 'correo', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: 'Le envío el documento por correo.', exampleChinese: '我通过邮件把文件发给您。',
  },
  mensaje: {
    lemma: 'mensaje', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: 'Tengo un mensaje para usted.', exampleChinese: '我有一条给您的消息。',
  },
  información: {
    lemma: 'información', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: 'Necesito más información sobre el curso.', exampleChinese: '我需要更多关于课程的信息。',
  },
  fecha: {
    lemma: 'fecha', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: studyWorkReviewKey,
    example: '¿Cuál es la fecha de la cita?', exampleChinese: '预约日期是哪一天？',
  },
  tomar: {
    lemma: 'tomar', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: actionTwoReviewKey,
    example: 'Voy a tomar el autobús para ir al trabajo.', exampleChinese: '我要坐公交车去上班。',
  },
  llevar: {
    lemma: 'llevar', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: actionTwoReviewKey,
    example: 'Necesito llevar agua en la mochila.', exampleChinese: '我需要在背包里带上水。',
  },
  necesitar: {
    lemma: 'necesitar', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: actionTwoReviewKey,
    example: 'Voy a necesitar medio kilo de tomates.', exampleChinese: '我需要半公斤西红柿。',
  },
  usar: {
    lemma: 'usar', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: actionTwoReviewKey,
    example: 'Puede usar esta tarjeta.', exampleChinese: '您可以使用这张卡。',
  },
  comprar: {
    lemma: 'comprar', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: actionTwoReviewKey,
    example: 'Voy a comprar fruta y leche.', exampleChinese: '我要买水果和牛奶。',
  },
  pagar: {
    lemma: 'pagar', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: actionTwoReviewKey,
    example: 'Puede pagar en la caja automática.', exampleChinese: '您可以在自助收银台付款。',
  },
  pedir: {
    lemma: 'pedir', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: actionTwoReviewKey,
    example: 'Voy a pedir la cuenta.', exampleChinese: '我要结账。',
  },
  abrir: {
    lemma: 'abrir', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: actionTwoReviewKey,
    example: '¿Puede abrir la ventana?', exampleChinese: '您可以打开窗户吗？',
  },
  cerrar: {
    lemma: 'cerrar', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: actionTwoReviewKey,
    example: 'Voy a cerrar la puerta.', exampleChinese: '我要关门。',
  },
  leer: {
    lemma: 'leer', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: actionTwoReviewKey,
    example: 'Quiero leer este libro.', exampleChinese: '我想读这本书。',
  },
  escribir: {
    lemma: 'escribir', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: actionTwoReviewKey,
    example: 'Necesito escribir mi dirección.', exampleChinese: '我需要写下我的地址。',
  },
  escuchar: {
    lemma: 'escuchar', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: actionTwoReviewKey,
    example: 'Me gusta escuchar música.', exampleChinese: '我喜欢听音乐。',
  },
  entender: {
    lemma: 'entender', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: actionTwoReviewKey,
    example: 'Ahora puedo entender la pregunta.', exampleChinese: '现在我能理解这个问题了。',
  },
  viaje: {
    lemma: 'viaje', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: travelReviewKey,
    example: 'El viaje a Valencia dura dos horas.', exampleChinese: '去瓦伦西亚的行程要两个小时。',
  },
  estación: {
    lemma: 'estación', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: travelReviewKey,
    example: 'La estación está cerca del hotel.', exampleChinese: '车站离酒店很近。',
  },
  aeropuerto: {
    lemma: 'aeropuerto', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: travelReviewKey,
    example: 'El autobús va directo al aeropuerto.', exampleChinese: '这辆公交车直达机场。',
  },
  tren: {
    lemma: 'tren', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: travelReviewKey,
    example: 'El tren sale a las ocho.', exampleChinese: '火车八点出发。',
  },
  autobús: {
    lemma: 'autobús', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: travelReviewKey,
    example: 'Tomo el autobús para ir al trabajo.', exampleChinese: '我坐公交车去上班。',
  },
  metro: {
    lemma: 'metro', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: travelReviewKey,
    example: 'Voy al centro en metro.', exampleChinese: '我坐地铁去市中心。',
  },
  taxi: {
    lemma: 'taxi', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: travelReviewKey,
    example: 'Necesitamos un taxi para cuatro personas.', exampleChinese: '我们四个人需要一辆出租车。',
  },
  coche: {
    lemma: 'coche', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: travelReviewKey,
    example: 'Mi coche está en el aparcamiento.', exampleChinese: '我的车停在停车场。',
  },
  avión: {
    lemma: 'avión', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: travelReviewKey,
    example: 'El avión llega con veinte minutos de retraso.', exampleChinese: '飞机晚点二十分钟到达。',
  },
  billete: {
    lemma: 'billete', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: travelReviewKey,
    example: 'Quiero comprar un billete a Madrid.', exampleChinese: '我想买一张去马德里的票。',
  },
  maleta: {
    lemma: 'maleta', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: travelReviewKey,
    example: 'Mi maleta pesa diez kilos.', exampleChinese: '我的行李箱重十公斤。',
  },
  equipaje: {
    lemma: 'equipaje', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: travelReviewKey,
    example: 'Dejo el equipaje en la consigna.', exampleChinese: '我把行李寄存在行李寄存处。',
  },
  mapa: {
    lemma: 'mapa', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: travelReviewKey,
    example: 'Miro el mapa para encontrar la calle.', exampleChinese: '我看地图找这条街。',
  },
  hotel: {
    lemma: 'hotel', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: travelReviewKey,
    example: 'El hotel está frente a la estación.', exampleChinese: '酒店在车站对面。',
  },
  reserva: {
    lemma: 'reserva', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: travelReviewKey,
    example: 'Tengo una reserva para dos noches.', exampleChinese: '我预订了两晚。',
  },
  pasaporte: {
    lemma: 'pasaporte', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: travelReviewKey,
    example: 'Guardo el pasaporte en la mochila.', exampleChinese: '我把护照放在背包里。',
  },
  andén: {
    lemma: 'andén', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: travelReviewKey,
    example: 'El tren sale del andén cuatro.', exampleChinese: '火车从四号站台出发。',
  },
  asiento: {
    lemma: 'asiento', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: travelReviewKey,
    example: 'Mi asiento está junto a la ventana.', exampleChinese: '我的座位靠窗。',
  },
  ida: {
    lemma: 'ida', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: travelReviewKey,
    example: 'Necesito un billete de ida.', exampleChinese: '我需要一张单程票。',
  },
  vuelta: {
    lemma: 'vuelta', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: travelReviewKey,
    example: 'La vuelta es el domingo por la tarde.', exampleChinese: '返程是星期日下午。',
  },
  mal: {
    lemma: 'mal', partOfSpeech: 'adverb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: a1HealthRemainderReviewKey,
    example: 'Hoy me siento mal.', exampleChinese: '我今天感觉不舒服。',
  },
  cambio: {
    lemma: 'cambio', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Guarde el tique para hacer un cambio.', exampleChinese: '请保留小票，以便换货。',
  },
  regalo: {
    lemma: 'regalo', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Busco un regalo para mi madre.', exampleChinese: '我在给母亲挑一份礼物。',
  },
  cliente: {
    lemma: 'cliente', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'El cliente espera en la caja.', exampleChinese: '顾客在收银台等待。',
  },
  disponible: {
    lemma: 'disponible', partOfSpeech: 'adjective', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Esta talla no está disponible.', exampleChinese: '这个尺码没有货。',
  },
  cabeza: {
    lemma: 'cabeza', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Me duele la cabeza.', exampleChinese: '我头疼。',
  },
  cara: {
    lemma: 'cara', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Tengo una mancha roja en la cara.', exampleChinese: '我脸上有一块红斑。',
  },
  mano: {
    lemma: 'mano', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Me duele la mano derecha.', exampleChinese: '我的右手疼。',
  },
  brazo: {
    lemma: 'brazo', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Levante el brazo, por favor.', exampleChinese: '请抬起手臂。',
  },
  pierna: {
    lemma: 'pierna', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Me he hecho daño en la pierna.', exampleChinese: '我的腿受伤了。',
  },
  pie: {
    lemma: 'pie', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Tengo una herida en el pie.', exampleChinese: '我的脚上有伤口。',
  },
  cuerpo: {
    lemma: 'cuerpo', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Me duele todo el cuerpo.', exampleChinese: '我浑身疼。',
  },
  dolor: {
    lemma: 'dolor', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Tengo dolor de espalda.', exampleChinese: '我背疼。',
  },
  fiebre: {
    lemma: 'fiebre', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'El niño tiene fiebre.', exampleChinese: '孩子发烧了。',
  },
  medicina: {
    lemma: 'medicina', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Tomo esta medicina después de comer.', exampleChinese: '我饭后服用这种药。',
  },
  cansado: {
    lemma: 'cansado', partOfSpeech: 'adjective', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Estoy cansado después del trabajo.', exampleChinese: '下班后我很累。',
  },
  mejor: {
    lemma: 'mejor', partOfSpeech: 'adverb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Hoy me siento mejor.', exampleChinese: '我今天感觉好些了。',
  },
  urgente: {
    lemma: 'urgente', partOfSpeech: 'adjective', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Necesito una cita urgente.', exampleChinese: '我需要一个紧急预约。',
  },
  respuesta: {
    lemma: 'respuesta', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'No sé la respuesta.', exampleChinese: '我不知道答案。',
  },
  idea: {
    lemma: 'idea', partOfSpeech: 'noun', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Tengo una idea para el proyecto.', exampleChinese: '我对这个项目有一个想法。',
  },
  correcto: {
    lemma: 'correcto', partOfSpeech: 'adjective', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'El número es correcto.', exampleChinese: '这个号码是正确的。',
  },
  error: {
    lemma: 'error', partOfSpeech: 'noun', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Hay un error en el documento.', exampleChinese: '文件里有一个错误。',
  },
  nivel: {
    lemma: 'nivel', partOfSpeech: 'noun', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Mi nivel de español es A2.', exampleChinese: '我的西班牙语水平是 A2。',
  },
  reunión: {
    lemma: 'reunión', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'La reunión empieza a las nueve.', exampleChinese: '会议九点开始。',
  },
  proyecto: {
    lemma: 'proyecto', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'El proyecto termina este mes.', exampleChinese: '这个项目本月结束。',
  },
  problema: {
    lemma: 'problema', partOfSpeech: 'noun', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Tenemos un problema con el pedido.', exampleChinese: '我们的订单出了问题。',
  },
  solución: {
    lemma: 'solución', partOfSpeech: 'noun', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Buscamos una solución sencilla.', exampleChinese: '我们在寻找一个简单的解决办法。',
  },
  documento: {
    lemma: 'documento', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Firme este documento, por favor.', exampleChinese: '请在这份文件上签字。',
  },
  equipo: {
    lemma: 'equipo', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Nuestro equipo trabaja desde casa.', exampleChinese: '我们的团队居家办公。',
  },
  importante: {
    lemma: 'importante', partOfSpeech: 'adjective', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Este documento es importante.', exampleChinese: '这份文件很重要。',
  },
  posible: {
    lemma: 'posible', partOfSpeech: 'adjective', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: '¿Es posible cambiar la fecha?', exampleChinese: '可以更改日期吗？',
  },
  listo: {
    lemma: 'listo', partOfSpeech: 'adjective', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'El informe ya está listo.', exampleChinese: '报告已经准备好了。',
  },
  ocupado: {
    lemma: 'ocupado', partOfSpeech: 'adjective', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Estoy ocupado esta mañana.', exampleChinese: '我今天上午很忙。',
  },
  libre: {
    lemma: 'libre', partOfSpeech: 'adjective', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Estoy libre después de las cinco.', exampleChinese: '我五点以后有空。',
  },
  poner: {
    lemma: 'poner', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Voy a poner las llaves sobre la mesa.', exampleChinese: '我要把钥匙放在桌上。',
  },
  pasar: {
    lemma: 'pasar', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Puedes pasar por mi oficina esta tarde.', exampleChinese: '你今天下午可以到我的办公室来一趟。',
  },
  deber: {
    lemma: 'deber', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'No quiero deber dinero a nadie.', exampleChinese: '我不想欠任何人钱。',
  },
  dejar: {
    lemma: 'dejar', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Voy a dejar el paquete en recepción.', exampleChinese: '我要把包裹留在前台。',
  },
  recordar: {
    lemma: 'recordar', partOfSpeech: 'verb', frameworkReference: A1_A2_GENERAL_NOTIONS, reviewKey: a2PracticalReviewKey,
    example: 'Quiero recordar la fecha de la cita.', exampleChinese: '我想记住预约日期。',
  },
}
