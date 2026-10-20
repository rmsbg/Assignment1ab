'use strict';
(() => {
 const root = document.querySelector('#ausleihe');
 if (!root) return;
 const content = document.querySelector('#rental-content');
 const message = document.querySelector('#rental-message');
 const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const date = value => esc(new Date(value).toLocaleString('de-AT'));
 const initialPerson = new URLSearchParams(location.search).get('person') || '';
 let generation = 0;
 document.querySelector('.skip-link').addEventListener('click', event => {event.preventDefault();document.querySelector('main').focus();});
 async function request(url, options) {
  const response = await fetch(url, {cache:'no-store', ...options});
  const result = await response.json();
  if (!response.ok) throw {errors:result.errors, status:response.status};
  return result;
 }
 function notice(text) {message.textContent=text;message.className=text?'success':'';}
 function showErrors(error) {
  content.querySelectorAll('.field-error').forEach(el=>el.textContent='');
  content.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));
  const errors=error.errors||{form:'Die Verbindung ist fehlgeschlagen. Bitte erneut versuchen.'};
  const summary=document.querySelector('#rental-error');
  summary.textContent=Object.values(errors).join(' ');
  for(const [key,text] of Object.entries(errors)) {
   const field=document.getElementById('rental-error-'+key);if(field)field.textContent=text;
   document.getElementById(key)?.setAttribute('aria-invalid','true');
  }
  summary.focus();
 }
 function skiOptions(skis) {
  return '<option value="">Bitte Ski-Paar wählen</option>'+skis.map(s=>`<option value="${esc(s.id)}">${esc(s.name)} · ${esc(s.id)}</option>`).join('');
 }
 const select = (id,title,options) => `<div class="field"><label for="${id}">${title}</label><select name="${id}" id="${id}" aria-describedby="rental-error-${id}">${options}</select><small class="field-error" id="rental-error-${id}"></small></div>`;
 function rentalList(list,active) {
  if(!list.length)return `<p>${active?'Keine aktiven Ausleihen.':'Noch keine Rückgaben erfasst.'}</p>`;
  return `<ul class="rental-list">${list.map(r=>`<li class="rental-card"><p class="record-id">${esc(r.id)}</p><h3>${esc(r.skiName)}</h3><p>Ski-ID: ${esc(r.skiID)}<br>Person: <a href="/personen#${encodeURIComponent(r.personID)}">${esc(r.personName)}</a> · ${esc(r.personID)}</p><p>Ausgeliehen: ${date(r.rentedAt)}${r.returnedAt?`<br>Zurückgegeben: ${date(r.returnedAt)}`:''}</p>${active?`<button type="button" data-return="${esc(r.id)}">Rückgabe erfassen</button>`:'<span class="returned-badge">Zurückgegeben</span>'}</li>`).join('')}</ul>`;
 }
 async function render(preferredPerson=initialPerson) {
  const own=++generation;
  content.innerHTML='<p>Ausleihen werden geladen …</p>';
  try {
   const [people,skis,rentals]=await Promise.all([request('/api/personen'),request('/api/ski/verfuegbar'),request('/api/ausleihen')]);
   if(own!==generation)return;
   const overview=location.hash==='#uebersicht';
   content.innerHTML=`<div class="section-heading"><h2>${overview?'Ausleihe und Rückgabe':'Ausleihe anlegen'}</h2><div class="actions compact"><button type="button" class="secondary" id="refresh-rentals">Aktualisieren</button>${overview?'<a class="button" href="#neu">Neue Ausleihe</a>':''}</div></div><p id="rental-error" class="field-error" role="alert" tabindex="-1"></p>${!overview?`<form id="rental-form" class="record-panel" novalidate><p>Eine Person und ein verfügbares Ski-Paar auswählen. Der Zeitpunkt wird beim Speichern automatisch erfasst.</p>${!people.length?'<p>Noch keine Personen vorhanden. <a href="/personen#neu">Person anlegen</a></p>':''}${select('personID','Person (Pflichtfeld)','<option value="">Bitte Person wählen</option>'+people.map(p=>`<option value="${esc(p.id)}">${esc(p.name)} · ${esc(p.id)}</option>`).join(''))}${select('skiID','Verfügbares Ski-Paar (Pflichtfeld)',skiOptions(skis))}<p id="no-skis" ${skis.length?'hidden':''}>Keine verfügbaren Ski-Paare. Eine Rückgabe erfassen oder <a href="/ski#neu">ein Ski-Paar anlegen</a>.</p><div class="actions"><button type="submit" ${!people.length||!skis.length?'disabled':''}>Ausleihe speichern</button><a class="button secondary" href="#uebersicht">Abbrechen</a></div></form>`:''}<section class="rental-section" aria-labelledby="active-title"><div class="section-heading"><h2 id="active-title">Aktive Ausleihen</h2></div>${rentalList(rentals.filter(r=>!r.returnedAt),true)}</section><section class="rental-section" aria-labelledby="history-title"><div class="section-heading"><h2 id="history-title">Abgeschlossene Ausleihen</h2></div>${rentalList(rentals.filter(r=>r.returnedAt).reverse(),false)}</section>`;
   const personSelect=document.querySelector('#personID');
   if(personSelect) {
    personSelect.value=people.some(p=>p.id===preferredPerson)?preferredPerson:'';
    if(preferredPerson && !people.some(p=>p.id===preferredPerson))showErrors({errors:{personID:'Die vorausgewählte Person wurde nicht gefunden. Bitte eine vorhandene Person auswählen.'}});
   }
   document.querySelector('#refresh-rentals').addEventListener('click',()=>{notice('');render(personSelect?.value||'').then(focusHeading);});
   document.querySelector('#rental-form')?.addEventListener('submit',async event=>{
    event.preventDefault();
    const form=event.currentTarget,button=form.querySelector('button[type="submit"]');
    const body=JSON.stringify({personID:form.elements.personID.value,skiID:form.elements.skiID.value});
    button.disabled=true;
    try {
     await request('/api/ausleihen',{method:'POST',headers:{'Content-Type':'application/json'},body});
     if(own!==generation)return;
     notice('Ausleihe gespeichert. Das Ski-Paar ist jetzt ausgeliehen.');await render(personSelect.value);
     if(generation===own+1)message.focus();
    } catch(error) {
     if(own!==generation)return;
     showErrors(error);button.disabled=false;
     if(error.status===409||error.status===404) {
      await render(personSelect.value);
      if(generation===own+1)showErrors(error);
     }
    }
   });
   content.querySelectorAll('[data-return]').forEach(button=>button.addEventListener('click',async()=>{
    button.disabled=true;
    try {
     await request('/api/ausleihen/'+encodeURIComponent(button.dataset.return)+'/rueckgabe',{method:'PUT'});
     if(own!==generation)return;
     notice('Rückgabe gespeichert.');await render(personSelect?.value||'');
     if(generation===own+1)message.focus();
    }catch(error){if(own!==generation)return;showErrors(error);button.disabled=false;}
   }));
  } catch(error) {
   if(own!==generation)return;
   content.innerHTML='<p id="rental-error" class="field-error" role="alert" tabindex="-1"></p><button id="retry-rentals" type="button">Erneut laden</button>';
   showErrors(error);document.querySelector('#retry-rentals').addEventListener('click',()=>render(preferredPerson));
  }
 }
 function focusHeading(){const heading=content.querySelector('h2');if(heading){heading.tabIndex=-1;heading.focus();}}
 window.addEventListener('hashchange',()=>{notice('');const expected=generation+1;render().then(()=>{if(generation===expected)focusHeading();});});
 render();
})();
