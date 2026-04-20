// ===== Header scroll behavior (Scroll Back style like Squarespace) =====
(function () {
  const header = document.getElementById('header');
  let lastScroll = 0;
  const threshold = 100;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      header.classList.remove('scrolled-down', 'scrolled-up');
      return;
    }

    if (currentScroll > lastScroll && currentScroll > threshold) {
      // Scrolling down
      header.classList.add('scrolled-down');
      header.classList.remove('scrolled-up');
    } else if (currentScroll < lastScroll) {
      // Scrolling up
      header.classList.remove('scrolled-down');
      header.classList.add('scrolled-up');
    }

    lastScroll = currentScroll;
  });

  // ===== Mobile menu =====
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
  }

  // Mobile folder toggles
  document.querySelectorAll('.mobile-folder-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      content.classList.toggle('open');
    });
  });

  // ===== Scroll animations (fade in on scroll) =====
  const sections = document.querySelectorAll('.section:not(.hero-section)');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  sections.forEach(section => observer.observe(section));

  // ===== Accordion (FAQ) =====
  document.querySelectorAll('.accordion-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
    });
  });

  // ===== Video playback speed (matching original 0.5x) =====
  const video = document.querySelector('.hero-video');
  if (video) {
    video.addEventListener('loadedmetadata', () => {
      video.playbackRate = 0.5;
    });
  }
})();
