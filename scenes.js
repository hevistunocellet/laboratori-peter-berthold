/* Escenes de la cambra central (canvas 2D). render(ctx, W, H, scene, p, t, look)
   p = progrés de l'experiment (0..1), t = temps en ms (animacions ambientals). Tot és esquemàtic. */
window.LAB = window.LAB || {};
(function () {
  var TAU = Math.PI * 2;
  function rad(d) { return d * Math.PI / 180; }
  function vx(d) { return Math.sin(rad(d)); }
  function vy(d) { return -Math.cos(rad(d)); }
  function rng(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
  function txt(c, s, x, y, col, size, al, bold) {
    c.fillStyle = col || "#fff"; c.font = (bold ? "700 " : "") + (size || 14) + "px system-ui, sans-serif"; c.textAlign = al || "center"; c.textBaseline = "middle"; c.fillText(s, x, y);
  }
  function arrow(c, x1, y1, x2, y2, col, w, dash) {
    var a = Math.atan2(y2 - y1, x2 - x1);
    c.strokeStyle = col; c.fillStyle = col; c.lineWidth = w || 3; c.setLineDash(dash || []);
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.setLineDash([]);
    c.beginPath(); c.moveTo(x2, y2); c.lineTo(x2 - 11 * Math.cos(a - 0.4), y2 - 11 * Math.sin(a - 0.4)); c.lineTo(x2 - 11 * Math.cos(a + 0.4), y2 - 11 * Math.sin(a + 0.4)); c.closePath(); c.fill();
  }
  function bg(c, W, H, a, b) { var g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, a); g.addColorStop(1, b); c.fillStyle = g; c.fillRect(0, 0, W, H); }
  function ease(x) { return x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x); }
  function pin(c, x, y, label, col) { c.fillStyle = col || "#e8c63a"; c.beginPath(); c.arc(x, y, 6, 0, TAU); c.fill(); c.strokeStyle = "#0008"; c.lineWidth = 1.5; c.stroke(); txt(c, label, x, y - 16, "#fff", 12, "center", true); }
  function compassRing(c, cx, cy, R, col) {
    c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke();
    var L = [["N", 0], ["E", 90], ["S", 180], ["O", 270]];
    L.forEach(function (q) { txt(c, q[0], cx + vx(q[1]) * (R + 16), cy + vy(q[1]) * (R + 16), col, 14, "center", true); });
    for (var d = 0; d < 360; d += 30) { c.beginPath(); c.moveTo(cx + vx(d) * (R - 7), cy + vy(d) * (R - 7)); c.lineTo(cx + vx(d) * R, cy + vy(d) * R); c.stroke(); }
  }

  var S = {};

  S.idle = function (c, W, H, sc, p, t, look) {
    bg(c, W, H, "#1d2b27", "#12201c");
    c.strokeStyle = "rgba(255,255,255,.05)"; c.lineWidth = 1;
    for (var x = 0; x < W; x += 40) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
    for (var y = 0; y < H; y += 40) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    c.save(); c.globalAlpha = 0.9;
    if (look) LAB.drawBird(c, W / 2, H / 2 + 10 + Math.sin(t / 500) * 3, Math.min(W, H) * 0.3, look);
    c.restore();
    if (!look) txt(c, "Cambra experimental", W / 2, H / 2, "rgba(255,255,255,.35)", 22, "center", true);
  };

  S.rose = function (c, W, H, sc, p, t, look) {
    var cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.36, i;
    var cue = sc.cue, r = rng(42);
    if (cue === "stars") {
      bg(c, W, H, "#050a1c", "#13204a");
      var rr = rng(7); for (i = 0; i < 90; i++) { var a = rr() * TAU, d = rr() * Math.max(W, H) * 0.6, tw = 0.5 + 0.5 * Math.sin(t / 400 + i);
        c.fillStyle = "rgba(255,255,230," + (0.35 + tw * 0.5) + ")"; c.fillRect(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.7, 2, 2); }
      var nx = cx + vx(sc.rot) * (R + 38), ny = Math.max(34, Math.min(H - 24, cy + vy(sc.rot) * (R + 38)));
      pin(c, nx, ny, "Nord del cel", "#ffe27a");
      txt(c, sc.rot ? "Planetari: nord-sud girats" : "Cel natural", cx, 20, "#bcd", 14, "center", true);
    } else if (cue === "sun") {
      bg(c, W, H, "#7fc4ea", "#d9efe4");
      var sx = cx + vx(sc.sunAz) * (R + 50), sy = cy + vy(sc.sunAz) * (R + 50);
      c.fillStyle = "#ffd23a"; c.beginPath(); c.arc(sx, sy, 20, 0, TAU); c.fill();
      for (i = 0; i < 12; i++) { c.strokeStyle = "#ffd23a"; c.lineWidth = 2; c.beginPath(); c.moveTo(sx + Math.cos(i * TAU / 12) * 26, sy + Math.sin(i * TAU / 12) * 26); c.lineTo(sx + Math.cos(i * TAU / 12) * 34, sy + Math.sin(i * TAU / 12) * 34); c.stroke(); }
      if (sc.mirror) { var fa = (sc.sunAz - 113 + 360) % 360, fx = cx + vx(fa) * (R + 50), fy = cy + vy(fa) * (R + 50);
        c.globalAlpha = .55; c.fillStyle = "#fff"; c.beginPath(); c.arc(fx, fy, 20, 0, TAU); c.fill(); c.globalAlpha = 1;
        arrow(c, sx, sy, fx, fy, "#ffffff", 2, [6, 5]);
        c.save(); c.translate((sx + fx) / 2, (sy + fy) / 2); c.rotate(Math.atan2(fy - sy, fx - sx)); c.fillStyle = "#cfe3ee"; c.strokeStyle = "#456"; c.lineWidth = 2; c.fillRect(-26, -4, 52, 8); c.strokeRect(-26, -4, 52, 8); c.restore();
        txt(c, "Mirall: sol aparent", fx, fy + (fy > cy ? 34 : -34), "#134", 12, "center", true); }
      txt(c, sc.mirror ? "Sol desviat amb miralls" : "Cel natural", cx, 20, "#134", 14, "center", true);
    } else if (cue === "magnet") {
      bg(c, W, H, "#1d2230", "#101520");
      c.strokeStyle = "#e0a95a"; c.lineWidth = 3; var cw = R + 40;
      c.strokeRect(cx - cw, cy - cw * 0.7, cw * 2, cw * 1.4);
      c.strokeStyle = "#6fb8ff"; c.lineWidth = 1.5; c.setLineDash([4, 4]);
      for (i = -2; i <= 2; i++) { var ox = vx(sc.fieldRot + 90) * i * 32, oy = vy(sc.fieldRot + 90) * i * 32;
        arrow(c, cx + ox - vx(sc.fieldRot) * (R + 30), cy + oy - vy(sc.fieldRot) * (R + 30), cx + ox + vx(sc.fieldRot) * (R + 30), cy + oy + vy(sc.fieldRot) * (R + 30), "#6fb8ff", 1.5, [4, 4]); }
      c.setLineDash([]);
      txt(c, sc.fieldRot ? "Camp magnètic desviat a l'oest" : "Camp magnètic normal", cx, 20, "#d9e6ff", 14, "center", true);
      txt(c, "N magnètic", cx + vx(sc.fieldRot) * (R + 50), cy + vy(sc.fieldRot) * (R + 50), "#6fb8ff", 12, "center", true);
    } else if (cue === "genes") {
      bg(c, W, H, "#e8e2cc", "#cfc6a5");
      txt(c, "Cria en captivitat", cx, 20, "#4a4228", 14, "center", true);
      if (sc.label) txt(c, "Direcció: " + sc.label, cx, H - 20, "#4a4228", 13, "center", true);
    } else { // cage
      if (sc.day) bg(c, W, H, "#9fd0e8", "#e6f1e2"); else { bg(c, W, H, "#0a1030", "#1a2250"); c.fillStyle = "#f4efcb"; c.beginPath(); c.arc(W - 60, 50, 22, 0, TAU); c.fill(); }
      txt(c, sc.day ? "Gàbia, de dia" : "Gàbia, de nit", cx, 20, sc.day ? "#134" : "#bcd", 14, "center", true);
    }
    var dark = (cue === "stars" || cue === "magnet" || (cue === "cage" && !sc.day));
    var lineCol = dark ? "rgba(255,255,255,.7)" : "rgba(20,40,50,.75)";
    // arena
    c.fillStyle = dark ? "rgba(255,255,255,.07)" : "rgba(255,255,255,.35)"; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill();
    compassRing(c, cx, cy, R, lineCol);
    // salts (punts a la vora, un per un)
    var n = 30, show = Math.floor(n * ease(p * 1.3));
    var dirs = sc.dirs || [];
    for (i = 0; i < show; i++) {
      var base = dirs.length ? dirs[i % dirs.length] + (r() + r() + r() - 1.5) * 52 : r() * 360;
      var dist = R * (0.55 + 0.4 * r());
      var x = cx + vx(base) * dist, y = cy + vy(base) * dist;
      c.fillStyle = dirs.length ? "#ffcf4a" : "rgba(180,190,200,.9)"; c.beginPath(); c.arc(x, y, 3.6, 0, TAU); c.fill();
      c.strokeStyle = dirs.length ? "rgba(255,207,74,.35)" : "rgba(200,200,200,.25)"; c.lineWidth = 1; c.beginPath(); c.moveTo(cx, cy); c.lineTo(x, y); c.stroke();
    }
    if (dirs.length && p > 0.6) { var q = ease((p - 0.6) / 0.4); dirs.forEach(function (d) { arrow(c, cx, cy, cx + vx(d) * R * q, cy + vy(d) * R * q, "#ff5a3c", 4); }); }
    if (!dirs.length && p > 0.7) txt(c, sc.msg != null ? sc.msg : (sc.cloud ? "Sense cel: sense pista visual" : "Sense direcció clara"), cx, H - 22, "#ff9c7a", 14, "center", true);
    if (sc.cloud) { c.fillStyle = "rgba(190,200,215,.55)"; for (i = 0; i < 6; i++) { c.beginPath(); c.ellipse(cx - 160 + i * 64, 80 + (i % 2) * 24, 55, 22, 0, 0, TAU); c.fill(); } }
    if (look && sc.shades) look = Object.assign({}, look, { shades: true });
    if (look) LAB.drawBird(c, cx, cy + 6, R * 0.55, look, { flip: (dirs.length && vx(dirs[0]) < 0) ? -1 : 1 });
  };

  S.map = function () {};

  S.plume = function (c, W, H, sc, p, t, look) {
    if (sc.sea) { bg(c, W, H, "#9fd3ea", "#2a6f93"); c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = 2;
      for (var wy = H * 0.6; wy < H; wy += 28) { c.beginPath(); for (var x = 0; x <= W; x += 10) c.lineTo(x, wy + Math.sin((x + t / 30 + wy) / 22) * 4); c.stroke(); } }
    else bg(c, W, H, "#cfe7d4", "#97b98c");
    var sx = 70, sy = H * 0.55, bx = W - 130, by = H * 0.5;
    c.fillStyle = "#8a5a3a"; c.beginPath(); c.arc(sx, sy + 8, 22, Math.PI, 0); c.fill(); txt(c, sc.sea ? "Aliment" : "Origen de l'olor", sx, sy + 38, "#123", 12, "center", true);
    var r = rng(5), i;
    for (i = 0; i < 70; i++) { var u = ((r() * 1 + t / 3500 * (0.6 + r() * 0.5)) % 1), px = sx + u * (bx - sx), spread = u * 60;
      var py = sy + (r() - 0.5) * spread + Math.sin(u * 10 + i) * 10 - u * 20; var blocked = (sc.tank || sc.blocked) && px > bx - 90;
      if (px > bx - 20) continue; c.fillStyle = blocked ? "rgba(120,120,120,.0)" : "rgba(120,60,160," + (0.55 * (1 - u * 0.5)) + ")"; c.beginPath(); c.arc(px, py, 3.2, 0, TAU); c.fill(); }
    if (sc.blocked) { txt(c, "Olfacte bloquejat", bx - 60, by - 74, "#8a2a18", 14, "center", true); c.strokeStyle = "#c0392b"; c.lineWidth = 5; c.beginPath(); c.moveTo(bx - 100, by - 56); c.lineTo(bx - 70, by - 26); c.moveTo(bx - 70, by - 56); c.lineTo(bx - 100, by - 26); c.stroke(); }
    if (sc.tank) { c.fillStyle = "#4a6fa5"; c.fillRect(bx - 100, by - 60, 36, 120); c.strokeStyle = "#fff"; c.lineWidth = 2; c.strokeRect(bx - 100, by - 60, 36, 120); txt(c, "Aire de", bx - 82, by - 8, "#fff", 11, "center", true); txt(c, "bombona", bx - 82, by + 8, "#fff", 11, "center", true); }
    if (look) LAB.drawBird(c, bx, by, 80, look, { flip: -1 });
  };

  S.clock = function (c, W, H, sc, p, t, look) {
    bg(c, W, H, "#a8d4ee", "#e4efdc");
    var gy = H * 0.72; c.fillStyle = "#7fae6b"; c.fillRect(0, gy, W, H - gy);
    // sol al cel (arc)
    function sunPos(h) { var a = (h - 6) / 12 * Math.PI; return [W / 2 - Math.cos(a) * (W * 0.38), gy - Math.sin(a) * (gy - 50)]; }
    c.strokeStyle = "rgba(255,255,255,.7)"; c.setLineDash([5, 6]); c.beginPath(); for (var h = 6; h <= 18; h += 0.25) { var q = sunPos(h); if (h === 6) c.moveTo(q[0], q[1]); else c.lineTo(q[0], q[1]); } c.stroke(); c.setLineDash([]);
    var s1 = sunPos(sc.local); c.fillStyle = "#ffd23a"; c.beginPath(); c.arc(s1[0], s1[1], 20, 0, TAU); c.fill(); txt(c, "Sol real: " + sc.local + " h", s1[0], s1[1] - 32, "#134", 12, "center", true);
    if (sc.west) { var s2 = sunPos(Math.min(sc.body, 18.4)); c.globalAlpha = 0.5; c.fillStyle = "#fff"; c.beginPath(); c.arc(s2[0], s2[1], 20, 0, TAU); c.fill(); c.globalAlpha = 1;
      txt(c, "On l'esperaria (" + sc.body + " h)", s2[0], s2[1] - 32, "#134", 12, "center", true); }
    function clockAt(x, y, h, label) {
      c.fillStyle = "#fff"; c.strokeStyle = "#345"; c.lineWidth = 3; c.beginPath(); c.arc(x, y, 34, 0, TAU); c.fill(); c.stroke();
      var a = (h % 12) / 12 * TAU; arrow(c, x, y, x + Math.sin(a) * 22, y - Math.cos(a) * 22, "#c0392b", 3); arrow(c, x, y, x, y - 28, "#345", 2);
      txt(c, label + " · " + h + " h", x, y + 50, "#123", 12, "center", true);
    }
    clockAt(90, 90, sc.local, "Lloc"); clockAt(W - 90, 90, sc.body, "Cos");
    if (look) LAB.drawBird(c, W / 2, gy + 6 + (p > 0.8 ? -Math.sin((p - 0.8) * 20) * 6 : 0), 80, look);
    if (sc.west && p > 0.6) { var q2 = ease((p - 0.6) / 0.4); arrow(c, W / 2 + 40, gy - 50, W / 2 + 40 + 150 * q2, gy - 50, "#ff5a3c", 4); txt(c, "Cap a casa: est", W / 2 + 120, gy - 72, "#8a2a18", 13, "center", true); }
    if (!sc.west) txt(c, "Sense desajust", W / 2, 20, "#134", 14, "center", true);
  };

  S.perdeck = function (c, W, H, sc, p, t, look) {
    bg(c, W, H, "#dfe9d6", "#b9cfae");
    function P(x, y) { return [x * W, y * H]; }
    var A = P(0.15, 0.22), B = P(0.35, 0.42), Wz = P(0.62, 0.74), E = P(0.77, 0.88);
    pin(c, A[0], A[1], "Captura", "#c0392b"); pin(c, B[0], B[1], "Alliberament", "#2f5d50");
    c.fillStyle = "#f2c230"; c.beginPath(); c.arc(Wz[0], Wz[1], 14, 0, TAU); c.fill(); txt(c, "Zona d'hivernada", Wz[0] - 6, Wz[1] + 26, "#123", 12, "center", true);
    var q = ease(p);
    arrow(c, A[0], A[1], A[0] + (Wz[0] - A[0]) * 0.9, A[1] + (Wz[1] - A[1]) * 0.9, "rgba(40,60,80,.55)", 2.5, [7, 6]);
    txt(c, "Ruta natural", (A[0] + Wz[0]) / 2 - 62, (A[1] + Wz[1]) / 2 + 12, "#345", 12, "center", true);
    if (sc.young) { arrow(c, B[0], B[1], B[0] + (E[0] - B[0]) * q, B[1] + (E[1] - B[1]) * q, "#e0562e", 4); txt(c, "Joves: direcció paral·lela", E[0] - 40, E[1] + 18, "#8a2a18", 13, "center", true); }
    else { var mx = B[0] + (Wz[0] - B[0]) * q, my = B[1] + (Wz[1] - B[1]) * q; arrow(c, B[0], B[1], mx, my, "#2f8f4f", 4); txt(c, "Adults: corregeixen", Wz[0] - 70, Wz[1] - 30, "#1d5a33", 13, "center", true); }
    if (look) { var pp = sc.young ? [B[0] + (E[0] - B[0]) * q, B[1] + (E[1] - B[1]) * q] : [B[0] + (Wz[0] - B[0]) * q, B[1] + (Wz[1] - B[1]) * q]; LAB.drawBird(c, pp[0], pp[1] - 16, 44, look); }
  };

  function map2(c, W, H, pts, lines, p, look, title) {
    bg(c, W, H, "#cfe3f2", "#9fc2dc");
    c.strokeStyle = "rgba(255,255,255,.55)"; c.lineWidth = 1; for (var x = 0; x < W; x += 50) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); } for (var y = 0; y < H; y += 50) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    txt(c, title, W / 2, 18, "#123", 14, "center", true);
    pts.forEach(function (q) { pin(c, q.x * W, q.y * H, q.l, q.c); });
    var f = ease(p);
    lines.forEach(function (l) { var a = [l.a[0] * W, l.a[1] * H], b = [l.b[0] * W, l.b[1] * H]; arrow(c, a[0], a[1], a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, l.c || "#e0562e", 3, l.d);
      if (l.t) txt(c, l.t, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 12, "#123", 12, "center", true); });
    if (look) LAB.drawBird(c, W * 0.5, H * 0.86, 40, look);
    txt(c, "Esquema: no és a escala", W - 90, H - 12, "#345", 11, "center");
  }

  S.albatros = function (c, W, H, sc, p, t, look) {
    var cx = W / 2, cy = H / 2 + 8, R = Math.min(W, H) * 0.4;
    bg(c, W, H, "#9fd3ea", "#2a6f93");
    var D = [[5148, 40], [4987, 100], [6692, 165], [2116, 215], [4224, 265], [2697, 330]];
    c.strokeStyle = "rgba(255,255,255,.3)"; [2000, 4000, 6000].forEach(function (km) { c.beginPath(); c.arc(cx, cy, R * km / 7000, 0, TAU); c.stroke(); txt(c, km + " km", cx + R * km / 7000 + 2, cy - 8, "rgba(255,255,255,.7)", 10, "left"); });
    var f = ease(p);
    D.forEach(function (d) { var r = R * d[0] / 7000, x = cx + vx(d[1]) * r, y = cy + vy(d[1]) * r;
      c.fillStyle = "#fff"; c.beginPath(); c.arc(x, y, 4, 0, TAU); c.fill(); txt(c, d[0] + " km", x, y + (y > cy ? 14 : -14), "#fff", 11, "center", true);
      arrow(c, x, y, x + (cx - x) * f, y + (cy - y) * f, "#ffd23a", 2.5); });
    pin(c, cx, cy, "Midway (colònia)", "#e0562e");
    if (look) LAB.drawBird(c, cx, cy - 34, 34, look, { spread: true });
    txt(c, "Alliberaments en direccions diferents", W / 2, 16, "#fff", 13, "center", true);
    if (p > 0.85) txt(c, "14 de 18 tornen en menys de 30 dies", W / 2, H - 14, "#fff", 14, "center", true);
  };
  S.baldriga = function (c, W, H, sc, p, t, look) {
    map2(c, W, H, [ { x: 0.18, y: 0.35, l: "Boston", c: "#2f5d50" }, { x: 0.52, y: 0.28, l: "Gran Bretanya (casa)", c: "#e0562e" }, { x: 0.86, y: 0.62, l: "Venècia", c: "#2f5d50" } ],
      [ { a: [0.18, 0.35], b: [0.52, 0.28], t: "12–14 dies" }, { a: [0.86, 0.62], b: [0.52, 0.28], t: "12–14 dies" } ], p, look, "Baldrigues traslladades");
    if (p > 0.85) txt(c, "Totes tornen", W / 2, H - 70, "#123", 15, "center", true);
  };
  S.pardal = function (c, W, H, sc, p, t, look) {
    map2(c, W, H, [ { x: 0.14, y: 0.4, l: "Califòrnia", c: "#e0562e" }, { x: 0.58, y: 0.62, l: "Louisiana · 2.900 km", c: "#2f5d50" }, { x: 0.86, y: 0.3, l: "Maryland · 3.860 km", c: "#2f5d50" } ],
      [ { a: [0.14, 0.4], b: [0.58, 0.62], c: "#345", d: [6, 5] }, { a: [0.14, 0.4], b: [0.86, 0.3], c: "#345", d: [6, 5] } ], p, look, "Pardals de casquet traslladats a l'hivern");
    if (p > 0.85) txt(c, "Alguns tornen l'any següent, amb molta mortalitat", W / 2, H - 40, "#123", 13, "center", true);
  };
  S.homing = function (c, W, H, sc, p, t, look) {
    bg(c, W, H, "#e9eef1", "#c5d1d8");
    var f = ease(p), names = { casa: "Ocell traslladat", cilindre: "Cilindre tancat · aire de bombona", magnetic: "Tub · camp magnètic constant", barril: "Barril en moviment · girs aleatoris", cec: "Ocell «cec»" };
    c.fillStyle = "#6a7f92"; c.fillRect(W * 0.1, H * 0.35, W * 0.2, H * 0.3); c.strokeStyle = "#fff"; c.lineWidth = 3; c.strokeRect(W * 0.1, H * 0.35, W * 0.2, H * 0.3);
    txt(c, names[sc.opt] || "", W * 0.2, H * 0.72, "#123", 13, "center", true);
    if (look) LAB.drawBird(c, W * 0.2, H * 0.5, 40, look, { noLegs: true, rot: sc.opt === "barril" ? Math.sin(t / 200) : 0 });
    arrow(c, W * 0.34, H * 0.5, W * 0.34 + W * 0.36 * f, H * 0.5, "#2f8f4f", 5);
    c.fillStyle = "#c2a35d"; c.beginPath(); c.arc(W * 0.8, H * 0.5, 26, 0, TAU); c.fill(); txt(c, "Casa", W * 0.8, H * 0.5, "#fff", 14, "center", true);
    if (p > 0.85) txt(c, sc.opt === "casa" ? "Torna al seu lloc d'origen" : "CAP PROBLEMA: tornen igualment", W / 2, H * 0.14, "#1d5a33", 18, "center", true);
  };
  S.sight = function (c, W, H, sc, p, t, look) {
    bg(c, W, H, "#bfe0f2", "#e6f0d8"); var gy = H * 0.66; c.fillStyle = "#8fb872"; c.fillRect(0, gy, W, H - gy);
    var f = ease(p), bx = W * 0.15 + (W * 0.6) * f, by = H * 0.4 - Math.sin(f * Math.PI) * 18;
    if (sc.known) {
      c.fillStyle = "#6fa7d6"; c.beginPath(); c.moveTo(0, gy + 24); c.quadraticCurveTo(W * 0.4, gy - 10, W, gy + 40); c.lineTo(W, gy + 70); c.quadraticCurveTo(W * 0.4, gy + 20, 0, gy + 52); c.fill();
      [[0.3, "#b9543c"], [0.55, "#c9b37a"], [0.8, "#b9543c"]].forEach(function (q) { var x = W * q[0]; c.fillStyle = q[1]; c.fillRect(x - 22, gy - 38, 44, 38); c.fillStyle = "#7a3b2a"; c.beginPath(); c.moveTo(x - 26, gy - 38); c.lineTo(x, gy - 62); c.lineTo(x + 26, gy - 38); c.fill(); });
      c.fillStyle = "#2f7a46"; [0.18, 0.43, 0.68, 0.9].forEach(function (q) { c.beginPath(); c.arc(W * q, gy - 14, 16, 0, TAU); c.fill(); });
      arrow(c, W * 0.12, H * 0.4, W * 0.12 + W * 0.7 * f, H * 0.4, "#e0562e", 4); txt(c, "Lloc conegut: es guia per punts de referència", W / 2, 22, "#134", 14, "center", true);
    } else {
      var g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "rgba(220,225,230,.95)"); g.addColorStop(1, "rgba(200,208,214,.9)"); c.fillStyle = g; c.fillRect(0, 0, W, H);
      for (var i = 0; i < 6; i++) txt(c, "?", W * (0.12 + 0.15 * i), H * (0.3 + 0.35 * ((i * 53 % 7) / 7)), "rgba(80,90,100,.35)", 44, "center", true);
      txt(c, "Lloc desconegut: no hi ha punts de referència", W / 2, 22, "#345", 14, "center", true);
      bx = W * 0.3 + Math.sin(t / 500) * 40; by = H * 0.45 + Math.cos(t / 400) * 12;
    }
    if (look) LAB.drawBird(c, bx, by, 46, look);
  };
  S.daylen = function (c, W, H, sc, p, t, look) {
    bg(c, W, H, sc.short ? "#e9b87a" : "#9fd0ee", sc.short ? "#d9c9a8" : "#e4efdc"); var gy = H * 0.7; c.fillStyle = sc.short ? "#7b8a5a" : "#7fae6b"; c.fillRect(0, gy, W, H - gy);
    var x0 = sc.short ? W * 0.28 : W * 0.08, x1 = sc.short ? W * 0.72 : W * 0.92, hgt = sc.short ? gy - 70 : gy - 25 - 70 + 40;
    c.strokeStyle = "rgba(255,255,255,.7)"; c.lineWidth = 3; c.setLineDash([6, 6]); c.beginPath(); c.moveTo(x0, gy); c.quadraticCurveTo((x0 + x1) / 2, gy - (gy - hgt) * 2 + 0, x1, gy); c.stroke(); c.setLineDash([]);
    var u = ease(p), sx = x0 + (x1 - x0) * u, sy = gy - (gy - hgt) * 2 * u * (1 - u) * 1.0; c.fillStyle = "#ffd23a"; c.beginPath(); c.arc(sx, sy, 20, 0, TAU); c.fill();
    txt(c, sc.short ? "Escurçament del dia: menys hores de sol" : "Dia llarg: moltes hores de sol", W / 2, 22, "#123", 14, "center", true);
    var hop = (sc.short && p > 0.55) ? Math.abs(Math.sin(t / 110)) * 16 : 0;
    if (look) LAB.drawBird(c, W / 2, gy + 6 - hop, 70, look);
    if (sc.short && p > 0.55) txt(c, "Intranquil·litat migratòria (zugunruhe)", W / 2, H - 22, "#8a2a18", 14, "center", true);
    if (!sc.short && p > 0.55) txt(c, "Sense pressa per marxar", W / 2, H - 22, "#1d5a33", 14, "center", true);
  };
  S.unknown = function (c, W, H, sc, p, t, look) {
    bg(c, W, H, "#2a3036", "#161a1e");
    for (var i = 0; i < 7; i++) txt(c, "?", W * (0.12 + 0.13 * i), H * (0.3 + 0.4 * ((i * 37 % 7) / 7)) + Math.sin(t / 600 + i) * 8, "rgba(255,255,255," + (0.08 + 0.05 * i % 3) + ")", 46 + i * 4, "center", true);
    txt(c, "?", W / 2, H / 2, "rgba(255,210,90,.95)", 120, "center", true);
    if (look) LAB.drawBird(c, W / 2, H * 0.82, 54, look);
  };

  LAB.scenes = {
    render: function (c, W, H, scene, p, t, look) {
      c.clearRect(0, 0, W, H);
      (S[scene.type] || S.unknown)(c, W, H, scene, p, t, look);
    }
  };
})();
