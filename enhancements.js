function normBuy(s){return String(s||'').trim().toLowerCase()}
function refreshPantryBuyButtons(){
  const shoppingNames=new Set([...document.querySelectorAll('[data-shoptext]')].map(x=>normBuy(x.value)));
  document.querySelectorAll('.pantryitem').forEach(row=>{
    const nameInput=row.querySelector('[data-pantrytext]');
    if(!nameInput)return;
    let btn=row.querySelector('.addbuy');
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.className='addbuy';
      btn.dataset.addbuy=nameInput.dataset.pantrytext||'';
      const ranout=row.querySelector('.ranout');
      row.insertBefore(btn,ranout||null);
    }
    const already=shoppingNames.has(normBuy(nameInput.value));
    btn.disabled=already;
    btn.textContent=already?'✓ En compra':'🛒 Comprar más';
    btn.title=already?'Ya está en la lista de la compra':'Añadir a la compra sin quitarlo de la despensa';
  });
}
const observer=new MutationObserver(()=>refreshPantryBuyButtons());
observer.observe(document.getElementById('app'),{childList:true,subtree:true});
refreshPantryBuyButtons();
document.addEventListener('click',e=>{
  const btn=e.target.closest('.addbuy');
  if(!btn||btn.disabled)return;
  const row=btn.closest('.pantryitem');
  const name=row?.querySelector('[data-pantrytext]')?.value?.trim();
  const input=document.getElementById('newItem');
  const add=document.getElementById('add');
  if(!name||!input||!add)return;
  e.preventDefault();e.stopPropagation();
  input.value=name;
  input.dispatchEvent(new Event('input',{bubbles:true}));
  add.click();
});
