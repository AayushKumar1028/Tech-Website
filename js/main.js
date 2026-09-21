/* EGG//DROP — shared behaviours
   nav toggle, scroll progress, scroll reveals, terminal boot, footer year. */

(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  /* ---- mobile nav ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- scroll progress hairline ---- */
  var bar = document.getElementById("progress");
  if (bar) {
    var update = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = pct.toFixed(2) + "%";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ---- reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
      );
      reveals.forEach(function (el) {
        io.observe(el);
      });
    } else {
      reveals.forEach(function (el) {
        el.classList.add("in");
      });
    }
  }

  /* ---- terminal boot sequence ---- */
  var boot = document.querySelector("[data-boot]");
  if (boot) {
    var lines = Array.prototype.slice.call(boot.querySelectorAll("[data-text]"));
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      lines.forEach(function (el) {
        el.textContent = el.getAttribute("data-text");
      });
    } else {
      var current = 0;
      var tick = function () {
        if (current >= lines.length) return;
        var el = lines[current];
        var text = el.getAttribute("data-text");
        el.classList.add("caret");
        var i = 0;
        var type = function () {
          el.textContent = text.slice(0, ++i);
          if (i < text.length) {
            setTimeout(type, 16);
          } else {
            el.classList.remove("caret");
            current += 1;
            setTimeout(tick, 180);
          }
        };
        type();
      };
      setTimeout(tick, 320);
    }
  }

  /* ---- toggle buttons (criteria checklist) ---- */
  document.querySelectorAll("[data-check]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var on = btn.getAttribute("aria-pressed") === "true";
      btn.setAttribute("aria-pressed", on ? "false" : "true");
    });
  });

  /* ---- footer year ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---- copy-to-clipboard for code chips ---- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
          var old = btn.textContent;
          btn.textContent = "copied";
          setTimeout(function () {
            btn.textContent = old;
          }, 1400);
        });
      }
    });
  });
})();
