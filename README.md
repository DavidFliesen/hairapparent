# Hair Apparent

**Hair Apparent** is a stylish, local-first hairstyle makeover web app concept for GitHub Pages. It helps a user upload 5–10 photos privately in the browser, answer style questions, receive haircut/color/style recommendations, and create a salon-ready stylist brief.

## Current status

This is a polished static-site MVP/prototype. It includes:

- Responsive premium beauty-tech landing page
- Local photo selection and preview
- Privacy-first messaging
- Style profile questionnaire
- Recommendation cards
- Stylist brief generation
- Copy/download brief tools
- PWA manifest and app icons
- No server and no API key required

## Important AI note

This version does **not** claim to perform true photorealistic generative hairstyle rendering yet. It is designed as the front-end foundation and local-first user experience. True high-quality hair replacement requires either:

1. a future in-browser/WebGPU image-generation pipeline, or  
2. a user-provided API key / local model backend.

Do **not** put a private developer API key inside a public GitHub Pages app. Anyone can inspect the JavaScript and steal it.

## Privacy model

- Photos are selected locally with the browser file picker.
- Photo previews use temporary object URLs.
- The app does not upload files.
- The app does not store photos.
- Refreshing the page clears the photo session.

## Recommended roadmap

### Phase 1 — Static local-first MVP

- Polished UI
- Local photo previews
- Recommendation engine
- Stylist brief generator

### Phase 2 — Local computer vision

Add optional browser-based face and hair analysis using open-source tools such as:

- MediaPipe Face Landmarker
- ONNX Runtime Web
- Transformers.js
- WebGPU where supported

### Phase 3 — Generative preview

Add a rendering mode with one of these safe approaches:

- local in-browser model where hardware permits
- local desktop companion app
- user-provided API key stored only in that user's browser
- no embedded shared developer key

## GitHub Pages deployment

1. Upload this folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Set the branch to `main` and folder to `/root`.
4. Open the generated GitHub Pages URL.

## License

MIT License. See `LICENSE.md`.
