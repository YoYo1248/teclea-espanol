import { KINDS, LEVELS, looksLikeInfinitive, normalizeTarget, tokenCount } from './lexicon-utils.mjs'

const LETTER_TARGET = /^[a-záéíóúüñ]+(?: [a-záéíóúüñ]+)*$/u

function requiredString(value, code, blockers) {
  if (typeof value !== 'string' || !value.trim()) blockers.push(code)
}

export function auditCandidate(candidate, context) {
  const blockers = []
  const warnings = []
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    return { blockers: ['invalid_record'], warnings }
  }

  if (candidate.schemaVersion !== 1) blockers.push('unsupported_schema_version')
  requiredString(candidate.candidateId, 'missing_candidate_id', blockers)
  requiredString(candidate.spanish, 'missing_spanish', blockers)
  const target = normalizeTarget(candidate.spanish)
  if (!target) blockers.push('empty_normalized_target')
  if (candidate.normalizedTarget !== target) blockers.push('normalized_target_mismatch')
  if (tokenCount(target) > context.maximumWordsPerTarget) blockers.push('too_many_words')
  if (!LETTER_TARGET.test(target)) blockers.push('unsupported_characters')
  if (target.length === 1) warnings.push('single_character_candidate')

  if (!candidate.frequency || candidate.frequency.sourceId !== 'wordfreq-es-3.1.1') blockers.push('missing_wordfreq_provenance')
  if (!Number.isInteger(candidate.frequency?.rank) || candidate.frequency.rank < 1) blockers.push('invalid_frequency_rank')
  if (!Number.isFinite(candidate.frequency?.zipf)) blockers.push('invalid_zipf_frequency')
  if (!candidate.lexical || candidate.lexical.sourceId !== 'kaikki-es-2026-08-16') blockers.push('missing_lexical_provenance')
  if (candidate.lexical?.status !== 'verified') blockers.push('lexical_verification_required')

  requiredString(candidate.lemma, 'lemma_required', blockers)
  requiredString(candidate.partOfSpeech, 'part_of_speech_required', blockers)
  if (!KINDS.includes(candidate.kindCandidate)) blockers.push('kind_mapping_required')
  if (candidate.partOfSpeech === 'verb') {
    if (candidate.kindCandidate !== '动词原形') blockers.push('verb_must_use_infinitive_track')
    if (normalizeTarget(candidate.lemma) !== target || !looksLikeInfinitive(target)) blockers.push('inflected_verb_target')
  }
  if (candidate.kindCandidate === '动词原形' && !looksLikeInfinitive(target)) blockers.push('invalid_infinitive_target')

  if (!candidate.framework || candidate.framework.sourceId !== 'pcic-cervantes') blockers.push('missing_framework_provenance')
  if (!LEVELS.includes(candidate.framework?.levelCandidate)) blockers.push('level_mapping_required')
  requiredString(candidate.framework?.categoryCandidate, 'category_mapping_required', blockers)
  requiredString(candidate.framework?.sceneCandidate, 'scene_mapping_required', blockers)
  const category = context.categories.find((item) => item.label === candidate.framework?.categoryCandidate)
  if (category && !category.scenes.includes(candidate.framework?.sceneCandidate)) blockers.push('scene_category_mismatch')
  if (!category && candidate.framework?.categoryCandidate) blockers.push('unknown_category')
  if (!Array.isArray(candidate.framework?.references) || !candidate.framework.references.length) blockers.push('pcic_reference_required')

  if (candidate.editorial?.status !== 'approved') blockers.push('editorial_approval_required')
  requiredString(candidate.editorial?.chinese, 'chinese_gloss_required', blockers)
  requiredString(candidate.editorial?.example, 'spanish_example_required', blockers)
  requiredString(candidate.editorial?.exampleChinese, 'chinese_example_required', blockers)
  requiredString(candidate.editorial?.reviewedBy, 'reviewer_required', blockers)
  requiredString(candidate.editorial?.reviewedAt, 'review_date_required', blockers)

  const sourceIds = Array.isArray(candidate.sourceIds) ? new Set(candidate.sourceIds) : new Set()
  for (const sourceId of ['wordfreq-es-3.1.1', 'kaikki-es-2026-08-16', 'pcic-cervantes']) {
    if (!sourceIds.has(sourceId)) blockers.push(`source_id_required:${sourceId}`)
  }

  if (context.catalogTargets.has(target)) blockers.push('already_in_catalog')
  if (context.seenTargets.has(target)) blockers.push('duplicate_candidate_target')
  else context.seenTargets.set(target, candidate.candidateId)

  const lemma = normalizeTarget(candidate.lemma)
  if (lemma) {
    if (context.seenLemmas.has(lemma)) warnings.push(`duplicate_candidate_lemma:${context.seenLemmas.get(lemma)}`)
    else context.seenLemmas.set(lemma, candidate.candidateId)
  }

  return { blockers: [...new Set(blockers)], warnings: [...new Set(warnings)] }
}
