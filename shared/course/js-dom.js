// Lecture 2 · JavaScript DOM: the Trainer profile page from lecture 1 moves into css/ and js/ folders and gets js/script.js.
// Follows the curriculum page phase-II/04-Front-End/1-vanilla-development/2-js-dom.md
// Needs html-css.js loaded first (it starts from lecture 1's finished page).
Course.register({
  id: 'js-dom',
  title: 'JavaScript DOM: Trainer profile',
  base: { lesson: 'html-css', feature: 'f7' },
  files: Course.checkpoint(Course.get('html-css'), 'f7'),
  features: [
    // ---------------------------------------------------------------- f1
    {
      id: 'f1', title: 'Folders, then connect a script',
      why: 'A real project keeps each kind of file in its own folder: css/ for styles, js/ for scripts. Then the browser runs JavaScript from a <script> tag; with defer it waits until the whole page exists, so the script can find every element.',
      steps: [
        {
          id: 'f1s1', file: 'styles.css', mode: 'move', to: 'css/styles.css',
          say: 'Make a css folder and drag styles.css into it. Look at the page: the styles are gone.',
          point: 'The file tree: styles.css now sits inside css/. The page is plain black on white, because the link still says href="styles.css" and there is no file there any more. Nothing is broken in the CSS; only the path is wrong.',
        },
        {
          id: 'f1s2', file: 'index.html', mode: 'replace', find: 'href="styles.css"',
          code: 'href="css/styles.css"',
          say: 'Fix the path: css/styles.css means "the css folder, then the file inside it". The styles come back.',
          point: 'The link line now reads href="css/styles.css" and the page has its colours back. A path is a route from index.html: folder name, slash, file name.',
          notes: [
            { match: 'href="css/styles.css"', what: 'A relative path: the css folder next to index.html, then styles.css inside it.', why: 'Folders keep a project tidy; every link and src must say which folder the file is in.',
              api: { name: 'relative path', does: 'Finds a file starting from the folder index.html is in.', params: [['css/styles.css', 'folder / file', 'a folder name, a slash, then the file name; ../ goes up one folder']], mistakes: ['Moving a file and forgetting the link: the page silently loses its styles (no error on the page, a 404 in DevTools → Network).', 'Starting with a slash, "/css/styles.css": that means the top of the website, which breaks on GitHub Pages.'] } },
          ],
        },
        {
          id: 'f1s3', file: 'index.html', mode: 'insertAfter', find: '  <link rel="stylesheet" href="css/styles.css">',
          code: '  <script src="js/script.js" defer></script>',
          say: 'Make a js folder with script.js inside. One line links it, like the CSS link. defer = run it after the HTML is read.',
          notes: [
            { match: '<script src', what: 'Loads and runs a JavaScript file.', why: 'Keeps behaviour (JS) apart from structure (HTML), like we did with CSS.',
              api: { name: '<script>', does: 'Runs JavaScript in the page.', params: [['src', 'the file to run', 'a path from the HTML: "js/script.js"'], ['defer', 'wait until the HTML is parsed (no value needed)', 'use it for scripts in the <head>: then document.querySelector can find everything']], mistakes: ['A script in the <head> without defer runs before the body exists: querySelector returns null and the next line crashes.', 'Writing <script src="js/script.js" /> : a <script> always needs </script>.'] } },
          ],
        },
        {
          id: 'f1s4', file: 'js/script.js', mode: 'append',
          code: 'console.log("script.js is running")',
          say: 'First line of JavaScript in the browser. Look at the Console panel under the page.',
          notes: [
            { match: 'console.log', what: 'Prints to the browser console (DevTools → Console).', why: 'Your first debugging tool: is the script running, what is in this variable?',
              api: { name: 'console.log(...values)', does: 'Prints values to the console.', params: [['values', 'anything, separated by commas', 'a label string first helps: console.log("cards", cards)']], returns: 'nothing (undefined)', mistakes: ['Looking for the output in the terminal: browser JavaScript prints in DevTools, not in VS Code.'] } },
          ],
        },
        {
          id: 'f1s5', file: 'js/script.js', mode: 'append',
          code: 'const title = document.getElementById("page-title")\ntitle.textContent = "Trainer Profile (with JavaScript)"',
          say: 'document = the whole page as an object. Find the h1 by its id, change its text. The page changes, no reload.',
          notes: [
            { match: 'getElementById', what: 'Finds the one element with this id.', why: 'Fastest, simplest way to grab a single element you gave an id.',
              api: { name: 'document.getElementById(id)', does: 'Looks up one element by id.', params: [['id', 'the id, as a string, without #', 'the same word as id="…" in the HTML: "page-title"']], returns: 'the element, or null if no element has that id', mistakes: ['Writing "#page-title": the # is only for CSS selectors (querySelector).', 'A typo gives null, and title.textContent then crashes: "Cannot set properties of null".'] } },
            { match: 'textContent', what: 'The text inside an element.', why: 'Read it or set it. Setting it replaces the text, and anything typed by a user stays plain text (safe).',
              api: { name: 'element.textContent', does: 'Gets or sets the text inside an element.', params: [['= "new text"', 'what to show', 'any string; numbers are turned into text']], returns: 'a string when you read it', mistakes: ['Using innerHTML for text a user typed: innerHTML runs it as HTML (a security hole). textContent is the safe choice.'] } },
          ],
        },
      ],
    },
    // ---------------------------------------------------------------- f2
    {
      id: 'f2', title: 'Select many elements',
      why: 'querySelector uses CSS selectors, so everything from lecture 1 (tag, .class, #id) works for finding elements too.',
      steps: [
        {
          id: 'f2s1', file: 'index.html', mode: 'insertAfter', find: '    </nav>',
          code: '    <p id="card-count"></p>',
          say: 'An empty paragraph: JavaScript will fill it in.',
          notes: [{ match: 'id="card-count"', what: 'An empty paragraph with an id, a place for JavaScript to write into.', why: 'HTML gives the spot; JavaScript fills in the text.' }],
        },
        {
          id: 'f2s2', file: 'js/script.js', mode: 'append',
          code: 'const cards = document.querySelectorAll(".card")\nconsole.log(cards)',
          say: 'querySelectorAll takes a CSS selector. Look at the console: a NodeList of 3 sections.',
          notes: [
            { match: 'querySelectorAll', what: 'Finds every element that matches a CSS selector.', why: 'One line to grab a whole group, e.g. every card.',
              api: { name: 'document.querySelectorAll(selector)', does: 'Finds all matches.', params: [['selector', 'a CSS selector, as a string', '".card" for a class, "li" for a tag, "#team li" for li inside #team: exactly what you would write in CSS']], returns: 'a NodeList (list-like: .length, forEach); empty if nothing matches, never null', mistakes: ['Forgetting the dot: "card" looks for <card> tags and finds nothing.'] } },
          ],
        },
        {
          id: 'f2s3', file: 'js/script.js', mode: 'append',
          code: 'const countText = document.querySelector("#card-count")\ncountText.textContent = cards.length + " sections on this page"',
          say: 'querySelector (no All) gives the first match. #card-count = the id, CSS style.',
          notes: [
            { match: 'querySelector(', what: 'Finds the first element that matches a CSS selector.', why: 'One tool for every kind of selector; most code uses it instead of getElementById.',
              api: { name: 'document.querySelector(selector)', does: 'Finds the first match.', params: [['selector', 'a CSS selector string', '"#card-count" (id needs #), ".card", "form"']], returns: 'one element, or null', mistakes: ['Forgetting the # for an id: "card-count" looks for a <card-count> tag.'] } },
            { match: 'cards.length', what: 'How many elements the NodeList holds.', why: 'Lists know their size: here 3 sections.' },
          ],
        },
      ],
    },
    // ---------------------------------------------------------------- f3
    {
      id: 'f3', title: 'Create elements on a click',
      why: 'createElement makes a new element in memory; it only appears once you attach it to the page with appendChild. addEventListener runs our function when the user clicks.',
      steps: [
        {
          id: 'f3s1', file: 'index.html', mode: 'insertAfter', find: '      </ol>',
          code: '      <label for="new-pokemon">New Pokémon</label>\n      <input type="text" id="new-pokemon" name="new-pokemon">\n      <button id="add-pokemon" type="button">Add to team</button>',
          say: 'A label, an input, a button. type="button": it does nothing until JavaScript says so.',
          notes: [
            { match: 'id="new-pokemon"', what: 'The text box for a new team member.', why: 'JavaScript reads what the user typed from its value.' },
            { match: 'id="add-pokemon"', what: 'The button we listen to.', why: 'type="button" means it does not submit anything; our click listener decides what happens.' },
          ],
        },
        {
          id: 'f3s2', file: 'js/script.js', mode: 'append',
          code: 'const teamList = document.querySelector("#team ol")\nconst newPokemon = document.querySelector("#new-pokemon")\nconst addButton = document.querySelector("#add-pokemon")',
          say: 'Grab the three elements we need, once, at the top. "#team ol" = the ol inside #team.',
          notes: [{ match: '"#team ol"', what: 'A descendant selector: the <ol> inside the element with id="team".', why: 'Same selectors as CSS: narrow it down by nesting.' }],
        },
        {
          id: 'f3s3', file: 'js/script.js', mode: 'append',
          code: 'const addPokemon = () => {\n  const item = document.createElement("li")\n  item.textContent = newPokemon.value\n  teamList.appendChild(item)\n}',
          say: 'Make an li, give it the typed text, attach it to the list. Nothing runs yet: it is only a function.',
          notes: [
            { match: 'createElement', what: 'Makes a brand-new element.', why: 'The page can grow without writing more HTML.',
              api: { name: 'document.createElement(tagName)', does: 'Creates an element that is not on the page yet.', params: [['tagName', 'the tag, as a string, no < >', '"li", "div", "p"']], returns: 'the new element', mistakes: ['Expecting it to show up: it only appears after appendChild (or append).'] } },
            { match: '.value', what: 'What is in an input right now.', why: 'Inputs keep the typed text in .value (not textContent).',
              api: { name: 'input.value', does: 'Gets or sets the text in an input.', params: [['= ""', 'set it to clear the box', 'empty string clears it']], returns: 'always a string, even for numbers' } },
            { match: 'appendChild', what: 'Attaches an element as the last child of another.', why: 'This is the moment the new li appears on the page.',
              api: { name: 'parent.appendChild(child)', does: 'Adds child at the end of parent.', params: [['child', 'the element to attach', 'one you made with createElement (or an existing one, which then moves)']], returns: 'the child' } },
          ],
        },
        {
          id: 'f3s4', file: 'js/script.js', mode: 'append',
          code: 'addButton.addEventListener("click", addPokemon)',
          say: 'Now connect it: on click, run addPokemon. No () after addPokemon: we hand over the function, we do not call it.',
          notes: [
            { match: 'addEventListener', what: 'Runs a function every time an event happens on an element.', why: 'This is how a page reacts to the user: clicks, typing, submits.',
              api: { name: 'element.addEventListener(type, handler)', does: 'Registers handler for that event.', params: [['type', 'the event name, as a string, no "on"', '"click", "submit", "input", "keydown", "mousemove"'], ['handler', 'the function to run', 'the function itself (addPokemon), not a call (addPokemon()); the browser passes it an event object']], returns: 'nothing', mistakes: ['addPokemon() with brackets: it runs once immediately, and the click does nothing.', '"onclick" as the type: the event is "click".'] } },
          ],
        },
        {
          id: 'f3s5', file: 'js/script.js', mode: 'insertAfter', find: 'const addPokemon = () => {',
          code: '  if (newPokemon.value.trim() === "") return',
          say: 'Click Add with an empty box: an empty li. One line guards it: no name, stop here.',
          notes: [
            { match: '.trim()', what: 'Removes spaces from both ends of a string.', why: 'So "   " counts as empty too.',
              api: { name: 'string.trim()', does: 'Returns the string without leading/trailing spaces.', params: [['(none)', '', '']], returns: 'a new string' } },
          ],
        },
        {
          id: 'f3s6', file: 'js/script.js', mode: 'insertAfter', find: '  teamList.appendChild(item)',
          code: '  newPokemon.value = ""',
          say: 'Clear the box after adding, so the next name starts fresh.',
        },
      ],
    },
    // ---------------------------------------------------------------- f4
    {
      id: 'f4', title: 'The event object',
      why: 'Every listener gets an event object: where the mouse is, which key, which element. target is where it happened; currentTarget is the element we listened on.',
      steps: [
        {
          id: 'f4s1', file: 'js/script.js', mode: 'append',
          code: 'const about = document.querySelector("#about")\nabout.addEventListener("mousemove", (evt) => {\n  console.log(evt.target.tagName)\n})',
          say: 'Move the mouse over About. The console shows SECTION, H2, P, IMG: target is whatever is under the mouse.',
          notes: [
            { match: '(evt) =>', what: 'The handler receives the event object; we call it evt.', why: 'It holds the details of what just happened.' },
            { match: 'evt.target', what: 'The element where the event actually happened.', why: 'With children inside, that is often a child, not the element you listened on.' },
          ],
        },
        {
          id: 'f4s2', file: 'js/script.js', mode: 'replace', find: '  console.log(evt.target.tagName)',
          code: '  const box = about.getBoundingClientRect()\n  const xRatio = 1 - (evt.clientX - box.left) / box.width\n  const value = Math.round(255 * xRatio)\n  evt.currentTarget.style.backgroundColor = `rgb(255, ${value}, ${value})`',
          say: 'Mouse left = red, right = white. currentTarget = the section we listened on, so the whole card changes, not just the child under the mouse.',
          notes: [
            { match: 'getBoundingClientRect', what: 'Where an element is on the screen and how big it is.', why: 'To turn the mouse position into "how far across the card".',
              api: { name: 'element.getBoundingClientRect()', does: 'Measures the element.', params: [['(none)', '', '']], returns: 'an object with left, top, width, height (in pixels)' } },
            { match: 'evt.clientX', what: 'The mouse x position in the window, in pixels.', why: 'Minus the card\'s left edge = how far into the card the mouse is.' },
            { match: 'Math.round', what: 'Rounds to the nearest whole number.', why: 'rgb() wants whole numbers 0–255.' },
            { match: 'currentTarget', what: 'The element the listener is attached to.', why: 'Always the section here, whichever child the mouse is over (that is evt.target).' },
            { match: 'style.backgroundColor', what: 'Sets an inline style from JavaScript.', why: 'CSS property names become camelCase in JS: background-color → backgroundColor.',
              api: { name: 'element.style.<property>', does: 'Sets one inline CSS property.', params: [['= "value"', 'any CSS value as a string', 'the same value you would write in CSS: "rgb(255, 0, 0)", "none"']], mistakes: ['Writing style.background-color: JS reads that as a minus sign. Use camelCase.'] } },
          ],
        },
      ],
    },
    // ---------------------------------------------------------------- f5
    {
      id: 'f5', title: 'Handle the form',
      why: 'A form submit reloads the page by default. preventDefault() stops that, so JavaScript can read the form and update the page instead.',
      steps: [
        {
          id: 'f5s1', file: 'index.html', mode: 'insertAfter', find: '      </form>',
          code: '      <p id="output"></p>',
          say: 'A place for the answer.',
          notes: [{ match: 'id="output"', what: 'An empty paragraph for the result.', why: 'JavaScript writes the battle request here.' }],
        },
        {
          id: 'f5s2', file: 'js/script.js', mode: 'append',
          code: 'const form = document.querySelector("form")\nconst output = document.querySelector("#output")',
          say: 'Grab the form and the output paragraph.',
          notes: [{ match: 'querySelector("form")', what: 'A tag selector: the first <form> on the page.', why: 'There is only one form, so the tag name is enough.' }],
        },
        {
          id: 'f5s3', file: 'js/script.js', mode: 'append',
          code: 'form.addEventListener("submit", (evt) => {\n  const formProps = Object.fromEntries(new FormData(evt.target))\n  output.textContent = "Battle request from " + formProps.trainer + " (" + formProps.favorite + ")"\n})',
          say: 'Listen for submit (on the form, not the button). Type a name, press Send: the text flashes and the page reloads. Everything is gone.',
          notes: [
            { match: 'FormData', what: 'Reads every named field of a form.', why: 'No need to grab each input: the name="…" attributes become the keys.',
              api: { name: 'new FormData(form)', does: 'Collects name → value for every field with a name.', params: [['form', 'the <form> element', 'evt.target inside a submit listener']], returns: 'a FormData object (turn it into a plain object with Object.fromEntries)', mistakes: ['An input without name="…" is skipped.'] } },
            { match: 'Object.fromEntries', what: 'Turns key/value pairs into a plain object.', why: 'So we can write formProps.trainer.',
              api: { name: 'Object.fromEntries(pairs)', does: 'Makes an object from [key, value] pairs.', params: [['pairs', 'a FormData, Map or array of pairs', 'new FormData(form) works directly']], returns: '{ trainer: "Sam", favorite: "Water", message: "" }' } },
            { match: '"submit"', what: 'The submit event fires on the form when it is sent (button or Enter).', why: 'Listening on the form catches both the button and the Enter key.' },
          ],
        },
        {
          id: 'f5s4', file: 'js/script.js', mode: 'insertAfter', find: 'form.addEventListener("submit", (evt) => {',
          code: '  evt.preventDefault()',
          say: 'One line: stop the browser\'s default (the reload). Now the text stays.',
          notes: [
            { match: 'preventDefault', what: 'Stops the browser\'s built-in reaction to an event.', why: 'For a form: no reload, so our JavaScript result stays on the page. Every React form does this too.',
              api: { name: 'evt.preventDefault()', does: 'Cancels the default action.', params: [['(none)', '', '']], returns: 'nothing', mistakes: ['Calling it at the end of a handler that crashes earlier: the reload still happens. Put it first.', 'Confusing it with stopPropagation (that stops bubbling, not the default).'] } },
          ],
        },
      ],
    },
    // ---------------------------------------------------------------- f6
    {
      id: 'f6', title: 'Bubbling and stopPropagation',
      why: 'An event starts at the element you clicked and then bubbles up through every parent. stopPropagation() stops it from going further up.',
      steps: [
        {
          id: 'f6s1', file: 'css/styles.css', mode: 'append',
          code: '.picked {\n  outline: 4px solid #2a75bb;\n}',
          say: 'A class we will switch on and off from JavaScript.',
          notes: [
            { match: '.picked {', what: 'A class only JavaScript adds.', why: 'JS changes the class; CSS decides the look. Each language keeps its job.' },
            { match: 'outline:', what: 'A line outside the border that takes no space.', why: 'Highlights without moving anything around.' },
          ],
        },
        {
          id: 'f6s2', file: 'js/script.js', mode: 'append',
          code: 'document.querySelector("#team").addEventListener("click", (evt) => {\n  evt.currentTarget.classList.toggle("picked")\n})',
          say: 'Click anywhere in My team: the card gets an outline. Click again: gone.',
          notes: [
            { match: 'classList', what: 'The element\'s classes, with add / remove / toggle.', why: 'Changing a class is cleaner than setting styles one by one.',
              api: { name: 'element.classList.toggle(name)', does: 'Adds the class if missing, removes it if there.', params: [['name', 'a class name, no dot', '"picked"']], returns: 'true if the class is now on' } },
          ],
        },
        {
          id: 'f6s3', file: 'js/script.js', mode: 'append',
          code: 'teamList.addEventListener("click", (evt) => {\n  if (evt.target.tagName === "LI") {\n    evt.target.remove()\n  }\n})',
          say: 'Click a Pokémon: it disappears, and the card outline toggles too. The click bubbled up from the li, through the ol, to #team.',
          notes: [
            { match: 'tagName === "LI"', what: 'Checks which element was clicked. tagName is always UPPERCASE.', why: 'One listener on the list handles every item, even ones added later (event delegation).' },
            { match: '.remove()', what: 'Takes the element off the page.', why: 'The opposite of appendChild.',
              api: { name: 'element.remove()', does: 'Removes the element from the page.', params: [['(none)', '', '']], returns: 'nothing' } },
          ],
        },
        {
          id: 'f6s4', file: 'js/script.js', mode: 'insertAfter', find: '    evt.target.remove()',
          code: '    evt.stopPropagation()',
          say: 'Stop the bubbling right here: removing a Pokémon no longer toggles the card.',
          notes: [
            { match: 'stopPropagation', what: 'Stops the event from bubbling up to parent elements.', why: 'The li click is handled; the card should not hear about it.',
              api: { name: 'evt.stopPropagation()', does: 'Parents\' listeners for this event will not run.', params: [['(none)', '', '']], returns: 'nothing', mistakes: ['Using it to stop a form reload: that is preventDefault().'] } },
          ],
        },
      ],
    },
  ],
})
