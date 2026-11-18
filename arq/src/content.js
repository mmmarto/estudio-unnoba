/* content.js — teoría de la guía de Arquitectura (parte 1). Editar acá para agregar/cambiar material.
   Cada tarjeta de DATA.teoria es UNA pregunta de final: def = respuesta modelo, simple = esqueleto para memorizar,
   ej = ejemplo o dibujo, warn = trampa, items = lo que tiene que aparecer (lo usa el simulacro). */
var DATA = {};
function EC(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function UL(a) { return '<ul>' + a.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>'; }
function OL(a) { return '<ol>' + a.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>'; }
function TB(head, rows) {
  return '<div class="tbl"><table><thead><tr>' + head.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr></thead><tbody>' +
    rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return i === 0 ? '<td><b>' + c + '</b></td>' : '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
}

/* ============ DIBUJOS ============ */
var SVG_VN = '<div class="dg"><svg class="dgm" viewBox="0 0 640 250" role="img" aria-label="Arquitectura Von Neumann: CPU, una sola memoria y E/S unidas por un bus del sistema">' +
  '<rect class="dg-box" x="16" y="24" width="220" height="200" rx="10"/><text class="dg-h" x="126" y="46">CPU</text>' +
  '<rect class="dg-in" x="36" y="62" width="180" height="40" rx="6"/><text class="dg-t" x="126" y="87">Unidad de control</text>' +
  '<rect class="dg-in" x="36" y="112" width="180" height="40" rx="6"/><text class="dg-t" x="126" y="137">ALU</text>' +
  '<rect class="dg-in" x="36" y="162" width="180" height="40" rx="6"/><text class="dg-t" x="126" y="187">Registros</text>' +
  '<rect class="dg-mem" x="410" y="24" width="214" height="104" rx="10"/><text class="dg-h" x="517" y="52">Memoria principal</text><text class="dg-t" x="517" y="80">UNA sola memoria</text><text class="dg-t" x="517" y="102">instrucciones + datos</text>' +
  '<rect class="dg-io" x="410" y="148" width="214" height="76" rx="10"/><text class="dg-h" x="517" y="192">Sistema de E/S</text>' +
  '<line class="dg-bus" x1="322" y1="34" x2="322" y2="214"/><line class="dg-ln" x1="236" y1="124" x2="322" y2="124"/><line class="dg-ln" x1="322" y1="76" x2="410" y2="76"/><line class="dg-ln" x1="322" y1="186" x2="410" y2="186"/>' +
  '<text class="dg-lbl" x="322" y="14">Bus del sistema</text><text class="dg-sm" x="332" y="236" text-anchor="start">datos · direcciones · control</text></svg></div>';
var SVG_HV = '<div class="dg"><svg class="dgm" viewBox="0 0 640 270" role="img" aria-label="Arquitectura Harvard: CPU con memoria de instrucciones y memoria de datos separadas, cada una con su bus">' +
  '<rect class="dg-box" x="16" y="30" width="210" height="190" rx="10"/><text class="dg-h" x="121" y="52">CPU</text>' +
  '<rect class="dg-in" x="34" y="66" width="174" height="36" rx="6"/><text class="dg-t" x="121" y="89">Unidad de control</text>' +
  '<rect class="dg-in" x="34" y="112" width="174" height="36" rx="6"/><text class="dg-t" x="121" y="135">ALU</text>' +
  '<rect class="dg-in" x="34" y="158" width="174" height="36" rx="6"/><text class="dg-t" x="121" y="181">Registros</text>' +
  '<rect class="dg-mem" x="424" y="14" width="200" height="84" rx="10"/><text class="dg-h" x="524" y="42">Memoria de instrucciones</text><text class="dg-t" x="524" y="66">ROM / PROM / EEPROM / flash</text><text class="dg-sm" x="524" y="86">no volátil</text>' +
  '<rect class="dg-mem2" x="424" y="150" width="200" height="84" rx="10"/><text class="dg-h" x="524" y="178">Memoria de datos</text><text class="dg-t" x="524" y="202">RAM (SRAM)</text><text class="dg-sm" x="524" y="222">lectura y escritura</text>' +
  '<line class="dg-bus" x1="226" y1="70" x2="424" y2="56"/><text class="dg-lbl" x="320" y="40">Bus de instrucciones</text>' +
  '<line class="dg-bus2" x1="226" y1="186" x2="424" y2="192"/><text class="dg-lbl" x="322" y="216">Bus de datos</text>' +
  '<rect class="dg-io" x="16" y="232" width="210" height="30" rx="8"/><text class="dg-t" x="121" y="252">Sistema de E/S</text></svg></div>';

/* ============ QUÉ TOMAN (resumen de 4 finales) ============ */
DATA.toman = [
  ['Memoria y caché', 'alta', 'Métodos de acceso, qué es la caché y dónde está según el nivel, algoritmos de reemplazo, localidad, lectura y escritura (acierto y falla), políticas de escritura, memoria principal vs caché, tipos de caché', '4 de 4'],
  ['Coherencia de caché', 'alta', 'El problema de coherencia (casi siempre pegado a otra pregunta: multiprocesador, memoria o políticas de escritura), cómo se resuelve, snoopy y MESI', '4 de 4'],
  ['E/S y DMA', 'alta', 'Funciones del sistema de E/S, tipos (programada, por interrupción, DMA), partes del DMA, ventajas, dónde está y cómo se comunica', '3 de 4'],
  ['Harvard y Von Neumann', 'alta', 'Dibujo de Harvard, diferencias con Von Neumann, ventajas en el ciclo de ejecución, partes de Von Neumann', '2 de 4'],
  ['Multiprocesador y multicomputador', 'alta', 'Qué es un multiprocesador, cómo acceden a memoria (UMA / NUMA), diferencias con un multicomputador (clúster)', '2 de 4'],
  ['Bus', 'alta', 'Qué es un bus y los 3 buses, conexión punto a punto, ancho del bus de direcciones y de datos', '2 de 4'],
  ['GPU', 'alta', 'CPU multiprocesador vs GPU (desarrollar GPU), qué es un Streaming Multiprocessor y qué tiene, por qué sirven para imágenes, video e IA', '2 de 4'],
  ['Performance', 'media', 'Técnicas para mejorar la performance además de sumar transistores; mediciones y cuál es la más objetiva', '1 de 4'],
  ['Ciclo de instrucción y set de instrucciones', 'media', 'Recorrido de una instrucción con los registros que intervienen; qué es el set de instrucciones y dónde está', '1 de 4'],
  ['CISC / RISC, memoria interna y externa', 'baja', 'Nunca apareció en estos finales. Está en el material, por eso hay una tarjeta corta de cada uno', '0 de 4']
];

/* ============ PLAN ============ */
DATA.plan = [
  ['Día 1', 'Memoria y caché', 'Es el tema que no falta nunca. Tarjetas 05 a 12: acceso, caché y niveles, principal vs caché, tipos, reemplazo, escritura, localidad. Una tarjeta, cerrás, escribís de memoria, comparás.'],
  ['Día 2', 'Coherencia y multiprocesadores', 'Tarjetas de coherencia, MESI, multiprocesador, cómo acceden a memoria y multicomputador. Dedicale 15 minutos al simulador de MESI: la coherencia aparece en los 4 finales.'],
  ['Día 3', 'E/S, DMA y buses', 'Funciones, técnicas de E/S, DMA completo (partes, ventajas, dónde está), bus, ancho y punto a punto.'],
  ['Día 4', 'Von Neumann, Harvard, ciclo y GPU', 'Dibujá Harvard y Von Neumann de memoria. Hacé andar el simulador del ciclo de instrucción. GPU: CPU vs GPU, SM y por qué sirve para imágenes.'],
  ['Día 5', 'Simulacro', 'Un simulacro de 4 secciones, unos 10 minutos por consigna, escribiendo a mano. Después corregí con los checks y anotá qué se cayó.'],
  ['Día 6', 'Barrido final', 'Pestaña Esqueletos de punta a punta (tapás, escribís, destapás), performance y las trampas. Las secciones valen todo o nada: ningún tema se queda en blanco.']
];

/* ============ ERRORES QUE CIRCULAN ============ */
DATA.errores = [
  ['Harvard, en la filmina y en finales resueltos', 'Una "memoria principal" que guarda instrucciones y datos (es la descripción de Von Neumann copiada).', 'Harvard tiene <b>dos memorias separadas</b>: ROM / flash para las instrucciones y RAM para los datos, cada una con su bus.'],
  ['Escritura inmediata y posterior, en la filmina de multiprocesadores', 'Las dos definiciones están cruzadas.', '<b>Inmediata (write-through)</b> escribe en la caché <b>y</b> en la memoria. <b>Posterior (write-back)</b> escribe solo en la caché y la memoria se actualiza al reemplazar el bloque. La filmina de memoria lo tiene bien.'],
  ['PC e IR, en la filmina del procesador', 'Describe el IR como la dirección de la próxima instrucción.', 'El <b>PC</b> tiene la dirección de la próxima instrucción. El <b>IR</b> guarda la <b>instrucción</b> que se está ejecutando (así lo muestra el ciclo de extracción: IR ← MBR).'],
  ['Performance, en un final resuelto', 'Nombra Geekbench y dice que lo más objetivo es el tiempo de ejecución de programas reales.', 'La filmina nombra <b>SPEC</b>: un conjunto de programas de referencia. Esa es la respuesta.'],
  ['Banco de preguntas', 'Write-through y write-back como "protocolos de coherencia".', 'Son <b>políticas de escritura</b>. Los protocolos de coherencia son directorio, vigilancia (snoopy) y MESI.'],
  ['Banco de preguntas', 'Acceso directo: "se accede directamente al dato".', 'Directo: se salta a la zona y se busca <b>secuencialmente</b> dentro (disco). El que va directo a una celda en tiempo constante es el <b>aleatorio</b> (RAM).'],
  ['DMA', 'Que el DMA es una interrupción, o que la CPU guarda contexto.', 'El DMA <b>roba ciclos de bus</b>: la CPU solo hace una pausa de un ciclo, no guarda contexto. Interrumpe a la CPU una sola vez, al final de la transferencia.'],
  ['DMA', 'Lista de partes incompleta (solo registros).', 'Registro de direcciones, registro contador de datos, registro de datos y lógica de control (con las líneas de pedido de bus, lectura / escritura e interrupción).'],
  ['DCA', 'Que mejora entrada y salida.', 'La mejora del acceso directo a caché es <b>solo para salida</b>. La entrada funciona como en DMA y la L3 no interviene.'],
  ['Multiprocesador y multicomputador', 'En una filmina el multiprocesador usa "paso de mensajes".', 'Multiprocesador = <b>memoria compartida</b>, un solo espacio de direcciones. Multicomputador (clúster) = cada nodo con su memoria, se comunican por <b>mensajes</b> por una red.']
];

/* ============ TARJETAS DE TEORÍA ============ */
DATA.teoria = [

/* ---------- 1 · VON NEUMANN Y HARVARD ---------- */
{ id:'harvard', unit:'Von Neumann y Harvard', prio:'alta', t:'Arquitectura Harvard: qué es y cómo se dibuja', uso:'2 de 4 finales',
  qs:['Explique y dibuje el modelo de la Arquitectura Harvard.'],
  def:'<p>La arquitectura Harvard usa <b>dispositivos de almacenamiento físicamente separados para las instrucciones y para los datos</b>, cada uno con su propio bus. Sus partes:</p>' + UL([
    '<b>CPU:</b> unidad de control, ALU y registros. La unidad de control lee la instrucción de la memoria de instrucciones, genera las señales para obtener los operandos de la memoria de datos, ejecuta con la ALU y guarda el resultado en la memoria de datos.',
    '<b>Memoria de instrucciones:</b> guarda el programa. Es <b>no volátil</b> (ROM, PROM, EPROM, EEPROM o flash) y el tamaño de su palabra se adapta al ancho de las instrucciones.',
    '<b>Memoria de datos:</b> guarda los datos que cambian continuamente, por eso es <b>RAM</b> (habitualmente SRAM). Si hay datos que deben quedar guardados (configuración), se usa EEPROM o flash.',
    '<b>Buses separados:</b> uno para instrucciones y otro para datos.',
    '<b>Sistema de E/S.</b>']) + '<p>Se usa en microcontroladores (PIC, Arduino) y sistemas de propósito específico: electrodomésticos, telecomunicaciones, automóviles, audio y video, robótica.</p>',
  simple:'<ul><li>Memoria de <b>instrucciones</b> y memoria de <b>datos</b> separadas</li><li>Instrucciones → ROM / flash (no volátil)</li><li>Datos → RAM (lectura y escritura)</li><li>Un bus para cada memoria</li><li>CPU = UC + ALU + registros · más E/S</li><li>Propósito específico: microcontroladores, PIC</li></ul>',
  ej: SVG_HV + '<p>Si te acordás: el PIC16F84A tiene memoria de instrucciones flash de 1024 palabras de 14 bits y memoria de datos SRAM de 68 palabras de 8 bits. No hace falta para aprobar.</p>',
  warn:'<b>Harvard no tiene una memoria principal única.</b> La filmina repite por error el texto de Von Neumann ("memoria principal que almacena instrucciones y datos") y varios finales resueltos lo copian. Instrucciones en ROM, datos en RAM.',
  items:['Memorias físicamente separadas de instrucciones y de datos','Instrucciones en ROM / flash (no volátil) y datos en RAM','Buses separados','CPU con unidad de control, ALU y registros, más E/S','Dibujo con las dos memorias conectadas a la CPU'] },

{ id:'vn_vs_harvard', unit:'Von Neumann y Harvard', prio:'alta', t:'Diferencias entre Harvard y Von Neumann', uso:'2 de 4 finales',
  qs:['¿Cuáles son sus diferencias con la Arquitectura Von Neumann? Explique.'],
  def:'<p>Las dos tienen <b>CPU</b> (unidad de control, ALU y registros) y <b>sistema de E/S</b>. Cambia la memoria y cómo se conecta:</p>' +
    TB(['', 'Von Neumann', 'Harvard'], [
      ['Memoria', 'Una sola para <b>instrucciones y datos</b> (de lectura-escritura)', 'Dos <b>separadas</b>: instrucciones (ROM / flash) y datos (RAM)'],
      ['Buses', 'Un camino compartido (bus de datos, de direcciones y de control)', 'Un bus para instrucciones y otro para datos'],
      ['Instrucción y dato', 'Comparten el mismo camino: no pueden viajar a la vez', 'Pueden accederse al mismo tiempo'],
      ['Tipo de uso', 'Propósito general, necesita un sistema operativo', 'Propósito específico, no necesita sistema operativo'],
      ['Ejemplos', 'PC con x86, Raspberry Pi, celulares', 'Microcontroladores: PIC, Arduino UNO']]) +
    '<p>Von Neumann trae el concepto de <b>programa almacenado</b>, pero separa memoria y CPU y eso genera el <b>cuello de botella de Von Neumann</b>: la CPU puede quedar ociosa esperando a la memoria.</p>',
  simple:'<ul><li><b>Igual:</b> CPU (UC, ALU, registros) y E/S</li><li><b>Memoria:</b> una sola vs separadas</li><li><b>Buses:</b> uno compartido vs uno por memoria</li><li><b>Uso:</b> propósito general + SO vs propósito específico, sin SO</li><li>Von Neumann tiene el cuello de botella</li></ul>',
  ej:'<p>Un Intel Core i9 es Von Neumann (y su procesador es CISC). Un Arduino UNO con el ATmega328P es Harvard. Son dos clasificaciones distintas: Von Neumann / Harvard describen la <i>computadora</i>; CISC / RISC describen el <i>set de instrucciones del procesador</i>.</p>',
  warn:'No digas que Harvard no tiene RAM: tiene RAM para <b>datos</b> y ROM / flash para <b>instrucciones</b>.',
  items:['Von Neumann: una sola memoria para instrucciones y datos','Harvard: memorias separadas (instrucciones y datos)','Buses: compartido vs separados','Lo que comparten: CPU y E/S','Uso: propósito general con SO vs propósito específico'] },

{ id:'harvard_ventajas', unit:'Von Neumann y Harvard', prio:'alta', t:'Ventajas de Harvard en el ciclo de ejecución', uso:'2 de 4 finales',
  qs:['¿Qué ventajas en cuanto al ciclo de ejecución posee la Arquitectura Harvard?'],
  def:'<p>Como las instrucciones y los datos están en memorias distintas y viajan por buses distintos, <b>la CPU puede buscar la próxima instrucción mientras accede a los datos de la actual</b>. Se superponen la captación de la instrucción y la captación o escritura del operando, y se reduce el cuello de botella de Von Neumann.</p>' + UL([
    '<b>Mayor velocidad y ancho de banda:</b> no compiten por un único bus.',
    '<b>Memoria de instrucciones a medida:</b> su palabra tiene el ancho exacto de la instrucción.',
    '<b>Cachés separadas</b> de instrucciones y de datos (Harvard modificado) para mejorar el rendimiento.']) +
    '<p><b>Inconveniente:</b> hay que repartir la caché entre instrucciones y datos, y funciona mejor cuando se leen instrucciones y datos con una frecuencia parecida. Además hay dos espacios de memoria y más líneas de conexión.</p>',
  simple:'<ul><li>Instrucción y dato por <b>buses distintos</b> → se acceden a la vez</li><li>Se solapan el fetch y el acceso a operandos</li><li>Menos cuello de botella · más ancho de banda</li><li>Palabra de memoria de instrucciones a medida</li><li>Contra: dividir la caché, más hardware</li></ul>',
  ej:'',
  warn:'La ventaja de Harvard "pura" se redujo en los procesadores modernos con cachés separadas de instrucciones y datos (Harvard modificado), porque hoy casi todos tienen caché.',
  items:['Instrucciones y datos se acceden por caminos separados al mismo tiempo','Se solapan la captación de la instrucción y el acceso a datos','Se reduce el cuello de botella de Von Neumann','Mencionar un inconveniente (dividir la caché, más hardware)'] },

{ id:'vn', unit:'Von Neumann y Harvard', prio:'media', t:'Arquitectura Von Neumann: partes y cómo se comunican', uso:'1 de 4 finales',
  qs:['¿Cuáles son las partes de una Arquitectura Von Neumann y cómo se comunican entre sí?'],
  def:'<p>Modelo de 1945 (primer borrador del informe sobre el EDVAC). Datos y programas se guardan en <b>la misma memoria de lectura-escritura</b>, se accede por posición sin importar el tipo de contenido, las instrucciones se ejecutan en secuencia (salvo que se indique lo contrario) y todo se representa en binario. De ahí el <b>programa almacenado</b>. Partes:</p>' + UL([
    '<b>CPU:</b> unidad de control, ALU y registros.',
    '<b>Memoria principal:</b> guarda instrucciones y datos.',
    '<b>Sistema de entrada / salida.</b>']) +
    '<p><b>Comunicación:</b> todos los componentes se conectan por el <b>bus del sistema</b>, un camino compartido formado por el <b>bus de datos</b> (mueve la información), el <b>bus de direcciones</b> (dice a qué posición) y el <b>bus de control</b> (órdenes y temporización). Como es compartido, hace falta un <b>arbitraje</b> para decidir quién lo usa.</p>',
  simple:'<ul><li>CPU (UC + ALU + registros) · memoria principal · E/S</li><li>Una memoria: instrucciones + datos (programa almacenado)</li><li>Se comunican por el bus del sistema: datos, direcciones, control</li><li>Bus compartido → arbitraje</li><li>Cuello de botella de Von Neumann</li></ul>',
  ej: SVG_VN,
  warn:'Las tres partes son CPU, memoria y E/S. Los tres buses van aparte: son cómo se comunican, no son partes.',
  items:['CPU: unidad de control, ALU y registros','Memoria principal con instrucciones y datos','Sistema de E/S','Comunicación por bus del sistema: datos, direcciones y control'] },

{ id:'ciclo', unit:'Von Neumann y Harvard', prio:'media', t:'Ciclo de una instrucción: recorrido y registros', uso:'1 de 4 finales',
  qs:['¿Cómo es el ciclo de una instrucción? ¿Qué recorrido hace la instrucción en las diferentes partes de la arquitectura? Indique qué registros se ven involucrados.'],
  def:'<p>La CPU ejecuta el programa repitiendo el <b>ciclo de instrucción</b>:</p>' + OL([
    '<b>Extracción (FI):</b> la UC toma la dirección que está en el <b>PC</b>, la pasa al <b>MAR</b> y la coloca en el bus de direcciones; pide la lectura por el bus de control; la instrucción vuelve por el bus de datos al <b>MBR</b> y se copia al <b>IR</b>. El PC se incrementa.',
    '<b>Decodificación (DI):</b> la UC interpreta el CODOP que está en el IR.',
    '<b>Cálculo y captación de operandos (CO, FO):</b> si hay operandos en memoria, la dirección va al MAR y el dato vuelve al MBR. Si el direccionamiento es indirecto hay un ciclo indirecto más.',
    '<b>Ejecución y escritura (EI, WO):</b> la ALU opera y el resultado queda en un registro o se escribe en memoria (por MAR y MBR).',
    '<b>Interrupciones (IN):</b> se verifica si hay una pendiente. Si no, se vuelve a 1.']) +
    '<p><b>Micro-operaciones del ciclo de extracción:</b> T1: MAR ← (PC) · T2: MBR ← Memoria, PC ← (PC) + 1 · T3: IR ← (MBR).</p>' +
    '<p><b>Registros:</b> PC (dirección de la próxima instrucción), IR (instrucción en ejecución), MAR (dirección de memoria a la que se accede), MBR (dato leído o por escribir), registros de propósito general o acumulador, y el registro de estado (flags).</p>',
  simple:'<ul><li>Extracción → decodificación → operandos → ejecución → escritura → interrupciones</li><li>T1: MAR ← PC · T2: MBR ← Mem, PC ← PC+1 · T3: IR ← MBR</li><li>Registros: <b>PC · IR · MAR · MBR</b> · AC / generales · estado (flags)</li><li>Bus de direcciones (MAR) · bus de control (lectura) · bus de datos (MBR)</li></ul>',
  ej:'<p><b>Ejemplo de la filmina</b> (instrucciones de 16 bits: 4 de CODOP y 12 de dirección). PC = 300. En 300 está <code>1940</code>: cargar AC desde la dirección 940. En 301, <code>5941</code>: sumar a AC el dato de la 941. En 302, <code>2941</code>: guardar AC en la 941. Con 3 en la 940 y 2 en la 941, la 941 termina valiendo 5. Podés verlo paso a paso en la pestaña Simuladores.</p>',
  warn:'<b>PC no es IR.</b> El PC apunta a la próxima instrucción y se incrementa durante la extracción; el IR tiene la instrucción actual (la filmina del procesador describe mal el IR). Y el recorrido siempre pasa por MAR y MBR cuando se toca la memoria.',
  items:['Extracción: PC → MAR → bus de direcciones → memoria → bus de datos → MBR → IR, y PC se incrementa','Decodificación en la unidad de control','Captación de operandos y ejecución en la ALU','Escritura del resultado e interrupciones','Registros nombrados: PC, IR, MAR, MBR (y acumulador / estado)'] },

{ id:'isa_set', unit:'Von Neumann y Harvard', prio:'media', t:'Set de instrucciones: qué es y dónde está', uso:'1 de 4 finales',
  qs:['¿Qué es el set de instrucciones? ¿Dónde piensa que se encuentra este?'],
  def:'<p>El <b>set de instrucciones</b> es el conjunto de operaciones (instrucciones de máquina) que un procesador sabe ejecutar. Define la <b>ISA</b>: qué tipos de datos maneja, cómo se almacenan y se acceden, qué operaciones ejecuta y cómo se codifican. Una instrucción es una secuencia de bits dividida en campos: el <b>CODOP</b> (qué hacer) y la <b>referencia a los operandos</b> (memoria, registros, inmediato o E/S).</p>' +
    '<p>Los tipos de operaciones son: transferencia de datos, aritméticas, lógicas, conversión, entrada / salida, control del sistema y transferencia de control.</p>' +
    '<p><b>¿Dónde está?</b> En el <b>procesador</b>: lo implementa la <b>unidad de control</b>, que decodifica el CODOP y genera las señales de control (puede estar cableada o microprogramada). Los programas, escritos con esas instrucciones, sí viven en la memoria principal.</p>',
  simple:'<ul><li>Repertorio de instrucciones que entiende la CPU (la ISA)</li><li>Instrucción = CODOP + operandos</li><li>Tipos: transferencia, aritméticas, lógicas, conversión, E/S, control del sistema, saltos</li><li>Está en la <b>CPU</b>, en la unidad de control (cableada o microprogramada)</li><li>El programa (las instrucciones usadas) está en memoria</li></ul>',
  ej:'<p>El mismo <code>a = a * b</code> en x86 (CISC): una instrucción compleja que opera en memoria. En ARM (RISC): LOAD, LOAD, PROD, STORE, porque solo LOAD y STORE tocan la memoria. Una ISA define cuál de las dos formas ofrece el procesador.</p>',
  warn:'No digas que el set de instrucciones "está en la memoria". Lo que está en memoria es el programa; el set es una propiedad del procesador.',
  items:['Conjunto de instrucciones de máquina que la CPU puede ejecutar','Instrucción = CODOP + referencia a operandos','Tipos de operaciones (al menos tres)','Se encuentra en el procesador / unidad de control, no en la memoria'] },

/* ---------- 2 · MEMORIA ---------- */
{ id:'acceso', unit:'Memoria y caché', prio:'alta', t:'Métodos de acceso a memoria', uso:'2 de 4 finales',
  qs:['¿Cuáles son los distintos métodos de acceso a memoria? Explique y ejemplifique.'],
  def:'<p>Hay cuatro métodos de acceso:</p>' + UL([
    '<b>Secuencial:</b> no se puede acceder directo a la celda deseada; hay que pasar por todas las que la preceden. Ejemplo: <b>cinta magnética</b>.',
    '<b>Directo:</b> los bloques tienen una dirección única basada en su ubicación física. Se accede <b>saltando a la zona</b> y haciendo una <b>búsqueda secuencial</b> dentro de ella. Ejemplo: <b>discos</b>.',
    '<b>Aleatorio:</b> cada posición direccionable se identifica con exactitud y el tiempo de acceso es <b>constante</b>, independiente de los accesos anteriores. Ejemplo: <b>RAM</b> (y ROM).',
    '<b>Asociativo:</b> se compara una parte del contenido de todas las palabras <b>simultáneamente</b>: se recupera la palabra por su <b>contenido</b>, no por su dirección. Ejemplo: <b>memoria caché</b>.']),
  simple:'<ul><li><b>Secuencial</b> → pasar por todo lo anterior · cinta</li><li><b>Directo</b> → saltar a la zona + búsqueda secuencial · disco</li><li><b>Aleatorio</b> → dirección única, tiempo constante · RAM</li><li><b>Asociativo</b> → por contenido, comparación simultánea · caché</li></ul>',
  ej:'<p>Con la lista <code>[0] ana, [1] juan, [2] pedro</code>: en secuencial llegás a pedro pasando por ana y juan; en aleatorio vas a la posición 2 en el mismo tiempo que a la 0; en asociativo preguntás "¿dónde está pedro?" y no das ninguna dirección.</p>',
  warn:'<b>Directo no es aleatorio.</b> En el directo hay una búsqueda secuencial dentro de la zona y el tiempo varía (disco). En el aleatorio el tiempo es constante (RAM). Varios finales resueltos los mezclan.',
  items:['Los cuatro métodos: secuencial, directo, aleatorio y asociativo','Secuencial: recorrer en orden · cinta','Directo: salto a la zona + búsqueda secuencial · disco','Aleatorio: tiempo constante · RAM','Asociativo: por contenido · caché'] },

{ id:'cache_que', unit:'Memoria y caché', prio:'alta', t:'Qué es la memoria caché y dónde está según el nivel', uso:'2 de 4 finales',
  qs:['¿Qué es la memoria caché y dónde se encuentra dependiendo del nivel?'],
  def:'<p>La <b>memoria caché</b> es una memoria <b>pequeña, muy rápida, volátil y cara</b> (SRAM) que se ubica entre la CPU y la memoria principal y guarda una <b>copia de partes de la memoria principal</b> (los datos e instrucciones que el procesador usa continuamente). Funciona así: cuando la CPU pide una palabra, se comprueba si está en la caché. Si está (<b>acierto</b>), se entrega. Si no (<b>falla</b>), se lee de la memoria principal un <b>bloque</b> completo, se guarda en la caché y se entrega la palabra. Por la localidad de referencia, es probable que lo próximo que se pida esté en ese bloque.</p>' +
    '<p>CPU ↔ caché se transfiere por <b>palabras</b> (rápido); caché ↔ memoria principal por <b>bloques</b> (más lento).</p>' +
    TB(['Nivel', 'Dónde está', 'Características'], [
      ['L1', 'Dentro de cada núcleo del procesador', 'La más rápida, cara y pequeña; opera a la frecuencia del procesador; separada en datos e instrucciones'],
      ['L2', 'Hoy en el chip: por núcleo o compartida entre núcleos', 'Más grande y más lenta que L1; frecuencia cercana a la del procesador'],
      ['L3', 'En el chip, compartida por todos los núcleos', 'La más grande y la más barata de las tres; menos frecuencia']]) +
    '<p>A medida que se baja en la jerarquía: más capacidad, menos costo por bit, más tiempo de acceso y menos accesos del procesador.</p>',
  simple:'<ul><li>Pequeña · rápida · cara · volátil (SRAM) · entre CPU y RAM</li><li>Copia de partes de la memoria principal</li><li>Acierto → entrega · falla → trae un <b>bloque</b></li><li>CPU–caché por palabra · caché–RAM por bloque</li><li><b>L1</b> en cada núcleo (la más rápida) · <b>L2</b> por núcleo o compartida · <b>L3</b> compartida (la más grande)</li></ul>',
  ej:'<p>Intel Core i7 8700K: L1 de 64 KB por núcleo (32 KB de datos y 32 KB de instrucciones), L2 de 256 KB por núcleo y L3 de 12 MB compartida. Son datos de la filmina; no hace falta saberlos.</p>',
  warn:'En un final resuelto dice que L2 "puede estar dentro o fuera del procesador". Era así antes: hoy casi todos los microprocesadores la tienen en el chip, y también la L3.',
  items:['Memoria pequeña, rápida y cara entre la CPU y la memoria principal','Guarda copia de partes de la memoria principal','Qué pasa en acierto y en falla (trae un bloque)','L1 dentro del núcleo (la más rápida y chica)','L2 y L3: más grandes y lentas, L3 compartida'] },

{ id:'cache_vs_principal', unit:'Memoria y caché', prio:'media', t:'Memoria principal vs memoria caché', uso:'1 de 4 finales',
  qs:['¿Qué diferencias hay entre la memoria principal y la memoria caché?'],
  def: TB(['', 'Memoria principal', 'Memoria caché'], [
    ['Tecnología', '<b>DRAM</b> (SDRAM, DDR): el bit se guarda como carga en un capacitor', '<b>SRAM</b>: el bit se guarda en un flip-flop (compuertas lógicas, como el procesador)'],
    ['Refresco', 'Necesita refresco periódico', 'No lo necesita mientras tenga energía'],
    ['Velocidad', 'Más lenta', 'Mucho más rápida'],
    ['Costo y tamaño', 'Construcción simple, celda pequeña, más barata', 'Construcción más compleja, celda más grande, más cara'],
    ['Capacidad', 'Grande (GB)', 'Pequeña (KB a MB)'],
    ['Ubicación', 'Fuera del procesador, en módulos sobre la placa', 'Dentro del procesador (L1, L2, L3)'],
    ['Función', 'Memoria de trabajo: guarda programas y datos en ejecución', 'Copia de lo más usado, para que la CPU no espere a la principal'],
    ['Transferencia', 'Con la caché, por <b>bloques</b>', 'Con la CPU, por <b>palabras</b>']]) +
    '<p>La principal sigue siendo DRAM porque la SRAM es mucho más cara, y agrandar la caché más allá de cierto punto da retornos decrecientes.</p>',
  simple:'<ul><li>Principal = <b>DRAM</b> · caché = <b>SRAM</b></li><li>DRAM: capacitores, refresco, lenta, barata, grande</li><li>SRAM: flip-flops, sin refresco, rápida, cara, chica</li><li>La caché está en el procesador; la principal, afuera</li><li>CPU–caché por palabra · caché–principal por bloque</li></ul>',
  ej:'',
  warn:'Memoria <b>volátil</b> son las dos (RAM). La diferencia no es la volatilidad sino la tecnología, la velocidad, el costo y el lugar.',
  items:['Principal = DRAM, caché = SRAM','DRAM necesita refresco, SRAM no','Caché más rápida, más cara y más chica','Caché dentro del procesador, principal afuera','Rol de cada una (trabajo vs copia de lo más usado)'] },

{ id:'cache_tipos', unit:'Memoria y caché', prio:'media', t:'Tipos de memoria caché', uso:'1 de 4 finales',
  qs:['¿Cuáles son los diferentes tipos de memoria caché que existen?'],
  def:'<p>Se las puede clasificar según cuatro criterios de diseño:</p>' + UL([
    '<b>Por nivel:</b> L1 (dentro del núcleo, la más rápida y chica), L2 y L3 (más grandes, más lentas; la L3 compartida).',
    '<b>Unificada o dividida:</b> la <b>unificada</b> guarda datos e instrucciones juntos (mejor tasa de aciertos para un mismo tamaño porque equilibra la carga, y se diseña una sola). La <b>dividida</b> tiene una para instrucciones y otra para datos (evita la disputa entre la unidad de búsqueda de instrucciones y la de ejecución). La tendencia: dividida en L1 y unificada en los niveles superiores.',
    '<b>Por direcciones:</b> <b>lógica (virtual)</b>, que guarda direcciones virtuales y responde antes de que la MMU traduzca; <b>física</b>, que guarda direcciones físicas y es más lenta porque pasa por la MMU.',
    '<b>Por función de mapeo</b> de bloques a líneas: <b>directo</b> (cada bloque a una sola línea), <b>asociativo</b> (a cualquier línea) y <b>asociativo por conjuntos</b> (un compromiso entre los dos).']),
  simple:'<ul><li>Por <b>nivel</b>: L1 · L2 · L3</li><li><b>Unificada</b> vs <b>dividida</b> (datos / instrucciones)</li><li><b>Lógica</b> (virtual) vs <b>física</b></li><li><b>Mapeo</b>: directo · asociativo · asociativo por conjuntos</li></ul>',
  ej:'',
  warn:'Si te piden "tipos" sin más, empezá por nivel (L1, L2, L3) y sumá unificada / dividida. Los otros dos criterios te suman puntos si te alcanza el tiempo.',
  items:['Por nivel: L1, L2, L3','Unificada vs dividida','Lógica (virtual) vs física','Mapeo: directo, asociativo, asociativo por conjuntos'] },

{ id:'reemplazo', unit:'Memoria y caché', prio:'media', t:'Algoritmos de reemplazo de la caché', uso:'1 de 4 finales',
  qs:['¿Cuáles son los algoritmos de reemplazo existentes para la memoria caché?'],
  def:'<p>Cuando la caché está llena y entra un bloque nuevo hay que sacar uno. En el <b>mapeo directo</b> no hay elección (cada bloque tiene una sola línea posible); en las técnicas <b>asociativas</b> hace falta un algoritmo, y para ser rápido tiene que estar implementado en <b>hardware</b>:</p>' + UL([
    '<b>LRU</b> (Least Recently Used, menos recientemente usado): reemplaza el bloque que más tiempo estuvo en la caché <b>sin ser referenciado</b>. Es el más usado.',
    '<b>FIFO</b> (First In, First Out): reemplaza el bloque que <b>entró primero</b>, sin mirar si se usó. Se implementa fácil con un buffer circular (round-robin).',
    '<b>LFU</b> (Least Frequently Used, menos frecuentemente usado): reemplaza el bloque con <b>menos referencias</b>. Se implementa con un contador por línea.',
    '<b>Aleatorio:</b> elige una línea al azar. Rinde apenas peor que LRU y LFU.']),
  simple:'<ul><li><b>LRU</b> → hace más tiempo que no se usa</li><li><b>FIFO</b> → el que entró primero</li><li><b>LFU</b> → el menos usado en cantidad</li><li><b>Aleatorio</b></li><li>Mapeo directo: no hay elección · lo demás: en hardware</li></ul>',
  ej:'<p>Probalo en la pestaña Simuladores: cargá una secuencia de bloques y compará cuántas fallas tiene cada algoritmo.</p>',
  warn:'LRU mira <b>cuándo</b> se usó por última vez, FIFO mira <b>cuándo entró</b>, LFU mira <b>cuántas veces</b> se usó. Un bloque que entró hace mucho pero se usa siempre: FIFO lo saca, LRU y LFU no.',
  items:['LRU (menos recientemente usado)','FIFO (el primero en entrar)','LFU (el menos frecuentemente usado)','Aleatorio','Se implementan en hardware / en mapeo directo no hay elección'] },

{ id:'escritura', unit:'Memoria y caché', prio:'alta', t:'Lectura y escritura en la caché: acierto, falla y políticas de escritura', uso:'2 de 4 finales',
  qs:['¿Cómo es la lectura / escritura? ¿Qué pasa en un acierto de caché o en una falla?', '¿Cuáles son los protocolos (políticas) de escritura de la memoria caché?'],
  def:'<p><b>Lectura.</b> <i>Acierto:</i> el dato está en la caché y se entrega a la CPU sin usar el bus del sistema. <i>Falla:</i> se pone la dirección en el bus del sistema, se lee de la memoria principal el <b>bloque</b> que contiene el dato, se guarda en una línea de la caché (reemplazando una si está llena) y se entrega a la CPU.</p>' +
    '<p><b>Escritura.</b> Cuando el dato está en la caché, qué se hace con la memoria principal depende de la política:</p>' +
    TB(['', 'Escritura inmediata (write-through)', 'Escritura posterior (write-back)'], [
      ['Qué hace', 'Escribe <b>en la caché y en la memoria principal</b> a la vez', 'Escribe <b>solo en la caché</b> y marca la línea con un bit de uso (modificada); la escribe en memoria <b>solo al reemplazarla</b>'],
      ['A favor', 'La memoria principal siempre está válida; otros módulos pueden vigilar el tráfico', 'Minimiza las escrituras a memoria'],
      ['En contra', 'Mucho tráfico de memoria: cuello de botella', 'Partes de la memoria no son válidas: la E/S solo puede acceder a través de la caché; circuitos más complejos']]) +
    '<p>En una falla de escritura en un sistema con escritura posterior, lo habitual es traer el bloque y modificarlo (en MESI: lectura con intención de modificar, RWITM, y la línea queda Modificada).</p>',
  simple:'<ul><li>Lectura: <b>acierto</b> → la entrega · <b>falla</b> → trae el bloque de la RAM, lo guarda, entrega</li><li><b>Write-through</b>: caché + memoria a la vez · memoria siempre válida · mucho tráfico</li><li><b>Write-back</b>: solo caché + bit de modificado · escribe al reemplazar · menos tráfico, riesgo de incoherencia</li></ul>',
  ej:'',
  warn:'<b>Las definiciones no se cruzan.</b> La filmina de multiprocesadores las tiene al revés. Inmediata = las dos a la vez; posterior = solo caché hasta reemplazar. Y son políticas de escritura, no "protocolos de coherencia".',
  items:['Acierto de lectura: la caché entrega el dato','Falla de lectura: se trae el bloque de la memoria principal y se entrega','Escritura inmediata: caché y memoria a la vez','Escritura posterior: solo caché, se escribe al reemplazar (bit de modificado)','Ventaja y desventaja de cada una'] },

{ id:'localidad', unit:'Memoria y caché', prio:'media', t:'Principio de localidad temporal y espacial', uso:'1 de 4 finales',
  qs:['¿Qué es el principio de localidad temporal y espacial en la memoria caché?'],
  def:'<p>Es la observación de que los programas hacen la mayoría de sus referencias a memoria sobre un conjunto pequeño de direcciones:</p>' + UL([
    '<b>Localidad temporal:</b> si se accedió a una posición de memoria, es probable que se vuelva a acceder pronto. Ejemplo: las instrucciones de un bucle.',
    '<b>Localidad espacial:</b> si se accede a una posición, es probable que pronto se acceda a las <b>cercanas</b>. Ejemplo: ejecución secuencial de instrucciones, recorrer un arreglo.']) +
    '<p><b>Consecuencia:</b> por eso la caché guarda lo usado recientemente (temporal) y trae <b>bloques completos</b> y no una sola palabra (espacial), lo que reduce los accesos a la memoria principal.</p>' +
    '<p><b>Tamaño del bloque:</b> al principio, bloques más grandes aumentan los aciertos; pasado cierto punto los empeoran, porque caben menos bloques en la caché y las palabras extra están más lejos de la pedida. No hay un tamaño óptimo definitivo.</p>',
  simple:'<ul><li><b>Temporal</b> → lo usado hace poco se usa de nuevo · bucles · la caché lo guarda</li><li><b>Espacial</b> → se usan las posiciones vecinas · secuencial · la caché trae <b>bloques</b></li><li>Resultado: menos accesos a la memoria principal</li></ul>',
  ej:'',
  warn:'Se confunden fácil: temporal = <i>mismo</i> dato otra vez; espacial = datos <i>vecinos</i>.',
  items:['Temporal: lo usado recientemente se vuelve a usar','Espacial: se usan posiciones cercanas','Ejemplo de cada una','Consecuencia: la caché trae bloques y guarda lo reciente'] },

{ id:'coherencia', unit:'Memoria y caché', prio:'alta', t:'El problema de coherencia de caché y cómo se resuelve', uso:'4 de 4 finales',
  qs:['¿Qué es el problema de coherencia de caché?', '¿Qué problemas hay con las memorias caché en una CPU multiprocesador?', '¿Qué problema existe con la memoria caché?'],
  def:'<p>Puede haber <b>varias copias del mismo dato</b> en distintas cachés a la vez. Si cada procesador actualiza su copia libremente, el sistema queda con una <b>visión inconsistente de la memoria</b>: copias distintas y desactualizadas del mismo dato. Eso es la <b>incoherencia</b>. También pasa entre la caché y la memoria principal cuando un módulo de E/S escribe directo en memoria (la palabra de la caché queda inválida) o cuando una palabra se altera solo en la caché (la de memoria queda inválida).</p>' +
    '<p><b>Cómo se resuelve:</b></p>' +
    TB(['', 'Por software', 'Por hardware'], [
      ['Cómo', 'El compilador y el sistema operativo analizan el código y marcan los datos que no conviene guardar en caché', 'Detección <b>dinámica</b> en tiempo de ejecución de la posible incoherencia'],
      ['Cuándo', 'Se detecta en la <b>compilación</b>', 'Solo cuando el problema <b>aparece</b>'],
      ['A favor', 'No necesita circuitos extra', 'Mejor rendimiento; <b>transparente</b> para el programador y el compilador'],
      ['En contra', 'Más conservador: deja de cachear datos que quizás no daban problema', 'Requiere hardware adicional']]) +
    '<p>Los protocolos por hardware son el de <b>directorio</b> (un controlador centralizado y un directorio en memoria con el estado global de las cachés) y el de <b>vigilancia o snoopy</b> (cada controlador de caché vigila el bus y reacciona a lo que hacen los demás). Dentro de snoopy: <i>invalidación de escritura</i> (varios lectores, un solo escritor) o <i>actualización de escritura</i> (varios escritores). x86 usa <b>MESI</b>, de invalidación.</p>',
  simple:'<ul><li>Varias copias del mismo dato → si una cambia, las otras quedan viejas</li><li><b>Software:</b> compilador y SO marcan datos no cacheables · en compilación · conservador</li><li><b>Hardware:</b> detección dinámica · transparente · más eficiente · necesita hardware</li><li>Protocolos: <b>directorio</b> (centralizado) y <b>snoopy</b> (distribuido, vigila el bus) · <b>MESI</b></li></ul>',
  ej:'<p>P1 y P2 tienen x = 5 en su caché. P1 cambia x a 10. Si nada se lo avisa a P2, P2 sigue leyendo 5. La coherencia garantiza que la copia de P2 se invalide o se actualice.</p>',
  warn:'<b>Write-through y write-back no son protocolos de coherencia</b> (son políticas de escritura). Los protocolos son directorio, snoopy y MESI.',
  items:['Varias copias del mismo dato en distintas cachés','Si un procesador modifica su copia, las otras quedan desactualizadas (visión inconsistente)','Solución por software (compilador y SO) y por hardware (dinámica)','Ventajas y desventajas de una y otra','Protocolos: snoopy / directorio / MESI'] },

{ id:'mesi', unit:'Memoria y caché', prio:'media', t:'MESI: los cuatro estados y las transiciones', uso:'se pregunta junto con coherencia',
  qs:['(Suele pedirse como parte de la respuesta sobre coherencia.)'],
  def:'<p>Protocolo de <b>vigilancia con invalidación de escritura</b>. Cada línea de la caché tiene dos bits de estado y puede estar en uno de cuatro:</p>' + UL([
    '<b>M (Modificado):</b> la línea fue modificada (distinta de la memoria principal) y <b>solo está en esta caché</b>.',
    '<b>E (Exclusivo):</b> igual a la memoria principal y <b>no está en ninguna otra caché</b>.',
    '<b>S (Compartido):</b> igual a la memoria principal y <b>puede estar en otras cachés</b>.',
    '<b>I (Inválido):</b> no tiene datos válidos.']) +
    TB(['Evento en el procesador', 'Qué pasa'], [
      ['<b>Acierto de lectura</b> (M, E o S)', 'Lee y no cambia el estado'],
      ['<b>Falla de lectura</b>', 'Pide la línea por el bus. Si otra caché la tiene <b>M</b>: la entrega, la memoria se actualiza y ambas quedan en <b>S</b>. Si otra la tiene en E o S: todas quedan en <b>S</b>. Si nadie la tiene: lee de memoria y queda en <b>E</b>'],
      ['<b>Acierto de escritura</b>', 'En <b>M</b>: escribe. En <b>E</b>: escribe y pasa a <b>M</b>. En <b>S</b>: avisa por el bus, las otras copias pasan a <b>I</b>, escribe y pasa a <b>M</b>'],
      ['<b>Falla de escritura</b>', 'Emite RWITM (lectura con intención de modificar). Si otra la tiene en M, la escribe en memoria y pasa a I. Las copias E y S pasan a I. La línea se carga y queda en <b>M</b>']]),
  simple:'<ul><li><b>M</b> modificada, solo acá · <b>E</b> limpia, solo acá · <b>S</b> limpia, puede estar en otras · <b>I</b> inválida</li><li>Leer con falla: nadie la tiene → <b>E</b> · alguien la tiene → todos <b>S</b></li><li>Escribir: siempre termina en <b>M</b> y las demás copias pasan a <b>I</b></li></ul>',
  ej:'<p>El simulador de la pestaña Simuladores aplica estas reglas paso a paso con tres procesadores.</p>',
  warn:'Después de cualquier escritura, <b>solo una caché tiene la línea</b> (en M) y la memoria principal queda desactualizada hasta que esa línea se reemplace o alguien la lea.',
  items:['Los cuatro estados: Modificado, Exclusivo, Compartido, Inválido','Qué significa cada uno','Falla de lectura: a E si nadie la tiene, a S si alguien la tiene','Escritura: pasa a M e invalida las otras copias'] },

/* ---------- 3 · BUS ---------- */
{ id:'bus_que', unit:'Bus', prio:'alta', t:'Qué es un bus y los 3 buses', uso:'2 de 4 finales',
  qs:['¿Qué es un bus? Explique cuáles son los 3 buses que utilizan actualmente las arquitecturas de computadoras.'],
  def:'<p>Un <b>bus</b> es una vía de comunicación que conecta <b>dos o más dispositivos</b>. Es un <b>medio compartido</b>: lo que transmite un dispositivo lo reciben todos los conectados. Físicamente son conductores paralelos (líneas de metal en la placa). El que une procesador, memoria y E/S es el <b>bus del sistema</b>. Para usarlo, un módulo primero obtiene el bus (arbitraje) y después transfiere. Los tres buses:</p>' + UL([
    '<b>Bus de datos:</b> lleva los datos entre los módulos del sistema. Su ancho (de 32 a cientos de líneas) es clave para las prestaciones.',
    '<b>Bus de direcciones:</b> indica la fuente o destino del dato que va por el bus de datos (la posición de memoria o el puerto de E/S). Su ancho determina la <b>capacidad máxima de memoria</b>.',
    '<b>Bus de control:</b> controla el acceso y el uso de las líneas de datos y direcciones: lleva órdenes (lectura y escritura de memoria o de E/S, petición y cesión del bus, petición de interrupción, ACK, reloj, reset) y señales de temporización que indican que los datos y direcciones son válidos.']),
  simple:'<ul><li>Bus = vía de comunicación compartida entre dos o más dispositivos</li><li><b>Datos</b> → transporta la información</li><li><b>Direcciones</b> → de dónde / a dónde (define la memoria máxima)</li><li><b>Control</b> → órdenes y temporización (lectura, escritura, interrupción, reloj, pedir y ceder el bus)</li></ul>',
  ej:'',
  warn:'Los "3 buses" son datos, direcciones y control. No pongas PCI, USB ni SATA: esos son tipos de bus o interfaces.',
  items:['Vía de comunicación compartida entre dispositivos','Bus de datos','Bus de direcciones','Bus de control con ejemplos de señales'] },

{ id:'bus_ancho', unit:'Bus', prio:'media', t:'Ancho del bus de direcciones y del bus de datos', uso:'1 de 4 finales',
  qs:['¿Qué es el ancho del bus de direcciones y del bus de datos? ¿En qué influye de manera directa esta característica?'],
  def:'<p>El <b>ancho</b> de un bus es la <b>cantidad de líneas</b>, es decir, cuántos bits viajan a la vez.</p>' + UL([
    '<b>Ancho del bus de direcciones → capacidad máxima de memoria.</b> Con <i>n</i> líneas se pueden direccionar 2<sup>n</sup> posiciones. Es un límite: la memoria por encima de eso no se puede usar.',
    '<b>Ancho del bus de datos → cuántos accesos hacen falta por instrucción</b> y, por lo tanto, el rendimiento. Cuanto más ancho, más bits por acceso.']) +
    '<p>Ejemplo: bus de datos de 8 bits e instrucciones de 16 bits → el procesador debe acceder a memoria <b>dos veces</b> por cada ciclo de instrucción. Con 16 líneas de direcciones se direccionan 2<sup>16</sup> = 65.536 posiciones.</p>',
  simple:'<ul><li>Ancho = cantidad de líneas (bits a la vez)</li><li>Direcciones: <b>2ⁿ</b> posiciones → <b>memoria máxima</b></li><li>Datos: bits por acceso → <b>accesos por instrucción</b> y rendimiento</li></ul>',
  ej:'<p>Probalo con las calculadoras de la pestaña Simuladores.</p>',
  warn:'El bus de direcciones <b>no</b> influye en la velocidad de transferencia sino en cuánta memoria se puede direccionar. El de datos es el que influye en el rendimiento.',
  items:['Ancho = cantidad de líneas','Direcciones: 2ⁿ posiciones, capacidad máxima de memoria','Datos: accesos por instrucción y rendimiento','Un ejemplo numérico'] },

{ id:'bus_p2p', unit:'Bus', prio:'media', t:'Conexión punto a punto', uso:'1 de 4 finales',
  qs:['¿Qué es la conexión punto a punto de los buses? Explique y detalle sus características.'],
  def:'<p>La interconexión <b>punto a punto</b> reemplaza al bus compartido: cada componente se conecta <b>directamente por pares</b> con otros. Surgió porque, al subir la frecuencia de los buses síncronos, aparecían límites eléctricos y se hacía muy difícil sincronizar y arbitrar a tiempo, sobre todo con chips multinúcleo que tienen varios procesadores y memoria en un solo chip. Características:</p>' + OL([
    '<b>Múltiples conexiones directas:</b> conexiones por pares entre los componentes, lo que <b>elimina el arbitraje</b> de los sistemas de transmisión compartida.',
    '<b>Arquitectura de protocolo en capas:</b> en vez de simples señales de control.',
    '<b>Transferencia de datos empaquetados:</b> los datos viajan en <b>paquetes</b> con cabeceras de control y códigos de control de errores, no como un flujo de bits en bruto.']) +
    '<p><b>Ventajas:</b> menor latencia, mayor velocidad de datos y mejor escalabilidad. <b>Ejemplo: PCI Express (PCIe)</b>, que sustituye al bus PCI; un chipset o puente conecta el procesador y la memoria con la estructura PCIe (conmutadores y dispositivos finales).</p>',
  simple:'<ul><li>Conexiones directas <b>por pares</b> (no bus compartido)</li><li>1) múltiples conexiones directas → <b>sin arbitraje</b></li><li>2) <b>protocolo en capas</b></li><li>3) datos en <b>paquetes</b> (cabecera + control de errores)</li><li>Ventajas: menos latencia, más velocidad, escalable · <b>PCIe</b></li></ul>',
  ej:'',
  warn:'Las tres características son las que preguntan. Si solo escribís "es más rápido", perdés casi todo.',
  items:['Conexión directa por pares en lugar de bus compartido','Elimina el arbitraje','Protocolo en capas','Datos empaquetados','Ventajas y ejemplo (PCIe)'] },

/* ---------- 4 · E/S ---------- */
{ id:'es_funciones', unit:'Entrada / Salida', prio:'alta', t:'Funciones del sistema de E/S', uso:'2 de 4 finales',
  qs:['¿Cuáles son las funciones del sistema de E/S?'],
  def:'<p>Los periféricos no se conectan directo al bus del sistema porque hay una gran variedad con distintos métodos de funcionamiento, sus velocidades son muy distintas a las de la memoria y el procesador (más lentas o más rápidas) y usan formatos y longitudes de palabra diferentes. Por eso existe el <b>módulo de E/S</b>, con dos funciones principales: <b>interfaz con el procesador y la memoria</b> (por el bus del sistema) e <b>interfaz con uno o más periféricos</b> (por enlaces de datos adaptados). Sus funciones se agrupan en cinco categorías:</p>' + OL([
    '<b>Control y sincronización:</b> coordinar el tráfico entre los recursos internos y los dispositivos externos, manejando las distintas velocidades.',
    '<b>Comunicación con el procesador:</b> decodificar comandos, intercambiar datos, informar el estado (BUSY, READY, errores) y reconocer la dirección de cada periférico.',
    '<b>Comunicación con el dispositivo.</b>',
    '<b>Almacenamiento temporal de datos</b> (buffer).',
    '<b>Detección de errores</b> y aviso al procesador.']),
  simple:'<ul><li>Módulo de E/S = interfaz entre el bus del sistema y los periféricos</li><li>1 <b>control y sincronización</b></li><li>2 <b>comunicación con el procesador</b> (comandos, datos, estado, dirección)</li><li>3 <b>comunicación con el dispositivo</b></li><li>4 <b>buffer</b> (almacenamiento de datos)</li><li>5 <b>detección de errores</b></li></ul>',
  ej:'<p>Una lectura típica: la CPU consulta el estado del módulo, el módulo responde, la CPU pide la transferencia, el módulo obtiene el dato (8 o 16 bits) del periférico y lo pasa a la CPU.</p>',
  warn:'Pueden pedirte también por qué hace falta el módulo: variedad de periféricos, velocidades distintas y formatos distintos. Eso lo escribís en una línea antes de la lista.',
  items:['Control y sincronización','Comunicación con el procesador','Comunicación con el dispositivo','Almacenamiento temporal (buffer)','Detección de errores'] },

{ id:'es_tipos', unit:'Entrada / Salida', prio:'alta', t:'Tipos de E/S: programada, por interrupción y DMA', uso:'2 de 4 finales',
  qs:['¿Cuáles son los diferentes tipos de entrada / salida? Explique.'],
  def:'<p>Hay tres técnicas para las operaciones de E/S (más una cuarta, el DCA). En las dos primeras el procesador mueve los datos entre la memoria y el módulo; en el DMA no.</p>' +
    TB(['', 'E/S programada', 'E/S por interrupción', 'DMA'], [
      ['Cómo funciona', 'La CPU ejecuta el programa de E/S: pregunta el estado, manda el comando y transfiere los datos', 'La CPU emite el comando y sigue con otras instrucciones; el módulo la <b>interrumpe</b> cuando termina', 'Un módulo DMA intercambia datos entre el periférico y la memoria <b>sin intervención de la CPU</b>'],
      ['Qué hace la CPU', '<b>Espera</b> y consulta el estado una y otra vez (polling)', 'Hace otra cosa; al terminar cada instrucción mira si hay interrupciones; guarda el contexto y atiende', 'Solo configura al principio y es avisada al final'],
      ['Problema', 'Pierde mucho tiempo esperando: degrada el rendimiento', 'La CPU sigue moviendo cada dato; cada interrupción cuesta guardar y restaurar contexto', 'Necesita un módulo extra; roba ciclos del bus'],
      ['Se usa para', 'Operaciones simples y lentas', 'Eventos esporádicos', 'Grandes volúmenes de datos']]) +
    '<p><b>Comandos de E/S programada:</b> control, prueba, lectura y escritura. <b>DCA (acceso directo a caché):</b> permite que la E/S acceda directo a la caché L3; mejora solo las operaciones de <b>salida</b>.</p>' +
    '<p>Si lo preguntan por los dispositivos externos, se clasifican en: de <b>interacción con humanos</b> (impresora), de <b>interacción con máquinas</b> (sensores) y de <b>comunicación</b> con dispositivos remotos (otra computadora).</p>',
  simple:'<ul><li><b>Programada</b> → la CPU espera y consulta (polling) · pierde tiempo</li><li><b>Por interrupción</b> → la CPU sigue; el módulo la interrumpe al terminar · sigue moviendo los datos</li><li><b>DMA</b> → módulo aparte mueve el bloque sin la CPU · avisa al final</li><li>DCA: acceso directo a caché, solo mejora la salida</li></ul>',
  ej:'',
  warn:'En un final puede decir "tipos de sistemas de E/S" o "tipos de E/S": se contesta con las técnicas (programada, interrupciones, DMA). Los tres tipos de dispositivos van como complemento.',
  items:['E/S programada: la CPU espera y consulta el estado','E/S por interrupción: la CPU sigue y es interrumpida','DMA: transfiere sin pasar por la CPU','Ventaja o desventaja de cada una','Mencionar DCA o las categorías de dispositivos'] },

{ id:'dma', unit:'Entrada / Salida', prio:'alta', t:'DMA: qué es, partes, funcionamiento, ventajas y dónde está', uso:'3 de 4 finales',
  qs:['Describa las partes que conforman un DMA y explique su funcionamiento.', '¿Qué es el DMA y qué ventajas introduce respecto del resto de las técnicas? ¿Cómo está conformado y cómo funciona?', '¿Dónde se encuentra el DMA y a través de qué se comunica con los demás dispositivos?'],
  def:'<p>El <b>DMA (acceso directo a memoria)</b> es un módulo adicional conectado al bus del sistema, capaz de imitar al procesador y tomar el control del bus para <b>transferir datos entre la memoria principal y un periférico sin pasar por la CPU</b>. Se usa cuando hay que mover grandes volúmenes de datos.</p>' +
    '<p><b>Partes:</b></p>' + UL([
      '<b>Registro de direcciones:</b> la posición inicial de memoria a leer o escribir.',
      '<b>Registro contador de datos:</b> cuántas palabras faltan transferir.',
      '<b>Registro de datos</b> (buffer): lo que se está transfiriendo.',
      '<b>Lógica de control:</b> maneja las líneas de control (pedido y cesión del bus, lectura / escritura, interrupción).']) +
    '<p><b>Funcionamiento:</b></p>' + OL([
      'La CPU inicializa el DMA: le envía si es lectura o escritura, la dirección del dispositivo de E/S, la posición inicial de memoria y la cantidad de palabras. Después sigue con otro trabajo.',
      'El DMA transfiere el bloque, <b>una palabra a la vez</b>, directo entre el periférico y la memoria. Usa el bus solo cuando la CPU no lo necesita o la obliga a pausar un ciclo: esto es el <b>robo de ciclos</b>.',
      'Al terminar, el DMA envía una <b>interrupción</b> a la CPU. La CPU interviene solo al principio y al final.']) +
    '<p><b>Ventajas:</b> libera a la CPU de las transferencias largas, reduce las interrupciones y mejora el rendimiento y la eficiencia de la E/S frente a la programada y la de interrupciones.</p>' +
    '<p><b>¿Dónde está y cómo se comunica?</b> Es un módulo conectado al <b>bus del sistema</b> (en los procesadores actuales, integrado en el chipset / puente). Con la CPU se comunica por las <b>líneas de control</b> (lectura / escritura, pedido de bus, interrupción); con la memoria y el periférico, por el bus del sistema (<b>direcciones, datos y control</b>).</p>',
  simple:'<ul><li>Módulo en el bus que transfiere memoria ↔ periférico <b>sin la CPU</b></li><li>Partes: registro de <b>direcciones</b> · <b>contador</b> de datos · registro de <b>datos</b> · <b>lógica de control</b></li><li>CPU configura → DMA transfiere (<b>roba ciclos</b>) → <b>interrumpe</b> al final</li><li>Ventaja: la CPU queda libre en transferencias largas</li><li>Se comunica por el <b>bus del sistema</b> y las líneas de control</li></ul>',
  ej:'',
  warn:'<b>El DMA no es una interrupción:</b> la CPU no guarda contexto, solo hace una pausa de un ciclo de bus. La interrupción llega una sola vez, al final. Y la lista de partes tiene que incluir los registros <i>y</i> la lógica de control.',
  items:['Módulo que transfiere memoria ↔ periférico sin pasar por la CPU','Registro de direcciones y contador de datos','Lógica de control (y registro de datos)','La CPU inicializa, el DMA transfiere y avisa por interrupción al final','Robo de ciclos de bus','Ventaja: libera a la CPU / está en el bus del sistema'] },

{ id:'dca', unit:'Entrada / Salida', prio:'baja', t:'DCA: acceso directo a caché', uso:'0 de 4 finales',
  qs:['(No apareció, pero está en la filmina.)'],
  def:'<p>El DMA no escala para los aumentos de datos de E/S de red (switches Ethernet de 10 y 100 Gbps, Wi-Fi de gigabits). El <b>DCA</b> permite que la función de E/S acceda <b>directo a la caché</b>.</p><p>Cuando el controlador de E/S pide una lectura, se comprueba si el dato está en la caché L3. Si está, se entrega de ahí y no se accede a la memoria principal. La mejora es <b>solo para las operaciones de salida</b>: la entrada funciona como en DMA y la L3 no participa.</p>',
  simple:'<ul><li>La E/S accede directo a la <b>caché L3</b></li><li>Evita ir a la memoria principal</li><li>Mejora solo la <b>salida</b></li></ul>',
  ej:'',
  warn:'No digas que mejora la entrada: ese es un error que circula.',
  items:['Acceso directo a la caché L3','Mejora solo la salida'] }
];
