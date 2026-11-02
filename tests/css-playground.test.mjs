import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { serve, launch, until, ROOT } from './helpers.mjs'

let srv, browser
before(async () => { srv = await serve(); browser = await launch() })
after(async () => { await browser?.close(); srv?.close() })
const URL_ = '/lecture-1-html-css/css-playground/'
async function open(path = URL_, viewport = { width: 1400, height: 900 }) {
  const page = await browser.newPage({ viewport })
  const errs = []
  page.on('pageerror', (e) => errs.push(e.message))
  await page.goto(srv.url + path)
  await page.waitForFunction(() => window.Playground)
  return { page, errs }
}

test('every value is real CSS, has a line saying what it does, and visibly changes the preview', async () => {
  const { page, errs } = await open()
  const props = await page.evaluate(() => window.CSS_PROPERTIES.map((p) => ({ name: p.name, n: p.values.length, hover: !!p.hover, what: p.what, use: p.use, values: p.values })))
  assert.ok(props.length >= 30, 'about 35 properties')
  assert.equal(new Set(props.map((p) => p.name)).size, props.length, 'no duplicates')
  for (const [i, p] of props.entries()) {
    assert.ok(p.what && p.use, p.name)
    for (const [v, line] of p.values) {
      assert.ok(line, p.name + ' ' + v + ' has a line')
      assert.ok(await page.evaluate(([n, x]) => CSS.supports(n, x), [p.name, v]), p.name + ': ' + v + ' is valid')
    }
    await page.evaluate((k) => window.Playground.pick(k), i)
    const shots = new Set(), computed = new Set()
    for (let k = 0; k < p.n; k++) {
      await page.mouse.move(0, 0)
      shots.add((await page.locator('#stage').screenshot()).toString('base64'))
      computed.add(await page.evaluate((n) => getComputedStyle(document.querySelector('#stage .t')).getPropertyValue(n), p.name))
      await page.click('#next')
    }
    if (p.hover) assert.equal(computed.size, p.n, p.name + ': each value applies')
    else assert.equal(shots.size, p.n, p.name + ': every value looks different in the preview')
  }
  assert.deepEqual(errs, [])
  await page.close()
})

test('the captions are true: box-sizing widths, gradients, and the rule shown is the rule applied', async () => {
  const { page } = await open(URL_ + '?p=box-sizing')
  assert.equal(await page.evaluate(() => document.querySelector('#stage .t').offsetWidth), 264, 'content-box: 200 + 48 + 16')
  await page.click('#next')
  assert.equal(await page.evaluate(() => document.querySelector('#stage .t').offsetWidth), 200, 'border-box')
  assert.match(await page.textContent('#rule'), /\.box \{\n {2}box-sizing: border-box;\n\}/)
  await page.goto(srv.url + URL_ + '?p=justify-content'); await page.waitForFunction(() => window.Playground)
  assert.match(await page.textContent('#rule'), /\.parent \{/)
  assert.equal(await page.isVisible('#on'), true, 'flex rules say they go on the parent')
  await page.close()
})

test('a typed value applies; a wrong one is explained and ignored', async () => {
  const { page } = await open()
  await page.fill('#typed', 'tomato')
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('#stage .t')).color), 'rgb(255, 99, 71)')
  assert.match(await page.textContent('#rule'), /color: tomato;/)
  await page.fill('#typed', 'tomatoo')
  assert.match(await page.textContent('#caption'), /does not understand "tomatoo"/)
  await page.close()
})

test('keys and Play move through values and properties', async () => {
  const { page } = await open()
  await page.keyboard.press('ArrowRight')
  assert.match(await page.textContent('#step'), /Value 2 of 4/)
  await page.keyboard.press('ArrowDown')
  assert.equal(await page.textContent('#name'), 'font-size')
  await page.keyboard.press('ArrowUp')
  assert.equal(await page.textContent('#name'), 'color')
  await page.click('#play')
  await until(page, () => /Value 2/.test(document.querySelector('#step').textContent), null, 3000)
  await page.click('#play')
  assert.equal(await page.textContent('#play'), 'Play the values')
  await page.close()
})

test('the list shows every property with a rendered example, and Try it opens it', async () => {
  const { page } = await open()
  const n = await page.evaluate(() => window.Playground.count)
  assert.equal(await page.locator('#all .ref').count(), n)
  assert.equal(await page.locator('#all .mini .t').count() >= n, true)
  await page.locator('#all .ref:has(code:text-is("gap")) .try').click()
  assert.equal(await page.textContent('#name'), 'gap')
  await page.close()
})

test('phones: no sideways scroll, a dropdown instead of the list', async () => {
  const { page } = await open(URL_, { width: 390, height: 800 })
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= 390))
  await page.selectOption('#prop-select', { label: 'gap' })
  assert.equal(await page.textContent('#name'), 'gap')
  await page.close()
})

test('every CSS property the lecture types is in the playground', () => {
  const css = readFileSync(ROOT + '/demo-kit/html-css-final/styles.css', 'utf8')
  globalThis.window = {}
  new Function('window', readFileSync(ROOT + '/lecture-1-html-css/css-playground/properties.js', 'utf8'))(globalThis.window)
  const names = new Set(globalThis.window.CSS_PROPERTIES.map((p) => p.name))
  for (const [, prop] of css.matchAll(/^\s+([a-z-]+):/gm)) {
    if (prop === 'margin-top') continue // the margin entry covers it
    assert.ok(names.has(prop), prop)
  }
})
