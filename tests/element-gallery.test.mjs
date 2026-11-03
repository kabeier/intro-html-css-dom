// The element gallery: click a tag, see its code and how the browser draws it with no CSS.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { serve, launch } from './helpers.mjs'

let srv, browser, page
before(async () => {
  srv = await serve(); browser = await launch()
  page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
  await page.goto(srv.url + '/lecture-1-html-css/slides.html')
  const n = await page.evaluate(() => [...document.querySelectorAll('.slide')].findIndex((s) => s.querySelector('.eg')) + 1)
  assert.ok(n > 0, 'there is a gallery slide')
  assert.match(await page.evaluate((k) => document.querySelectorAll('.slide')[k - 2].querySelector('h2').textContent, n), /Block vs inline/)
  await page.goto(srv.url + '/lecture-1-html-css/slides.html#' + n)
  await page.reload()
  await page.waitForSelector('.slide.active .eg iframe')
})
after(async () => { await browser?.close(); srv?.close() })

// The drawn page loads after the click: wait until it holds the code that is shown.
const drawn = () => page.waitForFunction(() => {
  const s = document.querySelector('.slide.active'), d = s.querySelector('.eg iframe').contentDocument
  if (!d?.body || d.readyState !== 'complete') return false
  const t = d.createElement('template'); t.innerHTML = s.querySelector('.eg-code').textContent
  return d.body.innerHTML.trim() === t.innerHTML.trim()
}, null, { timeout: 5000 })

const shown = () => page.evaluate(() => {
  const s = document.querySelector('.slide.active'), f = s.querySelector('.eg iframe')
  const d = f.contentDocument
  return {
    code: s.querySelector('.eg-code').textContent, picked: s.querySelector('.eg-pick [aria-pressed="true"]')?.dataset.el,
    body: d.body.innerHTML, parsed: (() => { const t = d.createElement('template'); t.innerHTML = s.querySelector('.eg-code').textContent; return t.innerHTML })(), sheets: d.querySelectorAll('link[rel=stylesheet]').length, styles: [...d.querySelectorAll('style')].map((x) => x.textContent).join(''),
    fits: d.documentElement.scrollHeight <= f.clientHeight + 1, codeFits: (() => { const c = s.querySelector('.eg-code'); return c.scrollHeight <= c.clientHeight + 1 })(), breaksWords: getComputedStyle(s.querySelector('.eg-code')).wordBreak === 'break-all', slideFits: s.scrollHeight <= s.clientHeight + 1,
  }
})

test('the gallery covers the common elements, including tables, lists, buttons and quotes', async () => {
  const els = await page.$$eval('.slide.active .eg-pick button', (bs) => bs.map((b) => b.dataset.el))
  for (const e of ['headings', 'p', 'a', 'img', 'ul', 'ol', 'dl', 'table', 'blockquote', 'button', 'input', 'checkbox', 'select', 'textarea', 'details'])
    assert.ok(els.includes(e), 'has ' + e)
})

test('clicking each tag shows its code and the real element, drawn by the browser with no CSS, all on screen', async () => {
  const els = await page.$$eval('.slide.active .eg-pick button', (bs) => bs.map((b) => b.dataset.el))
  for (const el of els) {
    await page.click(`.slide.active .eg-pick button[data-el="${el}"]`)
    await drawn().catch(() => {})
    const m = await shown()
    assert.equal(m.picked, el)
    assert.equal(m.body.trim(), m.parsed.trim(), el + ': the page draws exactly the code shown')
    assert.equal(m.sheets, 0)
    assert.doesNotMatch(m.styles, /\{[^}]*(color|font|border|padding|display)/, el + ': no styling beyond zoom')
    assert.ok(m.fits, el + ': fits in the window without scrolling')
    assert.ok(m.codeFits, el + ': the code fits in its box')
    assert.ok(!m.breaksWords, 'code wraps at spaces, not inside words')
    assert.ok(m.slideFits, 'the slide fits')
  }
})

test('the table example draws a real table and the quote example a real blockquote', async () => {
  await page.click('.slide.active .eg-pick button[data-el="table"]'); await drawn()
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('.slide.active .eg iframe').contentDocument.querySelector('table')).display), 'table')
  await page.click('.slide.active .eg-pick button[data-el="blockquote"]'); await drawn()
  assert.ok(await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.slide.active .eg iframe').contentDocument.querySelector('blockquote')).marginLeft) > 0), 'blockquote is indented by default')
})

test('arrow keys still move the deck after clicking a tag', async () => {
  await page.click('.slide.active .eg-pick button[data-el="ul"]'); await drawn()
  await page.click('.slide.active .eg iframe')
  const before = await page.evaluate(() => location.hash)
  await page.keyboard.press('ArrowRight')
  await page.waitForFunction((h) => location.hash !== h, before)
  await page.keyboard.press('ArrowLeft')
})
