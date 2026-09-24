# EGG//DROP — The Egg Drop Challenge

A SPICE design-process review, rebuilt as a static website. The site takes a 16-slide school
presentation about protecting a boiled egg from a fall and turns it into a dark, terminal-flavoured
engineering log — with a live impact-force calculator and a drop simulator you can actually run.

Built with **HTML5 + Tailwind CSS**. No framework, no runtime, no build step required to deploy.

> **Operators:** Aayush &amp; Kunj
> **Deliverable:** one boiled egg, zero cracks
> **Deadline:** Monday, September 21st, 2026

---

## What this is

The original assignment (a SPICE review of the Egg Drop Challenge) walked through five stages:
**S**ituation, **P**roblem, **I**nvestigation, **C**onstruction, **E**valuation. This site gives each
stage its own page, keeps the content and the tone of the deck, and then adds the parts a slide
deck cannot have:

- an **impact-force calculator** that runs `F = Δp / Δt` on real numbers you type in
- a **canvas drop simulator** that drops a bare egg and the finished device and reports the impact force
- a **scroll-reactive HUD aesthetic** — grid background, corner-bracketed panels, monospace
  telemetry labels, terminal boot sequence

The project content is unchanged. The physics, the criteria, the four sketches and the build itself
all come straight from the presentation.

---

## Live site

| | |
| --- | --- |
| **Live** | <https://aayushkumar.ca/techwebsite/> |
| **Hosting** | plain static upload — no platform, no build step, no config |
| **Source** | <https://github.com/AayushKumar1028/Tech-Website> |

### Deploying

The site is plain files with relative paths, so it runs from any directory on any static host —
the live copy sits in the `techwebsite` folder alongside the domain root.

1. Upload `index.html`, `pages/`, `css/`, `js/` and `assets/`.
2. Keep that structure. `index.html` links to `css/…`, while the pages in `pages/` link back to
   `../css/…`, so flattening the folders breaks the styling on the stage pages.
3. That is the whole deploy. No build step, no server config, no redirects — each page links to the
   real `.html` file rather than relying on platform "clean URLs".

Development-only files can be skipped: `node_modules/`, `package.json`, `package-lock.json`,
`tailwind.config.js`, `css/tailwind.src.css`, `.gitignore` and this README. Leaving them on the
server is harmless — nothing ever requests them.

### Updating the site (and why a change can seem to do nothing)

The host sends `Cache-Control: max-age=2592000` on `css/style.css` — thirty days. A browser that has
already seen that file will keep using its copy for a month, so a freshly uploaded stylesheet can
look like it never arrived: the new HTML renders with the old CSS, which is how an unstyled page
ends up showing a broken image next to a full-width drawing.

The pages avoid that by versioning the asset URLs:

```html
<link rel="stylesheet" href="../css/style.css?v=5">
<script src="../js/main.js?v=5"></script>
```

**After editing `css/style.css`, `css/tailwind.css`, `js/main.js` or `js/physics.js`, bump `?v=5` to
the next number on all six pages.** A new query string is a new URL, so no cache can serve the old
file. HTML itself is only cached for ten minutes, so pages catch up on their own.

The six pages that need the bump: `index.html` and everything in `pages/`.

```bash
# bump every asset URL from ?v=5 to ?v=6 in one go
grep -rl '?v=5' index.html pages/*.html | xargs sed -i 's/?v=5/?v=6/g'
```

If a change still will not show, hard-refresh once (Ctrl/Cmd + Shift + R) to clear whatever the
browser already holds.

---

## Pages

| Page | Stage | What is on it |
| --- | --- | --- |
| `index.html` | — | Hero, terminal boot console, mission parameters, the five-stage SPICE pipeline, `F = Δp / Δt` explainer, the selected design schematic, the team |
| `pages/situation.html` | 01 / S | The scenario, the goal, the team, and the three problems the challenge poses at once |
| `pages/problem.html` | 02 / P | The four success criteria (as an interactive checklist), the hard limits, the material budget and the ways the criteria fight each other |
| `pages/investigation.html` | 03 / I | The physics, the four protection principles, the five compared design options, Aayush's four sketches (dimensioned, with their trade-offs), the design decision, and the **impact-force calculator** |
| `pages/construction.html` | 04 / C | Both builds get the same treatment: six real build photos in a gallery, an at-a-glance spec panel and a "why we think this build is special" table beside them — **construction of prototype** closes with the red `IDEA FAILED` verdict, **construction of final** stands as built. Then the rig part by part, a dimensioned exploded schematic, and the materials and tools |
| `pages/evaluation.html` | 05 / E | **Evaluation of prototype** — the drop recording plus three stills of the cracked egg — then **evaluation of final** with its own recording, the same what-worked / what-didn't / what-to-improve / what-we-learned table, the criteria scorecard (three of four met) and the **drop simulator** |

---

## Project structure

```
Tech-Website/
├── index.html                 landing page — hero, pipeline, schematic
├── pages/
│   ├── situation.html         01 / S
│   ├── problem.html           02 / P
│   ├── investigation.html     03 / I  (includes the force calculator)
│   ├── construction.html      04 / C  (prototype + final build)
│   └── evaluation.html        05 / E  (prototype + final reviews, drop simulator)
├── css/
│   ├── tailwind.src.css       Tailwind entry point (@tailwind directives)
│   ├── tailwind.css           compiled output — committed, do not edit by hand
│   └── style.css              the custom "HUD" layer: grid, panels, glow, motion
├── js/
│   ├── main.js                nav, scroll progress, reveals, terminal boot, checklist
│   └── physics.js             force calculator + canvas drop simulator
├── assets/
│   ├── favicon.svg            egg + circuit mark
│   └── media/
│       ├── prototype-build-01.jpg   build 01 photographed: the marked-up canopy sheet,
│       ├── prototype-build-02.jpg   the bladed hub, the canopy curved, the drawn arch,
│       ├── prototype-build-03.jpg   and the classroom it was built in
│       ├── prototype-build-04.jpg
│       ├── prototype-build-05.jpg
│       ├── prototype-build-06.jpg
│       ├── final-build-01.jpg       build 02 photographed: the taped tube shell, the canopy,
│       ├── final-build-02.jpg       the this-way-up labels and the egg it carried
│       ├── final-build-03.jpg
│       ├── final-build-04.jpg
│       ├── final-build-05.jpg
│       ├── final-build-06.jpg
│       ├── prototype-drop.mp4       the build-01 drop, filmed from the landing side
│       ├── prototype-result-01.jpg  the cracked egg afterwards, three angles
│       ├── prototype-result-02.jpg
│       ├── prototype-result-03.jpg
│       ├── final-drop.mp4           the build-02 drop, filmed from the top of the stairwell
│       └── README.md                what else this folder expects (see the README inside)
├── tailwind.config.js         palette, fonts and layout tokens
└── package.json               Tailwind build scripts (dev-only)
```

---

## Running it locally

There are two ways, and only one of them needs Node.

**Just open it.** Open `index.html` in a browser. Every page is static HTML with no server-side
logic, so it works from the file system.

**Serve it properly** (recommended — relative links and the canvas behave exactly as on the live site):

```bash
npm run serve      # http://127.0.0.1:4173
```

### Editing the styles

`css/tailwind.css` is a **compiled file**. The classes are written in the HTML; Tailwind scans those
files and generates only the CSS that is used. If you add new utility classes to the HTML, rebuild:

```bash
npm install          # once — installs Tailwind (the only dependency, dev-only)
npm run watch:css    # rebuilds css/tailwind.css on every save
# or, for a one-off production build:
npm run build:css
```

Because the compiled stylesheet is committed, the host never has to run this — the deployed site
stays a pure static upload. If you would rather not touch Node at all, you can swap the two
`<link>` tags in each page for the Tailwind CDN script instead, at the cost of a runtime warning
and a slower first paint.

### Changing the design tokens

The palette, fonts and the `max-w-wrap` container width live in `tailwind.config.js`. The custom
surface layer (background grid, `.hud` corner brackets, glow, reveal animations, HUD tables)
lives in `css/style.css` and is driven by CSS custom properties at the top of the file:

```css
:root {
  --void:  #04060d;  /* page background */
  --panel: #080d19;  /* panel fill */
  --edge:  rgba(56,189,248,.14); /* hairline borders */
  --neon:  #22d3ee;  /* primary accent — cyan */
  --gold:  #fbbf24;  /* secondary accent — amber */
  --lime:  #a3e635;  /* success state */
}
```

Change `--neon` and `--gold` and the whole site re-themes, including the canvas simulator and the
calculators, which read the same hex values from `tailwind.config.js`.

---

## The interactive parts

### Impact-force calculator — `pages/investigation.html#calculator`

Implements the equation the deck is built around:

```
v  = √(2gh)        impact speed from the drop height
p  = m·v           momentum at the moment of contact
F  = p / t         average force, given how long the egg takes to stop
gₑ = (F / m) / 9.81  deceleration, expressed in g
```

Enter the mass, the drop height and the stopping time, and the readout shows the speed, the
momentum, the average force and the resulting g-load, plus a bar comparing the force against an
approximate 24 N breaking load for a boiled egg. Shorten the stopping time and watch the verdict
flip from *shell holds* to *shell fails* — that is the whole argument of the project in one control.

### Drop simulator — `pages/evaluation.html#simulator`

A small canvas physics loop. Choose a payload (bare egg or the finished device), set the height,
and press **Drop**:

- the **bare egg** falls under gravity alone and stops over ~4 mm, so it lands, cracks, and the
  telemetry reports a few hundred newtons
- the **device** has a parachute, which caps its descent near a terminal velocity, and a cardstock
  shell that collapses over ~9 cm, stretching the stop time and dropping the force by an order of
  magnitude

The verdict line compares the peak force against the same 24 N estimate, so the simulator and the
calculator tell a consistent story.

Both tools are written as one self-disabling module: each checks for its own markup and quietly
does nothing on pages where it is absent.

---

## Features

**Design**

- Dark, high-contrast "engineering console" theme: grid backdrop, radial glows, corner-bracketed
  panels, monospace telemetry labels, scanline-free but glowy
- Space Grotesk for display type, Inter for body copy, JetBrains Mono for labels and data
- Every phase is colour-coded by its position in the pipeline: cyan for the structure, amber for
  the numbers
- Hand-drawn SVG schematics inline — dimensioned and material-labelled, no image files to load,
  crisp at any zoom
- Twelve real build photos in two galleries, both drops on film, and three stills of the egg build
  01 broke. Every media slot in the site holds the real thing — no placeholder art anywhere

**Interaction**

- Terminal boot sequence types the mission parameters out on load
- Scroll reveals: panels rise into place, staggered per column, driven by `IntersectionObserver`
- Reading-progress hairline under the sticky header
- Criteria checklist on the Problem page is tappable
- Sticky nav with the current stage marked via `aria-current`

**Accessibility**

- Semantic landmarks (`header`, `nav`, `main`, `section`, `article`, `footer`) on every page
- Skip-to-content link and visible `:focus-visible` outlines
- Keyboard-operable mobile menu with `aria-expanded` and `aria-controls`
- The simulator exposes its status through an `aria-live` region and gives the canvas a text
  alternative; the calculator outputs are plain text in the DOM, not canvas-only
- Colour is never the only signal — verdicts are written out, not just coloured
- `prefers-reduced-motion: reduce` disables the grid pan, the caret blink and all reveals
- Print styles strip the chrome, the nav and the buttons so the content prints clean

**Performance**

- One compiled 10 KB stylesheet, two small scripts, three font families, and ~15 MB of photos and
  footage — the two recordings are the bulk of it, and both are `preload="metadata"`, so the
  weight only arrives if someone presses play
- No framework, no hydration, no client-side routing
- Ships as plain files — the host serves them directly, with no build step

---

## Editing the content

All the text lives directly in the HTML, so updating a page means editing the page where that
information appears.

| To change | Edit |
| --- | --- |
| The team names or the closing credits | The footer of all six pages, plus the "operators" block on `index.html` |
| Mission parameters (drop trials, materials, deadline) | The parameter list in the hero of `index.html`, and the limits list on `pages/problem.html` |
| The prototype and final reviews | The two `data-table` blocks on `pages/evaluation.html`. Each row is one review point (what worked, what didn't, what to improve, what we learned, verdict); a new finding is a new `<li>` inside its cell |
| The criteria scorecard | The "Met?" cells on `pages/evaluation.html` |
| Build photos + drop recordings | Add a tile to a `.media-grid` gallery in `pages/construction.html` (`#prototype` / `#final`), or replace the `<svg>` inside the `.media-slot` on `pages/evaluation.html` `#final` with a `<video>`. `assets/media/README.md` shows both |
| Which photo or clip is shown | The `src` on the `<img>` or `<video>`. Portrait clips get `.media-slot--clip` (the frame matches the clip, so nothing is cropped); photos sit in `.media-grid` (fixed 2-up / 3-up gallery tiles) or `.media-strip` (a full-width band that reflows) |
| The build photo captions | The `<figcaption>` under each tile — one short line, numbered in shooting order |
| Which drop recording plays | The `src` on the `<video>` in each `.media-slot--clip` on `pages/evaluation.html` — one in `#prototype`, one in `#final` |
| Why each build is special | The two-column `data-table` in each build section of `pages/construction.html` (`#prototype` and `#final`, five rows each, one reason per row) and the closing line under it |
| The red `IDEA FAILED` verdict | The `.stamp-fail` block on `pages/construction.html` (text override in `css/style.css` under *failed-idea stamp*) |
| New sketches | Copy an `<article>` block on `pages/investigation.html` and swap the inline SVG |
| Sketch annotations (dimensions, material labels) | The inline SVG itself. The convention: grey `#8598bd` extension and dimension lines with white `#dbe6f5` values, cyan `#22d3ee` material labels joined by `#0891b2` leader lines. Keep the shared numbers consistent — canopy ⌀ 200 mm, four 100 mm tape lines, 90 mm shell, 45 × 60 mm egg |
| The simulator's breaking-load estimate | `EGG_LIMIT_N` at the top of `js/physics.js` (default 24 N) |
| The simulator's masses and crush distances | The `PARAMS` object in `js/physics.js` |

The review tables are the honest record: both builds failed, for different reasons — build 01 let
the egg slide, build 02 held it still and the shell passed the hit straight through. Rewrite any
line that does not match what actually happened, and keep the criteria scorecard in step with it.
The Construction page is photos end to end: a gallery of six real shots per build, a spec panel and
the "why we think this build is special" table. On Evaluation both drop recordings are real film.

---

## Roadmap

- Get the recordings down in size — the final drop is 8 MB for forty seconds, which is the heaviest
  thing on the site
- Add stills of the final build's cracked egg, to mirror the three on the prototype section
- Photograph each build on its own, clear of the workbench, to sit beside the built-in-progress
gallery shots
- Link Kunj's own site from the "choosing our design" section (the deck refers to it)
- Add a printable one-page build instruction sheet for the "client who knows nothing about the package"
- Unit tests for the physics module once it hardens into something reusable

---

## Credits

- **Design and content:** Aayush &amp; Kunj
- **Source presentation:** *The Egg Droppin' Challenge — a SPICE review*
- **Typography:** Space Grotesk, Inter and JetBrains Mono (Google Fonts)
- **Built with:** HTML5, Tailwind CSS 3, and a few hundred lines of vanilla JavaScript

The 24 N breaking-load figure is a rough classroom estimate for a boiled egg, used to make the
trade-offs visible. It is a teaching aid, not a materials test.

## License

MIT — this project is intended for educational and portfolio purposes.
