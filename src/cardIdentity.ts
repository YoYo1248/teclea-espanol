export type PracticeCardIdentity = {
  spanish: string
  practiceId?: string
}

// These legacy scene cards either duplicated an article-free canonical card or
// stored an article inside the target. Keep the redirects indefinitely so
// existing evidence, challenge progress and active sessions continue on the
// canonical card after normalization.
export const LEGACY_PRACTICE_CARD_ID_REDIRECTS: Readonly<Record<string, string>> = {
  'en-el-restaurante::el menú': 'common-food-a1-2::menú',
  'en-el-restaurante::la mesa': 'common-home-a1-1::mesa',
  'en-el-restaurante::el agua': 'common-food-a1-1::agua',
  'en-el-restaurante::el café': 'common-food-a1-1::café',
  'en-el-restaurante::la cuenta': 'common-food-a1-2::cuenta',
  'de-viaje::la estación': 'common-travel-a1-1::estación',
  'de-viaje::el billete': 'common-travel-a1-1::billete',
  'de-viaje::el andén': 'common-travel-a1-2::andén',
  'de-viaje::el equipaje': 'common-travel-a1-2::equipaje',
  'de-compras::la talla': 'common-shopping-a1-2::talla',
  'de-compras::la tarjeta': 'common-shopping-a1-1::tarjeta',
  'de-compras::el efectivo': 'common-shopping-a2-1::efectivo',
  'de-compras::el recibo': 'common-shopping-a2-1::recibo',
  'en-el-hotel::la reserva': 'common-travel-a1-2::reserva',
  'en-el-hotel::la habitación': 'common-home-a1-1::habitación',
  'en-el-hotel::la llave': 'common-home-a1-1::llave',
  'en-el-hotel::el desayuno': 'common-food-a1-2::desayuno',
  'en-el-hotel::una noche': 'common-time-a1-2::noche',
  'en-el-hotel::el ascensor': 'en-el-hotel::ascensor',
}

export function normalizePracticeTarget(value: string) {
  return value
    .toLocaleLowerCase('es-ES')
    .normalize('NFC')
    .replace(/[¿?¡!.,;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const legacyTargetAliases = Object.fromEntries(
  Object.entries(LEGACY_PRACTICE_CARD_ID_REDIRECTS).map(([legacyCardId, canonicalCardId]) => [
    legacyCardId.slice(legacyCardId.indexOf('::') + 2),
    canonicalCardId.slice(canonicalCardId.indexOf('::') + 2),
  ]),
)

export function canonicalPracticeTarget(value: string) {
  const target = normalizePracticeTarget(value)
  return legacyTargetAliases[target] ?? target
}

export function migratePracticeCardId(cardId: string) {
  return LEGACY_PRACTICE_CARD_ID_REDIRECTS[cardId] ?? cardId
}

export function migratePracticeCardIds(cardIds: readonly string[], deduplicate = false) {
  const migrated = cardIds.map(migratePracticeCardId)
  return deduplicate ? Array.from(new Set(migrated)) : migrated
}

export function migratePracticeTrueRecord(value: unknown): Record<string, true> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(Object.entries(value).flatMap(([cardId, completed]) => completed === true
    ? [[migratePracticeCardId(cardId), true as const]]
    : []))
}

export function migratePracticeNumberRecord(value: unknown, merge: 'max' | 'sum' = 'max'): Record<string, number> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.entries(value).reduce<Record<string, number>>((result, [cardId, rawCount]) => {
    if (typeof rawCount !== 'number' || !Number.isFinite(rawCount) || rawCount < 0) return result
    const migratedCardId = migratePracticeCardId(cardId)
    result[migratedCardId] = merge === 'sum'
      ? (result[migratedCardId] ?? 0) + rawCount
      : Math.max(result[migratedCardId] ?? 0, rawCount)
    return result
  }, {})
}

export function practiceCardId(lessonId: string, word: PracticeCardIdentity) {
  return migratePracticeCardId(word.practiceId ?? `${lessonId}::${normalizePracticeTarget(word.spanish)}`)
}
