/* ===================================================================
   SML Enterprises — interactions
=================================================================== */
(function () {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Year ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Header shrink ---------- */
  const header = $(".header");
  const onScroll = () => header.classList.toggle("shrink", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const burger = $("#hamburger"), nav = $("#nav");
  const closeNav = () => { nav.classList.remove("open"); burger.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); };
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
  });
  $$("#nav a").forEach(a => a.addEventListener("click", closeNav));
  // close the mobile menu when tapping its empty backdrop, tapping outside, or pressing Escape
  nav.addEventListener("click", e => { if (e.target === nav) closeNav(); });
  document.addEventListener("click", e => {
    if (nav.classList.contains("open") && !nav.contains(e.target) && !burger.contains(e.target)) closeNav();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && nav.classList.contains("open")) closeNav(); });

  /* ---------- Equipment list (verbatim from company profile) ---------- */
  const equipment = [
    ["Excavator — EX-200", "4"], ["Excavator — EX-70", "2"],
    ["SANY 210 (2022)", "2"], ["SANY 210 Breaker (2022)", "1"],
    ["SANY 140", "1"], ["XCMG-38 Excavator", "1"], ["XCMG-28 Excavator", "1"],
    ["JCB", "1"], ["Hydra 15 MT (Farana)", "2"], ["Bob Cat", "2"],
    ["Fork Lift", "2"], ["Tractor", "2"], ["Water Tanker 5000 L", "1"],
    ["Tippers", "6"], ["CASE Road Roller 3 T", "1"], ["CASE Road Roller 10 T", "1"],
    ["Blade Tractor", "1"], ["Dozer (D-50)", "1"], ["Earth Hammer", "1"],
    ["XCMG Truck Crane XCT 60 MT (2024)", "1"], ["XCMG XE80C (2024)", "2"]
  ];
  $("#equipGrid").innerHTML = equipment.map(
    ([n, q]) => `<div class="equip__row"><span>${n}</span><b>${q}</b></div>`
  ).join("");

  /* ---------- Work experience (verbatim, 17 assignments) ---------- */
  const works = [
    ["ITC", "Renovation work at Rajahmundry"],
    ["L&T · ONGC-VAS1", "Civil works, Odalarevu"],
    ["L&T · ONGC", "Helipad work, Odalarevu"],
    ["L&T · HPCL", "Civil works, Visakh Refinery, Visakhapatnam"],
    ["L&T · RINL", "Civil works, Steel Plant, Visakhapatnam"],
    ["Sree Singagi Power Plant", "Railway work at Kandava, Madhya Pradesh"],
    ["Nizamabad", "Underground pipeline work"],
    ["TPL · ONGC-VAS1", "Civil works, Odalarevu"],
    ["GVR Projects", "Railway works, Chennai"],
    ["ACE", "Pipeline work, Odalarevu, Andhra Pradesh"],
    ["Power Mech Projects", "21 T rock breaker — NH-365A four-laning, Kodada–Khammam, Telangana"],
    ["Power Mech Projects", "Excavators, rock dumpers & soil compactors — NH-365A four-laning, Kodada–Khammam"],
    ["L&T RUF · HPCL", "Dumpers-6, EX-200-3, Mini Excavators-2, Mini Loaders-2 & others — Visakha Refinery"],
    ["Divis Labs Unit-3", "Vibra Rollers 3 T & 10 T, XCMG XE-80 ×2"],
    ["Tata Projects · ONGC", "60 ft man-lift supply, Odalarevu"],
    ["John Energy · ONGC Rig-31", "60 MT hydraulic crane & 14 MT hydra on hire"],
    ["HG Infra Projects", "SANY-210 supply for road work"]
  ];
  $("#workList").innerHTML = works.map(
    ([c, d]) => `<div class="wl-item"><span class="wl-item__client">${c}</span><span class="wl-item__desc">${d}</span></div>`
  ).join("") +
    `<div class="wl-item wl-item--more"><span class="wl-item__client">&plus; many more</span><span class="wl-item__desc">projects delivered across India since 2006</span></div>`;

  /* ---------- Clients (verbatim names, 12) — pinned horizontal scroll ---------- */
  // [name, category, logo file | null, wordmark fallback]
  const clients = [
    ["L&T Hydrocarbon", "Oil & Gas EPC", "lt.png"],
    ["L&T ECC", "Construction", "lt.png"],
    ["ONGC", "Oil & Gas · PSU", "ongc.png"],
    ["Technip India Ltd.", "Energy EPC", "technip.png"],
    ["Petrofac India", "Oilfield Services", null, "Petrofac"],
    ["HPCL — Visakh Refinery", "Refinery", "hpcl.png"],
    ["ITC Rajahmundry", "Infrastructure", "itc.png"],
    ["Power Mech Projects Ltd.", "Power & Infra", null, "Power Mech"],
    ["Tata Projects Ltd.", "EPC", null, "Tata Projects"],
    ["Divis Labs", "Pharma", "divis.png"],
    ["John Energy Ltd.", "Drilling / Energy", null, "John Energy"],
    ["HG Infra Engg. Ltd.", "Highways & Infra", null, "HG Infra"]
  ];
  const track = $("#clientTrack");
  if (track) {
    const card = ([n, c, logo, mark], i) => `
      <article class="cli-card" role="listitem">
        <span class="cli-card__idx">${String(i + 1).padStart(2, "0")}</span>
        <div class="cli-card__plate">
          ${logo
            ? `<img src="assets/img/clients/${logo}" alt="${n} logo" loading="lazy">`
            : `<span class="cli-card__wordmark">${mark}</span>`}
        </div>
        <div class="cli-card__body">
          <h3 class="cli-card__name">${n}</h3>
          <span class="cli-card__cat">${c}</span>
        </div>
      </article>`;
    // duplicate the set so the scroll loops seamlessly (first half === second half)
    track.innerHTML = clients.map(card).join("") + clients.map(card).join("");

    // Auto-scroll that you can grab, drag or swipe. Pauses on hover / interaction.
    const rail = $("#cliRail");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SPEED = 0.6;                       // px per frame (~36px/s at 60fps)
    let hovering = false, dragging = false, touchUntil = 0, moved = false;

    const half = () => track.scrollWidth / 2;
    const wrap = () => {                      // keep scrollLeft inside the first copy → infinite loop
      const h = half();
      if (rail.scrollLeft >= h) rail.scrollLeft -= h;
      else if (rail.scrollLeft <= 0) rail.scrollLeft += h;
    };
    const tick = () => {
      const paused = hovering || dragging || Date.now() < touchUntil || document.hidden;
      if (!paused && !reduce) { rail.scrollLeft += SPEED; }
      wrap();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // hover pauses (desktop) so you can read / scroll manually
    rail.addEventListener("mouseenter", () => hovering = true);
    rail.addEventListener("mouseleave", () => hovering = false);

    // click-drag to slide (mouse / pen). Touch uses native momentum scrolling.
    let startX = 0, startScroll = 0;
    const down = e => {
      if (e.pointerType === "touch") { touchUntil = Date.now() + 4000; return; }
      dragging = true; moved = false; startX = e.pageX; startScroll = rail.scrollLeft;
      rail.classList.add("is-dragging"); rail.setPointerCapture?.(e.pointerId);
    };
    const move = e => {
      if (!dragging) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 3) moved = true;
      rail.scrollLeft = startScroll - dx; wrap();
    };
    const up = () => {
      if (!dragging) return;
      dragging = false; rail.classList.remove("is-dragging");
    };
    rail.addEventListener("pointerdown", down);
    rail.addEventListener("pointermove", move);
    rail.addEventListener("pointerup", up);
    rail.addEventListener("pointercancel", up);
    // keep auto-scroll paused briefly after a touch swipe, then resume
    rail.addEventListener("touchmove", () => touchUntil = Date.now() + 4000, { passive: true });
    // don't let a drag trigger a card's click
    rail.addEventListener("click", e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  }

  /* ---------- Logo marquee (immediate trust bar) — reuses client data ---------- */
  const mq = $("#marqueeTrack");
  if (mq) {
    const chip = ([n, c, logo, mark]) => logo
      ? `<span class="mq-chip"><img src="assets/img/clients/${logo}" alt="${n}" loading="lazy"></span>`
      : `<span class="mq-chip mq-chip--text">${mark || n}</span>`;
    const set = clients.map(chip).join("");
    mq.innerHTML = set + set;          // duplicated for seamless loop
  }

  /* ---------- Fleet filter ---------- */
  const filters = $$("#fleetFilters .filter");
  const cards = $$("#fleetGallery .gcard");
  filters.forEach(btn => btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const f = btn.dataset.filter;
    cards.forEach(card => card.classList.toggle("hide", f !== "all" && card.dataset.cat !== f));
  }));

  /* ---------- Count-up ---------- */
  const animateCount = el => {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    if (el.dataset.plain) return;                 // e.g. "2006" static
    // data-since => auto-calculated years of experience (evergreen, never stale)
    const target = el.dataset.since ? (new Date().getFullYear() - +el.dataset.since) : +el.dataset.count;
    const suffix = el.dataset.suffix || "";
    const dur = 1500, t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* ---------- IntersectionObservers ---------- */
  if ("IntersectionObserver" in window) {
    const revObs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); o.unobserve(e.target); } });
    }, { threshold: 0.14 });
    $$(".reveal").forEach(el => revObs.observe(el));

    const numObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) animateCount(e.target); });
    }, { threshold: 0.6 });
    $$("[data-count],[data-since]").forEach(el => numObs.observe(el));
  } else {
    $$(".reveal").forEach(el => el.classList.add("in"));
    $$("[data-count],[data-since]").forEach(animateCount);
  }

  /* ---------- Back to top ---------- */
  const toTop = $("#toTop");
  window.addEventListener("scroll", () => toTop.classList.toggle("show", window.scrollY > 600), { passive: true });
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Lightbox ---------- */
  const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
  const items = $$("#projGallery .pcard");
  let idx = 0;
  const show = i => {
    idx = (i + items.length) % items.length;
    const el = items[idx];
    lbImg.src = el.getAttribute("href");
    lbCap.textContent = el.dataset.cap || "";
  };
  const open = i => { show(i); lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); };
  const close = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); };
  items.forEach((el, i) => el.addEventListener("click", e => { e.preventDefault(); open(i); }));
  $(".lightbox__close").addEventListener("click", close);
  $(".lightbox__next").addEventListener("click", () => show(idx + 1));
  $(".lightbox__prev").addEventListener("click", () => show(idx - 1));
  lb.addEventListener("click", e => { if (e.target === lb) close(); });
  document.addEventListener("keydown", e => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(idx + 1);
    if (e.key === "ArrowLeft") show(idx - 1);
  });

  /* Contact actions are plain links (WhatsApp / tel / mailto) — no JS needed. */
})();
