/* ============ SKILL: práctica del parcial ============ */
/* La skill /practica-redes-parcial corriendo en la web: diagnóstico, insistir en lo que falla y regla de salida (dos aciertos seguidos).
   Reutiliza los generadores paso a paso de la pestaña Práctica guiada (gSubneteo, gRuteo, gIos, gHost). */

/* ---------- Multiple choice teórico ---------- */
function gMc() {
  var pool = DATA.quiz.filter(function (q) {
    return q.a.length === 1 && (q.t === 'IPv4 y direcciones' || q.t === 'IPv6 y ARP' || q.t === 'Transporte' || (q.t === 'Subneteo' && /hosts|dispositivos/.test(q.q)));
  });
  var picked = shuffle(pool).slice(0, 5);
  return {
    enun: '<p>Cinco preguntas de multiple choice teórico, como las de los parciales. Se corrigen una por una y cada una trae la explicación.</p>',
    steps: picked.map(function (q) {
      var order = shuffle(q.o.map(function (o, i) { return i; }));
      return {
        q: '<span class="muted">' + q.t + '</span><br>' + q.q, kind: 'choice',
        opts: order.map(function (i) { return q.o[i]; }), ans: order.indexOf(q.a[0]),
        hint: 'Releé la afirmación completa: en los parciales suelen cambiar una sola palabra o un número. Descartá lo que contradice lo que sabés de ' + q.t + '.',
        expl: q.e || ''
      };
    })
  };
}

/* ---------- TCP vs UDP ---------- */
var SK_TCP = [
  { q: '¿Cuál de los dos está <b>orientado a conexión</b> (hace un handshake antes de mandar datos)?', opts: ['TCP', 'UDP'], ans: 0, hint: 'Es el que "se presenta" antes de hablar.', expl: 'TCP abre la conexión con SYN, SYN-ACK y ACK. UDP manda datagramas sin avisar antes.' },
  { q: '¿Cuál <b>garantiza</b> que los datos lleguen completos?', opts: ['TCP', 'UDP'], ans: 0, hint: 'Usa ACK y retransmite lo que se pierde.', expl: 'TCP confirma con ACK y retransmite. UDP no confirma nada.' },
  { q: '¿Cuál <b>numera los segmentos</b> para ordenarlos en el destino?', opts: ['TCP', 'UDP'], ans: 0, hint: 'Hay un campo "número de secuencia".', expl: 'TCP numera (número de secuencia) y el destino reordena. UDP no ordena: entrega lo que llega.' },
  { q: '¿Cuál hace <b>control de congestión</b> (slow start, evitación de congestión)?', opts: ['TCP', 'UDP'], ans: 0, hint: 'Ajusta una ventana que crece y se achica según la red.', expl: 'TCP ajusta su ventana de congestión. UDP manda al ritmo que le pide la aplicación.' },
  { q: '¿Cuál hace <b>control de flujo</b> con la ventana (Window) que anuncia el receptor?', opts: ['TCP', 'UDP'], ans: 0, hint: 'Es el que tiene campo Window en el header.', expl: 'En TCP el receptor anuncia cuántos bytes más puede recibir. UDP no tiene ventana.' },
  { q: '¿Cuál tiene el header más chico, de <b>8 bytes</b>?', opts: ['TCP', 'UDP'], ans: 1, hint: 'Solo tiene puerto origen, puerto destino, longitud y checksum.', expl: 'UDP: 4 campos de 2 bytes = 8 bytes. El header de TCP mide como mínimo 20 bytes.' },
  { q: '¿Cuál <b>no retransmite</b> lo que se pierde?', opts: ['TCP', 'UDP'], ans: 1, hint: 'Es el que no confirma lo que recibe.', expl: 'UDP no sabe si el datagrama llegó, así que no puede retransmitirlo.' },
  { q: 'Una videollamada prioriza la <b>poca demora</b> antes que recuperar paquetes perdidos. ¿Qué protocolo conviene?', opts: ['TCP', 'UDP'], ans: 1, hint: 'Retransmitir un paquete de audio llegaría tarde y ya no sirve.', expl: 'En tiempo real conviene UDP: menos demora y sin retransmisiones.' },
  { q: 'Vas a transferir un archivo y no puede faltar ni un byte. ¿Qué protocolo conviene?', opts: ['TCP', 'UDP'], ans: 0, hint: 'Necesitás entrega completa y en orden.', expl: 'Para archivos, web y correo se usa TCP: confiabilidad antes que velocidad.' },
  { q: '¿Qué segmento <b>inicia</b> el handshake de TCP?', opts: ['SYN', 'SYN-ACK', 'ACK'], ans: 0, hint: 'El cliente abre pidiendo sincronizar.', expl: 'El cliente manda SYN, el servidor responde SYN-ACK y el cliente cierra con ACK.' },
  { q: '¿Es verdad que <b>los dos</b> usan puertos para identificar la aplicación?', opts: ['Verdadero', 'Falso'], ans: 0, hint: 'Tanto TCP como UDP tienen puerto origen y puerto destino en el header.', expl: 'Verdadero: los dos tienen puertos. Lo que cambia es la conexión, la confiabilidad y el control.' }
];
function gTcp() {
  return {
    enun: '<p>En el recuperatorio 2025 la pregunta de desarrollo fue <b>"explicá la diferencia entre TCP y UDP"</b>. Para escribirla bien tenés que dominar estos puntos. Respondé seis.</p>',
    steps: shuffle(SK_TCP).slice(0, 6)
  };
}

/* ---------- Tipos ---------- */
var SK_TYPES = [
  { id: 'sub', n: 'Subneteo', prio: 'alta', ap: '5 de 5 parciales', d: 'N subredes: máscara, red, rango, broadcast, gateway y a qué subred pertenece una IP.', gen: gSubneteo },
  { id: 'rut', n: 'Tabla de ruteo', prio: 'alta', ap: '5 de 5 parciales', d: 'Topología de 3 routers: red conectada o lejana, interfaz y gateway.', gen: gRuteo },
  { id: 'ios', n: 'ip route y comandos IOS', prio: 'alta', ap: '4 de 5 parciales', d: 'Configurar una interfaz y elegir la línea ip route correcta.', gen: gIos },
  { id: 'mc', n: 'Multiple choice teórico', prio: 'media', ap: '3 o 4 de 5 parciales', d: 'IPv6, ARP, header IPv4, RFC 1918, hosts por máscara, TCP y UDP.', gen: gMc },
  { id: 'host', n: 'Broadcast y host válido', prio: 'media', ap: '2 de 5 parciales', d: '¿Esta IP se puede asignar a un host o es la red o el broadcast?', gen: gHost },
  { id: 'tcp', n: 'TCP vs UDP', prio: 'media', ap: '1 de 5 (2025)', d: 'Las diferencias que se piden en la pregunta de desarrollo.', gen: gTcp }
];

/* ---------- Explicaciones por tipo ---------- */
var SK_LEARN = {};

SK_LEARN.sub = `
<p>Te dan un bloque (por ejemplo <code>172.30.0.0/16</code>) y una cantidad de subredes. Te piden la máscara, la red de una subred, su rango de hosts, su broadcast, el gateway de un host y a qué subred pertenece una IP. Se resuelve siempre con los mismos 7 pasos.</p>
<ol class="steps">
  <li><b>Bits a tomar (n):</b> el menor n con 2<sup>n</sup> ≥ cantidad de subredes. Si piden 9: 2³ = 8 no alcanza, 2⁴ = 16 sí, entonces n = 4.</li>
  <li><b>Prefijo nuevo</b> = prefijo original + n.</li>
  <li><b>Máscara decimal:</b> los octetos completos valen 255 y el octeto "partido" sale de la tira de abajo.</li>
  <li><b>Bloque:</b> 256 − valor de la máscara en el octeto que cambia. Es de a cuánto avanzan las subredes.</li>
  <li><b>Red de la subred K</b> (contando desde 1) = base + (K − 1) × bloque, sumado en el octeto que cambia.</li>
  <li><b>Broadcast</b> = (red de la subred siguiente) − 1. <b>Hosts</b> = red + 1 hasta broadcast − 1. El gateway es el primer host, salvo que el enunciado diga otra cosa.</li>
  <li><b>A qué subred pertenece una IP:</b> valor del octeto ÷ bloque, parte entera, más 1.</li>
</ol>
<div class="tbl"><table><thead><tr><th>Bits tomados en el octeto</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr></thead><tbody>
<tr><td><b>Valor de la máscara</b></td><td>128</td><td>192</td><td>224</td><td>240</td><td>248</td><td>252</td><td>254</td><td>255</td></tr>
<tr><td><b>Bloque (256 − valor)</b></td><td>128</td><td>64</td><td>32</td><td>16</td><td>8</td><td>4</td><td>2</td><td>1</td></tr></tbody></table></div>
<div class="tbl"><table><thead><tr><th>Prefijo</th><th>Octeto que cambia</th></tr></thead><tbody>
<tr><td>/9 a /16</td><td>2.º</td></tr><tr><td>/17 a /24</td><td>3.º</td></tr><tr><td>/25 a /32</td><td>4.º</td></tr></tbody></table></div>
<h4>Ejemplo 1: el corte cae en el 4.º octeto</h4>
<p>Dividir <code>192.168.10.0/24</code> en 6 subredes.</p>
<pre>1) n: 2^2 = 4 < 6, 2^3 = 8 ≥ 6          →  n = 3
2) prefijo: 24 + 3                        →  /27
3) máscara: 3 bits en el 4.º octeto = 224 →  255.255.255.224
4) bloque: 256 − 224 = 32                 →  0, 32, 64, 96, 128, ...
5) subred 4: (4 − 1) × 32 = 96            →  192.168.10.96/27
6) la siguiente es .128                   →  broadcast 192.168.10.127
   hosts: 192.168.10.97 a 192.168.10.126  →  gateway 192.168.10.97
7) IP 192.168.10.150: 150 ÷ 32 = 4,68     →  4 + 1 = subred 5</pre>
<h4>Ejemplo 2: el corte cae en el 3.er octeto</h4>
<p>Dividir <code>10.30.0.0/16</code> en 12 subredes.</p>
<pre>1) n: 2^3 = 8 < 12, 2^4 = 16 ≥ 12         →  n = 4
2) prefijo: 16 + 4                        →  /20
3) máscara: 4 bits en el 3.er octeto = 240 →  255.255.240.0
4) bloque: 256 − 240 = 16 (en el 3.er)    →  0, 16, 32, 48, 64, ...
5) subred 5: (5 − 1) × 16 = 64            →  10.30.64.0/20
6) la siguiente es 10.30.80.0             →  broadcast 10.30.79.255
   hosts: 10.30.64.1 a 10.30.79.254
7) IP 10.30.200.9: 200 ÷ 16 = 12,5        →  12 + 1 = subred 13 (10.30.192.0/20)</pre>
<div class="warn"><b>Errores típicos.</b> Contar las subredes desde 0 en vez de 1. Dar la red como si fuera el primer host (el primer host es red + 1). Aplicar el bloque en el octeto equivocado. Pensar que salen justo las que pedían: si piden 9 salen 16 y sobran. Olvidar restar 2 al contar hosts.</div>`;

SK_LEARN.host = `
<p>Te dan una IP con su prefijo y preguntan si se puede asignar a un host. Una IP <b>no</b> es válida para un host si es la dirección de <b>red</b> (bits de host todos en 0) o el <b>broadcast</b> (bits de host todos en 1). Todo lo que está en el medio sí.</p>
<ol class="steps">
  <li>Escribí la <b>máscara</b> del prefijo y hallá el <b>bloque</b> en el octeto que cambia (256 − valor de la máscara).</li>
  <li><b>Red:</b> el múltiplo del bloque que queda justo por debajo (o igual) al valor de la IP en ese octeto. Los octetos de la derecha van en 0.</li>
  <li><b>Broadcast:</b> red + bloque − 1 en ese octeto, y 255 en los octetos de la derecha.</li>
  <li><b>Comparar:</b> si la IP es igual a la red, no vale. Si es igual al broadcast, no vale. Si no, es un host válido.</li>
</ol>
<h4>Cuatro ejemplos resueltos</h4>
<pre>192.168.5.130/25   bloque 128 en el 4.º octeto
  red 192.168.5.128, broadcast 192.168.5.255
  130 está en el medio                    →  HOST VÁLIDO

172.16.32.0/20     bloque 16 en el 3.er octeto
  32 es múltiplo de 16 → la IP ES la red
  red 172.16.32.0, broadcast 172.16.47.255 →  NO: es la dirección de red

10.1.15.255/20     bloque 16 en el 3.er octeto
  15 está en el tramo 0 a 15 → red 10.1.0.0
  broadcast 10.1.15.255                    →  NO: es el broadcast

200.30.63.255/18   máscara 255.255.192.0, bloque 64 en el 3.er octeto
  63 está en el tramo 0 a 63 → red 200.30.0.0
  broadcast 200.30.63.255                  →  NO: es el broadcast (cayó en 2024)</pre>
<div class="warn"><b>Trampa.</b> Terminar en <code>.255</code> o en <code>.0</code> no alcanza para decidir. <code>10.0.1.255/16</code> es un host válido (la red es 10.0.0.0/16 y su broadcast es 10.0.255.255). Siempre calculá la red y el broadcast.</div>`;

SK_LEARN.rut = `
<p>Te dibujan 3 routers con sus interfaces e IP y te piden la tabla de ruteo de uno o dos de ellos: <b>red destino, gateway e interfaz</b>. Para cada red destino te hacés dos preguntas.</p>
<ol class="steps">
  <li><b>¿Está conectada a mí?</b> Si el router tiene una interfaz con IP dentro de esa red, es una red <b>conectada</b>: sin gateway, y la interfaz es esa.</li>
  <li><b>Si no, es lejana:</b> hay que pasarla a un router vecino. La <b>interfaz</b> es la que sale por el enlace hacia ese vecino (el enlace entre routers, no tu LAN).</li>
  <li>El <b>gateway</b> es la IP del <b>otro extremo</b> de ese enlace: la del vecino, nunca la tuya.</li>
  <li>Para saber por cuál vecino se llega, seguí el dibujo desde tu router hasta la red buscada.</li>
</ol>
<h4>Ejemplo resuelto</h4>
<pre>R1: f0/0 192.168.1.1/24 (su LAN)     s0/0 10.0.0.1/30 (enlace con R2)
R2: s0/0 10.0.0.2/30                 f0/0 192.168.2.1/24 (su LAN)

Tabla de R1:
  192.168.1.0/24   conectada   interfaz f0/0   sin gateway
  10.0.0.0/30      conectada   interfaz s0/0   sin gateway
  192.168.2.0/24   LEJANA      interfaz s0/0   gateway 10.0.0.2
                   (sale por el enlace con R2 y el gateway es la IP de R2 en ese enlace)</pre>
<div class="warn"><b>Errores típicos.</b> Poner tu propia IP como gateway. Poner la interfaz de la LAN para una red lejana. Escribir gateway en una red conectada. Confundir los dos extremos del enlace /30: en 10.0.0.0/30 las IP válidas son .1 y .2, una es tuya y la otra es del vecino.</div>`;

SK_LEARN.ios = `
<p>Hay dos cosas: <b>configurar una interfaz</b> (comandos IOS) y <b>elegir la línea <code>ip route</code> correcta</b> entre varias opciones.</p>
<h4>Configurar una interfaz, en orden</h4>
<pre>Router>enable
Router#configure terminal
Router(config)#interface fastEthernet 0/0
Router(config-if)#ip address 192.168.1.1 255.255.255.0
Router(config-if)#no shutdown</pre>
<ul class="steps">
  <li>La IP es de <b>host</b> (por ejemplo el primer host), nunca la dirección de red.</li>
  <li>La máscara va en <b>decimal</b> y es la del prefijo de esa LAN.</li>
  <li>Sin <code>no shutdown</code> la interfaz queda apagada.</li>
</ul>
<h4>La línea ip route</h4>
<pre>ip route &lt;red destino&gt; &lt;máscara de esa red&gt; &lt;siguiente salto&gt;
ip route 192.168.2.0 255.255.255.0 10.0.0.2          (a una red)
ip route 0.0.0.0 0.0.0.0 10.0.0.2                    (ruta por defecto)</pre>
<ol class="steps">
  <li><b>Red destino:</b> lleva la dirección de red, no una IP de host (<code>192.168.2.0</code>, no <code>192.168.2.5</code>). Solo con máscara /32 se apunta a un host.</li>
  <li><b>Máscara:</b> la de la red destino, no la de tu interfaz.</li>
  <li><b>Siguiente salto:</b> la IP del vecino, alcanzable desde una red que tengas conectada. No una IP propia ni una de la red destino.</li>
</ol>
<div class="warn"><b>Cómo descartar opciones.</b> Tachá primero las que no son sintaxis de IOS. Después las que usan la red como IP de la interfaz, las que tienen la máscara de otro prefijo (por ejemplo 255.255.255.128 en vez de 255.255.255.0) y las que ponen tu propia IP como siguiente salto.</div>`;

SK_LEARN.mc = `
<p>Son afirmaciones con 3 o 4 opciones. En los parciales se repiten casi las mismas y suelen cambiar <b>una palabra o un número</b>, así que hay que leer la afirmación completa. Esto es lo que más se repite:</p>
<div class="tbl"><table><thead><tr><th>Tema</th><th>Lo que tenés que saber</th></tr></thead><tbody>
<tr><td><b>IPv6</b></td><td>No tiene broadcast (usa multicast). El loopback es <code>::1</code>. El Hop Limit equivale al TTL. Neighbor Discovery reemplaza a ARP.</td></tr>
<tr><td><b>ARP</b></td><td>Resuelve la MAC de una IP dentro de la red local. El request va por broadcast y el reply por unicast.</td></tr>
<tr><td><b>Header IPv4</b></td><td>Tiene Versión, TTL, Protocolo, Checksum, Dirección origen y destino. Cada router resta 1 al TTL.</td></tr>
<tr><td><b>RFC 1918</b></td><td><code>10.0.0.0/8</code> · <code>172.16.0.0/12</code> (de 172.16.0.0 a 172.31.255.255) · <code>192.168.0.0/16</code></td></tr>
<tr><td><b>Hosts por máscara</b></td><td>2<sup>(32 − prefijo)</sup> − 2: /27 = 30 · /28 = 14 · /29 = 6 · /30 = 2.</td></tr>
<tr><td><b>TCP</b></td><td>Orientado a conexión, flujo de bytes, numera segmentos y los ordena en destino. Confiable, con control de flujo y de congestión.</td></tr>
<tr><td><b>UDP</b></td><td>Sin conexión, sin garantía de entrega ni de orden, header de 8 bytes.</td></tr></tbody></table></div>
<div class="warn"><b>Trampas que ya cayeron.</b> En 2025 la afirmación decía que el loopback de IPv6 es <code>::0</code>: es falsa, es <code>::1</code>. Ese año preguntaron las características de UDP en vez de las de TCP. La cantidad de dispositivos cambia de año en año: /29 en 2019 y 2022, /28 en 2024, /27 en 2025.</div>
<p>Los ejemplos de abajo salen de preguntas armadas con lo que se repite en los parciales, con la explicación de cada opción.</p>`;

SK_LEARN.tcp = `
<p>Es una pregunta abierta. Para sacar el puntaje completo conviene responder con orden: una frase para cada protocolo, la comparación en puntos y para qué se usa cada uno.</p>
<div class="tbl"><table><thead><tr><th></th><th>TCP</th><th>UDP</th></tr></thead><tbody>
<tr><td><b>Conexión</b></td><td>Orientado a conexión (handshake: SYN, SYN-ACK, ACK)</td><td>Sin conexión</td></tr>
<tr><td><b>Confiabilidad</b></td><td>Confirma con ACK y retransmite lo perdido</td><td>No garantiza la entrega</td></tr>
<tr><td><b>Orden</b></td><td>Numera segmentos y los ordena en destino</td><td>No ordena</td></tr>
<tr><td><b>Control</b></td><td>Control de flujo (Window) y de congestión</td><td>Ninguno</td></tr>
<tr><td><b>Header</b></td><td>Mínimo 20 bytes</td><td>8 bytes</td></tr>
<tr><td><b>Se usa en</b></td><td>Web, correo, transferencia de archivos</td><td>Voz, video en tiempo real, DNS</td></tr></tbody></table></div>
<h4>Respuesta modelo</h4>
<pre>TCP y UDP son protocolos de la capa de transporte y ambos usan puertos para
identificar la aplicación.
TCP está orientado a conexión (handshake de 3 pasos), es confiable (numera los
segmentos, usa ACK, retransmite y ordena en destino) y hace control de flujo y de
congestión. A cambio tiene más demora y un header más grande.
UDP no tiene conexión ni garantiza entrega ni orden, pero tiene un header de 8
bytes y menos demora. Se usa en aplicaciones en tiempo real (voz, video) y DNS.
TCP se usa donde no puede faltar nada: web, correo y archivos.</pre>
<p>Abajo practicás los puntos de a uno. Si los respondés sin ayuda, la respuesta de desarrollo te sale sola.</p>`;

/* ---------- Ejemplo resuelto ---------- */
function skSolved(ex) {
  var n = ex.steps.length;
  return '<div class="gen-enun">' + ex.enun + '</div><div class="gsteps">' + ex.steps.map(function (st, i) {
    return '<div class="gstep done ok"><div class="gn">Paso ' + (i + 1) + ' de ' + n + '</div><div class="gq">' + st.q + '</div><div class="gans">✓ ' + gShow(st) + '</div>' + (st.expl ? '<div class="gexp">' + st.expl + '</div>' : '') + '</div>';
  }).join('') + '</div>';
}

RENDER.skill = function () {
  var P = $('#skill');
  var prog = store('skill2') || {};
  SK_TYPES.forEach(function (t) { if (!prog[t.id]) prog[t.id] = { streak: 0, done: false, last: '', n: 0 }; });
  var queue = [], diag = false;

  var learn = SK_TYPES.map(function (t) {
    return '<details id="learn-' + t.id + '" data-t="' + t.id + '"><summary>' + t.n + ': cómo se resuelve y ejemplos</summary><div class="uc-ex">' + SK_LEARN[t.id] +
      '<h4>Ejemplos resueltos paso a paso</h4><p class="muted">Se generan con números distintos cada vez. Cada paso trae su explicación.</p><div class="sk-ex" data-t="' + t.id + '"></div>' +
      '<div class="actions"><button class="btn" data-more="' + t.id + '">Ver otro ejemplo</button><button class="btn primary" data-sk="go" data-t="' + t.id + '">Practicar este tipo</button></div></div></details>';
  }).join('');

  P.innerHTML = '<div class="wrap"><main>' +
    '<section><div><div class="eyebrow">Skill</div><h2>Práctica del parcial</h2></div>' +
    '<p class="lead">Practicás solo lo que se repite en los parciales (2017, 2019, 2022, 2024 y recuperatorio 2025), con ejercicios nuevos que se arman acá con números distintos y se corrigen paso a paso.</p>' +
    '<ol class="steps"><li><b>Diagnóstico:</b> un ejercicio de cada tipo, para ver dónde estás parado.</li>' +
    '<li><b>Insistís donde fallás:</b> "Seguir donde fallo" te da el próximo tipo que te falta.</li>' +
    '<li><b>Regla de salida:</b> si resolvés un tipo <b>dos veces seguidas</b> con a lo sumo un paso con ayuda, ese tipo queda listo y no se repite más.</li></ol>' +
    '<div class="actions"><button class="btn primary" id="sk-diag">Empezar diagnóstico</button><button class="btn" id="sk-next">Seguir donde fallo</button><button class="btn" id="sk-reset">Reiniciar avance</button><span class="skill-count" id="sk-total"></span></div></section>' +
    '<section id="sk-board"><div><div class="eyebrow">Tus tipos de ejercicio</div><h2>Del que más cae al que menos</h2></div><div class="sk-grid" id="sk-grid"></div></section>' +
    '<section id="sk-run" hidden><div id="sk-head"></div><div id="sk-area"></div><div id="sk-after"></div></section>' +
    '<section id="sk-learn"><div><div class="eyebrow">Para entender cada tipo</div><h2>Cómo se resuelve, con ejemplos</h2></div><p class="lead">Abrí el tipo que no te sale. Tiene el método, ejemplos resueltos y, abajo de todo, ejemplos nuevos generados al momento.</p><div>' + learn + '</div></section>' +
    '</main></div>';

  function board() {
    $('#sk-grid').innerHTML = SK_TYPES.map(function (t) {
      var p = prog[t.id], st = p.done ? 'Listo' : (p.n ? 'En práctica' : 'Sin empezar');
      return '<div class="sk-card' + (p.done ? ' done' : '') + '"><div class="sk-top"><span class="tag ' + t.prio + '">' + t.prio + '</span><span class="muted">' + t.ap + '</span></div><h3>' + t.n + '</h3><p class="muted">' + t.d + '</p>' +
        '<div class="sk-st"><span class="dots" role="img" aria-label="Racha: ' + (p.done ? 2 : p.streak) + ' de 2"><span class="' + (p.done || p.streak > 0 ? 'on' : '') + '"></span><span class="' + (p.done || p.streak > 1 ? 'on' : '') + '"></span></span><span class="sk-state">' + st + (p.n ? ' · ' + p.n + (p.n === 1 ? ' ejercicio' : ' ejercicios') : '') + '</span></div>' +
        '<div class="actions"><button class="btn primary" data-sk="go" data-t="' + t.id + '">Practicar</button><button class="btn" data-sk="learn" data-t="' + t.id + '">Cómo se resuelve</button></div></div>';
    }).join('');
    var d = SK_TYPES.filter(function (t) { return prog[t.id].done; }).length;
    $('#sk-total').textContent = d + ' de ' + SK_TYPES.length + ' tipos listos';
  }

  function byId(id) { return SK_TYPES.filter(function (t) { return t.id === id; })[0]; }
  function weak() {
    var pend = SK_TYPES.filter(function (t) { return !prog[t.id].done; });
    if (!pend.length) return null;
    var fails = pend.filter(function (t) { return prog[t.id].last === 'fail'; });
    var fresh = pend.filter(function (t) { return !prog[t.id].n; });
    return fails[0] || fresh[0] || pend[0];
  }
  function scrollTo(el) { try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* nada */ } }

  function run(t) {
    $('#sk-run').hidden = false;
    $('#sk-after').innerHTML = '';
    $('#sk-head').innerHTML = '<div class="eyebrow">' + (diag ? 'Diagnóstico · tipo ' + (SK_TYPES.length - queue.length) + ' de ' + SK_TYPES.length : 'Práctica') + '</div><h2>' + t.n + '</h2><p class="muted">' + t.d + '</p>';
    runGuided($('#sk-area'), t.gen(), function (clean, n) { finish(t, clean, n); });
    scrollTo($('#sk-run'));
  }

  function finish(t, clean, n) {
    var p = prog[t.id], helped = n - clean, ok = helped <= 1, msg;
    p.n++; p.last = ok ? 'ok' : 'fail';
    if (ok) { p.streak++; if (p.streak >= 2) p.done = true; } else { p.streak = 0; }
    store('skill2', prog); board();
    if (ok && p.done) msg = '<b>Tipo listo.</b> Lo resolviste dos veces seguidas: no hace falta repetirlo.';
    else if (ok) msg = '<b>Bien.</b> Racha 1 de 2. Con uno más sin ayuda lo das por listo.';
    else msg = '<b>Con ayuda en ' + helped + ' pasos.</b> La racha vuelve a 0. Repasá las explicaciones de los pasos marcados "con ayuda" y hacé otro del mismo tipo.';
    var btns = '';
    if (diag && queue.length) btns = '<button class="btn primary" data-sk="dnext">Siguiente: ' + queue[0].n + '</button>';
    else {
      if (diag) { diag = false; msg += '<br><br><b>Diagnóstico terminado.</b> ' + SK_TYPES.filter(function (x) { return prog[x.id].last === 'ok' || prog[x.id].done; }).length + ' de ' + SK_TYPES.length + ' tipos salieron bien. Seguí con los que fallaste.'; }
      var w = weak();
      btns = (p.done ? '' : '<button class="btn primary" data-sk="go" data-t="' + t.id + '">Otro de este tipo</button>') + (w ? '<button class="btn' + (p.done ? ' primary' : '') + '" data-sk="weak">Seguir donde fallo' + (w.id !== t.id ? ': ' + w.n : '') + '</button>' : '') +
        '<button class="btn" data-sk="learn" data-t="' + t.id + '">Repasar cómo se resuelve</button>';
      if (!w) msg += '<br><br><b>Todos los tipos están listos.</b> Hacé el Simulacro completo para probar todo junto.';
    }
    $('#sk-after').innerHTML = '<div class="gstep ' + (ok ? 'gfin' : 'cur') + '"><p>' + msg + '</p><div class="actions">' + btns + '</div></div>';
  }

  function openLearn(id) {
    var d = $('#learn-' + id); if (!d) return;
    d.open = true; fillEx(id, 2);
    scrollTo(d);
  }
  function fillEx(id, k) {
    var box = $('.sk-ex[data-t="' + id + '"]', P), t = byId(id);
    for (var i = 0; i < k; i++) {
      var w = h('div', { class: 'sk-solved' }, '<h4>Ejemplo ' + (box.children.length + 1) + '</h4>' + skSolved(t.gen()));
      box.appendChild(w);
    }
  }

  P.addEventListener('toggle', function (e) {
    var d = e.target;
    if (d.matches && d.matches('details[data-t]') && d.open) { var box = $('.sk-ex', d); if (box && !box.children.length) fillEx(d.dataset.t, 2); }
  }, true);

  P.addEventListener('click', function (e) {
    var b = e.target.closest('[data-sk],[data-more]'); if (!b || !P.contains(b)) return;
    var a = b.dataset.sk;
    if (b.dataset.more) { fillEx(b.dataset.more, 1); return; }
    if (a === 'go') { diag = false; queue = []; run(byId(b.dataset.t)); }
    else if (a === 'learn') openLearn(b.dataset.t);
    else if (a === 'dnext') run(queue.shift());
    else if (a === 'weak') { var w = weak(); diag = false; queue = []; if (w) run(w); }
  });
  $('#sk-diag').addEventListener('click', function () { diag = true; queue = SK_TYPES.slice(); run(queue.shift()); });
  $('#sk-next').addEventListener('click', function () {
    var w = weak(); diag = false; queue = [];
    if (w) run(w);
    else { $('#sk-run').hidden = false; $('#sk-head').innerHTML = ''; $('#sk-area').innerHTML = ''; $('#sk-after').innerHTML = '<div class="gstep gfin"><p><b>Todos los tipos están listos.</b> Hacé el Simulacro completo para probar todo junto.</p></div>'; scrollTo($('#sk-run')); }
  });
  $('#sk-reset').addEventListener('click', function () {
    SK_TYPES.forEach(function (t) { prog[t.id] = { streak: 0, done: false, last: '', n: 0 }; });
    store('skill2', prog); diag = false; queue = []; $('#sk-run').hidden = true; board();
  });
  board();
};

