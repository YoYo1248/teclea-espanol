import type { LexiconRoute } from './vidaWords'

type LessonLevel = 'A2' | 'B1' | 'B2'
type LessonScene = '基础' | '城市' | '旅行' | '购物' | '住宿' | '健康'
type PartOfSpeech = 'noun' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'conjunction' | 'verb'

export type ExamWord = {
  spanish: string
  chinese: string
  lemma: string
  partOfSpeech?: PartOfSpeech
  example: string
  exampleChinese: string
  routes: LexiconRoute[]
}

export type ExamDeck = {
  id: string
  level: LessonLevel
  scene: LessonScene
  kind: '单词' | '短语'
  title: string
  description: string
  reviewKey?: string
  frameworkReference: string
  source: { name: string; url: string; license: string; checkedAt: string }
  words: ExamWord[]
}

const A1_A2_PCIC = 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_a1-a2.htm'
const B1_B2_PCIC = 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_b1-b2.htm'
const A1_A2_FUNCTIONS = 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/05_funciones_inventario_a1-a2.htm'
const B1_B2_FUNCTIONS = 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/05_funciones_inventario_b1-b2.htm'
const checkedAt = '2026-08-21'
const exam: LexiconRoute[] = ['exam']

const transportSource = {
  name: '考试路线出行补缺 · 西班牙交通部门与 PCIC 用语核对',
  url: 'https://www.transportes.gob.es/transporte-terrestre/movilidad/movilidad-sostenible',
  license: '官方页面仅用于核对现实交通用语；中文释义、例句与教学编组 GPL-3.0',
  checkedAt,
}

const airportSource = {
  name: '考试路线出行补缺 · Aena 机场旅客用语与 PCIC 核对',
  url: 'https://www.aena.es/es/pasajeros/equipajes-controles/control-seguridad.html',
  license: 'Aena 页面仅用于核对机场任务用语；中文释义、例句与教学编组 GPL-3.0',
  checkedAt,
}

const passengerSource = {
  name: '考试路线出行补缺 · Renfe 旅客条件、DGT 道路用语与 PCIC 核对',
  url: 'https://www.renfe.com/es/es/ayuda/informacion-legal-viajeros/condiciones-generales/condiciones-generales-renfe-viajeros',
  license: '官方页面仅用于核对旅客、延误与道路任务用语；中文释义、例句与教学编组 GPL-3.0',
  checkedAt,
}

const functionsSourceA1A2 = {
  name: '考试路线功能表达补缺 · PCIC A1–A2 功能清单',
  url: A1_A2_FUNCTIONS,
  license: 'PCIC 仅用于功能与等级映射；中文释义、例句与教学编组 GPL-3.0',
  checkedAt,
}

const functionsSourceB1B2 = {
  name: '考试路线功能表达补缺 · PCIC B1–B2 功能清单',
  url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/05_funciones_inventario_b1-b2.htm',
  license: 'PCIC 仅用于功能与等级映射；中文释义、例句与教学编组 GPL-3.0',
  checkedAt,
}

const transactionSource = {
  name: '考试路线 B1 交易任务补缺 · PCIC 购物、支付与金融服务清单',
  url: B1_B2_PCIC,
  license: 'PCIC 仅用于任务领域与等级映射；中文释义、例句与教学编组 GPL-3.0',
  checkedAt,
}

const housingSource = {
  name: '考试路线住房补缺 · PCIC 与 BOE 租赁用语核对',
  url: 'https://www.boe.es/buscar/act.php?id=BOE-A-1994-26003',
  license: '官方法规页面仅用于核对住房任务用语；中文释义、例句与教学编组 GPL-3.0',
  checkedAt,
}

const consumerSource = {
  name: '考试路线消费事务补缺 · 西班牙消费者中心与 PCIC 核对',
  url: 'https://portal-cec.consumo.gob.es/es/informacion-general/temas-de-consumo/garantias',
  license: '官方消费者页面仅用于核对购物与申诉用语；中文释义、例句与教学编组 GPL-3.0',
  checkedAt,
}

const healthSource = {
  name: '考试路线医疗服务补缺 · 西班牙卫生部与 PCIC 核对',
  url: 'https://www.sanidad.gob.es/profesionales/prestacionesSanitarias/CarteraDeServicios/ContenidoCS/2AtencionPrimaria/home.htm',
  license: '官方卫生页面仅用于核对医疗服务用语；中文释义、例句与教学编组 GPL-3.0',
  checkedAt,
}

const w = (
  spanish: string,
  chinese: string,
  example: string,
  exampleChinese: string,
  partOfSpeech: PartOfSpeech = 'noun',
): ExamWord => ({ spanish, chinese, lemma: spanish.toLocaleLowerCase('es-ES').normalize('NFC'), partOfSpeech, example, exampleChinese, routes: exam })

const p = (spanish: string, chinese: string, example: string, exampleChinese: string): ExamWord => ({
  spanish,
  chinese,
  lemma: spanish.toLocaleLowerCase('es-ES').normalize('NFC'),
  example,
  exampleChinese,
  routes: exam,
})

// First exam-only gap batch. These cards add high-utility A2–B2 mobility
// targets without duplicating existing canonical cards. Level placement is an
// internal PCIC-informed editorial decision, not an official exam word list.
export const examGapDecks: ExamDeck[] = [
  {
    id: 'exam-mobility-city-parts-a2', level: 'A2', scene: '城市', kind: '单词',
    title: '街道与交通位置', description: '描述过街、道路结构和停车位置', frameworkReference: A1_A2_PCIC, source: transportSource,
    words: [
      w('cruce', '交叉口；过街处', 'Gira a la derecha después del cruce.', '过了交叉口后右转。'),
      w('semáforo', '交通信号灯', 'Espera junto al semáforo.', '在交通信号灯旁等候。'),
      w('acera', '人行道', 'La bicicleta no debe bloquear la acera.', '自行车不应堵住人行道。'),
      w('rotonda', '环岛', 'Toma la segunda salida de la rotonda.', '从环岛的第二个出口驶出。'),
      w('carril', '车道', 'Este carril es solo para autobuses.', '这条车道只供公交车使用。'),
      w('atasco', '交通堵塞', 'Hay un atasco en la entrada de la ciudad.', '进城方向堵车了。'),
      w('aparcamiento', '停车场；停车', 'El aparcamiento está detrás de la estación.', '停车场在车站后面。'),
      w('gasolinera', '加油站', 'La próxima gasolinera está a diez kilómetros.', '下一个加油站在十公里外。'),
    ],
  },
  {
    id: 'exam-mobility-users-services-a2', level: 'A2', scene: '旅行', kind: '单词',
    title: '乘客与基础出行服务', description: '识别出行人员、设施和常见交通工具', frameworkReference: A1_A2_PCIC, source: passengerSource,
    words: [
      w('peaje', '收费站；通行费', 'Pagamos el peaje con tarjeta.', '我们用银行卡支付通行费。'),
      w('conductor', '驾驶员；司机', 'El conductor anunció la última parada.', '司机宣布了终点站。'),
      w('pasajero', '乘客；旅客', 'Cada pasajero debe conservar su billete.', '每位乘客都应保留车票。'),
      w('patinete', '滑板车；电动滑板车', 'No puedo subir el patinete a este autobús.', '我不能把滑板车带上这辆公交车。'),
      w('consigna', '行李寄存处', 'Dejamos las maletas en la consigna.', '我们把行李箱寄存在行李寄存处。'),
      w('taquilla', '售票窗口；储物柜', 'La taquilla cierra a las ocho.', '售票窗口八点关闭。'),
      w('tranvía', '有轨电车', 'El tranvía pasa cada quince minutos.', '有轨电车每十五分钟一班。'),
      w('facturación', '值机；托运行李办理', 'La facturación comienza dos horas antes.', '值机在两小时前开始。'),
    ],
  },
  {
    id: 'exam-mobility-tickets-a2', level: 'A2', scene: '旅行', kind: '短语',
    title: '买票与换乘', description: '询问票种、线路、班次和换乘方式', frameworkReference: A1_A2_PCIC, source: passengerSource,
    words: [
      p('billete sencillo', '单程票', 'Quiero un billete sencillo para Toledo.', '我想买一张去托莱多的单程票。'),
      p('abono transporte', '交通月票；交通通票', 'El abono transporte incluye el metro.', '交通通票包含地铁。'),
      p('hora punta', '交通高峰时段', 'El tren va lleno en hora punta.', '火车在高峰时段很拥挤。'),
      p('próxima parada', '下一站', 'La próxima parada es Sol.', '下一站是太阳门。'),
      p('tren regional', '区域列车', 'El tren regional sale del andén cuatro.', '区域列车从四号站台发车。'),
      p('tren de cercanías', '近郊通勤列车', 'Tomamos el tren de cercanías al aeropuerto.', '我们乘近郊通勤列车去机场。'),
      p('línea de autobús', '公交线路', '¿Qué línea de autobús va al centro?', '哪条公交线路去市中心？'),
      p('billete de vuelta', '返程票', 'También necesito un billete de vuelta.', '我还需要一张返程票。'),
    ],
  },
  {
    id: 'exam-mobility-city-navigation-a2', level: 'A2', scene: '城市', kind: '短语',
    title: '城市问路与游览', description: '在陌生城市定位服务点和步行区域', frameworkReference: A1_A2_PCIC, source: transportSource,
    words: [
      p('estación central', '中央车站', 'La estación central está cerca del río.', '中央车站在河边。'),
      p('oficina de turismo', '旅游咨询处', 'Preguntamos en la oficina de turismo.', '我们在旅游咨询处询问。'),
      p('mapa turístico', '旅游地图', 'Este mapa turístico muestra los museos.', '这张旅游地图标出了博物馆。'),
      p('punto de información', '信息咨询点', 'Hay un punto de información en la entrada.', '入口处有一个信息咨询点。'),
      p('zona peatonal', '步行区', 'El hotel está dentro de la zona peatonal.', '酒店位于步行区内。'),
      p('centro histórico', '历史城区', 'El autobús no entra en el centro histórico.', '公交车不进入历史城区。'),
      p('paso de peatones', '人行横道', 'Cruza por el paso de peatones.', '请从人行横道过街。'),
      p('billete de ida', '去程票', 'El billete de ida cuesta veinte euros.', '去程票二十欧元。'),
    ],
  },
  {
    id: 'exam-mobility-disruptions-b1', level: 'B1', scene: '旅行', kind: '单词',
    title: '延误与行程变化', description: '理解交通中断、改道和机场流程变化', frameworkReference: B1_B2_PCIC, source: passengerSource,
    words: [
      w('cancelación', '取消；班次取消', 'La cancelación aparece en la pantalla.', '屏幕上显示该班次取消。'),
      w('demora', '耽搁；延误', 'La demora supera los treinta minutos.', '延误超过三十分钟。'),
      w('desvío', '改道；绕行', 'El autobús sigue un desvío temporal.', '公交车临时改道行驶。'),
      w('huelga', '罢工', 'La huelga afecta a varios trenes.', '罢工影响了多趟列车。'),
      w('embarque', '登机；登船', 'El embarque empieza por la zona B.', '登机从 B 区开始。'),
      w('desembarque', '下机；下船', 'El desembarque se retrasó por la tormenta.', '下机因暴风雨而延误。'),
      w('grúa', '拖车；起重机', 'Llamamos a una grúa para retirar el coche.', '我们叫了一辆拖车来拖走汽车。'),
      w('reparación', '维修；修理', 'La reparación tardará dos días.', '维修需要两天。'),
    ],
  },
  {
    id: 'exam-mobility-road-network-b1', level: 'B1', scene: '城市', kind: '单词',
    title: '道路网络与安全', description: '描述道路结构、救援和路线条件', frameworkReference: B1_B2_PCIC, source: passengerSource,
    words: [
      w('remolque', '拖车；挂车', 'El seguro cubre el remolque del vehículo.', '保险包含车辆拖运。'),
      w('intersección', '道路交叉处', 'La intersección está cerrada por obras.', '该路口因施工关闭。'),
      w('arcén', '路肩', 'El coche se detuvo en el arcén.', '汽车停在了路肩上。'),
      w('autovía', '高速公路；快速路', 'La autovía tiene tres carriles.', '这条快速路有三条车道。'),
      w('señalización', '标志系统；道路标识', 'La señalización indica una ruta alternativa.', '道路标识指出了替代路线。'),
      w('aduana', '海关', 'Tuvimos que declarar el paquete en la aduana.', '我们必须在海关申报包裹。'),
      w('chaleco', '背心；安全反光背心', 'Guarda el chaleco dentro del coche.', '把安全反光背心放在车内。'),
      w('estacionamiento', '停车；停车区域', 'El estacionamiento está limitado a dos horas.', '这里停车限时两小时。'),
    ],
  },
  {
    id: 'exam-mobility-airport-road-b1', level: 'B1', scene: '旅行', kind: '短语',
    title: '机场与道路应对', description: '处理安检、行李、登机和道路救援', frameworkReference: B1_B2_PCIC, source: airportSource,
    words: [
      p('equipaje de mano', '随身行李', 'El equipaje de mano pasa por el escáner.', '随身行李要经过扫描仪。'),
      p('pérdida de equipaje', '行李遗失', 'Comunicó la pérdida de equipaje al llegar.', '他抵达后报告了行李遗失。'),
      p('puerta de embarque', '登机口', 'Han cambiado la puerta de embarque.', '登机口已经更改。'),
      p('control de seguridad', '安全检查', 'Llegue pronto al control de seguridad.', '请提前到达安全检查处。'),
      p('tarjeta de embarque', '登机牌', 'Muestre la tarjeta de embarque en el móvil.', '请出示手机里的登机牌。'),
      p('retraso del vuelo', '航班延误', 'Recibimos un aviso por el retraso del vuelo.', '我们收到了航班延误通知。'),
      p('asistencia en carretera', '道路救援', 'El seguro incluye asistencia en carretera.', '该保险包含道路救援。'),
      p('parte de accidente', '事故报告单', 'Rellenamos el parte de accidente juntos.', '我们一起填写了事故报告单。'),
    ],
  },
  {
    id: 'exam-mobility-rights-b2', level: 'B2', scene: '旅行', kind: '单词',
    title: '旅客权利与交通政策', description: '理解补偿、无障碍和系统性交通问题', frameworkReference: B1_B2_PCIC, source: passengerSource,
    words: [
      w('indemnización', '赔偿金；补偿金', 'La empresa rechazó la indemnización solicitada.', '公司拒绝了申请的赔偿金。'),
      w('compensación', '补偿；赔付', 'La compensación depende de la duración del retraso.', '补偿取决于延误时长。'),
      w('reubicación', '改签安置；重新安排', 'La reubicación se hizo en el siguiente vuelo.', '旅客被改签到下一班航班。'),
      w('accesibilidad', '无障碍程度；可达性', 'La reforma mejorará la accesibilidad de la estación.', '改造将改善车站的无障碍程度。'),
      w('desplazamiento', '出行；位移', 'El teletrabajo reduce algunos desplazamientos.', '远程办公减少了部分出行。'),
      w('congestión', '拥堵；阻塞', 'La congestión aumenta durante las vacaciones.', '假期期间拥堵加剧。'),
      w('itinerario', '行程路线；旅行计划', 'La compañía modificó el itinerario previsto.', '公司修改了原定行程。'),
      w('infracción', '违法行为；违章', 'La policía registró la infracción de tráfico.', '警方登记了这起交通违章。'),
    ],
  },
  {
    id: 'exam-mobility-policy-claims-b2', level: 'B2', scene: '城市', kind: '短语',
    title: '可持续出行与申诉', description: '讨论交通政策并处理服务中断后的权利诉求', frameworkReference: B1_B2_PCIC, source: transportSource,
    words: [
      p('movilidad sostenible', '可持续出行', 'La ciudad fomenta la movilidad sostenible.', '这座城市鼓励可持续出行。'),
      p('transporte interurbano', '城际交通', 'El transporte interurbano conecta varios municipios.', '城际交通连接多个市镇。'),
      p('transporte accesible', '无障碍交通', 'El plan exige un transporte accesible para todos.', '该计划要求为所有人提供无障碍交通。'),
      p('conexión perdida', '错过的转乘；衔接中断', 'Reclamó los gastos por la conexión perdida.', '他就错过转乘造成的费用提出索赔。'),
      p('hoja de reclamaciones', '投诉表', 'Pidió una hoja de reclamaciones en la estación.', '他在车站索要了一张投诉表。'),
      p('interrupción del servicio', '服务中断', 'La interrupción del servicio duró toda la mañana.', '服务中断持续了一整个上午。'),
      p('restricción de acceso', '通行限制', 'La restricción de acceso reduce el tráfico del centro.', '通行限制减少了市中心的车流。'),
      p('derechos del pasajero', '旅客权利', 'El contrato explica los derechos del pasajero.', '合同说明了旅客权利。'),
    ],
  },
  {
    id: 'exam-functions-information-a2', level: 'A2', scene: '基础', kind: '短语',
    title: '询问与简短回应', description: '获取细节、确认态度并对日常情况作出回应', frameworkReference: A1_A2_FUNCTIONS, source: functionsSourceA1A2,
    words: [
      p('qué tipo', '哪一种；什么类型', '¿Qué tipo de habitación necesita?', '您需要哪一种房间？'),
      p('cuánto dura', '持续多久', '¿Cuánto dura la visita guiada?', '导览持续多久？'),
      p('qué te parece', '你觉得怎么样', '¿Qué te parece esta opción?', '你觉得这个选项怎么样？'),
      p('no pasa nada', '没关系；不要紧', 'No pasa nada, podemos esperar.', '没关系，我们可以等。'),
      p('claro que sí', '当然可以；当然是', 'Claro que sí, ahora mismo le ayudo.', '当然可以，我现在就帮您。'),
      p('no estoy seguro', '我不确定（男性说）', 'No estoy seguro de la dirección.', '我不确定地址。'),
      p('tal vez', '也许；可能', 'Tal vez lleguemos un poco tarde.', '我们也许会晚一点到。'),
      p('para qué', '为了什么；有什么用途', '¿Para qué necesita este documento?', '您为什么需要这份文件？'),
    ],
  },
  {
    id: 'exam-functions-opinion-b1', level: 'B1', scene: '基础', kind: '短语',
    title: '交换意见与表达感受', description: '邀请对方表态、回应观点并表达常见情绪', frameworkReference: B1_B2_FUNCTIONS, source: functionsSourceB1B2,
    words: [
      p('tú qué opinas', '你怎么看', 'Yo prefiero la primera opción; ¿tú qué opinas?', '我更喜欢第一个选项；你怎么看？'),
      p('no te parece', '你不觉得吗', 'Sería mejor llamar antes, ¿no te parece?', '最好先打电话，你不觉得吗？'),
      p('yo pienso igual', '我也这么想', 'Yo pienso igual, debemos cambiar el plan.', '我也这么想，我们应该改变计划。'),
      p('es evidente', '显然；很明显', 'Es evidente que falta información.', '显然还缺少信息。'),
      p('a mí también', '我也是；我也一样', 'A mí también me preocupa el retraso.', '我也担心这次延误。'),
      p('eso espero', '但愿如此；我也希望如此', 'Dicen que mañana estará listo; eso espero.', '他们说明天能准备好；但愿如此。'),
      p('qué alivio', '真让人松一口气', '¡Qué alivio saber que está bien!', '知道他没事真让人松一口气！'),
      p('menos mal', '幸好；还好', 'Menos mal que guardamos el recibo.', '幸好我们保留了收据。'),
    ],
  },
  {
    id: 'exam-functions-nuance-b2', level: 'B2', scene: '基础', kind: '短语',
    title: '给观点增加层次', description: '表达确定程度、部分同意、限制和对照', frameworkReference: B1_B2_FUNCTIONS, source: functionsSourceB1B2,
    words: [
      p('sin duda alguna', '毫无疑问', 'Sin duda alguna, necesitamos más pruebas.', '毫无疑问，我们需要更多证据。'),
      p('en líneas generales', '总体而言', 'En líneas generales, estoy de acuerdo.', '总体而言，我同意。'),
      p('en parte', '部分地；在某种程度上', 'La crítica es válida en parte.', '这一批评在某种程度上是成立的。'),
      p('no del todo', '不完全；并非完全', 'La explicación no del todo clara causó dudas.', '不完全清楚的解释引起了疑问。'),
      p('a mi entender', '依我看；据我理解', 'A mi entender, la medida llega tarde.', '依我看，这项措施来得太晚。'),
      p('en cualquier caso', '无论如何', 'En cualquier caso, conviene revisar el contrato.', '无论如何，都应该检查合同。'),
      p('hasta cierto punto', '在一定程度上', 'La propuesta funciona hasta cierto punto.', '这个方案在一定程度上有效。'),
      p('por el contrario', '相反', 'Por el contrario, los costes aumentaron.', '相反，成本上升了。'),
    ],
  },
  {
    id: 'exam-housing-terms-b2', level: 'B2', scene: '住宿', kind: '单词',
    title: '住房、工程与租赁关系', description: '理解住房服务、维护和租赁合同中的核心名词', frameworkReference: B1_B2_PCIC, source: housingSource,
    words: [
      w('constructora', '建筑公司；开发建设公司', 'La constructora entregará las viviendas en junio.', '建筑公司将在六月交付住房。'),
      w('albañilería', '泥瓦工程；砌筑工程', 'El presupuesto incluye los trabajos de albañilería.', '报价包含泥瓦工程。'),
      w('fontanería', '管道工程；水暖维修', 'La avería requiere un servicio de fontanería.', '这个故障需要水暖维修服务。'),
      w('carpintería', '木工；木作工程', 'La reforma también afecta a la carpintería.', '这次翻修也涉及木作工程。'),
      w('conserje', '门卫；楼宇管理员', 'El conserje recibió el paquete.', '门卫收下了包裹。'),
      w('derrama', '业主共同分摊的临时费用', 'La comunidad aprobó una derrama para reparar el tejado.', '业主委员会批准了屋顶维修分摊费。'),
      w('impago', '拖欠付款；未支付', 'El seguro cubre algunos casos de impago.', '该保险覆盖部分拖欠付款情况。'),
      w('arrendamiento', '租赁；租赁关系', 'El arrendamiento termina a final de año.', '租赁关系在年底终止。'),
    ],
  },
  {
    id: 'exam-housing-contracts-b2', level: 'B2', scene: '住宿', kind: '短语',
    title: '看懂住房合同', description: '讨论租金、产权、公共费用和基础服务', frameworkReference: B1_B2_PCIC, source: housingSource,
    words: [
      p('contrato de alquiler', '租房合同', 'Leímos el contrato de alquiler antes de firmar.', '我们签字前阅读了租房合同。'),
      p('gastos de comunidad', '物业公共费用', 'Los gastos de comunidad están incluidos.', '物业公共费用已经包含在内。'),
      p('vivienda en propiedad', '自有产权住房', 'Buscan una vivienda en propiedad cerca del trabajo.', '他们在工作地点附近寻找自有产权住房。'),
      p('vivienda de alquiler', '出租住房；租赁住房', 'La ayuda se dirige a vivienda de alquiler habitual.', '该补助面向日常租赁住房。'),
      p('dar de alta', '开通；登记启用', 'Tenemos que dar de alta el suministro eléctrico.', '我们需要开通电力服务。'),
      p('índice de referencia', '参考指数', 'El contrato menciona el índice de referencia aplicable.', '合同提到了适用的参考指数。'),
      p('renta mensual', '每月租金', 'La renta mensual se paga por transferencia.', '每月租金通过转账支付。'),
      p('seguro de hogar', '家庭住宅保险', 'El seguro de hogar cubre ciertos daños.', '家庭住宅保险覆盖某些损失。'),
    ],
  },
  {
    id: 'exam-consumer-rights-b2', level: 'B2', scene: '购物', kind: '单词',
    title: '消费者权利与争议', description: '理解退货、举证、履约和争议处理中的正式词汇', frameworkReference: B1_B2_PCIC, source: consumerSource,
    words: [
      w('desistimiento', '撤销合同；撤回购买', 'El desistimiento debe comunicarse dentro del plazo.', '撤销购买必须在期限内通知。'),
      w('conformidad', '符合约定；合规状态', 'El vendedor debe restablecer la conformidad del producto.', '卖方必须使商品恢复符合约定的状态。'),
      w('justificante', '凭证；证明文件', 'Conserve el justificante de la compra.', '请保留购物凭证。'),
      w('fabricante', '制造商', 'El fabricante ofrece una garantía adicional.', '制造商提供额外保修。'),
      w('defecto', '缺陷；故障', 'El defecto apareció durante el primer año.', '该缺陷在第一年内出现。'),
      w('comerciante', '商家；经营者', 'El comerciante confirmó la devolución.', '商家确认了退货。'),
      w('incumplimiento', '未履约；违反约定', 'El retraso constituye un incumplimiento del plazo.', '延迟构成未遵守期限。'),
      w('mediación', '调解', 'La asociación propuso una mediación entre las partes.', '协会建议双方进行调解。'),
    ],
  },
  {
    id: 'exam-consumer-claims-b2', level: 'B2', scene: '购物', kind: '短语',
    title: '保修、退货与投诉', description: '说明商品问题并理解可选择的解决途径', frameworkReference: B1_B2_PCIC, source: consumerSource,
    words: [
      p('garantía legal', '法定保修', 'La garantía legal protege al comprador.', '法定保修保护购买者。'),
      p('garantía comercial', '商业附加保修', 'La garantía comercial no sustituye a la legal.', '商业附加保修不能替代法定保修。'),
      p('derecho de desistimiento', '撤销购买的权利', 'La web explica el derecho de desistimiento.', '网站说明了撤销购买的权利。'),
      p('reducción del precio', '降价补偿；减价', 'Solicitó una reducción del precio por el defecto.', '他因商品缺陷要求减价。'),
      p('producto defectuoso', '有缺陷的商品', 'La tienda cambió el producto defectuoso.', '商店更换了有缺陷的商品。'),
      p('atención al cliente', '客户服务', 'Envié la queja a atención al cliente.', '我把投诉发给了客户服务部门。'),
      p('plazo de entrega', '交付期限', 'El vendedor incumplió el plazo de entrega.', '卖方未遵守交付期限。'),
      p('gastos de envío', '运费', 'Los gastos de envío aparecen antes del pago.', '运费在付款前显示。'),
    ],
  },
  {
    id: 'exam-health-services-b2', level: 'B2', scene: '健康', kind: '单词',
    title: '医疗服务与长期照护', description: '理解诊疗、转诊、康复和持续照护中的正式词汇', frameworkReference: B1_B2_PCIC, source: healthSource,
    words: [
      w('rehabilitación', '康复治疗；康复', 'La rehabilitación comenzó después de la operación.', '康复治疗在手术后开始。'),
      w('prescripción', '处方；医疗指示', 'La prescripción indica la dosis diaria.', '处方注明了每日剂量。'),
      w('cuidador', '照护者；护理人', 'El cuidador recibió instrucciones del equipo médico.', '照护者收到了医疗团队的说明。'),
      w('crónico', '慢性的；长期的', 'Es un problema crónico que requiere seguimiento.', '这是一个需要持续随访的慢性问题。', 'adjective'),
      w('derivación', '转诊', 'El médico solicitó una derivación al especialista.', '医生申请转诊至专科医生。'),
      w('paliativo', '缓和性的；姑息性的', 'El tratamiento paliativo busca aliviar los síntomas.', '姑息治疗旨在缓解症状。', 'adjective'),
      w('bucodental', '口腔与牙齿的', 'El centro ofrece atención bucodental infantil.', '该中心提供儿童口腔保健。', 'adjective'),
      w('terapéutico', '治疗性的', 'El equipo revisó el plan terapéutico.', '团队审查了治疗方案。', 'adjective'),
    ],
  },
  {
    id: 'exam-health-care-pathways-b2', level: 'B2', scene: '健康', kind: '短语',
    title: '理解就医路径', description: '区分基础医疗、专科服务和连续照护环节', frameworkReference: B1_B2_PCIC, source: healthSource,
    words: [
      p('atención primaria', '基础医疗；初级保健', 'La atención primaria coordina el seguimiento.', '基础医疗负责协调随访。'),
      p('atención especializada', '专科医疗', 'La atención especializada confirmó el diagnóstico.', '专科医疗确认了诊断。'),
      p('salud mental', '心理健康；精神健康', 'El centro ofrece apoyo de salud mental.', '该中心提供心理健康支持。'),
      p('historial clínico', '病历', 'El médico consultó el historial clínico.', '医生查阅了病历。'),
      p('consentimiento informado', '知情同意', 'Firmó el consentimiento informado antes de la prueba.', '他在检查前签署了知情同意书。'),
      p('efectos secundarios', '副作用', 'Pregunte por los posibles efectos secundarios.', '请询问可能的副作用。'),
      p('grupo de riesgo', '高风险人群', 'El programa prioriza al grupo de riesgo identificado.', '该项目优先照顾已识别的高风险人群。'),
      p('cita de seguimiento', '复诊预约；随访预约', 'Pidió una cita de seguimiento para septiembre.', '他预约了九月的复诊。'),
    ],
  },
  {
    id: 'exam-b1-transactions-retail', level: 'B1', scene: '购物', kind: '短语',
    title: '退换、折扣与价格', description: '在商店说明退换需求并确认价格条件', frameworkReference: B1_B2_PCIC, source: transactionSource,
    reviewKey: 'exam-b1-transaction-function-editorial-003',
    words: [
      p('hacer una devolución', '办理退货', 'Quiero hacer una devolución porque la talla no me sirve.', '我想办理退货，因为这个尺码不合适。'),
      p('hacer un cambio', '办理换货', '¿Puedo hacer un cambio sin el envoltorio?', '没有包装可以办理换货吗？'),
      p('hacer un descuento', '给予折扣', '¿Puede hacer un descuento por esta pequeña tara?', '这处小瑕疵可以给个折扣吗？'),
      p('subir el precio', '提高价格', 'La tienda no puede subir el precio después del pedido.', '商店不能在下单后提高价格。'),
      p('bajar el precio', '降低价格', 'Decidieron bajar el precio al final de la temporada.', '他们决定在季末降低价格。'),
      p('estar de oferta', '正在促销', 'Este modelo suele estar de oferta en enero.', '这个型号一月份通常会促销。'),
      p('tener garantía', '享有保修', 'El aparato debe tener garantía por escrito.', '这台设备应当有书面保修。'),
      p('ir de rebajas', '趁打折季购物', 'Vamos a ir de rebajas el sábado.', '我们星期六去逛打折季。'),
    ],
  },
  {
    id: 'exam-b1-transactions-payment', level: 'B1', scene: '购物', kind: '短语',
    title: '付款与账户操作', description: '完成付款、取款和基础账户事务', frameworkReference: B1_B2_PCIC, source: transactionSource,
    reviewKey: 'exam-b1-transaction-function-editorial-003',
    words: [
      p('pagar intereses', '支付利息', 'Con este crédito hay que pagar intereses.', '使用这笔信贷需要支付利息。'),
      p('pasar por caja', '到收银台结账', 'Antes de salir, tienes que pasar por caja.', '离开前需要到收银台结账。'),
      p('abrir una cuenta', '开立账户', 'Necesito abrir una cuenta para recibir la nómina.', '我需要开一个账户来接收工资。'),
      p('cerrar una cuenta', '注销账户', 'Quiero cerrar una cuenta que ya no uso.', '我想注销一个不再使用的账户。'),
      p('sacar dinero', '取钱；提现', 'Voy a sacar dinero del cajero automático.', '我要去自动取款机取钱。'),
      p('pago con tarjeta', '刷卡付款；银行卡支付', 'El pago con tarjeta fue rechazado.', '这笔银行卡支付被拒绝了。'),
      p('comprar por internet', '网上购物', 'Prefiero comprar por internet cuando comparo precios.', '比较价格时，我更喜欢网上购物。'),
      p('precios especiales', '优惠价格；特别价格', 'La tienda ofrece precios especiales a sus socios.', '商店向会员提供优惠价格。'),
    ],
  },
  {
    id: 'exam-b1-functions-information', level: 'B1', scene: '基础', kind: '短语',
    title: '礼貌询问与确认', description: '询问细节、时间范围并核对信息', frameworkReference: B1_B2_FUNCTIONS, source: functionsSourceB1B2,
    reviewKey: 'exam-b1-transaction-function-editorial-003',
    words: [
      p('podrías decirme', '你可以告诉我……吗', '¿Podrías decirme dónde se solicita el cambio?', '你可以告诉我在哪里申请换货吗？'),
      p('quería saber', '我想了解……', 'Quería saber si el pedido ya ha salido.', '我想了解订单是否已经发出了。'),
      p('desde cuándo', '从什么时候开始', '¿Desde cuándo está cerrada la tienda?', '这家店从什么时候开始关门的？'),
      p('hasta cuándo', '到什么时候为止', '¿Hasta cuándo puedo devolver el producto?', '这件商品最晚什么时候可以退？'),
      p('seguro que', '你确定……吗', '¿Seguro que esta es la dirección correcta?', '你确定这是正确地址吗？'),
      p('me parece bien', '我觉得可以；我赞成', 'Me parece bien cambiar la fecha.', '我觉得改日期可以。'),
      p('me parece mal', '我觉得不妥；我不赞成', 'Me parece mal cobrar ese servicio dos veces.', '我觉得同一项服务收两次费不妥。'),
      p('te importa', '你介意……吗', '¿Te importa esperar unos minutos?', '你介意等几分钟吗？'),
    ],
  },
  {
    id: 'exam-b1-functions-position', level: 'B1', scene: '基础', kind: '短语',
    title: '回应、立场与衔接', description: '回应对方并清楚表达同意、反对和保留', frameworkReference: B1_B2_FUNCTIONS, source: functionsSourceB1B2,
    reviewKey: 'exam-b1-transaction-function-editorial-003',
    words: [
      p('hacerme un favor', '帮我一个忙', '¿Podrías hacerme un favor con este formulario?', '你可以帮我处理一下这张表格吗？'),
      p('tienes razón', '你说得对', 'Tienes razón: debemos pedir otra factura.', '你说得对，我们应该再索取一张发票。'),
      p('no tienes razón', '你说得不对', 'No tienes razón al decir que no hay solución.', '你说没有解决办法，这一点不对。'),
      p('estoy de acuerdo', '我同意', 'Estoy de acuerdo con cambiar el horario.', '我同意调整时间。'),
      p('estoy en desacuerdo', '我不同意', 'Estoy en desacuerdo con esa condición.', '我不同意那项条件。'),
      p('depende de', '取决于', 'El precio final depende de los gastos de envío.', '最终价格取决于运费。'),
      p('por otra parte', '另一方面', 'Por otra parte, la segunda opción incluye garantía.', '另一方面，第二个选项包含保修。'),
      p('no creo que', '我不认为……', 'No creo que esta sea la única solución.', '我不认为这是唯一的解决办法。'),
    ],
  },
]
