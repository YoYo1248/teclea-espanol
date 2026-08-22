export type WordEvidenceRecord = { copyCompletedAt?: number; recall?: true; listen?: true; lastCorrectAt?: number }
export type WordEvidence = Record<string, WordEvidenceRecord>
export type SyncWordEvidence = Record<string, number>

const COPY_EVIDENCE_FLAG = 1
const RECALL_EVIDENCE_FLAG = 2
const LISTEN_EVIDENCE_FLAG = 4

export function encodeWordEvidence(evidence: WordEvidence): SyncWordEvidence {
  return Object.fromEntries(Object.entries(evidence).flatMap(([cardId, record]) => {
    const flags = (record.copyCompletedAt ? COPY_EVIDENCE_FLAG : 0)
      | (record.recall ? RECALL_EVIDENCE_FLAG : 0)
      | (record.listen ? LISTEN_EVIDENCE_FLAG : 0)
    return flags ? [[cardId, flags]] : []
  }))
}

export function decodeWordEvidence(evidence: SyncWordEvidence): WordEvidence {
  return Object.fromEntries(Object.entries(evidence).flatMap(([cardId, flags]) => {
    if (!Number.isInteger(flags) || flags < 1 || flags > 7) return []
    return [[cardId, {
      ...(flags & COPY_EVIDENCE_FLAG ? { copyCompletedAt: 1 } : {}),
      ...(flags & RECALL_EVIDENCE_FLAG ? { recall: true as const } : {}),
      ...(flags & LISTEN_EVIDENCE_FLAG ? { listen: true as const } : {}),
    }]]
  }))
}

export function mergeWordEvidence(left: WordEvidence, right: WordEvidence): WordEvidence {
  const merged: WordEvidence = { ...left }
  Object.entries(right).forEach(([cardId, record]) => {
    const previous = merged[cardId] ?? {}
    const copyCompletedAt = Math.max(previous.copyCompletedAt ?? 0, record.copyCompletedAt ?? 0)
    const lastCorrectAt = Math.max(previous.lastCorrectAt ?? 0, record.lastCorrectAt ?? 0)
    merged[cardId] = {
      ...(copyCompletedAt ? { copyCompletedAt } : {}),
      ...(previous.recall || record.recall ? { recall: true } : {}),
      ...(previous.listen || record.listen ? { listen: true } : {}),
      ...(lastCorrectAt ? { lastCorrectAt } : {}),
    }
  })
  return merged
}

export function mergeSyncWordEvidence(left: SyncWordEvidence, right: SyncWordEvidence = {}): SyncWordEvidence {
  const merged = { ...left }
  Object.entries(right).forEach(([cardId, flags]) => {
    if (!Number.isInteger(flags) || flags < 1 || flags > 7) return
    merged[cardId] = (merged[cardId] ?? 0) | flags
  })
  return merged
}

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
