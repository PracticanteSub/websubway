// Renderiza las columnas de links y la fila legal del footer a partir de
// /api/content/footer (editable en /admin, pestaña "Pie de Página").
// Se incluye en las 3 páginas del sitio para que el footer sea consistente.
(function () {
  const columnsMount = document.getElementById('footerColumnsMount');
  const legalMount = document.getElementById('footerLegalMount');
  if (!columnsMount && !legalMount) return;

  const T = window.SubwayTemplates;

  fetch('/api/content/footer')
    .then((res) => { if (!res.ok) throw new Error(res.status); return res.json(); })
    .catch(() => (window.SUBWAY_CONTENT || {}).footer || {})
    .then((data) => {
      if (columnsMount) {
        columnsMount.innerHTML = '';
        (data.columns || []).forEach((col) => columnsMount.appendChild(T.footerColumn(col)));
      }
      if (legalMount) {
        legalMount.innerHTML = '';
        (data.legal || []).forEach((link) => legalMount.appendChild(T.footerLegalLink(link)));
      }
    })
    .catch((err) => console.error('No se pudo cargar el footer:', err));
})();
