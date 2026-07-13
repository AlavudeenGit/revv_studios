gsap.registerPlugin(ScrollTrigger);

/* Lenis smooth scroll */
const prefersReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
let lenis;
if (!prefersReduced && window.Lenis) {
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

/* progress bar */
const progressBar = document.getElementById("progressBar");
ScrollTrigger.create({
  start: 0,
  end: "max",
  onUpdate: (self) => {
    progressBar.style.width = self.progress * 100 + "%";
  },
});

/* header scroll state */
const header = document.getElementById("siteHeader");
ScrollTrigger.create({
  start: 100,
  end: 99999,
  onUpdate: (self) => header.classList.toggle("scrolled", self.scroll() > 80),
});

/* cursor follower */
const cursor = document.getElementById("cursor");
if (!("ontouchstart" in window)) {
  window.addEventListener("mousemove", (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.15,
      ease: "power2.out",
    });
  });
  document
    .querySelectorAll("a, button, .service-card, .video-card, .project-card")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("grow"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("grow"));
    });
}

/* magnetic buttons */
document.querySelectorAll(".magnetic").forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    gsap.to(btn, {
      x: x * 0.3,
      y: y * 0.4,
      duration: 0.4,
      ease: "power2.out",
    });
  });
  btn.addEventListener("mouseleave", () =>
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1,0.4)",
    }),
  );
  btn.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    ripple.className = "btn-ripple";
    const r = this.getBoundingClientRect();
    ripple.style.left = e.clientX - r.left + "px";
    ripple.style.top = e.clientY - r.top + "px";
    ripple.style.width = ripple.style.height = "140px";
    ripple.style.marginLeft = "-70px";
    ripple.style.marginTop = "-70px";
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

/* 3D tilt on cards — desktop pointer only, GPU accelerated */
if (!("ontouchstart" in window) && !prefersReduced) {
  document
    .querySelectorAll(".service-card, .project-card, .price-card")
    .forEach((card) => {
      card.style.transformStyle = "preserve-3d";
      card.style.willChange = "transform";
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, {
          rotateX: py * -6,
          rotateY: px * 8,
          duration: 0.5,
          ease: "power2.out",
          transformPerspective: 800,
        });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: "power3.out",
        });
      });
    });
}

/* Product Showcase — rotate app screens across laptop, phone & tabs */
(function initProductShowcase() {
  const laptopTrack = document.getElementById("psLaptopTrack");
  const phoneTrack = document.getElementById("psPhoneTrack");
  const tabsWrap = document.getElementById("psTabs");
  if (!laptopTrack || !tabsWrap) return;

  const laptopScreens = Array.from(laptopTrack.children);
  const phoneScreens = phoneTrack ? Array.from(phoneTrack.children) : [];
  const tabs = Array.from(tabsWrap.children);
  let active = 0;
  let timer;

  function setActive(i) {
    active = i;
    laptopScreens.forEach((s, idx) => s.classList.toggle("active", idx === i));
    phoneScreens.forEach((s, idx) => s.classList.toggle("active", idx === i));
    tabs.forEach((t, idx) => t.classList.toggle("active", idx === i));
  }

  function next() {
    setActive((active + 1) % laptopScreens.length);
  }

  function startAuto() {
    clearInterval(timer);
    if (!prefersReduced) timer = setInterval(next, 3200);
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => {
      setActive(i);
      startAuto();
    });
  });

  startAuto();
})();

/* mobile menu */
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
burger.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
  burger.classList.toggle("active");
});
mobileMenu
  .querySelectorAll("a")
  .forEach((a) =>
    a.addEventListener("click", () => mobileMenu.classList.remove("open")),
  );

/* hero text reveal */
gsap.to(".hero h1 .line span", {
  y: "0%",
  duration: 1.1,
  stagger: 0.12,
  ease: "power4.out",
  delay: 0.3,
});
gsap.from(".hero .eyebrow, .hero-sub, .hero-buttons, .hero-stats", {
  opacity: 0,
  y: 24,
  duration: 1,
  stagger: 0.12,
  delay: 0.9,
  ease: "power3.out",
});

/* animated counters */
function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const isDecimal = target % 1 !== 0;
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration: 2,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent =
        (isDecimal ? obj.val.toFixed(1) : Math.round(obj.val)) + suffix;
    },
    scrollTrigger: { trigger: el, start: "top 85%", once: true },
  });
}
document.querySelectorAll("[data-count]").forEach(animateCounter);

/* generic reveal on scroll */
gsap.utils.toArray(".reveal").forEach((el) => {
  gsap.fromTo(
    el,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    },
  );
});

/* about pulse rings */
gsap.to(".pulse-ring", {
  scale: 1.15,
  opacity: 0.4,
  duration: 2.4,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true,
  stagger: 0.3,
});
gsap.to(".core", {
  scale: 1.15,
  duration: 1.6,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true,
});

/* section head reveal */
gsap.utils.toArray(".section-head").forEach((el) => {
  gsap.fromTo(
    el.children,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    },
  );
});

/* services tabs */
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    document
      .querySelectorAll(".service-panel")
      .forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document
      .querySelector('.service-panel[data-panel="' + btn.dataset.tab + '"]')
      .classList.add("active");
    ScrollTrigger.refresh();
  });
});

/* FAQ accordion */
document.querySelectorAll(".faq-item").forEach((item) => {
  const a = item.querySelector(".faq-a");
  if (item.classList.contains("open")) {
    a.style.maxHeight = a.scrollHeight + "px";
  }
  item.querySelector(".faq-q").addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach((i) => {
      i.classList.remove("open");
      i.querySelector(".faq-a").style.maxHeight = 0;
    });
    if (!isOpen) {
      item.classList.add("open");
      a.style.maxHeight = a.scrollHeight + "px";
    }
  });
});

function initProjectCards() {
  document.querySelectorAll('.project-card').forEach((card) => {
    const link = card.querySelector('.project-link');
    const media = card.querySelector('.project-media');
    const topic = card.dataset.projectTopic || 'Project';
    const projectUrl = card.dataset.projectLink;
    if (!link) return;

    if (projectUrl) {
      link.href = projectUrl;
      link.removeAttribute('disabled');
      if (media) {
        media.style.cursor = 'pointer';
        media.addEventListener('click', () => {
          window.open(projectUrl, '_blank', 'noopener');
        });
      }
    } else {
      link.setAttribute('aria-disabled', 'true');
      link.style.pointerEvents = 'none';
      link.style.opacity = '0.6';
      if (media) {
        media.style.cursor = 'default';
      }
    }

    if (topic.toLowerCase().includes('app')) {
      link.textContent = 'Open Web App';
    } else if (topic.toLowerCase().includes('website')) {
      link.textContent = 'Visit Website';
    } else {
      link.textContent = 'View Project';
    }
  });
}

/* Featured Projects — normal carousel (arrows, dots, drag) */
(function initProjectsCarousel() {
  const track = document.getElementById("projectsTrack");
  if (!track) return;
  const prevBtn = document.getElementById("pjPrev");
  const nextBtn = document.getElementById("pjNext");
  const dotsWrap = document.getElementById("pjDots");
  const cards = Array.from(track.children);

  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "vc-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Go to project " + (i + 1));
    dot.addEventListener("click", () => scrollToCard(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function cardStep() {
    const style = getComputedStyle(track);
    return cards[0].getBoundingClientRect().width + parseFloat(style.gap || 28);
  }
  function scrollToCard(i) {
    track.scrollTo({ left: i * cardStep(), behavior: "smooth" });
  }
  function updateActiveDot() {
    const idx = Math.round(track.scrollLeft / cardStep());
    dots.forEach((d, i) => d.classList.toggle("active", i === idx));
  }
  let scrollDebounce;
  track.addEventListener("scroll", () => {
    clearTimeout(scrollDebounce);
    scrollDebounce = setTimeout(updateActiveDot, 90);
  });

  prevBtn.addEventListener("click", () =>
    track.scrollBy({ left: -cardStep(), behavior: "smooth" }),
  );
  nextBtn.addEventListener("click", () =>
    track.scrollBy({ left: cardStep(), behavior: "smooth" }),
  );

  // Drag to scroll (desktop)
  let isDown = false,
    startX = 0,
    startScroll = 0,
    moved = false;
  track.addEventListener("mousedown", (e) => {
    isDown = true;
    moved = false;
    startX = e.pageX;
    startScroll = track.scrollLeft;
  });
  window.addEventListener("mouseup", () => (isDown = false));
  window.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    if (Math.abs(e.pageX - startX) > 4) moved = true;
    track.scrollLeft = startScroll - (e.pageX - startX);
  });
  // prevent accidental card-content clicks right after a drag
  track.addEventListener(
    "click",
    (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );
})();

initProjectCards();

/* card stacking parallax on process numbers */
gsap.utils.toArray(".process-item").forEach((item, i) => {
  gsap.fromTo(
    item,
    { opacity: 0, x: -30 },
    {
      opacity: 1,
      x: 0,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { trigger: item, start: "top 90%" },
    },
  );
});

/* subtle mouse parallax on the nebula glows (desktop only) */
if (!("ontouchstart" in window) && !prefersReduced) {
  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 26;
    const y = (e.clientY / window.innerHeight - 0.5) * 26;
    gsap.to("#nebulaLayer", { x, y, duration: 1.2, ease: "power2.out" });
  });
}

/* refresh after fonts load */
window.addEventListener("load", () => ScrollTrigger.refresh());

(function initVideoCarousel() {
  const track = document.getElementById("videoCarouselTrack");
  if (!track) return;
  const prevBtn = document.getElementById("vcPrev");
  const nextBtn = document.getElementById("vcNext");
  const dotsWrap = document.getElementById("vcDots");

  const cards = Array.from(track.children);

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "vc-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Go to video " + (i + 1));
    dot.addEventListener("click", () => scrollToCard(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function cardStep() {
    const style = getComputedStyle(track);
    return cards[0].getBoundingClientRect().width + parseFloat(style.gap || 20);
  }

  function scrollToCard(i) {
    track.scrollTo({ left: i * cardStep(), behavior: "smooth" });
  }

  function updateActiveDot() {
    const idx = Math.round(track.scrollLeft / cardStep());
    dots.forEach((d, i) => d.classList.toggle("active", i === idx));
  }

  let scrollDebounce;
  track.addEventListener("scroll", () => {
    clearTimeout(scrollDebounce);
    scrollDebounce = setTimeout(updateActiveDot, 90);
  });

  prevBtn.addEventListener("click", () => {
    track.scrollBy({ left: -cardStep(), behavior: "smooth" });
  });
  nextBtn.addEventListener("click", () => {
    track.scrollBy({ left: cardStep(), behavior: "smooth" });
  });

  // Drag
  let isDown = false,
    startX = 0,
    startScroll = 0;
  track.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX;
    startScroll = track.scrollLeft;
  });
  window.addEventListener("mouseup", () => (isDown = false));
  window.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    track.scrollLeft = startScroll - (e.pageX - startX);
  });

  // Autoplay
  function advance() {
    const max = track.scrollWidth - track.clientWidth - 4;
    if (track.scrollLeft >= max) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      track.scrollBy({ left: cardStep(), behavior: "smooth" });
    }
  }
  let autoTimer = setInterval(advance, 4200);
  function pauseAuto() {
    clearInterval(autoTimer);
  }
  function resumeAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(advance, 4200);
  }
  track.addEventListener("mouseenter", pauseAuto);
  track.addEventListener("mouseleave", resumeAuto);
  track.addEventListener("touchstart", pauseAuto, { passive: true });
  track.addEventListener("touchend", resumeAuto);
  prevBtn.addEventListener("click", resumeAuto);
  nextBtn.addEventListener("click", resumeAuto);

  function toEmbedUrl(rawUrl) {
    if (!rawUrl) return rawUrl;

    try {
      const url = new URL(rawUrl, window.location.href);
      const host = url.hostname.replace(/^www\./, "");

      if (host === "youtube.com" || host === "m.youtube.com") {
        const videoId =
          url.searchParams.get("v") ||
          url.pathname.match(/\/shorts\/([A-Za-z0-9_-]+)/)?.[1];

        if (videoId) {
          const params = new URLSearchParams({
            autoplay: "1",
            mute: "1",
            playsinline: "1",
            controls: "0",
            loop: "1",
            playlist: videoId,
            rel: "0",
            modestbranding: "1",
            showinfo: "0",
          });
          return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
        }
      }

      if (host === "youtu.be") {
        const videoId = url.pathname.replace(/^\//, "");
        if (videoId) {
          const params = new URLSearchParams({
            autoplay: "1",
            mute: "1",
            playsinline: "1",
            controls: "0",
            loop: "1",
            playlist: videoId,
            rel: "0",
            modestbranding: "1",
            showinfo: "0",
          });
          return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
        }
      }
    } catch (error) {
      console.warn("Unable to normalize video URL", error);
    }

    return rawUrl;
  }

  cards.forEach((card) => {
    const frame = card.querySelector(".video-frame");
    if (!frame) return;

    const iframe = document.createElement("iframe");
    const videoUrl = frame.dataset.videoUrl;

    iframe.src = toEmbedUrl(videoUrl);
    iframe.title = frame.dataset.videoTitle || "Video showcase";
    iframe.loading = "lazy";
    iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("playsinline", "1");
    iframe.setAttribute("frameborder", "0");
    frame.appendChild(iframe);
  });
})();

/* ==============================================================
   GALAXY BACKGROUND — fixed starfield canvas
   Twinkling stars + occasional shooting stars + slow parallax.
   Replaces the old (never-completed) cinematic media system.
   ============================================================== */
(function initGalaxy() {
  const canvas = document.getElementById("galaxyCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, dpr;
  let stars = [];
  let planets = [];
  let shootingStars = [];
  let scrollY = 0;

  function isMobile() {
    return window.innerWidth < 700;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildStars();
  }

  function buildStars() {
    const count = isMobile() ? 90 : 200;
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.3,
      baseAlpha: Math.random() * 0.5 + 0.35,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.006,
      depth: Math.random() * 0.5 + 0.15, // parallax depth
    }));
    buildPlanets();
  }

  /* two faint background planets — one ringed, positioned near the
     edges so they never compete with the foreground content */
  function buildPlanets() {
    planets = [
      {
        x: w * 0.9,
        y: h * 0.16,
        r: isMobile() ? 30 : 52,
        hue: "139,108,242", // violet
        ring: true,
        depth: 0.08,
        driftPhase: 0,
      },
      {
        x: w * 0.06,
        y: h * 0.78,
        r: isMobile() ? 20 : 34,
        hue: "53,230,200", // teal
        ring: false,
        depth: 0.14,
        driftPhase: Math.PI,
      },
    ];
  }

  function drawPlanets(time) {
    planets.forEach((p) => {
      const drift = prefersReduced ? 0 : Math.sin(time * 0.00006 + p.driftPhase) * 14;
      const parallaxY = (scrollY * p.depth * 0.04) % (h + 200);
      const px = p.x + drift;
      const py = p.y - parallaxY;

      // soft glow
      const glow = ctx.createRadialGradient(px, py, 0, px, py, p.r * 3.2);
      glow.addColorStop(0, `rgba(${p.hue},0.28)`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(px, py, p.r * 3.2, 0, Math.PI * 2);
      ctx.fill();

      // body
      const body = ctx.createRadialGradient(
        px - p.r * 0.3,
        py - p.r * 0.3,
        0,
        px,
        py,
        p.r,
      );
      body.addColorStop(0, `rgba(${p.hue},0.9)`);
      body.addColorStop(1, `rgba(${p.hue},0.15)`);
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fill();

      if (p.ring) {
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(-0.35);
        ctx.strokeStyle = `rgba(${p.hue},0.35)`;
        ctx.lineWidth = Math.max(2, p.r * 0.09);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r * 1.9, p.r * 0.55, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    });
  }

  function maybeSpawnShootingStar() {
    if (prefersReduced) return;
    if (Math.random() < 0.0035 && shootingStars.length < 2) {
      const startX = Math.random() * w * 0.7;
      shootingStars.push({
        x: startX,
        y: Math.random() * h * 0.4,
        len: Math.random() * 90 + 60,
        speed: Math.random() * 9 + 7,
        life: 1,
      });
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, w, h);

    drawPlanets(time);

    // stars
    stars.forEach((s) => {
      const twinkle = prefersReduced
        ? s.baseAlpha
        : s.baseAlpha + Math.sin(time * s.speed + s.phase) * 0.3;
      const parallaxY = (scrollY * s.depth * 0.05) % h;
      let y = s.y - parallaxY;
      if (y < 0) y += h;
      if (y > h) y -= h;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, twinkle))})`;
      ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // shooting stars
    shootingStars.forEach((s) => {
      const grad = ctx.createLinearGradient(
        s.x,
        s.y,
        s.x - s.len,
        s.y - s.len * 0.4,
      );
      grad.addColorStop(0, `rgba(255,255,255,${s.life})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.len, s.y - s.len * 0.4);
      ctx.stroke();
      s.x += s.speed;
      s.y += s.speed * 0.4;
      s.life -= 0.012;
    });
    shootingStars = shootingStars.filter(
      (s) => s.life > 0 && s.x < w + 100 && s.y < h + 100,
    );

    maybeSpawnShootingStar();

    if (!prefersReduced) {
      requestAnimationFrame(draw);
    }
  }

  window.addEventListener("resize", resize);
  window.addEventListener(
    "scroll",
    () => {
      scrollY = window.scrollY;
    },
    { passive: true },
  );

  resize();
  if (prefersReduced) {
    draw(0); // paint a single static frame, no loop
  } else {
    requestAnimationFrame(draw);
  }
})();
