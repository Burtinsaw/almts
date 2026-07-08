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

  /* ---------------- Hero video: respect reduced motion ---------------- */
  var heroVideo = document.getElementById("heroVideo");
  if (heroVideo && reduceMotion) {
    heroVideo.removeAttribute("autoplay");
    heroVideo.pause();          // poster frame stays visible
  }
})();
