// The block vs inline slide shows real elements, so what it claims is measured here.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { serve, launch } from './helpers.mjs'

let srv, browser
before(async () => { srv = await serve(); browser = await launch() })
after(async () => { await browser?.close(); srv?.close() })

test('the slide follows Tags at a glance, and its claims are true of the real elements', async () => {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
  await page.goto(srv.url + '/lecture-1-html-css/slides.html')
  const n = await page.evaluate(() => [...document.querySelectorAll('.slide')].findIndex((s) => /Block vs inline/.test(s.textContent)) + 1)
  assert.equal(await page.evaluate((k) => document.querySelectorAll('.slide')[k - 2].querySelector('h2').textContent, n), 'Tags at a glance')
  await page.goto(srv.url + '/lecture-1-html-css/slides.html#' + n)
  await page.reload()
  await page.waitForSelector('.slide.active .bi')
  const m = await page.evaluate(() => {
    const box = (s) => document.querySelector('.slide.active ' + s).getBoundingClientRect()
    const scale = box('.bi-blocks').width / document.querySelector('.slide.active .bi-blocks').offsetWidth
    const blocks = [...document.querySelectorAll('.slide.active .bi-blocks > :not(.bi-w)')]
    const tops = [...document.querySelectorAll('.slide.active .bi-line > *')].map((e) => e.getBoundingClientRect().top)
    return {
      blockWidths: blocks.map((e) => e.offsetWidth), parent: document.querySelector('.slide.active .bi-blocks').clientWidth - 24,
      blockTops: blocks.map((e) => e.getBoundingClientRect().top),
      lines: new Set(tops.map((t) => Math.round(t))).size,
      blockSized: document.querySelector('.slide.active .bi-w').offsetWidth,
      inlineSized: box('.bi-iw').width / scale, display: getComputedStyle(document.querySelector('.slide.active .bi-iw')).display,
    }
  })
  for (const w of m.blockWidths) assert.equal(w, m.parent, 'a block fills its parent')
  assert.equal(new Set(m.blockTops).size, m.blockTops.length, 'each block starts a new line')
  assert.equal(m.lines, 1, 'inline elements share one line')
  assert.equal(m.blockSized, 300, 'width works on a block')
  assert.equal(m.display, 'inline')
  assert.ok(m.inlineSized < 300 && m.inlineSized > 0, 'the same width does nothing to an inline element: ' + m.inlineSized)
  assert.ok(await page.evaluate(() => { const s = document.querySelector('.slide.active'); return s.scrollHeight <= s.clientHeight + 1 }), 'the slide fits')
  await page.close()
})

test('every tag on the slide really is what the slide says', async () => {
  const page = await browser.newPage()
  await page.setContent('<body></body>')
  const shown = await page.evaluate(() => Object.fromEntries(['h1', 'p', 'div', 'ul', 'ol', 'table', 'form', 'section', 'header', 'nav', 'a', 'span', 'strong', 'em', 'label', 'img', 'input'].map((t) => { const e = document.createElement(t); document.body.append(e); return [t, getComputedStyle(e).display] })))
  for (const t of ['h1', 'p', 'div', 'ul', 'ol', 'form', 'section', 'header', 'nav']) assert.equal(shown[t], 'block', t)
  assert.equal(shown.table, 'table')
  for (const t of ['a', 'span', 'strong', 'em', 'label', 'img']) assert.equal(shown[t], 'inline', t)
  assert.equal(shown.input, 'inline-block')
  await page.close()
})
