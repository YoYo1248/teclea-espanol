export type MasteryRecommendation = 'repeat' | 'reinforce' | 'advance'
export type PracticeStage = 'copy' | 'recall' | 'listen'

export const REINFORCE_FROM_PERCENT = 70
export const ADVANCE_FROM_PERCENT = 90

export function masteryRecommendation(independentRate: number | null, canRoute: boolean): MasteryRecommendation {
  if (!canRoute || independentRate === null || independentRate < REINFORCE_FROM_PERCENT) return 'repeat'
  if (independentRate < ADVANCE_FROM_PERCENT) return 'reinforce'
  return 'advance'
}

export function nextStageAfterSkippedReinforcement(stage: PracticeStage) {
  if (stage === 'copy') return { mode: 'recall' as const, startNewRound: false }
  if (stage === 'recall') return { mode: 'listen' as const, startNewRound: false }
  return { mode: 'recall' as const, startNewRound: true }
}
