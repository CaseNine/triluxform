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
      obj.room_name = getValueFromInputField(b.querySelector('[name$="[room_name]"]'));
      obj.length = parseFloat(getValueFromInputField(b.querySelector('[name$="[length]"]')));
      obj.identical_lengths_lightlines = parseFloat(b.querySelector('[name$="[identical_lengths_lightlines]"]')?.value || 0); // Optional value.
      obj.module_length = getValueFromButton(b.querySelector('.module-length-group'));
      obj.mount_height = getValueFromButton(b.querySelector('.mount-height-group'));
      obj.color = getValueFromButton(b.querySelector('.thumb-row'));
      obj.optic = getValueFromButton(b.querySelector('.optics'));
      obj.dimmable = getValueFromButton(b.querySelector('.dimmable-group'));
      obj.distribute_lightline = getValueFromButton(b.querySelector('.distribute-lightline-group'));
      obj.montage = getValueFromButton(b.querySelector('.montage-group'));
      arr.push(obj);

      if(!obj.room_name || !obj.length || !obj.identical_lengths_lightlines || !obj.module_length || !obj.mount_height || !obj.color || !obj.optic  || !obj.dimmable || !obj.distribute_lightline || !obj.montage){
        b.querySelector('.status').innerHTML = '&#128992; Aanvullen';
      } else {
        b.querySelector('.status').innerHTML = '&#128994; Compleet';
      }
    });

    return arr;
  }

  function updateSummary(){
    const arr = collectConfigs();
    summaryList.innerHTML = '';
    arr.forEach((c, i) => { 
      const li = document.createElement('li');
      li.className = 'summary-item py-2';
      li.innerHTML = `<div class="bi-chevron-compact-right" href="#summary-data[${i}]" data-bs-toggle="collapse" role="button" aria-expanded="false" summary-block>
                      ${(!c.room_name) ? '&#128992 ' : ''}<strong>${i+1}. ${c.room_name || 'Onbenoemd'}</strong></div>
                      <div id="summary-data[${i}]" class="collapse">
                      ${(!c.length) ? '&#128992 ' : ''}<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 15 15"><path fill="currentColor" d="M14.6 4.01a.5.5 0 0 1 .4.49v6a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-6l.01-.1A.5.5 0 0 1 .5 4h14zM1 10h13V5h-1.075v1.5a.425.425 0 1 1-.85 0V5h-1.15v1.5a.425.425 0 1 1-.85 0V5h-1.15v2.5a.425.425 0 1 1-.85 0V5h-1.15v1.5a.425.425 0 1 1-.85 0V5h-1.15v1.5a.425.425 0 1 1-.85 0V5h-1.15v2.5a.425.425 0 1 1-.85 0V5H1z"/></svg>
                      Lengte lichtlijn <div class="small-muted">${(c.length||0)} m </div>
                      ${(!c.identical_lengths_lightlines) ? '&#128992 ' : ''}<i>Aantal identieke lengtes lichtlijn</i> <div class="small-muted"> ${(c.identical_lengths_lightlines||0)} </div>
                      ${(!c.module_length) ? '&#128992 ' : ''}<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M3 21V3h18v18zm2-2h14v-5H5zm0-7h14V5H5zm0 0V5z"/></svg>
                      Module lengte <div class="small-muted">${(c.module_length||0)} mm</div>
                      ${(!c.mount_height) ? '&#128992 ' : ''}<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7V2.6a.6.6 0 0 0-.6-.6H8.6a.6.6 0 0 0-.6.6v18.8a.6.6 0 0 0 .6.6h6.8a.6.6 0 0 0 .6-.6V17m0-10h-3m3 0v5m0 0h-3m3 0v5m0 0h-3"/></svg>
                      Montagehoogte / Lumenpakket <div class="small-muted">${(c.mount_height||0)}</div>
                      ${(!c.color) ? '&#128992 ' : ''}<i class="bi-sun"></i> Lichtkleur <div class="small-muted">${(c.color||0)}</div>
                      ${(!c.optic) ? '&#128992 ' : ''}<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48"><circle cx="25.193" cy="24" r="10.574" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/><circle cx="21.331" cy="12.115" r="8.613" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/><circle cx="35.303" cy="16.655" r="8.613" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/><circle cx="35.303" cy="31.345" r="8.613" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/><circle cx="21.331" cy="35.885" r="8.613" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/><circle cx="12.697" cy="24" r="8.613" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/></svg>
                      Optiek <div class="small-muted">${c.optic || '<br>'}</div>
                      ${(!c.dimmable) ? '&#128992 ' : ''}<i class="bi-sun"></i> Dimbaar <div class="small-muted">${(c.dimmable||'<br>')}</div>
                      ${(!c.distribute_lightline) ? '&#128992 ' : ''}<i class="bi bi-grid-3x3-gap"></i> Indeling lichtlijn <div class="small-muted">${(c.distribute_lightline||'<br>')}</div>
                      ${(!c.montage) ? '&#128992 ' : ''}<i class="bi bi-tools"></i> Montage <div class="small-muted">${(c.montage||'<br>')}</div></div>`;
      summaryList.appendChild(li);
    });

    summaryList.querySelectorAll('[summary-block]').forEach(s => {
      s.addEventListener('click', () => {
        if(s.getAttribute("aria-expanded") == "true"){
          s.classList.remove('bi-chevron-compact-right');
          s.classList.add('bi-chevron-compact-down');
        } else {
          s.classList.remove('bi-chevron-compact-down');
          s.classList.add('bi-chevron-compact-right');
        }
      });
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
        identical_lengths_lightlines: el.querySelector('[name$="[identical_lengths_lightlines]"]').value,
        module_length: (el.querySelector('.module_length.active')?.getAttribute('data-value')).value || '',
        mount_height: (el.querySelector('.mount_height.active')?.getAttribute('data-value')).value || '',
        color: (el.querySelector('.thumb.selected')?.getAttribute('data-value')) || '',
        optic: (el.querySelector('.optbox.selected')?.getAttribute('data-value')) || '',
        dimmable: (el.querySelector('.dimmable.active')?.getAttribute('data-value')).value || '',
        distribute_lightline: (el.querySelector('.distribute_lightline.active')?.getAttribute('data-value')).value || '',
        montage: (el.querySelector('.montage.active')?.getAttribute('data-value')).value || '',
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

    onlyOneButtonIsActivePerClass(el, 'module_length');
    onlyOneButtonIsActivePerClass(el, 'mount_height');
    onlyOneButtonIsActivePerClass(el, 'dimmable');
    onlyOneButtonIsActivePerClass(el, 'distribute_lightline');
    onlyOneButtonIsActivePerClass(el, 'montage');

    // Make it so each configurion only collapses itself.
    el.querySelector('#collapsible').id = `collapsible[${idx}]`;
    const collapser = el.querySelector('#collapser');
    collapser.setAttribute('href', `#collapsible[${idx}]`);

    collapser.addEventListener('click', () => {
      const s = collapser.children[0];
      if(collapser.getAttribute("aria-expanded") == "true"){
        s.classList.remove('bi-chevron-compact-right');
        s.classList.add('bi-chevron-compact-down');
      } else {
        s.classList.remove('bi-chevron-compact-down');
        s.classList.add('bi-chevron-compact-right');
      }
    });

    // set initial values if provided
    if(initial.room_name) el.querySelector('[name$="[room_name]"]').value = initial.room_name;
    if(initial.length) el.querySelector('[name$="[length]"]').value = initial.length;
    //if(initial.inset_type) el.querySelector('[name$="[inset_type]"]').value = initial.inset_type;
    //if(initial.extra_mount) el.querySelector('[name$="[extra_mount]"]').value = initial.extra_mount;

    configsContainer.appendChild(el);

    // set the display spans initial
    const appended = configsContainer.querySelector('[data-block]:last-child');
    appended.querySelector('.cfg-room').textContent = appended.querySelector('[name$="[room_name]"]').value || 'Onbenoemd';
    appended.querySelector('.cfg-length').textContent = (appended.querySelector('[name$="[length]"]').value || 0) + 'm';

    // Add functionality to the minus and plus buttons so that they only update identical lengths lightlines.
    const minus = el.querySelector('[name$="[minus]"');
    const plus = el.querySelector('[name$="[plus]"');
    const identical_lengths_lightlines = el.querySelector('[name$="[identical_lengths_lightlines]"');

    minus.addEventListener('click', () => {
      if(identical_lengths_lightlines.value > 0){
        identical_lengths_lightlines.value = identical_lengths_lightlines.value - 1;
        updateSummary();
      }
    });

    plus.addEventListener('click', () => {
      const currentValue = Number(identical_lengths_lightlines.value) || 0;
      identical_lengths_lightlines.value = currentValue + 1;
      updateSummary();
    });

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
        identical_lengths_lightlines: last.querySelector('[name$="[identical_lengths_lightlines]"]').value,
        module_length: (last.querySelector('.module_length.active')?.getAttribute('data-value')) || '',
        mount_height: (last.querySelector('.mount_height.active')?.getAttribute('data-value')) || '',
        color: (last.querySelector('.thumb.selected')?.getAttribute('data-value')) || '',
        optic: (last.querySelector('.optbox.selected')?.getAttribute('data-value')) || '',
        dimmable: (last.querySelector('.dimmable.active')?.getAttribute('data-value')) || '',
        distribute_lightline: (last.querySelector('.distribute_lightline.active')?.getAttribute('data-value')) || '',
        montage: (last.querySelector('.montage.active')?.getAttribute('data-value')) || '',
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
  createConfig({ room_name: 'Meeting Room 01', length: '8.00', module_length: '2.25', mount_height: '80', color: '3000K', optic: 'wide', dimmable: 'no' });
  createConfig({ room_name: 'Kantoor Tuin', length: '14.20', module_length: '3.0', mount_height: '2300', color: '4000K', optic: 'narrow', dimmable: 'yes' });
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
    submitForm(JSON.stringify(payload));
  });

  function onlyOneButtonIsActivePerClass(el, className){
    el.querySelectorAll('.' + className).forEach(o => {
      o.addEventListener('click', () => {
        el.querySelectorAll('.' + className + '.active').forEach(x => {
          if(x != o){
            x.classList.remove('active');
            x.setAttribute("aria-pressed", "false");
          }
        });
        updateSummary();
      });
    });
  }

  // Also sets an orange circle before the icon and title if it's empty.
  function getValueFromInputField(element){
    var toReturn = '';
    if(element.value){
      element.parentElement.firstChild.textContent = '';
      toReturn = element.value;
    } else if(!element.parentElement.firstChild.textContent) {
      element.parentElement.prepend('\u{1F7E0}', '');
    }
    return toReturn;
  }

  // Also sets an orange circle before the icon and title if it's empty.
  function getValueFromButton(element){
    var toReturn = '';
    console.log(element);
    console.log(element.querySelector('.active'));
    console.log(element.querySelector('.selected'));
    const buttonSelected = element.querySelector('.active') ? element.querySelector('.active') : element.querySelector('.selected');
    if(buttonSelected?.getAttribute('data-value')){
      element.parentElement.firstChild.textContent = '';
      toReturn = buttonSelected.getAttribute('data-value');
    } else if(!element.parentElement.firstChild.textContent.trim()) {
      element.parentElement.prepend('\u{1F7E0}', '');
    }
    return toReturn;
  }

  async function submitForm(payload){
    try {
      const response = await fetch("handler.php", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
      });
      console.log('output:');
      //console.log(await response.text());
      console.log(await response.json());
    } catch (e) {
      console.error(e);
    }
  }  
})();