// Centro de preferencias de cookies propio de Subway Chile.
// Se abre desde el link del pie de página que apunta a "#cookie-settings".
// Guarda la elección del visitante y avisa al resto del sitio con el evento
// "subway:cookies" para que, por ejemplo, Google Analytics solo se cargue si
// el visitante aceptó las cookies de rendimiento.
(function () {
  const KEY = 'subwayCookiePrefs';
  const CATS = ['necesarias', 'funcionalidad', 'rendimiento', 'dirigidas'];

  const TXT = {
    es: {
      title: 'Preferencias de privacidad',
      tabs: ['Tu privacidad', 'Cookies necesarias', 'Cookies de funcionalidad', 'Cookies de rendimiento', 'Cookies dirigidas'],
      body: [
        'Usamos cookies y tecnologías similares para que el sitio funcione, recordar tus preferencias, medir cómo se usa y, si lo permites, mostrarte publicidad relevante. Puedes elegir qué tipos aceptas en cada categoría. Bloquear algunas puede afectar tu experiencia en el sitio.',
        'Son indispensables para que el sitio funcione (por ejemplo, recordar tu elección de privacidad o tu idioma). No se pueden desactivar y no guardan información que te identifique.',
        'Permiten recordar tus elecciones y ofrecerte funciones mejoradas, como contenido de terceros integrado en el sitio. Si las desactivas, algunas funciones podrían no estar disponibles.',
        'Nos ayudan a saber cuántas personas visitan el sitio y qué secciones usan más, con información agregada y anónima, para mejorar el servicio.',
        'Las usan nuestros socios publicitarios para mostrarte anuncios más relevantes en otros sitios. Si las desactivas, verás la misma cantidad de publicidad, pero menos personalizada.',
      ],
      always: 'Siempre activas',
      more: 'Leer la política de privacidad',
      confirm: 'Confirmar mis preferencias',
      reject: 'Rechazar todas',
      accept: 'Aceptar todas',
      bannerText: 'Usamos cookies para mejorar tu experiencia. Puedes aceptarlas, rechazarlas o elegir cuáles permitir.',
      settings: 'Configurar',
      close: 'Cerrar',
    },
    en: {
      title: 'Privacy preferences',
      tabs: ['Your privacy', 'Necessary cookies', 'Functional cookies', 'Performance cookies', 'Targeting cookies'],
      body: [
        'We use cookies and similar technologies to make the site work, remember your preferences, measure how it is used and, if you allow it, show you relevant ads. You can choose which types you accept in each category. Blocking some of them may affect your experience.',
        'They are essential for the site to work (for example, remembering your privacy choice or language). They cannot be turned off and do not store information that identifies you.',
        'They remember your choices and enable enhanced features, such as third-party content embedded in the site. If you turn them off, some features may not be available.',
        'They help us know how many people visit the site and which sections they use most, using aggregated and anonymous data, so we can improve the service.',
        'Our advertising partners use them to show you more relevant ads on other sites. If you turn them off, you will see the same amount of ads, but less personalized.',
      ],
      always: 'Always active',
      more: 'Read the privacy policy',
      confirm: 'Confirm my choices',
      reject: 'Reject all',
      accept: 'Accept all',
      bannerText: 'We use cookies to improve your experience. You can accept them, reject them or choose which ones to allow.',
      settings: 'Settings',
      close: 'Close',
    },
    pt: {
      title: 'Preferências de privacidade',
      tabs: ['Sua privacidade', 'Cookies necessários', 'Cookies de funcionalidade', 'Cookies de desempenho', 'Cookies direcionados'],
      body: [
        'Usamos cookies e tecnologias semelhantes para o site funcionar, lembrar suas preferências, medir como ele é usado e, se você permitir, mostrar anúncios relevantes. Você pode escolher quais tipos aceita em cada categoria. Bloquear alguns pode afetar sua experiência.',
        'São indispensáveis para o site funcionar (por exemplo, lembrar sua escolha de privacidade ou seu idioma). Não podem ser desativados e não guardam informações que identifiquem você.',
        'Permitem lembrar suas escolhas e oferecer recursos aprimorados, como conteúdo de terceiros integrado ao site. Se desativados, alguns recursos podem não estar disponíveis.',
        'Ajudam a saber quantas pessoas visitam o site e quais seções usam mais, com dados agregados e anônimos, para melhorar o serviço.',
        'São usados por nossos parceiros de publicidade para mostrar anúncios mais relevantes em outros sites. Se desativados, você verá a mesma quantidade de anúncios, porém menos personalizados.',
      ],
      always: 'Sempre ativos',
      more: 'Ler a política de privacidade',
      confirm: 'Confirmar minhas escolhas',
      reject: 'Rejeitar todos',
      accept: 'Aceitar todos',
      bannerText: 'Usamos cookies para melhorar sua experiência. Você pode aceitá-los, rejeitá-los ou escolher quais permitir.',
      settings: 'Configurar',
      close: 'Fechar',
    },
  };

  // Link a la política de privacidad (cambiar por la página propia cuando exista).
  const PRIVACY_URL = 'privacidad.html';

  function lang() {
    const l = (document.documentElement.lang || 'es').slice(0, 2);
    return TXT[l] ? l : 'es';
  }

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; }
  }
  let prefs = load();

  function save(p) {
    prefs = Object.assign({ necesarias: true }, p, { fecha: new Date().toISOString() });
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) { /* solo esta visita */ }
    document.dispatchEvent(new CustomEvent('subway:cookies', { detail: prefs }));
    hideBanner();
  }
  window.SubwayCookies = { get: () => prefs, open: () => openCenter() };

  // ---------- Centro de preferencias ----------
  let overlay;
  function openCenter() {
    const t = TXT[lang()];
    const current = prefs || { funcionalidad: false, rendimiento: false, dirigidas: false };
    if (overlay) overlay.remove();
    overlay = document.createElement('div');
    overlay.className = 'ck-overlay';
    overlay.innerHTML = `
      <div class="ck-panel" role="dialog" aria-modal="true" aria-labelledby="ckTitle">
        <header class="ck-head">
          <img src="assets/logo/subway-logo-secondary-yellow-green.png" alt="Subway" class="ck-logo">
          <h2 id="ckTitle"></h2>
          <button class="ck-x" type="button" data-ck="close">&times;</button>
        </header>
        <div class="ck-main">
          <nav class="ck-tabs" role="tablist"></nav>
          <section class="ck-content"></section>
        </div>
        <footer class="ck-foot">
          <button type="button" class="btn btn-primary" data-ck="confirm"></button>
          <button type="button" class="btn btn-primary" data-ck="reject"></button>
        </footer>
      </div>`;
    overlay.querySelector('#ckTitle').textContent = t.title;
    overlay.querySelector('[data-ck="close"]').setAttribute('aria-label', t.close);
    overlay.querySelector('[data-ck="confirm"]').textContent = t.confirm;
    overlay.querySelector('[data-ck="reject"]').textContent = t.reject;

    const state = { funcionalidad: !!current.funcionalidad, rendimiento: !!current.rendimiento, dirigidas: !!current.dirigidas };
    const tabs = overlay.querySelector('.ck-tabs');
    const content = overlay.querySelector('.ck-content');

    function show(i) {
      tabs.querySelectorAll('button').forEach((b, j) => b.classList.toggle('is-active', i === j));
      content.innerHTML = '';
      const head = document.createElement('div');
      head.className = 'ck-row';
      const h = document.createElement('h3');
      h.textContent = t.tabs[i];
      head.appendChild(h);
      const cat = i === 0 ? null : CATS[i - 1];
      if (cat === 'necesarias') {
        const s = document.createElement('span');
        s.className = 'ck-always';
        s.textContent = t.always;
        head.appendChild(s);
      } else if (cat) {
        const label = document.createElement('label');
        label.className = 'ck-switch';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = state[cat];
        input.setAttribute('aria-label', t.tabs[i]);
        input.addEventListener('change', () => { state[cat] = input.checked; });
        label.appendChild(input);
        label.appendChild(document.createElement('span'));
        head.appendChild(label);
      }
      content.appendChild(head);
      const p = document.createElement('p');
      p.textContent = t.body[i];
      content.appendChild(p);
      if (i === 0) {
        const a = document.createElement('a');
        a.href = PRIVACY_URL;
        a.textContent = t.more;
        content.appendChild(a);
      }
    }

    t.tabs.forEach((label, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.addEventListener('click', () => show(i));
      tabs.appendChild(b);
    });
    show(0);

    overlay.addEventListener('click', (e) => {
      const act = e.target.closest('[data-ck]') && e.target.closest('[data-ck]').dataset.ck;
      if (e.target === overlay || act === 'close') close();
      if (act === 'confirm') { save(state); close(); }
      if (act === 'reject') { save({ funcionalidad: false, rendimiento: false, dirigidas: false }); close(); }
    });
    document.addEventListener('keydown', escClose);
    document.body.appendChild(overlay);
    overlay.querySelector('.ck-tabs button').focus();
  }
  function escClose(e) { if (e.key === 'Escape') close(); }
  function close() {
    if (overlay) overlay.remove();
    overlay = null;
    document.removeEventListener('keydown', escClose);
  }

  // ---------- Aviso inicial (solo si todavía no eligió) ----------
  let banner;
  function showBanner() {
    const t = TXT[lang()];
    banner = document.createElement('div');
    banner.className = 'ck-banner';
    banner.innerHTML = '<p></p><div class="ck-banner-actions"><button type="button" class="btn btn-outline" data-b="settings"></button><button type="button" class="btn btn-outline" data-b="reject"></button><button type="button" class="btn btn-primary" data-b="accept"></button></div>';
    banner.querySelector('p').textContent = t.bannerText;
    banner.querySelector('[data-b="settings"]').textContent = t.settings;
    banner.querySelector('[data-b="reject"]').textContent = t.reject;
    banner.querySelector('[data-b="accept"]').textContent = t.accept;
    banner.addEventListener('click', (e) => {
      const b = e.target.closest('[data-b]');
      if (!b) return;
      if (b.dataset.b === 'accept') save({ funcionalidad: true, rendimiento: true, dirigidas: true });
      if (b.dataset.b === 'reject') save({ funcionalidad: false, rendimiento: false, dirigidas: false });
      if (b.dataset.b === 'settings') openCenter();
    });
    document.body.appendChild(banner);
  }
  function hideBanner() { if (banner) { banner.remove(); banner = null; } }

  // Link "Configuración de Cookies y Anuncios" del pie de página
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href="#cookie-settings"]');
    if (!a) return;
    e.preventDefault();
    openCenter();
  });

  if (!prefs) showBanner();
})();
