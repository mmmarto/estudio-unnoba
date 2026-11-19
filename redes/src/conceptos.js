/* ============ CONCEPTOS: glosario corto ============ */
/* Cada concepto: qué es en una o dos frases y un ejemplo. prio: alta = cae seguro, media = cae seguido, baja = cayó poco. */
var CONCEPTOS = [
  /* Direcciones */
  { id: 'bit-byte', cat: 'Direcciones', prio: 'media', t: 'Bit y byte', q: 'Un bit es un 0 o un 1. Un byte son 8 bits y va de 0 a 255.', ej: '<code>11000000</code> = 128 + 64 = 192' },
  { id: 'ip', cat: 'Direcciones', prio: 'alta', t: 'Dirección IPv4', q: 'Es el número que identifica a un equipo en una red. Son 4 números de 0 a 255 separados por puntos (32 bits en total).', ej: '<code>192.168.10.5</code>' },
  { id: 'mascara', cat: 'Direcciones', prio: 'alta', t: 'Máscara de subred', q: 'Dice qué parte de la IP es la <b>red</b> y cuál es el <b>host</b>. Los bits en 1 son la red y los bits en 0 son el host.', ej: '<code>255.255.255.0</code> = 24 unos seguidos' },
  { id: 'prefijo', cat: 'Direcciones', prio: 'alta', t: 'Prefijo (/n)', q: 'Es la máscara escrita corta: cuenta cuántos bits valen 1.', ej: '<code>/24</code> = 255.255.255.0 · <code>/26</code> = 255.255.255.192' },
  { id: 'red-host', cat: 'Direcciones', prio: 'alta', t: 'Parte de red y parte de host', q: 'La parte de red es igual para todos los equipos de una misma red. La parte de host es la que distingue a cada equipo.', ej: 'En <code>192.168.10.5/24</code> la red es 192.168.10 y el host es .5' },
  { id: 'dir-red', cat: 'Direcciones', prio: 'alta', t: 'Dirección de red', q: 'Es la <b>primera</b> dirección de la red (bits de host todos en 0). Nombra a la red y no se le asigna a ningún equipo.', ej: '<code>192.168.10.0/24</code>' },
  { id: 'broadcast', cat: 'Direcciones', prio: 'alta', t: 'Broadcast', q: 'Es la <b>última</b> dirección de la red (bits de host todos en 1). Un mensaje enviado ahí llega a todos los equipos de esa red. Tampoco se asigna.', ej: '<code>192.168.10.255</code> en una /24' },
  { id: 'host-valido', cat: 'Direcciones', prio: 'alta', t: 'Host válido', q: 'Cualquier dirección que esté <b>entre</b> la red y el broadcast. Esas sí se pueden asignar a equipos.', ej: 'En 192.168.10.0/24: de <code>192.168.10.1</code> a <code>192.168.10.254</code>' },
  { id: 'privadas', cat: 'Direcciones', prio: 'alta', t: 'Direcciones privadas (RFC 1918)', q: 'Rangos para usar dentro de una red local. No se enrutan en Internet.', ej: '<code>10.0.0.0/8</code> · <code>172.16.0.0/12</code> (172.16 a 172.31) · <code>192.168.0.0/16</code>' },
  { id: 'loopback', cat: 'Direcciones', prio: 'alta', t: 'Loopback', q: 'Dirección para que un equipo se hable a sí mismo, por ejemplo para hacer pruebas.', ej: 'IPv4: <code>127.0.0.1</code> (todo 127.0.0.0/8) · IPv6: <code>::1</code>', ojo: 'En IPv6 es <code>::1</code>, no <code>::0</code>.' },
  { id: 'link-local', cat: 'Direcciones', prio: 'media', t: 'Link-local', q: 'Dirección que un equipo se arma solo cuando no tiene otra. Solo vale dentro de su propio enlace.', ej: 'IPv4: <code>169.254.x.x</code> · IPv6: empieza con <code>fe80</code>' },
  { id: 'multicast', cat: 'Direcciones', prio: 'media', t: 'Multicast', q: 'Un mensaje para un <b>grupo</b> de equipos. En IPv6 reemplaza al broadcast.', ej: 'Lo reciben solo los equipos que se anotaron en el grupo' },
  { id: 'ipv6', cat: 'Direcciones', prio: 'alta', t: 'IPv6', q: 'Versión nueva de IP: direcciones de 128 bits escritas en hexadecimal. <b>No tiene broadcast</b> (usa multicast) y reemplaza ARP por Neighbor Discovery.', ej: '<code>2001:db8::1</code>' },

  /* Subneteo */
  { id: 'subred', cat: 'Subneteo', prio: 'alta', t: 'Subred', q: 'Una red más chica que sale de partir una red grande.', ej: 'Una /24 partida en 4 da cuatro subredes /26' },
  { id: 'bits-prestados', cat: 'Subneteo', prio: 'alta', t: 'Bits prestados', q: 'Son los bits de host que se pasan a la parte de red para crear subredes. Con <code>n</code> bits salen 2<sup>n</sup> subredes.', ej: '3 bits → 8 subredes. Por eso para 6 subredes se piden 3 bits' },
  { id: 'bloque', cat: 'Subneteo', prio: 'alta', t: 'Bloque (el salto)', q: 'De a cuánto avanzan las subredes en el octeto que cambia. Es 256 menos el valor de la máscara en ese octeto.', ej: 'Máscara 224 → bloque 32 → subredes en 0, 32, 64, 96…' },
  { id: 'cant-hosts', cat: 'Subneteo', prio: 'alta', t: 'Cantidad de hosts', q: 'Hosts = 2<sup>bits de host</sup> − 2. Se restan la dirección de red y el broadcast.', ej: '/27 → 5 bits de host → 32 − 2 = <b>30</b> hosts' },
  { id: 'gateway', cat: 'Subneteo', prio: 'alta', t: 'Gateway (puerta de enlace)', q: 'Es la dirección del router en tu red. Los equipos le mandan todo lo que va a otras redes. En los ejercicios suele ser el primer host de la subred.', ej: 'Subred 192.168.10.96/27 → gateway <code>192.168.10.97</code>' },

  /* Ruteo */
  { id: 'router', cat: 'Ruteo', prio: 'alta', t: 'Router', q: 'Equipo que conecta redes distintas y decide por dónde mandar cada paquete.', ej: 'Une tu LAN con otra LAN o con Internet' },
  { id: 'interfaz', cat: 'Ruteo', prio: 'alta', t: 'Interfaz', q: 'Cada conexión del router a una red. Tiene un nombre y una IP propia, dentro de la red a la que está conectada.', ej: '<code>f0/0</code> con 192.168.1.1 · <code>s0/0</code> con 10.0.0.1' },
  { id: 'tabla-ruteo', cat: 'Ruteo', prio: 'alta', t: 'Tabla de ruteo', q: 'La lista que consulta el router. Para cada red destino dice por qué interfaz salir y a qué vecino pasárselo (gateway).', ej: '192.168.2.0/24 → interfaz s0/0, gateway 10.0.0.2' },
  { id: 'conectada', cat: 'Ruteo', prio: 'alta', t: 'Red conectada', q: 'Una red en la que el router tiene una interfaz. La entrega directo, así que <b>no lleva gateway</b>.', ej: 'La LAN del propio router' },
  { id: 'next-hop', cat: 'Ruteo', prio: 'alta', t: 'Siguiente salto (next hop)', q: 'La IP del router vecino al que le pasás el paquete para llegar a una red lejana. Es la IP del <b>otro extremo</b> del enlace, nunca la tuya.', ej: 'Enlace 10.0.0.0/30: yo soy .1, el siguiente salto es <code>10.0.0.2</code>' },
  { id: 'ruta-estatica', cat: 'Ruteo', prio: 'alta', t: 'Ruta estática (ip route)', q: 'Una ruta que escribís a mano en el router.', ej: '<code>ip route 192.168.2.0 255.255.255.0 10.0.0.2</code>' },
  { id: 'ruta-defecto', cat: 'Ruteo', prio: 'alta', t: 'Ruta por defecto', q: 'La ruta para todo lo que no está en la tabla. Usa red y máscara en cero.', ej: '<code>ip route 0.0.0.0 0.0.0.0 10.0.0.2</code>' },
  { id: 'ios', cat: 'Ruteo', prio: 'alta', t: 'Cisco IOS', q: 'El sistema de los routers Cisco. Para configurar una interfaz se usa siempre este orden.', ej: '<code>enable</code> → <code>configure terminal</code> → <code>interface f0/0</code> → <code>ip address IP máscara</code> → <code>no shutdown</code>' },

  /* Capa de red */
  { id: 'datagrama', cat: 'Capa de red', prio: 'media', t: 'Datagrama IP', q: 'La unidad de datos de la capa de red: un encabezado con las direcciones más los datos.', ej: 'Lleva IP origen, IP destino y TTL en el encabezado' },
  { id: 'ttl', cat: 'Capa de red', prio: 'media', t: 'TTL', q: 'Número del encabezado IPv4 que <b>baja 1 en cada router</b>. Si llega a 0 el paquete se descarta. Evita que un paquete dé vueltas para siempre.', ej: 'En IPv6 se llama <b>Hop Limit</b>' },
  { id: 'mtu-frag', cat: 'Capa de red', prio: 'media', t: 'MTU y fragmentación', q: 'La MTU es el tamaño máximo de datagrama que entra en una red. Si el datagrama es más grande, el router lo parte en fragmentos y el <b>destino</b> los vuelve a armar.', ej: 'En Ethernet la MTU es 1500 bytes' },
  { id: 'mac', cat: 'Capa de red', prio: 'media', t: 'Dirección MAC', q: 'La dirección física de la placa de red (48 bits). Sirve dentro de la red local. La IP sirve para ir de una red a otra.', ej: '<code>00:1A:2B:3C:4D:5E</code>' },
  { id: 'arp', cat: 'Capa de red', prio: 'media', t: 'ARP', q: 'Protocolo que averigua la MAC de una IP de la misma red. Pregunta por broadcast ("¿quién tiene esta IP?") y el dueño responde directo. En IPv6 lo reemplaza Neighbor Discovery.', ej: '"¿Quién tiene 192.168.10.1?" → "Yo, mi MAC es…"' },
  { id: 'icmp', cat: 'Capa de red', prio: 'baja', t: 'ICMP', q: 'Protocolo de avisos y diagnóstico de IP.', ej: '<code>ping</code> y el mensaje "destino inalcanzable"' },

  /* Transporte */
  { id: 'puerto', cat: 'Transporte', prio: 'alta', t: 'Puerto', q: 'Número que dice a qué aplicación de un equipo va cada dato (de 0 a 65535). TCP y UDP los usan los dos.', ej: 'Web: 80 (HTTP) y 443 (HTTPS) · DNS: 53' },
  { id: 'socket', cat: 'Transporte', prio: 'media', t: 'Socket', q: 'IP + puerto. Identifica un extremo de la comunicación.', ej: '<code>192.168.10.5:443</code>' },
  { id: 'tcp', cat: 'Transporte', prio: 'alta', t: 'TCP', q: 'Protocolo de transporte <b>confiable</b> y con conexión: numera los segmentos, los confirma (ACK), retransmite lo perdido, los ordena en destino y controla el flujo y la congestión.', ej: 'Web, correo y transferencia de archivos' },
  { id: 'udp', cat: 'Transporte', prio: 'alta', t: 'UDP', q: 'Protocolo de transporte simple: <b>sin conexión y sin garantías</b>. Su header es de 8 bytes y tiene poca demora.', ej: 'Voz, video en tiempo real y DNS' },
  { id: 'handshake', cat: 'Transporte', prio: 'media', t: 'Handshake de 3 pasos', q: 'Así se abre una conexión TCP: el cliente manda SYN, el servidor responde SYN-ACK y el cliente cierra con ACK.', ej: 'SYN → SYN-ACK → ACK' },
  { id: 'ack', cat: 'Transporte', prio: 'media', t: 'ACK', q: 'Confirmación de que llegaron datos. El número de ACK es el <b>próximo byte que espera</b> el receptor.', ej: 'ACK = 1001 significa "recibí hasta el byte 1000"' },
  { id: 'flujo', cat: 'Transporte', prio: 'media', t: 'Control de flujo (Window)', q: 'El receptor avisa cuánto puede recibir (Window) y el emisor no manda más que eso. <b>Protege al receptor.</b>', ej: 'Window = 4000 → el emisor puede mandar hasta 4000 bytes sin esperar' },
  { id: 'congestion', cat: 'Transporte', prio: 'media', t: 'Control de congestión', q: 'TCP ajusta cuánto manda para no saturar la red. <b>Protege a la red.</b>', ej: 'No es lo mismo que el control de flujo' },
  { id: 'cwnd', cat: 'Transporte', prio: 'media', t: 'cwnd y ssthresh', q: '<code>cwnd</code> es la ventana de congestión: cuánto manda el emisor por vez. <code>ssthresh</code> es el umbral donde cambia la forma de crecer.', ej: 'cwnd < ssthresh → slow start · cwnd ≥ ssthresh → evitación de congestión' },
  { id: 'slow-start', cat: 'Transporte', prio: 'media', t: 'Slow start', q: 'Al arrancar, cwnd vale 1 MSS y <b>se duplica en cada RTT</b> hasta llegar a ssthresh.', ej: '1 → 2 → 4 → 8 …' },
  { id: 'evitacion', cat: 'Transporte', prio: 'media', t: 'Evitación de congestión', q: 'Pasado ssthresh, cwnd crece de a <b>1 MSS por RTT</b>. Es un crecimiento lento y parejo.', ej: '8 → 9 → 10 …' },
  { id: 'timeout-dup', cat: 'Transporte', prio: 'media', t: 'Timeout vs 3 ACK duplicados', q: 'En los dos casos ssthresh = cwnd ÷ 2. Con <b>timeout</b> (la red anda muy mal) cwnd vuelve a 1 y arranca slow start. Con <b>3 ACK duplicados</b> (pérdida leve) cwnd = ssthresh y sigue en evitación de congestión.', ej: 'cwnd = 16 → ssthresh = 8. Timeout: cwnd = 1. Tres ACK duplicados: cwnd = 8' },
  { id: 'rtt-rto-mss', cat: 'Transporte', prio: 'baja', t: 'RTT, RTO y MSS', q: 'RTT es el tiempo de ida y vuelta. RTO es cuánto espera TCP antes de retransmitir. MSS es el tamaño máximo de datos de un segmento.', ej: 'Si el ACK no llega antes del RTO, se retransmite' },

  /* Otros */
  { id: 'wifi', cat: 'Otros', prio: 'baja', t: 'WiFi 802.11 (lo mínimo)', q: 'El punto de acceso (AP) emite <b>beacons</b> para anunciarse. El estándar 802.11ac trabaja en <b>5 GHz</b>.', ej: 'Cayó una sola vez, en 2019' }
];
var CONC_CATS = ['Direcciones', 'Subneteo', 'Ruteo', 'Capa de red', 'Transporte', 'Otros'];

RENDER.conceptos = function () {
  var P = $('#conceptos'), done = store('conceptos') || [], filter = 'Todos', q = '';
  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  var chips = ['Todos', 'Lo más importante'].concat(CONC_CATS);
  function chipsHtml() { return chips.map(function (c) { return '<button class="chip" data-f="' + c + '" aria-pressed="' + (c === filter) + '">' + c + '</button>'; }).join(''); }
  P.innerHTML = '<div class="wrap"><main><section><div><div class="eyebrow">Conceptos</div><h2>Todo lo que tenés que entender, en corto</h2></div>' +
    '<p class="lead">' + CONCEPTOS.length + ' conceptos con una explicación simple y un ejemplo. Si tenés poco tiempo, tocá "Lo más importante". Tildá los que ya dominás.</p>' +
    '<div class="filters" id="c-chips" role="group" aria-label="Filtrar conceptos">' + chipsHtml() + '</div>' +
    '<div class="jump"><label for="c-search">Buscar</label><input class="in" id="c-search" type="search" placeholder="Ej.: broadcast, TTL, ACK" autocomplete="off" style="width:100%"></div>' +
    '<div class="q-score" id="c-count"></div></section>' +
    '<div class="concepts" id="c-list">' + CONCEPTOS.map(function (c) {
      return '<article class="concept" id="k-' + c.id + '"><div class="concept-head"><div><div class="eyebrow">' + c.cat + '</div><h3>' + c.t + '</h3></div><span class="tag ' + c.prio + '">' + c.prio + '</span>' +
        '<label class="mark"><input type="checkbox" data-id="' + c.id + '"> Lo domino</label></div>' +
        '<div class="body"><p>' + c.q + '</p><p class="muted"><b>Ejemplo:</b> ' + c.ej + '</p>' + (c.ojo ? '<div class="warn"><b>Ojo.</b> ' + c.ojo + '</div>' : '') + '</div></article>';
    }).join('') + '</div></main></div>';
  function apply() {
    var shown = 0, nq = norm(q);
    CONCEPTOS.forEach(function (c) {
      var el = document.getElementById('k-' + c.id), d = done.indexOf(c.id) >= 0;
      var okF = filter === 'Todos' || (filter === 'Lo más importante' ? c.prio === 'alta' : c.cat === filter);
      var okQ = !nq || norm(c.t + ' ' + c.q + ' ' + c.ej).indexOf(nq) >= 0;
      var show = okF && okQ; if (show) shown++;
      el.classList.toggle('hidden-by-filter', !show); el.classList.toggle('done', d); $('input', el).checked = d;
    });
    $('#c-count').textContent = shown + ' de ' + CONCEPTOS.length + ' conceptos · ' + done.length + ' dominados';
  }
  P.addEventListener('click', function (e) {
    var b = e.target.closest('#c-chips .chip'); if (!b) return;
    filter = b.dataset.f; $('#c-chips').innerHTML = chipsHtml(); apply();
  });
  P.addEventListener('input', function (e) { if (e.target.id === 'c-search') { q = e.target.value; apply(); } });
  P.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('.mark input')) {
      var id = t.dataset.id, i = done.indexOf(id);
      if (t.checked && i < 0) done.push(id); if (!t.checked && i >= 0) done.splice(i, 1);
      store('conceptos', done); apply();
    }
  });
  apply();
};

