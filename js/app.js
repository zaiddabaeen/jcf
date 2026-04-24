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
  // It's more important that sections are visible than that they animate,
  // so we have multiple safety nets to guarantee `.visible` is added.
  const sections = document.querySelectorAll('.section:not(.hero-section)');

  function revealAll() {
    sections.forEach(s => s.classList.add('visible'));
  }

  if (!('IntersectionObserver' in window)) {
    // No IO support — just show everything immediately.
    revealAll();
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      // Use a 0 threshold so even partially-visible sections trigger,
      // and a positive bottom rootMargin so sections just below the fold
      // also reveal early.
      threshold: 0,
      rootMargin: '0px 0px 100px 0px'
    });

    sections.forEach(section => observer.observe(section));

    // Safety net 1: after the page settles, force-reveal anything still hidden
    // that's already within (or above) the viewport. Covers cases where the
    // observer doesn't fire due to layout shifts, zero-size at init, etc.
    function revealInViewport() {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      sections.forEach(s => {
        if (s.classList.contains('visible')) return;
        const rect = s.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          s.classList.add('visible');
        }
      });
    }
    window.addEventListener('load', revealInViewport);
    setTimeout(revealInViewport, 300);

    // Safety net 2: after a longer delay, just reveal everything no matter what.
    // Visibility of content is more important than the animation.
    setTimeout(revealAll, 2000);
  }

  // ===== Accordion (FAQ) =====
  document.querySelectorAll('.accordion-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
    });
  });

  // ===== Carousel =====
  const carousel = document.getElementById('history-carousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    let currentIndex = 0;

    function getSlidesPerView() {
      if (window.innerWidth < 600) return 1;
      if (window.innerWidth < 1025) return 2;
      return 3;
    }

    function getMaxIndex() {
      return Math.max(0, slides.length - getSlidesPerView());
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      const totalPages = getMaxIndex() + 1;
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updatePosition() {
      const gap = 20;
      const perView = getSlidesPerView();
      const wrapperWidth = carousel.querySelector('.carousel-track-wrapper').offsetWidth;
      const slideWidth = (wrapperWidth - gap * (perView - 1)) / perView;
      const offset = currentIndex * (slideWidth + gap);
      track.style.transform = 'translateX(-' + offset + 'px)';

      // Update dots
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    }

    function goTo(idx) {
      currentIndex = Math.max(0, Math.min(idx, getMaxIndex()));
      updatePosition();
    }

    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    // Touch / swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    track.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goTo(currentIndex + 1);
        else goTo(currentIndex - 1);
      }
    });

    buildDots();
    updatePosition();
    window.addEventListener('resize', () => {
      if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
      buildDots();
      updatePosition();
    });
  }

  // ===== Video playback speed (matching original 0.5x) =====
  const video = document.querySelector('.hero-video');
  if (video) {
    video.addEventListener('loadedmetadata', () => {
      video.playbackRate = 0.5;
    });
  }
})();
