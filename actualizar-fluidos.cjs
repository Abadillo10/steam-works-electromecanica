// Construye únicamente la estructura y los textos proporcionados por el docente.
const fs=require('node:fs'),path=require('node:path');
const root=__dirname;
const data=JSON.parse(fs.readFileSync(path.join(root,'data/cursos/mecanica-de-fluidos-unidad-1.json'),'utf8'));
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const target=path.join(root,'cursos/mecanica-de-fluidos-unidad-1.html');
const toc='<nav class="fluid-index" id="indice-unidad" aria-label="Índice de la Unidad 1"><p class="eyebrow">TEMARIO DE LA UNIDAD</p><ol>'+data.topics.map(t=>'<li><a href="#'+esc(t.id)+'">'+esc(t.number)+' · '+esc(t.title)+'</a></li>').join('')+'</ol></nav>';
const sections=data.topics.map(t=>'<section class="fluid-topic" id="'+esc(t.id)+'" aria-labelledby="titulo-'+esc(t.id)+'"><p class="eyebrow">SUBTEMA '+esc(t.number)+'</p><h2 id="titulo-'+esc(t.id)+'">'+esc(t.title)+'</h2>'+(t.paragraphs.length?t.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join(''):'<p class="muted">Contenido pendiente de incorporación.</p>')+'<a class="back-link" href="#indice-unidad">↑ Volver al índice</a></section>').join('');
const main='<article class="shell section"><a class="back-link" href="mecanica-de-fluidos.html">← Mecánica de Fluidos</a><div class="page-intro fluid-hero"><p class="eyebrow">MECÁNICA DE FLUIDOS / UNIDAD 1</p><h1>'+esc(data.title)+'</h1><p class="lead">El contenido de esta unidad se incorporará a partir del material del docente.</p></div>'+toc+sections+'</article>';
let html=fs.readFileSync(target,'utf8').replace(/<main id="contenido">[\s\S]*?<\/main>/,'<main id="contenido">'+main+'</main>');
fs.writeFileSync(target,html);
const overviewPath=path.join(root,'cursos/mecanica-de-fluidos.html');
let overview=fs.readFileSync(overviewPath,'utf8').replace('Conceptos, propiedades, fórmulas y ejemplos para comenzar.','Temario preparado. Contenido pendiente de incorporación.').replace('Estudiar la Unidad 1 →','Ver temario de la Unidad 1 →');
fs.writeFileSync(overviewPath,overview);
console.log('Unidad 1: solo índice y títulos; contenido pendiente.');
