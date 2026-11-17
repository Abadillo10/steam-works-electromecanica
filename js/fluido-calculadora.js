import {calculateProperties} from './fluido-modelo.js';
const root=document.getElementById('fluid-calculator');
if(root){
 const select=root.querySelector('#calc-fluid'),number=root.querySelector('#calc-temperature'),range=root.querySelector('#calc-range');
 const status=root.querySelector('#calc-status'),results=root.querySelector('#calc-results'),plot=root.querySelector('#calc-chart');
 const property=root.querySelector('#calc-property');
 const definitions=[
 ['density','Densidad · ρ','kg/m³',1],['specificWeight','Peso específico · γ','N/m³',1],
 ['specificVolume','Volumen específico · v','m³/kg',1],['specificGravity','Gravedad específica · SG','sin unidades',1],
 ['viscosity','Viscosidad dinámica · μ','mPa·s',1000],['kinematicViscosity','Viscosidad cinemática · ν','mm²/s',1e6],
 ['bulkModulus','Módulo volumétrico isotérmico · Kₜ','MPa',1e-6],['surfaceTension','Tensión superficial · σ','mN/m',1000],
 ['vaporPressure','Presión de vapor · pᵥ','kPa absolutos',0.001]
 ];
 const formatter=new Intl.NumberFormat('es-MX',{maximumSignificantDigits:5});
 let data;
 function node(tag,text,cls){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;}
 function fail(message){results.replaceChildren();plot.replaceChildren();status.textContent=message;status.classList.add('calc-error');number.setAttribute('aria-invalid','true');}
 function draw(fluidId,temperature,current){
  const fluid=data.fluids[fluidId],key=property.value,definition=definitions.find(d=>d[0]===key),scale=definition[3];
  const samples=fluid.rows.map(row=>({t:row.temperatureC,y:row[key]*scale}));
  const lo=Math.min(...samples.map(p=>p.y)),hi=Math.max(...samples.map(p=>p.y)),span=hi-lo||1;
  const x=t=>76+(t-fluid.minC)/(fluid.maxC-fluid.minC)*590;
  const y=value=>220-(value-lo)/span*160;
  const ns='http://www.w3.org/2000/svg';
  function svgNode(tag,attrs,text){const el=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,String(v));if(text)el.textContent=text;return el;}
  const svg=svgNode('svg',{viewBox:'0 0 710 290',role:'img','aria-label':`${definition[1]} frente a temperatura para ${fluid.label}; valor actual ${formatter.format(current[key]*scale)} ${definition[2]} a ${temperature} °C.`});
  svg.append(svgNode('path',{d:'M76 40V220H666',fill:'none',stroke:'#73849b','stroke-width':1.5}));
  for(let i=0;i<3;i++){const value=lo+span*i/2;const yy=y(value);svg.append(svgNode('path',{d:`M76 ${yy}H666`,stroke:'#dce6ef','stroke-width':1}),svgNode('text',{x:66,y:yy+4,'text-anchor':'end','font-size':12,fill:'#526477'},formatter.format(value)));}
  svg.append(svgNode('text',{x:76,y:25,'font-size':13,fill:'#12345b'},`${definition[1]} [${definition[2]}]`));
  svg.append(svgNode('polyline',{points:samples.map(p=>`${x(p.t)},${y(p.y)}`).join(' '),fill:'none',stroke:'#1976d2','stroke-width':3}));
  svg.append(svgNode('circle',{cx:x(temperature),cy:y(current[key]*scale),r:6,fill:'#12345b',stroke:'white','stroke-width':2}));
  for(let i=0;i<3;i++){const t=fluid.minC+(fluid.maxC-fluid.minC)*i/2;svg.append(svgNode('text',{x:x(t),y:245,'text-anchor':'middle','font-size':12,fill:'#526477'},formatter.format(t)));}
  svg.append(svgNode('text',{x:370,y:276,'text-anchor':'middle','font-size':13,fill:'#12345b'},'Temperatura [°C]'));
  plot.replaceChildren(svg);
 }
 function update(){
  if(!data)return;
  if(number.value.trim()===''){fail('Escribe una temperatura para calcular las propiedades.');return;}
  try{
   const temperature=Number(number.value),fluid=data.fluids[select.value],value=calculateProperties(data,select.value,temperature);
   range.value=String(temperature);number.removeAttribute('aria-invalid');status.classList.remove('calc-error');
   status.textContent=`${fluid.label} a ${formatter.format(temperature)} °C (${formatter.format(temperature+273.15)} K). Presión fija: 101.325 kPa absolutos.`;
   results.replaceChildren();
   for(const [key,label,unit,scale] of definitions){const card=node('div',undefined,'calc-result');card.append(node('dt',label));if(value[key]===undefined){card.append(node('dd','No aplica','calc-na'));}else{card.append(node('dd',formatter.format(value[key]*scale)),node('span',unit,'calc-unit'));}results.append(card);}
   draw(select.value,temperature,value);
  }catch(error){fail(error.message);}
 }
 function configure(){const fluid=data.fluids[select.value];for(const control of [number,range]){control.min=fluid.minC;control.max=fluid.maxC;}if(number.value===''||Number(number.value)<fluid.minC||Number(number.value)>fluid.maxC)number.value='20';root.querySelector('#calc-range-note').textContent=`Rango disponible: ${fluid.minC} a ${fluid.maxC} °C. No se extrapolan resultados.`;update();}
 try{
  const response=await fetch(new URL('../data/propiedades-fluidos.json',import.meta.url));if(!response.ok)throw new Error('No se pudieron cargar los datos de propiedades. Recarga la página.');data=await response.json();
  for(const el of root.querySelectorAll('input,select'))el.disabled=false;
  root.querySelector('#calc-version').textContent=`CoolProp ${data.version}. Tablas cada ${data.stepC} °C con interpolación lineal. Resultados aproximados para aprendizaje.`;
  select.addEventListener('change',configure);number.addEventListener('input',update);range.addEventListener('input',()=>{number.value=range.value;update();});property.addEventListener('change',update);configure();
 }catch(error){fail(error.message);}
}
