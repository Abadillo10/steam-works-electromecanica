export const G=9.81;
const finite=(v,name)=>{if(!Number.isFinite(v))throw Error('Revisa '+name+'.');};
export function manometer({dp,rho}){finite(dp,'la presión');finite(rho,'la densidad');if(rho<=0)throw Error('Densidad positiva requerida.');const h=dp/(rho*G);return {dp,rho,h,left:-h/2,right:h/2};}
export function wall({h,right=0,angle,width=2,length=4,rho=1000}){
 for(const [k,v]of Object.entries({h,right,angle,width,length,rho}))finite(v,k);
 if(h<0||right<0||angle<=0||angle>90||width<=0||length<=0||rho<=0)throw Error('Geometría o propiedades fuera de rango.');
 const s=Math.sin(angle*Math.PI/180),c=Math.cos(angle*Math.PI/180);
 const side=H=>{const wet=Math.min(length,H/s),integral=H*wet-s*wet**2/2,F=rho*G*width*integral,moment=rho*G*width*(H*wet**2/2-s*wet**3/3);return {wet,area:width*wet,F,moment};};
 const a=side(h),b=side(right),F=a.F-b.F,moment=a.moment-b.moment;
 const cp=Math.abs(F)>1e-8?moment/F:null;
 return {h,right,angle,width,length,rho,s,c,a,b,F,cp,depth:cp===null?null:h-cp*s,pBottomLeft:rho*G*h,pBottomRight:rho*G*right};
}
export function floating({weight,rho,width=.3,length=.6,height=.3}){
 for(const [k,v]of Object.entries({weight,rho,width,length,height}))finite(v,k);
 if(weight<0||rho<=0||width<=0||length<=0||height<=0)throw Error('Peso no negativo y dimensiones positivas requeridos.');
 const area=width*length,volume=area*height,max=rho*G*volume,sinks=weight>max+1e-8;
 const displaced=Math.min(weight/(rho*G),volume),draft=displaced/area,E=rho*G*displaced;
 const I=Math.min(length*width**3,width*length**3)/12;
 const GM=displaced>0&&weight<max-1e-8?draft/2+I/displaced-height/2:null;
 return {weight,rho,width,length,height,area,volume,max,sinks,displaced,draft,E,net:weight-E,GM};
}
const f=n=>new Intl.NumberFormat('es-MX',{maximumFractionDigits:3}).format(n);
const t=(x,y,label,attrs='')=>`<text x="${x}" y="${y}" ${attrs}>${label}</text>`;
const path=(d,attrs='')=>`<path d="${d}" ${attrs}/>`;
function svg(id,title,body){return `<svg viewBox="0 0 640 360" role="img" aria-labelledby="${id}-title"><title id="${id}-title">${title}</title><defs><marker id="${id}-tip" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#1976d2"/></marker><linearGradient id="${id}-water" x2="0" y2="1"><stop stop-color="#e9f4ff"/><stop offset="1" stop-color="#a9d0f1"/></linearGradient></defs><rect width="640" height="360" rx="10" fill="#f7faff"/><g font-family="Segoe UI,Arial,sans-serif" font-size="17" fill="#12345b">${body}</g></svg>`;}
export function drawManometer(m,id='manometer'){
 const yL=185-m.left*390,yR=185-m.right*390;
 return svg(id,'Manómetro en U: la rama con mayor presión desciende',
 t(38,34,'Manómetro en U · aire sobre el líquido')+t(95,74,'pA = patm + Δp')+t(381,74,'pB = patm')+
 path('M210 100V265Q210 305 250 305H390Q430 305 430 265V100','fill="none" stroke="#12345b" stroke-width="40"')+
 path('M210 100V265Q210 305 250 305H390Q430 305 430 265V100','fill="none" stroke="white" stroke-width="33"')+
 path(`M210 ${yL}V265Q210 305 250 305H390Q430 305 430 265V${yR}`,`fill="none" stroke="#1976d2" stroke-width="29"`)+
 path(`M183 ${yL}H490M448 ${yR}H490M480 ${Math.min(yL,yR)}V${Math.max(yL,yR)}`,'fill="none" stroke="#526477" stroke-dasharray="5 4"')+
 t(495,Math.min(yL,yR)+Math.max(14,Math.abs(yR-yL)/2),'|Δh|')+t(32,344,`Δp = ${f(m.dp/1000)} kPa · Δh = ${f(m.h*1000)} mm (con signo)`));
}
export function drawWall(m,id='wall'){
 const bx=240,by=310,scale=49,atH=H=>bx+H/m.s*m.c*scale,topX=bx+m.length*m.c*scale,topY=by-m.length*m.s*scale;
 let body=t(22,30,`Pared de ${f(m.length)} m × ${f(m.width)} m · θ respecto a la horizontal`);
 body+=path(`M45 ${by-m.h*scale}H${atH(m.h)}L${bx} ${by}H45Z`,`fill="url(#${id}-water)"`);
 if(m.right>0)body+=path(`M${atH(m.right)} ${by-m.right*scale}H594V${by}H${bx}Z`,'fill="#dce6ef"');
 const extension=Math.max(m.length,m.h/m.s,m.right/m.s);
 body+=path(`M${bx} ${by}L${bx+extension*m.c*scale} ${by-extension*m.s*scale}`,'stroke="#8ca4bb" stroke-dasharray="5 5"');
 body+=path(`M${bx} ${by}L${topX} ${topY}`,'stroke="#12345b" stroke-width="9"');
 for(let i=1;i<=4;i++){const along=m.a.wet*i/5,x=bx+along*m.c*scale,y=by-along*m.s*scale,len=(m.h-along*m.s)*15;body+=path(`M${x} ${y}l${m.s*len} ${m.c*len}`,`stroke="#1976d2" stroke-width="2" marker-end="url(#${id}-tip)"`);}
 body+=path(`M${bx} ${by}H${bx+85}`,'stroke="#526477"')+t(bx+42,by-10,`${f(m.angle)}°`)+t(51,by-m.h*scale-12,`h₁ = ${f(m.h)} m`)+t(430,by-m.right*scale-12,`h₂ = ${f(m.right)} m`);
 if(m.cp!==null){const x=bx+m.cp*m.c*scale,y=by-m.cp*m.s*scale,sign=Math.sign(m.F);body+=`<circle cx="${x}" cy="${y}" r="6" fill="#12345b"/>`+path(`M${x} ${y}l${sign*m.s*78} ${sign*m.c*78}`,`stroke="#1976d2" stroke-width="4" marker-end="url(#${id}-tip)"`);}
 body+=t(24,346,`F neta = ${f(m.F/1000)} kN · Azul: presión del lado 1. Negro: panel.`);
 return svg(id,'Pared inclinada con niveles de líquido y fuerza normal',body);
}
export function drawFloating(m,id='floating'){
 const yWater=145,scale=300,boxH=m.height*scale,boxW=170;
 const top=m.sinks?yWater+26:yWater-(m.height-m.draft)*scale,bottom=top+boxH,cy=(top+bottom)/2;
 return svg(id,'Bloque en agua: peso hacia abajo y empuje hacia arriba',
 path(`M65 ${yWater}H580V325H65Z`,`fill="url(#${id}-water)"`)+path(`M65 ${yWater}H580`,'stroke="#1976d2" stroke-width="2"')+
 `<rect x="235" y="${top}" width="${boxW}" height="${boxH}" rx="3" fill="#d5dee8" stroke="#12345b" stroke-width="3"/>`+
 path(`M290 ${cy}v${-Math.max(10,Math.min(90,m.E/6))}`,`stroke="#1976d2" stroke-width="3" stroke-dasharray="5 3" marker-end="url(#${id}-tip)"`)+
 path(`M355 ${cy}v${Math.max(10,Math.min(100,m.weight/6))}`,`stroke="#1976d2" stroke-width="3" marker-end="url(#${id}-tip)"`)+
 t(110,72,`Peso: ${f(m.weight)} N`)+t(377,72,`Empuje: ${f(m.E)} N`)+t(77,133,'Superficie libre')+t(78,293,m.sinks?'Sin equilibrio libre: el peso supera el empuje máximo.':`Calado = ${f(m.draft)} m · Orientación mantenida para comparar.`)+t(78,347,'Las flechas indican sentidos; sus longitudes son esquemáticas.'));
}
export function drawTank({h=3,oil=0},id='tank'){
 const base=290,scale=Math.min(60,190/h),water=h-oil;
 return svg(id,'Tanque abierto y profundidad vertical',path('M125 75V290H435V75','fill="none" stroke="#12345b" stroke-width="4"')+path(`M128 ${base-water*scale}H432V287H128Z`,`fill="url(#${id}-water)"`)+(oil>0?path(`M128 ${base-h*scale}H432V${base-water*scale}H128Z`,'fill="#c4d2df"'):'')+path(`M128 ${base-h*scale}H432`,'stroke="#1976d2" stroke-width="2"')+t(140,base-h*scale-15,'Abierto a la atmósfera')+t(154,base-water*scale/2,'Agua')+(oil>0?t(153,base-h*scale+30,`Aceite: ${f(oil)} m`):'')+path(`M470 ${base-h*scale}V${base}`,'stroke="#1976d2" stroke-width="2"')+t(480,215,`h = ${f(h)} m`)+t(125,336,'La presión depende de la profundidad vertical y de la densidad.'));
}
