// events.js
import { showGalleryImage } from './gallery.js';

export async function autoDetectAndLoadEvents() {
  const folders = ['AI_confrence', 'AI_workshop', 'Lab-Demo1'];
  const grid = document.getElementById('events-grid');
  if (!grid) return;

  folders.forEach((f, i) => {
    const id = `event${i + 1}`;
    const card = document.createElement('article');
    card.className = 'event-card';
    card.innerHTML = `
      <img src="asset/events/${f}/1.jpg">
      <h3>${f.replace('-', ' ')}</h3>
      <button onclick="openEventModal('${id}')">View</button>
    `;
    grid.appendChild(card);
  });
}

window.openEventModal = function(id) {
  document.getElementById(`${id}-modal`)?.classList.add('show');
};
