# HTML, CSS & the DOM (Front-End, unit 1)

Lecture site for Code Platoon Phase II, Front-End unit 1 (Vanilla Development). Live at https://kabeier.github.io/intro-html-css-dom/

| Path | What |
|---|---|
| `index.html` | Landing page: lectures, Fix It, Code Explorer, homework |
| `lecture-1-html-css/slides.html` | Lecture 1 deck (28 slides, ~80 min: the whole curriculum page) |
| `lecture-1-html-css/css-playground/` | 35 CSS properties to try live (edit `properties.js`) |
| `lecture-2-js-dom/slides.html` | Lecture 2 deck (17 slides, ~42 min) |
| `explore.html?lesson=html-css&at=f3` | Code Explorer: the page after any feature, the changes, the story of every line, zip download |
| `fixit.html?lesson=html-css` | Fix It: 10 broken pages with behaviour checks (lecture 1's activity) |
| `shared/course.js` | Lesson data model: steps → checkpoints, line origins, notes, `buildDoc` |
| `shared/course/html-css.js` | Lecture 1's page as data (8 features). **Edit code here**: slides, explorer and Fix It all read it |
| `shared/course/html-css-fixit.js` | Lecture 1's Fix It problems |
| `shared/course/js-dom.js`, `js-dom-fixit.js` | Lecture 2: starts from lecture 1's page (`base`), moves it into `css/` and `js/`, adds js/script.js; its Fix It problems (async checks) |
| `shared/livepad.js`, `.css`, `popout.html` | The editor + live preview in the slides |
| `tools/gen-notes.mjs` | Regenerates the presenter-note step tables from the lesson data |
| `demo-kit/` | RUNBOOK, the finished page (`html-css-final/`) |
| `tests/` | `node --test tests/*.test.mjs` (Chromium via the playwright-core in the npx cache) |

## Deck keys

→ / Space next · ← back · **N** type the next step · **Shift+N** reset the slide · **A** show/hide the live page · **↗ Pop out** live page in its own window · P presenter notes · T clock · O overview · F fullscreen

## After changing a lesson

```bash
node tools/gen-notes.mjs lecture-1-html-css/slides.html   # notes tables
node tools/gen-notes.mjs lecture-2-js-dom/slides.html
node --test tests/*.test.mjs                              # everything still applies, validates, fits
```
Bump `?v=` on any changed `shared/` file.
