const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
class Element {
 constructor(){this.value='';this.textContent='';this.children=[];this.attributes={};this.events={};}
 setAttribute(key,val){this.attributes[key]=val;}
 removeAttribute(key){delete this.attributes[key];}
 append(...nodes){this.children.push(...nodes);}
 replaceChildren(...nodes){this.children=nodes;}
 addEventListener(type,callback){this.events[type]=callback;}
}
function fixture(kind){
 const elements=Object.fromEntries(['number','range','results','steps','status','bar','bar-label','reset'].map(key=>[key,new Element()]));
 elements.number.min=kind==='barril'?'400':'1';elements.number.max=kind==='barril'?'1400':'12';
 elements.number.value=kind==='barril'?String(1390/0.159/9.81):'6';
 return {dataset:{experiment:kind},elements,querySelector(selector){return elements[selector.slice(6,-1)];}};
}
const barrel=fixture('barril'),oil=fixture('aceite');
const document={querySelectorAll:()=>[barrel,oil],createElement:()=>new Element()};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/experimentos-fluidos.js'),'utf8'),{document,Intl,Number});
function result(root,name){const row=root.elements.results.children.find(row=>row.children[0].textContent===name);return Number(row.children[1].textContent.replaceAll(',',''));}
function near(a,b){assert(Math.abs(a-b)<0.0011,`${a} != ${b}`);}
near(result(barrel,'Peso total con recipiente'),1500);
barrel.elements.number.value='1000';barrel.elements.number.events.input();
near(result(barrel,'Masa del aceite'),159);near(result(barrel,'Peso del aceite'),1559.79);near(result(barrel,'Peso total con recipiente'),1669.79);
barrel.elements.range.value='1200';barrel.elements.range.events.input();near(result(barrel,'Densidad'),1200);near(result(barrel,'Volumen'),0.159);
for(const invalid of ['', '0', 'Infinity', '1401']){barrel.elements.number.value=invalid;barrel.elements.number.events.input();assert.equal(barrel.elements.results.children.length,0);assert.equal(barrel.elements.number.attributes['aria-invalid'],'true');}
barrel.elements.reset.events.click();near(result(barrel,'Peso total con recipiente'),1500);assert(!('aria-invalid' in barrel.elements.number.attributes));
oil.elements.number.value='3';oil.elements.number.events.input();near(result(oil,'Peso del aceite'),47000);near(result(oil,'Peso específico'),47000/3);near(result(oil,'Densidad'),47000/9.81/3);
oil.elements.range.value='12';oil.elements.range.events.input();near(result(oil,'Densidad'),47000/9.81/12);near(result(oil,'Masa del aceite'),47000/9.81);
oil.elements.number.value='13';oil.elements.number.events.input();assert.equal(oil.elements.results.children.length,0);
oil.elements.reset.events.click();near(result(oil,'Volumen'),6);near(result(oil,'Densidad'),47000/9.81/6);
const html=fs.readFileSync(path.join(__dirname,'../cursos/mecanica-de-fluidos-unidad-1.html'),'utf8');
assert.equal((html.match(/data-experiment=/g)||[]).length,2);
assert(html.includes('js/experimentos-fluidos.js?v=1'));assert(html.includes('css/experimentos-fluidos.css?v=1'));
console.log('Correcto: dos experimentos, entradas numéricas, deslizadores, constantes, cálculos, errores y restablecimiento.');
