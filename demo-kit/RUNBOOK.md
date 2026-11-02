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
| 2 | 1 | students make `trainer-profile/index.html` + `styles.css` | keys N / A / Pop out |
| 3 | 3 | **N ×3**, A after N 2 | the four skeleton tags (table in notes) |
| 4 | 7 | — | start tag · attribute · content · end tag; void elements |
| 5 | 9 | **N ×6**, A after N 2, click About; click Pokédex after N 5 | id = one, class = group; #id stays, https:// leaves |
| 6 | 14 | — | semantic tags table |
| 7 | 15 | **N ×5**, A before N 3 | ul → ol; tables are for data |
| 8 | 18 | **N ×4** | label for = input id; name = the data |
| 9 | 21 | click the timer (6:00) | Fix It, problems 1–6 |
| 10 | 27 | — | inline / internal / external |
| 11 | 28 | **N ×6**, A open the whole time | selector { property: value; } |
| 12 | 31 | **N ×2** | ID > class > element: red wins |
| 13 | 34 | (DevTools on the pop-out if time) | content, padding, border, margin |
| 14 | 35 | **N ×3**, then Pop out + narrow window | media query: links stack |
| 15 | 38 | — | MDN, Code Explorer |
| 16 | 39 | — | Homework Part I, top to bottom |

## Time checks

| At slide | Should be | If late |
|---|---|---|
| 9 (activity) | min 21 | shorten the activity to 4 minutes (problems 1–4) |
| 13 | min 34 | skip DevTools; say the four layers |

## Things to expect

- **The image doesn't show** in the live page: no internet (it comes from raw.githubusercontent.com). Everything else works.
- **Students' Send button reloads the page**: normal; lecture 2 stops it with JavaScript.
- **"Different from the curriculum"** (until the curriculum branch `front-end-unit-rewrite` is merged): the page called `<img />` "self-closing" (HTML has void elements) and said HTML and CSS are both W3C (HTML is WHATWG). Both are in the slide notes.
- Fell-behind student: Code Explorer → their feature → **Download the code at this feature**.


# Runbook · Lecture 2: JavaScript DOM (~40 min)

Same keys as lecture 1. New: a **Console** panel under the live page shows `console.log` and errors.

| # | Min | Do | Say |
|---|---|---|---|
| 1 | 0 | T | "JavaScript makes the page react." Students start from lecture 1's finished page |
| 2 | 1 | — | Node vs browser: `document` is new |
| 3 | 3 | (Inspect → Elements in the pop-out) | the DOM tree; attributes live on elements |
| 4 | 5 | **N ×3**, students create script.js | defer table in the notes |
| 5 | 9 | — | five selection methods; querySelector speaks CSS |
| 6 | 11 | **N ×3**, A: Console shows the NodeList | |
| 7 | 14 | **N ×6**; after N 4 click Add with an empty box | hand over the function, no () |
| 8 | 20 | timer 6:00 | Fix It → Lecture 2, problems 1–6 |
| 9 | 26 | — | events; target vs currentTarget |
| 10 | 27 | **N ×2**, A, move the mouse over About | console shows SECTION / H2 / P / IMG |
| 11 | 30 | — | preventDefault vs stopPropagation |
| 12 | 31 | **N ×4**; after N 3 submit: it flashes and reloads | N 4 = preventDefault |
| 13 | 34 | — | bubbling picture |
| 14 | 35 | **N ×4**; after N 3 click a Pokémon | outline toggles too; N 4 stops it |
| 15 | 38 | — | DOM by hand vs React |
| 16 | 39 | — | Homework Part II |

Time checks: slide 8 at min 20 (late? 4-minute activity); slide 13 at min 34 (late? skip the picture, say it during slide 14).

Things to expect:
- **"Cannot set properties of null"**: the element wasn't found (wrong selector, or no `defer`). Fix It 1–3 practise this.
- **The form reloads in the preview too**: that is on purpose (it behaves like a real page) until `preventDefault()`.
- **Clicking Add to team toggles the card outline**: the button is inside #team, so its click bubbles there. Good moment to point at bubbling.
- **An infinite loop freezes the whole deck** (the preview shares the deck's page). If you or a student types `while (true)` into a slide editor: close the tab, reopen the deck, press Shift+N on that slide. Type loops with their condition first.
