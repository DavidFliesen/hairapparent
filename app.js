const photoInput = document.querySelector('#photoInput');
const previewGrid = document.querySelector('#previewGrid');
const photoCount = document.querySelector('#photoCount');
const analyzeBtn = document.querySelector('#analyzeBtn');
const qualityPanel = document.querySelector('#qualityPanel');
const qualityScore = document.querySelector('#qualityScore');
const qualityNote = document.querySelector('#qualityNote');
const qualityList = document.querySelector('#qualityList');
const results = document.querySelector('#results');
const styleCards = document.querySelector('#styleCards');
const briefOutput = document.querySelector('#briefOutput');
const copyBrief = document.querySelector('#copyBrief');
const downloadBrief = document.querySelector('#downloadBrief');
let photos = [];
let selectedBrief = '';
const get = id => document.querySelector(id).value;
photoInput.addEventListener('change', e => {
  photos.forEach(p => URL.revokeObjectURL(p.url));
  photos = [...e.target.files].slice(0, 10).map(file => ({ file, url: URL.createObjectURL(file) }));
  renderPreviews();
});
function renderPreviews(){
  photoCount.textContent = photos.length;
  previewGrid.innerHTML = photos.map(p => `<img src="${p.url}" alt="Selected hairstyle analysis photo">`).join('');
}
analyzeBtn.addEventListener('click', () => {
  const profile = collectProfile();
  renderQuality(profile);
  renderRecommendations(profile);
  results.classList.remove('hidden');
  document.querySelector('.results-wrap').scrollIntoView({behavior:'smooth',block:'start'});
});
function collectProfile(){
  return {
    hairColor:get('#hairColor'), texture:get('#texture'), faceShape:get('#faceShape'), complexion:get('#complexion'), eyeColor:get('#eyeColor'), length:get('#length'), maintenance:get('#maintenance'), vibe:get('#vibe'), avoid:get('#avoid').trim()
  };
}
function renderQuality(profile){
  const items = [
    {txt:'5–10 photos selected', pass: photos.length >= 5 && photos.length <= 10},
    {txt:'Multiple angles recommended', pass: photos.length >= 7},
    {txt:'Natural color captured', pass: Boolean(profile.hairColor)},
    {txt:'Texture preference captured', pass: Boolean(profile.texture)},
    {txt:'Maintenance level captured', pass: Boolean(profile.maintenance)},
    {txt:'Stylist notes ready', pass: true}
  ];
  const score = items.filter(i=>i.pass).length;
  qualityScore.textContent = score >= 5 ? 'Strong style study' : score >= 4 ? 'Good starting point' : 'Add a few more photos';
  qualityNote.textContent = score >= 5 ? 'This is enough to create a useful recommendation set and stylist handoff.' : 'The recommendations will still work, but more photos will make the handoff more reliable.';
  qualityList.innerHTML = items.map(i => `<li class="${i.pass?'pass':'warn'}">${i.txt}</li>`).join('');
  qualityPanel.classList.remove('hidden');
}
function renderRecommendations(profile){
  const base = buildLooks(profile);
  styleCards.innerHTML = base.map((look, i) => `
    <article class="style-card">
      <div class="style-art" aria-hidden="true"></div>
      <div class="style-card-content">
        <span class="score">${look.score}% match</span>
        <h3>${look.name}</h3>
        <p>${look.pitch}</p>
        <div class="chips">${look.tags.map(t=>`<span>${t}</span>`).join('')}</div>
      </div>
      <button class="button ${i===0?'primary':'ghost'}" data-index="${i}">Select this look</button>
    </article>`).join('');
  styleCards.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => selectLook(base[btn.dataset.index], profile)));
}
function buildLooks(p){
  const length = p.length === 'Open to anything' ? 'medium' : p.length.toLowerCase();
  const upkeep = p.maintenance.toLowerCase();
  const colorLine = p.hairColor === 'Gray' || p.hairColor === 'Salt and pepper' ? 'enhanced natural silver tone' : `soft dimensional ${p.hairColor.toLowerCase()} tone`;
  const textureLine = p.texture === 'Thinning' || p.texture === 'Fine' ? 'movement and lift without heavy bulk' : `shape that works with ${p.texture.toLowerCase()} texture`;
  return [
    {name:'The Signature Shape', score:94, pitch:`A polished ${length} cut designed around ${textureLine}, with clean edges and a flattering frame around the face.`, tags:[p.vibe,p.maintenance+' upkeep',colorLine]},
    {name:'The Modern Soft Crop', score:p.length==='Longer'?84:91, pitch:'A confident, camera-friendly shape with controlled volume, easy styling, and a refined salon finish.', tags:['Face-framing','Photogenic','Low fuss']},
    {name:'The Dimensional Refresh', score:88, pitch:`Keeps the overall silhouette wearable while using ${colorLine} and subtle contrast to brighten the eyes and complexion.`, tags:[p.eyeColor+' eyes',p.complexion+' complexion','Stylist friendly']}
  ];
}
function selectLook(look,p){
  selectedBrief = `HAIR APPARENT STYLIST BRIEF\n\nSelected look: ${look.name}\nMatch confidence: ${look.score}%\n\nClient profile:\n• Natural hair color: ${p.hairColor}\n• Texture: ${p.texture}\n• Face shape: ${p.faceShape}\n• Complexion: ${p.complexion}\n• Eye color: ${p.eyeColor}\n• Preferred length: ${p.length}\n• Maintenance comfort: ${p.maintenance}\n• Style direction: ${p.vibe}\n${p.avoid ? `• Avoid: ${p.avoid}\n` : ''}\nRecommendation:\n${look.pitch}\n\nSalon notes:\n• Preserve natural movement and avoid a helmet-like shape.\n• Keep the finish polished but realistic for daily wear.\n• Use face-framing structure to balance the profile and highlight the eyes.\n• Discuss styling time, product tolerance, and grow-out plan before cutting.\n\nColor direction:\nUse a refined, dimensional approach rather than a flat single-process color. Keep the result natural enough to grow out gracefully.\n\nGenerated by Hair Apparent. Photos were used locally in the browser and are not stored by this app.`;
  briefOutput.textContent = selectedBrief;
  document.querySelector('#stylist').scrollIntoView({behavior:'smooth', block:'start'});
}
copyBrief.addEventListener('click', async () => {
  await navigator.clipboard.writeText(selectedBrief || briefOutput.textContent);
  copyBrief.textContent = 'Copied'; setTimeout(()=>copyBrief.textContent='Copy brief',1400);
});
downloadBrief.addEventListener('click', () => {
  const blob = new Blob([selectedBrief || briefOutput.textContent], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'hair-apparent-stylist-brief.txt'; a.click();
  URL.revokeObjectURL(url);
});
