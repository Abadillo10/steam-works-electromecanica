const items={
 'densidad-2':['barril-aceite','El peso medido incluye al recipiente. Para obtener el del aceite se resta la tara; en la simulación el volumen permanece fijo.'],
 'peso-especifico-2':['aceite-volumen','Comparación de muestras con el mismo peso: un volumen menor implica mayor densidad. No representa compresión ni llenado de un mismo aceite.'],
 'viscosidad-1':['viscosidad-placas','El perfil lineal muestra cómo cambia la velocidad entre la pared fija y la placa móvil. Las flechas azules dentro del aceite representan velocidad.'],
 'modelo-volumetrico-1':['compresion-fluido','Al aumentar la presión disminuye el volumen de la misma masa de líquido. La reducción se exagera para poder verla.'],
 'tension-superficial-2':['halobates-contacto','Esquema conceptual, sin escala anatómica. En el detalle, las flechas ascendentes representan las componentes verticales de la fuerza de tensión superficial.'],
 'flujo-4':['manguera-cubeta','El aforo determina Q a partir del volumen y el tiempo. La velocidad de salida se calcula con el área de la boquilla, no con el área de la manguera.']
};
module.exports=function illustration(topic,index){
 const item=items[topic+'-'+index];if(!item)return '';
 return '<figure class="example-illustration"><img src="../assets/ilustraciones-fluidos/'+item[0]+'.svg" alt="'+item[1]+'" width="640" height="320" loading="lazy" decoding="async"><figcaption>'+item[1]+' Dibujo esquemático, no a escala.</figcaption></figure>';
};
