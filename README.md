<p align="center">
  <img src="assets/hair-apparent-logo.png" alt="Hair Apparent logo" width="420">
</p>

# Hair Apparent

**Build: 2026.06.10.005**

**Hair Apparent** is a private, browser-first hairstyle recommendation studio concept. It helps a user upload several photos locally, answer a few style questions, review haircut/color recommendations, and generate a salon-ready brief they can take to a hairstylist.

This version is designed to work immediately on GitHub Pages. The main `index.html` file is self-contained with inline CSS and JavaScript so the page still looks polished even if external CSS or JavaScript paths are not copied correctly.

## Logo path

The README logo uses this relative path:

```text
assets/hair-apparent-logo.png
```

For the logo to show correctly on GitHub, the repository should contain:

```text
README.md
assets/hair-apparent-logo.png
```

## Privacy-first model

Hair Apparent is intended to keep the user’s images on their own device.

- No account required
- No image upload server
- No saved photos
- No hidden API key in the public site
- Browser-local interaction wherever possible

## What it does now

- Presents a polished beauty-tech landing page
- Lets the user select 5–10 photos locally in the browser
- Keeps images on the user’s device only
- Collects style preferences, hair texture, complexion, face-shape guess, and maintenance comfort
- Generates practical hairstyle recommendation cards
- Creates a salon-ready stylist brief the user can copy or print

## What it does not do yet

This MVP does **not** pretend to perform true photorealistic generative hair rendering. A real version of that feature would require one of the following:

- Local WebGPU models when browser support and device performance are strong enough
- A local desktop companion app
- A user-provided API key
- A server-side model with clear privacy controls

Do **not** place a private API key into a public GitHub Pages project. Any key included in client-side JavaScript can be inspected and stolen.

## Recommended future roadmap

### Phase 1: Polished local-first MVP

- Strong visual design
- Local photo picker
- Guided questionnaire
- Hairstyle recommendation engine
- Salon-ready stylist brief

### Phase 2: Local computer vision

- Face landmark detection
- Face-shape guidance
- Hairline and forehead proportion estimates
- Photo quality scoring
- Better recommendation ranking

### Phase 3: Generative preview options

For truly realistic hair previews, the app should offer one or more clearly labeled modes:

1. **Local experimental mode** using WebGPU-capable open-source models when practical.
2. **Bring-your-own-key mode** where the user supplies their own AI API key locally.
3. **Desktop companion mode** for users who want local Stable Diffusion-style generation on their own computer.

## Deploying on GitHub Pages

Upload the contents of the site folder to your repository and make sure `index.html` is at the root of the published branch.

For the README logo to display correctly on GitHub, keep the logo in the `assets` folder:

```text
assets/hair-apparent-logo.png
```

## License

This project is released under the MIT License. See `LICENSE.md`.
