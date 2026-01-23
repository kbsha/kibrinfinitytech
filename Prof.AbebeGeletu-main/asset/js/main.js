/* ======================================================
   UTILITIES
====================================================== */
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

/* ======================================================
   HERO SLIDER (SINGLE SOURCE)
====================================================== */
function initHeroSlider() {
  const slides = $$('.hero-slide');
  const dotsWrap = $('.hero-dots');
  const prev = $('.hero-prev');
  const next = $('.hero-next');

  if (!slides.length || !dotsWrap) return;

  let current = 0;
  dotsWrap.innerHTML = '';

  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.addEventListener('click', () => setSlide(i));
    dotsWrap.appendChild(d);
  });

  const dots = $$('button', dotsWrap);

  function setSlide(i) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = i;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  prev?.addEventListener('click', () => setSlide((current - 1 + slides.length) % slides.length));
  next?.addEventListener('click', () => setSlide((current + 1) % slides.length));

  setSlide(0);
}

/* ======================================================
   MOBILE NAV
====================================================== */
function initNavToggle() {
  const toggle = $('.nav-toggle');
  const menu = $('.nav-links');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => menu.classList.toggle('open'));
  $$('a', menu).forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}

/* ======================================================
   SCROLL REVEAL
====================================================== */
function initScrollReveal() {
  const sections = $$('section');
  const reveal = () => {
    sections.forEach(s => {
      if (s.getBoundingClientRect().top < window.innerHeight - 80) {
        s.classList.add('show');
      }
    });
  };
  window.addEventListener('scroll', reveal);
  reveal();
}

/* ======================================================
   COUNTERS
====================================================== */
function initCounters() {
  $$('[data-count]').forEach(el => {
    let n = 0;
    const target = +el.dataset.count;
    const timer = setInterval(() => {
      el.textContent = ++n;
      if (n >= target) clearInterval(timer);
    }, 20);
  });
}

/* ======================================================
   GALLERY ENGINE
====================================================== */
const galleryData = {};
const galleryIndex = {};

async function detectGallery(eventId, folder) {
  galleryData[eventId] = [];
  for (let i = 1; i <= 10; i++) {
    const paths = [
      `asset/events/${folder}/${i}.jpg`,
      `asset/events/${folder}/${i}.JPG`
    ];
    for (const src of paths) {
      try {
        const r = await fetch(src, { method: 'HEAD' });
        if (r.ok) {
          galleryData[eventId].push({ src, caption: `Image ${i}` });
          break;
        }
      } catch {}
    }
    if (galleryData[eventId].length && galleryData[eventId].length < i) break;
  }
  galleryIndex[eventId] = 0;
}

function showGallery(eventId, index) {
  const items = galleryData[eventId];
  if (!items?.length) return;

  galleryIndex[eventId] = index;
  $(`#${eventId}-main-img`).src = items[index].src;
  $(`#${eventId}-caption`).textContent = items[index].caption;
  $(`#${eventId}-img-current`).textContent = index + 1;
}

window.galleryNext = id => showGallery(id, (galleryIndex[id] + 1) % galleryData[id].length);
window.galleryPrev = id => showGallery(id, (galleryIndex[id] - 1 + galleryData[id].length) % galleryData[id].length);

/* ======================================================
   EVENT LOADER
====================================================== */
async function loadEvents() {
  const folders = ['AI_confrence', 'AI_workshop', 'Lab-Demo1'];
  const grid = $('#events-grid');

  for (let i = 0; i < folders.length; i++) {
    const id = `event${i + 1}`;
    const folder = folders[i];

    await detectGallery(id, folder);

    const card = document.createElement('article');
    card.className = 'event-card';
    card.innerHTML = `
      <div class="event-image">
        <img src="asset/events/${folder}/1.jpg">
      </div>
      <div class="event-content">
        <h3>${folder.replace(/_/g, ' ')}</h3>
        <button class="btn-details" onclick="openEventModal('${id}')">View Details</button>
      </div>
    `;
    grid.appendChild(card);
  }
}

/* ======================================================
   EVENT MODALS
====================================================== */
window.openEventModal = id => {
  $(`#${id}-modal`).classList.add('show');
  document.body.style.overflow = 'hidden';
  showGallery(id, 0);
};

window.closeEventModal = id => {
  $(`#${id}-modal`).classList.remove('show');
  document.body.style.overflow = 'auto';
};

/* ======================================================
   BLOG SYSTEM (SAFE + FAST)
====================================================== */
let blogPosts = [];
let blogIndex = 0;

async function loadBlogPosts() {
  try {
    const index = await fetch('_posts/index.json').then(r => r.json());
    for (const name of index) {
      const md = await fetch(`_posts/${name}.md`).then(r => r.text());
      blogPosts.push(parseMarkdown(md));
    }
    renderBlog();
  } catch {
    console.warn('No blog posts found');
  }
}

function parseMarkdown(md) {
  const [, meta, body] = md.split('---');
  const m = {};
  meta.split('\n').forEach(l => {
    const [k, ...v] = l.split(':');
    if (k) m[k.trim()] = v.join(':').trim();
  });
  return { ...m, body };
}

function renderBlog() {
  const c = $('#blog-carousel');
  c.innerHTML = '';
  blogPosts.forEach(p => {
    const d = document.createElement('div');
    d.className = 'blog-card';
    d.innerHTML = `<h3>${p.title}</h3><p>${p.excerpt}</p>`;
    c.appendChild(d);
  });
}

/* ======================================================
   INIT (ONE ENTRY POINT)
====================================================== */
window.addEventListener('DOMContentLoaded', async () => {
  initHeroSlider();
  initNavToggle();
  initScrollReveal();
  initCounters();
  await loadEvents();
  await loadBlogPosts();
});
