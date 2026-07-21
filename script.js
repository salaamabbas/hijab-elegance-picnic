// mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll(':scope > a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// nav dropdown (About Us) — toggles on mobile, hover on desktop via CSS
document.querySelectorAll('.has-dropdown > a').forEach(link => {
  link.addEventListener('click', (e) => {
    if (window.innerWidth <= 820) {
      e.preventDefault();
      link.closest('.has-dropdown').classList.toggle('open');
    }
  });
});

// scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-a').style.maxHeight = null;
      }
    });
    if (isOpen) {
      item.classList.remove('open');
      a.style.maxHeight = null;
    } else {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

// ---------- Stats count-up ----------
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.stat-num[data-count]').forEach(el => statObserver.observe(el));

// ---------- Countdown to Hijab Elegance Picnic (Sun 6 Sept 2026, 9:00 AM EAT) ----------
const PICNIC_START = new Date("2026-09-06T09:00:00+03:00");
const PICNIC_DAY_END = new Date("2026-09-07T00:00:00+03:00"); // midnight after picnic day

function updateCountdown() {
  const now = new Date();
  const fullWrap = document.getElementById('countdownWrap');
  const hideTargets = document.querySelectorAll('[data-hide-after-event="true"]');

  if (now >= PICNIC_DAY_END) {
    if (fullWrap) fullWrap.classList.add('is-hidden');
    hideTargets.forEach(el => el.style.display = 'none');
    return;
  }

  if (now >= PICNIC_START && now < PICNIC_DAY_END) {
    if (fullWrap) {
      fullWrap.classList.remove('is-hidden');
      fullWrap.classList.add('is-today');
    }
    return;
  }

  const diff = PICNIC_START - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const dEl = document.getElementById('cdDays');
  const hEl = document.getElementById('cdHours');
  const mEl = document.getElementById('cdMinutes');
  const sEl = document.getElementById('cdSeconds');
  if (dEl) dEl.textContent = String(days);
  if (hEl) hEl.textContent = String(hours).padStart(2, '0');
  if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
  if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
}

if (document.getElementById('countdownWrap') || document.querySelectorAll('[data-hide-after-event="true"]').length) {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ---------- Testimonial rotator (auto-advances every 5s) ----------
const testiSlides = document.querySelectorAll('.testi-slide');
const testiDots = document.querySelectorAll('.testi-dot');
if (testiSlides.length > 1) {
  let testiIndex = 0;
  function showTesti(i) {
    testiSlides.forEach(s => s.classList.remove('active'));
    testiDots.forEach(d => d.classList.remove('active'));
    testiSlides[i].classList.add('active');
    if (testiDots[i]) testiDots[i].classList.add('active');
    testiIndex = i;
  }
  testiDots.forEach((dot, i) => dot.addEventListener('click', () => showTesti(i)));
  setInterval(() => {
    showTesti((testiIndex + 1) % testiSlides.length);
  }, 5000);
}

// ---------- Testimonial submission ----------
// TODO: paste the real submission endpoint here once it's shared with you.
const TESTIMONIAL_ENDPOINT = "https://formspree.io/f/xnjqqgor";

const testiToggle = document.getElementById('testiToggle');
const testiForm = document.getElementById('testiForm');
if (testiToggle && testiForm) {
  testiToggle.addEventListener('click', () => {
    testiForm.classList.toggle('open');
  });
}

const testiSubmitForm = document.getElementById('testiForm');
if (testiSubmitForm) {
  testiSubmitForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('testiStatus');
    const name = document.getElementById('testiName').value.trim();
    const edition = document.getElementById('testiEdition').value.trim();
    const quote = document.getElementById('testiQuote').value.trim();

    if (!name || !quote) {
      status.textContent = "Please fill in your name and your testimonial.";
      status.style.color = "#B5563C";
      return;
    }

    if (!TESTIMONIAL_ENDPOINT || TESTIMONIAL_ENDPOINT === "PASTE_TESTIMONIAL_ENDPOINT_HERE") {
      status.textContent = "Thank you! Submission isn't connected yet — this form will go live once the endpoint is added.";
      status.style.color = "#0B4F45";
      return;
    }

    status.textContent = "Sending...";
    status.style.color = "#1E1912";

    try {
      const res = await fetch(TESTIMONIAL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ name, edition, quote, message: `Testimonial from ${name} (${edition || "edition not specified"}): ${quote}` })
      });
      if (res.ok) {
        status.textContent = "Thank you! Your testimonial has been submitted.";
        status.style.color = "#0B4F45";
        testiSubmitForm.reset();
      } else {
        status.textContent = "Something went wrong. Please try again later.";
        status.style.color = "#B5563C";
      }
    } catch (err) {
      status.textContent = "Something went wrong. Please try again later.";
      status.style.color = "#B5563C";
    }
  });
}