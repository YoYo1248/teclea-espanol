const RESPONSE_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
}
const SYNC_TTL_SECONDS = 400 * 24 * 60 * 60
const MAX_SYNC_BLOB_LENGTH = 500_000

function send(response, status, body) {
  Object.entries(RESPONSE_HEADERS).forEach(([name, value]) => response.setHeader(name, value))
  return response.status(status).send(JSON.stringify(body))
}

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  return url && token ? { url, token } : null
}

async function redis(command) {
  const config = redisConfig()
  if (!config) throw new Error('REDIS_NOT_CONFIGURED')
  const response = await fetch(config.url, {
    method: 'POST',
    headers: { authorization: `Bearer ${config.token}`, 'content-type': 'application/json' },
    body: JSON.stringify(command),
  })
  const result = await response.json()
  if (!response.ok || result.error) throw new Error(result.error ?? 'REDIS_REQUEST_FAILED')
  return result.result
}

function validCredential(value) {
  return typeof value === 'string' && /^[a-f0-9]{64}$/.test(value)
}

function parseBody(request) {
  if (request.body && typeof request.body === 'object') return request.body
  if (typeof request.body === 'string') {
    try {
      return JSON.parse(request.body)
    } catch {
      return null
    }
  }
  return null
}

export default async function handler(request, response) {
  try {
    const auth = request.headers['x-sync-auth'] ?? ''
    if (!validCredential(auth)) return send(response, 401, { error: '同步凭证无效' })

    const querySpace = Array.isArray(request.query?.space) ? request.query.space[0] : request.query?.space

    if (request.method === 'GET') {
      if (!validCredential(querySpace)) return send(response, 400, { error: '同步空间无效' })
      const storedText = await redis(['GET', `teclea:sync:${querySpace}`])
      if (typeof storedText !== 'string') return send(response, 404, { error: '尚无同步数据' })
      const stored = JSON.parse(storedText)
      if (stored.auth !== auth) return send(response, 401, { error: '同步凭证无效' })
      return send(response, 200, { blob: stored.blob, updatedAt: stored.updatedAt })
    }

    if (request.method === 'PUT') {
      const body = parseBody(request)
      if (!body || !validCredential(body.space) || typeof body.blob !== 'string' || body.blob.length > MAX_SYNC_BLOB_LENGTH || typeof body.updatedAt !== 'number') {
        return send(response, 400, { error: '同步数据无效' })
      }
      const key = `teclea:sync:${body.space}`
      const existingText = await redis(['GET', key])
      if (typeof existingText === 'string') {
        const existing = JSON.parse(existingText)
        if (existing.auth !== auth) return send(response, 401, { error: '同步凭证无效' })
      }
      const stored = { auth, blob: body.blob, updatedAt: body.updatedAt }
      await redis(['SET', key, JSON.stringify(stored), 'EX', SYNC_TTL_SECONDS])
      return send(response, 200, { ok: true, updatedAt: stored.updatedAt })
    }

    if (request.method === 'DELETE') {
      if (!validCredential(querySpace)) return send(response, 400, { error: '同步空间无效' })
      const key = `teclea:sync:${querySpace}`
      const existingText = await redis(['GET', key])
      if (typeof existingText !== 'string') return send(response, 404, { error: '尚无同步数据' })
      const existing = JSON.parse(existingText)
      if (existing.auth !== auth) return send(response, 401, { error: '同步凭证无效' })
      await redis(['DEL', key])
      return send(response, 200, { ok: true })
    }

    response.setHeader('allow', 'GET, PUT, DELETE')
    return send(response, 405, { error: '请求方法不支持' })
  } catch (error) {
    if (error instanceof Error && error.message === 'REDIS_NOT_CONFIGURED') return send(response, 503, { error: '云同步尚未配置' })
    return send(response, 500, { error: '同步服务暂时不可用' })
  }
}
