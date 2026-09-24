'use strict';

// Progressive enhancements: all tutorial content and profile links work without JS.
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  const updateThemeLabel = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    themeToggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  };
  themeToggle.hidden = false;
  updateThemeLabel();
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    updateThemeLabel();
    try { localStorage.setItem('gitstart-theme', next); } catch { /* Storage is optional. */ }
  });
}

for (const image of document.querySelectorAll('img[data-fallback]')) {
  const fallback = () => {
    if (!image.dataset.fallback) return;
    const source = image.dataset.fallback;
    delete image.dataset.fallback;
    image.src = source;
  };
  image.addEventListener('error', fallback, { once: true });
  if (image.complete && image.naturalWidth === 0) fallback();
}

const search = document.getElementById('contributor-search');
if (search) {
  document.getElementById('contributor-filter').hidden = false;
  const cards = [...document.querySelectorAll('.people-grid > li')];
  const status = document.getElementById('search-status');
  search.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    for (const card of cards) {
      card.hidden = !card.textContent.toLocaleLowerCase().includes(query);
      if (!card.hidden) count++;
    }
    status.textContent = `${count} ${count === 1 ? 'contributor' : 'contributors'} found`;
  });
}
