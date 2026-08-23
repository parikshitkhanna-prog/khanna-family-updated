(() => {
  const header = document.getElementById('site-header');
  const progress = document.getElementById('progress-bar');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-navigation');
  const links = [...document.querySelectorAll('.nav-link')];
  const sections = [...document.querySelectorAll('main section[id], footer[id]')];
  const reveals = document.querySelectorAll('.reveal');

  const updateScrollUI = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 40);
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { updateScrollUI(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  updateScrollUI();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
  reveals.forEach(el => observer.observe(el));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const active = entry.target.id;
      links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${active}`));
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));

  const closeMenu = () => {
    nav?.classList.remove('open');
    menuButton?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  };

  menuButton?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
  });
  links.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', e => {
    if (window.innerWidth <= 700 && nav?.classList.contains('open') && !nav.contains(e.target) && !menuButton.contains(e.target)) closeMenu();
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 700) closeMenu(); });

  document.getElementById('year').textContent = new Date().getFullYear();

  // Tiny, GPU-friendly hero drift — deliberately disabled for reduced-motion users.
  const hero = document.querySelector('.hero-content');
  if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY, window.innerHeight);
      hero.style.transform = `translate3d(0, ${y * 0.08}px, 0)`;
      hero.style.opacity = String(1 - Math.min(y / (window.innerHeight * 0.9), 0.55));
    }, { passive: true });
  }
})();
