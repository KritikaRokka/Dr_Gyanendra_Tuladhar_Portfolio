/* gallery.js: a simple lightbox for [data-lightbox] links. */
(function () {
  "use strict";

  var links = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (!links.length || typeof HTMLDialogElement === "undefined") {
    return;
  }

  var box = document.createElement("dialog");
  box.className = "gallery-box";
  box.setAttribute("aria-label", "Photograph viewer");
  box.innerHTML = '<img alt=""><div class="gallery-box__bar"><button type="button" data-prev aria-label="Previous photo">&larr;</button><button type="button" data-close>Close</button><button type="button" data-next aria-label="Next photo">&rarr;</button></div>';
  document.body.appendChild(box);
  var img = box.querySelector("img");
  var index = 0;

  function visible() {
    return links.filter(function (a) { return a.offsetParent !== null; });
  }

  function show(list, i) {
    index = (i + list.length) % list.length;
    img.src = list[index].href;
    img.alt = list[index].querySelector("img").alt;
  }

  links.forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var list = visible();
      show(list, list.indexOf(a));
      box.showModal();
    });
  });

  box.addEventListener("click", function (e) {
    var list = visible();
    if (e.target.closest("[data-next]")) { show(list, index + 1); }
    else if (e.target.closest("[data-prev]")) { show(list, index - 1); }
    else if (e.target.closest("[data-close]") || e.target === box) { box.close(); }
  });

  box.addEventListener("keydown", function (e) {
    var list = visible();
    if (e.key === "ArrowRight") { show(list, index + 1); }
    else if (e.key === "ArrowLeft") { show(list, index - 1); }
  });
})();
