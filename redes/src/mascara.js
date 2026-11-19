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

    '<section><div><div class="eyebrow">4 · Para qué sirve</div><h2>De la máscara sale todo el subneteo</h2></div>' +
    '<ol class="steps"><li><b>Octeto que cambia</b> = el octeto partido (el que no es 255 ni 0).</li>' +
    '<li><b>Bloque</b> = 256 − el valor de ese octeto. En /28: 256 − 240 = 16.</li>' +
    '<li><b>Hosts</b> = 2<sup>bits de host</sup> − 2. En /28: 4 bits de host → 16 − 2 = 14.</li></ol></section>' +

    '<section><div><div class="eyebrow">5 · Practicá</div><h2>Ejercicios de máscara</h2></div>' +
    '<p class="lead">Salen distintos cada vez. Se corrigen al instante y explican el paso.</p>' +
    '<div class="gen-bar"><button class="btn" id="mk-modo" type="button" aria-pressed="false">Cambiar a: de decimal a /n</button><span class="q-score" id="mk-score">0 de 0</span></div>' +
    '<div class="gstep cur" id="mk-q"></div></section>' +
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
};

