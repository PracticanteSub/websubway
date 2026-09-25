// Traducción del sitio según el idioma elegido en el pie de página.
// El contenido original está en español. Para agregar una traducción nueva,
// agrega una línea al diccionario: 'Texto en español': ['Inglés', 'Portugués'].
(function () {
  const LANGS = { '/es-cl/': 'es', '/en-us/': 'en', '/pt-br/': 'pt' };
  const IDX = { en: 0, pt: 1 };

  const D = {
    // Encabezado y secciones fijas
    'Buscar un Subway': ['Find a Subway', 'Encontre um Subway'],
    'Abre tu Franquicia': ['Open a Franchise', 'Abra sua Franquia'],
    'Promociones y Ofertas': ['Deals & Offers', 'Promoções e Ofertas'],
    'Aplican Términos y Condiciones': ['Terms and Conditions apply', 'Aplicam-se Termos e Condições'],
    'Nuestro Menú': ['Our Menu', 'Nosso Cardápio'],
    'Arma tu Sub como quieras, o elige uno de nuestros favoritos.': ['Build your Sub your way, or pick one of our favorites.', 'Monte seu Sub do seu jeito ou escolha um dos nossos favoritos.'],
    '¿Ya sabes qué pedir?': ['Know what you want?', 'Já sabe o que pedir?'],
    'Ordena Ahora': ['Order Now', 'Peça Agora'],
    'Ubica tu Subway más Cercano': ['Find your Nearest Subway', 'Encontre o Subway mais Próximo'],
    'Buscar': ['Search', 'Buscar'],

    // Carrusel
    'Descubre las nuevas recetas Subway Series®. ¡Pruébalas todas!': ['Discover the new Subway Series® recipes. Try them all!', 'Descubra as novas receitas Subway Series®. Experimente todas!'],
    'Mechada de Cerdo Signature, Palta Chicken Supremo y Trilogía de Carnes': ['Signature Pulled Pork, Avocado Chicken Supremo and Meat Trilogy', 'Porco Desfiado Signature, Frango Supremo com Abacate e Trilogia de Carnes'],
    'Pruébalo hoy': ['Try it today', 'Experimente hoje'],
    'Nuevo Baratísimo': ['New Super Value', 'Novo Super Econômico'],
    'Descubre nuestra nueva receta Napolitana': ['Discover our new Napolitana recipe', 'Descubra nossa nova receita Napolitana'],
    'Encuentra tu Subway más cercano': ['Find your nearest Subway', 'Encontre o Subway mais próximo'],
    'Súper Combo por $6.700': ['Super Combo for $6,700', 'Super Combo por $6.700'],
    'Elegí tu Sub de Cerdo Mechado, Atún o Pollo Crispy + 2 acompañamientos + 1 bebida.': ['Choose your Pulled Pork, Tuna or Crispy Chicken Sub + 2 sides + 1 drink.', 'Escolha seu Sub de Porco Desfiado, Atum ou Frango Crispy + 2 acompanhamentos + 1 bebida.'],

    // Tarjetas de promociones
    'Pide tus Combos Favoritos': ['Order your Favorite Combos', 'Peça seus Combos Favoritos'],
    'Elige el combo que más te gusta y disfrútalo en tu casa.': ['Pick your favorite combo and enjoy it at home.', 'Escolha o combo que você mais gosta e aproveite em casa.'],
    'Ordena en Uber Eats': ['Order on Uber Eats', 'Peça no Uber Eats'],
    'Pídelo Footlong': ['Get it Footlong', 'Peça Footlong'],
    'Tu Sub preferido en formato Footlong 30cm.': ['Your favorite Sub in 30 cm Footlong size.', 'Seu Sub preferido no formato Footlong de 30 cm.'],
    'Ordena en PedidosYa': ['Order on PedidosYa', 'Peça no PedidosYa'],
    'Galletas Recién Horneadas': ['Freshly Baked Cookies', 'Cookies Recém-Assados'],
    'Con chips de chocolate, macadamia o doble chocolate. ¡Y todas pueden ser tuyas!': ['Chocolate chip, macadamia or double chocolate. And they can all be yours!', 'Com gotas de chocolate, macadâmia ou chocolate duplo. E todos podem ser seus!'],
    'Ordena en Rappi': ['Order on Rappi', 'Peça no Rappi'],

    // Banner
    'Ordena lo que Quieras,\nCuando Quieras': ['Order What You Want,\nWhen You Want', 'Peça o que Quiser,\nQuando Quiser'],
    '¡Obtener Subway nunca fue tan fácil!': ['Getting Subway has never been easier!', 'Pedir Subway nunca foi tão fácil!'],

    // Pie de página
    'Conócenos': ['About Us', 'Conheça-nos'],
    'Noticias': ['News', 'Notícias'],
    'Contáctanos': ['Contact Us', 'Fale Conosco'],
    'Compromiso': ['Commitment', 'Compromisso'],
    'Bienestar': ['Well-being', 'Bem-estar'],
    'Nuestro Planeta': ['Our Planet', 'Nosso Planeta'],
    'Comunidades': ['Communities', 'Comunidades'],
    'Empleos': ['Careers', 'Empregos'],
    'Negocio': ['Business', 'Negócios'],
    'Privacidad': ['Privacy', 'Privacidade'],
    'Términos de Uso': ['Terms of Use', 'Termos de Uso'],
    'Accesibilidad': ['Accessibility', 'Acessibilidade'],
    'Configuración de Cookies y Anuncios': ['Cookie & Ad Settings', 'Configurações de Cookies e Anúncios'],
    'Preguntas Frecuentes': ['FAQ', 'Perguntas Frequentes'],
    'Subway® es una marca comercial registrada a nivel mundial de Subway IP LLC o una de sus filiales. © 2023 – 2026 Subway. Todos los derechos reservados.': ['Subway® is a registered trademark of Subway IP LLC or one of its affiliates worldwide. © 2023 – 2026 Subway. All rights reserved.', 'Subway® é uma marca registrada mundialmente da Subway IP LLC ou de uma de suas afiliadas. © 2023 – 2026 Subway. Todos os direitos reservados.'],

    // Textos legales (ventana de Términos y Condiciones)
    'Subway® es una marca registrada de Subway IP LLC. ©2026 Subway IP LLC. Recetas disponibles en restaurantes participantes de Chile. Imagen referencial. Precios pueden variar según restaurante.': ['Subway® is a registered trademark of Subway IP LLC. ©2026 Subway IP LLC. Recipes available at participating restaurants in Chile. Image for reference only. Prices may vary by restaurant.', 'Subway® é uma marca registrada da Subway IP LLC. ©2026 Subway IP LLC. Receitas disponíveis nos restaurantes participantes do Chile. Imagem ilustrativa. Os preços podem variar conforme o restaurante.'],
    'PROMOCIÓN VÁLIDA DESDE EL 9 DE SEPTIEMBRE DE 2026 HASTA EL 19 DE ENERO DE 2027, EXCLUSIVAMENTE EN RESTAURANTES SUBWAY® DE CHILE ADHERIDOS. EXCLUYE AEROPUERTOS, TERMINALES DE BUSES DE SANTIAGO Y ESTACIONES ARAMCO EN CARRETERA. EL PRECIO DE $2.500 INCLUYE UN SUB NAPOLITANO DE 15 CM. CONVERTIRLO EN ENSALADA, AGREGAR ACOMPAÑAMIENTOS, AGREGAR EXTRAS Y/O HACERLO COMBO TENDRÁ EXTRA COSTO ADICIONAL. AL AGREGAR PROTEÍNA EXTRA, EL SUB TOMA EL PRECIO DE PROTEÍNA DE MAYOR VALOR, MÁS LA PROTEÍNA DEL BARATÍSIMO COMO EXTRA. NO VÁLIDO PARA DELIVERY NI ACUMULABLE CON OTRAS PROMOCIONES U OFERTAS. IMÁGENES CON FINES ILUSTRATIVOS. SUBWAY® ES UNA MARCA REGISTRADA DE SUBWAY IP LLC. © 2026 SUBWAY IP LLC.': [
      'PROMOTION VALID FROM SEPTEMBER 9, 2026 TO JANUARY 19, 2027, ONLY AT PARTICIPATING SUBWAY® RESTAURANTS IN CHILE. EXCLUDES AIRPORTS, SANTIAGO BUS TERMINALS AND ARAMCO HIGHWAY STATIONS. THE $2,500 PRICE INCLUDES ONE 15 CM NAPOLITANO SUB. MAKING IT A SALAD, ADDING SIDES, ADDING EXTRAS AND/OR MAKING IT A COMBO WILL HAVE AN ADDITIONAL COST. WHEN ADDING EXTRA PROTEIN, THE SUB TAKES THE PRICE OF THE HIGHER-VALUE PROTEIN, PLUS THE SUPER VALUE PROTEIN AS AN EXTRA. NOT VALID FOR DELIVERY AND CANNOT BE COMBINED WITH OTHER PROMOTIONS OR OFFERS. IMAGES FOR ILLUSTRATIVE PURPOSES. SUBWAY® IS A REGISTERED TRADEMARK OF SUBWAY IP LLC. © 2026 SUBWAY IP LLC.',
      'PROMOÇÃO VÁLIDA DE 9 DE SETEMBRO DE 2026 A 19 DE JANEIRO DE 2027, EXCLUSIVAMENTE NOS RESTAURANTES SUBWAY® PARTICIPANTES DO CHILE. EXCETO AEROPORTOS, TERMINAIS RODOVIÁRIOS DE SANTIAGO E POSTOS ARAMCO EM RODOVIAS. O PREÇO DE $2.500 INCLUI UM SUB NAPOLITANO DE 15 CM. TRANSFORMÁ-LO EM SALADA, ADICIONAR ACOMPANHAMENTOS, ADICIONAR EXTRAS E/OU TRANSFORMÁ-LO EM COMBO TERÁ CUSTO ADICIONAL. AO ADICIONAR PROTEÍNA EXTRA, O SUB ASSUME O PREÇO DA PROTEÍNA DE MAIOR VALOR, MAIS A PROTEÍNA DO SUPER ECONÔMICO COMO EXTRA. NÃO VÁLIDO PARA DELIVERY NEM CUMULATIVO COM OUTRAS PROMOÇÕES OU OFERTAS. IMAGENS MERAMENTE ILUSTRATIVAS. SUBWAY® É UMA MARCA REGISTRADA DA SUBWAY IP LLC. © 2026 SUBWAY IP LLC.'],
    'PROMOCIÓN VÁLIDA DEL 09/09/2026 AL 27/10/2026 EN RESTAURANTES SUBWAY® DE CHILE. PRECIO DIFERENCIADO DE ACUERDO A LA UBICACIÓN O TIPO DE TIENDA. INCLUYE 1 SUB DE 15 CM A ELECCIÓN: CERDO MECHADO, POLLO CRISPY O ATÚN; 2 ACOMPAÑAMIENTOS A ELECCIÓN Y 1 BEBIDA A ELECCIÓN: LATA 350 ML, BOTELLA DE AGUA 500 ML, VASO DE BEBIDA REGULAR 350 ML, JUGO 300 ML, CAFÉ PEQUEÑO O MEDIANO. ACOMPAÑAMIENTOS Y SABORES DE BEBIDAS SUJETOS A DISPONIBILIDAD. COSTO ADICIONAL POR INGREDIENTES EXTRAS O CONVERTIR EL SUB A ENSALADA. NO VÁLIDO PARA DELIVERY. NO ACUMULABLE CON OTRAS PROMOCIONES U OFERTAS. SUBWAY® ES UNA MARCA REGISTRADA DE SUBWAY IP LLC. © 2026 SUBWAY IP LLC.': [
      'PROMOTION VALID FROM 09/09/2026 TO 10/27/2026 AT SUBWAY® RESTAURANTS IN CHILE. PRICES MAY DIFFER BY LOCATION OR STORE TYPE. INCLUDES 1 15 CM SUB OF YOUR CHOICE: PULLED PORK, CRISPY CHICKEN OR TUNA; 2 SIDES OF YOUR CHOICE AND 1 DRINK OF YOUR CHOICE: 350 ML CAN, 500 ML WATER BOTTLE, 350 ML REGULAR FOUNTAIN DRINK, 300 ML JUICE, SMALL OR MEDIUM COFFEE. SIDES AND DRINK FLAVORS SUBJECT TO AVAILABILITY. ADDITIONAL COST FOR EXTRA INGREDIENTS OR MAKING THE SUB A SALAD. NOT VALID FOR DELIVERY. CANNOT BE COMBINED WITH OTHER PROMOTIONS OR OFFERS. SUBWAY® IS A REGISTERED TRADEMARK OF SUBWAY IP LLC. © 2026 SUBWAY IP LLC.',
      'PROMOÇÃO VÁLIDA DE 09/09/2026 A 27/10/2026 NOS RESTAURANTES SUBWAY® DO CHILE. PREÇO DIFERENCIADO CONFORME A LOCALIZAÇÃO OU O TIPO DE LOJA. INCLUI 1 SUB DE 15 CM À ESCOLHA: PORCO DESFIADO, FRANGO CRISPY OU ATUM; 2 ACOMPANHAMENTOS À ESCOLHA E 1 BEBIDA À ESCOLHA: LATA 350 ML, GARRAFA DE ÁGUA 500 ML, COPO DE REFRIGERANTE REGULAR 350 ML, SUCO 300 ML, CAFÉ PEQUENO OU MÉDIO. ACOMPANHAMENTOS E SABORES DE BEBIDAS SUJEITOS À DISPONIBILIDADE. CUSTO ADICIONAL POR INGREDIENTES EXTRAS OU PARA TRANSFORMAR O SUB EM SALADA. NÃO VÁLIDO PARA DELIVERY. NÃO CUMULATIVO COM OUTRAS PROMOÇÕES OU OFERTAS. SUBWAY® É UMA MARCA REGISTRADA DA SUBWAY IP LLC. © 2026 SUBWAY IP LLC.'],
  };

  const HTML_LANG = { es: 'es-CL', en: 'en', pt: 'pt-BR' };
  let current = 'es';
  const originals = new WeakMap(); // nodo de texto -> texto original en español

  function tr(text) {
    if (current === 'es') return null;
    const key = text.trim();
    const row = D[key];
    return row ? text.replace(key, row[IDX[current]]) : null;
  }

  function translateNode(node) {
    if (!originals.has(node)) originals.set(node, node.nodeValue);
    const orig = originals.get(node);
    const t = tr(orig);
    const value = t === null ? orig : t;
    if (node.nodeValue !== value) node.nodeValue = value;
  }

  function translateAttrs(el) {
    ['data-tc-text', 'placeholder', 'aria-label'].forEach((attr) => {
      if (!el.hasAttribute || !el.hasAttribute(attr)) return;
      const store = `data-orig-${attr}`;
      if (!el.hasAttribute(store)) el.setAttribute(store, el.getAttribute(attr));
      const orig = el.getAttribute(store);
      const t = tr(orig);
      el.setAttribute(attr, t === null ? orig : t);
    });
  }

  function translateTree(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      if (n.parentElement && /^(SCRIPT|STYLE|OPTION)$/.test(n.parentElement.tagName)) continue;
      if (n.nodeValue.trim()) translateNode(n);
    }
    if (root.querySelectorAll) root.querySelectorAll('[data-tc-text],[placeholder],[aria-label]').forEach(translateAttrs);
  }

  let busy = false;
  function apply(lang) {
    current = lang;
    document.documentElement.lang = HTML_LANG[lang] || 'es-CL';
    busy = true;
    translateTree(document.body);
    observer.takeRecords(); // descarta los cambios hechos por la propia traducción
    busy = false;
    document.querySelectorAll('.country-select').forEach((sel) => {
      const value = Object.keys(LANGS).find((k) => LANGS[k] === lang);
      if (value) sel.value = value;
    });
  }

  // Traduce también lo que se carga después (carrusel, tarjetas, pie de página, ventana legal).
  const observer = new MutationObserver((muts) => {
    if (busy || current === 'es') return;
    busy = true;
    muts.forEach((m) => {
      m.addedNodes.forEach((node) => {
        if (node.nodeType === 3) translateNode(node);
        else if (node.nodeType === 1) translateTree(node);
      });
      if (m.type === 'characterData') { originals.delete(m.target); translateNode(m.target); }
    });
    observer.takeRecords(); // descarta los cambios hechos por la propia traducción
    busy = false;
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });

  function saved() {
    try { return localStorage.getItem('subwayLang'); } catch (e) { return null; }
  }
  function save(lang) {
    try { localStorage.setItem('subwayLang', lang); } catch (e) { /* sin almacenamiento: solo esta visita */ }
  }

  document.querySelectorAll('.country-select').forEach((sel) => {
    sel.addEventListener('change', (e) => {
      const lang = LANGS[e.target.value] || 'es';
      save(lang);
      apply(lang);
    });
  });

  const params = new URLSearchParams(location.search);
  const start = params.get('lang') || saved() || 'es';
  apply(IDX[start] !== undefined ? start : 'es');
})();
