const form = document.getElementById('form');
const radiusRange = document.getElementById('radiusRange');
const label = document.getElementById('label');

form.addEventListener('submit', async e => {
  e.preventDefault();
  await chrome.storage.local.set({ blurRadius: radiusRange.value });
});

async function restoreOptions() {
  const { blurRadius } = await chrome.storage.local.get('blurRadius');
  radiusRange.value = blurRadius;
}
document.addEventListener('DOMContentLoaded', restoreOptions);
