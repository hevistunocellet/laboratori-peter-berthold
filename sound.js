/* So del laboratori: música ambient suau i efectes petits, generats amb codi (Web Audio). Sense fitxers ni drets d'autor. */
window.LAB = window.LAB || {};
(function () {
  var ctx, master, musicG, delay, fb, wet, timer, on = false, nextT = 0, step = 0, ready = false, level = 0.16;
  var CH = [ [57, 60, 64, 67], [53, 57, 60, 64], [48, 55, 60, 64], [55, 59, 62, 66] ];      // Am9, Fmaj7, C, G (notes MIDI)
  var PENT = [69, 72, 74, 76, 79, 81, 84];                                                    // pentatònica
  function f(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  function init() {
    if (ready) return true;
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    musicG = ctx.createGain(); musicG.gain.value = level; musicG.connect(master);
    delay = ctx.createDelay(1); delay.delayTime.value = 0.38; fb = ctx.createGain(); fb.gain.value = 0.38; wet = ctx.createGain(); wet.gain.value = 0.35;
    delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(musicG);
    ready = true;
    document.addEventListener("visibilitychange", function () { if (!ctx) return; if (document.hidden) ctx.suspend(); else if (on) ctx.resume(); });
    return true;
  }
  function tone(type, freq, t, dur, gain, dest, att) {
    var o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(gain, t + (att || 0.02)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.05); return o;
  }
  function schedule() {
    if (!on || !ctx) return;
    while (nextT < ctx.currentTime + 0.6) {
      var bar = Math.floor(step / 16) % CH.length, beat = step % 16;
      if (beat === 0) CH[bar].forEach(function (m, i) { var o = tone("sine", f(m - 12), nextT, 7.5, 0.10, musicG, 1.4); o.detune.value = (i - 1.5) * 5; tone("triangle", f(m), nextT, 7, 0.035, musicG, 1.8); });
      if (beat % 2 === 0 && Math.random() < 0.55) { var n = PENT[Math.floor(Math.random() * PENT.length)]; tone("triangle", f(n), nextT, 1.3, 0.06, delay, 0.01); tone("sine", f(n), nextT, 0.8, 0.03, musicG, 0.01); }
      if (beat === 5 && Math.random() < 0.35) { var o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine"; o.frequency.setValueAtTime(380, nextT); o.frequency.exponentialRampToValueAtTime(900, nextT + 0.11);
        g.gain.setValueAtTime(0.0001, nextT); g.gain.linearRampToValueAtTime(0.05, nextT + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, nextT + 0.14); o.connect(g); g.connect(musicG); o.start(nextT); o.stop(nextT + 0.2); }   // bombolla de laboratori
      nextT += 0.5; step++;
    }
  }
  var LABsound = {
    start: function () { if (!init()) return; ctx.resume(); if (on) return; on = true; nextT = ctx.currentTime + 0.1; step = 0; clearInterval(timer); timer = setInterval(schedule, 120); musicG.gain.setTargetAtTime(level, ctx.currentTime, 0.5); },
    stop: function () { on = false; clearInterval(timer); if (ctx) musicG.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.2); },
    isOn: function () { return on; },
    duck: function (d) { if (ctx && on) musicG.gain.setTargetAtTime(d ? level * 0.4 : level, ctx.currentTime, 0.25); },
    sfx: function (name) {
      if (!ready || !ctx || ctx.state === "suspended") { if (!ready && !init()) return; }
      if (!ctx) return; var t = ctx.currentTime + 0.01, d = master;
      if (name === "place") { tone("triangle", 520, t, 0.14, 0.12, d); tone("triangle", 780, t + 0.07, 0.16, 0.10, d); }
      else if (name === "tick") tone("square", 900, t, 0.05, 0.04, d);
      else if (name === "go") { var o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sawtooth"; o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(700, t + 0.5);
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.07, t + 0.1); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55); o.connect(g); g.connect(d); o.start(t); o.stop(t + 0.6); }
      else if (name === "ping") { tone("sine", 880, t, 0.5, 0.14, d); tone("sine", 1320, t + 0.12, 0.7, 0.12, d); tone("sine", 1760, t + 0.26, 0.9, 0.08, d); }
      else if (name === "hmm") { tone("sine", 330, t, 0.35, 0.10, d); tone("sine", 262, t + 0.2, 0.5, 0.10, d); }
    },
    analyser: function () { if (!ctx) return null; var a = ctx.createAnalyser(); master.connect(a); return a; }
  };
  LAB.sound = LABsound;
})();
