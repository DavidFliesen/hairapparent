# Hair Apparent

**Hair Apparent** is a free, open‑source web app that helps you explore new
hairstyles on your own face using AI. Upload a handful of photos and the app
will generate a curated set of photorealistic hairstyle previews. Pick your
favorite, download the image, and print stylist directions—all without
leaving your browser.

## ✨ Features

* **Mobile‑first, app‑like workflow.** Each step (uploading photos, entering
  your API key, generating looks, and choosing your favorite) lives on its own
  full‑screen panel. This makes the experience feel like a native app rather
  than a long, scrolling web page.
* **Zero server storage.** All photos and API keys are processed locally in
  your browser. Your images are only sent to OpenAI’s API when generating
  previews—and only using your own API key.
* **Automatic hairstyle curation.** Instead of asking you to choose from a
  list of options, the app selects six styles based on a carefully curated
  catalogue of classic cuts and colour techniques. Hit “Regenerate” to get a
  fresh batch without repeats.
* **Photorealistic previews.** Hair Apparent calls
  [OpenAI’s image edits endpoint](https://platform.openai.com/docs/guides/images)
  to blend each hairstyle onto your face. The result looks like a real salon
  photograph—no stickers or cartoonish overlays.
* **Print‑ready stylist brief.** Once you’ve chosen a look, the app can
  produce a simple printout with your selected image, style name,
  description, and cutting/styling suggestions.

## 🚀 Quick start

1. Clone or download this repository and serve the contents of
   `hair_apparent_app` (for example with GitHub Pages or a static file host).
2. Open `index.html` in your browser.
3. Follow the on‑screen steps:
   - Upload 5–10 clear, front‑facing photos.
   - Enter your own OpenAI API key. New OpenAI accounts include free
     image‑generation credits. You can find or create a key at
     <https://platform.openai.com/account/api-keys>.
   - Wait while the app generates six hairstyle ideas.
   - Pick your favourite look. Download or print the stylist directions.

### Do I need to pay?

Hair Apparent itself is completely free. However, generating photorealistic
previews uses OpenAI’s hosted image models, which are charged per request. If
you’re a new OpenAI user, you’ll receive free credits when you create your
account. After that, usage is billed directly by OpenAI. Because the app uses
your API key, your key is never exposed and your account is billed for any
generation requests.

### What happens to my photos?

Your photos never leave your browser except when they’re sent to OpenAI to
generate the previews. We don’t save them, upload them, or log them. The
source images and your API key are stored in local memory only for the
duration of your session.

## 🛠️ Development

* All HTML, CSS and JavaScript live under the `hair_apparent_app` folder. The
  app is self‑contained and uses no frameworks. You can customise the
  catalogue of hairstyles by editing the `hairstyleCatalog` array in
  `app.js`.
* To change the colour palette or typography, edit the CSS variables and
  fonts in `styles.css`.
* Build numbers appear in the footer to help you track versions. Update the
  build string in `index.html` whenever you publish a new iteration.

## 📄 License

Hair Apparent is released under the [MIT License](LICENSE.md). You’re free
to use, modify, and distribute it for personal or commercial projects. There
are **no warranties**—this software is provided *as‑is*.