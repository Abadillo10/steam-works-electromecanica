import assert from 'node:assert/strict';
import fs from 'node:fs';
import {calculateProperties} from '../js/fluido-modelo.js';
const data=JSON.parse(fs.readFileSync(new URL('../data/propiedades-fluidos.json',import.meta.url),'utf8'));
const water=calculateProperties(data,'agua',20),air=calculateProperties(data,'aire',20);
assert(Math.abs(water.density-998.2)<0.1);
assert(Math.abs(water.viscosity-0.001002)<0.000002);
assert(Math.abs(air.density-1.205)<0.005);
assert(Math.abs(air.viscosity-0.0000182)<0.0000002);
for(const id of Object.keys(data.fluids)){
 const fluid=data.fluids[id],before=JSON.stringify(fluid);
 for(const temperature of [fluid.minC,20,20.5,fluid.maxC]){
  const p=calculateProperties(data,id,temperature);
  assert.equal(p.specificVolume,1/p.density);
  assert.equal(p.specificWeight,p.density*data.gravity);
  assert.equal(p.kinematicViscosity,p.viscosity/p.density);
  assert.equal(p.specificGravity,p.density/data.referenceDensity);
  assert(Object.values(p).every(Number.isFinite));
 }
 const a=calculateProperties(data,id,20),b=calculateProperties(data,id,21),mid=calculateProperties(data,id,20.5);
 assert.equal(mid.density,(a.density+b.density)/2);
 for(const value of [NaN,Infinity,fluid.minC-0.1,fluid.maxC+0.1])assert.throws(()=>calculateProperties(data,id,value),RangeError);
 assert.equal(JSON.stringify(fluid),before);
}
assert.throws(()=>calculateProperties(data,'aceite',20),RangeError);
assert(calculateProperties(data,'agua',80).viscosity<water.viscosity);
assert(calculateProperties(data,'aire',80).viscosity>air.viscosity);
assert(!('surfaceTension' in air));assert(!('vaporPressure' in air));
console.log('Correcto: valores de referencia, extremos, interpolación, identidades SI, entradas inválidas y tendencias térmicas.');
