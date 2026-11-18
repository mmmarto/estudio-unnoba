# Estudio UNNOBA

Guías de estudio por materia, publicadas con GitHub Pages.

- `index.html`: índice con las materias.
- `redes/`: guía del 2.º parcial de Redes. El código fuente está en `redes/src/` y `redes/index.html` se genera con `python3 redes/build.py`.
- `edd/`: guía del final de Estructura de Datos. El código fuente está en `edd/src/` (`content*.js` es el material, `app.js` la interfaz, `lib.js` los algoritmos de los simuladores) y `edd/index.html` se genera con `python3 edd/build.py`. La fecha de la mesa se carga en `app.js` (`EXAM` y `MESA_TXT`).
- `arq/`: guía del final de Organización y Arquitectura de Computadoras. El código fuente está en `arq/src/` (`content*.js` es el material, `app.js` la interfaz, `lib.js` los algoritmos de los simuladores) y `arq/index.html` se genera con `python3 arq/build.py`. La fecha de la mesa se carga en `app.js` (`EXAM` y `MESA_TXT`).
- `ipoo/`: guía de IPOO (copia del artifact; las funciones que usan el runtime de Claude, como la corrección con IA y las preguntas compartidas, no funcionan fuera de claude.ai).

Para editar: cambiar los archivos de `src/` y volver a correr el build antes de subir.
