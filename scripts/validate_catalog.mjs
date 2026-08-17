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
  const kindCounts = { 单词: 0, 短语: 0, 变位: 0 }
  const levelCounts = { A1: 0, A2: 0, B1: 0, B2: 0 }

  for (const lesson of lessons) {
    if (lessonIds.has(lesson.id)) errors.push(`重复课程 ID: ${lesson.id}`)
    lessonIds.add(lesson.id)
    if (!(lesson.kind in kindCounts)) errors.push(`未知类型: ${lesson.id} -> ${lesson.kind}`)
    if (!(lesson.level in levelCounts)) errors.push(`未知等级: ${lesson.id} -> ${lesson.level}`)
    if (lesson.words.length < 5 || lesson.words.length > 12) errors.push(`课程长度应为 5–12 项: ${lesson.id} -> ${lesson.words.length}`)

    const targets = new Set()
    for (const word of lesson.words) {
      const target = word.spanish.toLocaleLowerCase('es-ES').normalize('NFC').replace(/[¿?¡!.,;:]/g, '').replace(/\s+/g, ' ').trim()
      if (!target) errors.push(`空训练目标: ${lesson.id}`)
      if (target.split(' ').length > 3) errors.push(`超过 3 个词: ${lesson.id} -> ${word.spanish}`)
      if (targets.has(target)) errors.push(`课程内重复目标: ${lesson.id} -> ${word.spanish}`)
      targets.add(target)
      kindCounts[lesson.kind] += 1
      levelCounts[lesson.level] += 1
    }
  }

  if (totalPracticeCards !== 888) errors.push(`卡片总数应为 888，实际为 ${totalPracticeCards}`)
  if (levelCounts.B1 !== 100 || levelCounts.B2 !== 100) errors.push(`B1/B2 应各为 100 张，实际为 ${levelCounts.B1}/${levelCounts.B2}`)
  if (errors.length) {
    console.error(errors.join('\n'))
    process.exitCode = 1
  } else {
    console.log(JSON.stringify({ lessons: lessons.length, cards: totalPracticeCards, kindCounts, levelCounts }, null, 2))
  }
} finally {
  await server.close()
}
