import assert from 'node:assert/strict';
import {venturi,draining,pitot,orifice,accumulation,g} from '../js/hidrodinamica-modelo.mjs';
const near=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,`${a} ≠ ${b}`);
for(const r of [1.1,2,5])for(const h of [0,.5,10]){const v=venturi(r,h);near(v.v1*Math.PI*.1**2/4,v.v2*Math.PI*v.d2**2/4);near((v.v2**2-v.v1**2)/(2*g),h);}
near(venturi().v2,3.616628264,1e-8);assert.throws(()=>venturi(1,.5));assert.throws(()=>venturi(2,-1));
const d=draining();near(d.level(0),2);near(d.level(d.t),.5);near(d.level(d.t*2),.5);assert.ok(d.t>31&&d.t<33);
const dt=1e-4,t=d.t*.4,h=d.level(t),derivative=(d.level(t+dt)-d.level(t-dt))/(2*dt);near(derivative,-Math.sqrt(2*g*h)/100,1e-8);
near(accumulation().mass,14.5);const p=pitot();near(.5*810*p.v**2,(13550-810)*g*.1778);assert.ok(orifice().q>.09&&orifice().q<.10);assert.ok(orifice().loss>1.8&&orifice().loss<2.1);
console.log('CORRECTO: balances de continuidad y energía, Pitot, acumulación y ecuación diferencial de vaciado.');
