/* app.js — interfaz de la guía de EDD */
(function () {
'use strict';
var L = ED;
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
  try { if (v === undefined) { var r = localStorage.getItem('edd.' + k); return r ? JSON.parse(r) : null; } localStorage.setItem('edd.' + k, JSON.stringify(v)); } catch (e) { return null; }
}
/* bloque HTML: <p> si es texto en línea, <div> si trae elementos de bloque */
function blk(x) {
  if (!x) return '';
  return /<(ol|ul|div|pre|table|p)[ >]/.test(x) ? '<div class="rich">' + x + '</div>' : '<p>' + x + '</p>';
}
function sameSet(a, b) { return a.length === b.length && a.every(function (x) { return b.indexOf(x) >= 0; }); }
function parseNums(s) { return String(s).split(/[\s,;]+/).filter(Boolean).map(Number).filter(function (x) { return !isNaN(x); }); }
function shuffleUnique(n, lo, hi) { var a = []; for (var i = lo; i <= hi; i++) a.push(i); return shuffle(a).slice(0, n); }

/* ============ TABS ============ */
var TABS = ['teoria', 'casos', 'complejidad', 'arboles', 'hash', 'grafos', 'quizzes', 'finales', 'tps', 'simulacro'];
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
  return '<article class="concept" id="c-' + c.id + '" data-prio="' + c.prio + '"><div class="concept-head"><div><div class="eyebrow">' + (i < 9 ? '0' : '') + (i + 1) + (c.uso ? ' · ' + esc(c.uso) : '') + '</div><h3>' + c.t + '</h3></div><span class="tag ' + c.prio + '">' + c.prio + '</span>' +
    '<label class="mark"><input type="checkbox" data-id="' + c.id + '"> Lo domino</label></div>' +
    '<div class="body"><div class="dse"><div class="dse-def"><div class="dse-k">Definición</div>' + blk(c.def) + '</div><div class="dse-simple"><div class="dse-k">En simple</div>' + blk(c.simple) + '</div>' +
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
    DATA.teoria.map(function (c, i) { return '<option value="c-' + c.id + '">' + (i < 9 ? '0' : '') + (i + 1) + ' · ' + esc(c.t.replace(/<[^>]+>/g, '')) + '</option>'; }).join('') + '</select></div></div>';
  html += '<section id="que-toman"><div><div class="eyebrow">Qué toman</div><h2>Lo que se repite en 8 finales</h2></div><p class="lead">Armado con 8 finales distintos (79 preguntas): Septiembre, Julio 2025, Junio 2024, Marzo, Modelo General, un final corregido, Julio 2026 y Agosto 2026. <b>Ninguna unidad se puede saltear</b>: aparecen todas, salvo el árbol B que falta en 3 de 8 y casi siempre se pregunta lo mismo (por qué sirve para disco).</p>' +
    '<div class="tbl"><table><thead><tr><th>Tema</th><th>Qué piden</th><th>Aparece en</th></tr></thead><tbody>' +
    DATA.toman.map(function (t) { return '<tr><td><b>' + t[0] + '</b> <span class="tag ' + t[1] + '">' + t[1] + '</span></td><td>' + t[2] + '</td><td>' + t[3] + '</td></tr>'; }).join('') + '</tbody></table></div></section>';
  html += '<section id="plan"><div><div class="eyebrow">Plan</div><h2>6 sesiones de unos 90 minutos</h2></div><p class="lead">Ordenadas por lo que más se repite. Sin fechas fijas, para que entre en los huecos que te deje Álgebra y Geometría Analítica: la idea es que EDD no te quite tiempo de tu final principal.</p><div class="plan">' +
    DATA.plan.map(function (d, i) { return '<div class="day' + (i === DATA.plan.length - 1 ? ' exam' : '') + '"><div class="d">' + d[0] + '<span>' + d[1] + '</span></div><div>' + d[2] + '</div></div>'; }).join('') + '</div></section>';
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
function cardTitle(id) { for (var i = 0; i < DATA.teoria.length; i++) if (DATA.teoria[i].id === id) return DATA.teoria[i].t.replace(/<[^>]+>/g, ''); return id; }
function refChips(ids) {
  if (!ids || !ids.length) return '';
  return '<div class="refs"><span class="muted">Desarrollo completo en la teoría:</span> ' + ids.map(function (id) { return '<a class="pill acc" href="#teoria" data-card="' + id + '">' + esc(cardTitle(id)) + '</a>'; }).join(' ') + '</div>';
}
document.addEventListener('click', function (e) {
  var a = e.target.closest('a[data-card]'); if (!a) return;
  e.preventDefault(); showTab('teoria', 'c-' + a.dataset.card);
});

/* ============ CASOS ============ */
RENDER.casos = function () {
  var P = $('#casos');
  var done = store('casos') || [];
  var html = '<section><div><div class="eyebrow">Casos</div><h2>"¿Qué estructura usarías?"</h2></div><p class="lead">Es el tipo de pregunta más frecuente: <b>20 de las 79</b> preguntas de los 8 finales (un cuarto del total) y aparece en los 8. Siempre se resuelve igual: identificar la operación más frecuente, elegir la estructura que la hace barata, dar el costo y descartar la alternativa.</p>' +
    '<div class="tbl"><table><thead><tr><th>Si el enunciado pide…</th><th>Usá</th><th>Por qué</th></tr></thead><tbody>' +
    DATA.casosTabla.map(function (r) { return '<tr><td>' + r[0] + '</td><td><b>' + r[1] + '</b></td><td>' + r[2] + ' <a class="pill acc" href="#teoria" data-card="' + r[3] + '">teoría</a></td></tr>'; }).join('') + '</tbody></table></div>' +
    '<div class="warn"><b>Para sacar el puntaje completo.</b><ul>' + DATA.casosTips.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul></div></section>';
  html += '<section><div><div class="eyebrow">Práctica</div><h2>Escenarios de los finales</h2></div><p class="lead">Pensá la respuesta (estructura, costo y qué descartarías) y recién después abrí la resolución.</p>' +
    '<div class="filters" role="group"><button class="chip" data-f="todos" aria-pressed="true">Todos</button><button class="chip" data-f="pend" aria-pressed="false">Sin dominar</button><button class="btn" id="cs-shuf">Mezclar</button></div><div class="concepts" id="cs-list"></div></section>';
  P.innerHTML = '<div class="wrap"><main>' + html + '</main></div>';
  var order = DATA.casos.map(function (c, i) { return i; }), filter = 'todos';
  function draw() {
    var box = $('#cs-list'); box.innerHTML = '';
    order.forEach(function (i) {
      var c = DATA.casos[i], d = done.indexOf(i) >= 0;
      if (filter === 'pend' && d) return;
      var el = h('article', { class: 'concept' + (d ? ' done' : '') });
      el.innerHTML = '<div class="concept-head"><div><div class="eyebrow">' + esc(c.de) + '</div><h3>' + c.t + '</h3></div><label class="mark"><input type="checkbox" data-i="' + i + '"' + (d ? ' checked' : '') + '> Lo domino</label></div>' +
        '<div class="body"><p>' + c.q + '</p><details><summary>Ver resolución</summary><div class="uc-ex"><p><b>Estructura:</b> ' + c.a + '</p><p><b>Por qué:</b> ' + c.why + '</p>' + (c.no ? '<p><b>Qué descartar:</b> ' + c.no + '</p>' : '') + '</div></details></div>';
      box.appendChild(el);
    });
  }
  P.addEventListener('change', function (e) {
    var t = e.target; if (!t.matches('.mark input')) return;
    var i = +t.dataset.i, k = done.indexOf(i);
    if (t.checked && k < 0) done.push(i); if (!t.checked && k >= 0) done.splice(k, 1);
    store('casos', done); t.closest('.concept').classList.toggle('done', t.checked);
  });
  P.addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    filter = b.dataset.f; $$('.chip', P).forEach(function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); }); draw();
  });
  $('#cs-shuf').addEventListener('click', function () { order = shuffle(order); draw(); });
  draw();
};

/* ============ COMPLEJIDAD ============ */
function bigoSelect(id) { return '<select id="' + id + '" aria-label="Orden de complejidad"><option value="">Orden…</option>' + L.BIGO.map(function (b) { return '<option>' + b + '</option>'; }).join('') + '</select>'; }
RENDER.complejidad = function () {
  var P = $('#complejidad');
  P.innerHTML = '<div class="wrap"><main><section><div><div class="eyebrow">Generador</div><h2>Calculá T(n) y el orden de un código</h2></div><p class="lead">La complejidad aparece en <b>8 de 8</b> finales y en 4 piden calcular T(n) de un código con ciclos (a veces con un log). Acá salen códigos como esos: pensá cuántas veces se ejecuta el <code>Println</code>, elegí el orden y comprobá. La cantidad de pasos que se muestra sale de <b>ejecutar</b> el código, no de una tabla.</p>' +
    '<div class="actions"><button class="btn primary" id="cx-new">Código nuevo</button><span class="score" id="cx-sc"></span></div><div id="cx-box"></div></section>' +
    '<section><div><div class="eyebrow">Comparar</div><h2>Cómo crece cada orden</h2></div><div id="cx-growth"></div></section>' +
    '<section><div><div class="eyebrow">Atajos</div><h2>Reglas para contar</h2></div><div class="tbl"><table><thead><tr><th>Patrón</th><th>Pasos</th><th>Orden</th></tr></thead><tbody>' +
    '<tr><td>Secuencia de bloques</td><td>se <b>suman</b></td><td>el mayor</td></tr><tr><td>Ciclos anidados independientes</td><td>se <b>multiplican</b></td><td>n · n = n²</td></tr>' +
    '<tr><td>Interno que arranca en <code>i</code> o llega hasta <code>i</code></td><td>serie n(n+1)/2</td><td>O(n²)</td></tr><tr><td>Variable que se multiplica o divide por una constante</td><td>log₂ n vueltas</td><td>O(log n)</td></tr>' +
    '<tr><td>Variable que suma o resta una constante</td><td>n / constante</td><td>O(n)</td></tr><tr><td>Condicional</td><td>peor rama</td><td>—</td></tr><tr><td>Llamados recursivos: uno, n → n−1</td><td>n llamados</td><td>O(n)</td></tr><tr><td>Dos llamados, n → n−1 y n−2 (Fibonacci)</td><td>árbol que se duplica</td><td>O(2ⁿ)</td></tr></tbody></table></div></section></main></div>';
  var gs = { ok: 0, n: 0 }, cur = null;
  function draw() {
    var l = pick(L.LOOPS.filter(function (x) { return cur === null || x.id !== cur.id; })); cur = l;
    var n = pick([4, 8, 16, 32]);
    var box = $('#cx-box');
    box.innerHTML = '<div class="sc"><div class="eyebrow">Código</div><pre><code>' + esc(l.code) + '</code></pre><div class="sim-bar"><label>Orden<br>' + bigoSelect('cx-o') + '</label><button class="btn primary" id="cx-chk">Corregir</button></div><div id="cx-res"></div></div>';
    $('#cx-chk').addEventListener('click', function () {
      var v = $('#cx-o').value; if (!v) return;
      var ok = v === l.O; gs.n++; if (ok) gs.ok++; $('#cx-sc').textContent = gs.ok + ' de ' + gs.n + ' bien';
      var rows = [4, 8, 16, 32].map(function (m) { return '<tr><td>' + m + '</td><td>' + L.loopCount(l, m) + '</td></tr>'; }).join('');
      $('#cx-res').innerHTML = '<div class="q-fb ' + (ok ? 'ok' : 'bad') + '"><b>' + (ok ? 'Correcto.' : 'No es ' + esc(v) + '.') + '</b> El orden es <b>' + l.O + '</b>. T(n) = <b>' + l.T + '</b>. ' + l.why + '</div><div class="tbl"><table><thead><tr><th>n</th><th>Pasos ejecutados</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
    });
  }
  $('#cx-new').addEventListener('click', draw); draw();
  var g = $('#cx-growth'), ns = [4, 8, 16, 32, 64, 1024];
  g.innerHTML = '<div class="tbl"><table><thead><tr><th>n</th><th>log₂ n</th><th>n</th><th>n log₂ n</th><th>n²</th><th>2ⁿ</th></tr></thead><tbody>' + ns.map(function (n) {
    var e = n <= 64 ? (n <= 32 ? String(Math.pow(2, n)) : '≈ 1,8 · 10¹⁹') : '≈ 1,8 · 10³⁰⁸';
    return '<tr><td>' + n + '</td><td>' + Math.log2(n) + '</td><td>' + n + '</td><td>' + (n * Math.log2(n)) + '</td><td>' + n * n + '</td><td>' + e + '</td></tr>'; }).join('') + '</tbody></table></div><p class="muted">Duplicar n suma un paso en log n, duplica en n, un poco más que duplica en n log n, cuadruplica en n² y eleva al cuadrado el costo en 2ⁿ.</p>';
};

/* ============ ÁRBOLES: dibujo y simulador ============ */
function drawTree(root, opt) {
  opt = opt || {};
  if (!root) return '<div class="treebox"><p class="muted">Árbol vacío</p></div>';
  var t = L.clone(root), items = [], idx = 0, maxd = 0, DX = 44, DY = 60, R = 17;
  (function rec(n, d) { if (!n) return; rec(n.l, d + 1); n._x = idx++; n._d = d; if (d > maxd) maxd = d; items.push(n); rec(n.r, d + 1); })(t, 0);
  var W = (idx - 1) * DX + 64, H = maxd * DY + 64;
  function X(n) { return 32 + n._x * DX; }
  function Y(n) { return 30 + n._d * DY; }
  var s = '<svg class="tree" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" role="img" aria-label="Árbol">';
  items.forEach(function (n) { [n.l, n.r].forEach(function (c) { if (c) s += '<line class="te" x1="' + X(n) + '" y1="' + Y(n) + '" x2="' + X(c) + '" y2="' + Y(c) + '"/>'; }); });
  items.forEach(function (n) {
    var f = L.fe(n), cls = 'tn' + (opt.fe !== false && Math.abs(f) > 1 ? ' bad' : '') + (opt.hl && opt.hl.indexOf(String(n.v)) >= 0 ? ' rot' : '');
    s += '<circle class="' + cls + '" cx="' + X(n) + '" cy="' + Y(n) + '" r="' + R + '"/><text class="tv" x="' + X(n) + '" y="' + (Y(n) + 4.5) + '" text-anchor="middle">' + esc(n.v) + '</text>';
    if (opt.fe !== false) s += '<text class="tf" x="' + (X(n) + R - 1) + '" y="' + (Y(n) - R + 3) + '">' + (f > 0 ? '+' + f : f) + '</text>';
  });
  return '<div class="treebox">' + s + '</svg></div>';
}
function treeInfo(root, bal) {
  var un = L.unbalanced(root), cnt = L.count(root);
  var hArist = root ? L.height(root) - 1 : -1;
  return '<ul><li><b>Preorden:</b> ' + (L.pre(root).join(' ') || '—') + '</li><li><b>Inorden:</b> ' + (L.ino(root).join(' ') || '—') + '</li><li><b>Postorden:</b> ' + (L.post(root).join(' ') || '—') + '</li>' +
    '<li><b>Nodos:</b> ' + cnt + ' · <b>hojas:</b> ' + L.leaves(root) + ' · <b>altura:</b> ' + hArist + ' (en aristas; ' + (root ? L.height(root) : 0) + ' niveles)</li>' +
    '<li><b>¿Cumple la propiedad AVL?</b> ' + (un.length ? 'No: ' + un.map(function (x) { return x.v + ' (FE ' + (x.fe > 0 ? '+' : '') + x.fe + ')'; }).join(', ') : 'Sí: todos los FE están entre −1 y 1') + '</li></ul>';
}
function simTree(mode, ins, del) {
  var bal = mode === 'avl', root = null, steps = [];
  function go(op, v) {
    var log = [], before = L.count(root);
    root = op === 'ins' ? L.insert(root, v, bal, log) : L.remove(root, v, bal, log);
    steps.push({ op: op, v: v, log: log, snap: L.clone(root), nota: op === 'ins' ? (L.count(root) === before ? 'la clave ya estaba: no se inserta' : '') : (L.count(root) === before ? 'la clave no estaba' : '') });
  }
  ins.forEach(function (v) { go('ins', v); });
  del.forEach(function (v) { go('del', v); });
  return { root: root, steps: steps };
}
function treeOutput(mode, ins, del) {
  var r = simTree(mode, ins, del);
  var out = '<div><div class="eyebrow">Resultado final · ' + (mode === 'avl' ? 'AVL' : 'ABB sin balancear') + '</div><p class="muted">' + L.paren(r.root) + ' <span class="muted">(valor(izquierdo, derecho); − es vacío; el número amarillo pequeño es el FE)</span></p>' + drawTree(r.root) + treeInfo(r.root) + '</div>';
  out += '<details><summary>Paso a paso (' + r.steps.length + ' operaciones)</summary><div class="sim-out">' + r.steps.map(function (s) {
    var rots = s.log.map(function (x) { return '<span class="pill ok">' + esc(x.rot) + ' en ' + x.nodo + '</span> FE(' + x.nodo + ') = ' + (x.fe > 0 ? '+' : '') + x.fe + ' → caso ' + x.caso + ': ' + esc(x.det) + '.'; }).join('<br>');
    return '<div class="step' + (s.log.length ? ' rotated' : '') + '"><h4>' + (s.op === 'ins' ? 'Insertar ' : 'Eliminar ') + s.v + (s.nota ? ' <span class="muted">· ' + s.nota + '</span>' : '') + '</h4>' + (rots ? '<div>' + rots + '</div>' : '') + drawTree(s.snap, { hl: s.log.map(function (x) { return String(x.nodo); }) }) + '</div>';
  }).join('') + '</div></details>';
  return out;
}
var FIN_TREES = [
  { t: 'Marzo', spec: { v: 'a', l: { v: 'b', l: { v: 'd' }, r: { v: 'e', l: { v: 'f' }, r: { v: 'g', l: { v: 'h' } } } }, r: { v: 'c', r: { v: 'i' } } }, nota: 'Lista a, b, d, e, f, g, h, c, i → <b>preorden</b> (empieza por la raíz). b tiene FE +2 y a tiene FE −2: <b>no es AVL</b>.' },
  { t: 'Junio 2024', spec: { v: 'i', l: { v: 'f', l: { v: 'd' }, r: { v: 'e' } }, r: { v: 'c', l: { v: 'b', l: { v: 'g' } }, r: { v: 'h', r: { v: 'a' } } } }, nota: 'Lista d, e, f, g, b, a, h, c, i → <b>postorden</b> (termina en la raíz). Todos los FE están entre −1 y 1: está balanceado; pero con las letras como claves el inorden no queda ordenado, así que como ABB no se cumple. Aclaralo en el examen.' }
];
RENDER.arboles = function () {
  var P = $('#arboles');
  var presets = [
    ['Modelo General: 30, 20, 10, 40, 50', 'avl', '30, 20, 10, 40, 50', ''],
    ['Julio 2026: ABB 45, 20, 60, …', 'abb', '45, 20, 60, 10, 30, 50, 70, 25, 35', ''],
    ['Claves ordenadas en un ABB', 'abb', '10, 20, 30, 40, 50', ''],
    ['Las mismas claves, en un AVL', 'avl', '10, 20, 30, 40, 50', ''],
    ['TP5 secuencia 1 (con eliminaciones)', 'avl', '30, 20, 10, 25, 28, 27, 40, 35, 50, 5', '25, 20, 35']
  ];
  P.innerHTML = '<div class="wrap"><main><section><div><div class="eyebrow">Simulador</div><h2>ABB y AVL paso a paso</h2></div><p class="lead">ABB/AVL aparece en <b>8 de 8</b> finales: construir el árbol, los recorridos, ¿es AVL?, rotaciones. Cargá las claves y mirá qué rotación se hace en cada inserción. Al eliminar un nodo con dos hijos se usa el sucesor (el mínimo del subárbol derecho). Probalo primero a mano.</p>' +
    '<div class="filters" id="tr-pre">' + presets.map(function (p, i) { return '<button class="chip" data-i="' + i + '" aria-pressed="false">' + esc(p[0]) + '</button>'; }).join('') + '</div>' +
    '<div class="sim-bar"><label>Tipo<select id="tr-mode"><option value="avl">AVL</option><option value="abb">ABB (sin balancear)</option></select></label><label>Insertar (en orden)<input class="in wide" id="tr-ins" type="text" value="30, 20, 10, 40, 50"></label><label>Eliminar (opcional)<input class="in wide" id="tr-del" type="text" placeholder="por ejemplo 20, 35"></label><button class="btn primary" id="tr-go">Simular</button></div>' +
    '<div class="sim-out" id="tr-out"></div></section>' +
    '<section><div><div class="eyebrow">Los árboles dibujados</div><h2>Marzo y Junio 2024: recorrido y ¿es AVL?</h2></div><p class="lead">Dos finales dibujan un árbol con letras y preguntan a qué recorrido corresponde una lista de nodos y si es AVL. Están calculados con los mismos FE que tenés que escribir en la hoja.</p><div id="tr-fin" class="sim-out"></div></section>' +
    '<section><div><div class="eyebrow">Rotaciones</div><h2>Cómo elegir</h2></div><div class="tbl"><table><thead><tr><th>FE del nodo</th><th>FE del hijo</th><th>Caso</th><th>Rotación</th></tr></thead><tbody><tr><td>+2</td><td>+1 (o 0)</td><td>Derecha-Derecha</td><td>simple a izquierda</td></tr><tr><td>+2</td><td>−1</td><td>Derecha-Izquierda</td><td>doble: derecha en el hijo, izquierda en el nodo</td></tr><tr><td>−2</td><td>−1 (o 0)</td><td>Izquierda-Izquierda</td><td>simple a derecha</td></tr><tr><td>−2</td><td>+1</td><td>Izquierda-Derecha</td><td>doble: izquierda en el hijo, derecha en el nodo</td></tr></tbody></table></div></section></main></div>';
  function run() {
    var ins = parseNums($('#tr-ins').value), del = parseNums($('#tr-del').value);
    if (ins.length > 40) ins = ins.slice(0, 40);
    $('#tr-out').innerHTML = ins.length ? treeOutput($('#tr-mode').value, ins, del) : '<p class="muted">Escribí al menos una clave para insertar.</p>';
  }
  $('#tr-go').addEventListener('click', run);
  $('#tr-pre').addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return; var p = presets[+b.dataset.i];
    $('#tr-mode').value = p[1]; $('#tr-ins').value = p[2]; $('#tr-del').value = p[3]; run();
  });
  ['#tr-ins', '#tr-del'].forEach(function (s) { $(s).addEventListener('keydown', function (e) { if (e.key === 'Enter') run(); }); });
  run();
  $('#tr-fin').innerHTML = FIN_TREES.map(function (f) {
    var t = L.fromPairs(f.spec); L.recompute(t);
    return '<div><div class="eyebrow">' + f.t + '</div>' + drawTree(t) + '<ul><li><b>Preorden:</b> ' + L.pre(t).join(' ') + '</li><li><b>Inorden:</b> ' + L.ino(t).join(' ') + '</li><li><b>Postorden:</b> ' + L.post(t).join(' ') + '</li><li><b>FE:</b> ' + L.ino(t).map(function (v) { return v; }).length + ' nodos; los que superan |1|: ' + (L.unbalanced(t).map(function (x) { return x.v + ' (' + (x.fe > 0 ? '+' : '') + x.fe + ')'; }).join(', ') || 'ninguno') + '</li></ul><p>' + f.nota + '</p></div>';
  }).join('');
};

/* ============ HASH ============ */
var MODES = { enc: 'Encadenamiento (hash abierta)', lin: 'Sondeo lineal', cuad: 'Sondeo cuadrático', dob: 'Doble hash' };
function hashTable(res, mode) {
  var cells = '';
  for (var i = 0; i < res.m; i++) {
    var v = mode === 'enc' ? res.chains[i].join(' → ') : (res.tab[i] === null ? '' : res.tab[i]);
    cells += '<div class="hcell' + (v !== '' ? ' full' : '') + '"><span class="ix">' + i + '</span><span class="vl">' + (v === '' ? '&nbsp;' : v) + '</span></div>';
  }
  return '<div class="htab">' + cells + '</div>';
}
function hashSteps(res, mode) {
  var m = res.m;
  return '<ol class="steps">' + res.steps.map(function (s) {
    var d = s.k + ' mod ' + m + ' = ' + s.h;
    var nota = s.nota.charAt(0).toUpperCase() + s.nota.slice(1);
    if (mode === 'enc') return '<li><b>' + s.k + '</b>: ' + d + ' → posición ' + s.pos + '. ' + nota + '.</li>';
    var form = mode === 'lin' ? '(h + i) mod m' : mode === 'cuad' ? '(h + i²) mod m' : '(h + i · h₂) mod m, con h₂ = 1 + (' + s.k + ' mod ' + (m - 1) + ') = ' + s.h2;
    return '<li><b>' + s.k + '</b>: ' + d + '. Prueba ' + s.probes.map(function (p, i) { return '<span class="pill ' + (i === s.probes.length - 1 && s.pos !== null ? 'ok' : 'alta') + '">' + p + '</span>'; }).join('') + ' (' + form + '). ' + nota + '.</li>';
  }).join('') + '</ol>';
}
function hashOutput(m, keys, mode) {
  var res = L.hashInsert(m, keys, mode);
  var fails = res.steps.filter(function (s) { return s.pos === null; });
  var alpha = keys.length / m;
  return '<div><div class="eyebrow">' + MODES[mode] + ' · m = ' + m + ' · h(k) = k mod ' + m + '</div>' + hashTable(res, mode) + '<p>Factor de carga α = n / m = ' + keys.length + ' / ' + m + ' = <b>' + (Math.round(alpha * 100) / 100) + '</b>' + (alpha > 0.7 ? ' → alto: conviene redimensionar (por ejemplo a ' + L.nextPrime(2 * m) + ', el primo siguiente al doble).' : '.') + '</p>' + (fails.length ? '<div class="warn"><b>Ojo.</b> No se encontró lugar para: ' + fails.map(function (s) { return s.k; }).join(', ') + ' con esta secuencia de sondeo (la tabla puede estar llena o la secuencia no recorre todas las posiciones).</div>' : '') + '</div><details open><summary>Paso a paso</summary>' + hashSteps(res, mode) + '</details>';
}
function genHashEx() {
  var m = pick([7, 11, 13]), base = pick([0, 1, 2, 3]), keys = [], tries = 0;
  var h0 = rnd(m);
  while (keys.length < 5 && tries++ < 200) { var k = 10 + rnd(90); if (keys.indexOf(k) >= 0) continue; if (keys.length < 3 ? (k % m === h0) : true) keys.push(k); }
  while (keys.length < 5) { var k2 = 10 + rnd(90); if (keys.indexOf(k2) < 0) keys.push(k2); }
  return { m: m, keys: shuffle(keys) };
}
RENDER.hash = function () {
  var P = $('#hash');
  P.innerHTML = '<div class="wrap"><main><section><div><div class="eyebrow">Simulador</div><h2>Tabla hash: insertar claves a mano</h2></div><p class="lead">Hash está en <b>7 de 8</b> finales (colisiones, factor de carga, y en el Modelo General te hacen insertar claves con h(k) = k mod 11). Elegí el método y mirá cada intento de sondeo.</p>' +
    '<div class="filters" id="h-pre"><button class="chip" data-i="0" aria-pressed="false">Modelo General (m = 11)</button><button class="chip" data-i="1" aria-pressed="false">Muchas colisiones (m = 7)</button></div>' +
    '<div class="sim-bar"><label>Tamaño m<input class="in" id="h-m" type="number" min="2" max="31" value="11" style="width:6ch"></label><label>Claves (en orden)<input class="in wide" id="h-keys" type="text" value="22, 15, 37, 48, 59"></label><label>Método<select id="h-mode"><option value="enc">Encadenamiento</option><option value="lin">Sondeo lineal</option><option value="cuad">Sondeo cuadrático</option><option value="dob">Doble hash</option></select></label><button class="btn primary" id="h-go">Insertar</button></div>' +
    '<div class="sim-out" id="h-out"></div></section>' +
    '<section><div><div class="eyebrow">Comparar</div><h2>Las mismas claves con los cuatro métodos</h2></div><div id="h-cmp"></div></section>' +
    '<section><div><div class="eyebrow">Práctica</div><h2>Ejercicio nuevo: sondeo lineal</h2></div><p class="lead">Con h(k) = k mod m, anotá en qué posición queda cada clave (insertadas en el orden dado, con sondeo lineal).</p><div class="actions"><button class="btn primary" id="hx-new">Ejercicio nuevo</button><span class="score" id="hx-sc"></span></div><div id="hx-box"></div></section>' +
    '<section><div><div class="eyebrow">Factor de carga</div><h2>α y redimensionamiento</h2></div><div class="sim-bar"><label>Elementos n<input class="in" id="a-n" type="number" min="0" value="75" style="width:8ch"></label><label>Tamaño m<input class="in" id="a-m" type="number" min="1" value="100" style="width:8ch"></label></div><div id="a-out"></div></section></main></div>';
  var pre = [[11, '22, 15, 37, 48, 59', 'lin'], [7, '14, 21, 28, 35, 10, 17', 'lin']];
  function run() {
    var m = Math.max(2, Math.min(31, +$('#h-m').value || 11)), keys = parseNums($('#h-keys').value).filter(function (k) { return k >= 0; }).slice(0, 25);
    $('#h-out').innerHTML = keys.length ? hashOutput(m, keys, $('#h-mode').value) : '<p class="muted">Escribí claves separadas por comas.</p>';
    var cmp = '<div class="tbl"><table><thead><tr><th>Método</th><th>Estado final</th></tr></thead><tbody>';
    ['enc', 'lin', 'cuad', 'dob'].forEach(function (md) {
      var r = L.hashInsert(m, keys, md), parts = [];
      for (var i = 0; i < m; i++) { var v = md === 'enc' ? r.chains[i].join(' → ') : (r.tab[i] === null ? '' : r.tab[i]); if (v !== '') parts.push('<code>' + i + ': ' + v + '</code>'); }
      cmp += '<tr><td>' + MODES[md] + '</td><td>' + (parts.join(' · ') || '—') + '</td></tr>';
    });
    $('#h-cmp').innerHTML = cmp + '</tbody></table></div><p class="muted">Doble hash: h₂(k) = 1 + (k mod (m − 1)). El cuadrático puede no recorrer todas las posiciones.</p>';
  }
  $('#h-go').addEventListener('click', run);
  $('#h-pre').addEventListener('click', function (e) { var b = e.target.closest('.chip'); if (!b) return; var p = pre[+b.dataset.i]; $('#h-m').value = p[0]; $('#h-keys').value = p[1]; $('#h-mode').value = p[2]; run(); });
  $('#h-keys').addEventListener('keydown', function (e) { if (e.key === 'Enter') run(); });
  run();
  var hs = { ok: 0, n: 0 };
  function newEx() {
    var ex = genHashEx(), res = L.hashInsert(ex.m, ex.keys, 'lin'), pos = {};
    res.steps.forEach(function (s) { pos[s.k] = s.pos; });
    $('#hx-box').innerHTML = '<div class="sc"><p>Tabla de tamaño <b>' + ex.m + '</b>, h(k) = k mod ' + ex.m + ', sondeo lineal. Claves en este orden: <b>' + ex.keys.join(', ') + '</b>.</p><div class="sim-bar">' + ex.keys.map(function (k) { return '<label>Posición de ' + k + '<input class="in" type="number" min="0" max="' + (ex.m - 1) + '" data-k="' + k + '" style="width:7ch"></label>'; }).join('') + '</div><div class="actions"><button class="btn primary" id="hx-chk">Corregir</button><button class="btn" id="hx-show">Ver paso a paso</button></div><div id="hx-res"></div></div>';
    $('#hx-chk').addEventListener('click', function () {
      var ok = 0;
      $$('#hx-box input').forEach(function (i) { var good = i.value !== '' && +i.value === pos[i.dataset.k]; i.classList.toggle('ok', good); i.classList.toggle('bad', !good); if (good) ok++; });
      hs.n += ex.keys.length; hs.ok += ok; $('#hx-sc').textContent = hs.ok + ' de ' + hs.n + ' bien';
      $('#hx-res').innerHTML = '<p>' + ok + ' de ' + ex.keys.length + ' posiciones bien.</p>';
    });
    $('#hx-show').addEventListener('click', function () { $('#hx-res').innerHTML = hashTable(res, 'lin') + hashSteps(res, 'lin'); });
  }
  $('#hx-new').addEventListener('click', newEx); newEx();
  function alpha() {
    var n = +$('#a-n').value || 0, m = +$('#a-m').value || 1, a = n / m;
    var nivel = a < 0.5 ? 'bajo: buena dispersión' : a <= 0.7 ? 'medio: empiezan los agrupamientos' : 'alto: zonas densas y mal rendimiento';
    $('#a-out').innerHTML = '<p>α = ' + n + ' / ' + m + ' = <b>' + (Math.round(a * 1000) / 1000) + '</b> → ' + nivel + '. ' + (a > 0.7 ? 'Se redimensiona: nueva tabla de ' + L.nextPrime(2 * m) + ' posiciones (el primo siguiente al doble) y se recalcula la posición de cada elemento con el nuevo m. Nuevo α = ' + (Math.round(n / L.nextPrime(2 * m) * 1000) / 1000) + '.' : 'No hace falta redimensionar todavía.') + (a > 1 ? ' Con α &gt; 1 solo funciona el encadenamiento.' : '') + '</p>';
  }
  $('#a-n').addEventListener('input', alpha); $('#a-m').addEventListener('input', alpha); alpha();
};

/* ============ GRAFOS ============ */
function drawGraph(g, hl) {
  var n = g.verts.length;
  if (!n) return '<div class="gbox"><p class="muted">Sin vértices</p></div>';
  var R = Math.max(80, n * 20), cx = R + 50, cy = R + 40, pos = {};
  g.verts.forEach(function (v, i) { var a = -Math.PI / 2 + 2 * Math.PI * i / n; pos[v] = { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) }; });
  var s = '<svg class="graph" viewBox="0 0 ' + (2 * R + 100) + ' ' + (2 * R + 80) + '" width="' + (2 * R + 100) + '" role="img" aria-label="Grafo"><defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor" style="color:var(--muted)"/></marker></defs>';
  var key = {}, seen = {};
  g.edges.forEach(function (e) { key[e.a + '\u0001' + e.b] = true; });
  g.edges.forEach(function (e) {
    var k = g.directed ? e.a + '\u0001' + e.b : [e.a, e.b].sort().join('\u0001');
    if (seen[k]) return; seen[k] = true;
    if (e.a === e.b) return;
    var p = pos[e.a], q = pos[e.b], dx = q.x - p.x, dy = q.y - p.y, len = Math.sqrt(dx * dx + dy * dy), ux = dx / len, uy = dy / len;
    var rev = g.directed && key[e.b + '\u0001' + e.a], off = rev ? 16 : 0, nx = -uy * off, ny = ux * off;
    var x1 = p.x + ux * 19 + nx * 0.4, y1 = p.y + uy * 19 + ny * 0.4, x2 = q.x - ux * 19 + nx * 0.4, y2 = q.y - uy * 19 + ny * 0.4;
    var mx = (x1 + x2) / 2 + nx, my = (y1 + y2) / 2 + ny;
    s += '<path class="ge" d="M' + x1 + ' ' + y1 + ' Q' + mx + ' ' + my + ' ' + x2 + ' ' + y2 + '"' + (g.directed ? ' marker-end="url(#arr)"' : '') + '/>';
    if (e.w !== 1 || g.weighted) s += '<text class="gw" x="' + (mx + (rev ? nx * 0.3 : -uy * 10)) + '" y="' + (my + (rev ? ny * 0.3 : ux * 10) + 4) + '" text-anchor="middle">' + e.w + '</text>';
  });
  g.verts.forEach(function (v) {
    s += '<circle class="gv" cx="' + pos[v].x + '" cy="' + pos[v].y + '" r="17"' + (hl && hl === v ? ' style="fill:var(--accent);"' : '') + '/><text class="gt" x="' + pos[v].x + '" y="' + (pos[v].y + 4.5) + '" text-anchor="middle">' + esc(v) + '</text>';
  });
  return '<div class="gbox">' + s + '</svg></div>';
}
function isComplete(g) {
  var n = g.verts.length;
  return g.verts.every(function (v) { var set = {}; g.adj[v].forEach(function (e) { if (e.to !== v) set[e.to] = 1; }); return Object.keys(set).length === n - 1; });
}
function graphMatrix(g) {
  var w = {};
  g.edges.forEach(function (e) { w[e.a + '\u0001' + e.b] = e.w; if (!g.directed) w[e.b + '\u0001' + e.a] = e.w; });
  return '<div class="tbl"><table><thead><tr><th></th>' + g.verts.map(function (v) { return '<th>' + esc(v) + '</th>'; }).join('') + '</tr></thead><tbody>' + g.verts.map(function (a) {
    return '<tr><th>' + esc(a) + '</th>' + g.verts.map(function (b) { var x = w[a + '\u0001' + b]; return '<td>' + (x === undefined ? '0' : x) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
}
function graphOutput(g, src) {
  var weighted = g.edges.some(function (e) { return e.w !== 1; });
  g.weighted = weighted;
  var s = '<div>' + drawGraph(g, src) + '</div>';
  s += '<div><div class="eyebrow">Lista de adyacencia</div><div class="tbl"><table><tbody>' + g.verts.map(function (v) { return '<tr><th>' + esc(v) + '</th><td>' + (g.adj[v].map(function (e) { return esc(e.to) + (weighted ? '<span class="muted">(' + e.w + ')</span>' : ''); }).join(' → ') || '<span class="muted">—</span>') + '</td></tr>'; }).join('') + '</tbody></table></div></div>';
  s += '<details><summary>Matriz de adyacencia</summary>' + graphMatrix(g) + '</details>';
  var b = L.bfs(g, src), d = L.dfs(g, src);
  s += '<div><div class="eyebrow">Recorridos desde ' + esc(src) + ' (vecinos en orden alfabético o numérico)</div><ul><li><b>BFS (cola):</b> ' + b.order.map(esc).join(', ') + '</li><li><b>DFS (pila / recursión):</b> ' + d.order.map(esc).join(', ') + '</li></ul>';
  s += '<details><summary>BFS paso a paso</summary><div class="tbl"><table><thead><tr><th>Se saca</th><th>Se encolan</th><th>Cola queda</th></tr></thead><tbody>' + b.steps.map(function (x) { return '<tr><td>' + esc(x.u) + '</td><td>' + (x.added.map(esc).join(', ') || '—') + '</td><td>' + (x.queue.map(esc).join(', ') || '(vacía)') + '</td></tr>'; }).join('') + '</tbody></table></div></details></div>';
  if (weighted) {
    var dj = L.dijkstra(g, src);
    s += '<div><div class="eyebrow">Dijkstra desde ' + esc(src) + ' (pesos no negativos)</div><div class="tbl"><table><thead><tr><th>Vértice</th><th>Distancia</th><th>Camino</th></tr></thead><tbody>' + g.verts.map(function (v) {
      var p = dj.dist[v] === Infinity ? null : L.pathTo(dj.prev, src, v); return '<tr><td>' + esc(v) + '</td><td>' + (dj.dist[v] === Infinity ? '∞' : dj.dist[v]) + '</td><td>' + (p ? p.map(esc).join(' → ') : 'no alcanzable') + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      '<details><summary>Paso a paso</summary><ol class="steps">' + dj.steps.map(function (x) { return '<li>Se fija <b>' + esc(x.u) + '</b> (distancia ' + x.dist[x.u] + '). ' + (x.upds.length ? 'Mejora: ' + x.upds.map(esc).join(', ') + '.' : 'No mejora a nadie.') + '</li>'; }).join('') + '</ol></details></div>';
  }
  var cyc = L.findCycle(g), ham = L.hamiltonianPath(g), deg = L.degrees(g);
  var props = [['Tipo', g.directed ? 'dirigido' : 'no dirigido']];
  if (g.directed) { props.push(['Conexo (sin mirar el sentido)', L.weaklyConnected(g) ? 'sí (débilmente conexo)' : 'no']); props.push(['Fuertemente conexo', L.stronglyConnected(g) ? 'sí' : 'no: ' + (g.verts.filter(function (v) { return L.reach(g, v).length < g.verts.length; }).map(function (v) { return 'desde ' + v + ' no se llega a todos'; }).slice(0, 2).join('; '))]); }
  else props.push(['Conexo', L.weaklyConnected(g) ? 'sí' : 'no']);
  props.push(['Tiene ciclo', cyc ? 'sí: ' + cyc.map(esc).join(' → ') : 'no (es acíclico)']);
  props.push(['Completo', isComplete(g) ? 'sí' : 'no']);
  props.push(['Camino hamiltoniano', ham ? 'sí: ' + ham.map(esc).join(' → ') : 'no']);
  s += '<div><div class="eyebrow">Propiedades</div><div class="tbl"><table><tbody>' + props.map(function (p) { return '<tr><th>' + p[0] + '</th><td>' + p[1] + '</td></tr>'; }).join('') + '</tbody></table></div></div>';
  s += '<details><summary>Grados</summary><div class="tbl"><table><thead><tr><th>Vértice</th><th>' + (g.directed ? 'Salida' : 'Grado') + '</th>' + (g.directed ? '<th>Entrada</th>' : '') + '</tr></thead><tbody>' + g.verts.map(function (v) { return '<tr><td>' + esc(v) + '</td><td>' + deg.out[v] + '</td>' + (g.directed ? '<td>' + deg.inn[v] + '</td>' : '') + '</tr>'; }).join('') + '</tbody></table></div></details>';
  return s;
}
RENDER.grafos = function () {
  var P = $('#grafos');
  var presets = [
    ['Julio 2025 (dirigido)', 'A B\nA C\nB D\nC D\nD A\nD E', true],
    ['Junio 2024 (dirigido)', '0 1\n0 5\n1 5\n2 0\n2 3\n2 4\n3 4\n3 7\n4 6\n5 2\n5 4\n6 3\n6 7', true],
    ['Ferrocarril (ponderado)', 'A B 4\nA C 2\nB C 1\nB D 5\nC D 8\nC E 10\nD E 2\nD F 6\nE F 3', false],
    ['No dirigido simple', 'A B\nA C\nB D\nC D\nD E', false]
  ];
  P.innerHTML = '<div class="wrap"><main><section><div><div class="eyebrow">Simulador</div><h2>Grafos: recorridos, caminos mínimos y propiedades</h2></div><p class="lead">Grafos está en <b>8 de 8</b> finales: lista o matriz de adyacencia, BFS y DFS, Dijkstra y propiedades (conexo, ciclo, hamiltoniano). Escribí una arista por línea (<code>A B</code>, o <code>A B 4</code> con peso) y elegí si es dirigido. Un vértice suelto se declara con su nombre solo.</p>' +
    '<div class="filters" id="g-pre">' + presets.map(function (p, i) { return '<button class="chip" data-i="' + i + '" aria-pressed="false">' + p[0] + '</button>'; }).join('') + '</div>' +
    '<div class="sim-bar"><label>Aristas<textarea class="ta" id="g-txt" rows="7" cols="26" style="font-family:var(--f-mono)"></textarea></label><div style="display:grid;gap:10px"><label style="display:flex;gap:8px;align-items:center;text-transform:none;letter-spacing:0;font-size:.92rem"><input type="checkbox" id="g-dir"> Dirigido (A B es A → B)</label><label>Origen<select id="g-src"></select></label></div></div>' +
    '<div class="sim-out" id="g-out"></div></section>' +
    '<section><div><div class="eyebrow">Comparar</div><h2>Matriz vs lista de adyacencia</h2></div><div class="tbl"><table><thead><tr><th></th><th>Matriz</th><th>Lista</th></tr></thead><tbody><tr><th>Memoria</th><td>O(n²)</td><td>O(n + m)</td></tr><tr><th>¿u y v adyacentes?</th><td>O(1)</td><td>O(grado de u)</td></tr><tr><th>Recorrer vecinos de u</th><td>O(n)</td><td>O(grado de u)</td></tr><tr><th>BFS / DFS completo</th><td>O(n²)</td><td>O(n + m)</td></tr><tr><th>Conviene</th><td>grafo denso</td><td>grafo disperso (el caso de los finales)</td></tr></tbody></table></div></section></main></div>';
  function run(keepSrc) {
    var g = L.parseGraph($('#g-txt').value, $('#g-dir').checked), sel = $('#g-src');
    if (!g.verts.length) { $('#g-out').innerHTML = '<p class="muted">Escribí al menos una arista.</p>'; return; }
    var cur = keepSrc ? sel.value : '';
    sel.innerHTML = g.verts.map(function (v) { return '<option>' + esc(v) + '</option>'; }).join('');
    if (cur && g.verts.indexOf(cur) >= 0) sel.value = cur;
    $('#g-out').innerHTML = graphOutput(g, sel.value);
  }
  function load(i) { $('#g-txt').value = presets[i][1]; $('#g-dir').checked = presets[i][2]; run(false); }
  $('#g-pre').addEventListener('click', function (e) { var b = e.target.closest('.chip'); if (b) load(+b.dataset.i); });
  $('#g-txt').addEventListener('input', function () { run(true); });
  $('#g-dir').addEventListener('change', function () { run(true); });
  $('#g-src').addEventListener('change', function () { run(true); });
  load(0);
};

/* ============ QUIZZES ============ */
function quizCard(q, num, onAnswer) {
  var multi = q.a.length > 1;
  var card = h('div', { class: 'q-card' });
  var rid = Math.random().toString(36).slice(2, 6);
  var opts = q.o.map(function (o, i) { return '<label class="q-opt"><input type="' + (multi ? 'checkbox' : 'radio') + '" name="q' + num + '-' + rid + '" value="' + i + '"> <span>' + o + '</span></label>'; }).join('');
  card.innerHTML = '<div class="q-num">' + num + '</div><div class="q-body"><div class="eyebrow">' + (q.t || '') + (multi ? ' · elegí ' + q.a.length : '') + '</div><div class="q-q">' + q.q + '</div><div class="q-opts">' + opts + '</div>' +
    '<div class="q-actions"><button class="btn primary q-chk">Corregir</button></div><div class="q-fb" hidden></div></div>';
  var done = false;
  $('.q-chk', card).addEventListener('click', function () {
    if (done) return;
    var sel = $$('input:checked', card).map(function (i) { return parseInt(i.value, 10); });
    if (!sel.length) return;
    done = true;
    var ok = sameSet(sel, q.a);
    $$('.q-opt', card).forEach(function (lab, i) {
      $('input', lab).disabled = true;
      if (q.a.indexOf(i) >= 0) lab.classList.add('ok'); else if (sel.indexOf(i) >= 0) lab.classList.add('bad');
    });
    var fb = $('.q-fb', card); fb.hidden = false; fb.className = 'q-fb ' + (ok ? 'ok' : 'bad');
    fb.innerHTML = '<b>' + (ok ? 'Correcto.' : 'No es esa.') + '</b> ' + (q.e || ''); $('.q-chk', card).hidden = true;
    if (onAnswer) onAnswer(ok);
  });
  return card;
}
function uniqueOpts(correct, cands, n) {
  var o = [correct];
  shuffle(cands).forEach(function (c) { if (o.length < n && o.indexOf(c) < 0) o.push(c); });
  return o;
}
function mkGen(t, q, correct, cands, e, fixed) {
  var o = uniqueOpts(correct, cands, 4);
  if (!fixed) o = shuffle(o);
  return { t: 'Generada · ' + t, q: q, o: o, a: [o.indexOf(correct)], e: e };
}
var GENQ = [
  function () { var l = pick(L.LOOPS.filter(function (x) { return x.id !== 'uno'; }));
    return mkGen('orden de un código', '¿Cuál es el orden de complejidad del siguiente código?<pre><code>' + esc(l.code) + '</code></pre>', l.O, L.BIGO.slice(), 'T(n) = ' + l.T + '. ' + l.why); },
  function () { var l = pick(L.LOOPS.filter(function (x) { return ['lin', 'doble', 'tri', 'tri2', 'log', 'logdiv', 'nlogn', 'modelo', 'sept', 'paso2', 'sec'].indexOf(x.id) >= 0; })), n = pick([8, 16]), c = L.loopCount(l, n);
    return mkGen('cantidad de pasos', 'Con n = ' + n + ', ¿cuántas veces se ejecuta la instrucción interna del siguiente código?<pre><code>' + esc(l.code) + '</code></pre>', String(c), [String(c + n), String(c * 2), String(Math.max(1, c - n)), String(c + 1), String(n * n)], 'T(n) = ' + l.T + '. Con n = ' + n + ' da ' + c + '.'); },
  function () { var m = pick([7, 11, 13, 17]), k = 20 + rnd(180), p = k % m, c = []; for (var i = 0; i < m; i++) c.push(String(i));
    return mkGen('hash', 'En una tabla de tamaño ' + m + ' con h(k) = k mod ' + m + ', ¿en qué posición cae la clave ' + k + '?', String(p), c, k + ' = ' + Math.floor(k / m) + ' · ' + m + ' + ' + p + ' → posición ' + p + '.'); },
  function () { var m = pick([20, 40, 50, 100, 200]), n = Math.round(m * (0.2 + rnd(9) / 10)), a = (n / m).toFixed(2);
    return mkGen('factor de carga', 'Una tabla hash de capacidad ' + m + ' almacena ' + n + ' elementos. ¿Cuál es su factor de carga?', a, [(m / n).toFixed(2), (n / (m + n)).toFixed(2), (n / m / 2).toFixed(2), (n * 100 / m).toFixed(0)], 'α = n / m = ' + n + ' / ' + m + ' = ' + a + (a > 0.7 ? ' (alto: conviene redimensionar).' : '.')); },
  function () { var cs = [[-2, -1, 'Rotación simple a derecha', 'Izquierda-Izquierda'], [2, 1, 'Rotación simple a izquierda', 'Derecha-Derecha'], [2, -1, 'Rotación doble: derecha sobre el hijo y luego izquierda sobre el nodo', 'Derecha-Izquierda'], [-2, 1, 'Rotación doble: izquierda sobre el hijo y luego derecha sobre el nodo', 'Izquierda-Derecha']], c = pick(cs);
    return mkGen('rotación AVL', 'En un AVL, un nodo quedó con FE = ' + (c[0] > 0 ? '+' : '') + c[0] + ' y su hijo ' + (c[0] > 0 ? 'derecho' : 'izquierdo') + ' tiene FE = ' + (c[1] > 0 ? '+' : '') + c[1] + '. ¿Qué rotación lo corrige?', c[2], cs.map(function (x) { return x[2]; }), 'Caso ' + c[3] + (c[0] * c[1] > 0 ? ': los signos van en el mismo sentido → rotación simple.' : ': signos opuestos → rotación doble.')); },
  function () { var keys = shuffleUnique(7, 1, 99), r = simTree('abb', keys, []).root, which = pick(['pre', 'ino', 'post']), names = { pre: 'preorden', ino: 'inorden', post: 'postorden' };
    var seqs = { pre: L.pre(r).join(' '), ino: L.ino(r).join(' '), post: L.post(r).join(' ') }, sw = L.pre(r).slice(); var t = sw[1]; sw[1] = sw[2]; sw[2] = t;
    var cand = Object.keys(seqs).filter(function (k) { return k !== which; }).map(function (k) { return seqs[k]; }).concat([sw.join(' ')]);
    return mkGen('recorrido', 'Se inserta en un ABB, en este orden: <b>' + keys.join(', ') + '</b>. ¿Cuál es el recorrido en <b>' + names[which] + '</b>?', seqs[which], cand, 'ABB: ' + L.paren(r) + '. Preorden: raíz, izquierdo, derecho · inorden: izquierdo, raíz, derecho · postorden: izquierdo, derecho, raíz.'); },
  function () { var hh = 2 + rnd(4), a = Math.pow(2, hh + 1) - 1;
    return mkGen('nodos máximos', '¿Cuál es el máximo número de nodos de un árbol binario de altura ' + hh + ' (medida en aristas)?', String(a), [String(Math.pow(2, hh) - 1), String(Math.pow(2, hh + 1)), String(2 * hh + 1), String(Math.pow(2, hh))], 'Niveles 0 a ' + hh + ': 1 + 2 + 4 + … + 2<sup>' + hh + '</sup> = 2<sup>' + (hh + 1) + '</sup> − 1 = ' + a + '.'); },
  function () { var n = pick([100, 500, 1000, 5000]), m = n * pick([3, 4, 5]) / 2;
    return mkGen('memoria de un grafo', 'Un grafo no dirigido tiene ' + n + ' vértices y ' + m + ' aristas. ¿Cuántas celdas tiene su matriz de adyacencia?', String(n * n), [String(n + m), String(n * m), String(n), String(2 * m)], 'La matriz es n × n = ' + (n * n) + ' celdas, sin importar las aristas. La lista de adyacencia usa del orden de n + 2m = ' + (n + 2 * m) + ' entradas.'); }
];
function genQuestion() { return pick(GENQ)(); }
RENDER.quizzes = function () {
  var P = $('#quizzes');
  var temas = ['Todas'].concat(DATA.quiz.map(function (q) { return q.t; }).filter(function (v, i, a) { return a.indexOf(v) === i; }));
  var score = { ok: 0, n: 0 }, topic = 'Todas';
  P.innerHTML = '<div class="wrap"><main><section><div><div class="eyebrow">Autoevaluación</div><h2>Preguntas tipo final</h2></div><p class="lead">' + DATA.quiz.length + ' preguntas armadas con lo que se repite en los 8 finales, más un generador de preguntas con números nuevos. Elegí la opción (o las opciones, si la pregunta lo dice) y apretá Corregir.</p>' +
    '<div class="q-head"><div class="filters" id="q-filters">' + temas.map(function (t, i) { return '<button class="chip" data-t="' + t + '" aria-pressed="' + (i === 0) + '">' + t + '</button>'; }).join('') + '</div><div class="q-score" id="q-score">0 de 0</div></div>' +
    '<div class="actions"><button class="btn" id="q-shuf">Mezclar</button><button class="btn" id="q-reset">Reiniciar</button></div><div class="quiz" id="q-list"></div></section>' +
    '<section><div><div class="eyebrow">Sin fin</div><h2>Generador de preguntas</h2></div><p class="lead">Cada una sale con datos distintos: orden de un código, pasos ejecutados, posición en una hash, factor de carga, rotación del AVL, recorridos de un ABB y memoria de un grafo.</p><div class="actions"><button class="btn primary" id="gq-new">Pregunta nueva</button><span class="muted" id="gq-sc"></span></div><div id="gq-box" class="quiz"></div></section></main></div>';
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
RENDER.finales = function () {
  var P = $('#finales');
  var done = store('fin') || [];
  var temas = {};
  DATA.finales.forEach(function (f) { f.ex.forEach(function (x) { var t = temas[x.tema] = temas[x.tema] || { fin: {}, n: 0 }; t.fin[f.id] = 1; t.n++; }); });
  var rows = Object.keys(temas).map(function (k) { return [k, Object.keys(temas[k].fin).length, temas[k].n]; }).sort(function (a, b) { return b[1] - a[1] || b[2] - a[2]; });
  var total = DATA.finales.reduce(function (s, f) { return s + f.ex.length; }, 0);
  var html = '<section><div><div class="eyebrow">Banco de finales</div><h2>8 finales resueltos</h2></div><p class="lead">' + total + ' preguntas en ' + DATA.finales.length + ' finales distintos. Las que están repetidas entre finales (la búsqueda en un ABB, lista o matriz de adyacencia, la red con pocas conexiones) comparten la resolución. Intentá cada una en papel antes de abrir la respuesta modelo; las respuestas son mías, no de la cátedra.</p>' +
    '<div class="tbl"><table><thead><tr><th>Tema</th><th>En cuántos finales (de ' + DATA.finales.length + ')</th><th>Preguntas</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td><b>' + r[1] + '</b></td><td>' + r[2] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
    '<div class="filters" id="f-fil"><button class="chip" data-f="todos" aria-pressed="true">Todos los finales</button>' + DATA.finales.map(function (f) { return '<button class="chip" data-f="' + f.id + '" aria-pressed="false">' + f.nombre + '</button>'; }).join('') + '</div>' +
    '<div class="filters" id="f-tema"><button class="chip" data-t="todos" aria-pressed="true">Todos los temas</button>' + rows.map(function (r) { return '<button class="chip" data-t="' + r[0] + '" aria-pressed="false">' + r[0] + '</button>'; }).join('') + '</div></section>';
  html += DATA.finales.map(function (f) {
    return '<section class="fin" id="' + f.id + '" data-f="' + f.id + '"><div class="tp-intro"><div class="eyebrow">' + esc(f.nota) + '</div><h2>Final de ' + f.nombre + '</h2></div><div class="concepts">' + f.ex.map(function (x) {
      var key = f.id + ':' + x.n, d = done.indexOf(key) >= 0;
      return '<article class="concept' + (d ? ' done' : '') + '" data-t="' + esc(x.tema) + '"><div class="concept-head"><div><div class="eyebrow">Pregunta ' + x.n + (x.pts ? ' · ' + x.pts + ' pts' : '') + (x.nota ? ' · ' + esc(x.nota) : '') + '</div></div><span class="tag media">' + esc(x.tema) + '</span><label class="mark"><input type="checkbox" data-k="' + key + '"' + (d ? ' checked' : '') + '> La resolví</label></div>' +
        '<div class="body"><div class="blk enunciado"><div class="blk-k">Enunciado</div><p>' + x.en + '</p></div><details><summary>Ver respuesta modelo</summary><div class="uc-ex">' + x.res + refChips(x.ref) + '</div></details></div></article>';
    }).join('') + '</div></section>';
  }).join('');
  P.innerHTML = '<div class="wrap"><main>' + html + '</main></div>';
  var ff = 'todos', ft = 'todos';
  function apply() {
    $$('.fin', P).forEach(function (s) { s.classList.toggle('hidden-by-filter', ff !== 'todos' && s.dataset.f !== ff); });
    $$('.fin .concept', P).forEach(function (a) { a.classList.toggle('hidden-by-filter', ft !== 'todos' && a.dataset.t !== ft); });
  }
  P.addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    if (b.dataset.f !== undefined) { ff = b.dataset.f; $$('#f-fil .chip', P).forEach(function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); }); }
    else if (b.dataset.t !== undefined) { ft = b.dataset.t; $$('#f-tema .chip', P).forEach(function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); }); }
    apply();
  });
  P.addEventListener('change', function (e) {
    var t = e.target; if (!t.matches('.mark input')) return;
    var k = t.dataset.k, i = done.indexOf(k);
    if (t.checked && i < 0) done.push(k); if (!t.checked && i >= 0) done.splice(i, 1);
    store('fin', done); t.closest('.concept').classList.toggle('done', t.checked);
  });
};

/* ============ TPs ============ */
RENDER.tps = function () {
  var P = $('#tps');
  P.innerHTML = '<div class="wrap"><main><section><div><div class="eyebrow">Trabajos prácticos</div><h2>TP1 a TP7 resueltos</h2></div><p class="lead">Los árboles de los TP4, TP5 y TP6 no están dibujados a mano: se calcularon ejecutando el código y las convenciones usadas están al comienzo de cada TP. Si tu cátedra usa otra convención (por ejemplo el predecesor al eliminar), el árbol final puede cambiar: revisá el procedimiento, no solo el resultado.</p></section>' + DATA.tps.map(function (tp) {
    return '<section id="' + tp.id + '"><div class="tp-intro"><div class="eyebrow">Trabajo práctico</div><h2>' + tp.nombre + '</h2>' + (tp.intro ? '<p class="lead">' + tp.intro + '</p>' : '') + '</div>' + tp.items.map(function (it) {
      var tb = '';
      if (it.tabla) tb = '<div class="tbl"><table><thead><tr>' + it.tabla.cols.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr></thead><tbody>' + it.tabla.rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>' + (it.nota ? '<p class="muted">' + it.nota + '</p>' : '');
      return '<details class="tp-ex"><summary><b>' + it.n + '.</b> ' + it.q + '</summary><div class="uc-ex">' + tb + '<div>' + it.a + '</div></div></details>';
    }).join('') + '</section>';
  }).join('') + '</main></div>';
};

/* ============ SIMULACRO ============ */
var REC_EX = [
  { q: 'Diseñe una función recursiva que reciba una lista simplemente enlazada y retorne la cantidad de elementos que contiene.', o: 'O(n)', s: 'func cantidad(n *Nodo) int {\n    if n == nil { return 0 }\n    return 1 + cantidad(n.sig)\n}' },
  { q: 'Escriba una función recursiva que cuente cuántos elementos pares contiene una lista simplemente enlazada.', o: 'O(n)', s: 'func pares(n *Nodo) int {\n    if n == nil { return 0 }\n    if n.valor%2 == 0 { return 1 + pares(n.sig) }\n    return pares(n.sig)\n}' },
  { q: 'Diseñe una función recursiva que reciba un árbol binario y retorne la cantidad de hojas que posee (0 si está vacío).', o: 'O(n)', s: 'func hojas(a *ArbolBB) int {\n    if a == nil { return 0 }\n    if a.hijo_izq == nil && a.hijo_der == nil { return 1 }\n    return hojas(a.hijo_izq) + hojas(a.hijo_der)\n}' },
  { q: 'Diseñe una función recursiva cantidadNodos(árbol).', o: 'O(n)', s: 'func cantidadNodos(a *ArbolBB) int {\n    if a == nil { return 0 }\n    return 1 + cantidadNodos(a.hijo_izq) + cantidadNodos(a.hijo_der)\n}' },
  { q: 'Diseñe una función recursiva que calcule la altura de un árbol binario (en aristas: vacío = −1, hoja = 0).', o: 'O(n)', s: 'func altura(a *ArbolBB) int {\n    if a == nil { return -1 }\n    return 1 + max(altura(a.hijo_izq), altura(a.hijo_der))\n}' },
  { q: 'Diseñe una función recursiva que sume los elementos de una lista simplemente enlazada.', o: 'O(n)', s: 'func suma(n *Nodo) int {\n    if n == nil { return 0 }\n    return n.valor + suma(n.sig)\n}' }
];
var CONCEPT_TEMAS = ['Complejidad', 'TAD', 'Pila', 'Cola', 'Lista', 'Árbol B', 'Hash', 'ABB / AVL', 'Grafos'];
function genDigraph() {
  var V = ['A', 'B', 'C', 'D', 'E'], edges = {}, k = 0, txt = [];
  while (k < 7) { var a = pick(V), b = pick(V); if (a === b || edges[a + b]) continue; edges[a + b] = 1; txt.push(a + ' ' + b); k++; }
  return txt.join('\n');
}
RENDER.simulacro = function () {
  var P = $('#simulacro');
  P.innerHTML = '<div class="wrap"><main><section><div><div class="eyebrow">Simulacro</div><h2>Un final nuevo, con la escala del final corregido</h2></div><p class="lead">30 puntos, se aprueba con 17 (como el final corregido). Mismo formato que los finales reales: T(n), recursión, AVL, hash, grafos, un caso y una pregunta de teoría. Lo numérico se corrige solo; lo escrito lo autoevaluás con las listas. Hacelo en 90 minutos, sin mirar la teoría. Cada vez que apretás el botón sale uno distinto.</p><div class="actions"><button class="btn primary" id="sim-new">Nuevo simulacro</button><span class="q-score" id="sim-total"></span></div></section><div id="sim-box"></div></main></div>';
  function build() {
    var box = $('#sim-box'); box.innerHTML = '';
    var pts = { e1: [0, 3], e2: [0, 5], e3: [0, 4], e4: [0, 4], e5: [0, 4], e6: [0, 5], e7: [0, 5] };
    function total() {
      var g = 0, t = 0; for (var k in pts) { g += pts[k][0]; t += pts[k][1]; }
      g = Math.round(g * 10) / 10;
      $('#sim-total').textContent = 'Puntaje: ' + g + ' de ' + t + ' · ' + (g >= 17 ? 'aprobado (mínimo 17)' : 'faltan ' + (Math.round((17 - g) * 10) / 10) + ' para aprobar');
    }
    function sec(id, eyebrow, title, inner) { var s = h('section'); s.innerHTML = '<div><div class="eyebrow">' + eyebrow + '</div><h3>' + title + '</h3></div>' + inner; box.appendChild(s); return s; }

    /* 1 · T(n) */
    var l = pick(L.LOOPS.filter(function (x) { return ['lin', 'doble', 'tri', 'tri2', 'log', 'logdiv', 'nlogn', 'modelo', 'sept', 'sec', 'cubo'].indexOf(x.id) >= 0; })), n1 = pick([6, 8, 10]);
    var s1 = sec('e1', 'Ejercicio 1 · 3 pts', 'Complejidad', '<pre><code>' + esc(l.code) + '</code></pre><div class="sim-bar"><label>Cantidad de veces que se ejecuta la instrucción interna con n = ' + n1 + '<input class="in" id="e1-n" type="number" min="0" style="width:9ch"></label><label>Orden<br>' + bigoSelect('e1-o') + '</label><button class="btn primary" id="e1-chk">Corregir</button></div><div id="e1-res"></div>');
    $('#e1-chk', s1).addEventListener('click', function () {
      var c = L.loopCount(l, n1), okn = +$('#e1-n').value === c && $('#e1-n').value !== '', oko = $('#e1-o').value === l.O;
      $('#e1-n').classList.toggle('ok', okn); $('#e1-n').classList.toggle('bad', !okn);
      pts.e1[0] = (okn ? 1.5 : 0) + (oko ? 1.5 : 0); total();
      $('#e1-res').innerHTML = '<div class="q-fb ' + (okn && oko ? 'ok' : 'bad') + '">Con n = ' + n1 + ' se ejecuta <b>' + c + '</b> veces. T(n) = <b>' + l.T + '</b> → <b>' + l.O + '</b>. ' + l.why + '</div>';
    });

    /* 2 · recursión */
    var re = pick(REC_EX);
    var s2 = sec('e2', 'Ejercicio 2 · 5 pts', 'Recursión', '<p>' + re.q + ' Indique el caso base, el caso recursivo y la complejidad temporal.</p><textarea class="ta" rows="5" placeholder="Escribilo en papel o acá"></textarea><details><summary>Ver una solución</summary><pre><code>' + esc(re.s) + '</code></pre><p>Complejidad: <b>' + re.o + '</b> (un llamado por elemento).</p></details><ul class="checklist"><li><label><input type="checkbox" data-p="1.5"> Escribí el caso base (1,5)</label></li><li><label><input type="checkbox" data-p="2"> Caso recursivo correcto, que se acerca al caso base (2)</label></li><li><label><input type="checkbox" data-p="1.5"> Indiqué la complejidad y la justifiqué (1,5)</label></li></ul>');
    s2.addEventListener('change', function () { var g = 0; $$('input[type=checkbox]', s2).forEach(function (c) { if (c.checked) g += +c.dataset.p; }); pts.e2[0] = g; total(); });

    /* 3 · AVL */
    var seq = shuffleUnique(6, 1, 60), r3 = simTree('avl', seq, []), rots = r3.steps.reduce(function (s, x) { return s + x.log.length; }, 0);
    var s3 = sec('e3', 'Ejercicio 3 · 4 pts', 'AVL', '<p>Inserte en un AVL vacío, en este orden: <b>' + seq.join(', ') + '</b>. Indique la raíz final, el recorrido preorden del árbol final y cuántas rotaciones se hicieron (una rotación doble cuenta como una).</p><div class="sim-bar"><label>Raíz final<input class="in" id="e3-r" type="number" style="width:8ch"></label><label>Preorden<input class="in wide" id="e3-p" type="text" placeholder="x y z …"></label><label>Rotaciones<input class="in" id="e3-n" type="number" min="0" style="width:7ch"></label><button class="btn primary" id="e3-chk">Corregir</button></div><div id="e3-res"></div>');
    $('#e3-chk', s3).addEventListener('click', function () {
      var okr = +$('#e3-r').value === r3.root.v && $('#e3-r').value !== '', okp = parseNums($('#e3-p').value).join(' ') === L.pre(r3.root).join(' '), okn = +$('#e3-n').value === rots && $('#e3-n').value !== '';
      [['#e3-r', okr], ['#e3-p', okp], ['#e3-n', okn]].forEach(function (x) { $(x[0]).classList.toggle('ok', x[1]); $(x[0]).classList.toggle('bad', !x[1]); });
      pts.e3[0] = (okr ? 1 : 0) + (okp ? 2 : 0) + (okn ? 1 : 0); total();
      $('#e3-res').innerHTML = '<div class="q-fb ' + (okr && okp && okn ? 'ok' : 'bad') + '">Árbol final: <code>' + L.paren(r3.root) + '</code> · preorden ' + L.pre(r3.root).join(' ') + ' · rotaciones: ' + rots + '.</div>' + treeOutput('avl', seq, []);
    });

    /* 4 · hash */
    var ex = genHashEx(), hres = L.hashInsert(ex.m, ex.keys, 'lin'), hpos = {};
    hres.steps.forEach(function (x) { hpos[x.k] = x.pos; });
    var s4 = sec('e4', 'Ejercicio 4 · 4 pts', 'Tabla hash', '<p>Tabla de tamaño <b>' + ex.m + '</b>, h(k) = k mod ' + ex.m + ', hash cerrada con sondeo lineal. Inserte en este orden: <b>' + ex.keys.join(', ') + '</b>. Indique la posición de cada clave y el factor de carga.</p><div class="sim-bar">' + ex.keys.map(function (k) { return '<label>Pos. de ' + k + '<input class="in" type="number" data-k="' + k + '" style="width:7ch"></label>'; }).join('') + '<label>α<input class="in" id="e4-a" type="text" style="width:8ch" placeholder="0,00"></label><button class="btn primary" id="e4-chk">Corregir</button></div><div id="e4-res"></div>');
    $('#e4-chk', s4).addEventListener('click', function () {
      var ok = 0;
      $$('input[data-k]', s4).forEach(function (i) { var g = i.value !== '' && +i.value === hpos[i.dataset.k]; i.classList.toggle('ok', g); i.classList.toggle('bad', !g); if (g) ok++; });
      var al = parseFloat(String($('#e4-a').value).replace(',', '.')), oka = !isNaN(al) && Math.abs(al - 5 / ex.m) < 0.006;
      $('#e4-a').classList.toggle('ok', oka); $('#e4-a').classList.toggle('bad', !oka);
      pts.e4[0] = 0.6 * ok + (oka ? 1 : 0); total();
      $('#e4-res').innerHTML = '<div class="q-fb ' + (ok === 5 && oka ? 'ok' : 'bad') + '">α = 5 / ' + ex.m + ' = ' + (5 / ex.m).toFixed(2) + '.</div>' + hashTable(hres, 'lin') + hashSteps(hres, 'lin');
    });

    /* 5 · grafo */
    var gtxt = genDigraph(), gg = L.parseGraph(gtxt, true), src = gg.verts[0];
    var gbfs = L.bfs(gg, src).order, gsc = L.stronglyConnected(gg), gcy = !!L.findCycle(gg);
    var s5 = sec('e5', 'Ejercicio 5 · 4 pts', 'Grafos', '<p>Grafo dirigido con los arcos: <b>' + gtxt.split('\n').map(function (x) { return x.replace(' ', ' → '); }).join(', ') + '</b>.</p>' + drawGraph(gg) + '<p>Con los vecinos en orden alfabético: (a) recorrido BFS desde <b>' + src + '</b>; (b) ¿es fuertemente conexo?; (c) ¿tiene ciclos?</p><div class="sim-bar"><label>BFS<input class="in wide" id="e5-b" type="text" placeholder="A B C …"></label><label>Fuertemente conexo<select id="e5-s"><option value="">…</option><option>sí</option><option>no</option></select></label><label>Tiene ciclo<select id="e5-c"><option value="">…</option><option>sí</option><option>no</option></select></label><button class="btn primary" id="e5-chk">Corregir</button></div><div id="e5-res"></div>');
    $('#e5-chk', s5).addEventListener('click', function () {
      var ob = String($('#e5-b').value).toUpperCase().split(/[^A-Z]+/).filter(Boolean).join(' ') === gbfs.join(' '), os = $('#e5-s').value === (gsc ? 'sí' : 'no'), oc = $('#e5-c').value === (gcy ? 'sí' : 'no');
      pts.e5[0] = (ob ? 2 : 0) + (os ? 1 : 0) + (oc ? 1 : 0); total();
      $('#e5-res').innerHTML = '<div class="q-fb ' + (ob && os && oc ? 'ok' : 'bad') + '">BFS: <b>' + gbfs.join(', ') + '</b> · fuertemente conexo: <b>' + (gsc ? 'sí' : 'no') + '</b> · ciclo: <b>' + (gcy ? 'sí: ' + L.findCycle(gg).join(' → ') : 'no') + '</b>. DFS: ' + L.dfs(gg, src).order.join(', ') + '.</div>';
    });

    /* 6 · caso */
    var cs = pick(DATA.casos);
    var s6 = sec('e6', 'Ejercicio 6 · 5 pts', 'Caso: ¿qué estructura utilizaría?', '<p>' + cs.q + ' Justifique su elección.</p><textarea class="ta" rows="4" placeholder="Estructura, costo de las operaciones y por qué descarta las otras"></textarea><details><summary>Ver resolución</summary><div class="uc-ex"><p><b>Estructura:</b> ' + cs.a + '</p><p><b>Por qué:</b> ' + cs.why + '</p>' + (cs.no ? '<p><b>Qué descartar:</b> ' + cs.no + '</p>' : '') + '</div></details><ul class="checklist"><li><label><input type="checkbox" data-p="2"> Elegí la estructura correcta (2)</label></li><li><label><input type="checkbox" data-p="2"> Justifiqué con la operación más frecuente y su costo (2)</label></li><li><label><input type="checkbox" data-p="1"> Dije por qué descarto otra estructura (1)</label></li></ul>');
    s6.addEventListener('change', function () { var g = 0; $$('input[type=checkbox]', s6).forEach(function (c) { if (c.checked) g += +c.dataset.p; }); pts.e6[0] = g; total(); });

    /* 7 · teoría */
    var pool = []; DATA.finales.forEach(function (f) { f.ex.forEach(function (x) { if (CONCEPT_TEMAS.indexOf(x.tema) >= 0 && x.res.length > 120) pool.push({ f: f, x: x }); }); });
    var tq = pick(pool);
    var s7 = sec('e7', 'Ejercicio 7 · 5 pts', 'Pregunta de teoría (' + esc(tq.f.nombre) + ', pregunta ' + tq.x.n + ')', '<p>' + tq.x.en + '</p><textarea class="ta" rows="4" placeholder="Respondé como lo harías en el examen"></textarea><details><summary>Ver respuesta modelo</summary><div class="uc-ex">' + tq.x.res + refChips(tq.x.ref) + '</div></details><div class="sim-bar"><label>Autoevaluación<select id="e7-s"><option value="0">Todavía no la comparé</option><option value="1">No la sabía (1)</option><option value="3">A medias (3)</option><option value="5">Completa (5)</option></select></label></div>');
    $('#e7-s', s7).addEventListener('change', function () { pts.e7[0] = +this.value; total(); });
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
