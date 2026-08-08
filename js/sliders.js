/* ==========================================================================
   SHAHJI PRINTERS - Machinery & Testimonials Sliders Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Dots pagination for Machinery section
  const dots = document.querySelectorAll('.slider-dots .dot');
  const machineryGrid = document.querySelector('.machinery-grid');

  if (dots.length > 0 && machineryGrid) {
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');

        // Scroll or transition highlight effect
        machineryGrid.style.opacity = '0.4';
        setTimeout(() => {
          machineryGrid.style.opacity = '1';
        }, 150);
      });
    });
  }
});
