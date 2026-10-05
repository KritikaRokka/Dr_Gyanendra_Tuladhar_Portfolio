/* experience.js: highlights the experience row nearest the middle of the screen (wide screens). */
(function () {
  "use strict";

  var rows = document.querySelectorAll(".exp-section .exp__row");
  var mq = window.matchMedia("(min-width: 1000px) and (prefers-reduced-motion: no-preference)");
  if (!rows.length || !("IntersectionObserver" in window)) {
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      e.target.classList.toggle("is-current", e.isIntersecting && mq.matches);
    });
  }, { rootMargin: "-42% 0px -42% 0px" });

  rows.forEach(function (r) { io.observe(r); });
})();
