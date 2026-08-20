import type { LessonKind, LessonWord } from './data'

const PART_OF_SPEECH_LABELS: Record<NonNullable<LessonWord['partOfSpeech']>, string> = {
  noun: '名词',
  adjective: '形容词',
  adverb: '副词',
  pronoun: '代词',
  preposition: '介词',
  conjunction: '连词',
  verb: '动词',
}

export function practiceWordClassLabel(word: LessonWord, lessonKind: LessonKind) {
  if (word.partOfSpeech) return PART_OF_SPEECH_LABELS[word.partOfSpeech]
  if (lessonKind === '动词原形') return '动词'
  if (lessonKind === '短语' || word.spanish.trim().includes(' ')) return '固定表达'
  if (word.article) return '名词'
  return '单词'
}
