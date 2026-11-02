// Everything on the curriculum page (phase-II/04-Front-End/1-vanilla-development/1-html-css.md) must be
// DISPLAYED in lecture 1: typed in a code step, or visible on a slide. Presenter notes do not count.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { ROOT } from './helpers.mjs'

const require = createRequire(import.meta.url)
const Course = require('../shared/course.js')
globalThis.Course = Course
await import('../shared/course/html-css.js')
const code = Course.get('html-css').features.flatMap((f) => f.steps).map((s) => s.code || '').join('\n')
const dec = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
const html = readFileSync(ROOT + '/lecture-1-html-css/slides.html', 'utf8').replace(/<style>[\s\S]*?<\/style>/, '').replace(/<script[\s\S]*?<\/script>/g, '')
const visible = dec(html.replace(/<aside class="notes">[\s\S]*?<\/aside>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ')
const shown = (t) => code.includes(t) || visible.toLowerCase().includes(t.toLowerCase())
const onSlide = (t) => visible.toLowerCase().includes(t.toLowerCase())

test('every tag and attribute on the curriculum page is displayed', () => {
  const items = ['<!DOCTYPE html>', '<html', '<head', '<title', '<meta', '<link', '<style', '<script', '<body', '<h1', '<h2', '<h3', '<h4', '<h5', '<h6', '<p', '<br', '<div', '<span', '<strong', '<em', '<a ', '<form', '<input', 'type="text', 'type="password', 'type="checkbox', 'type="radio', '<textarea', '<select', '<button', 'action=', 'method=', 'name=', '<ul', '<ol', '<li', '<dl', '<dt', '<dd', '<img', 'alt=', '<table', '<tr', '<th', '<td', '<header', '<nav', '<main', '<section', '<article', '<aside', '<footer', ' id=', ' class=', ' src=', ' href=']
  for (const t of items) assert.ok(shown(t), t)
})

test('every use of the head on the curriculum page is displayed', () => {
  for (const t of ['charset', 'viewport', 'name="description"', 'rel="icon"', 'rel="stylesheet"', '<script src=']) assert.ok(shown(t), t)
})

test('every CSS way, selector and property on the curriculum page is displayed', () => {
  for (const t of ['style="', '<style>', '<link rel="stylesheet"', 'color:', 'font-size:', 'background-color:', 'padding:', 'margin:', 'border:', '.card {', '#page-title {', 'h1 {', '@media', 'rem', '%', 'display: flex']) assert.ok(shown(t), t)
})

test('the ideas are on a slide, not only in the notes', () => {
  for (const t of ['markup language', 'not a programming language', 'structure', 'presentation', 'colours', 'fonts', 'spacing', 'layout', 'responsiveness',
    'not drawn', 'standards', 'hierarchy', '<img />', 'ignored', 'no end tag', 'accessibility', 'SEO', 'maintainab', 'team communication', 'separation of concerns', 'scale',
    'data, never for layout', 'alt', '#id', 'more specific', 'content', 'padding', 'border', 'margin', 'mobile', 'tablet', 'desktop', 'relative', 'media quer',
    'W3C', 'WHATWG', 'living standard', 'MDN', 'accessible', 'modular', 'readable', 'block', 'inline', 'importance', 'emphasis', 'line break', 'definition']) assert.ok(onSlide(t), t)
})

test('the Part I homework is on the slide, in curriculum order', () => {
  const order = ['To-Do List I', 'To-Do List II', 'Top Ten', 'Portfolio Website'].map((t) => visible.indexOf(t))
  assert.ok(order.every((x) => x >= 0))
  assert.deepEqual(order, [...order].sort((a, b) => a - b))
})
