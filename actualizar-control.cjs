// Guarda el índice y las secciones en el HTML para que sean visibles sin peticiones.
const fs=require('node:fs'),path=require('node:path');
const root=__dirname;
const course=JSON.parse(fs.readFileSync(path.join(root,'data/cursos/control-clasico.json'),'utf8'));
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const topics=course.topics;
if(topics.length!==6||new Set(topics.map(t=>t.id)).size!==6||topics.some(t=>!/^[-a-z0-9]+$/.test(t.id)))throw Error('Se requieren seis temas con identificadores únicos.');
const index='<nav id="indice-temas" class="topic-index" aria-label="Temas de Control Clásico"><p class="eyebrow">TEMAS PRINCIPALES</p><ol>'+topics.map(t=>'<li><a href="#'+esc(t.id)+'">'+esc(t.title)+'</a></li>').join('')+'</ol></nav>';
const sections='<div class="topic-sections">'+topics.map((t,i)=>'<section class="topic-section" id="'+esc(t.id)+'" aria-labelledby="titulo-'+esc(t.id)+'"><p class="eyebrow">TEMA '+String(i+1).padStart(2,'0')+'</p><h2 id="titulo-'+esc(t.id)+'">'+esc(t.title)+'</h2>'+(t.text?'<p class="topic-text">'+esc(t.text)+'</p>':'<p class="topic-pending">Contenido por incorporar.</p>')+'<a class="back-link" href="#indice-temas">↑ Volver a los temas</a></section>').join('')+'</div>';
const main='<div class="shell section control-course"><a class="back-link" href="../index.html#asignaturas">← Todas las asignaturas</a><div class="page-intro"><p class="eyebrow">CONTROL / ASIGNATURA 03</p><h1>Control Clásico</h1><p class="lead">Selecciona un tema para ir a su sección.</p></div>'+index+sections+'</div>';
const target=path.join(root,'cursos/control-clasico.html');
let html=fs.readFileSync(target,'utf8').replace(/<main id="contenido">[\s\S]*?<\/main>/,'<main id="contenido">'+main+'</main>');
html=html.replace('href="../css/cursos.css"','href="../css/cursos.css?v=temas-1"');
fs.writeFileSync(target,html);console.log('Control Clásico: índice de seis temas actualizado.');
