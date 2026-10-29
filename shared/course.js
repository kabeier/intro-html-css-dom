// Course data model: a lesson = starting files + features → steps → line notes.
// Slides (livepad.js), the explorer and the Fix-it page all read lessons through
// this file, so they always show the same code.
//   Browser: <script src="../shared/course.js"></script> → window.Course
//   Node:    require('./shared/course.js')
;(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory()
  else root.Course = factory()
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict'

  class StepMismatch extends Error {
    constructor(step, many) {
      super(`Step ${step && step.id} can't apply: "${step && step.find}" is ${many ? 'in ' + (step && step.file) + ' more than once' : 'not in ' + (step && step.file)}`)
      this.name = 'StepMismatch'
      this.step = step
    }
  }

  const lessons = {}
  const register = (lesson) => { lessons[lesson.id] = lesson; return lesson }
  const get = (id) => lessons[id]

  const split = (text) => (text === '' ? [] : text.split('\n'))
  const tagged = (text, stepId) => split(text).map((t) => ({ text: t, stepId }))
  const join = (lines) => lines.map((l) => l.text).join('\n')
  const count = (s, ch) => s.split(ch).length - 1

  // Apply one step to a file held as tagged lines; returns new tagged lines.
  function applyLines(lines, step) {
    const id = step.id || null
    const text = join(lines)
    if (step.mode === 'set') return tagged(step.code, id)
    if (step.mode === 'append' || !step.mode) {
      if (text === '') return tagged(step.code, id)
      return [...lines, { text: '', stepId: id }, ...tagged(step.code, id)]
    }
    if (step.mode === 'insertAfter') {
      const at = lines.findIndex((l) => l.text.includes(step.find))
      if (at < 0) throw new StepMismatch(step)
      if (lines.filter((l) => l.text.includes(step.find)).length > 1) throw new StepMismatch(step, true)
      return [...lines.slice(0, at + 1), ...tagged(step.code, id), ...lines.slice(at + 1)]
    }
    if (step.mode === 'replace') {
      const idx = text.indexOf(step.find)
      if (idx < 0) throw new StepMismatch(step)
      if (text.indexOf(step.find, idx + 1) >= 0) throw new StepMismatch(step, true)
      const first = count(text.slice(0, idx), '\n')
      const last = first + count(step.find, '\n')
      const next = text.slice(0, idx) + step.code + text.slice(idx + step.find.length)
      const nextLines = split(next)
      const newLast = first + count(step.code, '\n')
      // Lines inside the replaced block that did not change keep where they came from.
      const oldBlock = lines.slice(first, last + 1)
      const newBlock = nextLines.slice(first, newLast + 1)
      let lead = 0
      while (lead < oldBlock.length && lead < newBlock.length && oldBlock[lead].text === newBlock[lead]) lead++
      let trail = 0
      while (trail < oldBlock.length - lead && trail < newBlock.length - lead &&
        oldBlock[oldBlock.length - 1 - trail].text === newBlock[newBlock.length - 1 - trail]) trail++
      return nextLines.map((t, i) => {
        if (i < first) return { text: t, stepId: lines[i].stepId }
        if (i <= newLast) {
          const k = i - first
          if (k < lead) return { text: t, stepId: oldBlock[k].stepId }
          if (k >= newBlock.length - trail) return { text: t, stepId: oldBlock[oldBlock.length - (newBlock.length - k)].stepId }
          return { text: t, stepId: id }
        }
        return { text: t, stepId: lines[i - newLast + last].stepId }
      })
    }
    throw new Error(`Unknown step mode: ${step.mode}`)
  }

  const applyStep = (text, step) => join(applyLines(tagged(text, null), step))

  const allSteps = (lesson) => lesson.features.flatMap((f) => f.steps.map((s) => ({ ...s, featureId: f.id })))

  function linesAt(lesson, stepId) {
    const files = {}
    for (const [name, text] of Object.entries(lesson.files)) files[name] = tagged(text, null)
    if (stepId == null) return files
    const steps = allSteps(lesson)
    const stop = steps.findIndex((s) => s.id === stepId)
    if (stop < 0) throw new Error(`No step ${stepId} in lesson ${lesson.id}`)
    for (const step of steps.slice(0, stop + 1)) files[step.file] = applyLines(files[step.file] || [], step)
    return files
  }

  const mapFiles = (files, fn) => Object.fromEntries(Object.entries(files).map(([k, v]) => [k, fn(v)]))
  const filesAt = (lesson, stepId) => mapFiles(linesAt(lesson, stepId), join)
  const origins = (lesson, stepId) => mapFiles(linesAt(lesson, stepId), (ls) => ls.map((l) => ({ stepId: l.stepId })))

  function checkpoint(lesson, featureId) {
    const f = lesson.features.find((x) => x.id === featureId)
    if (!f) throw new Error(`No feature ${featureId} in lesson ${lesson.id}`)
    return filesAt(lesson, f.steps[f.steps.length - 1].id)
  }

  // The story of one line: the note of the step that introduced it.
  function noteFor(lesson, stepId, file, lineNo) {
    const line = (linesAt(lesson, stepId)[file] || [])[lineNo - 1]
    const empty = { note: null, stepId: null, featureId: null }
    if (!line) return empty
    const steps = allSteps(lesson)
    const own = steps.find((s) => s.id === line.stepId)
    const base = { stepId: line.stepId, featureId: own ? own.featureId : null }
    if (line.text.trim() === '' || !own) return { note: null, ...base }
    const hit = (own.notes || []).find((n) => line.text.includes(n.match))
    if (hit) return { note: hit, ...base }
    // A closing tag: show the note of the element it closes (same step first, then earlier steps).
    const close = line.text.match(/^\s*<\/([a-zA-Z][\w-]*)/)
    if (close) {
      const open = '<' + close[1]
      const upto = steps.slice(0, steps.findIndex((s) => s.id === stepId) + 1)
      const order = [own, ...upto.filter((s) => s !== own).reverse()]
      for (const s of order) {
        const n = (s.notes || []).find((x) => x.match.startsWith(open))
        if (n) return { note: n, ...base }
      }
    }
    // The line was edited later (e.g. an attribute removed): use the latest earlier note that fits it.
    const upto = steps.slice(0, steps.findIndex((s) => s.id === stepId) + 1).reverse()
    for (const s of upto) {
      const n = (s.notes || []).find((x) => line.text.includes(x.match))
      if (n) return { note: n, stepId: s.id, featureId: s.featureId }
    }
    return { note: null, ...base }
  }

  // Injected into every preview: report errors, and keep link clicks and form
  // submits inside the preview (a srcdoc page would otherwise load the site itself).
  const REPORTER = '<script>window.onerror=function(m,s,l){var d={type:"livepad-error",message:String(m),line:l};' +
    'try{parent.postMessage(d,"*")}catch(e){}try{if(opener)opener.postMessage(d,"*")}catch(e){}};' +
    'document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a[href]");if(!a)return;' +
    'var h=a.getAttribute("href");e.preventDefault();if(h.charAt(0)==="#"){var t=document.getElementById(h.slice(1));if(t)t.scrollIntoView()}' +
    'else if(/^https?:/.test(h))window.open(h,"_blank","noopener")},true);' +
    'document.addEventListener("submit",function(e){e.preventDefault()},true)</script>'

  // One HTML document for an iframe srcdoc: linked CSS/JS files are inlined.
  function buildDoc(files) {
    const html = files['index.html'] || ''
    const local = (ref) => files[ref.replace(/^\.\//, '')]
    let doc = html.replace(/<link\b[^>]*>/gi, (tag) => {
      if (!/\brel\s*=\s*["']?stylesheet/i.test(tag)) return tag
      const m = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)
      const css = m && local(m[1])
      return css == null ? tag : `<style>${css}</style>`
    })
    doc = doc.replace(/<script\b([^>]*)\bsrc\s*=\s*["']([^"']+)["']([^>]*)>\s*<\/script>/gi, (tag, a, src, b) => {
      const js = local(src)
      if (js == null) return tag
      const attrs = a + b
      if (/\b(defer|type\s*=\s*["']?module)/i.test(attrs)) return `<script>document.addEventListener("DOMContentLoaded",function(){\n${js}\n})</script>`
      return `<script>${js}</script>`
    })
    return /<head[^>]*>/i.test(doc) ? doc.replace(/<head[^>]*>/i, (h) => h + REPORTER) : REPORTER + doc
  }

  return { register, get, applyStep, filesAt, checkpoint, origins, noteFor, buildDoc, StepMismatch }
})
