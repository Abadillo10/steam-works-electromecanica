# Unidad 2: Hidrostática

Material base: MF4C.pdf, Unidad 2 (pp. 37–61 del PDF), y Capitulos/unidad2.tex de Manual_MF.zip. Solo se adaptó el material del docente y los desarrollos necesarios para explicar sus ejemplos y simulaciones.

La unidad contiene tres apartados, doce ejemplos ilustrados y tres simulaciones: manómetro en U, pared de longitud finita con distintos niveles e inclinación, y bloque flotante con peso variable. Las animaciones interpolan estados de equilibrio; no modelan tiempos de respuesta físicos, oscilaciones, vuelco ni arrastre. Se respeta la preferencia de movimiento reducido del sistema.

## Revisión del material

- Tanque: se mantiene el γ proporcionado; se elimina la atribución inconsistente de temperatura del segundo ejemplo.
- Barómetro: la lectura es 0.772 m; se declara la densidad adoptada y se distingue una columna física de la unidad convencional mmHg.
- Manómetros: se recorre cada fluido con su γ y con el signo de la diferencia vertical.
- Paredes: se usan newtons y pascales, segundo momento de área IG y un origen común para fuerzas y momentos. En el caso de dos lados se corrige el denominador de la posición de la resultante del manual.
- Superficie curva: se identifica la geometría del cuarto de círculo y el sentido de las componentes antes de sumarlas.
- Corona: los gramos se interpretan como lecturas equivalentes de masa aparente. El 70 % aproximado del manual es una fracción de volumen; no una fracción de masa. Se reportan ambas.
- Flotación: se usa I = lb³/12 para el eje longitudinal y el menor segundo momento para examinar estabilidad. GM negativo significa M debajo de G. No se calcula GM mediante superficie de flotación cuando el cuerpo está totalmente sumergido.

## Mantener y verificar

Editar data/cursos/mecanica-de-fluidos-unidad-2.json y ejecutar `node actualizar-hidrostatica.cjs`. Los dibujos y modelos están en js/hidrostatica-modelo.mjs; los controles en js/hidrostatica.js y componentes/simuladores-hidrostatica.html.

`node scripts/verificar-hidrostatica.mjs` comprueba signos, desplazamientos de columnas, integración numérica independiente de presión sobre un panel finito, transiciones de flotación y estructura de los ejemplos. El conversor de la portada se comprueba con `node scripts/verificar-conversor.mjs`.

El conversor usa factores SI y factores convencionales declarados: g convencional 9.80665 m/s² para kgf y m.c.a., galón estadounidense, hp mecánico, CV métrico, BTU IT; temperaturas absolutas, factores 20/10 para amplitud/potencia en dB y ω = 2πf. Estos factores no sustituyen las propiedades termofísicas a una temperatura particular.
