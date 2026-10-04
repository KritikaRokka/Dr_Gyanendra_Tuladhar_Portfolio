/* nav.js: mobile menu. Hooks: [data-nav-toggle], [data-nav], [data-nav-label]. */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (!toggle || !nav) {
    return;
  }

  var label = toggle.querySelector("[data-nav-label]");
  var desktop = window.matchMedia("(min-width: 880px)");
  var behind = document.querySelectorAll("main, footer, .skip-link");
  var isOpen = false;

  function trapTargets() {
    return [toggle].concat(Array.prototype.slice.call(nav.querySelectorAll("a[href]")));
  }

  function setBehindInert(state) {
    Array.prototype.forEach.call(behind, function (el) {
      if (state) {
        el.setAttribute("inert", "");
      } else {
        el.removeAttribute("inert");
      }
    });
  }

  function setOpen(state, returnFocus) {
    isOpen = state;
    nav.classList.toggle("is-open", state);
    toggle.setAttribute("aria-expanded", String(state));
    document.body.classList.toggle("is-menu-open", state);
    setBehindInert(state);
    if (label) {
      label.textContent = state ? "Close" : "Menu";
    }
    if (state) {
      var first = nav.querySelector("a[href]");
      if (first) {
        first.focus();
      }
    } else if (returnFocus) {
      toggle.focus();
    }
  }

  toggle.addEventListener("click", function () {
    setOpen(!isOpen, true);
  });

  nav.addEventListener("click", function (event) {
    if (isOpen && event.target.closest("a[href]")) {
      setOpen(false, false);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (!isOpen) {
      return;
    }
    if (event.key === "Escape") {
      setOpen(false, true);
      return;
    }
    if (event.key !== "Tab") {
      return;
    }
    var items = trapTargets();
    var first = items[0];
    var last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  function onBreakpoint(event) {
    if (event.matches && isOpen) {
      setOpen(false, false);
    }
  }

  if (desktop.addEventListener) {
    desktop.addEventListener("change", onBreakpoint);
  } else if (desktop.addListener) {
    desktop.addListener(onBreakpoint);
  }
})();
