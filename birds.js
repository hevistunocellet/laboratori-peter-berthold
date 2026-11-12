/* Dibuix paramètric dels ocells (cap fotografia: tot és dibuixat amb codi, sense drets d'autor). */
window.LAB = window.LAB || {};
(function () {
  function shade(hex, f) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    function c(v) { return Math.max(0, Math.min(255, Math.round(v * f))); }
    return "rgb(" + c(r) + "," + c(g) + "," + c(b) + ")";
  }
  function ell(ctx, x, y, rx, ry, rot, fill) {
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot || 0, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
  }
  // Dibuixa un ocell de perfil. size = alçada aproximada en píxels. flip = -1 mira a l'esquerra.
  LAB.drawBird = function (ctx, x, y, size, look, o) {
    o = o || {};
    if (look.img && look.img.complete && look.img.naturalWidth) {   // fotografia en comptes del dibuix
      var iw = look.img.naturalWidth, ih = look.img.naturalHeight, w = size * 2.2, h = w * 0.75;
      var sc = Math.max(w / iw, h / ih), sw = w / sc, sh = h / sc;
      ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot);
      ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(-w / 2, -h / 2, w, h, 10); else ctx.rect(-w / 2, -h / 2, w, h);
      ctx.save(); ctx.clip(); ctx.drawImage(look.img, (iw - sw) / 2, (ih - sh) / 2, sw, sh, -w / 2, -h / 2, w, h); ctx.restore();
      ctx.lineWidth = 3; ctx.strokeStyle = "#fff"; ctx.stroke(); ctx.restore(); return;
    }
    var k = (size / 60) * (look.big ? 1.2 : look.small ? 0.85 : 1);
    var ry = look.round ? 19 : look.slim ? 13 : 16;
    ctx.save();
    ctx.translate(x, y); ctx.scale(k * (o.flip || 1), k); if (o.rot) ctx.rotate(o.rot);
    var wing = look.wing || shade(look.body, 0.78);
    // cua
    ctx.beginPath(); ctx.moveTo(-18, -4); ctx.lineTo(-18 - look.tail * 1.4, 4); ctx.lineTo(-18 - look.tail * 1.3, 11); ctx.lineTo(-16, 8); ctx.closePath();
    ctx.fillStyle = look.tailColor || shade(look.body, 0.7); ctx.fill();
    // potes
    if (!o.noLegs) { ctx.strokeStyle = look.legs || "#5a4a3e"; ctx.lineWidth = 2; ctx.beginPath();
      ctx.moveTo(-2, ry - 4); ctx.lineTo(-3, ry + 14); ctx.moveTo(4, ry - 4); ctx.lineTo(5, ry + 14); ctx.stroke(); }
    // ales llargues (aus marines)
    if (look.longwing && o.spread) {
      ctx.fillStyle = wing; ctx.beginPath(); ctx.moveTo(-6, -6); ctx.quadraticCurveTo(-40, -50, -70, -30); ctx.quadraticCurveTo(-30, -20, 10, -4); ctx.fill();
    }
    // cos
    ell(ctx, 0, 0, 27, ry, 0, look.body);
    ell(ctx, 4, ry * 0.3, 22, ry * 0.7, 0, look.belly);
    if (look.barred) { ctx.strokeStyle = typeof look.barred === "string" ? look.barred : "#6f6f6f"; ctx.lineWidth = 1.6;
      for (var i = -14; i <= 16; i += 6) { ctx.beginPath(); ctx.moveTo(i, ry * 0.1); ctx.lineTo(i + 3, ry * 0.85); ctx.stroke(); } }
    if (look.speckle) { ctx.fillStyle = "rgba(255,255,255,.55)"; for (var j = 0; j < 22; j++) { ctx.fillRect(-20 + (j * 37 % 40), -ry + (j * 17 % (ry * 2)) , 1.6, 1.6); } }
    // ala
    ell(ctx, -3, -1, 19, 9, -0.15, wing);
    if (look.wingBars) { ctx.strokeStyle = "#2a2f38"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-8, -6); ctx.lineTo(-6, 4); ctx.moveTo(0, -7); ctx.lineTo(2, 3); ctx.stroke(); }
    if (look.wingTip) ell(ctx, -17, 2, 6, 3, -0.2, look.wingTip);
    // cap
    ell(ctx, 22, -ry * 0.55, 11, 10.5, 0, look.head);
    if (look.neckPatch) ell(ctx, 15, -ry * 0.2, 6, 4, 0.4, look.neckPatch);
    if (look.cap) { ctx.beginPath(); ctx.ellipse(22, -ry * 0.55, 11, 10.5, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.fillStyle = look.cap; ctx.fill(); }
    if (look.face) ell(ctx, 27, -ry * 0.4, 6, 6, 0, look.face);
    if (look.stripes) { ctx.fillStyle = "#1e1e1e"; ctx.fillRect(14, -ry * 0.55 - 9, 16, 2.5); ctx.fillRect(14, -ry * 0.55 - 3, 16, 2); ctx.fillStyle = "#f1f1f1"; ctx.fillRect(14, -ry * 0.55 - 6.5, 16, 3); }
    if (look.brow) { ctx.strokeStyle = look.brow; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(22, -ry * 0.55 - 3); ctx.lineTo(31, -ry * 0.55 - 2); ctx.stroke(); }
    // bec
    var b = look.bill, hy = -ry * 0.5;
    ctx.beginPath(); ctx.moveTo(31, hy - 3); ctx.lineTo(31 + b.l, hy + (b.hook ? 1.5 : 0)); ctx.lineTo(31, hy + 3); ctx.closePath();
    ctx.fillStyle = b.c; ctx.fill();
    if (b.hook) { ctx.beginPath(); ctx.arc(31 + b.l - 1, hy + 2, 2, 0, 6.3); ctx.fill(); }
    if (b.tube) { ctx.strokeStyle = shade("#aa9a80", 0.9); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(32, hy - 2); ctx.lineTo(31 + b.l * 0.6, hy - 2.5); ctx.stroke(); }
    if (b.spot) { ctx.fillStyle = "#d54a3a"; ctx.fillRect(31 + b.l * 0.7, hy + 0.5, 2.5, 2.5); }
    // ull
    if (look.eyering) ell(ctx, 27, hy - 4, 3.6, 3.6, 0, look.eyering);
    ell(ctx, 27, hy - 4, 2, 2, 0, "#0a0a0a"); ell(ctx, 27.6, hy - 4.6, 0.6, 0.6, 0, "#fff");
    if (look.shades) { ctx.fillStyle = "#0b0b0b"; ctx.beginPath(); ctx.ellipse(27, hy - 4, 6, 4.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#0b0b0b"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(21.5, hy - 4); ctx.lineTo(12, hy - 2); ctx.stroke(); ell(ctx, 25.4, hy - 5.6, 1.6, 1, 0, "rgba(255,255,255,.6)"); }
    ctx.restore();
  };
  // Miniatura (data URL) per a les targetes de la dreta
  LAB.thumb = function (look) {
    var c = document.createElement("canvas"); c.width = 120; c.height = 90;
    var g = c.getContext("2d");
    LAB.drawBird(g, 58, 48, 64, look, { noLegs: false });
    return c.toDataURL("image/png");
  };
})();
