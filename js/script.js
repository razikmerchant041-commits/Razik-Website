/* ==========================================================================
   SHAHJI PRINTERS - Core Scripts & Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 0. 2-Second Welcome Screen Animation Handler (Only on initial website open)
  const initWelcomeScreen = () => {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const isHomePage = (currentPath === '' || currentPath === 'index.html');
    const alreadyShown = sessionStorage.getItem('shahji_welcome_shown');
    const welcomeScreen = document.getElementById('welcome-screen');

    // If not on homepage or animation was already shown in this session, do not show
    if (!isHomePage || alreadyShown) {
      if (welcomeScreen) {
        welcomeScreen.style.display = 'none';
        welcomeScreen.style.pointerEvents = 'none';
      }
      return;
    }

    // Mark welcome animation as shown for this browser session
    sessionStorage.setItem('shahji_welcome_shown', 'true');

    if (welcomeScreen) {
      // Hide display completely after exactly 2 seconds (2000ms)
      setTimeout(() => {
        welcomeScreen.style.display = 'none';
        welcomeScreen.style.pointerEvents = 'none';
      }, 2000);
    }
  };

  initWelcomeScreen();

  // 1. Sticky Header Navigation on Scroll
  const header = document.querySelector('.site-header');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      if (header) header.classList.add('is-sticky');
    } else {
      if (header) header.classList.remove('is-sticky');
    }

    // Scroll to Top Button Visibility
    if (scrollTopBtn) {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('is-active');
      } else {
        scrollTopBtn.classList.remove('is-active');
      }
    }
  });

  // Scroll to Top Smooth Click
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2. Mobile Navigation Toggle Drawer
  const mobileToggleBtn = document.querySelector('.mobile-nav-toggle');
  const navList = document.querySelector('.nav-list');

  if (mobileToggleBtn && navList) {
    mobileToggleBtn.addEventListener('click', () => {
      navList.classList.toggle('active');
      const icon = mobileToggleBtn.querySelector('i');
      if (icon) {
        if (navList.classList.contains('active')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (!navList.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
        navList.classList.remove('active');
        const icon = mobileToggleBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });
  }

  // 3. Active Page Navigation Link Highlight
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 4. "Get a Quote" Modal Pop-up Logic
  const quoteModal = document.getElementById('quoteModal');
  const openModalBtns = document.querySelectorAll('.open-quote-modal');
  const closeModalBtn = document.querySelector('.modal-close-btn');

  if (quoteModal) {
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        quoteModal.classList.add('active');
      });
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        quoteModal.classList.remove('active');
      });
    }

    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) {
        quoteModal.classList.remove('active');
      }
    });
  // Printing Process Modal Global Delegated Click Handler
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('#openProcessModal, .open-process-modal');
    if (trigger) {
      e.preventDefault();
      const modal = document.getElementById('processModal');
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      return;
    }

    const closeBtn = e.target.closest('#closeProcessModalBtn, .close-process-modal');
    const modal = document.getElementById('processModal');
    if (closeBtn && modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      return;
    }

    if (modal && e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // 5. Forms Submission Simulation
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your quote request has been submitted successfully. Our Shahji Printers team will contact you within 2 hours.');
      quoteForm.reset();
      if (quoteModal) quoteModal.classList.remove('active');
    });
  }

  const footerForm = document.getElementById('footerMsgForm');
  if (footerForm) {
    footerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for reaching out to Shahji Printers! We have received your message.');
      footerForm.reset();
    });
  }

  // 6. Scroll Reveal Animation via IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // 7. Owner Secret Shortcut for Admin Portal Access (Ctrl + Shift + A)
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      window.location.href = 'admin-orders.html';
    }
  });

  // Footer Copyright Triple-Click Secret Shortcut
  const copyrightBars = document.querySelectorAll('.copyright-bar, footer div:last-child');
  copyrightBars.forEach(el => {
    let clicks = 0;
    let timer = null;
    el.addEventListener('click', () => {
      clicks++;
      if (clicks === 3) {
        window.location.href = 'admin-orders.html';
        clicks = 0;
      }
      clearTimeout(timer);
      timer = setTimeout(() => { clicks = 0; }, 1000);
    });
  });
});
