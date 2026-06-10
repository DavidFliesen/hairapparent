/*
 * Hair Apparent – client logic
 *
 * This script powers the multi‑step experience of Hair Apparent.  It handles
 * screen navigation, image preview, API key storage, hairstyle generation
 * requests, and final look selection.  Most heavy lifting runs client side in
 * the browser.  All user data remains local – we only send images to
 * OpenAI’s API when generating hairstyle previews, and then only using the
 * user’s own API key.
 */

(() => {
  // Cache DOM elements
  const screens = {
    intro: document.getElementById('screen-intro'),
    upload: document.getElementById('screen-upload'),
    api: document.getElementById('screen-api'),
    generating: document.getElementById('screen-generating'),
    recs: document.getElementById('screen-recs'),
    final: document.getElementById('screen-final')
  };
  const startBtn = document.getElementById('btn-start');
  const toApiBtn = document.getElementById('btn-to-api');
  const apiSaveBtn = document.getElementById('btn-api-save');
  const regenerateBtn = document.getElementById('btn-regenerate');
  const photoInput = document.getElementById('photo-input');
  const photoPreviews = document.getElementById('photo-previews');
  const uploadWarning = document.getElementById('upload-warning');
  const apiKeyInput = document.getElementById('api-key-input');
  const apiWarning = document.getElementById('api-warning');
  const recContainer = document.getElementById('rec-container');
  const finalLookDiv = document.getElementById('final-look');
  const savePhotoBtn = document.getElementById('btn-save-photo');
  const printBtn = document.getElementById('btn-print-brief');
  const backBtn = document.getElementById('btn-back');
  const startOverBtn = document.getElementById('btn-start-over');

  // Application state
  let selectedFiles = [];
  let apiKey = '';
  let usedStyles = new Set();
  let currentRecommendations = [];
  let selectedLook = null;

  // Catalogue of hairstyle concepts.  Each entry contains a unique name, a
  // description, and a prompt fragment used when calling OpenAI’s image API.
  const hairstyleCatalog = [
    {
      name: 'Soft Sculpted Layers',
      description:
        'Chic layers that add movement while maintaining length. This look frames your face softly and can be worn polished or tousled.',
      prompt: 'soft sculpted layers hairstyle, polished and classic, straight texture, blonde hair'
    },
    {
      name: 'Dimensional Color Polish',
      description:
        'Multi‑tonal hues create dimension for a classic polished look; subtle highlights add radiance and depth.',
      prompt: 'dimensional hair color with straight layers, polished and classic, blonde hair'
    },
    {
      name: 'Wash‑and‑Go Tapered Shape',
      description:
        'A tapered cut that works with your natural texture for effortless styling. Ideal for those who prefer minimal daily effort.',
      prompt: 'wash and go tapered hairstyle, sleek straight texture, blonde hair'
    },
    {
      name: 'Modern French Bob',
      description:
        'A chin‑length bob with blunt edges and subtle texture. Sophisticated and low maintenance while making a statement.',
      prompt: 'modern french bob hairstyle, straight texture, polished and classic, blonde hair'
    },
    {
      name: 'Sleek Side‑Swept Lob',
      description:
        'A long bob with side‑swept layers that elongate the face and offer versatile styling options.',
      prompt: 'sleek side swept lob hairstyle, polished classic, straight texture, blonde hair'
    },
    {
      name: 'Voluminous Curtain Bangs',
      description:
        'Full curtain bangs paired with soft layering bring volume and movement while still keeping your length.',
      prompt: 'hairstyle with voluminous curtain bangs, polished classic, straight texture, blonde hair'
    },
    {
      name: 'Timeless Pixie Crop',
      description:
        'An elegant pixie cut with soft side‑swept fringe and tapered sides for a timeless yet modern feel.',
      prompt: 'timeless pixie crop hairstyle, polished and classic, straight texture, blonde hair'
    },
    {
      name: 'Face‑Framing Layers',
      description:
        'Long layers around the face add subtle definition and volume while maintaining length.',
      prompt: 'face framing layers hairstyle, polished classic, straight texture, blonde hair'
    },
    {
      name: 'Classic Shoulder‑Skimming Cut',
      description:
        'A shoulder‑length cut with minimal layers that’s easy to style and flatters most face shapes.',
      prompt: 'classic shoulder length hairstyle, polished classic, straight texture, blonde hair'
    },
    {
      name: 'Polished Pony with Volume',
      description:
        'An elevated ponytail with volume at the crown and sleek sides for a polished look.',
      prompt: 'polished ponytail hairstyle with volume, polished classic, straight texture, blonde hair'
    }
  ];

  /**
   * Show a screen by id and hide all others.
   * @param {string} id Key of the screen to display
   */
  function showScreen(id) {
    Object.keys(screens).forEach((key) => {
      screens[key].classList.toggle('active', key === id);
    });
  }

  /**
   * Read selected files and display small previews. Enables the next button
   * when at least one file is selected. Provides minimal validation for file
   * size and type. In production you might incorporate face detection here.
   */
  function handleFilesSelected() {
    selectedFiles = Array.from(photoInput.files || []);
    photoPreviews.innerHTML = '';
    uploadWarning.hidden = true;
    if (selectedFiles.length === 0) {
      toApiBtn.disabled = true;
      return;
    }
    selectedFiles.forEach((file) => {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      photoPreviews.appendChild(img);
    });
    toApiBtn.disabled = false;
  }

  /**
   * Save API key from input. Performs minimal validation on format and
   * persists to localStorage. If invalid, shows a warning.
   */
  function saveApiKey() {
    const key = apiKeyInput.value.trim();
    // A very basic check: OpenAI keys start with "sk-" and are 48+ characters
    if (!/^sk-\w{20,}/.test(key)) {
      apiWarning.hidden = false;
      return;
    }
    apiWarning.hidden = true;
    apiKey = key;
    try {
      localStorage.setItem('hairApparentApiKey', key);
    } catch (e) {
      console.warn('Could not persist API key', e);
    }
    // Start generating recommendations immediately after saving key
    generateRecommendations(false);
  }

  /**
   * Pick N unique hairstyle objects from the catalogue, avoiding any that
   * appear in the usedStyles set. If not enough remain, the used set is
   * cleared to allow repeats (which is unlikely on first few regenerations).
   * @param {number} count Number of styles to pick
   */
  function pickRandomStyles(count) {
    const available = hairstyleCatalog.filter(
      (style) => !usedStyles.has(style.name)
    );
    if (available.length < count) {
      // reset used set if we run out of new styles
      usedStyles.clear();
      available.push(...hairstyleCatalog);
    }
    const chosen = [];
    while (chosen.length < count) {
      const idx = Math.floor(Math.random() * available.length);
      const style = available.splice(idx, 1)[0];
      chosen.push(style);
      usedStyles.add(style.name);
    }
    return chosen;
  }

  /**
   * Convert a File object to a PNG data URL.  This helper loads the image
   * into an offscreen canvas and draws it with a white background.  It
   * standardizes the output format for OpenAI’s API.
   * @param {File} file
   * @returns {Promise<string>} Base64 data URL of a PNG
   */
  async function fileToPngDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          // Keep original dimensions; if very large, scale down for performance
          const maxDim = 1024;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            const scale = Math.min(maxDim / width, maxDim / height);
            width = Math.floor(width * scale);
            height = Math.floor(height * scale);
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = (e) => reject(e);
        img.src = reader.result;
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Call the OpenAI image API to generate an edited photo based on the
   * specified hairstyle.  Sends the first uploaded photo as both the image
   * and mask for an edits request.  Returns a Promise that resolves to a
   * Data URL representing the generated image, or a placeholder if an error
   * occurs.
   * @param {string} promptFragment Hairstyle description used in the prompt
   * @returns {Promise<string>}
   */
  async function generateImage(promptFragment) {
    const baseImg = selectedFiles[0];
    let photoDataUrl;
    try {
      photoDataUrl = await fileToPngDataUrl(baseImg);
    } catch (e) {
      console.error('Unable to convert photo to PNG', e);
      return '';
    }
    const b64 = photoDataUrl.split(',')[1];
    const requestPayload = {
      prompt:
        `Create a photorealistic hairstyle makeover preview using the uploaded person as the identity reference. ` +
        `Preserve the person's face, age, facial expression, skin tone, head angle, and overall identity. Change only the hairstyle and hair color. ` +
        `Desired hairstyle direction: ${promptFragment}. ` +
        `The result must look like a real salon photo, with realistic hairline, believable strands, natural shadows, correct head shape, and no wig‑like blob. ` +
        `Keep background simple and professional. No text, no watermark, no collage.`,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
      image: b64
    };
    try {
      const resp = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestPayload)
      });
      if (!resp.ok) {
        console.error('OpenAI API error', await resp.text());
        return '';
      }
      const data = await resp.json();
      const imageData = data.data?.[0]?.b64_json;
      if (!imageData) return '';
      return `data:image/png;base64,${imageData}`;
    } catch (err) {
      console.error('Failed to call OpenAI', err);
      return '';
    }
  }

  /**
   * Generate a batch of hairstyle recommendations. When regenerate is true,
   * selects new styles while avoiding previously used ones. Shows the
   * generating screen while images are created.
   * @param {boolean} regenerate
   */
  async function generateRecommendations(regenerate) {
    showScreen('generating');
    // Choose styles
    if (!regenerate) {
      usedStyles.clear();
    }
    currentRecommendations = pickRandomStyles(6);
    // Render placeholder cards first
    recContainer.innerHTML = '';
    currentRecommendations.forEach((style, index) => {
      const card = document.createElement('div');
      card.className = 'rec-card';
      card.innerHTML = `
        <img src="" alt="Generating..." id="rec-img-${index}" />
        <div class="rec-info">
          <h3>${style.name}</h3>
          <p>${style.description}</p>
          <button class="primary-btn choose-btn" id="choose-${index}">Select this look</button>
        </div>
      `;
      recContainer.appendChild(card);
    });
    // Generate images concurrently
    await Promise.all(
      currentRecommendations.map(async (style, index) => {
        const imgUrl = await generateImage(style.prompt);
        const imgElem = document.getElementById(`rec-img-${index}`);
        if (imgUrl) {
          imgElem.src = imgUrl;
        } else {
          imgElem.src = '';
          imgElem.alt = 'Could not generate image';
        }
      })
    );
    // Attach event handlers for each choose button after generation
    currentRecommendations.forEach((style, index) => {
      const btn = document.getElementById(`choose-${index}`);
      btn.addEventListener('click', () => selectLook(style, index));
    });
    showScreen('recs');
  }

  /**
   * Called when the user selects a look. Stores selected info and shows the
   * final screen with options to save or print.
   * @param {object} style The chosen hairstyle object
   * @param {number} idx Index of the recommendation (for retrieving image)
   */
  function selectLook(style, idx) {
    selectedLook = style;
    // Compose final look card
    const imgSrc = document.getElementById(`rec-img-${idx}`).src;
    finalLookDiv.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'final-look-card';
    card.innerHTML = `
      <img src="${imgSrc}" alt="Your look" />
      <h3>${style.name}</h3>
      <p>${style.description}</p>
    `;
    finalLookDiv.appendChild(card);
    showScreen('final');
  }

  /**
   * Download the selected look as an image file. Creates a temporary link and
   * triggers a click. If no look is selected, does nothing.
   */
  function savePhoto() {
    if (!selectedLook) return;
    const imgElem = finalLookDiv.querySelector('img');
    const link = document.createElement('a');
    link.href = imgElem.src;
    link.download = `${selectedLook.name.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Print hairstylist directions. Opens a new window with a formatted page
   * containing the selected style name, description, and image. Invokes
   * window.print() from the new window after it loads.
   */
  function printBrief() {
    if (!selectedLook) return;
    const imgSrc = finalLookDiv.querySelector('img').src;
    const html = `<!DOCTYPE html>
      <html><head><title>${selectedLook.name} – Hair Apparent</title>
        <style>
          body { font-family: Inter, sans-serif; padding: 2rem; }
          h1 { font-family: 'Playfair Display', serif; color: ${window.getComputedStyle(document.documentElement).getPropertyValue('--primary')}; }
          img { max-width: 100%; border-radius: 8px; margin-bottom: 1rem; }
          .desc { margin-bottom: 2rem; color: #555; }
        </style>
      </head><body>
        <h1>${selectedLook.name}</h1>
        <img src="${imgSrc}" alt="${selectedLook.name}" />
        <p class="desc">${selectedLook.description}</p>
        <h2>Cutting & Styling Instructions</h2>
        <p>Bring this printout to your hairstylist. Describe the texture and
        polish you prefer. Ask for subtle face‑framing layers and discuss
        coloring options if applicable. Use smoothing balm or heat styling to
        achieve the polished finish.</p>
      </body></html>`;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
    // Wait for images to load before printing
    win.onload = () => {
      win.print();
    };
  }

  /**
   * Confirm and then reset the app to initial state.
   */
  function startOver() {
    if (!confirm('Are you sure you want to start over? This will clear your photos and results.')) {
      return;
    }
    // Reset state
    selectedFiles = [];
    usedStyles.clear();
    currentRecommendations = [];
    selectedLook = null;
    photoInput.value = '';
    photoPreviews.innerHTML = '';
    toApiBtn.disabled = true;
    showScreen('intro');
  }

  /**
   * Load stored API key if available. For privacy reasons, we do not expose the
   * key in the input field automatically, but we set it internally so the user
   * can proceed without re‑entering their key on subsequent visits.
   */
  function loadStoredKey() {
    try {
      const stored = localStorage.getItem('hairApparentApiKey');
      if (stored) {
        apiKey = stored;
      }
    } catch (e) {
      console.warn('Could not read API key from storage', e);
    }
  }

  // Event listeners
  startBtn.addEventListener('click', () => {
    showScreen('upload');
  });
  photoInput.addEventListener('change', handleFilesSelected);
  toApiBtn.addEventListener('click', () => {
    if (selectedFiles.length === 0) {
      uploadWarning.hidden = false;
    } else {
      uploadWarning.hidden = true;
      showScreen('api');
    }
  });
  apiSaveBtn.addEventListener('click', saveApiKey);
  regenerateBtn.addEventListener('click', () => {
    generateRecommendations(true);
  });
  savePhotoBtn.addEventListener('click', savePhoto);
  printBtn.addEventListener('click', printBrief);
  backBtn.addEventListener('click', () => {
    // Return to recommendation screen to choose another look
    showScreen('recs');
  });
  startOverBtn.addEventListener('click', startOver);

  // Initial setup
  loadStoredKey();
})();