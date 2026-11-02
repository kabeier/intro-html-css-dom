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
| 3 | 3 | **N ×3**, A after N 2 | the four skeleton tags (table in notes) |
| 4 | 7 | — | start tag · attribute · content · end tag; void elements |
| 5 | 9 | **N ×6**, A after N 2, click About; click Pokédex after N 5 | id = one, class = group; #id stays, https:// leaves |
| 6 | 15 | — | semantic tags table |
| 7 | 16 | **N ×7**, A open | em, br, span, div, h3–h6, article, aside |
| 8 | 23 | **N ×6**, A before N 3 | ul → ol; tables are for data; dl = term + meaning |
| 9 | 28 | — | form tags; action, method, name |
| 10 | 30 | **N ×10**, A open; press Send after N 8, 9, 10 (table in notes) | GET: password in the URL. POST: in the body |
| 11 | 39 | click the timer (6:00) | Fix It, problems 1–6 |
| 12 | 45 | — | inline / internal / external; who wins: !important, inline, specific, then later in the page |
| 13 | 47 | **N ×6**, A open the whole time | selector { property: value; } |
| 14 | 50 | **N ×4** | ID > class > element: red wins; span gets a look; labels stack |
| 15 | 54 | (DevTools on the pop-out if time) | content, padding, border, margin |
| 16 | 55 | — | px, rem, %, flex, media query |
| 17 | 56 | **N ×6**, then Pop out + narrow window | rem, %, flex; media query: links stack |
| 18 | 62 | paste the page into the validator, delete a `</section>`, check again | fix the first error first |
| 19 | 64 | — | MDN, Code Explorer |
| 20 | 65 | — | Homework Part I, top to bottom |

## Time checks

| At slide | Should be | If late |
|---|---|---|
| 7 (text tags) | min 16 | press N through it, say one line per tag |
| 11 (activity) | min 39 | shorten the activity to 4 minutes (problems 1–4) |
| 15 | min 54 | skip DevTools; say the four layers |

## Things to expect

- **The image doesn't show** in the live page: no internet (it comes from raw.githubusercontent.com). Everything else works.
- **Students' Send button reloads the page**: normal; lecture 2 stops it with JavaScript.
- **"Different from the curriculum"** (until the curriculum branch `front-end-unit-rewrite` is merged): the page called `<img />` "self-closing" (HTML has void elements) and said HTML and CSS are both W3C (HTML is WHATWG). Both are in the slide notes.
- Fell-behind student: Code Explorer → their feature → **Download the code at this feature**.


# Runbook · Lecture 2: JavaScript DOM (~42 min)

Same keys as lecture 1. New: a **Console** panel under the live page shows `console.log` and errors.

| # | Min | Do | Say |
|---|---|---|---|
| 1 | 0 | T | "JavaScript makes the page react." Students start from lecture 1's finished page |
| 2 | 1 | — | Node vs browser: `document` is new |
| 3 | 3 | (Inspect → Elements in the pop-out) | the DOM tree; attributes live on elements |
| 4 | 5 | **N ×3**, students create script.js | defer table in the notes |
| 5 | 9 | — | five selection methods; querySelector speaks CSS |
| 6 | 11 | **N ×3**, A: Console shows the NodeList | |
| 7 | 14 | — | HTMLCollection vs NodeList: use for...of; `Array.from` for map |
| 8 | 16 | **N ×6**; after N 4 click Add with an empty box | hand over the function, no () |
| 9 | 21 | timer 6:00 | Fix It → Lecture 2, problems 1–6 |
| 10 | 27 | — | events; target vs currentTarget |
| 11 | 28 | **N ×2**, A, move the mouse over About | console shows SECTION / H2 / P / IMG |
| 12 | 31 | — | preventDefault vs stopPropagation |
| 13 | 32 | **N ×4**; after N 3 submit: it flashes and reloads | N 4 = preventDefault |
| 14 | 35 | — | bubbling picture |
| 15 | 36 | **N ×4**; after N 3 click a Pokémon | outline toggles too; N 4 stops it |
| 16 | 39 | — | DOM by hand vs React |
| 17 | 40 | — | Homework Part II |

Time checks: slide 9 at min 21 (late? 4-minute activity); slide 14 at min 35 (late? skip the picture, say it during slide 14).

Things to expect:
- **"Cannot set properties of null"**: the element wasn't found (wrong selector, or no `defer`). Fix It 1–3 practise this.
- **The form reloads in the preview too**: that is on purpose (it behaves like a real page) until `preventDefault()`.
- **Clicking Add to team toggles the card outline**: the button is inside #team, so its click bubbles there. Good moment to point at bubbling.
- **An infinite loop freezes the whole deck** (the preview shares the deck's page). If you or a student types `while (true)` into a slide editor: close the tab, reopen the deck, press Shift+N on that slide. Type loops with their condition first.
