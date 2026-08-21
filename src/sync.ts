import QRCode from 'qrcode'
import { deactivateReview, normalizeMistakeRecord, type MistakeRecord } from './mistakeReview'

export type SyncMode = 'copy' | 'recall' | 'listen'
export type SyncSpeechRate = 0.55 | 0.8 | 1

export type SyncPracticeState = {
  lastMode: SyncMode
  lastLessonId: string
  dailyWords: Record<string, number>
}

export type SyncMistakeRecord = MistakeRecord

export type SyncActivePracticeSession = {
  lessonId: string
  mode: SyncMode
  order: string[]
  index: number
  elapsedMs: number
  correctKeystrokes: number
  mistakes: number
  completedWords: number
  mistakeWords: Record<string, number>
  reviewCorrectCount: number
  masteryMode: Exclude<SyncMode, 'copy'> | null
  usedHint: boolean
  followUpMode?: Exclude<SyncMode, 'copy'>
  followUpOrder?: string[]
}

export type SyncSnapshot = {
  version: 3
  updatedAt: number
  practiceState: SyncPracticeState
  mistakeBank: Record<string, SyncMistakeRecord>
  mistakeResolvedAt: Record<string, number>
  completed: string[]
  masteryProgress: Record<string, Partial<Record<'recall' | 'listen', true>>>
  activeSession: SyncActivePracticeSession | null
  pausedMainSession: SyncActivePracticeSession | null
  accentMode: 'strict' | 'lenient'
  soundEnabled: boolean
  speechRate: SyncSpeechRate
}

type CompatibleSyncSnapshot = Omit<SyncSnapshot, 'version' | 'mistakeResolvedAt' | 'masteryProgress' | 'activeSession' | 'pausedMainSession' | 'speechRate'> & {
  version: 1 | 2 | 3
  mistakeResolvedAt?: SyncSnapshot['mistakeResolvedAt']
  masteryProgress?: SyncSnapshot['masteryProgress']
  activeSession?: SyncSnapshot['activeSession']
  pausedMainSession?: SyncSnapshot['pausedMainSession']
  speechRate?: SyncSnapshot['speechRate']
}

export const SYNC_CODE_KEY = 'teclea-sync-code'
const BASE32 = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = ''
  bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlToBytes(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function sha256(value: string) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))
}

async function credentials(code: string) {
  const normalized = normalizeSyncCode(code)
  if (normalized.length !== 20) throw new Error('同步码格式不正确')
  const [spaceBytes, authBytes, keyBytes] = await Promise.all([
    sha256(`teclea-space:${normalized}`),
    sha256(`teclea-auth:${normalized}`),
    sha256(`teclea-key:${normalized}`),
  ])
  const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['encrypt', 'decrypt'])
  return { space: bytesToHex(spaceBytes), auth: bytesToHex(authBytes), key }
}

async function encryptSnapshot(snapshot: SyncSnapshot, key: CryptoKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const plaintext = new TextEncoder().encode(JSON.stringify(snapshot))
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext))
  const packed = new Uint8Array(iv.length + ciphertext.length)
  packed.set(iv)
  packed.set(ciphertext, iv.length)
  return bytesToBase64Url(packed)
}

function validateSnapshot(value: unknown): CompatibleSyncSnapshot {
  if (!isRecord(value) || (value.version !== 1 && value.version !== 2 && value.version !== 3) || typeof value.updatedAt !== 'number') {
    throw new Error('同步数据版本不兼容')
  }
  if (!isRecord(value.practiceState)
    || (value.practiceState.lastMode !== 'copy' && value.practiceState.lastMode !== 'recall' && value.practiceState.lastMode !== 'listen')
    || typeof value.practiceState.lastLessonId !== 'string'
    || !isRecord(value.practiceState.dailyWords)
    || !Object.values(value.practiceState.dailyWords).every((count) => typeof count === 'number' && count >= 0)
    || !isRecord(value.mistakeBank)
    || !Object.values(value.mistakeBank).every((record) => isRecord(record)
      && typeof record.lessonId === 'string'
      && typeof record.spanish === 'string'
      && typeof record.chinese === 'string'
      && typeof record.count === 'number'
      && typeof record.lastWrongAt === 'number'
      && (record.lastMode === 'copy' || record.lastMode === 'recall' || record.lastMode === 'listen')
      && (value.version !== 3 || normalizeMistakeRecord(record) !== null))
    || !Array.isArray(value.completed)
    || !value.completed.every((id) => typeof id === 'string')
    || (value.accentMode !== 'strict' && value.accentMode !== 'lenient')
    || typeof value.soundEnabled !== 'boolean') {
    throw new Error('同步数据已损坏')
  }
  if (value.mistakeResolvedAt !== undefined && (!isRecord(value.mistakeResolvedAt) || !Object.values(value.mistakeResolvedAt).every((timestamp) => typeof timestamp === 'number'))) throw new Error('同步数据已损坏')
  if (value.masteryProgress !== undefined && !isRecord(value.masteryProgress)) throw new Error('同步数据已损坏')
  if (value.speechRate !== undefined && value.speechRate !== 0.55 && value.speechRate !== 0.8 && value.speechRate !== 1) throw new Error('同步数据已损坏')
  return value as CompatibleSyncSnapshot
}

async function decryptSnapshot(blob: string, key: CryptoKey) {
  const packed = base64UrlToBytes(blob)
  if (packed.length < 29) throw new Error('同步数据已损坏')
  try {
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: packed.slice(0, 12) }, key, packed.slice(12))
    return validateSnapshot(JSON.parse(new TextDecoder().decode(plaintext)))
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('同步数据')) throw error
    throw new Error('无法解密同步数据，请检查同步码')
  }
}

function mergeDailyWords(local: Record<string, number>, remote: Record<string, number>) {
  const merged = { ...local }
  Object.entries(remote).forEach(([date, count]) => {
    if (typeof count === 'number') merged[date] = Math.max(merged[date] ?? 0, count)
  })
  return merged
}

function mergeMasteryProgress(local: SyncSnapshot['masteryProgress'], remote: SyncSnapshot['masteryProgress'] = {}) {
  const merged = { ...local }
  Object.entries(remote).forEach(([lessonId, progress]) => {
    if (!isRecord(progress)) return
    merged[lessonId] = {
      ...(merged[lessonId]?.recall || progress.recall ? { recall: true as const } : {}),
      ...(merged[lessonId]?.listen || progress.listen ? { listen: true as const } : {}),
    }
  })
  return merged
}

function mergeMistakeState(local: SyncSnapshot, remote: CompatibleSyncSnapshot) {
  const resolvedAt = { ...local.mistakeResolvedAt }
  Object.entries(remote.mistakeResolvedAt ?? {}).forEach(([key, timestamp]) => {
    if (typeof timestamp === 'number') resolvedAt[key] = Math.max(resolvedAt[key] ?? 0, timestamp)
  })

  const mistakeBank = { ...local.mistakeBank }
  Object.entries(remote.mistakeBank).forEach(([key, remoteRecord]) => {
    if (!isRecord(remoteRecord) || typeof remoteRecord.lastWrongAt !== 'number' || typeof remoteRecord.count !== 'number') return
    const normalizedRemote = normalizeMistakeRecord(remoteRecord)
    if (!normalizedRemote) return
    const localRecord = mistakeBank[key]
    if (!localRecord || normalizedRemote.updatedAt > localRecord.updatedAt) {
      mistakeBank[key] = normalizedRemote
    } else if (normalizedRemote.updatedAt === localRecord.updatedAt && normalizedRemote.count > localRecord.count) {
      mistakeBank[key] = normalizedRemote
    }
  })
  Object.entries(mistakeBank).forEach(([key, record]) => {
    if ((resolvedAt[key] ?? 0) >= record.updatedAt) mistakeBank[key] = deactivateReview(record, resolvedAt[key])
  })
  return { mistakeBank, mistakeResolvedAt: resolvedAt }
}

export function mergeSyncSnapshots(local: SyncSnapshot, remote: CompatibleSyncSnapshot): SyncSnapshot {
  const remoteIsNewer = remote.updatedAt > local.updatedAt
  const mistakeState = mergeMistakeState(local, remote)
  const remoteHasSessionState = remote.version === 2 || remote.version === 3
  return {
    version: 3,
    updatedAt: Math.max(local.updatedAt, remote.updatedAt),
    practiceState: {
      ...(remoteIsNewer ? remote.practiceState : local.practiceState),
      dailyWords: mergeDailyWords(local.practiceState.dailyWords, remote.practiceState.dailyWords),
    },
    ...mistakeState,
    completed: Array.from(new Set([...local.completed, ...remote.completed.filter((id): id is string => typeof id === 'string')])),
    masteryProgress: mergeMasteryProgress(local.masteryProgress, remote.masteryProgress),
    activeSession: remoteIsNewer && remoteHasSessionState ? (remote.activeSession ?? null) : local.activeSession,
    pausedMainSession: remoteIsNewer && remoteHasSessionState ? (remote.pausedMainSession ?? null) : local.pausedMainSession,
    accentMode: remoteIsNewer && (remote.accentMode === 'strict' || remote.accentMode === 'lenient') ? remote.accentMode : local.accentMode,
    soundEnabled: remoteIsNewer && typeof remote.soundEnabled === 'boolean' ? remote.soundEnabled : local.soundEnabled,
    speechRate: remoteIsNewer && (remote.speechRate === 0.55 || remote.speechRate === 0.8 || remote.speechRate === 1) ? remote.speechRate : local.speechRate,
  }
}

export function normalizeSyncCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z2-9]/g, '').replace(/[01IO]/g, '')
}

export function formatSyncCode(value: string) {
  return normalizeSyncCode(value).match(/.{1,5}/g)?.join('-') ?? ''
}

export function generateSyncCode() {
  const random = crypto.getRandomValues(new Uint8Array(20))
  return Array.from(random, (byte) => BASE32[byte % BASE32.length]).join('')
}

export function createSyncLink(code: string, baseUrl = window.location.href) {
  const url = new URL(baseUrl)
  url.hash = `sync=${normalizeSyncCode(code)}`
  return url.toString()
}

export async function createSyncQr(code: string, baseUrl?: string) {
  return QRCode.toDataURL(createSyncLink(code, baseUrl), { width: 220, margin: 1, color: { dark: '#22231f', light: '#ffffff' } })
}

async function syncError(response: Response, fallback: string) {
  if (response.status === 503) return new Error('云同步尚未配置')
  try {
    const data = await response.json() as { error?: unknown }
    if (typeof data.error === 'string') return new Error(data.error)
  } catch {
    // Use the stable fallback below when the response is not JSON.
  }
  return new Error(fallback)
}

export async function pullSync(code: string): Promise<CompatibleSyncSnapshot | null> {
  const { space, auth, key } = await credentials(code)
  const response = await fetch(`/api/sync?space=${space}`, { headers: { 'x-sync-auth': auth }, cache: 'no-store' })
  if (response.status === 404) return null
  if (!response.ok) throw await syncError(response, '读取同步数据失败')
  let data: { blob?: unknown }
  try {
    data = await response.json() as { blob?: unknown }
  } catch {
    throw new Error('同步服务暂时不可用，请稍后再试')
  }
  if (typeof data.blob !== 'string') throw new Error('同步数据已损坏')
  return decryptSnapshot(data.blob, key)
}

export async function pushSync(code: string, snapshot: SyncSnapshot) {
  const { space, auth, key } = await credentials(code)
  const blob = await encryptSnapshot(snapshot, key)
  const response = await fetch('/api/sync', {
    method: 'PUT',
    headers: { 'content-type': 'application/json', 'x-sync-auth': auth },
    body: JSON.stringify({ space, blob, updatedAt: snapshot.updatedAt }),
  })
  if (!response.ok) throw await syncError(response, '保存同步数据失败')
  try {
    const data = await response.json() as { ok?: unknown }
    if (data.ok !== true) throw new Error('保存同步数据失败')
  } catch (error) {
    if (error instanceof Error && error.message === '保存同步数据失败') throw error
    throw new Error('同步服务暂时不可用，请稍后再试')
  }
}

export async function deleteSync(code: string) {
  const { space, auth } = await credentials(code)
  const response = await fetch(`/api/sync?space=${space}`, { method: 'DELETE', headers: { 'x-sync-auth': auth } })
  if (response.status === 404) return
  if (!response.ok) throw await syncError(response, '删除云端数据失败')
  try {
    const data = await response.json() as { ok?: unknown }
    if (data.ok !== true) throw new Error('删除云端数据失败')
  } catch (error) {
    if (error instanceof Error && error.message === '删除云端数据失败') throw error
    throw new Error('同步服务暂时不可用，请稍后再试')
  }
}
