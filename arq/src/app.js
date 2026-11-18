/* app.js — interfaz de la guía de Arquitectura */
(function () {
'use strict';
var L = AR;
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
function h(tag, attrs, html) {
  var e = document.createElement(tag);
  if (attrs) for (var k in attrs) { if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]); }
  if (html != null) e.innerHTML = html;
  return e;
}
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function rnd(n) { return Math.floor(Math.random() * n); }
function pick(a) { return a[rnd(a.length)]; }
function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function store(k, v) {
  try { if (v === undefined) { var r = localStorage.getItem('arq.' + k); return r ? JSON.parse(r) : null; } localStorage.setItem('arq.' + k, JSON.stringify(v)); } catch (e) { return null; }
}
function blk(x) {
  if (!x) return '';
  return /<(ol|ul|div|pre|table|p)[ >]/.test(x) ? '<div class="rich">' + x + '</div>' : '<p>' + x + '</p>';
}
function sameSet(a, b) { return a.length === b.length && a.every(function (x) { return b.indexOf(x) >= 0; }); }
function parseNums(s) { return String(s).split(/[\s,;]+/).filter(Boolean).map(Number).filter(function (x) { return !isNaN(x); }); }
function num(id) { var v = String($(id).value).replace(',', '.'); return v === '' ? NaN : parseFloat(v); }
function card(id) { for (var i = 0; i < DATA.teoria.length; i++) if (DATA.teoria[i].id === id) return DATA.teoria[i]; return null; }
function plain(s) { return String(s).replace(/<[^>]+>/g, ''); }
function cardTitle(id) { var c = card(id); return c ? plain(c.t) : id; }

/* ============ TABS ============ */
var TABS = ['teoria', 'esqueletos', 'simuladores', 'quizzes', 'finales', 'simulacro'];
var rendered = {};
var RENDER = {};
function showTab(id, anchor) {
  if (TABS.indexOf(id) < 0) id = 'teoria';
  TABS.forEach(function (t) {
    var on = t === id;
    $('#tab-' + t).setAttribute('aria-selected', on ? 'true' : 'false');
    $('#' + t).hidden = !on;
  });
  if (!rendered[id]) { rendered[id] = true; RENDER[id](); }
  try { if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id); } catch (e) { /* nada */ }
  if (anchor) { var el = document.getElementById(anchor); if (el) setTimeout(function () { el.scrollIntoView({ behavior: 'smooth' }); }, 30); }
}
function initTabs() {
  TABS.forEach(function (t) {
    $('#tab-' + t).addEventListener('click', function () { showTab(t); window.scrollTo(0, 0); });
  });
  window.addEventListener('hashchange', function () { showTab(location.hash.replace('#', '')); });
  showTab(location.hash.replace('#', '') || 'teoria');
}

/* ============ FECHA DE LA MESA ============ */
/* Cuando se confirme la fecha: EXAM = '2026-12-10T09:00:00-03:00' y MESA_TXT = 'Mesa de final · jueves 10 de diciembre'. */
var EXAM = null;
var MESA_TXT = null;
function countdown() {
  var el = $('#countdown');
  if (MESA_TXT) $('#mesa').textContent = MESA_TXT;
  if (!EXAM) { el.textContent = ''; return; }
  var target = new Date(EXAM).getTime();
  function tick() {
    var d = target - Date.now();
    if (d <= 0) { el.textContent = 'La mesa ya empezó o terminó'; return; }
    var days = Math.floor(d / 864e5), hs = Math.floor(d % 864e5 / 36e5), mi = Math.floor(d % 36e5 / 6e4);
    el.textContent = 'Faltan ' + (days > 0 ? days + ' d ' : '') + hs + ' h ' + mi + ' min';
  }
  tick(); setInterval(tick, 30000);
}

/* ============ TEORÍA ============ */
function cardHtml(c, i) {
  return '<article class="concept" id="c-' + c.id + '" data-prio="' + c.prio + '"><div class="concept-head"><div><div class="eyebrow">' + (i < 9 ? '0' : '') + (i + 1) + ' · ' + esc(c.unit) + (c.uso ? ' · ' + esc(c.uso) : '') + '</div><h3>' + c.t + '</h3></div><span class="tag ' + c.prio + '">' + c.prio + '</span>' +
    '<label class="mark"><input type="checkbox" data-id="' + c.id + '"> Lo domino</label></div>' +
    '<div class="body">' + (c.qs && c.qs.length ? '<div class="blk enunciado"><div class="blk-k">Cómo lo preguntan</div>' + c.qs.map(function (q) { return '<p>' + esc(q) + '</p>'; }).join('') + '</div>' : '') +
    '<div class="dse"><div class="dse-def"><div class="dse-k">Respuesta modelo</div>' + blk(c.def) + '</div><div class="dse-simple"><div class="dse-k">Esqueleto</div>' + blk(c.simple) + '</div>' +
    (c.ej ? '<div class="dse-ex"><div class="dse-k">Ejemplo</div>' + blk(c.ej) + '</div>' : '') + '</div>' +
    (c.warn ? '<div class="warn"><b>Ojo.</b> ' + c.warn + '</div>' : '') + '</div></article>';
}
RENDER.teoria = function () {
  var P = $('#teoria');
  var done = store('done') || [];
  var filter = 'todas';
  var html = '<div class="panel-head"><div class="filters" role="group" aria-label="Filtrar por prioridad"><span class="eyebrow">Mostrar</span>' +
    [['todas', 'Todas'], ['alta', 'Solo alta'], ['alta media', 'Alta + media'], ['pend', 'Sin dominar']].map(function (f, i) { return '<button class="chip" data-f="' + f[0] + '" aria-pressed="' + (i === 0) + '">' + f[1] + '</button>'; }).join('') +
    '</div><div class="jump"><label for="jump-t">Ir a</label><select id="jump-t"><option value="">Elegí un tema…</option>' +
    DATA.teoria.map(function (c, i) { return '<option value="c-' + c.id + '">' + (i < 9 ? '0' : '') + (i + 1) + ' · ' + esc(plain(c.t)) + '</option>'; }).join('') + '</select></div></div>';
  html += '<section id="que-toman"><div><div class="eyebrow">Qué toman</div><h2>Lo que se repite en 4 finales</h2></div><p class="lead">Armado con 4 finales (45 preguntas). Es un examen escrito de desarrollo con secciones temáticas: <b>cada sección vale todo o nada</b>, así que conviene no dejar ningún tema en blanco. El pozo de preguntas es cerrado: casi todo lo que sale ya apareció en alguno de estos finales.</p>' +
    '<div class="tbl"><table><thead><tr><th>Tema</th><th>Qué piden</th><th>Aparece en</th></tr></thead><tbody>' +
    DATA.toman.map(function (t) { return '<tr><td><b>' + t[0] + '</b> <span class="tag ' + t[1] + '">' + t[1] + '</span></td><td>' + t[2] + '</td><td>' + t[3] + '</td></tr>'; }).join('') + '</tbody></table></div></section>';
  html += '<section id="plan"><div><div class="eyebrow">Plan</div><h2>6 sesiones</h2></div><p class="lead">Ordenadas por lo que más se repite. Sin fechas fijas, para que entre en los huecos que te dejen los otros finales.</p><div class="plan">' +
    DATA.plan.map(function (d, i) { return '<div class="day' + (i === DATA.plan.length - 1 ? ' exam' : '') + '"><div class="d">' + d[0] + '<span>' + d[1] + '</span></div><div>' + d[2] + '</div></div>'; }).join('') + '</div></section>';
  html += '<section id="errores"><div><div class="eyebrow">Material con errores</div><h2>Lo que circula mal</h2></div><p class="lead">Algunas filminas y varios finales resueltos tienen errores. Si te toman estos puntos, escribí la columna de la derecha.</p>' +
    '<div class="tbl"><table><thead><tr><th>Dónde</th><th>Qué dice mal</th><th>Lo correcto</th></tr></thead><tbody>' +
    DATA.errores.map(function (r) { return '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; }).join('') + '</tbody></table></div></section>';
  html += '<div class="concepts" id="cards">' + DATA.teoria.map(cardHtml).join('') + '</div>';
  P.innerHTML = '<div class="wrap"><main>' + html + '</main></div>';

  function apply() {
    $$('.concept', P).forEach(function (a) {
      var id = a.id.slice(2), d = done.indexOf(id) >= 0;
      a.classList.toggle('done', d); $('input', a).checked = d;
      var pr = a.dataset.prio, show = true;
      if (filter === 'alta') show = pr === 'alta';
      else if (filter === 'alta media') show = pr !== 'baja';
      else if (filter === 'pend') show = !d;
      a.classList.toggle('hidden-by-filter', !show);
    });
  }
  P.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('.mark input')) {
      var id = t.dataset.id, i = done.indexOf(id);
      if (t.checked && i < 0) done.push(id); if (!t.checked && i >= 0) done.splice(i, 1);
      store('done', done); apply();
    }
    if (t.id === 'jump-t' && t.value) { var el = document.getElementById(t.value); if (el) el.scrollIntoView({ behavior: 'smooth' }); t.value = ''; }
  });
  P.addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    filter = b.dataset.f;
    $$('.chip', P).forEach(function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); });
    apply();
  });
  apply();
};
function refChips(ids) {
  if (!ids || !ids.length) return '';
  return '<div class="refs"><span class="muted">Desarrollo completo en la teoría:</span> ' + ids.map(function (id) { return '<a class="pill acc" href="#teoria" data-card="' + id + '">' + esc(cardTitle(id)) + '</a>'; }).join(' ') + '</div>';
}
document.addEventListener('click', function (e) {
  var a = e.target.closest('a[data-card]'); if (!a) return;
  e.preventDefault();
  var f = $('#teoria .chip[data-f="todas"]');
  if (rendered.teoria && f) f.click();
  showTab('teoria', 'c-' + a.dataset.card);
});

/* ============ ESQUELETOS ============ */
RENDER.esqueletos = function () {
  var P = $('#esqueletos');
  var done = store('esq') || [];
  var list = DATA.teoria.filter(function (c) { return c.prio !== 'baja'; });
  P.innerHTML = '<div class="wrap"><main><section><div><div class="eyebrow">Memorizar</div><h2>Esqueletos: tapá, escribí, destapá</h2></div><p class="lead">Cada tarjeta es una pregunta de final. Leé el enunciado, escribí de memoria los puntos que tiene que tener la respuesta, y recién ahí abrí el esqueleto. Si te faltó algo, volvé a la teoría. Tildá las que ya te salen sin mirar.</p>' +
    '<div class="filters"><button class="chip" data-f="todos" aria-pressed="true">Todas</button><button class="chip" data-f="pend" aria-pressed="false">Sin dominar</button><button class="btn" id="es-shuf">Mezclar</button></div><div class="concepts" id="es-list"></div></section></main></div>';
  var order = list.map(function (c) { return c.id; }), filt = 'todos';
  function draw() {
    var box = $('#es-list', P); box.innerHTML = '';
    order.forEach(function (id) {
      var c = card(id), d = done.indexOf(id) >= 0;
      if (filt === 'pend' && d) return;
      var a = h('article', { class: 'concept' + (d ? ' done' : '') });
      a.innerHTML = '<div class="concept-head"><div><div class="eyebrow">' + esc(c.unit) + ' · ' + esc(c.uso || '') + '</div><h3>' + c.t + '</h3></div><label class="mark"><input type="checkbox" data-id="' + id + '"' + (d ? ' checked' : '') + '> Me sale de memoria</label></div>' +
        '<div class="body"><div class="blk enunciado"><div class="blk-k">Cómo lo preguntan</div>' + (c.qs || []).map(function (q) { return '<p>' + esc(q) + '</p>'; }).join('') + '</div>' +
        '<details><summary>Ver el esqueleto</summary><div class="uc-ex">' + blk(c.simple) + (c.warn ? '<div class="warn"><b>Ojo.</b> ' + c.warn + '</div>' : '') + '</div></details></div>';
      box.appendChild(a);
    });
  }
  P.addEventListener('change', function (e) {
    var t = e.target; if (!t.matches('.mark input')) return;
    var id = t.dataset.id, i = done.indexOf(id);
    if (t.checked && i < 0) done.push(id); if (!t.checked && i >= 0) done.splice(i, 1);
    store('esq', done); t.closest('.concept').classList.toggle('done', t.checked);
  });
  P.addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    filt = b.dataset.f; $$('.chip', P).forEach(function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); }); draw();
  });
  $('#es-shuf', P).addEventListener('click', function () { order = shuffle(order); draw(); });
  draw();
};

/* ============ SIMULADORES ============ */
function hx(x, d) { return L.hex(x, d); }
function simCiclo(root) {
  var A = 3, B = 2, steps = [], i = 0;
  root.innerHTML = '<div><div class="eyebrow">Simulador 1</div><h3>Ciclo de instrucción, paso a paso</h3></div><p>Máquina de la filmina: instrucciones de 16 bits (4 de CODOP y 12 de dirección). Programa: <code>300: 1940</code> (cargar AC desde 940), <code>301: 5941</code> (sumar el dato de 941), <code>302: 2941</code> (guardar AC en 941). Todo en hexadecimal. Cambiá los datos y mirá cómo se mueve cada registro.</p>' +
    '<div class="sim-bar"><label>Dato en 940<input class="in" id="ci-a" type="number" min="0" max="9999" value="3" style="width:8ch"></label><label>Dato en 941<input class="in" id="ci-b" type="number" min="0" max="9999" value="2" style="width:8ch"></label><button class="btn" id="ci-rs">Reiniciar</button></div>' +
    '<div class="stepbox" id="ci-box"></div><div class="actions"><button class="btn" id="ci-prev">← Anterior</button><button class="btn primary" id="ci-next">Siguiente →</button><button class="btn" id="ci-end">Hasta el final</button><span class="muted" id="ci-n"></span></div>';
  function load() {
    A = Math.max(0, Math.min(9999, parseInt($('#ci-a', root).value, 10) || 0)); B = Math.max(0, Math.min(9999, parseInt($('#ci-b', root).value, 10) || 0));
    var r = L.runProgram({ 0x300: 0x1940, 0x301: 0x5941, 0x302: 0x2941, 0x940: A, 0x941: B }, 0x300, 3);
    steps = r.steps; i = 0; draw();
  }
  function draw() {
    var s = steps[i], prev = i > 0 ? steps[i - 1] : null;
    var regs = ['PC', 'IR', 'MAR', 'MBR', 'AC'].map(function (k) {
      var chg = s.chg.indexOf(k) >= 0;
      return '<div class="reg' + (chg ? ' chg' : '') + '"><b>' + k + '</b><span>' + hx(s.regs[k], k === 'PC' || k === 'MAR' ? 3 : 4) + '</span></div>';
    }).join('');
    var addrs = [0x300, 0x301, 0x302, 0x940, 0x941];
    var mem = '<div class="tbl"><table class="memt"><thead><tr><th>Dirección</th><th>Contenido</th><th>Qué es</th></tr></thead><tbody>' + addrs.map(function (a) {
      var changed = prev && prev.mem[a] !== s.mem[a];
      var kind = a < 0x400 && a >= 0x300 ? 'instrucción' : 'dato';
      return '<tr' + (changed ? ' class="chg"' : '') + '><td>' + hx(a, 3) + '</td><td>' + hx(s.mem[a] || 0, 4) + '</td><td>' + kind + '</td></tr>';
    }).join('') + '</tbody></table></div>';
    $('#ci-box', root).innerHTML = '<div class="phase">' + esc(s.ph) + '</div><div class="stepmsg">' + esc(s.txt) + '</div><div class="regs">' + regs + '</div>' + mem;
    $('#ci-n', root).textContent = 'Paso ' + (i + 1) + ' de ' + steps.length;
    $('#ci-prev', root).disabled = i === 0; $('#ci-next', root).disabled = i === steps.length - 1;
  }
  $('#ci-next', root).addEventListener('click', function () { if (i < steps.length - 1) { i++; draw(); } });
  $('#ci-prev', root).addEventListener('click', function () { if (i > 0) { i--; draw(); } });
  $('#ci-end', root).addEventListener('click', function () { i = steps.length - 1; draw(); });
  $('#ci-rs', root).addEventListener('click', load);
  $('#ci-a', root).addEventListener('change', load); $('#ci-b', root).addEventListener('change', load);
  load();
}

function simMesi(root) {
  var N = 3, m = L.mesiNew(N), log = [];
  root.innerHTML = '<div><div class="eyebrow">Simulador 2</div><h3>MESI con tres procesadores</h3></div><p>Una sola línea de memoria. Apretá una operación y mirá cómo cambia el estado en cada caché y qué dice el protocolo.</p>' +
    '<div class="mesi" id="me-st"></div><div class="actions" id="me-btn">' + [0, 1, 2].map(function (p) { return '<button class="btn" data-op="R" data-p="' + p + '">P' + (p + 1) + ' lee</button><button class="btn primary" data-op="W" data-p="' + p + '">P' + (p + 1) + ' escribe</button>'; }).join('') + '<button class="btn" id="me-rs">Reiniciar</button></div>' +
    '<ol class="mlog" id="me-log"></ol>' +
    '<div class="sc"><div class="eyebrow">Ejercicio</div><h4>Predecí los estados</h4><div id="me-ex"></div></div>';
  function draw() {
    $('#me-st', root).innerHTML = m.st.map(function (s, p) { return '<div class="mcard ' + s + '"><small>Caché de P' + (p + 1) + '</small><div class="big">' + s + '</div><small>' + L.NAME[s] + '</small></div>'; }).join('') +
      '<div class="mcard"><small>Memoria principal</small><div class="big" style="font-size:1.1rem">' + (m.memOk ? 'válida' : 'desactualizada') + '</div><small>' + (m.memOk ? 'igual a la caché' : 'hay una copia M') + '</small></div>';
    $('#me-log', root).innerHTML = log.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
  }
  $('#me-btn', root).addEventListener('click', function (e) {
    var b = e.target.closest('button[data-op]'); if (!b) return;
    var r = L.mesiStep(m, b.dataset.op, +b.dataset.p); m = r.m; log = r.log; draw();
  });
  $('#me-rs', root).addEventListener('click', function () { m = L.mesiNew(N); log = []; draw(); });
  var ex = null;
  function newEx() {
    var ops = [], k = 3 + rnd(2);
    for (var j = 0; j < k; j++) ops.push({ op: pick(['R', 'R', 'W']), p: rnd(N) });
    var r = L.mesiRun(N, ops);
    ex = { ops: ops, res: r };
    $('#me-ex', root).innerHTML = '<p>Las cachés empiezan inválidas (I). Se ejecuta, en orden: <b>' + ops.map(function (o) { return 'P' + (o.p + 1) + (o.op === 'R' ? ' lee' : ' escribe'); }).join(' → ') + '</b>. ¿Cómo queda cada una?</p>' +
      '<div class="sim-bar">' + [0, 1, 2].map(function (p) { return '<label>P' + (p + 1) + '<select data-p="' + p + '"><option value="">…</option><option>M</option><option>E</option><option>S</option><option>I</option></select></label>'; }).join('') + '<button class="btn primary" id="me-chk">Corregir</button><button class="btn" id="me-new">Otro</button></div><div id="me-fb"></div>';
    $('#me-chk', root).addEventListener('click', function () {
      var ok = 0, all = true;
      $$('select[data-p]', root).forEach(function (s) { var g = s.value === r.m.st[+s.dataset.p]; if (s.value === '') all = false; if (g) ok++; s.classList.toggle('ok', g); s.classList.toggle('bad', !g); });
      if (!all) return;
      $('#me-fb', root).innerHTML = '<div class="q-fb ' + (ok === N ? 'ok' : 'bad') + '"><b>' + (ok === N ? 'Correcto.' : ok + ' de ' + N + '.') + '</b> Estados finales: ' + r.m.st.map(function (s, p) { return 'P' + (p + 1) + ' = ' + s; }).join(', ') + '.<ol class="mlog">' + r.steps.map(function (s, j) { return '<li><b>' + (j + 1) + '.</b> ' + s.log.map(esc).join(' ') + '</li>'; }).join('') + '</ol></div>';
    });
    $('#me-new', root).addEventListener('click', newEx);
  }
  draw(); newEx();
}

function simReemplazo(root) {
  root.innerHTML = '<div><div class="eyebrow">Simulador 3</div><h3>Algoritmos de reemplazo de caché</h3></div><p>Escribí la secuencia de bloques que pide la CPU y la cantidad de marcos de la caché. Se comparan FIFO, LRU y LFU (en LFU, si hay empate se reemplaza el que entró primero). Con la secuencia de ejemplo y 3 marcos: FIFO 10 fallas, LRU 9.</p>' +
    '<div class="sim-bar"><label>Secuencia de bloques<input class="in wide" id="re-s" type="text" value="7 0 1 2 0 3 0 4 2 3 0 3 2"></label><label>Marcos<input class="in" id="re-c" type="number" min="1" max="8" value="3" style="width:7ch"></label><label>Mostrar<select id="re-p"><option>FIFO</option><option selected>LRU</option><option>LFU</option></select></label><button class="btn primary" id="re-go">Simular</button></div><div id="re-out"></div>';
  function run() {
    var seq = parseNums($('#re-s', root).value), cap = Math.max(1, Math.min(8, parseInt($('#re-c', root).value, 10) || 3)), pol = $('#re-p', root).value;
    if (!seq.length) { $('#re-out', root).innerHTML = '<p class="muted">Escribí al menos un bloque.</p>'; return; }
    var all = { FIFO: L.replace(seq, cap, 'FIFO'), LRU: L.replace(seq, cap, 'LRU'), LFU: L.replace(seq, cap, 'LFU') }, r = all[pol];
    var head = '<tr><th>Pedido</th>' + seq.map(function (b) { return '<th>' + b + '</th>'; }).join('') + '</tr>';
    var rows = '';
    for (var k = 0; k < cap; k++) rows += '<tr><th>Marco ' + (k + 1) + '</th>' + r.steps.map(function (s) { return '<td>' + (s.cache[k] !== undefined ? s.cache[k] : '') + '</td>'; }).join('') + '</tr>';
    rows += '<tr><th>Resultado</th>' + r.steps.map(function (s) { return '<td class="' + (s.hit ? 'hit' : 'miss') + '">' + (s.hit ? 'acierto' : 'falla') + '</td>'; }).join('') + '</tr>';
    rows += '<tr><th>Sale</th>' + r.steps.map(function (s) { return '<td>' + (s.ev !== null ? s.ev : '') + '</td>'; }).join('') + '</tr>';
    $('#re-out', root).innerHTML = '<div class="tbl"><table class="rtbl"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>' +
      '<div class="tbl"><table><thead><tr><th>Algoritmo</th><th>Aciertos</th><th>Fallas</th><th>Tasa de aciertos</th></tr></thead><tbody>' + ['FIFO', 'LRU', 'LFU'].map(function (k) { return '<tr' + (k === pol ? ' class="chg"' : '') + '><td><b>' + k + '</b></td><td>' + all[k].hits + '</td><td>' + all[k].misses + '</td><td>' + Math.round(all[k].hits / seq.length * 100) + ' %</td></tr>'; }).join('') + '</tbody></table></div>';
  }
  $('#re-go', root).addEventListener('click', run); $('#re-p', root).addEventListener('change', run); run();
}

function simCalc(root) {
  root.innerHTML = '<div><div class="eyebrow">Simulador 4</div><h3>Calculadoras de performance, buses y GPU</h3></div><div class="calc">' +
    '<div class="sc"><h4>Tiempo de ejecución y MIPS</h4><div class="sim-bar"><label>Instrucciones (Ic)<input class="in" id="ca-ic" type="number" value="1000000000" style="width:15ch"></label><label>CPI<input class="in" id="ca-cpi" type="number" step="0.1" value="2" style="width:8ch"></label><label>Frecuencia (GHz)<input class="in" id="ca-f" type="number" step="0.1" value="2" style="width:8ch"></label></div><div class="out" id="ca-o1"></div><p class="muted">T = Ic × CPI × τ, con τ = 1 / f · MIPS = f / (CPI × 10⁶)</p></div>' +
    '<div class="sc"><h4>Buses</h4><div class="sim-bar"><label>Líneas de direcciones<input class="in" id="ca-n" type="number" min="1" max="64" value="16" style="width:8ch"></label><label>Bits por instrucción<input class="in" id="ca-ib" type="number" value="16" style="width:8ch"></label><label>Ancho del bus de datos<input class="in" id="ca-db" type="number" value="8" style="width:8ch"></label></div><div class="out" id="ca-o2"></div><p class="muted">Posiciones = 2ⁿ · accesos por instrucción = ⌈bits de la instrucción / ancho del bus de datos⌉</p></div>' +
    '<div class="sc"><h4>GPU: filtro sobre una imagen</h4><div class="sim-bar"><label>Píxeles<input class="in" id="ca-px" type="number" value="2073600" style="width:12ch"></label><label>SM<input class="in" id="ca-sm" type="number" value="16" style="width:7ch"></label><label>Cores por SM<input class="in" id="ca-co" type="number" value="32" style="width:7ch"></label><label>Núcleos de la CPU<input class="in" id="ca-cpu" type="number" value="4" style="width:7ch"></label></div><div class="out" id="ca-o3"></div><p class="muted">Se supone un píxel por core por ciclo: ciclos = ⌈píxeles / (SM × cores)⌉.</p></div></div>';
  function run() {
    var ic = num('#ca-ic'), cpi = num('#ca-cpi'), f = num('#ca-f');
    $('#ca-o1', root).innerHTML = (ic > 0 && cpi > 0 && f > 0) ? 'T = ' + L.fmtT(L.tiempo(ic, cpi, f * 1e9)) + ' · ' + (+L.mips(f * 1e9, cpi).toPrecision(5)).toLocaleString('es-AR') + ' MIPS' : 'Completá los tres datos con valores positivos.';
    var n = parseInt($('#ca-n', root).value, 10), ib = num('#ca-ib'), db = num('#ca-db');
    $('#ca-o2', root).innerHTML = (n > 0 && n <= 64 && ib > 0 && db > 0) ? n + ' líneas → ' + L.fmtMem(L.capacidad(n)) + ' · ' + ib + ' bits sobre un bus de ' + db + ' bits → ' + L.accesos(ib, db) + ' accesos por instrucción' : 'Completá los datos.';
    var px = num('#ca-px'), sm = num('#ca-sm'), co = num('#ca-co'), cp = num('#ca-cpu');
    $('#ca-o3', root).innerHTML = (px > 0 && sm > 0 && co > 0 && cp > 0) ? 'GPU: ' + L.ciclosGPU(px, sm, co).toLocaleString('es-AR') + ' ciclos (' + (sm * co) + ' cores) · CPU: ' + L.ciclosGPU(px, 1, cp).toLocaleString('es-AR') + ' ciclos (' + cp + ' núcleos)' : 'Completá los datos.';
  }
  $$('input', root).forEach(function (i) { i.addEventListener('input', run); }); run();
}
RENDER.simuladores = function () {
  var P = $('#simuladores');
  P.innerHTML = '<div class="wrap"><main><section id="sim1"></section><section id="sim2"></section><section id="sim3"></section><section id="sim4"></section></main></div>';
  simCiclo($('#sim1', P)); simMesi($('#sim2', P)); simReemplazo($('#sim3', P)); simCalc($('#sim4', P));
};

/* ============ QUIZZES ============ */
function quizCard(q, num, onAnswer) {
  var multi = q.a.length > 1;
  var cd = h('div', { class: 'q-card' });
  var rid = Math.random().toString(36).slice(2, 6);
  var opts = q.o.map(function (o, i) { return '<label class="q-opt"><input type="' + (multi ? 'checkbox' : 'radio') + '" name="q' + num + '-' + rid + '" value="' + i + '"> <span>' + o + '</span></label>'; }).join('');
  cd.innerHTML = '<div class="q-num">' + num + '</div><div class="q-body"><div class="eyebrow">' + (q.t || '') + (multi ? ' · elegí ' + q.a.length : '') + '</div><div class="q-q">' + q.q + '</div><div class="q-opts">' + opts + '</div>' +
    '<div class="q-actions"><button class="btn primary q-chk">Corregir</button></div><div class="q-fb" hidden></div></div>';
  var done = false;
  $('.q-chk', cd).addEventListener('click', function () {
    if (done) return;
    var sel = $$('input:checked', cd).map(function (i) { return parseInt(i.value, 10); });
    if (!sel.length) return;
    done = true;
    var ok = sameSet(sel, q.a);
    $$('.q-opt', cd).forEach(function (lab, i) {
      $('input', lab).disabled = true;
      if (q.a.indexOf(i) >= 0) lab.classList.add('ok'); else if (sel.indexOf(i) >= 0) lab.classList.add('bad');
    });
    var fb = $('.q-fb', cd); fb.hidden = false; fb.className = 'q-fb ' + (ok ? 'ok' : 'bad');
    fb.innerHTML = '<b>' + (ok ? 'Correcto.' : 'No es esa.') + '</b> ' + (q.e || '') + (q.r ? refChips([q.r]) : ''); $('.q-chk', cd).hidden = true;
    if (onAnswer) onAnswer(ok);
  });
  return cd;
}
function uniqueOpts(correct, cands, n) {
  var o = [correct];
  shuffle(cands).forEach(function (c) { if (o.length < n && o.indexOf(c) < 0) o.push(c); });
  return o;
}
function mkGen(t, q, correct, cands, e) {
  var o = shuffle(uniqueOpts(String(correct), cands.map(String), 4));
  return { t: 'Generada · ' + t, q: q, o: o, a: [o.indexOf(String(correct))], e: e };
}
function fmtN(x) { return x.toLocaleString('es-AR'); }
var GENQ = [
  function () { var n = pick([8, 10, 12, 16, 20, 24, 32]), c = L.capacidad(n);
    return mkGen('Buses', 'Un procesador tiene un bus de direcciones de <b>' + n + '</b> líneas. ¿Cuántas posiciones de memoria puede direccionar?', L.fmtMem(c), [L.fmtMem(L.capacidad(n - 1)), L.fmtMem(L.capacidad(n + 1)), L.fmtMem(n * n), L.fmtMem(n * 2), L.fmtMem(L.capacidad(n / 2))], 'Con n líneas se direccionan 2ⁿ posiciones: 2^' + n + ' = ' + fmtN(c) + '.'); },
  function () { var db = pick([8, 16, 32]), ib = pick([16, 32, 64].filter(function (x) { return x > db; })), c = L.accesos(ib, db);
    return mkGen('Buses', 'Un bus de datos de <b>' + db + '</b> bits y instrucciones de <b>' + ib + '</b> bits. ¿Cuántos accesos a memoria hacen falta por instrucción?', c, [c * 2, c + 1, Math.max(1, c - 1), c * 4, ib], 'Accesos = bits de la instrucción / ancho del bus de datos = ' + ib + ' / ' + db + ' = ' + c + '.'); },
  function () { var ic = pick([1, 2, 5, 10]) * 1e9, cpi = pick([1, 2, 4]), f = pick([1, 2, 4]), t = L.tiempo(ic, cpi, f * 1e9);
    return mkGen('Performance', 'Un programa tiene <b>' + fmtN(ic) + '</b> instrucciones, CPI = <b>' + cpi + '</b>, frecuencia <b>' + f + ' GHz</b>. ¿Cuánto tarda (T = Ic × CPI × τ)?', L.fmtT(t), [L.fmtT(t * 2), L.fmtT(t / 2), L.fmtT(t * 4), L.fmtT(t / 4), L.fmtT(ic / (f * 1e9))], 'T = ' + fmtN(ic) + ' × ' + cpi + ' × (1 / ' + f + ' GHz) = ' + L.fmtT(t) + '.'); },
  function () { var cpi = pick([1, 2, 4, 5]), f = pick([1, 2, 2.5, 4]), m = L.mips(f * 1e9, cpi);
    return mkGen('Performance', 'Un procesador de <b>' + f + ' GHz</b> con CPI = <b>' + cpi + '</b>. ¿Cuántos MIPS rinde?', fmtN(+m.toFixed(2)) + ' MIPS', [fmtN(+(m * 2).toFixed(2)) + ' MIPS', fmtN(+(m / 2).toFixed(2)) + ' MIPS', fmtN(+(m * cpi).toFixed(2)) + ' MIPS', fmtN(+(m * 10).toFixed(2)) + ' MIPS'], 'MIPS = f / (CPI × 10⁶) = ' + fmtN(f * 1e9) + ' / (' + cpi + ' × 10⁶) = ' + fmtN(+m.toFixed(2)) + '.'); },
  function () { var px = pick([1280 * 720, 1920 * 1080, 2560 * 1440]), sm = pick([8, 16, 32]), co = pick([32, 64]), c = L.ciclosGPU(px, sm, co);
    return mkGen('GPU', 'Un filtro se aplica a una imagen de <b>' + fmtN(px) + '</b> píxeles en una GPU con <b>' + sm + '</b> SM de <b>' + co + '</b> cores cada uno (un píxel por core por ciclo). ¿Cuántos ciclos hacen falta?', fmtN(c), [fmtN(c * 2), fmtN(Math.ceil(px / sm)), fmtN(Math.ceil(px / co)), fmtN(px), fmtN(Math.ceil(c / 2))], 'Ciclos = ⌈píxeles / (SM × cores)⌉ = ⌈' + fmtN(px) + ' / ' + (sm * co) + '⌉ = ' + fmtN(c) + '.'); },
  function () { var ops = [], k = 2 + rnd(2); for (var j = 0; j < k; j++) ops.push({ op: pick(['R', 'R', 'W']), p: rnd(3) });
    var who = rnd(3), r = L.mesiRun(3, ops), fin = r.m.st[who];
    return mkGen('MESI', 'Tres cachés empiezan en I. Se ejecuta: <b>' + ops.map(function (o) { return 'P' + (o.p + 1) + (o.op === 'R' ? ' lee' : ' escribe'); }).join(' → ') + '</b>. ¿En qué estado queda la línea en P' + (who + 1) + '?', fin, ['M', 'E', 'S', 'I'], r.steps.map(function (s, j) { return (j + 1) + '. ' + s.log.join(' '); }).join(' ')); },
  function () { var seq = []; for (var j = 0; j < 10; j++) seq.push(rnd(5)); var cap = 3, pol = pick(['FIFO', 'LRU']), r = L.replace(seq, cap, pol);
    return mkGen('Reemplazo', 'Caché de <b>' + cap + '</b> marcos, política <b>' + pol + '</b>, pedidos: <b>' + seq.join(' ') + '</b>. ¿Cuántas fallas hay?', r.misses, [r.misses + 1, Math.max(0, r.misses - 1), r.misses + 2, Math.max(0, r.misses - 2), seq.length], 'Fallas: ' + r.steps.map(function (s) { return s.b + (s.hit ? ' acierto' : ' falla'); }).join(', ') + '. Total: ' + r.misses + '.'); },
  function () { var op = pick([1, 2, 5]), ad = 0x100 + rnd(0x800), ins = (op << 12) | ad, name = L.OPS[op];
    return mkGen('Ciclo de instrucción', 'En la máquina de la filmina (4 bits de CODOP y 12 de dirección), el IR contiene <b>' + hx(ins, 4) + '</b> (hexadecimal). ¿Qué hace?', name + ' ' + hx(ad, 3), [L.OPS[1] + ' ' + hx(ad, 3), L.OPS[2] + ' ' + hx(ad, 3), L.OPS[5] + ' ' + hx(ad, 3), name + ' ' + hx(ad ^ 0x111, 3), L.OPS[op === 1 ? 5 : 1] + ' ' + hx(ins & 0xFFF ^ 0x0F0, 3)].filter(function (x, ix, a) { return a.indexOf(x) === ix; }), 'CODOP = ' + hx(op, 1) + ' → ' + name + ' · dirección = ' + hx(ad, 3) + '.'); }
];
function genQuestion() { return pick(GENQ)(); }
RENDER.quizzes = function () {
  var P = $('#quizzes');
  var temas = ['Todas'].concat(DATA.quiz.map(function (q) { return q.t; }).filter(function (v, i, a) { return a.indexOf(v) === i; }));
  var score = { ok: 0, n: 0 }, topic = 'Todas';
  P.innerHTML = '<div class="wrap"><main><section><div><div class="eyebrow">Autoevaluación</div><h2>Preguntas tipo final</h2></div><p class="lead">' + DATA.quiz.length + ' preguntas armadas con lo que se repite en los finales, más un generador con números nuevos. Elegí la opción (o las opciones, si la pregunta lo dice) y apretá Corregir.</p>' +
    '<div class="q-head"><div class="filters" id="q-filters">' + temas.map(function (t, i) { return '<button class="chip" data-t="' + t + '" aria-pressed="' + (i === 0) + '">' + t + '</button>'; }).join('') + '</div><div class="q-score" id="q-score">0 de 0</div></div>' +
    '<div class="actions"><button class="btn" id="q-shuf">Mezclar</button><button class="btn" id="q-reset">Reiniciar</button></div><div class="quiz" id="q-list"></div></section>' +
    '<section><div><div class="eyebrow">Sin fin</div><h2>Generador de preguntas</h2></div><p class="lead">Cada una sale con datos distintos: capacidad de un bus de direcciones, accesos por instrucción, tiempo de ejecución, MIPS, ciclos de una GPU, estados de MESI, fallas de FIFO y LRU, y decodificación de una instrucción.</p><div class="actions"><button class="btn primary" id="gq-new">Pregunta nueva</button><span class="muted" id="gq-sc"></span></div><div id="gq-box" class="quiz"></div></section></main></div>';
  var order = DATA.quiz.map(function (q, i) { return i; });
  function upd() { $('#q-score').textContent = score.ok + ' de ' + score.n + ' bien'; }
  function draw() {
    var box = $('#q-list'); box.innerHTML = '';
    order.forEach(function (i) { var q = DATA.quiz[i]; if (topic !== 'Todas' && q.t !== topic) return; box.appendChild(quizCard(q, i + 1, function (ok) { score.n++; if (ok) score.ok++; upd(); })); });
  }
  P.addEventListener('click', function (e) {
    var b = e.target.closest('#q-filters .chip');
    if (b) { topic = b.dataset.t; $$('#q-filters .chip', P).forEach(function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); }); draw(); }
  });
  $('#q-shuf').addEventListener('click', function () { order = shuffle(order); draw(); });
  $('#q-reset').addEventListener('click', function () { score = { ok: 0, n: 0 }; upd(); draw(); });
  var gs = { ok: 0, n: 0 };
  function gnew() { var box = $('#gq-box'); box.innerHTML = ''; box.appendChild(quizCard(genQuestion(), gs.n + 1, function (ok) { gs.n++; if (ok) gs.ok++; $('#gq-sc').textContent = gs.ok + ' de ' + gs.n + ' bien'; })); }
  $('#gq-new').addEventListener('click', gnew); gnew();
  draw(); upd();
};

/* ============ FINALES ============ */
function answerHtml(ids) {
  return ids.map(function (id) {
    var c = card(id); if (!c) return '';
    return '<div class="ans"><h4>' + c.t + '</h4>' + blk(c.def) + (c.ej && c.id !== 'harvard' && c.id !== 'vn' ? '' : (c.ej ? c.ej : '')) + (c.warn ? '<div class="warn"><b>Ojo.</b> ' + c.warn + '</div>' : '') + '</div>';
  }).join('');
}
RENDER.finales = function () {
  var P = $('#finales');
  var done = store('fin') || [];
  var uni = {};
  DATA.finales.forEach(function (f) { f.secciones.forEach(function (s) { s.ex.forEach(function (x) { var u = card(x.ref[0]).unit, t = uni[u] = uni[u] || { fin: {}, n: 0 }; t.fin[f.id] = 1; t.n++; }); }); });
  var rows = Object.keys(uni).map(function (k) { return [k, Object.keys(uni[k].fin).length, uni[k].n]; }).sort(function (a, b) { return b[1] - a[1] || b[2] - a[2]; });
  var total = DATA.finales.reduce(function (s, f) { return s + f.secciones.reduce(function (z, x) { return z + x.ex.length; }, 0); }, 0);
  var html = '<section><div><div class="eyebrow">Banco de finales</div><h2>4 finales</h2></div><p class="lead">' + total + ' preguntas en ' + DATA.finales.length + ' finales. Las que se repiten comparten la respuesta modelo, que es la tarjeta de la teoría. Intentá cada una en papel antes de abrir la respuesta. Las respuestas son mías, no de la cátedra.</p>' +
    '<div class="tbl"><table><thead><tr><th>Tema</th><th>En cuántos finales (de ' + DATA.finales.length + ')</th><th>Preguntas</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td><b>' + r[1] + '</b></td><td>' + r[2] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
    '<div class="filters" id="f-fil"><button class="chip" data-f="todos" aria-pressed="true">Todos los finales</button>' + DATA.finales.map(function (f) { return '<button class="chip" data-f="' + f.id + '" aria-pressed="false">' + f.nombre + '</button>'; }).join('') + '</div></section>';
  html += DATA.finales.map(function (f) {
    return '<section class="fin" id="' + f.id + '" data-f="' + f.id + '"><div class="tp-intro"><div class="eyebrow">' + esc(f.nota) + '</div><h2>' + f.nombre + '</h2></div>' + f.secciones.map(function (s) {
      return '<h3>' + esc(s.t) + (s.pts ? ' <span class="tag media">' + esc(s.pts) + '</span>' : '') + '</h3><div class="concepts">' + s.ex.map(function (x) {
        var key = f.id + ':' + s.t + ':' + x.n, d = done.indexOf(key) >= 0;
        return '<article class="concept' + (d ? ' done' : '') + '"><div class="concept-head"><div><div class="eyebrow">Pregunta ' + x.n + '</div></div><label class="mark"><input type="checkbox" data-k="' + esc(key) + '"' + (d ? ' checked' : '') + '> La resolví</label></div>' +
          '<div class="body"><div class="blk enunciado"><div class="blk-k">Enunciado</div><p>' + x.en + '</p>' + (x.aviso ? '<p class="muted">' + x.aviso + '</p>' : '') + '</div><details><summary>Ver respuesta modelo</summary><div class="uc-ex">' + answerHtml(x.ref) + refChips(x.ref) + '</div></details></div></article>';
      }).join('') + '</div>';
    }).join('') + '</section>';
  }).join('');
  P.innerHTML = '<div class="wrap"><main>' + html + '</main></div>';
  var ff = 'todos';
  P.addEventListener('click', function (e) {
    var b = e.target.closest('#f-fil .chip'); if (!b) return;
    ff = b.dataset.f; $$('#f-fil .chip', P).forEach(function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); });
    $$('.fin', P).forEach(function (s) { s.classList.toggle('hidden-by-filter', ff !== 'todos' && s.dataset.f !== ff); });
  });
  P.addEventListener('change', function (e) {
    var t = e.target; if (!t.matches('.mark input')) return;
    var k = t.dataset.k, i = done.indexOf(k);
    if (t.checked && i < 0) done.push(k); if (!t.checked && i >= 0) done.splice(i, 1);
    store('fin', done); t.closest('.concept').classList.toggle('done', t.checked);
  });
};

/* ============ SIMULACRO ============ */
/* Examen de 4 secciones de 2,5 pts, cada sección es un tema y vale todo o nada. Se arma con secciones de los finales reales. */
RENDER.simulacro = function () {
  var P = $('#simulacro');
  P.innerHTML = '<div class="wrap"><main><section><div><div class="eyebrow">Simulacro</div><h2>Un final armado con secciones de los finales reales</h2></div><p class="lead">4 secciones de 2,5 puntos, de temas distintos. En el examen cada sección vale <b>todo o nada</b>, así que acá también: una sección suma sus 2,5 puntos solo si tildás todos los puntos que tenía que tener la respuesta. Escribilas en papel, unos 10 minutos por sección, sin mirar la teoría.</p>' +
    '<div class="actions"><button class="btn primary" id="sim-new">Nuevo simulacro</button><button class="btn" id="sim-t">Iniciar cronómetro (40 min)</button><span class="timer" id="sim-clock">40:00</span><span class="q-score" id="sim-total"></span></div></section><div id="sim-box"></div></main></div>';
  var timer = null, left = 2400;
  function clock() { var m = Math.floor(left / 60), s = left % 60; $('#sim-clock').textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s; }
  function stop() { if (timer) { clearInterval(timer); timer = null; } $('#sim-t').textContent = 'Iniciar cronómetro (40 min)'; }
  $('#sim-t').addEventListener('click', function () {
    if (timer) { stop(); return; }
    left = 2400; clock(); $('#sim-t').textContent = 'Detener cronómetro';
    timer = setInterval(function () { left--; clock(); if (left <= 0) { stop(); $('#sim-clock').textContent = '¡Tiempo!'; } }, 1000);
  });
  function build() {
    stop(); left = 2400; clock();
    var box = $('#sim-box'); box.innerHTML = '';
    var pool = [];
    DATA.finales.forEach(function (f) { f.secciones.forEach(function (s) { if (s.ex.length >= 2) pool.push({ f: f, s: s, u: card(s.ex[0].ref[0]).unit }); }); });
    var chosen = [], used = {};
    shuffle(pool).forEach(function (c) { if (chosen.length < 4 && !used[c.u]) { used[c.u] = 1; chosen.push(c); } });
    var got = [0, 0, 0, 0];
    function total() { var g = got.reduce(function (a, b) { return a + b; }, 0); $('#sim-total').textContent = 'Puntaje: ' + g + ' de 10'; }
    chosen.forEach(function (c, ci) {
      var items = []; c.s.ex.forEach(function (x) { x.ref.forEach(function (id) { card(id).items.forEach(function (it) { items.push({ id: id, t: it }); }); }); });
      var sec = h('section', { class: 'sec-card' });
      sec.innerHTML = '<div><div class="eyebrow">Sección ' + (ci + 1) + ' · 2,5 pts · ' + esc(c.f.nombre) + '</div><h3>' + esc(c.s.t) + '</h3></div>' +
        c.s.ex.map(function (x) { return '<p><b>' + (ci + 1) + '.' + String.fromCharCode(97 + c.s.ex.indexOf(x)) + '</b> ' + x.en + '</p>'; }).join('') +
        '<textarea class="ta" rows="5" placeholder="Escribilo en papel o acá"></textarea><details><summary>Ver respuesta modelo</summary><div class="uc-ex">' + answerHtml(c.s.ex.reduce(function (a, x) { return a.concat(x.ref); }, []).filter(function (v, i, a) { return a.indexOf(v) === i; })) + '</div></details>' +
        '<div><div class="eyebrow">Tildá lo que escribiste (todo o nada)</div><ul class="checklist">' + items.map(function (it) { return '<li><label><input type="checkbox"> ' + it.t + '</label></li>'; }).join('') + '</ul></div><div class="q-fb" data-fb hidden></div>';
      box.appendChild(sec);
      sec.addEventListener('change', function () {
        var cs = $$('.checklist input', sec), all = cs.every(function (x) { return x.checked; });
        got[ci] = all ? 2.5 : 0; total();
        var fb = $('[data-fb]', sec); fb.hidden = false; fb.className = 'q-fb ' + (all ? 'ok' : 'bad');
        fb.textContent = all ? 'Sección completa: suma 2,5.' : 'Faltan ' + cs.filter(function (x) { return !x.checked; }).length + ' puntos: la sección no suma.';
      });
    });
    total();
  }
  $('#sim-new').addEventListener('click', build); build();
};

/* ============ INICIO ============ */
document.addEventListener('DOMContentLoaded', function () {
  countdown();
  initTabs();
});
})();
