import {groups,convert} from './conversor-modelo.mjs';
const root=document.getElementById('conversor');
if(root){
 const get=id=>root.querySelector('#convert-'+id),area=get('area'),group=get('group'),from=get('from'),to=get('to'),value=get('value'),result=get('result'),note=get('note');
 function option(id,label){const o=document.createElement('option');o.value=id;o.textContent=label;return o;}
 function update(){note.textContent=groups[group.value].note||'Conversión dentro de la misma magnitud.';try{if(value.value.trim()==='')throw Error('Introduce el valor que deseas convertir.');const n=convert(Number(value.value),group.value,from.value,to.value);result.textContent=new Intl.NumberFormat('es-MX',{maximumSignificantDigits:9}).format(n)+' '+groups[group.value].units[to.value].label;value.removeAttribute('aria-invalid');}catch(e){result.textContent=e.message;value.setAttribute('aria-invalid','true');}}
 function units(){const entries=Object.entries(groups[group.value].units);from.replaceChildren(...entries.map(([k,u])=>option(k,u.label)));to.replaceChildren(...entries.map(([k,u])=>option(k,u.label)));to.selectedIndex=entries.length>1?1:0;update();}
 function categories(){group.replaceChildren(...Object.entries(groups).filter(([,g])=>g.area===area.value).map(([k,g])=>option(k,g.label)));units();}
 area.addEventListener('change',categories);group.addEventListener('change',units);for(const el of [from,to])el.addEventListener('change',update);value.addEventListener('input',update);get('swap').addEventListener('click',()=>{const a=from.value;from.value=to.value;to.value=a;update();});categories();
}
