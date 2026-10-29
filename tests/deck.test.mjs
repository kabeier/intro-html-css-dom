import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync, mkdtempSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import { ROOT } from './helpers.mjs'

const require = createRequire(import.meta.url)
const Course = require('../shared/course.js')
globalThis.Course = Course
await import('../shared/course/html-css.js')
const lesson = Course.get('html-css')
const DECK = 'lecture-1-html-css/slides.html'
const html = readFileSync(path.join(ROOT, DECK), 'utf8')
const slides = html.split('<section class="slide').slice(1)

test('the deck has 14-17 slides, each with presenter notes and a start minute', () => {
  assert.ok(slides.length >= 14 && slides.length <= 17, 'slides: ' + slides.length)
  let last = -1
  for (const [k, s] of slides.entries()) {
    assert.match(s, /<aside class="notes">/, 'notes on slide ' + (k + 1))
    const at = Number((s.match(/data-at="(\d+)"/) || [])[1])
    assert.ok(at >= last, 'minutes go up at slide ' + (k + 1))
    last = at
  }
  assert.ok(last <= 40, 'last slide starts by minute 40')
})

test('every feature is coded along once, starting where the previous one ended', () => {
  const pads = [...html.matchAll(/<div class="livepad" data-lesson="html-css" data-start="([^"]*)" data-steps="([^"]*)"/g)]
  assert.equal(pads.length, lesson.features.length)
  pads.forEach(([, start, steps], k) => {
    const f = lesson.features[k]
    const prev = k ? lesson.features[k - 1].steps.at(-1).id : 'null'
    assert.equal(start, prev, f.id + ' start')
    assert.deepEqual(steps.split(' '), f.steps.map((s) => s.id), f.id + ' steps')
  })
})

test('there is exactly one activity, and it opens the Fix it page', () => {
  const acts = slides.filter((s) => s.startsWith(' activity'))
  assert.equal(acts.length, 1)
  assert.match(acts[0], /href="\.\.\/fixit\.html\?lesson=html-css"/)
})

test('the step tables in the notes are generated from the lesson and up to date', () => {
  execFileSync('node', [path.join(ROOT, 'tools/gen-notes.mjs'), '--check', DECK], { cwd: ROOT, stdio: 'pipe' })
})

test('no slide overflows the 1600x900 stage', () => {
  const shots = mkdtempSync(path.join(os.tmpdir(), 'shots-'))
  const out = execFileSync('node', [path.join(os.homedir(), '.claude/skills/cp-slide-and-lecture-builder/scripts/check-slides.mjs'), ROOT, DECK, shots], { encoding: 'utf8' })
  assert.doesNotMatch(out, /OVERFLOW/)
})
