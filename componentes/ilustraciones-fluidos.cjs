const items={
 'densidad-2':['barril-aceite','El peso medido incluye al recipiente. Para obtener el del aceite se resta la tara; en la simulación el volumen permanece fijo.'],
 'peso-especifico-2':['aceite-volumen','Comparación de muestras con el mismo peso: un volumen menor implica mayor densidad. No representa compresión ni llenado de un mismo aceite.'],
 'viscosidad-1':['viscosidad-placas','El perfil lineal muestra cómo cambia la velocidad entre la pared fija y la placa móvil. Las flechas azules dentro del aceite representan velocidad.'],
 'modelo-volumetrico-1':['compresion-fluido','Al aumentar la presión disminuye el volumen de la misma masa de líquido. La reducción se exagera para poder verla.'],
 'tension-superficial-2':['halobates-contacto','Esquema conceptual, sin escala anatómica. En el detalle, las flechas ascendentes representan las componentes verticales de la fuerza de tensión superficial.'],
 'flujo-4':['manguera-cubeta','El aforo determina Q a partir del volumen y el tiempo. La velocidad de salida se calcula con el área de la boquilla, no con el área de la manguera.'],
 'presion-2':['gato-hidraulico','El brazo de la fuerza aplicada respecto al apoyo C es 30 + 3 = 33 cm. La palanca amplifica la fuerza sobre el pistón pequeño; la presión del aceite transmite el esfuerzo al pistón grande.']
};
module.exports=function illustration(topic,index){
 const item=items[topic+'-'+index];if(!item)return '';
 const generated={
  'tension-superficial-2':['halobates-generado','Halobates sobre el agua: cuerpo segmentado, seis patas articuladas y ondas en los puntos de apoyo.','Observa las depresiones del agua y los apoyos de las patas. El esquema siguiente define las fuerzas del modelo ideal del ejercicio.'],
  'presion-2':['gato-hidraulico-generado','Ilustración en corte de un gato hidráulico con palanca, pistón de bombeo, pistón elevador y aceite en azul.','Referencia visual del mecanismo. Para identificar los brazos de palanca, los diámetros y las fuerzas, utiliza el esquema acotado siguiente.']
 }[topic+'-'+index];
 const reference=generated?'<figure class="example-illustration"><img src="../assets/ilustraciones-fluidos/'+generated[0]+'.jpg" alt="'+generated[1]+'" width="1774" height="887" loading="lazy" decoding="async"><figcaption>'+generated[2]+' Ilustración de referencia, no a escala.</figcaption></figure>':'';
 return reference+'<figure class="example-illustration"><img src="../assets/ilustraciones-fluidos/'+item[0]+'.svg?v=2" alt="'+item[1]+'" width="640" height="320" loading="lazy" decoding="async"><figcaption>'+item[1]+' Dibujo esquemático, no a escala.</figcaption></figure>';
};
