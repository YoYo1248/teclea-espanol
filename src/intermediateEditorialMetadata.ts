import type { EditorialMetadata } from './editorialMetadata'

const B1_B2_FUNCTIONS = 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/05_funciones_inventario_b1-b2.htm'
const B1_B2_GENERAL_NOTIONS = 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/08_nociones_generales_inventario_b1-b2.htm'
const B1_B2_SPECIFIC_NOTIONS = 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_b1-b2.htm'
const B1_REVIEW_KEY = 'intermediate-b1-editorial-001'
const B2_REVIEW_KEY = 'intermediate-b2-editorial-002'

// These cards already existed in the canonical catalog. This overlay makes the
// complete B1 legacy set ready for named review without changing card identity.
// Examples are project-authored drafts and do not count as professional review.
export const intermediateEditorialMetadata: Readonly<Record<string, EditorialMetadata>> = {
  'en mi opinión': {
    lemma: 'en mi opinión', partOfSpeech: 'fixed-expression', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'En mi opinión, el horario es flexible.', exampleChinese: '在我看来，这个时间安排很灵活。',
  },
  'sin embargo': {
    lemma: 'sin embargo', partOfSpeech: 'fixed-expression', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'El piso es pequeño; sin embargo, está bien situado.', exampleChinese: '这套公寓很小，不过位置很好。',
  },
  'por eso': {
    lemma: 'por eso', partOfSpeech: 'fixed-expression', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'El tren llegó tarde; por eso perdí la cita.', exampleChinese: '火车晚点了，所以我错过了预约。',
  },
  'de acuerdo': {
    lemma: 'de acuerdo', partOfSpeech: 'fixed-expression', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'De acuerdo, cambiamos la fecha.', exampleChinese: '好的，我们更改日期。',
  },
  'tener razón': {
    lemma: 'tener razón', partOfSpeech: 'fixed-expression', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Puedes tener razón, pero debemos comprobarlo.', exampleChinese: '你可能有道理，但我们必须核实一下。',
  },
  'depender de': {
    lemma: 'depender de', partOfSpeech: 'fixed-expression', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'El precio puede depender de la temporada.', exampleChinese: '价格可能取决于季节。',
  },
  'darse cuenta': {
    lemma: 'darse cuenta', partOfSpeech: 'fixed-expression', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Es fácil darse cuenta del error.', exampleChinese: '这个错误很容易被发现。',
  },
  'estar de acuerdo': {
    lemma: 'estar de acuerdo', partOfSpeech: 'fixed-expression', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Podemos estar de acuerdo en lo esencial.', exampleChinese: '我们可以在核心问题上达成一致。',
  },
  'por una parte': {
    lemma: 'por una parte', partOfSpeech: 'fixed-expression', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Por una parte, el barrio es tranquilo.', exampleChinese: '一方面，这个街区很安静。',
  },
  'por otro lado': {
    lemma: 'por otro lado', partOfSpeech: 'fixed-expression', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Por otro lado, está lejos del centro.', exampleChinese: '另一方面，它离市中心很远。',
  },
  confianza: {
    lemma: 'confianza', partOfSpeech: 'noun', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Tengo confianza en mi equipo.', exampleChinese: '我信任我的团队。',
  },
  vergüenza: {
    lemma: 'vergüenza', partOfSpeech: 'noun', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Me da vergüenza hablar en público.', exampleChinese: '我不好意思在众人面前讲话。',
  },
  ilusión: {
    lemma: 'ilusión', partOfSpeech: 'noun', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Me hace ilusión empezar el curso.', exampleChinese: '我很期待开始这门课程。',
  },
  preocupación: {
    lemma: 'preocupación', partOfSpeech: 'noun', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'La vivienda es mi principal preocupación.', exampleChinese: '住房是我最担心的问题。',
  },
  orgulloso: {
    lemma: 'orgulloso', partOfSpeech: 'adjective', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Estoy orgulloso de mi progreso.', exampleChinese: '我为自己的进步感到自豪。',
  },
  decepcionado: {
    lemma: 'decepcionado', partOfSpeech: 'adjective', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Quedó decepcionado con el servicio.', exampleChinese: '他对这项服务感到失望。',
  },
  tranquilo: {
    lemma: 'tranquilo', partOfSpeech: 'adjective', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'El barrio es tranquilo por la noche.', exampleChinese: '这个街区夜里很安静。',
  },
  sincero: {
    lemma: 'sincero', partOfSpeech: 'adjective', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Fue sincero durante la entrevista.', exampleChinese: '他在面试中很坦诚。',
  },
  paciente: {
    lemma: 'paciente', partOfSpeech: 'adjective', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Hay que ser paciente con los trámites.', exampleChinese: '办理手续需要有耐心。',
  },
  optimista: {
    lemma: 'optimista', partOfSpeech: 'adjective', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Soy optimista sobre el resultado.', exampleChinese: '我对结果持乐观态度。',
  },
  contrato: {
    lemma: 'contrato', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Leo el contrato antes de firmar.', exampleChinese: '我在签字前阅读合同。',
  },
  sueldo: {
    lemma: 'sueldo', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'El sueldo se paga a final de mes.', exampleChinese: '工资在月底发放。',
  },
  horario: {
    lemma: 'horario', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Mi horario cambia cada semana.', exampleChinese: '我的工作时间每周都会变化。',
  },
  entrevista: {
    lemma: 'entrevista', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Tengo una entrevista de trabajo mañana.', exampleChinese: '我明天有一场工作面试。',
  },
  experiencia: {
    lemma: 'experiencia', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Tengo experiencia en atención al cliente.', exampleChinese: '我有客户服务方面的经验。',
  },
  currículum: {
    lemma: 'currículum', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Adjunto mi currículum al correo.', exampleChinese: '我把简历附在邮件中。',
  },
  jornada: {
    lemma: 'jornada', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'La jornada termina a las seis.', exampleChinese: '工作日六点结束。',
  },
  puesto: {
    lemma: 'puesto', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Solicité un puesto de recepcionista.', exampleChinese: '我申请了接待员岗位。',
  },
  solicitar: {
    lemma: 'solicitar', partOfSpeech: 'verb', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Voy a solicitar el permiso hoy.', exampleChinese: '我今天要申请许可。',
  },
  contratar: {
    lemma: 'contratar', partOfSpeech: 'verb', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'La empresa quiere contratar a dos personas.', exampleChinese: '公司想雇用两个人。',
  },
  alquiler: {
    lemma: 'alquiler', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'El alquiler incluye el agua.', exampleChinese: '租金包含水费。',
  },
  propietario: {
    lemma: 'propietario', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'El propietario reparó la calefacción.', exampleChinese: '房东修好了暖气。',
  },
  inquilino: {
    lemma: 'inquilino', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'El inquilino avisó de la avería.', exampleChinese: '租客报告了故障。',
  },
  fianza: {
    lemma: 'fianza', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Pagamos una fianza de un mes.', exampleChinese: '我们支付了一个月的押金。',
  },
  avería: {
    lemma: 'avería', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Hay una avería en la caldera.', exampleChinese: '锅炉出了故障。',
  },
  mudanza: {
    lemma: 'mudanza', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'La mudanza será el sábado.', exampleChinese: '我们星期六搬家。',
  },
  empadronamiento: {
    lemma: 'empadronamiento', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Necesito el empadronamiento para este trámite.', exampleChinese: '办理这项手续需要住址登记证明。',
  },
  renovar: {
    lemma: 'renovar', partOfSpeech: 'verb', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Debo renovar el contrato en junio.', exampleChinese: '我必须在六月续签合同。',
  },
  formulario: {
    lemma: 'formulario', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Complete este formulario con sus datos.', exampleChinese: '请在这张表格中填写您的资料。',
  },
  empadronarse: {
    lemma: 'empadronarse', partOfSpeech: 'verb', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Para empadronarse, necesita acreditar el domicilio.', exampleChinese: '办理住址登记需要证明居住地址。',
  },
  síntoma: {
    lemma: 'síntoma', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'La tos es el primer síntoma.', exampleChinese: '咳嗽是出现的第一个症状。',
  },
  tratamiento: {
    lemma: 'tratamiento', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'El tratamiento dura dos semanas.', exampleChinese: '治疗持续两周。',
  },
  receta: {
    lemma: 'receta', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Necesito una receta para este medicamento.', exampleChinese: '这种药我需要处方。',
  },
  alergia: {
    lemma: 'alergia', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Tengo alergia al polen.', exampleChinese: '我对花粉过敏。',
  },
  lesión: {
    lemma: 'lesión', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'La lesión necesita reposo.', exampleChinese: '这处伤需要休养。',
  },
  músculo: {
    lemma: 'músculo', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Me duele un músculo de la espalda.', exampleChinese: '我背部的一块肌肉疼。',
  },
  rodilla: {
    lemma: 'rodilla', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Me golpeé la rodilla al caer.', exampleChinese: '我摔倒时撞到了膝盖。',
  },
  mareado: {
    lemma: 'mareado', partOfSpeech: 'adjective', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Me siento mareado desde esta mañana.', exampleChinese: '我从今天早上起一直感到头晕。',
  },
  recuperarse: {
    lemma: 'recuperarse', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Necesita descansar para recuperarse.', exampleChinese: '他需要休息才能恢复。',
  },
  empeorar: {
    lemma: 'empeorar', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'El dolor puede empeorar por la noche.', exampleChinese: '疼痛可能在夜间加重。',
  },
  retraso: {
    lemma: 'retraso', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'El vuelo salió con una hora de retraso.', exampleChinese: '航班晚点一小时起飞。',
  },
  destino: {
    lemma: 'destino', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Madrid es nuestro destino final.', exampleChinese: '马德里是我们的最终目的地。',
  },
  trayecto: {
    lemma: 'trayecto', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'El trayecto dura cuarenta minutos.', exampleChinese: '这段路程需要四十分钟。',
  },
  alojamiento: {
    lemma: 'alojamiento', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'El alojamiento está cerca de la estación.', exampleChinese: '住宿地点离车站很近。',
  },
  excursión: {
    lemma: 'excursión', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Mañana hacemos una excursión a Toledo.', exampleChinese: '我们明天去托莱多短途旅行。',
  },
  frontera: {
    lemma: 'frontera', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Mostramos el pasaporte en la frontera.', exampleChinese: '我们在边境出示护照。',
  },
  reclamar: {
    lemma: 'reclamar', partOfSpeech: 'verb', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Voy a reclamar el importe del billete.', exampleChinese: '我要申请退回票款。',
  },
  reservar: {
    lemma: 'reservar', partOfSpeech: 'verb', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Quiero reservar una habitación doble.', exampleChinese: '我想预订一间双人房。',
  },
  cancelar: {
    lemma: 'cancelar', partOfSpeech: 'verb', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Necesito cancelar la reserva.', exampleChinese: '我需要取消预订。',
  },
  transbordo: {
    lemma: 'transbordo', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Hay que hacer transbordo en Atocha.', exampleChinese: '需要在阿托查换乘。',
  },
  matrícula: {
    lemma: 'matrícula', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'El plazo de matrícula termina el viernes.', exampleChinese: '注册期限星期五截止。',
  },
  beca: {
    lemma: 'beca', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Solicité una beca para el curso.', exampleChinese: '我为这门课程申请了奖学金。',
  },
  asignatura: {
    lemma: 'asignatura', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Esta asignatura tiene examen final.', exampleChinese: '这门课有期末考试。',
  },
  apuntes: {
    lemma: 'apunte', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Comparto mis apuntes con un compañero.', exampleChinese: '我和一位同学分享课堂笔记。',
  },
  aprobar: {
    lemma: 'aprobar', partOfSpeech: 'verb', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Necesito aprobar el examen para continuar.', exampleChinese: '我需要通过考试才能继续。',
  },
  suspender: {
    lemma: 'suspender', partOfSpeech: 'verb', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Temo suspender la asignatura.', exampleChinese: '我担心这门课不及格。',
  },
  entregar: {
    lemma: 'entregar', partOfSpeech: 'verb', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Debemos entregar el trabajo mañana.', exampleChinese: '我们明天必须交作业。',
  },
  corregir: {
    lemma: 'corregir', partOfSpeech: 'verb', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'La profesora va a corregir los ejercicios.', exampleChinese: '老师要批改练习。',
  },
  memorizar: {
    lemma: 'memorizar', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'No basta con memorizar las respuestas.', exampleChinese: '只记住答案是不够的。',
  },
  deducir: {
    lemma: 'deducir', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Podemos deducir la respuesta por el contexto.', exampleChinese: '我们可以根据上下文推断答案。',
  },
  noticia: {
    lemma: 'noticia', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Leí la noticia en el periódico.', exampleChinese: '我在报纸上读到了这条新闻。',
  },
  medios: {
    lemma: 'medio', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Los medios publicaron la información.', exampleChinese: '媒体发布了这条信息。',
  },
  pantalla: {
    lemma: 'pantalla', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'La pantalla del móvil está rota.', exampleChinese: '手机屏幕坏了。',
  },
  archivo: {
    lemma: 'archivo', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Adjunto el archivo al mensaje.', exampleChinese: '我把文件附在消息中。',
  },
  contraseña: {
    lemma: 'contraseña', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Cambie la contraseña cada cierto tiempo.', exampleChinese: '请定期更改密码。',
  },
  descargar: {
    lemma: 'descargar', partOfSpeech: 'verb', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Puede descargar el documento aquí.', exampleChinese: '您可以在这里下载文件。',
  },
  compartir: {
    lemma: 'compartir', partOfSpeech: 'verb', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Voy a compartir el enlace con el grupo.', exampleChinese: '我要把链接分享给小组。',
  },
  conectar: {
    lemma: 'conectar', partOfSpeech: 'verb', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'No consigo conectar el ordenador a la red.', exampleChinese: '我无法把电脑连接到网络。',
  },
  informado: {
    lemma: 'informado', partOfSpeech: 'adjective', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Quiero estar informado de los cambios.', exampleChinese: '我希望及时了解变动。',
  },
  enlace: {
    lemma: 'enlace', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'El enlace no funciona.', exampleChinese: '这个链接打不开。',
  },
  barrio: {
    lemma: 'barrio', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Mi barrio tiene buenos servicios.', exampleChinese: '我的街区公共服务很好。',
  },
  población: {
    lemma: 'población', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'La población ha crecido este año.', exampleChinese: '人口今年有所增长。',
  },
  tráfico: {
    lemma: 'tráfico', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Hay mucho tráfico por la mañana.', exampleChinese: '早上的车流量很大。',
  },
  contaminación: {
    lemma: 'contaminación', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'La contaminación afecta a la salud.', exampleChinese: '污染影响健康。',
  },
  reciclaje: {
    lemma: 'reciclaje', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'El reciclaje reduce los residuos.', exampleChinese: '回收利用可以减少废弃物。',
  },
  energía: {
    lemma: 'energía', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'El edificio consume menos energía.', exampleChinese: '这栋建筑消耗的能源更少。',
  },
  empleo: {
    lemma: 'empleo', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Busco empleo en el sector turístico.', exampleChinese: '我在旅游行业找工作。',
  },
  extranjero: {
    lemma: 'extranjero', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Soy extranjero y vivo en España.', exampleChinese: '我是外国人，住在西班牙。',
  },
  ciudadano: {
    lemma: 'ciudadano', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Todo ciudadano puede presentar una solicitud.', exampleChinese: '每位公民都可以提交申请。',
  },
  sostenible: {
    lemma: 'sostenible', partOfSpeech: 'adjective', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Necesitamos un transporte más sostenible.', exampleChinese: '我们需要更可持续的交通方式。',
  },
  conseguir: {
    lemma: 'conseguir', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Quiero conseguir un contrato estable.', exampleChinese: '我想获得一份稳定的合同。',
  },
  evitar: {
    lemma: 'evitar', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Debemos evitar el tráfico del centro.', exampleChinese: '我们应该避开市中心的车流。',
  },
  permitir: {
    lemma: 'permitir', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'La norma debe permitir el acceso.', exampleChinese: '这项规定应当允许进入。',
  },
  ocurrir: {
    lemma: 'ocurrir', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'El problema puede ocurrir otra vez.', exampleChinese: '这个问题可能再次发生。',
  },
  mejorar: {
    lemma: 'mejorar', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Quiero mejorar mi pronunciación.', exampleChinese: '我想改善自己的发音。',
  },
  elegir: {
    lemma: 'elegir', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Puede elegir entre dos horarios.', exampleChinese: '您可以在两个时间安排中选择。',
  },
  reconocer: {
    lemma: 'reconocer', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'No pude reconocer la calle.', exampleChinese: '我没能认出这条街。',
  },
  resolver: {
    lemma: 'resolver', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Necesitamos resolver esta avería.', exampleChinese: '我们需要解决这个故障。',
  },
  aprovechar: {
    lemma: 'aprovechar', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Quiero aprovechar el tiempo libre.', exampleChinese: '我想好好利用空闲时间。',
  },
  comprobar: {
    lemma: 'comprobar', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B1_REVIEW_KEY,
    example: 'Voy a comprobar la fecha de la cita.', exampleChinese: '我要核对预约日期。',
  },
  'por lo tanto': {
    lemma: 'por lo tanto', partOfSpeech: 'fixed-expression', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'No tenemos presupuesto; por lo tanto, aplazamos el proyecto.', exampleChinese: '我们没有预算，因此推迟这个项目。',
  },
  'a pesar de': {
    lemma: 'a pesar de', partOfSpeech: 'fixed-expression', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'A pesar de la lluvia, el vuelo salió a tiempo.', exampleChinese: '尽管下雨，航班仍准时起飞。',
  },
  'en cambio': {
    lemma: 'en cambio', partOfSpeech: 'fixed-expression', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Este barrio es caro; en cambio, el transporte es excelente.', exampleChinese: '这个街区很贵，但交通却非常便利。',
  },
  'de hecho': {
    lemma: 'de hecho', partOfSpeech: 'fixed-expression', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'De hecho, ya hemos enviado la solicitud.', exampleChinese: '事实上，我们已经提交了申请。',
  },
  'en cuanto a': {
    lemma: 'en cuanto a', partOfSpeech: 'fixed-expression', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'En cuanto a la fecha, prefiero el lunes.', exampleChinese: '至于日期，我更希望是星期一。',
  },
  'desde luego': {
    lemma: 'desde luego', partOfSpeech: 'fixed-expression', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Desde luego, debemos revisar el contrato.', exampleChinese: '当然，我们必须审阅合同。',
  },
  'al parecer': {
    lemma: 'al parecer', partOfSpeech: 'fixed-expression', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Al parecer, la avería ya está resuelta.', exampleChinese: '看来，故障已经解决了。',
  },
  'tener en cuenta': {
    lemma: 'tener en cuenta', partOfSpeech: 'fixed-expression', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Hay que tener en cuenta los gastos.', exampleChinese: '必须把各项支出考虑进去。',
  },
  'estar a favor': {
    lemma: 'estar a favor', partOfSpeech: 'fixed-expression', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Es posible estar a favor de ampliar el horario.', exampleChinese: '可以赞成延长开放时间。',
  },
  'estar en contra': {
    lemma: 'estar en contra', partOfSpeech: 'fixed-expression', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'También se puede estar en contra de esa propuesta.', exampleChinese: '也可以反对那项提议。',
  },
  afirmación: {
    lemma: 'afirmación', partOfSpeech: 'noun', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La afirmación necesita pruebas.', exampleChinese: '这项断言需要证据。',
  },
  aclaración: {
    lemma: 'aclaración', partOfSpeech: 'noun', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Gracias por la aclaración.', exampleChinese: '谢谢你的澄清。',
  },
  argumento: {
    lemma: 'argumento', partOfSpeech: 'noun', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Su argumento es claro y convincente.', exampleChinese: '他的论点清晰而有说服力。',
  },
  conclusión: {
    lemma: 'conclusión', partOfSpeech: 'noun', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El informe llega a una conclusión distinta.', exampleChinese: '报告得出了不同的结论。',
  },
  crítica: {
    lemma: 'crítica', partOfSpeech: 'noun', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La crítica señala un problema real.', exampleChinese: '这条批评指出了一个实际问题。',
  },
  propuesta: {
    lemma: 'propuesta', partOfSpeech: 'noun', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Presentamos una propuesta más económica.', exampleChinese: '我们提出了一个更经济的方案。',
  },
  sugerencia: {
    lemma: 'sugerencia', partOfSpeech: 'noun', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Aceptaron mi sugerencia.', exampleChinese: '他们接受了我的建议。',
  },
  destacar: {
    lemma: 'destacar', partOfSpeech: 'verb', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Quiero destacar dos resultados.', exampleChinese: '我想强调两项结果。',
  },
  resumir: {
    lemma: 'resumir', partOfSpeech: 'verb', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Voy a resumir los puntos principales.', exampleChinese: '我要概括主要观点。',
  },
  insistir: {
    lemma: 'insistir', partOfSpeech: 'verb', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El cliente volvió a insistir en el reembolso.', exampleChinese: '顾客再次坚持要求退款。',
  },
  rendimiento: {
    lemma: 'rendimiento', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El rendimiento del equipo ha mejorado.', exampleChinese: '团队表现有所改善。',
  },
  plazo: {
    lemma: 'plazo', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El plazo termina el viernes.', exampleChinese: '期限到星期五结束。',
  },
  presupuesto: {
    lemma: 'presupuesto', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El proyecto supera el presupuesto.', exampleChinese: '这个项目超出了预算。',
  },
  negociación: {
    lemma: 'negociación', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La negociación duró varias semanas.', exampleChinese: '谈判持续了数周。',
  },
  responsabilidad: {
    lemma: 'responsabilidad', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Cada persona tiene una responsabilidad distinta.', exampleChinese: '每个人承担不同的责任。',
  },
  requisito: {
    lemma: 'requisito', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La experiencia es un requisito del puesto.', exampleChinese: '工作经验是这个岗位的一项要求。',
  },
  liderazgo: {
    lemma: 'liderazgo', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Su liderazgo mejoró la coordinación.', exampleChinese: '他的领导力改善了协调。',
  },
  productividad: {
    lemma: 'productividad', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La nueva herramienta aumentó la productividad.', exampleChinese: '新工具提高了生产率。',
  },
  coordinar: {
    lemma: 'coordinar', partOfSpeech: 'verb', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Debemos coordinar las tareas del equipo.', exampleChinese: '我们必须协调团队任务。',
  },
  asumir: {
    lemma: 'asumir', partOfSpeech: 'verb', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Estoy dispuesto a asumir esa responsabilidad.', exampleChinese: '我愿意承担那项责任。',
  },
  desempleo: {
    lemma: 'desempleo', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El desempleo bajó en la región.', exampleChinese: '该地区的失业率下降了。',
  },
  ingresos: {
    lemma: 'ingreso', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Mis ingresos varían cada mes.', exampleChinese: '我的收入每个月都会变化。',
  },
  gastos: {
    lemma: 'gasto', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Anoto todos los gastos del hogar.', exampleChinese: '我会记下家庭的所有支出。',
  },
  ahorro: {
    lemma: 'ahorro', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El ahorro nos permite afrontar imprevistos.', exampleChinese: '储蓄让我们能够应对意外开支。',
  },
  deuda: {
    lemma: 'deuda', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La empresa redujo su deuda.', exampleChinese: '公司减少了债务。',
  },
  impuesto: {
    lemma: 'impuesto', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Este impuesto se paga una vez al año.', exampleChinese: '这项税每年缴纳一次。',
  },
  inversión: {
    lemma: 'inversión', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La inversión creó nuevos empleos.', exampleChinese: '这项投资创造了新的就业岗位。',
  },
  consumo: {
    lemma: 'consumo', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Debemos reducir el consumo de energía.', exampleChinese: '我们必须减少能源消耗。',
  },
  financiación: {
    lemma: 'financiación', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El proyecto necesita financiación pública.', exampleChinese: '这个项目需要公共资金支持。',
  },
  coste: {
    lemma: 'coste', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El coste total incluye los impuestos.', exampleChinese: '总成本包括税款。',
  },
  desigualdad: {
    lemma: 'desigualdad', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La educación puede reducir la desigualdad.', exampleChinese: '教育可以减少不平等。',
  },
  convivencia: {
    lemma: 'convivencia', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El respeto mejora la convivencia.', exampleChinese: '尊重可以改善共同生活。',
  },
  diversidad: {
    lemma: 'diversidad', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La diversidad cultural enriquece la ciudad.', exampleChinese: '文化多样性丰富了这座城市。',
  },
  solidaridad: {
    lemma: 'solidaridad', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La comunidad mostró mucha solidaridad.', exampleChinese: '社区展现了强烈的互助精神。',
  },
  derecho: {
    lemma: 'derecho', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La vivienda es un derecho básico.', exampleChinese: '住房是一项基本权利。',
  },
  obligación: {
    lemma: 'obligación', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Informar del cambio es nuestra obligación.', exampleChinese: '告知这一变化是我们的义务。',
  },
  legislación: {
    lemma: 'legislación', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La legislación protege a los consumidores.', exampleChinese: '法律保护消费者。',
  },
  voluntariado: {
    lemma: 'voluntariado', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Hago voluntariado los fines de semana.', exampleChinese: '我周末参加志愿服务。',
  },
  integración: {
    lemma: 'integración', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El idioma facilita la integración.', exampleChinese: '语言有助于融入当地生活。',
  },
  discriminación: {
    lemma: 'discriminación', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La ley prohíbe la discriminación.', exampleChinese: '法律禁止歧视。',
  },
  privacidad: {
    lemma: 'privacidad', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La aplicación protege la privacidad del usuario.', exampleChinese: '这个应用保护用户隐私。',
  },
  fiabilidad: {
    lemma: 'fiabilidad', partOfSpeech: 'noun', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Debemos evaluar la fiabilidad de la fuente.', exampleChinese: '我们必须评估信息来源的可靠性。',
  },
  fuente: {
    lemma: 'fuente', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Comprueba la fuente antes de compartir la noticia.', exampleChinese: '分享新闻前请核查来源。',
  },
  rumor: {
    lemma: 'rumor', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El rumor se difundió rápidamente.', exampleChinese: '传闻迅速传播开来。',
  },
  cobertura: {
    lemma: 'cobertura', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La cobertura del tema fue limitada.', exampleChinese: '媒体对这个话题的报道很有限。',
  },
  publicación: {
    lemma: 'publicación', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La publicación del informe se retrasó.', exampleChinese: '报告的发布推迟了。',
  },
  contenido: {
    lemma: 'contenido', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El contenido incluye datos actualizados.', exampleChinese: '内容包含最新数据。',
  },
  difundir: {
    lemma: 'difundir', partOfSpeech: 'verb', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'No debemos difundir información falsa.', exampleChinese: '我们不应该传播虚假信息。',
  },
  verificar: {
    lemma: 'verificar', partOfSpeech: 'verb', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Es importante verificar cada dato.', exampleChinese: '核实每项数据很重要。',
  },
  actualizar: {
    lemma: 'actualizar', partOfSpeech: 'verb', frameworkReference: B1_B2_FUNCTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Voy a actualizar la información del perfil.', exampleChinese: '我要更新个人资料信息。',
  },
  sostenibilidad: {
    lemma: 'sostenibilidad', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La sostenibilidad forma parte del plan.', exampleChinese: '可持续性是这项计划的一部分。',
  },
  biodiversidad: {
    lemma: 'biodiversidad', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El incendio dañó la biodiversidad local.', exampleChinese: '火灾破坏了当地的生物多样性。',
  },
  especie: {
    lemma: 'especie', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Esta especie está protegida.', exampleChinese: '这一物种受到保护。',
  },
  recurso: {
    lemma: 'recurso', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El agua es un recurso limitado.', exampleChinese: '水是一种有限资源。',
  },
  residuo: {
    lemma: 'residuo', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Cada residuo debe separarse correctamente.', exampleChinese: '每种废弃物都应正确分类。',
  },
  emisiones: {
    lemma: 'emisión', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Las emisiones bajaron el año pasado.', exampleChinese: '排放量去年下降了。',
  },
  sequía: {
    lemma: 'sequía', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La sequía afecta a la agricultura.', exampleChinese: '干旱影响农业。',
  },
  investigación: {
    lemma: 'investigación', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La investigación analiza nuevos datos.', exampleChinese: '这项研究分析了新的数据。',
  },
  análisis: {
    lemma: 'análisis', partOfSpeech: 'noun', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El análisis confirma la tendencia.', exampleChinese: '分析证实了这一趋势。',
  },
  evidencia: {
    lemma: 'evidencia', partOfSpeech: 'noun', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La evidencia no apoya esa conclusión.', exampleChinese: '证据不支持那项结论。',
  },
  trámite: {
    lemma: 'trámite', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El trámite puede hacerse por internet.', exampleChinese: '这项手续可以在线办理。',
  },
  solicitud: {
    lemma: 'solicitud', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La solicitud sigue pendiente.', exampleChinese: '这份申请仍在等待处理。',
  },
  resolución: {
    lemma: 'resolución', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Recibimos una resolución favorable.', exampleChinese: '我们收到了有利的决定。',
  },
  autorización: {
    lemma: 'autorización', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Necesita una autorización para entrar.', exampleChinese: '进入需要许可。',
  },
  reclamación: {
    lemma: 'reclamación', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Presenté una reclamación por el cobro.', exampleChinese: '我针对这笔收费提出了投诉。',
  },
  denuncia: {
    lemma: 'denuncia', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La víctima presentó una denuncia.', exampleChinese: '受害者报了案。',
  },
  garantía: {
    lemma: 'garantía', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El producto tiene tres años de garantía.', exampleChinese: '这件商品有三年保修。',
  },
  sanción: {
    lemma: 'sanción', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La empresa recurrió la sanción.', exampleChinese: '公司对处罚提出了申诉。',
  },
  expediente: {
    lemma: 'expediente', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Puede consultar el expediente en línea.', exampleChinese: '您可以在线查询案卷。',
  },
  normativa: {
    lemma: 'normativa', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La nueva normativa entra en vigor mañana.', exampleChinese: '新规章明天生效。',
  },
  autoestima: {
    lemma: 'autoestima', partOfSpeech: 'noun', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El apoyo mejoró su autoestima.', exampleChinese: '支持提升了他的自尊。',
  },
  ansiedad: {
    lemma: 'ansiedad', partOfSpeech: 'noun', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La incertidumbre me produce ansiedad.', exampleChinese: '不确定感让我焦虑。',
  },
  bienestar: {
    lemma: 'bienestar', partOfSpeech: 'noun', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Dormir bien mejora el bienestar.', exampleChinese: '睡眠充足有助于身心健康。',
  },
  decepción: {
    lemma: 'decepción', partOfSpeech: 'noun', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La cancelación fue una gran decepción.', exampleChinese: '这次取消令人非常失望。',
  },
  incertidumbre: {
    lemma: 'incertidumbre', partOfSpeech: 'noun', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'La espera genera incertidumbre.', exampleChinese: '等待会带来不确定感。',
  },
  compromiso: {
    lemma: 'compromiso', partOfSpeech: 'noun', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El acuerdo exige compromiso de ambas partes.', exampleChinese: '这项协议要求双方都投入并履行承诺。',
  },
  conflicto: {
    lemma: 'conflicto', partOfSpeech: 'noun', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El diálogo ayudó a resolver el conflicto.', exampleChinese: '对话有助于解决冲突。',
  },
  apoyo: {
    lemma: 'apoyo', partOfSpeech: 'noun', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Necesitamos el apoyo del equipo.', exampleChinese: '我们需要团队的支持。',
  },
  superar: {
    lemma: 'superar', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Pudo superar una etapa difícil.', exampleChinese: '他克服了一个困难阶段。',
  },
  afrontar: {
    lemma: 'afrontar', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Debemos afrontar el problema juntos.', exampleChinese: '我们必须共同面对这个问题。',
  },
  provocar: {
    lemma: 'provocar', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El ruido puede provocar estrés.', exampleChinese: '噪声可能引发压力。',
  },
  plantear: {
    lemma: 'plantear', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Quiero plantear una alternativa.', exampleChinese: '我想提出一个替代方案。',
  },
  establecer: {
    lemma: 'establecer', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El contrato debe establecer el plazo.', exampleChinese: '合同应当规定期限。',
  },
  desarrollar: {
    lemma: 'desarrollar', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'El equipo va a desarrollar una solución.', exampleChinese: '团队将制定一个解决方案。',
  },
  mantener: {
    lemma: 'mantener', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Debemos mantener la información actualizada.', exampleChinese: '我们必须保持信息为最新状态。',
  },
  alcanzar: {
    lemma: 'alcanzar', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Esperamos alcanzar un acuerdo.', exampleChinese: '我们希望达成协议。',
  },
  valorar: {
    lemma: 'valorar', partOfSpeech: 'verb', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Conviene valorar todas las opciones.', exampleChinese: '应当评估所有选择。',
  },
  adecuado: {
    lemma: 'adecuado', partOfSpeech: 'adjective', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Este horario no es adecuado para el equipo.', exampleChinese: '这个时间安排不适合团队。',
  },
  probable: {
    lemma: 'probable', partOfSpeech: 'adjective', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Es probable que el tren llegue tarde.', exampleChinese: '火车很可能晚点。',
  },
  consciente: {
    lemma: 'consciente', partOfSpeech: 'adjective', frameworkReference: B1_B2_GENERAL_NOTIONS, reviewKey: B2_REVIEW_KEY,
    example: 'Soy consciente de los riesgos.', exampleChinese: '我意识到了这些风险。',
  },
}
