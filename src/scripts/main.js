// src/scripts/main.js

document.addEventListener('DOMContentLoaded', () => {
  // --- Custom Cursor Logic ---
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Animação suave do cursor seguindo o mouse
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Efeitos do cursor ao passar por cima de elementos
  const interactables = document.querySelectorAll('a, button, .clickable');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

  // --- Header Scroll Effect ---
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('backdrop-blur-md', 'bg-black/10');
    } else {
      header.classList.remove('backdrop-blur-md', 'bg-black/10');
    }
  });

  // --- Image Switcher Logic ---
  window.changeHeroImage = function(newSrc, index) {
    const mainImg = document.getElementById('hero-main-img');
    const indicators = document.querySelectorAll('.indicator');
    
    // Fade out
    mainImg.style.opacity = '0';
    mainImg.style.filter = 'blur(10px)';
    
    setTimeout(() => {
      mainImg.src = newSrc;
      mainImg.onload = () => {
        // Fade in
        mainImg.style.opacity = '1';
        mainImg.style.filter = 'blur(0px)';
      };
    }, 500);

    // Update indicators
    indicators.forEach((ind, i) => {
      if (i === index) {
        ind.classList.add('text-white', 'opacity-100');
        ind.classList.remove('text-white/30', 'opacity-50');
      } else {
        ind.classList.remove('text-white', 'opacity-100');
        ind.classList.add('text-white/30', 'opacity-50');
      }
    });
  };
});
