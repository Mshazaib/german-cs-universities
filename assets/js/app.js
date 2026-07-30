(() => {
  const state = { programs: [], filtered: [], config: {} };
  const $ = (id) => document.getElementById(id);
  const esc = (value='') => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const unique = (items) => [...new Set(items.filter(Boolean))].sort((a,b)=>a.localeCompare(b));

  function sourceBadge(status){
    const verified = String(status).toLowerCase().startsWith('verified');
    return `<span class="badge ${verified ? 'success' : 'warn'}">${verified ? 'Verified' : 'Needs re-check'}</span>`;
  }
  function vpdBadge(v){
    const s=String(v||'').toLowerCase();
    if(s.startsWith('yes')) return '<span class="badge success">Yes</span>';
    if(s==='no') return '<span class="badge neutral">No</span>';
    if(s.includes('conditional')) return '<span class="badge warn">Conditional</span>';
    return '<span class="badge warn">Not stated</span>';
  }
  function tuitionType(t){
    const s=String(t||'').toLowerCase();
    if(s.includes('€0') || s.includes('no tuition')) return 'free';
    if(/€\s*(1,?500|6,?000)/i.test(s) || s.includes('tuition fees') || s.includes('tuition applies')) return 'paid';
    return 'check';
  }
  function languageType(v){
    const s=String(v||'').toLowerCase();
    return (s.includes('german') || s.includes('mixed')) ? 'Mixed' : 'English';
  }
  function routeGroup(v){
    const s=String(v||'').toLowerCase();
    if(s.includes('vpd')) return 'VPD + university portal';
    if(s.includes('uni-assist') || s.includes('uni assist')) return 'Uni-Assist';
    if(s.includes('university') || s.includes('portal') || s.includes('direct') || s.includes('tucan') || s.includes('tumonline')) return 'University / direct portal';
    return 'Other / check source';
  }
  function admissionGroup(v){
    const s=String(v||'').toLowerCase();
    if(s.includes('without admission restriction') || s.includes('nc-frei') || s.includes('open admission')) return 'Unrestricted / NC-free';
    if(s.includes('local') || s.includes('orts') || s.includes('restricted') || s.includes('nc')) return 'Restricted / NC';
    if(s.includes('aptitude') || s.includes('selection') || s.includes('assessment') || s.includes('qualif')) return 'Selection / aptitude';
    return 'Not stated / other';
  }
  function populateSelect(id, values){
    const el=$(id); const first=el.options[0]; el.innerHTML=''; el.append(first);
    values.forEach(v=>{ const o=document.createElement('option'); o.value=v;o.textContent=v;el.append(o); });
  }
  function setHeader(config){
    $('portalTitle').textContent=config.portalTitle || 'German Universities Portal';
    $('eyebrow').textContent=config.eyebrow || 'PUBLIC PROGRAMME DATABASE';
    $('subtitle').textContent=config.subtitle || '';
    $('readOnlyLabel').textContent=config.readOnlyLabel || 'Public read-only';
    $('footerProvider').textContent=config.dataProvider || 'Muhammad Shazaib';
    $('footerContact').textContent=config.contact || '03120416882';
    $('footerContact').href=`tel:${String(config.contact||'').replace(/\s+/g,'')}`;
    $('footerDisclaimer').textContent=config.disclaimer || '';
  }
  function renderStats(meta){
    const unis=new Set(state.programs.map(p=>p.university));
    const verified=state.programs.filter(p=>String(p.sourceStatus).startsWith('Verified')).length;
    $('statPrograms').textContent=state.programs.length.toLocaleString();
    $('statProgramsNote').textContent=`${state.filtered.length.toLocaleString()} currently visible`;
    $('statUniversities').textContent=unis.size.toLocaleString();
    $('statVerified').textContent=verified.toLocaleString();
    $('statUpdated').textContent=(meta.lastResearchUpdate || state.config.lastResearchUpdate || '—');
  }
  function applyFilters(){
    const q=$('searchInput').value.trim().toLowerCase();
    const university=$('universityFilter').value;
    const field=$('fieldFilter').value;
    const intake=$('intakeFilter').value;
    const language=$('languageFilter').value;
    const route=$('routeFilter').value;
    const vpd=$('vpdFilter').value;
    const admission=$('admissionFilter').value;
    const tuition=$('tuitionFilter').value;
    const status=$('statusFilter').value;

    state.filtered=state.programs.filter(p=>{
      const haystack=[p.university,p.program,p.field,p.language,p.admissionType,p.applicationRoute,p.vpd,p.moi,p.ielts,p.gre,p.tuition,p.semesterFee,p.applicationFee,p.deadlines?.summer,p.deadlines?.winter,p.notes].join(' ').toLowerCase();
      if(q && !haystack.includes(q)) return false;
      if(university && p.university!==university) return false;
      if(field && p.field!==field) return false;
      if(intake && !(p.intakes||[]).includes(intake)) return false;
      if(language && languageType(p.language)!==language) return false;
      if(route && routeGroup(p.applicationRoute)!==route) return false;
      if(vpd==='Yes' && !(String(p.vpd).toLowerCase().startsWith('yes') || String(p.vpd).toLowerCase().includes('conditional'))) return false;
      if(vpd==='No' && String(p.vpd).toLowerCase()!=='no') return false;
      if(vpd==='Unknown' && !['not stated','', 'unknown'].includes(String(p.vpd||'').toLowerCase())) return false;
      if(admission && admissionGroup(p.admissionType)!==admission) return false;
      if(tuition && tuitionType(p.tuition)!==tuition) return false;
      if(status==='verified' && !String(p.sourceStatus).toLowerCase().startsWith('verified')) return false;
      if(status==='recheck' && !String(p.sourceStatus).toLowerCase().startsWith('needs')) return false;
      return true;
    });
    sortPrograms(); render();
  }
  function sortPrograms(){
    const key=$('sortSelect').value;
    state.filtered.sort((a,b)=>{
      if(key==='program') return a.program.localeCompare(b.program)||a.university.localeCompare(b.university);
      if(key==='verified') return Number(!String(a.sourceStatus).startsWith('Verified'))-Number(!String(b.sourceStatus).startsWith('Verified')) || a.university.localeCompare(b.university);
      if(key==='tuition') return ['free','paid','check'].indexOf(tuitionType(a.tuition))-['free','paid','check'].indexOf(tuitionType(b.tuition)) || a.university.localeCompare(b.university);
      return a.university.localeCompare(b.university)||a.program.localeCompare(b.program);
    });
  }
  function render(){
    const rows=$('programRows'); const cards=$('mobileCards'); rows.innerHTML=''; cards.innerHTML='';
    $('resultCount').textContent=`Showing ${state.filtered.length} of ${state.programs.length} programmes`;
    $('statProgramsNote').textContent=`${state.filtered.length.toLocaleString()} currently visible`;
    $('emptyState').hidden=state.filtered.length>0;
    state.filtered.forEach(p=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`
        <td class="university">${esc(p.university)}</td>
        <td class="program-title">${esc(p.program)}</td>
        <td>${esc(p.field)}</td>
        <td>${esc((p.intakes||[]).join(' / '))}</td>
        <td>${esc(p.deadlines?.winter||'Not stated')}</td>
        <td>${esc(p.deadlines?.summer||'Not stated')}</td>
        <td>${esc(routeGroup(p.applicationRoute))}</td>
        <td>${vpdBadge(p.vpd)}</td>
        <td>${esc(p.ielts||'Not stated')}</td>
        <td>${esc(p.tuition||'Check source')}</td>
        <td>${esc(admissionGroup(p.admissionType))}</td>
        <td>${sourceBadge(p.sourceStatus)}</td>
        <td><button class="details-button" data-id="${esc(p.id)}">View</button></td>`;
      rows.appendChild(tr);

      const card=document.createElement('article'); card.className='program-card';
      card.innerHTML=`<div class="card-university">${esc(p.university)}</div><h3>${esc(p.program)}</h3><span class="badge neutral">${esc(p.field)}</span>
        <div class="card-grid">
          <div><span>Intake</span><strong>${esc((p.intakes||[]).join(' / '))}</strong></div>
          <div><span>IELTS / English</span><strong>${esc(p.ielts)}</strong></div>
          <div><span>Winter deadline</span><strong>${esc(p.deadlines?.winter)}</strong></div>
          <div><span>Tuition</span><strong>${esc(p.tuition)}</strong></div>
        </div><div class="card-footer">${sourceBadge(p.sourceStatus)}<button class="details-button" data-id="${esc(p.id)}">View details</button></div>`;
      cards.appendChild(card);
    });
  }
  function openDetails(id){
    const p=state.programs.find(x=>x.id===id); if(!p) return;
    $('dialogTitle').textContent=p.program; $('dialogUniversity').textContent=p.university;
    const item=(label,val)=>`<div class="detail-item"><span>${esc(label)}</span><strong>${esc(val||'Not stated')}</strong></div>`;
    const sources=(p.sources||[]).length ? p.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label||'Open source')} ↗</a>`).join('') : '<p class="muted">No source URL stored yet.</p>';
    $('dialogContent').innerHTML=`
      <div class="detail-grid">
        ${item('Field',p.field)}${item('Degree',p.degree)}${item('Language',p.language)}${item('Intakes',(p.intakes||[]).join(' / '))}
        ${item('Admission type',p.admissionType)}${item('Application route',p.applicationRoute)}${item('VPD',p.vpd)}${item('MOI',p.moi)}
        ${item('IELTS / English',p.ielts)}${item('GRE / test',p.gre)}${item('Winter deadline',p.deadlines?.winter)}${item('Summer deadline',p.deadlines?.summer)}
        ${item('Tuition',p.tuition)}${item('Semester fee',p.semesterFee)}${item('Application fee',p.applicationFee)}${item('Source status',p.sourceStatus)}
      </div>
      <div class="notes-box"><strong>Deadline note:</strong> ${esc(p.deadlines?.note || 'Verify the current cycle before applying.')}<br><br>${esc(p.notes||'')}</div>
      <div class="sources"><h3>Sources / application pages</h3>${sources}</div>`;
    $('detailsDialog').showModal();
  }
  async function init(){
    try{
      const [dataRes,configRes]=await Promise.all([fetch('./data/programs.json'),fetch('./data/config.json')]);
      if(!dataRes.ok || !configRes.ok) throw new Error('The data files could not be loaded.');
      const data=await dataRes.json(); state.config=await configRes.json(); state.programs=data.programs||[]; state.filtered=[...state.programs];
      setHeader(state.config); renderStats(data.meta||{});
      populateSelect('universityFilter',unique(state.programs.map(p=>p.university)));
      populateSelect('fieldFilter',unique(state.programs.map(p=>p.field)));
      populateSelect('routeFilter',unique(state.programs.map(p=>routeGroup(p.applicationRoute))));
      populateSelect('admissionFilter',unique(state.programs.map(p=>admissionGroup(p.admissionType))));
      sortPrograms(); render();
      ['searchInput','universityFilter','fieldFilter','intakeFilter','languageFilter','routeFilter','vpdFilter','admissionFilter','tuitionFilter','statusFilter'].forEach(id=>$(id).addEventListener(id==='searchInput'?'input':'change',applyFilters));
      $('sortSelect').addEventListener('change',()=>{sortPrograms();render();});
      $('clearFilters').addEventListener('click',()=>{
        $('searchInput').value=''; ['universityFilter','fieldFilter','intakeFilter','languageFilter','routeFilter','vpdFilter','admissionFilter','tuitionFilter','statusFilter'].forEach(id=>$(id).value=''); $('sortSelect').value='university'; applyFilters();
      });
      document.addEventListener('click',e=>{ const b=e.target.closest('.details-button'); if(b) openDetails(b.dataset.id); });
      $('closeDialog').addEventListener('click',()=> $('detailsDialog').close());
      $('detailsDialog').addEventListener('click',e=>{ if(e.target===$('detailsDialog')) $('detailsDialog').close(); });
    }catch(err){
      $('loadError').hidden=false; $('loadError').innerHTML=`<strong>Data could not load.</strong> ${esc(err.message)} If you opened index.html directly from your computer, run it through a local web server or deploy the folder to Vercel/GitHub Pages so the JSON files can be fetched.`;
      $('resultCount').textContent='Data unavailable';
    }
  }
  document.addEventListener('DOMContentLoaded',init);
})();
