'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const E=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const P={folder:'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',file:'M6 3h8l5 5v13H6zM14 3v5h5',image:'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9h.01',video:'M3 6h12v12H3zM15 10l6-3v10l-6-3',music:'M9 18V5l11-2v13M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zM20 16a3 3 0 1 1-3-3 3 3 0 0 1 3 3z',doc:'M6 3h8l5 5v13H6zM9 13h7M9 17h7',zip:'M6 3h8l5 5v13H6zM11 3v8M11 12h2M11 15h2',apk:'M12 3l8 4v10l-8 4-8-4V7zM4 7l8 4 8-4M12 11v10',set:'M4 7h10M18 7h2M4 17h2M10 17h10M14 5v4M6 15v4',note:'M5 3h14v18H5zM9 8h6M9 12h6M9 16h3',trash:'M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6',pc:'M3 5h18v11H3zM8 20h8M12 16v4',open:'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',edit:'M4 20h4L19 9l-4-4L4 16zM13 7l4 4',pin:'M9 4h6l-1 6 3 3H7l3-3zM12 13v7',link:'M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1',info:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v6M12 7.5h.01',copy:'M8 8h12v12H8zM4 16V4h12',refresh:'M20 5v5h-5M4 19v-5h5M19 10a7 7 0 0 0-12-3L4 10M5 14a7 7 0 0 0 12 3l3-3',grid:'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',list:'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',plus:'M12 5v14M5 12h14',x:'M6 6l12 12M18 6L6 18',min:'M5 12h14',max:'M5 5h14v14H5z',eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',dl:'M12 4v12M7 11l5 5 5-5M5 20h14',sort:'M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4',check:'M5 12l5 5 9-10',all:'M4 5h16M4 12h16M4 19h16',menu:'M4 6h16M4 12h16M4 18h16',win:'M3 4l8-1v8H3zM13 3l8-1v9h-8zM3 13h8v8l-8-1zM13 13h8v9l-8-1z',up:'M12 19V5M6 11l6-6 6 6',nf:'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM12 10v5M9.5 12.5h5',mv:'M5 12h14M13 6l6 6-6 6',share:'M12 16V4M7 9l5-5 5 5M5 14v6h14v-6'};
const ic=(k,s=20)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${P[k]||P.file}"/></svg>`;

/* ===== App Registry (terpisah dari shortcut desktop, pin taskbar, dan file) ===== */
const APPS={
 pc:{n:'My Computer',i:'pc',c:'#3b82f6',cat:'Sistem',d:'Info perangkat yang dilaporkan browser.',mk:mkPC},
 files:{n:'File Explorer',i:'folder',c:'#d99a1b',cat:'Sistem',d:'Kelola file asli dari folder yang kamu izinkan.',mk:mkFiles,multi:1},
 bin:{n:'Recycle Bin',i:'trash',c:'#64748b',cat:'Sistem',d:'Shortcut yang di-Delete; bisa dipulihkan.',mk:mkBin},
 set:{n:'Settings',i:'set',c:'#6366f1',cat:'Sistem',d:'Personalisasi desktop NOVA.',mk:mkSet},
 notes:{n:'Notes',i:'note',c:'#c28b00',cat:'Aplikasi',d:'Catatan teks, tersimpan di browser ini.',mk:mkNotes},
 notepad:{n:'Notepad.exe',i:'note',c:'#0f9d9a',cat:'Aplikasi',d:'File .exe VIRTUAL milik NOVA, bukan executable Windows. Membuka Notes.',open:'notes'}
};

/* ===== State + penyimpanan ===== */
const K='nova.v1';let S,mem=0,clip=null,selId=null,lastType='mouse',lastMenu=0;
const DEF=()=>({user:'',sc:[],pins:['files','notes','set'],trash:[],names:{},recent:[],seeded:0,set:{size:'m',auto:false,grid:true,show:true,theme:'dark',wall:0,sort:'custom',lbl:'#ffffff'}});
try{S=JSON.parse(localStorage.getItem(K))}catch{}
S=Object.assign(DEF(),S||{});S.set=Object.assign(DEF().set,S.set);
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch{if(!mem){mem=1;toast('Penyimpanan browser tidak tersedia. Perubahan hanya berlaku selama sesi ini.','e')}}};
const uid=()=>Math.random().toString(36).slice(2,9),sc=id=>S.sc.find(s=>s.id===id);
const applyTheme=()=>{document.documentElement.dataset.theme=S.set.theme;document.body.dataset.w=S.set.wall};
function toast(m,t=''){const e=E('div','tt '+t,m);$('#toast').append(e);setTimeout(()=>{e.style.transition='.3s';e.style.opacity=0;setTimeout(()=>e.remove(),300)},3400)}

/* ===== Dialog ===== */
function dlg(t,body,btns,big){return new Promise(r=>{const m=E('div','mb'),d=E('div','md'+(big?' big':'')),b=E('div'),a=E('div','ba');d.innerHTML=`<h3>${t}</h3>`;typeof body==='string'?b.innerHTML=body:b.append(body);d.append(b,a);
 const done=v=>{if(m.dead)return;m.dead=1;m.style.transition='.15s';m.style.opacity=0;setTimeout(()=>m.remove(),150);r(v)};
 (btns||[{t:'Tutup',v:null,p:1}]).forEach(x=>{const k=E('button','btn'+(x.p?' p':''),x.t);k.onclick=()=>done(x.v==='in'?$('input',d).value:x.v);a.append(k)});
 m.append(d);m.onpointerdown=e=>{if(e.target===m)done(null)};document.body.append(m);const i=$('input',d);if(i){i.focus();i.select();i.onkeydown=e=>{if(e.key==='Enter')done(i.value);if(e.key==='Escape')done(null)}}})}
const ask=(t,v)=>dlg(t,`<input value="${esc(v)}" maxlength="120">`,[{t:'Batal',v:null},{t:'OK',v:'in',p:1}]);
const yes=(t,h,ok='OK')=>dlg(t,h,[{t:'Batal',v:false},{t:ok,v:true,p:1}]);

/* ===== Menu konteks bergaya Windows 11 ===== */
function mItem(it){if(it==='-')return E('div','sep');
 if(it.row){const r=E('div','mr');it.row.forEach(c=>{const b=E('div','mi'+(c.d?' dis':''),ic(c.i,18));b.title=c.t;b.onclick=()=>{closeMenus();c.f()};r.append(b)});return r}
 const m=E('div','mi'+(it.d?' dis':''),`${it.i?ic(it.i,17):'<span style="width:17px"></span>'}<span>${it.t}</span>${it.k?`<em>${it.k}</em>`:''}${it.on?`<em>${ic('check',15)}</em>`:''}${it.sub?'<em>›</em>':''}`);
 if(it.sub){const s=E('div','sub');it.sub.forEach(x=>s.append(mItem(x)));m.append(s);
  const op=()=>{$$(':scope>.mi.open',m.parentNode).forEach(o=>o!==m&&o.classList.remove('open'));s.classList.remove('l');m.classList.add('open');if(s.getBoundingClientRect().right>innerWidth)s.classList.add('l')};
  m.onclick=e=>{if(!e.target.closest('.sub'))op()};m.onpointerenter=e=>e.pointerType==='mouse'&&op()}
 else m.onclick=()=>{closeMenus();it.f&&it.f()};
 return m}
function menu(items,x,y){$('#ctx').innerHTML='';lastMenu=Date.now();const m=E('div','menu');items.forEach(i=>m.append(mItem(i)));$('#ctx').append(m);const r=m.getBoundingClientRect();m.style.left=Math.max(6,Math.min(x,innerWidth-r.width-6))+'px';m.style.top=Math.max(6,Math.min(y,innerHeight-r.height-6))+'px'}
function closeMenus(){$('#ctx').innerHTML='';$('#start').hidden=true}
addEventListener('pointerdown',e=>{if(!e.target.closest('.menu,#start'))closeMenus()},true);
function lp(n,f){let t,x,y;n.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;x=e.clientX;y=e.clientY;t=setTimeout(()=>{n.dataset.lp=1;navigator.vibrate&&navigator.vibrate(10);f(x,y)},520)});['pointerup','pointercancel','pointermove'].forEach(k=>n.addEventListener(k,e=>{if(k==='pointermove'&&Math.hypot(e.clientX-x,e.clientY-y)<8)return;clearTimeout(t)}))}

/* ===== Desktop: grid, snap, arrange ===== */
const cell=()=>({w:{s:76,m:92,l:112}[S.set.size],h:{s:84,m:100,l:122}[S.set.size]}),isz={s:36,m:46,l:60};
const free=(x,y,id)=>{const{w,h}=cell();return!S.sc.some(s=>s.id!==id&&Math.abs(s.x-x)<w-2&&Math.abs(s.y-y)<h-2)};
function snap(a){const{w,h}=cell(),cols=Math.max(1,Math.floor(innerWidth/w)),rows=Math.max(1,Math.floor((innerHeight-48)/h));
 if(!S.set.grid){a.x=Math.max(0,Math.min(a.x,innerWidth-w));a.y=Math.max(0,Math.min(a.y,innerHeight-48-h));return}
 let b=null,bd=1e12;for(let i=0;i<cols;i++)for(let j=0;j<rows;j++)if(free(i*w,j*h,a.id)){const d=(i*w-a.x)**2+(j*h-a.y)**2;if(d<bd){bd=d;b=[i,j]}}
 if(b){a.x=b[0]*w;a.y=b[1]*h}}
function arrange(){const{w,h}=cell(),rows=Math.max(1,Math.floor((innerHeight-48)/h)),k=S.set.sort,l=S.sc;
 if(k==='name')l.sort((a,b)=>a.name.localeCompare(b.name));if(k==='type')l.sort((a,b)=>APPS[a.app].cat.localeCompare(APPS[b.app].cat)||a.name.localeCompare(b.name));if(k==='date')l.sort((a,b)=>a.t-b.t);
 l.forEach((s,i)=>{s.x=Math.floor(i/rows)*w;s.y=(i%rows)*h})}
function seed(){S.sc=['pc','files','bin','set','notes','notepad'].map((k,i)=>({id:uid(),app:k,name:APPS[k].n,x:0,y:0,t:Date.now()+i}));S.set.sort='custom';S.seeded=1;arrange()}
const sel=id=>{selId=id;$$('.ic').forEach(n=>n.classList.toggle('sel',n.dataset.id===id))};
function icons(){const root=$('#icons'),{w,h}=cell(),have=new Map($$('.ic',root).map(n=>[n.dataset.id,n]));
 root.style.setProperty('--cw',w+'px');root.style.setProperty('--ch',h+'px');root.style.setProperty('--is',isz[S.set.size]+'px');root.style.setProperty('--lb',S.set.lbl);root.classList.toggle('off',!S.set.show);
 S.sc.forEach(s=>{const a=APPS[s.app];if(!a)return;let n=have.get(s.id);if(!n){n=E('div','ic','<div class="gl"></div><span></span>');n.dataset.id=s.id;root.append(n)}have.delete(s.id);
  n.style.setProperty('--c',a.c);$('.gl',n).innerHTML=ic(a.i,Math.round(isz[S.set.size]*.55));$('span',n).textContent=s.name;n.title=`${s.name} — ${a.n}`;n.style.transform=`translate(${s.x}px,${s.y}px)`;n.classList.toggle('sel',selId===s.id)});
 have.forEach(n=>{n.classList.add('out');setTimeout(()=>n.remove(),220)})}
function addSc(app){const ex=S.sc.find(s=>s.app===app);if(ex){sel(ex.id);toast(`Shortcut "${esc(ex.name)}" sudah ada di desktop`);return}
 const s={id:uid(),app,name:S.names[app]||APPS[app].n,x:0,y:0,t:Date.now()};S.sc.push(s);if(S.set.auto)arrange();else snap(s);save();icons();toast('Shortcut ditambahkan ke desktop','ok')}
function removeSc(s){if(!s.dup)S.names[s.app]=s.name;S.sc=S.sc.filter(x=>x!==s);if(S.set.auto)arrange();save();icons();toast(`"${esc(s.name)}" dihapus dari desktop. Aplikasinya tetap ada di Start Menu.`)}
function delSc(s){S.sc=S.sc.filter(x=>x!==s);S.trash.push(s);save();icons();toast('Shortcut dipindah ke Recycle Bin (bisa dipulihkan)')}
async function dupSc(s){if(!await yes('Create Shortcut',`Shortcut ke <b>${esc(APPS[s.app].n)}</b> sudah ada di desktop. Buat salinan lain?`,'Buat salinan'))return;const c={id:uid(),app:s.app,name:s.name+' - Shortcut',x:s.x,y:s.y,t:Date.now(),dup:1};S.sc.push(c);if(S.set.auto)arrange();else snap(c);save();icons()}
const pin=(a,on)=>{S.pins=S.pins.filter(x=>x!==a);if(on)S.pins.push(a);save();bar()};
function rename(s){const n=$(`.ic[data-id="${s.id}"]`);if(!n)return;const sp=$('span',n),i=E('input');i.value=s.name;sp.hidden=true;sp.after(i);i.focus();i.select();let d=0;
 const fin=ok=>{if(d)return;d=1;const v=i.value.trim().replace(/[\u0000-\u001f\u007f<>:"\/\\|?*]/g,'');i.remove();sp.hidden=false;
  if(ok&&!v)toast('Nama tidak boleh kosong','e');else if(ok&&S.sc.some(x=>x!==s&&x.name.toLowerCase()===v.toLowerCase()))toast('Nama sudah dipakai shortcut lain','e');else if(ok){s.name=v;if(!s.dup)S.names[s.app]=v;save();icons()}};
 i.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter')fin(1);if(e.key==='Escape')fin(0)};i.onblur=()=>fin(1);i.onpointerdown=e=>e.stopPropagation()}
function props(s){const a=APPS[s.app];dlg('Properties',`<div class="kv"><span>Nama shortcut</span><b>${esc(s.name)}</b><span>Tujuan</span><b>${a.n}</b><span>Jenis</span><b>${s.dup?'Shortcut (salinan)':'Shortcut aplikasi NOVA'}</b><span>Kategori</span><b>${a.cat}</b><span>Lokasi virtual</span><b>Desktop NOVA</b><span>Dibuat</span><b>${new Date(s.t).toLocaleString()}</b><span>Taskbar</span><b>${S.pins.includes(s.app)?'Tersemat':'Tidak tersemat'}</b><span>Deskripsi</span><b>${a.d}</b></div><p style="margin-top:12px;font-size:12px;color:var(--mu)">Informasi virtual NOVA, bukan file sistem asli.</p>`,[{t:'Open',v:1},{t:'Pin to Taskbar',v:2},{t:'Tutup',v:0,p:1}]).then(v=>{if(v===1)open(s.app);if(v===2)pin(s.app,1)})}
const appMenu=id=>[{t:'Buka',i:'open',f:()=>open(id)},...(APPS[id].multi?[{t:'Buka di jendela baru',i:'plus',f:()=>open(id,{nw:1})}]:[]),'-',{t:'Pin ke Desktop',i:'pin',f:()=>addSc(id)},S.pins.includes(id)?{t:'Lepas dari Taskbar',i:'pin',f:()=>pin(id,0)}:{t:'Sematkan ke Taskbar',i:'pin',f:()=>pin(id,1)}];
function iconMenu(s,x,y){const a=APPS[s.app];menu([{row:[{i:'copy',t:'Copy',f:()=>{clip=s;toast('Shortcut disalin. Klik kanan desktop → Paste')}},{i:'edit',t:'Rename (F2)',f:()=>rename(s)},{i:'x',t:'Remove from Desktop',f:()=>removeSc(s)}]},
 {t:'Open',i:'open',k:'Enter',f:()=>open(s.app)},...(a.multi?[{t:'Open in New Window',i:'plus',f:()=>open(s.app,{nw:1})}]:[]),'-',
 {t:'Create Shortcut',i:'link',f:()=>dupSc(s)},S.pins.includes(s.app)?{t:'Unpin from Taskbar',i:'pin',f:()=>pin(s.app,0)}:{t:'Pin to Taskbar',i:'pin',f:()=>pin(s.app,1)},
 ...(s.dup?['-',{t:'Delete Shortcut',i:'trash',f:()=>delSc(s)}]:[]),'-',{t:'Properties',i:'info',k:'Alt+Enter',f:()=>props(s)}],x,y)}
function deskMenu(x,y){const st=S.set,fin=()=>{save();icons()},
 sz=k=>({t:{s:'Small icons',m:'Medium icons',l:'Large icons'}[k],on:st.size===k,f:()=>{st.size=k;st.auto?arrange():S.sc.forEach(snap);fin()}}),
 tg=(k,t)=>({t,on:st[k],f:()=>{st[k]=!st[k];if(st.auto)arrange();else if(k==='grid'&&st.grid)S.sc.forEach(snap);fin()}}),
 so=(k,t)=>({t,on:st.sort===k,f:()=>{st.sort=k;if(k!=='custom')arrange();fin()}});
 menu([{t:'View',i:'grid',sub:[sz('s'),sz('m'),sz('l'),'-',tg('auto','Auto arrange icons'),tg('grid','Align icons to grid'),tg('show','Show desktop icons')]},{t:'Sort by',i:'sort',sub:[so('name','Name'),so('type','Type'),so('date','Date added'),so('custom','Custom order')]},{t:'Refresh',i:'refresh',k:'F5',f:()=>{icons();toast('Desktop disegarkan')}},'-',
 {t:'New Shortcut',i:'plus',sub:Object.keys(APPS).map(k=>({t:APPS[k].n,i:APPS[k].i,f:()=>addSc(k)}))},
 {t:'Paste',i:'copy',d:!clip,f:()=>{const ex=S.sc.some(s=>s.app===clip.app),c={...clip,id:uid(),t:Date.now()};if(ex){c.dup=1;c.name=clip.name+' - Salinan'}else delete c.dup;S.sc.push(c);if(st.auto)arrange();else snap(c);fin()}},'-',
 {t:'Display Settings',i:'set',f:()=>open('set')},{t:'Personalize',i:'eye',f:()=>open('set')}],x,y)}

/* ===== Interaksi ikon: Pointer Events (mouse, touch, pen) ===== */
let D=null,T0=0,LC={id:0,t:0};
$('#icons').addEventListener('pointerdown',e=>{lastType=e.pointerType;const n=e.target.closest('.ic');
 if(!n){sel(null);if(e.pointerType!=='mouse'){const x=e.clientX,y=e.clientY;T0=setTimeout(()=>deskMenu(x,y),520)}return}
 const s=sc(n.dataset.id);sel(s.id);if(e.pointerType==='mouse'&&e.button!==0)return;
 D={s,n,id:e.pointerId,x:e.clientX,y:e.clientY,ox:s.x,oy:s.y,touch:e.pointerType!=='mouse',drag:0,arm:0};
 if(D.touch)D.tm=setTimeout(()=>{if(D){D.arm=1;n.classList.add('armed');navigator.vibrate&&navigator.vibrate(10)}},520)});
addEventListener('pointermove',e=>{clearTimeout(T0);if(!D||e.pointerId!==D.id)return;const dx=e.clientX-D.x,dy=e.clientY-D.y;
 if(!D.drag){if(Math.hypot(dx,dy)<6)return;if(D.touch&&!D.arm){endD(1);return}D.drag=1;clearTimeout(D.tm);D.n.classList.add('drag');D.n.classList.remove('armed')}
 const{w,h}=cell();D.s.x=Math.max(0,Math.min(innerWidth-w,D.ox+dx));D.s.y=Math.max(0,Math.min(innerHeight-48-h,D.oy+dy));D.n.style.transform=`translate(${D.s.x}px,${D.s.y}px)`});
addEventListener('pointerup',e=>{clearTimeout(T0);if(!D||e.pointerId!==D.id)return;const d=D;endD();
 if(d.drag){if(S.set.auto){const{w,h}=cell(),rows=Math.max(1,Math.floor((innerHeight-48)/h)),i=Math.round(d.s.x/w)*rows+Math.round(d.s.y/h);S.sc=S.sc.filter(x=>x!==d.s);S.sc.splice(Math.max(0,Math.min(i,S.sc.length)),0,d.s);arrange()}else snap(d.s);S.set.sort='custom';save();icons();return}
 if(d.touch&&d.arm){const r=d.n.getBoundingClientRect();iconMenu(d.s,r.left+r.width/2,r.bottom);return}
 const t=Date.now();if(LC.id===d.s.id&&t-LC.t<380){LC={id:0,t:0};open(d.s.app)}else LC={id:d.s.id,t}});
addEventListener('pointercancel',()=>{clearTimeout(T0);endD(1)});
function endD(rev){if(!D)return;clearTimeout(D.tm);D.n.classList.remove('drag','armed');if(rev){D.s.x=D.ox;D.s.y=D.oy;icons()}D=null}
$('#desktop').addEventListener('contextmenu',e=>{if(e.target.closest('.win,#bar,#start'))return;e.preventDefault();if(lastType==='touch'||Date.now()-lastMenu<600)return;
 const n=e.target.closest('.ic');if(n){sel(n.dataset.id);iconMenu(sc(n.dataset.id),e.clientX,e.clientY)}else deskMenu(e.clientX,e.clientY)});
addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||!selId||!sc(selId))return;const s=sc(selId);
 if(e.key==='F2'){e.preventDefault();rename(s)}else if(e.key==='Enter'&&!e.altKey)open(s.app);else if(e.key==='Enter'&&e.altKey)props(s);else if(e.key==='Delete')removeSc(s)});
addEventListener('resize',()=>{const{w,h}=cell();S.sc.forEach(s=>{s.x=Math.max(0,Math.min(s.x,innerWidth-w));s.y=Math.max(0,Math.min(s.y,innerHeight-48-h))});if(S.set.auto)arrange();else if(S.set.grid)S.sc.forEach(snap);save();icons()});

/* ===== Window manager + taskbar ===== */
const W=new Map();let z=20,cur=null,wn=0;
function open(id,o={}){const a=APPS[id];if(!a){toast('Aplikasi tidak tersedia lagi','e');return}if(a.open)return open(a.open,o);
 if(!o.nw){const w=[...W.values()].find(w=>w.app===id);if(w){w.m&&mini(w,0);focus(w);return w}}
 const el=E('div','win'),big=id==='files',wi=Math.min(big?820:480,innerWidth-16),he=Math.min(big?520:380,innerHeight-110);
 el.style.cssText=`width:${wi}px;height:${he}px;left:${Math.max(8,(innerWidth-wi)/2+(wn%6)*26-60)}px;top:${Math.max(8,(innerHeight-48-he)/2+(wn%6)*22-40)}px`;wn++;
 el.innerHTML=`<div class="tb"><span style="display:flex;color:${a.c}">${ic(a.i,16)}</span><b>${a.n}</b><button class="n" title="Minimize">${ic('min',14)}</button><button class="m" title="Maximize">${ic('max',12)}</button><button class="x" title="Close">${ic('x',14)}</button></div><div class="wb"></div>`;
 const w={id:uid(),app:id,el,m:0};W.set(w.id,w);$('#wins').append(el);if(innerWidth<720)el.classList.add('max');
 $('.n',el).onclick=()=>mini(w);$('.m',el).onclick=()=>el.classList.toggle('max');
 $('.x',el).onclick=()=>{el.style.opacity=0;el.style.transform='scale(.94)';setTimeout(()=>{el.remove();W.delete(w.id);if(cur===w)cur=null;bar()},180)};
 const tb=$('.tb',el);tb.ondblclick=e=>{if(!e.target.closest('button'))el.classList.toggle('max')};
 tb.onpointerdown=e=>{if(e.target.closest('button')||el.classList.contains('max'))return;focus(w);const r=el.getBoundingClientRect(),dx=e.clientX-r.left,dy=e.clientY-r.top;tb.setPointerCapture(e.pointerId);
  tb.onpointermove=e=>{el.style.left=Math.max(80-r.width,Math.min(innerWidth-80,e.clientX-dx))+'px';el.style.top=Math.max(0,Math.min(innerHeight-90,e.clientY-dy))+'px'};tb.onpointerup=()=>{tb.onpointermove=null}};
 el.onpointerdown=()=>{if(cur!==w)focus(w)};a.mk($('.wb',el),w,o);focus(w);return w}
function focus(w){cur=w;w.el.style.zIndex=++z;bar()}
function mini(w,f=1){w.m=f;w.el.classList.toggle('min',!!f);if(f&&cur===w)cur=null;else if(!f)focus(w);bar()}
function bar(){const p=$('#pins');p.innerHTML='';const ids=[...new Set([...S.pins,...[...W.values()].map(w=>w.app)])].filter(i=>APPS[i]);
 const sb=E('button','tk',`<i style="--c:linear-gradient(135deg,#3b82f6,#7c5cff)">${ic('win',16)}</i>`);sb.title='Start';sb.style.cssText='position:absolute;left:10px';sb.onclick=()=>{const s=$('#start'),show=s.hidden;closeMenus();if(show){startMenu();s.hidden=false}};
 $('#bar').querySelector('.tk[title=Start]')?.remove();$('#bar').prepend(sb);
 ids.forEach(id=>{const a=APPS[id],ws=[...W.values()].filter(w=>w.app===id),b=E('button','tk'+(ws.length?' on':'')+(ws.some(w=>w===cur&&!w.m)?' act':''),`<i style="--c:${a.c}">${ic(a.i,16)}</i>`);b.title=a.n;
  b.onclick=()=>{if(!ws.length)open(id);else{const w=ws[0];if(w.m)mini(w,0);else if(w===cur)mini(w);else focus(w)}};b.oncontextmenu=e=>{e.preventDefault();menu(appMenu(id),e.clientX,e.clientY-150)};lp(b,(x,y)=>menu(appMenu(id),x,y-150));p.append(b)})}
function startMenu(){const s=$('#start');s.innerHTML=`<h4>Aplikasi</h4><div class="ag"></div><div style="margin-top:18px;display:flex;justify-content:space-between;align-items:center"><b>${esc(S.user)}</b><button class="btn">Keluar</button></div>`;
 Object.keys(APPS).forEach(k=>{const a=APPS[k],i=E('div','ai',`<div class="gl" style="--c:${a.c};--is:44px">${ic(a.i,24)}</div><span style="font-size:12px;text-align:center">${a.n}</span>`);
  i.onclick=()=>{if(i.dataset.lp){delete i.dataset.lp;return}closeMenus();open(k)};i.oncontextmenu=e=>{e.preventDefault();e.stopPropagation();menu(appMenu(k),e.clientX,e.clientY)};lp(i,(x,y)=>menu(appMenu(k),x,y));$('.ag',s).append(i)});
 $('.btn',s).onclick=()=>location.reload()}
const clockT=()=>{const d=new Date();$('#clock').innerHTML=d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+'<br>'+d.toLocaleDateString([],{day:'numeric',month:'short'})};

/* ===== Aplikasi sederhana ===== */
const fmt=b=>b==null?'—':b<1024?b+' B':b<1048576?(b/1024).toFixed(1)+' KB':b<1073741824?(b/1048576).toFixed(1)+' MB':(b/1073741824).toFixed(2)+' GB';
async function mkPC(b){const p=E('div','pad');b.append(p);let q='tidak tersedia';try{const e=await navigator.storage.estimate();q=`${fmt(e.usage)} terpakai dari kuota browser ${fmt(e.quota)}`}catch{}
 p.innerHTML=`<div class="kv"><span>Pengguna</span><b>${esc(S.user)}</b><span>Platform</span><b>${esc(navigator.platform||'?')}</b><span>CPU thread</span><b>${navigator.hardwareConcurrency||'?'}</b><span>Memori (perkiraan)</span><b>${navigator.deviceMemory?navigator.deviceMemory+' GB':'tidak dilaporkan'}</b><span>Layar</span><b>${screen.width}×${screen.height}</b><span>Penyimpanan browser</span><b>${q}</b><span>Akses file asli</span><b>${window.showDirectoryPicker?'Folder baca/tulis didukung':'Mode baca-saja (tanpa folder picker)'}</b></div><p style="margin-top:14px;font-size:12px;color:var(--mu)">Info berasal dari browser, bukan seluruh perangkat. Angka penyimpanan adalah kuota browser, bukan kapasitas disk.</p>`}
function mkNotes(b){const t=E('textarea','nt');t.placeholder='Tulis catatan… (tersimpan di browser ini)';try{t.value=localStorage.getItem('nova.notes')||''}catch{}t.oninput=()=>{try{localStorage.setItem('nova.notes',t.value)}catch{}};b.append(t)}
function mkBin(b){const r=()=>{b.innerHTML='';const p=E('div','pad');if(!S.trash.length)p.innerHTML='<div class="empty">Recycle Bin kosong.<br>Shortcut salinan yang kamu <b>Delete</b> muncul di sini. "Remove from Desktop" tidak memakai Recycle Bin.</div>';
 S.trash.forEach(s=>{const d=E('div','set');d.append(E('span',0,esc(s.name)));const k=E('button','btn','Pulihkan');k.onclick=()=>{S.trash=S.trash.filter(x=>x!==s);S.sc.push(s);snap(s);save();icons();r()};d.append(k);p.append(d)});
 if(S.trash.length){const k=E('button','btn','Kosongkan');k.style.marginTop='14px';k.onclick=async()=>{if(await yes('Kosongkan Recycle Bin',S.trash.length+' shortcut dihapus permanen dari NOVA (file asli tidak tersentuh).','Kosongkan')){S.trash=[];save();r()}};p.append(k)}b.append(p)};r()}
function mkSet(b){const r=()=>{b.innerHTML='';const p=E('div','pad'),row=(t,c)=>{const d=E('div','set');d.append(E('span',0,t),c);p.append(d)},
 sw=(k,f)=>{const s=E('div','sw'+(S.set[k]?' on':''));s.onclick=()=>{S.set[k]=!S.set[k];f&&f();save();icons();r()};return s},
 se=(k,o,f)=>{const s=E('select',0,Object.entries(o).map(([v,t])=>`<option value="${v}"${String(S.set[k])===v?' selected':''}>${t}</option>`).join(''));s.onchange=()=>{S.set[k]=isNaN(s.value)?s.value:+s.value;f&&f();save();icons()};return s};
 row('Tema',se('theme',{dark:'Gelap',light:'Terang'},applyTheme));row('Wallpaper',se('wall',{0:'Bloom Biru',1:'Ungu Malam',2:'Hutan',3:'Senja'},applyTheme));
 row('Ukuran ikon',se('size',{s:'Kecil',m:'Sedang',l:'Besar'},()=>{S.set.auto?arrange():S.sc.forEach(snap)}));row('Warna label',se('lbl',{'#ffffff':'Putih','#111827':'Hitam','#ffd86b':'Kuning'}));
 row('Tampilkan ikon desktop',sw('show'));row('Auto arrange icons',sw('auto',()=>S.set.auto&&arrange()));row('Align icons to grid',sw('grid',()=>S.set.grid&&S.sc.forEach(snap)));
 const bt=E('button','btn','Reset Desktop');bt.onclick=async()=>{if(await yes('Reset Desktop','Shortcut, nama, dan posisi kembali ke bawaan. Aplikasi tidak terhapus.','Reset')){const u=S.user;S=DEF();S.user=u;seed();save();applyTheme();icons();bar();r()}};row('Kembalikan desktop ke bawaan',bt);b.append(p)};r()}

/* ===== ZIP: parser kecil + DecompressionStream bawaan browser (tanpa library) ===== */
const safe=n=>{n=n.replace(/\\/g,'/');if(/^\/|^[a-z]:|(^|\/)\.\.(\/|$)|\u0000/i.test(n))return null;return n.split('/').filter(x=>x&&x!=='.')};
function zlist(buf){const v=new DataView(buf),u=new Uint8Array(buf);let e=u.length-22;while(e>=0&&v.getUint32(e,true)!==0x06054b50)e--;if(e<0)throw Error('bukan ZIP yang valid');
 const n=v.getUint16(e+10,true);let o=v.getUint32(e+16,true);const L=[];if(o===0xffffffff)throw Error('ZIP64 belum didukung');
 for(let i=0;i<n;i++){if(v.getUint32(o,true)!==0x02014b50)throw Error('direktori ZIP rusak');const nl=v.getUint16(o+28,true),xl=v.getUint16(o+30,true),cl=v.getUint16(o+32,true);
  L.push({n:new TextDecoder().decode(u.subarray(o+46,o+46+nl)),m:v.getUint16(o+10,true),cs:v.getUint32(o+20,true),us:v.getUint32(o+24,true),lo:v.getUint32(o+42,true)});o+=46+nl+xl+cl}return L}
async function zdata(buf,z){const v=new DataView(buf),s=z.lo+30+v.getUint16(z.lo+26,true)+v.getUint16(z.lo+28,true),raw=new Uint8Array(buf,s,z.cs);if(z.m===0)return raw;if(z.m!==8)throw Error('kompresi tidak didukung');
 return new Uint8Array(await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer())}

/* ===== File Explorer: adapter File System Access API (baca/tulis) + fallback baca-saja ===== */
const X={image:'jpg jpeg png gif webp svg bmp avif ico',video:'mp4 webm mov mkv avi m4v',music:'mp3 wav ogg m4a flac aac opus',doc:'pdf txt md doc docx xls xlsx ppt pptx csv rtf odt json html css js',zip:'zip rar 7z tar gz',apk:'apk xapk'};
const ext=n=>(n.includes('.')?n.split('.').pop():'').toLowerCase(),dirn=p=>p.includes('/')?p.slice(0,p.lastIndexOf('/')+1):'';
const kind=f=>{if(f.k==='dir')return'folder';const e=ext(f.name);for(const k in X)if(X[k].split(' ').includes(e))return k;const t=f.type||'';return t.startsWith('image')?'image':t.startsWith('video')?'video':t.startsWith('audio')?'music':'file'};
const CATS=[['all','All Files','all'],['recent','Recent','refresh'],['image','Images','image'],['video','Videos','video'],['music','Audio','music'],['doc','Documents','doc'],['dl','Downloads','dl'],['zip','Archives','zip'],['apk','Apps / APK','apk'],['folder','Folders','folder'],['big','Large (>50 MB)','file']];
const has=async(d,n)=>{try{await d.getFileHandle(n);return 1}catch{}try{await d.getDirectoryHandle(n);return 1}catch{}return 0};
async function uniq(d,n){let c=1,m=n;while(await has(d,m))m=n.replace(/(\.[^.]*)?$/,` (${++c})$1`);return m}
async function scan(dir,pre='',out=[],d=0){for await(const[name,h]of dir.entries()){if(out.length>8000)break;const p=pre+name;
 if(h.kind==='directory'){out.push({k:'dir',name,p,h,parent:dir});if(d<6)await scan(h,p+'/',out,d+1)}else try{const f=await h.getFile();out.push({k:'file',name,p,h,parent:dir,size:f.size,mod:f.lastModified,type:f.type,f})}catch{}}return out}
async function shareFiles(L){if(!L.length)return;const fs=await Promise.all(L.map(f=>f.f||f.h.getFile()));
 if(navigator.canShare&&navigator.canShare({files:fs})){try{await navigator.share({files:fs});return}catch(e){if(e.name==='AbortError')return}}
 fs.forEach(f=>{const a=E('a');a.href=URL.createObjectURL(f);a.download=f.name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4e3)});toast('Berbagi sistem tidak tersedia: salinan file diunduh (file asli tidak berubah).')}
function mkFiles(b){
 const st={root:null,rn:'',items:[],cat:'all',cwd:'',view:'grid',q:'',sort:'name',sel:new Set(),ro:false,urls:[],multi:0,lt:0},rec=new Set(S.recent);
 b.innerHTML='<div class="fm"><div class="fs"></div><div class="fc"><div class="ft"></div><div class="pr"></div><div class="crumb"></div><div class="fl"></div></div></div>';
 const fs=$('.fs',b),ft=$('.ft',b),pr=$('.pr',b),cr=$('.crumb',b),fl=$('.fl',b),B={};
 const fi=E('input'),di=E('input');fi.type=di.type='file';fi.multiple=di.multiple=true;di.webkitdirectory=true;fi.hidden=di.hidden=true;b.append(fi,di);
 const can=()=>st.root&&!st.ro,sels=()=>st.items.filter(f=>st.sel.has(f.p)),sel1=()=>sels()[0];
 const inCat=(c,f)=>c==='all'?f.k==='file':c==='folder'?f.k==='dir':f.k==='file'&&(c==='recent'?rec.has(f.p):c==='dl'?/(^|\/)downloads?\//i.test(st.rn+'/'+f.p):c==='big'?f.size>5e7:kind(f)===c);
 const cwdH=()=>st.cwd?(st.items.find(x=>x.k==='dir'&&x.p+'/'===st.cwd)||{}).h:st.root;
 function list(){let L=st.items;const q=st.q.toLowerCase();if(st.cat==='all'&&!q)L=L.filter(f=>dirn(f.p)===st.cwd);else if(st.cat!=='all')L=L.filter(f=>inCat(st.cat,f));if(q)L=L.filter(f=>f.name.toLowerCase().includes(q));const s=st.sort;
  return[...L].sort((a,b)=>(b.k==='dir')-(a.k==='dir')||(s==='size'?(b.size||0)-(a.size||0):s==='date'?(b.mod||0)-(a.mod||0):s==='type'?kind(a).localeCompare(kind(b))||a.name.localeCompare(b.name):a.name.localeCompare(b.name,undefined,{numeric:true})))}
 const prog=p=>pr.style.width=p*100+'%';
 function tools(){const n=st.sel.size,w=can();B.up.disabled=!(st.cat==='all'&&st.cwd&&!st.q);B.ref.disabled=!st.root;B.nf.disabled=!w;B.open.disabled=n!==1;B.dl.disabled=!n;B.det.disabled=!n;B.ren.disabled=n!==1||!w;B.cp.disabled=!n||!w;B.mv.disabled=!n||!w;B.del.disabled=!n||!w;B.zip.disabled=n!==1||!w}
 const selUI=()=>{if(!st.sel.size)st.multi=0;$$('.fi',fl).forEach(n=>n.classList.toggle('sel',st.sel.has(n.dataset.p)));tools()};
 function draw(){st.urls.forEach(u=>URL.revokeObjectURL(u));st.urls=[];fs.innerHTML='';
  CATS.forEach(([k,t,i])=>{const e=E('div','mi'+(st.cat===k?' on':''),`${ic(i,17)}<span>${t}</span><em>${st.root?st.items.filter(f=>inCat(k,f)).length:''}</em>`);e.onclick=()=>{st.cat=k;st.cwd='';st.q='';q.value='';st.sel.clear();fs.classList.remove('o');draw()};fs.append(e)});
  const cn=(CATS.find(c=>c[0]===st.cat)||[])[1];cr.textContent=!st.root?'Akses: belum ada folder dipilih':(st.ro?'Akses terbatas (baca-saja) · ':'Akses diberikan · ')+st.rn+'/'+st.cwd+(st.cat!=='all'?'  ›  '+cn:'');
  fl.className='fl'+(st.view==='list'?' list':'');fl.innerHTML='';
  if(!st.root){const e=E('div','empty',`<div style="color:var(--ac);margin-bottom:8px">${ic('folder',40)}</div><b style="color:var(--tx)">Belum ada folder dipilih</b><p style="margin:8px 0 14px">NOVA hanya membaca folder yang kamu izinkan. Tidak ada file yang diunggah ke server.${window.showDirectoryPicker?'':'<br><br>Browser ini tidak punya akses tulis ke folder. Kamu tetap bisa memilih folder/file untuk mode <b>baca-saja</b>; rename, hapus, salin, pindah, dan ekstrak ZIP memerlukan Chrome/Edge desktop atau aplikasi native.'}</p>`),a=E('button','btn p','Pilih folder'),c=E('button','btn','Impor file');a.onclick=pick;c.onclick=()=>fi.click();e.append(a,c);fl.append(e)}
  else{const L=list();if(!L.length)fl.append(E('div','empty',st.items.length?'Tidak ada file yang cocok di tampilan ini.':'Folder ini kosong.'));
   L.forEach((f,i)=>{const k=kind(f),c=E('div','fi'+(st.sel.has(f.p)?' sel':''),`<div class="th">${ic(k,30)}</div><b>${esc(f.name)}</b><small>${f.k==='dir'?'Folder':fmt(f.size)+(f.mod?' · '+new Date(f.mod).toLocaleDateString():'')}</small>`);c.dataset.p=f.p;
    if(k==='image'&&f.f&&f.size<8e6&&i<80){const u=URL.createObjectURL(f.f);st.urls.push(u);$('.th',c).innerHTML=`<img loading="lazy" src="${u}" alt="">`}
    c.onclick=e=>{if(c.dataset.lp){delete c.dataset.lp;return}
     if(e.ctrlKey||e.metaKey||st.multi){st.sel.has(f.p)?st.sel.delete(f.p):st.sel.add(f.p)}
     else{if(st.sel.size===1&&st.sel.has(f.p)&&Date.now()-st.lt<450){st.lt=0;return openF(f)}st.sel=new Set([f.p]);st.lt=Date.now()}selUI()};
    c.oncontextmenu=e=>{e.preventDefault();e.stopPropagation();if(!st.sel.has(f.p)){st.sel=new Set([f.p]);selUI()}fmMenu(e.clientX,e.clientY)};
    lp(c,()=>{st.multi=1;st.sel.add(f.p);selUI()});fl.append(c)})}
  tools()}
 const fmMenu=(x,y)=>{const n=st.sel.size,w=can();menu([{t:'Open',i:'open',d:n!==1,f:()=>openF(sel1())},{t:'Rename',i:'edit',d:n!==1||!w,f:ren},{t:'Copy to…',i:'copy',d:!w,f:()=>xfer(0)},{t:'Move to…',i:'mv',d:!w,f:()=>xfer(1)},{t:'Extract ZIP…',i:'zip',d:n!==1||!w,f:extract},{t:'Share / Download',i:'share',f:()=>shareFiles(sels().filter(f=>f.k==='file'))},'-',{t:'Delete',i:'trash',d:!w,f:del},{t:'Details',i:'info',f:det}],x,y)};
 fl.oncontextmenu=e=>{if(e.target===fl)e.preventDefault()};fl.onclick=e=>{if(e.target===fl){st.sel.clear();selUI()}};
 async function pick(){if(window.showDirectoryPicker){try{const h=await showDirectoryPicker({mode:'readwrite'});st.root=h;st.rn=h.name;st.ro=false;await load()}catch(e){if(e.name!=='AbortError')toast('Akses folder ditolak atau gagal: '+e.message,'e')}}else di.click()}
 async function load(){const c=st.cwd;fl.innerHTML='<div class="empty">Membaca folder…</div>';try{st.items=await scan(st.root)}catch(e){st.root=null;st.items=[];draw();return toast(e.name==='NotAllowedError'?'Akses folder dicabut. Pilih folder lagi untuk melanjutkan.':'Gagal membaca folder: '+e.message,'e')}
  st.cwd=!c||st.items.some(x=>x.k==='dir'&&x.p+'/'===c)?c:'';st.sel.clear();draw()}
 function fromFiles(L,dir){if(!L.length)return;st.root={};st.ro=true;st.rn=dir?(L[0].webkitRelativePath||'').split('/')[0]||'Folder':'Impor';st.items=[];const seen=new Set();
  L.forEach(f=>{const p=dir&&f.webkitRelativePath?f.webkitRelativePath.split('/').slice(1).join('/'):f.name;st.items.push({k:'file',name:f.name,p,size:f.size,mod:f.lastModified,type:f.type,f});
   p.split('/').slice(0,-1).reduce((a,x)=>{const q=a?a+'/'+x:x;if(!seen.has(q)){seen.add(q);st.items.push({k:'dir',name:x,p:q})}return q},'')});
  st.cwd='';st.sel.clear();draw();toast('Mode baca-saja: browser tidak memberi akses tulis ke file asli.')}
 fi.onchange=()=>fromFiles([...fi.files],0);di.onchange=()=>fromFiles([...di.files],1);
 async function openF(f){if(!f)return;if(f.k==='dir'){st.cat='all';st.cwd=f.p+'/';st.q='';q.value='';st.sel.clear();draw();return}
  rec.add(f.p);S.recent=[...rec].slice(-50);save();let file;try{file=f.f||await f.h.getFile()}catch(e){return toast('File tidak bisa dibuka: '+(e.name==='NotFoundError'?'sudah tidak ada':e.message),'e')}
  const k=kind(f),u=URL.createObjectURL(file),e=ext(f.name);let h;
  if(k==='image')h=`<img src="${u}" alt="">`;else if(k==='video')h=`<video src="${u}" controls autoplay></video>`;else if(k==='music')h=`<audio src="${u}" controls autoplay style="width:100%"></audio>`;else if(e==='pdf')h=`<iframe src="${u}"></iframe>`;
  else if(file.size<2e6&&(file.type.startsWith('text')||'txt md csv json html css js'.split(' ').includes(e)))h='<pre></pre>';else h=`<p>Format <b>.${esc(e||'?')}</b> tidak bisa dipratinjau di browser.${k==='zip'?' Pilih file ZIP lalu gunakan Extract.':' Gunakan Bagikan/Unduh.'}</p>`;
  const d=E('div',0,h),pre=$('pre',d);if(pre)pre.textContent=await file.text();
  const v=await dlg(esc(f.name),d,[{t:'Bagikan / Unduh',v:1},{t:'Tutup',v:0,p:1}],1);URL.revokeObjectURL(u);if(v)shareFiles([f])}
 async function ren(){const f=sel1();if(!f||!can())return;let v=await ask('Rename',f.name);if(v==null)return;v=v.trim();
  if(!v||/[\\/:*?"<>|\u0000-\u001f]/.test(v)||v==='.'||v==='..')return toast('Nama tidak valid','e');if(v===f.name)return;
  if(st.items.some(x=>dirn(x.p)===dirn(f.p)&&x.name.toLowerCase()===v.toLowerCase()))return toast('Nama itu sudah ada di folder ini','e');
  try{if(f.h.move)await f.h.move(v);else if(f.k==='file'){const w=await(await f.parent.getFileHandle(v,{create:true})).createWritable();await(f.f||await f.h.getFile()).stream().pipeTo(w);await f.parent.removeEntry(f.name)}else throw Error('browser ini belum bisa mengganti nama folder')}catch(e){return toast('Rename gagal: '+e.message,'e')}
  await load();toast('Nama file asli diubah menjadi '+esc(v),'ok')}
 async function del(){const L=sels();if(!L.length||!can())return;
  if(!await yes('Hapus permanen?',`<p><b>${L.length}</b> item akan dihapus dari perangkatmu:</p><p style="margin:8px 0;max-height:120px;overflow:auto;font-size:12px">${L.map(f=>esc(f.name)).join('<br>')}</p><p style="color:#ff7a7a">Browser tidak punya Trash sistem, jadi item ini TIDAK bisa dipulihkan.${L.some(f=>f.k==='dir')?' Isi folder ikut terhapus.':''}</p>`,'Hapus permanen'))return;
  let ok=0;const bad=[];for(const f of L){try{await f.parent.removeEntry(f.name,{recursive:true});ok++}catch(e){bad.push(f.name+' ('+(e.name==='NotFoundError'?'tidak ditemukan':e.name==='NotAllowedError'?'izin ditolak/terkunci':e.message)+')')}}
  st.sel.clear();await load();if(ok)toast(ok+' item dihapus','ok');if(bad.length)toast('Gagal dihapus: '+bad.join(', '),'e')}
 async function xfer(mv){const L=sels().filter(f=>f.k==='file');if(!L.length)return toast('Pilih file dulu (salin/pindah folder belum didukung)','e');if(!can())return;
  let d;try{d=await showDirectoryPicker({mode:'readwrite'})}catch{return}let ok=0;const bad=[];
  for(const[i,f]of L.entries()){prog(i/L.length);try{if(mv&&await d.isSameEntry(f.parent))throw Error('tujuan sama dengan asal');const n=await uniq(d,f.name),w=await(await d.getFileHandle(n,{create:true})).createWritable();await(f.f||await f.h.getFile()).stream().pipeTo(w);if(mv)await f.parent.removeEntry(f.name);ok++}catch(e){bad.push(f.name+' ('+e.message+')')}}
  prog(1);setTimeout(()=>prog(0),500);st.sel.clear();await load();if(ok)toast(`${ok} file ${mv?'dipindahkan':'disalin'}`,'ok');if(bad.length)toast('Gagal: '+bad.join(', '),'e')}
 async function newF(){if(!can())return;let n=await ask('Folder baru','Folder baru');if(n==null)return;n=n.trim();if(!n||/[\\/:*?"<>|\u0000-\u001f]/.test(n)||n==='.'||n==='..')return toast('Nama folder tidak valid','e');
  try{const d=cwdH();if(await has(d,n))return toast('Nama itu sudah ada','e');await d.getDirectoryHandle(n,{create:true});await load();toast('Folder dibuat','ok')}catch(e){toast('Gagal membuat folder: '+e.message,'e')}}
 async function extract(){const f=sels().find(f=>f.k==='file'&&ext(f.name)==='zip');if(!f)return toast('Pilih file .zip (RAR/7Z belum didukung)','e');if(!can())return;
  let buf,L;try{buf=await(f.f||await f.h.getFile()).arrayBuffer();L=zlist(buf)}catch(e){return toast('ZIP rusak atau tidak didukung: '+e.message,'e')}
  const fl2=L.filter(z=>!z.n.endsWith('/'));if(!await yes('Extract '+esc(f.name),`<div class="kv"><span>Isi arsip</span><b>${fl2.length} file</b><span>Ukuran hasil</span><b>${fmt(fl2.reduce((a,z)=>a+z.us,0))}</b></div><p style="margin:10px 0 0;font-size:12px;color:var(--mu)">Tidak ada yang diekstrak sebelum kamu memilih folder tujuan.</p>`,'Pilih tujuan'))return;
  let d;try{d=await showDirectoryPicker({mode:'readwrite'})}catch{return}let ok=0,bad=0;
  for(const[i,z]of L.entries()){prog(i/L.length);const parts=safe(z.n);if(!parts){bad++;continue}
   try{let dir=d;const last=z.n.endsWith('/')?null:parts.pop();for(const p of parts)dir=await dir.getDirectoryHandle(p,{create:true});if(last==null)continue;
    const data=await zdata(buf,z),w=await(await dir.getFileHandle(await uniq(dir,last),{create:true})).createWritable();await w.write(data);await w.close();ok++}catch{bad++}}
  prog(1);setTimeout(()=>prog(0),500);await load();toast(`${ok} file diekstrak`+(bad?`, ${bad} dilewati (path berbahaya, rusak, atau tidak didukung)`:''),ok?'ok':'e')}
 function det(){const L=sels();if(!L.length)return;dlg('Details',L.length>1?`<div class="kv"><span>Item</span><b>${L.length}</b><span>Total ukuran</span><b>${fmt(L.reduce((a,f)=>a+(f.size||0),0))}</b></div>`:(f=>`<div class="kv"><span>Nama</span><b>${esc(f.name)}</b><span>Tipe</span><b>${f.k==='dir'?'Folder':esc(f.type||'.'+ext(f.name))}</b><span>Ukuran</span><b>${fmt(f.size)}</b><span>Diubah</span><b>${f.mod?new Date(f.mod).toLocaleString():'—'}</b><span>Lokasi</span><b>${esc(st.rn+'/'+f.p)}</b></div>`)(L[0]))}
 const mk=(k,i,t,f)=>{const x=E('button','ib',ic(i,17));x.title=t;x.onclick=f;B[k]=x;ft.append(x);return x};
 mk('menu','menu','Kategori',()=>fs.classList.toggle('o')).classList.add('mm');mk('pick','folder','Pilih folder (meminta izin)',pick);mk('imp','plus','Impor file',()=>fi.click());
 mk('up','up','Folder induk',()=>{st.cwd=dirn(st.cwd.slice(0,-1));st.sel.clear();draw()});mk('ref','refresh','Refresh dari sumber asli',()=>st.ro?toast('Mode baca-saja: pilih ulang folder untuk memuat ulang','e'):load());
 mk('nf','nf','Folder baru',newF);mk('open','open','Buka / Preview',()=>openF(sel1()));mk('ren','edit','Rename',ren);mk('cp','copy','Salin ke…',()=>xfer(0));mk('mv','mv','Pindah ke…',()=>xfer(1));mk('zip','zip','Extract ZIP',extract);
 mk('dl','share','Bagikan / Unduh',()=>shareFiles(sels().filter(f=>f.k==='file')));mk('det','info','Details',det);mk('del','trash','Hapus',del);
 mk('sa','check','Pilih semua',()=>{list().forEach(f=>st.sel.add(f.p));st.multi=1;selUI()});
 const q=E('input');q.type='search';q.placeholder='Cari…';q.oninput=()=>{st.q=q.value;draw()};ft.append(q);
 const so=E('select','ib','<option value="name">Nama</option><option value="date">Tanggal</option><option value="size">Ukuran</option><option value="type">Tipe</option>');so.onchange=()=>{st.sort=so.value;draw()};ft.append(so);
 mk('view','list','Grid / List',()=>{st.view=st.view==='grid'?'list':'grid';draw()});draw()}

/* ===== Login & boot ===== */
applyTheme();$('#user').value=S.user;
$('#user').onkeydown=e=>e.key==='Enter'&&$('#go').click();
$('#go').onclick=()=>{S.user=($('#user').value.trim()||'Pengguna').slice(0,24);if(!S.seeded)seed();S.sc=S.sc.filter(s=>APPS[s.app]);save();$('#login').classList.add('out');$('#desktop').hidden=false;
 S.sc.forEach(snap);icons();bar();clockT();setInterval(clockT,15000);toast('Selamat datang, '+esc(S.user))};
