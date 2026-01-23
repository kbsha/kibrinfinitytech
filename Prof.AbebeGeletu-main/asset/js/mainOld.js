

// to fetch news to index from news html

let newsIndex = 0;
let newsItems = [];

async function loadNewsFromHtml() {
  try {
    const resp = await fetch('news.html');
    if (!resp.ok) throw new Error('Failed to fetch news.html');

    const html = await resp.text();
    const temp = document.createElement('div');
    temp.innerHTML = html;

    newsItems = Array.from(
      temp.querySelectorAll('#news-source .news-item')
    ).slice(0, 5); // 👈 limit to latest 5

    renderNewsSlider();
    startNewsAutoplay();
  } catch (err) {
    console.error('News load error:', err);
  }
}

function renderNewsSlider() {
  const track = document.getElementById('news-track');
  const dots = document.getElementById('news-dots');
  if (!track || !dots) return;

  track.innerHTML = '';
  dots.innerHTML = '';

  newsItems.forEach((item, i) => {
    const slide = document.createElement('div');
    slide.className = 'news-slide';
    slide.innerHTML = item.innerHTML;
    track.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = i === 0 ? 'active' : '';
    dot.onclick = () => goToNews(i);
    dots.appendChild(dot);
  });

  updateNewsPosition(true);
}

function updateNewsPosition(skipAnim = false) {
  const track = document.getElementById('news-track');
  const width = track.parentElement.clientWidth;

  if (skipAnim) {
    track.style.transform = `translateX(-${newsIndex * width}px)`;
  } else {
    track.style.transition = 'transform 0.5s ease';
    track.style.transform = `translateX(-${newsIndex * width}px)`;
  }

  document.querySelectorAll('.news-dots button').forEach((d, i) => {
    d.classList.toggle('active', i === newsIndex);
  });
}

function goToNews(i) {
  newsIndex = i;
  updateNewsPosition();
}

function startNewsAutoplay() {
  setInterval(() => {
    newsIndex = (newsIndex + 1) % newsItems.length;
    updateNewsPosition();
  }, 5000);
}

window.addEventListener('load', loadNewsFromHtml);




// slide the hero with photos 
// window.addEventListener('DOMContentLoaded', () => {
//   const slides = document.querySelectorAll('.hero-slide');
//   const dots = document.querySelector('.hero-dots');
//   const prev = document.querySelector('.hero-prev');
//   const next = document.querySelector('.hero-next');

//   let current = 0;

//   slides.forEach((_, idx) => {
//     const dot = document.createElement('button');
//     dot.addEventListener('click', () => setSlide(idx));
//     dots.appendChild(dot);
//   });

//   const dotButtons = dots.querySelectorAll('button');

//   function setSlide(index) {
//     slides[current].classList.remove('active');
//     dotButtons[current].classList.remove('active');

//     current = index;

//     slides[current].classList.add('active');
//     dotButtons[current].classList.add('active');
//   }

//   next.addEventListener('click', () => setSlide((current + 1) % slides.length));
//   prev.addEventListener('click', () => setSlide((current - 1 + slides.length) % slides.length));

//   setSlide(0);
// });


//   //sidable hero slider
  
//   const slides = document.querySelectorAll('.hero-slide');
//   const dots = document.querySelector('.hero-dots');
//   const prev = document.querySelector('.hero-prev');
//   const next = document.querySelector('.hero-next');

//   let current = 0;

//   // Create dots
//   slides.forEach((_, idx) => {
//     const dot = document.createElement('button');
//     dot.addEventListener('click', () => setSlide(idx));
//     dots.appendChild(dot);
//   });

//   const dotButtons = dots.querySelectorAll('button');

//   function setSlide(index) {
//     slides[current].classList.remove('active');
//     dotButtons[current].classList.remove('active');

//     current = index;

//     slides[current].classList.add('active');
//     dotButtons[current].classList.add('active');
//   }

//   next.addEventListener('click', () => setSlide((current + 1) % slides.length));
//   prev.addEventListener('click', () => setSlide((current - 1 + slides.length) % slides.length));

//   // initialize
//   setSlide(0);

//   // Autoplay functionality for first logo photo of prof 
window.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelector('.hero-dots');
  const prev = document.querySelector('.hero-prev');
  const next = document.querySelector('.hero-next');

  let current = 0;
  let autoplay = null;
  const INTERVAL = 5000; // 5 seconds

  if (!slides.length) return;

  // Create dots
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.addEventListener('click', () => {
      setSlide(idx);
      restartAutoplay();
    });
    dots.appendChild(dot);
  });

  const dotButtons = dots.querySelectorAll('button');

  function setSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    dotButtons.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    current = index;
  }

  function nextSlide() {
    setSlide((current + 1) % slides.length);
  }

  function prevSlide() {
    setSlide((current - 1 + slides.length) % slides.length);
  }

  function startAutoplay() {
    autoplay = setInterval(nextSlide, INTERVAL);
  }

  function restartAutoplay() {
    clearInterval(autoplay);
    startAutoplay();
  }

  // Controls
  next?.addEventListener('click', () => {
    nextSlide();
    restartAutoplay();
  });

  prev?.addEventListener('click', () => {
    prevSlide();
    restartAutoplay();
  });

  // Init
  setSlide(0);
  startAutoplay();
});



  
 
// mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-links');

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => {
      menu.classList.remove('open');
    })
  );

  
// scroll reveal
const sections = document.querySelectorAll('section');
function reveal(){
  sections.forEach(s=>{
    const r=s.getBoundingClientRect();
    if(r.top < window.innerHeight - 80) s.classList.add('show');
  });
}
window.addEventListener('scroll', reveal);
reveal();

// counters
const counters = document.querySelectorAll('[data-count]');
counters.forEach(c=>{
  let n = 0;
  const t = +c.dataset.count;
  const i = setInterval(()=>{
    n++;
    c.textContent = n;
    if(n >= t) clearInterval(i);
  }, 20);
});

// DYNAMIC GALLERY DATA - Will be populated from actual image counts
let galleryData = {
  event1: [],
  event2: [],
  event3: []
};

let galleryIndex = { event1: 0, event2: 0, event3: 0 };

// Function to detect how many images exist in a folder
async function detectAndLoadGalleryImages() {
  const eventFolders = [
    { id: 'event1', folder: 'AI_confrence' },
    { id: 'event2', folder: 'AI_workshop' },
    { id: 'event3', folder: 'Lab-Demo' }
  ];
  
  for (const event of eventFolders) {
    // Try to find images by attempting to load them sequentially
    let imageCount = 0;
    let foundImages = [];
    
    // Check for images 1-10 (common range)
    for (let i = 1; i <= 10; i++) {
      // Try both .jpg and .JPG extensions
      const jpgPath = `asset/events/${event.folder}/${i}.jpg`;
      const JPGPath = `asset/events/${event.folder}/${i}.JPG`;
      
      let imagePath = null;
      
      // Check if jpg exists
      try {
        const response = await fetch(jpgPath, { method: 'HEAD' });
        if (response.ok) {
          imagePath = jpgPath;
        }
      } catch (e) {}
      
      // If jpg doesn't exist, try JPG
      if (!imagePath) {
        try {
          const response = await fetch(JPGPath, { method: 'HEAD' });
          if (response.ok) {
            imagePath = JPGPath;
          }
        } catch (e) {}
      }
      
      // If found, add to images
      if (imagePath) {
        foundImages.push({
          type: 'image',
          src: imagePath,
          caption: `Event image ${i}`
        });
      } else {
        // Stop searching if we find a gap
        if (foundImages.length > 0) break;
      }
    }
    
    // Store found images in galleryData
    if (foundImages.length > 0) {
      galleryData[event.id] = foundImages;
      console.log(`Found ${foundImages.length} images for ${event.id}`);
    } else {
      console.warn(`No images found for ${event.id} in asset/events/${event.folder}/`);
    }
  }
}

// DYNAMIC GALLERY DATA - Maps to actual event folders
const galleryDataOld = {
  event1: [
    { type: 'image', src: 'asset/events/AI_confrence/1.jpg', caption: 'Opening keynote session with international speakers' },
    { type: 'image', src: 'asset/events/AI_confrence/2.jpg', caption: 'Prof. Geletu presenting keynote address' },
    { type: 'image', src: 'asset/events/AI_confrence/3.jpg', caption: 'Panel discussion on trustworthy AI systems' },
    { type: 'image', src: 'asset/events/AI_confrence/4.jpg', caption: 'International audience attending the conference' }
  ],
  event2: [
    { type: 'image', src: 'asset/events/AI_workshop/1.JPG', caption: 'Workshop introduction and course overview' },
    { type: 'image', src: 'asset/events/AI_workshop/2.JPG', caption: 'Hands-on programming session in the lab' },
    { type: 'image', src: 'asset/events/AI_workshop/3.JPG', caption: 'Lecture on Model Predictive Control theory' },
    { type: 'image', src: 'asset/events/AI_workshop/4.JPG', caption: 'Group work and collaborative problem solving' }
  ],
  event3: [
    { type: 'image', src: 'asset/events/Lab-Demo/1.jpg', caption: 'Opening ceremony - Sustainable AI Conference' },
    { type: 'image', src: 'asset/events/Lab-Demo/2.jpg', caption: 'Panel discussion on renewable energy optimization' },
    { type: 'image', src: 'asset/events/Lab-Demo/3.jpg', caption: 'Live demonstration of AI energy systems' },
    { type: 'image', src: 'asset/events/Lab-Demo/4.jpg', caption: 'Networking session with international experts' }
  ]
};

let galleryIndexOld = { event1: 0, event2: 0, event3: 0 };

// AUTO-DETECT EVENT FILES AND LOAD EVERYTHING FROM THEM
async function autoDetectAndLoadEvents() {
  const eventFiles = ['AI_confrence', 'AI_workshop', 'Lab-Demo'];
  let eventIndex = 1;
  
  for (const folderName of eventFiles) {
    const eventFile = `events/${folderName}.html`;
    
    try {
      const response = await fetch(eventFile);
      if (!response.ok) {
        console.warn(`Event file not found: ${eventFile}`);
        continue;
      }
      
      const html = await response.text();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Extract all metadata from the HTML file
      const previewDiv = tempDiv.querySelector('.event-preview');
      const modalHeader = tempDiv.querySelector('.modal-header');
      
      if (!previewDiv || !modalHeader) {
        console.warn(`Invalid structure in ${eventFile}`);
        continue;
      }
      
      // Get preview text
      const previewText = previewDiv.querySelector('p').textContent;
      
      // Get title from modal-header h2
      const title = modalHeader.querySelector('h2').textContent.trim();
      
      // Get date and location from event-meta-large
      const metaSpans = modalHeader.querySelectorAll('.event-meta-large span');
      const date = metaSpans[0]?.textContent.trim() || 'Date TBA';
      const location = metaSpans[1]?.textContent.trim() || 'Location TBA';
      
      // Create event card
      const eventId = `event${eventIndex}`;
      createEventCard({
        id: eventId,
        folder: folderName,
        title: title,
        date: date,
        location: location,
        preview: previewText,
        imageFile: eventFile  // Store reference to HTML file
      });
      
      eventIndex++;
      
    } catch (error) {
      console.warn(`Error loading ${eventFile}:`, error);
    }
  }
}

// Create event card dynamically
function createEventCard(event) {
  const eventsGrid = document.getElementById('events-grid');
  
  const eventCard = document.createElement('article');
  eventCard.className = 'event-card';
  eventCard.setAttribute('data-event-id', event.id);
  
  eventCard.innerHTML = `
    <div class="event-image">
      <img src="asset/events/${event.folder}/1.jpg" alt="${event.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22400%22 height=%22300%22/%3E%3C/svg%3E'">
      <span class="event-badge">Event</span>
    </div>
    <div class="event-content">
      <div class="event-meta">
        <span class="event-date">📅 ${event.date}</span>
        <span class="event-location">📍 ${event.location}</span>
      </div>
      <h3>${event.title}</h3>
      <p class="event-description">${event.preview}</p>
      <div class="event-tags"></div>
      <button class="btn-details" onclick="openEventModal('${event.id}')">View Details</button>
    </div>
  `;
  
  eventsGrid.appendChild(eventCard);
}

// Load full event content from events/ files
async function loadEventContent(eventId) {
  const eventFiles = ['AI_confrence', 'AI_workshop', 'Lab-Demo'];
  const fileIndex = parseInt(eventId.replace('event', '')) - 1;
  
  if (fileIndex < 0 || fileIndex >= eventFiles.length) return;
  
  const folderName = eventFiles[fileIndex];
  const eventFile = `events/${folderName}.html`;
  
  try {
    const response = await fetch(eventFile);
    if (!response.ok) throw new Error('Failed to load: ' + eventFile);
    
    const html = await response.text();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Remove preview div from full content
    const preview = tempDiv.querySelector('.event-preview');
    if (preview) preview.remove();
    
    // Get remaining content
    const content = tempDiv.innerHTML;
    
    const contentContainer = document.getElementById(eventId + '-content');
    if (contentContainer) {
      contentContainer.innerHTML = content;
    }
  } catch (error) {
    console.error('Error loading event content:', error);
    const contentContainer = document.getElementById(eventId + '-content');
    if (contentContainer) {
      contentContainer.innerHTML = '<p style="color: red;">Error loading content. Check console.</p>';
    }
  }
}

function initializeGalleries() {
  Object.keys(galleryData).forEach(eventId => {
    const items = galleryData[eventId];
    if (items.length > 0) {
      const mainImg = document.getElementById(eventId + '-main-img');
      const caption = document.getElementById(eventId + '-caption');
      const counter = document.getElementById(eventId + '-img-total');
      
      if (mainImg) {
        mainImg.src = items[0].src;
        mainImg.onerror = function() {
          console.warn('Image not found: ' + items[0].src);
          this.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2224%22%3EImage not found%3C/text%3E%3C/svg%3E';
        };
      }
      if (caption) caption.textContent = items[0].caption;
      if (counter) counter.textContent = items.length; // Now shows actual count!
      updateThumbnailGallery(eventId);
    }
  });
}

function updateThumbnailGallery(eventId) {
  const modal = document.getElementById(eventId + '-modal');
  const thumbnailContainer = modal.querySelector('.gallery-thumbnails');
  
  thumbnailContainer.innerHTML = '';
  
  galleryData[eventId].forEach((item, index) => {
    const thumb = document.createElement('img');
    thumb.src = item.src;
    thumb.alt = 'Thumbnail ' + (index + 1);
    thumb.className = 'thumb' + (index === 0 ? ' active' : '');
    thumb.onclick = () => showGalleryImage(eventId, index);
    thumb.onerror = function() {
      this.style.backgroundColor = '#ddd';
    };
    thumbnailContainer.appendChild(thumb);
  });
}

function showGalleryImage(eventId, index) {
  const items = galleryData[eventId];
  if (index < 0 || index >= items.length) return;
  
  galleryIndex[eventId] = index;
  const item = items[index];
  
  const mainImg = document.getElementById(eventId + '-main-img');
  const caption = document.getElementById(eventId + '-caption');
  const current = document.getElementById(eventId + '-img-current');
  
  mainImg.src = item.src;
  mainImg.onerror = function() {
    this.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2224%22%3EImage not found%3C/text%3E%3C/svg%3E';
  };
  
  if (caption) caption.textContent = item.caption;
  if (current) current.textContent = index + 1;
  
  updateThumbnailActive(eventId);
}

function galleryNext(eventId) {
  const items = galleryData[eventId];
  const newIndex = (galleryIndex[eventId] + 1) % items.length;
  showGalleryImage(eventId, newIndex);
}

function galleryPrev(eventId) {
  const items = galleryData[eventId];
  const newIndex = (galleryIndex[eventId] - 1 + items.length) % items.length;
  showGalleryImage(eventId, newIndex);
}

function updateThumbnailActive(eventId) {
  const modal = document.getElementById(eventId + '-modal');
  const thumbs = modal.querySelectorAll('.thumb');
  thumbs.forEach((t, i) => {
    if (i === galleryIndex[eventId]) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });
}

// Lightbox Function
function openLightbox(imgSrc) {
  const lightbox = document.getElementById('lightbox');
  document.getElementById('lightbox-img').src = imgSrc;
  lightbox.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('show');
  document.body.style.overflow = 'auto';
}

// Event Modal Functions
function openEventModal(eventId) {
  const modal = document.getElementById(eventId + '-modal');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  loadEventContent(eventId);
}

function closeEventModal(eventId) {
  document.getElementById(eventId + '-modal').classList.remove('show');
  document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('event-modal')) {
    e.target.classList.remove('show');
    document.body.style.overflow = 'auto';
  }
});

// Auto-generate modals for detected events
document.addEventListener('DOMContentLoaded', function() {
  const eventFiles = ['AI_confrence', 'AI_workshop', 'Lab-Demo'];
  const container = document.body;
  
  eventFiles.forEach((file, index) => {
    const eventId = `event${index + 1}`;
    const modal = document.createElement('div');
    modal.id = eventId + '-modal';
    modal.className = 'event-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" onclick="closeEventModal('${eventId}')">&times;</button>
        
        <div class="gallery-section">
          <h3>Event Gallery</h3>
          <div class="gallery-main">
            <img id="${eventId}-main-img" src="" alt="Event image">
            <div class="gallery-counter"><span id="${eventId}-img-current">1</span>/<span id="${eventId}-img-total">?</span></div>
            <button class="gallery-nav prev" onclick="galleryPrev('${eventId}')">❮</button>
            <button class="gallery-nav next" onclick="galleryNext('${eventId}')">❯</button>
          </div>
          <div class="gallery-thumbnails"></div>
          <p class="gallery-caption" id="${eventId}-caption"></p>
        </div>

        <div id="${eventId}-content"></div>
      </div>
    `;
    container.appendChild(modal);
  });
});

// Blog carousel variables
let blogPosts = [];
let currentBlogIndex = 0;
let blogAutoplayInterval = null;

/* Replace the previous loadBlogPosts() with the following */
async function scanPostCandidates(days = 60) {
  const candidates = new Set();
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const patterns = [
      `${dateStr}-build-portfolio-website`,
      `${dateStr}-post`,
      `${dateStr}-blog`,
      `${dateStr}-article`,
      `${dateStr}-research`,
      `${dateStr}-note`,
      `${dateStr}-tutorial`,
      `${dateStr}-guide`,
      `${dateStr}-insight`
    ];
    patterns.forEach(p => candidates.add(p));
  }
  // Add known specific names
  ['latest-post','first-post','2025-12-28-build-portfolio-website','2025-12-27-research-insights','2025-12-26-machine-learning-guide','2025-12-25-sustainable-ai'].forEach(p=>candidates.add(p));
  const found = [];
  for (const name of candidates) {
    try {
      const resp = await fetch(`_posts/${name}.md`);
      if (resp.ok) found.push(name);
    } catch(e){}
  }
  return found;
}

// Try to read a directory listing from the server (if enabled). Returns array of filenames (including .md)
async function fetchPostsFromDirListing() {
  try {
    const resp = await fetch('_posts/');
    if (!resp.ok) {
      console.warn('Directory listing not available (_posts/ returned ' + resp.status + ')');
      return [];
    }
    const text = await resp.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const links = Array.from(doc.querySelectorAll('a'))
      .map(a => a.getAttribute('href'))
      .filter(h => h && /\.md$/i.test(h))
      .map(h => {
        // keep just filename
        const parts = h.split('/');
        return decodeURIComponent(parts[parts.length - 1]);
      });
    // Deduplicate
    return Array.from(new Set(links));
  } catch (e) {
    console.warn('Error fetching directory listing for _posts/:', e);
    return [];
  }
}

async function loadBlogPosts() {
  blogPosts = [];
  try {
    let files = [];
    const idxResp = await fetch('_posts/index.json');
    if (idxResp.ok) {
      files = await idxResp.json(); // expects array of basenames (no .md)
      console.log('Loaded posts index.json:', files);
    } else {
      console.warn('index.json not found, scanning _posts/ by pattern...');
      files = await scanPostCandidates(60);
    }

    // ALSO try directory listing and include any .md files found there (supports filenames with spaces)
    const dirFiles = await fetchPostsFromDirListing();
    if (dirFiles && dirFiles.length) {
      console.log('Found posts via directory listing:', dirFiles);
      // Merge into files (normalize to basenames without .md)
      const set = new Set(files.map(f => f.replace(/\.md$/i, '')));
      dirFiles.forEach(f => set.add(f.replace(/\.md$/i, '')));
      files = Array.from(set);
    }

    for (const name of files) {
      const fname = name.endsWith('.md') ? name : `${name}.md`;
      try {
        // encode to handle spaces and special characters
        const resp = await fetch(`_posts/${encodeURIComponent(fname)}`);
        if (!resp.ok) {
          console.warn('Failed to load post', fname, resp.status);
          continue;
        }
        const md = await resp.text();
        const post = parseMarkdownPost(md);
        if (post && !blogPosts.some(p => p.title === post.title)) {
          post._file = fname; // store source file for on-demand fetch
          blogPosts.push(post);
        }
      } catch (e) {
        console.warn('Error fetching', fname, e);
      }
    }

    blogPosts.sort((a,b)=> new Date(b.date) - new Date(a.date));
    console.log(`Total posts loaded: ${blogPosts.length}`);

    if (blogPosts.length > 0) {
      displayBlogCarousel();
      startBlogAutoplay();
    } else {
      const carousel = document.getElementById('blog-carousel');
      if (carousel) carousel.innerHTML = '<div class="blog-card" style="flex: 0 0 100%;"><h3>No posts available yet</h3><p>Check back soon for new research insights and articles.</p></div>';
    }
  } catch (error) {
    console.error('Error in loadBlogPosts:', error);
  }
}

// Parse markdown with YAML frontmatter
function parseMarkdownPost(markdown) {
  try {
    const parts = markdown.split('---');
    
    if (parts.length < 3) {
      return null;
    }
    
    const frontmatterText = parts[1];
    const content = parts.slice(2).join('---').trim();
    
    const metadata = {};
    const lines = frontmatterText.split('\n');
    
    lines.forEach(line => {
      line = line.trim();
      if (!line) return;
      
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) return;
      
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      value = value.replace(/^["']|["']$/g, '');
      
      metadata[key] = value;
    });
    
    return {
      title: metadata.title || 'Untitled',
      date: metadata.date || new Date().toISOString().split('T')[0],
      category: metadata.category || 'general',
      author: metadata.author || 'Author',
      excerpt: metadata.excerpt || content.substring(0, 150) + '...',
      content: content
    };
    
  } catch (error) {
    return null;
  }
}

// Basic markdown to HTML converter (supports headings, lists, bold, italic, inline code)
function markdownToHtml(markdown) {
  if (!markdown) return '';
  let html = String(markdown);

  // Headings
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  // Bold & italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`([^`]+?)`/g, '<code style="background:#f0f4f8;padding:0.15rem 0.35rem;border-radius:4px;font-family:monospace;">$1</code>');

  // List items (convert lines starting with "- " to <li>)
  html = html.replace(/^\s*-\s+(.*)$/gm, '<li>$1</li>');
  // Wrap consecutive <li> into <ul>
  html = html.replace(/(<li>[\s\S]*?<\/li>)+/g, match => `<ul style="padding-left:1.2rem;margin:0.6rem 0;">${match}</ul>`);

  // Convert double newlines into paragraphs (skip lines already starting with HTML tags)
  html = html.split(/\n\s*\n/).map(block => {
    if (block.match(/^\s*<(h|ul|pre|blockquote|code|img)/i)) return block;
    return '<p style="margin:0.8rem 0;">' + block.replace(/\n/g, '<br>') + '</p>';
  }).join('\n\n');

  return html;
}

// Display blog carousel
function displayBlogCarousel() {
  const carousel = document.getElementById('blog-carousel');
  const dotsContainer = document.getElementById('blog-dots');
  if (!carousel || !dotsContainer) return;

  // Remove gap while sliding to avoid layout surprises, restore if you like
  carousel.style.gap = '0';

  carousel.innerHTML = '';
  dotsContainer.innerHTML = '';

  blogPosts.forEach((post, index) => {
    const card = createBlogCard(post, index);
    carousel.appendChild(card);

    const dot = document.createElement('button');
    dot.dataset.index = index;
    dot.style.cssText = `
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid #0f2a44;
      background: ${index === 0 ? '#0f2a44' : '#fff'};
      cursor: pointer;
      transition: .3s;
    `;
    dot.addEventListener('click', () => goToBlogSlide(index));
    dotsContainer.appendChild(dot);
  });

  // Ensure first slide visible
  currentBlogIndex = 0;
  updateBlogCarousel(true);
}

// Create a blog card
function createBlogCard(post, index) {
  const card = document.createElement('div');
  card.className = 'blog-card';
  card.style.cssText = `
    flex: 0 0 100%;
    box-sizing: border-box;
    margin-right: 0; /* gap managed on outer container if desired */
  `;

  let formattedDate = post.date;
  try {
    const dateObj = new Date(post.date + 'T00:00:00Z');
    formattedDate = dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {}

  const categoryLabel = (post.category || 'General').charAt(0).toUpperCase() + (post.category || 'general').slice(1);
  // store source filename for on-demand fetch
  const sourceFile = post._file || '';

  // Build card: use a link that references the source file
  card.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem;gap:1rem;">
      <h3 style="margin:0;flex:1;">${escapeHtml(post.title)}</h3>
      <span style="font-size:0.75rem;background:linear-gradient(135deg,#e5eef7,#dbeafe);padding:0.3rem 0.6rem;border-radius:999px;color:#0f2a44;font-weight:600;white-space:nowrap;flex-shrink:0;">${escapeHtml(categoryLabel)}</span>
    </div>
    <p style="font-size:0.85rem;color:#6b7280;margin:0.5rem 0;">${escapeHtml(formattedDate)} • ${escapeHtml(post.author)}</p>
    <p>${escapeHtml(post.excerpt)}</p>
    <a href="#" class="blog-read-link" data-file="${escapeHtml(sourceFile)}" style="font-weight:600;color:#513b1f;text-decoration:none;cursor:pointer;">Read full post →</a>
  `;

  // Attach click handler: fetch the markdown file on demand and show modal
  const link = card.querySelector('.blog-read-link');
  link.addEventListener('click', async function(e) {
    e.preventDefault();

    const idx = index;
    const postObj = blogPosts[idx];
    // prefer stored filename, fallback to data-file attribute
    const sourceFile = post._file || this.dataset.file || '';

    console.log('Read full clicked:', { index: idx, title: postObj?.title, sourceFile });

    // Show lightweight loading modal
    const loadingModal = document.createElement('div');
    loadingModal.className = 'event-modal';
    loadingModal.style.display = 'flex';
    loadingModal.style.alignItems = 'center';
    loadingModal.style.justifyContent = 'center';
    loadingModal.innerHTML = `
      <div class="modal-content" style="max-width:600px;padding:2rem;text-align:center;">
        <p style="margin:0;color:#6b7280">Loading post…</p>
      </div>
    `;
    document.body.appendChild(loadingModal);
    document.body.style.overflow = 'hidden';

    try {
      // If content was parsed already, use it (fast)
      if (postObj && postObj.content && postObj.content.trim().length > 0) {
        console.log('Using cached content for:', postObj.title);
        loadingModal.remove();
        openBlogModal(postObj.title, postObj.content);
        return;
      }

      // Fallback: fetch the file directly (try provided filename and data-file)
      if (!sourceFile) throw new Error('No source filename available for this post');

      // Try direct fetch with provided name
      console.log('Fetching from _posts/' + sourceFile);
      let resp = await fetch('_posts/' + sourceFile);
      if (!resp.ok) {
        // try decoding the dataset value (if it was encoded or different)
        const alt = decodeURIComponent(this.dataset.file || '');
        if (alt && alt !== sourceFile) {
          console.log('Retrying fetch with alternative path:', alt);
          resp = await fetch('_posts/' + alt);
        }
      }
      if (!resp.ok) throw new Error('Fetch failed (status ' + resp.status + '). Are you running via file://? Use a local server.');

      const md = await resp.text();
      const parsed = parseMarkdownPost(md);
      if (!parsed) throw new Error('Failed to parse markdown/frontmatter');

      // Cache and show
      postObj.content = parsed.content;
      postObj.title = parsed.title || postObj.title;
      loadingModal.remove();
      openBlogModal(parsed.title, parsed.content);

    } catch (err) {
      console.error('Error loading full post:', err);
      loadingModal.innerHTML = `
        <div class="modal-content" style="max-width:600px;padding:2rem;text-align:center;">
          <h3 style="margin:0 0 0.5rem 0;color:#c53030">Error loading post</h3>
          <p style="margin:0 0 1rem 0;color:#6b7280">${escapeHtml(err.message)}</p>
          <p style="margin:0;color:#6b7280;font-size:0.9rem;">If you're opening files locally (file://), fetch may be blocked. Run a local server (e.g. <code>python -m http.server</code>).</p>
          <div style="margin-top:1rem;"><button onclick="this.closest('.event-modal').remove(); document.body.style.overflow='auto'" style="padding:0.6rem 1rem;border-radius:8px;border:none;background:#0f2a44;color:#fff;cursor:pointer">Close</button></div>
        </div>
      `;
    }
  });

  return card;
}

// Update carousel position by scrolling
function updateBlogCarousel(skipSmooth = false) {
  const carousel = document.getElementById('blog-carousel');
  if (!carousel) return;

  const width = carousel.clientWidth;
  // scrollLeft works reliably with flex children
  if (skipSmooth) {
    carousel.scrollLeft = currentBlogIndex * width;
  } else {
    carousel.scrollTo({ left: currentBlogIndex * width, behavior: 'smooth' });
  }

  // Update dots
  const dots = document.querySelectorAll('#blog-dots button');
  dots.forEach((dot, index) => {
    dot.style.background = index === currentBlogIndex ? '#513b1f' : '#fff';
  });
}

// Slide blog posts
function slideBlogPosts(direction) {
  if (blogPosts.length === 0) return;
  currentBlogIndex += direction;
  if (currentBlogIndex < 0) currentBlogIndex = blogPosts.length - 1;
  if (currentBlogIndex >= blogPosts.length) currentBlogIndex = 0;
  updateBlogCarousel();
  resetBlogAutoplay();
}

// Go to specific slide
function goToBlogSlide(index) {
  currentBlogIndex = index;
  updateBlogCarousel();
  resetBlogAutoplay();
}

// Auto-play carousel
function startBlogAutoplay() {
  clearInterval(blogAutoplayInterval);
  if (blogPosts.length <= 1) return;
  blogAutoplayInterval = setInterval(() => {
    currentBlogIndex = (currentBlogIndex + 1) % blogPosts.length;
    updateBlogCarousel();
  }, 5000);
}

// Reset autoplay
function resetBlogAutoplay() {
  clearInterval(blogAutoplayInterval);
  startBlogAutoplay();
}

// Open blog modal using safe content
function openBlogModal(title, content) {
  const html = markdownToHtml(content);
  const modal = document.createElement('div');
  modal.className = 'event-modal';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.innerHTML = `
    <div class="modal-content" style="max-width:900px; max-height:80vh; overflow-y:auto;">
      <button class="modal-close" onclick="this.closest('.event-modal').remove(); document.body.style.overflow='auto'">&times;</button>
      <div style="padding:2rem;">
        <h2 style="color:#0f2a44; margin-bottom:1rem;">${escapeHtml(title)}</h2>
        <div style="line-height:1.8; color:#4b5563;">${html}</div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  modal.addEventListener('click', function(e) {
    if (e.target === this) {
      this.remove();
      document.body.style.overflow = 'auto';
    }
  });
}

// Helper: escape HTML for text nodes
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, function(m) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' })[m];
  });
}



// document.addEventListener('DOMContentLoaded', async () => {
//   try {
//     await loadBlogPosts();
//     await autoDetectAndLoadEvents();
//     await detectAndLoadGalleryImages();
//     initializeGalleries();
//   } catch (e) {
//     console.error('Init error:', e);
//   }
// });





// async function loadNewsCards() {
//   try {
//     const response = await fetch('news.html');
//     if (!response.ok) throw new Error('Failed to fetch news.html');

//     const html = await response.text();

//     // Create a temporary container to parse the HTML
//     const tempDiv = document.createElement('div');
//     tempDiv.innerHTML = html;

//     // Select individual news items (assuming they have a class like .news-item)
//     const newsItems = tempDiv.querySelectorAll('.news-item');

//     const newsData = Array.from(newsItems).map(item => ({
//       title: item.querySelector('.news-title')?.textContent || 'Untitled',
//       date: item.querySelector('.news-date')?.textContent || '',
//       excerpt: item.querySelector('.news-excerpt')?.textContent || '',
//       link: item.querySelector('a')?.href || '#'
//     }));

//     displayNewsCards(newsData);

//   } catch (error) {
//     console.error('Error loading news:', error);
//   }
// }


// function displayNewsCards(newsData) {
//   const container = document.getElementById('blog-carousel');
//   container.innerHTML = '';

//   newsData.forEach(news => {
//     const card = document.createElement('div');
//     card.className = 'blog-card';
//     card.innerHTML = `
//       <h3>${news.title}</h3>
//       <p>${news.excerpt}</p>
//       <span>${news.date}</span>
//       <a href="${news.link}" class="btn-details">Read more</a>
//     `;
//     container.appendChild(card);
//   });
// }


// partners slider 

// Fade-in on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // fade in only once
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Auto-slide & navigation (existing code, unchanged)
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('partnersSlider');
  const prev = document.querySelector('.partners-nav.prev');
  const next = document.querySelector('.partners-nav.next');

  if (!slider) return;

  const slideAmount = 220;
  let autoplay;

  function slideNext() {
    slider.scrollBy({ left: slideAmount, behavior: 'smooth' });
    if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 5) {
      setTimeout(() => slider.scrollTo({ left: 0, behavior: 'smooth' }), 800);
    }
  }

  function startAutoplay() { autoplay = setInterval(slideNext, 3500); }
  function resetAutoplay() { clearInterval(autoplay); startAutoplay(); }

  prev.addEventListener('click', () => { slider.scrollBy({ left: -slideAmount, behavior: 'smooth' }); resetAutoplay(); });
  next.addEventListener('click', () => { slideNext(); resetAutoplay(); });

  slider.addEventListener('mouseenter', () => clearInterval(autoplay));
  slider.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
});




// Initialize everything when page loads
window.addEventListener('load', async function() {
  await detectAndLoadGalleryImages();
  await autoDetectAndLoadEvents();
  await loadBlogPosts();
  initializeGalleries();
});




