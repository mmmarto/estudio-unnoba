/* content2.js — teoría de la guía de Arquitectura (parte 2): multiprocesadores, GPU, performance y temas de baja prioridad. */
DATA.teoria = DATA.teoria.concat([

/* ---------- 5 · MULTIPROCESADORES ---------- */
{ id:'mp_que', unit:'Multiprocesadores', prio:'alta', t:'Qué es un multiprocesador (SMP)', uso:'2 de 4 finales',
  qs:['¿Qué es una arquitectura multiprocesador?'],
  def:'<p>Un <b>multiprocesador</b> es un computador paralelo formado por <b>varios procesadores interconectados que comparten un mismo sistema de memoria</b>. Es una arquitectura de <b>memoria compartida</b>: hay <b>un único espacio de direcciones</b> para todos los procesadores y se comunican leyendo y escribiendo en esa memoria. Varios procesadores pueden acceder a un mismo módulo.</p>' +
    '<p>El caso típico es el <b>SMP (multiprocesador simétrico)</b>:</p>' + OL([
      'Hay dos o más procesadores con capacidad comparable.',
      'Comparten la misma memoria principal y el mismo sistema de E/S, y se conectan por un bus.',
      'Todos acceden a los dispositivos de E/S.',
      'Todos pueden hacer las mismas funciones (de ahí "simétrico").',
      'Un sistema operativo controla el conjunto y gestiona la interacción entre procesadores y programas.']) +
    '<p><b>Ventajas:</b> más rendimiento (si el trabajo se reparte), disponibilidad (si uno falla el sistema sigue), crecimiento incremental y escalabilidad. Cada procesador tiene su propia caché (L1, a veces L2): de ahí aparece el problema de coherencia.</p>',
  simple:'<ul><li>Varios procesadores + <b>memoria compartida</b> + un solo espacio de direcciones</li><li>SMP: 2 o más procesadores parecidos · misma memoria y E/S · por un bus · todos hacen lo mismo · un SO los controla</li><li>Ventajas: rendimiento, disponibilidad, escalabilidad</li><li>Cada uno con su caché → coherencia</li></ul>',
  ej:'',
  warn:'La filmina dice que la comunicación se basa en "paso de mensajes". Es un error: eso es de los <b>multicomputadores</b>. En el multiprocesador se comunican por la memoria compartida.',
  items:['Varios procesadores que comparten la misma memoria','Un único espacio de direcciones','SMP: procesadores comparables, misma memoria y E/S, bus, SO','Ventaja (rendimiento / disponibilidad / escalabilidad)','Se acompaña del problema de coherencia de las cachés'] },

{ id:'mp_memoria', unit:'Multiprocesadores', prio:'alta', t:'Cómo acceden a memoria los procesadores: UMA y NUMA', uso:'2 de 4 finales',
  qs:['¿Cómo acceden a memoria los procesadores de una arquitectura multiprocesador? ¿Qué problema surge con la memoria caché?'],
  def:'<p>Todos los procesadores acceden a la <b>memoria compartida</b> con lecturas y escrituras. Según el tiempo que tarda ese acceso, se clasifican:</p>' +
    TB(['', 'UMA (acceso uniforme)', 'NUMA (acceso no uniforme)'], [
      ['Acceso', 'Todos acceden a toda la memoria principal', 'Todos acceden a toda la memoria principal'],
      ['Tiempo', '<b>El mismo</b> para todos los procesadores y todas las regiones', '<b>Distinto</b> según la región: la memoria cercana es más rápida que la lejana'],
      ['Ejemplo', '<b>SMP</b> (un bus compartido)', 'Cada procesador (o nodo) tiene su memoria local, pero ve todo el espacio de direcciones'],
      ['Variante', '—', '<b>CC-NUMA</b>: NUMA con coherencia de caché entre los procesadores']]) +
    '<p>(También existe COMA, con memorias que funcionan como cachés.)</p>' +
    '<p><b>Problema con las cachés:</b> cada procesador tiene su caché, así que el mismo dato puede estar en varias a la vez. Si uno lo modifica, las demás copias quedan desactualizadas: es el <b>problema de coherencia</b> (ver su tarjeta). Se resuelve con protocolos de coherencia por hardware (snoopy, directorio, MESI) y mecanismos de sincronización.</p>',
  simple:'<ul><li>Acceden a una memoria compartida</li><li><b>UMA</b>: mismo tiempo para todos · es el SMP</li><li><b>NUMA</b>: el tiempo depende de la región · CC-NUMA tiene coherencia</li><li>Problema: coherencia de cachés → snoopy / directorio / MESI</li></ul>',
  ej:'',
  warn:'Cuando preguntan "¿cómo acceden a memoria?" y "¿qué problema surge con la caché?" juntos, son <b>dos</b> respuestas. La segunda es la tarjeta de coherencia: no la dejes sin contestar.',
  items:['Acceden a memoria compartida con lecturas y escrituras','UMA: mismo tiempo de acceso (SMP)','NUMA: tiempo según la región de memoria','Problema: coherencia de caché (copias desactualizadas)','Cómo se resuelve (protocolos de coherencia)'] },

{ id:'mp_vs_mc', unit:'Multiprocesadores', prio:'alta', t:'Multiprocesador vs multicomputador (clúster)', uso:'2 de 4 finales',
  qs:['¿Qué diferencias posee con una arquitectura multicomputadora?'],
  def:'<p>Un <b>multicomputador (clúster)</b> es un grupo de computadoras completas, interconectadas, que trabajan juntas como un recurso de cómputo unificado. Cada computadora es un <b>nodo</b>: tiene su propio procesador, su propia memoria y su E/S.</p>' +
    TB(['', 'Multiprocesador (SMP)', 'Multicomputador (clúster)'], [
      ['Memoria', '<b>Compartida</b>, un único espacio de direcciones', '<b>Cada nodo tiene la suya</b> (memoria distribuida)'],
      ['Comunicación', 'Leyendo y escribiendo la memoria compartida (bus)', 'Por <b>paso de mensajes</b> por una red o conexión de alta velocidad'],
      ['Sistema operativo', 'Uno solo para todo el sistema', 'Uno por nodo, más software que coordina'],
      ['Coherencia de caché', 'Es un problema central', 'No hay: no se comparten datos por memoria'],
      ['Escalabilidad', 'Limitada por el bus y la memoria compartida', 'Mucho mejor: se agregan nodos'],
      ['Programación', 'Más simple (memoria común)', 'Más trabajo: hay que repartir datos y coordinar nodos'],
      ['Ejemplo', 'Servidor SMP, CPU multinúcleo', 'Clúster de servidores, supercomputadora']]) +
    '<p><b>Ventajas del clúster:</b> escalabilidad absoluta e incremental, alta disponibilidad (si un nodo falla, los otros siguen) y mejor relación precio / rendimiento (usa computadoras comunes).</p>',
  simple:'<ul><li>Multiprocesador: <b>memoria compartida</b> · un SO · coherencia · escala poco</li><li>Multicomputador: <b>memoria por nodo</b> · mensajes por red · un SO por nodo · escala mucho</li><li>Clúster: alta disponibilidad, buena relación precio / rendimiento</li><li>Contra: programación y coordinación más difíciles</li></ul>',
  ej:'',
  warn:'La palabra clave es <b>memoria</b>: compartida vs propia de cada nodo. Si escribís eso y los mensajes por red, tenés el corazón de la respuesta.',
  items:['Multiprocesador: memoria compartida, un espacio de direcciones','Multicomputador: cada nodo con su propia memoria','Comunicación por memoria vs por mensajes en red','Escalabilidad / disponibilidad del clúster','Dificultad de programación del multicomputador'] },

/* ---------- 6 · GPU ---------- */
{ id:'cpu_gpu', unit:'GPU', prio:'alta', t:'CPU multiprocesador vs GPU', uso:'2 de 4 finales',
  qs:['Una CPU es un multiprocesador de propósito general. Desarrolle la arquitectura de una GPU.'],
  def:'<p>La <b>CPU</b> es un multiprocesador de <b>propósito general</b>: sirve para cualquier tipo de cálculo, tiene pocos núcleos potentes y rápidos, mucha caché y control sofisticado, y está optimizada para <b>latencia</b>. La <b>GPU</b> es un multiprocesador de <b>propósito específico</b>: está optimizada para trabajar con <b>grandes cantidades de datos aplicando las mismas operaciones una y otra vez</b>. Tiene cientos o miles de núcleos más simples y está optimizada para <b>rendimiento (throughput)</b>.</p>' +
    TB(['', 'CPU', 'GPU'], [
      ['Propósito', 'General', 'Específico: gráficos y cálculo paralelo'],
      ['Núcleos', 'Pocos y potentes', 'Muchísimos y simples'],
      ['Paralelismo', 'Poco paralelismo, hilos pesados', 'Paralelismo masivo, miles de hilos livianos (modelo SIMD / SIMT)'],
      ['Caché y control', 'Mucha caché y lógica de control compleja', 'Poca caché por núcleo; más espacio para unidades de cálculo'],
      ['Optimiza', 'Latencia: terminar rápido una tarea', 'Rendimiento: muchos datos a la vez']]) +
    '<p><b>Arquitectura de una GPU (de afuera hacia adentro):</b></p>' + UL([
      '<b>Interfaz con el host</b> (PCI Express) y un <b>GigaThread Engine</b> que reparte el trabajo.',
      '<b>GPC</b> (Graphics Processing Cluster): bloques que contienen un Raster Engine y varios SM.',
      '<b>SM</b> (Streaming Multiprocessor): la unidad de cómputo, con muchos <b>cores CUDA</b>.',
      '<b>Caché L2</b> compartida y <b>controladores de memoria</b> hacia la memoria gráfica (DRAM).']) +
    '<p>Los hilos se agrupan en <b>warps de 32 hilos</b> que ejecutan la misma instrucción a la vez.</p>',
  simple:'<ul><li>CPU: propósito general · pocos núcleos potentes · latencia</li><li>GPU: propósito específico · miles de núcleos simples · rendimiento · mismas operaciones sobre muchos datos</li><li>Estructura: PCIe → GigaThread → <b>GPC → SM → cores CUDA</b> · L2 · memoria</li><li>Hilos en <b>warps de 32</b></li></ul>',
  ej:'<p>Pensá en pintar un cuadro de 2 millones de píxeles: una CPU los hace de a poco con mucha inteligencia por píxel; una GPU hace miles a la vez, todos con la misma regla.</p>',
  warn:'Si piden "desarrollar la arquitectura de la GPU", no alcanza con "tiene muchos núcleos": tenés que bajar a GPC → SM → CUDA cores, y qué hay en el SM (próxima tarjeta).',
  items:['CPU de propósito general vs GPU de propósito específico','Muchos núcleos simples, paralelismo masivo','Estructura GPC → SM → cores CUDA','Warps de 32 hilos','Caché L2 y controladores de memoria'] },

{ id:'sm', unit:'GPU', prio:'alta', t:'Streaming Multiprocessor (SM) y qué contiene', uso:'2 de 4 finales',
  qs:['¿Qué es un Streaming Multiprocessor? ¿Qué elementos contiene dentro?'],
  def:'<p>Un <b>Streaming Multiprocessor (SM)</b> es la unidad de cómputo de la GPU: un bloque con varios núcleos (<b>cores CUDA</b>) que ejecutan en paralelo, más todo lo que necesitan para planificar y alimentar a esos núcleos. Contiene:</p>' + UL([
    '<b>Cores CUDA:</b> cada uno ejecuta una instrucción de un hilo (entera o de punto flotante) por ciclo. Cada core tiene una <b>ALU entera</b> y una <b>FPU</b> (unidad de punto flotante).',
    '<b>Warp schedulers y unidades de despacho (dispatch):</b> organizan los warps (grupos de 32 hilos) y despachan sus instrucciones. Hay dos por SM, así que dos warps pueden ejecutarse a la vez.',
    '<b>Unidades LOAD / STORE:</b> calculan las direcciones de datos origen o destino y leen o guardan en caché o DRAM.',
    '<b>SFU (Special Function Units):</b> ejecutan seno, coseno, inversa y raíz cuadrada.',
    '<b>Archivo de registros y memoria compartida / caché L1.</b>',
    '<b>Unidades de textura</b> y <b>PolyMorph Engine</b> (procesamiento gráfico: vértices, teselación, transformación de vista).']),
  simple:'<ul><li>SM = unidad de cómputo de la GPU con muchos <b>cores CUDA</b> (ALU entera + FPU)</li><li><b>Warp schedulers</b> + dispatch</li><li><b>LOAD/STORE</b> · <b>SFU</b> (seno, coseno, raíz)</li><li><b>Registros</b> y <b>caché L1 / memoria compartida</b></li><li><b>Texturas</b> y <b>PolyMorph Engine</b></li></ul>',
  ej:'<p>En la filmina el SM de Fermi tiene 32 cores, 16 unidades LOAD/STORE y 4 SFU; un archivo de 32.768 registros de 32 bits y 64 KB de memoria compartida / L1. Los números no hacen falta.</p>',
  warn:'No definas el SM como "un core". Es un <b>conjunto</b> de cores con su planificación, registros y caché.',
  items:['Unidad de cómputo de la GPU con varios cores CUDA en paralelo','Cores: ALU entera y FPU','Warp schedulers y unidades de despacho (warps de 32 hilos)','Unidades LOAD/STORE y SFU','Registros y caché L1 / memoria compartida','Unidades de textura y PolyMorph Engine'] },

{ id:'gpu_uso', unit:'GPU', prio:'alta', t:'Por qué las GPU sirven para imágenes, video e IA', uso:'2 de 4 finales',
  qs:['¿Por qué las GPU son buenas para procesar imágenes, video e inteligencia artificial?'],
  def:'<p>Porque estas tareas aplican <b>la misma operación a enormes cantidades de datos independientes</b>, que es exactamente lo que una GPU hace mejor:</p>' + UL([
    '<b>Procesamiento paralelo masivo:</b> miles de núcleos trabajan a la vez, uno por píxel, por elemento de la matriz o por neurona.',
    '<b>Modelo SIMD / SIMT:</b> una instrucción sobre muchos datos (los 32 hilos de un warp).',
    '<b>Cálculo matemático rápido:</b> las matrices y las <b>convoluciones</b> son la base tanto de los filtros de imagen y video como de las redes neuronales.',
    '<b>Alta eficiencia por operación</b> (energía y costo) en tareas repetitivas.']) +
    '<p><b>Ejemplo:</b> un filtro de convolución sobre una imagen aplica el mismo cálculo a cada píxel de forma independiente: la GPU reparte los píxeles entre sus núcleos. Una imagen de 1920×1080 son 2.073.600 píxeles; con 16 SM de 32 cores (512 en total) hacen falta unos 4.050 ciclos, mientras que una CPU de 4 núcleos necesita unos 518.400 (en el simulador de la pestaña Simuladores).</p>',
  simple:'<ul><li>Misma operación sobre muchos datos independientes</li><li>Paralelismo masivo (miles de núcleos) · SIMD</li><li>Matrices y convoluciones → filtros e IA</li><li>Eficiente en energía y costo por operación</li></ul>',
  ej:'',
  warn:'No digas que "la GPU es más rápida que la CPU" a secas: es más rápida en tareas <b>paralelas y repetitivas</b>. En tareas secuenciales o con mucha lógica, gana la CPU.',
  items:['Misma operación sobre muchos datos independientes (SIMD)','Paralelismo masivo con miles de núcleos','Matrices y convoluciones, base de imágenes y redes neuronales','Eficiencia por operación'] },

/* ---------- 7 · PERFORMANCE ---------- */
{ id:'perf_tecnicas', unit:'Performance', prio:'media', t:'Técnicas para mejorar la performance (además de más transistores)', uso:'1 de 4 finales',
  qs:['¿Qué otras técnicas incorporan los fabricantes de procesadores para mejorar la performance además de incorporar cada vez más transistores?'],
  def:'<p>Mientras los fabricantes logran chips con más transistores, los diseñadores incorporan técnicas cada vez más elaboradas:</p>' + UL([
    '<b>Pipelining (segmentación):</b> se divide la ejecución de una instrucción en etapas y se superponen varias instrucciones a la vez, cada una en una etapa distinta.',
    '<b>Predicción de ramas:</b> el procesador predice qué instrucciones se van a procesar a continuación para no detener el pipeline.',
    '<b>Ejecución superescalar:</b> emitir más de una instrucción por ciclo de reloj.',
    '<b>Análisis del flujo de datos:</b> detecta qué instrucciones dependen de los resultados de otras para armar un orden de ejecución optimizado.',
    '<b>Ejecución especulativa:</b> con la predicción de ramas y el análisis de flujo de datos, ejecuta instrucciones antes de que les toque, y descarta el resultado si no era el camino.',
    '<b>Multihilo (SMT / hyper-threading) y multinúcleo:</b> varios hilos por núcleo y varios núcleos en un chip.',
    '<b>Cachés más grandes y multinivel.</b>']),
  simple:'<ul><li><b>Pipeline</b> · <b>predicción de ramas</b> · <b>superescalar</b></li><li><b>Flujo de datos</b> · <b>ejecución especulativa</b></li><li><b>Multihilo</b> y <b>multinúcleo</b> · <b>cachés</b> multinivel</li></ul>',
  ej:'',
  warn:'Las cinco primeras son las de la filmina; las otras son complemento. Aprendé las cinco con una frase cada una.',
  items:['Pipelining','Predicción de ramas','Ejecución superescalar','Análisis del flujo de datos / ejecución especulativa','Multihilo / multinúcleo / cachés'] },

{ id:'perf_medidas', unit:'Performance', prio:'media', t:'Mediciones de performance y cuál es la más objetiva', uso:'1 de 4 finales',
  qs:['¿Qué mediciones de performance existen para evaluar los procesadores? ¿Son todas objetivas? ¿Cuál es la más objetiva?'],
  def:'<p><b>Tiempo de ejecución:</b> T = Ic × CPI × τ, con Ic = cantidad de instrucciones, CPI = ciclos por instrucción y τ = tiempo de ciclo (1 / frecuencia). Si hay accesos a memoria: T = Ic × [p + (m × k)] × τ.</p>' + UL([
    '<b>MIPS:</b> millones de instrucciones por segundo. MIPS = f / (CPI × 10<sup>6</sup>).',
    '<b>MFLOPS:</b> millones de operaciones de punto flotante por segundo; sirve para cálculo científico.',
    '<b>Benchmarks (SPEC):</b> conjuntos de programas reales de referencia que se ejecutan en la máquina y se comparan con una de referencia.',
    '<b>Eficiencia energética</b> y tiempo de ejecución de un programa concreto.']) +
    '<p><b>¿Son todas objetivas?</b> No. MIPS depende del tipo de instrucciones y del conjunto de instrucciones (un CISC y un RISC no son comparables), y MFLOPS solo sirve para punto flotante. <b>La más objetiva es SPEC</b>: mide el tiempo con programas reales y comparables, no una cifra teórica del procesador.</p>',
  simple:'<ul><li><b>T = Ic × CPI × τ</b> · <b>MIPS = f / (CPI × 10⁶)</b> · <b>MFLOPS</b></li><li><b>SPEC</b>: programas de referencia</li><li>No todas son objetivas: MIPS cambia según el set de instrucciones</li><li>Más objetiva: <b>SPEC</b> (tiempo con programas reales)</li></ul>',
  ej:'<p>Un procesador de 2 GHz con CPI = 2 hace 2×10⁹ / 2 = 1.000 MIPS. Para un programa de 10<sup>9</sup> instrucciones, T = 10<sup>9</sup> × 2 × 0,5 ns = 1 s. Probalo en la calculadora.</p>',
  warn:'Un final resuelto contesta "Geekbench" y "tiempo de ejecución de programas reales" como lo más objetivo. La filmina dice <b>SPEC</b>.',
  items:['MIPS','MFLOPS','Benchmarks estándar (SPEC)','Tiempo de ejecución (T = Ic × CPI × τ)','No todas son objetivas y por qué','La más objetiva: SPEC'] },

/* ---------- 8 · BAJA PRIORIDAD ---------- */
{ id:'riscs', unit:'ISA', prio:'baja', t:'CISC vs RISC', uso:'0 de 4 finales',
  qs:['(No apareció en estos finales, pero está en el material.)'],
  def: TB(['', 'CISC', 'RISC'], [
    ['Instrucciones', 'Muchas y complejas', 'Pocas y simples'],
    ['Formato', 'Longitud variable', 'Longitud fija'],
    ['Acceso a memoria', 'Muchas instrucciones operan sobre memoria', 'Solo <b>LOAD</b> y <b>STORE</b> tocan la memoria; el resto, entre registros'],
    ['Registros', 'Pocos', 'Muchos'],
    ['Control', 'Microprogramada', 'Cableada, ciclo corto, pipeline eficiente'],
    ['Programa', 'Más corto', 'Más largo'],
    ['Ejemplos', 'x86 (Intel, AMD)', 'ARM, MIPS, RISC-V']]),
  simple:'<ul><li>CISC: complejas, longitud variable, opera en memoria</li><li>RISC: simples, longitud fija, LOAD/STORE, muchos registros, pipeline</li><li>x86 = CISC · ARM = RISC</li></ul>',
  ej:'',
  warn:'No lo confundas con Von Neumann / Harvard: CISC / RISC es sobre el <b>set de instrucciones</b>.',
  items:['CISC: instrucciones complejas y variables','RISC: instrucciones simples, LOAD/STORE','Ejemplos'] },

{ id:'mem_interna_externa', unit:'Memoria y caché', prio:'baja', t:'Memoria interna y externa', uso:'0 de 4 finales',
  qs:['(No apareció en estos finales, pero está en el material.)'],
  def:'<p>La <b>memoria interna</b> es la que la CPU accede directamente: registros, caché y memoria principal (RAM / ROM). Es la más rápida, pero cara y de menor capacidad (y la RAM, volátil).</p><p>La <b>memoria externa</b> es el almacenamiento secundario: discos duros, SSD, cintas, discos ópticos. Es <b>no volátil</b>, de mucha capacidad y más barata por bit, pero mucho más lenta. La CPU accede a ella a través del sistema de E/S, no directamente.</p><p>La jerarquía de memoria: registros → caché → memoria principal → almacenamiento externo. Hacia abajo: más capacidad, menos costo por bit, más tiempo de acceso.</p>',
  simple:'<ul><li>Interna: registros, caché, RAM · rápida, cara, chica</li><li>Externa: disco, SSD, cinta · no volátil, grande, lenta, por E/S</li><li>Jerarquía: más abajo = más capacidad, menos costo, más lento</li></ul>',
  ej:'',
  warn:'',
  items:['Interna: registros, caché, memoria principal','Externa: discos, SSD, cinta','Diferencias: velocidad, capacidad, costo, volatilidad'] }
]);
