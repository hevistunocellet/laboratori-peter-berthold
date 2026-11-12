/* El laboratori de Peter Berthold · lògica de la interfície */
(function () {
  "use strict";
  var SP = LAB.species, INS = LAB.instruments;
  function $(id) { return document.getElementById(id); }
  function mk(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function spOf(id) { return SP.filter(function (s) { return s.id === id; })[0]; }
  function insOf(id) { return INS.filter(function (s) { return s.id === id; })[0]; }

  var el = { cv: $("cv"), wrap: $("cv-wrap"), hint: $("drop-hint"), bubble: $("bubble-text"), next: $("btn-next"),
    slotB: $("slot-bird"), slotI: $("slot-ins"), valB: $("slot-bird-val"), valI: $("slot-ins-val"), opts: $("opts"), go: $("btn-go"),
    hyp: $("hyp"), hypQ: $("hyp-q"), hypO: $("hyp-opts"), hypSkip: $("hyp-skip"),
    res: $("result"), badge: $("badge"), verdict: $("verdict"), note: $("note"), tryBox: $("try"), tryList: $("try-list"), btnNew: $("btn-new"),
    birds: $("birds"), ins: $("instruments"), book: $("btn-book"), bookCount: $("book-count"), about: $("btn-about") };
  var ctx = el.cv.getContext("2d");
  var st = { sp: null, ins: null, opt: null, phase: "idle", res: null, line: 0, t0: 0, guess: null, queue: [], done: {} };
  try { st.done = JSON.parse(localStorage.getItem("lab-berthold-book") || "{}"); } catch (e) { st.done = {}; }

  /* ---------- Fotografies dels ocells (opcional, data/photos.js) ---------- */
  var PH = LAB.photos || {};
  SP.forEach(function (s) { var f = PH[s.id]; if (f && f.file) { var im = new Image(); im.src = f.file; im.onerror = function () { s.look.img = null; }; s.look.img = im; s.photoFile = f.file; } });
  (function () { var box = $("photo-credits"), L = SP.filter(function (s) { return PH[s.id] && PH[s.id].file; }); if (!L.length) return;
    box.appendChild(mk("h3", null, "Fotografies")); var ul = mk("ul");
    L.forEach(function (s) { var f = PH[s.id]; ul.appendChild(mk("li", null, s.name + ": © " + (f.author || "autor no indicat") + (f.license ? ", " + f.license : "") + (f.source ? ". " + f.source : ""))); }); box.appendChild(ul); })();

  /* ---------- Total de resultats amb dades (per al quadern) ---------- */
  var total = 0;
  SP.forEach(function (s) { INS.forEach(function (i) { LAB.optionsFor(i.id, s.id).forEach(function (o) { if (LAB.resolve(s.id, i.id, o.id).level !== "cap") total++; }); }); });

  /* ---------- Berthold ---------- */
  LAB.berthold.mount($("bt-host"));
  var btText = null;
  function say(text, mood, withNext, cb) {
    el.next.hidden = true;
    LAB.berthold.say(el.bubble, text, mood, function () { if (withNext) el.next.hidden = false; if (cb) cb(); });
    btText = text;
  }

  /* ---------- Veu (opcional) ---------- */
  var vb = $("btn-voice");
  try { LAB.berthold.voiceOn = localStorage.getItem("lab-voice") !== "off"; } catch (e) { LAB.berthold.voiceOn = true; }
  function saveVoice() { try { localStorage.setItem("lab-voice", LAB.berthold.voiceOn ? "on" : "off"); } catch (e) { /* sense desar */ } }
  function voiceUI() { vb.setAttribute("aria-pressed", LAB.berthold.voiceOn); vb.textContent = LAB.berthold.voiceOn ? "🔊 Veu: activada" : "🔇 Veu: desactivada"; }
  vb.addEventListener("click", function () {
    if (!LAB.berthold.voiceOn) {
      if (!LAB.berthold.voiceAvailable()) { say("Aquest dispositiu no té cap veu en català. Pots provar-ho en un altre navegador o dispositiu.", "neutral"); return; }
      LAB.berthold.voiceOn = true; saveVoice(); voiceUI(); say("Ja pots escoltar-me. Continuem!", "happy");
    } else { LAB.berthold.voiceOn = false; saveVoice(); LAB.berthold.stop(); voiceUI(); }
  });
  voiceUI();

  /* ---------- Música i sons ---------- */
  var mb = $("btn-music"), musicWanted = true;
  try { musicWanted = localStorage.getItem("lab-music") !== "off"; } catch (e) { /* per defecte */ }
  function musicUI() { mb.setAttribute("aria-pressed", musicWanted); mb.textContent = musicWanted ? "🎵 Música: activada" : "🔇 Música: desactivada"; }
  mb.addEventListener("click", function () {
    musicWanted = !musicWanted; try { localStorage.setItem("lab-music", musicWanted ? "on" : "off"); } catch (e) { /* sense desar */ }
    if (musicWanted) LAB.sound.start(); else LAB.sound.stop(); musicUI();
  });
  musicUI();
  setInterval(function () { LAB.sound.duck(LAB.berthold.voiceOn && LAB.berthold.isTalking()); }, 250);

  /* ---------- Prestatgeria ---------- */
  SP.forEach(function (s) {
    var b = mk("button", "bird"); b.type = "button"; b.dataset.id = s.id; b.draggable = true; b.title = s.name + " (" + s.sci + ")";
    var im = new Image(); im.alt = ""; if (s.photoFile) { im.src = s.photoFile; im.className = "ph"; im.onerror = function () { im.className = ""; im.src = LAB.thumb(Object.assign({}, s.look, { img: null })); }; } else im.src = LAB.thumb(s.look); b.appendChild(im); b.appendChild(mk("span", null, s.name));
    b.addEventListener("click", function () { pick("bird", s.id); });
    b.addEventListener("dragstart", function (e) { e.dataTransfer.setData("text/plain", "bird:" + s.id); e.dataTransfer.effectAllowed = "copy"; });
    el.birds.appendChild(b);
  });
  INS.forEach(function (i) {
    var b = mk("button", "ins"); b.type = "button"; b.dataset.id = i.id; b.draggable = true;
    b.appendChild(mk("span", "ic", i.icon));
    var d = mk("span"); d.appendChild(mk("b", null, i.name)); d.appendChild(mk("small", null, i.short)); b.appendChild(d);
    b.addEventListener("click", function () { pick("ins", i.id); });
    b.addEventListener("dragstart", function (e) { e.dataTransfer.setData("text/plain", "ins:" + i.id); e.dataTransfer.effectAllowed = "copy"; });
    el.ins.appendChild(b);
  });

  /* ---------- Selecció ---------- */
  function resetRun() {
    LAB.berthold.stop(); st.phase = "idle"; st.res = null; st.guess = null;
    el.hyp.hidden = true; el.res.hidden = true; el.next.hidden = true;
  }
  function fixOpt() {
    if (!st.ins) { st.opt = null; return; }
    var os = LAB.optionsFor(st.ins, st.sp), ok = os.some(function (o) { return o.id === st.opt; });
    if (!ok) st.opt = os.length ? os[0].id : null;
  }
  function pick(kind, id) {
    LAB.sound.sfx("place");
    resetRun();
    if (kind === "bird") st.sp = id; else { st.ins = id; st.opt = null; }
    fixOpt();
    refresh();
    var s = st.sp && spOf(st.sp), i = st.ins && insOf(st.ins);
    if (s && i) say(s.intro + " Hi posem " + i.name.toLowerCase() + ". Tria la condició i prem «Experimenta».", "happy");
    else if (s) say(s.intro + " Ara tria un instrument de la dreta.", "happy");
    else if (i) say(i.name + ": " + i.short + " Ara tria un ocell.", "neutral");
  }
  function clear(kind) { resetRun(); if (kind === "bird") st.sp = null; else { st.ins = null; st.opt = null; } refresh(); say("Posa un ocell i un instrument a la cambra: arrossega'ls o toca'ls.", "neutral"); }

  function refresh() {
    var s = st.sp && spOf(st.sp), i = st.ins && insOf(st.ins);
    el.valB.textContent = s ? s.name : "— buit —"; el.valI.textContent = i ? i.name : "— buit —";
    el.slotB.classList.toggle("filled", !!s); el.slotI.classList.toggle("filled", !!i);
    Array.prototype.forEach.call(el.birds.children, function (b) { b.classList.toggle("on", b.dataset.id === st.sp); });
    Array.prototype.forEach.call(el.ins.children, function (b) { b.classList.toggle("on", b.dataset.id === st.ins); });
    el.opts.textContent = "";
    if (i) { el.opts.hidden = false; LAB.optionsFor(i.id, st.sp).forEach(function (o) {
      var c = mk("button", "chip" + (o.id === st.opt ? " on" : ""), o.name); c.type = "button"; c.setAttribute("aria-pressed", o.id === st.opt);
      c.addEventListener("click", function () { LAB.sound.sfx("tick"); resetRun(); st.opt = o.id; refresh(); say("Condició: " + o.name.toLowerCase() + ". Quan vulguis, experimenta!", "neutral"); });
      el.opts.appendChild(c); }); } else el.opts.hidden = true;
    el.go.disabled = !(s && i) || st.phase === "run" || st.phase === "hyp";
    el.hint.hidden = !!(s || i);
  }

  /* ---------- Arrossegar i deixar anar ---------- */
  function drop(e) {
    e.preventDefault(); el.wrap.classList.remove("over"); el.slotB.classList.remove("over"); el.slotI.classList.remove("over");
    var d = (e.dataTransfer.getData("text/plain") || "").split(":");
    if (d[0] === "bird" && spOf(d[1])) pick("bird", d[1]); else if (d[0] === "ins" && insOf(d[1])) pick("ins", d[1]);
  }
  [el.wrap, el.slotB, el.slotI].forEach(function (z) {
    z.addEventListener("dragover", function (e) { e.preventDefault(); z.classList.add("over"); });
    z.addEventListener("dragleave", function () { z.classList.remove("over"); });
    z.addEventListener("drop", drop);
  });
  el.slotB.addEventListener("click", function () { if (st.sp) clear("bird"); });
  el.slotI.addEventListener("click", function () { if (st.ins) clear("ins"); });

  /* ---------- Experiment ---------- */
  el.go.addEventListener("click", function () {
    if (!st.sp || !st.ins) return;
    LAB.sound.sfx("go");
    resetRun();
    st.res = LAB.resolve(st.sp, st.ins, st.opt);
    if (st.res.hyp) { st.phase = "hyp"; showHyp(st.res.hyp); } else run();
    refresh();
  });
  function showHyp(h) {
    el.hyp.hidden = false; el.hypQ.textContent = h.q; el.hypO.textContent = "";
    h.opts.forEach(function (o, k) { var b = mk("button", "btn", o); b.type = "button"; b.addEventListener("click", function () { st.guess = k; el.hyp.hidden = true; run(); }); el.hypO.appendChild(b); });
    say("Abans d'ensenyar-te res: " + h.q + " Què en penses?", "think");
  }
  el.hypSkip.addEventListener("click", function () { st.guess = null; el.hyp.hidden = true; run(); });

  function run() {
    st.phase = "run"; st.line = 0; st.t0 = performance.now(); refresh();
    showLine();
  }
  function showLine() {
    var r = st.res, ln = r.lines[st.line], last = st.line >= r.lines.length - 1;
    say(ln.t, ln.m, true, null);
    el.next.textContent = last ? "Veure el resultat ▸" : "Continua ▸";
  }
  el.next.addEventListener("click", function () {
    var r = st.res; if (!r || st.phase !== "run") return;
    if (st.line < r.lines.length - 1) { st.line++; showLine(); } else finish();
  });
  function finish() {
    var r = st.res, lv = LAB.levels[r.level];
    st.phase = "done"; el.next.hidden = true; LAB.sound.sfx(r.level === "cap" ? "hmm" : "ping");
    el.badge.textContent = lv.name; el.badge.className = "badge " + lv.cls;
    el.note.textContent = r.note; $("code").textContent = "Codi: " + st.sp + " · " + st.ins + " · " + st.opt;
    if (r.hyp && st.guess != null) { el.verdict.hidden = false; var ok = st.guess === r.hyp.ok;
      el.verdict.textContent = ok ? "✓ La teva hipòtesi encaixa amb el que descriu el curs." : "La teva hipòtesi no coincideix amb el que descriu el curs: «" + r.hyp.opts[r.hyp.ok] + "».";
    } else el.verdict.hidden = true;
    el.tryList.textContent = "";
    if (r.try && r.try.length) { el.tryBox.hidden = false; r.try.forEach(function (q) {
      var c = mk("button", "chip", spOf(q.sp).name + " + " + insOf(q.ins).name.toLowerCase()); c.type = "button";
      c.addEventListener("click", function () { st.sp = q.sp; st.ins = q.ins; st.opt = q.opt; resetRun(); refresh(); el.go.click(); });
      el.tryList.appendChild(c); }); } else el.tryBox.hidden = true;
    el.res.hidden = false;
    var key = st.sp + "|" + st.ins + "|" + st.opt; st.done[key] = r.level;
    try { localStorage.setItem("lab-berthold-book", JSON.stringify(st.done)); } catch (e) { /* sense desar */ }
    updateBook(); refresh();
    el.res.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  $("btn-clear").addEventListener("click", function () {
    LAB.sound.sfx("tick"); resetRun(); st.sp = null; st.ins = null; st.opt = null; refresh();
    say("Cambra buida. Posa un ocell i un instrument o acció i veiem què passa.", "neutral");
  });
  el.btnNew.addEventListener("click", function () { resetRun(); st.sp = null; st.ins = null; st.opt = null; refresh(); say("Un altre? Tria ocell i instrument i ho provem.", "happy"); });

  /* ---------- Quadern ---------- */
  function updateBook() {
    var n = Object.keys(st.done).filter(function (k) { return st.done[k] !== "cap"; }).length;
    el.bookCount.textContent = n + "/" + total;
  }
  el.book.addEventListener("click", function () {
    var list = $("book-list"); list.textContent = "";
    var keys = Object.keys(st.done);
    $("book-sum").textContent = keys.length ? "Has fet " + keys.length + " experiments. Resultats amb dades del curs: " + el.bookCount.textContent + "." : "Encara no has fet cap experiment.";
    var col = { curs: "#2F5D50", estudi: "#1f7a8c", general: "#3b6ea5", obert: "#a36b12", possible: "#7a4fa0", cap: "#6b6f73" };
    keys.forEach(function (k) { var p = k.split("|"), li = mk("li"); var d = mk("span", "dot"); d.style.background = col[st.done[k]]; li.appendChild(d);
      var o = LAB.optionsFor(p[1], p[0]).filter(function (x) { return x.id === p[2]; })[0];
      li.appendChild(document.createTextNode(spOf(p[0]).name + " + " + insOf(p[1]).name.toLowerCase() + " (" + (o ? o.name.toLowerCase() : "") + ") · " + LAB.levels[st.done[k]].name)); list.appendChild(li); });
    $("dlg-book").showModal();
  });
  $("btn-who").addEventListener("click", function () { $("dlg-who").showModal(); });
  el.about.addEventListener("click", function () { $("dlg-about").showModal(); });

  /* ---------- Canvas ---------- */
  var W = 0, H = 0;
  function size() {
    var w = el.wrap.clientWidth, h = Math.round(w * (w < 560 ? 0.8 : 0.58)), dpr = window.devicePixelRatio || 1;
    if (w === W && h === H) return; W = w; H = h;
    el.cv.width = w * dpr; el.cv.height = h * dpr; el.cv.style.height = h + "px"; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", size);
  function frame(t) {
    size();
    var s = st.sp && spOf(st.sp), look = s && s.look, scene, p = 0;
    if (st.phase === "run" || st.phase === "done") { scene = st.res.scene; p = st.phase === "done" ? 1 : Math.min(1, (t - st.t0) / 6000); }
    else scene = { type: "idle" };
    LAB.scenes.render(ctx, W, H, scene, p, t, look);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  refresh(); updateBook();
  var GREET = "Benvinguts al Laboratori d'en Peter Berthold. Un laboratori on poder comprovar i experimentar com s'orienten els ocells. Posa un ocell i un instrument o acció a la cambra central i veiem què passa.";
  say(GREET, "happy", false, null, true);
  $("btn-start").addEventListener("click", function () {
    $("start").hidden = true;
    if (musicWanted) LAB.sound.start();
    if (LAB.berthold.voiceOn && !LAB.berthold.voiceAvailable()) { LAB.berthold.voiceOn = false; voiceUI(); }   // sense veu catalana: es queda en silenci
    say(GREET, "happy");
    $("btn-start").blur();
  });
  window.LAB.state = st; // per a proves
})();
