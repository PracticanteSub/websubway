require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const basicAuth = require('express-basic-auth');

const app = express();
const PORT = process.env.PORT || 3000;
const CONTENT_DIR = path.join(__dirname, 'content');

// Solo estos nombres de página tienen contenido editable (evita path traversal
// y evita que alguien intente leer/escribir un JSON arbitrario del servidor).
const ALLOWED_PAGES = new Set(['home', 'footer']);

const auth = basicAuth({
  users: { [process.env.ADMIN_USER || 'admin']: process.env.ADMIN_PASS || 'admin' },
  challenge: true,
  realm: 'Subway CL - Panel de contenido',
});

// --- Archivos internos que NUNCA deben verse desde internet ---
const PRIVATE = [/^\/postulaciones/i, /^\/solicitudes-privacidad/i, /^\/content\/backups/i, /^\/_respaldo/i, /^\/node_modules/i, /^\/\.env/i, /^\/server\.js$/i, /^\/package(-lock)?\.json$/i, /^\/README/i, /^\/\.git/i, /^\/\.claude/i];
app.use((req, res, next) => (PRIVATE.some((r) => r.test(req.path)) ? res.status(404).end() : next()));

// --- Postulaciones "Trabaja con Nosotros" ---
const POST_DIR = path.join(__dirname, 'postulaciones');
const clip = (v, n) => String(v || '').trim().slice(0, n);
app.post('/api/postulaciones', express.json({ limit: '8mb' }), (req, res) => {
  const b = req.body || {};
  const data = {
    fecha: new Date().toISOString(),
    nombre: clip(b.nombre, 120), rut: clip(b.rut, 12), email: clip(b.email, 120), telefono: clip(b.telefono, 20),
    region: clip(b.region, 60), comuna: clip(b.comuna, 60), mensaje: clip(b.mensaje, 1500), consentimiento: b.consentimiento === true,
  };
  if (!data.nombre || !data.rut || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email) || !data.telefono || !data.region || !data.comuna || !data.consentimiento) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }
  const id = `${data.fecha.replace(/[:.]/g, '-')}-${Math.random().toString(36).slice(2, 8)}`;
  fs.mkdirSync(POST_DIR, { recursive: true });
  if (b.cv && b.cv.datos) {
    const ext = (String(b.cv.nombre || '').match(/\.(pdf|docx?)$/i) || [])[0];
    const buf = Buffer.from(String(b.cv.datos), 'base64');
    if (!ext || buf.length > 5 * 1024 * 1024) return res.status(400).json({ error: 'CV inválido' });
    data.cv = `${id}${ext.toLowerCase()}`;
    fs.writeFileSync(path.join(POST_DIR, data.cv), buf);
  }
  fs.writeFileSync(path.join(POST_DIR, `${id}.json`), JSON.stringify(data, null, 2));
  res.json({ ok: true });
});

// --- Solicitudes del Centro de Privacidad ---
const PRIV_DIR = path.join(__dirname, 'solicitudes-privacidad');
app.post('/api/solicitudes-privacidad', express.json({ limit: '50kb' }), (req, res) => {
  const b = req.body || {};
  const data = {
    fecha: new Date().toISOString(),
    nombre: clip(b.nombre, 120), rut: clip(b.rut, 12), email: clip(b.email, 120), telefono: clip(b.telefono, 20),
    tipo: clip(b.tipo, 120), mensaje: clip(b.mensaje, 2000), consentimiento: b.consentimiento === true,
  };
  if (!data.nombre || !data.rut || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email) || !data.tipo || !data.mensaje || !data.consentimiento) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }
  fs.mkdirSync(PRIV_DIR, { recursive: true });
  const id = `${data.fecha.replace(/[:.]/g, '-')}-${Math.random().toString(36).slice(2, 8)}`;
  fs.writeFileSync(path.join(PRIV_DIR, `${id}.json`), JSON.stringify(data, null, 2));
  res.json({ ok: true });
});

app.use(express.json({ limit: '2mb' }));

// --- API de contenido ---
app.get('/api/content/:page', (req, res) => {
  const { page } = req.params;
  if (!ALLOWED_PAGES.has(page)) return res.status(404).json({ error: 'Página no encontrada' });
  const file = path.join(CONTENT_DIR, `${page}.json`);
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'No se pudo leer el contenido' });
    // Sin caché: el editor y el sitio público siempre deben leer la última
    // versión guardada, nunca una copia vieja guardada por el navegador.
    res.set('Cache-Control', 'no-store');
    res.type('json').send(data);
  });
});

// Guardar cambios requiere estar autenticado (mismas credenciales que /admin).
app.put('/api/content/:page', auth, (req, res) => {
  const { page } = req.params;
  if (!ALLOWED_PAGES.has(page)) return res.status(404).json({ error: 'Página no encontrada' });
  const file = path.join(CONTENT_DIR, `${page}.json`);
  const body = req.body;
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Contenido inválido' });

  // Respaldo simple antes de sobrescribir, por si hay que revertir un cambio.
  const backupDir = path.join(CONTENT_DIR, 'backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  fs.copyFile(file, path.join(backupDir, `${page}-${stamp}.json`), () => {
    fs.writeFile(file, JSON.stringify(body, null, 2), 'utf8', (err) => {
      if (err) return res.status(500).json({ error: 'No se pudo guardar el contenido' });
      // Mantiene actualizada la copia usada al abrir el sitio sin servidor.
      try {
        const home = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'home.json'), 'utf8'));
        const footer = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'footer.json'), 'utf8'));
        fs.writeFileSync(path.join(__dirname, 'js', 'content-data.js'),
          '// Copia del contenido para cuando el sitio se abre sin servidor.\nwindow.SUBWAY_CONTENT = ' + JSON.stringify({ home, footer }, null, 2) + ';\n');
      } catch (e) { console.error('No se pudo actualizar js/content-data.js', e); }
      res.json({ ok: true });
    });
  });
});

// --- Listado de postulaciones para RR.HH. (protegido con la clave del panel) ---
const esc = (v) => String(v || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
app.get('/admin/postulaciones', auth, (req, res) => {
  const files = fs.existsSync(POST_DIR) ? fs.readdirSync(POST_DIR).filter((f) => f.endsWith('.json')).sort().reverse() : [];
  const rows = files.map((f) => {
    const d = JSON.parse(fs.readFileSync(path.join(POST_DIR, f), 'utf8'));
    const cv = d.cv ? `<a href="/admin/postulaciones/cv/${encodeURIComponent(d.cv)}">Descargar</a>` : '—';
    return `<tr><td>${esc(d.fecha.slice(0, 16).replace('T', ' '))}</td><td>${esc(d.nombre)}</td><td>${esc(d.rut)}</td><td><a href="mailto:${esc(d.email)}">${esc(d.email)}</a></td><td>${esc(d.telefono)}</td><td>${esc(d.region)}</td><td>${esc(d.comuna)}</td><td>${esc(d.mensaje)}</td><td>${cv}</td></tr>`;
  }).join('');
  res.set('Cache-Control', 'no-store').send(`<!doctype html><html lang="es"><meta charset="utf-8"><title>Postulaciones | Subway Chile</title>
<style>body{font-family:Arial,sans-serif;margin:24px;color:#222}table{border-collapse:collapse;width:100%;font-size:14px}th,td{border:1px solid #ddd;padding:8px;text-align:left;vertical-align:top}th{background:#008938;color:#fff}tr:nth-child(even){background:#f6f6f6}a{color:#008938}</style>
<h1>Postulaciones recibidas (${files.length})</h1><p><a href="/admin/">← Volver al panel</a></p>
<table><tr><th>Fecha (UTC)</th><th>Nombre</th><th>RUT</th><th>Correo</th><th>Teléfono</th><th>Región</th><th>Comuna</th><th>Mensaje</th><th>CV</th></tr>${rows || '<tr><td colspan="9">Aún no hay postulaciones.</td></tr>'}</table></html>`);
});
app.get('/admin/postulaciones/cv/:file', auth, (req, res) => {
  const name = path.basename(req.params.file);
  if (!/^[\w-]+\.(pdf|docx?)$/i.test(name)) return res.status(404).end();
  res.download(path.join(POST_DIR, name));
});

app.get('/admin/solicitudes-privacidad', auth, (req, res) => {
  const files = fs.existsSync(PRIV_DIR) ? fs.readdirSync(PRIV_DIR).filter((f) => f.endsWith('.json')).sort().reverse() : [];
  const rows = files.map((f) => {
    const d = JSON.parse(fs.readFileSync(path.join(PRIV_DIR, f), 'utf8'));
    return `<tr><td>${esc(d.fecha.slice(0, 16).replace('T', ' '))}</td><td>${esc(d.nombre)}</td><td>${esc(d.rut)}</td><td><a href="mailto:${esc(d.email)}">${esc(d.email)}</a></td><td>${esc(d.telefono)}</td><td>${esc(d.tipo)}</td><td>${esc(d.mensaje)}</td></tr>`;
  }).join('');
  res.set('Cache-Control', 'no-store').send(`<!doctype html><html lang="es"><meta charset="utf-8"><title>Solicitudes de privacidad | Subway Chile</title>
<style>body{font-family:Arial,sans-serif;margin:24px;color:#222}table{border-collapse:collapse;width:100%;font-size:14px}th,td{border:1px solid #ddd;padding:8px;text-align:left;vertical-align:top}th{background:#008938;color:#fff}tr:nth-child(even){background:#f6f6f6}a{color:#008938}</style>
<h1>Solicitudes de privacidad (${files.length})</h1><p><a href="/admin/">← Volver al panel</a></p>
<table><tr><th>Fecha (UTC)</th><th>Nombre</th><th>RUT</th><th>Correo</th><th>Teléfono</th><th>Solicitud</th><th>Detalle</th></tr>${rows || '<tr><td colspan="7">Aún no hay solicitudes.</td></tr>'}</table></html>`);
});

// --- Panel de administración (protegido) ---
app.use('/admin', auth, express.static(path.join(__dirname, 'admin')));

// --- Sitio público (estático) ---
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Subway CL corriendo en http://localhost:${PORT}`);
  console.log(`Panel de administración: http://localhost:${PORT}/admin`);
});
