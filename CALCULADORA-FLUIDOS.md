# Calculadora de propiedades

Herramienta docente de la Unidad 1 de Mecánica de Fluidos. Los textos se adaptaron del capítulo «Propiedades de los fluidos» de Manual_MF.zip, proporcionado por el docente. Se normalizaron las unidades al SI y se corrigieron las afirmaciones de que el peso específico tiene unidades de densidad, que la pendiente newtoniana representa velocidad y que toda presión manométrica debe ser positiva. No se reprodujeron los ejemplos numéricos que requieren revisión ni los capítulos de otras unidades.

Por solicitud docente se desarrolló Flujo, con caudal volumétrico, flujo másico y continuidad. Se incorporaron 13 ejemplos didácticos con enunciado y solución paso a paso, distribuidos entre los 11 subtemas. Sus datos son enunciados educativos, no propiedades universales. Se añadió la lectura «La ley de Castelli» de Enzo Levi (pp. impresas 128–130; página 127 del visor del PDF enlazado), un reproductor del video de la UPV con enlace alternativo, y una comparación de acero, aire y agua. No se redistribuye el libro ni el video.

## Datos y condiciones

Tablas generadas con CoolProp 8.0.0, presión de 101325 Pa, paso de temperatura de 1 °C. Agua líquida: 5 a 95 °C. Aire seco: −20 a 100 °C. Densidad, viscosidad dinámica y compresibilidad isotérmica proceden del modelo HEOS correspondiente. Para agua, presión de vapor y tensión superficial se evalúan en saturación a cada temperatura.

La web interpola linealmente las propiedades base y después calcula γ = ρg, v = 1/ρ, SG = ρ/ρref y ν = μ/ρ. g = 9.80665 m/s² y ρref corresponde al agua a 4 °C y 101325 Pa. No extrapola. Las entradas vacías, no numéricas y fuera del rango retiran los resultados anteriores y muestran un mensaje. No se ofrecen aceites genéricos ni datos de gases húmedos.

La interpolación se contrastó con CoolProp a 0.25, 0.5 y 0.75 °C de cada intervalo. El error relativo máximo observado respecto al modelo fue 0.0534 % para agua y 0.000394 % para aire en las propiedades base. Estos valores describen solo la interpolación y no la incertidumbre del modelo o del fluido real.

## Actualizar

- Textos: `data/cursos/mecanica-de-fluidos-unidad-1.json`.
- Plantilla de la calculadora: `componentes/calculadora-fluidos.html`.
- Tras editar cualquiera de ellos: `node actualizar-fluidos.cjs`.
- Datos: `data/propiedades-fluidos.json`. Para regenerarlos, instalar CoolProp 8.0.0 en un entorno de trabajo y ejecutar `scripts/generar-datos-fluidos.py`; el parámetro `--library-dir` permite indicar su ubicación.
- Pruebas: `node scripts/verificar-calculadora.mjs`, `node scripts/verificar-ejemplos-fluidos.mjs` y `node verificar.cjs --archivos`.

Los ejemplos se editan en el campo `examples` de cada subtema: `statement`, `given`, `goal`, `assumptions`, `steps` (lista con `label` y `text`) y `result`. La tabla está en `comparison` del primer subtema. La lectura y el video están en `reading` y `video`. Tras editar estos campos, ejecutar `node actualizar-fluidos.cjs` y guardar también el HTML generado. Los bloques de ejercicios y solución se apilan en pantallas estrechas; la tabla tiene desplazamiento horizontal propio con acceso por teclado.

No se necesita Python ni CoolProp instalado para visitar el sitio: los datos ya están guardados y el cálculo se realiza en el navegador. No se transmiten las temperaturas introducidas.

## Fuentes

- https://coolprop.org/fluid_properties/fluids/Water.html
- https://coolprop.org/fluid_properties/fluids/Air.html
- https://coolprop.org/coolprop/HighLevelAPI.html
- https://github.com/CoolProp/CoolProp/blob/master/LICENSE (licencia MIT de la herramienta usada para generar los datos).
