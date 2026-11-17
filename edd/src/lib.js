/* lib.js — algoritmos de la guía de EDD. Puro, sin DOM: lo usan app.js y los tests de Node. */
var ED = (function () {
'use strict';

/* ============ ABB / AVL ============ */
/* Convenciones de la cátedra: FE = H(der) − H(izq); altura de nodo vacío = 0 y de hoja = 1 (como en el código Go de AVL).
   La "altura del árbol" de la teoría de árboles cuenta aristas: altura = h − 1. Al eliminar con dos hijos se usa el mínimo del subárbol derecho. */
function N(v) { return { v: v, l: null, r: null, h: 1 }; }
function ht(n) { return n ? n.h : 0; }
function upd(n) { n.h = 1 + Math.max(ht(n.l), ht(n.r)); }
function fe(n) { return n ? ht(n.r) - ht(n.l) : 0; }
function rotL(z) { var y = z.r; z.r = y.l; y.l = z; upd(z); upd(y); return y; }
function rotR(z) { var y = z.l; z.l = y.r; y.r = z; upd(z); upd(y); return y; }
function rebalance(n, log) {
  var b = fe(n);
  if (b > 1) {
    if (fe(n.r) < 0) {
      log.push({ rot: 'Doble a izquierda', caso: 'Derecha-Izquierda', nodo: n.v, fe: b, det: 'rotación simple a derecha sobre ' + n.r.v + ' y después simple a izquierda sobre ' + n.v });
      n.r = rotR(n.r);
    } else {
      log.push({ rot: 'Simple a izquierda', caso: 'Derecha-Derecha', nodo: n.v, fe: b, det: 'rotación simple a izquierda sobre ' + n.v });
    }
    return rotL(n);
  }
  if (b < -1) {
    if (fe(n.l) > 0) {
      log.push({ rot: 'Doble a derecha', caso: 'Izquierda-Derecha', nodo: n.v, fe: b, det: 'rotación simple a izquierda sobre ' + n.l.v + ' y después simple a derecha sobre ' + n.v });
      n.l = rotL(n.l);
    } else {
      log.push({ rot: 'Simple a derecha', caso: 'Izquierda-Izquierda', nodo: n.v, fe: b, det: 'rotación simple a derecha sobre ' + n.v });
    }
    return rotR(n);
  }
  return n;
}
function insert(n, v, bal, log) {
  if (!n) return N(v);
  if (v < n.v) n.l = insert(n.l, v, bal, log);
  else if (v > n.v) n.r = insert(n.r, v, bal, log);
  else return n;
  upd(n);
  return bal ? rebalance(n, log) : n;
}
function minNode(n) { while (n.l) n = n.l; return n; }
function remove(n, v, bal, log) {
  if (!n) return null;
  if (v < n.v) n.l = remove(n.l, v, bal, log);
  else if (v > n.v) n.r = remove(n.r, v, bal, log);
  else {
    if (!n.l) return n.r;
    if (!n.r) return n.l;
    var s = minNode(n.r);
    n.v = s.v;
    n.r = remove(n.r, s.v, bal, log);
  }
  upd(n);
  return bal ? rebalance(n, log) : n;
}
function build(seq, bal) { var root = null, steps = []; seq.forEach(function (v) { var log = []; root = insert(root, v, bal, log); steps.push({ op: 'ins', v: v, log: log, snap: clone(root) }); }); return { root: root, steps: steps }; }
function clone(n) { return n ? { v: n.v, h: n.h, l: clone(n.l), r: clone(n.r) } : null; }
function pre(n, o) { o = o || []; if (n) { o.push(n.v); pre(n.l, o); pre(n.r, o); } return o; }
function ino(n, o) { o = o || []; if (n) { ino(n.l, o); o.push(n.v); ino(n.r, o); } return o; }
function post(n, o) { o = o || []; if (n) { post(n.l, o); post(n.r, o); o.push(n.v); } return o; }
function count(n) { return n ? 1 + count(n.l) + count(n.r) : 0; }
function leaves(n) { return !n ? 0 : (!n.l && !n.r ? 1 : leaves(n.l) + leaves(n.r)); }
function height(n) { return ht(n); }
/* ¿cumple la propiedad AVL (balance en todos los nodos)? Devuelve la lista de nodos desbalanceados */
function recompute(n) { if (!n) return 0; n.h = 1 + Math.max(recompute(n.l), recompute(n.r)); return n.h; }
function unbalanced(n, o) { o = o || []; if (n) { unbalanced(n.l, o); unbalanced(n.r, o); if (Math.abs(fe(n)) > 1) o.push({ v: n.v, fe: fe(n) }); } return o; }
function isBST(n, lo, hi) { if (!n) return true; if ((lo !== undefined && n.v <= lo) || (hi !== undefined && n.v >= hi)) return false; return isBST(n.l, lo, n.v) && isBST(n.r, n.v, hi); }
function depthOf(n, v, d) { d = d || 0; if (!n) return -1; if (v === n.v) return d; return depthOf(v < n.v ? n.l : n.r, v, d + 1); }
/* árbol a texto horizontal (derecha arriba) */
function ascii(n) {
  var out = [];
  (function rec(x, d) { if (!x) return; rec(x.r, d + 1); out.push(new Array(d + 1).join('    ') + x.v); rec(x.l, d + 1); })(n, 0);
  return out.join('\n');
}
/* notación compacta: valor(izq,der) con - para vacío */
function paren(n) { if (!n) return '-'; if (!n.l && !n.r) return String(n.v); return n.v + '(' + paren(n.l) + ',' + paren(n.r) + ')'; }
/* construir un árbol (sin balancear) desde preorden y inorden no hace falta; sí desde la forma pedida a mano */
function fromPairs(spec) { /* spec: {v:..,l:..,r:..} */ var t = spec ? { v: spec.v, l: fromPairs(spec.l), r: fromPairs(spec.r), h: 1 } : null; if (t) upd(t); return t; }

/* ============ HASH ============ */
function nextPrime(x) { function p(n) { if (n < 2) return false; for (var i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; } while (!p(x)) x++; return x; }
function h2of(k, m) { return 1 + (k % (m - 1)); }
/* modos: enc (encadenamiento), lin, cuad, dob */
function hashInsert(m, keys, mode) {
  var tab = new Array(m), chains = [], steps = [], i;
  for (i = 0; i < m; i++) { tab[i] = null; chains.push([]); }
  keys.forEach(function (k) {
    var h = ((k % m) + m) % m, st = { k: k, h: h, probes: [], pos: null, nota: '' };
    if (mode === 'enc') {
      st.pos = h; st.nota = chains[h].length ? 'colisión: se agrega al final de la lista de la posición ' + h : 'posición libre'; chains[h].push(k);
    } else {
      var d2 = h2of(k, m), placed = false;
      for (i = 0; i < m; i++) {
        var idx = mode === 'lin' ? (h + i) % m : mode === 'cuad' ? (h + i * i) % m : (h + i * d2) % m;
        st.probes.push(idx);
        if (tab[idx] === null) { tab[idx] = k; st.pos = idx; placed = true; break; }
        if (mode === 'cuad' && i > m) break;
      }
      st.nota = placed ? (st.probes.length > 1 ? 'colisiones: ' + (st.probes.length - 1) + ' · queda en ' + st.pos : 'posición libre') : 'no se encontró lugar libre con esta secuencia de sondeo';
      if (mode === 'dob') st.h2 = d2;
    }
    steps.push(st);
  });
  var n = keys.length;
  return { m: m, steps: steps, tab: tab, chains: chains, alpha: n / m };
}

/* ============ GRAFOS ============ */
/* texto: una arista por línea "A B" o "A B 4"; dirigido => A→B. Los vértices sueltos se declaran con "A". */
function parseGraph(text, directed) {
  var verts = [], adj = {}, edges = [];
  function addV(v) { if (!(v in adj)) { adj[v] = []; verts.push(v); } }
  text.split(/\n|;/).forEach(function (line) {
    var p = line.trim().split(/[\s,>-]+/).filter(Boolean);
    if (!p.length) return;
    addV(p[0]);
    if (p.length >= 2) {
      addV(p[1]);
      var w = p[2] !== undefined && !isNaN(+p[2]) ? +p[2] : 1;
      edges.push({ a: p[0], b: p[1], w: w });
      adj[p[0]].push({ to: p[1], w: w });
      if (!directed) adj[p[1]].push({ to: p[0], w: w });
    }
  });
  function cmp(a, b) { var x = isNaN(+a) ? a : +a, y = isNaN(+b) ? b : +b; return x < y ? -1 : x > y ? 1 : 0; }
  verts.sort(cmp);
  verts.forEach(function (v) { adj[v].sort(function (p, q) { return cmp(p.to, q.to); }); });
  return { verts: verts, adj: adj, edges: edges, directed: !!directed };
}
function bfs(g, s) {
  var seen = {}, q = [s], order = [], steps = []; seen[s] = true;
  while (q.length) {
    var u = q.shift(); order.push(u);
    var added = [];
    g.adj[u].forEach(function (e) { if (!seen[e.to]) { seen[e.to] = true; q.push(e.to); added.push(e.to); } });
    steps.push({ u: u, added: added, queue: q.slice() });
  }
  return { order: order, steps: steps };
}
function dfs(g, s) {
  var seen = {}, order = [], steps = [];
  (function rec(u, d) { seen[u] = true; order.push(u); steps.push({ u: u, d: d }); g.adj[u].forEach(function (e) { if (!seen[e.to]) rec(e.to, d + 1); }); })(s, 0);
  return { order: order, steps: steps };
}
function reach(g, s) { return dfs(g, s).order; }
function dijkstra(g, s) {
  var dist = {}, prev = {}, done = {}, order = [], steps = [];
  g.verts.forEach(function (v) { dist[v] = Infinity; });
  dist[s] = 0;
  for (;;) {
    var u = null;
    g.verts.forEach(function (v) { if (!done[v] && dist[v] < Infinity && (u === null || dist[v] < dist[u])) u = v; });
    if (u === null) break;
    done[u] = true; order.push(u);
    var upds = [];
    g.adj[u].forEach(function (e) { if (!done[e.to] && dist[u] + e.w < dist[e.to]) { dist[e.to] = dist[u] + e.w; prev[e.to] = u; upds.push(e.to + '=' + dist[e.to]); } });
    var snap = {}; g.verts.forEach(function (v) { snap[v] = dist[v]; });
    steps.push({ u: u, upds: upds, dist: snap, done: Object.keys(done) });
  }
  return { dist: dist, prev: prev, order: order, steps: steps };
}
function pathTo(prev, s, t) { var p = [t]; while (p[0] !== s) { if (!(p[0] in prev)) return null; p.unshift(prev[p[0]]); } return p; }
function weaklyConnected(g) {
  var und = { verts: g.verts, adj: {} };
  g.verts.forEach(function (v) { und.adj[v] = []; });
  g.edges.forEach(function (e) { und.adj[e.a].push({ to: e.b }); und.adj[e.b].push({ to: e.a }); });
  return g.verts.length === 0 || reach(und, g.verts[0]).length === g.verts.length;
}
function stronglyConnected(g) {
  return g.verts.every(function (v) { return reach(g, v).length === g.verts.length; });
}
/* ciclo: devuelve uno (lista de vértices con el primero repetido al final) o null */
function findCycle(g) {
  var color = {}, stack = [], res = null;
  function rec(u, parent) {
    if (res) return;
    color[u] = 1; stack.push(u);
    for (var i = 0; i < g.adj[u].length && !res; i++) {
      var v = g.adj[u][i].to;
      if (!g.directed && v === parent) { parent = null; continue; }
      if (color[v] === 1) { res = stack.slice(stack.indexOf(v)).concat([v]); }
      else if (!color[v]) rec(v, u);
    }
    stack.pop(); color[u] = 2;
  }
  g.verts.forEach(function (v) { if (!color[v] && !res) rec(v, null); });
  return res;
}
function hamiltonianPath(g) {
  var n = g.verts.length, used = {}, path = [], found = null;
  function rec(u) {
    if (found) return;
    path.push(u); used[u] = true;
    if (path.length === n) { found = path.slice(); }
    else g.adj[u].forEach(function (e) { if (!used[e.to]) rec(e.to); });
    path.pop(); used[u] = false;
  }
  g.verts.forEach(function (v) { if (!found) rec(v); });
  return found;
}
function degrees(g) {
  var out = {}, inn = {};
  g.verts.forEach(function (v) { out[v] = 0; inn[v] = 0; });
  g.edges.forEach(function (e) { out[e.a]++; inn[e.b]++; if (!g.directed) { out[e.b]++; inn[e.a]++; } });
  return { out: out, inn: inn };
}

/* ============ COMPLEJIDAD: bucles que se pueden ejecutar ============ */
var LOOPS = [
  { id: 'lin', code: 'for i := 0; i < n; i++ {\n    fmt.Println(i)\n}',
    run: function (n, f) { for (var i = 0; i < n; i++) f(); }, T: 'n', O: 'O(n)', why: 'Un solo ciclo que avanza de a 1: el cuerpo se ejecuta n veces.' },
  { id: 'doble', code: 'for i := 0; i < n; i++ {\n    for j := 0; j < n; j++ {\n        fmt.Println(i, j)\n    }\n}',
    run: function (n, f) { for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) f(); }, T: 'n · n = n²', O: 'O(n²)', why: 'Ciclos anidados: se multiplican. n veces el ciclo interno, que hace n.' },
  { id: 'tri', code: 'for i := 0; i < n; i++ {\n    for j := i; j < n; j++ {\n        fmt.Println(i, j)\n    }\n}',
    run: function (n, f) { for (var i = 0; i < n; i++) for (var j = i; j < n; j++) f(); }, T: 'n + (n−1) + … + 1 = n(n+1)/2', O: 'O(n²)', why: 'El interno arranca en i: hace n, n−1, …, 1 iteraciones. La suma es n(n+1)/2 = n²/2 + n/2: se descartan la constante 1/2 y el término menor.' },
  { id: 'tri2', code: 'for i := 1; i <= n; i++ {\n    for j := 1; j <= i; j++ {\n        fmt.Println(i, j)\n    }\n}',
    run: function (n, f) { for (var i = 1; i <= n; i++) for (var j = 1; j <= i; j++) f(); }, T: '1 + 2 + … + n = n(n+1)/2', O: 'O(n²)', why: 'El interno hace i iteraciones para cada i: 1 + 2 + … + n = n(n+1)/2.' },
  { id: 'log', code: 'for i := 1; i < n; i *= 2 {\n    fmt.Println(i)\n}',
    run: function (n, f) { for (var i = 1; i < n; i *= 2) f(); }, T: '⌈log₂ n⌉', O: 'O(log n)', why: 'La variable de control se multiplica por 2: llega a n en log₂ n pasos.' },
  { id: 'logdiv', code: 'i := n\nfor i > 1 {\n    i = i / 2\n    fmt.Println(i)\n}',
    run: function (n, f) { var i = n; while (i > 1) { i = Math.floor(i / 2); f(); } }, T: '⌊log₂ n⌋', O: 'O(log n)', why: 'La variable se divide por 2 en cada vuelta: log₂ n vueltas.' },
  { id: 'nlogn', code: 'for i := 0; i < n; i++ {\n    for j := 1; j < n; j *= 2 {\n        fmt.Println(i, j)\n    }\n}',
    run: function (n, f) { for (var i = 0; i < n; i++) for (var j = 1; j < n; j *= 2) f(); }, T: 'n · ⌈log₂ n⌉', O: 'O(n log n)', why: 'Externo lineal (n) por interno logarítmico (log n): se multiplican.' },
  { id: 'modelo', code: 'for i := 1; i < n; i++ {\n    j := n\n    for j > 0 {\n        fmt.Println(i, j)\n        j = j / 2\n    }\n}',
    run: function (n, f) { for (var i = 1; i < n; i++) { var j = n; while (j > 0) { f(); j = Math.floor(j / 2); } } }, T: '(n − 1) · (⌊log₂ n⌋ + 1)', O: 'O(n log n)', why: 'El interno divide j por 2 hasta llegar a 0: ⌊log₂ n⌋ + 1 vueltas. Se repite n − 1 veces.' },
  { id: 'sept', code: 'para i ← 1 hasta n hacer\n    j ← 1\n    mientras j < n hacer\n        j ← j * 2',
    run: function (n, f) { for (var i = 1; i <= n; i++) { var j = 1; while (j < n) { f(); j *= 2; } } }, T: 'n · ⌈log₂ n⌉', O: 'O(n log n)', why: 'Externo n veces; el interno duplica j hasta llegar a n: log₂ n vueltas.' },
  { id: 'sec', code: 'for i := 0; i < n; i++ {\n    fmt.Println(i)\n}\nfor j := 0; j < n; j++ {\n    fmt.Println(j)\n}',
    run: function (n, f) { var i; for (i = 0; i < n; i++) f(); for (i = 0; i < n; i++) f(); }, T: 'n + n = 2n', O: 'O(n)', why: 'Ciclos en secuencia: se suman, no se multiplican. 2n es de orden n.' },
  { id: 'paso2', code: 'for i := 0; i < n; i += 2 {\n    fmt.Println(i)\n}',
    run: function (n, f) { for (var i = 0; i < n; i += 2) f(); }, T: '⌈n/2⌉', O: 'O(n)', why: 'Sumar una constante a la variable de control sigue siendo lineal: n/2 es de orden n.' },
  { id: 'cte', code: 'for i := 0; i < n; i++ {\n    for j := 0; j < 5; j++ {\n        fmt.Println(i, j)\n    }\n}',
    run: function (n, f) { for (var i = 0; i < n; i++) for (var j = 0; j < 5; j++) f(); }, T: '5n', O: 'O(n)', why: 'El ciclo interno no depende de n (siempre 5 vueltas): es una constante que se descarta.' },
  { id: 'cubo', code: 'for i := 0; i < n; i++ {\n    for j := 0; j < n; j++ {\n        for k := 0; k < n; k++ {\n            fmt.Println(i, j, k)\n        }\n    }\n}',
    run: function (n, f) { for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) for (var k = 0; k < n; k++) f(); }, T: 'n³', O: 'O(n³)', why: 'Tres ciclos anidados de n: n · n · n.' },
  { id: 'uno', code: 'x := arr[0]\ny := arr[1]\nz := x + y\nfmt.Println(z)',
    run: function (n, f) { f(); }, T: '1 (constante)', O: 'O(1)', why: 'Cantidad fija de pasos, no depende de n.' }
];
function loopCount(l, n) { var c = 0; l.run(n, function () { c++; }); return c; }
var BIGO = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(n³)', 'O(2ⁿ)'];

return { N: N, insert: insert, remove: remove, build: build, clone: clone, pre: pre, ino: ino, post: post, count: count, leaves: leaves, height: height, fe: fe, recompute: recompute,
  unbalanced: unbalanced, isBST: isBST, depthOf: depthOf, ascii: ascii, paren: paren, fromPairs: fromPairs, rebalance: rebalance,
  nextPrime: nextPrime, h2of: h2of, hashInsert: hashInsert,
  parseGraph: parseGraph, bfs: bfs, dfs: dfs, dijkstra: dijkstra, pathTo: pathTo, weaklyConnected: weaklyConnected, stronglyConnected: stronglyConnected, findCycle: findCycle, hamiltonianPath: hamiltonianPath, degrees: degrees, reach: reach,
  LOOPS: LOOPS, loopCount: loopCount, BIGO: BIGO };
})();
if (typeof module !== 'undefined') module.exports = ED;
