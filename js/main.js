/* ==========================================================================
   SHAHJI PRINTERS - Main Interactive JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Navigation on Scroll
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('is-sticky');
    } else {
      header.classList.remove('is-sticky');
    }
  });

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

    // Close menu when clicking outside
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
    } else {
      link.classList.remove('active');
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
  // Printing Process Modal Pop-up Logic
  const processModal = document.getElementById('processModal');
  const openProcessModalBtns = document.querySelectorAll('.open-process-modal');
  const closeProcessModalBtns = document.querySelectorAll('.close-process-modal');

  if (processModal) {
    openProcessModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        processModal.classList.add('active');
      });
    });

    closeProcessModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        processModal.classList.remove('active');
      });
    });

    processModal.addEventListener('click', (e) => {
      if (e.target === processModal) {
        processModal.classList.remove('active');
      }
    });
  }

  // 5. Quote Form & Quick Message Form Simulation
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your quote request has been submitted successfully. Our Shahji Printers representative will contact you within 2 hours.');
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
});
