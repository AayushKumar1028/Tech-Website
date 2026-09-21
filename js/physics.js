/* EGG//DROP — physics tooling
   1) impact-force calculator  F = dp / dt   (investigation page)
   2) canvas drop simulator                  (evaluation page)
   Both are optional: each self-disables when its markup is absent. */

(function () {
  "use strict";

  var G = 9.81; // m/s^2
  var EGG_LIMIT_N = 24; // rough breaking force for a boiled egg (~25 N)

  /* =========================================================
     1. IMPACT FORCE CALCULATOR
     ========================================================= */
  var calc = document.getElementById("calc");
  if (calc) {
    var mass = document.getElementById("calc-mass");
    var height = document.getElementById("calc-height");
    var stop = document.getElementById("calc-stop");

    var outV = document.getElementById("out-v");
    var outP = document.getElementById("out-p");
    var outF = document.getElementById("out-f");
    var outG = document.getElementById("out-g");
    var meter = document.getElementById("calc-meter");
    var verdict = document.getElementById("calc-verdict");
    var verdictBox = document.getElementById("calc-verdict-box");

    var fmt = function (n, d) {
      if (!isFinite(n)) return "—";
      return n.toFixed(d === undefined ? 2 : d);
    };

    var compute = function () {
      var m = Math.max(0.001, parseFloat(mass.value) || 0) / 1000; // g -> kg
      var h = Math.max(0.01, parseFloat(height.value) || 0) / 100; // cm -> m
      var t = Math.max(0.001, parseFloat(stop.value) || 0) / 1000; // ms -> s

      var v = Math.sqrt(2 * G * h); // impact speed
      var p = m * v; // momentum
      var F = p / t; // average force
      var decel = F / m;
      var gForce = decel / G;

      if (outV) outV.textContent = fmt(v) + " m/s";
      if (outP) outP.textContent = fmt(p, 3) + " kg·m/s";
      if (outF) outF.textContent = fmt(F, 1) + " N";
      if (outG) outG.textContent = fmt(gForce, 0) + " g";

      var ratio = F / EGG_LIMIT_N;
      if (meter) meter.style.width = Math.min(100, ratio * 100).toFixed(1) + "%";

      if (verdict && verdictBox) {
        var cracked = F > EGG_LIMIT_N;
        verdict.textContent = cracked
          ? "SHELL FAILS — " + fmt(ratio, 1) + "× the breaking load. Stretch the stop time."
          : "SHELL HOLDS — " + fmt(ratio, 1) + "× the breaking load. Keep it that way.";
        verdictBox.style.color = cracked ? "#f87171" : "#a3e635";
      }
    };

    [mass, height, stop].forEach(function (el) {
      if (el) {
        el.addEventListener("input", compute);
        el.addEventListener("change", compute);
      }
    });
    compute();
  }

  /* =========================================================
     2. DROP SIMULATOR
     ========================================================= */
  var canvas = document.getElementById("sim-canvas");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var heightSlider = document.getElementById("sim-height");
    var heightLabel = document.getElementById("sim-height-label");
    var dropBtn = document.getElementById("sim-drop");
    var resetBtn = document.getElementById("sim-reset");
    var payloadBtns = Array.prototype.slice.call(document.querySelectorAll("[data-payload]"));
    var resSpeed = document.getElementById("sim-speed");
    var resForce = document.getElementById("sim-force");
    var resTime = document.getElementById("sim-time");
    var resVerdict = document.getElementById("sim-verdict");
    var statusEl = document.getElementById("sim-status");

    var W = 900;
    var H = 440;
    var GROUND = H - 46;
    var CEIL = 34;
    var MAX_M = 3.2;
    var pxPerM = (GROUND - CEIL) / MAX_M;

    var payload = "device";
    var dropHeight = 1.5;
    var state = null; // { t, alt, v, phase, cracked, squash, ... }
    var raf = null;
    var squashRaf = null;
    var last = 0;

    var PARAMS = {
      bare: { mass: 0.06, crush: 0.004, allow: false, dragV: Infinity, color: "#fef3c7" },
      device: { mass: 0.15, crush: 0.09, allow: true, dragV: 3.2, color: "#fde68a" },
    };

    var lastW = 0;
    var resize = function (force) {
      var dpr = window.devicePixelRatio || 1;
      var cssW = Math.round(canvas.clientWidth) || 900;
      // layout can be unsettled on the first paint — only re-measure on a real change
      if (!force && cssW === lastW && canvas.width) return;
      lastW = cssW;
      W = Math.max(320, cssW);
      H = Math.round(Math.max(320, Math.min(460, W * 0.52)));
      GROUND = H - 46;
      pxPerM = (GROUND - CEIL) / MAX_M;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    var yFor = function (alt) {
      return GROUND - alt * pxPerM;
    };

    var drawGrid = function () {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#05080f";
      ctx.fillRect(0, 0, W, H);

      // vertical grid
      ctx.strokeStyle = "rgba(56,189,248,0.08)";
      ctx.lineWidth = 1;
      for (var x = 0; x <= W; x += 46) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, GROUND);
        ctx.stroke();
      }
      // horizontal metre marks
      ctx.font = "11px 'JetBrains Mono', monospace";
      for (var m = 0; m <= MAX_M; m += 0.5) {
        var y = yFor(m);
        ctx.strokeStyle = m % 1 === 0 ? "rgba(56,189,248,0.22)" : "rgba(56,189,248,0.09)";
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
        if (m % 0.5 === 0) {
          ctx.fillStyle = "rgba(133,152,189,0.7)";
          ctx.fillText(m.toFixed(1) + " m", 8, y - 5);
        }
      }
      // ground
      ctx.fillStyle = "rgba(34,211,238,0.14)";
      ctx.fillRect(0, GROUND, W, H - GROUND);
      ctx.strokeStyle = "rgba(34,211,238,0.6)";
      ctx.beginPath();
      ctx.moveTo(0, GROUND);
      ctx.lineTo(W, GROUND);
      ctx.stroke();

      // start marker for the selected height
      var hy = yFor(dropHeight);
      ctx.setLineDash([5, 7]);
      ctx.strokeStyle = "rgba(251,191,36,0.75)";
      ctx.beginPath();
      ctx.moveTo(0, hy);
      ctx.lineTo(W, hy);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(251,191,36,0.85)";
      ctx.fillText("DROP ALT " + dropHeight.toFixed(2) + " m", W - 168, hy - 7);
    };

    var drawEgg = function (cx, cy, r, rot) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot || 0);
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.78, r, 0, 0, Math.PI * 2);
      var grd = ctx.createRadialGradient(-r * 0.3, -r * 0.4, r * 0.1, 0, 0, r * 1.2);
      grd.addColorStop(0, "#fff7e6");
      grd.addColorStop(1, "#f3d9a4");
      ctx.fillStyle = grd;
      ctx.shadowColor = "rgba(251,191,36,0.55)";
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(120,90,30,0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    };

    var drawDevice = function (cx, cy) {
      var w = 56;
      var h = 68;
      var x = cx - w / 2;
      var y = cy - h / 2;

      // canopy
      var canY = cy - 88;
      ctx.beginPath();
      ctx.moveTo(cx - 48, canY);
      ctx.quadraticCurveTo(cx, canY - 40, cx + 48, canY);
      ctx.strokeStyle = "rgba(34,211,238,0.9)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "rgba(34,211,238,0.12)";
      ctx.fill();

      // suspension lines
      ctx.strokeStyle = "rgba(34,211,238,0.5)";
      ctx.lineWidth = 1;
      [-48, -16, 16, 48].forEach(function (dx, i) {
        ctx.beginPath();
        ctx.moveTo(cx + dx, canY);
        ctx.lineTo(cx + [-w / 2, -w / 6, w / 6, w / 2][i], y);
        ctx.stroke();
      });

      // shell
      ctx.fillStyle = "rgba(12,19,35,0.95)";
      ctx.strokeStyle = "rgba(34,211,238,0.85)";
      ctx.lineWidth = 1.5;
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);

      // suspension tape lines inside
      ctx.strokeStyle = "rgba(251,191,36,0.55)";
      ctx.beginPath();
      ctx.moveTo(x + 6, y + 6);
      ctx.lineTo(cx, cy + 6);
      ctx.lineTo(x + w - 6, y + 6);
      ctx.stroke();

      drawEgg(cx, cy + 8, 16, 0);
    };

    var drawCrack = function (cx, cy) {
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy - 6);
      ctx.lineTo(cx - 2, cy + 1);
      ctx.lineTo(cx - 7, cy + 5);
      ctx.lineTo(cx + 1, cy + 9);
      ctx.moveTo(cx - 2, cy + 1);
      ctx.lineTo(cx + 6, cy - 3);
      ctx.stroke();
    };

    var draw = function () {
      drawGrid();
      var cx = W * 0.5;

      if (state) {
        var alt = Math.max(-0.06, state.alt);
        var cy = yFor(alt) + (state.squash || 0) * 6;
        if (state.phase === "stop") cy = yFor(0) + (state.squash || 0) * 8;
        // keep the whole rig on screen, canopy included
        var minY = payload === "device" ? CEIL + 96 : CEIL + 26;
        if (cy < minY) cy = minY;
        if (payload === "device") {
          drawDevice(cx, cy);
        } else {
          drawEgg(cx, cy, 21, (state.rot || 0));
        }
        if (state.cracked && (state.phase === "stop" || state.phase === "done")) {
          drawCrack(cx, cy + (payload === "device" ? 6 : 0));
        }
      } else {
        // idle: parked at the drop altitude
        var idle = yFor(dropHeight);
        var floorY = payload === "device" ? CEIL + 96 : CEIL + 26;
        if (idle < floorY) idle = floorY;
        if (payload === "device") drawDevice(cx, idle);
        else drawEgg(cx, idle, 21, 0);
      }
    };

    var finish = function (impactV, tFall) {
      var p = PARAMS[payload];
      var force = (p.mass * impactV * impactV) / (2 * p.crush);
      var cracked = force > EGG_LIMIT_N;

      state.phase = "stop";
      state.cracked = cracked;

      if (resSpeed) resSpeed.textContent = impactV.toFixed(2) + " m/s";
      if (resForce) resForce.textContent = force.toFixed(1) + " N";
      if (resTime) resTime.textContent = tFall.toFixed(2) + " s";
      if (resVerdict) {
        resVerdict.textContent = cracked ? "CRACKED" : "INTACT";
        resVerdict.style.color = cracked ? "#f87171" : "#a3e635";
      }
      if (statusEl) {
        statusEl.textContent = cracked
          ? "impact " + force.toFixed(0) + " N exceeded the shell limit of " + EGG_LIMIT_N + " N"
          : "impact " + force.toFixed(0) + " N stayed under the " + EGG_LIMIT_N + " N shell limit";
      }

      // squash then settle
      var t0 = performance.now();
      var squash = function (now) {
        if (!state) return;
        var k = Math.min(1, (now - t0) / 260);
        state.squash = Math.sin(k * Math.PI) * 1;
        draw();
        if (k < 1) {
          squashRaf = requestAnimationFrame(squash);
        } else {
          squashRaf = null;
          state.squash = 0;
          state.phase = "done";
          draw();
        }
      };
      squashRaf = requestAnimationFrame(squash);
    };

    var frame = function (now) {
      if (!state) return;
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;

      if (state.phase === "fall") {
        state.t += dt;
        var p = PARAMS[payload];
        var a = G;
        if (p.dragV !== Infinity) {
          // parachute: drag grows with speed, falling to a terminal velocity
          a = G * (1 - state.v / p.dragV);
        }
        state.v += a * dt;
        state.alt -= state.v * dt;
        state.rot = Math.sin(state.t * 6) * 0.06;
        if (state.alt <= 0) {
          state.alt = 0;
          finish(state.v, state.t);
          return;
        }
      }

      draw();
      raf = requestAnimationFrame(frame);
    };

    var reset = function (msg) {
      if (raf) cancelAnimationFrame(raf);
      if (squashRaf) cancelAnimationFrame(squashRaf);
      raf = null;
      squashRaf = null;
      state = { t: 0, alt: dropHeight, v: 0, phase: "idle", cracked: false, squash: 0, rot: 0 };
      if (resSpeed) resSpeed.textContent = "—";
      if (resForce) resForce.textContent = "—";
      if (resTime) resTime.textContent = "—";
      if (resVerdict) {
        resVerdict.textContent = "STANDBY";
        resVerdict.style.color = "";
      }
      if (statusEl) statusEl.textContent = msg || "ready — arm the rig and press DROP";
      draw();
    };

    var drop = function () {
      reset("released from " + dropHeight.toFixed(2) + " m");
      state.alt = dropHeight;
      state.phase = "fall";
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    if (heightSlider) {
      heightSlider.addEventListener("input", function () {
        dropHeight = parseFloat(heightSlider.value);
        if (heightLabel) heightLabel.textContent = dropHeight.toFixed(2) + " m";
        if (!state || state.phase === "idle" || state.phase === "done") reset();
        else draw();
      });
    }

    payloadBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        payload = btn.getAttribute("data-payload");
        payloadBtns.forEach(function (b) {
          var active = b === btn;
          b.setAttribute("aria-pressed", active ? "true" : "false");
          b.style.borderColor = active ? "rgba(34,211,238,0.9)" : "";
          b.style.color = active ? "#22d3ee" : "";
        });
        reset();
      });
    });

    // wrap the handlers so the click event is never mistaken for a status message
    if (dropBtn) dropBtn.addEventListener("click", function () { drop(); });
    if (resetBtn) resetBtn.addEventListener("click", function () { reset(); });

    window.addEventListener("resize", function () { resize(true); });
    window.addEventListener("load", function () { resize(true); });
    if (window.ResizeObserver) {
      new ResizeObserver(function () { resize(false); }).observe(canvas);
    }
    resize(true);
    reset();
  }
})();
