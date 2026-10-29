import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { serve, launch, until } from './helpers.mjs'

const require = createRequire(import.meta.url)
const Course = require('../shared/course.js')
globalThis.Course = Course
await import('../shared/course/html-css.js')
await import('../shared/course/html-css-fixit.js')
await import('../shared/course/js-dom.js')
await import('../shared/course/js-dom-fixit.js')
const lesson = Course.get('html-css')
const problems = globalThis.FIXIT['html-css']
const jsProblems = globalThis.FIXIT['js-dom']

let srv, browser
before(async () => { srv = await serve(); browser = await launch() })
after(async () => { await browser?.close(); srv?.close() })

const solution = (p, l = lesson) => {
  const files = { ...Course.checkpoint(l, p.base) }
  for (const s of p.solve || []) files[s.file] = Course.applyStep(files[s.file], s)
  return files
}

async function open(id, opts = {}, lessonId = 'html-css') {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  if (opts.noStorage) await context.addInitScript(() => { Storage.prototype.getItem = () => { throw new Error('blocked') }; Storage.prototype.setItem = () => { throw new Error('blocked') } })
  const page = await context.newPage()
  await page.goto(srv.url + '/fixit.html?lesson=' + lessonId + (id ? '&p=' + id : ''))
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

test('offline (no Monaco) the code can still be edited and fixed', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await context.route('**/monaco-editor@*/**', (r) => r.abort())
  const page = await context.newPage()
  await page.goto(srv.url + '/fixit.html?lesson=html-css&p=dot')
  await until(page, () => window.FixIt && window.FixIt.ready && document.querySelector('.lp-fallback'))
  await page.click('.fx-pad .lp-tab[data-file="styles.css"]')
  const box = page.locator('.fx-pad textarea.lp-fallback')
  const text = await box.inputValue()
  await box.fill(text.replace('card {', '.card {'))
  assert.match(await press(page), /Fixed!/)
  await context.close()
})


test('lecture 2: 10 problems, first 6 core', () => {
  assert.equal(jsProblems.length, 10)
  for (const p of jsProblems.slice(6)) assert.match(p.title, /^Bonus:/)
})

test('lecture 2: each broken page fails, and the solution passes', async () => {
  const js = Course.get('js-dom')
  for (const p of jsProblems) {
    const { context, page } = await open(p.id, {}, 'js-dom')
    assert.match(await press(page), /Still broken/, p.id + ' broken fails')
    await page.evaluate((f) => window.FixIt.setFiles(f), solution(p, js))
    assert.match(await press(page), /Fixed!/, p.id + ' solution passes')
    await context.close()
  }
})

test('the Fix It page links to the other lecture', async () => {
  const { context, page } = await open(null)
  assert.ok(await page.$('.fx-lessons a[href*="lesson=js-dom"]'))
  await context.close()
})

test('lecture 2: deleting the card listener is not a fix for the bubbling problem', async () => {
  const { context, page } = await open('bubble', {}, 'js-dom')
  const files = await page.evaluate(() => window.FixIt.getFiles())
  files['script.js'] = files['script.js'].replace('document.querySelector("#team").addEventListener("click", (evt) => {\n  evt.currentTarget.classList.toggle("picked")\n})', '')
  await page.evaluate((f) => window.FixIt.setFiles(f), files)
  assert.match(await press(page), /Still broken/)
  await context.close()
})

test('lecture 2: renaming the h1 id to match the typo also fixes it', async () => {
  const { context, page } = await open('idtypo', {}, 'js-dom')
  const files = await page.evaluate(() => window.FixIt.getFiles())
  files['index.html'] = files['index.html'].replace('id="page-title"', 'id="page-titel"')
  await page.evaluate((f) => window.FixIt.setFiles(f), files)
  assert.match(await press(page), /Fixed!/)
  await context.close()
})

test('lecture 2: DOMContentLoaded wrapper is an accepted fix for defer', async () => {
  const { context, page } = await open('defer', {}, 'js-dom')
  const files = await page.evaluate(() => window.FixIt.getFiles())
  files['index.html'] = files['index.html'].replace('<script src="script.js"></script>', '<script src="script.js" defer></script>')
  files['script.js'] = 'document.addEventListener("DOMContentLoaded", () => {\n' + files['script.js'] + '\n})'
  await page.evaluate((f) => window.FixIt.setFiles(f), files)
  assert.match(await press(page), /Fixed!/)
  await context.close()
})
