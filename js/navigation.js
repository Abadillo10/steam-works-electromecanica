import {url,read,link,error} from './utils.js';
export async function navigation(){
 await Promise.all(['navbar','footer'].map(async name=>{const target=document.getElementById(name==='navbar'?'site-header':'site-footer');try {const r=await fetch(url('componentes/'+name+'.html'));if(!r.ok)throw new Error(name);target.innerHTML=await r.text();target.querySelectorAll('[data-path]').forEach(a=>a.href=url(a.dataset.path));target.querySelectorAll('[data-asset]').forEach(a=>a.src=url(a.dataset.asset));}catch(e){error(target,e);}}));
 const button=document.getElementById('courses-toggle'), menu=document.getElementById('courses-menu');if(!button)return;
 const courses=await read('data/cursos.json'); const links=document.getElementById('course-links'); courses.forEach(c=>links.append(link(c.title,'cursos/'+c.slug+'.html')));
 const wrap=button.closest('.course-menu'); const items=[...links.querySelectorAll('a')];
 function set(open){button.setAttribute('aria-expanded',String(open));menu.hidden=!open;}
 button.addEventListener('click',()=>set(menu.hidden));
 wrap.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&matchMedia('(hover: hover)').matches)set(true);});
 wrap.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&!wrap.contains(document.activeElement))set(false);});
 wrap.addEventListener('focusout',e=>{if(!wrap.contains(e.relatedTarget))set(false);});
 document.addEventListener('pointerdown',e=>{if(!wrap.contains(e.target))set(false);});
 wrap.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();set(false);button.focus();}else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();set(true);let i=items.indexOf(document.activeElement);i=e.key==='ArrowDown'?(i+1)%items.length:(i<=0?items.length-1:i-1);items[i].focus();}else if(!menu.hidden&&(e.key==='Home'||e.key==='End')){e.preventDefault();items[e.key==='Home'?0:items.length-1].focus();}});
 document.querySelectorAll('nav a').forEach(a=>{if(new URL(a.href).pathname===location.pathname)a.setAttribute('aria-current','page');});
}
