import type { ContentAccess, LifePlacement, LifeTier } from './vidaWords'

export type VidaDailyTarget = LifePlacement & { spanish: string }

const target = (spanish: string, tier: LifeTier, access: ContentAccess): VidaDailyTarget => ({
  spanish,
  module: 'daily',
  tier,
  access,
})

const group = (spanish: string[], tier: LifeTier, access: ContentAccess) => spanish.map((item) => target(item, tier, access))

// Vida 高频日常 V1 uses an explicit, reviewable snapshot. Frequency-ranked
// candidates were filtered for everyday communication, routines, family,
// health, weather and leisure. High rank alone never auto-publishes a card.
export const vidaDailyTargets: VidaDailyTarget[] = [
  ...group([
    'hola', 'gracias', 'por favor', 'perdón', 'encantado', 'adiós', 'bienvenido', 'hasta luego',
    'en casa', 'al trabajo', 'todos los días', 'por la mañana', 'por la tarde', 'por la noche', 'con mi familia', 'tiempo libre',
    'qué tipo', 'cuánto dura', 'qué te parece', 'no pasa nada', 'claro que sí', 'no estoy seguro', 'tal vez', 'para qué',
    'necesitar', 'comprar', 'pagar', 'encontrar', 'buscar', 'gente', 'lugar', 'país', 'pueblo', 'foto', 'usted', 'nunca', 'antes', 'alguien', 'momento', 'luego', 'desayuno',
  ], 'L1', 'free'),
  ...group([
    'verdad', 'nadie', 'entonces', 'casi', 'fin', 'final', 'igual', 'siguiente', 'personal', 'total',
    'especial', 'atención', 'suerte', 'fuerte', 'miedo', 'música', 'demasiado', 'propio', 'corazón', 'vista',
    'ambos', 'modo', 'internet', 'joven', 'película', 'resto', 'consejo', 'pronto', 'alrededor', 'aire',
    'fiesta', 'gusto', 'verano', 'curso', 'lengua', 'sueño', 'pareja', 'hogar', 'frío', 'vacaciones',
    'persona', 'hombre', 'mujer', 'niño', 'niña', 'amigo', 'amiga', 'familia', 'padre', 'madre',
    'hijo', 'hija', 'hermano', 'hermana', 'marido', 'esposa', 'nombre', 'edad', 'señor', 'señora',
    'teléfono', 'ropa', 'zapato', 'cosa', 'abierto', 'cerrado', 'cerca',
    'comida', 'cena', 'hambre', 'sed', 'menú', 'cuenta', 'delicioso',
    'ser', 'estar', 'tener', 'hacer', 'ir', 'venir', 'poder', 'querer', 'decir', 'hablar',
    'ver', 'dar', 'saber', 'conocer', 'comer', 'beber', 'vivir', 'dormir', 'salir', 'llegar',
    'buenos días', 'buenas tardes', 'buenas noches', 'hasta mañana', 'muchas gracias', 'de nada', 'por supuesto', 'no sé', 'no entiendo', 'otra vez',
    'más despacio', 'está bien', 'tengo hambre', 'tengo sed', 'me gusta', 'no me gusta', 'cuánto cuesta', 'dónde está', 'qué hora es', 'necesito ayuda',
    'ojo', 'boca', 'salud', 'médico', 'enfermo', 'ayuda',
    'tomar', 'llevar', 'usar', 'pedir', 'abrir', 'cerrar', 'leer', 'escribir', 'escuchar', 'entender',
  ], 'L1', 'paid'),
  ...group([
    'podrías decirme', 'quería saber', 'desde cuándo', 'hasta cuándo', 'seguro que', 'me parece bien', 'me parece mal', 'te importa',
    'hacerme un favor', 'tienes razón', 'no tienes razón', 'estoy de acuerdo', 'estoy en desacuerdo', 'depende de', 'por otra parte', 'no creo que',
    'triste', 'alguno', 'enfermedad', 'matrimonio', 'presión', 'operación', 'piel', 'ejercicio', 'raro', 'quizá',
    'debajo', 'antiguo', 'cita', 'objeto', 'corto', 'cuánto', 'papá', 'mirada', 'regreso', 'bebé',
    'cumpleaños', 'invierno', 'sonido', 'sorpresa', 'gato', 'letra', 'lluvia', 'amistad', 'cariño', 'divertido',
    'salón', 'árbol', 'útil', 'ideal', 'nacimiento', 'primavera', 'ruido', 'jardín', 'montaña', 'poquito',
    'risa', 'ánimo', 'detalle', 'aniversario', 'aviso', 'regular', 'abrazo', 'esposo', 'horrible', 'temperatura',
    'cabello', 'cercano', 'naturaleza', 'río', 'sol', 'fuego', 'encuentro', 'cielo', 'cine', 'edificio',
    'transporte', 'chico', 'peligro', 'duro', 'evento', 'intento', 'enorme', 'luna', 'piedra', 'animal',
    'museo', 'señal', 'viento', 'concierto', 'caliente', 'alcohol', 'apertura', 'caballo', 'firme', 'inmediato',
  ], 'L2', 'paid'),
  ...group([
    'descanso', 'virus', 'laboratorio', 'tensión', 'dieta', 'recuperación', 'órgano', 'alimentación', 'cirugía', 'sanidad',
    'prevención', 'clínica', 'debilidad', 'mortal', 'pánico', 'saludable', 'odio', 'respeto', 'carácter', 'actitud',
    'humor', 'sensación', 'alegría', 'felicidad', 'personalidad', 'orgullo', 'pasión', 'locura', 'forma', 'caso',
    'general', 'además', 'según', 'acuerdo', 'manera', 'medio', 'hacia', 'aunque', 'social', 'común',
  ], 'L3', 'paid'),
]
