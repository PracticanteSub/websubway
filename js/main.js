// El selector de idioma del pie de página lo maneja js/i18n.js

// Modal "Aplican Términos y Condiciones"
// Usa delegación de eventos: así funciona también con las tarjetas/slides
// que site-render.js inyecta dinámicamente después de cargar el contenido.
const tcModal = document.getElementById('tcModal');
if (tcModal) {
  const tcModalText = document.getElementById('tcModalText');

  const tcTextFor = (app) => {
    const appClause = app ? ` DENTRO DE ${app.toUpperCase()}` : '';
    const consultarClause = app ? ` CONSULTAR RESTAURANTES ADHERIDOS DENTRO DE LA APP DE ${app.toUpperCase()}.` : '';
    return `COMBOS Y PRECIOS PUEDEN VARIAR${appClause}.${consultarClause} IMÁGENES CON FINES ILUSTRATIVOS. SUBWAY®️ ES UNA MARCA REGISTRADA DE SUBWAY IP LLC. ©️ 2025 SUBWAY IP LLC.`;
  };

  const openTcModal = (app, legal) => {
    tcModalText.textContent = legal || tcTextFor(app);
    tcModal.hidden = false;
  };
  const closeTcModal = () => { tcModal.hidden = true; };

  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-tc]');
    if (link) {
      e.preventDefault();
      openTcModal(link.dataset.app || '', link.dataset.tcText || '');
      return;
    }
    if (e.target.closest('[data-tc-close]')) closeTcModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !tcModal.hidden) closeTcModal();
  });
}

// Hero carousel — se llama desde site-render.js una vez que las diapositivas
// ya están en el DOM (o directamente si el HTML ya las trae fijas).
window.initHeroCarousel = function initHeroCarousel() {
  const track = document.getElementById('heroTrack');
  if (!track) return;
  const slides = Array.from(track.querySelectorAll('.hero-slide'));
  const dotsWrap = document.getElementById('heroDots');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  if (!slides.length || !dotsWrap) return;
  let current = 0;
  let timer;

  dotsWrap.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('is-active');
    dot.setAttribute('aria-label', `Ir a la diapositiva ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(index) {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
    restart();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function restart() {
    clearInterval(timer);
    timer = setInterval(next, 6000);
  }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  restart();
};

// Promotions carousel (scroll-snap track driven by arrow buttons)
window.initPromoCarousel = function initPromoCarousel() {
  const promoTrack = document.getElementById('promoTrack');
  if (!promoTrack) return;
  const promoPrev = document.getElementById('promoPrev');
  const promoNext = document.getElementById('promoNext');
  const scrollByCard = (dir) => {
    const card = promoTrack.querySelector('.promo-card');
    const gap = 28;
    const amount = (card ? card.offsetWidth : 320) + gap;
    promoTrack.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };
  promoNext.addEventListener('click', () => scrollByCard(1));
  promoPrev.addEventListener('click', () => scrollByCard(-1));
};

// Si el HTML ya trae las diapositivas/tarjetas fijas (sin pasar por site-render.js),
// se inicializan igual apenas carga el script.
if (document.getElementById('heroTrack')) window.initHeroCarousel();
if (document.getElementById('promoTrack')) window.initPromoCarousel();

// Store locator form (ubica-tu-subway.html)
const locatorForm = document.getElementById('locatorForm');
if (locatorForm) {
  locatorForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('comuna').value.trim();
    const mapFrame = document.getElementById('mapFrame');
    const query = q ? `Subway ${q} Chile` : 'Subway Chile';
    if (mapFrame) {
      mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    }
  });
}
