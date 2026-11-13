# STEAM Works — Electromecánica

Del conocimiento a la aplicación. Sitio estático modular con diez asignaturas. Los contenidos académicos, noticias y perfiles son provisionales; no se presentan como programas oficiales.

## Revisión local

Desde esta carpeta ejecuta `node servidor.cjs` y visita http://127.0.0.1:8087. También puedes usar `python -m http.server 8087 --bind 127.0.0.1`. Detén el servidor con Ctrl+C. La barra superior y sus diez enlaces están guardados en el HTML y su interacción usa un script clásico, por lo que también aparecen al abrir el archivo directamente. Los contenidos dinámicos requieren HTTP.

## Editar contenidos

- Noticias: edita data/noticias.json; cada entrada tiene id único, title, date (AAAA-MM-DD), description y body. El detalle se genera automáticamente. Los ejemplos están marcados como demostrativos.
- Asignaturas: edita únicamente data/cursos/<identificador>.json para cambiar sus nueve secciones. Cada curso tiene su HTML independiente en cursos/. El catálogo compartido es data/cursos.json.
- Proyectos: edita data/proyectos.json. Cada ficha de tesis incluye title (título), review (reseña breve), technologies (lista), participants (lista), image (ruta o null) y links (lista de objetos con label y url). Los campos se muestran automáticamente cuando tienen contenido. Las fichas iniciales son áreas disponibles, no tesis reales.
- Docentes: edita data/docentes.json. Los campos name, specialty, email, image y links se muestran automáticamente. Verifica autorización y exactitud antes de incorporar datos reales. No hay correos ficticios ni formulario de envío.
- Navegación y pie: edita las plantillas compartidas componentes/navbar.html y componentes/footer.html y ejecuta `node actualizar-componentes.cjs`. Este pequeño actualizador reutiliza las plantillas y el catálogo para guardar la barra completa y sus diez enlaces dentro de las 14 páginas. No hay que editarla manualmente en cada página ni descargarla al abrir el sitio. Las rutas HTML son relativas y las de datos se calculan desde import.meta.url para admitir subcarpetas de GitHub Pages. El menú funciona con js/navigation-ui.js, independientemente de los módulos de contenido.

## Menú Cursos y accesibilidad

Mouse: pasar sobre Cursos abre las diez asignaturas; el panel es contiguo al botón. Clic alterna la apertura. Teclado: Tab llega al botón; Enter o Espacio abren; Tab recorre enlaces; flechas arriba/abajo, Inicio y Fin permiten recorrer el panel; Escape cierra y devuelve el foco. Táctil: tocar Cursos abre, tocar otra vez cierra y tocar fuera cierra. Se usa un patrón de navegación desplegable con enlaces nativos. Hay foco visible, enlace para saltar al contenido y soporte para movimiento reducido.

## GitHub Pages (solo instrucciones, no publicado)

Crea un repositorio dedicado y sube el contenido de esta carpeta, con index.html en la raíz. En Settings → Pages selecciona Deploy from a branch, la rama main y /(root). Evita incluir las carpetas ajenas que ya existían aquí. El archivo .nojekyll permite servir los archivos directamente. No se requiere compilación ni dependencias. Comprueba la URL de la subruta después de publicar.

## Colaboración

Cada docente crea una rama por tarea, por ejemplo contenido/control-clasico, edita su JSON y revisa el sitio local. Después realiza un commit, sube la rama y abre una solicitud de incorporación (pull request). El otro docente revisa y aprueba antes de integrar a main. Coordinen cambios en archivos compartidos para evitar conflictos. No almacenen credenciales ni datos personales sin autorización.

## Estructura

index.html; cursos/ (10 páginas); proyectos/; contacto/; noticias/; componentes/; css/; js/; data/ (catálogo, 10 cursos, noticias, proyectos y docentes); assets/icons/logo.svg. Los recursos externos y bibliografía se incorporarán tras revisión docente.

