/* content3.js — los 4 finales. Cada pregunta apunta (ref) a las tarjetas de teoría que la responden:
   la respuesta modelo es el contenido de esas tarjetas. */
DATA.finales = [
{ id:'f1', nombre:'Final 1', nota:'Parcial 4 · 10 de febrero de 2025 · Junín · 10 preguntas', secciones:[
  { t:'GPU', ex:[
    { n:'1.a', en:'¿Qué diferencias hay entre CPU multiprocesador y GPU? Desarrolle sobre GPU.', ref:['cpu_gpu'] },
    { n:'1.b', en:'¿Qué es un Streaming Multiprocessor? ¿Qué elementos contiene dentro?', ref:['sm'] },
    { n:'1.c', en:'¿Por qué son buenas para procesamiento de imágenes, videos e inteligencia artificial?', ref:['gpu_uso'] }] },
  { t:'Memoria', ex:[
    { n:'2.a', en:'¿Cuáles son los distintos métodos de acceso a memoria? Explique y ejemplifique.', ref:['acceso'] },
    { n:'2.b', en:'¿Qué problema existe con la memoria caché? ¿Cuáles son los protocolos de escritura de la memoria caché?', ref:['coherencia', 'escritura'], aviso:'Son dos preguntas: el problema (coherencia) y las políticas de escritura.' },
    { n:'2.c', en:'¿Qué es el principio de localidad temporal y espacial en la memoria caché?', ref:['localidad'] }] },
  { t:'DMA', ex:[
    { n:'3.a', en:'Describa las partes que conforman un DMA y explique su funcionamiento.', ref:['dma'] },
    { n:'3.b', en:'¿Qué es el DMA y qué ventajas introduce su uso respecto del resto de las técnicas? ¿Cómo está conformado internamente y cómo funciona?', ref:['dma', 'es_tipos'] }] },
  { t:'Performance', ex:[
    { n:'4.a', en:'¿Qué otras técnicas incorporan los fabricantes de procesadores para mejorar la performance además de incorporar cada vez más transistores?', ref:['perf_tecnicas'] },
    { n:'4.b', en:'¿Qué mediciones de performance existen para evaluar los procesadores? ¿Son todas objetivas? ¿Cuál es la más objetiva?', ref:['perf_medidas'] }] }
]},
{ id:'f2', nombre:'Final 2', nota:'3 secciones: Memoria (4 pts) · Bus (2 pts) · Multiprocesador (4 pts)', secciones:[
  { t:'1. Memoria', pts:'4 pts', ex:[
    { n:'1.a', en:'¿Cuáles son los distintos métodos de acceso a memoria? Explique y ejemplifique.', ref:['acceso'] },
    { n:'1.b', en:'¿Qué es la memoria caché y dónde se encuentra dependiendo del nivel?', ref:['cache_que'] },
    { n:'1.c', en:'¿Cuáles son los algoritmos de reemplazo existentes para la memoria caché?', ref:['reemplazo'] }] },
  { t:'2. Bus', pts:'2 pts', ex:[
    { n:'2.a', en:'¿Qué es un bus? Explique cuáles son los 3 buses que utilizan actualmente las arquitecturas de computadoras.', ref:['bus_que'] },
    { n:'2.b', en:'¿Qué es la conexión punto a punto de los buses? Explique y detalle sus características.', ref:['bus_p2p'] }] },
  { t:'3. Multiprocesador', pts:'4 pts', ex:[
    { n:'3.a', en:'¿Qué es una arquitectura multiprocesador?', ref:['mp_que'] },
    { n:'3.b', en:'¿Qué diferencias hay entre CPU multiprocesador y GPU? Desarrolle sobre GPU.', ref:['cpu_gpu', 'sm'] },
    { n:'3.c', en:'¿Cómo acceden a memoria los procesadores? ¿Qué problema surge con la memoria caché?', ref:['mp_memoria', 'coherencia'] },
    { n:'3.d', en:'¿Qué diferencias posee con una arquitectura multicomputador?', ref:['mp_vs_mc'] }] }
]},
{ id:'f3', nombre:'Final 3', nota:'4 secciones de 2,5 pts cada una', secciones:[
  { t:'1. Entrada / Salida', pts:'2,5 pts', ex:[
    { n:'1.a', en:'¿Cuáles son las funciones del sistema de E/S?', ref:['es_funciones'] },
    { n:'1.b', en:'¿Cuáles son los diferentes tipos de sistemas de entrada / salida? Explique.', ref:['es_tipos'] },
    { n:'1.c', en:'¿Dónde se encuentra el Acceso Directo a Memoria (DMA) y a través de qué se comunica con los demás dispositivos?', ref:['dma'] }] },
  { t:'2. Arquitectura PC y PIC', pts:'2,5 pts', ex:[
    { n:'2.a', en:'Explique y dibuje el modelo de la arquitectura Harvard.', ref:['harvard'] },
    { n:'2.b', en:'¿Cuáles son sus diferencias con la arquitectura Von Neumann? Explique.', ref:['vn_vs_harvard'] },
    { n:'2.c', en:'¿Qué ventajas en cuanto al ciclo de ejecución posee la arquitectura Harvard?', ref:['harvard_ventajas'] }] },
  { t:'3. Memoria principal vs caché', pts:'2,5 pts', ex:[
    { n:'3.a', en:'¿Qué diferencias hay entre la memoria principal y la memoria caché?', ref:['cache_vs_principal'] },
    { n:'3.b', en:'¿Cuáles son los diferentes tipos de memoria caché que existen?', ref:['cache_tipos'] },
    { n:'3.c', en:'¿Qué problemas hay con las memorias caché en una CPU multiprocesador?', ref:['coherencia'] }] },
  { t:'4. Von Neumann y ciclo de ejecución', pts:'2,5 pts', ex:[
    { n:'4.a', en:'¿Cuáles son las partes de una arquitectura Von Neumann y cómo se comunican entre sí?', ref:['vn'] },
    { n:'4.b', en:'¿Cómo es el ciclo de una instrucción? ¿Qué recorrido hace la instrucción en las diferentes partes de la arquitectura? Indique qué registros se ven involucrados.', ref:['ciclo'] },
    { n:'4.c', en:'¿Qué es el set de instrucciones? ¿Dónde piensa que se encuentra este?', ref:['isa_set'] }] }
]},
{ id:'f4', nombre:'Final 4', nota:'Del archivo arq2.docx · 5 secciones · sin puntajes indicados', secciones:[
  { t:'Arquitectura PC y PIC', ex:[
    { n:'a', en:'Explique y dibuje el modelo de la arquitectura Harvard.', ref:['harvard'] },
    { n:'b', en:'¿Cuáles son sus diferencias con la arquitectura Von Neumann? Explique.', ref:['vn_vs_harvard'] },
    { n:'c', en:'¿Qué ventajas en cuanto al ciclo de ejecución posee la arquitectura Harvard?', ref:['harvard_ventajas'] }] },
  { t:'Multiprocesador', ex:[
    { n:'a', en:'¿Qué es una arquitectura multiprocesador?', ref:['mp_que'] },
    { n:'b', en:'¿Cómo acceden a memoria los procesadores? ¿Qué problema surge con la memoria caché?', ref:['mp_memoria', 'coherencia'] },
    { n:'c', en:'¿Qué diferencias posee con una arquitectura multicomputador?', ref:['mp_vs_mc'] }] },
  { t:'Bus', ex:[
    { n:'a', en:'¿Qué es un bus? Explique cuáles son los 3 buses que utilizan actualmente las arquitecturas de computadoras.', ref:['bus_que'] },
    { n:'b', en:'¿Qué es el ancho del bus de direcciones y del bus de datos? ¿En qué influye de manera directa esta característica?', ref:['bus_ancho'] }] },
  { t:'Entrada / Salida', ex:[
    { n:'a', en:'¿Cuáles son las funciones del sistema de E/S?', ref:['es_funciones'] },
    { n:'b', en:'¿Cuáles son los diferentes tipos de entrada / salida? Explique.', ref:['es_tipos'] },
    { n:'c', en:'¿Dónde se encuentra el Acceso Directo a Memoria (DMA) y a través de qué se comunica con los demás dispositivos?', ref:['dma'] }] },
  { t:'Memoria caché', ex:[
    { n:'a', en:'¿Qué es la memoria caché y dónde se encuentra dependiendo del nivel?', ref:['cache_que'] },
    { n:'b', en:'¿Qué es el problema de coherencia de caché?', ref:['coherencia'] },
    { n:'c', en:'¿Cómo es la lectura / escritura? ¿Qué pasa en un acierto de caché o en una falla de caché?', ref:['escritura'] }] }
]}
];
