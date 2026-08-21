export type NewcomerDeck = {
  id: string
  level: 'B1' | 'B2'
  scene: '住宿' | '学习' | '工作' | '城市' | '行政'
  kind: '单词' | '短语'
  title: string
  description: string
  source: { name: string; url: string; license: string; checkedAt: string }
  words: Array<{ spanish: string; chinese: string; example: string; exampleChinese: string; note?: string }>
}

const checkedAt = '2026-08-20'
const editorialLicense = '官方办事页面用于任务用语核对；中文释义、例句与教学编组 GPL-3.0'
const w = (spanish: string, chinese: string, example: string, exampleChinese: string, note?: string) => ({ spanish, chinese, example, exampleChinese, note })

// Practical-gap batch for people settling in Spain. These cards are based on
// vocabulary that recurs in official housing, education, employment and
// residence procedures. They supplement rather than replace the wordfreq/PCIC
// expansion pipeline and remain HolaDone editorial learning-order suggestions.
export const newcomerDecks: NewcomerDeck[] = [
  {
    id: 'newcomer-renting-b1', level: 'B1', scene: '住宿', kind: '单词', title: '租房签约与交接',
    description: '看房、核对租约、登记住址和退租时会遇到的词',
    source: {
      name: '西班牙消费者事务部门 · 住房租赁与房地产中介用语核对',
      url: 'https://portal-cec.consumo.gob.es/sites/default/files/documentos/NI_AGENCIAS_INMOBILIARIAS_23_10_2024.pdf',
      license: editorialLicense, checkedAt,
    },
    words: [
      w('casero', '房东（口语）', 'El casero revisará la avería mañana.', '房东明天会查看故障。', '正式合同常用 arrendador；女性形式 casera'),
      w('inmobiliaria', '房地产中介；房地产的', 'La inmobiliaria organiza la visita al piso.', '房地产中介安排看房。'),
      w('cláusula', '合同条款', 'Lee cada cláusula antes de firmar.', '签字前请阅读每一条合同条款。'),
      w('arrendador', '出租人', 'El arrendador firma el contrato de alquiler.', '出租人在租赁合同上签字。', '女性形式 arrendadora'),
      w('arrendatario', '承租人', 'El arrendatario entrega la fianza.', '承租人支付押金。', '女性形式 arrendataria'),
      w('padrón', '市镇居民登记册', 'El ayuntamiento actualiza el padrón municipal.', '市政府更新市镇居民登记册。'),
      w('mensualidad', '月租；每月应付款', 'La mensualidad se paga al principio del mes.', '月租在月初支付。'),
      w('desperfecto', '损坏；瑕疵', 'Fotografía cualquier desperfecto antes de entrar.', '入住前拍下任何损坏之处。'),
    ],
  },
  {
    id: 'newcomer-homebuying-b2', level: 'B2', scene: '住宿', kind: '单词', title: '购房、贷款与保险',
    description: '比较房源、申请贷款和阅读保险文件时的核心词',
    source: {
      name: 'Banco de España · 住房按揭、估价与关联保险用语核对',
      url: 'https://clientebancario.bde.es/pcb/es/menu-horizontal/productosservici/financiacion/hipotecas/guia-textual/primerospasoscon/Seguros_hipotecarios.html',
      license: editorialLicense, checkedAt,
    },
    words: [
      w('hipoteca', '住房按揭贷款；抵押', 'El banco estudia la solicitud de hipoteca.', '银行审核住房按揭申请。'),
      w('tasación', '估价；评估', 'La tasación determina el valor de la vivienda.', '估价确定住房价值。'),
      w('inmueble', '不动产；房产', 'El informe describe el estado del inmueble.', '报告说明该房产的状况。'),
      w('nómina', '工资单；职工名册', 'El banco pide una nómina reciente.', '银行要求提供一份近期工资单。'),
      w('ahorros', '积蓄；储蓄', 'Necesitamos ahorros para pagar la entrada.', '我们需要积蓄来支付首付款。', '通常使用复数形式'),
      w('notario', '公证人；公证员', 'El notario explica la escritura antes de la firma.', '公证人在签字前解释契约内容。', '女性形式 notaria'),
      w('póliza', '保险单；保单', 'La póliza indica qué daños están cubiertos.', '保单说明哪些损失在承保范围内。'),
      w('siniestro', '保险事故；重大事故', 'La compañía abrió un parte por el siniestro.', '保险公司为这起保险事故立案。'),
    ],
  },
  {
    id: 'newcomer-school-b1', level: 'B1', scene: '学习', kind: '单词', title: '选校、入学与校园生活',
    description: '申请学位、了解学校类型和日常安排时的核心词',
    source: {
      name: '西班牙教育部 · 公立与政府资助私立学校入学用语核对',
      url: 'https://educagob.educacionfpydeportes.gob.es/equidad/escolarizacion-cpub-cconc.html',
      license: editorialLicense, checkedAt,
    },
    words: [
      w('guardería', '托儿所；幼儿托管机构', 'Buscamos una guardería cerca de casa.', '我们在找家附近的托儿所。'),
      w('admisión', '录取；入学许可', 'El proceso de admisión empieza en abril.', '入学申请流程四月开始。'),
      w('comedor', '食堂；餐厅', 'El colegio ofrece servicio de comedor.', '学校提供食堂服务。'),
      w('tutor', '班级导师；监护人', 'El tutor hablará con la familia esta tarde.', '班级导师今天下午会与家长沟通。', '女性形式 tutora'),
      w('uniforme', '校服；制服', 'Este centro no exige uniforme escolar.', '这所学校不要求穿校服。'),
      w('concertado', '政府资助的私立学校类型', 'Es un colegio concertado del barrio.', '这是一所位于本街区的政府资助私立学校。', '学校常分为 público、concertado 和 privado'),
      w('escolarización', '入学；就学安排', 'La zona influye en la escolarización.', '所在区域会影响入学安排。'),
      w('alumnado', '全体学生；学生群体', 'El centro publica información para el alumnado.', '学校发布面向学生的信息。'),
    ],
  },
  {
    id: 'newcomer-employment-b1', level: 'B1', scene: '工作', kind: '短语', title: '求职与合同类型',
    description: '阅读招聘信息、比较合同和确认工作资格的固定表达',
    source: {
      name: 'SEPE · 招聘、职位与劳动合同用语核对',
      url: 'https://sepe.es/HomeSepe/encontrar-trabajo/ofertas-empleo',
      license: editorialLicense, checkedAt,
    },
    words: [
      w('puesto vacante', '空缺职位', 'La empresa anuncia un puesto vacante.', '公司发布了一个空缺职位。'),
      w('oferta de empleo', '招聘信息；工作机会', 'Encontré una oferta de empleo interesante.', '我发现了一条感兴趣的招聘信息。'),
      w('contrato indefinido', '无固定期限劳动合同', 'La empresa ofrece un contrato indefinido.', '公司提供无固定期限劳动合同。'),
      w('contrato temporal', '临时劳动合同', 'Firmó un contrato temporal de seis meses.', '他签了一份六个月的临时劳动合同。'),
      w('periodo de prueba', '试用期', 'El contrato incluye un periodo de prueba.', '合同中包含试用期。'),
      w('permiso de trabajo', '工作许可', 'Debe presentar un permiso de trabajo válido.', '他必须提交有效的工作许可。'),
      w('cuenta ajena', '受雇工作；他人雇佣', 'La autorización permite trabajar por cuenta ajena.', '该许可允许受雇工作。'),
      w('cuenta propia', '自雇；自主经营', 'Quiere trabajar por cuenta propia.', '他想自主经营。'),
    ],
  },
  {
    id: 'newcomer-residence-b2', level: 'B2', scene: '行政', kind: '单词', title: '居留、预约与社会保障',
    description: '办理居留、续期和劳动社会保障手续时的关键词',
    source: {
      name: '西班牙政府与移民部门 · 居留登记和工作许可用语核对',
      url: 'https://administracion.gob.es/pag_Home/Tu-espacio-europeo/derechos-obligaciones/ciudadanos/residencia/obtencion-residencia/inscribirte-residente.html',
      license: editorialLicense, checkedAt,
    },
    words: [
      w('NIE', '外国人身份号码', 'El certificado muestra el NIE del solicitante.', '证明上显示申请人的外国人身份号码。'),
      w('TIE', '外国人身份证件', 'Debe renovar la TIE antes de que caduque.', '必须在外国人身份证件到期前续期。'),
      w('prórroga', '延期；续延', 'Presentó una solicitud de prórroga.', '他提交了延期申请。'),
      w('prestación', '补助；社会保障待遇', 'Solicitó una prestación por desempleo.', '他申请了失业补助。'),
      w('subsidio', '补贴；补助金', 'El subsidio depende de varios requisitos.', '该补助取决于多项条件。'),
      w('cita previa', '提前预约；预约时段', 'Necesita cita previa para este trámite.', '办理这项手续需要提前预约。'),
      w('alta laboral', '就业登记；入职参保', 'La empresa tramita el alta laboral.', '公司办理就业登记。'),
      w('baja laboral', '病假；离职或停保登记', 'El médico emitió la baja laboral.', '医生开具了病假证明。'),
    ],
  },
  {
    id: 'newcomer-area-choice-b1', level: 'B1', scene: '城市', kind: '短语', title: '城市与居住区域选择',
    description: '比较通勤、学校、医疗和生活环境时常用的表达',
    source: {
      name: 'HolaDone 新居民任务审计 · 西班牙教育与公共服务页面汇编',
      url: 'https://github.com/YoYo1248/teclea-espanol/blob/main/docs/lexicon/NEWCOMER_UTILITY_AUDIT.md',
      license: editorialLicense, checkedAt,
    },
    words: [
      w('afueras', '郊区；城外', 'La vivienda está en las afueras.', '这套住房位于郊区。', '通常使用复数形式'),
      w('vecindario', '街坊；社区环境', 'El vecindario es tranquilo y está bien comunicado.', '这个社区环境安静，交通也便利。'),
      w('cercanías', '市郊铁路；近郊', 'Hay una estación de cercanías cerca.', '附近有一座市郊铁路车站。', '在西班牙常指通勤铁路系统'),
      w('transporte público', '公共交通', 'La zona tiene buen transporte público.', '这个区域公共交通便利。'),
      w('coste de vida', '生活成本', 'Comparamos el coste de vida de varias ciudades.', '我们比较了几个城市的生活成本。'),
      w('zona escolar', '学区；学校招生区域', 'El domicilio pertenece a otra zona escolar.', '该住址属于另一个学校招生区域。'),
      w('zona verde', '绿地；绿化区域', 'El barrio tiene una zona verde grande.', '这个街区有一大片绿地。'),
      w('centro de salud', '社区医疗中心', 'El centro de salud está a diez minutos.', '社区医疗中心距离这里十分钟。'),
    ],
  },
]
