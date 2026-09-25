(function () {
  const editorEl = document.getElementById('footerEditor');
  let footerData = { columns: [], legal: [] };

  function uid(prefix) {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  function render() {
    editorEl.innerHTML = '';

    footerData.columns.forEach((col, colIndex) => {
      const card = document.createElement('div');
      card.className = 'footer-editor-card';

      const header = document.createElement('div');
      header.className = 'footer-editor-card__header';
      const titleInput = document.createElement('input');
      titleInput.value = col.title || '';
      titleInput.placeholder = 'Título de la columna';
      titleInput.addEventListener('input', () => { col.title = titleInput.value; });
      const removeColBtn = document.createElement('button');
      removeColBtn.textContent = '🗑';
      removeColBtn.title = 'Eliminar esta columna completa';
      removeColBtn.addEventListener('click', () => {
        footerData.columns.splice(colIndex, 1);
        render();
      });
      header.appendChild(titleInput);
      header.appendChild(removeColBtn);
      card.appendChild(header);

      (col.links || []).forEach((link, linkIndex) => {
        card.appendChild(buildLinkRow(link, () => {
          col.links.splice(linkIndex, 1);
          render();
        }));
      });

      const addLinkBtn = document.createElement('button');
      addLinkBtn.className = 'footer-editor-add';
      addLinkBtn.textContent = '+ Agregar link';
      addLinkBtn.addEventListener('click', () => {
        col.links = col.links || [];
        col.links.push({ text: 'Nuevo link', href: 'https://' });
        render();
      });
      card.appendChild(addLinkBtn);

      editorEl.appendChild(card);
    });

    const addColBtn = document.createElement('button');
    addColBtn.className = 'footer-editor-add-col';
    addColBtn.textContent = '+ Agregar columna';
    addColBtn.addEventListener('click', () => {
      footerData.columns.push({ id: uid('col'), title: 'Nueva Columna', links: [] });
      render();
    });
    editorEl.appendChild(addColBtn);

    const legalCard = document.createElement('div');
    legalCard.className = 'footer-editor-card';
    const legalHeader = document.createElement('div');
    legalHeader.className = 'footer-editor-card__header';
    const legalTitle = document.createElement('strong');
    legalTitle.textContent = 'Fila legal (parte inferior del footer)';
    legalHeader.appendChild(legalTitle);
    legalCard.appendChild(legalHeader);

    footerData.legal.forEach((link, linkIndex) => {
      legalCard.appendChild(buildLinkRow(link, () => {
        footerData.legal.splice(linkIndex, 1);
        render();
      }));
    });

    const addLegalBtn = document.createElement('button');
    addLegalBtn.className = 'footer-editor-add';
    addLegalBtn.textContent = '+ Agregar link legal';
    addLegalBtn.addEventListener('click', () => {
      footerData.legal.push({ text: 'Nuevo link', href: 'https://' });
      render();
    });
    legalCard.appendChild(addLegalBtn);

    editorEl.appendChild(legalCard);
  }

  function buildLinkRow(link, onRemove) {
    const row = document.createElement('div');
    row.className = 'footer-editor-row';

    const textInput = document.createElement('input');
    textInput.className = 'link-text';
    textInput.placeholder = 'Texto del link';
    textInput.value = link.text || '';
    textInput.addEventListener('input', () => { link.text = textInput.value; });

    const hrefInput = document.createElement('input');
    hrefInput.className = 'link-href';
    hrefInput.placeholder = 'https://...';
    hrefInput.value = link.href || '';
    hrefInput.addEventListener('input', () => { link.href = hrefInput.value; });

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '✕';
    removeBtn.title = 'Eliminar este link';
    removeBtn.addEventListener('click', onRemove);

    row.appendChild(textInput);
    row.appendChild(hrefInput);
    row.appendChild(removeBtn);
    return row;
  }

  fetch('/api/content/footer')
    .then((res) => res.json())
    .then((data) => {
      footerData = data;
      render();
    })
    .catch((err) => {
      console.error('No se pudo cargar el footer:', err);
      editorEl.innerHTML = '<p>Error al cargar el pie de página.</p>';
    });

  document.getElementById('saveBtn').addEventListener('click', () => {
    if (window.currentAdminTab !== 'footer') return; // el botón se comparte entre pestañas
    const statusMsg = document.getElementById('statusMsg');
    statusMsg.textContent = 'Guardando...';
    statusMsg.classList.remove('is-error');
    fetch('/api/content/footer', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(footerData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('save failed');
        statusMsg.textContent = '✔ Publicado';
        setTimeout(() => { statusMsg.textContent = ''; }, 3000);
      })
      .catch((err) => {
        console.error(err);
        statusMsg.textContent = 'Error al guardar';
        statusMsg.classList.add('is-error');
      });
  });
})();
