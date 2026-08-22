import { createServer } from 'vite'
import { auditProfessionalReviews } from './lexicon/professional-review-utils.mjs'
import { parseArgs } from './lexicon/lexicon-utils.mjs'

const args = parseArgs(process.argv.slice(2))
const directory = String(args.directory ?? 'data/lexicon/professional-reviews')

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } })
try {
  const { lessons } = await server.ssrLoadModule('/src/data.ts')
  const cards = lessons.flatMap((lesson) => lesson.words.map((word) => ({
    ...word,
    level: lesson.level,
    scene: lesson.scene,
    kind: lesson.kind,
    routes: word.routes ?? ['exam'],
    lifePlacements: word.lifePlacements ?? (word.lifeModule && word.lifeTier && word.access
      ? [{ module: word.lifeModule, tier: word.lifeTier, access: word.access }]
      : []),
  })))
  const audit = auditProfessionalReviews(cards, directory)
  if (audit.errors.length) {
    console.error(audit.errors.join('\n'))
    process.exitCode = 1
  } else {
    console.log(JSON.stringify({
      files: audit.files.length,
      directory,
      records: audit.records.length,
      currentRecords: audit.currentRecords.length,
      staleRecords: audit.staleRecords.length,
      effectiveTargets: audit.effectiveRecords.length,
      passedTargets: audit.passedTargets.size,
      issueTargets: audit.issueRecords.length,
    }, null, 2))
  }
} finally {
  await server.close()
}
