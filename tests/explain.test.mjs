import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readdirSync, existsSync } from 'node:fs'

const require = createRequire(import.meta.url)
const Course = require('../shared/course.js')
globalThis.Course = Course
for (const f of readdirSync(new URL('../shared/course/', import.meta.url)).filter((f) => f.endsWith('.js') && !f.endsWith('-fixit.js') && f !== 'glossary.js')) await import('../shared/course/' + f)
if (existsSync(new URL('../shared/course/glossary.js', import.meta.url))) await import('../shared/course/glossary.js')

// The Code Explorer must explain every line a student can click (no "nothing to explain").
for (const lesson of Course.all()) {
  test(`${lesson.id}: every line of every checkpoint has an explanation`, () => {
    const missing = []
    for (const f of lesson.features) {
      const stepId = f.steps[f.steps.length - 1].id
      for (const [file, text] of Object.entries(Course.filesAt(lesson, stepId))) {
        if (typeof text !== 'string') continue
        text.split('\n').forEach((line, i) => {
          if (line.trim() && !Course.noteFor(lesson, stepId, file, i + 1).note) missing.push(`${f.id} ${file}:${i + 1} ${line.trim()}`)
        })
      }
    }
    assert.deepEqual(missing.slice(0, 20), [], `${missing.length} unexplained lines`)
  })
}
