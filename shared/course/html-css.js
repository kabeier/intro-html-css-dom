// Lecture 1 · HTML & CSS: the "Trainer profile" page, built in 7 features.
// One source for the slides (livepad), the explorer, catch-up and Fix it.
// Follows the curriculum page phase-II/04-Front-End/1-vanilla-development/1-html-css.md
Course.register({
  id: 'html-css',
  title: 'HTML & CSS: Trainer profile',
  files: { 'index.html': '', 'styles.css': '' },
  features: [
    // ---------------------------------------------------------------- f1
    {
      id: 'f1', title: 'The skeleton',
      why: 'Every HTML page has the same frame: a doctype, one <html>, a <head> for the browser and a <body> for the user.',
      steps: [
        {
          id: 'f1s1', file: 'index.html', mode: 'append',
          code: '<!DOCTYPE html>\n<html lang="en">\n</html>',
          say: 'Line 1 tells the browser "modern HTML". Everything else lives inside <html>.',
          notes: [
            { match: '<!DOCTYPE html>', what: 'The doctype: "this is a modern HTML5 page".', why: 'Without it the browser falls back to "quirks mode" and some CSS behaves differently.', breaks: 'Remove it: the page still shows, but sizes and spacing can change in odd ways.' },
            { match: '<html', what: 'The root element. Every other tag goes inside it.', why: 'A page has exactly one root, so the browser knows where the document starts and ends.',
              api: { name: '<html>', does: 'Wraps the whole page.', params: [['lang', 'the language of the page text', 'the language you write in: "en" for English, "es" for Spanish']], mistakes: ['Leaving out lang: screen readers may read the page with the wrong accent.'] } },
          ],
        },
        {
          id: 'f1s2', file: 'index.html', mode: 'insertAfter', find: '<html lang="en">',
          code: '<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Trainer Profile</title>\n</head>',
          say: 'The head is for the browser, not the page. Watch the tab title change.',
          notes: [
            { match: '<head>', what: 'Information about the page: title, character set, CSS links.', why: 'The browser reads it before drawing anything. Nothing in it is drawn on the page.', breaks: 'Put a <p> in here and the browser moves it into the body for you.' },
            { match: '<meta charset', what: 'The character set: which letters and symbols the file can hold.', why: 'UTF-8 covers every language and emoji, so "é" and "Pokémon" show correctly.',
              api: { name: '<meta charset>', does: 'Tells the browser how the bytes of this file turn into letters.', params: [['charset', 'the text encoding', 'always "UTF-8" today']], mistakes: ['Putting it late in the head: it should be the first thing in <head>.'] } },
            { match: '<meta name="viewport"', what: 'Tells phones to use the real screen width.', why: 'Without it a phone pretends to be a wide desktop and shrinks the page. We need it for responsive design (feature 7).',
              api: { name: '<meta name="viewport">', does: 'Sets how wide the page is on phones and tablets.', params: [['width', 'how wide the page layout is', '"device-width" = the width of the screen'], ['initial-scale', 'the zoom when the page opens', '1.0 = no zoom']], mistakes: ['Leaving it out: media queries for small screens never kick in on a real phone.'] } },
            { match: '<title>', what: 'The text in the browser tab (and in bookmarks and search results).', why: 'It names the page for people and for search engines.', breaks: 'Remove it: the tab shows the file name instead.' },
          ],
        },
        {
          id: 'f1s3', file: 'index.html', mode: 'insertAfter', find: '</head>',
          code: '<body>\n  <h1>Trainer Profile</h1>\n</body>',
          say: 'The body is everything you see. First thing on the page: the main heading.',
          notes: [
            { match: '<body>', what: 'Everything the user sees goes in the body.', why: 'Keeps "what the browser needs" (head) apart from "what the user sees" (body).' },
            { match: '<h1>', what: 'The main heading of the page.', why: 'Headings h1 → h6 give the page an outline. Screen readers jump between them like a table of contents.',
              api: { name: '<h1> … <h6>', does: 'Headings, from most to least important.', params: [['level 1–6', 'how important the heading is', 'one <h1> per page for the main title; <h2> for sections; never skip levels to get a smaller font (use CSS)']], mistakes: ['Choosing h3 because it looks smaller: pick by meaning, style with CSS.'] } },
          ],
        },
      ],
    },
    // ---------------------------------------------------------------- f2
    {
      id: 'f2', title: 'Content and semantics',
      why: 'Semantic tags (header, nav, main, section, footer) say what each part of the page IS, which helps screen readers, search engines and the next developer.',
      steps: [
        {
          id: 'f2s1', file: 'index.html', mode: 'replace', find: '  <h1>Trainer Profile</h1>',
          code: '  <header>\n    <h1 id="page-title">Trainer Profile</h1>\n  </header>',
          say: 'Wrap the top of the page in <header>. The h1 gets an id: a unique name we can point at later.',
          notes: [
            { match: '<header>', what: 'The top part of the page (or of a section): title, logo, navigation.', why: 'A semantic tag: it looks like a <div>, but it says what the content is.' },
            { match: 'id="page-title"', what: 'An id: a unique name for one element.', why: 'Links (#page-title), CSS (#page-title) and JavaScript can find this exact element.',
              api: { name: 'id attribute', does: 'Gives one element a name nobody else on the page has.', params: [['value', 'the name', 'short, lowercase, words joined with "-": "page-title"']], mistakes: ['Using the same id twice: CSS still styles both, but links and JavaScript find only the first.'] } },
          ],
        },
        {
          id: 'f2s2', file: 'index.html', mode: 'insertAfter', find: '<h1 id="page-title">',
          code: '    <nav>\n      <a href="#about">About</a>\n      <a href="#team">Team</a>\n      <a href="#contact">Contact</a>\n    </nav>',
          say: 'Links! href="#about" jumps to the element with id="about". Those sections come next.',
          notes: [
            { match: '<nav>', what: 'A group of navigation links.', why: 'Screen readers can list or skip the menu. Semantic again: it says "this is the menu".' },
            { match: '<a href', what: 'A link (the "a" is for anchor).', why: 'Links are what make it a web: click to go somewhere else.',
              api: { name: '<a>', does: 'Makes its content clickable and goes to href.', params: [['href', 'where the link goes', '"#id" = a spot on this page; "page.html" = a file next to this one; "https://…" = another site'], ['target', 'where to open it (optional)', '"_blank" = a new tab; leave it out to stay in the same tab']], mistakes: ['href="about" instead of "#about": the browser looks for a file called "about".'] } },
          ],
        },
        {
          id: 'f2s3', file: 'index.html', mode: 'insertAfter', find: '  </header>',
          code: '  <main>\n    <section id="about" class="card">\n      <h2>About me</h2>\n    </section>\n  </main>',
          say: 'One <main> per page: the real content. Each part of it is a <section> with its own <h2>.',
          notes: [
            { match: '<main>', what: 'The main content of the page. Only one per page.', why: 'Screen readers offer "skip to main content" using this tag.' },
            { match: '<section', what: 'One themed part of the page, usually with its own heading.', why: 'Groups related content. Here: About, Team, Contact.',
              api: { name: '<section>', does: 'Groups content about one topic.', params: [['id', 'a unique name', 'matches the link that points here: id="about" for href="#about"'], ['class', 'a group name for styling', 'the same class on many elements = the same look ("card")']], mistakes: ['Using <section> just to add a box for styling: then a <div> is the right tag.'] } },
            { match: 'class="card"', what: 'A class: a reusable group name.', why: 'Every element with class="card" can share one CSS rule (feature 6).',
              api: { name: 'class attribute', does: 'Puts the element in one or more named groups.', params: [['value', 'one or more names, space-separated', 'describe the role, not the look: "card", not "yellow-box"']], mistakes: ['Writing class=".card": the dot belongs only in CSS.'] } },
            { match: '<h2>', what: 'A section heading, one level under the h1.', why: 'Keeps the page outline: h1 for the page, h2 for each section.' },
          ],
        },
        {
          id: 'f2s4', file: 'index.html', mode: 'insertAfter', find: '<h2>About me</h2>',
          code: '      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" alt="Pikachu">\n      <p>I am learning to build web pages, <strong>one tag at a time</strong>.</p>',
          say: 'An image and a paragraph. <img> has no closing tag: it is a "void" element.',
          notes: [
            { match: '<img', what: 'An image. A void element: no content, no closing tag.', why: 'Pictures make the page friendly; alt keeps it usable for people who cannot see them.',
              api: { name: '<img>', does: 'Shows the picture found at src.', params: [['src', 'where the picture is', 'a full URL (https://…) or a path next to the HTML file ("images/me.png")'], ['alt', 'text that replaces the picture', 'say what the picture shows, as you would to someone on the phone; alt="" only for pure decoration']], mistakes: ['A wrong path in src: you get a broken-image icon (and the alt text).', 'No alt: screen readers read the file name out loud.'] } },
            { match: '<p>', what: 'A paragraph of text.', why: 'Browsers add space above and below paragraphs, and screen readers pause between them.' },
            { match: '<strong>', what: 'Strong importance. Browsers show it in bold.', why: 'It means "this matters"; use CSS if you only want bold for looks.' },
          ],
        },
        {
          id: 'f2s5', file: 'index.html', mode: 'insertAfter', find: '  </main>',
          code: '  <footer>\n    <p>Made with HTML and CSS</p>\n  </footer>',
          say: 'The footer closes the page. Now we have header, main and footer: the classic page shape.',
          notes: [
            { match: '<footer>', what: 'The bottom of the page: credits, contact, copyright.', why: 'Semantic: says "this is the end matter", not main content.' },
          ],
        },
      ],
    },
    // ---------------------------------------------------------------- f3
    {
      id: 'f3', title: 'Lists and a table',
      why: 'Lists hold items that belong together; tables hold data in rows and columns. Pick the tag by the kind of data.',
      steps: [
        {
          id: 'f3s1', file: 'index.html', mode: 'insertAfter', find: '    </section>',
          code: '    <section id="team" class="card">\n      <h2>My team</h2>\n      <ul>\n        <li>Pikachu</li>\n      </ul>\n    </section>',
          say: 'A second section, with a list. <ul> = unordered: bullets.',
          notes: [
            { match: '<ul>', what: 'An unordered list: bullet points.', why: 'Use it when the order does not matter.', breaks: 'Put <li> outside a list and the browser guesses; the bullets look wrong.' },
            { match: '<li>', what: 'One list item. Only allowed inside <ul> or <ol>.', why: 'Each item is its own element, so CSS and screen readers can count them.' },
          ],
        },
        {
          id: 'f3s2', file: 'index.html', mode: 'insertAfter', find: '<li>Pikachu</li>',
          code: '        <li>Bulbasaur</li>\n        <li>Charmander</li>',
          say: 'Two more items. Same tag, new text.',
          notes: [{ match: '<li>', what: 'More list items.', why: 'A list grows by adding <li> elements.' }],
        },
        {
          id: 'f3s3', file: 'index.html', mode: 'replace',
          find: '      <ul>\n        <li>Pikachu</li>\n        <li>Bulbasaur</li>\n        <li>Charmander</li>\n      </ul>',
          code: '      <ol>\n        <li>Pikachu</li>\n        <li>Bulbasaur</li>\n        <li>Charmander</li>\n      </ol>',
          say: 'Change ul to ol and the bullets become numbers. Order matters now: this is my battle order.',
          notes: [
            { match: '<ol>', what: 'An ordered list: numbered.', why: 'Use it when the order matters: steps, rankings, battle order.',
              api: { name: '<ol>', does: 'A numbered list.', params: [['start', 'the first number (optional)', 'start="3" begins at 3'], ['type', 'the kind of numbering (optional)', '"1", "a", "A", "i" or "I"']], mistakes: ['Typing the numbers yourself inside <li>: the browser already numbers them.'] } },
          ],
        },
        {
          id: 'f3s4', file: 'index.html', mode: 'insertAfter', find: '      </ol>',
          code: '      <table>\n        <thead>\n          <tr><th>Pokémon</th><th>Type</th><th>Level</th></tr>\n        </thead>\n      </table>',
          say: 'A table is for data in rows and columns. First the header row.',
          notes: [
            { match: '<table>', what: 'A table of data.', why: 'Rows and columns of facts. Tables are for data, never for page layout (that is CSS).' },
            { match: '<thead>', what: 'The header part of the table.', why: 'Tells the browser and screen readers which row holds the column names.' },
            { match: '<tr>', what: 'A table row.', why: 'Every row of cells sits in its own <tr>.' },
            { match: '<th>', what: 'A header cell: a column name.', why: 'Bold and centred by default; screen readers read it before each cell in its column.' },
          ],
        },
        {
          id: 'f3s5', file: 'index.html', mode: 'insertAfter', find: '        </thead>',
          code: '        <tbody>\n          <tr><td>Pikachu</td><td>Electric</td><td>12</td></tr>\n          <tr><td>Bulbasaur</td><td>Grass</td><td>9</td></tr>\n        </tbody>',
          say: 'The body of the table: one <tr> per Pokémon, one <td> per value.',
          notes: [
            { match: '<tbody>', what: 'The data part of the table.', why: 'Separates the data rows from the header row.' },
            { match: '<td>', what: 'A data cell.', why: 'One value. Each row needs the same number of cells as there are columns.', breaks: 'A missing <td> shifts the rest of the row one column to the left.' },
          ],
        },
      ],
    },
    // ---------------------------------------------------------------- f4
    {
      id: 'f4', title: 'A form',
      why: 'Forms are how users send data: every input needs a label (for people) and a name (for the data).',
      steps: [
        {
          id: 'f4s1', file: 'index.html', mode: 'replace', find: '  </main>',
          code: '    <section id="contact" class="card">\n      <h2>Battle request</h2>\n      <form>\n      </form>\n    </section>\n  </main>',
          say: 'The last section holds a form. A form wraps the inputs that are sent together.',
          notes: [
            { match: '<form>', what: 'Wraps the inputs that are sent together.', why: 'Pressing Enter or a submit button sends everything inside the form.',
              api: { name: '<form>', does: 'Collects its inputs and sends them when submitted.', params: [['action', 'where the data goes (optional)', 'the server URL; leave it out to send to this same page'], ['method', 'how it is sent (optional)', '"get" (in the URL, the default) or "post" (in the request body, not in the URL; private data still needs HTTPS)']], mistakes: ['Expecting nothing to happen on Send: in your own browser the page reloads (the slide preview blocks that). In lecture 2 we stop it with JavaScript.'] } },
          ],
        },
        {
          id: 'f4s2', file: 'index.html', mode: 'insertAfter', find: '      <form>',
          code: '        <label for="trainer">Your name</label>\n        <input type="text" id="trainer" name="trainer">',
          say: 'Label + input are a pair: label for="trainer" points at the input with id="trainer". Click the label and see the cursor jump.',
          notes: [
            { match: '<label', what: 'The visible name of an input.', why: 'Screen readers read it; clicking it focuses the input.',
              api: { name: '<label>', does: 'Names an input.', params: [['for', 'which input it names', 'the id of that input, exactly']], mistakes: ['for and id do not match: clicking the label does nothing and screen readers say "edit text, blank".'] } },
            { match: '<input', what: 'A one-line field the user types in (or a checkbox, radio, date…).', why: 'The most common way to get data from a user.',
              api: { name: '<input>', does: 'A field; type decides which kind.', params: [['type', 'the kind of field', '"text", "email", "password", "number", "checkbox", "date"… pick what you are asking for, phones show the right keyboard'], ['id', 'unique name', 'the same word the label uses in for'], ['name', 'the key of the data when the form is sent', 'a short word for the value: "trainer"']], mistakes: ['No name: the value is not sent with the form.'] } },
          ],
        },
        {
          id: 'f4s3', file: 'index.html', mode: 'insertAfter', find: 'name="trainer">',
          code: '        <label for="favorite">Favorite type</label>\n        <select id="favorite" name="favorite">\n          <option>Fire</option>\n          <option>Water</option>\n        </select>',
          say: 'A dropdown: <select> with <option>s inside.',
          notes: [
            { match: '<select', what: 'A dropdown menu.', why: 'Use it when the user must pick one of a fixed list.',
              api: { name: '<select>', does: 'Shows a list of options; one is chosen.', params: [['id / name', 'same as for inputs', 'id for the label, name for the data'], ['multiple', 'allow several choices (optional)', 'add it only if picking more than one makes sense']], mistakes: ['Options outside the select: they show as plain text.'] } },
            { match: '<option>', what: 'One choice in the dropdown.', why: 'Its text is shown and (without a value attribute) also sent.' },
          ],
        },
        {
          id: 'f4s4', file: 'index.html', mode: 'insertAfter', find: '        </select>',
          code: '        <label for="message">Message</label>\n        <textarea id="message" name="message"></textarea>\n        <button type="submit">Send</button>',
          say: 'A big text box and the button that sends the form.',
          notes: [
            { match: '<textarea', what: 'A multi-line text box.', why: 'For longer text: messages, comments.' },
            { match: '<button', what: 'A clickable button.', why: 'type="submit" sends the form it is in.',
              api: { name: '<button>', does: 'A button; type says what it does.', params: [['type', 'what a click does', '"submit" = send the form; "button" = nothing until JavaScript says so; "reset" = clear the form']], mistakes: ['Leaving out type inside a form: it defaults to "submit" and sends the form by surprise.'] } },
          ],
        },
      ],
    },
    // ---------------------------------------------------------------- f5
    {
      id: 'f5', title: 'Three ways to add CSS',
      why: 'CSS can go in a style attribute, a <style> tag or a separate file. The separate file wins: one place for all the looks, shared by every page.',
      steps: [
        {
          id: 'f5s1', file: 'index.html', mode: 'replace', find: '<h1 id="page-title">',
          code: '<h1 id="page-title" style="color: purple;">',
          say: 'Way 1, inline: a style attribute on one element. Quick, but it styles only this one tag.',
          notes: [
            { match: 'style="', what: 'An inline style: CSS written on one element.', why: 'Shown to compare. Hard to reuse and it beats almost every other rule, so avoid it.' },
          ],
        },
        {
          id: 'f5s2', file: 'index.html', mode: 'replace', find: ' style="color: purple;"', code: '',
          say: 'Delete it again. We do not want CSS scattered through the HTML.',
        },
        {
          id: 'f5s3', file: 'index.html', mode: 'insertAfter', find: '  <title>My Trainer Profile</title>',
          code: '  <style>\n    h1 {\n      color: green;\n    }\n  </style>',
          say: 'Way 2, internal: a <style> tag in the head. Works for this page only.',
          notes: [
            { match: '<style>', what: 'Internal CSS, inside the HTML file.', why: 'Shown to compare. Only this page can use it.' },
          ],
        },
        {
          id: 'f5s4', file: 'index.html', mode: 'replace', find: '  <style>\n    h1 {\n      color: green;\n    }\n  </style>',
          code: '  <link rel="stylesheet" href="styles.css">',
          say: 'Way 3, external: one line links a CSS file. The heading goes back to black: styles.css is still empty.',
          notes: [
            { match: '<link rel="stylesheet"', what: 'Links an external CSS file.', why: 'One file holds all the looks; every page links the same file.',
              api: { name: '<link>', does: 'Connects another file to the page.', params: [['rel', 'what kind of file it is', '"stylesheet" for CSS (also "icon" for the tab icon)'], ['href', 'where the file is', 'a path next to the HTML: "styles.css" or "./styles.css"']], mistakes: ['Forgetting rel="stylesheet": the file loads but no style is applied.', 'A typo in href: no error on the page, just no styles. Check the Network tab.'] } },
          ],
        },
        {
          id: 'f5s5', file: 'styles.css', mode: 'append',
          code: 'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  background-color: #f4f4f8;\n}',
          say: 'Now in styles.css. A rule = selector + { property: value; }. This one styles the whole body.',
          notes: [
            { match: 'body {', what: 'A rule for the <body> element (an element selector).', why: 'Text styles set on body are inherited by everything inside it.' },
            { match: 'font-family:', what: 'Which font the text uses.', why: 'A list: the browser uses the first font it has.',
              api: { name: 'font-family', does: 'Chooses the font.', params: [['fonts, comma-separated', 'first choice, then fallbacks', 'end with a generic family: serif, sans-serif or monospace']], mistakes: ['A font name with spaces and no quotes: write "Times New Roman" in quotes.'] } },
            { match: 'margin:', what: 'Space outside an element\'s border.', why: 'Browsers give body an 8px margin; 0 lets our page reach the edges.',
              api: { name: 'margin', does: 'Space outside the border, between this box and its neighbours.', params: [['1 value', 'all four sides', '"16px"'], ['2 values', 'top+bottom, then left+right', '"8px 16px"'], ['4 values', 'top, right, bottom, left (clockwise)', '"0 8px 0 8px"']], mistakes: ['Expecting margin to colour the space: margin is always see-through. Use padding for coloured space.'] } },
            { match: 'background-color:', what: 'The colour behind the content.', why: 'A light grey page so the white cards stand out later.',
              api: { name: 'background-color', does: 'Paints the box behind its content and padding.', params: [['colour', 'a named colour, hex or rgb', '"white", "#f4f4f8", "rgb(244, 244, 248)"']] } },
          ],
        },
        {
          id: 'f5s6', file: 'styles.css', mode: 'append',
          code: 'h1 {\n  color: #2a75bb;\n}',
          say: 'Every h1 turns blue. One rule, every page that links this file.',
          notes: [
            { match: 'h1 {', what: 'An element selector: every <h1>.', why: 'The simplest selector: the tag name.' },
            { match: 'color:', what: 'The text colour.', why: 'Colour is how we show what matters on the page.',
              api: { name: 'color', does: 'Sets the colour of the text.', params: [['value', 'a colour', 'named ("blue"), hex ("#2a75bb") or rgb ("rgb(42, 117, 187)"); hex is what designers usually hand you']], mistakes: ['Writing colour (British spelling): CSS ignores it without an error.'] } },
          ],
        },
      ],
    },
    // ---------------------------------------------------------------- f6
    {
      id: 'f6', title: 'Selectors and specificity',
      why: 'Selectors pick what to style: tag, .class or #id. When rules fight, the more specific selector wins: id beats class beats element.',
      steps: [
        {
          id: 'f6s1', file: 'styles.css', mode: 'append',
          code: '.card {\n  background-color: white;\n}',
          say: 'A class selector starts with a dot. All three sections have class="card", so all three go white.',
          notes: [
            { match: '.card {', what: 'A class selector: every element with class="card".', why: 'Reusable: add the class to any element to give it this look.',
              api: { name: '.class selector', does: 'Matches every element that has this class.', params: [['.name', 'the class name after a dot', 'the same word as in class="…", without the dot in the HTML']], mistakes: ['Forgetting the dot: "card {" looks for a <card> tag, which does not exist.'] } },
          ],
        },
        {
          id: 'f6s2', file: 'styles.css', mode: 'append',
          code: '#page-title {\n  color: #c62828;\n}',
          say: 'An id selector starts with #. Now two rules set the h1 colour: h1 says blue, #page-title says red. Red wins: id beats element.',
          notes: [
            { match: '#page-title {', what: 'An id selector: the one element with id="page-title".', why: 'Most specific of the three: it wins over class and element rules.',
              api: { name: '#id selector', does: 'Matches the element with this id.', params: [['#name', 'the id after a #', 'the same word as in id="…"']], mistakes: ['Styling everything with ids: they are so strong that later rules cannot override them. Prefer classes.'] } },
          ],
        },
      ],
    },
    // ---------------------------------------------------------------- f7
    {
      id: 'f7', title: 'Box model and a responsive rule',
      why: 'Every element is a box: content, padding, border, margin. A media query changes the rules on small screens.',
      steps: [
        {
          id: 'f7s1', file: 'styles.css', mode: 'insertAfter', find: '  background-color: white;',
          code: '  padding: 16px;\n  border: 2px solid #ffcb05;\n  margin: 16px;',
          say: 'The box model, from the inside out: content, padding, border, margin. Open DevTools and hover a card to see the layers.',
          notes: [
            { match: 'padding:', what: 'Space inside the border, around the content.', why: 'Keeps text off the edge; it takes the background colour.',
              api: { name: 'padding', does: 'Space between content and border.', params: [['1–4 values', 'same pattern as margin', '"16px" all sides; "8px 16px" top/bottom then left/right']], mistakes: ['Using margin when you want the coloured area bigger: that is padding.'] } },
            { match: 'border:', what: 'A line around the padding.', why: 'Shows where the box ends.',
              api: { name: 'border', does: 'Draws a line around the box.', params: [['width', 'how thick', '"2px"'], ['style', 'what kind of line', '"solid", "dashed", "dotted"'], ['colour', 'what colour', '"#ffcb05"']], mistakes: ['Leaving out the style: "2px #ffcb05" draws nothing.'] } },
            { match: 'margin:', what: 'Space outside the border.', why: 'Pushes the cards apart.' },
          ],
        },
        {
          id: 'f7s2', file: 'styles.css', mode: 'replace', find: 'body {',
          code: '* {\n  box-sizing: border-box;\n}\n\nbody {',
          say: 'One fix almost every site uses: width includes padding and border. * means every element.',
          notes: [
            { match: '* {', what: 'The universal selector: every element.', why: 'Use it sparingly; box-sizing is the classic good use.' },
            { match: 'box-sizing:', what: 'Decides whether width includes padding and border.', why: 'border-box makes "width: 300px" really 300px wide, padding and border included.',
              api: { name: 'box-sizing', does: 'Chooses how width and height are measured.', params: [['content-box', 'the default: width = content only', 'rarely what you want'], ['border-box', 'width = content + padding + border', 'the usual choice for every element']] } },
          ],
        },
        {
          id: 'f7s3', file: 'styles.css', mode: 'append',
          code: '@media (max-width: 600px) {\n  nav a {\n    display: block;\n  }\n}',
          say: 'A media query: these rules only apply on screens 600px wide or less. Pop out the app and make the window narrow: the links stack.',
          notes: [
            { match: '@media', what: 'A media query: rules that apply only when a condition is true.', why: 'The core of responsive design: one page that fits phones and desktops.',
              api: { name: '@media', does: 'Applies the rules inside only when the condition matches.', params: [['(max-width: 600px)', 'the screen is 600px wide or less', 'pick the width where your layout starts to look cramped']], mistakes: ['Forgetting the viewport <meta> (feature 1): on a real phone the query never matches.'] } },
            { match: 'nav a {', what: 'A descendant selector: every <a> inside a <nav>.', why: 'Targets only the menu links, not every link on the page.' },
            { match: 'display:', what: 'How the box takes part in layout.', why: 'Links are inline (side by side); block puts each on its own line.',
              api: { name: 'display', does: 'Sets the box type.', params: [['inline', 'flows with text, side by side', 'links, <strong>'], ['block', 'full width, starts on a new line', 'headings, paragraphs, sections'], ['flex / grid', 'layouts', 'covered later']] } },
          ],
        },
      ],
    },
  ],
})
