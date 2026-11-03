import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { ROOT, serve, launch, until } from './helpers.mjs'

const require = createRequire(import.meta.url)
const Course = require('../shared/course.js')
globalThis.Course = Course
await import('../shared/course/html-css.js')
await import('../shared/course/js-dom.js')
const lesson = Course.get('js-dom')
const base = Course.get('html-css')
const steps = lesson.features.flatMap((f) => f.steps)
const notes = [...steps, ...base.features.flatMap((f) => f.steps)].flatMap((s) => s.notes || [])
const final = Course.checkpoint(lesson, 'f6')

test('js-dom starts from the end of lecture 1', () => {
  assert.deepEqual(Course.filesAt(lesson, null), Course.checkpoint(base, 'f7'))
  assert.deepEqual(lesson.base, { lesson: 'html-css', feature: 'f7' })
})

test('f1 tidies the project into css/ and js/ folders, the common layout for a static site', () => {
  assert.deepEqual(Object.keys(final).sort(), ['css/styles.css', 'index.html', 'js/script.js'])
  assert.match(final['index.html'], /<link rel="stylesheet" href="css\/styles.css">/)
  assert.match(final['index.html'], /<script src="js\/script.js" defer><\/script>/)
  const f1 = lesson.features[0].steps
  assert.deepEqual(f1.slice(0, 3).map((s) => [s.mode, s.file]), [['move', 'styles.css'], ['replace', 'index.html'], ['insertAfter', 'index.html']])
  // Between the move and the fixed link, the page has lost its CSS: the path matters.
  const moved = Course.filesAt(lesson, f1[0].id)
  assert.ok(!Course.buildDoc(moved, {}).includes('box-sizing'), 'no CSS while the link is wrong')
  assert.ok(Course.buildDoc(Course.filesAt(lesson, f1[1].id), {}).includes('box-sizing'), 'CSS back once the link points into css/')
})

test('features f1..f6, each with a why; every step applies, is short, has a say', () => {
  assert.deepEqual(lesson.features.map((f) => f.id), ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'])
  for (const f of lesson.features) assert.ok(f.why && f.why.length > 10, f.id)
  for (const s of steps) {
    assert.doesNotThrow(() => Course.filesAt(lesson, s.id), s.id)
    if (s.mode !== 'move') assert.ok(s.code.split('\n').length <= 6, s.id + ' short')
    assert.ok(s.say, s.id + ' say')
  }
})

test('the final page passes html-validate', () => {
  const out = path.join(ROOT, 'demo-kit', 'js-dom-final')
  mkdirSync(out, { recursive: true })
  for (const [f, t] of Object.entries(final)) { mkdirSync(path.dirname(path.join(out, f)), { recursive: true }); writeFileSync(path.join(out, f), t + '\n') }
  execFileSync('npx', ['-y', 'html-validate@9', path.join(out, 'index.html')], { stdio: 'pipe' })
})

test('every element in the final page has a note (this lesson or lecture 1)', () => {
  const names = new Set([...final['index.html'].matchAll(/<([a-z][a-z0-9]*)/g)].map((m) => m[1]))
  for (const n of names) assert.ok(notes.some((x) => x.match.includes('<' + n)), '<' + n + '>')
})

test('every DOM function and property the script uses has a note', () => {
  const used = ['getElementById', 'querySelector(', 'querySelectorAll', 'textContent', 'createElement', 'appendChild',
    'addEventListener', 'preventDefault', 'FormData', 'Object.fromEntries', 'classList', 'stopPropagation', '.remove()',
    'console.log', 'getBoundingClientRect', 'currentTarget', 'evt.target', 'style.backgroundColor', '.trim()', 'Math.round', '.value']
  for (const u of used) {
    assert.ok(final['js/script.js'].includes(u), 'script uses ' + u)
    assert.ok(steps.flatMap((s) => s.notes || []).some((x) => x.match.includes(u)), 'note for ' + u)
  }
})

test('every note says what and why', () => {
  for (const s of steps) for (const n of s.notes || []) assert.ok(n.what && n.why, s.id + ' ' + n.match)
})

let srv, browser
before(async () => { srv = await serve(); browser = await launch() })
after(async () => { await browser?.close(); srv?.close() })

test('the finished page works: count, add, guard, submit, bubbling', async () => {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(srv.url + '/demo-kit/js-dom-final/index.html')
  assert.equal(await page.textContent('#page-title'), 'Trainer Profile (with JavaScript)')
  assert.equal(await page.textContent('#card-count'), '3 sections on this page')
  await page.click('#add-pokemon')
  assert.equal(await page.locator('#team li').count(), 3, 'empty input adds nothing')
  await page.fill('#new-pokemon', 'Eevee')
  await page.click('#add-pokemon')
  assert.equal(await page.locator('#team li').count(), 4)
  assert.equal(await page.inputValue('#new-pokemon'), '')
  await page.fill('#trainer', 'Sam')
  await page.selectOption('#favorite', 'Water')
  await page.click('button[type="submit"]')
  await until(page, () => document.querySelector('#output').textContent === 'Battle request from Sam (Water)')
  const picked = () => page.evaluate(() => document.querySelector('#team').classList.contains('picked'))
  const before = await picked()
  await page.click('#team li >> nth=0')
  assert.equal(await page.locator('#team li').count(), 3, 'clicked item removed')
  assert.equal(await picked(), before, 'the click on an item does not reach the card')
  await page.click('#team h2')
  assert.equal(await picked(), !before, 'a click on the card toggles it')
  assert.deepEqual(errors, [])
  await page.close()
})

test('the HTMLCollection vs NodeList slide tells the truth', async () => {
  const page = await browser.newPage()
  await page.setContent('<div id="box"><p class="card" id="a">a</p><p class="card" id="b">b</p></div>')
  const r = await page.evaluate(() => {
    const boxes = document.getElementsByClassName('card'), cards = document.querySelectorAll('.card')
    const seen = []
    for (const box of boxes) seen.push(box.id)
    cards.forEach((card) => seen.push(card.id))
    const fail = (fn) => { try { fn(); return null } catch (e) { return e.message } }
    const out = { types: [boxes.constructor.name, cards.constructor.name], seen, ids: Array.from(cards).map((c) => c.id),
      noForEach: fail(() => boxes.forEach(() => {})), noMapH: fail(() => boxes.map(() => {})), noMapN: fail(() => cards.map(() => {})) }
    const p = document.createElement('p'); p.className = 'card'; document.getElementById('box').append(p)
    out.after = [boxes.length, cards.length]
    return out
  })
  assert.deepEqual(r.types, ['HTMLCollection', 'NodeList'])
  assert.deepEqual(r.seen, ['a', 'b', 'a', 'b'], 'for...of works on both, forEach on NodeList')
  assert.deepEqual(r.ids, ['a', 'b'], 'Array.from(list).map works')
  assert.match(r.noForEach, /boxes\.forEach is not a function/)
  assert.match(r.noMapH, /boxes\.map is not a function/)
  assert.match(r.noMapN, /cards\.map is not a function/)
  assert.deepEqual(r.after, [3, 2], 'the HTMLCollection is live, the NodeList is a snapshot')
  await page.close()
})
