/* lib.js — algoritmos de la guía de Arquitectura. Puro, sin DOM: lo usan app.js y los tests de Node. */
var AR = (function () {
'use strict';

/* ============ MESI ============ */
/* Una sola línea de caché y n procesadores. st[i] ∈ M, E, S, I. memOk = la memoria principal tiene el dato vigente. */
function mesiNew(n) { var st = []; for (var i = 0; i < n; i++) st.push('I'); return { st: st, memOk: true, n: n }; }
function mesiClone(m) { return { st: m.st.slice(), memOk: m.memOk, n: m.n }; }
var NAME = { M: 'Modificado', E: 'Exclusivo', S: 'Compartido', I: 'Inválido' };
function mesiStep(m0, op, i) {
  var m = mesiClone(m0), log = [], P = function (k) { return 'P' + (k + 1); }, st = m.st, n = m.n, j;
  var others = []; for (j = 0; j < n; j++) if (j !== i && st[j] !== 'I') others.push(j);
  var mod = -1; for (j = 0; j < n; j++) if (j !== i && st[j] === 'M') mod = j;
  var bus = false;
  if (op === 'R') {
    if (st[i] !== 'I') {
      log.push('Acierto de lectura en ' + P(i) + ': lee su copia y el estado no cambia (' + st[i] + ').');
    } else {
      bus = true;
      log.push('Falla de lectura en ' + P(i) + ': pide la línea por el bus y los demás la vigilan (snoop).');
      if (mod >= 0) {
        log.push(P(mod) + ' tiene la copia modificada: bloquea la lectura de memoria, entrega la línea y la memoria se actualiza. ' + P(mod) + ' pasa de M a S.');
        st[mod] = 'S'; m.memOk = true; st[i] = 'S';
        log.push(P(i) + ' pasa de I a S.');
      } else if (others.length) {
        others.forEach(function (k) { if (st[k] === 'E') log.push(P(k) + ' tenía la línea exclusiva: avisa que la comparte y pasa de E a S.'); else log.push(P(k) + ' ya la tenía compartida: avisa que la comparte y sigue en S.'); st[k] = 'S'; });
        st[i] = 'S'; log.push(P(i) + ' lee la línea de memoria principal y pasa de I a S.');
      } else {
        st[i] = 'E'; log.push('Nadie más la tiene: ' + P(i) + ' lee de memoria principal y pasa de I a E.');
      }
    }
  } else {
    if (st[i] === 'M') {
      log.push('Acierto de escritura en ' + P(i) + ' con la línea en M: escribe en su caché y el estado sigue en M.');
    } else if (st[i] === 'E') {
      st[i] = 'M'; m.memOk = false;
      log.push('Acierto de escritura con la línea en E: ' + P(i) + ' ya es el único dueño, escribe sin usar el bus y pasa de E a M.');
    } else if (st[i] === 'S') {
      bus = true;
      log.push('Acierto de escritura con la línea en S: antes de escribir, ' + P(i) + ' debe tener exclusividad y avisa por el bus.');
      others.forEach(function (k) { st[k] = 'I'; log.push(P(k) + ' invalida su copia (S pasa a I).'); });
      st[i] = 'M'; m.memOk = false;
      log.push(P(i) + ' escribe y pasa de S a M.');
    } else {
      bus = true;
      log.push('Falla de escritura en ' + P(i) + ': emite lectura con intención de modificar (RWITM).');
      if (mod >= 0) {
        log.push(P(mod) + ' tiene la copia modificada: la escribe en memoria principal y pasa de M a I. ' + P(i) + ' vuelve a emitir RWITM y lee la línea de memoria.');
        st[mod] = 'I'; m.memOk = true;
      }
      others.forEach(function (k) { if (k !== mod) { log.push(P(k) + ' invalida su copia (' + st[k] + ' pasa a I).'); st[k] = 'I'; } });
      st[i] = 'M'; m.memOk = false;
      log.push(P(i) + ' modifica la línea y la marca M (I pasa a M).');
    }
  }
  return { m: m, log: log, bus: bus };
}
function mesiRun(n, ops) { var m = mesiNew(n), out = []; ops.forEach(function (o) { var r = mesiStep(m, o.op, o.p); m = r.m; out.push(r); }); return { m: m, steps: out }; }

/* ============ Reemplazo de caché (completamente asociativa) ============ */
/* LFU: cuenta referencias mientras el bloque está en caché; ante empate se saca el que entró primero. */
function replace(seq, cap, pol) {
  var cache = [], steps = [], hits = 0;
  seq.forEach(function (b, t) {
    var ix = -1; cache.forEach(function (e, k) { if (e.b === b) ix = k; });
    var hit = ix >= 0, ev = null;
    if (hit) { hits++; cache[ix].last = t; cache[ix].cnt++; }
    else {
      if (cache.length >= cap) {
        var v = 0;
        for (var k = 1; k < cache.length; k++) {
          if (pol === 'LRU' ? cache[k].last < cache[v].last : pol === 'LFU' ? (cache[k].cnt < cache[v].cnt || (cache[k].cnt === cache[v].cnt && cache[k].in < cache[v].in)) : cache[k].in < cache[v].in) v = k;
        }
        ev = cache[v].b; cache.splice(v, 1);
      }
      cache.push({ b: b, in: t, last: t, cnt: 1 });
    }
    steps.push({ b: b, hit: hit, ev: ev, cache: cache.map(function (e) { return e.b; }) });
  });
  return { steps: steps, hits: hits, misses: seq.length - hits };
}

/* ============ Performance ============ */
function tiempo(ic, cpi, fHz) { return ic * cpi / fHz; }              /* T = Ic × CPI × τ, con τ = 1/f */
function mips(fHz, cpi) { return fHz / (cpi * 1e6); }                  /* MIPS = f / (CPI × 10^6) */
function tiempoRef(ic, p, m, k, fHz) { return ic * (p + m * k) / fHz; } /* T = Ic × [p + (m × k)] × τ */
function fmtT(s) {
  if (s >= 1) return +s.toPrecision(4) + ' s';
  if (s >= 1e-3) return +(s * 1e3).toPrecision(4) + ' ms';
  if (s >= 1e-6) return +(s * 1e6).toPrecision(4) + ' µs';
  return +(s * 1e9).toPrecision(4) + ' ns';
}

/* ============ Buses ============ */
function capacidad(n) { return Math.pow(2, n); }
function accesos(instrBits, datosBits) { return Math.ceil(instrBits / datosBits); }
function fmtMem(pos) { return pos.toLocaleString('es-AR') + ' posiciones'; }

/* ============ GPU ============ */
function ciclosGPU(px, sm, cores) { return Math.ceil(px / (sm * cores)); }

/* ============ Máquina de la filmina (ciclo de instrucción) ============ */
/* Instrucción de 16 bits: 4 bits de CODOP + 12 de dirección. 1 = cargar AC, 2 = almacenar AC, 5 = sumar a AC. */
var OPS = { 1: 'Cargar AC desde memoria', 2: 'Almacenar AC en memoria', 5: 'Sumar a AC un dato de memoria' };
function hex(x, d) { var s = (x & 0xFFFF).toString(16).toUpperCase(); while (s.length < d) s = '0' + s; return s; }
function runProgram(mem0, pc0, nInstr) {
  var mem = {}, k; for (k in mem0) mem[k] = mem0[k];
  var r = { PC: pc0, IR: 0, MAR: 0, MBR: 0, AC: 0 }, steps = [];
  function snap(txt, ph, chg) { steps.push({ txt: txt, ph: ph, regs: { PC: r.PC, IR: r.IR, MAR: r.MAR, MBR: r.MBR, AC: r.AC }, chg: chg || [], mem: JSON.parse(JSON.stringify(mem)) }); }
  snap('Estado inicial. El PC apunta a la primera instrucción.', 'inicio');
  for (var n = 0; n < nInstr; n++) {
    r.MAR = r.PC; snap('Ciclo de extracción T1: MAR ← PC. La dirección de la próxima instrucción va al MAR (y de ahí al bus de direcciones).', 'extracción', ['MAR']);
    r.MBR = mem[r.MAR] || 0; r.PC = r.PC + 1; snap('T2: MBR ← Memoria[MAR] y PC ← PC + 1. La memoria devuelve la instrucción por el bus de datos y el PC ya apunta a la que sigue.', 'extracción', ['MBR', 'PC']);
    r.IR = r.MBR; snap('T3: IR ← MBR. La instrucción queda en el registro de instrucción.', 'extracción', ['IR']);
    var op = (r.IR >> 12) & 0xF, ad = r.IR & 0xFFF;
    snap('Decodificación: CODOP = ' + hex(op, 1) + ' → ' + (OPS[op] || 'operación desconocida') + '; dirección = ' + hex(ad, 3) + '.', 'decodificación');
    r.MAR = ad;
    if (op === 1) {
      snap('Ejecución T1: MAR ← IR[dirección] = ' + hex(ad, 3) + '.', 'ejecución', ['MAR']);
      r.MBR = mem[ad] || 0; snap('T2: MBR ← Memoria[' + hex(ad, 3) + '] = ' + hex(r.MBR, 4) + '.', 'ejecución', ['MBR']);
      r.AC = r.MBR; snap('T3: AC ← MBR. El acumulador ahora vale ' + hex(r.AC, 4) + '.', 'ejecución', ['AC']);
    } else if (op === 5) {
      snap('Ejecución T1: MAR ← IR[dirección] = ' + hex(ad, 3) + '.', 'ejecución', ['MAR']);
      r.MBR = mem[ad] || 0; snap('T2: MBR ← Memoria[' + hex(ad, 3) + '] = ' + hex(r.MBR, 4) + '.', 'ejecución', ['MBR']);
      var old = r.AC; r.AC = (r.AC + r.MBR) & 0xFFFF; snap('T3: AC ← AC + MBR = ' + hex(old, 4) + ' + ' + hex(r.MBR, 4) + ' = ' + hex(r.AC, 4) + ' (la ALU hace la suma).', 'ejecución', ['AC']);
    } else if (op === 2) {
      snap('Ejecución T1: MAR ← IR[dirección] = ' + hex(ad, 3) + '.', 'ejecución', ['MAR']);
      r.MBR = r.AC; snap('T2: MBR ← AC = ' + hex(r.AC, 4) + '.', 'ejecución', ['MBR']);
      mem[ad] = r.MBR; snap('T3: Memoria[' + hex(ad, 3) + '] ← MBR. El dato queda guardado en memoria.', 'ejecución', ['MEM']);
    }
  }
  return { steps: steps, regs: r, mem: mem };
}

return { mesiNew: mesiNew, mesiStep: mesiStep, mesiRun: mesiRun, NAME: NAME, replace: replace, tiempo: tiempo, mips: mips, tiempoRef: tiempoRef, fmtT: fmtT,
  capacidad: capacidad, accesos: accesos, fmtMem: fmtMem, ciclosGPU: ciclosGPU, runProgram: runProgram, hex: hex, OPS: OPS };
})();
if (typeof module !== 'undefined') module.exports = AR;
