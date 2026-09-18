(()=>{
let nice=null,tab=localStorage.getItem('nice-tab')||'shopping',busy=false,ingredientOpen='',pantryFilter='all',pantrySearch='';
const root=()=>document.getElementById('app');
const norm=s=>String(s||'').trim().toLowerCase();
const uid=()=>crypto.randomUUID();
const esc=(s='')=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const names=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
function monday(offset=0){const d=new Date(),day=d.getDay()||7;d.setHours(12,0,0,0);d.setDate(d.getDate()-day+1+offset*7);return d}
function key(){return monday(nice?.weekOffset||0).toISOString().slice(0,10)}
function weekLabel(){const a=monday(nice?.weekOffset||0),b=new Date(a);b.setDate(a.getDate()+6);const f=d=>new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'short'}).format(d);return `${f(a)} — ${f(b)}`}
function emptyWeek(){return names.map(name=>({name,lunch:'',dinner:'',note:'',lunchIngredients:[],dinnerIngredients:[]}))}
function normalizeDay(d,name){return {...d,name:d?.name||name,lunch:d?.lunch||'',dinner:d?.dinner||'',note:d?.note||'',lunchIngredients:Array.isArray(d?.lunchIngredients)?d.lunchIngredients:[],dinnerIngredients:Array.isArray(d?.dinnerIngredients)?d.dinnerIngredients:[]}}
function ensure(){
  nice=nice||{shopping:[],pantry:[],weeks:{},weekOffset:0};
  nice.shopping=Array.isArray(nice.shopping)?nice.shopping:[];
  nice.pantry=Array.isArray(nice.pantry)?nice.pantry:[];
  nice.weeks=nice.weeks&&typeof nice.weeks==='object'?nice.weeks:{};
  nice.pantry=nice.pantry.map(x=>({...x,count:Math.max(1,parseInt(x.count,10)||1),low:!!x.low}));
  if(!nice.weeks[key()])nice.weeks[key()]=emptyWeek();
  else nice.weeks[key()]=names.map((name,i)=>normalizeDay(nice.weeks[key()][i],name));
}
async function api(url,opt){const r=await fetch(url,opt);const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Error');return d}
async function load(){if(busy)return;try{nice=await api('/api/nice');ensure();renderNice()}catch{}}
async function save(){busy=true;try{nice=await api('/api/nice',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(nice)});ensure();renderNice()}finally{busy=false}}
function isMarta(){const selected=document.querySelector('.profile-card.selected strong');return selected&&selected.textContent.trim().toLowerCase()==='marta'}
function mount(){const old=document.getElementById('nice-marta');if(!isMarta()){old?.remove();return}if(old)return;if(!nice){load();return}const profile=document.querySelector('.profile-zone');if(!profile)return;const sec=document.createElement('section');sec.id='nice-marta';sec.className='nice-space';profile.insertAdjacentElement('afterend',sec);renderNice()}
function pantryHas(name){return nice.pantry.find(x=>norm(x.text)===norm(name))}
function shoppingHas(name){return nice.shopping.find(x=>norm(x.text)===norm(name))}
function plannedCount(){const w=nice.weeks[key()]||[];return w.reduce((n,d)=>n+(d.lunch?1:0)+(d.dinner?1:0),0)}
function missingForMeal(day,kind){const arr=day[kind+'Ingredients']||[];return arr.filter(i=>!pantryHas(i.name||i.text))}
function mealIngredientHtml(day,i,kind){
  const arr=day[kind+'Ingredients']||[];
  const openKey=`${i}:${kind}`;
  if(ingredientOpen!==openKey)return '';
  const pantryChoices=nice.pantry.filter(p=>!arr.some(a=>norm(a.name||a.text)===norm(p.text))).slice(0,18);
  return `<div class="nice-ingredients">
    <div class="nice-ingredients-head"><div><strong>Ingredientes</strong><span>Opcional · solo si te viene bien</span></div><button data-close-ing="${openKey}">×</button></div>
    <div class="nice-ing-list">
      ${arr.map(ing=>{const nm=ing.name||ing.text||'';const have=!!pantryHas(nm),inShop=!!shoppingHas(nm);return `<div class="nice-ing-row"><span>${esc(nm)}</span><small class="${have?'have':inShop?'buying':'missing'}">${have?'✓ Lo tengo':inShop?'🛒 En compra':'Falta'}</small><button data-del-ing="${openKey}" data-ing-name="${esc(nm)}">×</button></div>`}).join('')||'<p class="nice-empty mini">Aún no has añadido ingredientes.</p>'}
    </div>
    ${pantryChoices.length?`<div class="nice-pantry-chips"><span>De tu despensa:</span><div>${pantryChoices.map(p=>`<button data-add-ing-pantry="${openKey}" data-ing-name="${esc(p.text)}">＋ ${esc(p.text)}</button>`).join('')}</div></div>`:''}
    <div class="nice-ing-add"><input data-ing-input="${openKey}" placeholder="Añadir ingrediente…"><button data-add-ing="${openKey}">＋</button></div>
    ${missingForMeal(day,kind).length?`<button class="nice-add-missing" data-add-missing="${openKey}">🛒 Añadir ${missingForMeal(day,kind).length} faltante${missingForMeal(day,kind).length>1?'s':''} a compra</button>`:''}
  </div>`;
}
function mealCard(day,i,kind,label){
  const text=day[kind]||'',ings=day[kind+'Ingredients']||[],missing=missingForMeal(day,kind).length;
  return `<div class="nice-meal-card ${text?'filled':''}">
    <div class="nice-meal-top"><span>${label}</span>${ings.length?`<small>${ings.length} ing. · ${missing?missing+' falta'+(missing>1?'n':''):'todo en casa'}</small>`:''}</div>
    <input data-nice-meal="${i}:${kind}" value="${esc(text)}" placeholder="${kind==='lunch'?'¿Qué comes?':'¿Qué cenas?'}">
    <button class="nice-ing-toggle" data-toggle-ing="${i}:${kind}">${ings.length?'Ingredientes · '+ings.length:'＋ Ingredientes'}</button>
    ${mealIngredientHtml(day,i,kind)}
  </div>`;
}
function renderNice(){
  if(!isMarta())return;
  let sec=document.getElementById('nice-marta');if(!sec){mount();sec=document.getElementById('nice-marta');if(!sec)return}
  ensure();
  const active=nice.weeks[key()];
  const shop=nice.shopping.map(x=>`<div class="nice-shop-card"><button data-nice-bought="${x.id}" class="nice-ok" title="Comprado">✓</button><span>${esc(x.text)}</span><button data-nice-delshop="${x.id}" class="nice-x" title="Quitar">×</button></div>`).join('')||'<div class="nice-empty-state"><span>✓</span><strong>Compra al día</strong><p>No tienes nada pendiente.</p></div>';
  const quickFromPantry=nice.pantry.filter(p=>!shoppingHas(p.text)).slice(0,12);
  const filteredPantry=nice.pantry.filter(x=>{
    if(pantrySearch&&!norm(x.text).includes(norm(pantrySearch)))return false;
    if(pantryFilter==='low'&&!x.low)return false;
    if(pantryFilter==='shopping'&&!shoppingHas(x.text))return false;
    return true;
  });
  const pantry=filteredPantry.map(x=>`<div class="nice-pantry-card">
    <div class="nice-pantry-name"><strong>${esc(x.text)}</strong><div class="nice-stock-tags">${x.low?'<span class="low">Queda poco</span>':'<span>En casa</span>'}${shoppingHas(x.text)?'<span class="buying">En compra</span>':''}</div></div>
    <div class="nice-step"><button data-nice-minus="${x.id}">−</button><b>${x.count||1}</b><button data-nice-plus="${x.id}">＋</button></div>
    <button data-nice-low="${x.id}" class="nice-soft ${x.low?'active':''}">${x.low?'✓ Poco':'Poco'}</button>
    <button data-nice-more="${x.id}" class="nice-cart" ${shoppingHas(x.text)?'disabled':''}>${shoppingHas(x.text)?'✓':'🛒'}</button>
    <button data-nice-out="${x.id}" class="nice-out">Se acabó</button>
  </div>`).join('')||'<p class="nice-empty">No hay productos con este filtro.</p>';
  const days=active.map((d,i)=>`<article class="nice-day"><div class="nice-day-head"><div><strong>${d.name}</strong><span>${(()=>{const dt=monday(nice.weekOffset||0);dt.setDate(dt.getDate()+i);return dt.getDate()})()}</span></div></div>${mealCard(d,i,'lunch','Comida')}${mealCard(d,i,'dinner','Cena')}<input class="nice-note" data-nice-note="${i}" value="${esc(d.note||'')}" placeholder="Nota rápida…"></article>`).join('');
  sec.innerHTML=`<div class="nice-head"><div><p class="eyebrow">MARTA · NIZA 🇫🇷</p><h2>Mi vida en Niza</h2><p>Todo lo tuyo, rápido y separado del planning familiar.</p></div><span class="nice-date">Sep 2026 — Mar 2027</span></div>
  <div class="nice-overview"><div><strong>${nice.shopping.length}</strong><span>por comprar</span></div><div><strong>${nice.pantry.length}</strong><span>en despensa</span></div><div><strong>${plannedCount()}/14</strong><span>comidas planeadas</span></div></div>
  <div class="nice-tabs"><button data-nice-tab="shopping" class="${tab==='shopping'?'active':''}">🛒 Compra</button><button data-nice-tab="pantry" class="${tab==='pantry'?'active':''}">🥫 Despensa</button><button data-nice-tab="planning" class="${tab==='planning'?'active':''}">🍽 Planning</button></div>
  <div class="nice-panel">${tab==='shopping'?
    `<div class="nice-title"><div><p class="eyebrow">LISTA DE LA COMPRA</p><h3>Comprar sin pensar de más</h3></div><span>${nice.shopping.length} pendiente${nice.shopping.length===1?'':'s'}</span></div>
    <div class="nice-add prominent"><input id="nice-new-shop" placeholder="Añadir producto…"><button id="nice-add-shop">＋ Añadir</button></div>
    ${quickFromPantry.length?`<div class="nice-quick"><span>Añadir desde despensa</span><div>${quickFromPantry.map(p=>`<button data-nice-quick-shop="${p.id}">＋ ${esc(p.text)}</button>`).join('')}</div></div>`:''}
    <div class="nice-shop-list">${shop}</div>`:
  tab==='pantry'?
    `<div class="nice-title"><div><p class="eyebrow">DESPENSA DE NIZA</p><h3>Lo que tienes ahora mismo</h3></div><span>${nice.pantry.length} productos</span></div>
    <div class="nice-pantry-tools"><input id="nice-pantry-search" value="${esc(pantrySearch)}" placeholder="Buscar…"><div class="nice-filter"><button data-pfilter="all" class="${pantryFilter==='all'?'active':''}">Todo</button><button data-pfilter="low" class="${pantryFilter==='low'?'active':''}">Queda poco</button><button data-pfilter="shopping" class="${pantryFilter==='shopping'?'active':''}">En compra</button></div></div>
    <div class="nice-pantry-list">${pantry}</div>
    <div class="nice-add"><input id="nice-new-pantry" placeholder="Añadir producto…"><button id="nice-add-pantry">＋ Añadir</button></div>`:
    `<div class="nice-planning-head"><div><p class="eyebrow">PLANNING SEMANAL</p><h3>Tu semana, de un vistazo</h3><p>Escribe solo el plato o abre ingredientes si quieres comprobar qué tienes.</p></div><div class="nice-week"><button id="nice-prev">←</button><strong>${weekLabel()}</strong><button id="nice-next">→</button></div></div><div class="nice-days">${days}</div>`}
  </div>`;
  bind();
}
function addShoppingText(text){text=text.trim();if(!text||shoppingHas(text))return false;nice.shopping.push({id:uid(),text});return true}
function addIngredient(dayIndex,kind,name){name=name.trim();if(!name)return false;const arr=nice.weeks[key()][dayIndex][kind+'Ingredients'];if(arr.some(i=>norm(i.name||i.text)===norm(name)))return false;arr.push({id:uid(),name});return true}
function bind(){
  document.querySelectorAll('[data-nice-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.niceTab;localStorage.setItem('nice-tab',tab);ingredientOpen='';renderNice()});
  const addShop=document.getElementById('nice-add-shop');if(addShop){const fn=()=>{const i=document.getElementById('nice-new-shop');if(addShoppingText(i.value))save()};addShop.onclick=fn;document.getElementById('nice-new-shop').onkeydown=e=>{if(e.key==='Enter')fn()}}
  document.querySelectorAll('[data-nice-quick-shop]').forEach(b=>b.onclick=()=>{const p=nice.pantry.find(x=>x.id===b.dataset.niceQuickShop);if(p&&addShoppingText(p.text))save()});
  const addPantry=document.getElementById('nice-add-pantry');if(addPantry){const fn=()=>{const i=document.getElementById('nice-new-pantry'),text=i.value.trim();if(!text)return;const ex=pantryHas(text);if(ex)ex.count=(ex.count||1)+1;else nice.pantry.push({id:uid(),text,count:1,low:false});save()};addPantry.onclick=fn;document.getElementById('nice-new-pantry').onkeydown=e=>{if(e.key==='Enter')fn()}}
  document.querySelectorAll('[data-nice-bought]').forEach(b=>b.onclick=()=>{const x=nice.shopping.find(y=>y.id===b.dataset.niceBought);if(!x)return;nice.shopping=nice.shopping.filter(y=>y.id!==x.id);const ex=pantryHas(x.text);if(ex){ex.count=(ex.count||1)+1;ex.low=false}else nice.pantry.push({id:uid(),text:x.text,count:1,low:false});save()});
  document.querySelectorAll('[data-nice-delshop]').forEach(b=>b.onclick=()=>{nice.shopping=nice.shopping.filter(x=>x.id!==b.dataset.niceDelshop);save()});
  document.querySelectorAll('[data-nice-minus]').forEach(b=>b.onclick=()=>{const x=nice.pantry.find(y=>y.id===b.dataset.niceMinus);if(!x)return;x.count=(x.count||1)-1;if(x.count<=0){nice.pantry=nice.pantry.filter(y=>y.id!==x.id);addShoppingText(x.text)}save()});
  document.querySelectorAll('[data-nice-plus]').forEach(b=>b.onclick=()=>{const x=nice.pantry.find(y=>y.id===b.dataset.nicePlus);if(x){x.count=(x.count||1)+1;x.low=false;save()}});
  document.querySelectorAll('[data-nice-low]').forEach(b=>b.onclick=()=>{const x=nice.pantry.find(y=>y.id===b.dataset.niceLow);if(x){x.low=!x.low;save()}});
  document.querySelectorAll('[data-nice-more]').forEach(b=>b.onclick=()=>{const x=nice.pantry.find(y=>y.id===b.dataset.niceMore);if(x&&addShoppingText(x.text))save()});
  document.querySelectorAll('[data-nice-out]').forEach(b=>b.onclick=()=>{const x=nice.pantry.find(y=>y.id===b.dataset.niceOut);if(!x)return;nice.pantry=nice.pantry.filter(y=>y.id!==x.id);addShoppingText(x.text);save()});
  const s=document.getElementById('nice-pantry-search');if(s)s.oninput=()=>{pantrySearch=s.value;renderNice()};
  document.querySelectorAll('[data-pfilter]').forEach(b=>b.onclick=()=>{pantryFilter=b.dataset.pfilter;renderNice()});
  if(document.getElementById('nice-prev'))document.getElementById('nice-prev').onclick=()=>{nice.weekOffset=(nice.weekOffset||0)-1;ingredientOpen='';ensure();save()};
  if(document.getElementById('nice-next'))document.getElementById('nice-next').onclick=()=>{nice.weekOffset=(nice.weekOffset||0)+1;ingredientOpen='';ensure();save()};
  document.querySelectorAll('[data-nice-meal]').forEach(i=>i.onchange=()=>{const [d,k]=i.dataset.niceMeal.split(':');nice.weeks[key()][+d][k]=i.value;save()});
  document.querySelectorAll('[data-nice-note]').forEach(i=>i.onchange=()=>{nice.weeks[key()][+i.dataset.niceNote].note=i.value;save()});
  document.querySelectorAll('[data-toggle-ing]').forEach(b=>b.onclick=()=>{ingredientOpen=ingredientOpen===b.dataset.toggleIng?'':b.dataset.toggleIng;renderNice()});
  document.querySelectorAll('[data-close-ing]').forEach(b=>b.onclick=()=>{ingredientOpen='';renderNice()});
  document.querySelectorAll('[data-add-ing-pantry]').forEach(b=>b.onclick=()=>{const [d,k]=b.dataset.addIngPantry.split(':');if(addIngredient(+d,k,b.dataset.ingName))save()});
  document.querySelectorAll('[data-del-ing]').forEach(b=>b.onclick=()=>{const [d,k]=b.dataset.delIng.split(':');const arr=nice.weeks[key()][+d][k+'Ingredients'];nice.weeks[key()][+d][k+'Ingredients']=arr.filter(i=>norm(i.name||i.text)!==norm(b.dataset.ingName));save()});
  document.querySelectorAll('[data-add-ing]').forEach(b=>b.onclick=()=>{const [d,k]=b.dataset.addIng.split(':');const inp=document.querySelector(`[data-ing-input="${b.dataset.addIng}"]`);if(inp&&addIngredient(+d,k,inp.value))save()});
  document.querySelectorAll('[data-ing-input]').forEach(inp=>inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();document.querySelector(`[data-add-ing="${inp.dataset.ingInput}"]`)?.click()}});
  document.querySelectorAll('[data-add-missing]').forEach(b=>b.onclick=()=>{const [d,k]=b.dataset.addMissing.split(':');const day=nice.weeks[key()][+d];let changed=false;for(const ing of missingForMeal(day,k)){if(addShoppingText(ing.name||ing.text))changed=true}if(changed)save()});
}
let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(mount,60)}).observe(root(),{childList:true,subtree:true});mount();
})();