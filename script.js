// script.js — robust, rewritten

document.addEventListener('DOMContentLoaded', () => {
  // --- elements ---
  const header = document.querySelector('header');
  const headerHeight = () => (header ? header.getBoundingClientRect().height : 0);

  const links = Array.from(document.querySelectorAll('.nav-link'));
  const sections = ['home', 'about', 'projects', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const menuBtn = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('navlinks');
  const showAboutBtn = document.getElementById('showAbout');

  // --- Utility: set active link ---
  function setActiveLink(el) {
    links.forEach(x => x.classList.remove('active'));
    if (el) el.classList.add('active');
  }

  // --- Smooth scroll to element, accounting for fixed header ---
  function smoothScrollTo(el) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offset = headerHeight() + 12; // header + small gap
    const targetY = window.scrollY + rect.top - offset;
    window.scrollTo({ top: Math.round(targetY), behavior: 'smooth'});
  }

  // --- Click handlers for nav links (smooth + close mobile menu) ---
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const target = document.querySelector(href);
      smoothScrollTo(target);
      setActiveLink(link);

      // close mobile menu if open
      if (menuBtn && mobileNav && mobileNav.classList.contains('open')) {
        menuBtn.classList.remove('active');
        mobileNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // keyboard: allow Enter to activate when focused
    link.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        link.click();
      }
    });
  });

  // --- Mobile menu toggle ---
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.classList.toggle('active');
      mobileNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });

    // Close mobile menu when clicking outside it
    document.addEventListener('click', (e) => {
      if (!mobileNav.classList.contains('open')) return;
      const isInside = mobileNav.contains(e.target) || menuBtn.contains(e.target);
      if (!isInside) {
        menuBtn.classList.remove('active');
        mobileNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Show About shortcut button ---
  if (showAboutBtn) {
    showAboutBtn.addEventListener('click', () => {
      const aboutEl = document.getElementById('about');
      smoothScrollTo(aboutEl);
    });
  }

  // --- Active-on-scroll: robust approach (closest section to header) ---
  function updateActiveOnScroll() {
    const offset = headerHeight() + 12;
    let closest = null;
    let closestDist = Infinity;

    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      // distance of section top to header area
      const dist = Math.abs(rect.top - offset);
      if (dist < closestDist) {
        closestDist = dist;
        closest = sec;
      }
    });

    if (closest) {
      const a = document.querySelector('.nav-link[href="#' + closest.id + '"]');
      if (a) setActiveLink(a);
    }
  }

  // Debounce helper
  function debounce(fn, wait = 60) {
    let t = null;
    return function(...args) {
      if (t) clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  const debouncedUpdate = debounce(updateActiveOnScroll, 80);
  window.addEventListener('scroll', debouncedUpdate, { passive: true });
  window.addEventListener('resize', debounce(() => {
    // recalc on resize
    updateActiveOnScroll();
  }, 120));

  // run once on load (small delay to allow fonts/layout)
  window.addEventListener('load', () => {
    setTimeout(updateActiveOnScroll, 120);
  });
  // also run immediately in case DOM ready after defer
  updateActiveOnScroll();

  // --- Typewriter / role animation (kept from original) ---
  (function typewriter() {
    const roleEl = document.getElementById('role');
    if (!roleEl) return;
    const roles = ['Full stack developer', 'UI UX Designer', 'Problem solver'];
    let ri = 0, ci = 0, forward = true;
    function step() {
      const text = roles[ri];
      if (forward) {
        roleEl.textContent = text.slice(0, ++ci);
        if (ci === text.length) { forward = false; setTimeout(step, 1100); return; }
      } else {
        roleEl.textContent = text.slice(0, --ci);
        if (ci === 0) { forward = true; ri = (ri + 1) % roles.length; }
      }
      setTimeout(step, 80);
    }
    step();
  })();

  // --- Small reveal animation on load (kept) ---
  window.addEventListener('load', () => {
    document.querySelectorAll('section').forEach((sec, i) => {
      sec.style.opacity = 0;
      sec.style.transform = 'translateY(18px)';
      setTimeout(() => {
        sec.style.transition = 'opacity 600ms ease, transform 600ms ease';
        sec.style.opacity = 1;
        sec.style.transform = 'none';
      }, 150 * i);
    });
  });

  // --- Contact form validation ---
  (function contactForm() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('successMsg');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');

      if (name && name.value.trim().length < 2) { alert('Please enter a valid name'); name.focus(); return; }
      if (email && !/^\S+@\S+\.\S+$/.test(email.value)) { alert('Please enter a valid email'); email.focus(); return; }
      if (message && message.value.trim().length < 6) { alert('Please add a slightly longer message'); message.focus(); return; }

      // show success, clear form with simple animation
      if (success) {
        success.style.display = 'block';
        success.style.opacity = 0; success.style.transition = 'opacity 250ms';
        setTimeout(() => success.style.opacity = 1, 10);
      }
      setTimeout(() => {
        form.reset();
        if (success) success.style.opacity = 0;
        setTimeout(() => { if (success) success.style.display = 'none'; }, 300);
      }, 1600);
    });
  })();

  // --- small accessibility: current year ---
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ensure nav links are keyboard focusable
  document.querySelectorAll('.nav-link').forEach(a => a.setAttribute('tabindex','0'));
});
