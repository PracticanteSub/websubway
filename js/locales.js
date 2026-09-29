// Buscador de restaurante para el formulario de Contáctanos.
// El cliente escribe nombre, dirección, comuna o número; al elegir un local se guarda
// su NÚMERO en el campo oculto "restaurante" (que es lo que usa la base de datos).
//
// Lista de locales: por ahora se completa aquí. Cuando se conecte Supabase,
// se cargará automáticamente desde la tabla de locales.
// Formato: { numero: '12345', nombre: 'Providencia', direccion: 'Av. ...', comuna: 'Providencia' }
window.SUBWAY_LOCALES = window.SUBWAY_LOCALES || [];

(function () {
  const input = document.querySelector('input[name="restaurante_busqueda"]');
  const hidden = document.querySelector('input[name="restaurante"]');
  const list = document.getElementById('localesList');
  if (!input || !hidden || !list) return;

  const norm = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  let items = [];
  let active = -1;

  function close() { list.hidden = true; list.innerHTML = ''; active = -1; input.setAttribute('aria-expanded', 'false'); }

  function choose(local) {
    input.value = `${local.nombre} (N° ${local.numero})`;
    hidden.value = local.numero;
    close();
  }

  function render(q) {
    const locales = window.SUBWAY_LOCALES;
    // Sin lista cargada: se acepta lo que escriba el cliente y el equipo lo identifica.
    if (!locales.length) { hidden.value = input.value.trim(); return close(); }
    const terms = norm(q).split(/\s+/).filter(Boolean);
    items = terms.length
      ? locales.filter((l) => {
          const hay = norm(`${l.numero} ${l.nombre} ${l.direccion} ${l.comuna}`);
          return terms.every((t) => hay.includes(t));
        }).slice(0, 8)
      : [];
    list.innerHTML = '';
    if (!items.length) {
      if (terms.length) {
        const li = document.createElement('li');
        li.textContent = 'No encontramos ese local. Revisa lo que escribiste o indica la comuna.';
        li.setAttribute('aria-disabled', 'true');
        list.appendChild(li);
        list.hidden = false;
      } else close();
      return;
    }
    items.forEach((l, i) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.id = `local-opt-${i}`;
      const strong = document.createElement('strong');
      strong.textContent = l.nombre;
      const small = document.createElement('small');
      small.textContent = [l.direccion, l.comuna, `N° ${l.numero}`].filter(Boolean).join(' · ');
      li.append(strong, small);
      li.addEventListener('mousedown', (e) => { e.preventDefault(); choose(l); });
      list.appendChild(li);
    });
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  if (window.SB) {
    window.SB.select('locales_publicos', 'select=numero,nombre,direccion,comuna&order=nombre')
      .then((rows) => { if (Array.isArray(rows) && rows.length) window.SUBWAY_LOCALES = rows; })
      .catch(() => { /* sin conexión: se acepta texto libre */ });
  }

  input.addEventListener('input', () => { hidden.value = ''; render(input.value); });
  input.addEventListener('keydown', (e) => {
    if (list.hidden || !items.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      Array.from(list.children).forEach((li, i) => li.setAttribute('aria-selected', String(i === active)));
      input.setAttribute('aria-activedescendant', `local-opt-${active}`);
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault();
      choose(items[active]);
    } else if (e.key === 'Escape') close();
  });
  input.addEventListener('blur', () => setTimeout(close, 150));

  // Al enviar: si hay lista de locales, exige elegir uno de la lista.
  input.form.addEventListener('submit', (e) => {
    if (window.SUBWAY_LOCALES.length && !hidden.value) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const msg = input.form.querySelector('.jobs-msg');
      msg.textContent = 'Elige tu restaurante de la lista (escribe el nombre, la calle o la comuna).';
      msg.className = 'jobs-msg is-error';
      input.focus();
    }
  }, true);
})();
