/* =========================================================
   Sweeft Events — shared behaviour + animations
   ========================================================= */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const page = document.body.dataset.page || "home";

  /* ---------- Smooth scrolling (Lenis) ---------- */
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), anchors: { offset: -90 }, autoRaf: false });
    const lenisLoop = (t) => { lenis.raf(t); requestAnimationFrame(lenisLoop); };
    requestAnimationFrame(lenisLoop);
    // pause page scrolling while the birthday greeting is on screen
    const syncBday = () => (document.documentElement.classList.contains("bday-open") || document.documentElement.classList.contains("bday-pending") ? lenis.stop() : lenis.start());
    new MutationObserver(syncBday).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    syncBday();
  }
  function lockScroll(on) {
    document.body.style.overflow = on ? "hidden" : "";
    if (lenis) on ? lenis.stop() : lenis.start();
  }

  /* ---------- Shared nav + footer ---------- */
  const links = [
    ["home", "Home", "/"],
    ["services", "Services", "/services"],
    ["experience", "Experience", "/experience"],
    ["gallery", "Gallery", "/gallery"],
  ];

  const navRoot = $("#nav-root");
  if (navRoot) {
    navRoot.outerHTML = `
    <header class="nav-shell" data-nav>
      <div class="wrap">
        <nav class="nav" aria-label="Main">
          <a href="index.html" class="nav-logo" aria-label="Sweeft Events — home"><img class="logo" src="assets/logo.png" alt="Sweeft Events" /></a>
          <div class="nav-links">
            ${links.map(([k, t, h]) => `<a href="${h}" class="${k === page ? "is-active" : ""}">${t}</a>`).join("")}
          </div>
          <div class="nav-right">
            <a href="contact.html" class="btn btn-sand${page === "contact" ? " is-current" : ""}">Plan my event</a>
            <button class="nav-burger" aria-label="Open menu" aria-expanded="false" data-burger><span></span></button>
          </div>
        </nav>
      </div>
    </header>
    <div class="mobile-menu" aria-hidden="true">
      ${links.map(([, t, h]) => `<a href="${h}">${t}</a>`).join("")}
      <a href="contact.html" class="btn btn-sand mm-cta">Plan my event</a>
    </div>`;
  }

  const footRoot = $("#footer-root");
  if (footRoot) {
    footRoot.outerHTML = `
    <footer class="site-footer">
      <div class="footer-card">
        <div class="footer-cta">
          <div>
            <p class="script reveal">Every detail, made sweet.</p>
            <p class="display split" data-split>Ready to celebrate?</p>
          </div>
          <a href="contact.html" class="btn btn-sand reveal" style="--d:.2s">Plan my event</a>
        </div>
        <div class="footer-bottom">
          <a href="index.html" aria-label="Sweeft Events — home"><img class="logo" src="assets/logo.png" alt="Sweeft Events" /></a>
          <div class="socials">
            <a href="https://www.instagram.com/sweeftevents_/" target="_blank" rel="noopener" aria-label="Instagram"><img src="assets/f-ig.svg" alt="" width="20" height="20" /></a>
            <a href="https://www.tiktok.com/@sweeftevents_" target="_blank" rel="noopener" aria-label="TikTok"><img src="assets/f-tt.svg" alt="" width="20" height="20" /></a>
            <a href="https://wa.me/2349050725099" target="_blank" rel="noopener" aria-label="WhatsApp"><img src="assets/f-wa.svg" alt="" width="20" height="20" /></a>
          </div>
          <small>© ${new Date().getFullYear()} Sweeft Events · Lekki Phase 1, Lagos</small>
        </div>
      </div>
    </footer>`;
  }

  /* ---------- Floating WhatsApp chat button ---------- */
  const WA_NUM = (window.SWEEFT && window.SWEEFT.whatsapp) || "2349050725099";
  const WA_ICON = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.33 16.67l1.08-3.34a6.67 6.67 0 1 1 2.25 2.5l-3.33.84z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7.6 6.6c.2-.4.5-.4.7-.4h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.1.3 0 .5.5.9 1.2 1.6 2.1 2.1.2.1.4.1.5 0l.6-.6c.2-.2.4-.2.6-.1l1.5.7c.2.1.3.3.3.5 0 .6-.3 1.4-1.1 1.7-.8.3-1.9.2-3.6-.8-1.6-1-2.7-2.5-3-3.5-.3-1-.1-2 .3-2.7z" fill="currentColor"/></svg>';
  const waGreeting = (window.SWEEFT && window.SWEEFT.whatsappGreeting) || "Hi Sweeft Events! I’d like to plan an event.";
  document.body.insertAdjacentHTML("beforeend",
    `<a class="wa-float" href="https://wa.me/${WA_NUM}?text=${encodeURIComponent(waGreeting)}" target="_blank" rel="noopener" aria-label="Chat with Sweeft Events on WhatsApp">${WA_ICON}<span class="wa-label">Chat with us</span></a>`);

  /* ---------- Toast ---------- */
  const toastEl = document.createElement("div");
  toastEl.className = "toast";
  toastEl.setAttribute("role", "status");
  document.body.appendChild(toastEl);
  let toastT;
  window.sweeftToast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("show"), 3600);
  };

  /* ---------- Nav: hide on scroll down, show on scroll up ---------- */
  const navShell = $("[data-nav]");
  // Nav stays put while scrolling; it only gains a soft shadow once you've scrolled.
  // (Hysteresis: on after 60px, off below 20px, so it never flickers.)
  let navScrolled = false;
  function onNavScroll() {
    if (!navShell) return;
    const y = lenis ? lenis.scroll : window.scrollY;
    if (!navScrolled && y > 60) { navScrolled = true; navShell.classList.add("is-scrolled"); }
    else if (navScrolled && y < 20) { navScrolled = false; navShell.classList.remove("is-scrolled"); }
  }

  const burger = $("[data-burger]");
  if (burger) {
    burger.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", open);
      $(".mobile-menu").setAttribute("aria-hidden", !open);
      lockScroll(open);
    });
  }

  /* ---------- Split headings into words + reveal on scroll ----------
     Waits for the web fonts so words are measured once and never jump. */
  function startAnimations() {
    $$("[data-split]").forEach((el) => {
      let i = 0;
      const walk = (node) => {
        Array.from(node.childNodes).forEach((n) => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
              const w = document.createElement("span");
              w.className = "w";
              const inner = document.createElement("span");
              inner.style.setProperty("--i", i++);
              inner.textContent = part;
              w.appendChild(inner);
              frag.appendChild(w);
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1) {
            // wrap whole inline element (e.g. <em>) as one word
            const w = document.createElement("span");
            w.className = "w";
            n.style.setProperty("--i", i++);
            n.style.display = "inline-block";
            n.replaceWith(w);
            w.appendChild(n);
            n.classList.add("w-inner");
          }
        });
      };
      walk(el);
      el.classList.add("split");
    });

    /* ---------- Reveal on scroll ---------- */
    const revealEls = $$(".reveal, .reveal-l, .reveal-r, .reveal-scale, .rv, [data-split]");
    if ("IntersectionObserver" in window && !reduced) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
      revealEls.forEach((el) => io.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("in"));
    }
    document.documentElement.classList.add("anim-ready");
  }
  const fontsReady = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]) : Promise.resolve();
  fontsReady.then(() => requestAnimationFrame(startAnimations));

  /* ---------- Word-by-word reveal tied to scroll ---------- */
  const wordReveal = $$("[data-word-reveal]").map((el) => {
    const words = [];
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            const s = document.createElement("span");
            s.className = "wr"; s.textContent = p; words.push(s); frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    return { el, words };
  });

  /* ---------- Hero fan + reel ---------- */
  const fan = $("[data-fan]");
  if (fan) {
    requestAnimationFrame(() => setTimeout(() => fan.classList.add("is-in"), 120));
  }
  /* ---------- Video player (plays reels on the site, not on Instagram) ---------- */
  const CFG = window.SWEEFT || {};
  const VIDEOS = CFG.videos || {};
  const vp = document.createElement("div");
  vp.className = "vplayer";
  vp.setAttribute("role", "dialog");
  vp.setAttribute("aria-modal", "true");
  vp.setAttribute("aria-label", "Video player");
  vp.innerHTML = '<button class="lb-btn lb-close" aria-label="Close video">✕</button><div class="vp-stage"></div><p class="vp-title"></p>';
  document.body.appendChild(vp);
  const stage = $(".vp-stage", vp);
  const igEmbed = (url) => {
    const m = String(url).match(/instagram\.com\/(?:[\w.]+\/)?(reel|reels|p|tv)\/([\w-]+)/i);
    return m ? `https://www.instagram.com/${m[1] === "reels" ? "reel" : m[1]}/${m[2]}/embed/` : "";
  };
  const closeVideo = () => {
    vp.classList.remove("open");
    lockScroll(false);
    setTimeout(() => { if (!vp.classList.contains("open")) stage.innerHTML = ""; }, 400);
  };
  window.sweeftPlayVideo = (key, poster) => {
    const v = VIDEOS[key] || {};
    $(".vp-title", vp).textContent = v.title || "";
    stage.className = "vp-stage";
    stage.innerHTML = "";
    vp.classList.add("open");
    lockScroll(true);
    const showInstagram = () => {
      const src = igEmbed(v.instagram);
      if (src) {
        stage.classList.add("is-ig");
        stage.innerHTML = `<iframe src="${src}" title="${v.title || "Sweeft Events reel"}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
      } else {
        stage.classList.add("is-empty");
        stage.innerHTML = `${poster ? `<img src="${poster}" alt="" />` : ""}<div class="vp-soon"><p class="script">Coming soon</p><p>This video is being added — check back shortly.</p></div>`;
      }
    };
    if (v.file) {
      const vid = document.createElement("video");
      vid.controls = true; vid.autoplay = true; vid.playsInline = true; vid.preload = "auto";
      if (poster) vid.poster = poster;
      vid.addEventListener("error", showInstagram, { once: true });
      vid.addEventListener("loadedmetadata", () => stage.classList.toggle("is-land", vid.videoWidth > vid.videoHeight), { once: true });
      vid.src = v.file;
      stage.appendChild(vid);
      vid.play().catch(() => { });
    } else showInstagram();
  };
  $(".lb-close", vp).addEventListener("click", closeVideo);
  vp.addEventListener("click", (e) => { if (e.target === vp) closeVideo(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && vp.classList.contains("open")) closeVideo(); });
  $$("[data-video]").forEach((el) => {
    if (el.matches("[data-reel]")) return; // hero reel handled below
    el.style.cursor = "pointer";
    if (!el.matches("a, button")) { el.setAttribute("role", "button"); el.tabIndex = 0; }
    const go = (e) => { e.preventDefault(); const img = $("img", el); window.sweeftPlayVideo(el.dataset.video, img && (img.currentSrc || img.src)); };
    el.addEventListener("click", go);
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") go(e); });
  });

  const reel = $("[data-reel]");
  if (reel) {
    const video = $("video", reel);
    const rv = VIDEOS[reel.dataset.video || "mk-decor"];
    if (rv && rv.file) video.dataset.src = rv.file;
    const play = $(".reel-play", reel);
    let srcTried = false, hasVideo = false;
    const tryLoad = () => new Promise((res) => {
      if (srcTried) return res(hasVideo);
      srcTried = true;
      video.src = video.dataset.src;
      video.addEventListener("canplay", () => { hasVideo = true; res(true); }, { once: true });
      video.addEventListener("error", () => res(false), { once: true });
      video.load();
      setTimeout(() => res(hasVideo), 2500);
    });
    // Autoplay muted loop when the reel scrolls into view (if the video file is present)
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(async ([e]) => {
        if (e.isIntersecting) {
          if (await tryLoad()) { video.play().catch(() => { }); reel.classList.add("is-playing"); }
        } else if (hasVideo && !fan.classList.contains("is-cinema")) { video.pause(); }
      }, { threshold: 0.4 }).observe(reel);
    }
    // Play: the card widens into a landscape player right where it sits (no pop-up)
    const closeBtn = document.createElement("button");
    closeBtn.className = "reel-close"; closeBtn.type = "button"; closeBtn.setAttribute("aria-label", "Close video"); closeBtn.textContent = "✕";
    reel.appendChild(closeBtn);
    const openCinema = async () => {
      if (!(await tryLoad())) { window.sweeftPlayVideo(reel.dataset.video || "mk-decor", $("img", reel).src); return; }
      fan.classList.add("is-cinema"); reel.classList.add("is-playing");
      video.muted = false; video.loop = false; video.controls = true; video.currentTime = 0;
      video.play().catch(() => { video.muted = true; video.play().catch(() => { }); });
    };
    const closeCinema = () => {
      fan.classList.remove("is-cinema");
      video.controls = false; video.muted = true; video.loop = true;
      video.play().catch(() => { });
    };
    play.addEventListener("click", openCinema);
    closeBtn.addEventListener("click", (e) => { e.stopPropagation(); closeCinema(); });
    video.addEventListener("ended", () => { if (fan.classList.contains("is-cinema")) closeCinema(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && fan.classList.contains("is-cinema")) closeCinema(); });
  }

  /* ---------- Gallery filters (sliding pill + animated filter) ---------- */
  $$("[data-filters]").forEach((wrap) => {
    const pill = $(".filter-pill", wrap);
    const btns = $$("button", wrap);
    const grid = $("[data-masonry]");
    const tiles = grid ? $$(".tile", grid) : [];
    const move = (b) => {
      if (!pill) return;
      pill.style.width = b.offsetWidth + "px";
      pill.style.height = b.offsetHeight + "px";
      pill.style.transform = `translate(${b.offsetLeft}px, ${b.offsetTop}px)`;
    };
    btns.forEach((b) => b.addEventListener("click", () => {
      btns.forEach((x) => x.classList.toggle("is-active", x === b));
      move(b);
      const f = b.dataset.filter;
      tiles.forEach((t) => t.classList.add("is-out"));
      setTimeout(() => {
        tiles.forEach((t) => {
          const show = f === "all" || t.dataset.cat === f;
          t.classList.toggle("is-hidden", !show);
        });
        requestAnimationFrame(() => requestAnimationFrame(() => {
          tiles.forEach((t, i) => {
            if (!t.classList.contains("is-hidden")) {
              t.style.transitionDelay = (i % 6) * 50 + "ms";
              t.classList.remove("is-out");
            }
          });
          setTimeout(() => tiles.forEach((t) => (t.style.transitionDelay = "")), 800);
        }));
      }, 380);
    }));
    const init = () => move($("button.is-active", wrap) || btns[0]);
    requestAnimationFrame(init);
    window.addEventListener("resize", init);
    document.fonts && document.fonts.ready.then(init);
  });

  /* ---------- Sticky quick links with scroll-spy (Services page) ---------- */
  const quick = $("[data-quick]");
  const quickLinks = quick ? $$("a[href^='#']", quick) : [];
  const quickTargets = quickLinks.map((a) => $(a.getAttribute("href")));
  function onQuick() {
    if (!quick) return;
    const top = quick.getBoundingClientRect().top;
    quick.classList.toggle("is-stuck", top <= 0.5);
    let current = -1;
    quickTargets.forEach((t, i) => { if (t && t.getBoundingClientRect().top < window.innerHeight * 0.45) current = i; });
    quickLinks.forEach((a, i) => a.classList.toggle("is-active", i === current));
  }

  /* ---------- Scroll-linked animations (one rAF loop) ---------- */
  const fanCards = fan ? $$(".fan-card", fan).map((c) => ({ el: c, x: parseFloat(c.style.getPropertyValue("--x")) || 0 })) : [];
  const collage = $("[data-collage]");
  const collageItems = collage ? $$("[data-depth]", collage).map((el) => ({ el, d: parseFloat(el.dataset.depth) })) : [];
  const parallaxEls = $$("[data-parallax]").map((el) => ({ el, s: parseFloat(el.dataset.parallax) || 0.1 }));

  let drift = 0, last = performance.now();
  const progress = (el) => {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    return (vh - r.top) / (vh + r.height); // 0 when entering, 1 when leaving
  };

  function frame(now) {
    const dt = Math.min(64, now - last); last = now;
    onNavScroll();
    onQuick();

    if (!reduced) {
      // Hero fan: cards spread out a little as you scroll
      if (fan) {
        const p = Math.max(0, Math.min(1, window.scrollY / (window.innerHeight * 0.9)));
        fanCards.forEach(({ el, x }) => { el.style.translate = `${x * p * 2.2}px ${p * 30}px`; });
      }
      // Word reveal
      wordReveal.forEach(({ el, words }) => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
        const n = Math.round(p * words.length);
        words.forEach((w, i) => w.classList.toggle("on", i < n));
      });
      // Collage depth
      if (collage) {
        const p = Math.max(0, Math.min(1, progress(collage))) - 0.5;
        collageItems.forEach(({ el, d }) => { el.style.transform = `translate3d(0, ${p * d * 600}px, 0)`; });
      }
      parallaxEls.forEach(({ el, s }) => {
        const p = Math.max(0, Math.min(1, progress(el))) - 0.5;
        el.style.transform = `translate3d(0, ${p * s * -600}px, 0)`;
      });
    } else {
      wordReveal.forEach(({ words }) => words.forEach((w) => w.classList.add("on")));
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- Enquiry forms → opens an email / WhatsApp with the details ---------- */
  $$("[data-enquiry]").forEach((form) => {
    // preselect event type from ?type=
    const q = new URLSearchParams(location.search).get("type");
    const typeSel = $("select[name=type]", form);
    if (q && typeSel) {
      const map = { weddings: "Wedding", social: "Social event", corporate: "Corporate event", decor: "Decor & styling", styling: "Decor & styling" };
      const want = map[q] || q;
      Array.from(typeSel.options).forEach((o) => { if (o.text === want) typeSel.value = o.value || o.text; });
    }
    $$(".chips button", form).forEach((c) => c.addEventListener("click", () => {
      $$(".chips button", form).forEach((x) => x.classList.toggle("is-active", x === c));
      const hid = $("input[name=heard]", form); if (hid) hid.value = c.textContent.trim();
    }));
    const btn = $("button[type=submit]", form);
    const btnLabel = btn.textContent;
    // "Send on WhatsApp instead" link under the main button
    const waAlt = document.createElement("button");
    waAlt.type = "button";
    waAlt.className = "wa-alt";
    waAlt.innerHTML = `${WA_ICON}<span>Or send it on WhatsApp</span>`;
    btn.insertAdjacentElement("afterend", waAlt);
    // honeypot field to stop spam bots
    form.insertAdjacentHTML("beforeend", '<input type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;opacity:0" />');

    const labels = { name: "Name", contact: "Phone or email", phone: "Phone / WhatsApp", email: "Email", type: "Event type", date: "Event date", guests: "Guest count", budget: "Budget", venue: "Venue", dream: "The dream", heard: "Heard about us via" };
    const validate = () => {
      let ok = true;
      $$("[required]", form).forEach((f) => {
        const bad = !f.value.trim();
        f.classList.toggle("invalid", bad);
        if (bad) ok = false;
        f.addEventListener("input", () => f.classList.remove("invalid"), { once: true });
      });
      const em = $("input[type=email]", form);
      if (em && em.value.trim() && !/^\S+@\S+\.\S+$/.test(em.value.trim())) { em.classList.add("invalid"); ok = false; }
      if (!ok) window.sweeftToast("Please add your name and how we can reach you.");
      return ok;
    };
    const collect = () => {
      const out = {};
      new FormData(form).forEach((v, k) => { if (k[0] !== "_" && String(v).trim()) out[labels[k] || k] = String(v).trim(); });
      return out;
    };
    const done = () => {
      form.classList.add("is-sent");
      btn.textContent = "Ẹ ṣé! We’ll be in touch ✦";
      window.sweeftToast("Thank you — your enquiry has been sent. We’ll reply within 24 hours.");
      form.reset();
      $$(".chips button", form).forEach((x, i) => x.classList.toggle("is-active", i === 0));
      setTimeout(() => { btn.textContent = btnLabel; btn.disabled = false; form.classList.remove("is-sent"); }, 6000);
    };

    waAlt.addEventListener("click", () => {
      if (!validate()) return;
      const d = collect();
      const text = "Hello Sweeft Events! Here’s my event enquiry:\n\n" + Object.entries(d).map(([k, v]) => `*${k}:* ${v}`).join("\n");
      window.open(`https://wa.me/${WA_NUM}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (btn.disabled || !validate()) return;
      if ($("input[name=_honey]", form).value) return; // bot
      const d = collect();
      btn.disabled = true;
      btn.textContent = "Sending…";
      try {
        const res = await fetch(CFG.formEndpoint || `https://formsubmit.co/ajax/${CFG.email || "sweeftevents@gmail.com"}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            _subject: `New event enquiry — ${d["Event type"] || "Sweeft Events"} — ${d.Name || ""}`,
            _template: "table",
            _captcha: "false",
            _replyto: d.Email || (/@/.test(d["Phone or email"] || "") ? d["Phone or email"] : undefined),
            ...d,
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || String(json.success) === "false") throw new Error(json.message || res.status);
        done();
      } catch (err) {
        // Network problem — fall back to the visitor's email app so the enquiry isn't lost
        btn.disabled = false;
        btn.textContent = btnLabel;
        const body = encodeURIComponent("Hello Sweeft Events,\n\n" + Object.entries(d).map(([k, v]) => `${k}: ${v}`).join("\n") + "\n");
        const subject = encodeURIComponent(`Event enquiry — ${d["Event type"] || "Sweeft Events"}`);
        window.sweeftToast("Couldn’t send just now — opening your email app instead.");
        setTimeout(() => { window.location.href = `mailto:${CFG.email || "sweeftevents@gmail.com"}?subject=${subject}&body=${body}`; }, 1200);
      }
    });
  });

  /* ---------- FAQ accordion ---------- */
  $$("[data-faq] .faq-item").forEach((item) => {
    const q = $(".faq-q", item);
    const a = $(".faq-a", item);
    q.addEventListener("click", () => {
      const open = item.classList.toggle("is-open");
      q.setAttribute("aria-expanded", open);
      a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
    });
    if (item.classList.contains("is-open")) {
      const fit = () => { if (item.classList.contains("is-open")) a.style.maxHeight = a.scrollHeight + "px"; };
      fit(); window.addEventListener("load", fit); window.addEventListener("resize", fit);
    }
  });

  /* ---------- Lightbox for gallery tiles ---------- */
  const lbItems = $$(".tile, [data-lightbox-item]").filter((t) => !t.hasAttribute("data-video"));
  if (lbItems.length) {
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML = '<button class="lb-btn lb-close" aria-label="Close">✕</button><button class="lb-btn lb-prev" aria-label="Previous">←</button><button class="lb-btn lb-next" aria-label="Next">→</button><figure><img alt="" /><figcaption><b></b><small></small></figcaption></figure>';
    document.body.appendChild(lb);
    let idx = 0;
    const visible = () => lbItems.filter((t) => !t.classList.contains("is-hidden"));
    const show = (i) => {
      const list = visible();
      idx = (i + list.length) % list.length;
      const t = list[idx];
      const img = $("img", t);
      $("figure img", lb).src = img.currentSrc || img.src;
      $("figure img", lb).alt = img.alt;
      $("figcaption b", lb).textContent = ($("figcaption b, strong", t) || {}).textContent || img.alt;
      $("figcaption small", lb).textContent = ($("figcaption small", t) || {}).textContent || "";
    };
    const open = (t) => { show(visible().indexOf(t)); lb.classList.add("open"); lockScroll(true); };
    const close = () => { lb.classList.remove("open"); lockScroll(false); };
    lbItems.forEach((t) => t.addEventListener("click", () => open(t)));
    $(".lb-close", lb).addEventListener("click", close);
    $(".lb-prev", lb).addEventListener("click", (e) => { e.stopPropagation(); show(idx - 1); });
    $(".lb-next", lb).addEventListener("click", (e) => { e.stopPropagation(); show(idx + 1); });
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------- Images: fade in when loaded ---------- */
  $$(".ph img").forEach((img) => {
    if (img.complete && img.naturalWidth) return;
    img.classList.add("is-loading");
    img.addEventListener("load", () => img.classList.remove("is-loading"), { once: true });
    img.addEventListener("error", () => { img.classList.remove("is-loading"); img.style.visibility = "hidden"; }, { once: true });
  });
})();
