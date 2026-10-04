/* carousel.js: looping carousel. Moves left to right by itself, can be dragged either way,
   scrolled sideways, or stepped with the buttons. Pauses on hover, focus and drag.
   Hooks: [data-carousel], [data-carousel-viewport], [data-carousel-track],
          [data-carousel-prev], [data-carousel-next], [data-carousel-toggle].
   Without JavaScript the viewport is a normal sideways scroller. */
(function () {
  "use strict";

  var root = document.querySelector("[data-carousel]");
  if (!root) {
    return;
  }

  var viewport = root.querySelector("[data-carousel-viewport]");
  var track = root.querySelector("[data-carousel-track]");
  var prevBtn = root.querySelector("[data-carousel-prev]");
  var nextBtn = root.querySelector("[data-carousel-next]");
  var toggleBtn = root.querySelector("[data-carousel-toggle]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var SPEED = 36; // pixels per second, moving left to right
  var originals = Array.prototype.slice.call(track.children);
  var setWidth = 0;
  var x = 0;
  var userPaused = reduceMotion;
  var hovering = false;
  var focused = false;
  var dragging = false;
  var visible = true;
  var tween = null;
  var last = 0;
  var dragStartX = 0;
  var dragStartPos = 0;
  var dragMoved = 0;

  function measure() {
    // Remove old clones, then rebuild enough copies to fill any screen width
    Array.prototype.slice.call(track.children).forEach(function (el) {
      if (el.hasAttribute("data-clone")) {
        track.removeChild(el);
      }
    });
    setWidth = track.scrollWidth + parseFloat(getComputedStyle(track).columnGap || 0);
    var copies = Math.ceil(viewport.clientWidth / setWidth) + 2;
    for (var c = 1; c < copies; c += 1) {
      originals.forEach(function (item) {
        var clone = item.cloneNode(true);
        clone.setAttribute("data-clone", "");
        clone.setAttribute("aria-hidden", "true");
        Array.prototype.forEach.call(clone.querySelectorAll("a, button"), function (el) {
          el.setAttribute("tabindex", "-1");
        });
        track.appendChild(clone);
      });
    }
  }

  function normalise() {
    // Keep the view inside the middle copy so the loop never runs out
    while (x > -setWidth) {
      x -= setWidth;
    }
    while (x <= -2 * setWidth) {
      x += setWidth;
    }
  }

  function apply() {
    track.style.transform = "translate3d(" + x.toFixed(2) + "px,0,0)";
  }

  function stepSize() {
    var first = originals[0];
    return first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0);
  }

  function moveBy(distance) {
    if (reduceMotion) {
      x += distance;
      normalise();
      apply();
      return;
    }
    var from = x;
    var start = performance.now();
    var duration = 240;
    tween = function (now) {
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 4);
      x = from + distance * eased;
      normalise();
      apply();
      if (t >= 1) {
        tween = null;
      }
    };
  }

  function running() {
    return !userPaused && !hovering && !focused && !dragging && visible && !tween;
  }

  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (tween) {
      tween(now);
    } else if (running()) {
      x += SPEED * dt;
      normalise();
      apply();
    }
    window.requestAnimationFrame(frame);
  }

  function setPaused(state) {
    userPaused = state;
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-pressed", String(state));
      toggleBtn.setAttribute("aria-label", state ? "Play automatic scrolling" : "Pause automatic scrolling");
    }
  }

  // Dragging with mouse, pen or touch
  viewport.addEventListener("pointerdown", function (event) {
    if (event.button !== 0 || event.target.closest("button")) {
      return;
    }
    dragging = true;
    tween = null;
    dragMoved = 0;
    dragStartX = event.clientX;
    dragStartPos = x;
    root.classList.add("is-dragging");
    viewport.setPointerCapture(event.pointerId);
  });

  viewport.addEventListener("pointermove", function (event) {
    if (!dragging) {
      return;
    }
    var dx = event.clientX - dragStartX;
    dragMoved = Math.max(dragMoved, Math.abs(dx));
    x = dragStartPos + dx;
    normalise();
    apply();
  });

  function endDrag() {
    if (!dragging) {
      return;
    }
    dragging = false;
    root.classList.remove("is-dragging");
  }

  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);

  // A drag must not open the link under the pointer
  viewport.addEventListener(
    "click",
    function (event) {
      if (dragMoved > 6) {
        event.preventDefault();
        event.stopPropagation();
        dragMoved = 0;
      }
    },
    true
  );

  viewport.addEventListener("dragstart", function (event) {
    event.preventDefault();
  });

  // Sideways trackpad or wheel movement
  viewport.addEventListener(
    "wheel",
    function (event) {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        event.preventDefault();
        tween = null;
        x -= event.deltaX;
        normalise();
        apply();
      }
    },
    { passive: false }
  );

  // Hover and focus pause the motion
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    root.addEventListener("mouseenter", function () {
      hovering = true;
    });
    root.addEventListener("mouseleave", function () {
      hovering = false;
    });
  }

  root.addEventListener("focusin", function (event) {
    focused = true;
    var item = event.target.closest(".carousel__item");
    viewport.scrollLeft = 0;
    if (item && !item.hasAttribute("data-clone")) {
      var target = -(item.offsetLeft + setWidth) + (viewport.clientWidth - item.offsetWidth) / 2;
      x = target;
      normalise();
      apply();
    }
  });

  root.addEventListener("focusout", function (event) {
    if (!root.contains(event.relatedTarget)) {
      focused = false;
    }
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      moveBy(stepSize());
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      moveBy(-stepSize());
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      setPaused(!userPaused);
    });
  }

  root.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      moveBy(stepSize());
    } else if (event.key === "ArrowRight") {
      moveBy(-stepSize());
    }
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
    }).observe(root);
  }

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      measure();
      normalise();
      apply();
    }, 150);
  });

  // Start
  measure();
  root.classList.add("is-active");
  x = -setWidth;
  apply();
  setPaused(userPaused);
  last = performance.now();
  window.requestAnimationFrame(frame);
})();
