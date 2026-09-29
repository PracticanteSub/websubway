// Conexión del sitio público con Supabase (esquema "web").
// La anon key es pública por diseño: las reglas de seguridad de la base
// solo le permiten crear registros de formularios y leer locales/contenido.
// NUNCA poner aquí la service_role key.
window.SB = (function () {
  const URL = 'https://cwcwinbdzbvhlmtemsde.supabase.co';
  const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3Y3dpbmJkemJ2aGxtdGVtc2RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2ODY3MjMsImV4cCI6MjEwMzI2MjcyM30.Syc692dSdd1dzv69WQDpYjGWFOrNKKm2HdPTwBQJ4Zo';
  const base = { apikey: KEY, Authorization: `Bearer ${KEY}` };

  async function insert(table, row) {
    const res = await fetch(`${URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: { ...base, 'Content-Type': 'application/json', 'Content-Profile': 'web', Prefer: 'return=minimal' },
      body: JSON.stringify(row),
    });
    if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  }

  async function select(table, query) {
    const res = await fetch(`${URL}/rest/v1/${table}?${query || 'select=*'}`, {
      headers: { ...base, 'Accept-Profile': 'web' },
    });
    if (!res.ok) throw new Error(`Supabase ${res.status}`);
    return res.json();
  }

  async function upload(bucket, path, file) {
    const res = await fetch(`${URL}/storage/v1/object/${bucket}/${encodeURIComponent(path)}`, {
      method: 'POST',
      headers: { ...base, 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': 'false' },
      body: file,
    });
    if (!res.ok) throw new Error(`Storage ${res.status}`);
    return path;
  }

  return { insert, select, upload };
})();
