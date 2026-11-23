import assert from 'node:assert/strict';
import {scales,dimension} from '../js/semejanza-modelo.mjs';
import fs from 'node:fs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
for(const lambda of [1,.1,1/6,.01])for(const nuRatio of [.25,1,2]){
 const s=scales({lambda,nuRatio});near(s.velocity*lambda/nuRatio,1);near(s.flow,s.velocity*lambda**2);near(s.time,lambda/s.velocity);
 const f=scales({lambda,nuRatio,criterion:'froude'});near(f.velocity/Math.sqrt(lambda),1);near(f.flow,lambda**2.5);near(f.force,lambda**3);
}
near(scales().velocity*10,100);near(scales({lambda:1/6}).flow*700,700/6);near(17800/scales().pressure,178);
assert.deepEqual(dimension({F:1,rho:-1,V:-2,D:-2}),[0,0,0]);
assert.deepEqual(dimension({rho:1,V:1,D:1,mu:-1}),[0,0,0]);
assert.deepEqual(dimension({V:2,g:-1,D:-1}),[0,0,0]);
assert.deepEqual(dimension({p:1,rho:-1,n:-2,D:-2}),[0,0,0]);
assert.deepEqual(dimension({Q:1,n:-1,D:-3}),[0,0,0]);
assert.notDeepEqual(dimension({V:4,g:-1,D:-1}),[0,0,0]);
for(const lambda of [0,-1,NaN])assert.throws(()=>scales({lambda}));
const data=JSON.parse(fs.readFileSync(new URL('../data/cursos/mecanica-de-fluidos-unidad-3.json',import.meta.url)));
assert.equal(data.examples.length,5);assert.equal(data.problems.length,11);
console.log('CORRECTO: grupos adimensionales, leyes de Reynolds/Froude y tres resultados del manual; cinco ejemplos y once problemas.');
