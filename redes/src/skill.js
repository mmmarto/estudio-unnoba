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

/* ---------- Explicaciones por tipo (cortas; lo extra va plegado en "Más detalle") ---------- */
var SK_LEARN = {};

SK_LEARN.sub = `
<p>Te dan un bloque y una cantidad de subredes. La receta es siempre la misma:</p>
<ol class="steps">
  <li><b>Bits:</b> el menor <code>n</code> con 2<sup>n</sup> ≥ subredes. Con 9 subredes, n = 4.</li>
  <li><b>Prefijo nuevo:</b> el de antes + n.</li>
  <li><b>Bloque:</b> cuántos bits quedan en el octeto que cambia → 1 bit: 128 · 2: 64 · 3: 32 · 4: 16 · 5: 8 · 6: 4 · 7: 2. La máscara en ese octeto es 256 − bloque.</li>
  <li><b>Red de la subred K:</b> (K − 1) × bloque.</li>
  <li><b>Broadcast:</b> la red siguiente − 1. <b>Hosts:</b> desde red + 1 hasta broadcast − 1.</li>
  <li><b>¿A qué subred pertenece una IP?</b> valor del octeto ÷ bloque, parte entera, + 1.</li>
</ol>
<h4>Ejemplo</h4>
<pre>192.168.10.0/24 en 6 subredes
n = 3 (2³ = 8 ≥ 6)    →  /27  →  255.255.255.224
bloque 32             →  subredes en .0  .32  .64  .96  .128 ...
subred 4              →  red 192.168.10.96, broadcast 192.168.10.127
hosts                 →  192.168.10.97 a 192.168.10.126
IP 192.168.10.150     →  150 ÷ 32 = 4  →  subred 5</pre>
<details class="sk-more"><summary>Más detalle: otro ejemplo, octeto que cambia y errores típicos</summary><div class="sk-more-body">
<p><b>Qué octeto cambia:</b> de /9 a /16 el 2.º · de /17 a /24 el 3.º · de /25 a /32 el 4.º.</p>
<pre>10.30.0.0/16 en 12 subredes
n = 4 (2⁴ = 16 ≥ 12)  →  /20  →  255.255.240.0
bloque 16 (3.er octeto)  →  0, 16, 32, 48, 64 ...
subred 5              →  red 10.30.64.0, broadcast 10.30.79.255
IP 10.30.200.9        →  200 ÷ 16 = 12  →  subred 13</pre>
<ul class="steps">
  <li>Las subredes se cuentan desde 1, no desde 0.</li>
  <li>El primer host es red + 1. La red no se asigna.</li>
  <li>Si piden 9 salen 16: sobran, y está bien.</li>
  <li>Hosts por subred: 2<sup>bits de host</sup> − 2.</li>
</ul></div></details>`;

SK_LEARN.host = `
<p>Una IP <b>no sirve</b> para un host si es la <b>red</b> o el <b>broadcast</b>. Si está en el medio, sí sirve.</p>
<ol class="steps">
  <li><b>Bloque:</b> 256 − máscara en el octeto que cambia.</li>
  <li><b>Red:</b> el múltiplo del bloque justo por debajo (o igual) de la IP.</li>
  <li><b>Broadcast:</b> red + bloque − 1.</li>
  <li>IP = red o IP = broadcast → no vale. En el medio → vale.</li>
</ol>
<h4>Ejemplo</h4>
<pre>192.168.5.130/25
bloque 128  →  red 192.168.5.128, broadcast 192.168.5.255
130 está en el medio  →  HOST VÁLIDO</pre>
<details class="sk-more"><summary>Más detalle: tres ejemplos más y una trampa</summary><div class="sk-more-body">
<pre>172.16.32.0/20    bloque 16  →  32 es múltiplo de 16
                  → es la RED (broadcast 172.16.47.255)  →  NO

10.1.15.255/20    bloque 16  →  red 10.1.0.0
                  → es el BROADCAST  →  NO

200.30.63.255/18  bloque 64  →  red 200.30.0.0
                  → es el BROADCAST  →  NO (cayó en 2024)</pre>
<p><b>Trampa:</b> terminar en .255 o en .0 no alcanza para decidir. <code>10.0.1.255/16</code> es un host válido. Siempre calculá la red y el broadcast.</p></div></details>`;

SK_LEARN.rut = `
<p>Para cada red destino te preguntás dos cosas:</p>
<ol class="steps">
  <li><b>¿El router tiene una interfaz en esa red?</b> Sí → es <b>conectada</b>: interfaz = esa, sin gateway.</li>
  <li><b>No → es lejana:</b> interfaz = la del enlace hacia el router vecino que lleva a esa red.</li>
  <li><b>Gateway</b> = la IP del <b>vecino</b> en ese enlace. Nunca la tuya.</li>
</ol>
<h4>Ejemplo</h4>
<pre>R1: f0/0 192.168.1.1/24 (LAN)   s0/0 10.0.0.1/30 (enlace con R2)
R2: s0/0 10.0.0.2/30            f0/0 192.168.2.1/24 (LAN)

Tabla de R1:
192.168.1.0/24   conectada   f0/0   sin gateway
10.0.0.0/30      conectada   s0/0   sin gateway
192.168.2.0/24   lejana      s0/0   gateway 10.0.0.2</pre>
<details class="sk-more"><summary>Más detalle: errores típicos</summary><div class="sk-more-body"><ul class="steps">
  <li>Poner tu propia IP como gateway.</li>
  <li>Poner la interfaz de la LAN en una red lejana.</li>
  <li>Poner gateway en una red conectada.</li>
  <li>En un enlace /30 hay dos IP válidas: una es tuya y la otra es del vecino.</li>
</ul></div></details>`;

SK_LEARN.ios = `
<p><b>Configurar una interfaz</b>, siempre en este orden:</p>
<pre>enable
configure terminal
interface fastEthernet 0/0
ip address 192.168.1.1 255.255.255.0
no shutdown</pre>
<p>La IP es de <b>host</b> (no la red), la máscara va en decimal, y sin <code>no shutdown</code> queda apagada.</p>
<p><b>La línea ip route:</b></p>
<pre>ip route  &lt;red destino&gt;  &lt;máscara de esa red&gt;  &lt;siguiente salto&gt;
ip route 192.168.2.0 255.255.255.0 10.0.0.2
ip route 0.0.0.0 0.0.0.0 10.0.0.2      (ruta por defecto)</pre>
<details class="sk-more"><summary>Más detalle: cómo descartar opciones</summary><div class="sk-more-body"><ul class="steps">
  <li>Tachá las que no son comandos de IOS.</li>
  <li>Tachá las que ponen una IP de host como red destino (<code>192.168.2.5</code> en vez de <code>192.168.2.0</code>).</li>
  <li>Tachá las que tienen la máscara de otro prefijo.</li>
  <li>Tachá las que usan tu propia IP como siguiente salto.</li>
</ul></div></details>`;

SK_LEARN.mc = `
<p>En los parciales se repiten casi las mismas preguntas y cambian <b>una palabra o un número</b>. Esto es lo que más cae:</p>
<div class="tbl"><table><thead><tr><th>Tema</th><th>Recordá</th></tr></thead><tbody>
<tr><td><b>IPv6</b></td><td>No tiene broadcast. Loopback <code>::1</code>. Hop Limit = TTL. Reemplaza ARP por Neighbor Discovery.</td></tr>
<tr><td><b>ARP</b></td><td>Averigua la MAC de una IP de la misma red.</td></tr>
<tr><td><b>Header IPv4</b></td><td>Tiene Versión, TTL, Dirección origen y destino. El TTL baja 1 por router.</td></tr>
<tr><td><b>RFC 1918</b></td><td><code>10.0.0.0/8</code> · <code>172.16.0.0/12</code> · <code>192.168.0.0/16</code></td></tr>
<tr><td><b>Hosts por máscara</b></td><td>/27 = 30 · /28 = 14 · /29 = 6 · /30 = 2</td></tr>
<tr><td><b>TCP</b></td><td>Con conexión, numera segmentos, ordena, confiable, controla flujo y congestión.</td></tr>
<tr><td><b>UDP</b></td><td>Sin conexión, sin garantías, header de 8 bytes.</td></tr></tbody></table></div>
<div class="warn"><b>Ya cayó:</b> en 2025 decían que el loopback de IPv6 es <code>::0</code> (falso, es <code>::1</code>) y preguntaron las características de UDP en vez de TCP.</div>`;

SK_LEARN.tcp = `
<p>Es una pregunta abierta. Respondé con orden: qué es cada uno, las diferencias en puntos y para qué se usa.</p>
<div class="tbl"><table><thead><tr><th></th><th>TCP</th><th>UDP</th></tr></thead><tbody>
<tr><td><b>Conexión</b></td><td>Sí (handshake)</td><td>No</td></tr>
<tr><td><b>Entrega</b></td><td>Garantizada (ACK y retransmisión)</td><td>Sin garantía</td></tr>
<tr><td><b>Orden</b></td><td>Numera y ordena</td><td>No ordena</td></tr>
<tr><td><b>Control</b></td><td>De flujo y de congestión</td><td>Ninguno</td></tr>
<tr><td><b>Header</b></td><td>20 bytes o más</td><td>8 bytes</td></tr>
<tr><td><b>Se usa en</b></td><td>Web, correo, archivos</td><td>Voz, video, DNS</td></tr></tbody></table></div>
<details class="sk-more"><summary>Ver una respuesta modelo</summary><div class="sk-more-body"><pre>TCP y UDP son protocolos de la capa de transporte y los dos usan
puertos. TCP tiene conexión (handshake de 3 pasos), es confiable
(numera, usa ACK, retransmite y ordena) y controla el flujo y la
congestión. UDP no tiene conexión ni garantiza entrega ni orden, pero
su header es de 8 bytes y tiene menos demora. TCP se usa en web,
correo y archivos; UDP en voz, video y DNS.</pre></div></details>`;

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
    return '<details id="learn-' + t.id + '" data-t="' + t.id + '"><summary>' + t.n + '</summary><div class="uc-ex">' + SK_LEARN[t.id] +
      '<h4>Más ejemplos resueltos</h4><p class="muted">Salen con números distintos cada vez.</p><div class="sk-ex" data-t="' + t.id + '"></div>' +
      '<div class="actions"><button class="btn" data-more="' + t.id + '">Ver otro ejemplo</button><button class="btn primary" data-sk="go" data-t="' + t.id + '">Practicar este tipo</button></div></div></details>';
  }).join('');

  P.innerHTML = '<div class="wrap"><main>' +
    '<section><div><div class="eyebrow">Skill</div><h2>Práctica del parcial</h2></div>' +
    '<p class="lead">Ejercicios nuevos de lo que más se repite en los parciales. Se corrigen paso a paso, con pista y explicación.</p>' +
    '<ol class="steps"><li><b>Diagnóstico:</b> un ejercicio de cada tipo, para ver dónde estás parado.</li>' +
    '<li><b>Insistís donde fallás:</b> "Seguir donde fallo" te da el próximo tipo que te falta.</li>' +
    '<li><b>Regla de salida:</b> si resolvés un tipo <b>dos veces seguidas</b> con a lo sumo un paso con ayuda, ese tipo queda listo y no se repite más.</li></ol>' +
    '<div class="actions"><button class="btn primary" id="sk-diag">Empezar diagnóstico</button><button class="btn" id="sk-next">Seguir donde fallo</button><button class="btn" id="sk-reset">Reiniciar avance</button><span class="skill-count" id="sk-total"></span></div></section>' +
    '<section id="sk-board"><div><div class="eyebrow">Tus tipos de ejercicio</div><h2>Del que más cae al que menos</h2></div><div class="sk-grid" id="sk-grid"></div></section>' +
    '<section id="sk-run" hidden><div id="sk-head"></div><div id="sk-area"></div><div id="sk-after"></div></section>' +
    '<section id="sk-learn"><div><div class="eyebrow">Para entender cada tipo</div><h2>Cómo se resuelve, con ejemplos</h2></div><p class="lead">Abrí solo el tipo que no te sale. Cada uno tiene la receta corta, un ejemplo y más ejemplos nuevos abajo.</p><div>' + learn + '</div></section>' +
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

