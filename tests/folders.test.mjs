// Lecture 2 opens by moving the project into css/ and js/ folders, live on the slide.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { serve, launch, until } from './helpers.mjs'

let srv, browser
before(async () => { srv = await serve(); browser = await launch() })
after(async () => { await browser?.close(); srv?.close() })

const pressN = async (page) => { await page.keyboard.press('n'); await until(page, () => !window.Livepad.current().busy) }
const look = (page) => page.evaluate(() => {
  const c = window.Livepad.current(), f = document.querySelector('.slide.active .livepad iframe')
  const vis = [...document.querySelectorAll('.slide.active .lp-tab')].filter((b) => !b.hidden).map((b) => b.dataset.file)
  return { files: Object.keys(c.files).sort(), tab: c.tab, tabs: vis, editor: c.editorValue, text: c.files[c.tab], bg: f.contentWindow.getComputedStyle(f.contentDocument.body).backgroundColor }
})

test('N moves styles.css into css/ (the page loses its styles), the next N fixes the link, then js/script.js arrives', async () => {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
  await page.goto(srv.url + '/lecture-2-js-dom/slides.html')
  const n = await page.evaluate(() => [...document.querySelectorAll('.slide')].findIndex((s) => /\bf1s1\b/.test(s.querySelector('.livepad')?.dataset.steps || '')) + 1)
  await page.goto(srv.url + '/lecture-2-js-dom/slides.html#' + n)
  await page.reload()
  await until(page, () => window.Livepad && window.Livepad.current() && window.Livepad.current().ready)
  await until(page, () => /up to date/.test(window.Livepad.current().status))
  const styled = (await look(page)).bg
  assert.deepEqual((await look(page)).tabs, ['index.html', 'styles.css'])

  await pressN(page)
  await until(page, () => /up to date/.test(window.Livepad.current().status))
  let s = await look(page)
  assert.deepEqual(s.files, ['css/styles.css', 'index.html'])
  assert.equal(s.tab, 'css/styles.css')
  assert.ok(s.tabs.includes('css/styles.css') && !s.tabs.includes('styles.css'), 'the tab follows the file: ' + s.tabs)
  assert.equal(s.editor, s.text, 'the editor shows the moved file')
  assert.equal(s.bg, 'rgba(0, 0, 0, 0)', 'no CSS: the link points at a file that moved')

  await pressN(page)
  await until(page, (bg) => { const f = document.querySelector('.slide.active .livepad iframe'); return f.contentWindow.getComputedStyle(f.contentDocument.body).backgroundColor === bg }, styled)

  await pressN(page); await pressN(page)
  s = await look(page)
  assert.deepEqual(s.files, ['css/styles.css', 'index.html', 'js/script.js'])
  assert.equal(s.tab, 'js/script.js')
  await page.close()
})
