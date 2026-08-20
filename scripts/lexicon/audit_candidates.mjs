import path from 'node:path'
import { createServer } from 'vite'
import { auditCandidate } from './candidate-rules.mjs'
import { normalizeTarget, parseArgs, readJson, readJsonLines, writeJson } from './lexicon-utils.mjs'

const args = parseArgs(process.argv.slice(2))
const input = path.resolve(String(args.input ?? 'artifacts/lexicon/wordfreq-es-top-6000.jsonl'))
const output = path.resolve(String(args.output ?? 'artifacts/lexicon/candidate-audit.json'))
const policy = readJson(path.resolve('data/lexicon/catalog-policy.json'))
const framework = readJson(path.resolve('data/lexicon/framework.json'))

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } })
try {
  const { lessons } = await server.ssrLoadModule('/src/data.ts')
  const catalogTargets = new Set(lessons.flatMap((lesson) => lesson.words.map((word) => normalizeTarget(word.spanish))))
  const rows = readJsonLines(input)
  const context = {
    maximumWordsPerTarget: policy.maximumWordsPerTarget,
    categories: framework.categories,
    catalogTargets,
    seenTargets: new Map(),
    seenLemmas: new Map(),
  }
  const records = rows.map((candidate) => ({
    candidateId: candidate.candidateId ?? null,
    spanish: candidate.spanish ?? null,
    frequencyRank: candidate.frequency?.rank ?? null,
    ...auditCandidate(candidate, context),
  }))
  const summary = {
    inputRows: rows.length,
    readyForStaging: records.filter((item) => !item.blockers.length).length,
    blocked: records.filter((item) => item.blockers.length).length,
    withWarnings: records.filter((item) => item.warnings.length).length,
    alreadyInCatalog: records.filter((item) => item.blockers.includes('already_in_catalog')).length,
    blockerCounts: Object.fromEntries([...new Set(records.flatMap((item) => item.blockers))]
      .sort()
      .map((code) => [code, records.filter((item) => item.blockers.includes(code)).length])),
  }
  writeJson(output, { schemaVersion: 1, generatedAt: new Date().toISOString(), input, summary, records })
  console.log(JSON.stringify({ output, ...summary }, null, 2))
} finally {
  await server.close()
}
