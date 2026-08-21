import { valid, json } from './_lib.js';
export default function handler(req,res){return json(res,200,{ok:valid(req)});}
