# Runbook · Lecture 1: HTML & CSS (~40 min)

## Before class

| Do | Why |
|---|---|
| Open https://kabeier.github.io/intro-html-css-dom/ → **Open the slides** | the deck |
| **Ctrl+Shift+R** once | fresh engine files |
| Press **F** (fullscreen), then **P** (presenter notes window) | notes + clock |
| Click into the first code slide once and wait for the editor | Monaco loads from the internet the first time |
| Zoom: share the **whole screen** if you will use **↗ Pop out** | the pop-out is a separate window |

## Keys on a code slide

| Key | Does |
|---|---|
| **N** | types the next short chunk (also in the notes table) |
| **Type next step** (presenter window) | same as N, from the notes window. Shows "Typed 2 of 6 steps". **N** works there too |
| **Shift+N** | resets this slide to its start |
| **A** | live page beside the code; A again hides it (stays open on later slides) |
| **↗ Pop out** | live page in its own window, synced; resize it to show the media query |
| click in the editor | type yourself; the page updates as you type. **Esc** leaves the editor so arrows change slides again |

If you typed in the editor and **N** says "can't apply": press **Shift+N**.

## Slide by slide

| # | Min | Do | Say |
|---|---|---|---|
| 1 | 0 | T (clock) | "HTML is what's on the page. CSS is how it looks." |
| 2 | 1 | students make `trainer-profile/index.html` + `styles.css` | markup language, not programming; keys N / A / Pop out |
| 3 | 3 | students install Live Server with you | Extensions → live server → the one by Ritwick Dey → Install |
| 4 | 5 | File → Open Folder, Go Live; save a change; click Port : 5500 | Go Live starts it, Port : 5500 stops it; 127.0.0.1 = this computer |
| 5 | 6 | **N ×3**, A after N 2 | the four skeleton tags (table in notes) |
| 6 | 10 | — | the frame; everything that can live in the head (only the body is drawn) |
| 7 | 12 | — | start tag · attribute · content · end tag; void elements |
| 8 | 14 | **N ×6**, A after N 2, click About; click Pokédex after N 5 | id = one, class = group; #id stays, https:// leaves |
| 9 | 20 | — | semantic tags table |
| 10 | 21 | **N ×7**, A open | em, br, span, div, h3–h6, article, aside |
| 11 | 28 | **N ×6**, A before N 3 | ul → ol; tables are for data; dl = term + meaning |
| 12 | 33 | — | tags at a glance: a look-back, don't read it out |
| 13 | 34 | — | block vs inline: real elements; width works on the div, is ignored on the span; display changes it |
| 14 | 36 | click 5–6 chips: h1–h6, img, lists, table, blockquote, a form control | every look is a browser default with no CSS; table has no lines; q adds its own quote marks |
| 15 | 38 | — | form tags; action, method, name |
| 16 | 40 | **N ×10**, A open; press Send after N 8, 9, 10 (table in notes) | GET: password in the URL. POST: in the body |
| 17 | 49 | click the timer (6:00) | Fix It, problems 1–6 |
| 18 | 55 | — | inline / internal / external; who wins: usual page = inline, internal, external; then order matters |
| 19 | 57 | **N ×6**, A open the whole time | selector { property: value; } |
| 20 | 60 | — | one colour, many ways: name, hex, short hex, rgb, hsl, see-through |
| 21 | 62 | **N ×4** | ID > class > element: red wins; span gets a look; labels stack |
| 22 | 66 | (DevTools on the pop-out if time) | content, padding, border, margin |
| 23 | 67 | — | px, rem, %, flex, media query |
| 24 | 68 | **N ×6**, then Pop out + narrow window | rem, %, flex; media query: links stack |
| 25 | 74 | in the playground: border-radius, display, justify-content, type `tomatoo` | the rule shape; flex goes on the parent; wrong values are skipped silently |
| 26 | 76 | paste the page into the validator, delete a `</section>`, check again | fix the first error first |
| 27 | 78 | — | MDN, Code Explorer, CSS Playground |
| 28 | 79 | — | Homework Part I, top to bottom |

## Time checks

| At slide | Should be | If late |
|---|---|---|
| 10 (text tags) | min 21 | press N through it, say one line per tag |
| 17 (activity) | min 49 | shorten the activity to 4 minutes (problems 1–4) |
| 22 | min 66 | skip DevTools; say the four layers |

## Things to expect

- **The image doesn't show** in the live page: no internet (it comes from raw.githubusercontent.com). Everything else works.
- **Students' Send button reloads the page**: normal; lecture 2 stops it with JavaScript.
- **"Different from the curriculum"** (until the curriculum branch `front-end-unit-rewrite` is merged): the page called `<img />` "self-closing" (HTML has void elements) and said HTML and CSS are both W3C (HTML is WHATWG). Both are in the slide notes.
- Fell-behind student: Code Explorer → their feature → **Download the code at this feature**.


# Runbook · Lecture 2: JavaScript DOM (~43 min)

Same keys as lecture 1. New: a **Console** panel under the live page shows `console.log` and errors.

| # | Min | Do | Say |
|---|---|---|---|
| 1 | 0 | T | "JavaScript makes the page react." Students start from lecture 1's finished page |
| 2 | 1 | — | Node vs browser: `document` is new |
| 3 | 3 | (Inspect → Elements in the pop-out) | the DOM tree; attributes live on elements |
| 4 | 5 | **N ×5**; students make `css/` (drag styles.css in) and `js/script.js`; after N 1 let them see the plain page | the link must follow the file: `css/styles.css`; defer table in the notes |
| 5 | 10 | — | five selection methods; querySelector speaks CSS |
| 6 | 12 | **N ×3**, A: Console shows the NodeList | |
| 7 | 15 | — | HTMLCollection vs NodeList: use for...of; `Array.from` for map |
| 8 | 17 | **N ×6**; after N 4 click Add with an empty box | hand over the function, no () |
| 9 | 22 | timer 6:00 | Fix It → Lecture 2, problems 1–6 |
| 10 | 28 | — | events; target vs currentTarget |
| 11 | 29 | **N ×2**, A, move the mouse over About | console shows SECTION / H2 / P / IMG |
| 12 | 32 | — | preventDefault vs stopPropagation |
| 13 | 33 | **N ×4**; after N 3 submit: it flashes and reloads | N 4 = preventDefault |
| 14 | 36 | — | bubbling picture |
| 15 | 37 | **N ×4**; after N 3 click a Pokémon | outline toggles too; N 4 stops it |
| 16 | 40 | — | DOM by hand vs React |
| 17 | 41 | — | Homework Part II |

Time checks: slide 9 at min 22 (late? 4-minute activity); slide 14 at min 36 (late? skip the picture, say it during slide 14).

Things to expect:
- **"Cannot set properties of null"**: the element wasn't found (wrong selector, or no `defer`). Fix It 1–3 practise this.
- **The form reloads in the preview too**: that is on purpose (it behaves like a real page) until `preventDefault()`.
- **Clicking Add to team toggles the card outline**: the button is inside #team, so its click bubbles there. Good moment to point at bubbling.
- **An infinite loop freezes the whole deck** (the preview shares the deck's page). If you or a student types `while (true)` into a slide editor: close the tab, reopen the deck, press Shift+N on that slide. Type loops with their condition first.

## File tree and Fix It

- **File tree:** every editor in the slides and the Code Explorer shows the project's folders and files. Click a file to open it, click a folder to fold it.
- **Slides:** press **E** or the **Files** button to hide or show it (**F** is still fullscreen). It stays that way on every slide. New files show green.
- **Fix It:** shows only the lines around the bug, with the live app beside it, all on one screen. **Show all the code** brings back the whole project if a student asks.
