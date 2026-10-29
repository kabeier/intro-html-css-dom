// Fix it problems for lecture 1 (HTML & CSS). Each one breaks the finished
// page (checkpoint `base`) with `breaks` steps; `solve` steps (optional) turn
// the checkpoint into the expected answer. Checks look at the running page,
// not the text, so any correct fix passes.
;(function (root) {
  const RED = 'rgb(198, 40, 40)'
  const style = (win, el) => win.getComputedStyle(el)
  const problems = [
    {
      id: 'css', title: 'The CSS does nothing', base: 'f7',
      symptom: 'No colours, no white cards, no yellow borders. styles.css looks fine.',
      breaks: [{ file: 'index.html', mode: 'replace', find: '<link rel="stylesheet" href="styles.css">', code: '<link href="styles.css">' }],
      checks: [
        { name: 'the title is red', run: (doc, win) => style(win, doc.querySelector('h1')).color === RED },
        { name: 'the cards are white', run: (doc, win) => style(win, doc.querySelector('.card')).backgroundColor === 'rgb(255, 255, 255)' },
      ],
      hint: 'Look at the <link> in the <head>. What tells the browser this file is a stylesheet?',
      why: 'A <link> needs rel="stylesheet". Without it the browser does not apply the file as CSS.',
    },
    {
      id: 'img', title: 'Pikachu is missing', base: 'f7',
      symptom: 'A broken-image icon where Pikachu should be, and a screen reader says nothing useful about it.',
      breaks: [{ file: 'index.html', mode: 'replace', find: '<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" alt="Pikachu waving">', code: '<img src="pokemon/25.png">' }],
      checks: [
        { name: 'the image loads', run: (doc) => { const i = doc.querySelector('#about img'); return !!i && i.complete && i.naturalWidth > 0 } },
        { name: 'the image has alt text', run: (doc) => { const i = doc.querySelector('#about img'); return !!i && i.alt.trim().length > 0 } },
      ],
      hint: 'Two things: where does src point (is there a pokemon folder next to the page?), and what does a screen reader read?',
      why: 'src must point at a real file or URL: the image lives on raw.githubusercontent.com, not in a local folder. alt describes the image for people who cannot see it.',
    },
    {
      id: 'list', title: 'The team has no numbers', base: 'f7',
      symptom: 'Pikachu, Bulbasaur and Charmander show with no numbers or bullets.',
      breaks: [
        { file: 'index.html', mode: 'replace', find: '      <ol>\n', code: '' },
        { file: 'index.html', mode: 'replace', find: '      </ol>\n', code: '' },
      ],
      checks: [
        { name: 'three list items', run: (doc) => doc.querySelectorAll('#team li').length === 3 },
        { name: 'every <li> is inside a list', run: (doc) => [...doc.querySelectorAll('li')].every((li) => /^(OL|UL)$/.test(li.parentElement.tagName)) },
      ],
      hint: '<li> means "list item". Which tag makes the list?',
      why: '<li> is only allowed inside <ul> or <ol>. The list tag is what draws the numbers or bullets.',
    },
    {
      id: 'unclosed', title: 'The About text is huge', base: 'f7',
      symptom: 'The sentence under Pikachu is big and bold, like a heading.',
      breaks: [{ file: 'index.html', mode: 'replace', find: '<h2>About me</h2>', code: '<h2>About me' }],
      checks: [
        { name: 'the paragraph is not inside the heading', run: (doc) => { const p = doc.querySelector('#about p'); return !!p && !p.closest('h2') } },
        { name: 'the heading says "About me"', run: (doc) => { const h = doc.querySelector('#about h2'); return !!h && h.textContent.trim() === 'About me' } },
      ],
      hint: 'Find the <h2> in the About section. Where does it end?',
      why: 'Without </h2> the heading swallows everything after it, so the paragraph is styled as part of the heading.',
    },
    {
      id: 'label', title: 'Clicking "Your name" does nothing', base: 'f7',
      symptom: 'Click the words "Your name": the cursor should jump into the box, but it does not.',
      breaks: [{ file: 'index.html', mode: 'replace', find: '<label for="trainer">', code: '<label for="name">' }],
      checks: [
        { name: 'every label is linked to an input', run: (doc) => [...doc.querySelectorAll('label')].every((l) => l.control) },
        { name: 'there are 3 labels', run: (doc) => doc.querySelectorAll('label').length === 3 },
      ],
      hint: 'Compare the label\'s for="…" with the input\'s id="…". They must be the same word.',
      why: 'A label is linked to the input whose id equals its for. Then clicking the label focuses the input, and screen readers read the label.',
    },
    {
      id: 'dot', title: 'The cards lost their boxes', base: 'f7',
      symptom: 'No white background and no yellow border on About, My team or Battle request.',
      breaks: [{ file: 'styles.css', mode: 'replace', find: '.card {', code: 'card {' }],
      checks: [
        { name: 'the cards are white', run: (doc, win) => [...doc.querySelectorAll('.card')].every((c) => style(win, c).backgroundColor === 'rgb(255, 255, 255)') },
        { name: 'the cards have a 2px border', run: (doc, win) => [...doc.querySelectorAll('.card')].every((c) => style(win, c).borderTopWidth === '2px') },
      ],
      hint: 'In CSS, how do you write "every element with class card"?',
      why: 'A class selector starts with a dot: .card. Without the dot, "card" looks for a <card> tag, which does not exist.',
    },
    {
      id: 'dupid', title: 'Bonus: "Team" jumps to About', base: 'f7',
      symptom: 'Click Team in the menu: the page jumps to About me instead of My team.',
      breaks: [{ file: 'index.html', mode: 'replace', find: '<section id="team"', code: '<section id="about"' }],
      checks: [
        { name: 'no id is used twice', run: (doc) => { const ids = [...doc.querySelectorAll('[id]')].map((e) => e.id); return new Set(ids).size === ids.length } },
        { name: 'every menu link has a target', run: (doc) => [...doc.querySelectorAll('nav a')].every((a) => doc.getElementById(a.getAttribute('href').slice(1))) },
      ],
      hint: 'Search the HTML for id="about". How many do you find?',
      why: 'An id must be unique. With two id="about", the browser jumps to the first one, and nothing has id="team".',
    },
    {
      id: 'specific', title: 'Bonus: the title will not turn green', base: 'f7',
      symptom: 'We added h1 { color: green; } at the end of styles.css. The title stays red.',
      breaks: [{ file: 'styles.css', mode: 'append', code: 'h1 {\n  color: green;\n}' }],
      solve: [{ file: 'styles.css', mode: 'replace', find: '  color: #c62828;', code: '  color: green;' }],
      checks: [{ name: 'the title is green', run: (doc, win) => style(win, doc.querySelector('h1')).color === 'rgb(0, 128, 0)' }],
      hint: 'Two rules set the title colour. Which selector is stronger: h1 or #page-title?',
      why: 'ID beats element, wherever the rules are in the file. Change the colour in the #page-title rule (or remove that rule).',
    },
    {
      id: 'boxsize', title: 'Bonus: 300px cards are 336px wide', base: 'f7',
      symptom: 'We set .card { width: 300px; } but DevTools says each card is 336px wide.',
      breaks: [
        { file: 'styles.css', mode: 'replace', find: '* {\n  box-sizing: border-box;\n}\n\n', code: '' },
        { file: 'styles.css', mode: 'insertAfter', find: '  padding: 16px;', code: '  width: 300px;' },
      ],
      solve: [{ file: 'styles.css', mode: 'insertAfter', find: '  padding: 16px;', code: '  width: 300px;' }],
      checks: [{ name: 'each card is 300px wide', run: (doc) => [...doc.querySelectorAll('.card')].every((c) => Math.round(c.getBoundingClientRect().width) === 300) }],
      hint: '300 + 16 + 16 (padding) + 2 + 2 (border) = 336. Which property makes width include padding and border?',
      why: 'By default width is the content only. box-sizing: border-box makes width include padding and border.',
    },
    {
      id: 'viewport', title: 'Bonus: the menu never stacks on a phone', base: 'f7',
      symptom: 'On a narrow desktop window the links stack. On a real phone they never do.',
      breaks: [{ file: 'index.html', mode: 'replace', find: '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n', code: '' }],
      checks: [{ name: 'the page has a viewport meta tag', run: (doc) => { const m = doc.querySelector('meta[name="viewport"]'); return !!m && /width\s*=\s*device-width/.test(m.content) } }],
      hint: 'Phones pretend to be about 980px wide unless the page tells them not to. Where does the page talk to the browser?',
      why: 'Without <meta name="viewport" content="width=device-width, initial-scale=1.0"> a phone lays the page out at desktop width, so max-width: 600px never matches.',
    },
  ]
  root.FIXIT = root.FIXIT || {}
  root.FIXIT['html-css'] = problems
})(typeof self !== 'undefined' ? self : globalThis)
