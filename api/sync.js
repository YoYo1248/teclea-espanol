const RESPONSE_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: RESPONSE_HEADERS })
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

function validSpace(value) {
  return Boolean(value && /^[a-f0-9]{64}$/.test(value))
}

export default {
  async fetch(request) {
    try {
      const url = new URL(request.url)
      const auth = request.headers.get('x-sync-auth') ?? ''
      if (!/^[a-f0-9]{64}$/.test(auth)) return json({ error: '同步凭证无效' }, 401)

      if (request.method === 'GET') {
        const space = url.searchParams.get('space')
        if (!validSpace(space)) return json({ error: '同步空间无效' }, 400)
        const storedText = await redis(['GET', `teclea:sync:${space}`])
        if (typeof storedText !== 'string') return json({ error: '尚无同步数据' }, 404)
        const stored = JSON.parse(storedText)
        if (stored.auth !== auth) return json({ error: '同步凭证无效' }, 401)
        return json({ blob: stored.blob, updatedAt: stored.updatedAt })
      }

      if (request.method === 'PUT') {
        const body = await request.json()
        if (!validSpace(body.space) || typeof body.blob !== 'string' || body.blob.length > 120_000 || typeof body.updatedAt !== 'number') {
          return json({ error: '同步数据无效' }, 400)
        }
        const key = `teclea:sync:${body.space}`
        const existingText = await redis(['GET', key])
        if (typeof existingText === 'string') {
          const existing = JSON.parse(existingText)
          if (existing.auth !== auth) return json({ error: '同步凭证无效' }, 401)
        }
        const stored = { auth, blob: body.blob, updatedAt: body.updatedAt }
        await redis(['SET', key, JSON.stringify(stored)])
        return json({ ok: true, updatedAt: stored.updatedAt })
      }

      return json({ error: '请求方法不支持' }, 405)
    } catch (error) {
      if (error instanceof Error && error.message === 'REDIS_NOT_CONFIGURED') return json({ error: '云同步尚未配置' }, 503)
      return json({ error: '同步服务暂时不可用' }, 500)
    }
  },
}

