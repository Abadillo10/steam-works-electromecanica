import {courses} from './cursos.js';
import {news} from './noticias.js';
import {read,el,error,url} from './utils.js';
// Los enlaces y las imágenes solo admiten direcciones web o rutas del sitio.
function safeAddress(value){try{const address=new URL(value,url(''));return ['http:','https:'].includes(address.protocol)?address.href:null;}catch{return null;}}
function resources(card,links=[]){for(const resource of links){const href=safeAddress(resource.url);if(!href)continue;const a=el('a','text-link',resource.label||'Consultar documento ↗');a.href=href;card.append(a);}}
async function collections(){
 const projects=document.getElementById('project-grid');
 if(projects)try{(await read('data/proyectos.json')).forEach(p=>{
  const card=el('article','project-card');
  if(p.image&&safeAddress(p.image)){const image=el('img','project-image');image.src=safeAddress(p.image);image.alt=p.title;image.loading='lazy';card.append(image);}else card.append(el('div','project-art',p.number));
  card.append(el('span','badge',p.review?'Proyecto de tesis':'Reseña pendiente'),el('h2','',p.title),el('p','',p.review||p.description));
  if(p.technologies?.length)card.append(el('p','muted','Tecnologías: '+p.technologies.join(', ')));
  if(p.participants?.length)card.append(el('p','muted','Participantes: '+p.participants.join(', ')));
  resources(card,p.links);projects.append(card);
 });}catch(e){error(projects,e);}
 const teachers=document.getElementById('teacher-grid');
 if(teachers)try{(await read('data/docentes.json')).forEach(t=>{
  const card=el('article','teacher-card');
  if(t.image&&safeAddress(t.image)){const image=el('img','avatar');image.src=safeAddress(t.image);image.alt=t.name;card.append(image);}else card.append(el('div','avatar','SW'));
  card.append(el('span','eyebrow','EQUIPO ACADÉMICO'),el('h2','',t.name),el('p','',t.specialty));
  if(t.email&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.email)){const a=el('a','text-link',t.email);a.href='mailto:'+t.email;card.append(a);}else card.append(el('p','muted','Correo institucional pendiente.'));
  resources(card,t.links);teachers.append(card);
 });}catch(e){error(teachers,e);}
}
await Promise.allSettled([courses(),news(),collections()]);
