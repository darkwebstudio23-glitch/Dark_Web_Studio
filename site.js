/* D'ARK Web Studio — live content layer */
(() => {
  'use strict';
  const FALLBACK = window.DARK_DATA || {};
  const LOCAL_KEY = 'dark_site_admin_data_v1';
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  let data = FALLBACK;
  try { const local=JSON.parse(localStorage.getItem(LOCAL_KEY)||'null'); if(local) data=Object.assign({},FALLBACK,local); } catch(_) {}

  async function getLiveData(){
    try { const r=await fetch('/api?action=site',{cache:'no-store'}); if(!r.ok) throw new Error('API'); const j=await r.json(); if(j.ok && j.data) data=j.data; }
    catch(_) {}
    boot();
  }
  function boot(){
    const CONFIG={brand:data.brand||"D'ARK Web Studio",instagram:data.instagram,gmail:data.gmail,email:data.email,phone:data.phone,phoneLink:data.phoneLink,whatsapp:data.whatsapp};
    document.querySelectorAll('a[href*="instagram.com"]').forEach(a=>{if(CONFIG.instagram)a.href=CONFIG.instagram;a.target='_blank';a.rel='noopener noreferrer';});
    document.querySelectorAll('a[href*="mail.google.com"]').forEach(a=>{if(CONFIG.gmail)a.href=CONFIG.gmail;a.target='_blank';a.rel='noopener noreferrer';});
    document.querySelectorAll('a[href^="tel:"]').forEach(a=>{if(CONFIG.phoneLink)a.href=CONFIG.phoneLink;});
    document.querySelectorAll('a[href*="wa.me/"]').forEach(a=>{if(CONFIG.whatsapp)a.href=CONFIG.whatsapp;a.target='_blank';a.rel='noopener noreferrer';});
    document.querySelectorAll('.foot-bottom span:first-child').forEach(el=>el.textContent=`© ${new Date().getFullYear()} ${CONFIG.brand}. All rights reserved.`);
    document.querySelectorAll('.navlinks a').forEach(link=>{const href=(link.getAttribute('href')||'').split('#')[0].toLowerCase();const active=((page==='index.html'||page==='')&&href==='index.html')||href===page;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    const nav=document.querySelector('nav.wrap'),navLinks=document.querySelector('.navlinks');
    if(nav&&navLinks&&!nav.querySelector('.dynamic-menu-btn')){const b=document.createElement('button');b.className='dynamic-menu-btn';b.type='button';b.setAttribute('aria-label','Open menu');b.setAttribute('aria-expanded','false');b.innerHTML='<span></span><span></span><span></span>';nav.insertBefore(b,navLinks);const close=()=>{navLinks.classList.remove('is-open');b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Open menu')};b.onclick=()=>{const open=navLinks.classList.toggle('is-open');b.setAttribute('aria-expanded',String(open));b.setAttribute('aria-label',open?'Close menu':'Open menu')};navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));}
    document.querySelectorAll('img').forEach(img=>{if(!img.hasAttribute('loading'))img.loading='lazy';if(!img.hasAttribute('decoding'))img.decoding='async';});
    function renderProjects(){document.querySelectorAll('#projectsGrid,#homeProjectsGrid').forEach(grid=>{if(!data.projects)return;grid.innerHTML=data.projects.map(p=>`<a href="projects.html" class="work-card"><img loading="lazy" src="${esc(p.image)}" alt="${esc(p.title)}"><div class="work-overlay"><span class="work-tag">${esc(p.tag)}</span><h3 class="grotesk">${esc(p.title)}</h3></div></a>`).join('');});}
    function renderServices(){const grid=document.querySelector('#servicesGrid');if(!grid||!data.services)return;grid.innerHTML=data.services.map(s=>`<div class="scard"><div class="scard-bg"><img loading="lazy" src="${esc(s.image)}" alt=""></div><div class="icon">${esc(s.icon)}</div><h3 class="grotesk">${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join('');}
    function renderTeam(){const grid=document.querySelector('#teamGrid');if(!grid||!data.team)return;grid.innerHTML=data.team.map(m=>`<div class="team-card">${m.image?`<img loading="lazy" src="${esc(m.image)}" alt="${esc(m.name)}">`:''}<h2>${esc(m.name)}</h2><span class="role">${esc(m.role)}</span><p>${esc(m.bio)}</p></div>`).join('');}
    function renderTestimonials(){const track=document.getElementById('testiTrack'),dots=document.getElementById('testiDots');if(!track||!dots||!Array.isArray(data.testimonials))return;track.innerHTML=data.testimonials.map(t=>`<div class="testi-card"><p>"${esc(t.text)}"</p><div class="testi-who"><div class="testi-avatar" aria-hidden="true">${esc((t.name||'?').trim().charAt(0).toUpperCase())}</div><div class="who-text"><strong>${esc(t.name)}</strong><span>${esc(t.role)}</span></div></div></div>`).join('');dots.innerHTML='';const cards=[...track.querySelectorAll('.testi-card')];let idx=0;const ds=[];cards.forEach((_,i)=>{const d=document.createElement('span');d.setAttribute('role','button');d.setAttribute('tabindex','0');d.setAttribute('aria-label',`Show testimonial ${i+1}`);if(i===0)d.classList.add('active');d.onclick=()=>set(i);d.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();set(i)}};dots.appendChild(d);ds.push(d)});function set(i){if(!cards.length)return;cards[idx].classList.remove('active');if(ds[idx])ds[idx].classList.remove('active');idx=(i+cards.length)%cards.length;cards[idx].classList.add('active');if(ds[idx])ds[idx].classList.add('active');}if(cards.length){cards[0].classList.add('active');if(cards.length>1)window.setInterval(()=>set(idx+1),5000);}}
    renderProjects();renderServices();renderTeam();renderTestimonials();
    const revealTargets=document.querySelectorAll('.section,.subhero,.band,.work-card,.scard,.pstep,.team-card,.contact');
    if('IntersectionObserver' in window){const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target);}}),{threshold:.08});revealTargets.forEach(el=>{el.classList.add('dynamic-reveal');obs.observe(el);});}
    const topBtn=document.createElement('button');topBtn.className='back-to-top';topBtn.type='button';topBtn.setAttribute('aria-label','Back to top');topBtn.textContent='↑';document.body.appendChild(topBtn);const sync=()=>topBtn.classList.toggle('show',window.scrollY>500);window.addEventListener('scroll',sync,{passive:true});sync();topBtn.onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
    const sendButton=document.getElementById('cSend');if(sendButton)sendButton.addEventListener('click',()=>{const name=document.getElementById('cName')?.value.trim()||'',phone=document.getElementById('cPhone')?.value.trim()||'',message=document.getElementById('cMsg')?.value.trim()||'';if(!name&&!message){document.getElementById('cName')?.focus();return;}const text=[`Hi ${CONFIG.brand}, I'm interested in a website.`,name&&`Name: ${name}`,phone&&`Phone: ${phone}`,message&&message].filter(Boolean).join('\n');window.open(`${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`,'_blank','noopener,noreferrer');},{capture:true});
    window.DARK_SITE=CONFIG;
  }
  getLiveData();
})();
