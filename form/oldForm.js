(function(){
  // DOM refs
  const configsContainer = document.getElementById('configs');
  const template = document.getElementById('config-template');
  const addBtn = document.getElementById('addConfig');
  const addCopyBtn = document.getElementById('addFromTemplate');
  const summaryList = document.getElementById('summaryList');
  const previewJSON = document.getElementById('previewJSON');
  const jsonContent = document.getElementById('jsonContent');
  const clearAll = document.getElementById('clearAll');
  const finishButtons = [document.getElementById('finish'), document.getElementById('to-finish')];
  const finishPage = document.getElementById('finish-page');
  const backTo = document.getElementById('back-to-config');
  const sendProject = document.getElementById('sendProject');
  const projectName = document.getElementById('projectName');
  const jsonModalEl = document.getElementById('jsonModal');
  const jsonModal = new bootstrap.Modal(jsonModalEl);

  let idxCounter = 0;

  function collectConfigs(){
    const blocks = configsContainer.querySelectorAll('[data-block]');
    const arr = [];
    blocks.forEach((b, i) => {
      const obj = {};
      obj.room_name = b.querySelector('[name$="[room_name]"]')?.value || '';
      obj.length = parseFloat(b.querySelector('[name$="[length]"]')?.value || 0);
      obj.module_length = b.querySelector('[name$="[module_length]"]')?.value || '';
      obj.mounting_type = b.querySelector('[name$="[mounting_type]"]')?.value || '';
      obj.mount_height = b.querySelector('[name$="[mount_height]"]')?.value || '';
      const thumb = b.querySelector('.thumb.selected');
      obj.color = thumb ? thumb.getAttribute('data-value') : '';
      const opt = b.querySelector('.optbox.selected');
      obj.optic = opt ? opt.getAttribute('data-value') : '';
      const dim = b.querySelector('[name$="[dimmable]"]:checked');
      obj.dimmable = dim ? dim.value : 'no';
      obj.inset_type = b.querySelector('[name$="[inset_type]"]')?.value || '';
      obj.extra_mount = b.querySelector('[name$="[extra_mount]"]')?.value || '';
      arr.push(obj);
    });
    return arr;
  }

  function updateSummary(){
    const arr = collectConfigs();
    summaryList.innerHTML = '';
    arr.forEach((c, i) => { 
      const li = document.createElement('li');
      li.className = 'summary-item py-2';
      li.innerHTML = `<div><strong>${i+1}. ${c.room_name || 'Onbenoemd'}</strong><div class="small-muted">${(c.length||0)} m · ${c.color || ''} · ${c.optic || ''}</div></div>
                      <div class="small-muted">${c.dimmable === 'yes' ? 'Dimbaar' : ''}</div>`;
      summaryList.appendChild(li);
    });
  }

  function createConfig(initial = {}){
    const node = template.content.cloneNode(true);
    const el = node.querySelector('[data-block]');
    const idx = idxCounter++;

    // rewrite names to array style
    el.querySelectorAll('[name]').forEach(inp => {
      const name = inp.getAttribute('name');
      inp.setAttribute('name', `configurations[${idx}][${name}]`);
    });

    el.querySelector('.cfg-num').textContent = idx + 1;
    const roomSpan = el.querySelector('.cfg-room');
    const lengthSpan = el.querySelector('.cfg-length');

    const removeBtn = el.querySelector('[data-action="remove"]');
    const duplicateBtn = el.querySelector('[data-action="duplicate"]');
    const saveBtn = el.querySelector('[data-action="save"]');
    const toggleBtns = el.querySelectorAll('.toggle-collapse');
    const collapseEl = el.querySelector('.content');

    // use Bootstrap collapse API for each block by creating a separate collapse instance
    // but since template uses class selector for target, we'll control manually for simplicity

    toggleBtns.forEach(t => {
      t.addEventListener('click', () => {
        if(collapseEl.classList.contains('show')){
          // hide
          new bootstrap.Collapse(collapseEl, { toggle: false }).hide();
          t.textContent = 'Uitklappen';
        } else {
          new bootstrap.Collapse(collapseEl, { toggle: false }).show();
          t.textContent = 'Inklappen';
        }
      });
    });

    removeBtn.addEventListener('click', () => { el.remove(); updateIndexes(); updateSummary(); });

    duplicateBtn.addEventListener('click', () => {
      const data = {
        room_name: el.querySelector('[name$="[room_name]"]').value,
        length: el.querySelector('[name$="[length]"]').value,
        module_length: el.querySelector('[name$="[module_length]"]').value,
        mounting_type: el.querySelector('[name$="[mounting_type]"]').value,
        mount_height: el.querySelector('[name$="[mount_height]"]').value,
        color: (el.querySelector('.thumb.selected')?.getAttribute('data-value')) || '',
        optic: (el.querySelector('.optbox.selected')?.getAttribute('data-value')) || '',
        dimmable: el.querySelector('[name$="[dimmable]"]:checked')?.value || 'no',
        inset_type: el.querySelector('[name$="[inset_type]"]').value,
        extra_mount: el.querySelector('[name$="[extra_mount]"]').value
      };
      const newEl = createConfig(data);
      // ensure it's visible
      const newCollapse = newEl.querySelector('.content');
      new bootstrap.Collapse(newCollapse, { toggle: false }).show();
      updateSummary();
    });

    saveBtn.addEventListener('click', () => {
      new bootstrap.Collapse(collapseEl, { toggle: false }).hide();
      toggleBtns.forEach(t=>t.textContent='Uitklappen');
      updateSummary();
    });

    el.querySelectorAll('input, select, textarea').forEach(inp => {
      inp.addEventListener('input', () => {
        roomSpan.textContent = el.querySelector('[name$="[room_name]"]').value || 'Onbenoemd';
        lengthSpan.textContent = (el.querySelector('[name$="[length]"]').value || 0) + ' m';
        updateSummary();
      });
    });

    // thumb selection
    el.querySelectorAll('.thumb').forEach(t => {
      t.addEventListener('click', () => {
        el.querySelectorAll('.thumb').forEach(x => x.classList.remove('selected'));
        t.classList.add('selected');
        updateSummary();
      });
      t.addEventListener('keydown', (ev) => { if(ev.key === 'Enter') t.click(); });
      if(initial.color && t.getAttribute('data-value') === initial.color) t.classList.add('selected');
    });

    // optics
    el.querySelectorAll('.optbox').forEach(o => {
      o.addEventListener('click', () => {
        el.querySelectorAll('.optbox').forEach(x => x.classList.remove('selected'));
        o.classList.add('selected');
        updateSummary();
      });
      if(initial.optic && o.getAttribute('data-value') === initial.optic) o.classList.add('selected');
    });

    // set initial values if provided
    if(initial.room_name) el.querySelector('[name$="[room_name]"]').value = initial.room_name;
    if(initial.length) el.querySelector('[name$="[length]"]').value = initial.length;
    if(initial.module_length) el.querySelector('[name$="[module_length]"]').value = initial.module_length;
    if(initial.mounting_type) el.querySelector('[name$="[mounting_type]"]').value = initial.mounting_type;
    if(initial.mount_height) el.querySelector('[name$="[mount_height]"]').value = initial.mount_height;
    if(initial.dimmable){
      const rad = el.querySelector(`[name$="[dimmable]"][value="${initial.dimmable}"]`);
      if(rad) rad.checked = true;
    }
    if(initial.inset_type) el.querySelector('[name$="[inset_type]"]').value = initial.inset_type;
    if(initial.extra_mount) el.querySelector('[name$="[extra_mount]"]').value = initial.extra_mount;

    configsContainer.appendChild(el);

    // set the display spans initial
    const appended = configsContainer.querySelector('[data-block]:last-child');
    appended.querySelector('.cfg-room').textContent = appended.querySelector('[name$="[room_name]"]').value || 'Onbenoemd';
    appended.querySelector('.cfg-length').textContent = (appended.querySelector('[name$="[length]"]').value || 0) + 'm';

    updateSummary();
    return appended;
  }

  function updateIndexes(){
    configsContainer.querySelectorAll('[data-block]').forEach((b, i) => {
      const num = b.querySelector('.cfg-num');
      if(num) num.textContent = i+1;
    });
  }

  // wiring
  addBtn.addEventListener('click', () => createConfig());
  addCopyBtn.addEventListener('click', () => {
    const last = configsContainer.querySelector('[data-block]:last-child');
    if(last){
      const data = {
        room_name: last.querySelector('[name$="[room_name]"]').value,
        length: last.querySelector('[name$="[length]"]').value,
        module_length: last.querySelector('[name$="[module_length]"]').value,
        mounting_type: last.querySelector('[name$="[mounting_type]"]').value,
        mount_height: last.querySelector('[name$="[mount_height]"]').value,
        color: (last.querySelector('.thumb.selected')?.getAttribute('data-value')) || '',
        optic: (last.querySelector('.optbox.selected')?.getAttribute('data-value')) || '',
        dimmable: last.querySelector('[name$="[dimmable]"]:checked')?.value || 'no',
        inset_type: last.querySelector('[name$="[inset_type]"]').value,
        extra_mount: last.querySelector('[name$="[extra_mount]"]').value
      };
      createConfig(data);
    } else {
      createConfig();
    }
  });

  previewJSON.addEventListener('click', () => {
    const payload = { project_name: projectName.value, configurations: collectConfigs() };
    jsonContent.textContent = JSON.stringify(payload, null, 2);
    jsonModal.show();
  });

  clearAll.addEventListener('click', () => {
    if(confirm('Alle configuraties verwijderen?')){
      configsContainer.innerHTML = '';
      idxCounter = 0;
      updateSummary();
    }
  });

  // initial seeds
  createConfig({ room_name: 'Meeting Room 01', length: '8.00', module_length: '2.25', mounting_type: 'inbouw', mount_height: '80', color: '3000K', optic: 'wide', dimmable: 'no' });
  createConfig({ room_name: 'Kantoor Tuin', length: '14.20', module_length: '3.0', mounting_type: 'pendel', mount_height: '2300', color: '4000K', optic: 'narrow', dimmable: 'yes' });
  updateSummary();

  finishButtons.forEach(b => b.addEventListener('click', () => {
    finishPage.style.display = 'block';
    finishPage.scrollIntoView({ behavior: 'smooth' });
  }));
  backTo.addEventListener('click', () => { finishPage.style.display = 'none'; window.scrollTo({ top:0, behavior:'smooth' }); });

  sendProject.addEventListener('click', () => {
    const payload = { project_name: projectName.value, contact: Object.fromEntries(new FormData(document.getElementById('finishForm')).entries()), configurations: collectConfigs() };
    alert('Project verzonden!\n\nBekijk console voor JSON payload.');
    console.log('Payload:', payload);
  });

})();