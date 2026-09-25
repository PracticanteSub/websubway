// Funciones compartidas para construir el HTML de cada bloque de contenido.
// Las usa tanto el sitio público (js/site-render.js) como el editor /admin
// (admin/admin.js), así el editor muestra exactamente lo mismo que verán
// los visitantes del sitio.
window.SubwayTemplates = (function () {
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function buildTcLink(app, text, legal) {
    const a = el('a', 'hero-terms', text || 'Aplican Términos y Condiciones');
    a.href = '#';
    a.setAttribute('data-tc', '');
    if (app) a.setAttribute('data-app', app);
    if (legal) a.setAttribute('data-tc-text', legal);
    return a;
  }

  function buildMedia(className, media, label) {
    const safeMedia = media || {};
    const div = el('div', `${className} media-${safeMedia.style || 'green'}`);
    div.setAttribute('role', 'img');
    div.setAttribute('aria-label', label || '');
    if (safeMedia.image) {
      div.classList.add('has-image');
      div.style.backgroundImage = `url("${String(safeMedia.image).replace(/["\\]/g, '')}")`;
    } else {
      div.style.setProperty('--emoji', `"${(safeMedia.emoji || '').replace(/"/g, '')}"`);
    }
    return div;
  }

  function heroSlide(slide, index) {
    const article = el('article', `hero-slide${index === 0 ? ' is-active' : ''}`);
    article.dataset.slide = String(index);
    article.appendChild(buildMedia('hero-media', slide.media, slide.eyebrow || slide.title));

    const copy = el('div', 'hero-copy');
    copy.appendChild(el('p', 'eyebrow', slide.eyebrow || ''));
    copy.appendChild(el('h1', null, slide.title || ''));
    copy.appendChild(el('p', null, slide.description || ''));
    copy.appendChild(buildTcLink(slide.tcApp, slide.tcText, slide.tcLegal));
    const cta = el('a', 'btn btn-primary btn-lg', slide.ctaText || '');
    cta.href = slide.ctaHref || '#';
    cta.target = '_blank';
    cta.rel = 'noopener';
    copy.appendChild(cta);

    article.appendChild(copy);
    return article;
  }

  function promoCard(card) {
    const article = el('article', 'promo-card');
    article.appendChild(buildMedia('promo-media', card.media, card.title));

    const body = el('div', 'promo-body');
    body.appendChild(el('h3', null, card.title || ''));
    body.appendChild(el('p', null, card.description || ''));
    body.appendChild(buildTcLink(card.appName, card.tcText, card.tcLegal));
    const cta = el('a', `btn btn-primary${card.btnColor ? ' btn--' + card.btnColor : ''}`, card.ctaText || '');
    cta.href = card.ctaHref || '#';
    cta.target = '_blank';
    cta.rel = 'noopener';
    body.appendChild(cta);

    article.appendChild(body);
    return article;
  }

  function ctaBanner(banner) {
    const section = el('section', `delivery-cta style-${banner.style || 'green'}${banner.image ? ' has-side-image' : ''}`);
    const inner = el('div', 'container delivery-inner');
    const text = el('div', 'delivery-text');
    text.appendChild(el('h2', 'section-title section-title--light', banner.title || ''));
    if (banner.subtitle) text.appendChild(el('p', null, banner.subtitle));
    if (banner.ctaText) {
      const cta = el('a', 'btn btn-light btn-lg', banner.ctaText);
      cta.href = banner.ctaHref || '#';
      cta.target = '_blank';
      cta.rel = 'noopener';
      text.appendChild(cta);
    }
    inner.appendChild(text);
    if (banner.image) {
      const img = el('img', 'delivery-img');
      img.src = banner.image;
      img.alt = banner.title || '';
      inner.appendChild(img);
    }
    section.appendChild(inner);
    return section;
  }

  function footerColumn(column) {
    const div = el('div', 'footer-col');
    div.appendChild(el('h4', null, column.title || ''));
    (column.links || []).forEach((link) => {
      const a = el('a', null, link.text || '');
      a.href = link.href || '#';
      if (/^https?:\/\//i.test(link.href || '')) {
        a.target = '_blank';
        a.rel = 'noopener';
      }
      div.appendChild(a);
    });
    return div;
  }

  function footerLegalLink(link) {
    const a = el('a', null, link.text || '');
    a.href = link.href || '#';
    if (/^https?:\/\//i.test(link.href || '')) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    return a;
  }

  return { el, buildMedia, buildTcLink, heroSlide, promoCard, ctaBanner, footerColumn, footerLegalLink };
})();
