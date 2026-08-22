export type PressHoldPending = { value: string; base: string }

type PressHoldDecision =
  | { kind: 'commit'; value: string }
  | { kind: 'wait'; pending: PressHoldPending }
  | { kind: 'keep-waiting'; pending: PressHoldPending }

const ACCENT_BASES: Record<string, string> = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u', ñ: 'n' }
const REQUIRED_IN_LENIENT_MODE = new Set(['ñ', 'ü'])
export const PRESS_HOLD_GESTURE_MS = 400

function normalize(value: string) {
  return value.toLocaleLowerCase('es-ES').normalize('NFC')
}

export function pressHoldKeyCandidate(options: {
  key: string
  acceptedValue: string
  targetValue: string
  strict: boolean
  idle: boolean
}): PressHoldPending | null {
  if (!options.idle) return null
  const keyCharacters = Array.from(normalize(options.key))
  if (keyCharacters.length !== 1) return null
  const accepted = normalize(options.acceptedValue)
  const acceptedCharacters = Array.from(accepted)
  const expected = Array.from(normalize(options.targetValue))[acceptedCharacters.length]
  const base = keyCharacters[0]
  if (!expected || ACCENT_BASES[expected] !== base || (!options.strict && !REQUIRED_IN_LENIENT_MODE.has(expected))) return null
  return { value: accepted + base, base }
}

export function isConfirmedPressHold(durationMs: number, systemSignaledHold: boolean) {
  return systemSignaledHold || durationMs >= PRESS_HOLD_GESTURE_MS
}

export function pressHoldInputDecision(options: {
  rawValue: string
  acceptedValue: string
  targetValue: string
  strict: boolean
  idle: boolean
  pending: PressHoldPending | null
}): PressHoldDecision {
  const value = normalize(options.rawValue)
  const acceptedCharacters = Array.from(normalize(options.acceptedValue))

  if (options.pending) {
    const pendingTail = Array.from(value).slice(acceptedCharacters.length)
    if (pendingTail.length && pendingTail.every((character) => character === options.pending!.base)) {
      return { kind: 'keep-waiting', pending: options.pending }
    }
  }

  if (!options.idle) return { kind: 'commit', value }
  const incomingCharacters = Array.from(value)
  if (incomingCharacters.length !== acceptedCharacters.length + 1) return { kind: 'commit', value }
  const expected = Array.from(normalize(options.targetValue))[acceptedCharacters.length]
  const incoming = incomingCharacters[acceptedCharacters.length]
  if (!expected || ACCENT_BASES[expected] !== incoming || (!options.strict && !REQUIRED_IN_LENIENT_MODE.has(expected))) return { kind: 'commit', value }
  return { kind: 'wait', pending: { value, base: incoming } }
}
