import path from 'node:path'
import { normalizeTarget, parseArgs, readJson, readJsonLines, tokenCount, writeJsonLines } from './lexicon-utils.mjs'

const args = parseArgs(process.argv.slice(2))
const input = path.resolve(String(args.input ?? 'artifacts/lexicon/wordfreq-es-top-6000.jsonl'))
const auditPath = path.resolve(String(args.audit ?? 'artifacts/lexicon/candidate-audit.json'))
const output = path.resolve(String(args.output ?? 'artifacts/lexicon/review-queue-top-300.jsonl'))
const limit = Number(args.limit ?? 300)
if (!Number.isInteger(limit) || limit < 1) throw new Error('--limit must be a positive integer')

const candidates = readJsonLines(input)
const audit = readJson(auditPath)
const byId = new Map(candidates.map((candidate) => [candidate.candidateId, candidate]))
const preliminaryBlockers = new Set(['already_in_catalog', 'duplicate_candidate_target', 'normalized_target_mismatch', 'unsupported_characters', 'empty_normalized_target', 'too_many_words'])
const selected = audit.records
  .filter((record) => !record.blockers.some((code) => preliminaryBlockers.has(code)))
  .map((record) => byId.get(record.candidateId))
  .filter(Boolean)
  .filter((candidate) => tokenCount(candidate.spanish) === 1 && normalizeTarget(candidate.spanish).length > 1)
  .sort((left, right) => left.frequency.rank - right.frequency.rank)
  .slice(0, limit)

writeJsonLines(output, selected)
console.log(JSON.stringify({
  output,
  requested: limit,
  selected: selected.length,
  firstRank: selected[0]?.frequency.rank ?? null,
  lastRank: selected.at(-1)?.frequency.rank ?? null,
  note: 'Frequency-screened only; every row still requires lemma, lexical, PCIC and Chinese batch editing. Product users do not approve words one by one.',
}, null, 2))
