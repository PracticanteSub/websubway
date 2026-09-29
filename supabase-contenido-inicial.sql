-- Carga inicial del contenido actual del sitio (banners, promociones, pie de página).
-- Ejecutar DESPUÉS de supabase-sitio-web.sql. Se puede volver a ejecutar: reemplaza el contenido.
insert into web.contenido_sitio (clave, datos, actualizado_por) values
  ('home',   '{
  "hero": [
    {
      "id": "hero-1",
      "eyebrow": "",
      "title": "Descubre las nuevas recetas Subway Series®. ¡Pruébalas todas!",
      "description": "Mechada de Cerdo Signature, Palta Chicken Supremo y Trilogía de Carnes",
      "ctaText": "Pruébalo hoy",
      "ctaHref": "https://restaurantes.subway.com/chile",
      "tcApp": "",
      "tcText": "Aplican Términos y Condiciones",
      "tcLegal": "Subway® es una marca registrada de Subway IP LLC. ©2026 Subway IP LLC. Recetas disponibles en restaurantes participantes de Chile. Imagen referencial. Precios pueden variar según restaurante.",
      "media": {
        "style": "black",
        "emoji": "",
        "image": "assets/img/series.png"
      }
    },
    {
      "id": "hero-2",
      "eyebrow": "",
      "title": "Nuevo Baratísimo",
      "description": "Descubre nuestra nueva receta Napolitana",
      "ctaText": "Encuentra tu Subway más cercano",
      "ctaHref": "https://restaurantes.subway.com/chile",
      "tcApp": "",
      "tcText": "Aplican Términos y Condiciones",
      "tcLegal": "PROMOCIÓN VÁLIDA DESDE EL 9 DE SEPTIEMBRE DE 2026 HASTA EL 19 DE ENERO DE 2027, EXCLUSIVAMENTE EN RESTAURANTES SUBWAY® DE CHILE ADHERIDOS. EXCLUYE AEROPUERTOS, TERMINALES DE BUSES DE SANTIAGO Y ESTACIONES ARAMCO EN CARRETERA. EL PRECIO DE $2.500 INCLUYE UN SUB NAPOLITANO DE 15 CM. CONVERTIRLO EN ENSALADA, AGREGAR ACOMPAÑAMIENTOS, AGREGAR EXTRAS Y/O HACERLO COMBO TENDRÁ EXTRA COSTO ADICIONAL. AL AGREGAR PROTEÍNA EXTRA, EL SUB TOMA EL PRECIO DE PROTEÍNA DE MAYOR VALOR, MÁS LA PROTEÍNA DEL BARATÍSIMO COMO EXTRA. NO VÁLIDO PARA DELIVERY NI ACUMULABLE CON OTRAS PROMOCIONES U OFERTAS. IMÁGENES CON FINES ILUSTRATIVOS. SUBWAY® ES UNA MARCA REGISTRADA DE SUBWAY IP LLC. © 2026 SUBWAY IP LLC.",
      "media": {
        "style": "yellow",
        "emoji": "",
        "image": "assets/img/baratisimo.png"
      }
    },
    {
      "id": "hero-3",
      "eyebrow": "",
      "title": "Súper Combo por $6.700",
      "description": "Elegí tu Sub de Cerdo Mechado, Atún o Pollo Crispy + 2 acompañamientos + 1 bebida.",
      "ctaText": "Encuentra tu Subway más cercano",
      "ctaHref": "https://restaurantes.subway.com/chile",
      "tcApp": "",
      "tcText": "Aplican Términos y Condiciones",
      "tcLegal": "PROMOCIÓN VÁLIDA DEL 09/09/2026 AL 27/10/2026 EN RESTAURANTES SUBWAY® DE CHILE. PRECIO DIFERENCIADO DE ACUERDO A LA UBICACIÓN O TIPO DE TIENDA. INCLUYE 1 SUB DE 15 CM A ELECCIÓN: CERDO MECHADO, POLLO CRISPY O ATÚN; 2 ACOMPAÑAMIENTOS A ELECCIÓN Y 1 BEBIDA A ELECCIÓN: LATA 350 ML, BOTELLA DE AGUA 500 ML, VASO DE BEBIDA REGULAR 350 ML, JUGO 300 ML, CAFÉ PEQUEÑO O MEDIANO. ACOMPAÑAMIENTOS Y SABORES DE BEBIDAS SUJETOS A DISPONIBILIDAD. COSTO ADICIONAL POR INGREDIENTES EXTRAS O CONVERTIR EL SUB A ENSALADA. NO VÁLIDO PARA DELIVERY. NO ACUMULABLE CON OTRAS PROMOCIONES U OFERTAS. SUBWAY® ES UNA MARCA REGISTRADA DE SUBWAY IP LLC. © 2026 SUBWAY IP LLC.",
      "media": {
        "style": "green",
        "emoji": "",
        "image": "assets/img/supercombo.png"
      }
    }
  ],
  "promos": {
    "title": "Promociones y Ofertas",
    "cards": [
      {
        "id": "promo-1",
        "title": "Pide tus Combos Favoritos",
        "description": "Elige el combo que más te gusta y disfrútalo en tu casa.",
        "appName": "Uber Eats",
        "tcText": "Aplican Términos y Condiciones",
        "ctaText": "Ordena en Uber Eats",
        "ctaHref": "https://www.ubereats.com/cl/brand/subway",
        "media": {
          "style": "white",
          "emoji": "🍱",
          "image": "assets/img/promo-ubereats.png"
        },
        "btnColor": "black"
      },
      {
        "id": "promo-2",
        "title": "Pídelo Footlong",
        "description": "Tu Sub preferido en formato Footlong 30cm.",
        "appName": "PedidosYa",
        "tcText": "Aplican Términos y Condiciones",
        "ctaText": "Ordena en PedidosYa",
        "ctaHref": "https://www.pedidosya.cl/cadenas/subway",
        "media": {
          "style": "dark",
          "emoji": "🥖",
          "image": "assets/img/promo-pedidosya.png"
        },
        "btnColor": "black"
      },
      {
        "id": "promo-3",
        "title": "Galletas Recién Horneadas",
        "description": "Con chips de chocolate, macadamia o doble chocolate. ¡Y todas pueden ser tuyas!",
        "appName": "Rappi",
        "tcText": "Aplican Términos y Condiciones",
        "ctaText": "Ordena en Rappi",
        "ctaHref": "https://rappi.app.link/SubwayxRappi",
        "media": {
          "style": "green",
          "emoji": "🍪",
          "image": "assets/img/promo-rappi.png"
        },
        "btnColor": "black"
      }
    ]
  },
  "ctaBanners": [
    {
      "id": "cta-1",
      "style": "green",
      "title": "Ordena lo que Quieras,\nCuando Quieras",
      "subtitle": "¡Obtener Subway nunca fue tan fácil!",
      "ctaText": "",
      "ctaHref": "https://order.subway.com/es-cl",
      "image": "assets/img/banner-ordena.png"
    }
  ]
}'::jsonb, 'carga inicial'),
  ('footer', '{
  "columns": [
    {
      "id": "col-1",
      "title": "Conócenos",
      "links": [
        {
          "text": "Acerca de Subway®",
          "href": "acerca-de-subway.html"
        },
        {
          "text": "Noticias",
          "href": "https://newsroom.subway.com/"
        },
        {
          "text": "Contáctanos",
          "href": "contactanos.html"
        }
      ]
    },
    {
      "id": "col-2",
      "title": "Compromiso",
      "links": [
        {
          "text": "Bienestar",
          "href": "https://www.subway.com/es-cl/sustainability/well-being/quality-and-food-safety"
        },
        {
          "text": "Nuestro Planeta",
          "href": "https://www.subway.com/es-cl/sustainability/preserve-our-planet/packaging-sustainability"
        },
        {
          "text": "Comunidades",
          "href": "comunidades.html"
        }
      ]
    },
    {
      "id": "col-3",
      "title": "Negocio",
      "links": [
        {
          "text": "Abre tu Franquicia",
          "href": "franquicias.html"
        },
        {
          "text": "Partners: The Feed",
          "href": "https://thefeed.subway.com/"
        },
        {
          "text": "Empleos",
          "href": "trabaja-con-nosotros.html"
        }
      ]
    }
  ],
  "legal": [
    {
      "text": "Privacidad",
      "href": "privacidad.html"
    },
    {
      "text": "Centro de Privacidad",
      "href": "centro-de-privacidad.html"
    },
    {
      "text": "Configuración de Cookies y Anuncios",
      "href": "#cookie-settings"
    }
  ]
}'::jsonb, 'carga inicial')
on conflict (clave) do update set datos = excluded.datos, actualizado_en = now(), actualizado_por = excluded.actualizado_por;
