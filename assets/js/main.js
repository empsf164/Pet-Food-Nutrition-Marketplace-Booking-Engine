/* ==========================================================================
   NOURIPET — MAIN APPLICATION SCRIPT
   Navigation, Mobile Menu, GSAP Micro-Interactions, Filters
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. NAVBAR SCROLL EFFECT
  // ------------------------------------------------------------------------
  const navbar = document.querySelector('.np-navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ------------------------------------------------------------------------
  // 2. MOBILE MENU & ACCESSIBILITY (ESC & CLICK OUTSIDE)
  // ------------------------------------------------------------------------
  const mobileToggle = document.querySelector('.np-mobile-toggle');
  const mobileMenu = document.querySelector('.np-mobile-menu');
  const mobileBackdrop = document.querySelector('.np-mobile-backdrop');
  const mobileClose = document.querySelector('.np-mobile-close');

  function openMobileMenu() {
    if (mobileMenu && mobileBackdrop) {
      mobileMenu.classList.add('open');
      mobileBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (mobileClose) mobileClose.focus();
    }
  }

  function closeMobileMenu() {
    if (mobileMenu && mobileBackdrop) {
      mobileMenu.classList.remove('open');
      mobileBackdrop.classList.remove('open');
      document.body.style.overflow = '';
      if (mobileToggle) mobileToggle.focus();
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      openMobileMenu();
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileMenu();
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // Mobile Dropdown Accordion
  const mobileDropdownTriggers = document.querySelectorAll('.np-mobile-dropdown-toggle');
  mobileDropdownTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = trigger.closest('.np-mobile-nav-item');
      if (parent) {
        parent.classList.toggle('expanded');
        const icon = trigger.querySelector('.bi-chevron-down');
        if (icon) {
          icon.style.transform = parent.classList.contains('expanded') ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      }
    });
  });

  // ------------------------------------------------------------------------
  // 3. HIGHLIGHT CURRENT ACTIVE NAV LINK
  // ------------------------------------------------------------------------
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.np-nav-link, .np-dropdown-item, .np-mobile-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  // ------------------------------------------------------------------------
  // 4. GSAP MICRO-INTERACTIONS (Smooth Entrance)
  // ------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && typeof gsap !== 'undefined') {
    // Hero entrance
    if (document.querySelector('.hero-headline')) {
      gsap.from('.hero-headline', { opacity: 0, y: 30, duration: 0.8, ease: 'power2.out' });
      gsap.from('.hero-subtext', { opacity: 0, y: 20, duration: 0.8, delay: 0.2, ease: 'power2.out' });
      gsap.from('.hero-cta-group', { opacity: 0, y: 20, duration: 0.7, delay: 0.35, ease: 'power2.out' });
      gsap.from('.floating-search-bar', { opacity: 0, y: 25, duration: 0.8, delay: 0.45, ease: 'power2.out' });
      gsap.from('.hero-image-wrapper', { opacity: 0, scale: 0.96, duration: 1, delay: 0.2, ease: 'power2.out' });
    }

    // Cards reveal
    const cards = document.querySelectorAll('.service-card, .host-card, .step-item');
    if (cards.length > 0 && typeof ScrollTrigger !== 'undefined') {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: cards[0],
          start: 'top 85%'
        },
        opacity: 0,
        y: 35,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out'
      });
    }
  }

  // ------------------------------------------------------------------------
  // 5. PET NUTRITION EXPLORER TABS (CATEGORY FILTERING)
  // ------------------------------------------------------------------------
  const filterPills = document.querySelectorAll('.filter-pill[data-filter]');
  const filterItems = document.querySelectorAll('[data-category]');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const targetCategory = pill.getAttribute('data-filter');

      filterItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (targetCategory === 'all' || itemCat === targetCategory || (itemCat && itemCat.includes(targetCategory))) {
          item.style.display = '';
          if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
            gsap.fromTo(item, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35 });
          }
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ------------------------------------------------------------------------
  // 6. HERO QUICK SEARCH FORM
  // ------------------------------------------------------------------------
  const heroSearchForm = document.getElementById('heroSearchForm');
  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const petType = document.getElementById('searchPetType')?.value || 'all';
      const serviceType = document.getElementById('searchServiceType')?.value || 'all';
      const location = document.getElementById('searchLocation')?.value || '';
      window.location.href = `marketplace.html?pet=${encodeURIComponent(petType)}&service=${encodeURIComponent(serviceType)}&loc=${encodeURIComponent(location)}`;
    });
  }

  // ------------------------------------------------------------------------
  // 7. NEWSLETTER FORM (DEMO SUBMIT)
  // ------------------------------------------------------------------------
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const feedback = document.getElementById('newsletterFeedback');
      if (input && input.value) {
        if (feedback) {
          feedback.innerHTML = `<span class="text-success"><i class="bi bi-check-circle-fill me-1"></i> Thank you! You're subscribed to our weekly pet nutrition guide.</span>`;
          input.value = '';
        }
      }
    });
  }
});
