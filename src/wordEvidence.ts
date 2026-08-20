export type WordEvidenceRecord = { copyCompletedAt?: number; recall?: true; listen?: true; lastCorrectAt?: number }
export type WordEvidence = Record<string, WordEvidenceRecord>

export function normalizeWordEvidence(
  stored: unknown,
  options: { legacy: boolean; completedCardIds?: readonly string[] } = { legacy: false },
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
      normalized[cardId] = {
        ...(copyCompletedAt ? { copyCompletedAt } : {}),
        ...(recall ? { recall: true } : {}),
        ...(listen ? { listen: true } : {}),
        ...(lastCorrectAt ? { lastCorrectAt } : {}),
      }
    })
  }
  options.completedCardIds?.forEach((cardId) => {
    normalized[cardId] = { ...normalized[cardId], copyCompletedAt: normalized[cardId]?.copyCompletedAt ?? 1 }
  })
  return normalized
}
