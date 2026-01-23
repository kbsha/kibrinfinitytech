// main.js
import { initHeroSlider } from './heroSlider.js';
import { detectAndLoadGalleryImages } from './gallery.js';
import { autoDetectAndLoadEvents } from './events.js';
import { loadBlogPosts } from './blog.js';

window.addEventListener('DOMContentLoaded', async () => {
  initHeroSlider();
  await detectAndLoadGalleryImages();
  await autoDetectAndLoadEvents();
  await loadBlogPosts();
});
