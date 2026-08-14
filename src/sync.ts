import QRCode from 'qrcode'
import type { DisplayLanguage, SpeechRate } from './english'

export type SyncSnapshot = {
  version: 1
  updatedAt: number
  practiceState: {
    lastMode: 'copy' | 'recall' | 'listen'
    lastLessonId: string
    dailyWords: Record<string, number>
  }
  mistakeBank: Record<string, {
    lessonId: string
    spanish: string
    chinese: string
    english?: string
    count: number
    lastWrongAt: number
    lastMode: 'copy' | 'recall' | 'listen'
    cleanRounds?: number
    lastReviewedAt?: number
    masteredAt?: number
  }>
  completed: string[]
  accentMode: 'strict' | 'lenient'
  soundEnabled: boolean
  displayLanguage?: DisplayLanguage
  speechRate?: SpeechRate
}

export const SYNC_CODE_KEY = 'teclea-sync-code'
const BASE32 = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

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

async function decryptSnapshot(blob: string, key: CryptoKey) {
  const packed = base64UrlToBytes(blob)
  if (packed.length < 29) throw new Error('同步数据已损坏')
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: packed.slice(0, 12) }, key, packed.slice(12))
  return JSON.parse(new TextDecoder().decode(plaintext)) as SyncSnapshot
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

export async function createSyncQr(code: string) {
  const url = `${window.location.origin}${window.location.pathname}#sync=${normalizeSyncCode(code)}`
  return QRCode.toDataURL(url, { width: 220, margin: 1, color: { dark: '#22231f', light: '#ffffff' } })
}

export async function pullSync(code: string): Promise<SyncSnapshot | null> {
  const { space, auth, key } = await credentials(code)
  const response = await fetch(`/api/sync?space=${space}`, { headers: { 'x-sync-auth': auth }, cache: 'no-store' })
  if (response.status === 404) return null
  if (!response.ok) throw new Error(response.status === 503 ? '云同步尚未配置' : '读取同步数据失败')
  let data: { blob?: string }
  try {
    data = await response.json() as { blob?: string }
  } catch {
    throw new Error('云同步尚未配置')
  }
  if (typeof data.blob !== 'string') throw new Error('云同步尚未配置')
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
  if (!response.ok) throw new Error(response.status === 503 ? '云同步尚未配置' : '保存同步数据失败')
}
