(()=>{
let nice=null,tab=localStorage.getItem('nice-tab')||'planning',busy=false,ingredientOpen='',pantryFilter='all',pantrySearch='',recipeSearch='';
const root=()=>document.getElementById('app');
const norm=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const uid=()=>crypto.randomUUID();
const esc=(s='')=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const names=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const R=(name,ingredients,note='')=>({id:'seed-'+norm(name).replace(/[^a-z0-9]+/g,'-'),name,ingredients:ingredients.map(name=>({name})),note,seed:true});
const seedRecipes=[
R('Loaded boniato taco boat',['boniato','carne picada','alubias','pimiento','cebolla','tomate','queso rallado'],'Boniato en forma de barquita con el relleno dentro.'),
R('Mini tortilla española de verduras',['huevo','patata','cebolla','pimiento','berenjena']),
R('Chicken parm pasta bake',['pasta','pollo','puré de tomate','berenjena','cebolla','mozzarella','orégano'],'Montar en fuente pequeña y gratinar.'),
R('Rollitos de berenjena rellenos',['berenjena','jamón york','mozzarella','puré de tomate','queso rallado']),
R('Chicken fajita rice cup',['arroz','pollo','pimiento','cebolla','queso rallado','tomate']),
R('Pizza de tortilla proteica',['huevo','mozzarella','jamón york','berenjena','puré de tomate']),
R('Volcano mash bowl',['patata','pollo','berenjena','cebolla','pimiento','salsa de pimienta','queso']),
R('Egg quesadilla sin tortilla',['huevo','jamón york','mozzarella','pimiento','cebolla']),
R('Pizza pasta muffins',['pasta','huevo','puré de tomate','mozzarella','jamón york','pimiento','orégano']),
R('Berenjena lasagna stack',['berenjena','jamón york','mozzarella','puré de tomate','queso rallado']),
R('Butter chicken rice bake',['butter chicken','arroz','berenjena','cebolla','pimiento','queso']),
R('Chicken pizza bites',['pollo','puré de tomate','mozzarella','jamón york','orégano']),
R('Tuna rice patties',['arroz','atún','huevo','queso rallado','cebolla','pimiento']),
R('Aubergine burger stacks',['berenjena','jamón york','mozzarella','huevo','tomate']),
R('Chicken taco pockets',['tortilla SG','pollo','pimiento','cebolla','queso rallado','tomate']),
R('Stuffed omelette roll',['huevo','jamón york','mozzarella','berenjena','pimiento']),
R('Mini lasagna bowl',['pasta','carne o pollo','berenjena','puré de tomate','mozzarella','queso rallado']),
R('Eggplant parm bites',['berenjena','mozzarella','jamón york','puré de tomate','queso rallado']),
R('Mini brownie de chocolate',['cacao','huevo','harina/avena SG','leche','sacarina']),
R('Apple crumble fit',['manzana','canela','galleta SG','yogur']),
R('Mini banana bread muffin',['plátano','huevo','harina/avena SG']),
R('Chocolate yogurt mousse',['yogur','cacao','sacarina'])
];
const planSeed={
 '2026-09-14':{
  5:{lunch:'Loaded boniato taco boat',lunchExtra:'Postre: Mini brownie de chocolate',lunchIngredients:['boniato','carne picada','alubias','pimiento','cebolla','tomate','queso rallado','cacao','huevo','harina/avena SG','leche','sacarina'],dinner:'Mini tortilla española de verduras',dinnerExtra:'Acompañamiento: brotes baby + jamón york · Postre: crema fría de chocolate',dinnerIngredients:['huevo','patata','cebolla','pimiento','berenjena','brotes baby','jamón york','yogur','cacao','sacarina']},
  6:{lunch:'Chicken parm pasta bake',lunchExtra:'Postre: Brownie',lunchIngredients:['pasta','pollo','puré de tomate','berenjena','cebolla','mozzarella','orégano'],dinner:'Rollitos de berenjena rellenos',dinnerExtra:'Acompañamiento: brotes baby · Postre: yogur de canela',dinnerIngredients:['berenjena','jamón york','mozzarella','puré de tomate','queso rallado','brotes baby','yogur','canela']}
 },
 '2026-09-21':{
  0:{lunch:'Chicken fajita rice cup',lunchExtra:'Postre: Brownie',lunchIngredients:['arroz','pollo','pimiento','cebolla','queso rallado','tomate'],dinner:'Pizza de tortilla proteica',dinnerExtra:'Postre: yogur de chocolate',dinnerIngredients:['huevo','mozzarella','jamón york','berenjena','puré de tomate','yogur','cacao']},
  1:{lunch:'Volcano mash bowl',lunchExtra:'Postre: Apple crumble fit',lunchIngredients:['patata','pollo','berenjena','cebolla','pimiento','salsa de pimienta','queso','manzana','canela','galleta SG','yogur'],dinner:'Egg quesadilla sin tortilla',dinnerExtra:'Acompañamiento: brotes baby · Postre: yogur con cacao',dinnerIngredients:['huevo','jamón york','mozzarella','pimiento','cebolla','brotes baby','yogur','cacao']},
  2:{lunch:'Pizza pasta muffins',lunchExtra:'Postre: Mini banana bread muffin',lunchIngredients:['pasta','huevo','puré de tomate','mozzarella','jamón york','pimiento','orégano','plátano','harina/avena SG'],dinner:'Berenjena lasagna stack',dinnerExtra:'Postre: crema de chocolate',dinnerIngredients:['berenjena','jamón york','mozzarella','puré de tomate','queso rallado','yogur','cacao','sacarina']},
  3:{lunch:'Butter chicken rice bake',lunchExtra:'Postre: Brownie',lunchIngredients:['butter chicken','arroz','berenjena','cebolla','pimiento','queso'],dinner:'Chicken pizza bites',dinnerExtra:'Acompañamiento: brotes baby + pimiento/berenjena · Postre: yogur con canela',dinnerIngredients:['pollo','puré de tomate','mozzarella','jamón york','orégano','brotes baby','pimiento','berenjena','yogur','canela']},
  4:{lunch:'Tuna rice patties',lunchExtra:'Acompañamiento: brotes baby · Postre: banana bread muffin',lunchIngredients:['arroz','atún','huevo','queso rallado','cebolla','pimiento','brotes baby','plátano','harina/avena SG'],dinner:'Aubergine burger stacks',dinnerExtra:'Postre: Chocolate yogurt mousse',dinnerIngredients:['berenjena','jamón york','mozzarella','huevo','tomate','yogur','cacao','sacarina']},
  5:{lunch:'Chicken taco pockets',lunchExtra:'Postre: Brownie',lunchIngredients:['tortilla SG','pollo','pimiento','cebolla','queso rallado','tomate'],dinner:'Stuffed omelette roll',dinnerExtra:'Acompañamiento: brotes baby · Postre: yogur de chocolate',dinnerIngredients:['huevo','jamón york','mozzarella','berenjena','pimiento','brotes baby','yogur','cacao']},
  6:{lunch:'Mini lasagna bowl',lunchExtra:'Postre: Brownie o banana bread',lunchIngredients:['pasta','carne o pollo','berenjena','puré de tomate','mozzarella','queso rallado'],dinner:'Eggplant parm bites',dinnerExtra:'Acompañamiento: brotes baby · Postre: yogur con cacao',dinnerIngredients:['berenjena','mozzarella','jamón york','puré de tomate','queso rallado','brotes baby','yogur','cacao']}
 }
};
function monday(offset=0){const d=new Date(),day=d.getDay()||7;d.setHours(12,0,0,0);d.setDate(d.getDate()-day+1+offset*7);return d}
function key(){return monday(nice?.weekOffset||0).toISOString().slice(0,10)}
function weekLabel(){const a=monday(nice?.weekOffset||0),b=new Date(a);b.setDate(a.getDate()+6);const f=d=>new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'short'}).format(d);return `${f(a)} — ${f(b)}`}
function emptyWeek(){return names.map(name=>({name,lunch:'',dinner:'',note:'',lunchExtra:'',dinnerExtra:'',lunchIngredients:[],dinnerIngredients:[]}))}
function normalizeIngs(a){return Array.isArray(a)?a.map(x=>typeof x==='string'?{id:uid(),name:x}:({...x,id:x.id||uid(),name:x.name||x.text||''})).filter(x=>x.name):[]}
function normalizeDay(d,name){return {...d,name:d?.name||name,lunch:d?.lunch||'',dinner:d?.dinner||'',note:d?.note||'',lunchExtra:d?.lunchExtra||'',dinnerExtra:d?.dinnerExtra||'',lunchIngredients:normalizeIngs(d?.lunchIngredients),dinnerIngredients:normalizeIngs(d?.dinnerIngredients)}}
function ensureWeek(k){if(!nice.weeks[k])nice.weeks[k]=emptyWeek();else nice.weeks[k]=names.map((n,i)=>normalizeDay(nice.weeks[k][i],n))}
function applySeeds(){
 if(!nice.seededRecipesV2){const existing=new Set(nice.recipes.map(r=>norm(r.name)));for(const r of seedRecipes)if(!existing.has(norm(r.name)))nice.recipes.push(r);nice.seededRecipesV2=true}
 if(!nice.planningSeedSep19_27_2026){
   for(const [wk,entries] of Object.entries(planSeed)){ensureWeek(wk);for(const [iStr,p] of Object.entries(entries)){const i=+iStr,d=nice.weeks[wk][i];nice.weeks[wk][i]={...d,...p,lunchIngredients:normalizeIngs(p.lunchIngredients),dinnerIngredients:normalizeIngs(p.dinnerIngredients)}}}
   nice.planningSeedSep19_27_2026=true;
   return true;
 }
 return false;
}
function ensure(){
 nice=nice||{shopping:[],pantry:[],weeks:{},recipes:[],weekOffset:0};
 nice.shopping=Array.isArray(nice.shopping)?nice.shopping:[];
 nice.pantry=Array.isArray(nice.pantry)?nice.pantry:[];
 nice.weeks=nice.weeks&&typeof nice.weeks==='object'?nice.weeks:{};
 nice.recipes=Array.isArray(nice.recipes)?nice.recipes.map(r=>({...r,id:r.id||uid(),ingredients:normalizeIngs(r.ingredients)})):[];
 nice.aliases=nice.aliases&&typeof nice.aliases==='object'?nice.aliases:{};
 nice.pantry=nice.pantry.map(x=>({...x,count:Math.max(1,parseInt(x.count,10)||1),low:!!x.low}));
 ensureWeek(key());
 return applySeeds();
}
async function api(url,opt){const r=await fetch(url,opt);const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Error');return d}
async function load(){if(busy)return;try{nice=await api('/api/nice');const seeded=ensure();if(seeded)await save({rerender:false});renderNice()}catch{}}
async function save({rerender=true}={}){if(busy)return;busy=true;try{nice=await api('/api/nice',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(nice)});ensure();if(rerender)renderNice()}finally{busy=false}}
function isMarta(){const selected=document.querySelector('.profile-card.selected strong');return selected&&selected.textContent.trim().toLowerCase()==='marta'}
function mount(){const old=document.getElementById('nice-marta');if(!isMarta()){old?.remove();return}if(old)return;if(!nice){load();return}const profile=document.querySelector('.profile-zone');if(!profile)return;const sec=document.createElement('section');sec.id='nice-marta';sec.className='nice-space';profile.insertAdjacentElement('afterend',sec);renderNice()}
function candidates(name){return norm(name).split(/\s*\/\s*|\s+o\s+/).map(x=>x.trim()).filter(Boolean)}
function aliasTarget(name){const a=nice.aliases?.[norm(name)];return a?norm(a):''}
function inventoryMatch(name,list){
 const cs=candidates(name),alias=aliasTarget(name);
 return list.find(x=>{const v=norm(x.text);if(alias&&v===alias)return true;return cs.some(c=>v===c||(c.length>=4&&(v.includes(c)||c.includes(v))))})
}
function pantryHas(name){return inventoryMatch(name,nice.pantry)}
function shoppingHas(name){return inventoryMatch(name,nice.shopping)}
function relateIngredient(name,product){nice.aliases[norm(name)]=product.text}
function plannedCount(){const w=nice.weeks[key()]||[];return w.reduce((n,d)=>n+(d.lunch?1:0)+(d.dinner?1:0),0)}
function missingForMeal(day,kind){return (day[kind+'Ingredients']||[]).filter(i=>!pantryHas(i.name||i.text)&&!shoppingHas(i.name||i.text))}
function recipeByName(name){return nice.recipes.find(r=>norm(r.name)===norm(name))}
function applyRecipe(day,kind,recipe){day[kind]=recipe.name;day[kind+'Ingredients']=normalizeIngs(recipe.ingredients)}
function mealIngredientHtml(day,i,kind){
 const arr=day[kind+'Ingredients']||[],openKey=`${i}:${kind}`;if(ingredientOpen!==openKey)return '';
 const pantryChoices=nice.pantry.filter(p=>!arr.some(a=>norm(a.name)===norm(p.text))).slice(0,18);
 return `<div class="nice-ingredients"><div class="nice-ingredients-head"><div><strong>Ingredientes</strong><span>Opcional · se guardan con el plato</span></div><button data-close-ing="${openKey}">×</button></div>
 <div class="nice-ing-list">${arr.map(ing=>{const nm=ing.name||'',have=pantryHas(nm),inShop=shoppingHas(nm);return `<div class="nice-ing-row ${!have&&!inShop?'is-missing':''}"><input class="nice-ing-name" data-edit-ing="${openKey}" data-old-ing="${esc(nm)}" value="${esc(nm)}"><small class="${have?'have':inShop?'buying':'missing'}">${have?'✓ '+esc(have.text):inShop?'🛒 En compra':'⚠ Falta'}</small><div class="nice-ing-actions">${!have&&!inShop?`<button class="ing-cart" data-buy-ing="${esc(nm)}" title="Añadir a compra">🛒</button><button class="ing-relate" data-open-relate="${openKey}" data-ing-name="${esc(nm)}" title="Relacionar con despensa">↔</button>`:''}<button data-del-ing="${openKey}" data-ing-name="${esc(nm)}" title="Eliminar">×</button></div>${!have&&!inShop?`<div class="nice-relate-box" data-relate-box="${openKey}:${esc(nm)}" hidden><span>¿Ya lo tienes con otro nombre?</span><select data-relate-select="${openKey}" data-ing-name="${esc(nm)}"><option value="">Elegir de despensa…</option>${nice.pantry.map(p=>`<option value="${esc(p.id)}">${esc(p.text)}</option>`).join('')}</select><button data-relate-save="${openKey}" data-ing-name="${esc(nm)}">Relacionar</button></div>`:''}</div>`}).join('')||'<p class="nice-empty mini">Aún no hay ingredientes.</p>'}</div>
 ${pantryChoices.length?`<div class="nice-pantry-chips"><span>De tu despensa</span><div>${pantryChoices.map(p=>`<button data-add-ing-pantry="${openKey}" data-ing-name="${esc(p.text)}">＋ ${esc(p.text)}</button>`).join('')}</div></div>`:''}
 <div class="nice-ing-add"><input data-ing-input="${openKey}" placeholder="Añadir ingrediente…"><button data-add-ing="${openKey}">＋</button></div>
 ${missingForMeal(day,kind).length?`<button class="nice-add-missing" data-add-missing="${openKey}">🛒 Añadir ${missingForMeal(day,kind).length} faltante${missingForMeal(day,kind).length>1?'s':''} a compra</button>`:''}</div>`;
}
function mealCard(day,i,kind,label){
 const text=day[kind]||'',ings=day[kind+'Ingredients']||[],missing=missingForMeal(day,kind),extra=day[kind+'Extra']||'';
 return `<div class="nice-meal-card ${text?'filled':''} ${missing.length?'needs':''}"><div class="nice-meal-top"><span>${label}</span>${ings.length?`<small>${missing.length?'⚠ '+missing.length+' falta'+(missing.length>1?'n':''):'✓ ingredientes OK'}</small>`:''}</div>
 <input list="nice-recipes-list" data-nice-meal="${i}:${kind}" value="${esc(text)}" placeholder="${kind==='lunch'?'¿Qué comes?':'¿Qué cenas?'}">
 ${extra?`<div class="nice-extra">${esc(extra)}</div>`:''}
 <div class="nice-meal-actions"><button class="nice-ing-toggle" data-toggle-ing="${i}:${kind}">${ings.length?'Ingredientes · '+ings.length:'＋ Ingredientes'}</button>${text&&!recipeByName(text)?`<button class="nice-save-recipe" data-save-from-meal="${i}:${kind}">♡ Guardar receta</button>`:''}</div>
 ${missing.length?`<div class="nice-warning">⚠ No tienes: ${missing.slice(0,3).map(x=>esc(x.name)).join(', ')}${missing.length>3?'…':''}</div>`:''}
 ${mealIngredientHtml(day,i,kind)}</div>`;
}
function recipeCard(r){
 const miss=(r.ingredients||[]).filter(i=>!pantryHas(i.name)&&!shoppingHas(i.name));
 return `<article class="nice-recipe-card"><div class="nice-recipe-top"><div><h4>${esc(r.name)}</h4><span>${r.ingredients.length} ingredientes</span></div><button data-del-recipe="${r.id}" title="Eliminar">×</button></div>${r.note?`<p>${esc(r.note)}</p>`:''}<div class="nice-recipe-status">${miss.length?`<span class="warn">⚠ Te faltan ${miss.length}</span>`:'<span class="ok">✓ Puedes hacerla</span>'}</div><details><summary>Ver ingredientes</summary><div class="nice-recipe-ings">${r.ingredients.map(i=>`<span class="${pantryHas(i.name)?'have':shoppingHas(i.name)?'buying':'missing'}">${esc(i.name)}</span>`).join('')}</div></details></article>`;
}
function renderNice(){
 if(!isMarta())return;let sec=document.getElementById('nice-marta');if(!sec){mount();sec=document.getElementById('nice-marta');if(!sec)return}
 ensure();const oldScroll=sec.querySelector('.nice-days')?.scrollLeft||0,pageY=window.scrollY,active=nice.weeks[key()];
 const shop=nice.shopping.map(x=>`<div class="nice-shop-card"><button data-nice-bought="${x.id}" class="nice-ok">✓</button><input class="nice-edit-item" data-edit-shop="${x.id}" value="${esc(x.text)}"><button data-nice-delshop="${x.id}" class="nice-x">×</button></div>`).join('')||'<div class="nice-empty-state"><span>✓</span><strong>Compra al día</strong><p>No tienes nada pendiente.</p></div>';
 const quickFromPantry=nice.pantry.filter(p=>!shoppingHas(p.text)).slice(0,12);
 const filteredPantry=nice.pantry.filter(x=>{if(pantrySearch&&!norm(x.text).includes(norm(pantrySearch)))return false;if(pantryFilter==='low'&&!x.low)return false;if(pantryFilter==='shopping'&&!shoppingHas(x.text))return false;return true});
 const pantry=filteredPantry.map(x=>`<div class="nice-pantry-card"><div class="nice-pantry-name"><input class="nice-edit-item nice-pantry-edit" data-edit-pantry="${x.id}" value="${esc(x.text)}"><div class="nice-stock-tags">${x.low?'<span class="low">Queda poco</span>':'<span>En casa</span>'}${shoppingHas(x.text)?'<span class="buying">En compra</span>':''}</div></div><div class="nice-step"><button data-nice-minus="${x.id}">−</button><b>${x.count||1}</b><button data-nice-plus="${x.id}">＋</button></div><button data-nice-low="${x.id}" class="nice-soft ${x.low?'active':''}">${x.low?'✓ Poco':'Poco'}</button><button data-nice-more="${x.id}" class="nice-cart" ${shoppingHas(x.text)?'disabled':''}>${shoppingHas(x.text)?'✓':'🛒'}</button><button data-nice-out="${x.id}" class="nice-out">Se acabó</button></div>`).join('')||'<p class="nice-empty">No hay productos con este filtro.</p>';
 const days=active.map((d,i)=>`<article class="nice-day"><div class="nice-day-head"><div><strong>${d.name}</strong><span>${(()=>{const dt=monday(nice.weekOffset||0);dt.setDate(dt.getDate()+i);return dt.getDate()})()}</span></div></div>${mealCard(d,i,'lunch','Comida')}${mealCard(d,i,'dinner','Cena')}<input class="nice-note" data-nice-note="${i}" value="${esc(d.note||'')}" placeholder="Nota rápida…"></article>`).join('');
 const recipes=nice.recipes.filter(r=>!recipeSearch||norm(r.name).includes(norm(recipeSearch))||r.ingredients.some(i=>norm(i.name).includes(norm(recipeSearch))));
 sec.innerHTML=`<datalist id="nice-recipes-list">${nice.recipes.map(r=>`<option value="${esc(r.name)}"></option>`).join('')}</datalist><div class="nice-head"><div><p class="eyebrow">MARTA · NIZA 🇫🇷</p><h2>Mi vida en Niza</h2><p>Tu cocina, tu despensa y tus ideas en un solo sitio.</p></div><span class="nice-date">Sep 2026 — Mar 2027</span></div>
 <div class="nice-overview"><div><strong>${nice.shopping.length}</strong><span>por comprar</span></div><div><strong>${nice.pantry.length}</strong><span>en despensa</span></div><div><strong>${plannedCount()}/14</strong><span>comidas planeadas</span></div></div>
 <div class="nice-tabs"><button data-nice-tab="shopping" class="${tab==='shopping'?'active':''}">🛒 Compra</button><button data-nice-tab="pantry" class="${tab==='pantry'?'active':''}">🥫 Despensa</button><button data-nice-tab="planning" class="${tab==='planning'?'active':''}">🍽 Planning</button><button data-nice-tab="recipes" class="${tab==='recipes'?'active':''}">♡ Recetas</button></div>
 <div class="nice-panel">${tab==='shopping'? `<div class="nice-title"><div><p class="eyebrow">LISTA DE LA COMPRA</p><h3>Comprar sin pensar de más</h3></div><span>${nice.shopping.length} pendiente${nice.shopping.length===1?'':'s'}</span></div><div class="nice-add prominent"><input id="nice-new-shop" placeholder="Añadir producto…"><button id="nice-add-shop">＋ Añadir</button></div>${quickFromPantry.length?`<div class="nice-quick"><span>Añadir desde despensa</span><div>${quickFromPantry.map(p=>`<button data-nice-quick-shop="${p.id}">＋ ${esc(p.text)}</button>`).join('')}</div></div>`:''}<div class="nice-shop-list">${shop}</div>`:
 tab==='pantry'? `<div class="nice-title"><div><p class="eyebrow">DESPENSA DE NIZA</p><h3>Lo que tienes ahora mismo</h3></div><div class="nice-title-actions"><span>${nice.pantry.length} productos</span><button id="nice-export-pantry" class="nice-export">⇩ Exportar PDF</button></div></div><div class="nice-pantry-tools"><input id="nice-pantry-search" value="${esc(pantrySearch)}" placeholder="Buscar…"><div class="nice-filter"><button data-pfilter="all" class="${pantryFilter==='all'?'active':''}">Todo</button><button data-pfilter="low" class="${pantryFilter==='low'?'active':''}">Queda poco</button><button data-pfilter="shopping" class="${pantryFilter==='shopping'?'active':''}">En compra</button></div></div><div class="nice-pantry-list">${pantry}</div><div class="nice-add"><input id="nice-new-pantry" placeholder="Añadir producto…"><button id="nice-add-pantry">＋ Añadir</button></div>`:
 tab==='planning'? `<div class="nice-planning-head"><div><p class="eyebrow">PLANNING SEMANAL</p><h3>Tu semana, de un vistazo</h3><p>Escribe rápido o elige una receta: si la reconoce, añade sus ingredientes sola.</p></div><div class="nice-week"><button id="nice-prev">←</button><strong>${weekLabel()}</strong><button id="nice-next">→</button></div></div><div class="nice-days">${days}</div>`:
 `<div class="nice-recipes-head"><div><p class="eyebrow">MIS RECETAS</p><h3>Ideas que no quieres perder</h3><p>Cuando uses el mismo nombre en el planning, sus ingredientes se cargarán automáticamente.</p></div><input id="nice-recipe-search" value="${esc(recipeSearch)}" placeholder="Buscar receta o ingrediente…"></div><details class="nice-new-recipe"><summary>＋ Guardar nueva receta</summary><div class="nice-recipe-form"><input id="nice-recipe-name" placeholder="Nombre de la receta"><input id="nice-recipe-ingredients" placeholder="Ingredientes separados por comas"><textarea id="nice-recipe-note" placeholder="Nota, preparación o idea (opcional)"></textarea><button id="nice-add-recipe">Guardar receta</button></div></details><div class="nice-recipe-grid">${recipes.map(recipeCard).join('')||'<p class="nice-empty">No hay recetas que coincidan.</p>'}</div>`}
 </div>`;
 bind();requestAnimationFrame(()=>{window.scrollTo(0,pageY);const d=sec.querySelector('.nice-days');if(d)d.scrollLeft=oldScroll});
}
function exportPantryPDF(){const date=new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'long',year:'numeric'}).format(new Date()),rows=nice.pantry.map(x=>`<tr><td>${esc(x.text)}</td><td>${x.count||1}</td><td>${x.low?'Queda poco':'Disponible'}${shoppingHas(x.text)?' · En compra':''}</td></tr>`).join(''),html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Despensa de Niza · Marta</title><style>@page{size:A4;margin:18mm}body{font-family:Arial;color:#293126}h1{font-family:Georgia,serif}.note{background:#f3f6f0;border:1px solid #dbe3d6;border-radius:12px;padding:12px 14px;margin:18px 0}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:9px 7px;border-bottom:1px solid #e5e8e1;font-size:11px}th{font-size:9px;text-transform:uppercase}</style></head><body><h1>Despensa de Niza</h1><p>Marta · Actualizada a ${date}</p><div class="note"><strong>Contexto para el planning</strong><p>Es inventario disponible: no hay que usarlo todo ni acabar productos enteros. Se pueden usar cantidades parciales y solo lo necesario.</p></div><table><thead><tr><th>Producto</th><th>Cantidad</th><th>Estado</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;const frame=document.createElement('iframe');Object.assign(frame.style,{position:'fixed',right:'0',bottom:'0',width:'1px',height:'1px',border:'0',opacity:'0'});document.body.appendChild(frame);const doc=frame.contentWindow.document;doc.open();doc.write(html);doc.close();setTimeout(()=>{frame.contentWindow.focus();frame.contentWindow.print();setTimeout(()=>frame.remove(),1500)},200)}
function addShoppingText(text){text=text.trim();if(!text||shoppingHas(text))return false;nice.shopping.push({id:uid(),text});return true}
function addIngredient(dayIndex,kind,name){name=name.trim();if(!name)return false;const arr=nice.weeks[key()][dayIndex][kind+'Ingredients'];if(arr.some(i=>norm(i.name)===norm(name)))return false;arr.push({id:uid(),name});return true}
function bind(){
 document.querySelectorAll('[data-nice-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.niceTab;localStorage.setItem('nice-tab',tab);ingredientOpen='';renderNice()});
 const addShop=document.getElementById('nice-add-shop');if(addShop){const fn=()=>{const i=document.getElementById('nice-new-shop');if(addShoppingText(i.value))save()};addShop.onclick=fn;document.getElementById('nice-new-shop').onkeydown=e=>{if(e.key==='Enter')fn()}}
 document.querySelectorAll('[data-nice-quick-shop]').forEach(b=>b.onclick=()=>{const p=nice.pantry.find(x=>x.id===b.dataset.niceQuickShop);if(p&&addShoppingText(p.text))save()});
 const addPantry=document.getElementById('nice-add-pantry');if(addPantry){const fn=()=>{const i=document.getElementById('nice-new-pantry'),text=i.value.trim();if(!text)return;const ex=pantryHas(text);if(ex)ex.count=(ex.count||1)+1;else nice.pantry.push({id:uid(),text,count:1,low:false});save()};addPantry.onclick=fn;document.getElementById('nice-new-pantry').onkeydown=e=>{if(e.key==='Enter')fn()}}
 document.querySelectorAll('[data-nice-bought]').forEach(b=>b.onclick=()=>{const x=nice.shopping.find(y=>y.id===b.dataset.niceBought);if(!x)return;nice.shopping=nice.shopping.filter(y=>y.id!==x.id);const ex=pantryHas(x.text);if(ex){ex.count=(ex.count||1)+1;ex.low=false}else nice.pantry.push({id:uid(),text:x.text,count:1,low:false});save()});
 document.querySelectorAll('[data-nice-delshop]').forEach(b=>b.onclick=()=>{nice.shopping=nice.shopping.filter(x=>x.id!==b.dataset.niceDelshop);save()});
 document.querySelectorAll('[data-edit-shop]').forEach(inp=>inp.onchange=()=>{const x=nice.shopping.find(y=>y.id===inp.dataset.editShop),v=inp.value.trim();if(!x||!v||x.text===v)return;x.text=v;save()});
 document.querySelectorAll('[data-edit-pantry]').forEach(inp=>inp.onchange=()=>{const x=nice.pantry.find(y=>y.id===inp.dataset.editPantry),v=inp.value.trim();if(!x||!v||x.text===v)return;const old=norm(x.text);x.text=v;for(const [k,a] of Object.entries(nice.aliases||{}))if(norm(a)===old)nice.aliases[k]=v;save()});
 document.querySelectorAll('[data-nice-minus]').forEach(b=>b.onclick=()=>{const x=nice.pantry.find(y=>y.id===b.dataset.niceMinus);if(!x)return;x.count=(x.count||1)-1;if(x.count<=0){nice.pantry=nice.pantry.filter(y=>y.id!==x.id);addShoppingText(x.text)}save()});
 document.querySelectorAll('[data-nice-plus]').forEach(b=>b.onclick=()=>{const x=nice.pantry.find(y=>y.id===b.dataset.nicePlus);if(x){x.count=(x.count||1)+1;x.low=false;save()}});
 document.querySelectorAll('[data-nice-low]').forEach(b=>b.onclick=()=>{const x=nice.pantry.find(y=>y.id===b.dataset.niceLow);if(x){x.low=!x.low;save()}});
 document.querySelectorAll('[data-nice-more]').forEach(b=>b.onclick=()=>{const x=nice.pantry.find(y=>y.id===b.dataset.niceMore);if(x&&addShoppingText(x.text))save()});
 document.querySelectorAll('[data-nice-out]').forEach(b=>b.onclick=()=>{const x=nice.pantry.find(y=>y.id===b.dataset.niceOut);if(!x)return;nice.pantry=nice.pantry.filter(y=>y.id!==x.id);addShoppingText(x.text);save()});
 document.getElementById('nice-export-pantry')?.addEventListener('click',exportPantryPDF);
 const ps=document.getElementById('nice-pantry-search');if(ps)ps.oninput=()=>{pantrySearch=ps.value;renderNice()};document.querySelectorAll('[data-pfilter]').forEach(b=>b.onclick=()=>{pantryFilter=b.dataset.pfilter;renderNice()});
 document.getElementById('nice-prev')?.addEventListener('click',()=>{nice.weekOffset=(nice.weekOffset||0)-1;ingredientOpen='';ensureWeek(key());save()});
 document.getElementById('nice-next')?.addEventListener('click',()=>{nice.weekOffset=(nice.weekOffset||0)+1;ingredientOpen='';ensureWeek(key());save()});
 document.querySelectorAll('[data-nice-meal]').forEach(i=>i.onchange=()=>{const [d,k]=i.dataset.niceMeal.split(':'),day=nice.weeks[key()][+d],val=i.value.trim(),rec=recipeByName(val);day[k]=val;if(rec)day[k+'Ingredients']=normalizeIngs(rec.ingredients);save()});
 document.querySelectorAll('[data-nice-note]').forEach(i=>i.onchange=()=>{nice.weeks[key()][+i.dataset.niceNote].note=i.value;save({rerender:false})});
 document.querySelectorAll('[data-toggle-ing]').forEach(b=>b.onclick=()=>{ingredientOpen=ingredientOpen===b.dataset.toggleIng?'':b.dataset.toggleIng;renderNice()});
 document.querySelectorAll('[data-close-ing]').forEach(b=>b.onclick=()=>{ingredientOpen='';renderNice()});
 document.querySelectorAll('[data-add-ing-pantry]').forEach(b=>b.onclick=()=>{const [d,k]=b.dataset.addIngPantry.split(':');if(addIngredient(+d,k,b.dataset.ingName))save()});
 document.querySelectorAll('[data-del-ing]').forEach(b=>b.onclick=()=>{const [d,k]=b.dataset.delIng.split(':');nice.weeks[key()][+d][k+'Ingredients']=nice.weeks[key()][+d][k+'Ingredients'].filter(i=>norm(i.name)!==norm(b.dataset.ingName));save()});
 document.querySelectorAll('[data-add-ing]').forEach(b=>b.onclick=()=>{const [d,k]=b.dataset.addIng.split(':'),inp=document.querySelector(`[data-ing-input="${b.dataset.addIng}"]`);if(inp&&addIngredient(+d,k,inp.value))save()});
 document.querySelectorAll('[data-ing-input]').forEach(inp=>inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();document.querySelector(`[data-add-ing="${inp.dataset.ingInput}"]`)?.click()}});
 document.querySelectorAll('[data-edit-ing]').forEach(inp=>inp.onchange=()=>{const [d,k]=inp.dataset.editIng.split(':'),arr=nice.weeks[key()][+d][k+'Ingredients'],ing=arr.find(x=>norm(x.name)===norm(inp.dataset.oldIng)),v=inp.value.trim();if(!ing||!v||ing.name===v)return;ing.name=v;save()});
 document.querySelectorAll('[data-buy-ing]').forEach(b=>b.onclick=()=>{if(addShoppingText(b.dataset.buyIng))save()});
 document.querySelectorAll('[data-open-relate]').forEach(b=>b.onclick=()=>{const box=b.closest('.nice-ing-row')?.querySelector('.nice-relate-box');if(box)box.hidden=!box.hidden});
 document.querySelectorAll('[data-relate-save]').forEach(b=>b.onclick=()=>{const row=b.closest('.nice-ing-row'),sel=row?.querySelector('[data-relate-select]'),p=nice.pantry.find(x=>x.id===sel?.value);if(!p)return;relateIngredient(b.dataset.ingName,p);save()});
 document.querySelectorAll('[data-add-missing]').forEach(b=>b.onclick=()=>{const [d,k]=b.dataset.addMissing.split(':'),day=nice.weeks[key()][+d];let changed=false;for(const ing of missingForMeal(day,k))if(addShoppingText(ing.name))changed=true;if(changed)save()});
 document.querySelectorAll('[data-save-from-meal]').forEach(b=>b.onclick=()=>{const [d,k]=b.dataset.saveFromMeal.split(':'),day=nice.weeks[key()][+d],name=day[k];if(!name||recipeByName(name))return;nice.recipes.unshift({id:uid(),name,ingredients:normalizeIngs(day[k+'Ingredients']),note:'',seed:false});save()});
 const rs=document.getElementById('nice-recipe-search');if(rs)rs.oninput=()=>{recipeSearch=rs.value;renderNice()};
 const addRecipe=document.getElementById('nice-add-recipe');if(addRecipe)addRecipe.onclick=()=>{const n=document.getElementById('nice-recipe-name').value.trim(),raw=document.getElementById('nice-recipe-ingredients').value,nt=document.getElementById('nice-recipe-note').value.trim();if(!n||recipeByName(n))return;const ingredients=raw.split(',').map(x=>x.trim()).filter(Boolean).map(name=>({id:uid(),name}));nice.recipes.unshift({id:uid(),name:n,ingredients,note:nt,seed:false});save()};
 document.querySelectorAll('[data-del-recipe]').forEach(b=>b.onclick=()=>{nice.recipes=nice.recipes.filter(r=>r.id!==b.dataset.delRecipe);save()});
}
let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(mount,80)}).observe(root(),{childList:true,subtree:true});mount();
})();