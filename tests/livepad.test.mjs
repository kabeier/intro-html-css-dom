import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { serve, launch, until } from './helpers.mjs'

const require = createRequire(import.meta.url)
const Course = require('../shared/course.js')
globalThis.Course = Course
await import('./fixtures/demo-lesson.js')
const lesson = Course.get('demo')

let srv, browser
before(async () => { srv = await serve(); browser = await launch() })
after(async () => { await browser?.close(); srv?.close() })

const DECK = '/tests/fixtures/livepad-demo.html'

async function openSlide2(opts = {}) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
  if (opts.blockMonaco) await page.route('**/monaco-editor@*/**', (r) => r.abort())
  await page.goto(srv.url + DECK + '#2')
  await until(page, () => window.Livepad && window.Livepad.current() && window.Livepad.current().ready)
  return page
}
const state = (page) => page.evaluate(() => { const c = window.Livepad.current(); return { files: c.files, status: c.status, editor: c.editorValue, tab: c.tab } })
const previewColor = (page, sel) => page.evaluate((sel) => {
  const f = document.querySelector('.slide.active .livepad iframe')
  const el = f.contentDocument.querySelector(sel)
  return el ? f.contentWindow.getComputedStyle(el).color : null
}, sel)

test('opens with the start files in tabs and an up-to-date status', async () => {
  const page = await openSlide2()
  const tabs = await page.$$eval('.slide.active .lp-tab', (b) => b.map((x) => x.textContent.trim()))
  assert.deepEqual(tabs, ['index.html', 'styles.css'])
  const s = await state(page)
  assert.deepEqual(s.files, Course.filesAt(lesson, 'f1s1'))
  await until(page, () => /up to date/.test(window.Livepad.current().status))
  assert.equal(await previewColor(page, 'h1'), 'rgb(0, 0, 255)')
  await page.close()
})

test('N three times types the steps; preview follows', async () => {
  const page = await openSlide2()
  for (let k = 0; k < 3; k++) {
    await page.keyboard.press('n')
    await until(page, () => !window.Livepad.current().busy)
  }
  const s = await state(page)
  assert.deepEqual(s.files, Course.filesAt(lesson, 'f2s3'))
  assert.equal(s.editor, s.files[s.tab])
  await until(page, () => {
    const f = document.querySelector('.slide.active .livepad iframe')
    const h = f.contentDocument.querySelector('h1')
    return h && f.contentWindow.getComputedStyle(h).color === 'rgb(255, 0, 0)'
  })
  await page.close()
})

test('typing in the editor updates the preview (hot reload)', async () => {
  const page = await openSlide2()
  await page.click('.slide.active .lp-tab[data-file="index.html"]')
  await page.click('.slide.active .lp-editor')
  await page.keyboard.press('Control+End')
  await page.keyboard.type('\n<p id="x">hi</p>')
  await until(page, () => !!document.querySelector('.slide.active .livepad iframe').contentDocument.querySelector('#x'), null, 3000)
  await page.close()
})

test('a step that no longer fits hand-edited code is refused; Shift+N resets', async () => {
  const page = await openSlide2()
  await page.keyboard.press('n') // f2s1
  await until(page, () => !window.Livepad.current().busy)
  await page.click('.slide.active .lp-tab[data-file="styles.css"]')
  await page.click('.slide.active .lp-editor')
  await page.keyboard.press('Control+A')
  await page.keyboard.type('h1 { color: green; }')
  await page.waitForTimeout(400)
  await page.mouse.click(5, 5) // leave the editor so N goes to the deck
  const before = (await state(page)).files['styles.css']
  await page.keyboard.press('n') // f2s2 needs "rgb(0, 0, 255)"
  await page.waitForTimeout(300)
  const s = await state(page)
  assert.match(s.status, /can't apply/i)
  assert.equal(s.files['styles.css'], before)
  await page.keyboard.press('Shift+N')
  await until(page, () => !window.Livepad.current().busy)
  assert.deepEqual((await state(page)).files, Course.filesAt(lesson, 'f1s1'))
  await page.close()
})

test('without Monaco the slide falls back to a <pre> and N still works', async () => {
  const page = await openSlide2({ blockMonaco: true })
  await until(page, () => !!document.querySelector('.slide.active .lp-fallback'))
  await page.keyboard.press('n')
  await until(page, () => !window.Livepad.current().busy)
  await until(page, () => !!document.querySelector('.slide.active .livepad iframe').contentDocument.querySelector('.intro'))
  const pre = await page.$eval('.slide.active .lp-fallback', (p) => p.textContent)
  assert.match(pre, /class="intro"/)
  await page.close()
})

test('a JS error in the page shows in the status line', async () => {
  const page = await openSlide2()
  await page.click('.slide.active .lp-tab[data-file="index.html"]')
  await page.click('.slide.active .lp-editor')
  await page.keyboard.press('Control+End')
  await page.keyboard.type('\n<script>nope()</script>')
  await until(page, () => /nope/.test(window.Livepad.current().status), null, 3000)
  await page.close()
})

test('clicking a link in the preview scrolls the preview; the deck stays on its slide', async () => {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
  await page.goto(srv.url + '/lecture-1-html-css/slides.html#5')
  await until(page, () => window.Livepad && window.Livepad.current() && window.Livepad.current().ready, null, 20000)
  for (let k = 0; k < 5; k++) { await page.keyboard.press('n'); await until(page, () => !window.Livepad.current().busy) }
  await page.keyboard.press('a')
  const frame = page.frames().find((f) => f.url() === 'about:srcdoc' && f.parentFrame() === page.mainFrame())
  await page.waitForTimeout(500)
  const fr = page.frames().filter((f) => f.parentFrame() === page.mainFrame())
  const live = await (async () => { for (const f of fr) { try { if (await f.$('nav a[href="#about"]')) return f } catch {} } })()
  await live.click('nav a[href="#about"]')
  await page.waitForTimeout(800)
  assert.match(page.url(), /#5$/)
  assert.equal(live.url(), 'about:srcdoc')
  assert.ok(await live.$('#about'), 'still our page in the preview')
  await page.close()
})

test('a clicked file tab does not keep focus, so Enter/Space act once (deck only)', async () => {
  const page = await openSlide2()
  await page.click('.slide.active .lp-tab[data-file="styles.css"]')
  assert.equal(await page.evaluate(() => !!document.activeElement.closest('.lp-tab')), false)
  await page.close()
})
