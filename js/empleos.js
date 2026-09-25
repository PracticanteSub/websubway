// Formulario "Trabaja con Nosotros": valida y envía la postulación al servidor
// (POST /api/postulaciones). Si el sitio se abre sin servidor, sugiere el correo.
(function () {
  const form = document.getElementById('jobsForm');
  if (!form) return;
  const msg = document.getElementById('jobsMsg');
  const btn = document.getElementById('jobsSubmit');
  const MAX = 5 * 1024 * 1024;

  function show(text, ok) {
    msg.textContent = text;
    msg.className = 'jobs-msg ' + (ok ? 'is-ok' : 'is-error');
  }

  function validRut(rut) {
    const clean = rut.replace(/[.\-\s]/g, '').toUpperCase();
    if (!/^\d{7,8}[0-9K]$/.test(clean)) return false;
    const body = clean.slice(0, -1);
    let sum = 0, mul = 2;
    for (let i = body.length - 1; i >= 0; i--) { sum += Number(body[i]) * mul; mul = mul === 7 ? 2 : mul + 1; }
    const dv = 11 - (sum % 11);
    const expected = dv === 11 ? '0' : dv === 10 ? 'K' : String(dv);
    return clean.slice(-1) === expected;
  }

  function readFile(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result).split(',')[1]);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const need = ['nombre', 'rut', 'email', 'telefono', 'region', 'comuna'];
    if (need.some((k) => !String(d.get(k) || '').trim())) return show('Completa todos los campos obligatorios (*).');
    if (!validRut(String(d.get('rut')))) return show('El RUT no es válido. Revisa el número y el dígito verificador.');
    if (!form.email.checkValidity()) return show('El correo electrónico no es válido.');
    if (!d.get('consentimiento')) return show('Debes aceptar el uso de tus datos para postular.');

    const file = form.cv.files[0];
    if (file && file.size > MAX) return show('El CV pesa más de 5 MB. Prueba con un archivo más liviano.');
    if (file && !/\.(pdf|docx?)$/i.test(file.name)) return show('El CV debe ser PDF o Word.');

    if (location.protocol === 'file:') {
      return show('Para enviar el formulario el sitio debe estar publicado. Mientras tanto, envía tus datos a rrhh@subwaychile.cl.');
    }

    btn.disabled = true;
    show('Enviando…', true);
    try {
      const payload = {
        nombre: d.get('nombre'), rut: d.get('rut'), email: d.get('email'), telefono: d.get('telefono'),
        region: d.get('region'), comuna: d.get('comuna'), mensaje: d.get('mensaje') || '',
        consentimiento: true,
        cv: file ? { nombre: file.name, datos: await readFile(file) } : null,
      };
      const res = await fetch('/api/postulaciones', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      show('¡Gracias! Recibimos tu postulación. Te contactaremos si hay una vacante en tu zona.', true);
    } catch (err) {
      show('No pudimos enviar tu postulación. Inténtalo de nuevo o escríbenos a rrhh@subwaychile.cl.');
    } finally {
      btn.disabled = false;
    }
  });
})();
