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
