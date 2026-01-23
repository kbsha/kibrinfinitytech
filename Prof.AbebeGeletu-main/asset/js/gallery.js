// gallery.js
export const galleryData = {
  event1: [],
  event2: [],
  event3: []
};

export const galleryIndex = {
  event1: 0,
  event2: 0,
  event3: 0
};

export async function detectAndLoadGalleryImages() {
  const events = [
    { id: 'event1', folder: 'AI_confrence' },
    { id: 'event2', folder: 'AI_workshop' },
    { id: 'event3', folder: 'Lab-Demo1' }
  ];

  for (const e of events) {
    for (let i = 1; i <= 10; i++) {
      const path = `asset/events/${e.folder}/${i}.jpg`;
      try {
        const r = await fetch(path, { method: 'HEAD' });
        if (r.ok) galleryData[e.id].push({ src: path, caption: `Image ${i}` });
      } catch {}
    }
  }
}

export function showGalleryImage(eventId, index) {
  const items = galleryData[eventId];
  if (!items.length) return;

  galleryIndex[eventId] = index;
  document.getElementById(`${eventId}-main-img`).src = items[index].src;
  document.getElementById(`${eventId}-img-current`).textContent = index + 1;
}
