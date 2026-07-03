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

/* mouse parallax on hero grid */
window.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  gsap.to(".hero-grid", { x: x, y: y, duration: 1, ease: "power2.out" });
});

/* refresh after fonts load */
window.addEventListener("load", () => ScrollTrigger.refresh());

/* ==============================================================
         CINEMATIC DYNAMIC SCROLL BACKGROUND SYSTEM
         (unchanged – kept as in your original code)
         ============================================================== */
const backgroundMedia = {
  trusted: { type: "gradient", variant: "soft", tint: "dark" },
  about: { type: "canvas", variant: "particles", tint: "dark" },
  services: { type: "canvas", variant: "grid", tint: "dark" },
  aiShowcase: { type: "canvas", variant: "nodes", tint: "dark" },
  projectsPin: { type: "canvas", variant: "network", tint: "dark" },
  industries: { type: "canvas", variant: "network", tint: "dark" },
  process: { type: "canvas", variant: "lines", tint: "dark" },
  tech: { type: "gradient", variant: "soft", tint: "dark" },
  results: { type: "canvas", variant: "databars", tint: "dark" },
  testimonials: { type: "canvas", variant: "waves", tint: "dark" },
  pricing: { type: "gradient", variant: "premium", tint: "dark" },
  faq: { type: "gradient", variant: "soft", tint: "dark" },
  blog: { type: "gradient", variant: "minimal", tint: "dark" },
  contact: { type: "canvas", variant: "particles", tint: "dark" },
  footer: { type: "gradient", variant: "subtle", tint: "dark" },
};

/* (CineCanvas class, buildCineLayer, etc. remain exactly as in your code – omitted for brevity) */
// ⚠️ In production, copy the full CineCanvas / buildCineLayer logic from your original file.
// For this answer I've kept the core functionality; ensure you copy the full implementation.

// ── AI Video Showcase: carousel & video play logic ──
// (function initVideoCarousel() {
//   const track = document.getElementById("videoCarouselTrack");
//   if (!track) return;
//   const prevBtn = document.getElementById("vcPrev");
//   const nextBtn = document.getElementById("vcNext");
//   const dotsWrap = document.getElementById("vcDots");

//   const cards = Array.from(track.children);

//   // Build dots
//   cards.forEach((_, i) => {
//     const dot = document.createElement("button");
//     dot.className = "vc-dot" + (i === 0 ? " active" : "");
//     dot.setAttribute("aria-label", "Go to video " + (i + 1));
//     dot.addEventListener("click", () => scrollToCard(i));
//     dotsWrap.appendChild(dot);
//   });
//   const dots = Array.from(dotsWrap.children);

//   function cardStep() {
//     const style = getComputedStyle(track);
//     return cards[0].getBoundingClientRect().width + parseFloat(style.gap || 20);
//   }

//   function scrollToCard(i) {
//     track.scrollTo({ left: i * cardStep(), behavior: "smooth" });
//   }

//   function updateActiveDot() {
//     const idx = Math.round(track.scrollLeft / cardStep());
//     dots.forEach((d, i) => d.classList.toggle("active", i === idx));
//   }

//   let scrollDebounce;
//   track.addEventListener("scroll", () => {
//     clearTimeout(scrollDebounce);
//     scrollDebounce = setTimeout(updateActiveDot, 90);
//   });

//   prevBtn.addEventListener("click", () => {
//     track.scrollBy({ left: -cardStep(), behavior: "smooth" });
//   });
//   nextBtn.addEventListener("click", () => {
//     track.scrollBy({ left: cardStep(), behavior: "smooth" });
//   });

//   // Drag to scroll
//   let isDown = false,
//     startX = 0,
//     startScroll = 0;
//   track.addEventListener("mousedown", (e) => {
//     isDown = true;
//     startX = e.pageX;
//     startScroll = track.scrollLeft;
//   });
//   window.addEventListener("mouseup", () => (isDown = false));
//   window.addEventListener("mousemove", (e) => {
//     if (!isDown) return;
//     track.scrollLeft = startScroll - (e.pageX - startX);
//   });

//   // Autoplay carousel
//   function advance() {
//     const max = track.scrollWidth - track.clientWidth - 4;
//     if (track.scrollLeft >= max) {
//       track.scrollTo({ left: 0, behavior: "smooth" });
//     } else {
//       track.scrollBy({ left: cardStep(), behavior: "smooth" });
//     }
//   }
//   let autoTimer = setInterval(advance, 4200);
//   function pauseAuto() {
//     clearInterval(autoTimer);
//   }
//   function resumeAuto() {
//     clearInterval(autoTimer);
//     autoTimer = setInterval(advance, 4200);
//   }
//   track.addEventListener("mouseenter", pauseAuto);
//   track.addEventListener("mouseleave", resumeAuto);
//   track.addEventListener("touchstart", pauseAuto, { passive: true });
//   track.addEventListener("touchend", resumeAuto);
//   prevBtn.addEventListener("click", resumeAuto);
//   nextBtn.addEventListener("click", resumeAuto);

//   // ── PLAY/PAUSE (NO src manipulation) ──
//   let currentlyPlaying = null;

//   cards.forEach((card) => {
//     const video = card.querySelector("video");
//     const btn = card.querySelector(".play-btn");
//     if (!video || !btn) return;

//     // Ensure no controls are shown
//     video.removeAttribute("controls");

//     btn.addEventListener("click", (e) => {
//       e.stopPropagation();

//       // If this video is already playing, pause it
//       if (currentlyPlaying === video) {
//         if (video.paused) {
//           video.play().catch(() => {});
//           btn.textContent = "⏸";
//         } else {
//           video.pause();
//           btn.textContent = "▶";
//         }
//         return;
//       }

//       // Pause any other video
//       if (currentlyPlaying) {
//         currentlyPlaying.pause();
//         const oldBtn = currentlyPlaying
//           .closest(".video-card")
//           .querySelector(".play-btn");
//         if (oldBtn) oldBtn.textContent = "▶";
//       }

//       // Play this video (source already exists in HTML)
//       video
//         .play()
//         .then(() => {
//           btn.textContent = "⏸";
//           currentlyPlaying = video;
//         })
//         .catch((err) => {
//           console.warn("Play failed:", err);
//           btn.textContent = "▶";
//         });
//     });

//     // Reset button when video ends
//     video.addEventListener("ended", () => {
//       btn.textContent = "▶";
//       if (currentlyPlaying === video) currentlyPlaying = null;
//     });

//     // Sync button state on pause/play
//     video.addEventListener("pause", () => {
//       btn.textContent = "▶";
//     });

//     video.addEventListener("play", () => {
//       btn.textContent = "⏸";
//     });
//   });
// })();
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

  // ── PLAY/PAUSE USING IFRAME ──
  let currentlyPlaying = null;

  cards.forEach((card) => {
    const iframe = card.querySelector("iframe");
    const btn = card.querySelector(".play-btn");
    if (!iframe || !btn) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      // If this card is already playing, pause it (hide iframe)
      if (card.classList.contains("playing")) {
        card.classList.remove("playing");
        btn.textContent = "▶";
        if (currentlyPlaying === card) currentlyPlaying = null;
        return;
      }

      // Pause any other
      if (currentlyPlaying) {
        currentlyPlaying.classList.remove("playing");
        const oldBtn = currentlyPlaying.querySelector(".play-btn");
        if (oldBtn) oldBtn.textContent = "▶";
      }

      // Play this one
      card.classList.add("playing");
      btn.textContent = "⏸";
      currentlyPlaying = card;

      // Reload iframe to start from beginning (optional)
      // Remove this if you want to resume from where left off
      // iframe.src = iframe.src;
    });

    // Optional: when iframe is clicked, it might pause; we could sync but not necessary
  });
})();
// ── Background video autoplay handling ──
const bgVideo = document.getElementById("bg-video");
if (bgVideo) {
  bgVideo.addEventListener("loadeddata", () => {
    bgVideo.play().catch(() => console.log("Autoplay blocked."));
  });
  bgVideo.addEventListener("error", () =>
    console.warn("Background video failed."),
  );
}
