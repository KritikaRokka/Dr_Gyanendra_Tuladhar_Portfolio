/* expertise.js: pins the expertise section on wide screens and opens one item per scroll step. */
(function () {
  "use strict";

  var section = document.querySelector(".expertise-section");
  if (!section) {
    return;
  }
  var items = Array.prototype.slice.call(section.querySelectorAll(".expertise__item"));
  var bar = section.querySelector(".expertise__progress span");
  var mq = window.matchMedia("(min-width: 1000px) and (prefers-reduced-motion: no-preference)");
  var ticking = false;

  function update() {
    ticking = false;
    if (!mq.matches) {
      return;
    }
    var r = section.getBoundingClientRect();
    var range = r.height - window.innerHeight;
    var p = Math.min(Math.max(-r.top / range, 0), 1);
    var idx = Math.min(items.length - 1, Math.floor(p * items.length));
    items.forEach(function (el, i) {
      el.classList.toggle("is-active", i === idx);
    });
    if (bar) {
      bar.style.setProperty("--p", p.toFixed(3));
    }
  }

  function apply() {
    section.classList.toggle("is-pinned", mq.matches);
    if (!mq.matches) {
      items.forEach(function (el) { el.classList.remove("is-active"); });
    }
    update();
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  window.addEventListener("resize", update);
  mq.addEventListener("change", apply);
  apply();
})();
