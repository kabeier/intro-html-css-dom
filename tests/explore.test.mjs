import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { execFileSync } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { serve, launch, until } from './helpers.mjs'

const require = createRequire(import.meta.url)
const Course = require('../shared/course.js')
globalThis.Course = Course
await import('../shared/course/html-css.js')
await import('../shared/course/js-dom.js')
const lesson = Course.get('html-css')
const f3 = Course.checkpoint(lesson, 'f3')['index.html'].split('\n')
const lineOf = (pred) => f3.findIndex(pred) + 1

let srv, browser
before(async () => { srv = await serve(); browser = await launch() })
after(async () => { await browser?.close(); srv?.close() })

async function open(q = '?lesson=html-css&at=f3') {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true })
  const page = await context.newPage()
  await page.goto(srv.url + '/explore.html' + q)
  await until(page, () => { const f = document.querySelector('.ex-preview iframe'); return f && f.contentDocument && f.contentDocument.querySelector('h1') })
  return { context, page }
}
const inPreview = (page, sel) => page.evaluate((sel) => !!document.querySelector('.ex-preview iframe').contentDocument.querySelector(sel), sel)
const clickLine = async (page, n) => { await page.click(`.ex-code .ex-line[data-line="${n}"]`); return page.textContent('.ex-story') }

test('at=f3 shows the app after feature 3: the ordered list, no form yet', async () => {
  const { context, page } = await open()
  assert.equal(await inPreview(page, 'ol'), true)
  assert.equal(await inPreview(page, 'form'), false)
  await context.close()
})

test('Before shows the app before the feature (no list yet)', async () => {
  const { context, page } = await open()
  await page.click('.ex-before')
  await until(page, () => { const d = document.querySelector('.ex-preview iframe').contentDocument; return d && d.querySelector('h1') && !d.querySelector('ol') })
  await context.close()
})

test('the changes of the feature are listed step by step with their notes', async () => {
  const { context, page } = await open()
  const steps = await page.$$eval('.ex-change', (els) => els.map((e) => e.dataset.step))
  assert.deepEqual(steps, lesson.features.find((f) => f.id === 'f3').steps.map((s) => s.id))
  assert.match(await page.textContent('.ex-changes'), /An ordered list: numbered/)
  await context.close()
})

test('clicking the <img> line tells its story, with the alt argument explained', async () => {
  const { context, page } = await open()
  const story = await clickLine(page, lineOf((l) => l.includes('<img')))
  assert.match(story, /An image/)
  assert.match(story, /alt/)
  assert.match(story, /say what the picture shows/)
  assert.match(story, /Feature 2/)
  await context.close()
})

test('clicking a blank line explains what blank lines are for', async () => {
  const { context, page } = await open('?lesson=html-css&at=f6')
  await page.click('.ex-tab[data-file="styles.css"]')
  const blank = Course.checkpoint(lesson, 'f6')['styles.css'].split('\n').findIndex((l) => l.trim() === '') + 1
  assert.ok(blank > 0, 'the stylesheet has a blank line')
  const story = await clickLine(page, blank)
  assert.match(story, /Blank line/)
  assert.doesNotMatch(story, /Nothing to explain/)
  await context.close()
})

test('clicking </table> shows the table note', async () => {
  const { context, page } = await open()
  assert.match(await clickLine(page, lineOf((l) => l.includes('</table>'))), /A table of data/)
  await context.close()
})

test('Download all gives a zip of the code at this feature (catch-up)', async () => {
  const { context, page } = await open()
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.ex-download')])
  const dir = mkdtempSync(path.join(os.tmpdir(), 'ex-'))
  const zip = path.join(dir, 'code.zip')
  await dl.saveAs(zip)
  const html = execFileSync('unzip', ['-p', zip, 'index.html']).toString()
  assert.equal(html, Course.checkpoint(lesson, 'f3')['index.html'])
  await context.close()
})

test('the code view shows every line exactly as written (colouring adds no text)', async () => {
  const { context, page } = await open('?lesson=html-css&at=f7')
  for (const file of ['index.html', 'styles.css']) {
    await page.click(`.ex-tab[data-file="${file}"]`)
    const shown = await page.$$eval('.ex-code .ex-line .src', (els) => els.map((e) => e.textContent))
    const want = Course.checkpoint(lesson, 'f7')[file].split('\n').map((l) => l || ' ')
    assert.deepEqual(shown, want, file)
  }
  const snippets = await page.$$eval('.ex-snippet', (els) => els.map((e) => e.textContent))
  assert.deepEqual(snippets, lesson.features.find((f) => f.id === 'f7').steps.filter((s) => s.code).map((s) => s.code))
  await context.close()
})

test('on a phone the page does not scroll sideways', async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  await page.goto(srv.url + '/explore.html?lesson=html-css&at=f7')
  await page.waitForTimeout(800)
  const [sw, w] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth])
  assert.ok(sw <= w, `page is ${sw}px wide in a ${w}px screen`)
  await context.close()
})

test('the feature list switches features', async () => {
  const { context, page } = await open()
  await page.click('.ex-feature[data-feature="f4"]')
  await until(page, () => { const d = document.querySelector('.ex-preview iframe').contentDocument; return d && d.querySelector('form') })
  assert.match(page.url(), /at=f4/)
  await context.close()
})

test('the explorer can switch lessons, and lecture 1 lines in lecture 2 link back to lecture 1', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  await page.goto(srv.url + '/explore.html?lesson=js-dom&at=f1')
  await until(page, () => { const f = document.querySelector('.ex-preview iframe'); return f && f.contentDocument && f.contentDocument.querySelector('h1') })
  assert.match(await page.textContent('.ex-lessons'), /HTML & CSS/)
  const js = Course.checkpoint(Course.get('js-dom'), 'f1')['index.html'].split('\n')
  await page.click(`.ex-code .ex-line[data-line="${js.findIndex((l) => l.includes('<img')) + 1}"]`)
  const story = await page.textContent('.ex-story')
  assert.match(story, /An image/)
  assert.match(story, /Lecture 1/)
  assert.ok(await page.$('.ex-story a[href*="lesson=html-css"]'))
  await context.close()
})

test('the explorer shows the page console too', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  await page.goto(srv.url + '/explore.html?lesson=js-dom&at=f2')
  await until(page, () => /NodeList\(3\)/.test(document.querySelector('.ex-console')?.textContent || ''))
  await context.close()
})
