// Renderiza la home a partir de /api/content/home (editado desde /admin).
(function () {
  const heroTrack = document.getElementById('heroTrack');
  if (!heroTrack) return; // esta página no tiene contenido dinámico (menu.html, ubica-tu-subway.html)

  const T = window.SubwayTemplates;

  function renderHero(slides) {
    heroTrack.innerHTML = '';
    slides.forEach((slide, i) => heroTrack.appendChild(T.heroSlide(slide, i)));
  }

  function renderPromos(promos) {
    const titleEl = document.getElementById('promosTitle');
    if (titleEl) titleEl.textContent = promos.title || 'Promociones y Ofertas';
    const track = document.getElementById('promoTrack');
    track.innerHTML = '';
    (promos.cards || []).forEach((card) => track.appendChild(T.promoCard(card)));
  }

  function renderCtaBanners(banners) {
    const mount = document.getElementById('ctaBannersMount');
    if (!mount) return;
    mount.innerHTML = '';
    (banners || []).forEach((banner) => mount.appendChild(T.ctaBanner(banner)));
  }

  fetch('/api/content/home')
    .then((res) => { if (!res.ok) throw new Error(res.status); return res.json(); })
    .catch(() => (window.SUBWAY_CONTENT || {}).home || {})
    .then((data) => {
      renderHero(data.hero || []);
      renderPromos(data.promos || { cards: [] });
      renderCtaBanners(data.ctaBanners || []);
      window.initHeroCarousel();
      window.initPromoCarousel();
    })
    .catch((err) => {
      console.error('No se pudo cargar el contenido de la home:', err);
    });
})();
