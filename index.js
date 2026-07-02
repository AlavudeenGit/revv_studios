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

/* horizontal pinned projects */
function initProjectsPin() {
  const track = document.getElementById("projectsTrack");
  const pin = document.getElementById("projectsPin");
  if (!track || window.innerWidth < 700) return;
  const getDistance = () => track.scrollWidth - window.innerWidth + 96;
  let tween = gsap.to(track, {
    x: () => -getDistance(),
    ease: "none",
    scrollTrigger: {
      trigger: pin,
      start: "top top",
      end: () => "+=" + (getDistance() + window.innerHeight * 0.6),
      scrub: 1,
      pin: true,
      invalidateOnRefresh: true,
    },
  });
}
initProjectsPin();

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

/* results band count text color already accent via CSS */

/* mouse parallax on hero grid */
window.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  gsap.to(".hero-grid", { x: x, y: y, duration: 1, ease: "power2.out" });
});

/* refresh after fonts load */
window.addEventListener("load", () => ScrollTrigger.refresh());

/* =====================================================================
   CINEMATIC DYNAMIC SCROLL BACKGROUND SYSTEM — Background Manager
   ---------------------------------------------------------------------
   Every section below is wired to one entry in `backgroundMedia`.
   To swap in your own AI-generated assets later, only edit this object —
   no HTML/CSS/JS restructuring required.

   Supported cfg.type values: 'canvas' | 'gradient' | 'video' | 'webm' | 'gif' | 'lottie' | 'three'
   - canvas / gradient  -> render live right now (zero external dependencies, always reliable)
   - video / webm       -> set cfg.src to an .mp4/.webm URL, lazy-loads + autoplays muted when in view
   - gif                -> set cfg.src to a .gif URL, lazy-loads
   - lottie             -> set cfg.src to a Lottie .json URL (lottie-web is pulled in on demand)
   - three              -> renders a lightweight rotating Three.js scene (three.js pulled in on demand)

   Example swap:
     hero: { type:'video', src:'https://your-cdn.com/hero-ai-render.mp4', tint:'dark' }
   ===================================================================== */

const backgroundMedia = {
  // Hero → cinematic AI technology motion, no readability wash — video/scene shows fully transparent
  trusted: { type: "gradient", variant: "soft", tint: "dark" }, // Trusted By → soft animated gradient
  about: { type: "canvas", variant: "particles", tint: "dark" }, // About → flowing abstract particles
  services: { type: "canvas", variant: "grid", tint: "dark" }, // Services → technology animation
  aiShowcase: { type: "canvas", variant: "nodes", tint: "dark" }, // AI Showcase → futuristic AI animation
  projectsPin: { type: "canvas", variant: "network", tint: "dark" }, // Projects → digital network animation
  industries: { type: "canvas", variant: "network", tint: "dark" }, // Industries → corporate world animation
  process: { type: "canvas", variant: "lines", tint: "dark" }, // Process → flowing connection lines
  tech: { type: "gradient", variant: "soft", tint: "dark" },
  results: { type: "canvas", variant: "databars", tint: "dark" }, // Results → animated data visualization
  testimonials: { type: "canvas", variant: "waves", tint: "dark" }, // Testimonials → soft moving light waves
  pricing: { type: "gradient", variant: "premium", tint: "dark" }, // Pricing → premium gradient animation
  faq: { type: "gradient", variant: "soft", tint: "dark" },
  blog: { type: "gradient", variant: "minimal", tint: "dark" }, // Blog → minimal animated background
  contact: { type: "canvas", variant: "particles", tint: "dark" }, // Contact → elegant corporate abstract animation
  footer: { type: "gradient", variant: "subtle", tint: "dark" }, // Footer → subtle looping gradient
};

/* Lightweight canvas scene engine — one class, several drawing modes,
   so every 'canvas' entry above shares a single tiny rAF-driven renderer. */
class CineCanvas {
  constructor(canvas, mode, tint) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.mode = mode;
    this.tint = tint;
    this.running = false;
    this.t = 0;
    this.resize = this.resize.bind(this);
    this.loop = this.loop.bind(this);
    this.resize();
    window.addEventListener("resize", this.resize);
    this.seed();
  }
  resize() {
    const r = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(1, r.width * dpr);
    this.canvas.height = Math.max(1, r.height * dpr);
    this.w = this.canvas.width;
    this.h = this.canvas.height;
  }
  seed() {
    const counts = {
      particles: 44,
      network: 32,
      nodes: 28,
      lines: 0,
      waves: 0,
      databars: 7,
      orbit: 0,
      grid: 0,
    };
    const n = counts[this.mode] ?? 30;
    this.pts = Array.from({ length: n }, () => ({
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 1,
    }));
  }
  c1(a) {
    return this.tint === "dark"
      ? `rgba(148,163,184,${a})`
      : `rgba(37,99,235,${a})`;
  }
  c2(a) {
    return `rgba(20,184,166,${a})`;
  }
  draw() {
    const ctx = this.ctx,
      w = this.w,
      h = this.h;
    ctx.clearRect(0, 0, w, h);
    if (
      this.mode === "particles" ||
      this.mode === "network" ||
      this.mode === "nodes"
    ) {
      this.pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2, 0, Math.PI * 2);
        ctx.fillStyle = this.c1(0.55);
        ctx.fill();
      });
      const maxD = w * 0.13;
      for (let i = 0; i < this.pts.length; i++) {
        for (let j = i + 1; j < this.pts.length; j++) {
          const a = this.pts[i],
            b = this.pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < maxD) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = this.c1((1 - d / maxD) * 0.28);
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    } else if (this.mode === "orbit") {
      this.t += 0.0025;
      const cx = w / 2,
        cy = h * 0.42;
      [0.16, 0.26, 0.36].forEach((rf, i) => {
        const r = Math.min(w, h) * rf;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = this.c1(0.13);
        ctx.lineWidth = 1;
        ctx.stroke();
        const ang = this.t * (i % 2 ? 1 : -1) * (1 + i * 0.4);
        const x = cx + Math.cos(ang) * r,
          y = cy + Math.sin(ang) * r * 0.5;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = this.c2(0.8);
        ctx.fill();
      });
    } else if (this.mode === "grid") {
      this.t += 0.01;
      const step = Math.max(46, w * 0.045);
      for (let x = 0; x < w; x += step) {
        for (let y = 0; y < h; y += step) {
          const wave = Math.sin((x + y) * 0.01 + this.t) * 0.5 + 0.5;
          ctx.fillStyle = this.c1(wave * 0.14);
          ctx.fillRect(x, y, 2.4, 2.4);
        }
      }
    } else if (this.mode === "lines") {
      this.t += 0.006;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += w / 40) {
          const y =
            h * (0.2 + i * 0.15) + Math.sin(x * 0.006 + this.t + i) * h * 0.05;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = i % 2 ? this.c2(0.22) : this.c1(0.18);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    } else if (this.mode === "waves") {
      this.t += 0.004;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += w / 60) {
          const y =
            h * 0.5 +
            Math.sin(x * 0.004 + this.t * (1 + i * 0.3) + i) *
              h *
              0.06 *
              (i + 1);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = this.c1(0.09 + i * 0.03);
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    } else if (this.mode === "databars") {
      this.t += 0.02;
      const n = this.pts.length,
        bw = w / n;
      this.pts.forEach((p, i) => {
        const bh = (Math.sin(this.t + i) * 0.5 + 0.5) * h * 0.5 + h * 0.08;
        const grad = ctx.createLinearGradient(0, h, 0, h - bh);
        grad.addColorStop(0, this.c2(0.5));
        grad.addColorStop(1, this.c1(0.05));
        ctx.fillStyle = grad;
        ctx.fillRect(i * bw + bw * 0.2, h - bh, bw * 0.6, bh);
      });
    }
  }
  loop() {
    if (!this.running) return;
    this.draw();
    requestAnimationFrame(this.loop);
  }
  start() {
    if (this.running) return;
    this.running = true;
    this.loop();
  }
  stop() {
    this.running = false;
  }
}

/* On-demand loaders so Lottie/Three.js are only fetched if actually used */
function cineLoadLottie(container, src) {
  if (!src) return;
  const s = document.createElement("script");
  s.src =
    "https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js";
  s.onload = () => {
    if (window.lottie)
      window.lottie.loadAnimation({
        container,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: src,
      });
  };
  document.head.appendChild(s);
}
function cineLoadThree(canvas) {
  const s = document.createElement("script");
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
  s.onload = () => {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
    camera.position.z = 5;
    const geo = new THREE.SphereGeometry(1.6, 24, 24);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x2563eb,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    function resize() {
      const r = canvas.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / Math.max(r.height, 1);
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);
    (function animate() {
      mesh.rotation.y += 0.002;
      mesh.rotation.x += 0.001;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    })();
  };
  document.head.appendChild(s);
}

function buildCineLayer(id, cfg) {
  const host = document.getElementById(id);
  if (!host) return;

  const layer = document.createElement("div");
  layer.className = "cine-bg";
  layer.dataset.tint = cfg.tint;

  let media, io;

  if (cfg.type === "canvas") {
    media = document.createElement("canvas");
    layer.appendChild(media);
  } else if (cfg.type === "gradient") {
    media = document.createElement("div");
    media.className = "cine-gradient cine-gradient--" + cfg.variant;
    layer.appendChild(media);
  } else if (cfg.type === "video" || cfg.type === "webm") {
    media = document.createElement("video");
    media.muted = true;
    media.loop = true;
    media.playsInline = true;
    media.preload = "none";
    if (cfg.poster) media.poster = cfg.poster;
    media.dataset.src = cfg.src || "";
    layer.appendChild(media);
  } else if (cfg.type === "gif") {
    media = document.createElement("img");
    media.loading = "lazy";
    media.alt = "";
    media.dataset.src = cfg.src || "";
    layer.appendChild(media);
  } else if (cfg.type === "lottie") {
    media = document.createElement("div");
    media.className = "cine-lottie";
    layer.appendChild(media);
    cineLoadLottie(media, cfg.src);
  } else if (cfg.type === "three") {
    media = document.createElement("canvas");
    layer.appendChild(media);
    cineLoadThree(media);
  }

  if (
    ["canvas", "video", "webm", "gif"].includes(cfg.type) &&
    cfg.overlay !== false
  ) {
    const overlay = document.createElement("div");
    overlay.className =
      cfg.tint === "dark" ? "cine-overlay-dark" : "cine-overlay-light";
    layer.appendChild(overlay);
  }

  // insertion point — first child, so it always paints behind existing content
  // (each section is already position:relative; content wrappers are position:relative
  // too, so normal DOM order keeps the new layer strictly beneath everything else)
  if (id === "hero") {
    const anchor = document.querySelector(".hero-content");
    anchor ? anchor.before(layer) : host.insertBefore(layer, host.firstChild);
  } else {
    host.insertBefore(layer, host.firstChild);
  }

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (cfg.type === "canvas") {
    const engine = new CineCanvas(media, cfg.variant, cfg.tint);
    if (prefersReduced) {
      engine.draw();
    } else {
      io = new IntersectionObserver(
        ([entry]) => {
          entry.isIntersecting ? engine.start() : engine.stop();
        },
        { threshold: 0.05 },
      );
      io.observe(host);
    }
  }

  if (cfg.type === "video" || cfg.type === "webm") {
    io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!media.getAttribute("src") && media.dataset.src)
            media.src = media.dataset.src;
          if (!prefersReduced) media.play().catch(() => {});
        } else {
          media.pause();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(host);
  }

  if (cfg.type === "gif") {
    io = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !media.getAttribute("src") &&
          media.dataset.src
        ) {
          media.src = media.dataset.src;
        }
      },
      { threshold: 0.1 },
    );
    io.observe(host);
  }

  // cinematic reveal: crossfade + slow zoom + blur-out, toggles both ways
  ScrollTrigger.create({
    trigger: host,
    start: "top 78%",
    end: "bottom 20%",
    toggleClass: { targets: layer, className: "in" },
  });

  // gentle parallax drift for depth while scrolling through the section
  if (!prefersReduced) {
    gsap.to(layer, {
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: host,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }
}

Object.entries(backgroundMedia).forEach(([id, cfg]) => buildCineLayer(id, cfg));
ScrollTrigger.refresh();

/* AI Video Showcase — carousel controller */
(function initVideoCarousel() {
  const track = document.getElementById("videoCarouselTrack");
  if (!track) return;
  const prevBtn = document.getElementById("vcPrev");
  const nextBtn = document.getElementById("vcNext");
  const dotsWrap = document.getElementById("vcDots");
  const cards = Array.from(track.children);

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

  // click-and-drag scrolling on desktop
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

  // autoplay, paused on hover / touch / manual interaction
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
})();
const video = document.getElementById("bg-video");

// Ensure autoplay works
video.addEventListener("loadeddata", () => {
  video.play().catch(() => {
    // If autoplay is blocked, user interaction will start it
    console.log("Autoplay blocked – waiting for user interaction.");
  });
});

// Fallback if video fails to load
video.addEventListener("error", () => {
  console.warn("Video failed to load.");
});
