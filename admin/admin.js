const T = window.SubwayTemplates;

const editor = grapesjs.init({
  container: '#gjs',
  height: '100%',
  fromElement: false,
  storageManager: false,
  dragMode: 'absolute-off',
  canvas: {
    styles: ['/css/styles.css', '/admin/canvas-overrides.css'],
  },
  blockManager: { appendTo: '#blocks' },
  layerManager: { appendTo: '#layers' },
  traitManager: { appendTo: '#traits' },
  panels: { defaults: [] },
});

const MEDIA_STYLE_OPTIONS = [
  { id: 'black', name: 'Negro' },
  { id: 'white', name: 'Blanco' },
  { id: 'green', name: 'Verde' },
  { id: 'yellow', name: 'Amarillo' },
  { id: 'brown', name: 'Café' },
  { id: 'dark', name: 'Oscuro' },
];
const CTA_STYLE_OPTIONS = [
  { id: 'green', name: 'Verde' },
  { id: 'dark', name: 'Oscuro' },
  { id: 'yellow', name: 'Amarillo' },
];

// ===================== Tipos de bloque =====================

editor.DomComponents.addType('hero-slide', {
  model: {
    defaults: {
      tagName: 'article',
      name: 'Diapositiva de Banner',
      classes: ['hero-slide', 'is-active'],
      draggable: '.admin-zone#hero-wrapper',
      droppable: false,
      removable: true,
      copyable: true,
      traits: [
        { name: 'eyebrow', label: 'Texto pequeño (arriba del título)', changeProp: 1 },
        { name: 'title', label: 'Título', changeProp: 1 },
        { type: 'textarea', name: 'description', label: 'Descripción', changeProp: 1 },
        { name: 'ctaText', label: 'Texto del botón', changeProp: 1 },
        { name: 'ctaHref', label: 'Link del botón (https://...)', changeProp: 1 },
        { name: 'tcApp', label: 'App asociada (Uber Eats / PedidosYa / Rappi) — opcional', changeProp: 1 },
        { name: 'tcText', label: 'Texto del link de Términos y Condiciones', changeProp: 1 },
        { type: 'textarea', name: 'tcLegal', label: 'Texto legal que aparece al hacer clic en T&C', changeProp: 1 },
        { name: 'image', label: 'Imagen (ej: assets/img/series.png)', changeProp: 1 },
        { type: 'select', name: 'mediaStyle', label: 'Color de fondo', options: MEDIA_STYLE_OPTIONS, changeProp: 1 },
        { name: 'emoji', label: 'Emoji / ícono', changeProp: 1 },
      ],
      eyebrow: 'Nueva promoción',
      title: 'Título de la diapositiva',
      description: 'Descripción breve de la promoción.',
      ctaText: 'Pruébalo Hoy',
      ctaHref: 'https://restaurantes.subway.com/chile',
      tcApp: '',
      tcText: 'Aplican Términos y Condiciones',
      tcLegal: '',
      image: '',
      mediaStyle: 'green',
      emoji: '🥪',
    },
    init() {
      this.on(
        'change:eyebrow change:title change:description change:ctaText change:ctaHref change:tcApp change:tcText change:tcLegal change:image change:mediaStyle change:emoji',
        this.updateContent
      );
      this.updateContent();
    },
    updateContent() {
      const node = T.heroSlide(
        {
          eyebrow: this.get('eyebrow'),
          title: this.get('title'),
          description: this.get('description'),
          ctaText: this.get('ctaText'),
          ctaHref: this.get('ctaHref'),
          tcApp: this.get('tcApp'),
          tcText: this.get('tcText'),
          tcLegal: this.get('tcLegal'),
          media: { style: this.get('mediaStyle'), emoji: this.get('emoji'), image: this.get('image') },
        },
        0
      );
      this.components(node.innerHTML);
    },
  },
});

editor.DomComponents.addType('promo-card', {
  model: {
    defaults: {
      tagName: 'article',
      name: 'Tarjeta de Promoción',
      classes: ['promo-card'],
      draggable: '.admin-zone#promo-wrapper',
      droppable: false,
      removable: true,
      copyable: true,
      traits: [
        { name: 'title', label: 'Título', changeProp: 1 },
        { type: 'textarea', name: 'description', label: 'Descripción', changeProp: 1 },
        { name: 'appName', label: 'App de delivery (Uber Eats / PedidosYa / Rappi)', changeProp: 1 },
        { name: 'tcText', label: 'Texto del link de Términos y Condiciones', changeProp: 1 },
        { name: 'ctaText', label: 'Texto del botón', changeProp: 1 },
        { name: 'ctaHref', label: 'Link del botón (https://...)', changeProp: 1 },
        { type: 'select', name: 'btnColor', label: 'Color del botón', options: [{ id: 'black', name: 'Negro' }, { id: '', name: 'Verde Subway' }, { id: 'ubereats', name: 'Uber Eats' }, { id: 'pedidosya', name: 'PedidosYa' }, { id: 'rappi', name: 'Rappi' }], changeProp: 1 },
        { name: 'image', label: 'Imagen (ej: assets/img/promo-rappi.png)', changeProp: 1 },
        { type: 'select', name: 'mediaStyle', label: 'Color de fondo', options: MEDIA_STYLE_OPTIONS, changeProp: 1 },
        { name: 'emoji', label: 'Emoji / ícono', changeProp: 1 },
      ],
      btnColor: '',
      image: '',
      title: 'Nueva Promoción',
      description: 'Descripción breve de la promoción.',
      appName: 'Uber Eats',
      tcText: 'Aplican Términos y Condiciones',
      ctaText: 'Ordena en Uber Eats',
      ctaHref: 'https://www.ubereats.com/cl/brand/subway',
      mediaStyle: 'green',
      emoji: '🥪',
    },
    init() {
      this.on(
        'change:title change:description change:appName change:tcText change:ctaText change:ctaHref change:mediaStyle change:emoji change:btnColor change:image',
        this.updateContent
      );
      this.updateContent();
    },
    updateContent() {
      const node = T.promoCard({
        title: this.get('title'),
        description: this.get('description'),
        appName: this.get('appName'),
        tcText: this.get('tcText'),
        ctaText: this.get('ctaText'),
        ctaHref: this.get('ctaHref'),
        btnColor: this.get('btnColor'),
        media: { style: this.get('mediaStyle'), emoji: this.get('emoji'), image: this.get('image') },
      });
      this.components(node.innerHTML);
    },
  },
});

editor.DomComponents.addType('cta-banner', {
  model: {
    defaults: {
      tagName: 'section',
      name: 'Banner de Aviso (CTA)',
      classes: ['delivery-cta', 'style-green'],
      draggable: '.admin-zone#cta-wrapper',
      droppable: false,
      removable: true,
      copyable: true,
      traits: [
        { type: 'textarea', name: 'title', label: 'Título (Enter = salto de línea)', changeProp: 1 },
        { name: 'subtitle', label: 'Subtítulo (opcional)', changeProp: 1 },
        { name: 'ctaText', label: 'Texto del botón (vacío = sin botón)', changeProp: 1 },
        { name: 'ctaHref', label: 'Link del botón (https://...)', changeProp: 1 },
        { name: 'image', label: 'Imagen a la derecha (ej: assets/img/banner-ordena.png)', changeProp: 1 },
        { type: 'select', name: 'style', label: 'Color de fondo', options: CTA_STYLE_OPTIONS, changeProp: 1 },
      ],
      image: '',
      title: 'Ordena lo que Quieras, Cuando Quieras',
      subtitle: '¡Obtener Subway nunca fue tan fácil!',
      ctaText: 'Ordena Ahora',
      ctaHref: 'https://order.subway.com/es-cl',
      style: 'green',
    },
    init() {
      this.on('change:title change:subtitle change:ctaText change:ctaHref change:image', this.updateContent);
      this.on('change:style', this.updateStyle);
      this.updateContent();
      this.updateStyle();
    },
    updateContent() {
      const node = T.ctaBanner({
        title: this.get('title'),
        subtitle: this.get('subtitle'),
        ctaText: this.get('ctaText'),
        ctaHref: this.get('ctaHref'),
        image: this.get('image'),
        style: this.get('style'),
      });
      this.components(node.innerHTML);
    },
    updateStyle() {
      this.setClass(['delivery-cta', `style-${this.get('style')}`]);
    },
  },
});

editor.DomComponents.addType('section-title', {
  model: {
    defaults: {
      tagName: 'h2',
      classes: ['section-title', 'section-title--44'],
      draggable: false,
      droppable: false,
      removable: false,
      copyable: false,
      selectable: true,
      traits: [{ name: 'text', label: 'Título de la sección', changeProp: 1 }],
      text: 'Promociones y Ofertas',
    },
    init() {
      this.on('change:text', this.updateContent);
      this.updateContent();
    },
    updateContent() {
      this.components(this.get('text'));
    },
  },
});

// ===================== Bloques (panel izquierdo) =====================

editor.BlockManager.add('hero-slide-block', {
  label: '🎬 Diapositiva de Banner<small>Va en el carrusel principal</small>',
  category: 'Bloques',
  content: { type: 'hero-slide' },
});
editor.BlockManager.add('promo-card-block', {
  label: '🏷️ Tarjeta de Promoción<small>Va en "Promociones y Ofertas"</small>',
  category: 'Bloques',
  content: { type: 'promo-card' },
});
editor.BlockManager.add('cta-banner-block', {
  label: '📣 Banner de Aviso (CTA)<small>Franja completa con botón</small>',
  category: 'Bloques',
  content: { type: 'cta-banner' },
});

// ===================== Estructura fija del lienzo =====================

editor.setComponents([
  {
    tagName: 'div',
    classes: ['admin-zone-label'],
    draggable: false,
    removable: false,
    selectable: false,
    editable: false,
    droppable: false,
    content: '🎬 BANNER PRINCIPAL — arrastra aquí una "Diapositiva de Banner"',
  },
  {
    tagName: 'div',
    attributes: { id: 'hero-wrapper' },
    classes: ['admin-zone'],
    draggable: false,
    removable: false,
    droppable: '.hero-slide',
    components: [],
  },
  {
    tagName: 'div',
    classes: ['admin-zone-label'],
    draggable: false,
    removable: false,
    selectable: false,
    editable: false,
    droppable: false,
    content: '🏷️ PROMOCIONES Y OFERTAS — arrastra aquí una "Tarjeta de Promoción"',
  },
  { type: 'section-title' },
  {
    tagName: 'div',
    attributes: { id: 'promo-wrapper' },
    classes: ['promo-track', 'admin-zone'],
    draggable: false,
    removable: false,
    droppable: '.promo-card',
    components: [],
  },
  {
    tagName: 'div',
    classes: ['admin-zone-label'],
    draggable: false,
    removable: false,
    selectable: false,
    editable: false,
    droppable: false,
    content: '📣 AVISOS / BANNERS CTA — arrastra aquí un "Banner de Aviso"',
  },
  {
    tagName: 'div',
    attributes: { id: 'cta-wrapper' },
    classes: ['admin-zone'],
    draggable: false,
    removable: false,
    droppable: '.delivery-cta',
    components: [],
  },
]);

const wrapper = editor.DomComponents.getWrapper();
const heroWrapper = () => wrapper.find('#hero-wrapper')[0];
const promoWrapper = () => wrapper.find('#promo-wrapper')[0];
const ctaWrapper = () => wrapper.find('#cta-wrapper')[0];
const sectionTitleComp = () => wrapper.find('[data-gjs-type="section-title"]')[0] || wrapper.find('h2.section-title')[0];

// ===================== Cargar contenido existente =====================

const statusMsg = document.getElementById('statusMsg');
function setStatus(text, isError) {
  statusMsg.textContent = text;
  statusMsg.classList.toggle('is-error', !!isError);
}

fetch('/api/content/home')
  .then((res) => res.json())
  .then((data) => {
    (data.hero || []).forEach((slide) => {
      heroWrapper().append({
        type: 'hero-slide',
        eyebrow: slide.eyebrow,
        title: slide.title,
        description: slide.description,
        ctaText: slide.ctaText,
        ctaHref: slide.ctaHref,
        tcApp: slide.tcApp || '',
        tcText: slide.tcText || 'Aplican Términos y Condiciones',
        tcLegal: slide.tcLegal || '',
        image: (slide.media && slide.media.image) || '',
        mediaStyle: (slide.media && slide.media.style) || 'green',
        emoji: (slide.media && slide.media.emoji) || '',
        origId: slide.id,
      });
    });

    const st = sectionTitleComp();
    if (st) st.set('text', (data.promos && data.promos.title) || 'Promociones y Ofertas');

    ((data.promos && data.promos.cards) || []).forEach((card) => {
      promoWrapper().append({
        type: 'promo-card',
        title: card.title,
        description: card.description,
        appName: card.appName || '',
        tcText: card.tcText || 'Aplican Términos y Condiciones',
        ctaText: card.ctaText,
        ctaHref: card.ctaHref,
        mediaStyle: (card.media && card.media.style) || 'green',
        emoji: (card.media && card.media.emoji) || '',
        btnColor: card.btnColor || '',
        image: (card.media && card.media.image) || '',
        origId: card.id,
      });
    });

    (data.ctaBanners || []).forEach((banner) => {
      ctaWrapper().append({
        type: 'cta-banner',
        title: banner.title,
        subtitle: banner.subtitle || '',
        ctaText: banner.ctaText,
        ctaHref: banner.ctaHref,
        style: banner.style || 'green',
        image: banner.image || '',
        origId: banner.id,
      });
    });

    setStatus('Contenido cargado');
  })
  .catch((err) => {
    console.error(err);
    setStatus('Error al cargar el contenido', true);
  });

// ===================== Guardar =====================

function serializeHero() {
  return heroWrapper()
    .components()
    .map((c, i) => ({
      id: c.get('origId') || `hero-${Date.now()}-${i}`,
      eyebrow: c.get('eyebrow') || '',
      title: c.get('title') || '',
      description: c.get('description') || '',
      ctaText: c.get('ctaText') || '',
      ctaHref: c.get('ctaHref') || '',
      tcApp: c.get('tcApp') || '',
      tcText: c.get('tcText') || 'Aplican Términos y Condiciones',
      tcLegal: c.get('tcLegal') || '',
      media: { style: c.get('mediaStyle') || 'green', emoji: c.get('emoji') || '', image: c.get('image') || '' },
    }));
}

function serializePromoCards() {
  return promoWrapper()
    .components()
    .map((c, i) => ({
      id: c.get('origId') || `promo-${Date.now()}-${i}`,
      title: c.get('title') || '',
      description: c.get('description') || '',
      appName: c.get('appName') || '',
      tcText: c.get('tcText') || 'Aplican Términos y Condiciones',
      ctaText: c.get('ctaText') || '',
      ctaHref: c.get('ctaHref') || '',
      btnColor: c.get('btnColor') || '',
      media: { style: c.get('mediaStyle') || 'green', emoji: c.get('emoji') || '', image: c.get('image') || '' },
    }));
}

function serializeCtaBanners() {
  return ctaWrapper()
    .components()
    .map((c, i) => ({
      id: c.get('origId') || `cta-${Date.now()}-${i}`,
      style: c.get('style') || 'green',
      title: c.get('title') || '',
      subtitle: c.get('subtitle') || '',
      ctaText: c.get('ctaText') || '',
      ctaHref: c.get('ctaHref') || '',
      image: c.get('image') || '',
    }));
}

document.getElementById('saveBtn').addEventListener('click', () => {
  if (window.currentAdminTab !== 'home') return; // el botón se comparte entre pestañas
  const payload = {
    hero: serializeHero(),
    promos: {
      title: (sectionTitleComp() && sectionTitleComp().get('text')) || 'Promociones y Ofertas',
      cards: serializePromoCards(),
    },
    ctaBanners: serializeCtaBanners(),
  };

  setStatus('Guardando...');
  fetch('/api/content/home', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok) throw new Error('save failed');
      setStatus('✔ Publicado');
      setTimeout(() => setStatus(''), 3000);
    })
    .catch((err) => {
      console.error(err);
      setStatus('Error al guardar', true);
    });
});

// ===================== Pestañas (Inicio / Footer) =====================

window.currentAdminTab = 'home';
const topbarTitle = document.getElementById('topbarTitle');
const TAB_TITLES = {
  home: 'Editor de Contenido — Página de Inicio',
  footer: 'Editor de Contenido — Pie de Página',
};

document.querySelectorAll('.admin-tab').forEach((btn) => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    window.currentAdminTab = tab;
    document.querySelectorAll('.admin-tab').forEach((b) => b.classList.toggle('is-active', b === btn));
    document.getElementById('tabHome').hidden = tab !== 'home';
    document.getElementById('tabFooter').hidden = tab !== 'footer';
    topbarTitle.textContent = TAB_TITLES[tab];
    setStatus('');
  });
});
