/* lib.js — cálculo de redes (se usa en la página y en los tests de node) */
(function (root) {
  'use strict';
  var L = {};

  L.ipToInt = function (s) {
    var p = String(s).trim().split('.');
    if (p.length !== 4) return null;
    var n = 0;
    for (var i = 0; i < 4; i++) {
      if (!/^\d{1,3}$/.test(p[i])) return null;
      var v = parseInt(p[i], 10);
      if (v > 255) return null;
      n = n * 256 + v;
    }
    return n;
  };
  L.intToIp = function (n) {
    return [Math.floor(n / 16777216) % 256, Math.floor(n / 65536) % 256, Math.floor(n / 256) % 256, n % 256].join('.');
  };
  L.maskInt = function (p) { return p === 0 ? 0 : (p >= 32 ? 4294967295 : (4294967296 - Math.pow(2, 32 - p))); };
  L.maskStr = function (p) { return L.intToIp(L.maskInt(p)); };
  L.maskToPrefix = function (s) {
    var n = L.ipToInt(s); if (n === null) return null;
    for (var p = 0; p <= 32; p++) if (L.maskInt(p) === n) return p;
    return null;
  };

  /* info de una dirección con prefijo */
  L.info = function (ip, p) {
    var a = L.ipToInt(ip), size = Math.pow(2, 32 - p);
    var net = Math.floor(a / size) * size;
    var bc = net + size - 1;
    var hosts = p >= 31 ? (p === 31 ? 2 : 1) : size - 2;
    return {
      ip: ip, prefix: p, mask: L.maskStr(p), size: size,
      net: L.intToIp(net), bc: L.intToIp(bc),
      first: p >= 31 ? L.intToIp(net) : L.intToIp(net + 1),
      last: p >= 31 ? L.intToIp(bc) : L.intToIp(bc - 1),
      hosts: hosts, netInt: net, bcInt: bc, aInt: a,
      isNet: a === net, isBc: a === bc && p < 31
    };
  };

  /* dividir un bloque en N subredes (la numeración arranca en la 1ª = subred 0) */
  L.split = function (blockIp, blockPrefix, n) {
    var bits = 0; while (Math.pow(2, bits) < n) bits++;
    var np = blockPrefix + bits;
    var base = L.info(blockIp, blockPrefix).netInt;
    var size = Math.pow(2, 32 - np);
    var subs = [];
    for (var k = 0; k < Math.pow(2, bits); k++) {
      var s = L.info(L.intToIp(base + k * size), np);
      s.k = k + 1; subs.push(s);
    }
    return { bits: bits, prefix: np, mask: L.maskStr(np), size: size, hosts: size - 2, subs: subs, total: Math.pow(2, bits) };
  };

  /* ---------- decodificador de tramas ---------- */
  function hex2(b) { return (b < 16 ? '0' : '') + b.toString(16); }
  L.parseHex = function (txt) {
    var t = String(txt).replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*[0-9]+\s{2,}/, ' ');
    var m = t.match(/\b[0-9a-fA-F]{2}\b/g) || [];
    return m.map(function (x) { return parseInt(x, 16); });
  };
  function mac(b, o) { var r = []; for (var i = 0; i < 6; i++) r.push(hex2(b[o + i])); return r.join(':'); }
  function ip4(b, o) { return b[o] + '.' + b[o + 1] + '.' + b[o + 2] + '.' + b[o + 3]; }
  function u16(b, o) { return b[o] * 256 + b[o + 1]; }
  function u32(b, o) { return ((b[o] * 16777216) + (b[o + 1] << 16) + (b[o + 2] << 8) + b[o + 3]); }
  function bytesHex(b, o, n) { var r = []; for (var i = 0; i < n && o + i < b.length; i++) r.push(hex2(b[o + i])); return r.join(' '); }
  L.bytesHex = bytesHex;

  var PORTS = { 20: 'FTP-data', 21: 'FTP', 22: 'SSH', 23: 'Telnet', 25: 'SMTP', 53: 'DNS', 67: 'DHCP (server)', 68: 'DHCP (client)', 80: 'HTTP', 110: 'POP3', 123: 'NTP', 143: 'IMAP', 161: 'SNMP', 443: 'HTTPS' };
  L.portName = function (p) { return PORTS[p] ? p + ' (' + PORTS[p] + ')' : String(p); };

  function macKind(m) {
    if (m === 'ff:ff:ff:ff:ff:ff') return 'broadcast';
    var first = parseInt(m.slice(0, 2), 16);
    return (first & 1) ? 'multicast' : 'unicast';
  }

  /* devuelve {layers:[{name, rows:[[campo, hex, valor, nota]]}], notes:[...]} */
  L.decode = function (bytes) {
    var out = { layers: [], notes: [] };
    var b = bytes, n = b.length;
    if (n < 14) { out.notes.push('Trama demasiado corta para tener un encabezado Ethernet (14 bytes).'); return out; }
    var et = u16(b, 12);
    var dst = mac(b, 0), src = mac(b, 6);
    out.layers.push({
      name: 'Ethernet II (capa 2)', len: 14, rows: [
        ['MAC destino', bytesHex(b, 0, 6), dst, macKind(dst)],
        ['MAC origen', bytesHex(b, 6, 6), src, macKind(src)],
        ['EtherType', bytesHex(b, 12, 2), '0x' + hex2(b[12]) + hex2(b[13]), et === 0x0800 ? 'IPv4' : et === 0x0806 ? 'ARP' : et === 0x86dd ? 'IPv6' : et <= 1500 ? 'Longitud (802.3)' : 'otro']
      ]
    });
    var off = 14;
    if (et === 0x0806) {
      if (n < off + 28) { out.notes.push('ARP truncado.'); return out; }
      var op = u16(b, off + 6);
      out.layers.push({
        name: 'ARP (capa 2/3)', len: 28, rows: [
          ['Hardware type', bytesHex(b, off, 2), u16(b, off), u16(b, off) === 1 ? 'Ethernet' : ''],
          ['Protocol type', bytesHex(b, off + 2, 2), '0x' + hex2(b[off + 2]) + hex2(b[off + 3]), u16(b, off + 2) === 0x0800 ? 'IPv4' : ''],
          ['Hardware size', bytesHex(b, off + 4, 1), b[off + 4], 'bytes de una MAC'],
          ['Protocol size', bytesHex(b, off + 5, 1), b[off + 5], 'bytes de una IP'],
          ['Operación', bytesHex(b, off + 6, 2), op, op === 1 ? 'Request (¿quién tiene esta IP?)' : op === 2 ? 'Reply (yo la tengo)' : ''],
          ['MAC emisor', bytesHex(b, off + 8, 6), mac(b, off + 8), ''],
          ['IP emisor', bytesHex(b, off + 14, 4), ip4(b, off + 14), ''],
          ['MAC objetivo', bytesHex(b, off + 18, 6), mac(b, off + 18), op === 1 ? 'vacía: es lo que se pregunta' : ''],
          ['IP objetivo', bytesHex(b, off + 24, 4), ip4(b, off + 24), '']
        ]
      });
      if (n > off + 28) out.notes.push('Hay ' + (n - off - 28) + ' bytes de relleno (padding) después del ARP: Ethernet exige un mínimo de 46 bytes de datos, y el ARP ocupa solo 28.');
      return out;
    }
    if (et !== 0x0800) { out.notes.push('EtherType no soportado por este decodificador.'); return out; }
    if (n < off + 20) { out.notes.push('IPv4 truncado.'); return out; }
    var vihl = b[off], ver = vihl >> 4, ihl = (vihl & 15) * 4;
    var tos = b[off + 1], tl = u16(b, off + 2), id = u16(b, off + 4), ff = u16(b, off + 6);
    var flags = ff >> 13, fo = (ff & 0x1fff), ttl = b[off + 8], proto = b[off + 9], ck = u16(b, off + 10);
    var psrc = ip4(b, off + 12), pdst = ip4(b, off + 16);
    var protoName = proto === 1 ? 'ICMP' : proto === 6 ? 'TCP' : proto === 17 ? 'UDP' : proto === 2 ? 'IGMP' : proto === 89 ? 'OSPF' : String(proto);
    var dscp = tos >> 2;
    var dscpName = dscp === 46 ? 'EF (Expedited Forwarding)' : dscp === 0 ? 'Best effort' : dscp === 48 ? 'CS6' : dscp === 56 ? 'CS7' : '';
    out.layers.push({
      name: 'IPv4 (capa 3)', len: ihl, rows: [
        ['Versión / IHL', bytesHex(b, off, 1), ver + ' / ' + (vihl & 15), 'IHL × 4 = ' + ihl + ' bytes de cabecera' + (ihl > 20 ? ' (con opciones)' : ' (sin opciones)')],
        ['TOS / DSCP', bytesHex(b, off + 1, 1), '0x' + hex2(tos), 'DSCP ' + dscp + (dscpName ? ' = ' + dscpName : '') + ', ECN ' + (tos & 3)],
        ['Longitud total', bytesHex(b, off + 2, 2), tl, 'cabecera + datos'],
        ['Identificación', bytesHex(b, off + 4, 2), '0x' + hex2(b[off + 4]) + hex2(b[off + 5]), id],
        ['Flags / Offset', bytesHex(b, off + 6, 2), 'DF=' + ((flags >> 1) & 1) + ' MF=' + (flags & 1) + ' offset=' + fo, (flags & 2) ? 'No fragmentar' : 'Se puede fragmentar'],
        ['TTL', bytesHex(b, off + 8, 1), ttl, ''],
        ['Protocolo', bytesHex(b, off + 9, 1), proto, protoName],
        ['Checksum', bytesHex(b, off + 10, 2), '0x' + hex2(b[off + 10]) + hex2(b[off + 11]), ''],
        ['IP origen', bytesHex(b, off + 12, 4), psrc, ''],
        ['IP destino', bytesHex(b, off + 16, 4), pdst, ipKind(pdst)]
      ]
    });
    var t = off + ihl;
    if (fo !== 0) { out.notes.push('Es un fragmento (offset ≠ 0): no tiene encabezado de capa 4.'); return out; }
    if (proto === 17) {
      if (n < t + 8) { out.notes.push('UDP truncado.'); return out; }
      var sp = u16(b, t), dp = u16(b, t + 2), ul = u16(b, t + 4);
      out.layers.push({
        name: 'UDP (capa 4)', len: 8, rows: [
          ['Puerto origen', bytesHex(b, t, 2), L.portName(sp), sp > 1023 ? 'puerto efímero del cliente' : ''],
          ['Puerto destino', bytesHex(b, t + 2, 2), L.portName(dp), dp <= 1023 ? 'puerto bien conocido (servidor)' : ''],
          ['Longitud', bytesHex(b, t + 4, 2), ul, 'cabecera 8 + datos'],
          ['Checksum', bytesHex(b, t + 6, 2), '0x' + hex2(b[t + 6]) + hex2(b[t + 7]), '']
        ]
      });
      if (sp === 53 || dp === 53) dnsLayer(b, t + 8, out);
    } else if (proto === 6) {
      if (n < t + 20) { out.notes.push('TCP truncado.'); return out; }
      var sp2 = u16(b, t), dp2 = u16(b, t + 2), seq = u32(b, t + 4), ack = u32(b, t + 8);
      var doff = (b[t + 12] >> 4) * 4, fl = b[t + 13], win = u16(b, t + 14);
      var names = [[0x80, 'CWR'], [0x40, 'ECE'], [0x20, 'URG'], [0x10, 'ACK'], [0x08, 'PSH'], [0x04, 'RST'], [0x02, 'SYN'], [0x01, 'FIN']];
      var fs = names.filter(function (x) { return fl & x[0]; }).map(function (x) { return x[1]; }).join(' + ');
      var kind = (fl & 0x12) === 0x12 ? 'SYN-ACK: 2º paso del handshake' : (fl & 0x12) === 0x02 ? 'SYN: 1º paso del handshake' : (fl & 0x11) === 0x11 ? 'FIN-ACK: cierre' : (fl & 0x10) ? 'ACK' : '';
      var rows = [
        ['Puerto origen', bytesHex(b, t, 2), L.portName(sp2), sp2 > 1023 ? 'puerto efímero del cliente' : 'puerto de servidor'],
        ['Puerto destino', bytesHex(b, t + 2, 2), L.portName(dp2), dp2 <= 1023 ? 'puerto bien conocido (servidor)' : ''],
        ['Nº de secuencia', bytesHex(b, t + 4, 4), seq, ''],
        ['Nº de ACK', bytesHex(b, t + 8, 4), ack, (fl & 0x10) ? 'próximo byte que espera recibir' : 'sin ACK: el campo no vale'],
        ['Offset / flags', bytesHex(b, t + 12, 2), 'offset=' + (doff / 4) + ' (' + doff + ' bytes)  flags=0x' + hex2(fl), fs + (kind ? ' → ' + kind : '')],
        ['Ventana', bytesHex(b, t + 14, 2), win, 'bytes que el emisor está dispuesto a recibir'],
        ['Checksum', bytesHex(b, t + 16, 2), '0x' + hex2(b[t + 16]) + hex2(b[t + 17]), '']
      ];
      if (doff > 20 && n >= t + doff) {
        var o = t + 20, opt = [];
        while (o < t + doff) {
          var k = b[o];
          if (k === 0) break;
          if (k === 1) { opt.push('NOP'); o++; continue; }
          var len = b[o + 1]; if (!len) break;
          if (k === 2) opt.push('MSS=' + u16(b, o + 2));
          else if (k === 4) opt.push('SACK permitido');
          else if (k === 3) opt.push('Escala de ventana=' + b[o + 2]);
          else opt.push('opción ' + k);
          o += len;
        }
        rows.push(['Opciones', bytesHex(b, t + 20, doff - 20), opt.join(', '), '']);
      }
      out.layers.push({ name: 'TCP (capa 4)', len: doff, rows: rows });
      var pl = off + tl - t - doff;
      var avail = Math.max(0, Math.min(n - (t + doff), pl));
      if (avail > 0) {
        var txt = '';
        for (var i = 0; i < avail; i++) { var c = b[t + doff + i]; txt += (c >= 32 && c < 127) ? String.fromCharCode(c) : (c === 10 || c === 13 ? '↵' : '·'); }
        out.layers.push({ name: 'Datos (capa 7)', len: avail, rows: [['Contenido', '', txt.length > 200 ? txt.slice(0, 200) + '…' : txt, dp2 === 80 ? 'HTTP: pedido GET' : '']] });
      }
      if (n < off + tl) out.notes.push('La captura está cortada: la longitud total dice ' + tl + ' bytes de IP y solo hay ' + (n - off) + '.');
    } else if (proto === 1) {
      if (n < t + 8) { out.notes.push('ICMP truncado.'); return out; }
      var ty = b[t], co = b[t + 1];
      var tyn = ty === 8 ? 'Echo Request (ping)' : ty === 0 ? 'Echo Reply' : ty === 11 ? 'Time Exceeded (TTL llegó a 0)' : ty === 3 ? 'Destination Unreachable' : '';
      out.layers.push({
        name: 'ICMP (capa 3)', len: 8, rows: [
          ['Tipo', bytesHex(b, t, 1), ty, tyn],
          ['Código', bytesHex(b, t + 1, 1), co, ''],
          ['Checksum', bytesHex(b, t + 2, 2), '0x' + hex2(b[t + 2]) + hex2(b[t + 3]), ''],
          ['Identificador', bytesHex(b, t + 4, 2), u16(b, t + 4), ''],
          ['Nº de secuencia', bytesHex(b, t + 6, 2), u16(b, t + 6), '']
        ]
      });
    }
    return out;
  };
  function ipKind(s) {
    var a = L.ipToInt(s);
    if (a === 4294967295) return 'broadcast limitado';
    if (a >= 3758096384 && a < 4026531840) return 'multicast (clase D)';
    return '';
  }
  function dnsLayer(b, o, out) {
    if (b.length < o + 12) return;
    var fl = u16(b, o + 2), qd = u16(b, o + 4), an = u16(b, o + 6);
    var qr = (fl >> 15) & 1;
    var name = '', p = o + 12;
    while (p < b.length && b[p] !== 0) {
      var l = b[p++]; if (l >= 192) { p++; break; }
      for (var i = 0; i < l && p < b.length; i++) name += String.fromCharCode(b[p++]);
      name += '.';
    }
    name = name.replace(/\.$/, '');
    out.layers.push({
      name: 'DNS (capa 7)', len: b.length - o, rows: [
        ['ID', bytesHex(b, o, 2), '0x' + hex2(b[o]) + hex2(b[o + 1]), 'se repite en la respuesta'],
        ['Flags', bytesHex(b, o + 2, 2), '0x' + hex2(b[o + 2]) + hex2(b[o + 3]), qr ? 'Respuesta' : 'Consulta'],
        ['Preguntas / Respuestas', bytesHex(b, o + 4, 4), qd + ' / ' + an, ''],
        ['Nombre consultado', '', name, 'tipo A (IPv4), clase IN']
      ]
    });
  }

  /* ---------- fragmentación ---------- */
  L.fragment = function (dataBytes, mtu, ipHdr) {
    var maxData = Math.floor((mtu - ipHdr) / 8) * 8;
    var frags = [], off = 0;
    while (off < dataBytes) {
      var d = Math.min(maxData, dataBytes - off);
      var more = (off + d) < dataBytes ? 1 : 0;
      frags.push({ n: frags.length + 1, data: d, total: d + ipHdr, mf: more, offset: off / 8, startByte: off });
      off += d;
    }
    return { maxData: maxData, frags: frags };
  };

  /* ---------- TCP: slow start / congestion avoidance ---------- */
  /* devuelve la secuencia de cwnd por RTT */
  L.cwndTrace = function (rounds, ssthresh, events, init) {
    var cw = init || 1, th = ssthresh, out = [];
    for (var r = 1; r <= rounds; r++) {
      out.push({ rtt: r, cwnd: cw, ssthresh: th, event: (events && events[r]) || '' });
      var ev = events && events[r];
      if (ev === 'timeout') { th = Math.max(Math.floor(cw / 2), 2); cw = 1; }
      else if (ev === 'dup3') { th = Math.max(Math.floor(cw / 2), 2); cw = th; }
      else if (cw < th) { cw = Math.min(cw * 2, th); }
      else { cw = cw + 1; }
    }
    return out;
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = L; else root.NL = L;
})(typeof window !== 'undefined' ? window : this);
