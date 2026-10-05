/* filter.js: type filters for the assignments list, and period filter plus search for publications. */
(function () {
  "use strict";

  function setOn(group, active) {
    Array.prototype.forEach.call(group.querySelectorAll(".chip"), function (b) {
      var on = b === active;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", String(on));
    });
  }

  // Assignments: filter by type
  var bar = document.querySelector("[data-filters]");
  var list = document.querySelector("[data-filter-list]");
  if (bar && list) {
    var rows = Array.prototype.slice.call(list.children);
    var count = document.querySelector("[data-filter-count]");
    var apply = function (key) {
      var shown = 0;
      rows.forEach(function (row) {
        var show = key === "all" || (row.getAttribute("data-cat") || "").split(" ").indexOf(key) !== -1;
        row.hidden = !show;
        if (show) { shown += 1; }
      });
      if (count) {
        count.textContent = "Showing " + shown + " of " + rows.length + " assignments";
      }
    };
    bar.addEventListener("click", function (e) {
      var b = e.target.closest("[data-filter]");
      if (!b) { return; }
      setOn(bar, b);
      apply(b.getAttribute("data-filter"));
    });
    apply("all");
  }

  // Publications: period buttons and text search
  var pbar = document.querySelector("[data-pub-filters]");
  var plist = document.querySelector("[data-pub-list]");
  if (pbar && plist) {
    var items = Array.prototype.slice.call(plist.children);
    var search = pbar.querySelector("[data-pub-search]");
    var pcount = document.querySelector("[data-pub-count]");
    var empty = document.querySelector("[data-pub-empty]");
    var decade = "all";
    var run = function () {
      var q = search ? search.value.trim().toLowerCase() : "";
      var shown = 0;
      items.forEach(function (li) {
        var y = parseInt(li.getAttribute("data-year"), 10);
        var inDecade = decade === "all" ||
          (decade === "2010" ? y >= 2010 : (y >= +decade && y < +decade + 10));
        var inText = !q || li.textContent.toLowerCase().indexOf(q) !== -1;
        var show = inDecade && inText;
        li.hidden = !show;
        if (show) { shown += 1; }
      });
      if (pcount) {
        pcount.textContent = "Showing " + shown + " of " + items.length + " publications";
      }
      if (empty) { empty.hidden = shown !== 0; }
    };
    pbar.addEventListener("click", function (e) {
      var b = e.target.closest("[data-decade]");
      if (!b) { return; }
      setOn(pbar, b);
      decade = b.getAttribute("data-decade");
      run();
    });
    if (search) { search.addEventListener("input", run); }
    run();
  }
})();
