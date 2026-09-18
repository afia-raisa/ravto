/* ==========================================================================
   RAVTO - main.js
   Nav toggle · scroll state · back to top · scroll reveal
   Blog filter · contact form (mailto) · copy email · toast
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. Navbar — mobile toggle + scrolled state
     ------------------------------------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      navLinks.classList.toggle('is-open', !open);
    });

    // Close the mobile menu when a link is clicked
    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('is-open');
      });
    });
  }

  // Navbar shadow on scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------------
     2. Back to top
     ------------------------------------------------------------------------ */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    const toggleTop = () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 500);
    };
    toggleTop();
    window.addEventListener('scroll', toggleTop, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------------
     3. Scroll reveal
     Adds .is-visible to .process-row and .reveal elements when they
     come into view. Also works on cards / work / blog / statement / cta.
     ------------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll(
    '.process-row, .reveal, .card, .work-card, .blog-card, .statement, .cta-band, .section-head'
  );

  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback: show everything instantly
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------------------
     4. Blog category filter
     ------------------------------------------------------------------------ */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const blogCards     = document.querySelectorAll('.blog-card');

  if (filterButtons.length && blogCards.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterButtons.forEach((b) => {
          b.setAttribute('aria-pressed', String(b === btn));
        });

        blogCards.forEach((card) => {
          const show = filter === 'all' || card.dataset.category === filter;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     5. Contact form → mailto (no backend)
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = contactForm.querySelector('#cf-name')?.value.trim()    || '';
      const email   = contactForm.querySelector('#cf-email')?.value.trim()   || '';
      const message = contactForm.querySelector('#cf-message')?.value.trim() || '';

      if (!name || !email || !message) {
        showToast('Please fill in every field.');
        return;
      }

      const subject = `New project enquiry from ${name}`;
      const body    = `Name: ${name}\nEmail: ${email}\n\n${message}`;
      const mailto  = `mailto:contact.ravto@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      showToast('Opening your email client…');
      window.location.href = mailto;
    });
  }

  /* ------------------------------------------------------------------------
     6. Copy email to clipboard
     ------------------------------------------------------------------------ */
  const copyBtn = document.querySelector('[data-copy-email]');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = 'contact.ravto@gmail.com';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback for old browsers
          const ta = document.createElement('textarea');
          ta.value = email;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        showToast('Email copied to clipboard.');
      } catch (err) {
        showToast('Could not copy — please copy manually.');
      }
    });
  }

  /* ------------------------------------------------------------------------
     7. Toast helper (used by form + copy button)
     ------------------------------------------------------------------------ */
  let toastEl    = null;
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('is-visible');
    }, 2600);
  }

})();