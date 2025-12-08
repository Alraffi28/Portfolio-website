
document.addEventListener('DOMContentLoaded', () => {

  const header = document.querySelector('header');
  const headerHeight = () => (header ? header.getBoundingClientRect().height : 0);

  const links = Array.from(document.querySelectorAll('.nav-link'));
  const sections = ['home', 'about', 'projects', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const menuBtn = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('navlinks');
  const showAboutBtn = document.getElementById('showAbout');

  function setActiveLink(el) {
    links.forEach(x => x.classList.remove('active'));
    if (el) el.classList.add('active');
  }

  function smoothScrollTo(el) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offset = headerHeight() + 12; // header + small gap
    const targetY = window.scrollY + rect.top - offset;
    window.scrollTo({ top: Math.round(targetY), behavior: 'smooth'});
  }

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const target = document.querySelector(href);
      smoothScrollTo(target);
      setActiveLink(link);

      if (menuBtn && mobileNav && mobileNav.classList.contains('open')) {
        menuBtn.classList.remove('active');
        mobileNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    link.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        link.click();
      }
    });
  });

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.classList.toggle('active');
      mobileNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });

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

  if (showAboutBtn) {
    showAboutBtn.addEventListener('click', () => {
      const aboutEl = document.getElementById('about');
      smoothScrollTo(aboutEl);
    });
  }

  function updateActiveOnScroll() {
    const offset = headerHeight() + 12;
    let closest = null;
    let closestDist = Infinity;

    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
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
    updateActiveOnScroll();
  }, 120));

  window.addEventListener('load', () => {
    setTimeout(updateActiveOnScroll, 120);
  });
  updateActiveOnScroll();

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

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  document.querySelectorAll('.nav-link').forEach(a => a.setAttribute('tabindex','0'));
});
