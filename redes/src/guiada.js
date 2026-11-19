/* ============ PRÁCTICA GUIADA ============ */
/* Cada ejercicio se resuelve de a un paso: el paso se corrige al instante, hay pista y, si no sale, se muestra la respuesta con la explicación. */

function gNorm(s) { return String(s).trim().toLowerCase().replace(/\s+/g, ' '); }
function gOk(st, val) {
  var v = gNorm(val);
  if (st.kind === 'choice') return v === String(st.ans);
  var acc = [].concat(st.ans).map(gNorm);
  if (st.type === 'ip') v = v.replace(/\/\d+$/, '');
  else if (st.type === 'num') { v = v.replace(/^\//, '').replace(/[\s.,]/g, ''); }
  else if (st.type === 'gw') { v = normGw(v); acc = acc.map(normGw); }
  return acc.indexOf(v) >= 0;
}
function gShow(st) {
  if (st.kind === 'choice') return st.opts[st.ans];
  return '<code>' + esc([].concat(st.ans)[0]) + '</code>';
}

function runGuided(box, ex, onFinish) {
  var n = ex.steps.length, i = 0, clean = 0, uid = 'g' + Date.now();
  box.innerHTML = '';
  box.appendChild(h('div', { class: 'gen-enun' }, ex.enun));
  var list = h('div', { class: 'gsteps' });
  box.appendChild(list);
  function done(card, st, ok, helped) {
    card.className = 'gstep done ' + (ok ? 'ok' : 'help');
    card.innerHTML = '<div class="gn">Paso ' + (i + 1) + ' de ' + n + (ok ? ' · bien' : ' · con ayuda') + '</div><div class="gq">' + st.q + '</div>' +
      '<div class="gans">' + (ok ? '✓ ' : '→ ') + gShow(st) + '</div>' + (st.expl ? '<div class="gexp">' + st.expl + '</div>' : '');
  }
  function next() {
    if (i >= n) { finish(); return; }
    var st = ex.steps[i], tries = 0, used = false;
    var card = h('div', { class: 'gstep cur' });
    var input;
    if (st.kind === 'choice') {
      input = '<div class="gopts" role="radiogroup">' + st.opts.map(function (o, k) {
        return '<label class="gopt"><input type="radio" name="' + uid + i + '" value="' + k + '"><span>' + o + '</span></label>';
      }).join('') + '</div>';
    } else {
      input = '<input class="in gin" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="' + (st.ph || 'Tu respuesta') + '" aria-label="Respuesta del paso ' + (i + 1) + '">';
    }
    card.innerHTML = '<div class="gn">Paso ' + (i + 1) + ' de ' + n + '</div><div class="gq">' + st.q + '</div>' + input +
      '<div class="actions"><button class="btn primary g-chk">Comprobar</button><button class="btn g-hint">Pista</button><button class="btn g-show">No sé, mostrame</button></div><div class="gmsg" role="status" aria-live="polite"></div>';
    list.appendChild(card);
    var msg = $('.gmsg', card);
    function val() { if (st.kind === 'choice') { var r = $('input:checked', card); return r ? r.value : ''; } return $('.gin', card).value; }
    function hint() { used = true; msg.innerHTML = '<span class="ghint"><b>Pista.</b> ' + st.hint + '</span>'; }
    $('.g-chk', card).addEventListener('click', function () {
      var v = val();
      if (v === '') { msg.textContent = st.kind === 'choice' ? 'Elegí una opción.' : 'Escribí tu respuesta.'; return; }
      if (gOk(st, v)) { if (tries === 0 && !used) clean++; done(card, st, true); i++; next(); return; }
      tries++;
      if (st.kind !== 'choice') $('.gin', card).classList.add('bad');
      msg.innerHTML = '<span class="gwrong">Todavía no.</span> ' + (tries >= 2 ? '<span class="ghint"><b>Pista.</b> ' + st.hint + '</span>' : 'Probá de nuevo o pedí una pista.');
      if (tries >= 2) used = true;
    });
    $('.g-hint', card).addEventListener('click', hint);
    $('.g-show', card).addEventListener('click', function () { done(card, st, false); i++; next(); });
    var gi = $('.gin', card);
    if (gi) { gi.addEventListener('keydown', function (e) { if (e.key === 'Enter') $('.g-chk', card).click(); }); gi.addEventListener('input', function () { gi.classList.remove('bad'); }); try { gi.focus({ preventScroll: true }); } catch (e) { /* nada */ } }
  }
  function finish() {
    var card = h('div', { class: 'gstep gfin' }, '<div class="gq">Listo: resolviste <b>' + clean + ' de ' + n + '</b> pasos sin ayuda.</div><p class="muted">' +
      (clean === n ? 'Impecable. Probá con otro o pasá a la pestaña Simulacro.' : 'Repasá los pasos marcados "con ayuda" (arriba están las explicaciones) y hacé otro ejercicio del mismo tipo: se arma con números distintos.') + '</p>');
    list.appendChild(card);
    if (onFinish) onFinish(clean, n);
    try { card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) { /* nada */ }
  }
  next();
}

/* ---------- Subneteo ---------- */
function gSubneteo() {
  var ex = genSubnetEx(), sp = ex.sp, a = sp.subs[ex.k1 - 1], b = sp.subs[ex.k2 - 1], c = ex.hostSub;
  var oct = Math.floor((sp.prefix - 1) / 8), mo = parseInt(sp.mask.split('.')[oct], 10), blk = 256 - mo;
  var names = ['1.er', '2.º', '3.er', '4.º'];
  return {
    enun: '<p>Dada la red <code>' + ex.base + '/' + ex.bp + '</code>, cree <b>' + ex.N + '</b> subredes.</p><p>Averiguar:</p><ul class="steps"><li>La dirección de <b>RED</b> de la <b>' + ex.ord(ex.k1) + '</b> subred</li><li>El <b>rango de hosts</b> de la <b>' + ex.ord(ex.k2) + '</b> subred</li><li>El <b>gateway</b> del host <code>' + ex.host + '</code> (primera dirección válida de su subred)</li></ul>',
    steps: [
      { q: '¿Cuántos <b>bits</b> hay que tomar de la parte de host para tener al menos ' + ex.N + ' subredes? (el menor n con 2<sup>n</sup> ≥ ' + ex.N + ')', type: 'num', ans: String(sp.bits), ph: 'Un número', hint: 'Probá 2¹, 2², 2³… y frená en el primero que sea mayor o igual que ' + ex.N + '.', expl: '2<sup>' + sp.bits + '</sup> = ' + sp.total + ' ≥ ' + ex.N + '. Con ' + (sp.bits - 1) + ' bits serían ' + Math.pow(2, sp.bits - 1) + ' y no alcanza.' },
      { q: '¿Cuál es el <b>prefijo nuevo</b>? (el original /' + ex.bp + ' más los bits que tomaste)', type: 'num', ans: String(sp.prefix), ph: 'Ej.: 27', hint: 'Sumá ' + ex.bp + ' + ' + sp.bits + '.', expl: ex.bp + ' + ' + sp.bits + ' = /' + sp.prefix + '.' },
      { q: 'Escribí esa máscara en <b>notación decimal</b>.', type: 'ip', ans: sp.mask, ph: '255.255.x.x', hint: 'Los octetos completos valen 255. El octeto "partido" sale de la tira: /1=128, /2=192, /3=224, /4=240, /5=248, /6=252, /7=254 (bits que le sumaste en ese octeto).', expl: '/' + sp.prefix + ' = ' + sp.mask + '.' },
      { q: 'El octeto que cambia es el <b>' + names[oct] + '</b>. ¿De a cuánto avanzan las subredes ahí? (el <b>bloque</b>)', type: 'num', ans: String(blk), ph: 'Un número', hint: 'Es 256 menos el valor de la máscara en ese octeto (' + mo + ').', expl: '256 − ' + mo + ' = ' + blk + '. Las subredes arrancan en ' + sp.subs.slice(0, 3).map(function (x) { return x.net; }).join(', ') + '…' },
      { q: '¿Cuál es la dirección de <b>red</b> de la <b>' + ex.ord(ex.k1) + '</b> subred?', type: 'ip', ans: a.net, ph: 'x.x.x.x', hint: 'La 1.ª subred es la que empieza en ' + ex.base + '. La ' + ex.ord(ex.k1) + ' está ' + (ex.k1 - 1) + ' bloques más adelante: ' + (ex.k1 - 1) + ' × ' + blk + ' = ' + ((ex.k1 - 1) * blk) + ' sumado al ' + names[oct] + ' octeto.', expl: (ex.k1 - 1) + ' × ' + blk + ' = ' + ((ex.k1 - 1) * blk) + ' → <code>' + a.net + '/' + a.prefix + '</code>.' },
      { q: '¿Cuál es la <b>primera dirección válida</b> (primer host) de la <b>' + ex.ord(ex.k2) + '</b> subred?', type: 'ip', ans: b.first, ph: 'x.x.x.x', hint: 'Primero hallá la red de esa subred (' + (ex.k2 - 1) + ' × ' + blk + ' en el ' + names[oct] + ' octeto). El primer host es la red + 1.', expl: 'La ' + ex.ord(ex.k2) + ' subred es <code>' + b.net + '/' + b.prefix + '</code>; primer host = red + 1 = <code>' + b.first + '</code>.' },
      { q: '¿Y la <b>última dirección válida</b> (último host) de esa misma subred?', type: 'ip', ans: b.last, ph: 'x.x.x.x', hint: 'El broadcast es la dirección anterior a la red de la subred siguiente; el último host es el broadcast − 1.', expl: 'Broadcast = <code>' + b.bc + '</code>; último host = broadcast − 1 = <code>' + b.last + '</code>.' },
      { q: '¿En qué <b>número de subred</b> (contando desde 1) cae <code>' + ex.host + '</code>?', type: 'num', ans: String(c.k), ph: 'Un número', hint: 'Fijate entre qué dos redes está: buscá el bloque que arranca justo por debajo de la IP.', expl: 'El bloque que arranca en <code>' + c.net + '</code> es la ' + ex.ord(c.k) + ' subred.' },
      { q: 'Si el gateway es la primera dirección válida de cada subred, ¿cuál es el gateway de <code>' + ex.host + '</code>?', type: 'ip', ans: c.first, ph: 'x.x.x.x', hint: 'Es la red de su subred + 1.', expl: 'Red <code>' + c.net + '</code> + 1 = <code>' + c.first + '</code>.' }
    ]
  };
}

/* ---------- ¿Es válida para un host? ---------- */
function gHost() {
  var p = pick([18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30]);
  var o1 = pick([10, 130, 172, 190, 192, 200, 201]);
  var raw = L.info(o1 + '.' + (1 + rnd(250)) + '.' + rnd(256) + '.' + rnd(256), p);
  var kind = pick(['host', 'net', 'bc', 'bc', 'host']);
  var ipInt = kind === 'net' ? raw.netInt : kind === 'bc' ? raw.bcInt : raw.netInt + 1 + rnd(raw.size - 2);
  var ip = L.intToIp(ipInt), t = L.info(ip, p);
  var oct = Math.floor((p - 1) / 8), mo = parseInt(t.mask.split('.')[oct], 10), blk = 256 - mo;
  var names = ['1.er', '2.º', '3.er', '4.º'];
  return {
    enun: '<p>¿Es válida la dirección <code>' + ip + '/' + p + '</code> para asignarla a un host? Lo vas a decidir calculando la red y el broadcast.</p>',
    steps: [
      { q: 'Escribí la máscara de <b>/' + p + '</b> en notación decimal.', type: 'ip', ans: t.mask, ph: '255.x.x.x', hint: 'Los octetos completos valen 255 y el octeto partido sale de la tira 128, 192, 224, 240, 248, 252.', expl: '/' + p + ' = ' + t.mask + '.' },
      { q: 'El octeto que cambia es el <b>' + names[oct] + '</b>. ¿Cuál es el <b>bloque</b> (de a cuánto avanzan las redes en ese octeto)?', type: 'num', ans: String(blk), ph: 'Un número', hint: '256 − ' + mo + '.', expl: '256 − ' + mo + ' = ' + blk + '.' },
      { q: '¿Cuál es la dirección de <b>red</b> a la que pertenece ' + ip + '?', type: 'ip', ans: t.net, ph: 'x.x.x.x', hint: 'En el ' + names[oct] + ' octeto, buscá el múltiplo de ' + blk + ' que queda justo por debajo (o igual) al valor de la IP. Los octetos de la derecha van en 0.', expl: 'Red = <code>' + t.net + '</code>.' },
      { q: '¿Cuál es el <b>broadcast</b> de esa red?', type: 'ip', ans: t.bc, ph: 'x.x.x.x', hint: 'Es la dirección anterior a la red siguiente: red + ' + blk + ' − 1 en el ' + names[oct] + ' octeto, y 255 en los octetos de la derecha.', expl: 'Broadcast = <code>' + t.bc + '</code>.' },
      { q: '¿Cuántos <b>hosts</b> admite una red /' + p + '?', type: 'num', ans: String(t.hosts), ph: 'Un número', hint: '2<sup>bits de host</sup> − 2. Bits de host = 32 − ' + p + ' = ' + (32 - p) + '.', expl: '2<sup>' + (32 - p) + '</sup> − 2 = ' + t.hosts + '.' },
      { q: 'Entonces, ¿es <code>' + ip + '</code> una dirección válida para un host?', kind: 'choice', opts: ['Sí, es una dirección de host válida', 'No: es la dirección de red', 'No: es la dirección de broadcast'], ans: kind === 'host' ? 0 : kind === 'net' ? 1 : 2, hint: 'Compará la IP con la red (' + t.net + ') y el broadcast (' + t.bc + ').', expl: kind === 'host' ? 'Está entre ' + t.first + ' y ' + t.last + ': es un host válido.' : kind === 'net' ? 'Coincide con la dirección de red: no se puede asignar.' : 'Coincide con el broadcast: no se puede asignar.' }
    ]
  };
}

/* ---------- Tabla de ruteo ---------- */
function gRuteo() {
  var tk = pick(['pergamino', 'pergamino', 'recup2025']), topo = DATA.topos[tk];
  var rn = pick(Object.keys(topo.routers)), r = topo.routers[rn];
  var rows = routeTable(topo, rn, topo.nets);
  var conn = rows.filter(function (x) { return !x.gw; }), rem = rows.filter(function (x) { return x.gw; });
  var chosen = shuffle((conn.length ? [pick(conn)] : []).concat(shuffle(rem).slice(0, 2)));
  var ifNames = r.ifs.map(function (x) { return x.n; });
  var steps = [];
  chosen.forEach(function (x) {
    var isConn = !x.gw, myIf = r.ifs.filter(function (f) { return f.n === x.iface; })[0];
    steps.push({ q: '<b>' + x.net + '</b>: ¿está <b>conectada</b> directamente a ' + rn + ' o hay que pasársela a un router vecino?', kind: 'choice', opts: ['Conectada: ' + rn + ' tiene una interfaz en esa red (no lleva gateway)', 'Lejana: hay que pasarla a un vecino (lleva gateway)'], ans: isConn ? 0 : 1, hint: 'Mirá las IP de las interfaces de ' + rn + ' en el dibujo: ¿alguna está dentro de ' + x.net + '?', expl: isConn ? 'La interfaz <code>' + x.iface + '</code> (' + x.ip + ') está en esa red.' : 'Ninguna interfaz de ' + rn + ' está en esa red: queda del otro lado de un vecino.' });
    steps.push({ q: '<b>' + x.net + '</b>: ¿por qué <b>interfaz</b> sale?', kind: 'choice', opts: ifNames.map(function (nm) { return '<code>' + nm + '</code>'; }), ans: ifNames.indexOf(x.iface), hint: isConn ? 'La que tiene IP dentro de esa red.' : 'La que apunta al enlace con el vecino que lleva a esa red (no la de la LAN propia).', expl: 'Sale por <code>' + x.iface + '</code>' + (isConn ? '.' : ', que es el enlace <code>' + myIf.net + '</code> hacia el vecino.') });
    if (!isConn) steps.push({ q: '<b>' + x.net + '</b>: ¿cuál es el <b>gateway</b> (siguiente salto)?', type: 'gw', ans: x.gw, ph: 'IP del vecino', hint: 'Es la IP del <b>otro extremo</b> del enlace <code>' + myIf.net + '</code>. La tuya en ese enlace es ' + myIf.ip + ': el gateway es la otra.', expl: 'El vecino en el enlace <code>' + myIf.net + '</code> tiene la IP <code>' + x.gw + '</code>.' });
  });
  return { enun: '<p>Completá, paso a paso, <b>3 filas</b> de la tabla de ruteo del router <b>' + rn + '</b>.</p><div class="topo-box">' + drawTopo(topo) + '</div>', steps: steps };
}

/* ---------- Comandos IOS ---------- */
function gIos() {
  var topo = DATA.topos.pergamino, rn = pick(Object.keys(topo.routers)), r = topo.routers[rn];
  var lans = r.ifs.filter(function (f) { return /^f/.test(f.n); }), lan = pick(lans);
  var np = lan.net.split('/'), li = L.info(np[0], parseInt(np[1], 10)), first = li.first;
  var rem = routeTable(topo, rn, topo.nets).filter(function (x) { return x.gw; }), tgt = pick(rem);
  var tp = tgt.net.split('/'), ti = L.info(tp[0], parseInt(tp[1], 10));
  var good = 'Router&gt;enable\nRouter#configure terminal\nRouter(config)#interface ' + lan.n + '\nRouter(config-if)#ip address ' + first + ' ' + li.mask + '\nRouter(config-if)#no shutdown';
  var badMask = good.replace(' ' + li.mask, ' ' + L.info(np[0], li.prefix + 1).mask);
  var badNet = good.replace(first + ' ', li.net + ' ');
  var badSyn = 'Router&gt;sudo configure interface\nRouter(config-if)#ip address ' + first + ' ' + lan.n;
  var opts = shuffle([[good, true], [badMask, false], [badNet, false], [badSyn, false]]);
  var ans = 0; opts.forEach(function (o, k) { if (o[1]) ans = k; });
  return {
    enun: '<p>En el router <b>' + rn + '</b>:</p><ul class="steps"><li><b>(a)</b> Configurá la interfaz <code>' + lan.n + '</code> con la <b>primera dirección disponible</b> de la red <code>' + lan.net + '</code></li><li><b>(b)</b> Escribí la línea <code>ip route</code> para llegar a <code>' + tgt.net + '</code></li></ul><div class="topo-box">' + drawTopo(topo) + '</div>',
    steps: [
      { q: '(a) ¿Cuál es la <b>primera dirección disponible</b> de ' + lan.net + '?', type: 'ip', ans: first, ph: 'x.x.x.x', hint: 'Es la dirección de red + 1 (la red misma no se puede asignar).', expl: 'Red <code>' + li.net + '</code> + 1 = <code>' + first + '</code>.' },
      { q: '(a) ¿Qué <b>máscara</b> va en <code>ip address</code>?', type: 'ip', ans: li.mask, ph: '255.255.x.x', hint: 'Es la máscara de /' + li.prefix + '.', expl: '/' + li.prefix + ' = <code>' + li.mask + '</code>.' },
      { q: '(a) ¿Cuál de estas secuencias configura bien la interfaz?', kind: 'choice', opts: opts.map(function (o) { return '<pre><code>' + o[0] + '</code></pre>'; }), ans: ans, hint: 'Descartá la que no es sintaxis de IOS, la que usa la dirección de red en vez del primer host y la que tiene la máscara de otro prefijo.', expl: 'Hay que entrar con <code>enable</code> y <code>configure terminal</code>, elegir la interfaz, poner <code>ip address &lt;IP&gt; &lt;máscara&gt;</code> y encenderla con <code>no shutdown</code>.' },
      { q: '(b) <code>ip route</code>: ¿qué <b>red destino</b> va primero? (sin el /prefijo)', type: 'ip', ans: ti.net, ph: 'x.x.x.x', hint: 'Es la red que querés alcanzar, no una IP de host.', expl: 'La red destino es <code>' + ti.net + '</code>.' },
      { q: '(b) ¿Y su <b>máscara</b> en decimal?', type: 'ip', ans: ti.mask, ph: '255.255.x.x', hint: 'Es la máscara de /' + ti.prefix + '.', expl: '/' + ti.prefix + ' = <code>' + ti.mask + '</code>.' },
      { q: '(b) ¿Cuál es el <b>siguiente salto</b>?', type: 'ip', ans: tgt.gw, ph: 'x.x.x.x', hint: 'Es la IP del router vecino, del otro lado del enlace por el que sale (' + tgt.iface + '). No pongas una IP tuya.', expl: 'Línea completa: <code>ip route ' + ti.net + ' ' + ti.mask + ' ' + tgt.gw + '</code>.' }
    ]
  };
}

/* ---------- Fragmentación ---------- */
function gFrag() {
  var mtu = pick([1500, 1500, 1000, 1280, 576]), data = (30 + rnd(100)) * 100;
  var fr = L.fragment(data, mtu, 20), last = fr.frags[fr.frags.length - 1];
  return {
    enun: '<p>Un datagrama IP con cabecera de 20 bytes (sin opciones) y <b>' + data + ' bytes de datos</b> tiene que pasar por una red con <b>MTU ' + mtu + '</b>.</p>',
    steps: [
      { q: '¿Cuántos bytes de <b>datos</b> entran como máximo en cada fragmento? (recordá que tiene que ser múltiplo de 8)', type: 'num', ans: String(fr.maxData), ph: 'Bytes', hint: 'MTU − 20 de cabecera = ' + (mtu - 20) + '. Bajalo al múltiplo de 8 más cercano hacia abajo.', expl: (mtu - 20) + ' → ' + fr.maxData + ' (múltiplo de 8: ' + fr.maxData / 8 + ' × 8).' },
      { q: '¿Cuántos <b>fragmentos</b> resultan?', type: 'num', ans: String(fr.frags.length), ph: 'Un número', hint: 'Dividí ' + data + ' ÷ ' + fr.maxData + ' y redondeá hacia arriba.', expl: data + ' ÷ ' + fr.maxData + ' = ' + (data / fr.maxData).toFixed(2) + ' → ' + fr.frags.length + ' fragmentos.' },
      { q: '¿Cuántos bytes de datos lleva el <b>último</b> fragmento?', type: 'num', ans: String(last.data), ph: 'Bytes', hint: 'Datos totales − (cantidad de fragmentos − 1) × ' + fr.maxData + '.', expl: data + ' − ' + (fr.frags.length - 1) + ' × ' + fr.maxData + ' = ' + last.data + ' (longitud total ' + last.total + ').' },
      { q: '¿Cuál es el <b>offset</b> del 2.º fragmento? (en unidades de 8 bytes)', type: 'num', ans: String(fr.frags[1].offset), ph: 'Un número', hint: 'El 2.º fragmento arranca después de ' + fr.maxData + ' bytes. Dividí por 8.', expl: fr.maxData + ' ÷ 8 = ' + fr.frags[1].offset + '. El primero tiene offset 0.' },
      { q: '¿Quién <b>reensambla</b> el datagrama?', kind: 'choice', opts: ['El primer router del camino', 'Cada router intermedio', 'El host destino'], ans: 2, hint: 'Los routers solo fragmentan.', expl: 'El reensamblado lo hace siempre el host destino.' }
    ]
  };
}

/* ---------- Congestión TCP ---------- */
function gCong() {
  var C = pick([16, 20, 24, 32, 40]), ev = pick(['timeout', 'dup3']), th = C / 2;
  var cw = ev === 'timeout' ? 1 : th, seq = [cw], t = cw;
  for (var k = 0; k < 3; k++) { t = t < th ? Math.min(t * 2, th) : t + 1; seq.push(t); }
  return {
    enun: '<p>Una conexión TCP (variante Reno) tiene <b>cwnd = ' + C + ' MSS</b> cuando ' + (ev === 'timeout' ? 'se produce un <b>timeout</b> (no llega ningún ACK).' : 'llegan <b>3 ACK duplicados</b> (se perdió un segmento pero siguen llegando otros).') + '</p>',
    steps: [
      { q: '¿Cuánto vale el nuevo <b>ssthresh</b>?', type: 'num', ans: String(th), ph: 'MSS', hint: 'En los dos casos es cwnd ÷ 2.', expl: C + ' ÷ 2 = ' + th + '.' },
      { q: '¿Cuánto vale <b>cwnd</b> justo después del evento?', type: 'num', ans: String(cw), ph: 'MSS', hint: ev === 'timeout' ? 'El timeout es lo más grave: cwnd vuelve al valor inicial.' : 'Con 3 ACK duplicados (fast retransmit) cwnd pasa a valer lo mismo que el nuevo ssthresh.', expl: ev === 'timeout' ? 'Timeout: cwnd = 1 MSS.' : '3 ACK duplicados: cwnd = ssthresh = ' + th + '.' },
      { q: '¿En qué fase queda?', kind: 'choice', opts: ['Slow start (crece al doble por RTT)', 'Evitación de congestión (crece +1 por RTT)'], ans: ev === 'timeout' ? 0 : 1, hint: 'Slow start se usa mientras cwnd < ssthresh; con cwnd ≥ ssthresh se crece de a 1.', expl: ev === 'timeout' ? 'cwnd = 1 < ssthresh = ' + th + ': slow start.' : 'cwnd = ssthresh: evitación de congestión.' },
      { q: '¿Cuánto vale cwnd <b>3 RTT después</b>, si no hay más pérdidas?', type: 'num', ans: String(seq[3]), ph: 'MSS', hint: 'Aplicá la regla cada RTT: si cwnd < ssthresh se duplica (sin pasarse de ssthresh); si no, suma 1.', expl: 'Secuencia: ' + seq.join(' → ') + '.' }
    ]
  };
}

/* ---------- ACK, ventana y handshake ---------- */
function gAck() {
  var ack = 100000000 + rnd(800000000), W = pick([200, 500, 1000, 2000]), seg = pick([100, 300, 500, 1000, 1460]);
  var x = 1000000 + rnd(900000000), y = 1000000 + rnd(900000000);
  return {
    enun: '<p>Un receptor TCP envía un segmento con <b>ACK = ' + ack + '</b> y <b>Window = ' + W + '</b>. Después, se abre otra conexión: el cliente manda un SYN con <b>seq = ' + x + '</b> y el servidor responde con un SYN-ACK con <b>seq = ' + y + '</b>.</p>',
    steps: [
      { q: '¿Hasta qué byte recibió bien los datos el que mandó ese ACK?', type: 'num', ans: String(ack - 1), ph: 'Número de byte', hint: 'El ACK es el próximo byte que espera.', expl: 'ACK = ' + ack + ' → recibió bien hasta el ' + (ack - 1) + ' y espera el ' + ack + '.' },
      { q: 'El emisor tiene listo un segmento de <b>' + seg + ' bytes</b>. ¿Se lo puede mandar ahora?', kind: 'choice', opts: ['Sí', 'No'], ans: seg <= W ? 0 : 1, hint: 'Window es cuántos bytes más puede recibir el otro extremo.', expl: seg <= W ? seg + ' ≤ ' + W + ': entra en la ventana.' : seg + ' > ' + W + ': no entra en la ventana anunciada.' },
      { q: '¿Qué <b>ACK</b> trae el SYN-ACK?', type: 'num', ans: String(x + 1), ph: 'Número', hint: 'El SYN consume un número de secuencia: se confirma el del cliente + 1.', expl: x + ' + 1 = ' + (x + 1) + '.' },
      { q: 'En el tercer mensaje (ACK del cliente), ¿qué número de ACK lleva?', type: 'num', ans: String(y + 1), ph: 'Número', hint: 'Confirma el SYN del servidor: su seq + 1.', expl: y + ' + 1 = ' + (y + 1) + '.' }
    ]
  };
}

var GTYPES = [
  { id: 'subneteo', n: 'Subneteo', d: 'N subredes: máscara, red, rango y gateway', gen: gSubneteo },
  { id: 'host', n: '¿Host válido?', d: 'Red, broadcast y veredicto', gen: gHost },
  { id: 'ruteo', n: 'Tabla de ruteo', d: 'Conectada o lejana, interfaz, gateway', gen: gRuteo },
  { id: 'ios', n: 'Comandos IOS', d: 'Interfaz e ip route', gen: gIos },
  { id: 'frag', n: 'Fragmentación', d: 'MTU, fragmentos y offsets', gen: gFrag },
  { id: 'cong', n: 'Congestión TCP', d: 'ssthresh y cwnd', gen: gCong },
  { id: 'ack', n: 'ACK y ventana', d: 'Handshake y control de flujo', gen: gAck }
];

RENDER.guiada = function () {
  var P = $('#guiada'), cur = GTYPES[0], prog = store('guiada') || {};
  function chips() {
    return GTYPES.map(function (g) { return '<button class="chip" data-g="' + g.id + '" aria-pressed="' + (g === cur) + '">' + g.n + (prog[g.id] ? ' <span class="muted">· ' + prog[g.id] + '</span>' : '') + '</button>'; }).join('');
  }
  P.innerHTML = '<div class="wrap"><main><section><div><div class="eyebrow">Práctica</div><h2>Práctica guiada</h2></div>' +
    '<p class="lead">El parcial es práctico, así que acá se practica: elegí un tipo de ejercicio y resolvelo <b>de a un paso</b>. Cada paso se corrige al instante; si te trabás, pedí una pista, y si no sale, "No sé, mostrame" te da la respuesta con la explicación. Los números se generan al azar: podés repetir cuantas veces quieras. El número al lado de cada tipo son los ejercicios que terminaste.</p>' +
    '<div class="filters" id="g-chips" role="group" aria-label="Tipo de ejercicio">' + chips() + '</div>' +
    '<p class="muted" id="g-desc"></p><div class="gen-bar"><button class="btn primary" id="g-next">Ejercicio nuevo</button><span class="gen-num" id="g-num"></span></div><div id="g-area"></div></section></main></div>';
  var count = 0;
  function newEx() {
    count++;
    $('#g-desc').textContent = cur.d;
    $('#g-num').textContent = cur.n + ' · ejercicio ' + count;
    runGuided($('#g-area'), cur.gen(), function (clean, n) { prog[cur.id] = (prog[cur.id] || 0) + 1; store('guiada', prog); $('#g-chips').innerHTML = chips(); });
  }
  $('#g-chips').addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    cur = GTYPES.filter(function (g) { return g.id === b.dataset.g; })[0]; count = 0; $('#g-chips').innerHTML = chips(); newEx();
  });
  $('#g-next').addEventListener('click', newEx);
  newEx();
};
