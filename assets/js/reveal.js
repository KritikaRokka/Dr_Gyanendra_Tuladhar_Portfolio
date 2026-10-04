/* reveal.js: play-once scroll reveals. Hooks: [data-reveal], [data-reveal-group]. */
(function () {
  "use strict";

  var targets = document.querySelectorAll("[data-reveal], [data-reveal-group]");
  if (!targets.length) {
    return;
  }

  function show(el) {
    el.classList.add("is-visible");
  }

  if (!("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(targets, show);
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          show(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  Array.prototype.forEach.call(targets, function (el) {
    observer.observe(el);
  });
})();
