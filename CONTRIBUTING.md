# Colaboración docente

El repositorio contiene únicamente STEAM Works — Electromecánica. No requiere compartir la carpeta de Windows ni las contraseñas de GitHub.

## Acceso

El propietario invita al usuario de GitHub del otro docente desde Settings → Collaborators → Add people. El docente debe aceptar la invitación antes de editar. Un repositorio público permite consultar los archivos; la edición requiere acceso de colaborador.

## Editar una asignatura

1. Crear una rama con un nombre como `contenido/control-clasico`.
2. Editar `data/cursos/control-clasico.json` u otro archivo de asignatura.
3. Ejecutar el sitio con `node servidor.cjs` y revisar su página.
4. Abrir una pull request para que el otro docente revise el cambio antes de integrarlo en `main`.

Noticias: `data/noticias.json`. Reseñas de tesis: `data/proyectos.json`. Contacto: `data/docentes.json`.

Si se cambia el catálogo de cursos o las plantillas compartidas, ejecutar `node actualizar-componentes.cjs` y guardar también los HTML actualizados. Verificar los archivos con `node verificar.cjs --archivos`.

No publicar información personal, material con acceso restringido ni datos de estudiantes. Los perfiles y reseñas iniciales son espacios pendientes de completar.

## Publicación

GitHub Pages debe servir la rama `main`, carpeta raíz `/(root)`. Los cambios integrados en `main` actualizarán el sitio. La dirección definitiva se conocerá al crear el repositorio y habilitar Pages.
