import { COOKIE, token, json } from './_lib.js';
export default async function handler(req,res){
  if(req.method!=='POST')return json(res,405,{error:'Método no permitido'});
  let body=req.body||{}; if(typeof body==='string'){try{body=JSON.parse(body)}catch{body={}}}
  if(!process.env.APP_PASSWORD)return json(res,500,{error:'Falta configurar APP_PASSWORD en Vercel.'});
  if(body.password!==process.env.APP_PASSWORD)return json(res,401,{error:'Contraseña incorrecta.'});
  const secure=process.env.VERCEL?' Secure;':'';
  res.setHeader('Set-Cookie',`${COOKIE}=${encodeURIComponent(token())}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000;${secure}`);
  return json(res,200,{ok:true});
}
