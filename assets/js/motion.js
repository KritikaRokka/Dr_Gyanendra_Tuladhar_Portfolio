/* motion.js: scroll parallax, count-up stats, header shadow, smooth in-page scrolling. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    return;
  }

  document.documentElement.style.scrollBehavior = "smooth";

  /* Parallax: elements drift slightly against scroll */
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-parallax], .hero__portrait, .field-strip .figure, .cta__bg img"));
  var ticking = false;

  function update() {
    var vh = window.innerHeight;
    items.forEach(function (el, i) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) {
        return;
      }
      var progress = (r.top + r.height / 2 - vh / 2) / vh;
      var speed = el.classList.contains("hero__portrait") ? 28 : (i % 2 ? 22 : 36);
      el.style.setProperty("--py", (progress * -speed).toFixed(1) + "px");
    });
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();

  /* Count-up stats */
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) {
          return;
        }
        io.unobserve(e.target);
        var el = e.target, end = +el.dataset.count, suffix = el.dataset.suffix || "", start = null;
        function step(t) {
          start = start || t;
          var p = Math.min((t - start) / 1400, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
          if (p < 1) {
            requestAnimationFrame(step);
          }
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { io.observe(c); });
  }
})();
