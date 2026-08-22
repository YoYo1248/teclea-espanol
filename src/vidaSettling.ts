import type { ContentAccess, LifePlacement, LifeTier } from './vidaWords'

export type VidaSettlingTarget = LifePlacement & { spanish: string }

const target = (spanish: string, tier: LifeTier, access: ContentAccess): VidaSettlingTarget => ({
  spanish,
  module: 'settling',
  tier,
  access,
})

const group = (spanish: string[], tier: LifeTier, access: ContentAccess) => spanish.map((item) => target(item, tier, access))

// Vida 在西班牙安顿 V1 reuses canonical targets. Eight neighbourhood
// targets also belong to mobility; lifePlacements keeps both module contexts
// while routes and mastery evidence remain attached to one card.
export const vidaSettlingTargets: VidaSettlingTarget[] = [
  ...group([
    'hola', 'gracias', 'por favor', 'perdón', 'encantado', 'adiós', 'bienvenido', 'hasta luego',
    'reserva', 'habitación', 'llave', 'desayuno', 'noche', 'habitación disponible', 'ascensor', 'salida tardía',
    'sangre', 'espalda', 'cuello', 'pecho', 'dedo', 'nariz', 'doctor', 'herida', 'hombro', 'adulto', 'hueso', 'estómago',
    'opción', 'examen', 'licencia', 'turno',
  ], 'L1', 'free'),
  ...group([
    'renta', 'salario', 'paquete', 'agenda', 'título', 'instituto', 'registro', 'vivienda',
    'adolescente', 'remedio', 'garganta', 'préstamo', 'estrés', 'pensión', 'escalera', 'urgencia',
    'casa', 'cocina', 'baño', 'puerta', 'ventana', 'mesa', 'silla', 'cama',
    'libro', 'página', 'palabra', 'pregunta', 'idioma', 'español', 'chino', 'inglés',
    'clase', 'profesor', 'profesora', 'estudiante', 'ejemplo', 'fácil', 'difícil',
    'trabajo', 'oficina', 'empresa', 'jefe', 'compañero', 'correo', 'mensaje', 'información', 'fecha',
  ], 'L1', 'paid'),
  ...group([
    'casero', 'inmobiliaria', 'cláusula', 'arrendador', 'arrendatario', 'padrón', 'mensualidad', 'desperfecto',
    'guardería', 'admisión', 'comedor', 'tutor', 'uniforme', 'concertado', 'escolarización', 'alumnado',
    'puesto vacante', 'oferta de empleo', 'contrato indefinido', 'contrato temporal', 'periodo de prueba', 'permiso de trabajo', 'cuenta ajena', 'cuenta propia',
    'afueras', 'vecindario', 'cercanías', 'transporte público', 'coste de vida', 'zona escolar', 'zona verde', 'centro de salud',
    'contrato de alquiler', 'gastos de comunidad', 'vivienda en propiedad', 'vivienda de alquiler', 'dar de alta', 'índice de referencia', 'renta mensual', 'seguro de hogar',
    'garantía legal', 'garantía comercial', 'derecho de desistimiento', 'reducción del precio', 'producto defectuoso', 'atención al cliente', 'plazo de entrega', 'gastos de envío',
    'atención primaria', 'atención especializada', 'salud mental', 'historial clínico', 'consentimiento informado', 'efectos secundarios', 'grupo de riesgo', 'cita de seguimiento',
    'identificación', 'embajada', 'domicilio', 'nacionalidad', 'documentación', 'censo', 'banca', 'juzgado',
  ], 'L2', 'paid'),
  ...group([
    'hipoteca', 'tasación', 'inmueble', 'nómina', 'ahorros', 'notario', 'póliza', 'siniestro',
    'pagar intereses', 'abrir una cuenta', 'cerrar una cuenta', 'sacar dinero',
    'NIE', 'TIE', 'prórroga', 'prestación', 'subsidio', 'cita previa', 'alta laboral', 'baja laboral',
    'constructora', 'albañilería', 'fontanería', 'carpintería', 'conserje', 'derrama', 'impago', 'arrendamiento',
    'desistimiento', 'conformidad', 'justificante', 'fabricante', 'defecto', 'comerciante', 'incumplimiento', 'mediación',
    'rehabilitación', 'prescripción', 'cuidador', 'crónico', 'derivación', 'paliativo', 'bucodental', 'terapéutico',
    'reglamento', 'obligatorio', 'prohibición', 'inscripción', 'renovación', 'consentimiento', 'historial', 'especialista',
  ], 'L3', 'paid'),
]
