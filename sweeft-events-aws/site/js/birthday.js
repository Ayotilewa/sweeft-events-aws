/* =========================================================
   Sweeft Events — birthday splash for Solomon
   ---------------------------------------------------------
   • Shows on the dates in CONFIG.showOn (Lagos time), the FIRST time
     the site is opened that day on each device. Every other day —
     and every visit after the first that day — it's just the website.
   • Currently: 17 Nov 2026 (approval preview) and 28 Nov 2026 (the
     real day). From 29 Nov it never shows again unless you add a date.
   • Preview it any day with  ?birthday=preview  on the URL, e.g.
     index.html?birthday=preview  (preview never counts as "seen").
   ========================================================= */
(function () {
  "use strict";

  var CONFIG = {
    showOn: ["2026-11-17", "2026-11-28"], // YYYY-MM-DD, Lagos time
    timeZone: "Africa/Lagos",
    requireLink: false,      // true = only show when the link has ?bday (a private link sent to Solomon)
    age: null,               // e.g. 50 → shows a big golden "50" badge. Leave null to hide it.
    title: "Happy Birthday,",
    name: "Solomon",
    to: "From all of us at Sweeft Events",
    message: "Wishing you long life, good health and prosperity — and many more years of turning moments into memories. Today, the celebration is all yours.",
    tongues: ["Ẹ kú ọjọ́ ìbí", "Ụbọchị ọmụmụ ọma", "Barka da ranar haihuwa"],
    signOff: "With love, the Sweeft family ✦",
    button: "Enter the website",
  };

  var params = new URLSearchParams(location.search);
  var preview = params.get("birthday") === "preview";

  function lagosToday() {
    try {
      var parts = new Intl.DateTimeFormat("en-GB", { timeZone: CONFIG.timeZone, year: "numeric", month: "numeric", day: "numeric" }).formatToParts(new Date());
      var o = {};
      parts.forEach(function (p) { o[p.type] = +p.value; });
      return { y: o.year, m: o.month, d: o.day };
    } catch (e) {
      var n = new Date();
      return { y: n.getFullYear(), m: n.getMonth() + 1, d: n.getDate() };
    }
  }

  var t = lagosToday();
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var today = t.y + "-" + pad(t.m) + "-" + pad(t.d);
  var seenKey = "sweeft-bday-seen-" + today;
  var seen = false;
  try { seen = localStorage.getItem(seenKey) === "1"; } catch (e) {}

  var isDay = CONFIG.showOn.indexOf(today) !== -1;
  var linkOk = !CONFIG.requireLink || params.has("bday");
  var show = preview || (isDay && linkOk && !seen);
  if (!show) return;

  // Hide the page instantly so the site doesn't flash before the greeting
  document.documentElement.classList.add("bday-pending");

  function build() {
    var ov = document.createElement("div");
    ov.className = "bday";
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-modal", "true");
    ov.setAttribute("aria-label", CONFIG.title + " " + CONFIG.name);

    var letters = CONFIG.name.split("").map(function (ch, i) {
      return '<span style="--i:' + i + '">' + (ch === " " ? "&nbsp;" : ch) + "</span>";
    }).join("");

    var balloons = "";
    var colours = ["#e6cfa3", "#a0703a", "#f3eae0", "#c9a46a", "#d9b98a", "#8a5a2b"];
    for (var b = 0; b < 14; b++) {
      var bx = b % 2 ? 2 + Math.random() * 20 : 78 + Math.random() * 18; // keep balloons to the sides, clear of the message
      balloons += '<i class="balloon" style="--x:' + bx.toFixed(1) + "%;--c:" + colours[b % colours.length] +
        ";--s:" + (0.6 + Math.random() * 0.7).toFixed(2) + ";--t:" + (9 + Math.random() * 8).toFixed(1) + "s;--dl:" + (Math.random() * 4).toFixed(2) + 's"></i>';
    }

    ov.innerHTML =
      '<div class="bday-curtain bday-curtain-l"></div><div class="bday-curtain bday-curtain-r"></div>' +
      '<div class="bday-splash" aria-hidden="true"><i></i><i></i><i></i></div>' +
      '<canvas class="bday-confetti"></canvas>' +
      '<div class="bday-balloons" aria-hidden="true">' + balloons + "</div>" +
      '<div class="bday-glow" aria-hidden="true"></div>' +
      '<div class="bday-inner">' +
        '<img class="bday-logo" src="assets/logo-gold.png" alt="" />' +
        '<p class="bday-tongues">' + CONFIG.tongues.map(function (x) { return "<span>" + x + "</span>"; }).join("<i>✦</i>") + "</p>" +
        '<h1 class="bday-title"><span class="bday-hb">' + CONFIG.title + '</span><span class="bday-name">' + letters + "</span></h1>" +
        (CONFIG.age ? '<div class="bday-age" aria-label="' + CONFIG.age + ' years"><span>' + CONFIG.age + '</span><small>years of grace</small></div>' : "") +
        '<div class="bday-cake" aria-hidden="true"><span class="flame"></span><span class="candle"></span><span class="tier t1"></span><span class="tier t2"></span><span class="plate"></span></div>' +
        '<p class="bday-to">' + CONFIG.to + "</p>" +
        '<p class="bday-msg">' + CONFIG.message + "</p>" +
        '<p class="bday-sign">' + CONFIG.signOff + "</p>" +
        '<button class="bday-btn" type="button">' + CONFIG.button + ' <span aria-hidden="true">→</span></button>' +
        (preview ? '<p class="bday-preview">Preview — on 28 November this opens automatically, once per device.</p>' : "") +
      "</div>";

    document.body.appendChild(ov);
    document.documentElement.classList.remove("bday-pending");
    document.documentElement.classList.add("bday-open");
    requestAnimationFrame(function () { requestAnimationFrame(function () { ov.classList.add("is-in"); }); });

    if (!preview) { try { localStorage.setItem(seenKey, "1"); } catch (e) {} }

    var btn = ov.querySelector(".bday-btn");
    setTimeout(function () { btn.focus({ preventScroll: true }); }, 2600);

    var burst = function () {};
    var stopConfetti = confetti(ov.querySelector(".bday-confetti"));
    var flame = ov.querySelector(".bday-cake");
    flame.addEventListener("click", function () {
      flame.classList.add("blown");
      burst();
    });

    function close() {
      if (ov.classList.contains("is-out")) return;
      ov.classList.add("is-out");
      document.documentElement.classList.remove("bday-open");
      setTimeout(function () { stopConfetti(); ov.remove(); }, 1500);
    }
    btn.addEventListener("click", close);
    document.addEventListener("keydown", function esc(e) {
      if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); }
    });

    function confetti(canvas) {
      var ctx = canvas.getContext("2d");
      var W, H, dpr = Math.min(2, window.devicePixelRatio || 1);
      var pieces = [];
      var palette = ["#e6cfa3", "#c9a46a", "#a0703a", "#fbf6ef", "#f3eae0", "#d4a373"];
      var running = true;
      function size() {
        W = canvas.clientWidth; H = canvas.clientHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      size();
      window.addEventListener("resize", size);
      function add(n, fromX, fromY, spread) {
        for (var i = 0; i < n; i++) {
          var a = (-Math.PI / 2) + (Math.random() - 0.5) * spread;
          var v = 6 + Math.random() * 9;
          pieces.push({
            x: fromX, y: fromY, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
            w: 6 + Math.random() * 8, h: 3 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
            c: palette[(Math.random() * palette.length) | 0], life: 0, star: Math.random() < 0.18,
          });
        }
      }
      burst = function () { add(160, W / 2, H * 0.55, Math.PI * 1.2); firework(W / 2, H * 0.3); firework(W * 0.3, H * 0.25); firework(W * 0.7, H * 0.28); };
      // fireworks: golden rings of sparks that fade as they fall
      var sparks = [];
      function firework(x, y) {
        var n = 70, col = palette[(Math.random() * palette.length) | 0], sp = 3.2 + Math.random() * 2.4;
        for (var i = 0; i < n; i++) {
          var a = (i / n) * Math.PI * 2;
          sparks.push({ x: x, y: y, vx: Math.cos(a) * sp * (0.7 + Math.random() * 0.3), vy: Math.sin(a) * sp * (0.7 + Math.random() * 0.3), a: 1, c: Math.random() < 0.3 ? "#fff7e0" : col });
        }
      }
      var fwTimes = [1300, 2100, 2800, 3600, 4700, 6200];
      fwTimes.forEach(function (ms) { setTimeout(function () { if (running) firework(W * (0.18 + Math.random() * 0.64), H * (0.14 + Math.random() * 0.28)); }, ms); });
      var fwLoop = setInterval(function () { if (running) firework(W * (0.12 + Math.random() * 0.76), H * (0.1 + Math.random() * 0.3)); }, 3200);
      // opening bursts from the corners, then a gentle fall
      setTimeout(function () { add(170, 0, H, Math.PI * 0.5); add(170, W, H, Math.PI * 0.5); }, 650);
      setTimeout(function () { add(220, W / 2, H * 0.5, Math.PI * 2); }, 420);
      setTimeout(function () { add(120, W / 2, H * 0.6, Math.PI * 1.4); }, 1700);
      var rain = setInterval(function () {
        for (var i = 0; i < 3; i++) pieces.push({ x: Math.random() * W, y: -10, vx: (Math.random() - 0.5) * 1, vy: 1.5 + Math.random() * 1.5,
          w: 6 + Math.random() * 6, h: 3 + Math.random() * 4, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.2,
          c: palette[(Math.random() * palette.length) | 0], life: 0, star: Math.random() < 0.15 });
      }, 120);
      function star(x, y, r) {
        ctx.beginPath();
        for (var i = 0; i < 8; i++) {
          var rad = i % 2 ? r * 0.35 : r, ang = (i * Math.PI) / 4;
          ctx.lineTo(x + Math.cos(ang) * rad, y + Math.sin(ang) * rad);
        }
        ctx.closePath(); ctx.fill();
      }
      (function loop() {
        if (!running) return;
        ctx.clearRect(0, 0, W, H);
        for (var i = pieces.length - 1; i >= 0; i--) {
          var p = pieces[i];
          p.vy += 0.18; p.vx *= 0.985; p.vy *= 0.985;
          if (p.vy > 3.2) p.vy = 3.2;
          p.x += p.vx + Math.sin((p.life += 0.05)) * 0.6; p.y += p.vy; p.r += p.vr;
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
          if (p.star) star(0, 0, p.w * 0.7);
          else { ctx.scale(1, Math.cos(p.life * 3)); ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); }
          ctx.restore();
          if (p.y > H + 30) pieces.splice(i, 1);
        }
        ctx.globalCompositeOperation = "lighter";
        for (var k = sparks.length - 1; k >= 0; k--) {
          var s2 = sparks[k];
          s2.vx *= 0.975; s2.vy = s2.vy * 0.975 + 0.05; s2.x += s2.vx; s2.y += s2.vy; s2.a -= 0.012;
          if (s2.a <= 0) { sparks.splice(k, 1); continue; }
          ctx.globalAlpha = s2.a; ctx.fillStyle = s2.c;
          ctx.beginPath(); ctx.arc(s2.x, s2.y, 1.8, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = s2.a * 0.25; ctx.beginPath(); ctx.arc(s2.x, s2.y, 5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
        requestAnimationFrame(loop);
      })();
      return function () { running = false; clearInterval(rain); clearInterval(fwLoop); };
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
