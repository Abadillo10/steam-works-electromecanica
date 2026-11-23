export function scales({lambda=.1,criterion='reynolds',nuRatio=1,rhoRatio=1,gRatio=1}={}){
 if(![lambda,nuRatio,rhoRatio,gRatio].every(v=>Number.isFinite(v)&&v>0))throw new RangeError('Las razones deben ser positivas.');
 if(!['reynolds','froude'].includes(criterion))throw new RangeError('Criterio desconocido.');
 const velocity=criterion==='reynolds'?nuRatio/lambda:Math.sqrt(gRatio*lambda),area=lambda**2,volume=lambda**3;
 return {lambda,velocity,area,volume,time:lambda/velocity,flow:area*velocity,pressure:rhoRatio*velocity**2,force:rhoRatio*velocity**2*area,reynolds:velocity*lambda/nuRatio,froude:velocity/Math.sqrt(gRatio*lambda)};
}
export function dimension(product){
 const dims={F:[1,1,-2],V:[0,1,-1],rho:[1,-3,0],mu:[1,-1,-1],D:[0,1,0],g:[0,1,-2],p:[1,-1,-2],Q:[0,3,-1],n:[0,0,-1]};
 const out=[0,0,0];for(const [variable,power]of Object.entries(product)){if(!dims[variable])throw new RangeError(variable);dims[variable].forEach((v,i)=>out[i]+=v*power);}return out;
}
