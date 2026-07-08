/* ALÜMTAŞ METAL — interactions */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- i18n ---------------- */
  var langBtn = document.getElementById("langBtn");
  var current = localStorage.getItem("alumtas_lang") || "tr";

  function applyLang(lang) {
    var dict = window.I18N[lang];
    if (!dict) return;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.textContent = dict[key];
    });
    // toggle button visual: highlight active language
    var on = langBtn.querySelector(".lang__on");
    var off = langBtn.querySelector(".lang__off");
    if (lang === "tr") { on.textContent = "TR"; off.textContent = "EN"; }
    else { on.textContent = "EN"; off.textContent = "TR"; }
    localStorage.setItem("alumtas_lang", lang);
    current = lang;
  }

  langBtn.addEventListener("click", function () {
    applyLang(current === "tr" ? "en" : "tr");
  });
  applyLang(current);

  /* ---------------- Nav: scroll state + mobile menu ---------------- */
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");

  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 20);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  burger.addEventListener("click", function () {
    var open = menu.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      menu.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------------- Reveal on scroll ---------------- */
  var revealables = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Animated counters ---------------- */
  var counters = document.querySelectorAll(".stat__num");
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) { el.textContent = target.toLocaleString("tr-TR") + suffix; return; }
    var start = performance.now();
    var dur = 1600;
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("tr-TR") + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCounter(e.target); cObs.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cObs.observe(c); });
  } else {
    counters.forEach(runCounter);
  }

  /* ---------------- Contact form → mailto ---------------- */
  var form = document.getElementById("quoteForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var subject = "Teklif Talebi — " + (d.get("material") || "Genel");
      var body =
        "Ad/Firma: " + (d.get("name") || "") + "\n" +
        "E-posta: " + (d.get("email") || "") + "\n" +
        "Malzeme: " + (d.get("material") || "") + "\n\n" +
        (d.get("msg") || "");
      window.location.href =
        "mailto:info@alumtasmetal.com?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }

  /* ---------------- Footer year ---------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ================================================================
     SIGNATURE: molten spark canvas
     Sparks erupt from a cutting/welding point at bottom-right,
     coloured across the heat spectrum, with gravity, drag,
     flicker and a bright glowing core.
     ================================================================ */
  var canvas = document.getElementById("sparks");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;
  var origin = { x: 0, y: 0 };

  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    // emission point: lower-right region, like a torch on stock
    origin.x = W * 0.82;
    origin.y = H * 0.72;
  }
  resize();
  window.addEventListener("resize", resize);

  // heat spectrum: hot core (white-yellow) → orange → deep ember
  var HEAT = ["#FFF3D6", "#FFB627", "#FF7A1A", "#FF4D0A", "#C41E0A"];

  function Spark() { this.reset(); }
  Spark.prototype.reset = function () {
    this.x = origin.x + (Math.random() - 0.5) * 14;
    this.y = origin.y + (Math.random() - 0.5) * 10;
    // spray mostly up-left, wide arc
    var ang = (-Math.PI * 0.9) + (Math.random() - 0.5) * Math.PI * 0.95;
    var spd = 2 + Math.random() * 6.5;
    this.vx = Math.cos(ang) * spd;
    this.vy = Math.sin(ang) * spd;
    this.life = 1;
    this.decay = 0.008 + Math.random() * 0.02;
    this.size = 0.6 + Math.random() * 1.9;
    this.color = HEAT[(Math.random() * HEAT.length) | 0];
    this.trail = 2 + Math.random() * 6;
  };
  Spark.prototype.step = function () {
    this.vy += 0.11;          // gravity
    this.vx *= 0.985;         // drag
    this.vy *= 0.985;
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    if (this.life <= 0 || this.y > H + 20) this.reset();
  };
  Spark.prototype.draw = function () {
    var a = Math.max(this.life, 0);
    var flick = 0.7 + Math.random() * 0.3;
    ctx.globalAlpha = a * flick;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.vx * (this.trail / 6), this.y - this.vy * (this.trail / 6));
    ctx.stroke();
  };

  // Ambient rising embers (slow, few) for depth
  function Ember() { this.reset(true); }
  Ember.prototype.reset = function (init) {
    this.x = origin.x + (Math.random() - 0.5) * 220;
    this.y = init ? Math.random() * H : origin.y;
    this.vy = -(0.25 + Math.random() * 0.7);
    this.vx = (Math.random() - 0.5) * 0.4;
    this.size = 0.7 + Math.random() * 1.6;
    this.life = 0.4 + Math.random() * 0.6;
    this.color = HEAT[2 + ((Math.random() * 3) | 0)];
  };
  Ember.prototype.step = function () {
    this.y += this.vy; this.x += this.vx;
    this.life -= 0.004;
    if (this.life <= 0 || this.y < -10) this.reset(false);
  };
  Ember.prototype.draw = function () {
    ctx.globalAlpha = Math.max(this.life, 0) * 0.6;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  };

  if (reduceMotion) {
    // static ember glow — no animation loop
    var g = ctx.createRadialGradient(origin.x, origin.y, 0, origin.x, origin.y, 260);
    g.addColorStop(0, "rgba(255,120,26,0.5)");
    g.addColorStop(0.4, "rgba(255,77,10,0.18)");
    g.addColorStop(1, "rgba(255,77,10,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    return;
  }

  var count = W < 640 ? 120 : 240;
  var sparks = [], embers = [];
  for (var i = 0; i < count; i++) sparks.push(new Spark());
  for (var j = 0; j < 30; j++) embers.push(new Ember());

  var running = true;
  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
    if (running) requestAnimationFrame(loop);
  });

  function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);

    // hot glow pool at the source
    ctx.globalAlpha = 1;
    var glow = ctx.createRadialGradient(origin.x, origin.y, 0, origin.x, origin.y, 170);
    glow.addColorStop(0, "rgba(255,150,40,0.35)");
    glow.addColorStop(0.5, "rgba(255,77,10,0.10)");
    glow.addColorStop(1, "rgba(255,77,10,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = "lighter";
    for (var e = 0; e < embers.length; e++) { embers[e].step(); embers[e].draw(); }
    for (var s = 0; s < sparks.length; s++) { sparks[s].step(); sparks[s].draw(); }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
