// The "Three places CSS can live" slide says which rule wins. These check it in a real browser.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { launch } from './helpers.mjs'

let browser
before(async () => { browser = await launch() })
after(async () => { await browser?.close() })

const red = 'rgb(255, 0, 0)', green = 'rgb(0, 128, 0)', purple = 'rgb(128, 0, 128)'
const link = (css) => `<link rel="stylesheet" href="data:text/css,${encodeURIComponent(css)}">`
const style = (css) => `<style>${css}</style>`
const h1 = '<h1 id="t">x</h1>', inline = '<h1 id="t" style="color: purple">x</h1>'

async function colour(head, body) {
  const page = await browser.newPage()
  await page.setContent(`<!doctype html><html><head>${head}</head><body>${body}</body></html>`, { waitUntil: 'load' })
  const c = await page.evaluate(() => getComputedStyle(document.querySelector('h1')).color)
  await page.close()
  return c
}

test('internal and external have no rank: same selector, the later one wins', async () => {
  assert.equal(await colour(link('h1 { color: red }') + style('h1 { color: green }'), h1), green)
  assert.equal(await colour(style('h1 { color: green }') + link('h1 { color: red }'), h1), red)
})

test('inline beats any selector, from either place', async () => {
  assert.equal(await colour(link('#t { color: red }'), inline), purple)
  assert.equal(await colour(style('#t { color: green }'), inline), purple)
})

test('a more specific selector beats a later rule', async () => {
  assert.equal(await colour(link('#t { color: red }') + style('h1 { color: green }'), h1), red)
})

test('!important beats inline', async () => {
  assert.equal(await colour(link('h1 { color: red !important }'), inline), red)
})

test('on a usual page (link, then style) the same selector ranks inline, internal, external', async () => {
  const head = link('h1 { color: red }') + style('h1 { color: green }')
  assert.equal(await colour(head, inline), purple, 'inline wins')
  assert.equal(await colour(head, h1), green, 'internal beats external')
  assert.equal(await colour(link('h1 { color: red }'), h1), red, 'external alone')
})

test('swap link and style and external beats internal: order matters', async () => {
  assert.equal(await colour(style('h1 { color: green }') + link('h1 { color: red }'), h1), red)
})

test('the colours slide: every way of writing the colour really is the same colour', async () => {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
  const { serve } = await import('./helpers.mjs')
  const srv = await serve()
  await page.goto(srv.url + '/lecture-1-html-css/slides.html')
  const r = await page.evaluate(() => [...document.querySelectorAll('.colours .sw[data-c]')].map((s) => [s.dataset.c, getComputedStyle(s).backgroundColor]))
  await page.close(); srv.close()
  const solid = r.filter(([c]) => !/0\.5|80$/.test(c))
  assert.deepEqual(solid.map(([c]) => c), ['rebeccapurple', '#663399', '#639', 'rgb(102, 51, 153)', 'hsl(270, 50%, 40%)'])
  for (const [c, v] of solid) assert.equal(v, 'rgb(102, 51, 153)', c)
  const see = r.filter(([c]) => /0\.5|80$/.test(c))
  assert.equal(see.length, 2)
  assert.match(see[0][1], /^rgba\(102, 51, 153, 0\.5\)$/)
  assert.match(see[1][1], /^rgba\(102, 51, 153, 0\.5\d*\)$/, '#66339980 is about 50%')
})
