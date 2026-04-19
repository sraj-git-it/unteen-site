const marqueeTrack = document.querySelector(".marquee-track");
const siteHeader = document.querySelector(".site-header");

if (siteHeader) {
  const applyHeaderState = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  applyHeaderState();
  window.addEventListener("scroll", applyHeaderState, { passive: true });
}

if (marqueeTrack) {
  const cards = Array.from(marqueeTrack.children);

  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  marqueeTrack.innerHTML = "";

  cards.forEach((card) => {
    marqueeTrack.append(card);
  });

  cards.forEach((card) => {
    marqueeTrack.append(card.cloneNode(true));
  });
}

const heroCards = Array.from(document.querySelectorAll(".hero-float-card"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (heroCards.length > 0) {
  let frontIndex = 0;
  const setFrontCard = (index) => {
    heroCards.forEach((card, cardIndex) => {
      card.classList.toggle("is-front", cardIndex === index);
    });
  };

  setFrontCard(frontIndex);

  if (!prefersReducedMotion && heroCards.length > 1) {
    window.setInterval(() => {
      frontIndex = (frontIndex + 1) % heroCards.length;
      setFrontCard(frontIndex);
    }, 2200);
  }
}

const metricEls = document.querySelectorAll(".metric-value");

const animateValue = (el, target) => {
  const duration = 1300;
  const start = performance.now();
  const suffix = el.dataset.suffix || "";

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(progress * target);
    const formatted = target > 100 ? value.toLocaleString("en-US") : value.toString();
    el.textContent = `${formatted}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      const finalValue = target > 100 ? target.toLocaleString("en-US") : target.toString();
      el.textContent = `${finalValue}${suffix}`;
    }
  };

  requestAnimationFrame(tick);
};

const metricsObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const target = Number(entry.target.dataset.target || 0);
      animateValue(entry.target, target);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.45 }
);

metricEls.forEach((el) => metricsObserver.observe(el));

const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealEls.forEach((el) => revealObserver.observe(el));

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}
