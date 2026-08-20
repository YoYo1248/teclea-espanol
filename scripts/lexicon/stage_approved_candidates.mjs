import fs from 'node:fs'
import path from 'node:path'
import { createServer } from 'vite'
import { auditCandidate } from './candidate-rules.mjs'
import { normalizeTarget, parseArgs, readJson, readJsonLines, writeJson } from './lexicon-utils.mjs'

const args = parseArgs(process.argv.slice(2))
const input = path.resolve(String(args.input ?? 'artifacts/lexicon/reviewed-candidates.jsonl'))
const output = path.resolve(String(args.output ?? 'artifacts/lexicon/approved-decks.json'))
if (!fs.existsSync(input)) throw new Error(`Reviewed candidate file not found: ${input}`)

const policy = readJson(path.resolve('data/lexicon/catalog-policy.json'))
const framework = readJson(path.resolve('data/lexicon/framework.json'))
const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } })

try {
  const { lessons } = await server.ssrLoadModule('/src/data.ts')
  const rows = readJsonLines(input)
  const context = {
    maximumWordsPerTarget: policy.maximumWordsPerTarget,
    categories: framework.categories,
    catalogTargets: new Set(lessons.flatMap((lesson) => lesson.words.map((word) => normalizeTarget(word.spanish)))),
    seenTargets: new Map(),
    seenLemmas: new Map(),
  }
  const audited = rows.map((candidate) => ({ candidate, audit: auditCandidate(candidate, context) }))
  const blocked = audited.filter((item) => item.audit.blockers.length)
  if (blocked.length) {
    const sample = blocked.slice(0, 20).map(({ candidate, audit }) => `${candidate.candidateId}: ${audit.blockers.join(', ')}`).join('\n')
    throw new Error(`${blocked.length} candidate(s) failed promotion gates:\n${sample}`)
  }

  const grouped = new Map()
  for (const { candidate } of audited) {
    const key = [candidate.framework.levelCandidate, candidate.framework.sceneCandidate, candidate.kindCandidate].join('::')
    const group = grouped.get(key) ?? {
      level: candidate.framework.levelCandidate,
      category: candidate.framework.categoryCandidate,
      scene: candidate.framework.sceneCandidate,
      kind: candidate.kindCandidate,
      words: [],
    }
    group.words.push({
      spanish: candidate.spanish,
      chinese: candidate.editorial.chinese,
      example: candidate.editorial.example,
      exampleChinese: candidate.editorial.exampleChinese,
      lemma: candidate.lemma,
      frequencyRank: candidate.frequency.rank,
      reviewedBy: candidate.editorial.reviewedBy,
      reviewedAt: candidate.editorial.reviewedAt,
      sourceIds: candidate.sourceIds,
    })
    grouped.set(key, group)
  }
  const decks = [...grouped.values()].map((group) => ({ ...group, words: group.words.sort((a, b) => a.frequencyRank - b.frequencyRank) }))
  writeJson(output, { schemaVersion: 1, generatedAt: new Date().toISOString(), source: input, decks })
  console.log(JSON.stringify({ output, candidates: rows.length, decks: decks.length }, null, 2))
} finally {
  await server.close()
}
