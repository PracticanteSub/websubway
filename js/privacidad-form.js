// Formulario del Centro de Privacidad: envía la solicitud a POST /api/solicitudes-privacidad.
(function () {
  const form = document.getElementById('privForm');
  if (!form) return;
  const msg = document.getElementById('privMsg');
  const btn = document.getElementById('privSubmit');

  function show(text, ok) {
    msg.textContent = text;
    msg.className = 'jobs-msg ' + (ok ? 'is-ok' : 'is-error');
  }
  function validRut(rut) {
    const c = rut.replace(/[.\-\s]/g, '').toUpperCase();
    if (!/^\d{7,8}[0-9K]$/.test(c)) return false;
    let sum = 0, mul = 2;
    for (let i = c.length - 2; i >= 0; i--) { sum += Number(c[i]) * mul; mul = mul === 7 ? 2 : mul + 1; }
    const dv = 11 - (sum % 11);
    return c.slice(-1) === (dv === 11 ? '0' : dv === 10 ? 'K' : String(dv));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = new FormData(form);
    if (['nombre', 'rut', 'email', 'tipo', 'mensaje'].some((k) => !String(d.get(k) || '').trim())) return show('Completa todos los campos obligatorios (*).');
    if (!validRut(String(d.get('rut')))) return show('El RUT no es válido. Revisa el número y el dígito verificador.');
    if (!form.email.checkValidity()) return show('El correo electrónico no es válido.');
    if (!d.get('consentimiento')) return show('Debes marcar la declaración para enviar la solicitud.');
    if (location.protocol === 'file:') return show('Para enviar el formulario el sitio debe estar publicado. Mientras tanto, escribe a cusser@subwaychile.cl.');

    btn.disabled = true;
    show('Enviando…', true);
    try {
      const res = await fetch('/api/solicitudes-privacidad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: d.get('nombre'), rut: d.get('rut'), email: d.get('email'), telefono: d.get('telefono') || '',
          tipo: d.get('tipo'), mensaje: d.get('mensaje'), consentimiento: true,
        }),
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      show('Recibimos tu solicitud. Te responderemos al correo que indicaste dentro de los plazos legales.', true);
    } catch (err) {
      show('No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos a cusser@subwaychile.cl.');
    } finally {
      btn.disabled = false;
    }
  });
})();
