/* ============ MÁSCARA: guía visual y práctica ============ */
/* De /n a decimal y al revés, mirando los 32 bits. Todo se calcula con mkMask, así que los ejemplos no pueden quedar mal. */

var MK_TIRA = [128, 192, 224, 240, 248, 252, 254, 255]; /* valor del octeto con 1..8 unos */
function mkBits(p, i) { return Math.max(0, Math.min(8, p - 8 * i)); }
function mkOct(p, i) { var b = mkBits(p, i); return b === 0 ? 0 : MK_TIRA[b - 1]; }
function mkMask(p) { return [0, 1, 2, 3].map(function (i) { return mkOct(p, i); }).join('.'); }
function mkBitsOfOct(v) { var k = MK_TIRA.indexOf(v); return v === 0 ? 0 : k + 1; }
function mkExplainTo(p) {
  var k = Math.floor(p / 8), r = p % 8, ord = ['1.er', '2.º', '3.er', '4.º'];
  if (r === 0) return '/' + p + ' = ' + p + ' ÷ 8 = <b>' + k + '</b> octetos completos. Cada uno vale 255 y los que faltan valen 0 → <code>' + mkMask(p) + '</code>.';
  return '/' + p + ' = ' + (k ? k + ' × 8 + ' : '') + r + '. Hay <b>' + k + '</b> octeto' + (k === 1 ? '' : 's') + ' completo' + (k === 1 ? '' : 's') + ' (255) y el ' + ord[k] + ' tiene <b>' + r + '</b> bit' + (r === 1 ? '' : 's') + ' en 1 → ' +
    MK_TIRA[r - 1] + ' (en la tira, ' + r + ' unos valen ' + MK_TIRA[r - 1] + '). El resto va en 0 → <code>' + mkMask(p) + '</code>.';
}
function mkExplainFrom(p) {
  var parts = [0, 1, 2, 3].map(function (i) { return mkOct(p, i); });
  return parts.map(function (v) { return v + ' = ' + mkBitsOfOct(v) + ' bit' + (mkBitsOfOct(v) === 1 ? '' : 's'); }).join(' · ') + ' → ' + parts.map(function (v) { return mkBitsOfOct(v); }).join(' + ') + ' = <b>/' + p + '</b>.';
}


/* ---------- Subneteo completo: todo se calcula con L.split / L.info, no hay números escritos a mano ---------- */
var MK_ORD = ['1.er', '2.º', '3.er', '4.º'];
function mkOctIdx(p) { return Math.ceil(p / 8) - 1; }               /* octeto que cambia (0..3) para un prefijo partido */
function mkIpOct(ip, i) { return parseInt(ip.split('.')[i], 10); }
function mkRowsHtml(sp, n, mark) {
  var rows = sp.subs.slice(0, n).map(function (s) {
    var hit = mark.indexOf(s.k) >= 0;
    return '<tr' + (hit ? ' class="mk-hit"' : '') + '><td><b>' + s.k + '.ª</b></td><td><code>' + s.net + '</code></td><td><code>' + s.first + '</code> a <code>' + s.last + '</code></td><td><code>' + s.bc + '</code></td></tr>';
  }).join('');
  return '<div class="tbl"><table><thead><tr><th>Subred</th><th>Red</th><th>Hosts (rango)</th><th>Broadcast</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}
/* resolución completa en prosa corta, con los números reales de un ejercicio */
function mkWorked(base, bp, N, k1, k2, ip) {
  var sp = L.split(base, bp, N), blk = 256 - mkIpOct(sp.mask, mkOctIdx(sp.prefix)), oi = mkOctIdx(sp.prefix), on = MK_ORD[oi];
  var mo = mkIpOct(sp.mask, oi), a = sp.subs[k1 - 1], b = sp.subs[k2 - 1];
  var q = Math.floor(mkIpOct(ip, oi) / blk), c = sp.subs[q];
  var h = '<ol class="steps">';
  h += '<li><b>Bits:</b> 2<sup>' + (sp.bits - 1) + '</sup> = ' + Math.pow(2, sp.bits - 1) + ' no alcanza para ' + N + '; 2<sup>' + sp.bits + '</sup> = ' + sp.total + ' sí → <b>' + sp.bits + ' bits</b>.</li>';
  h += '<li><b>Prefijo y máscara:</b> ' + bp + ' + ' + sp.bits + ' = <b>/' + sp.prefix + '</b> → <code>' + sp.mask + '</code>.</li>';
  h += '<li><b>Octeto que cambia y bloque:</b> el ' + on + ' (' + mo + '). Bloque = 256 − ' + mo + ' = <b>' + blk + '</b>. Hosts por subred = 2<sup>' + (32 - sp.prefix) + '</sup> − 2 = <b>' + sp.hosts + '</b>.</li>';
  h += '<li><b>Red de la ' + k1 + '.ª:</b> (' + k1 + ' − 1) × ' + blk + ' = ' + ((k1 - 1) * blk) + ' en el ' + on + ' octeto → <code>' + a.net + '</code>.</li>';
  h += '<li><b>Rango de la ' + k2 + '.ª:</b> red = ' + (k2 - 1) + ' × ' + blk + ' = ' + ((k2 - 1) * blk) + ' → <code>' + b.net + '</code>. Broadcast = siguiente red − 1 = <code>' + b.bc + '</code>. Hosts: <code>' + b.first + '</code> a <code>' + b.last + '</code>.</li>';
  h += '<li><b>Subred de ' + ip + ':</b> ' + mkIpOct(ip, oi) + ' ÷ ' + blk + ' = ' + q + ' (parte entera) → subred ' + q + ' + 1 = <b>' + (q + 1) + '.ª</b>. Su red es <code>' + c.net + '</code>.</li>';
  h += '<li><b>Gateway:</b> primer host = red + 1 = <code>' + c.first + '</code>.</li>';
  return h + '</ol>' + mkRowsHtml(sp, N, [k1, k2, q + 1]);
}
function mkSubHtml() {
  var A = L.split('192.168.10.0', 24, 10), blkA = 256 - mkIpOct(A.mask, 3);
  var a5 = A.subs[4], a7 = A.subs[6], ipA = '192.168.10.100', cA = A.subs[Math.floor(100 / blkA)];
  var pref = [25, 26, 27, 28, 29, 30, 17, 18, 19, 20, 21, 22].map(function (p) {
    var oi = mkOctIdx(p), mo = mkIpOct(mkMask(p), oi);
    return '<tr><td><b>/' + p + '</b></td><td><code>' + mkMask(p) + '</code></td><td>' + MK_ORD[oi] + '</td><td><b>' + (256 - mo) + '</b></td><td>' + (Math.pow(2, 32 - p) - 2) + '</td></tr>';
  }).join('');
  var h = '';
  h += '<p class="lead">Este es el ejercicio que cae en todos los parciales. Se hace siempre igual: 8 pasos, y los primeros 3 ya los sabés de arriba.</p>';
  h += '<div class="warn"><b>Así lo piden:</b> «Dada la red <code>192.168.10.0/24</code>, cree <b>10</b> subredes». Averiguar:<ul class="steps"><li>La <b>red</b> de la <b>5.ª</b> subred</li><li>El <b>rango de hosts</b> de la <b>7.ª</b> subred</li><li>El <b>gateway</b> del host <code>' + ipA + '</code></li></ul>Lo vamos a resolver paso a paso con ese mismo ejemplo.</div>';

  h += '<div class="mk-step"><div class="mk-sn">Paso 1 · ¿Cuántos bits?</div><p>Buscá el primer <b>n</b> con <b>2<sup>n</sup> ≥ cantidad de subredes</b>. Tabla para no calcular: 2¹=2 · 2²=4 · 2³=8 · 2⁴=16 · 2⁵=32 · 2⁶=64.</p><p class="mk-ej"><b>Ejemplo:</b> 10 subredes. 2³ = 8 no alcanza. 2⁴ = 16 sí → <b>n = ' + A.bits + '</b>.</p></div>';
  h += '<div class="mk-step"><div class="mk-sn">Paso 2 · Prefijo nuevo</div><p><b>Prefijo original + n.</b> No es solo n: se suma a lo que ya tenías.</p><p class="mk-ej"><b>Ejemplo:</b> 24 + ' + A.bits + ' = <b>/' + A.prefix + '</b>.</p></div>';
  h += '<div class="mk-step"><div class="mk-sn">Paso 3 · Máscara en decimal</div><p>Es lo que viste arriba: octetos completos 255, el partido sale de la tira, el resto 0.</p><p class="mk-ej"><b>Ejemplo:</b> /' + A.prefix + ' = 24 + 4 → 255.255.255 y el 4.º con 4 unos = 240 → <code>' + A.mask + '</code>.</p></div>';
  h += '<div class="mk-step"><div class="mk-sn">Paso 4 · Octeto que cambia y bloque</div><ul class="steps"><li><b>Octeto que cambia</b> = el que no es 255 ni 0 en la máscara.</li><li><b>Bloque</b> = 256 − ese número. Es de a cuánto avanzan las subredes.</li><li><b>Hosts por subred</b> = 2<sup>32 − prefijo</sup> − 2.</li></ul><p class="mk-ej"><b>Ejemplo:</b> el 4.º octeto vale 240 → bloque = 256 − 240 = <b>' + blkA + '</b>. Hosts = 2<sup>' + (32 - A.prefix) + '</sup> − 2 = <b>' + A.hosts + '</b>.</p></div>';
  h += '<div class="mk-step"><div class="mk-sn">Paso 5 · Red de la subred K</div><ul class="steps"><li>En el octeto que cambia: <b>(K − 1) × bloque</b>. La 1.ª subred es la 0, por eso se resta 1.</li><li>Los octetos de la <b>izquierda</b> se copian de la red original.</li><li>Los de la <b>derecha</b> van en 0.</li></ul><p class="mk-ej"><b>Ejemplo:</b> 5.ª → (5 − 1) × ' + blkA + ' = ' + (4 * blkA) + ' → <code>' + a5.net + '</code>.</p></div>';
  h += '<div class="mk-step"><div class="mk-sn">Paso 6 · Broadcast y rango de hosts</div><ul class="steps"><li><b>Broadcast</b> = la red de la subred siguiente menos 1 (o: red + bloque − 1 en el octeto que cambia, y 255 a la derecha).</li><li><b>Primer host</b> = red + 1.</li><li><b>Último host</b> = broadcast − 1.</li></ul><p class="mk-ej"><b>Ejemplo:</b> 7.ª → red (7 − 1) × ' + blkA + ' = ' + (6 * blkA) + ' → <code>' + a7.net + '</code>. Broadcast = ' + a7.net + ' + ' + blkA + ' − 1 = <code>' + a7.bc + '</code>. Rango: <code>' + a7.first + '</code> a <code>' + a7.last + '</code>.</p></div>';
  h += '<div class="mk-step"><div class="mk-sn">Paso 7 · ¿A qué subred pertenece una IP?</div><p>Dividí el octeto que cambia por el bloque y <b>quedate con la parte entera</b>. Sumale 1 para contar desde la 1.ª. Esa cuenta multiplicada por el bloque te da la red.</p><p class="mk-ej"><b>Ejemplo:</b> ' + ipA + ' → 100 ÷ ' + blkA + ' = 6,25 → parte entera 6 → es la <b>7.ª</b> subred. Su red es 6 × ' + blkA + ' = ' + (6 * blkA) + ' → <code>' + cA.net + '</code>.</p></div>';
  h += '<div class="mk-step"><div class="mk-sn">Paso 8 · Gateway y host válido</div><ul class="steps"><li><b>Gateway</b> = primer host de la subred = red + 1.</li><li>Una IP es <b>host válido</b> si no es la red ni el broadcast de su subred.</li></ul><p class="mk-ej"><b>Ejemplo:</b> la red es <code>' + cA.net + '</code> → gateway <code>' + cA.first + '</code>.</p></div>';

  h += '<h3>Todas las subredes del ejemplo</h3><p class="muted">Mirá cómo cada fila sale de sumar el bloque (' + blkA + '). Las filas marcadas son las 3 que pedía el enunciado.</p>' + mkRowsHtml(A, 10, [5, 7, Math.floor(100 / blkA) + 1]);
  h += '<p class="muted">Con 10 subredes se pueden armar 16 (2<sup>4</sup>): las 6 últimas quedan libres. El bloque se calcula con la máscara, no con 10.</p>';

  h += '<h3>Bloque de cada máscara (para no calcular)</h3><div class="tbl"><table><thead><tr><th>Prefijo</th><th>Máscara</th><th>Octeto que cambia</th><th>Bloque</th><th>Hosts</th></tr></thead><tbody>' + pref + '</tbody></table></div>';

  h += '<h3>Otro ejemplo: cuando cambia el 3.er octeto</h3><p class="muted">Pasa si la red de partida es /16. La cuenta es la misma, pero el bloque se aplica al 3.er octeto, lo de la izquierda se copia y lo de la derecha queda en 0 (la red) o en 255 (el broadcast).</p>' +
       '<div class="warn"><b>Enunciado:</b> <code>172.20.0.0/16</code>, <b>9</b> subredes. a) red de la <b>6.ª</b>. b) rango de la <b>3.ª</b>. c) gateway de <code>172.20.100.7</code>.</div>' + mkWorked('172.20.0.0', 16, 9, 6, 3, '172.20.100.7');

  h += '<h3>Errores que se repiten</h3><ul class="steps">' +
    '<li><b>Poner solo n como prefijo.</b> El prefijo nuevo es el original + n (24 + 4 = /28, no /4).</li>' +
    '<li><b>Olvidar el − 1 en la K.</b> La 1.ª subred es la que empieza en la red original (0 × bloque).</li>' +
    '<li><b>Usar el último host como broadcast.</b> El broadcast es una dirección más: último host + 1.</li>' +
    '<li><b>Usar N en vez de 2<sup>n</sup>.</b> Con 10 subredes la máscara es /28 (16 subredes), no una de 10.</li>' +
    '<li><b>No copiar los octetos de la izquierda.</b> En 172.20.0.0/16 con /20 la 6.ª es <code>172.20.80.0</code>, no <code>0.0.80.0</code>.</li>' +
    '<li><b>Dar la red o el broadcast como host o gateway.</b> El gateway es red + 1.</li></ul>';
  return h;
}

RENDER.mascara = function () {
  var P = $('#mascara');
  var exRows = [28, 20, 26, 18, 27, 29, 22, 25].map(function (p) {
    var k = Math.floor(p / 8), r = p % 8;
    return '<tr><td><b>/' + p + '</b></td><td>' + p + ' = ' + (k ? k + ' × 8 + ' : '') + r + '</td><td>' + k + ' completos + ' + r + ' bits en el ' + ['1.er', '2.º', '3.er', '4.º'][k] + '</td><td>' + (MK_TIRA[r - 1]) + '</td><td><code>' + mkMask(p) + '</code></td></tr>';
  }).join('');
  var tira = MK_TIRA.map(function (v, i) {
    return '<tr><td>' + (i + 1) + '</td><td><code>' + '1'.repeat(i + 1) + '0'.repeat(7 - i) + '</code></td><td>' + (i === 0 ? '128' : '128' + [64, 32, 16, 8, 4, 2, 1].slice(0, i).map(function (x) { return ' + ' + x; }).join('')) + '</td><td><b>' + v + '</b></td></tr>';
  }).join('');

  P.innerHTML = '<div class="wrap"><main>' +
    '<section><div><div class="eyebrow">Guía</div><h2>La máscara de subred, paso a paso</h2></div>' +
    '<p class="lead">Es lo que más se traba y lo que más se usa. Si esto sale, el subneteo sale.</p>' +
    '<ol class="steps"><li>La máscara dice cuántos bits de la IP son de la <b>red</b> (los 1) y cuántos son del <b>host</b> (los 0).</li>' +
    '<li>Se escribe de dos formas que son lo mismo: <b>prefijo</b> (<code>/28</code>) o <b>decimal</b> (<code>255.255.255.240</code>).</li>' +
    '<li>Pasar de una a otra es <b>contar bits</b>. Se hace en 3 pasos y los ves abajo.</li></ol></section>' +

    '<section><div><div class="eyebrow">1 · Mirala</div><h2>Movela y mirá los bits</h2></div>' +
    '<p class="lead">Cada cuadradito es un bit. Los de color son 1 (red) y los apagados son 0 (host). Las 4 columnas son los 4 números de la máscara.</p>' +
    '<div class="mk-ctl"><label for="mk-range" class="mk-lab">Prefijo <b id="mk-p">/28</b></label><input type="range" id="mk-range" min="8" max="32" value="28" aria-label="Prefijo de la máscara">' +
    '<div class="filters" id="mk-chips" role="group" aria-label="Prefijos comunes">' + [16, 20, 24, 26, 27, 28, 29, 30].map(function (p) { return '<button class="chip" data-p="' + p + '">/' + p + '</button>'; }).join('') + '</div></div>' +
    '<div class="mk-row" id="mk-row"></div>' +
    '<div class="stepsbox" id="mk-out" role="status" aria-live="polite"></div></section>' +

    '<section><div><div class="eyebrow">2 · De /n a decimal</div><h2>Los 3 pasos</h2></div>' +
    '<ol class="steps"><li><b>Dividí el prefijo en grupos de 8.</b> Cuántos octetos completos hay (n ÷ 8) y cuántos bits sobran.</li>' +
    '<li><b>Los octetos completos valen 255.</b> Los que vienen después del grupo partido valen 0.</li>' +
    '<li><b>El octeto partido sale de la tira:</b> la cantidad de bits que sobran te da el valor.</li></ol>' +
    '<div class="tbl"><table><thead><tr><th>Unos en el octeto</th><th>Bits</th><th>Suma</th><th>Valor</th></tr></thead><tbody>' + tira + '</tbody></table></div>' +
    '<p class="muted">Truco para recordar la tira: empieza en 128 y cada valor suma la mitad del anterior: 128, +64 = 192, +32 = 224, +16 = 240, +8 = 248, +4 = 252, +2 = 254, +1 = 255.</p>' +
    '<h3>Ocho ejemplos resueltos</h3>' +
    '<div class="tbl"><table><thead><tr><th>Prefijo</th><th>Dividido</th><th>Qué hay</th><th>Octeto partido</th><th>Máscara</th></tr></thead><tbody>' + exRows + '</tbody></table></div></section>' +

    '<section><div><div class="eyebrow">3 · Al revés</div><h2>De decimal a /n</h2></div>' +
    '<ol class="steps"><li>Mirá cada número. <b>255 son 8 bits</b> y <b>0 son 0 bits</b>.</li>' +
    '<li>El número que no es 255 ni 0 lo buscás en la tira: te dice cuántos bits tiene.</li>' +
    '<li><b>Sumá</b> los bits de los 4 números.</li></ol>' +
    '<pre>255.255.240.0\n255 = 8 · 255 = 8 · 240 = 4 · 0 = 0\n8 + 8 + 4 + 0 = 20  →  /20</pre></section>' +

    '<section><div><div class="eyebrow">4 · Subneteo completo</div><h2>De la máscara al ejercicio: los 8 pasos</h2></div>' + mkSubHtml() + '</section>' +

    '<section><div><div class="eyebrow">5 · Practicá la máscara</div><h2>Ejercicios de máscara</h2></div>' +
    '<p class="lead">Salen distintos cada vez. Se corrigen al instante y explican el paso.</p>' +
    '<div class="gen-bar"><button class="btn" id="mk-modo" type="button" aria-pressed="false">Cambiar a: de decimal a /n</button><span class="q-score" id="mk-score">0 de 0</span></div>' +
    '<div class="gstep cur" id="mk-q"></div></section>' +

    '<section><div><div class="eyebrow">6 · Practicá el subneteo</div><h2>Ejercicio completo, guiado</h2></div>' +
    '<p class="lead">Es el mismo tipo de ejercicio del parcial, con números nuevos cada vez. Te va pidiendo cada paso de arriba, en orden.</p>' +
    '<div class="actions"><button class="btn primary" id="mk-sub-new" type="button">Otro ejercicio</button></div><div id="mk-sub"></div></section>' +
    '</main></div>';

  /* ----- visualizador ----- */
  function draw(p) {
    $('#mk-p').textContent = '/' + p; $('#mk-range').value = p;
    $$('#mk-chips .chip', P).forEach(function (c) { c.setAttribute('aria-pressed', String(parseInt(c.dataset.p, 10) === p)); });
    var cols = [0, 1, 2, 3].map(function (i) {
      var b = mkBits(p, i), cells = '';
      for (var j = 0; j < 8; j++) cells += '<span class="mk-bit' + (j < b ? ' on' : '') + '">' + (j < b ? 1 : 0) + '</span>';
      var calc = b === 8 ? '8 unos = 255' : b === 0 ? 'ningún uno = 0' : [128, 64, 32, 16, 8, 4, 2, 1].slice(0, b).join(' + ') + ' = ' + MK_TIRA[b - 1];
      return '<div class="mk-oct"><div class="eyebrow">Octeto ' + (i + 1) + '</div><div class="mk-bits">' + cells + '</div><div class="mk-val">' + mkOct(p, i) + '</div><div class="mk-calc">' + calc + '</div></div>';
    }).join('');
    $('#mk-row').innerHTML = cols;
    var r = p % 8, k = Math.floor(p / 8), host = 32 - p, hosts = Math.pow(2, host) - 2;
    var out = '<b>/' + p + '</b> → <code>' + mkMask(p) + '</code><br>' + p + ' bits de red y ' + host + ' de host.';
    if (r > 0 && p < 31) out += ' Octeto que cambia: el ' + ['1.º', '2.º', '3.º', '4.º'][k] + '. Bloque: 256 − ' + MK_TIRA[r - 1] + ' = <b>' + (256 - MK_TIRA[r - 1]) + '</b>.';
    if (host >= 2) out += ' Hosts: 2<sup>' + host + '</sup> − 2 = <b>' + hosts + '</b>.';
    $('#mk-out').innerHTML = out;
  }
  $('#mk-range').addEventListener('input', function (e) { draw(parseInt(e.target.value, 10)); });
  $('#mk-chips').addEventListener('click', function (e) { var b = e.target.closest('.chip'); if (b) draw(parseInt(b.dataset.p, 10)); });
  draw(28);

  /* ----- práctica ----- */
  var modo = 'to', score = { ok: 0, n: 0 }, cur = null;
  function nuevo() {
    var pool = [17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 12, 13, 14, 10, 9];
    var p = pick(pool); cur = { p: p, ans: null, done: false };
    var q = $('#mk-q');
    q.className = 'gstep cur';
    q.innerHTML = '<div class="gn">' + (modo === 'to' ? 'De /n a decimal' : 'De decimal a /n') + '</div><div class="gq">' +
      (modo === 'to' ? 'Escribí la máscara de <b>/' + p + '</b> en notación decimal.' : '¿Qué prefijo tiene la máscara <code>' + mkMask(p) + '</code>?') + '</div>' +
      '<input class="in gin" id="mk-in" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="' + (modo === 'to' ? '255.x.x.x' : 'Ej.: /24') + '" aria-label="Tu respuesta">' +
      '<div class="actions"><button class="btn primary" id="mk-chk" type="button">Comprobar</button><button class="btn" id="mk-show" type="button">No sé, mostrame</button><button class="btn" id="mk-next" type="button" hidden>Otro</button></div><div class="gmsg" id="mk-msg" role="status" aria-live="polite"></div>';
    $('#mk-chk').addEventListener('click', check);
    $('#mk-show').addEventListener('click', function () { finish(false, true); });
    $('#mk-next').addEventListener('click', nuevo);
    $('#mk-in').addEventListener('keydown', function (e) { if (e.key === 'Enter') { if (cur.done) nuevo(); else check(); } });
    try { $('#mk-in').focus({ preventScroll: true }); } catch (e) { /* nada */ }
  }
  function check() {
    if (cur.done) return;
    var v = $('#mk-in').value.trim().replace(/\s+/g, '');
    if (!v) { $('#mk-msg').textContent = 'Escribí tu respuesta.'; return; }
    var ok = modo === 'to' ? v === mkMask(cur.p) : v.replace(/^\//, '') === String(cur.p);
    if (ok) finish(true, false);
    else { cur.tries = (cur.tries || 0) + 1; $('#mk-in').classList.add('bad'); $('#mk-msg').innerHTML = '<span class="gwrong">Todavía no.</span> ' + (cur.tries >= 2 ? '<span class="ghint"><b>Pista.</b> ' + (modo === 'to' ? 'Contá cuántos octetos completos hay (n ÷ 8) y buscá el que sobra en la tira.' : 'Sumá los bits de cada número: 255 son 8, 0 son 0, y el otro buscalo en la tira.') + '</span>' : 'Probá de nuevo o tocá "No sé, mostrame".'); }
  }
  function finish(ok, gaveUp) {
    cur.done = true; score.n++; if (ok && !cur.tries) score.ok++;
    $('#mk-score').textContent = score.ok + ' de ' + score.n + ' bien a la primera';
    $('#mk-q').className = 'gstep done ' + (ok ? 'ok' : 'help');
    var ans = modo === 'to' ? '<code>' + mkMask(cur.p) + '</code>' : '<code>/' + cur.p + '</code>';
    $('#mk-msg').innerHTML = '<span class="' + (ok ? 'ok' : 'ghint') + '"><b>' + (ok ? 'Bien.' : 'La respuesta es ' + ans + '.') + '</b></span><div class="gexp">' + (modo === 'to' ? mkExplainTo(cur.p) : mkExplainFrom(cur.p)) + '</div>';
    $('#mk-chk').hidden = true; $('#mk-show').hidden = true; $('#mk-next').hidden = false; $('#mk-in').disabled = true;
    try { $('#mk-next').focus({ preventScroll: true }); } catch (e) { /* nada */ }
  }
  $('#mk-modo').addEventListener('click', function () {
    modo = modo === 'to' ? 'from' : 'to';
    this.textContent = modo === 'to' ? 'Cambiar a: de decimal a /n' : 'Cambiar a: de /n a decimal';
    this.setAttribute('aria-pressed', String(modo === 'from')); nuevo();
  });
  nuevo();

  function subNuevo() { runGuided($('#mk-sub'), gSubneteo(), null); }
  $('#mk-sub-new').addEventListener('click', subNuevo);
  subNuevo();
};

