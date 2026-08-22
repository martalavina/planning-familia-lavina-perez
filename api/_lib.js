import crypto from 'node:crypto';

export const COOKIE = 'family_planner_session';
export function token(){
  const payload='family-planner:v1';
  const secret=process.env.SESSION_SECRET||'dev-only-change-me';
  const sig=crypto.createHmac('sha256',secret).update(payload).digest('hex');
  return `${payload}.${sig}`;
}
export function valid(req){
  const raw=req.headers.cookie||'';
  const match=raw.split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='));
  if(!match)return false;
  const got=decodeURIComponent(match.slice(COOKIE.length+1));
  const exp=token();
  const a=Buffer.from(got),b=Buffer.from(exp);
  return a.length===b.length&&crypto.timingSafeEqual(a,b);
}
export function json(res,status,data){res.status(status).setHeader('Content-Type','application/json; charset=utf-8').send(JSON.stringify(data));}
export async function db(path,options={}){
  const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)throw new Error('Falta configurar Supabase en Vercel.');
  const r=await fetch(`${url}/rest/v1/${path}`,{...options,headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'return=representation',...(options.headers||{})}});
  if(!r.ok)throw new Error(`Supabase ${r.status}: ${await r.text()}`);
  const t=await r.text();return t?JSON.parse(t):null;
}
export const defaultState={version:1,weekOffset:0,days:['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].map(name=>({name,breakfast:{text:'',done:false},lunch:{text:'',done:false},dinner:{text:'',done:false},note:''})),shopping:[{id:'1',text:'Leche',done:false},{id:'2',text:'Huevos',done:false},{id:'3',text:'Fruta',done:false},{id:'4',text:'Verduras',done:false}],pantry:[{id:'p1',text:'Leche',category:'Nevera',quantity:'2 bricks',level:'ok'},{id:'p2',text:'Huevos',category:'Nevera',quantity:'6',level:'low'},{id:'p3',text:'Arroz',category:'Despensa',quantity:'1 paquete',level:'ok'},{id:'p4',text:'Café',category:'Despensa',quantity:'',level:'out'},{id:'p5',text:'Pollo',category:'Congelador',quantity:'2 raciones',level:'ok'}],updatedAt:null,updatedBy:'Familia Laviña Pérez'};
