// Lecture 1 · HTML & CSS: the "Trainer profile" page, built in 8 features.
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
          id: 'f1s1', point: "Line 1: <!DOCTYPE html> is not a tag, it tells the browser to use modern rules. Line 2: lang=\"en\" tells screen readers which language to read. The </html> on the last line: everything else goes between these two.", file: 'index.html', mode: 'append',
          code: '<!DOCTYPE html>\n<html lang="en">\n</html>',
          say: 'Line 1 tells the browser "modern HTML". Everything else lives inside <html>.',
          notes: [
            { match: '<!DOCTYPE html>', what: 'The doctype: "this is a modern HTML5 page".', why: 'Without it the browser falls back to "quirks mode" and some CSS behaves differently.', breaks: 'Remove it: the page still shows, but sizes and spacing can change in odd ways.' },
            { match: '<html', what: 'The root element. Every other tag goes inside it.', why: 'A page has exactly one root, so the browser knows where the document starts and ends.',
              api: { name: '<html>', does: 'Wraps the whole page.', params: [['lang', 'the language of the page text', 'the language you write in: "en" for English, "es" for Spanish']], mistakes: ['Leaving out lang: screen readers may read the page with the wrong accent.'] } },
          ],
        },
        {
          id: 'f1s2', point: "The title of the pop-out window: it now says My Trainer Profile, which comes from <title>. Nothing new appears on the page, because the head never draws. charset=\"UTF-8\" lets letters like é display. viewport makes phones use their real width; the media query at the end needs it.", file: 'index.html', mode: 'insertAfter', find: '<html lang="en">',
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
          id: 'f1s3', point: "The live page: Trainer Profile finally appears, because only the body draws. It is big and bold with no CSS at all: browsers have default styles for headings.", file: 'index.html', mode: 'insertAfter', find: '</head>',
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
          id: 'f2s1', point: "id=\"page-title\" on the h1. Then the live page: it looks exactly the same, because <header> adds meaning, not looks. An id must be unique on the page; links and CSS use it to find this one element.", file: 'index.html', mode: 'replace', find: '  <h1>Trainer Profile</h1>',
          code: '  <header>\n    <h1 id="page-title">Trainer Profile</h1>\n  </header>',
          say: 'Wrap the top of the page in <header>. The h1 gets an id: a unique name we can point at later.',
          notes: [
            { match: '<header>', what: 'The top part of the page (or of a section): title, logo, navigation.', why: 'A semantic tag: it looks like a <div>, but it says what the content is.' },
            { match: 'id="page-title"', what: 'An id: a unique name for one element.', why: 'Links (#page-title), CSS (#page-title) and JavaScript can find this exact element.',
              api: { name: 'id attribute', does: 'Gives one element a name nobody else on the page has.', params: [['value', 'the name', 'short, lowercase, words joined with "-": "page-title"']], mistakes: ['Using the same id twice: CSS still styles both, but links and JavaScript find only the first.'] } },
          ],
        },
        {
          id: 'f2s2', point: "The three links on the page: blue and underlined is the browser default. In the code, the # in href means \"a spot on this page\". Click About: nothing happens yet, because nothing has id=\"about\".", file: 'index.html', mode: 'insertAfter', find: '<h1 id="page-title">',
          code: '    <nav>\n      <a href="#about">About</a>\n      <a href="#team">Team</a>\n      <a href="#contact">Contact</a>\n    </nav>',
          say: 'Links! href="#about" jumps to the element with id="about". Those sections come next.',
          notes: [
            { match: '<nav>', what: 'A group of navigation links.', why: 'Screen readers can list or skip the menu. Semantic again: it says "this is the menu".' },
            { match: '<a href', what: 'A link (the "a" is for anchor).', why: 'Links are what make it a web: click to go somewhere else.',
              api: { name: '<a>', does: 'Makes its content clickable and goes to href.', params: [['href', 'where the link goes', '"#id" = a spot on this page; "page.html" = a file next to this one; "https://…" = another site'], ['target', 'where to open it (optional)', '"_blank" = a new tab; leave it out to stay in the same tab']], mistakes: ['href="about" instead of "#about": the browser looks for a file called "about".'] } },
          ],
        },
        {
          id: 'f2s3', point: "id=\"about\" in the code next to href=\"#about\" in the nav: same word, one with # and one without. The link has a target now, but the page is too short to scroll, so nothing visibly moves yet: warn them, and click it again after the team section. class=\"card\" has no look yet: it is a group name that the CSS uses later.", file: 'index.html', mode: 'insertAfter', find: '  </header>',
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
          id: 'f2s4', point: "src: the address the browser downloads the picture from. alt: the text shown if the picture fails, and what a screen reader says. Notice there is no </img>. Then the bold words: that is <strong>.", file: 'index.html', mode: 'insertAfter', find: '<h2>About me</h2>',
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
          id: 'f2s5', point: "Click Pokédex: a new tab opens. Compare the two href values in the code: #about stays on this page, https://… leaves it. Delete target=\"_blank\" and the link would replace our page instead.", file: 'index.html', mode: 'insertAfter', find: 'one tag at a time</strong>.</p>',
          code: '      <p>Read about Pikachu on the <a href="https://www.pokemon.com/us/pokedex/pikachu" target="_blank">Pokédex</a>.</p>',
          say: 'A real hyperlink. Same <a> tag as the menu, but href is a full address, so it leaves our page. target="_blank" opens it in a new tab.',
          notes: [
            { match: 'href="https://', what: 'A full address: the link goes to another site.', why: 'href decides where a link goes. "#about" stays on this page; "https://…" leaves it.',
              api: { name: '<a href="https://…">', does: 'Goes to another page when clicked.', params: [['href', 'the address to go to', 'copy the whole URL, https:// included'], ['target', 'where it opens', '"_blank" = a new tab; leave it out and the link replaces this page']], mistakes: ['href="www.pokemon.com" without https://: the browser looks for a file with that name next to your page.', 'Link text like "click here": screen readers read links out of context, so say where it goes.'] } },
            { match: 'target="_blank"', what: 'Opens the link in a new tab.', why: 'Our page stays open behind it. Without it, the new page replaces ours.' },
          ],
        },
        {
          id: 'f2s6', point: "In the code: header, main and footer sit side by side inside body. On the page the footer looks like plain text: semantic tags change the meaning, not the look.", file: 'index.html', mode: 'insertAfter', find: '  </main>',
          code: '  <footer>\n    <p>Made with HTML and CSS</p>\n  </footer>',
          say: 'The footer closes the page. Now we have header, main and footer: the classic page shape.',
          notes: [
            { match: '<footer>', what: 'The bottom of the page: credits, contact, copyright.', why: 'Semantic: says "this is the end matter", not main content.' },
          ],
        },
      ],
    },
    // ---------------------------------------------------------------- f8 (taught third)
    // Fix It and lecture 2 start from f7, so feature ids stay put: this one was added later.
    {
      id: 'f8', title: 'Text tags and plain boxes',
      why: 'Small tags mark up words inside a line: <em>, <br>, <span>. <div> and <span> are boxes with no meaning, for when no semantic tag fits. Headings go from h1 down to h6.',
      steps: [
        {
          id: 'f8s1', point: "The word learning is now italic, and the words at the end of that line are bold. Say what each means: <strong> = this matters, <em> = stress this word. If you only want the look, that is a CSS job.", file: 'index.html', mode: 'replace', find: 'I am learning to build', code: 'I am <em>learning</em> to build',
          say: '<em> is emphasis: browsers show it in italics. <strong> means importance, <em> means stress, the way you would say it out loud.',
          notes: [
            { match: '<em>', what: 'Emphasis: stress on a word. Browsers show it in italics.', why: 'It has meaning: a screen reader can change its voice. Use CSS if you only want italics for looks.' },
          ],
        },
        {
          id: 'f8s2', point: "Pallet Town and Kanto region are on two lines but in one <p>: there is no gap between them like there is between paragraphs. <br> has no closing tag. Do not use a pile of <br> tags to make space: that is what margin is for.", file: 'index.html', mode: 'insertAfter', find: 'target="_blank">Pokédex</a>.</p>',
          code: '      <p>Pallet Town<br>Kanto region</p>',
          say: '<br> is a line break inside one paragraph. Good for addresses and poems. It is a void element: no closing tag.',
          notes: [
            { match: '<br>', what: 'A line break, inside the same paragraph.', why: 'For lines that belong together, like an address. For new ideas use a new <p>; for space use CSS.' },
          ],
        },
        {
          id: 'f8s3', point: "The page looks like one plain line: Electric looks like every other word. That is the point of span: it has no look and no meaning until CSS gives it one (in the selectors slide). It did not start a new line: span is inline.", file: 'index.html', mode: 'insertAfter', find: 'Kanto region</p>',
          code: '      <p>Favorite type: <span class="type">Electric</span></p>',
          say: '<span> is an inline box with no meaning. It stays in the line and does nothing yet: it is a hook for CSS.',
          notes: [
            { match: '<span', what: 'A generic inline container: it wraps words inside a line.', why: 'It has no meaning and no look of its own. It gives CSS (or JavaScript) something to grab.' },
          ],
        },
        {
          id: 'f8s4', point: "Badges and Wins are each on their own line: a div is block, so it starts a new line and takes the full width. Compare with the span one line above, which stayed in the sentence. The flex slide later puts these two side by side.", file: 'index.html', mode: 'insertAfter', find: 'Electric</span></p>',
          code: '      <div class="stats">\n        <p>Badges: 8</p>\n        <p>Wins: 12</p>\n      </div>',
          say: '<div> is a block box with no meaning: it starts a new line and groups things. Check for a semantic tag first; use div when none fits.',
          notes: [
            { match: '<div', what: 'A generic block container: it groups other elements.', why: 'Use it for layout and styling when no semantic tag fits. span = inline, div = block.' },
          ],
        },
        {
          id: 'f8s5', point: "The four headings get smaller on the page. Say it clearly: pick a heading for its place in the outline, never for its size; CSS sets the size. One h1 per page, and do not jump from h2 to h4. We delete these on the next press.", file: 'index.html', mode: 'replace', find: '      <div class="stats">',
          code: '      <h3>Heading 3</h3>\n      <h4>Heading 4</h4>\n      <h5>Heading 5</h5>\n      <h6>Heading 6</h6>\n      <div class="stats">',
          say: 'Headings go down to h6. They are levels in an outline, not font sizes: one h1, then h2 for sections, and do not skip levels.',
          notes: [
            { match: '<h3>', what: 'A heading one level below h2.', why: 'Headings are an outline of the page. Screen readers list them so people can jump around.' },
            { match: '<h4>', what: 'A heading one level below h3.', why: 'Rarely needed on a small page.' },
            { match: '<h5>', what: 'A heading one level below h4.', why: 'Rarely needed.' },
            { match: '<h6>', what: 'The lowest heading level.', why: 'Six levels is all HTML has.' },
          ],
        },
        {
          id: 'f8s6', point: "The test headings are gone and one h3, Stats, is left. It sits under the h2 About me, so the outline goes h1, h2, h3 with no gap.", file: 'index.html', mode: 'replace', find: '      <h3>Heading 3</h3>\n      <h4>Heading 4</h4>\n      <h5>Heading 5</h5>\n      <h6>Heading 6</h6>',
          code: '      <h3>Stats</h3>',
          say: 'We only needed to see them. Our page keeps one h3: Stats sits under About me.',
        },
        {
          id: 'f8s7', point: "On the page these look like plain text: again, meaning only. Test for article: could you paste it on another site and it still makes sense? Then it is an article. The aside is a side note: you could remove it and the main story still works.", file: 'index.html', mode: 'insertAfter', find: '      </div>',
          code: '      <article>\n        <h3>Latest battle</h3>\n        <p>Pikachu beat Onix in three turns.</p>\n      </article>\n      <aside>Tip: electric moves do nothing to ground types.</aside>',
          say: 'The last two semantic tags. <article> makes sense on its own, like a blog post. <aside> is a side note.',
          notes: [
            { match: '<article>', what: 'Content that stands on its own: a post, a news story, a comment.', why: 'You could lift it out and it would still make sense. Search engines and readers use that.' },
            { match: '<aside>', what: 'A side note: related, but not the main story.', why: 'Screen readers can skip it. Sidebars and tips belong here.' },
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
          id: 'f3s1', point: "The bullets on the page: the browser adds them because of <ul>. <ul> wraps the list and each item is an <li>. id=\"team\" gives the Team link its target. If the page is long enough to scroll now, click About and Team to see the jump. class=\"card\" is the second card.", file: 'index.html', mode: 'insertAfter', find: '    </section>',
          code: '    <section id="team" class="card">\n      <h2>My team</h2>\n      <ul>\n        <li>Pikachu</li>\n      </ul>\n    </section>',
          say: 'A second section, with a list. <ul> = unordered: bullets.',
          notes: [
            { match: '<ul>', what: 'An unordered list: bullet points.', why: 'Use it when the order does not matter.', breaks: 'Put <li> outside a list and the browser guesses; the bullets look wrong.' },
            { match: '<li>', what: 'One list item. Only allowed inside <ul> or <ol>.', why: 'Each item is its own element, so CSS and screen readers can count them.' },
          ],
        },
        {
          id: 'f3s2', point: "Two more bullets appear. The list does the bullets for you: you never type a bullet character.", file: 'index.html', mode: 'insertAfter', find: '<li>Pikachu</li>',
          code: '        <li>Bulbasaur</li>\n        <li>Charmander</li>',
          say: 'Two more items. Same tag, new text.',
          notes: [{ match: '<li>', what: 'More list items.', why: 'A list grows by adding <li> elements.' }],
        },
        {
          id: 'f3s3', point: "Keep your eye on the page: bullets become 1, 2, 3. In the code only the opening and closing tag changed; the <li> lines did not. Browsers do the counting: move an item and the numbers follow.", file: 'index.html', mode: 'replace',
          find: '      <ul>\n        <li>Pikachu</li>\n        <li>Bulbasaur</li>\n        <li>Charmander</li>\n      </ul>',
          code: '      <ol>\n        <li>Pikachu</li>\n        <li>Bulbasaur</li>\n        <li>Charmander</li>\n      </ol>',
          say: 'Change ul to ol and the bullets become numbers. Order matters now: this is my battle order.',
          notes: [
            { match: '<ol>', what: 'An ordered list: numbered.', why: 'Use it when the order matters: steps, rankings, battle order.',
              api: { name: '<ol>', does: 'A numbered list.', params: [['start', 'the first number (optional)', 'start="3" begins at 3'], ['type', 'the kind of numbering (optional)', '"1", "a", "A", "i" or "I"']], mistakes: ['Typing the numbers yourself inside <li>: the browser already numbers them.'] } },
          ],
        },
        {
          id: 'f3s4', point: "The header row on the page: bold and centred, from <th>. Read the nesting aloud: table, then thead, then tr (a row), then th (a cell). There are three cells, so the table has three columns.", file: 'index.html', mode: 'insertAfter', find: '      </ol>',
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
          id: 'f3s5', point: "Each <tr> is one row and each <td> one value. Every row has three cells to match the three headers: leave one out and the columns slip. Say: tables are for data, never for page layout.", file: 'index.html', mode: 'insertAfter', find: '        </thead>',
          code: '        <tbody>\n          <tr><td>Pikachu</td><td>Electric</td><td>12</td></tr>\n          <tr><td>Bulbasaur</td><td>Grass</td><td>9</td></tr>\n        </tbody>',
          say: 'The body of the table: one <tr> per Pokémon, one <td> per value.',
          notes: [
            { match: '<tbody>', what: 'The data part of the table.', why: 'Separates the data rows from the header row.' },
            { match: '<td>', what: 'A data cell.', why: 'One value. Each row needs the same number of cells as there are columns.', breaks: 'A missing <td> shifts the rest of the row one column to the left.' },
          ],
        },
        {
          id: 'f3s6', point: "The term Electric sits on the left and its meaning is indented on the next line: no bullets, no numbers. Sum up the three lists: ul = order does not matter, ol = order matters, dl = a term and what it means.", file: 'index.html', mode: 'insertAfter', find: '      </table>',
          code: '      <h3>Type guide</h3>\n      <dl>\n        <dt>Electric</dt>\n        <dd>Strong against water and flying types.</dd>\n      </dl>',
          say: 'The third kind of list: a definition list. Pairs of a term and what it means, like a glossary.',
          notes: [
            { match: '<dl>', what: 'A definition list: terms and their descriptions.', why: 'For name and value pairs: glossaries, FAQs, product details.' },
            { match: '<dt>', what: 'The term.', why: 'dt = definition term.' },
            { match: '<dd>', what: 'What the term means.', why: 'dd = definition description. Browsers indent it.' },
          ],
        },
      ],
    },
    // ---------------------------------------------------------------- f4
    {
      id: 'f4', title: 'A form',
      why: 'Forms are how users send data: every input needs a label (for people) and a name (for the data). action says where the data goes and method says how.',
      steps: [
        {
          id: 'f4s1', point: "The page shows only the heading: a <form> draws nothing by itself, it is an invisible wrapper. id=\"contact\" makes the Contact link work. This is the third card.", file: 'index.html', mode: 'replace', find: '  </main>',
          code: '    <section id="contact" class="card">\n      <h2>Battle request</h2>\n      <form>\n      </form>\n    </section>\n  </main>',
          say: 'The last section holds a form. A form wraps the inputs that are sent together.',
          notes: [
            { match: '<form>', what: 'Wraps the inputs that are sent together.', why: 'Pressing Enter or a submit button sends everything inside the form.',
              api: { name: '<form>', does: 'Collects its inputs and sends them when submitted.', params: [['action', 'where the data goes (optional)', 'the server URL; leave it out to send to this same page'], ['method', 'how it is sent (optional)', '"get" (in the URL, the default) or "post" (in the request body, not in the URL; private data still needs HTTPS)']], mistakes: ['Expecting nothing to happen on Send: the page reloads and what you typed is gone (the preview does it too). In lecture 2 we stop it with JavaScript.'] } },
          ],
        },
        {
          id: 'f4s2', point: "Click the words Your name: the cursor jumps into the box. That works because for=\"trainer\" matches id=\"trainer\". Point at the three uses of the word trainer: for and id link label to box (for people), name is the key the data is sent under.", file: 'index.html', mode: 'insertAfter', find: '      <form>',
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
          id: 'f4s3', point: "Type in the Password box: you see dots. In the code it is the same <input>; only type changed. The dots are on screen only: the real text is still sent as it is, and you prove that at N 8.", file: 'index.html', mode: 'insertAfter', find: 'name="trainer">',
          code: '        <label for="password">Password</label>\n        <input type="password" id="password" name="password">',
          say: 'Same tag, new type. type="password" hides what you type on screen. Only on screen: remember that for the end of this slide.',
          notes: [
            { match: 'type="password"', what: 'A text field that shows dots instead of the letters.', why: 'It only hides the text on screen. It does not encrypt anything.' },
          ],
        },
        {
          id: 'f4s4', point: "Click the dropdown: Fire and Water. <select> is the box and each <option> is one line. An option with no value sends its own text. The first option is picked until the user changes it.", file: 'index.html', mode: 'insertAfter', find: 'name="password">',
          code: '        <label for="favorite">Favorite type</label>\n        <select id="favorite" name="favorite">\n          <option>Fire</option>\n          <option>Water</option>\n        </select>',
          say: 'A dropdown: <select> with <option>s inside.',
          notes: [
            { match: '<select', what: 'A dropdown menu.', why: 'Use it when the user must pick one of a fixed list.',
              api: { name: '<select>', does: 'Shows a list of options; one is chosen.', params: [['id / name', 'same as for inputs', 'id for the label, name for the data'], ['multiple', 'allow several choices (optional)', 'add it only if picking more than one makes sense']], mistakes: ['Options outside the select: they show as plain text.'] } },
            { match: '<option>', what: 'One choice in the dropdown.', why: 'Its text is shown and (without a value attribute) also sent.' },
          ],
        },
        {
          id: 'f4s5', point: "Click Single, then Double: the first one clears. That happens only because both have name=\"style\": same name = one group. value is what gets sent. The border and the Battle style title are the fieldset and legend. The input is inside the label, so clicking the word works with no for or id.", file: 'index.html', mode: 'insertAfter', find: '        </select>',
          code: '        <fieldset>\n          <legend>Battle style</legend>\n          <label><input type="radio" name="style" value="single"> Single</label>\n          <label><input type="radio" name="style" value="double"> Double</label>\n        </fieldset>',
          say: 'Radio buttons: pick one. The shared name makes them one group. value is what gets sent. fieldset and legend name the group.',
          notes: [
            { match: 'type="radio"', what: 'One choice from a group: picking one clears the others.', why: 'All the radios with the same name are one group. value is what is sent for the picked one.',
              api: { name: '<input type="radio">', does: 'One option in a pick-one group.', params: [['name', 'the group', 'the same word on every radio of the group'], ['value', 'what is sent', 'a short word; the text after it is for people']], mistakes: ['Different names: each radio is its own group, so you can pick all of them.', 'Leaving out value: the form sends "on".'] } },
            { match: '<fieldset>', what: 'Groups related fields, with a border.', why: 'Screen readers announce the group name before each option.' },
            { match: '<legend>', what: 'The name of a fieldset.', why: 'One label for the whole group of radios.' },
            { match: '<label><input', what: 'An input inside its label: no for or id needed.', why: 'The label wraps the input, so clicking the word picks it.' },
          ],
        },
        {
          id: 'f4s6', point: "Tick and untick it, by clicking the words too. Compare with radios: radios pick one from a group, a checkbox is its own yes or no. An unticked box sends nothing at all: you can show that at N 8.", file: 'index.html', mode: 'insertAfter', find: '        </fieldset>',
          code: '        <label><input type="checkbox" name="rules" value="agree"> I accept the rules</label>',
          say: 'A checkbox: on or off. Radios pick one from a group; checkboxes are each their own yes or no.',
          notes: [
            { match: 'type="checkbox"', what: 'A yes/no box.', why: 'Only sent when ticked. If it is not ticked, the name is not in the data at all.' },
          ],
        },
        {
          id: 'f4s7', point: "Drag the bottom-right corner of the Message box: textarea resizes. The button has type=\"submit\". Fill in the name and press Send: the page reloads and the box empties, because with no action a form sends to this same page.", file: 'index.html', mode: 'insertAfter', find: 'I accept the rules</label>',
          code: '        <label for="message">Message</label>\n        <textarea id="message" name="message"></textarea>\n        <button type="submit">Send</button>',
          say: 'A big text box and the button that sends the form.',
          notes: [
            { match: '<textarea', what: 'A multi-line text box.', why: 'For longer text: messages, comments.' },
            { match: '<button', what: 'A clickable button.', why: 'type="submit" sends the form it is in.',
              api: { name: '<button>', does: 'A button; type says what it does.', params: [['type', 'what a click does', '"submit" = send the form; "button" = nothing until JavaScript says so; "reset" = clear the form']], mistakes: ['Leaving out type inside a form: it defaults to "submit" and sends the form by surprise.'] } },
          ],
        },
        {
          id: 'f4s8', point: "Read the address bar in the new tab. After the ? is the data: name=value pairs joined by &. Each key is a name=\"…\" from our form, and there is password=… in plain text. The page itself shows the same pairs under \"args\". httpbin only echoes what it received.", file: 'index.html', mode: 'replace', find: '      <form>',
          code: '      <form action="https://httpbin.org/get" method="get" target="_blank">',
          say: 'action = where the data goes. method = how. httpbin.org is a test server that shows what it received. Fill it in, press Send: your password is in the URL.',
          notes: [
            { match: 'action=', what: 'The address the form data is sent to.', why: 'Without action the form sends to this same page. A real app sends to its server.' },
            { match: 'method="get"', what: 'GET puts the data in the URL: ?trainer=Ash&password=pika.', why: 'Good for searches you can bookmark. Never for passwords: URLs land in the history and in server logs.' },
          ],
        },
        {
          id: 'f4s9', point: "The address bar ends at /post, with no ? and no data. Find \"form\" on the page: the same pairs, now sent in the body of the request. Say: POST hides it from the URL, it does not encrypt it. HTTPS does that.", file: 'index.html', mode: 'replace', find: 'action="https://httpbin.org/get" method="get"',
          code: 'action="https://httpbin.org/post" method="post"',
          say: 'POST sends the data in the body of the request. Send again: the URL is clean and the data is under "form".',
          notes: [
            { match: 'method="post"', what: 'POST puts the data in the body of the request, not the URL.', why: 'Use it for logins and anything that changes data. HTTPS is what actually encrypts it.' },
          ],
        },
        {
          id: 'f4s10', point: "The form line is back to plain <form>. Press Send: the page reloads and the fields empty. Say: that reload is the default behaviour, and stopping it is how lecture 2 starts.", file: 'index.html', mode: 'replace', find: '      <form action="https://httpbin.org/post" method="post" target="_blank">',
          code: '      <form>',
          say: 'We have no server of our own yet, so action goes away. Now Send reloads this page. Lecture 2 takes over from there with JavaScript.',
        },
      ],
    },
    // ---------------------------------------------------------------- f5
    {
      id: 'f5', title: 'Three ways to add CSS',
      why: 'CSS can go in a style attribute, a <style> tag or a separate file. The separate file wins: one place for all the looks, shared by every page.',
      steps: [
        {
          id: 'f5s1', point: "The title turns purple. In the code the CSS is sitting inside the HTML tag. It styles this one tag only: a second heading would need its own style attribute.", file: 'index.html', mode: 'replace', find: '<h1 id="page-title">',
          code: '<h1 id="page-title" style="color: purple;">',
          say: 'Way 1, inline: a style attribute on one element. Quick, but it styles only this one tag.',
          notes: [
            { match: 'style="', what: 'An inline style: CSS written on one element.', why: 'Shown to compare. Hard to reuse and it beats almost every other rule, so avoid it.' },
          ],
        },
        {
          id: 'f5s2', point: "The title goes back to black, and the style attribute is gone from the line. Next, the same idea in a better place.", file: 'index.html', mode: 'replace', find: ' style="color: purple;"', code: '',
          say: 'Delete it again. We do not want CSS scattered through the HTML.',
        },
        {
          id: 'f5s3', point: "The title turns green, and this time the CSS is in the head, not on the tag. It styles every h1 on this page, but no other page can use it.", file: 'index.html', mode: 'insertAfter', find: '  <title>My Trainer Profile</title>',
          code: '  <style>\n    h1 {\n      color: green;\n    }\n  </style>',
          say: 'Way 2, internal: a <style> tag in the head. Works for this page only.',
          notes: [
            { match: '<style>', what: 'Internal CSS, inside the HTML file.', why: 'Shown to compare. Only this page can use it.' },
          ],
        },
        {
          id: 'f5s4', point: "The title goes back to black: not broken, styles.css is empty. href=\"styles.css\" must match the file name exactly and sit in the same folder. rel=\"stylesheet\" tells the browser what kind of file it is.", file: 'index.html', mode: 'replace', find: '  <style>\n    h1 {\n      color: green;\n    }\n  </style>',
          code: '  <link rel="stylesheet" href="styles.css">',
          say: 'Way 3, external: one line links a CSS file. The heading goes back to black: styles.css is still empty.',
          notes: [
            { match: '<link rel="stylesheet"', what: 'Links an external CSS file.', why: 'One file holds all the looks; every page links the same file.',
              api: { name: '<link>', does: 'Connects another file to the page.', params: [['rel', 'what kind of file it is', '"stylesheet" for CSS (also "icon" for the tab icon)'], ['href', 'where the file is', 'a path next to the HTML: "styles.css" or "./styles.css"']], mistakes: ['Forgetting rel="stylesheet": the file loads but no style is applied.', 'A typo in href: no error on the page, just no styles. Check the Network tab.'] } },
          ],
        },
        {
          id: 'f5s5', point: "Three changes on the page: the font, the grey background, and the page now touches the window edges (margin 0 removes the browser default of 8px). Read one line as property: value; and note the semicolon. The font reaches everything inside body: that is inheritance, text styles pass down to the tags inside.", file: 'styles.css', mode: 'append',
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
          id: 'f5s6', point: "The title turns blue. #2a75bb is a hex colour: three pairs of digits for red, green and blue. Every page that links this file gets the same rule from one place.", file: 'styles.css', mode: 'append',
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
          id: 'f6s1', point: "All three sections turn white from one rule, because all three have class=\"card\" in the HTML. In the CSS the dot means class; in the HTML there is no dot. Add class=\"card\" to anything else and it goes white too.", file: 'styles.css', mode: 'append',
          code: '.card {\n  background-color: white;\n}',
          say: 'A class selector starts with a dot. All three sections have class="card", so all three go white.',
          notes: [
            { match: '.card {', what: 'A class selector: every element with class="card".', why: 'Reusable: add the class to any element to give it this look.',
              api: { name: '.class selector', does: 'Matches every element that has this class.', params: [['.name', 'the class name after a dot', 'the same word as in class="…", without the dot in the HTML']], mistakes: ['Forgetting the dot: "card {" looks for a <card> tag, which does not exist.'] } },
          ],
        },
        {
          id: 'f6s2', point: "The title turns red, though h1 still says blue. Open the CSS: both rules are there. # means id. Say: id beats class, class beats element, and it does not matter which rule comes first in the file. In DevTools the losing color is crossed out.", file: 'styles.css', mode: 'append',
          code: '#page-title {\n  color: #c62828;\n}',
          say: 'An id selector starts with #. Now two rules set the h1 colour: h1 says blue, #page-title says red. Red wins: id beats element.',
          notes: [
            { match: '#page-title {', what: 'An id selector: the one element with id="page-title".', why: 'Most specific of the three: it wins over class and element rules.',
              api: { name: '#id selector', does: 'Matches the element with this id.', params: [['#name', 'the id after a #', 'the same word as in id="…"']], mistakes: ['Styling everything with ids: they are so strong that later rules cannot override them. Prefer classes.'] } },
          ],
        },
        {
          id: 'f6s3', point: "Only the word Electric gets a yellow background: the span stayed inline, so the colour hugs the word. On a div the colour would fill the whole line. This is the job of a span: a hook for styling a few words.", file: 'styles.css', mode: 'append',
          code: '.type {\n  background-color: #ffcb05;\n}',
          say: 'Remember the span? A class gives it a look. It stays inline: only the word gets the colour.',
          notes: [
            { match: '.type {', what: 'A class selector for our <span class="type">.', why: 'This is what a span is for: a hook for styling a few words.' },
          ],
        },
        {
          id: 'f6s4', point: "Look at the form: every label is on its own line now. Labels are inline by default, which is why the form looked squashed. label with no dot or # is an element selector, so it hits every label at once, the radios included.", file: 'styles.css', mode: 'append',
          code: 'label {\n  display: block;\n  margin-top: 8px;\n}',
          say: 'An element selector for the form: each label starts its own line, and the form stops looking squashed.',
          notes: [
            { match: 'label {', what: 'An element selector: every <label>.', why: 'Labels are inline by default, so the whole form runs together on one line.' },
            { match: 'margin-top:', what: 'Margin on the top side only.', why: 'A little space between one field and the next.' },
          ],
        },
      ],
    },
    // ---------------------------------------------------------------- f7
    {
      id: 'f7', title: 'Box model and responsive design',
      why: 'Every element is a box: content, padding, border, margin. Responsive pages use relative units, flexible layouts and media queries, so they fit a phone, a tablet and a desktop.',
      steps: [
        {
          id: 'f7s1', point: "The cards get a yellow line, space inside it and gaps between them. Name them from the inside out: content, padding (inside the line, takes the white background), border, margin (outside, see-through). Right-click a card → Inspect, and hover: DevTools colours each layer.", file: 'styles.css', mode: 'insertAfter', find: '  background-color: white;',
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
          id: 'f7s2', point: "Nothing changes on the page, so say why: no card has a width yet. Give a card width: 300px and without this rule it is really 336px wide (300 + 16 + 16 padding + 2 + 2 border). With border-box, 300 means 300. * means every element.", file: 'styles.css', mode: 'replace', find: 'body {',
          code: '* {\n  box-sizing: border-box;\n}\n\nbody {',
          say: 'One fix almost every site uses: width includes padding and border. * means every element.',
          notes: [
            { match: '* {', what: 'The universal selector: every element.', why: 'Use it sparingly; box-sizing is the classic good use.' },
            { match: 'box-sizing:', what: 'Decides whether width includes padding and border.', why: 'border-box makes "width: 300px" really 300px wide, padding and border included.',
              api: { name: 'box-sizing', does: 'Chooses how width and height are measured.', params: [['content-box', 'the default: width = content only', 'rarely what you want'], ['border-box', 'width = content + padding + border', 'the usual choice for every element']] } },
          ],
        },
        {
          id: 'f7s3', point: "The title gets a little bigger: 2.5rem is 40px by default. rem = times the browser text size, so someone who set bigger text gets a bigger title; px would ignore them. It is still red: the h1 and #page-title rules only fight over color. Only h1 sets font-size, so there is no fight and it applies.", file: 'styles.css', mode: 'insertAfter', find: '  color: #2a75bb;',
          code: '  font-size: 2.5rem;',
          say: 'rem is a relative unit: 2.5 times the browser default size. If someone sets bigger text in their browser, this grows with it. px does not.',
          notes: [
            { match: 'font-size:', what: 'How big the text is.', why: 'rem follows the size the user chose in the browser, so it is kinder to people who need big text.',
              api: { name: 'font-size', does: 'Sets the text size.', params: [['px', 'a fixed size', '"24px"'], ['rem', 'times the root size (usually 16px)', '"2.5rem" = 40px by default'], ['%', 'of the parent text size', '"120%"']] } },
          ],
        },
        {
          id: 'f7s4', point: "Space appears left and right of the cards. Resize the pop-out: main stays 90% of the window. max-width means it can shrink but never pass that. margin: 0 auto reads as 0 top and bottom, auto left and right: the free space is shared, so the box is centred.", file: 'styles.css', mode: 'append',
          code: 'main {\n  max-width: 90%;\n  margin: 0 auto;\n}',
          say: '% is relative to the parent: main is never wider than 90% of the page, on any screen. margin 0 auto centres it.',
          notes: [
            { match: 'max-width:', what: 'The widest this box may get.', why: 'A percent follows the screen, so the box shrinks and grows with it.' },
            { match: 'margin: 0 auto', what: 'No margin top and bottom; left and right share the free space.', why: 'That is the classic way to centre a block.' },
          ],
        },
        {
          id: 'f7s5', point: "Badges and Wins jump onto one row: the div finally has a job. display: flex goes on the parent and moves its direct children. gap is the space between them.", file: 'styles.css', mode: 'append',
          code: '.stats {\n  display: flex;\n  gap: 1rem;\n}',
          say: 'A flexible layout. display: flex puts the children of .stats side by side, with a gap. Our div finally has a job.',
          notes: [
            { match: 'display: flex', what: 'Lays the children out in a row.', why: 'Flexbox is the everyday tool for layout. The children share the space and adapt to it.' },
            { match: 'gap:', what: 'The space between flex children.', why: 'Simpler than giving every child a margin.' },
          ],
        },
        {
          id: 'f7s6', point: "Pop out, then make the window narrow: past 600px wide the links stack one under the other. Drag it wide: they go back. The side-by-side pane may show them stacked already: the media query measures that pane, not your monitor. Rules inside @media only apply while its condition is true.", file: 'styles.css', mode: 'append',
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
