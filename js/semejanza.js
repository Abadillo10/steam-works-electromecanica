import {scales} from './semejanza-modelo.mjs';
const $=id=>document.getElementById(id),format=n=>n.toLocaleString('es-MX',{maximumSignificantDigits:6});
function update(){
 const N=+$('scale-denominator').value,nu=+$('scale-nu').value,rho=+$('scale-rho').value,criterion=$('scale-criterion').value;
 const tests=[['scale-denominator',N,1,100],['scale-nu',nu,.001,1000],['scale-rho',rho,.001,1000]];
 let valid=true;for(const[id,n,min,max]of tests){const ok=$(id).value!==''&&Number.isFinite(n)&&n>=min&&n<=max;$(id).setAttribute('aria-invalid',String(!ok));valid&&=ok;}
 if(!valid){$('scale-status').textContent='Revisa los valores: N entre 1 y 100; razones de viscosidad y densidad entre 0.001 y 1000.';$('scale-results').textContent='';$('scale-plot').textContent='Resultados pendientes de datos válidos.';return;}
 const s=scales({lambda:1/N,nuRatio:nu,rhoRatio:rho,criterion});
 $('scale-status').textContent=`Modelo 1:${format(N)} · λ = ${format(s.lambda)}. Se conserva ${criterion==='reynolds'?'Reynolds':'Froude'}. ${N===1&&nu===1?'Con estas condiciones el criterio elegido da iguales velocidades.':'Al cambiar la escala, cambia la velocidad requerida por el criterio.'}`;
 $('scale-results').innerHTML=[['Longitud Lm/Lp',s.lambda],['Área Am/Ap',s.area],['Volumen m/volumen p',s.volume],['Velocidad Vm/Vp',s.velocity],['Tiempo tm/tp',s.time],['Caudal Qm/Qp',s.flow],['Diferencia de presión Δpm/Δpp',s.pressure],['Fuerza Fm/Fp',s.force],['Reynolds Rem/Rep',s.reynolds],['Froude Frm/Frp',s.froude]].map(([label,value])=>`<tr><th scope="row">${label}</th><td>${format(value)}</td></tr>`).join('');
 const width=260/N,height=130/N;
 $('scale-plot').innerHTML=`<svg viewBox="0 0 640 310" role="img" aria-label="Comparación geométrica: modelo a escala 1:${N}"><rect width="640" height="310" fill="#f4f8fd"/><path d="M35 220V90H295V220Z" fill="#d3e6f9" stroke="#12345b" stroke-width="3"/><path d="M350 220V${220-height}H${350+width}V220Z" fill="#d3e6f9" stroke="#12345b" stroke-width="2"/><g fill="#12345b" font-family="Segoe UI,Arial,sans-serif" font-size="18"><text x="55" y="60">Prototipo · Lp</text><text x="350" y="60">Modelo · Lm = Lp/${format(N)}</text><text x="55" y="263">Razón de velocidades: ${format(s.velocity)}</text><text x="55" y="292">Razón de caudales: ${format(s.flow)} · Geometría a escala relativa</text></g></svg>`;
}
['scale-denominator','scale-nu','scale-rho'].forEach(id=>$(id).addEventListener('input',update));$('scale-criterion').addEventListener('change',update);update();
