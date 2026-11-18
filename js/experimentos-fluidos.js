(() => {
 const format=new Intl.NumberFormat('es-MX',{maximumFractionDigits:3});
 const f=value=>format.format(value);
 for(const root of document.querySelectorAll('[data-experiment]')){
  const barrel=root.dataset.experiment==='barril';
  const number=root.querySelector('[data-number]'),range=root.querySelector('[data-range]');
  const results=root.querySelector('[data-results]'),steps=root.querySelector('[data-steps]'),status=root.querySelector('[data-status]');
  const bar=root.querySelector('[data-bar]'),barLabel=root.querySelector('[data-bar-label]');
  const initial=barrel?1390/0.159/9.81:6;
  function element(tag,text){const node=document.createElement(tag);node.textContent=text;return node;}
  function update(){
   const value=Number(number.value);
   if(number.value.trim()===''||!Number.isFinite(value)||value<Number(number.min)||value>Number(number.max)){
    number.setAttribute('aria-invalid','true');results.replaceChildren();steps.replaceChildren();bar.setAttribute('width','0');barLabel.textContent='Sin resultado';
    status.textContent=`Introduce un valor entre ${number.min} y ${number.max} ${barrel?'kg/m³':'m³'}.`;return;
   }
   number.removeAttribute('aria-invalid');range.value=String(value);
   const volume=barrel?0.159:value,rho=barrel?value:47000/(9.81*volume);
   const mass=rho*volume,gamma=rho*9.81,weight=mass*9.81,total=weight+110,sg=rho/1000;
   const rows=[['Volumen',volume,'m³'],['Densidad',rho,'kg/m³'],['Masa del aceite',mass,'kg'],['Peso del aceite',weight,'N'],['Peso específico',gamma,'N/m³'],['Gravedad específica',sg,'sin unidades']];
   if(barrel)rows.splice(4,0,['Peso total con recipiente',total,'N']);
   results.replaceChildren(...rows.map(([name,val,unit])=>{const row=element('tr','');const heading=element('th',name);heading.setAttribute('scope','row');row.append(heading,element('td',f(val)),element('td',unit));return row;}));
   const lines=barrel?[
    `m = ρV = ${f(rho)} × 0.159 = ${f(mass)} kg.`,
    `Waceite = mg = ${f(mass)} × 9.81 = ${f(weight)} N.`,
    `Wtotal = Waceite + 110 = ${f(total)} N.`,
    `γ = ρg = ${f(gamma)} N/m³; SG = ρ/1000 = ${f(sg)}.`
   ]:[
    `m = W/g = 47000/9.81 = ${f(mass)} kg (constante).`,
    `γ = W/V = 47000/${f(volume)} = ${f(gamma)} N/m³.`,
    `ρ = m/V = ${f(mass)}/${f(volume)} = ${f(rho)} kg/m³.`,
    `SG = ρ/1000 = ${f(sg)}.`
   ];
   steps.replaceChildren(...lines.map(line=>element('li',line)));
   bar.setAttribute('width',String((barrel?total/(1400*0.159*9.81+110):volume/12)*280));
   barLabel.textContent=barrel?`${f(total)} N`:`${f(volume)} m³`;
   status.textContent=barrel?`Densidad ${f(rho)} kg/m³. Peso total ${f(total)} N. Volumen fijo: 0.159 m³.`:`Volumen ${f(volume)} m³. Densidad ${f(rho)} kg/m³. Peso fijo: 47 kN.`;
  }
  number.addEventListener('input',update);
  range.addEventListener('input',()=>{number.value=range.value;update();});
  root.querySelector('[data-reset]').addEventListener('click',()=>{number.value=String(initial);update();});
  update();root.dataset.ready='true';
 }
})();
