import type { EditorialMetadata } from './editorialMetadata'

const A1_A2_SPECIFIC_NOTIONS = 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_a1-a2.htm'
const A1_A2_GENERAL_NOTIONS = 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/08_nociones_generales_inventario_a1-a2.htm'
const A1_A2_FUNCTIONS = 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/05_funciones_inventario_a1-a2.htm'
const B1_B2_SPECIFIC_NOTIONS = 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_b1-b2.htm'
const REVIEW_KEY = 'legacy-lexical-metadata-001'

// Lexical fields for legacy cards whose examples and sources already live in
// their original decks. The overlay deliberately does not replace those texts.
export const legacyLexicalMetadata: Readonly<Record<string, EditorialMetadata>> = {
  efectivo: { lemma: 'efectivo', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  recibo: { lemma: 'recibo', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  ascensor: { lemma: 'ascensor', partOfSpeech: 'noun', frameworkReference: A1_A2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  casero: { lemma: 'casero', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  inmobiliaria: { lemma: 'inmobiliaria', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  cláusula: { lemma: 'cláusula', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  arrendador: { lemma: 'arrendador', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  arrendatario: { lemma: 'arrendatario', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  padrón: { lemma: 'padrón', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  mensualidad: { lemma: 'mensualidad', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  desperfecto: { lemma: 'desperfecto', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  hipoteca: { lemma: 'hipoteca', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  tasación: { lemma: 'tasación', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  inmueble: { lemma: 'inmueble', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  nómina: { lemma: 'nómina', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  ahorros: { lemma: 'ahorro', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  notario: { lemma: 'notario', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  póliza: { lemma: 'póliza', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  siniestro: { lemma: 'siniestro', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  guardería: { lemma: 'guardería', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  admisión: { lemma: 'admisión', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  comedor: { lemma: 'comedor', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  tutor: { lemma: 'tutor', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  uniforme: { lemma: 'uniforme', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  concertado: { lemma: 'concertado', partOfSpeech: 'adjective', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  escolarización: { lemma: 'escolarización', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  alumnado: { lemma: 'alumnado', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  NIE: { lemma: 'NIE', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  TIE: { lemma: 'TIE', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  prórroga: { lemma: 'prórroga', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  prestación: { lemma: 'prestación', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  subsidio: { lemma: 'subsidio', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  afueras: { lemma: 'afueras', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  vecindario: { lemma: 'vecindario', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
  cercanías: { lemma: 'cercanías', partOfSpeech: 'noun', frameworkReference: B1_B2_SPECIFIC_NOTIONS, reviewKey: REVIEW_KEY },
}

const legacyFunctionTargets = [
  'hola', 'gracias', 'por favor', 'perdón', 'encantado', 'adiós', 'bienvenido', 'hasta luego',
] as const

const legacyGeneralTargets = [
  'todos los días', 'por la mañana', 'por la tarde', 'por la noche', 'encontrar', 'buscar',
] as const

const legacyA1A2SpecificTargets = [
  'en casa', 'al trabajo', 'con mi familia', 'tiempo libre',
  'buen provecho', 'sin azúcar', 'para llevar',
  'todo recto', 'a la derecha', 'a la izquierda', 'ida y vuelta',
  'me lo llevo', 'muy barato', 'demasiado caro', 'me lo pruebo',
  'habitación disponible', 'ascensor', 'salida tardía',
] as const

const legacyB1B2SpecificTargets = [
  'puesto vacante', 'oferta de empleo', 'contrato indefinido', 'contrato temporal',
  'periodo de prueba', 'permiso de trabajo', 'cuenta ajena', 'cuenta propia',
  'cita previa', 'alta laboral', 'baja laboral',
  'afueras', 'vecindario', 'cercanías', 'transporte público', 'coste de vida',
  'zona escolar', 'zona verde', 'centro de salud',
] as const

// Early scene and newcomer cards already had auditable sources and examples,
// but predated the shared PCIC field. These batch-level mappings complete the
// editorial trail without claiming that PCIC certifies each target.
export const legacyFrameworkMetadata: Readonly<Record<string, Pick<EditorialMetadata, 'frameworkReference'>>> = Object.freeze(Object.fromEntries([
  ...legacyFunctionTargets.map((target) => [target, { frameworkReference: A1_A2_FUNCTIONS }]),
  ...legacyGeneralTargets.map((target) => [target, { frameworkReference: A1_A2_GENERAL_NOTIONS }]),
  ...legacyA1A2SpecificTargets.map((target) => [target, { frameworkReference: A1_A2_SPECIFIC_NOTIONS }]),
  ...legacyB1B2SpecificTargets.map((target) => [target, { frameworkReference: B1_B2_SPECIFIC_NOTIONS }]),
]))
