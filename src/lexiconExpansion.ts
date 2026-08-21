import { expansionBatch003 } from './lexiconExpansionBatch003'
import { expansionBatch004 } from './lexiconExpansionBatch004'
import { expansionBatch005 } from './lexiconExpansionBatch005'
import { expansionBatch006 } from './lexiconExpansionBatch006'
import { expansionBatch007 } from './lexiconExpansionBatch007'
import { expansionBatch008 } from './lexiconExpansionBatch008'
import { expansionBatch009 } from './lexiconExpansionBatch009'
import { expansionBatch010 } from './lexiconExpansionBatch010'
import { expansionBatch011 } from './lexiconExpansionBatch011'
import { expansionBatch012 } from './lexiconExpansionBatch012'
import { expansionBatch013 } from './lexiconExpansionBatch013'
import { expansionBatch014 } from './lexiconExpansionBatch014'
import { expansionBatch015 } from './lexiconExpansionBatch015'
import { expansionBatch016 } from './lexiconExpansionBatch016'
import { expansionBatch017 } from './lexiconExpansionBatch017'

export type ExpansionDeck = {
  id: string
  level: 'A1' | 'A2' | 'B1' | 'B2'
  scene: '基础' | '日常' | '时间' | '学习' | '社会' | '家庭' | '城市' | '购物' | '健康' | '工作' | '科技' | '行政' | '情绪' | '旅行' | '环境'
  title: string
  description: string
  frameworkReference: string
  words: Array<{
    spanish: string
    chinese: string
    example: string
    exampleChinese: string
    lemma: string
    partOfSpeech: 'noun' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'conjunction'
    frequencyRank: number
  }>
}

// First production expansion batch. Targets come from the wordfreq candidate
// queue, use editorial lemma/canonical forms rather than observed inflections,
// and were mapped conservatively against the linked PCIC level inventories.
// Chinese glosses, examples and grouping are original HolaDone editorial content;
// this batch is not labelled as external professional review.
const expansionBatches001And002: ExpansionDeck[] = [
  {
    id: 'expansion-a1-essentials-001', level: 'A1', scene: '基础', title: '人物、地点与称呼',
    description: '补齐官方框架中最基础但原目录缺失的高频词',
    frameworkReference: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_a1-a2.htm',
    words: [
      { spanish: 'gente', chinese: '人；人们', example: 'La gente espera fuera.', exampleChinese: '人们在外面等。', lemma: 'gente', partOfSpeech: 'noun', frequencyRank: 92 },
      { spanish: 'lugar', chinese: '地方；地点', example: 'Este lugar es tranquilo.', exampleChinese: '这个地方很安静。', lemma: 'lugar', partOfSpeech: 'noun', frequencyRank: 122 },
      { spanish: 'país', chinese: '国家', example: 'España es un país europeo.', exampleChinese: '西班牙是一个欧洲国家。', lemma: 'país', partOfSpeech: 'noun', frequencyRank: 133 },
      { spanish: 'historia', chinese: '历史；故事', example: 'Estudio la historia de España.', exampleChinese: '我学习西班牙历史。', lemma: 'historia', partOfSpeech: 'noun', frequencyRank: 172 },
      { spanish: 'pueblo', chinese: '村镇；民众', example: 'Es un pueblo pequeño.', exampleChinese: '这是一个小镇。', lemma: 'pueblo', partOfSpeech: 'noun', frequencyRank: 244 },
      { spanish: 'tú', chinese: '你（非正式）', example: '¿Tú hablas español?', exampleChinese: '你会说西班牙语吗？', lemma: 'tú', partOfSpeech: 'pronoun', frequencyRank: 310 },
      { spanish: 'foto', chinese: '照片', example: 'Mira esta foto.', exampleChinese: '看看这张照片。', lemma: 'foto', partOfSpeech: 'noun', frequencyRank: 376 },
      { spanish: 'usted', chinese: '您（正式）', example: '¿Usted necesita ayuda?', exampleChinese: '您需要帮助吗？', lemma: 'usted', partOfSpeech: 'pronoun', frequencyRank: 405 },
    ],
  },
  {
    id: 'expansion-a2-time-001', level: 'A2', scene: '日常', title: '时间、顺序与频率',
    description: '讲述日常经历时反复使用的时间和顺序词',
    frameworkReference: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_a1-a2.htm',
    words: [
      { spanish: 'nunca', chinese: '从不；从来不', example: 'Nunca llego tarde.', exampleChinese: '我从不迟到。', lemma: 'nunca', partOfSpeech: 'adverb', frequencyRank: 110 },
      { spanish: 'antes', chinese: '以前；之前', example: 'Antes vivía aquí.', exampleChinese: '我以前住在这里。', lemma: 'antes', partOfSpeech: 'adverb', frequencyRank: 114 },
      { spanish: 'durante', chinese: '在……期间', example: 'Estudio durante dos horas.', exampleChinese: '我学习两个小时。', lemma: 'durante', partOfSpeech: 'preposition', frequencyRank: 120 },
      { spanish: 'alguien', chinese: '某人；有人', example: 'Alguien llama a la puerta.', exampleChinese: '有人在敲门。', lemma: 'alguien', partOfSpeech: 'pronoun', frequencyRank: 151 },
      { spanish: 'momento', chinese: '时刻；片刻', example: 'Espera un momento.', exampleChinese: '等一下。', lemma: 'momento', partOfSpeech: 'noun', frequencyRank: 159 },
      { spanish: 'luego', chinese: '然后；稍后', example: 'Luego te escribo.', exampleChinese: '我稍后给你发消息。', lemma: 'luego', partOfSpeech: 'adverb', frequencyRank: 164 },
      { spanish: 'nadie', chinese: '没有人；谁也不', example: 'No hay nadie en casa.', exampleChinese: '家里没有人。', lemma: 'nadie', partOfSpeech: 'pronoun', frequencyRank: 174 },
      { spanish: 'entonces', chinese: '那么；当时；然后', example: 'Entonces vamos mañana.', exampleChinese: '那我们明天去。', lemma: 'entonces', partOfSpeech: 'adverb', frequencyRank: 185 },
      { spanish: 'casi', chinese: '几乎；差不多', example: 'Casi está listo.', exampleChinese: '差不多准备好了。', lemma: 'casi', partOfSpeech: 'adverb', frequencyRank: 221 },
      { spanish: 'fin', chinese: '结束；末尾', example: 'Es el fin del viaje.', exampleChinese: '这是旅程的终点。', lemma: 'fin', partOfSpeech: 'noun', frequencyRank: 222 },
    ],
  },
  {
    id: 'expansion-a2-world-001', level: 'A2', scene: '社会', title: '学习、服务与周围世界',
    description: '理解学习环境、公共服务和常见社会话题',
    frameworkReference: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_a1-a2.htm',
    words: [
      { spanish: 'mundo', chinese: '世界', example: 'Quiero conocer el mundo.', exampleChinese: '我想了解这个世界。', lemma: 'mundo', partOfSpeech: 'noun', frequencyRank: 97 },
      { spanish: 'gobierno', chinese: '政府', example: 'El gobierno anunció un cambio.', exampleChinese: '政府宣布了一项变化。', lemma: 'gobierno', partOfSpeech: 'noun', frequencyRank: 132 },
      { spanish: 'tipo', chinese: '类型；种类', example: '¿Qué tipo de habitación busca?', exampleChinese: '您在找哪种房间？', lemma: 'tipo', partOfSpeech: 'noun', frequencyRank: 187 },
      { spanish: 'mayor', chinese: '更大的；年长的', example: 'Mi hermana es mayor que yo.', exampleChinese: '我姐姐比我年长。', lemma: 'mayor', partOfSpeech: 'adjective', frequencyRank: 190 },
      { spanish: 'grupo', chinese: '小组；群体', example: 'Trabajo con un grupo pequeño.', exampleChinese: '我和一个小组一起工作。', lemma: 'grupo', partOfSpeech: 'noun', frequencyRank: 212 },
      { spanish: 'amor', chinese: '爱；爱情', example: 'Siente mucho amor por su familia.', exampleChinese: '他非常爱自己的家人。', lemma: 'amor', partOfSpeech: 'noun', frequencyRank: 316 },
      { spanish: 'juego', chinese: '游戏；比赛', example: 'El juego es divertido.', exampleChinese: '这个游戏很有趣。', lemma: 'juego', partOfSpeech: 'noun', frequencyRank: 340 },
      { spanish: 'programa', chinese: '节目；计划；程序', example: 'El programa empieza hoy.', exampleChinese: '这个项目今天开始。', lemma: 'programa', partOfSpeech: 'noun', frequencyRank: 370 },
      { spanish: 'universidad', chinese: '大学', example: 'Estudia en la universidad.', exampleChinese: '她在大学学习。', lemma: 'universidad', partOfSpeech: 'noun', frequencyRank: 373 },
      { spanish: 'servicio', chinese: '服务', example: 'El servicio funciona bien.', exampleChinese: '这项服务运行良好。', lemma: 'servicio', partOfSpeech: 'noun', frequencyRank: 384 },
    ],
  },
  {
    id: 'expansion-b1-links-001', level: 'B1', scene: '基础', title: '组织观点与说明关系',
    description: '从简单句过渡到连贯说明所需的高频连接词',
    frameworkReference: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_b1-b2.htm',
    words: [
      { spanish: 'aunque', chinese: '虽然；即使', example: 'Aunque llueve, salgo.', exampleChinese: '虽然下雨，我还是出门。', lemma: 'aunque', partOfSpeech: 'conjunction', frequencyRank: 128 },
      { spanish: 'forma', chinese: '形式；方式', example: 'Buscamos otra forma de hacerlo.', exampleChinese: '我们在寻找另一种做法。', lemma: 'forma', partOfSpeech: 'noun', frequencyRank: 138 },
      { spanish: 'caso', chinese: '情况；案例', example: 'Es un caso difícil.', exampleChinese: '这是一个棘手的情况。', lemma: 'caso', partOfSpeech: 'noun', frequencyRank: 157 },
      { spanish: 'general', chinese: '总体的；一般的', example: 'Es una explicación general.', exampleChinese: '这是一个总体说明。', lemma: 'general', partOfSpeech: 'adjective', frequencyRank: 189 },
      { spanish: 'además', chinese: '此外；而且', example: 'Además, es muy práctico.', exampleChinese: '而且，它很实用。', lemma: 'además', partOfSpeech: 'adverb', frequencyRank: 192 },
      { spanish: 'según', chinese: '根据；按照', example: 'Según el informe, todo va bien.', exampleChinese: '根据报告，一切进展顺利。', lemma: 'según', partOfSpeech: 'preposition', frequencyRank: 196 },
      { spanish: 'acuerdo', chinese: '协议；一致', example: 'Llegamos a un acuerdo.', exampleChinese: '我们达成了协议。', lemma: 'acuerdo', partOfSpeech: 'noun', frequencyRank: 197 },
      { spanish: 'manera', chinese: '方式；办法', example: 'Hay otra manera de explicarlo.', exampleChinese: '还有另一种解释方法。', lemma: 'manera', partOfSpeech: 'noun', frequencyRank: 201 },
      { spanish: 'medio', chinese: '中间；方式；媒介', example: 'Buscamos un término medio.', exampleChinese: '我们在寻找一个折中方案。', lemma: 'medio', partOfSpeech: 'noun', frequencyRank: 205 },
      { spanish: 'hacia', chinese: '朝向；大约', example: 'Caminamos hacia el centro.', exampleChinese: '我们朝市中心走去。', lemma: 'hacia', partOfSpeech: 'preposition', frequencyRank: 209 },
    ],
  },
  {
    id: 'expansion-b1-society-001', level: 'B1', scene: '社会', title: '制度、现实与公共生活',
    description: '讨论社会、教育和公共事务的基础抽象词',
    frameworkReference: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_b1-b2.htm',
    words: [
      { spanish: 'ley', chinese: '法律', example: 'Esta ley protege a los consumidores.', exampleChinese: '这项法律保护消费者。', lemma: 'ley', partOfSpeech: 'noun', frequencyRank: 204 },
      { spanish: 'sistema', chinese: '系统；体系', example: 'El sistema funciona bien.', exampleChinese: '这个系统运行正常。', lemma: 'sistema', partOfSpeech: 'noun', frequencyRank: 220 },
      { spanish: 'realidad', chinese: '现实', example: 'La realidad es más compleja.', exampleChinese: '现实更加复杂。', lemma: 'realidad', partOfSpeech: 'noun', frequencyRank: 313 },
      { spanish: 'desarrollo', chinese: '发展；开发', example: 'El desarrollo necesita tiempo.', exampleChinese: '发展需要时间。', lemma: 'desarrollo', partOfSpeech: 'noun', frequencyRank: 326 },
      { spanish: 'sociedad', chinese: '社会', example: 'La sociedad está cambiando.', exampleChinese: '社会正在变化。', lemma: 'sociedad', partOfSpeech: 'noun', frequencyRank: 328 },
      { spanish: 'tema', chinese: '主题；话题', example: 'Es un tema importante.', exampleChinese: '这是一个重要话题。', lemma: 'tema', partOfSpeech: 'noun', frequencyRank: 329 },
      { spanish: 'razón', chinese: '原因；理由；道理', example: 'No entiendo la razón.', exampleChinese: '我不明白原因。', lemma: 'razón', partOfSpeech: 'noun', frequencyRank: 356 },
      { spanish: 'seguridad', chinese: '安全；安全保障', example: 'La seguridad es una prioridad.', exampleChinese: '安全是优先事项。', lemma: 'seguridad', partOfSpeech: 'noun', frequencyRank: 365 },
      { spanish: 'situación', chinese: '情况；局势', example: 'La situación ha mejorado.', exampleChinese: '情况已经改善。', lemma: 'situación', partOfSpeech: 'noun', frequencyRank: 385 },
      { spanish: 'educación', chinese: '教育', example: 'La educación abre oportunidades.', exampleChinese: '教育带来机会。', lemma: 'educación', partOfSpeech: 'noun', frequencyRank: 393 },
    ],
  },
  {
    id: 'expansion-a2-life-002', level: 'A2', scene: '日常', title: '感受、文化与休闲',
    description: '描述感受、娱乐和日常文化体验的常用词',
    frameworkReference: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_a1-a2.htm',
    words: [
      { spanish: 'suerte', chinese: '运气；幸运', example: '¡Buena suerte mañana!', exampleChinese: '祝你明天好运！', lemma: 'suerte', partOfSpeech: 'noun', frequencyRank: 475 },
      { spanish: 'cultura', chinese: '文化', example: 'Me interesa la cultura local.', exampleChinese: '我对当地文化感兴趣。', lemma: 'cultura', partOfSpeech: 'noun', frequencyRank: 478 },
      { spanish: 'fuerte', chinese: '强壮的；强烈的', example: 'El viento es muy fuerte.', exampleChinese: '风很大。', lemma: 'fuerte', partOfSpeech: 'adjective', frequencyRank: 484 },
      { spanish: 'miedo', chinese: '害怕；恐惧', example: 'Tengo miedo a volar.', exampleChinese: '我害怕坐飞机。', lemma: 'miedo', partOfSpeech: 'noun', frequencyRank: 487 },
      { spanish: 'música', chinese: '音乐', example: 'Escucho música en casa.', exampleChinese: '我在家听音乐。', lemma: 'música', partOfSpeech: 'noun', frequencyRank: 489 },
      { spanish: 'demasiado', chinese: '太；过于', example: 'Hablas demasiado rápido.', exampleChinese: '你说得太快了。', lemma: 'demasiado', partOfSpeech: 'adverb', frequencyRank: 497 },
      { spanish: 'corazón', chinese: '心脏；内心', example: 'Su corazón está sano.', exampleChinese: '他的心脏很健康。', lemma: 'corazón', partOfSpeech: 'noun', frequencyRank: 531 },
      { spanish: 'joven', chinese: '年轻的', example: 'Es una profesora joven.', exampleChinese: '她是一位年轻的老师。', lemma: 'joven', partOfSpeech: 'adjective', frequencyRank: 563 },
      { spanish: 'película', chinese: '电影', example: 'La película empieza a las ocho.', exampleChinese: '电影八点开始。', lemma: 'película', partOfSpeech: 'noun', frequencyRank: 580 },
    ],
  },
  {
    id: 'expansion-a2-planning-002', level: 'A2', scene: '时间', title: '方向、计划与机会',
    description: '安排未来、描述位置和处理日常信息',
    frameworkReference: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_a1-a2.htm',
    words: [
      { spanish: 'futuro', chinese: '未来', example: 'Pienso en el futuro.', exampleChinese: '我在考虑未来。', lemma: 'futuro', partOfSpeech: 'noun', frequencyRank: 522 },
      { spanish: 'cantidad', chinese: '数量', example: 'Necesito una pequeña cantidad.', exampleChinese: '我需要少量。', lemma: 'cantidad', partOfSpeech: 'noun', frequencyRank: 530 },
      { spanish: 'imagen', chinese: '图像；形象', example: 'La imagen no está clara.', exampleChinese: '图像不清楚。', lemma: 'imagen', partOfSpeech: 'noun', frequencyRank: 535 },
      { spanish: 'norte', chinese: '北方；北部', example: 'Viajamos hacia el norte.', exampleChinese: '我们向北旅行。', lemma: 'norte', partOfSpeech: 'noun', frequencyRank: 537 },
      { spanish: 'sur', chinese: '南方；南部', example: 'Vive en el sur del país.', exampleChinese: '他住在这个国家的南部。', lemma: 'sur', partOfSpeech: 'noun', frequencyRank: 517 },
      { spanish: 'plan', chinese: '计划', example: 'Tengo un plan para mañana.', exampleChinese: '我有一个明天的计划。', lemma: 'plan', partOfSpeech: 'noun', frequencyRank: 565 },
      { spanish: 'papel', chinese: '纸；作用', example: 'Escribe tu nombre en el papel.', exampleChinese: '把你的名字写在纸上。', lemma: 'papel', partOfSpeech: 'noun', frequencyRank: 593 },
      { spanish: 'espacio', chinese: '空间；地方', example: 'No hay suficiente espacio.', exampleChinese: '没有足够的空间。', lemma: 'espacio', partOfSpeech: 'noun', frequencyRank: 625 },
      { spanish: 'oportunidad', chinese: '机会', example: 'Es una buena oportunidad.', exampleChinese: '这是一个好机会。', lemma: 'oportunidad', partOfSpeech: 'noun', frequencyRank: 631 },
    ],
  },
  {
    id: 'expansion-b1-public-002', level: 'B1', scene: '社会', title: '公共生活与共同体',
    description: '讨论权利、制度和社会协作的基础词',
    frameworkReference: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_b1-b2.htm',
    words: [
      { spanish: 'relación', chinese: '关系；联系', example: 'Tenemos una buena relación.', exampleChinese: '我们的关系很好。', lemma: 'relación', partOfSpeech: 'noun', frequencyRank: 473 },
      { spanish: 'justicia', chinese: '正义；司法', example: 'Todos piden justicia.', exampleChinese: '大家都要求正义。', lemma: 'justicia', partOfSpeech: 'noun', frequencyRank: 523 },
      { spanish: 'libertad', chinese: '自由', example: 'La libertad exige responsabilidad.', exampleChinese: '自由需要责任。', lemma: 'libertad', partOfSpeech: 'noun', frequencyRank: 524 },
      { spanish: 'control', chinese: '控制；检查', example: 'La situación está bajo control.', exampleChinese: '局势处于控制之中。', lemma: 'control', partOfSpeech: 'noun', frequencyRank: 509 },
      { spanish: 'comunidad', chinese: '社区；共同体', example: 'La comunidad organiza una reunión.', exampleChinese: '社区组织了一次会议。', lemma: 'comunidad', partOfSpeech: 'noun', frequencyRank: 570 },
      { spanish: 'movimiento', chinese: '运动；移动', example: 'El movimiento crece cada año.', exampleChinese: '这项运动每年都在发展。', lemma: 'movimiento', partOfSpeech: 'noun', frequencyRank: 591 },
      { spanish: 'economía', chinese: '经济', example: 'La economía está cambiando.', exampleChinese: '经济正在变化。', lemma: 'economía', partOfSpeech: 'noun', frequencyRank: 623 },
      { spanish: 'organización', chinese: '组织；安排', example: 'La organización ayuda a muchas familias.', exampleChinese: '这个组织帮助许多家庭。', lemma: 'organización', partOfSpeech: 'noun', frequencyRank: 632 },
      { spanish: 'acción', chinese: '行动；行为', example: 'Necesitamos pasar a la acción.', exampleChinese: '我们需要采取行动。', lemma: 'acción', partOfSpeech: 'noun', frequencyRank: 639 },
    ],
  },
  {
    id: 'expansion-b1-reasoning-002', level: 'B1', scene: '学习', title: '判断、原因与结果',
    description: '表达观点并说明信息质量和因果关系',
    frameworkReference: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_b1-b2.htm',
    words: [
      { spanish: 'fuerza', chinese: '力量；强度', example: 'La propuesta tiene fuerza.', exampleChinese: '这个提议很有说服力。', lemma: 'fuerza', partOfSpeech: 'noun', frequencyRank: 499 },
      { spanish: 'actual', chinese: '当前的；现今的', example: 'La situación actual es diferente.', exampleChinese: '目前的情况不同。', lemma: 'actual', partOfSpeech: 'adjective', frequencyRank: 547 },
      { spanish: 'dirección', chinese: '方向；地址；管理', example: 'Vamos en la dirección correcta.', exampleChinese: '我们的方向是正确的。', lemma: 'dirección', partOfSpeech: 'noun', frequencyRank: 571 },
      { spanish: 'opinión', chinese: '意见；看法', example: 'Respeto tu opinión.', exampleChinese: '我尊重你的意见。', lemma: 'opinión', partOfSpeech: 'noun', frequencyRank: 630 },
      { spanish: 'arte', chinese: '艺术', example: 'El arte refleja la sociedad.', exampleChinese: '艺术反映社会。', lemma: 'arte', partOfSpeech: 'noun', frequencyRank: 640 },
      { spanish: 'valor', chinese: '价值；勇气', example: 'Este dato tiene mucho valor.', exampleChinese: '这项数据很有价值。', lemma: 'valor', partOfSpeech: 'noun', frequencyRank: 650 },
      { spanish: 'calidad', chinese: '质量；品质', example: 'La calidad del servicio ha mejorado.', exampleChinese: '服务质量提高了。', lemma: 'calidad', partOfSpeech: 'noun', frequencyRank: 652 },
      { spanish: 'causa', chinese: '原因；事业', example: 'Buscamos la causa del problema.', exampleChinese: '我们在寻找问题的原因。', lemma: 'causa', partOfSpeech: 'noun', frequencyRank: 653 },
      { spanish: 'resultado', chinese: '结果', example: 'El resultado fue positivo.', exampleChinese: '结果是积极的。', lemma: 'resultado', partOfSpeech: 'noun', frequencyRank: 666 },
    ],
  },
  {
    id: 'expansion-b2-systems-002', level: 'B2', scene: '社会', title: '制度、建设与信息流动',
    description: '讨论公共系统、信息渠道和组织能力',
    frameworkReference: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_b1-b2.htm',
    words: [
      { spanish: 'defensa', chinese: '防御；辩护', example: 'Presentó una defensa clara.', exampleChinese: '他作出了清晰的辩护。', lemma: 'defensa', partOfSpeech: 'noun', frequencyRank: 763 },
      { spanish: 'acceso', chinese: '进入；使用权', example: 'Todos necesitan acceso a la información.', exampleChinese: '每个人都需要获得信息的渠道。', lemma: 'acceso', partOfSpeech: 'noun', frequencyRank: 780 },
      { spanish: 'comunicación', chinese: '沟通；传播', example: 'La comunicación interna debe mejorar.', exampleChinese: '内部沟通需要改善。', lemma: 'comunicación', partOfSpeech: 'noun', frequencyRank: 783 },
      { spanish: 'construcción', chinese: '建设；建造', example: 'La construcción durará dos años.', exampleChinese: '建设将持续两年。', lemma: 'construcción', partOfSpeech: 'noun', frequencyRank: 802 },
      { spanish: 'capacidad', chinese: '能力；容量', example: 'Tiene capacidad para dirigir el equipo.', exampleChinese: '他有能力领导团队。', lemma: 'capacidad', partOfSpeech: 'noun', frequencyRank: 818 },
      { spanish: 'administración', chinese: '行政；管理机构', example: 'La administración publicó el informe.', exampleChinese: '管理部门发布了报告。', lemma: 'administración', partOfSpeech: 'noun', frequencyRank: 838 },
    ],
  },
  {
    id: 'expansion-b2-analysis-002', level: 'B2', scene: '学习', title: '分析目标与变化',
    description: '比较证据、目标和不同阶段的变化',
    frameworkReference: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_b1-b2.htm',
    words: [
      { spanish: 'interés', chinese: '兴趣；利益', example: 'El tema despierta mucho interés.', exampleChinese: '这个话题引起了很大兴趣。', lemma: 'interés', partOfSpeech: 'noun', frequencyRank: 686 },
      { spanish: 'objetivo', chinese: '目标；客观的', example: 'El objetivo debe ser realista.', exampleChinese: '目标应该切合实际。', lemma: 'objetivo', partOfSpeech: 'noun', frequencyRank: 691 },
      { spanish: 'prueba', chinese: '证据；测试', example: 'Esta prueba confirma el resultado.', exampleChinese: '这项证据证实了结果。', lemma: 'prueba', partOfSpeech: 'noun', frequencyRank: 714 },
      { spanish: 'diferencia', chinese: '差异；区别', example: 'La diferencia es importante.', exampleChinese: '这个差异很重要。', lemma: 'diferencia', partOfSpeech: 'noun', frequencyRank: 739 },
      { spanish: 'época', chinese: '时代；时期', example: 'Fue una época de grandes cambios.', exampleChinese: '那是一个发生巨大变化的时期。', lemma: 'época', partOfSpeech: 'noun', frequencyRank: 796 },
      { spanish: 'actividad', chinese: '活动；活跃程度', example: 'La actividad económica aumentó.', exampleChinese: '经济活动增加了。', lemma: 'actividad', partOfSpeech: 'noun', frequencyRank: 798 },
    ],
  },
]

export const expansionDecks: ExpansionDeck[] = [...expansionBatches001And002, ...expansionBatch003, ...expansionBatch004, ...expansionBatch005, ...expansionBatch006, ...expansionBatch007, ...expansionBatch008, ...expansionBatch009, ...expansionBatch010, ...expansionBatch011, ...expansionBatch012, ...expansionBatch013, ...expansionBatch014, ...expansionBatch015, ...expansionBatch016, ...expansionBatch017]
