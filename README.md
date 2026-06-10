# Hair Apparent 👑

**Find your crowning look.**

![Hair Apparent logo](hair-apparent-logo-v001.png)

Hair Apparent is a **free, open-source hairstyle advisor** that runs entirely in your browser. It studies 5–10 photos of your face, figures out your face shape and features, and recommends hairstyles that genuinely suit you. When you settle on a final look, it produces a **Stylist Card** — a printable reference sheet you can hand to your barber or stylist so they can recreate the look exactly.

No accounts. No paywall. No photos ever leave your device.

> The name is a play on “heir apparent” — the look that’s rightfully yours. The crown in our logo is made of the four hair textures: straight, wavy, curly, and coily.

-----

## Why this exists

Most “AI hairstyle” apps follow the same playbook: a long quiz funnel, a photo upload to someone else’s server, and a subscription wall right before you see your results. Hair Apparent flips that:

|           |Typical paid apps        |Hair Apparent                                                    |
|-----------|-------------------------|-----------------------------------------------------------------|
|Price      |Subscription / paywall   |Free forever (MIT licensed, zero API costs)                      |
|Your photos|Uploaded to their servers|Analyzed locally, never uploaded                                 |
|Your data  |Account required, tracked|localStorage only, no accounts                                   |
|Output     |Generated previews       |Ranked picks **plus** a Stylist Card your barber can actually use|
|Source code|Closed                   |Open — fork it, improve it                                       |

-----

## How it works

**1. Add your photos (5–10).**
Drop in a handful of clear photos — frontal, profile, different lighting. The app analyzes them right in your browser using on-device face landmark detection. Nothing is transmitted anywhere.

**2. The app studies your features.**
From the landmark data across all your photos, Hair Apparent estimates:

- **Face shape** — oval, round, square, heart, diamond, or oblong (measured from jaw width, cheekbone width, forehead width, and face length ratios)
- **Proportions** — forehead height, jawline angle, facial symmetry
- **Current hair** — approximate length, hairline position, and visible texture
- **Coloring** — skin tone, eye color, and natural hair color sampled from your photos (no quiz needed — though you can confirm or adjust anything it detects)

**3. Tell it your preferences.**
A short, skippable set of questions: maintenance tolerance (wash-and-go vs. daily styling), texture you want to lean into, length range, workplace constraints, and anything you’ve tried before and hated.

**4. Get ranked recommendations.**
A rule-based engine built on classic face-shape styling principles scores every style in the library against your measurements and preferences, then explains *why* each pick works for your face — along with maintenance level and trim interval.

**5. Pick your look — get the Stylist Card.**
The final deliverable is a one-page card (on-screen, printable, or saved as an image) containing:

- Reference image of the chosen style
- **Cut map** — lengths by zone (top / sides / back, in inches and clipper guard numbers where applicable)
- Layering, taper/fade type, and texturizing technique notes
- Styling product type and how to style at home
- Maintenance interval (e.g., “trim every 5–6 weeks”)

Hand it to your stylist. They’ll know exactly what to do.

-----

## Privacy by design

- **Photos never leave your device.** Face analysis runs in-browser via WebAssembly (MediaPipe Face Landmarker). There is no upload endpoint because there is no server.
- **All data lives in localStorage.** Your analysis results, preferences, and saved looks stay in your browser. Clear your browser data and they’re gone.
- **No API keys — yours or ours.** Every part of the app is free, open-source software running in your browser. There is no AI service to pay for, no key to supply, and no key hidden in the code that could be stolen.
- **No analytics, no trackers, no cookies.**

-----

## Tech stack

- **Hosting:** GitHub Pages (100% static — no backend, no build step)
- **Face analysis:** MediaPipe Face Landmarker (WASM, on-device)
- **Recommendations:** rule-based face-shape engine — pure JavaScript, no AI service, no API keys
- **Storage:** browser localStorage only
- **UI:** single-page HTML/CSS/JS

### Code conventions for this repo

- **ES5 JavaScript only** — no template literals, no arrow functions
- **Hardcoded hex colors** — no CSS custom properties
- **Sequential file versioning** — v001, v002, etc.; no overwrites

These conventions exist to keep the codebase safely editable from the GitHub web editor on tablets, which corrupts certain modern syntax.

-----

## Brand palette

|Name          |Hex      |Use                            |
|--------------|---------|-------------------------------|
|Ink Plum      |`#2E2236`|Backgrounds, primary text      |
|Champagne Gold|`#D9A84E`|Crown, accents, primary buttons|
|Warm Ivory    |`#F5EEE3`|Light backgrounds, cards       |
|Rose Copper   |`#C26E5A`|Jewel accents, highlights      |
|Dusk Violet   |`#6B5A78`|Secondary text, captions       |

-----

## Roadmap

- [x] v001 — Photo intake, on-device face analysis, rule-based recommendations, printable Stylist Card
- [ ] v002 — Illustrated style previews (local SVG art in the brand palette — no AI, no keys)
- [ ] v003 — Saved looks gallery and side-by-side comparison
- [ ] v004 — PWA install support for fully offline use
- [ ] v005 — Expanded style library with community-contributed cuts

-----

## Running it

It’s a static site. Open `index.html` in a browser, or visit the GitHub Pages URL once published. That’s it.

-----

## Contributing

Issues and pull requests are welcome. Please follow the code conventions above and keep the privacy promise intact: no feature may transmit user photos or analysis data off-device.

## License

MIT — see <LICENSE.md>. Provided “as is,” without warranty of any kind.

-----

*Created by David Fliesen.*