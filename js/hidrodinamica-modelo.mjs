export const g=9.81;
const positive=(...v)=>{if(v.some(x=>!Number.isFinite(x)||x<=0))throw new RangeError('Los datos deben ser positivos.');};
export function venturi(ratio=2,head=.5,diameter=.1){
 positive(ratio,diameter);if(ratio<=1||head<0||!Number.isFinite(head))throw new RangeError('A₁/A₂ > 1 y ΔH ≥ 0.');
 const v1=Math.sqrt(2*g*head/(ratio*ratio-1)),v2=ratio*v1,area=Math.PI*diameter**2/4;
 return {v1,v2,q:area*v1,ratio,head,diameter,d2:diameter/Math.sqrt(ratio)};
}
export function draining(h0=2,hf=.5,diameter=1,outlet=.1){
 positive(h0,diameter,outlet);if(hf<0||hf>h0||outlet>=diameter)throw new RangeError('Revisar alturas y diámetros.');
 const ratio=(diameter/outlet)**2,t=2*ratio/Math.sqrt(2*g)*(Math.sqrt(h0)-Math.sqrt(hf));
 return {t,ratio,h0,hf,level:seconds=>Math.max(Math.sqrt(hf),Math.sqrt(h0)-Math.sqrt(2*g)*Math.max(0,seconds)/(2*ratio))**2};
}
export function pitot(height=.1778,rho=810,manometerRho=13550){positive(height,rho,manometerRho);if(manometerRho<=rho)throw new RangeError('El líquido manométrico debe ser más denso.');const dp=(manometerRho-rho)*g*height;return {dp,v:Math.sqrt(2*dp/rho)};}
export function orifice(D=.24,d=.15,head=3.15,K=.66,Cc=.633){positive(D,d,head,K,Cc);if(d>=D)throw new RangeError('d < D');const area=Math.PI*d*d/4,q=K*area*Math.sqrt(2*g*head),vc=q/(Cc*area),v=q/(Math.PI*D*D/4);return {q,vc,v,loss:(vc-v)**2/(2*g)};}
export function accumulation(area=.0025,velocity=7,outflow=.003,rho=1000){return {inflow:area*velocity,net:area*velocity-outflow,mass:rho*(area*velocity-outflow)};}
