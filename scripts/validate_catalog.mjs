import { createServer } from 'vite'

const server = await createServer({
  appType: 'custom',
  logLevel: 'silent',
  server: { middlewareMode: true },
})

try {
  const { lessons, totalPracticeCards } = await server.ssrLoadModule('/src/data.ts')
  const errors = []
  const lessonIds = new Set()
  const kindCounts = { 单词: 0, 短语: 0, 动词原形: 0 }
  const levelCounts = { A1: 0, A2: 0, B1: 0, B2: 0 }

  for (const lesson of lessons) {
    if (lessonIds.has(lesson.id)) errors.push(`重复课程 ID: ${lesson.id}`)
    lessonIds.add(lesson.id)
    if (!(lesson.kind in kindCounts)) errors.push(`未知类型: ${lesson.id} -> ${lesson.kind}`)
    if (!(lesson.level in levelCounts)) errors.push(`未知等级: ${lesson.id} -> ${lesson.level}`)
    if (lesson.words.length < 5 || lesson.words.length > 12) errors.push(`课程长度应为 5–12 项: ${lesson.id} -> ${lesson.words.length}`)
    if (lesson.id.startsWith('conjugation-')) errors.push(`脱离语境的变位课程不应进入当前词库: ${lesson.id}`)

    const targets = new Set()
    const recallClues = new Map()
    for (const word of lesson.words) {
      const target = word.spanish.toLocaleLowerCase('es-ES').normalize('NFC').replace(/[¿?¡!.,;:]/g, '').replace(/\s+/g, ' ').trim()
      const recallClue = `${word.chinese.normalize('NFC').replace(/\s+/g, ' ').trim()}::${Array.from(target).length}`
      if (!target) errors.push(`空训练目标: ${lesson.id}`)
      if (target.split(' ').length > 3) errors.push(`超过 3 个词: ${lesson.id} -> ${word.spanish}`)
      if (lesson.kind === '动词原形' && (!/^(?:ir|[\p{L}]+(?:ar|er|ir))$/u.test(target) || target.includes(' '))) errors.push(`动词原形分类包含非原形目标: ${lesson.id} -> ${word.spanish}`)
      if (targets.has(target)) errors.push(`课程内重复目标: ${lesson.id} -> ${word.spanish}`)
      targets.add(target)
      if (recallClues.has(recallClue)) errors.push(`看义拼写提示与字符数冲突: ${lesson.id} -> ${recallClues.get(recallClue)} / ${word.spanish} (${word.chinese})`)
      recallClues.set(recallClue, word.spanish)
      kindCounts[lesson.kind] += 1
      levelCounts[lesson.level] += 1
    }
  }

  if (totalPracticeCards !== 548) errors.push(`卡片总数应为 548，实际为 ${totalPracticeCards}`)
  if (kindCounts.动词原形 !== 50) errors.push(`动词原形应为 50 张，实际为 ${kindCounts.动词原形}`)
  if (levelCounts.A1 !== 282 || levelCounts.A2 !== 66 || levelCounts.B1 !== 100 || levelCounts.B2 !== 100) errors.push(`A1–B2 应为 282/66/100/100 张，实际为 ${levelCounts.A1}/${levelCounts.A2}/${levelCounts.B1}/${levelCounts.B2}`)
  if (errors.length) {
    console.error(errors.join('\n'))
    process.exitCode = 1
  } else {
    console.log(JSON.stringify({ lessons: lessons.length, cards: totalPracticeCards, kindCounts, levelCounts }, null, 2))
  }
} finally {
  await server.close()
}
