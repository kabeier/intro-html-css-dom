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
| 5 | 9 | **N ×5**, A after N 2, click About | id = one, class = group |
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
