export type MasteryRecommendation = 'repeat' | 'reinforce' | 'advance'

export const REINFORCE_FROM_PERCENT = 70
export const ADVANCE_FROM_PERCENT = 90

export function masteryRecommendation(independentRate: number | null, canRoute: boolean): MasteryRecommendation {
  if (!canRoute || independentRate === null || independentRate < REINFORCE_FROM_PERCENT) return 'repeat'
  if (independentRate < ADVANCE_FROM_PERCENT) return 'reinforce'
  return 'advance'
}
