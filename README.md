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

The project content is unchanged. The physics, the criteria, the four sketches, the build steps and
the problem/fix log all come straight from the presentation.

---

## Live site

| | |
| --- | --- |
| **Deployed** | `https://tech-website.vercel.app` *(update this once your Vercel project is linked)* |
| **Source** | <https://github.com/AayushKumar1028/Tech-Website> |

### Deploying to Vercel

The repository is already a valid static site, so Vercel needs nothing custom — `vercel.json` only
turns on clean URLs (`/pages/situation` instead of `/pages/situation.html`).

**Option A — dashboard**

1. Go to <https://vercel.com/new> and import the `Tech-Website` repository.
2. Framework preset: **Other**. Build command: leave **empty**. Output directory: leave **empty**
   (the site is served from the repository root).
3. Deploy.

**Option B — CLI**

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```

Either way, every push to `main` produces a new deployment automatically.

---

## Pages

| Page | Stage | What is on it |
| --- | --- | --- |
| `index.html` | — | Hero, terminal boot console, mission parameters, the five-stage SPICE pipeline, `F = Δp / Δt` explainer, the selected design schematic, the team |
| `pages/situation.html` | 01 / S | The scenario, the goal, the team, and the three problems the challenge poses at once |
| `pages/problem.html` | 02 / P | The four success criteria (as an interactive checklist), the hard limits, the material budget and the ways the criteria fight each other |
| `pages/investigation.html` | 03 / I | The physics, the four protection principles, the five compared design options, Aayush's four sketches with their trade-offs, the design decision, and the **impact-force calculator** |
| `pages/construction.html` | 04 / C | The final rig part by part, an exploded schematic, materials and tools, the four-step build, and the problems-and-fixes log |
| `pages/evaluation.html` | 05 / E | Test method, the trial-drop log, the **drop simulator**, the criteria scorecard, what worked, what to change, and the conclusion |

---

## Project structure

```
Tech-Website/
├── index.html                 landing page — hero, pipeline, schematic
├── pages/
│   ├── situation.html         01 / S
│   ├── problem.html           02 / P
│   ├── investigation.html     03 / I  (includes the force calculator)
│   ├── construction.html      04 / C
│   └── evaluation.html        05 / E  (includes the drop simulator)
├── css/
│   ├── tailwind.src.css       Tailwind entry point (@tailwind directives)
│   ├── tailwind.css           compiled output — committed, do not edit by hand
│   └── style.css              the custom "HUD" layer: grid, panels, glow, motion
├── js/
│   ├── main.js                nav, scroll progress, reveals, terminal boot, checklist
│   └── physics.js             force calculator + canvas drop simulator
├── assets/
│   └── favicon.svg            egg + circuit mark
├── tailwind.config.js         palette, fonts and layout tokens
├── vercel.json                clean URLs
└── package.json               Tailwind build scripts (dev-only)
```

---

## Running it locally

There are two ways, and only one of them needs Node.

**Just open it.** Open `index.html` in a browser. Every page is static HTML with no server-side
logic, so it works from the file system.

**Serve it properly** (recommended — relative links and the canvas behave exactly as on Vercel):

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

Because the compiled stylesheet is committed, Vercel never has to run this — the deployed site
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
- Hand-drawn SVG schematics inline — no image files to load, crisp at any zoom

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

- One compiled 10 KB stylesheet, two small scripts, three font families, zero images
- No framework, no hydration, no client-side routing
- Ships as plain files — Vercel serves it from the edge with no build step

---

## Editing the content

All the text lives directly in the HTML, so updating a page means editing the page where that
information appears.

| To change | Edit |
| --- | --- |
| The team names or the closing credits | The footer of all six pages, plus the "operators" block on `index.html` |
| Mission parameters (drop trials, materials, deadline) | The parameter list in the hero of `index.html`, and the limits list on `pages/problem.html` |
| The trial-drop results | The `to log` chips in the results table on `pages/evaluation.html` — replace each `<span class="chip">` with the measured height, result and observations |
| The criteria scorecard | The "Met?" cells on `pages/evaluation.html` |
| New sketches | Copy an `<article>` block on `pages/investigation.html` and swap the inline SVG |
| The simulator's breaking-load estimate | `EGG_LIMIT_N` at the top of `js/physics.js` (default 24 N) |
| The simulator's masses and crush distances | The `PARAMS` object in `js/physics.js` |

The trial-drop table is deliberately left open: the final drop happens on **September 21st, 2026**,
and the cells are styled as pending telemetry rather than filled with invented data.

---

## Roadmap

- Fill in the four trial-drop rows with the real measured results
- Record a clip of the actual drop and embed it on the Evaluation page
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
