import assert from 'node:assert/strict';import fs from 'node:fs';
import {G,manometer,wall,floating} from '../js/hidrostatica-modelo.mjs';
const near=(a,b,t=1e-8)=>assert(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} != ${b}`);
for(const rho of [850,1000,13600])for(const dp of [-3000,0,1000,3000]){const m=manometer({dp,rho});near(rho*G*(m.right-m.left),dp);near(m.left+m.right,0);if(dp>0)assert(m.left<m.right);}
near(wall({h:2.4,angle:90}).F,56505.6);near(wall({h:2.4,angle:90}).cp,.8);
const both=wall({h:2.4,right:1.4,angle:90});near(both.F,37278);near(2.4-both.cp,1.4280701754385965);
near(wall({h:2.4,right:1.4,angle:60}).F,37278/Math.sin(Math.PI/3));
const zero=wall({h:2.4,right:2.4,angle:60});near(zero.F,0);assert.equal(zero.cp,null);
// Verificación independiente por cuadratura del área del panel finito.
for(const angle of [30,45,60,90])for(const h of [.3,2.4,3.8])for(const right of [0,1.4,3.8]){
 const m=wall({h,right,angle});let force=0,moment=0;const N=20000,ds=4/N;
 for(let i=0;i<N;i++){const s=(i+.5)*ds,p=1000*G*(Math.max(0,h-s*m.s)-Math.max(0,right-s*m.s));force+=p*2*ds;moment+=p*2*s*ds;}
 near(m.F,force,2e-7);if(m.cp!==null)near(m.cp,moment/force,2e-7);
}
const wood=floating({weight:318,rho:1000});near(wood.E,318);near(wood.draft,318/(9810*.18));assert(wood.GM<0);near(wood.max,529.74);
const heavy=floating({weight:800,rho:1000});assert(heavy.sinks);near(heavy.E,529.74);near(heavy.net,270.26);assert.equal(heavy.GM,null);
assert.equal(floating({weight:529.74,rho:1000}).GM,null);assert.equal(floating({weight:0,rho:1000}).GM,null);
for(const rho of [850,1000,1025])for(const weight of [0,200,318,500,800]){const b=floating({weight,rho});near(b.E,rho*G*b.displaced);assert(b.displaced<=b.volume+1e-10);if(!b.sinks)near(b.E,weight);}
assert.throws(()=>manometer({dp:NaN,rho:1000}));assert.throws(()=>wall({h:2,angle:0}));assert.throws(()=>floating({weight:-1,rho:1000}));
const data=JSON.parse(fs.readFileSync(new URL('../data/cursos/mecanica-de-fluidos-unidad-2.json',import.meta.url),'utf8'));
const html=fs.readFileSync(new URL('../cursos/mecanica-de-fluidos-unidad-2.html',import.meta.url),'utf8');assert.equal(data.examples.length,12);assert.equal((html.match(/class="example-columns"/g)||[]).length,12);assert.equal((html.match(/class="example-illustration"/g)||[]).length,12);
for(const id of ['laboratorio-u','laboratorio-pared','laboratorio-flotacion','presion-u2','fuerzas-u2','flotacion-u2'])assert(html.includes(`id="${id}"`));
near(133000*.25-9810*.4,29326);near(133000*.8+7850*.4,109540);near(Math.hypot(98100,9810*(8+Math.PI)),146866.90107858134);
console.log('Correcto: manómetro, signos, conservación de volumen, fuerzas por integración, panel parcialmente/totalmente sumergido, flotación, límites y 12 ejemplos.');
