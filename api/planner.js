import { valid, json, db, defaultState } from './_lib.js';
export default async function handler(req,res){
  if(!valid(req))return json(res,401,{error:'No autorizado'});
  try{
    if(req.method==='GET'){
      const rows=await db('planner_state?id=eq.family&select=state');
      if(rows?.[0]?.state)return json(res,200,rows[0].state);
      const state={...defaultState,updatedAt:new Date().toISOString()};
      await db('planner_state',{method:'POST',body:JSON.stringify({id:'family',state})});
      return json(res,200,state);
    }
    if(req.method==='PUT'){
      let state=req.body; if(typeof state==='string')state=JSON.parse(state);
      if(!state||!Array.isArray(state.days)||!Array.isArray(state.shopping))return json(res,400,{error:'Datos no válidos'});
      if(!Array.isArray(state.pantry))state.pantry=[];
      const next={...state,updatedAt:new Date().toISOString()};
      await db('planner_state?id=eq.family',{method:'PATCH',body:JSON.stringify({state:next,updated_at:next.updatedAt})});
      return json(res,200,next);
    }
    return json(res,405,{error:'Método no permitido'});
  }catch(e){return json(res,500,{error:e.message});}
}
