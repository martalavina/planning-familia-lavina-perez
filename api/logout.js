import { COOKIE, json } from './_lib.js';
export default function handler(req,res){res.setHeader('Set-Cookie',`${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;`);return json(res,200,{ok:true});}
