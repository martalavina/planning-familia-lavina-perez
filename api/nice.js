import { valid, json, db } from './_lib.js';

const emptyDays=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].map(name=>({name,lunch:'',dinner:'',note:''}));
const defaultNice={shopping:[],pantry:[],weeks:{},weekOffset:0,updatedAt:null};

export default async function handler(req,res){
  if(!valid(req))return json(res,401,{error:'No autorizado'});
  try{
    if(req.method==='GET'){
      const rows=await db('planner_state?id=eq.nice_marta&select=state');
      if(rows?.[0]?.state)return json(res,200,rows[0].state);
      const state={...defaultNice,weeks:{}};
      await db('planner_state',{method:'POST',body:JSON.stringify({id:'nice_marta',state})});
      return json(res,200,state);
    }
    if(req.method==='PUT'){
      let state=req.body;if(typeof state==='string')state=JSON.parse(state);
      if(!state||!Array.isArray(state.shopping)||!Array.isArray(state.pantry)||typeof state.weeks!=='object')return json(res,400,{error:'Datos no válidos'});
      const next={...state,updatedAt:new Date().toISOString()};
      const rows=await db('planner_state?id=eq.nice_marta&select=id');
      if(rows?.length)await db('planner_state?id=eq.nice_marta',{method:'PATCH',body:JSON.stringify({state:next,updated_at:next.updatedAt})});
      else await db('planner_state',{method:'POST',body:JSON.stringify({id:'nice_marta',state:next,updated_at:next.updatedAt})});
      return json(res,200,next);
    }
    return json(res,405,{error:'Método no permitido'});
  }catch(e){return json(res,500,{error:e.message});}
}

export { emptyDays };
