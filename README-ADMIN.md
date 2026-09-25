# Editor de Contenido (Panel /admin)

Permite que Marketing/Diseño edite el banner principal, las tarjetas de
"Promociones y Ofertas" y agregue avisos (banners CTA) **sin tocar código**,
arrastrando bloques y llenando formularios — parecido a armar una plantilla
de correo en Sender/Mailchimp.

## 1. Para TI: cómo desplegarlo

El sitio dejó de ser 100% estático: ahora necesita un servidor **Node.js**
corriendo (antes bastaba con subir los archivos a cualquier hosting).

### Instalar Node.js (si no está instalado)

Descarga la versión LTS desde https://nodejs.org/es (instalador para Windows).
Verifica la instalación abriendo una terminal nueva:

```bash
node --version
npm --version
```

### Configurar y correr el servidor

```bash
npm install
copy .env.example .env
```

Edita `.env` y define un usuario/clave reales para entrar al panel:

```
ADMIN_USER=marketing
ADMIN_PASS=una-clave-segura
```

Luego inicia el servidor:

```bash
npm start
```

- Sitio público: http://localhost:3000
- Panel de edición: http://localhost:3000/admin (pide el usuario/clave del `.env`)

Para producción, sube esta carpeta completa a un hosting que soporte Node.js
(Render, Railway, un VPS, etc. — **no** sirve un hosting solo-estático como
GitHub Pages o Netlify básico, porque el panel necesita guardar cambios en
el servidor).

### Respaldos

Cada vez que alguien guarda desde el panel, se guarda una copia del
contenido anterior en `content/backups/`. Si algo se rompe, se puede
restaurar copiando el respaldo de vuelta a `content/home.json`.

## 2. Para Marketing/Diseño: cómo usar el editor

1. Entra a `/admin` con el usuario y clave que te dio TI.
2. A la izquierda hay 3 bloques para arrastrar:
   - 🎬 **Diapositiva de Banner** → va en la zona "BANNER PRINCIPAL"
   - 🏷️ **Tarjeta de Promoción** → va en la zona "PROMOCIONES Y OFERTAS"
   - 📣 **Banner de Aviso (CTA)** → va en la zona "AVISOS / BANNERS CTA"
3. Arrastra el bloque que quieras agregar a su zona correspondiente.
4. Haz clic sobre cualquier diapositiva/tarjeta/banner ya puesto: a la
   derecha aparecen sus campos (título, descripción, texto del botón, link,
   color de fondo, emoji). Edítalos y verás el cambio reflejado al instante
   en el centro.
5. Para eliminar un bloque, selecciónalo y usa el ícono de basurero que
   aparece sobre él.
6. Cuando termines, haz clic en **"Guardar y Publicar"** arriba a la
   derecha. Los cambios quedan visibles de inmediato en el sitio real —
   si tenías el sitio abierto en otra pestaña, recárgala para verlos
   (no se actualiza sola, hay que refrescar).
7. Usa el botón **"Ver sitio"** para revisar cómo quedó antes de avisar que
   ya está listo.

### Pestaña "Pie de Página"

Arriba del editor hay dos pestañas. La segunda, **"Pie de Página"**, deja
editar los links que aparecen al final de TODAS las páginas del sitio
(las columnas "Conócenos", "Compromiso", "Negocio" y la fila legal de más
abajo). Ahí puedes:

- Cambiar el texto o el link de cualquiera con solo escribir en el campo.
- Borrar un link con el botón ✕.
- Agregar un link nuevo a una columna con "+ Agregar link".
- Agregar una columna nueva completa con "+ Agregar columna".
- Agregar un link a la fila legal con "+ Agregar link legal".

El botón **"Guardar y Publicar"** de arriba guarda lo que esté en la
pestaña que tengas abierta en ese momento (Inicio o Footer), así que
guarda cada una por separado.

### Cosas que por ahora NO se pueden hacer desde el panel

- Cambiar el header, el logo, la tipografía, el logo/idioma/redes sociales
  del footer (son parte del diseño de marca y requieren un cambio de código).
- Agregar tipos de sección nuevos en la home que no sean banner / tarjeta
  de promoción / aviso CTA (se puede ampliar más adelante si se necesita).
- El widget de menú (NerdMonster) y el mapa de ubicaciones no se editan
  aquí — ver las notas dentro de `menu.html` y `ubica-tu-subway.html`.
