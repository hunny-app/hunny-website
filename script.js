function getNextAprilFirst(now) {
  const year = now.getFullYear();
  const targetThisYear = new Date(year, 3, 1, 0, 0, 0, 0);
  return now < targetThisYear ? targetThisYear : new Date(year + 1, 3, 1, 0, 0, 0, 0);
}

function formatUnit(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
    return;
  }

  const now = new Date();
  const target = getNextAprilFirst(now);
  const remainingMs = Math.max(target.getTime() - now.getTime(), 0);

  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  daysEl.textContent = formatUnit(days);
  hoursEl.textContent = formatUnit(hours);
  minutesEl.textContent = formatUnit(minutes);
  secondsEl.textContent = formatUnit(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

(function initThoughtBubbleParallax() {
  const wraps = document.querySelectorAll(".thought-bubble-wrap");
  if (!wraps.length) {
    return;
  }

  /** How much faster/slower each bubble is vs the pack (10 = huge spread vs page scroll) */
  const SPEED_SPREAD_EXAGGERATION = 10;
  /** Overall strength after spread (tune if motion is too wild) */
  const PARALLAX_DAMPEN = 0.22;

  const rawFactors = Array.from(wraps).map((el) => {
    const v = parseFloat(el.dataset.parallax);
    return Number.isFinite(v) ? v : 0.18;
  });
  const meanFactor =
    rawFactors.reduce((a, b) => a + b, 0) / rawFactors.length;

  let ticking = false;

  function applyParallax() {
    const scrollY = window.scrollY || window.pageYOffset;
    wraps.forEach((el, i) => {
      const factor = rawFactors[i];
      /* Amplify deviation from average so bubbles clearly diverge from each other & from “locked” scroll */
      const effectiveFactor =
        meanFactor + (factor - meanFactor) * SPEED_SPREAD_EXAGGERATION;
      const y = scrollY * PARALLAX_DAMPEN * effectiveFactor;
      el.style.transform = `translate3d(0, ${y}px, 0)`;
    });
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(applyParallax);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  applyParallax();
})();

(function initThoughtsCarousel() {
  const root = document.querySelector("[data-thoughts-carousel]");
  const track = document.getElementById("thoughtsTrack");
  if (!root || !track) {
    return;
  }

  const slides = Array.from(root.querySelectorAll(".thoughts-slide"));
  const prevBtn = root.querySelector(".thoughts-btn--prev");
  const nextBtn = root.querySelector(".thoughts-btn--next");
  const dotsNav = root.querySelector(".thoughts-dots");
  if (!slides.length || !prevBtn || !nextBtn || !dotsNav) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const autoplayMs = reduceMotion ? 0 : 7000;
  let index = 0;
  let autoplayId = null;
  let touchStartX = null;

  function setAria() {
    slides.forEach((slide, i) => {
      const on = i === index;
      slide.setAttribute("aria-hidden", on ? "false" : "true");
      slide.setAttribute("tabindex", on ? "0" : "-1");
    });
  }

  function updateDots() {
    dotsNav.querySelectorAll(".thoughts-dot").forEach((dot, i) => {
      const on = i === index;
      dot.classList.toggle("is-active", on);
      dot.setAttribute("aria-current", on ? "true" : "false");
    });
  }

  function goTo(i) {
    const n = slides.length;
    index = ((i % n) + n) % n;
    track.style.transform = `translateX(-${index * 100}%)`;
    setAria();
    updateDots();
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  function stopAutoplay() {
    if (autoplayId != null) {
      window.clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    if (autoplayMs > 0) {
      autoplayId = window.setInterval(next, autoplayMs);
    }
  }

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "thoughts-dot";
    dot.setAttribute("aria-label", `Show thought ${i + 1} of ${slides.length}`);
    dot.addEventListener("click", () => {
      goTo(i);
      startAutoplay();
    });
    dotsNav.appendChild(dot);
  });

  prevBtn.addEventListener("click", () => {
    prev();
    startAutoplay();
  });

  nextBtn.addEventListener("click", () => {
    next();
    startAutoplay();
  });

  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
      startAutoplay();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
      startAutoplay();
    }
  });

  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);
  root.addEventListener("focusin", stopAutoplay);
  root.addEventListener("focusout", () => {
    if (!root.contains(document.activeElement)) {
      startAutoplay();
    }
  });

  track.addEventListener(
    "touchstart",
    (e) => {
      if (!e.touches.length) {
        return;
      }
      touchStartX = e.touches[0].clientX;
      root.classList.add("is-dragging");
    },
    { passive: true }
  );

  track.addEventListener(
    "touchend",
    (e) => {
      root.classList.remove("is-dragging");
      if (touchStartX == null || !e.changedTouches.length) {
        touchStartX = null;
        return;
      }
      const dx = e.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(dx) > 48) {
        if (dx < 0) {
          next();
        } else {
          prev();
        }
        startAutoplay();
      }
    },
    { passive: true }
  );

  goTo(0);
  startAutoplay();
})();

(function initPainSolutionsToggle() {
  const btn = document.getElementById("painSolutionsToggle");
  const panel = document.getElementById("painSolutionsMore");
  if (!btn || !panel) {
    return;
  }

  const expandLabel = "Show 7 more pain points & solutions";
  const collapseLabel = "Show fewer";

  btn.addEventListener("click", () => {
    const willOpen = panel.hasAttribute("hidden");
    if (willOpen) {
      panel.removeAttribute("hidden");
      btn.setAttribute("aria-expanded", "true");
      btn.textContent = collapseLabel;
    } else {
      panel.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", "false");
      btn.textContent = expandLabel;
    }
  });
})();
