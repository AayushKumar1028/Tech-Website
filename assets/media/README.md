# Real photos and drop recordings live here

Every media slot in the site now holds the real thing — no placeholder drawings left anywhere. This
folder is about 15 MB, and the two recordings are almost all of it.

## What is in the folder

| File | Size | What it is | Where it shows |
| --- | --- | --- | --- |
| `prototype-build-01.jpg` | 228 KB | the canopy sheet, marked up with fold, edge and tape lines | `pages/construction.html`, `#prototype` gallery |
| `prototype-build-02.jpg` | 240 KB | the hub: a folded cone with three flat blades | same gallery |
| `prototype-build-03.jpg` | 173 KB | the blades test-fitted against the curved sheet | same gallery |
| `prototype-build-04.jpg` | 254 KB | the canopy curved and held up, in the classroom | same gallery |
| `prototype-build-05.jpg` | 180 KB | the arch drawn on the curved sheet, close up | same gallery |
| `prototype-build-06.jpg` | 267 KB | the table mid-build, other students at work behind | same gallery |
| `final-build-01.jpg` | 327 KB | the finished shell standing up: four tubes taped into one body, canopy folded over the top | `pages/construction.html`, `#final` gallery |
| `final-build-02.jpg` | 196 KB | the canopy panels taped across the open ends | same gallery |
| `final-build-03.jpg` | 291 KB | looking down into the tube bundle, where the egg drops in | same gallery |
| `final-build-04.jpg` | 252 KB | `THIS WAY UP` and its arrow, drawn on the shell | same gallery |
| `final-build-05.jpg` | 286 KB | `follow the dotted axis` written beside the marker bands | same gallery |
| `final-build-06.jpg` | 366 KB | the shell next to the egg it was built for | same gallery |
| `prototype-drop.mp4` | 3.0 MB | 14 s, 478 × 850 portrait, the build-01 failure | `pages/evaluation.html`, `#prototype` |
| `prototype-result-01.jpg` | 124 KB | egg cracked into plates, yolk showing | `pages/evaluation.html`, `#prototype` |
| `prototype-result-02.jpg` | 116 KB | shell shards loose on the egg | same band |
| `prototype-result-03.jpg` | 105 KB | the cracked patch from a third angle | same band |
| `final-drop.mp4` | 8.2 MB | 40 s, 478 × 850 portrait, the build-02 failure from the balcony to the cracked egg | `pages/evaluation.html`, `#final` |

Every JPEG is 1536 × 2048 (3:4 portrait) and both clips are 478 × 850, straight off a phone.

## Adding photos

Both build sections on the Construction page hold a `.media-grid`: a fixed tile grid, two columns on
a phone and three once there is room. Each tile is a `.media-figure` with an `<img>` and a numbered
`<figcaption>`, so a new photo is one more block at the end:

```html
<figure class="media-figure">
  <img src="../assets/media/final-build-07.jpg" alt="Build 02 photographed side on">
  <figcaption>07 · the shell, side on</figcaption>
</figure>
```

`.media-strip` is the same tile in a band that reflows to the width of the panel — what the three
result photos on the Evaluation page sit in. Both crop their tiles to 3:4, so portrait phone photos
are shown uncropped.

## Swapping or adding a recording

A recording sits in a `.media-slot`, whose caption strip carries the label and the filename:

```html
<div class="media-slot media-slot--clip">
  <video src="../assets/media/prototype-drop.mp4" controls playsinline preload="metadata" width="478" height="850" aria-label="Recording of the prototype drop"></video>
  <p class="media-note m-0"><span>prototype drop · 00:14</span><span class="media-path">assets/media/prototype-drop.mp4</span></p>
</div>
```

## Notes

- Keep the filenames lowercase and numbered in shooting order — some hosts are case-sensitive.
- `.media-slot--clip` matches the clip's own shape (`478 × 850` here) at `max-width: 21rem`,
  centred, so portrait phone footage is never cropped. Change the aspect ratio together with the
  `width` / `height` attributes when you swap in footage of a different shape.
- `preload="metadata"` means the file is only fetched when someone presses play — that is why an
  8 MB clip can sit on the page without slowing the first load down. Keep it on.
- Phone footage is enormous for what it is. The final drop is 8 MB for forty seconds; re-encoding
  on a PC, or trimming it to the ten seconds that matter, is the cheap win.
- WhatsApp filenames arrive with spaces, parentheses and a `.jpeg` extension; rename to something
  short and lowercase before copying, as above.

## After editing

- `css/style.css` or anything in `js/`: bump the `?v=` number on the stylesheet and script links
  in all six pages (see *Updating the site* in the project README). That is what stops the host's
  30-day CSS cache from serving the old file.
- Media files themselves are fine to overwrite in place, but a browser can hold the old copy: if a
  swap seems to do nothing, hard-refresh once, or add `?v=2` to the `src`.
