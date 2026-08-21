export type WordEvidenceRecord = { copyCompletedAt?: number; recall?: true; listen?: true; lastCorrectAt?: number }
export type WordEvidence = Record<string, WordEvidenceRecord>

export function normalizeWordEvidence(
  stored: unknown,
  options: { legacy: boolean; completedCardIds?: readonly string[]; migrateCardId?: (cardId: string) => string } = { legacy: false },
) {
  const normalized: WordEvidence = {}
  if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
    Object.entries(stored).forEach(([cardId, rawRecord]) => {
      if (!rawRecord || typeof rawRecord !== 'object' || Array.isArray(rawRecord)) return
      const record = rawRecord as Record<string, unknown>
      const recall = record.recall === true
      const listen = record.listen === true
      const lastCorrectAt = typeof record.lastCorrectAt === 'number' && Number.isFinite(record.lastCorrectAt) ? record.lastCorrectAt : undefined
      const copyCompletedAt = typeof record.copyCompletedAt === 'number' && Number.isFinite(record.copyCompletedAt) && record.copyCompletedAt > 0
        ? record.copyCompletedAt
        : options.legacy && (recall || listen)
          ? lastCorrectAt ?? 1
          : undefined
      const migratedCardId = options.migrateCardId?.(cardId) ?? cardId
      const previous = normalized[migratedCardId]
      const copyTimes = [previous?.copyCompletedAt, copyCompletedAt].filter((value): value is number => typeof value === 'number' && value > 0)
      const correctTimes = [previous?.lastCorrectAt, lastCorrectAt].filter((value): value is number => typeof value === 'number' && value > 0)
      normalized[migratedCardId] = {
        ...(copyTimes.length ? { copyCompletedAt: Math.min(...copyTimes) } : {}),
        ...(previous?.recall || recall ? { recall: true } : {}),
        ...(previous?.listen || listen ? { listen: true } : {}),
        ...(correctTimes.length ? { lastCorrectAt: Math.max(...correctTimes) } : {}),
      }
    })
  }
  options.completedCardIds?.forEach((cardId) => {
    const migratedCardId = options.migrateCardId?.(cardId) ?? cardId
    normalized[migratedCardId] = { ...normalized[migratedCardId], copyCompletedAt: normalized[migratedCardId]?.copyCompletedAt ?? 1 }
  })
  return normalized
}
