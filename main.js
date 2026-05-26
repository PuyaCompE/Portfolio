/* Puya Fard — Portfolio shared behaviour: scroll-reveal + stat count-up */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Scroll reveal --------------------------------------------------- */
  // The 'reveal' class is added here (not in the HTML) so that with JS
  // disabled everything stays visible.
  var revealSelector = [
    ".card", ".interest-card", ".work-item", ".project-card",
    ".education-item", ".skill-category", ".section-header",
    ".quote-box", ".tech-stack", ".category-header"
  ].join(",");

  var revealEls = Array.prototype.slice.call(
    document.querySelectorAll(revealSelector)
  );

  if (revealEls.length && !reduceMotion && "IntersectionObserver" in window) {
    revealEls.forEach(function (el) { el.classList.add("reveal"); });
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---- Stat count-up --------------------------------------------------- */
  var statEls = Array.prototype.slice.call(
    document.querySelectorAll(".stat-number")
  );

  function countUp(el) {
    var match = el.textContent.trim().match(/^(\d+)(.*)$/);
    if (!match) { return; }
    var target = parseInt(match[1], 10);
    var suffix = match[2] || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var duration = 1200;
    var start = null;
    function step(now) {
      if (start === null) { start = now; }
      var progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  if (statEls.length) {
    if ("IntersectionObserver" in window) {
      var statObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            countUp(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      statEls.forEach(function (el) { statObserver.observe(el); });
    } else {
      statEls.forEach(countUp);
    }
  }
})();
