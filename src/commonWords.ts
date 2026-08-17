export type CommonDeck = {
  id: string
  level: 'A1' | 'A2'
  scene: '基础' | '日常' | '餐厅' | '旅行' | '购物' | '住宿' | '时间' | '家庭' | '城市' | '健康' | '学习' | '工作'
  title: string
  description: string
  words: Array<[spanish: string, chinese: string]>
}

// Teaching selection built from the wordfreq Spanish frequency order and
// checked against Kaikki / English Wiktionary. Chinese glosses are concise
// editorial labels for this app, not copied dictionary definitions.
export const commonDecks: CommonDeck[] = [
  {
    id: 'common-connectors', level: 'A1', scene: '基础', title: '连接与问句', description: '组成基本句子最常见的小词',
    words: [
      ['y', '和 / 并且'], ['o', '或者'], ['pero', '但是'], ['porque', '因为'], ['si', '如果'],
      ['no', '不'], ['sí', '是 / 对'], ['también', '也'], ['tampoco', '也不'], ['muy', '很 / 非常'],
      ['más', '更多 / 更'], ['menos', '更少'], ['aquí', '这里'], ['allí', '那里'], ['ahora', '现在'],
      ['qué', '什么'], ['quién', '谁'], ['cómo', '怎样'], ['cuándo', '什么时候'], ['dónde', '哪里'],
    ],
  },
  {
    id: 'common-time', level: 'A1', scene: '时间', title: '时间与日期', description: '安排见面、日期和一天的节奏',
    words: [
      ['hoy', '今天'], ['ayer', '昨天'], ['mañana', '明天 / 早晨'], ['día', '天'], ['semana', '星期 / 周'],
      ['mes', '月'], ['año', '年'], ['hora', '小时 / 点钟'], ['minuto', '分钟'], ['lunes', '星期一'],
      ['martes', '星期二'], ['miércoles', '星期三'], ['jueves', '星期四'], ['viernes', '星期五'], ['sábado', '星期六'],
      ['domingo', '星期日'], ['temprano', '早'], ['tarde', '下午 / 晚'], ['noche', '夜晚'], ['siempre', '总是'],
    ],
  },
  {
    id: 'common-numbers', level: 'A1', scene: '基础', title: '数字与数量', description: '价格、时间和人数都离不开',
    words: [
      ['cero', '零'], ['uno', '一'], ['dos', '二'], ['tres', '三'], ['cuatro', '四'],
      ['cinco', '五'], ['seis', '六'], ['siete', '七'], ['ocho', '八'], ['nueve', '九'],
      ['diez', '十'], ['once', '十一'], ['doce', '十二'], ['veinte', '二十'], ['cien', '一百'],
      ['primero', '第一'], ['último', '最后'], ['mucho', '很多'], ['poco', '很少'], ['bastante', '相当多 / 足够'],
    ],
  },
  {
    id: 'common-family', level: 'A1', scene: '家庭', title: '人物与家庭', description: '介绍自己和身边的人',
    words: [
      ['persona', '人'], ['hombre', '男人'], ['mujer', '女人'], ['niño', '男孩 / 小孩'], ['niña', '女孩'],
      ['amigo', '男性朋友'], ['amiga', '女性朋友'], ['familia', '家庭 / 家人'], ['padre', '父亲'], ['madre', '母亲'],
      ['hijo', '儿子'], ['hija', '女儿'], ['hermano', '兄弟'], ['hermana', '姐妹'], ['marido', '丈夫'],
      ['esposa', '妻子'], ['nombre', '名字'], ['edad', '年龄'], ['señor', '先生'], ['señora', '女士'],
    ],
  },
  {
    id: 'common-home', level: 'A1', scene: '日常', title: '家与日常', description: '住处、物品和每天会做的事',
    words: [
      ['casa', '家 / 房子'], ['habitación', '房间'], ['cocina', '厨房'], ['baño', '卫生间'], ['puerta', '门'],
      ['ventana', '窗户'], ['mesa', '桌子'], ['silla', '椅子'], ['cama', '床'], ['llave', '钥匙'],
      ['teléfono', '电话 / 手机'], ['ropa', '衣服'], ['zapato', '鞋'], ['bolsa', '袋子 / 包'], ['cosa', '东西 / 事情'],
      ['limpio', '干净的'], ['sucio', '脏的'], ['abierto', '开着的'], ['cerrado', '关着的'], ['cerca', '附近'],
    ],
  },
  {
    id: 'common-food', level: 'A1', scene: '餐厅', title: '食物与点餐', description: '从早餐到餐厅结账',
    words: [
      ['agua', '水'], ['café', '咖啡'], ['té', '茶'], ['leche', '牛奶'], ['pan', '面包'],
      ['arroz', '米饭'], ['carne', '肉'], ['pescado', '鱼'], ['pollo', '鸡肉'], ['huevo', '鸡蛋'],
      ['fruta', '水果'], ['verdura', '蔬菜'], ['desayuno', '早餐'], ['comida', '食物 / 午餐'], ['cena', '晚餐'],
      ['hambre', '饥饿'], ['sed', '口渴'], ['menú', '菜单'], ['cuenta', '账单'], ['delicioso', '美味的'],
    ],
  },
  {
    id: 'common-city', level: 'A1', scene: '城市', title: '城市与方向', description: '找地点、问方向、认路标',
    words: [
      ['calle', '街道'], ['plaza', '广场'], ['ciudad', '城市'], ['centro', '中心 / 市中心'], ['tienda', '商店'],
      ['mercado', '市场'], ['banco', '银行'], ['hospital', '医院'], ['farmacia', '药店'], ['escuela', '学校'],
      ['derecha', '右边'], ['izquierda', '左边'], ['delante', '前面'], ['detrás', '后面'], ['dentro', '里面'],
      ['fuera', '外面'], ['lejos', '远'], ['camino', '道路'], ['entrada', '入口'], ['salida', '出口'],
    ],
  },
  {
    id: 'common-travel', level: 'A2', scene: '旅行', title: '交通与旅行', description: '买票、乘车、住宿和出行',
    words: [
      ['viaje', '旅行'], ['estación', '车站'], ['aeropuerto', '机场'], ['tren', '火车'], ['autobús', '公交车 / 大巴'],
      ['metro', '地铁'], ['taxi', '出租车'], ['coche', '汽车'], ['avión', '飞机'], ['billete', '票'],
      ['maleta', '行李箱'], ['equipaje', '行李'], ['mapa', '地图'], ['hotel', '酒店'], ['reserva', '预订'],
      ['pasaporte', '护照'], ['andén', '站台'], ['asiento', '座位'], ['ida', '去程'], ['vuelta', '返回 / 回程'],
    ],
  },
  {
    id: 'common-shopping', level: 'A2', scene: '购物', title: '购物与服务', description: '询价、挑选、尺码和付款',
    words: [
      ['precio', '价格'], ['dinero', '钱'], ['efectivo', '现金'], ['tarjeta', '卡'], ['recibo', '收据'],
      ['barato', '便宜的'], ['caro', '贵的'], ['grande', '大的'], ['pequeño', '小的'], ['talla', '尺码'],
      ['color', '颜色'], ['rojo', '红色'], ['azul', '蓝色'], ['blanco', '白色'], ['negro', '黑色'],
      ['nuevo', '新的'], ['cambio', '更换 / 找零'], ['regalo', '礼物'], ['cliente', '顾客'], ['disponible', '可用的 / 有货的'],
    ],
  },
  {
    id: 'common-health', level: 'A2', scene: '健康', title: '身体与健康', description: '描述身体部位和简单不适',
    words: [
      ['cabeza', '头'], ['cara', '脸'], ['ojo', '眼睛'], ['boca', '嘴'], ['mano', '手'],
      ['brazo', '手臂'], ['pierna', '腿'], ['pie', '脚'], ['cuerpo', '身体'], ['salud', '健康'],
      ['dolor', '疼痛'], ['fiebre', '发烧'], ['médico', '医生'], ['medicina', '药'], ['cansado', '疲惫的'],
      ['enfermo', '生病的'], ['mejor', '更好'], ['mal', '不好 / 糟糕'], ['ayuda', '帮助'], ['urgente', '紧急的'],
    ],
  },
  {
    id: 'common-study', level: 'A2', scene: '学习', title: '学习与语言', description: '课堂、阅读和语言交流',
    words: [
      ['libro', '书'], ['página', '页'], ['palabra', '单词'], ['pregunta', '问题'], ['respuesta', '回答'],
      ['idioma', '语言'], ['español', '西班牙语'], ['chino', '中文 / 中国的'], ['inglés', '英语'], ['clase', '课程 / 教室'],
      ['profesor', '男老师'], ['profesora', '女老师'], ['estudiante', '学生'], ['ejemplo', '例子'], ['idea', '想法'],
      ['fácil', '容易的'], ['difícil', '困难的'], ['correcto', '正确的'], ['error', '错误'], ['nivel', '水平 / 等级'],
    ],
  },
  {
    id: 'common-work', level: 'A2', scene: '工作', title: '工作与联络', description: '办公室、计划和基本协作',
    words: [
      ['trabajo', '工作'], ['oficina', '办公室'], ['empresa', '公司'], ['jefe', '上司'], ['compañero', '同事'],
      ['reunión', '会议'], ['proyecto', '项目'], ['problema', '问题'], ['solución', '解决办法'], ['correo', '邮件'],
      ['mensaje', '消息'], ['información', '信息'], ['documento', '文件'], ['fecha', '日期'], ['equipo', '团队'],
      ['importante', '重要的'], ['posible', '可能的'], ['listo', '准备好的'], ['ocupado', '忙的'], ['libre', '空闲的 / 自由的'],
    ],
  },
  {
    id: 'common-actions-one', level: 'A1', scene: '日常', title: '核心动作 I', description: '最先要掌握的高频动词原形',
    words: [
      ['ser', '是（本质）'], ['estar', '是 / 在（状态）'], ['tener', '有'], ['hacer', '做'], ['ir', '去'],
      ['venir', '来'], ['poder', '能够'], ['querer', '想要 / 喜爱'], ['decir', '说'], ['hablar', '说话'],
      ['ver', '看见'], ['dar', '给'], ['saber', '知道'], ['conocer', '认识 / 了解'], ['comer', '吃'],
      ['beber', '喝'], ['vivir', '生活 / 居住'], ['dormir', '睡觉'], ['salir', '出去'], ['llegar', '到达'],
    ],
  },
  {
    id: 'common-actions-two', level: 'A2', scene: '日常', title: '核心动作 II', description: '对话里反复出现的实用动词',
    words: [
      ['poner', '放置'], ['pasar', '经过 / 发生'], ['deber', '应该'], ['tomar', '拿 / 喝 / 乘坐'], ['llevar', '携带 / 穿着'],
      ['dejar', '留下 / 允许'], ['encontrar', '找到'], ['buscar', '寻找'], ['necesitar', '需要'], ['usar', '使用'],
      ['comprar', '购买'], ['pagar', '付款'], ['pedir', '请求 / 点餐'], ['abrir', '打开'], ['cerrar', '关闭'],
      ['leer', '阅读'], ['escribir', '书写'], ['escuchar', '听'], ['entender', '理解'], ['recordar', '记得'],
    ],
  },
  {
    id: 'common-dialogue', level: 'A2', scene: '基础', title: '基本对话搭配', description: '能直接拿来开口的短表达',
    words: [
      ['buenos días', '早上好'], ['buenas tardes', '下午好'], ['buenas noches', '晚上好'], ['hasta mañana', '明天见'], ['muchas gracias', '非常感谢'],
      ['de nada', '不客气'], ['por supuesto', '当然'], ['no sé', '我不知道'], ['no entiendo', '我不明白'], ['otra vez', '再来一次'],
      ['más despacio', '慢一点'], ['está bien', '好的 / 没问题'], ['tengo hambre', '我饿了'], ['tengo sed', '我渴了'], ['me gusta', '我喜欢'],
      ['no me gusta', '我不喜欢'], ['cuánto cuesta', '多少钱'], ['dónde está', '在哪里'], ['qué hora es', '几点了'], ['necesito ayuda', '我需要帮助'],
    ],
  },
]
