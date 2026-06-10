# Hair Apparent

Hair Apparent is a private, browser-first hairstyle recommendation studio concept.

This version is designed to work immediately on GitHub Pages. The main `index.html` file is self-contained with inline CSS and JavaScript so the page still looks polished even if asset paths or folders are not copied correctly.

## What it does now

- Presents a polished beauty-tech landing page
- Lets the user select 5–10 photos locally in the browser
- Keeps images on the user's device only
- Collects style preferences, hair texture, complexion, face-shape guess, and maintenance comfort
- Generates practical hairstyle recommendation cards
- Creates a salon-ready stylist brief the user can copy or print

## What it does not do yet

This MVP does **not** pretend to perform true photorealistic generative hair rendering. A real version of that feature would require one of the following:

- Local WebGPU models when browser support and device performance are strong enough
- A local desktop companion app
- A user-provided API key
- A server-side model with clear privacy controls

Do not place a private API key into a public GitHub Pages project.

## Deploying on GitHub Pages

Upload the contents of this folder to your repository and make sure `index.html` is at the root of the published branch.

## License

MIT. See `LICENSE.md`.
