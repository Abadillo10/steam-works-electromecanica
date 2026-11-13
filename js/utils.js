export const base = new URL('../', import.meta.url);
export const url = p => new URL(p, base).href;
export async function read(p) { const r=await fetch(url(p)); if(!r.ok) throw new Error('No se pudo cargar '+p); return r.json(); }
export function el(tag, cls, text) { const node=document.createElement(tag); if(cls)node.className=cls; if(text!==undefined)node.textContent=text; return node; }
export function error(target,e){console.error(e); if(target)target.replaceChildren(el('p','notice','No se pudo cargar el contenido. Comprueba que abriste el sitio mediante un servidor HTTP e intenta recargar.'));}
export function link(text,path,cls=''){const a=el('a',cls,text);a.href=url(path);return a;}
