import {manometer,wall,floating,drawManometer,drawWall,drawFloating} from './hidrostatica-modelo.mjs';
const $=id=>document.getElementById(id),f=n=>new Intl.NumberFormat('es-MX',{maximumFractionDigits:3}).format(n);
const previous={},frames={};
function animate(kind,target,model,draw,baseline){
 const plot=$(kind+'-plot');if(frames[kind])cancelAnimationFrame(frames[kind]);
 const start=baseline||previous[kind]||target;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches,t0=performance.now();
 const frame=now=>{const t=reduced?1:Math.min(1,(now-t0)/500),ease=1-(1-t)**3;const current=Object.fromEntries(Object.entries(target).map(([k,v])=>[k,start[k]===undefined?v:start[k]+(v-start[k])*ease]));plot.innerHTML=draw(model(current),'live-'+kind);previous[kind]=current;if(t<1)frames[kind]=requestAnimationFrame(frame);};
 frames[kind]=requestAnimationFrame(frame);
}
function table(id,rows){const table=document.createElement('table');const caption=document.createElement('caption');caption.textContent='Estado final de equilibrio';table.append(caption);const body=document.createElement('tbody');for(const [name,value]of rows){const tr=document.createElement('tr'),th=document.createElement('th'),td=document.createElement('td');th.scope='row';th.textContent=name;td.textContent=value;tr.append(th,td);body.append(tr);}table.append(body);$(id+'-results').replaceChildren(table);}
function number(id){const el=$(id),n=Number(el.value);if(el.value.trim()===''||!Number.isFinite(n)||n<Number(el.min)||n>Number(el.max)){el.setAttribute('aria-invalid','true');throw Error('Revisa '+document.querySelector(`label[for="${id}"]`).textContent+`: intervalo ${el.min} a ${el.max}.`);}el.removeAttribute('aria-invalid');return n;}
function fail(kind,e){if(frames[kind])cancelAnimationFrame(frames[kind]);$(kind+'-status').textContent=e.message;$(kind+'-results').replaceChildren();$(kind+'-plot').replaceChildren();}
function updateU(replay=false){try{const input={dp:number('u-pressure')*1000,rho:Number($('u-fluid').value)};const model=v=>manometer({dp:v.dp,rho:v.rho});const m=model(input);$('u-range').value=$('u-pressure').value;
 animate('u',input,model,drawManometer,replay?{...input,dp:0}:null);
 $('u-status').textContent=m.dp>0?'pA > patm: la rama A baja y la rama B sube.':m.dp<0?'pA < patm: la rama A sube y la rama B baja.':'Presiones iguales: las dos superficies quedan a la misma altura.';
 table('u',[['Diferencia de presión',f(m.dp/1000)+' kPa'],['Diferencia de alturas Δh',f((m.right-m.left)*1000)+' mm (zB − zA)'],['Desplazamiento de cada rama',f(Math.abs(m.right)*1000)+' mm'],['Relación', 'Δh = Δp/(ρg)']]);
 }catch(e){fail('u',e);}}
function updateWall(){try{const input={h:number('wall-h'),right:number('wall-right'),angle:number('wall-angle')};for(const [key,id]of [['h','h'],['right','right'],['angle','angle']])$('wall-'+id+'-range').value=input[key];const m=wall(input);animate('wall',input,wall,drawWall);
 $('wall-status').textContent=Math.abs(m.F)<1e-8?'Los niveles coinciden: se cancelan las fuerzas de ambos lados. No hay centro de presión neto.':`La fuerza neta actúa del lado ${m.F>0?'1 hacia el 2':'2 hacia el 1'}, normal al panel. ${m.a.wet===4?'El lado 1 cubre todo el panel.':'El lado 1 moja parte del panel.'}`;
 table('wall',[['Presión al fondo · lado 1',f(m.pBottomLeft/1000)+' kPa'],['Presión al fondo · lado 2',f(m.pBottomRight/1000)+' kPa'],['Área mojada · lado 1',f(m.a.area)+' m²'],['Área mojada · lado 2',f(m.b.area)+' m²'],['Fuerza · lado 1',f(m.a.F/1000)+' kN'],['Fuerza · lado 2',f(m.b.F/1000)+' kN'],['Magnitud de fuerza neta',f(Math.abs(m.F)/1000)+' kN'],['Centro de presión neto desde el fondo, sobre el panel',m.cp===null?'No definido':f(m.cp)+' m'],['Relación','F = ∫A ρgh dA; Fnet = F₁ − F₂']]);
 }catch(e){fail('wall',e);}}
function updateFloat(){try{const input={weight:number('float-weight'),rho:Number($('float-fluid').value)};const m=floating(input);$('float-weight-range').value=input.weight;animate('float',input,floating,drawFloating);
 const capacity=m.sinks?'El peso supera el empuje máximo: el bloque se hunde sin una fuerza externa.':m.weight===0?'Peso cero: no se requiere volumen desplazado.':Math.abs(m.weight-m.max)<1e-6?'Totalmente sumergido y de flotabilidad neutra en este modelo ideal.':'Puede equilibrar verticalmente su peso con el empuje.';
 $('float-status').textContent=capacity+(m.GM===null?'':m.GM<0?' GM < 0: orientación inestable; no se está simulando el vuelco.':' GM > 0: estabilidad inicial para pequeñas inclinaciones.');
 table('float',[['Volumen total',f(m.volume)+' m³'],['Volumen desplazado',f(m.displaced)+' m³'],['Calado, si hay equilibrio libre',m.sinks?'No existe equilibrio libre':f(m.draft)+' m'],['Empuje actual o máximo al hundirse',f(m.E)+' N'],['Empuje máximo',f(m.max)+' N'],['Fuerza neta descendente',f(m.net)+' N'],['GM inicial',m.GM===null?'No aplica':f(m.GM*1000)+' mm'],['Relación','E = ρgVd; en equilibrio E = W']]);
 }catch(e){fail('float',e);}}
function bindPair(input,range,update){$(input).addEventListener('input',()=>update());$(range).addEventListener('input',()=>{$(input).value=$(range).value;update();});}
bindPair('u-pressure','u-range',updateU);$('u-fluid').addEventListener('change',()=>updateU());$('u-replay').addEventListener('click',()=>updateU(true));
for(const key of ['h','right','angle'])bindPair('wall-'+key,'wall-'+key+'-range',updateWall);
$('wall-case').addEventListener('change',()=>{const value=$('wall-case').value;$('wall-h').value='2.4';$('wall-right').value=value==='one'?'0':'1.4';$('wall-angle').value=value==='inclined'?'60':'90';updateWall();});
bindPair('float-weight','float-weight-range',updateFloat);$('float-fluid').addEventListener('change',updateFloat);
for(const b of document.querySelectorAll('[data-reset]'))b.addEventListener('click',()=>{if(b.dataset.reset==='u'){$('u-pressure').value='1';$('u-fluid').value='1000';updateU();}else if(b.dataset.reset==='wall'){$('wall-h').value='2.4';$('wall-right').value='0';$('wall-angle').value='90';$('wall-case').value='one';updateWall();}else{$('float-weight').value='318';$('float-fluid').value='1000';updateFloat();}});
updateU();updateWall();updateFloat();
