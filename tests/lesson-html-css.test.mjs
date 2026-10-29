import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { ROOT } from './helpers.mjs'

const require = createRequire(import.meta.url)
const Course = require('../shared/course.js')
globalThis.Course = Course
await import('../shared/course/html-css.js')
const lesson = Course.get('html-css')

test('lesson html-css has features f1..f7, each with a why', () => {
  assert.deepEqual(lesson.features.map((f) => f.id), ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7'])
  for (const f of lesson.features) assert.ok(f.why && f.why.length > 10, f.id + ' has a why')
})

test('every step applies in order', () => {
  const steps = lesson.features.flatMap((f) => f.steps)
  for (const s of steps) assert.doesNotThrow(() => Course.filesAt(lesson, s.id), s.id)
})

test('no step types more than 6 lines', () => {
  for (const s of lesson.features.flatMap((f) => f.steps)) assert.ok(s.code.split('\n').length <= 6, s.id + ' is short')
})

test('every step has a say line', () => {
  for (const s of lesson.features.flatMap((f) => f.steps)) assert.ok(s.say, s.id + ' has say')
})

const final = Course.checkpoint(lesson, 'f7')
const out = path.join(ROOT, 'demo-kit', 'html-css-final')

test('the final page passes html-validate', () => {
  mkdirSync(out, { recursive: true })
  writeFileSync(path.join(out, 'index.html'), final['index.html'] + '\n')
  writeFileSync(path.join(out, 'styles.css'), final['styles.css'] + '\n')
  execFileSync('npx', ['-y', 'html-validate@9', path.join(out, 'index.html')], { stdio: 'pipe' })
})

test('every element in the final page has a note', () => {
  const notes = lesson.features.flatMap((f) => f.steps).flatMap((s) => s.notes || [])
  const names = new Set([...final['index.html'].matchAll(/<([a-z][a-z0-9]*)/g)].map((m) => m[1]))
  for (const n of names) assert.ok(notes.some((x) => x.match.includes('<' + n)), 'note for <' + n + '>')
})

test('every CSS property in the final stylesheet has a note', () => {
  const notes = lesson.features.flatMap((f) => f.steps).flatMap((s) => s.notes || [])
  const props = new Set([...final['styles.css'].matchAll(/^\s*([a-z-]+)\s*:/gm)].map((m) => m[1]))
  for (const p of props) assert.ok(notes.some((x) => x.match.includes(p + ':')), 'note for ' + p)
})

test('every note says what and why', () => {
  for (const s of lesson.features.flatMap((f) => f.steps)) {
    for (const n of s.notes || []) assert.ok(n.what && n.why, s.id + ' ' + n.match)
  }
})

test('the lesson real-origin stories at the end: body {, the h1 id, list items, </main>', () => {
  const at = 'f7s3'
  const css = Course.checkpoint(lesson, 'f7')['styles.css'].split('\n')
  const html = Course.checkpoint(lesson, 'f7')['index.html'].split('\n')
  const body = Course.noteFor(lesson, at, 'styles.css', css.indexOf('body {') + 1)
  assert.equal(body.stepId, 'f5s5')
  const h1 = Course.noteFor(lesson, at, 'index.html', html.findIndex((l) => l.includes('<h1 id')) + 1)
  assert.match(h1.note.what, /id/)
  const li = Course.noteFor(lesson, at, 'index.html', html.findIndex((l) => l.includes('<li>Pikachu')) + 1)
  assert.ok(li.note && /list item/i.test(li.note.what), 'li story')
  const main = Course.noteFor(lesson, at, 'index.html', html.indexOf('  </main>') + 1)
  assert.match(main.note.what, /main content/)
})

test('content facts: alt matches the sprite, post is not called private', () => {
  const all = JSON.stringify(lesson)
  assert.doesNotMatch(all, /Pikachu waving/)
  assert.doesNotMatch(all, /for anything private/)
})
