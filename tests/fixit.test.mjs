import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { serve, launch, until } from './helpers.mjs'

const require = createRequire(import.meta.url)
const Course = require('../shared/course.js')
globalThis.Course = Course
await import('../shared/course/html-css.js')
await import('../shared/course/html-css-fixit.js')
const lesson = Course.get('html-css')
const problems = globalThis.FIXIT['html-css']

let srv, browser
before(async () => { srv = await serve(); browser = await launch() })
after(async () => { await browser?.close(); srv?.close() })

const solution = (p) => {
  const files = { ...Course.checkpoint(lesson, p.base) }
  for (const s of p.solve || []) files[s.file] = Course.applyStep(files[s.file], s)
  return files
}

async function open(id, opts = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  if (opts.noStorage) await context.addInitScript(() => { Storage.prototype.getItem = () => { throw new Error('blocked') }; Storage.prototype.setItem = () => { throw new Error('blocked') } })
  const page = await context.newPage()
  await page.goto(srv.url + '/fixit.html?lesson=html-css' + (id ? '&p=' + id : ''))
  await until(page, () => window.FixIt && window.FixIt.ready)
  return { context, page }
}
const press = async (page) => {
  await page.click('.fx-fix')
  return until(page, () => { const r = document.querySelector('.fx-result'); return r && /Fixed|Still broken/.test(r.textContent) && r.textContent }, null, 15000)
}

test('there are 10 problems; the first 6 are the core set', () => {
  assert.equal(problems.length, 10)
  for (const p of problems.slice(6)) assert.match(p.title, /^Bonus:/)
  for (const p of problems.slice(0, 6)) assert.doesNotMatch(p.title, /^Bonus:/)
})

test('each broken page fails, and the solution passes', async () => {
  for (const p of problems) {
    const { context, page } = await open(p.id)
    assert.match(await press(page), /Still broken/, p.id + ' broken fails')
    await page.evaluate((f) => window.FixIt.setFiles(f), solution(p))
    assert.match(await press(page), /Fixed!/, p.id + ' solution passes')
    await context.close()
  }
})

test('a different correct fix also passes (./styles.css)', async () => {
  const { context, page } = await open('css')
  const files = await page.evaluate(() => window.FixIt.getFiles())
  files['index.html'] = files['index.html'].replace('<link href="styles.css">', '<link rel="stylesheet" href="./styles.css">')
  await page.evaluate((f) => window.FixIt.setFiles(f), files)
  assert.match(await press(page), /Fixed!/)
  await context.close()
})

test('Show solution lists the lines to change and why', async () => {
  const { context, page } = await open('label')
  await page.click('.fx-solution')
  const text = await page.textContent('.fx-answer')
  assert.match(text, /<label for="trainer">/)
  assert.match(text, /<label for="name">/)
  const lines = await page.$$eval('.fx-diff span', (s) => s.map((x) => x.textContent))
  assert.deepEqual(lines, ['-         <label for="name">Your name</label>', '+         <label for="trainer">Your name</label>'], 'old line first, then the new one, no blank lines')
  assert.match(text, /id equals its for/)
  await context.close()
})

test('a fixed problem gets a check mark that survives a reload', async () => {
  const { context, page } = await open('dot')
  await page.evaluate((f) => window.FixIt.setFiles(f), solution(problems.find((p) => p.id === 'dot')))
  await press(page)
  await page.reload()
  await until(page, () => window.FixIt && window.FixIt.ready)
  assert.match(await page.textContent('.fx-item[data-id="dot"]'), /✅/)
  await context.close()
})

test('the page still works when browser storage is blocked', async () => {
  const { context, page } = await open('dot', { noStorage: true })
  assert.match(await press(page), /Still broken/)
  await context.close()
})

test('Hint shows the hint; Reset brings the broken code back', async () => {
  const { context, page } = await open('css')
  await page.click('.fx-hint')
  assert.match(await page.textContent('.fx-hint-text'), /rel|stylesheet|<link>/)
  const broken = await page.evaluate(() => window.FixIt.getFiles())
  await page.evaluate((f) => window.FixIt.setFiles({ ...f, 'index.html': 'x' }), broken)
  await page.click('.fx-reset')
  assert.deepEqual(await page.evaluate(() => window.FixIt.getFiles()), broken)
  await context.close()
})
