function parseLocalDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return Date.UTC(year, month - 1, day)
}

export function remainingChallengeDays(today: string, dueOn: string) {
  return Math.max(1, Math.round((parseLocalDate(dueOn) - parseLocalDate(today)) / 86_400_000) + 1)
}

export function dailyChallengeTarget(remainingRequired: number, remainingDays: number, eligibleMistakes: number) {
  if (remainingRequired <= 0) return 0
  const mistakeBuffer = Math.max(eligibleMistakes, Math.ceil(remainingRequired * 0.1))
  return Math.ceil((remainingRequired + mistakeBuffer) / Math.max(1, remainingDays))
}
