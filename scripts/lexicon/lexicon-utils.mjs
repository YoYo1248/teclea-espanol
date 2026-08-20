import fs from 'node:fs'
import path from 'node:path'

export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
export const KINDS = ['单词', '短语', '动词原形']
export const INFINITIVE_EXCEPTIONS = new Set(['ayer', 'mujer', 'alquiler', 'bienestar', 'titular', 'molecular'])

export function normalizeTarget(value) {
  return String(value ?? '')
    .toLocaleLowerCase('es-ES')
    .normalize('NFC')
    .replace(/[¿?¡!.,;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function tokenCount(value) {
  const normalized = normalizeTarget(value)
  return normalized ? normalized.split(' ').length : 0
}

export function looksLikeInfinitive(value) {
  const target = normalizeTarget(value)
  if (!target || target.includes(' ') || INFINITIVE_EXCEPTIONS.has(target)) return false
  return /^(?:ir|[\p{L}]+(?:ar|er|ir)(?:se)?)$/u.test(target)
}

export function parseArgs(argv) {
  const result = {}
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index]
    if (!item.startsWith('--')) continue
    const [rawKey, inlineValue] = item.slice(2).split('=', 2)
    if (inlineValue !== undefined) result[rawKey] = inlineValue
    else if (argv[index + 1] && !argv[index + 1].startsWith('--')) result[rawKey] = argv[++index]
    else result[rawKey] = true
  }
  return result
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

export function readJsonLines(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line)
      } catch (error) {
        throw new Error(`${filePath}:${index + 1}: ${error.message}`)
      }
    })
}

export function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

export function writeJsonLines(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`)
}

export function percentage(numerator, denominator) {
  return denominator ? Math.round(numerator / denominator * 1000) / 10 : 0
}
