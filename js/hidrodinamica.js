import {venturi,draining,g} from './hidrodinamica-modelo.mjs';
const $=id=>document.getElementById(id),fmt=(n,d=3)=>n.toLocaleString('es-MX',{minimumFractionDigits:d,maximumFractionDigits:d});
function updateVenturi(){
 const ratio=+$('venturi-ratio').value,head=+$('venturi-head').value;
 if(!$('venturi-head').value||!Number.isFinite(head)||head<0||head>10){$('venturi-status').textContent='Indica una diferencia de carga entre 0 y 10 m.';$('venturi-head').setAttribute('aria-invalid','true');$('venturi-results').textContent='';return;}
 $('venturi-head').removeAttribute('aria-invalid');const s=venturi(ratio,head);
 $('venturi-status').textContent=`A₁/A₂ = ${fmt(ratio,1)} · ΔH = ${fmt(head,2)} m. ${head===0?'Sin diferencia de carga, el modelo da caudal cero.':'La garganta tiene mayor velocidad y menor carga piezométrica.'}`;
 $('venturi-results').innerHTML=[['V₁',fmt(s.v1)+' m/s'],['V₂',fmt(s.v2)+' m/s'],['Q',fmt(s.q*1000)+' L/s'],['Diámetro de garganta',fmt(s.d2*1000,1)+' mm'],['A₁V₁ − A₂V₂',fmt(s.q-(Math.PI*s.d2*s.d2/4)*s.v2,8)+' m³/s'],['(V₂² − V₁²)/(2g)',fmt((s.v2*s.v2-s.v1*s.v1)/(2*g))+' m']].map(([a,b])=>`<tr><th scope="row">${a}</th><td>${b}</td></tr>`).join('');
 const half=80/Math.sqrt(ratio);
 $('venturi-plot').innerHTML=`<svg viewBox="0 0 640 300" role="img" aria-label="Venturi: la garganta cambia de diámetro con la relación de áreas"><rect width="640" height="300" fill="#f4f8fd"/><path d="M30 65H170L300 ${145-half}H410L550 65H610V225H550L410 ${145+half}H300L170 225H30Z" fill="#d4e7fa" stroke="#12345b" stroke-width="4"/><g font-family="Segoe UI,Arial,sans-serif" font-size="18" fill="#12345b"><text x="50" y="40">D₁ = 100 mm</text><text x="285" y="40">D₂ = ${fmt(s.d2*1000,1)} mm</text><text x="65" y="150">${fmt(s.v1,2)} m/s →</text><text x="300" y="151">${fmt(s.v2,2)} m/s →</text><text x="60" y="270">Continuidad: menor área, mayor velocidad para un mismo Q.</text></g></svg>`;
}
$('venturi-ratio').addEventListener('input',updateVenturi);$('venturi-head').addEventListener('input',updateVenturi);updateVenturi();
const d=draining();let frame=0;
function updateDrain(){const t=+$('drain-time').value,h=d.level(t),y=240-h*90;
 $('drain-status').textContent=`t = ${fmt(t,1)} s · h = ${fmt(h,3)} m · Vsal = ${fmt(Math.sqrt(2*g*h),2)} m/s.`;
 $('drain-plot').innerHTML=`<svg viewBox="0 0 640 310" role="img" aria-label="Nivel de agua ${fmt(h,2)} metros"><rect width="640" height="310" fill="#f4f8fd"/><path d="M130 35V240H430V35" fill="none" stroke="#12345b" stroke-width="5"/><path d="M134 ${y}H426V236H134Z" fill="#b7d9fa"/><path d="M430 225H540" stroke="#1976d2" stroke-width="10"/><g font-family="Segoe UI,Arial,sans-serif" font-size="19" fill="#12345b"><text x="160" y="285">h = ${fmt(h,2)} m</text><text x="455" y="200">Salida →</text><text x="155" y="25">Tanque abierto · D = 1 m</text></g></svg>`;
}
function stop(){cancelAnimationFrame(frame);frame=0;$('drain-play').textContent='Animar vaciado';}
$('drain-time').addEventListener('input',()=>{stop();updateDrain();});
$('drain-play').addEventListener('click',()=>{if(frame){stop();return;}if(+$('drain-time').value>=d.t)$('drain-time').value=0;const t0=performance.now(),initial=+$('drain-time').value;$('drain-play').textContent='Pausar';function tick(now){const t=Math.min(d.t,initial+Math.max(0,now-t0)*d.t/8000);$('drain-time').value=t;updateDrain();if(t<d.t)frame=requestAnimationFrame(tick);else stop();}frame=requestAnimationFrame(tick);});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});updateDrain();
