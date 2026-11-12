/* Berthold: personatge-guia (titella d'estil caricatura, dibuixat amb SVG; no és una fotografia ni un retrat real).
   Els diàlegs són originals del joc: no són cites reals. */
window.LAB = window.LAB || {};
(function () {
  var SVG = '' +
  '<svg id="bt-svg" viewBox="0 0 200 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Berthold, el guia del laboratori">' +
  ' <g id="bt-body">' +
  '  <path d="M40 270 L46 175 Q100 150 154 175 L160 270 Z" fill="#f3f1ea" stroke="#9a9a90" stroke-width="3"/>' +
  '  <path d="M100 160 L82 190 L100 270 L118 190 Z" fill="#2f5d50"/>' +
  '  <path d="M82 168 L100 192 L118 168 L100 160Z" fill="#fff" stroke="#9a9a90" stroke-width="2"/>' +
  '  <rect x="118" y="205" width="26" height="22" rx="3" fill="#fff" stroke="#9a9a90" stroke-width="2"/>' +
  '  <rect x="124" y="196" width="3" height="16" fill="#c2a35d"/><rect x="131" y="196" width="3" height="16" fill="#2f5d50"/>' +
  ' </g>' +
  ' <g id="bt-arm" style="transform-origin:150px 180px">' +
  '  <path d="M150 178 Q182 190 190 230" fill="none" stroke="#f3f1ea" stroke-width="22" stroke-linecap="round"/>' +
  '  <circle cx="190" cy="232" r="11" fill="#f0c9a4" stroke="#b58a62" stroke-width="2"/>' +
  ' </g>' +
  ' <g id="bt-head" style="transform-origin:100px 150px">' +
  '  <rect x="88" y="140" width="24" height="26" fill="#e9bf98"/>' +
  '  <circle cx="100" cy="95" r="62" fill="#f0c9a4" stroke="#b58a62" stroke-width="3"/>' +
  '  <path d="M42 85 Q40 38 100 34 Q160 38 158 85 Q150 55 100 55 Q50 55 42 85Z" fill="#cfd2d4" stroke="#8d9194" stroke-width="2"/>' +
  '  <ellipse cx="40" cy="98" rx="7" ry="13" fill="#f0c9a4" stroke="#b58a62" stroke-width="2"/><ellipse cx="160" cy="98" rx="7" ry="13" fill="#f0c9a4" stroke="#b58a62" stroke-width="2"/>' +
  '  <g id="bt-brows" stroke="#7d8083" stroke-width="5" stroke-linecap="round">' +
  '   <line id="bt-brow-l" x1="62" y1="72" x2="88" y2="72" style="transform-origin:75px 72px"/><line id="bt-brow-r" x1="112" y1="72" x2="138" y2="72" style="transform-origin:125px 72px"/>' +
  '  </g>' +
  '  <g id="bt-eyes"><circle cx="76" cy="90" r="11" fill="#fff" stroke="#444" stroke-width="2.5"/><circle cx="124" cy="90" r="11" fill="#fff" stroke="#444" stroke-width="2.5"/>' +
  '   <circle id="bt-pl" cx="78" cy="91" r="4" fill="#222"/><circle id="bt-pr" cx="126" cy="91" r="4" fill="#222"/></g>' +
  '  <rect x="60" y="78" width="32" height="24" rx="8" fill="none" stroke="#3d3d3d" stroke-width="3"/><rect x="108" y="78" width="32" height="24" rx="8" fill="none" stroke="#3d3d3d" stroke-width="3"/><line x1="92" y1="88" x2="108" y2="88" stroke="#3d3d3d" stroke-width="3"/>' +
  '  <ellipse cx="100" cy="106" rx="7" ry="5" fill="#e2a982"/>' +
  '  <path d="M62 120 Q100 168 138 120 Q130 132 100 134 Q70 132 62 120Z" fill="#e6e8ea" stroke="#9a9d9f" stroke-width="2"/>' +
  '  <ellipse id="bt-mouth" cx="100" cy="124" rx="13" ry="2" fill="#5a1f1f"/>' +
  ' </g>' +
  '</svg>';

  var MOODS = {
    neutral:  { bl: 0, br: 0, y: 0 },
    happy:    { bl: -8, br: 8, y: -3 },
    think:    { bl: 10, br: -14, y: -6 },
    surprised:{ bl: -4, br: 4, y: -8 },
    serious:  { bl: 12, br: -12, y: 2 }
  };

  var el, svg, mouth, timer, typing = false, speaking = false, talking = false, amp = 0, raf, blink, photo = null, photoMood = 'neutral';

  function upd() { talking = typing || speaking; }
  function caVoice() {
    var v = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
    for (var i = 0; i < v.length; i++) if (/^ca([-_]|$)/i.test(v[i].lang)) return v[i];
    return null;
  }
  if (window.speechSynthesis) speechSynthesis.onvoiceschanged = function () {};
  function speak(text) {
    var v = caVoice(); if (!v) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text); u.voice = v; u.lang = v.lang; u.rate = LAB.berthold.voiceRate; u.pitch = LAB.berthold.voicePitch;
    u.onstart = function () { speaking = true; upd(); }; u.onend = u.onerror = function () { speaking = false; upd(); };
    speechSynthesis.speak(u);
  }

  LAB.berthold = {
    isTalking: function () { return talking; },
    voiceOn: false, voicePitch: 1, voiceRate: 1,
    voiceAvailable: function () { return !!caVoice(); },
    mount: function (host) {
      host.innerHTML = SVG;
      svg = host.firstChild;
      mouth = svg.querySelector("#bt-mouth");
      this.mood("neutral");
      var eyes = svg.querySelector("#bt-eyes");
      blink = setInterval(function () { eyes.style.opacity = ".2"; setTimeout(function () { eyes.style.opacity = "1"; }, 110); }, 3800);
      // Si existeix assets/berthold.jpg, la fotografia fa de personatge que parla:
      // es talla per la línia de la boca i la part de baix s'obre i es tanca (estil titella de paper).
      // AJUST: LAB.photoCfg.mouthY = alçada de la boca (0 = dalt de la foto, 1 = baix). També es pot provar amb ?boca=0.62 a l'adreça.
      var cfg = LAB.photoCfg || { mouthY: 0.32, gap: 0.05, faceX: 0.33, faceW: 0.33 };
      var q = /[?&]boca=([0-9.]+)/.exec(location.search); if (q) cfg.mouthY = parseFloat(q[1]);
      var im = new Image();
      im.onload = function () {
        var wrap = document.createElement("div"); wrap.className = "bt-photo"; wrap.style.aspectRatio = (im.naturalWidth * 0.94) + " / " + im.naturalHeight;
        var top = new Image(), bot = new Image(); top.src = bot.src = im.src; top.alt = "Peter Berthold, guia del laboratori"; bot.alt = ""; bot.setAttribute("aria-hidden", "true");
        top.className = "bt-top"; bot.className = "bt-bot";
        top.style.clipPath = "inset(0 0 " + ((1 - cfg.mouthY) * 100 - 0.5) + "% 0)";
        bot.style.clipPath = "inset(" + (cfg.mouthY * 100) + "% 0 0 0)";
        var gapEl = document.createElement("div"); gapEl.className = "bt-gap"; gapEl.style.left = (cfg.faceX * 100) + "%"; gapEl.style.width = (cfg.faceW * 100) + "%";
        wrap.appendChild(gapEl); wrap.appendChild(bot); wrap.appendChild(top);
        photo = { wrap: wrap, top: top, bot: bot, gap: gapEl, cfg: cfg };
        host.classList.add("has-photo"); host.insertBefore(wrap, svg); svg.style.display = "none";
        var cap = document.createElement("div"); cap.className = "bt-cap"; cap.textContent = "Peter Berthold (1939–2023)"; host.appendChild(cap);
      };
      im.src = "assets/berthold.jpg";
      var loop = function (t) {
        if (photo) {
          var o = talking ? (0.2 + 0.8 * Math.abs(Math.sin(t / 85)) * (typing ? amp : 0.8)) : 0;
          var tilt = photoMood === "think" ? -2.5 : photoMood === "happy" ? 1.5 : 0;
          var sh = o * photo.cfg.gap;                       // desplaçament (fracció de l'alçada de la foto)
          photo.top.style.transform = "translateY(" + (-sh * 100).toFixed(2) + "%) rotate(" + (tilt * 0.4).toFixed(2) + "deg)";
          photo.gap.style.top = (6 + (photo.cfg.mouthY - sh) * 94).toFixed(2) + "%";
          photo.gap.style.height = (sh * 94).toFixed(2) + "%";
          photo.top.style.transformOrigin = "50% " + (photo.cfg.mouthY * 100) + "%";
        }
        var open = talking ? (0.25 + 0.75 * Math.abs(Math.sin(t / 85)) * amp) : 0;
        mouth.setAttribute("ry", (2 + open * 11).toFixed(1));
        mouth.setAttribute("rx", (13 - open * 3).toFixed(1));
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    },
    mood: function (m) {
      photoMood = m;
      var M = MOODS[m] || MOODS.neutral;
      svg.querySelector("#bt-brow-l").style.transform = "rotate(" + M.bl + "deg) translateY(" + M.y + "px)";
      svg.querySelector("#bt-brow-r").style.transform = "rotate(" + M.br + "deg) translateY(" + M.y + "px)";
      svg.querySelector("#bt-head").style.transform = "rotate(" + (m === "think" ? -5 : m === "happy" ? 3 : 0) + "deg)";
      var pose = m === "surprised" ? -40 : m === "think" ? -75 : m === "happy" ? -25 : 0;
      svg.querySelector("#bt-arm").style.transform = "rotate(" + pose + "deg)";
      svg.querySelector("#bt-arm").style.transition = "transform .4s";
      svg.querySelector("#bt-head").style.transition = "transform .4s";
    },
    // Escriu el text lletra a lletra amb la boca movent-se. done() quan acaba.
    say: function (textEl, text, mood, done, instant) {
      clearInterval(timer);
      if (window.speechSynthesis) speechSynthesis.cancel();
      speaking = false; this.mood(mood || "neutral");
      textEl.textContent = "";
      if (instant) { textEl.textContent = text; typing = false; upd(); if (done) done(); return; }
      var i = 0; typing = true; amp = 1; upd();
      if (this.voiceOn) speak(text);
      timer = setInterval(function () {
        i++;
        textEl.textContent = text.slice(0, i);
        var ch = text.charAt(i - 1);
        amp = /[ ,.;:!?]/.test(ch) ? 0.1 : 1;
        if (i >= text.length) { clearInterval(timer); typing = false; upd(); if (done) done(); }
      }, 22);
    },
    skip: function (textEl, text, done) { clearInterval(timer); textEl.textContent = text; typing = false; upd(); if (done) done(); },
    stop: function () { clearInterval(timer); if (window.speechSynthesis) speechSynthesis.cancel(); typing = false; speaking = false; talking = false; }
  };
})();
