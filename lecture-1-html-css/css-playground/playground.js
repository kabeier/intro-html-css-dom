// CSS Playground: pick a property, cycle its values, and the rule is applied to a small demo page.
(() => {
  const P = window.CSS_PROPERTIES
  const $ = (s, el = document) => el.querySelector(s)
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const embed = new URLSearchParams(location.search).has('embed')
  document.body.classList.toggle('embed', embed)

  const NAMES = ['Pikachu', 'Bulbasaur', 'Charmander']
  const items = (extra = '') => NAMES.map((n) => `<div class="item${extra}">${n}</div>`).join('')
  const LONG = 'Pikachu stores electricity in its cheeks. When it is angry it lets it all out at once, and the lights go off for miles around. Trainers keep it away from their phones.'
  const DEMOS = {
    text: () => '<p class="t">Pikachu used Thunderbolt.<br>It was super effective!</p>',
    box: () => '<div class="t solid">Pikachu</div>',
    items: () => NAMES.map((n) => `<div class="t solid sized">${n}</div>`).join(''),
    row: () => `<div class="t flexy">${items()}</div>`,
    wide: () => `<div class="t flexy">${items(' big') + items(' big')}</div>`,
    grid: () => `<div class="t griddy">${items() + items()}</div>`,
    pos: () => '<div class="posbox"><div class="solid sized">Pikachu</div><div class="t solid sized moved">Bulbasaur</div><div class="solid sized">Charmander</div></div>',
    layers: () => '<div class="layers"><div class="blue">z-index: 1</div><div class="t solid">Pikachu</div></div>',
    scroll: () => `<div class="t scrollbox">${LONG} ${LONG}</div>`,
    hover: () => '<div class="t solid hovery">Hover over me</div>',
  }
  const apply = (root, p, value) => {
    root.innerHTML = DEMOS[p.demo]()
    root.querySelectorAll('.t').forEach((t) => {
      if (p.base) t.style.cssText = p.base
      t.style.setProperty(p.name, value)
    })
  }
  const selector = (p) => (p.on === 'parent' ? '.parent' : '.box')

  let cur = 0, val = 0, custom = null, timer = null

  const listEl = $('#props')
  const groups = [...new Set(P.map((p) => p.group))]
  listEl.innerHTML = groups.map((g) => `<h3>${esc(g)}</h3><div class="plist">${P.map((p, i) => (p.group === g ? `<button type="button" data-i="${i}">${esc(p.name)}</button>` : '')).join('')}</div>`).join('')
  const select = $('#prop-select')
  select.innerHTML = groups.map((g) => `<optgroup label="${esc(g)}">${P.map((p, i) => (p.group === g ? `<option value="${i}">${esc(p.name)}</option>` : '')).join('')}</optgroup>`).join('')
  select.onchange = () => pick(Number(select.value))

  function value() { return custom ?? P[cur].values[val][0] }
  function draw() {
    const p = P[cur]
    listEl.querySelectorAll('button').forEach((b) => { const on = Number(b.dataset.i) === cur; b.classList.toggle('on', on); if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current') })
    select.value = cur
    $('#name').textContent = p.name
    $('#what').textContent = p.what
    $('#use').textContent = p.use
    $('#on').hidden = p.on !== 'parent'
    $('#values').innerHTML = p.values.map(([v], k) => `<button type="button" data-k="${k}" class="${custom === null && k === val ? 'on' : ''}">${esc(v)}</button>`).join('')
    const v = value()
    const ok = CSS.supports(p.name, v)
    $('#typed').classList.toggle('bad', !ok)
    $('#rule').textContent = `${selector(p)} {\n  ${p.name}: ${v};\n}`
    apply($('#stage'), p, ok ? v : 'initial')
    $('#caption').textContent = !ok ? `The browser does not understand "${v}", so it ignores this line and shows no change. Check the spelling.`
      : custom !== null ? 'Your own value: the browser understands it.' : p.values[val][1]
    $('#caption').classList.toggle('bad', !ok)
    $('#tip').textContent = p.tip ? 'Watch out: ' + p.tip : ''
    $('#tip').hidden = !p.tip
    $('#step').textContent = custom !== null ? 'Your value' : `Value ${val + 1} of ${p.values.length}`
  }
  function pick(i) { cur = (i + P.length) % P.length; val = 0; custom = null; $('#typed').value = ''; draw() }
  function step(d) { const n = P[cur].values.length; val = custom !== null ? 0 : (val + d + n) % n; custom = null; $('#typed').value = ''; draw() }
  function play(on) {
    clearInterval(timer); timer = null
    $('#play').textContent = on ? 'Stop' : 'Play the values'
    $('#play').classList.toggle('on', on)
    if (on) timer = setInterval(() => step(1), 1500)
  }

  listEl.onclick = (e) => { const b = e.target.closest('button'); if (b) { play(false); pick(Number(b.dataset.i)) } }
  $('#values').onclick = (e) => { const b = e.target.closest('button'); if (b) { play(false); val = Number(b.dataset.k); custom = null; $('#typed').value = ''; draw() } }
  $('#next').onclick = () => { play(false); step(1) }
  $('#prev').onclick = () => { play(false); step(-1) }
  $('#play').onclick = () => play(!timer)
  $('#typed').oninput = (e) => { play(false); custom = e.target.value.trim() || null; draw() }
  $('#copy').onclick = async (e) => { try { await navigator.clipboard.writeText($('#rule').textContent); e.target.textContent = 'Copied' } catch { e.target.textContent = 'Select and copy' } setTimeout(() => (e.target.textContent = 'Copy'), 1500) }
  addEventListener('keydown', (e) => {
    if (e.target.closest('input, select, textarea')) return
    if (e.key === 'ArrowRight') { e.preventDefault(); play(false); step(1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); play(false); step(-1) }
    else if (e.key === 'ArrowDown') { e.preventDefault(); play(false); pick(cur + 1) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); play(false); pick(cur - 1) }
  })

  // The whole list, each with one example that is really rendered.
  const all = $('#all')
  if (all) {
    all.innerHTML = groups.map((g) => `<h3>${esc(g)}</h3><div class="cards">${P.map((p, i) => {
      if (p.group !== g) return ''
      const v = p.values[p.ex ?? Math.min(1, p.values.length - 1)][0]
      return `<article class="ref"><h4><code>${esc(p.name)}</code></h4><p>${esc(p.what)}</p><pre>${esc(selector(p))} {\n  ${esc(p.name)}: ${esc(v)};\n}</pre><div class="mini" data-i="${i}" data-v="${esc(v)}"></div><button type="button" class="try" data-i="${i}">Try it</button></article>`
    }).join('')}</div>`).join('')
    all.querySelectorAll('.mini').forEach((m) => { const p = P[Number(m.dataset.i)]; apply(m, p, m.dataset.v) })
    all.onclick = (e) => { const b = e.target.closest('.try'); if (b) { pick(Number(b.dataset.i)); $('#play-area').scrollIntoView({ behavior: 'smooth', block: 'start' }) } }
  }

  const start = P.findIndex((p) => p.name === new URLSearchParams(location.search).get('p'))
  pick(start >= 0 ? start : 0)
  window.Playground = { pick, step, count: P.length }
})()
