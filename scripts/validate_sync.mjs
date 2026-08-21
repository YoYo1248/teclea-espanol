import assert from 'node:assert/strict'
import { createServer } from 'vite'
import syncHandler from '../api/sync.js'

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })

try {
  const {
    createSyncLink,
    createSyncQr,
    formatSyncCode,
    generateSyncCode,
    mergeSyncSnapshots,
    normalizeSyncCode,
    pullSync,
    pushSync,
  } = await vite.ssrLoadModule('/src/sync.ts')

  const session = (lessonId, index) => ({
    lessonId,
    mode: 'listen',
    order: [`${lessonId}::uno`, `${lessonId}::dos`],
    index,
    elapsedMs: 1200,
    correctKeystrokes: 3,
    mistakes: 0,
    completedWords: index,
    mistakeWords: {},
    reviewCorrectCount: 0,
    masteryMode: 'listen',
    usedHint: false,
  })
  const mistake = (lessonId, spanish, chinese, count, lastWrongAt, lastMode, active = true) => ({
    lessonId,
    spanish,
    chinese,
    count,
    lastWrongAt,
    lastMode,
    wrongCounts: { copy: lastMode === 'copy' ? count : 0, recall: lastMode === 'recall' ? count : 0, listen: lastMode === 'listen' ? count : 0 },
    independentCorrectCounts: { copy: 0, recall: 0, listen: 0 },
    updatedAt: lastWrongAt,
    review: { [lastMode]: { active, recoveryCount: active ? 0 : 1, dueOn: '2026-08-20', lastWrongAt } },
  })

  const local = {
    version: 3,
    updatedAt: 100,
    practiceState: { lastMode: 'copy', lastLessonId: 'a1-one', dailyWords: { '2026-08-19': 2 } },
    mistakeBank: {
      active: mistake('a1-one', 'uno', '一', 1, 100, 'copy'),
    },
    mistakeResolvedAt: { resolved: 150 },
    completed: ['a1-zero'],
    masteryProgress: { 'a1-one': { recall: true } },
    activeSession: session('a1-one', 0),
    pausedMainSession: null,
    accentMode: 'strict',
    soundEnabled: true,
    speechRate: 0.8,
  }
  const remote = {
    version: 3,
    updatedAt: 200,
    practiceState: { lastMode: 'listen', lastLessonId: 'a1-two', dailyWords: { '2026-08-19': 3, '2026-08-18': 5 } },
    mistakeBank: {
      active: mistake('a1-one', 'uno', '一', 2, 120, 'listen'),
      resolved: mistake('a1-two', 'dos', '二', 1, 140, 'listen'),
    },
    mistakeResolvedAt: {},
    completed: ['a1-two'],
    masteryProgress: { 'a1-one': { listen: true } },
    activeSession: session('a1-two', 1),
    pausedMainSession: session('a1-one', 0),
    accentMode: 'lenient',
    soundEnabled: false,
    speechRate: 0.55,
  }

  const merged = mergeSyncSnapshots(local, remote)
  assert.equal(merged.practiceState.lastLessonId, 'a1-two')
  assert.deepEqual(merged.practiceState.dailyWords, { '2026-08-19': 3, '2026-08-18': 5 })
  assert.deepEqual(merged.completed.sort(), ['a1-two', 'a1-zero'])
  assert.deepEqual(merged.masteryProgress['a1-one'], { recall: true, listen: true })
  assert.equal(merged.mistakeBank.active.count, 2)
  assert.equal(merged.mistakeBank.resolved.review.listen.active, false)
  assert.equal(merged.mistakeBank.resolved.count, 1)
  assert.equal(merged.activeSession.lessonId, 'a1-two')
  assert.equal(merged.pausedMainSession.lessonId, 'a1-one')
  assert.equal(merged.accentMode, 'lenient')
  assert.equal(merged.soundEnabled, false)
  assert.equal(merged.speechRate, 0.55)

  const legacyRemote = {
    ...remote,
    version: 1,
    mistakeBank: {
      legacy: { lessonId: 'a1-two', spanish: 'dos', chinese: '二', count: 3, lastWrongAt: 180, lastMode: 'listen' },
    },
  }
  delete legacyRemote.masteryProgress
  delete legacyRemote.mistakeResolvedAt
  delete legacyRemote.activeSession
  delete legacyRemote.pausedMainSession
  delete legacyRemote.speechRate
  const legacyMerged = mergeSyncSnapshots(local, legacyRemote)
  assert.equal(legacyMerged.activeSession.lessonId, 'a1-one')
  assert.equal(legacyMerged.speechRate, 0.8)
  assert.equal(legacyMerged.mistakeBank.legacy.wrongCounts.listen, 3)
  assert.equal(legacyMerged.mistakeBank.legacy.review.listen.active, true)

  const code = generateSyncCode()
  assert.equal(code.length, 20)
  assert.equal(normalizeSyncCode(formatSyncCode(code)), code)
  globalThis.window = { location: { href: 'https://example.com/?level=A1' } }
  const link = createSyncLink(code)
  assert.equal(new URL(link).hash, `#sync=${code}`)
  const migratedLink = createSyncLink(code, 'https://www.holadone.com/')
  assert.equal(new URL(migratedLink).origin, 'https://www.holadone.com')
  assert.equal(new URL(migratedLink).hash, `#sync=${code}`)
  const qr = await createSyncQr(code)
  assert.match(qr, /^data:image\/png;base64,/)

  const originalFetch = globalThis.fetch
  let encryptedRecord = null
  globalThis.fetch = async (input, init = {}) => {
    if (init.method === 'PUT') {
      encryptedRecord = JSON.parse(init.body)
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } })
    }
    assert.ok(String(input).startsWith('/api/sync?space='))
    return new Response(JSON.stringify({ blob: encryptedRecord.blob }), { status: 200, headers: { 'content-type': 'application/json' } })
  }
  await pushSync(code, local)
  assert.ok(encryptedRecord.blob)
  assert.equal(JSON.stringify(encryptedRecord).includes('a1-one'), false)
  assert.deepEqual(await pullSync(code), local)
  globalThis.fetch = originalFetch

  process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example.test'
  process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token'
  const store = new Map()
  const redisCommands = []
  globalThis.fetch = async (_input, init = {}) => {
    const command = JSON.parse(init.body)
    redisCommands.push(command)
    if (command[0] === 'GET') return Response.json({ result: store.get(command[1]) ?? null })
    if (command[0] === 'SET') {
      store.set(command[1], command[2])
      return Response.json({ result: 'OK' })
    }
    if (command[0] === 'DEL') {
      store.delete(command[1])
      return Response.json({ result: 1 })
    }
    return Response.json({ error: 'unsupported' }, { status: 400 })
  }

  async function invokeApi({ method, auth, space, body }) {
    let status = 200
    let responseBody = ''
    const headers = {}
    await syncHandler(
      { method, headers: { 'x-sync-auth': auth }, query: { space }, body },
      {
        setHeader(name, value) { headers[name] = value },
        status(nextStatus) { status = nextStatus; return this },
        send(value) { responseBody = value; return this },
      },
    )
    return { status, headers, body: JSON.parse(responseBody) }
  }

  const space = 'a'.repeat(64)
  const auth = 'b'.repeat(64)
  assert.equal((await invokeApi({ method: 'GET', auth: '', space })).status, 401)
  assert.equal((await invokeApi({ method: 'PUT', auth, body: { space, blob: 'ciphertext', updatedAt: 123 } })).status, 200)
  assert.deepEqual(redisCommands.at(-1).slice(0, 4), ['SET', `teclea:sync:${space}`, JSON.stringify({ auth, blob: 'ciphertext', updatedAt: 123 }), 'EX'])
  const read = await invokeApi({ method: 'GET', auth, space })
  assert.equal(read.status, 200)
  assert.equal(read.body.blob, 'ciphertext')
  assert.equal((await invokeApi({ method: 'GET', auth: 'c'.repeat(64), space })).status, 401)
  assert.equal((await invokeApi({ method: 'DELETE', auth, space })).status, 200)
  assert.equal((await invokeApi({ method: 'GET', auth, space })).status, 404)
  globalThis.fetch = originalFetch

  console.log('Sync validation passed: merge, encryption, QR, API auth, TTL, and deletion.')
} finally {
  await vite.close()
}
