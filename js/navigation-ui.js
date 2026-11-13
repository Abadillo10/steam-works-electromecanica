// Menú independiente de los módulos y de las peticiones de datos.
// La navegación y sus diez enlaces ya están presentes en el HTML.
(() => {
 const button=document.getElementById('courses-toggle');
 const menu=document.getElementById('courses-menu');
 if(!button||!menu)return;
 const wrap=button.closest('.course-menu');
 const items=Array.from(menu.querySelectorAll('a'));
 const set=open=>{button.setAttribute('aria-expanded',String(open));menu.hidden=!open;};
 button.addEventListener('click',()=>set(menu.hidden));
 wrap.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&matchMedia('(hover: hover)').matches)set(true);});
 wrap.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&!wrap.contains(document.activeElement))set(false);});
 wrap.addEventListener('focusout',e=>{if(!wrap.contains(e.relatedTarget))set(false);});
 document.addEventListener('pointerdown',e=>{if(!wrap.contains(e.target))set(false);});
 wrap.addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();set(false);button.focus();}
  else if(e.key==='ArrowDown'||e.key==='ArrowUp'){
   e.preventDefault();set(true);let i=items.indexOf(document.activeElement);
   i=e.key==='ArrowDown'?(i+1)%items.length:(i<=0?items.length-1:i-1);items[i].focus();
  }else if(!menu.hidden&&(e.key==='Home'||e.key==='End')){
   e.preventDefault();items[e.key==='Home'?0:items.length-1].focus();
  }
 });
 document.querySelectorAll('nav a').forEach(a=>{if(new URL(a.href).pathname===location.pathname)a.setAttribute('aria-current','page');});
})();
