import type { ContentAccess, LifePlacement, LifeTier } from './vidaWords'

export type VidaMobilityTarget = LifePlacement & { spanish: string }

const target = (spanish: string, tier: LifeTier, access: ContentAccess): VidaMobilityTarget => ({
  spanish,
  module: 'mobility',
  tier,
  access,
})

const group = (spanish: string[], tier: LifeTier, access: ContentAccess) => spanish.map((item) => target(item, tier, access))

// Vida 城市出行 V1 deliberately reuses canonical cards. The original 48 come
// from earlier general/newcomer lessons, 72 from the audited exam mobility
// batch, and 20 from a targeted A1 city/direction gap fix. No duplicate
// training targets or parallel progress are created.
export const vidaMobilityTargets: VidaMobilityTarget[] = [
  ...group([
    'todo recto', 'a la derecha', 'a la izquierda', 'estación', 'billete', 'andén', 'equipaje', 'ida y vuelta',
    'abajo', 'atrás', 'parque', 'colegio', 'zona', 'puente', 'ruta', 'carretera',
    'esquina', 'accidente', 'barco', 'vehículo', 'parada', 'moto', 'bicicleta', 'bus',
  ], 'L1', 'free'),
  ...group([
    'policía', 'avenida', 'rueda', 'camión', 'costa', 'guía', 'gasolina', 'recepción',
    'calle', 'plaza', 'ciudad', 'centro', 'tienda', 'mercado', 'banco', 'hospital', 'farmacia', 'escuela',
    'derecha', 'izquierda', 'delante', 'detrás', 'dentro', 'fuera', 'lejos', 'camino', 'entrada', 'salida',
  ], 'L1', 'paid'),
  ...group([
    'afueras', 'vecindario', 'cercanías', 'transporte público', 'coste de vida', 'zona escolar', 'zona verde', 'centro de salud',
    'puerto', 'área', 'vía', 'isla', 'llamada', 'interior', 'restaurante', 'reloj',
    'peaje', 'conductor', 'pasajero', 'patinete', 'consigna', 'taquilla', 'tranvía', 'facturación',
    'billete sencillo', 'abono transporte', 'hora punta', 'próxima parada', 'tren regional', 'tren de cercanías', 'línea de autobús', 'billete de vuelta',
    'estación central', 'oficina de turismo', 'mapa turístico', 'punto de información', 'zona peatonal', 'centro histórico', 'paso de peatones', 'billete de ida',
    'cancelación', 'demora', 'desvío', 'huelga', 'embarque', 'desembarque', 'grúa', 'reparación',
  ], 'L2', 'paid'),
  ...group([
    'cruce', 'semáforo', 'acera', 'rotonda', 'carril', 'atasco', 'aparcamiento', 'gasolinera',
  ], 'L1', 'paid'),
  ...group([
    'remolque', 'intersección', 'arcén', 'autovía', 'señalización', 'aduana', 'chaleco', 'estacionamiento',
    'equipaje de mano', 'pérdida de equipaje', 'puerta de embarque', 'control de seguridad', 'tarjeta de embarque', 'retraso del vuelo', 'asistencia en carretera', 'parte de accidente',
    'indemnización', 'compensación', 'reubicación', 'accesibilidad', 'desplazamiento', 'congestión', 'itinerario', 'infracción',
    'movilidad sostenible', 'transporte interurbano', 'transporte accesible', 'conexión perdida', 'hoja de reclamaciones', 'interrupción del servicio', 'restricción de acceso', 'derechos del pasajero',
  ], 'L3', 'paid'),
]
