// Reutiliza las plantillas compartidas al guardar las páginas; no requiere un servidor.
const fs=require('node:fs'),path=require('node:path');
const root=__dirname;
const courses=JSON.parse(fs.readFileSync(path.join(root,'data/cursos.json'),'utf8'));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const navbar=fs.readFileSync(path.join(root,'componentes/navbar.html'),'utf8').trim();
const footer=fs.readFileSync(path.join(root,'componentes/footer.html'),'utf8').trim();
function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory()){if(!['componentes','node_modules','.git'].includes(item.name))walk(file);}else if(item.name.endsWith('.html')){
 const base=path.relative(path.dirname(file),root).replaceAll('\\','/')||'.';
 const local=p=>base+'/'+p;
 const render=template=>template.replace(/data-path="([^"]+)"/g,(_,p)=>'data-path="'+p+'" href="'+local(p)+'"').replace(/data-asset="([^"]+)"/g,(_,p)=>'data-asset="'+p+'" src="'+local(p)+'"');
 const nav=render(navbar).replace('<div id="course-links"></div>','<div id="course-links">'+courses.map(c=>'<a href="'+local('cursos/'+c.slug+'.html')+'">'+escape(c.title)+'</a>').join('')+'</div>');
 let html=fs.readFileSync(file,'utf8').replace(/<header id="site-header">[\s\S]*?<\/header>/,'<header id="site-header">'+nav+'</header>').replace(/<footer id="site-footer">[\s\S]*?<\/footer>/,'<footer id="site-footer">'+render(footer)+'</footer>');
 if(!html.includes('navigation-ui.js'))html=html.replace('</head>','<script defer src="'+local('js/navigation-ui.js')+'"></script></head>');
 html=html.replace('Activa JavaScript para cargar los componentes y los contenidos académicos.','Activa JavaScript para consultar los contenidos académicos. El menú y sus enlaces permanecen disponibles.');
 fs.writeFileSync(file,html);
}}}walk(root);console.log('Navegación y pie guardados en las 14 páginas.');
