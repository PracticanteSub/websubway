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
      if (location.protocol === 'file:') return show('Para enviar el formulario el sitio debe estar publicado.');

      const data = {};
      new FormData(form).forEach((v, k) => { data[k] = k === 'consentimiento' ? true : String(v); });
      btn.disabled = true;
      show('Enviando…', true);
      try {
        const res = await fetch(`/api/formularios/${tipo}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        show('¡Gracias! Recibimos tu mensaje y te contactaremos pronto.', true);
      } catch (err) {
        show('No pudimos enviar el formulario. Inténtalo de nuevo más tarde.');
      } finally {
        btn.disabled = false;
      }
    });
  });
})();
