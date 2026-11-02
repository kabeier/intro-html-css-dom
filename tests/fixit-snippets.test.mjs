import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { serve, launch, until } from './helpers.mjs'

const LESSONS = ['html-css', 'js-dom']
let srv, browser
before(async () => { srv = await serve(); browser = await launch() })
after(async () => { await browser?.close(); srv?.close() })

const lineNumbers = (page) => page.evaluate(() => [...document.querySelectorAll('.fx-pad .line-numbers')].map((n) => Number(n.textContent)).filter(Boolean))

test('every problem shows a short snippet, in the files that have the bug', async () => {
  const page = await browser.newPage()
  for (const lesson of LESSONS) {
    await page.goto(srv.url + '/fixit.html?lesson=' + lesson)
    const sizes = await page.evaluate(() => FixIt.problems.map((p) => [p.id, Math.max(...Object.values(FixIt.snippets(p)).map((w) => w.reduce((t, [a, b]) => t + b - a + 1, 0)))]))
    assert.equal(sizes.length, 10, lesson)
    for (const [id, n] of sizes) assert.ok(n > 0 && n <= 16, `${lesson} ${id}: ${n} lines`)
  }
  await page.close()
})

test('the whole problem fits on one screen: code, app and buttons, no scrolling', async () => {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
  await page.goto(srv.url + '/fixit.html?lesson=' + LESSONS[0])
  await page.waitForSelector('.fx-pad .line-numbers')
  assert.ok(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight), 'the page does not scroll')
  const seen = await lineNumbers(page)
  assert.ok(seen.length <= 16, 'only the snippet shows: ' + seen)
  for (const sel of ['.fx-pad iframe', '.fx-fix', '.fx-hint', '.fx-symptom']) {
    const box = await page.locator(sel).first().boundingBox()
    assert.ok(box && box.y + box.height <= 900, sel + ' is on screen')
  }
  assert.equal(await page.isVisible('.fx-pad .lp-tree'), false, 'no file tree in the way')
  await page.close()
})

test('a fix typed into the snippet reaches the page, and all the code can still be shown', async () => {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
  await page.goto(srv.url + '/fixit.html?lesson=' + LESSONS[0])
  await page.waitForSelector('.fx-pad .view-line')
  const before = await page.evaluate(() => JSON.stringify(FixIt.getFiles()))
  await page.locator('.fx-pad .view-line').first().click()
  await page.keyboard.press('End')
  await page.keyboard.type(' ')
  await until(page, (b) => JSON.stringify(FixIt.getFiles()) !== b, before)
  await page.click('.fx-whole')
  await until(page, () => document.querySelectorAll('.fx-pad .line-numbers').length > 16 || document.querySelector('.fx-pad .line-numbers').textContent.trim() === '1')
  assert.equal(await page.isVisible('.fx-pad .lp-tree'), true, 'the whole project shows, with its files')
  await page.click('.fx-whole')
  await until(page, () => document.querySelectorAll('.fx-pad .line-numbers').length <= 17)
  await page.click('.fx-reset')
  await until(page, (b) => JSON.stringify(FixIt.getFiles()) === b, before)
  await page.close()
})
