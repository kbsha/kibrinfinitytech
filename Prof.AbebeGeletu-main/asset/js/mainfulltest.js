'use strict';

/* =========================================================
   APP BOOTSTRAP
========================================================= */
document.addEventListener('DOMContentLoaded', initApp);

async function initApp() {
  initHeroSlider();
  initMobileNav();
  initScrollReveal();
  initCounters();

  await detectAndLoadGalleryImages();
  await autoDetectAndLoadEvents();
  initializeGalleries();
  await loadBlogPosts();
}

/* =========================================================
   HERO SLIDER
========================================================= */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;

  const dots = document.querySelector('.hero-dots');
  const prev = document.querySelector('.hero-prev');
  const next = document.querySelector('.hero-next');

  let current = 0;
  dots.innerHTML = '';

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.onclick = () => setSlide(i);
    dots.appendChild(dot);
  });

  const dotButtons = dots.querySelectorAll('button');

  function setSlide(i) {
    slides[current].classList.remove('active');
    dotButtons[current].classList.remove('active');
    current = i;
    slides[current].classList.add('active');
    dotButtons[current].classList.add('active');
  }

  prev?.addEventListener('click', () =>
    setSlide((current - 1 + slides.length) % slides.length)
  );

  next?.addEventListener('click', () =>
    setSlide((current + 1) % slides.length)
  );

  setSlide(0);
}

/* =========================================================
   MOBILE NAV
========================================================= */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-links');
  if (!toggle || !menu) return;

  toggle.onclick = () => menu.classList.toggle('open');
  menu.querySelectorAll('a').forEach(a =>
    a.onclick = () => menu.classList.remove('open')
  );
}

/* =========================================================
   SCROLL REVEAL
========================================================= */
function initScrollReveal() {
  const sections = document.querySelectorAll('section');
  if (!sections.length) return;

  function reveal() {
    sections.forEach(s => {
      const r = s.getBoundingClientRect();
      if (r.top < window.innerHeight - 80) s.classList.add('show');
    });
  }

  window.addEventListener('scroll', reveal);
  reveal();
}

/* =========================================================
   COUNTERS
========================================================= */
function initCounters() {
  document.querySelectorAll('[data-count]').forEach(c => {
    let n = 0;
    const t = +c.dataset.count;
    const i = setInterval(() => {
      c.textContent = ++n;
      if (n >= t) clearInterval(i);
    }, 20);
  });
}

/* =========================================================
   GALLERY DATA
========================================================= */
const galleryData = {
  event1: [],
  event2: [],
  event3: []
};

const galleryIndex = {
  event1: 0,
  event2: 0,
  event3: 0
};

async function detectAndLoadGalleryImages() {
  const events = [
    { id: 'event1', folder: 'AI_confrence' },
    { id: 'event2', folder: 'AI_workshop' },
    { id: 'event3', folder: 'Lab-Demo1' }
  ];

  for (const e of events) {
    for (let i = 1; i <= 10; i++) {
      const jpg = `asset/events/${e.folder}/${i}.jpg`;
      try {
        const r = await fetch(jpg, { method: 'HEAD' });
        if (r.ok) {
          galleryData[e.id].push({
            src: jpg,
            caption: `Event image ${i}`
          });
        }
      } catch {}
    }
  }
}

/* =========================================================
   EVENTS
========================================================= */
async function autoDetectAndLoadEvents() {
  const folders = ['AI_confrence', 'AI_workshop', 'Lab-Demo1'];
  const grid = document.getElementById('events-grid');
  if (!grid) return;

  folders.forEach((folder, i) => {
    const id = `event${i + 1}`;
    createEventCard(id, folder);
    createEventModal(id);
  });
}

function createEventCard(id, folder) {
  const grid = document.getElementById('events-grid');

  const card = document.createElement('article');
  card.className = 'event-card';
  card.innerHTML = `
    <div class="event-image">
      <img src="asset/events/${folder}/1.jpg">
      <span class="event-badge">Event</span>
    </div>
    <div class="event-content">
      <h3>${folder.replace(/[-_]/g, ' ')}</h3>
      <button class="btn-details" onclick="openEventModal('${id}')">View Details</button>
    </div>
  `;
  grid.appendChild(card);
}

function createEventModal(eventId) {
  if (document.getElementById(eventId + '-modal')) return;

  const modal = document.createElement('div');
  modal.id = eventId + '-modal';
  modal.className = 'event-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" onclick="closeEventModal('${eventId}')">&times;</button>
      <div class="gallery-section">
        <div class="gallery-main">
          <img id="${eventId}-main-img">
          <div class="gallery-counter">
            <span id="${eventId}-img-current">1</span>/<span id="${eventId}-img-total">0</span>
          </div>
          <button onclick="galleryPrev('${eventId}')">❮</button>
          <button onclick="galleryNext('${eventId}')">❯</button>
        </div>
        <p id="${eventId}-caption"></p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function openEventModal(id) {
  document.getElementById(id + '-modal')?.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeEventModal(id) {
  document.getElementById(id + '-modal')?.classList.remove('show');
  document.body.style.overflow = 'auto';
}

/* =========================================================
   GALLERY CONTROLS
========================================================= */
function initializeGalleries() {
  Object.keys(galleryData).forEach(id => {
    if (!galleryData[id].length) return;
    document.getElementById(id + '-main-img').src = galleryData[id][0].src;
    document.getElementById(id + '-img-total').textContent = galleryData[id].length;
  });
}

function showGalleryImage(id, i) {
  const item = galleryData[id][i];
  galleryIndex[id] = i;
  document.getElementById(id + '-main-img').src = item.src;
  document.getElementById(id + '-img-current').textContent = i + 1;
}

function galleryNext(id) {
  const i = (galleryIndex[id] + 1) % galleryData[id].length;
  showGalleryImage(id, i);
}

function galleryPrev(id) {
  const i = (galleryIndex[id] - 1 + galleryData[id].length) % galleryData[id].length;
  showGalleryImage(id, i);
}

/* =========================================================
   BLOG
========================================================= */
let blogPosts = [];
let blogIndex = 0;

async function loadBlogPosts() {
  const carousel = document.getElementById('blog-carousel');
  if (!carousel) return;

  try {
    const files = await fetch('_posts/index.json').then(r => r.json());
    blogPosts = [];

    for (const f of files) {
      const md = await fetch(`_posts/${f}.md`).then(r => r.text());
      blogPosts.push(parseMarkdownPost(md));
    }

    renderBlog();
  } catch {
    carousel.innerHTML = '<p>No blog posts yet.</p>';
  }
}

function parseMarkdownPost(md) {
  const [, fm, body] = md.split('---');
  const meta = {};
  fm.split('\n').forEach(l => {
    const [k, v] = l.split(':');
    if (k) meta[k.trim()] = v?.trim();
  });
  return { ...meta, content: body };
}

function renderBlog() {
  const c = document.getElementById('blog-carousel');
  const p = blogPosts[blogIndex];
  c.innerHTML = `
    <div class="blog-card">
      <h3>${p.title}</h3>
      <p>${p.excerpt || ''}</p>
    </div>
  `;
}


function openEventModal(id) {
  const modal = document.getElementById(id + '-modal');
  if (!modal) return;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeEventModal(id) {
  const modal = document.getElementById(id + '-modal');
  if (!modal) return;

  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}
function openEventModal(id) {
  const modal = document.getElementById(id + '-modal');
  if (!modal) return;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeEventModal(id) {
  const modal = document.getElementById(id + '-modal');
  if (!modal) return;

  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}
