/* ============ SKILL ============ */
RENDER.skill = function () {
  var P = $('#skill');
  var CMD = '/practica-redes-parcial';
  var TYPES = [
    ['sub', 'Subneteo de un bloque en N subredes'],
    ['rut', 'Tabla de ruteo con 3 routers'],
    ['ios', 'Elegir el ip route correcto y comandos IOS'],
    ['mc', 'Multiple choice teórico'],
    ['bc', 'Broadcast con máscara no estándar y host válido'],
    ['tcp', 'Explicar TCP vs UDP (desarrollo)']
  ];
  var done = store('skill') || [];
  var html = '';

  html += `<section><div><div class="eyebrow">Skill</div><h2>Práctica con Claude</h2></div>
    <p class="lead">Es una skill de Claude que te toma ejercicios nuevos con el formato de los parciales, calcula la solución con código y te corrige paso a paso. Acá está todo lo necesario para usarla y la hoja de trucos para repasar sin abrir el chat.</p>
    <div class="cmdrow"><pre id="skill-cmd">${CMD}</pre><button class="btn primary" id="skill-copy" type="button">Copiar comando</button><span class="muted" id="skill-copied"></span></div>
    <ol class="steps">
      <li>En el chat de Claude escribí el comando de arriba.</li>
      <li>Contestá cuánto tiempo tenés para repasar. Con eso elige el modo.</li>
      <li>Diagnóstico: un ejercicio corto de cada tipo prioritario. Contestá con lo que tengas, aunque te falte algo.</li>
      <li>Te corrige punto por punto y repite solo lo que fallaste. Si acertás un tipo dos veces seguidas, se da por listo.</li>
      <li>Al final te deja la hoja de una pantalla. La versión de esta web está más abajo.</li>
    </ol></section>`;

  html += `<section id="skill-que"><div><div class="eyebrow">Qué se practica</div><h2>Solo lo que se repite</h2></div>
    <p class="lead">Ordenado por cuántos parciales lo tomaron (2017, 2019, 2022, 2024 y recuperatorio 2025). Lo que no está en la tabla queda afuera.</p>
    <div class="tbl"><table><thead><tr><th>#</th><th>Ejercicio</th><th>Apareció en</th><th>Practicarlo acá</th></tr></thead><tbody>
    <tr><td>1</td><td><b>Subneteo</b> <span class="tag alta">alta</span><br>máscara, red de la subred K, rango de hosts, broadcast, gateway, a qué subred pertenece una IP</td><td>5 de 5</td><td><a href="#guiada">Práctica guiada</a> · <a href="#subneteo">Subneteo</a></td></tr>
    <tr><td>2</td><td><b>Tabla de ruteo, 3 routers</b> <span class="tag alta">alta</span><br>destino, gateway e interfaz de 1 o 2 routers</td><td>5 de 5</td><td><a href="#guiada">Práctica guiada</a> · <a href="#ruteo">Ruteo</a></td></tr>
    <tr><td>3</td><td><b>ip route correcto y comandos IOS</b> <span class="tag alta">alta</span><br>red vs host, máscara, next hop, ruta por defecto, configurar una interfaz</td><td>4 de 5</td><td><a href="#guiada">Práctica guiada</a> · <a href="#ruteo">Ruteo</a></td></tr>
    <tr><td>4</td><td><b>Multiple choice teórico</b> <span class="tag media">media</span><br>IPv6 sin broadcast, TCP y UDP, header IPv4, RFC 1918, hosts por máscara, ARP/NDP, loopback ::1</td><td>3 o 4 de 5</td><td><a href="#quizzes">Quizzes</a></td></tr>
    <tr><td>5</td><td><b>Broadcast con /18 o /20 y host válido</b> <span class="tag media">media</span></td><td>2 de 5</td><td><a href="#subneteo">Subneteo</a></td></tr>
    <tr><td>6</td><td><b>Explicar TCP vs UDP</b> <span class="tag media">media</span><br>pregunta de desarrollo</td><td>1 de 5 (2025)</td><td><a href="#teoria">Teoría</a></td></tr>
    </tbody></table></div>
    <div class="warn"><b>Fuera de la práctica</b> salvo que sobre tiempo: WiFi 802.11 (cayó una sola vez), congestión y slow start en detalle, y fragmentación IPv4.</div></section>`;

  html += `<section id="skill-tiempo"><div><div class="eyebrow">Modo según el tiempo</div><h2>Cuánto practicar</h2></div><div class="plan">
    <div class="day"><div class="d">Menos de 2 h<span>modo corto</span></div><div>Solo los tipos 1 a 4. Diagnóstico rápido y después insistir en lo que falla.</div></div>
    <div class="day"><div class="d">2 a 4 h<span>modo medio</span></div><div>Tipos 1 a 5. El 6 como pregunta de repaso oral.</div></div>
    <div class="day"><div class="d">Más de 4 h<span>modo completo</span></div><div>Todo lo de la tabla. Recién al final, lo que quedó afuera si querés.</div></div>
    </div></section>`;

  html += `<section id="skill-hoja"><div><div class="eyebrow">Hoja de una pantalla</div><h2>Lo necesario para repasar</h2></div>
    <div class="skill-cols">
    <div class="skill-box"><h3>Subneteo en 7 pasos</h3>
      <ol class="steps">
        <li>Bits a prestar <code>n</code>: el menor con 2<sup>n</sup> ≥ cantidad de subredes.</li>
        <li>Máscara nueva = /original + n.</li>
        <li>Tamaño de bloque = 2<sup>(32 − prefijo)</sup> direcciones. En el octeto que cambia: 256 − valor de la máscara.</li>
        <li>Subred K (desde 1): red = base + (K − 1) × bloque.</li>
        <li>Broadcast = red de la subred siguiente − 1.</li>
        <li>Hosts = red + 1 hasta broadcast − 1. Gateway = primer host, salvo que el enunciado diga otra cosa.</li>
        <li>A qué subred pertenece una IP: ⌊(IP − base) / bloque⌋ + 1.</li>
      </ol>
      <h4>Ejemplo resuelto</h4>
      <pre>192.168.10.0/24 en 6 subredes
n = 3 (2^3 = 8 ≥ 6)  →  /27 = 255.255.255.224
bloque = 32
subred 4: red 192.168.10.96/27
hosts     192.168.10.97 a 192.168.10.126
broadcast 192.168.10.127
gateway   192.168.10.97
IP 192.168.10.150 → ⌊150/32⌋ + 1 = subred 5</pre>
    </div>
    <div class="skill-box"><h3>Máscaras y hosts</h3>
      <div class="tbl"><table><thead><tr><th>Prefijo</th><th>Máscara</th><th>Hosts</th></tr></thead><tbody>
      <tr><td>/18</td><td>255.255.192.0</td><td>16382</td></tr>
      <tr><td>/20</td><td>255.255.240.0</td><td>4094</td></tr>
      <tr><td>/24</td><td>255.255.255.0</td><td>254</td></tr>
      <tr><td>/25</td><td>255.255.255.128</td><td>126</td></tr>
      <tr><td>/26</td><td>255.255.255.192</td><td>62</td></tr>
      <tr><td>/27</td><td>255.255.255.224</td><td>30</td></tr>
      <tr><td>/28</td><td>255.255.255.240</td><td>14</td></tr>
      <tr><td>/29</td><td>255.255.255.248</td><td>6</td></tr>
      <tr><td>/30</td><td>255.255.255.252</td><td>2</td></tr>
      </tbody></table></div>
      <p class="muted">Hosts = 2<sup>(32 − prefijo)</sup> − 2.</p>
      <h4>Host válido y broadcast</h4>
      <p>Host válido: bits de host que no sean todos 0 (red) ni todos 1 (broadcast).</p>
      <pre>200.30.63.255/18
/18 → bloque de 64 en el 3er octeto
red 200.30.0.0/18, broadcast 200.30.63.255
→ es el broadcast, NO es host válido</pre>
    </div>
    <div class="skill-box"><h3>Tabla de ruteo</h3>
      <ul class="steps">
        <li><b>Red conectada:</b> gateway "—" e interfaz propia de esa red.</li>
        <li><b>Red remota:</b> gateway = IP del router vecino en el enlace compartido. Interfaz = la propia que sale hacia ese vecino.</li>
        <li><b>Ruta por defecto:</b> 0.0.0.0/0 hacia el router que lleva al resto.</li>
      </ul>
      <h4>Trampas en las opciones de ip route</h4>
      <ul class="steps">
        <li>La red destino lleva la dirección de red, no una IP de host (salvo /32 si dicen host).</li>
        <li>La máscara es la de la red destino, no la de tu interfaz.</li>
        <li>El next hop es la IP del vecino. No una IP propia del router ni una de la red destino.</li>
      </ul>
    </div>
    <div class="skill-box"><h3>Comandos Cisco IOS</h3>
      <pre>Router&gt; enable
Router# configure terminal
Router(config)# interface gigabitEthernet 0/0
Router(config-if)# ip address 192.168.10.97 255.255.255.224
Router(config-if)# no shutdown
Router(config-if)# exit
Router(config)# ip route 10.0.0.0 255.255.255.0 192.168.10.98
Router(config)# ip route 0.0.0.0 0.0.0.0 192.168.10.98</pre>
      <p class="muted">Las dos últimas: ruta estática a una red y ruta por defecto. La IP va siempre con máscara. Sin <code>no shutdown</code> la interfaz queda apagada.</p>
    </div>
    </div>
    <div class="tbl"><table><thead><tr><th>Multiple choice teórico</th><th>Qué recordar</th></tr></thead><tbody>
    <tr><td><b>IPv6</b></td><td>No tiene broadcast (usa multicast). Loopback <code>::1</code>. Hop Limit equivale al TTL. Neighbor Discovery reemplaza a ARP.</td></tr>
    <tr><td><b>ARP</b></td><td>Resuelve la MAC de una IP dentro de la red local. Request por broadcast, reply por unicast.</td></tr>
    <tr><td><b>Header IPv4</b></td><td>Campos: Versión, TTL, Protocolo, Checksum, Dirección origen y destino. Cada router le resta 1 al TTL.</td></tr>
    <tr><td><b>RFC 1918</b></td><td><code>10.0.0.0/8</code> · <code>172.16.0.0/12</code> (172.16.0.0 a 172.31.255.255) · <code>192.168.0.0/16</code></td></tr>
    <tr><td><b>Loopback IPv4</b></td><td><code>127.0.0.0/8</code></td></tr>
    <tr><td><b>TCP</b></td><td>Orientado a conexión (handshake: SYN, SYN-ACK, ACK). Flujo de bytes. Numera segmentos y los ordena en destino. Confiable: ACK y retransmisión. Control de flujo y de congestión.</td></tr>
    <tr><td><b>UDP</b></td><td>Sin conexión. Sin garantía de entrega ni de orden. Header de 8 bytes. Menor demora.</td></tr>
    </tbody></table></div>
    <div class="warn"><b>Ojo.</b> En 2025 la afirmación decía que el loopback de IPv6 es <code>::0</code>: es falsa, es <code>::1</code>. Y esa vez preguntaron las características de UDP, no las de TCP.</div>
    <div class="skill-box"><h3>Respuesta modelo: TCP vs UDP</h3>
      <ul class="steps">
        <li>TCP está orientado a conexión (handshake de 3 pasos). UDP no.</li>
        <li>TCP es confiable: numera segmentos, usa ACK, retransmite y ordena en destino. UDP no garantiza entrega ni orden.</li>
        <li>TCP hace control de flujo y de congestión. UDP no.</li>
        <li>UDP tiene header más chico y menos demora. Sirve para voz, video, DNS. TCP para web, correo, transferencia de archivos.</li>
      </ul>
    </div></section>`;

  html += `<section id="skill-avance"><div><div class="eyebrow">Mi avance</div><h2>Tildá cuando aciertes dos seguidas</h2></div>
    <p class="lead">Es la misma regla de la skill: tipo que aciertes dos veces seguidas, tipo que dejás de practicar. Queda guardado en este navegador.</p>
    <div class="skill-track" id="skill-track">` +
    TYPES.map(function (t) { return '<label class="mark"><input type="checkbox" data-id="' + t[0] + '"' + (done.indexOf(t[0]) >= 0 ? ' checked' : '') + '> ' + esc(t[1]) + '</label>'; }).join('') +
    `</div><div class="skill-count" id="skill-count"></div></section>`;

  P.innerHTML = '<div class="wrap"><main>' + html + '</main></div>';

  function count() { $('#skill-count').textContent = done.length + ' de ' + TYPES.length + ' tipos dominados'; }
  count();
  P.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('#skill-track input')) {
      var id = t.dataset.id, i = done.indexOf(id);
      if (t.checked && i < 0) done.push(id);
      if (!t.checked && i >= 0) done.splice(i, 1);
      store('skill', done); count();
    }
  });
  $('#skill-copy').addEventListener('click', function () {
    var msg = $('#skill-copied');
    try {
      navigator.clipboard.writeText(CMD).then(function () { msg.textContent = 'Copiado'; }, function () { msg.textContent = 'No se pudo copiar, seleccionalo a mano'; });
    } catch (err) { msg.textContent = 'No se pudo copiar, seleccionalo a mano'; }
  });
};
