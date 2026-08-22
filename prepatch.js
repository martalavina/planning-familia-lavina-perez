const seededMeals=new Set([
  'Café, fruta y tostadas','Yogur con fruta','Tostadas y café','Avena con fruta','Café y tostadas','Desayuno libre','Desayuno tranquilo',
  'Pollo con arroz y verduras','Pasta con tomate y atún','Lentejas','Ensalada completa','Arroz con verduras','Comida familiar','Asado / comida familiar',
  'Tortilla y ensalada','Crema de verduras','Pescado con verduras','Wraps de pollo','Pizza casera','Cena libre','Cena ligera'
]);
const originalFetch=window.fetch.bind(window);
function cleanPlanner(data){
  if(!data||!Array.isArray(data.days))return data;
  return {...data,days:data.days.map(d=>{
    const next={...d};
    for(const key of ['breakfast','lunch','dinner']){
      const meal=next[key];
      if(!meal)continue;
      next[key]={...meal};
      if(key==='breakfast'||seededMeals.has(String(meal.text||'').trim()))next[key].text='';
    }
    return next;
  })};
}
window.fetch=async function(input,init={}){
  const url=typeof input==='string'?input:(input?.url||'');
  const method=(init?.method||'GET').toUpperCase();
  let nextInit=init;
  if(url.includes('/api/planner')&&method==='PUT'&&typeof init?.body==='string'){
    try{nextInit={...init,body:JSON.stringify(cleanPlanner(JSON.parse(init.body)))};}catch{}
  }
  const res=await originalFetch(input,nextInit);
  if(url.includes('/api/planner')&&method==='GET'&&res.ok){
    try{
      const data=cleanPlanner(await res.clone().json());
      const headers=new Headers(res.headers);headers.set('Content-Type','application/json; charset=utf-8');
      return new Response(JSON.stringify(data),{status:res.status,statusText:res.statusText,headers});
    }catch{}
  }
  return res;
};
