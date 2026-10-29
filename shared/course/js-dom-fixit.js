// Fix it problems for lecture 2 (JavaScript DOM). Checks can be async and get
// ctx = { wait(ms), doc() }: doc() is the page now (after a reload it is a new one).
;(function (root) {
  const text = (doc, sel) => { const e = doc.querySelector(sel); return e ? e.textContent : null }
  const addPokemon = async (doc, ctx, name) => {
    const box = doc.querySelector('#new-pokemon'), btn = doc.querySelector('#add-pokemon')
    if (!box || !btn) return []
    box.value = name
    btn.click()
    await ctx.wait(50)
    return [...ctx.doc().querySelectorAll('#team li')].map((li) => li.textContent)
  }
  const submit = async (doc, ctx) => {
    doc.querySelector('#trainer').value = 'Sam'
    doc.querySelector('#favorite').value = 'Water'
    doc.querySelector('form').requestSubmit()
    await ctx.wait(700)
    return text(ctx.doc(), '#output') || ''
  }
  const problems = [
    {
      id: 'defer', title: 'Nothing on the page reacts', base: 'f6',
      symptom: 'No "3 sections" line, the title never changes, Add does nothing. The console says: Cannot set properties of null.',
      breaks: [{ file: 'index.html', mode: 'replace', find: '<script src="script.js" defer></script>', code: '<script src="script.js"></script>' }],
      checks: [{ name: 'the script finds the page (3 sections counted)', run: (doc) => text(doc, '#card-count') === '3 sections on this page' }],
      hint: 'The <script> is in the <head>. When it runs, does the <body> exist yet?',
      why: 'A script in the <head> runs before the body is parsed, so getElementById returns null. Add defer (or move the script to the end of <body>).',
    },
    {
      id: 'idtypo', title: 'The title stays the same', base: 'f6',
      symptom: 'The heading still says "Trainer Profile", and nothing else works either. The console says: Cannot set properties of null (setting \'textContent\').',
      breaks: [{ file: 'script.js', mode: 'replace', find: 'getElementById("page-title")', code: 'getElementById("page-titel")' }],
      checks: [{ name: 'the title changes', run: (doc) => text(doc, '#page-title') === 'Trainer Profile (with JavaScript)' }],
      hint: 'Compare the id in the HTML with the string in getElementById, letter by letter.',
      why: 'getElementById returns null when no element has that id. The next line then crashes, and the rest of the script never runs.',
    },
    {
      id: 'dot', title: '"0 sections on this page"', base: 'f6',
      symptom: 'The count under the menu says 0 sections, but there are three cards.',
      breaks: [{ file: 'script.js', mode: 'replace', find: 'querySelectorAll(".card")', code: 'querySelectorAll("card")' }],
      checks: [{ name: '3 sections counted', run: (doc) => text(doc, '#card-count') === '3 sections on this page' }],
      hint: 'querySelectorAll takes a CSS selector. How do you write a class in CSS?',
      why: 'A class selector needs the dot: ".card". "card" looks for <card> tags and finds none.',
    },
    {
      id: 'prevent', title: 'The battle request flashes and vanishes', base: 'f6',
      symptom: 'Press Send: the text appears for a moment, then the page reloads and the form is empty again.',
      breaks: [{ file: 'script.js', mode: 'replace', find: '  evt.preventDefault()\n', code: '' }],
      checks: [{ name: 'the request stays on the page after Send', run: async (doc, win, ctx) => (await submit(doc, ctx)).includes('Sam') }],
      hint: 'A form submit has a default action. Which method on the event stops it?',
      why: 'Submitting a form reloads the page by default. evt.preventDefault() in the submit listener stops the reload, so the result stays.',
    },
    {
      id: 'innerhtml', title: 'A name turns into bold text', base: 'f6',
      symptom: 'Add <b>Mew</b> as a Pokémon: the list shows a bold Mew instead of exactly what you typed.',
      breaks: [{ file: 'script.js', mode: 'replace', find: 'item.textContent = newPokemon.value', code: 'item.innerHTML = newPokemon.value' }],
      checks: [{ name: 'what you type shows exactly as typed', run: async (doc, win, ctx) => (await addPokemon(doc, ctx, '<b>Mew</b>')).includes('<b>Mew</b>') }],
      hint: 'Two properties put text in an element. Which one treats the text as HTML?',
      why: 'innerHTML parses the text as HTML, so a user can inject tags (even scripts). textContent always shows plain text.',
    },
    {
      id: 'append', title: 'Add empties the box, but no Pokémon appears', base: 'f6',
      symptom: 'Type Eevee, click Add: the box clears, the list does not grow.',
      breaks: [{ file: 'script.js', mode: 'replace', find: '  teamList.appendChild(item)\n', code: '' }],
      checks: [{ name: 'Eevee is added to the list', run: async (doc, win, ctx) => (await addPokemon(doc, ctx, 'Eevee')).includes('Eevee') }],
      hint: 'createElement makes the <li>. What puts it on the page?',
      why: 'A created element lives only in memory until you attach it: teamList.appendChild(item).',
    },
    {
      id: 'onclick', title: 'Bonus: the Add button does nothing', base: 'f6',
      symptom: 'Click Add: nothing happens. No error in the console either.',
      breaks: [{ file: 'script.js', mode: 'replace', find: 'addEventListener("click", addPokemon)', code: 'addEventListener("onclick", addPokemon)' }],
      checks: [{ name: 'Eevee is added on click', run: async (doc, win, ctx) => (await addPokemon(doc, ctx, 'Eevee')).includes('Eevee') }],
      hint: 'What is the event called: "onclick" or "click"?',
      why: 'addEventListener takes the event name without "on": "click". The "on" belongs to the old onclick attribute.',
    },
    {
      id: 'called', title: 'Bonus: Add still does nothing', base: 'f6',
      symptom: 'Click Add: nothing. This time the event name is right.',
      breaks: [{ file: 'script.js', mode: 'replace', find: 'addEventListener("click", addPokemon)', code: 'addEventListener("click", addPokemon())' }],
      checks: [{ name: 'Eevee is added on click', run: async (doc, win, ctx) => (await addPokemon(doc, ctx, 'Eevee')).includes('Eevee') }],
      hint: 'Look at what is handed to addEventListener. Is it the function, or the result of calling it?',
      why: 'addPokemon() runs once right away and hands over its result (undefined). Pass the function itself: addPokemon.',
    },
    {
      id: 'bubble', title: 'Bonus: removing a Pokémon outlines the card', base: 'f6',
      symptom: 'Click a Pokémon to remove it: it goes, but the My team card also gets (or loses) its blue outline.',
      breaks: [{ file: 'script.js', mode: 'replace', find: '    evt.stopPropagation()\n', code: '' }],
      checks: [{ name: 'removing an item does not toggle the card', run: async (doc, win, ctx) => {
        const card = doc.querySelector('#team'), li = doc.querySelector('#team li')
        if (!card || !li) return false
        const before = card.classList.contains('picked')
        li.click()
        await ctx.wait(30)
        return !li.isConnected && card.classList.contains('picked') === before
      } }],
      hint: 'The click starts on the <li> and travels up through its parents. Which method stops it?',
      why: 'Events bubble up to every parent. evt.stopPropagation() in the list handler keeps the click from reaching #team.',
    },
    {
      id: 'formname', title: 'Bonus: "Battle request from undefined"', base: 'f6',
      symptom: 'Type Sam, press Send: it says "Battle request from undefined (Water)".',
      breaks: [{ file: 'script.js', mode: 'replace', find: 'formProps.trainer', code: 'formProps.name' }],
      checks: [{ name: 'the request shows the typed name', run: async (doc, win, ctx) => (await submit(doc, ctx)).includes('Sam') }],
      hint: 'FormData uses each input\'s name="…". What is the name of the "Your name" input?',
      why: 'The keys of formProps are the inputs\' name attributes. The input is name="trainer", so it is formProps.trainer.',
    },
  ]
  root.FIXIT = root.FIXIT || {}
  root.FIXIT['js-dom'] = problems
})(typeof self !== 'undefined' ? self : globalThis)
