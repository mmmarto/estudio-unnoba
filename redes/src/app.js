/* app.js — interfaz de la guía de REDES */
(function () {
'use strict';
var L = window.NL;
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
  try { if (v === undefined) { var r = localStorage.getItem('redes2p.' + k); return r ? JSON.parse(r) : null; } localStorage.setItem('redes2p.' + k, JSON.stringify(v)); } catch (e) { return null; }
}

/* ============ TABS ============ */
var TABS = ['teoria', 'subneteo', 'ruteo', 'tramas', 'quizzes', 'parciales', 'tps', 'simulacro'];
var rendered = {};
var RENDER = {};
function showTab(id) {
  if (TABS.indexOf(id) < 0) id = 'teoria';
  TABS.forEach(function (t) {
    var on = t === id;
    $('#tab-' + t).setAttribute('aria-selected', on ? 'true' : 'false');
    $('#' + t).hidden = !on;
  });
  if (!rendered[id]) { rendered[id] = true; RENDER[id](); }
  try { if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id); } catch (e) { /* nada */ }
}
function initTabs() {
  TABS.forEach(function (t) {
    $('#tab-' + t).addEventListener('click', function () { showTab(t); window.scrollTo(0, 0); });
  });
  window.addEventListener('hashchange', function () { showTab(location.hash.replace('#', '')); });
  showTab(location.hash.replace('#', '') || 'teoria');
}

/* ============ COUNTDOWN ============ */
function countdown() {
  var target = new Date('2026-11-20T18:30:00-03:00').getTime();
  var el = $('#countdown');
  function tick() {
    var d = target - Date.now();
    if (d <= 0) { el.textContent = 'El parcial ya empezó o terminó'; return; }
    var days = Math.floor(d / 864e5), hs = Math.floor(d % 864e5 / 36e5), mi = Math.floor(d % 36e5 / 6e4);
    el.textContent = 'Faltan ' + (days > 0 ? days + ' d ' : '') + hs + ' h ' + mi + ' min';
  }
  tick(); setInterval(tick, 30000);
}

/* ============ RUTEO: motor de tablas ============ */
function ifaceOnNet(r, net) { for (var i = 0; i < r.ifs.length; i++) if (r.ifs[i].net === net) return r.ifs[i]; return null; }
function routeTable(topo, rname, nets) {
  var R = topo.routers;
  return nets.map(function (net) {
    var d = ifaceOnNet(R[rname], net);
    if (d) return { net: net, gw: null, iface: d.n, ip: d.ip };
    var seen = {}; seen[rname] = true;
    var q = [{ r: rname, first: null }];
    while (q.length) {
      var cur = q.shift();
      var rc = R[cur.r];
      for (var i = 0; i < rc.ifs.length; i++) {
        var itf = rc.ifs[i];
        for (var y in R) {
          if (seen[y]) continue;
          var j = ifaceOnNet(R[y], itf.net);
          if (!j) continue;
          seen[y] = true;
          var first = cur.first || { iface: itf.n, gw: j.ip };
          if (ifaceOnNet(R[y], net)) return { net: net, gw: first.gw, iface: first.iface };
          q.push({ r: y, first: first });
        }
      }
    }
    return { net: net, gw: '?', iface: '?' };
  });
}
function tableHtml(rows) {
  var t = '<div class="tbl"><table><thead><tr><th>Red destino</th><th>Gateway</th><th>Interfaz</th></tr></thead><tbody>';
  rows.forEach(function (r) {
    t += '<tr><td><code>' + r.net + '</code></td><td>' + (r.gw ? '<code>' + r.gw + '</code>' : '<span class="muted">— (conectada)</span>') + '</td><td><code>' + r.iface + '</code></td></tr>';
  });
  return t + '</tbody></table></div>';
}
function fillRT(root) {
  $$('.rt', root).forEach(function (d) {
    if (d.dataset.done) return;
    d.dataset.done = '1';
    var topo = DATA.topos[d.dataset.topo];
    d.innerHTML = tableHtml(routeTable(topo, d.dataset.router, d.dataset.nets.split(',')));
  });
}

/* ============ SVG de topologías ============ */
function drawTopo(topo) {
  var R = topo.routers, s = '<svg viewBox="0 0 ' + topo.w + ' ' + topo.h + '" role="img" aria-label="Topología de red" class="topo">';
  var names = Object.keys(R), byNet = {};
  names.forEach(function (n) { R[n].ifs.forEach(function (i) { (byNet[i.net] = byNet[i.net] || []).push({ r: n, i: i }); }); });
  Object.keys(byNet).forEach(function (net) {
    var e = byNet[net]; if (e.length !== 2) return;
    if (R[e[0].r].x > R[e[1].r].x) e = [e[1], e[0]];
    var xa = R[e[0].r].x + 50, xb = R[e[1].r].x - 50, y = R[e[0].r].y, ia = e[0].i, ib = e[1].i;
    s += '<line class="t-ln" x1="' + xa + '" y1="' + y + '" x2="' + xb + '" y2="' + y + '"/>';
    s += '<text class="t-net" text-anchor="middle" x="' + ((xa + xb) / 2) + '" y="' + (y - 10) + '">' + net + '</text>';
    s += '<text class="t-if" x="' + (xa + 5) + '" y="' + (y + 15) + '">' + ia.n + '</text><text class="t-if" text-anchor="end" x="' + (xb - 5) + '" y="' + (y + 15) + '">' + ib.n + '</text>';
    s += '<text class="t-ip" x="' + (xa + 5) + '" y="' + (y + 29) + '">' + ia.ip + '</text><text class="t-ip" text-anchor="end" x="' + (xb - 5) + '" y="' + (y + 29) + '">' + ib.ip + '</text>';
  });
  (topo.lans || []).forEach(function (l) {
    var r = R[l.r], x1 = r.x + l.dx * 0.5, y1 = r.y + 22, x2 = r.x + l.dx, y2 = r.y + l.dy - 4;
    var itf = ifaceOnNet(r, l.net);
    s += '<line class="t-ln" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>';
    if (itf) {
      var left = l.dx < 0 || (l.dx === 0 && false);
      s += '<text class="t-if" x="' + (x1 + (l.dx < 0 ? -22 : (l.dx > 0 ? 22 : 6))) + '" y="' + (y1 + 24) + '" text-anchor="' + (l.dx < 0 ? 'end' : 'start') + '">' + itf.n + '</text>';
      s += '<text class="t-ip" x="' + (x1 + (l.dx < 0 ? -22 : (l.dx > 0 ? 22 : 6))) + '" y="' + (y1 + 39) + '" text-anchor="' + (l.dx < 0 ? 'end' : 'start') + '">' + itf.ip + '</text>';
    }
    s += '<rect class="t-pc" x="' + (x2 - 26) + '" y="' + y2 + '" width="52" height="26" rx="5"/><text class="t-pct" x="' + x2 + '" y="' + (y2 + 17) + '" text-anchor="middle">' + l.pc + '</text>';
    s += '<text class="t-net" x="' + x2 + '" y="' + (y2 + 44) + '" text-anchor="middle">' + l.net + '</text>';
  });
  names.forEach(function (n) {
    var r = R[n];
    s += '<rect class="t-r" x="' + (r.x - 50) + '" y="' + (r.y - 22) + '" width="100" height="44" rx="8"/><text class="t-rt" x="' + r.x + '" y="' + (r.y + 5) + '" text-anchor="middle">' + n + '</text>';
  });
  return s + '</svg>';
}

/* práctica de tabla: inputs gateway + interfaz */
function normGw(s) { s = String(s).trim().toLowerCase(); return (s === '' || s === '-' || s === '—' || s === '--' || s === 'ninguno' || s === 'directo' || s === 'conectada') ? '' : s; }
function practiceTable(topo, rname, nets, onResult) {
  var rows = routeTable(topo, rname, nets), r = topo.routers[rname];
  var wrap = h('div', { class: 'prac' });
  var opts = '<option value="">Interfaz…</option>' + r.ifs.map(function (i) { return '<option>' + i.n + '</option>'; }).join('');
  var html = '<div class="tbl"><table><thead><tr><th>Red destino</th><th>Gateway</th><th>Interfaz</th><th></th></tr></thead><tbody>';
  rows.forEach(function (x, i) {
    html += '<tr data-i="' + i + '"><td><code>' + x.net + '</code></td><td><input class="in" type="text" placeholder="IP o —" autocomplete="off" aria-label="Gateway para ' + x.net + '"></td><td><select class="in" aria-label="Interfaz para ' + x.net + '">' + opts + '</select></td><td class="res"></td></tr>';
  });
  html += '</tbody></table></div><div class="actions"><button class="btn primary chk">Corregir</button><button class="btn show">Ver respuesta</button><span class="score"></span></div>';
  wrap.innerHTML = html;
  $('.chk', wrap).addEventListener('click', function () {
    var ok = 0, tot = rows.length * 2;
    $$('tbody tr', wrap).forEach(function (tr, i) {
      var gw = normGw($('input', tr).value), ifc = $('select', tr).value, exp = rows[i];
      var g = gw === (exp.gw || ''), f = ifc === exp.iface;
      ok += (g ? 1 : 0) + (f ? 1 : 0);
      $('.res', tr).innerHTML = (g && f) ? '<span class="ok">✓</span>' : '<span class="bad">✗ ' + (exp.gw ? exp.gw : '—') + ' · ' + exp.iface + '</span>';
    });
    $('.score', wrap).textContent = ok + ' de ' + tot + ' campos bien';
    if (onResult) onResult(ok, tot);
  });
  $('.show', wrap).addEventListener('click', function () {
    $$('tbody tr', wrap).forEach(function (tr, i) {
      $('input', tr).value = rows[i].gw || '—'; $('select', tr).value = rows[i].iface;
    });
  });
  return wrap;
}

/* ============ TEORÍA ============ */
RENDER.teoria = function () {
  var P = $('#teoria');
  var done = store('done') || [];
  var filter = 'todas';
  var html = '<div class="panel-head"><div class="filters" role="group" aria-label="Filtrar por prioridad"><span class="eyebrow">Mostrar</span>' +
    [['todas', 'Todas'], ['alta', 'Solo alta'], ['alta media', 'Alta + media'], ['pend', 'Sin dominar']].map(function (f, i) { return '<button class="chip" data-f="' + f[0] + '" aria-pressed="' + (i === 0) + '">' + f[1] + '</button>'; }).join('') +
    '</div><div class="jump"><label for="jump-t">Ir a</label><select id="jump-t"><option value="">Elegí un tema…</option>' +
    DATA.teoria.map(function (c, i) { return '<option value="c-' + c.id + '">' + (i < 9 ? '0' : '') + (i + 1) + ' · ' + esc(c.t) + '</option>'; }).join('') + '</select></div></div>';
  html += '<section id="que-toman"><div><div class="eyebrow">Qué toman</div><h2>El 2.º parcial, en cinco bloques</h2></div><p class="lead">Armado con los parciales 2017, 2022, 2024 y el recuperatorio 2025 (están en las pestañas de resueltos). La estructura se repite casi igual todos los años:</p>' +
    '<div class="tbl"><table><thead><tr><th>Bloque</th><th>Qué piden</th><th>Aparece en</th></tr></thead><tbody>' +
    '<tr><td><b>Subneteo</b> <span class="tag alta">alta</span></td><td>N subredes de un bloque: máscara, red de la subred K, rango de hosts, broadcast, gateway (primer host), a qué subred pertenece una IP</td><td>2017 · 2022 · 2024 · 2025</td></tr>' +
    '<tr><td><b>Ruteo</b> <span class="tag alta">alta</span></td><td>Tablas de ruteo (destino, gateway, interfaz) en una topología de 3 routers; comandos IOS para una interfaz; elegir el bloque correcto de <code>ip route</code></td><td>2017 · 2022 · 2024 · 2025</td></tr>' +
    '<tr><td><b>Broadcast / host válido</b> <span class="tag alta">alta</span></td><td>Broadcast de redes /20, validez de 200.30.63.255/18</td><td>2024 · 2025</td></tr>' +
    '<tr><td><b>Teórico (multiple choice)</b> <span class="tag media">media</span></td><td>IPv6 sin broadcast y loopback ::1, ARP/NDP, TCP/UDP, campos del header IPv4, RFC 1918, hosts por máscara</td><td>2022 · 2024 · 2025</td></tr>' +
    '<tr><td><b>TCP vs UDP (desarrollo)</b> <span class="tag media">media</span></td><td>Explicar la diferencia</td><td>2025</td></tr></tbody></table></div></section>';
  html += '<section id="plan"><div><div class="eyebrow">Plan</div><h2>De hoy al viernes</h2></div><div class="plan">' +
    [['Mar 17/11', 'Subneteo', 'Tarjetas 1 a 4 de esta pestaña. Después, la pestaña <b>Subneteo</b>: hacé 10 ejercicios del generador sin mirar la resolución.'],
     ['Mié 18/11', 'Ruteo e IPv4', 'Tarjetas de ruteo, ip route y comandos IOS. Pestaña <b>Ruteo</b>: completá a mano las tablas de las dos topologías. Repasá direcciones especiales, header y fragmentación.'],
     ['Jue 19/11', 'Transporte, IPv6, ARP', 'TCP vs UDP, handshake, flujo y congestión, IPv6 y ARP. Pestaña <b>Tramas</b>: decodificá las 6 tramas. Quizzes de Transporte e IPv6.'],
     ['Vie 20/11', 'Simulacro y trampas', 'Por la mañana el <b>Simulacro</b> completo y repaso de las advertencias naranjas de cada tarjeta. Parcial a las 18:30.']]
      .map(function (d, i) { return '<div class="day' + (i === 3 ? ' exam' : '') + '"><div class="d">' + d[0] + '<span>' + d[1] + '</span></div><div>' + d[2] + '</div></div>'; }).join('') + '</div></section>';
  html += '<div class="concepts" id="cards">' + DATA.teoria.map(function (c, i) {
    return '<article class="concept" id="c-' + c.id + '" data-prio="' + c.prio + '"><div class="concept-head"><div><div class="eyebrow">' + (i < 9 ? '0' : '') + (i + 1) + '</div><h3>' + c.t + '</h3></div><span class="tag ' + c.prio + '">' + c.prio + '</span>' +
      '<label class="mark"><input type="checkbox" data-id="' + c.id + '"> Lo domino</label></div>' +
      '<div class="body"><div class="dse"><div class="dse-def"><div class="dse-k">Definición</div><p>' + c.def + '</p></div><div class="dse-simple"><div class="dse-k">En simple</div>' +
      (/^<(ul|ol|div)/.test(c.simple) ? c.simple : '<p>' + c.simple + '</p>') + '</div><div class="dse-ex"><div class="dse-k">Ejemplo</div>' + (/^<(ul|ol|div|pre)/.test(c.ej) ? c.ej : '<p>' + c.ej + '</p>') + '</div></div>' +
      (c.warn ? '<div class="warn"><b>Ojo.</b> ' + c.warn + '</div>' : '') + '</div></article>';
  }).join('') + '</div>';
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

/* ============ SUBNETEO ============ */
function genSubnetEx() {
  var bases = [
    function () { return ['10.' + (1 + rnd(250)) + '.0.0', 16]; },
    function () { return ['172.' + (16 + rnd(16)) + '.0.0', 16]; },
    function () { return ['192.168.' + (1 + rnd(250)) + '.0', 24]; },
    function () { return ['200.' + (1 + rnd(250)) + '.' + (1 + rnd(250)) + '.0', 24]; },
    function () { return ['201.' + (1 + rnd(250)) + '.' + (1 + rnd(250)) + '.0', 24]; },
    function () { var p = pick([18, 20]); var r = L.info('172.' + (16 + rnd(16)) + '.' + rnd(256) + '.0', p); return [r.net, p]; }
  ];
  var b = pick(bases)(); var bp = b[1];
  var maxBits = Math.min(6, 29 - bp);
  var bits = 2 + rnd(maxBits - 1);
  var lo = Math.pow(2, bits - 1) + 1, hi = Math.pow(2, bits);
  var N = lo + rnd(hi - lo + 1);
  var sp = L.split(b[0], bp, N);
  var k1 = 1 + rnd(N), k2 = 1 + rnd(N);
  var k3 = 1 + rnd(N);
  var s3 = sp.subs[k3 - 1];
  var hostOff = 1 + rnd(sp.size - 2);
  var hostInt = s3.netInt + hostOff;
  var ords = ['', '1.ª', '2.ª', '3.ª', '4.ª', '5.ª', '6.ª', '7.ª', '8.ª', '9.ª', '10.ª', '11.ª', '12.ª', '13.ª', '14.ª', '15.ª', '16.ª', '17.ª', '18.ª', '19.ª', '20.ª'];
  function ord(k) { return ords[k] || (k + '.ª'); }
  return { base: b[0], bp: bp, N: N, sp: sp, k1: k1, k2: k2, host: L.intToIp(hostInt), hostSub: s3, ord: ord };
}
function subnetStepsHtml(ex) {
  var sp = ex.sp, bits = sp.bits, bp = ex.bp;
  var oct = Math.floor((sp.prefix - 1) / 8); // octeto "raro" 0..3
  var blockOctet = Math.pow(2, 8 * (oct + 1) - sp.prefix);
  var names = ['1.er', '2.º', '3.er', '4.º'];
  var s = '<ol class="steps">';
  s += '<li><b>Bits</b>: ' + ex.N + ' subredes → 2<sup>' + bits + '</sup> = ' + sp.total + ' ' + (sp.total >= ex.N ? '≥' : '<') + ' ' + ex.N + ' (con ' + (bits - 1) + ' bits serían ' + Math.pow(2, bits - 1) + ', no alcanza). Hacen falta <b>' + bits + ' bits</b>.</li>';
  s += '<li><b>Máscara</b>: ' + bp + ' + ' + bits + ' = <b>/' + sp.prefix + '</b> = <code>' + sp.mask + '</code>. Cada subred tiene ' + sp.size + ' direcciones (' + sp.hosts + ' hosts).</li>';
  s += '<li><b>Bloque</b>: el octeto que cambia es el ' + names[oct] + ' y avanza de a <b>' + blockOctet + '</b>. Las subredes arrancan en ' + sp.subs.slice(0, 4).map(function (x) { return '<code>' + x.net + '</code>'; }).join(', ') + '…</li>';
  var a = sp.subs[ex.k1 - 1], b = sp.subs[ex.k2 - 1], c = ex.hostSub;
  s += '<li><b>a)</b> La ' + ex.ord(ex.k1) + ' subred es la número ' + (ex.k1 - 1) + ' contando desde 0: ' + (ex.k1 - 1) + ' × ' + blockOctet + ' = ' + ((ex.k1 - 1) * blockOctet) + ' que se suma al ' + names[oct] + ' octeto de la red original (<code>' + ex.base + '</code>) → <code>' + a.net + '/' + a.prefix + '</code>.</li>';
  s += '<li><b>b)</b> La ' + ex.ord(ex.k2) + ' subred es <code>' + b.net + '/' + b.prefix + '</code> y su broadcast es <code>' + b.bc + '</code>. Hosts: de <code>' + b.first + '</code> a <code>' + b.last + '</code>.</li>';
  s += '<li><b>c)</b> <code>' + ex.host + '</code> cae en el bloque que arranca en <code>' + c.net + '</code> (' + ex.ord(c.k) + ' subred), así que el gateway es el primer host: <code>' + c.first + '</code>.</li>';
  return s + '</ol>';
}
function mkSubnetEx(root, ex, cb) {
  var sp = ex.sp, a = sp.subs[ex.k1 - 1], b = sp.subs[ex.k2 - 1], c = ex.hostSub;
  var w = h('div', { class: 'gen-enun' });
  w.innerHTML = '<p>Dada la red <code>' + ex.base + '/' + ex.bp + '</code>, cree <b>' + ex.N + '</b> subredes e indique:</p><ol class="abc">' +
    '<li>Dirección de RED de la <b>' + ex.ord(ex.k1) + '</b> subred: <input class="in" data-k="a" type="text" placeholder="x.x.x.x" aria-label="Dirección de red"></li>' +
    '<li>Rango de direcciones válidas de la <b>' + ex.ord(ex.k2) + '</b> subred. Desde <input class="in" data-k="b1" type="text" placeholder="x.x.x.x"> hasta <input class="in" data-k="b2" type="text" placeholder="x.x.x.x"></li>' +
    '<li>Si el gateway es la primera dirección válida de cada subred, ¿cuál es el gateway de <code>' + ex.host + '</code>? <input class="in" data-k="c" type="text" placeholder="x.x.x.x"></li>' +
    '<li>Máscara de subred: <input class="in" data-k="m" type="text" placeholder="255.255.x.x"></li></ol>' +
    '<div class="actions"><button class="btn primary chk">Corregir</button><button class="btn steps-btn">Ver resolución paso a paso</button><span class="score"></span></div><div class="stepsbox" hidden></div>';
  root.appendChild(w);
  var exp = { a: a.net, b1: b.first, b2: b.last, c: c.first, m: sp.mask };
  $('.chk', w).addEventListener('click', function () {
    var ok = 0, tot = 0;
    $$('input.in', w).forEach(function (i) {
      tot++; var good = i.value.trim().replace(/\/\d+$/, '') === exp[i.dataset.k];
      i.classList.toggle('ok', good); i.classList.toggle('bad', !good); if (good) ok++;
    });
    $('.score', w).textContent = ok + ' de ' + tot + ' bien';
    if (cb) cb(ok, tot);
  });
  $('.steps-btn', w).addEventListener('click', function () {
    var bx = $('.stepsbox', w); bx.hidden = !bx.hidden; if (!bx.innerHTML) bx.innerHTML = subnetStepsHtml(ex);
  });
  return w;
}
function calcHtml(ip, p) {
  var i = L.info(ip, p), kind = i.isNet ? 'Es la dirección de <b>red</b>: no se puede asignar a un host.' : i.isBc ? 'Es la dirección de <b>broadcast</b>: no se puede asignar a un host.' : 'Es una dirección de <b>host válida</b> de esa red.';
  return '<div class="tbl"><table><tbody><tr><th>Máscara</th><td><code>' + i.mask + '</code> (/' + p + ')</td></tr><tr><th>Dirección de red</th><td><code>' + i.net + '</code></td></tr><tr><th>Broadcast</th><td><code>' + i.bc + '</code></td></tr><tr><th>Primer host</th><td><code>' + i.first + '</code> (gateway típico)</td></tr><tr><th>Último host</th><td><code>' + i.last + '</code></td></tr><tr><th>Hosts</th><td>' + i.hosts + ' (2<sup>' + (32 - p) + '</sup> − 2)</td></tr><tr><th>La IP ingresada</th><td>' + kind + '</td></tr></tbody></table></div>';
}
RENDER.subneteo = function () {
  var P = $('#subneteo');
  P.innerHTML = '<div class="wrap"><main>' +
    '<section><div><div class="eyebrow">Herramienta</div><h2>Calculadora de red</h2></div><p class="lead">Ingresá una IP y el prefijo (o la máscara). Sirve para chequear tus cuentas, no para reemplazarlas en el parcial.</p>' +
    '<div class="gen-bar"><label>IP <input class="in" id="c-ip" value="192.168.10.77" size="16"></label><label>Prefijo o máscara <input class="in" id="c-p" value="26" size="16"></label><button class="btn primary" id="c-go">Calcular</button></div><div id="c-out"></div></section>' +
    '<section><div><div class="eyebrow">Herramienta</div><h2>Dividir un bloque en N subredes</h2></div>' +
    '<div class="gen-bar"><label>Bloque <input class="in" id="s-ip" value="10.30.0.0" size="16"></label><label>Prefijo <input class="in" id="s-p" value="16" size="4"></label><label>N.º de subredes <input class="in" id="s-n" value="12" size="4"></label><button class="btn primary" id="s-go">Dividir</button></div><div id="s-out"></div></section>' +
    '<section><div><div class="eyebrow">Práctica</div><h2>Generador de ejercicios tipo parcial</h2></div><p class="lead">Mismo formato que 2022 y 2024: red de la subred K, rango de hosts y gateway. Escribí las respuestas, corregí, y recién después mirá la resolución.</p>' +
    '<div class="gen-bar"><button class="btn primary" id="g-new">Ejercicio nuevo</button><span class="gen-num" id="g-count"></span></div><div id="g-box"></div></section>' +
    '<section><div><div class="eyebrow">Receta</div><h2>Los 7 pasos, para tener a mano</h2></div><div class="note"><ol class="steps"><li>Bits = el menor n con 2<sup>n</sup> ≥ N.</li><li>Prefijo nuevo = prefijo + n; escribir la máscara.</li><li>Bloque = 256 − valor de la máscara en el octeto que cambia.</li><li>Subred k arranca en (k − 1) × bloque.</li><li>Broadcast = próxima red − 1.</li><li>Hosts: red + 1 hasta broadcast − 1.</li><li>Gateway = primer host.</li></ol></div></section>' +
    '</main></div>';
  function calc() {
    var ip = $('#c-ip').value.trim(), pv = $('#c-p').value.trim(), p;
    if (/^\d+$/.test(pv)) p = parseInt(pv, 10); else if (/^\//.test(pv)) p = parseInt(pv.slice(1), 10); else p = L.maskToPrefix(pv);
    if (L.ipToInt(ip) === null || p === null || isNaN(p) || p < 0 || p > 32) { $('#c-out').innerHTML = '<p class="warn">Revisá la IP (cuatro números de 0 a 255) y el prefijo (0 a 32) o una máscara válida.</p>'; return; }
    $('#c-out').innerHTML = calcHtml(ip, p);
  }
  $('#c-go').addEventListener('click', calc); calc();
  function split() {
    var ip = $('#s-ip').value.trim(), p = parseInt($('#s-p').value, 10), n = parseInt($('#s-n').value, 10);
    if (L.ipToInt(ip) === null || !(p >= 0 && p <= 30) || !(n >= 2 && n <= 4096)) { $('#s-out').innerHTML = '<p class="warn">Revisá los datos: IP válida, prefijo entre 0 y 30 y entre 2 y 4096 subredes.</p>'; return; }
    var base = L.info(ip, p), sp = L.split(base.net, p, n);
    if (sp.prefix > 30) { $('#s-out').innerHTML = '<p class="warn">Con ' + n + ' subredes el prefijo pasa de /30: no quedan hosts.</p>'; return; }
    var t = '<p>' + n + ' subredes → <b>' + sp.bits + ' bits</b> → <b>/' + sp.prefix + '</b> (<code>' + sp.mask + '</code>) · ' + sp.total + ' subredes posibles (' + (sp.total - n) + ' sin usar) · ' + sp.hosts + ' hosts por subred.</p>';
    t += '<div class="tbl"><table><thead><tr><th>N.º</th><th>Red</th><th>Primer host</th><th>Último host</th><th>Broadcast</th></tr></thead><tbody>';
    sp.subs.slice(0, 64).forEach(function (s) { t += '<tr' + (s.k > n ? ' class="unused"' : '') + '><td>' + s.k + '</td><td><code>' + s.net + '/' + s.prefix + '</code></td><td><code>' + s.first + '</code></td><td><code>' + s.last + '</code></td><td><code>' + s.bc + '</code></td></tr>'; });
    t += '</tbody></table></div>' + (sp.subs.length > 64 ? '<p class="muted">Se muestran las primeras 64.</p>' : '') + '<p class="muted">Las filas atenuadas son subredes que sobran (no las pidieron).</p>';
    $('#s-out').innerHTML = t;
  }
  $('#s-go').addEventListener('click', split); split();
  var cnt = 0;
  function next() { cnt++; $('#g-box').innerHTML = ''; mkSubnetEx($('#g-box'), genSubnetEx()); $('#g-count').textContent = 'Ejercicio ' + cnt; }
  $('#g-new').addEventListener('click', next); next();
};

/* ============ RUTEO ============ */
RENDER.ruteo = function () {
  var P = $('#ruteo');
  var html = '<div class="wrap"><main>';
  html += '<section><div><div class="eyebrow">Reglas</div><h2>Cómo se arma una tabla de ruteo</h2></div><div class="note"><ol class="steps"><li>Anotá primero todas las redes con sus máscaras y las IP de cada interfaz del router que te piden (usá las reglas del enunciado: "primera" o "última" dirección).</li><li>Las redes que <b>toca el router</b> son conectadas: gateway "—", interfaz propia.</li><li>Para cada red remota, mirá <b>por cuál de tus enlaces</b> salís: el gateway es la IP del router <b>del otro extremo</b> de ese enlace, y la interfaz es la tuya en ese enlace.</li><li>En un router de la punta, todo lo remoto sale por el mismo lado: se puede resumir con una ruta por defecto <code>ip route 0.0.0.0 0.0.0.0 &lt;vecino&gt;</code>.</li></ol></div></section>';
  var keys = Object.keys(DATA.topos);
  keys.forEach(function (k) {
    var t = DATA.topos[k];
    html += '<section id="topo-' + k + '"><div><div class="eyebrow">Topología</div><h2>' + t.nombre + '</h2></div><div class="topo-box">' + drawTopo(t) + '</div>' +
      '<div class="gen-bar"><label>Ver la tabla de <select class="in rsel" data-k="' + k + '">' + Object.keys(t.routers).map(function (r) { return '<option>' + r + '</option>'; }).join('') + '</select></label><span class="muted">Primero intentá hacerla a mano en la práctica de abajo.</span></div>' +
      '<div class="rsol" data-k="' + k + '"></div>' +
      '<h3>Práctica: completá la tabla</h3><div class="gen-bar"><label>Router <select class="in psel" data-k="' + k + '">' + Object.keys(t.routers).map(function (r) { return '<option>' + r + '</option>'; }).join('') + '</select></label></div><div class="pracbox" data-k="' + k + '"></div></section>';
  });
  html += '<section id="ios"><div><div class="eyebrow">Cisco IOS</div><h2>Comandos que aparecen en el parcial</h2></div><div class="pair"><div><h4>Configurar una interfaz</h4><pre><code>enable\nconfigure terminal\ninterface fastethernet 0/0\nip address 192.168.10.1 255.255.255.0\nno shutdown</code></pre></div><div><h4>Rutas estáticas de Pergamino</h4><pre><code>ip route 10.100.0.4 255.255.255.252 10.100.0.2\nip route 192.168.20.0 255.255.255.0 10.100.0.2\nip route 192.168.30.0 255.255.255.128 10.100.0.2\nip route 192.168.30.128 255.255.255.128 10.100.0.2</code></pre></div></div>' +
    '<div class="pair"><div><h4>Ruta por defecto</h4><pre><code>ip route 0.0.0.0 0.0.0.0 10.100.0.2</code></pre><p class="muted">Pergamino solo tiene una salida (Rojas = 10.100.0.2), así que esta línea reemplaza a las cuatro de al lado.</p></div><div><h4>Para verificar</h4><pre><code>show ip route\nshow ip interface brief</code></pre></div></div>' +
    '<div class="warn"><b>Las opciones trampa del parcial:</b> direcciones de host en lugar de red (192.168.20.1), el siguiente salto propio (10.100.0.1 en Pergamino) y máscaras que no corresponden. El next hop siempre es la IP del <u>vecino</u>.</div></section>';
  html += '</main></div>';
  P.innerHTML = html;
  function showSol(k, r) { var t = DATA.topos[k]; $('.rsol[data-k="' + k + '"]', P).innerHTML = tableHtml(routeTable(t, r, t.nets)); }
  function showPrac(k, r) { var t = DATA.topos[k], b = $('.pracbox[data-k="' + k + '"]', P); b.innerHTML = ''; b.appendChild(practiceTable(t, r, t.nets)); }
  keys.forEach(function (k) { var r0 = Object.keys(DATA.topos[k].routers)[1]; $('.rsel[data-k="' + k + '"]', P).value = r0; $('.psel[data-k="' + k + '"]', P).value = r0; showSol(k, r0); showPrac(k, r0); });
  P.addEventListener('change', function (e) {
    if (e.target.classList.contains('rsel')) showSol(e.target.dataset.k, e.target.value);
    if (e.target.classList.contains('psel')) showPrac(e.target.dataset.k, e.target.value);
  });
};

/* ============ TRAMAS ============ */
DATA.tramas = [
  { n: 'Trama 1 · consulta DNS (UDP)', hex: '00 18 f8 4e 70 2f 00 50 2c a4 34 ec 08 00 45 00 00 3e 7f 5e 00 00 80 11 cf aa c0 a8 01 64 c8 2a 61 6f 04 06 00 35 00 2a 2c a8 e4 e8 01 00 00 01 00 00 00 00 00 00 03 77 77 77 08 6d 69 6e 69 6e 6f 76 61 03 6f 72 67 00 00 01 00 01 23 cd ac f2' },
  { n: 'Trama 2 · respuesta DNS (UDP)', hex: '00 50 2c a4 34 ec 00 18 f8 4e 70 2f 08 00 45 00 00 5c b7 fa 00 00 3c 11 da f0 c8 2a 61 6f c0 a8 01 64 00 35 04 06 00 48 36 15 e4 e8 81 80 00 01 00 02 00 00 00 00 03 77 77 77 08 6d 69 6e 69 6e 6f 76 61 03 6f 72 67 00 00 01 00 01 c0 0c 00 05 00 01 00 00 25 11 00 02 c0 10 c0 10 00 01 00 01 00 00 25 11 00 04 57 e9 93 8c a1 23 64 f3' },
  { n: 'Trama 3 · TCP SYN', hex: '00 18 f8 4e 70 2f 00 50 2c a4 34 ec 08 00 45 00 00 30 7f 61 40 00 80 06 cd e4 c0 a8 01 64 57 e9 93 8c 0c 54 00 50 f0 e8 a3 97 00 00 00 00 70 02 ff ff 34 79 00 00 02 04 05 b4 01 01 04 02 11 ac fb 4b' },
  { n: 'Trama 4 · TCP SYN-ACK', hex: '00 50 2c a4 34 ec 00 18 f8 4e 70 2f 08 00 45 00 00 30 00 00 40 00 35 06 98 46 57 e9 93 8c c0 a8 01 64 00 50 0c 54 16 3b ae 0d f0 e8 a3 98 70 12 16 d0 59 4f 00 00 02 04 05 b4 01 01 04 02 ac 23 23 ca' },
  { n: 'Trama 5 · TCP ACK', hex: '00 18 f8 4e 70 2f 00 50 2c a4 34 ec 08 00 45 00 00 28 7f 62 40 00 80 06 cd eb c0 a8 01 64 57 e9 93 8c 0c 54 00 50 f0 e8 a3 98 16 3b ae 0e 50 10 ff ff 9c e3 00 00 a2 cb 23 45' },
  { n: 'Trama 6 · HTTP GET (cortada)', hex: '00 18 f8 4e 70 2f 00 50 2c a4 34 ec 08 00 45 00 01 c0 7f 63 40 00 80 06 cc 52 c0 a8 01 64 57 e9 93 8c 0c 54 00 50 f0 e8 a3 98 16 3b ae 0e 50 18 ff ff ee 95 00 00 47 45 54 20 2f 20 48 54 54 50 2f 31 2e 31 0d 0a 48 6f 73 74 3a 20 77 77 77 2e 6d 69 6e 69 6e 6f 76 61 2e 6f 72 67 0d 0a 55 73 65 72 2d 41 67 65 6e 74 3a 20 4d 6f 7a 69 6c 6c 61 2f 35 2e 30 20 28 57 69 6e 64 6f 77 73 3b 20 55 3b 20 57 69 6e 64 6f 77 73 20 4e 54 20 35 2e' }
];
function decodeHtml(bytes) {
  var d = L.decode(bytes), off = 0, cls = ['l2', 'l3', 'l4', 'dat'], layerBounds = [];
  d.layers.forEach(function (l, i) { if (/^(Ethernet|ARP|IPv4|UDP|TCP|ICMP)/.test(l.name)) { layerBounds.push({ from: off, to: off + l.len, c: ['l2', 'l3', 'l3', 'l4', 'l4', 'l4'][layerBounds.length] }); off += l.len; } });
  var hx = '<div class="hexdump" aria-label="Bytes de la trama">';
  for (var i = 0; i < bytes.length; i++) {
    var c = 'dat';
    for (var j = 0; j < layerBounds.length; j++) if (i >= layerBounds[j].from && i < layerBounds[j].to) c = layerBounds[j].c;
    // colores por capa real
    hx += '<span class="hb ' + c + '">' + (bytes[i] < 16 ? '0' : '') + bytes[i].toString(16) + '</span>';
  }
  hx += '</div>';
  var out = '<p class="muted">' + bytes.length + ' bytes. Colores: <span class="hb l2">Ethernet / ARP</span> <span class="hb l3">IP</span> <span class="hb l4">TCP / UDP / ICMP</span> <span class="hb dat">datos</span></p>' + hx;
  d.layers.forEach(function (l) {
    out += '<h4>' + l.name + '</h4><div class="tbl"><table><thead><tr><th>Campo</th><th>Hex</th><th>Valor</th><th>Significado</th></tr></thead><tbody>';
    l.rows.forEach(function (r) { out += '<tr><td>' + esc(r[0]) + '</td><td><code>' + esc(r[1]) + '</code></td><td><b>' + esc(r[2]) + '</b></td><td>' + esc(r[3]) + '</td></tr>'; });
    out += '</tbody></table></div>';
  });
  d.notes.forEach(function (n) { out += '<p class="warn">' + esc(n) + '</p>'; });
  return out;
}
RENDER.tramas = function () {
  var P = $('#tramas');
  var presets = DATA.tramas.map(function (t) { return { n: t.n, hex: t.hex }; });
  DATA.tps[0].items.forEach(function (it) { if (it.trama) presets.push({ n: 'TP3 ej. ' + it.n + ' · ' + it.q, hex: it.trama }); });
  P.innerHTML = '<div class="wrap"><main>' +
    '<section><div><div class="eyebrow">Decodificador</div><h2>Tramas en hexadecimal, campo por campo</h2></div><p class="lead">Elegí una trama de los ejercicios o pegá la tuya (bytes en hexa separados por espacios). Se leen Ethernet, ARP, IPv4, ICMP, UDP, TCP y DNS. Antes de mirar el resultado, intentá hacerlo vos con la tabla de offsets.</p>' +
    '<div class="gen-bar"><label>Trama <select class="in" id="tr-sel">' + presets.map(function (p, i) { return '<option value="' + i + '">' + esc(p.n) + '</option>'; }).join('') + '</select></label></div>' +
    '<textarea id="tr-ta" class="ta" rows="5" spellcheck="false" aria-label="Bytes de la trama en hexadecimal"></textarea><div class="actions"><button class="btn primary" id="tr-go">Decodificar</button></div><div id="tr-out"></div></section>' +
    '<section><div><div class="eyebrow">Mapa</div><h2>Dónde está cada cosa</h2></div><div class="tbl"><table><thead><tr><th>Bytes</th><th>Qué es</th></tr></thead><tbody>' +
    '<tr><td>0–5</td><td>MAC destino</td></tr><tr><td>6–11</td><td>MAC origen</td></tr><tr><td>12–13</td><td>EtherType: <code>08 00</code> IPv4 · <code>08 06</code> ARP</td></tr>' +
    '<tr><td>14</td><td>IP: <code>45</code> = versión 4, cabecera de 5 × 4 = 20 bytes</td></tr><tr><td>15</td><td>TOS / DSCP</td></tr><tr><td>16–17</td><td>Longitud total IP</td></tr><tr><td>18–19</td><td>Identificación</td></tr><tr><td>20–21</td><td>Flags + offset (<code>40 00</code> = DF)</td></tr><tr><td>22</td><td>TTL</td></tr><tr><td>23</td><td>Protocolo: <code>01</code> ICMP · <code>06</code> TCP · <code>11</code> UDP</td></tr><tr><td>24–25</td><td>Checksum IP</td></tr><tr><td>26–29</td><td>IP origen</td></tr><tr><td>30–33</td><td>IP destino</td></tr>' +
    '<tr><td>34–35 · 36–37</td><td>Puerto origen · puerto destino (TCP y UDP)</td></tr><tr><td>TCP 38–41 · 42–45</td><td>Número de secuencia · número de ACK</td></tr><tr><td>TCP 46–47</td><td>Offset de datos (4 bits) + flags: <code>02</code> SYN, <code>12</code> SYN-ACK, <code>10</code> ACK, <code>18</code> PSH-ACK</td></tr><tr><td>TCP 48–49</td><td>Ventana</td></tr><tr><td>UDP 38–39</td><td>Longitud (cabecera de 8 bytes en total)</td></tr></tbody></table></div><p class="muted">Los offsets de IP/TCP/UDP valen con cabecera IP de 20 bytes (la más común). Si el primer byte de IP no es <code>45</code>, la cabecera es más larga.</p></section>' +
    '</main></div>';
  function go() { var b = L.parseHex($('#tr-ta').value); $('#tr-out').innerHTML = b.length ? decodeHtml(b) : '<p class="warn">No encontré bytes en hexadecimal.</p>'; }
  function load() { $('#tr-ta').value = presets[$('#tr-sel').value].hex; go(); }
  $('#tr-sel').addEventListener('change', load); $('#tr-go').addEventListener('click', go); load();
};

/* ============ QUIZZES ============ */
function sameSet(a, b) { return a.length === b.length && a.every(function (x) { return b.indexOf(x) >= 0; }); }
function quizCard(q, num, onAnswer) {
  var multi = q.a.length > 1;
  var card = h('div', { class: 'q-card' });
  var opts = q.o.map(function (o, i) { return '<label class="q-opt"><input type="' + (multi ? 'checkbox' : 'radio') + '" name="q' + num + '-' + Math.random().toString(36).slice(2, 6) + '" value="' + i + '"> <span>' + o + '</span></label>'; }).join('');
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
      var inp = $('input', lab); inp.disabled = true;
      if (q.a.indexOf(i) >= 0) lab.classList.add('ok'); else if (sel.indexOf(i) >= 0) lab.classList.add('bad');
    });
    var fb = $('.q-fb', card); fb.hidden = false; fb.className = 'q-fb ' + (ok ? 'ok' : 'bad');
    fb.innerHTML = '<b>' + (ok ? 'Correcto.' : 'No es esa.') + '</b> ' + (q.e || ''); $('.q-chk', card).hidden = true;
    if (onAnswer) onAnswer(ok);
  });
  return card;
}
/* preguntas generadas */
function uniqueOpts(correct, cands, n) {
  var o = [correct];
  shuffle(cands).forEach(function (c) { if (o.length < n && o.indexOf(c) < 0) o.push(c); });
  return o;
}
var GENQ = [
  function () { var p = 20 + rnd(11), hh = 32 - p, ans = Math.pow(2, hh) - 2; var m = L.maskStr(p);
    var o = uniqueOpts(String(ans), [String(Math.pow(2, hh)), String(Math.pow(2, hh + 1) - 2), String(Math.pow(2, hh - 1) - 2), String(Math.pow(2, hh)  - 1)], 4);
    return { t: 'Generada · hosts', q: '¿Cuántos dispositivos puedo conectar como máximo en una red con máscara ' + m + '?', o: o, ans: String(ans), e: 'Máscara ' + m + ' = /' + p + ' → ' + hh + ' bits de host → 2<sup>' + hh + '</sup> − 2 = ' + ans + '.' }; },
  function () { var p = 18 + rnd(11), ip = L.intToIp(rnd(4294967296)); var i = L.info(ip, p);
    var o = uniqueOpts(i.bc, [i.net, L.intToIp(i.netInt - 1), L.intToIp(i.bcInt - 1), L.intToIp(i.bcInt + i.size)], 4);
    return { t: 'Generada · broadcast', q: '¿Cuál es la dirección de broadcast de la red a la que pertenece ' + ip + '/' + p + '?', o: o, ans: i.bc, e: 'Máscara ' + i.mask + ': la red es ' + i.net + '/' + p + ' y su último valor es ' + i.bc + '.' }; },
  function () { var p = 17 + rnd(12), ip = L.intToIp(rnd(4294967296)); var i = L.info(ip, p), pickType = rnd(3);
    var tgt = pickType === 0 ? i.netInt : pickType === 1 ? i.bcInt : i.netInt + 1 + rnd(i.size - 2);
    var s = L.intToIp(tgt), ok = pickType === 2;
    return { t: 'Generada · host válido', q: '¿Es válida la dirección ' + s + '/' + p + ' para asignarla a un host?', o: ['Verdadero', 'Falso'], ans: ok ? 'Verdadero' : 'Falso', fixed: true, e: 'La red de ' + s + '/' + p + ' es ' + i.net + ' – ' + i.bc + '. ' + (pickType === 0 ? 'Es la dirección de red.' : pickType === 1 ? 'Es el broadcast.' : 'Es una dirección del medio: válida.') }; },
  function () { var bp = pick([16, 24]), n = 3 + rnd(13), bits = 0; while (Math.pow(2, bits) < n) bits++;
    var ans = '/' + (bp + bits), c = ['/' + (bp + bits + 1), '/' + (bp + bits - 1), '/' + (bp + n), '/' + (bp + bits + 2)];
    return { t: 'Generada · subneteo', q: 'Hay que crear ' + n + ' subredes a partir de un bloque /' + bp + '. ¿Qué prefijo hay que usar?', o: uniqueOpts(ans, c, 4), ans: ans, e: n + ' subredes → ' + bits + ' bits (2<sup>' + bits + '</sup> = ' + Math.pow(2, bits) + ' ≥ ' + n + ') → /' + bp + ' + ' + bits + ' = ' + ans + '.' }; },
  function () { var p = pick([26, 27, 28, 29]), base = L.info('192.168.' + (1 + rnd(250)) + '.0', 24).netInt, size = Math.pow(2, 32 - p);
    var k = rnd(256 / size), host = base + k * size + 1 + rnd(size - 2), nt = base + k * size, i = L.info(L.intToIp(host), p);
    var o = uniqueOpts(i.first, [i.net, i.last, i.bc, L.intToIp(host - 1)], 4);
    return { t: 'Generada · gateway', q: 'Con el gateway en la primera dirección válida de cada subred /' + p + ', ¿cuál es el gateway del host ' + L.intToIp(host) + '?', o: o, ans: i.first, e: 'El host está en la red ' + i.net + '/' + p + ' → primera dirección válida = ' + i.first + '.' }; }
];
function genQuestion() {
  var g = pick(GENQ)();
  var opts = g.fixed ? g.o : shuffle(g.o);
  return { t: g.t, q: g.q, o: opts, a: [opts.indexOf(g.ans)], e: g.e };
}
RENDER.quizzes = function () {
  var P = $('#quizzes');
  var temas = ['Todas'].concat(DATA.quiz.map(function (q) { return q.t; }).filter(function (v, i, a) { return a.indexOf(v) === i; }));
  var score = { ok: 0, n: 0 }, topic = 'Todas';
  P.innerHTML = '<div class="wrap"><main><section><div><div class="eyebrow">Autoevaluación</div><h2>Preguntas tipo parcial</h2></div><p class="lead">' + DATA.quiz.length + ' preguntas armadas con lo que se repite en los parciales, más un generador de preguntas con números nuevos. Elegí la opción (o las opciones, si la pregunta lo dice) y apretá Corregir.</p>' +
    '<div class="q-head"><div class="filters" id="q-filters">' + temas.map(function (t, i) { return '<button class="chip" data-t="' + t + '" aria-pressed="' + (i === 0) + '">' + t + '</button>'; }).join('') + '</div><div class="q-score" id="q-score">0 de 0</div></div>' +
    '<div class="actions"><button class="btn" id="q-shuf">Mezclar</button><button class="btn" id="q-reset">Reiniciar</button></div><div class="quiz" id="q-list"></div></section>' +
    '<section><div><div class="eyebrow">Sin fin</div><h2>Generador de preguntas</h2></div><p class="lead">Cada una sale con números distintos: hosts por máscara, broadcast, host válido, prefijo para N subredes y gateway.</p><div class="actions"><button class="btn primary" id="gq-new">Pregunta nueva</button><span class="muted" id="gq-sc"></span></div><div id="gq-box" class="quiz"></div></section></main></div>';
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

/* ============ PARCIALES y TPs ============ */
RENDER.parciales = function () {
  var P = $('#parciales');
  P.innerHTML = '<div class="wrap"><main><section><div><div class="eyebrow">Parciales reales</div><h2>Resueltos paso a paso</h2></div><p class="lead">Transcribí los enunciados de las fotos del proyecto. Intentá resolver cada ejercicio en papel y después abrí la resolución. Las tablas de ruteo se calculan con la misma herramienta de la pestaña Ruteo.</p></section>' +
    DATA.parciales.map(function (p) {
      return '<section id="' + p.id + '"><div class="tp-intro"><div class="eyebrow">' + esc(p.nota) + '</div><h2>' + p.nombre + '</h2></div>' + p.ex.map(function (e) {
        return '<article class="concept"><div class="concept-head"><h3>' + e.t + '</h3>' + (e.pts ? '<span class="tag media">' + e.pts + ' pts</span>' : '') + '</div><div class="body"><div class="blk enunciado"><div class="blk-k">Enunciado</div><p>' + e.en + '</p></div><details><summary>Ver resolución</summary><div class="uc-ex">' + e.res + '</div></details></div></article>';
      }).join('') + '</section>';
    }).join('') + '</main></div>';
  fillRT(P);
};
RENDER.tps = function () {
  var P = $('#tps');
  P.innerHTML = '<div class="wrap"><main>' + DATA.tps.map(function (tp) {
    return '<section id="' + tp.id + '"><div class="tp-intro"><div class="eyebrow">Trabajo práctico</div><h2>' + tp.nombre + '</h2>' + (tp.intro ? '<p class="lead">' + tp.intro + '</p>' : '') + '</div>' + tp.items.map(function (it) {
      var tb = '';
      if (it.tabla) tb = '<div class="tbl"><table><thead><tr>' + it.tabla.cols.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr></thead><tbody>' + it.tabla.rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>' + (it.nota ? '<p class="muted">' + it.nota + '</p>' : '');
      return '<details class="tp-ex"><summary><b>' + it.n + '.</b> ' + it.q + '</summary><div class="uc-ex"><div>' + it.a + '</div>' + tb + (it.trama ? '<button class="btn dec" data-hex="' + it.trama + '">Ver decodificada</button>' : '') + '</div></details>';
    }).join('') + '</section>';
  }).join('') + '</main></div>';
  P.addEventListener('click', function (e) {
    var b = e.target.closest('.dec'); if (!b) return;
    var box = b.parentNode.querySelector('.decout');
    if (box) { box.remove(); return; }
    box = h('div', { class: 'decout' }, decodeHtml(L.parseHex(b.dataset.hex))); b.parentNode.appendChild(box);
  });
};

/* ============ SIMULACRO ============ */
function genChain() {
  var A = shuffle([10, 20, 30, 40, 50, 60, 70, 80, 90]).slice(0, 3), x = 100 + rnd(100), y = rnd(50) * 4;
  var l3p = pick([25, 26]);
  var lan1 = '192.168.' + A[0] + '.0', lan2 = '192.168.' + A[1] + '.0', lan3 = '192.168.' + A[2] + '.0';
  var lk1 = '10.' + x + '.' + y + '.0', lk2 = '10.' + x + '.' + y + '.4';
  function inf(ip, p) { return L.info(ip, p); }
  var n1 = inf(lan1, 24), n2 = inf(lan2, 24), n3 = inf(lan3, l3p), k1 = inf(lk1, 30), k2 = inf(lk2, 30);
  var cid = function (i) { return i.net + '/' + i.prefix; };
  var topo = {
    nombre: 'Simulacro', w: 760, h: 290,
    routers: {
      'R1': { x: 110, y: 110, ifs: [{ n: 'Fa0/0', net: cid(n1), ip: n1.first }, { n: 's0/0/0', net: cid(k1), ip: k1.first }] },
      'R2': { x: 380, y: 110, ifs: [{ n: 's0/0/0', net: cid(k1), ip: k1.last }, { n: 's0/0/1', net: cid(k2), ip: k2.first }, { n: 'Fa0/0', net: cid(n2), ip: n2.first }] },
      'R3': { x: 650, y: 110, ifs: [{ n: 's0/0/0', net: cid(k2), ip: k2.last }, { n: 'Fa0/0', net: cid(n3), ip: n3.first }] }
    },
    lans: [{ r: 'R1', dx: 0, dy: 120, net: cid(n1), pc: 'PC1' }, { r: 'R2', dx: 0, dy: 120, net: cid(n2), pc: 'PC2' }, { r: 'R3', dx: 0, dy: 120, net: cid(n3), pc: 'PC3' }],
    nets: [cid(n1), cid(k1), cid(n2), cid(k2), cid(n3)]
  };
  return topo;
}
RENDER.simulacro = function () {
  var P = $('#simulacro');
  P.innerHTML = '<div class="wrap"><main><section><div><div class="eyebrow">Simulacro</div><h2>Un parcial completo con números nuevos</h2></div><p class="lead">Mismo formato que los parciales reales: subneteo, ruteo, host válido, multiple choice y desarrollo. Hacelo en papel o acá, sin mirar la teoría, y corregí. Cada vez que apretás el botón sale uno distinto.</p><div class="actions"><button class="btn primary" id="sim-new">Nuevo simulacro</button><span class="q-score" id="sim-total"></span></div></section><div id="sim-box"></div></main></div>';
  function build() {
    var box = $('#sim-box'); box.innerHTML = '';
    var pts = { e1: [0, 3], e2: [0, 3], e3: [0, 1], e4: [0, 3] };
    function total() { var g = 0, t = 0; for (var k in pts) { g += pts[k][0]; t += pts[k][1]; } $('#sim-total').textContent = 'Puntaje de lo corregido: ' + (Math.round(g * 10) / 10) + ' sobre ' + t + ' (el desarrollo se autoevalúa)'; }
    var s1 = h('section'); s1.innerHTML = '<div><div class="eyebrow">Ejercicio 1 · 3 pts</div><h3>Subneteo</h3></div>'; box.appendChild(s1);
    mkSubnetEx(s1, genSubnetEx(), function (ok, tot) { pts.e1[0] = 3 * ok / tot; total(); });
    var topo = genChain();
    var s2 = h('section'); s2.innerHTML = '<div><div class="eyebrow">Ejercicio 2 · 3 pts</div><h3>Tablas de ruteo</h3></div><p>Dada la topología, con la <b>primera</b> dirección de host de cada red LAN en el router que la tiene, y en cada enlace serie el router de la <b>izquierda con la primera</b> dirección y el de la <b>derecha con la última</b>, completá las tablas de R1 y de R3.</p><div class="topo-box">' + drawTopo(topo).replace(/<text class="t-ip"[^>]*>[^<]*<\/text>/g, '') + '</div><p class="muted">En el dibujo no figuran las IP de las interfaces: calculalas con las reglas del enunciado.</p>';
    box.appendChild(s2);
    var r1 = 0, r3 = 0, t1 = 1, t3 = 1;
    function upd2() { pts.e2[0] = 3 * (r1 + r3) / (t1 + t3); total(); }
    s2.appendChild(h('h4', null, 'Router R1'));
    s2.appendChild(practiceTable(topo, 'R1', shuffle(topo.nets), function (ok, tot) { r1 = ok; t1 = tot; upd2(); }));
    s2.appendChild(h('h4', null, 'Router R3'));
    s2.appendChild(practiceTable(topo, 'R3', shuffle(topo.nets), function (ok, tot) { r3 = ok; t3 = tot; upd2(); }));
    // Ej 3
    var p3 = pick([18, 19, 20, 21, 22]), ip3 = '172.' + (16 + rnd(16)) + '.' + rnd(256) + '.' + rnd(256);
    var i3 = L.info(ip3, p3);
    var s3 = h('section');
    s3.innerHTML = '<div><div class="eyebrow">Ejercicio 3 · 1 pt</div><h3>Broadcast</h3></div><p>Indicá la dirección de broadcast de la red a la que pertenece <code>' + ip3 + '/' + p3 + '</code>: <input class="in" id="sim-bc" type="text" placeholder="x.x.x.x"></p><div class="actions"><button class="btn primary" id="sim-bcchk">Corregir</button><span class="score"></span></div>';
    box.appendChild(s3);
    $('#sim-bcchk', s3).addEventListener('click', function () {
      var ok = $('#sim-bc').value.trim() === i3.bc; $('#sim-bc').classList.toggle('ok', ok); $('#sim-bc').classList.toggle('bad', !ok);
      $('.score', s3).innerHTML = ok ? 'Bien.' : 'Era <code>' + i3.bc + '</code> (red ' + i3.net + '/' + p3 + ').'; pts.e3[0] = ok ? 1 : 0; total();
    });
    // Ej 4
    var s4 = h('section'); s4.innerHTML = '<div><div class="eyebrow">Ejercicio 4 · 3 pts</div><h3>Multiple choice</h3></div>'; box.appendChild(s4);
    var qs = shuffle(DATA.quiz.filter(function (q) { return q.t !== 'Subneteo' || Math.random() < 0.3; })).slice(0, 6), okc = 0, nc = 0;
    var qb = h('div', { class: 'quiz' }); s4.appendChild(qb);
    qs.forEach(function (q, i) { qb.appendChild(quizCard(q, i + 1, function (ok) { nc++; if (ok) okc++; pts.e4[0] = 3 * okc / qs.length; total(); })); });
    // Ej 5
    var s5 = h('section'); s5.innerHTML = '<div><div class="eyebrow">Ejercicio 5 · desarrollo</div><h3>Explique la diferencia entre TCP y UDP</h3></div><p>Escribilo en 6 renglones y después comparalo con esta lista: ¿mencionaste cada punto?</p><ul class="checklist"><li>TCP orientado a conexión (handshake); UDP no orientado a conexión</li><li>TCP confiable: números de secuencia, ACK, retransmisión, orden</li><li>TCP controla flujo (ventana) y congestión; UDP no</li><li>TCP flujo de bytes; UDP datagramas</li><li>Cabecera: TCP mínimo 20 bytes; UDP 8 bytes (puertos, longitud, checksum)</li><li>Usos: TCP web, correo, SSH; UDP DNS, voz, video</li></ul>';
    box.appendChild(s5);
    total();
  }
  $('#sim-new').addEventListener('click', build); build();
};

/* ============ INICIO ============ */
document.addEventListener('DOMContentLoaded', function () {
  countdown();
  initTabs();
  fillRT(document);
});
})();
