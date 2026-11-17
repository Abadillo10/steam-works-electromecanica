// Interpolación acotada: nunca extrapola ni modifica los datos de referencia.
export function calculateProperties(data, fluidId, temperature) {
 const fluid=data.fluids[fluidId];
 if(!fluid)throw new RangeError('Selecciona un fluido disponible.');
 if(!Number.isFinite(temperature)||temperature<fluid.minC||temperature>fluid.maxC)throw new RangeError(`Introduce una temperatura entre ${fluid.minC} y ${fluid.maxC} °C.`);
 const rows=fluid.rows;
 const left=Math.min(Math.floor((temperature-fluid.minC)/data.stepC),rows.length-2);
 const a=rows[left],b=rows[left+1],fraction=(temperature-a.temperatureC)/(b.temperatureC-a.temperatureC);
 const result={temperatureC:temperature};
 for(const key of Object.keys(a))if(key!=='temperatureC')result[key]=a[key]+fraction*(b[key]-a[key]);
 result.specificWeight=result.density*data.gravity;
 result.specificVolume=1/result.density;
 result.specificGravity=result.density/data.referenceDensity;
 result.kinematicViscosity=result.viscosity/result.density;
 return result;
}
