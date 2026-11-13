// Comprobaciones locales de archivos, rutas HTTP y eventos del menú.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=__dirname,origin='http://127.0.0.1:8087/';
const files=[];function walk(dir){for(const f of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,f.name);if(f.isDirectory())walk(p);else files.push(p);}}walk(root);
(async()=>{
const offline=process.argv.includes('--archivos');
let checked=0;for(const file of files){if(!/\.(html|css|js|json|svg)$/.test(file))continue;const relative=path.relative(root,file).replaceAll('\\','/');if(!offline){const response=await fetch(origin+relative,{signal:AbortSignal.timeout(5000)});assert.equal(response.status,200,relative);}checked++;if(file.endsWith('.json'))JSON.parse(fs.readFileSync(file,'utf8'));if(file.endsWith('.html')){const html=fs.readFileSync(file,'utf8');for(const [,ref]of html.matchAll(/(?:href|src)="([^"#]+)"/g)){const target=new URL(ref,origin+relative);if(target.origin===new URL(origin).origin){const local=path.join(root,decodeURIComponent(target.pathname));assert(fs.existsSync(local),target.href);if(!offline)assert.equal((await fetch(target,{signal:AbortSignal.timeout(5000)})).status,200,target.href);}}}}
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/cursos.json')));assert.equal(catalog.length,10);for(const c of catalog){assert(fs.existsSync(path.join(root,'cursos',c.slug+'.html')));const course=JSON.parse(fs.readFileSync(path.join(root,'data/cursos',c.slug+'.json')));assert.equal((course.topics||course.sections).length,c.slug==='control-clasico'?6:9);}
for(const file of files.filter(f=>f.endsWith('.html')&&!f.includes(path.sep+'componentes'+path.sep))){const html=fs.readFileSync(file,'utf8');assert(html.includes('<nav aria-label="Navegación principal">'),file);assert.equal((html.match(/<a href="[^\"]*cursos\//g)||[]).length,10,file);assert(html.includes('navigation-ui.js'),file);}
class Element{constructor(){this.handlers={};this.attrs={};this.children=[];}addEventListener(name,fn){this.handlers[name]=fn;}fire(name,e={}){this.handlers[name]?.({preventDefault(){},...e});}setAttribute(k,v){this.attrs[k]=v;}append(x){this.children.push(x);}querySelectorAll(){return this.children;}contains(x){return x===this||x===button||items.includes(x);}focus(){document.activeElement=this;}}
const button=new Element(),menu=new Element(),wrap=new Element(),links=new Element(),header=new Element(),footer=new Element();menu.hidden=true;button.closest=()=>wrap;let items=links.children;
const document={activeElement:null,getElementById:id=>({'site-header':header,'site-footer':footer,'courses-toggle':button,'courses-menu':menu,'course-links':links}[id]),querySelectorAll:()=>[],handlers:{},addEventListener(name,fn){this.handlers[name]=fn;}};
header.querySelectorAll=footer.querySelectorAll=()=>[];
const context={document,url:p=>origin+p,read:async()=>catalog,link:()=>new Element(),error:(_,e)=>{throw e;},fetch:async()=>({ok:true,text:async()=>''}),matchMedia:()=>({matches:true}),location:{pathname:'/'},URL,console};
catalog.forEach(()=>links.append(new Element()));menu.querySelectorAll=()=>items;
vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'js/navigation-ui.js'),'utf8'),context);
assert.equal(items.length,10);wrap.fire('pointerenter',{pointerType:'mouse'});assert.equal(menu.hidden,false);wrap.fire('pointerleave',{pointerType:'mouse'});assert.equal(menu.hidden,true);
button.fire('click');assert.equal(menu.hidden,false);button.fire('click');assert.equal(menu.hidden,true);
button.focus();wrap.fire('keydown',{key:'ArrowDown'});assert.equal(document.activeElement,items[0]);assert.equal(menu.hidden,false);wrap.fire('keydown',{key:'End'});assert.equal(document.activeElement,items[9]);wrap.fire('keydown',{key:'ArrowDown'});assert.equal(document.activeElement,items[0]);wrap.fire('keydown',{key:'Escape'});assert.equal(menu.hidden,true);assert.equal(document.activeElement,button);
wrap.fire('pointerenter',{pointerType:'touch'});assert.equal(menu.hidden,true);button.fire('click');assert.equal(menu.hidden,false);document.handlers.pointerdown({target:new Element()});assert.equal(menu.hidden,true);
button.fire('click');wrap.fire('focusout',{relatedTarget:new Element()});assert.equal(menu.hidden,true);
console.log('CORRECTO: '+checked+' archivos '+(offline?'locales':'HTTP')+'; referencias HTML; JSON; 10 cursos; Control Clásico con 6 temas; eventos simulados de mouse, teclado y secuencia táctil.');
})().catch(e=>{console.error(e);process.exitCode=1;});
