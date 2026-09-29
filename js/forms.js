// Envío genérico de formularios con data-form="<tipo>" a POST /api/formularios/<tipo>.
// Valida campos obligatorios, correo y RUT (campos con data-rut).
(function () {
  const REGIONES = ['Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo', 'Valparaíso', 'Metropolitana de Santiago',
    "Libertador General Bernardo O'Higgins", 'Maule', 'Ñuble', 'Biobío', 'La Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes y la Antártica Chilena'];
  document.querySelectorAll('select[data-regiones]').forEach((sel) => {
    sel.innerHTML = '<option value="">Selecciona una región</option>' + REGIONES.map((r) => `<option>${r}</option>`).join('');
  });

  function validRut(rut) {
    const c = rut.replace(/[.\-\s]/g, '').toUpperCase();
    if (!/^\d{7,8}[0-9K]$/.test(c)) return false;
    let sum = 0, mul = 2;
    for (let i = c.length - 2; i >= 0; i--) { sum += Number(c[i]) * mul; mul = mul === 7 ? 2 : mul + 1; }
    const dv = 11 - (sum % 11);
    return c.slice(-1) === (dv === 11 ? '0' : dv === 10 ? 'K' : String(dv));
  }

  // Convierte los campos del formulario en una fila de la tabla web.<tipo>
  function toRow(tipo, d) {
    const nn = (v) => (v && String(v).trim()) || null;
    if (tipo === 'reclamos') {
      const listaCargada = (window.SUBWAY_LOCALES || []).length > 0;
      return {
        restaurante_numero: listaCargada ? nn(d.restaurante) : null,
        restaurante_texto: d.restaurante_busqueda, nombre: d.nombre, email: d.email, telefono: nn(d.telefono),
        ubicacion: nn(d.ubicacion), fecha_visita: d.fecha_visita, tipo: d.tipo, canal: d.canal, mensaje: d.mensaje, consentimiento: true,
      };
    }
    const row = {};
    Object.keys(d).forEach((k) => { row[k] = k === 'consentimiento' ? true : nn(d[k]); });
    return row;
  }

  document.querySelectorAll('form[data-form]').forEach((form) => {
    const tipo = form.dataset.form;
    const msg = form.querySelector('.jobs-msg');
    const btn = form.querySelector('button[type=submit]');
    const show = (t, ok) => { msg.textContent = t; msg.className = 'jobs-msg ' + (ok ? 'is-ok' : 'is-error'); };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const missing = Array.from(form.querySelectorAll('[required]')).some((el) => (el.type === 'checkbox' ? !el.checked : !String(el.value).trim()));
      if (missing) return show('Completa todos los campos obligatorios (*).');
      const bad = Array.from(form.querySelectorAll('input')).find((el) => el.value && !el.checkValidity());
      if (bad) return show(`Revisa el campo "${bad.closest('label').firstChild.textContent.replace('*', '').trim()}".`);
      const rutField = form.querySelector('[data-rut]');
      if (rutField && !validRut(rutField.value)) return show('El RUT no es válido. Revisa el número y el dígito verificador.');

      const data = {};
      new FormData(form).forEach((v, k) => { data[k] = k === 'consentimiento' ? true : String(v); });
      btn.disabled = true;
      show('Enviando…', true);
      try {
        await window.SB.insert(tipo, toRow(tipo, data));
        form.reset();
        show('¡Gracias! Recibimos tu mensaje y te contactaremos pronto.', true);
      } catch (err) {
        console.error('[Formulario ' + tipo + ']', err);
        const t = String(err && err.message || err);
        let why = '';
        if (/Failed to fetch|NetworkError|Load failed/i.test(t)) why = ' (sin conexión con la base de datos)';
        else if (/PGRST106|schema must be one of|Invalid schema/i.test(t)) why = ' (el esquema "web" no está habilitado en Supabase)';
        else if (/42P01|does not exist|PGRST205|Could not find the table/i.test(t)) why = ' (falta crear las tablas en Supabase)';
        else if (/42501|row-level security|permission denied/i.test(t)) why = ' (permiso denegado en Supabase)';
        else if (/23514|check constraint/i.test(t)) why = ' (algún dato no cumple el formato)';
        const code = (t.match(/Supabase (\d+)/) || [])[1];
        show('No pudimos enviar el formulario' + why + (code ? ' [' + code + ']' : '') + '. Inténtalo de nuevo más tarde.');
      } finally {
        btn.disabled = false;
      }
    });
  });
})();
