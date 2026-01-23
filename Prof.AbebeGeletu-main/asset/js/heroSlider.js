// heroSlider.js
export function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;

  const dots = document.querySelector('.hero-dots');
  const prev = document.querySelector('.hero-prev');
  const next = document.querySelector('.hero-next');

  let current = 0;

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
