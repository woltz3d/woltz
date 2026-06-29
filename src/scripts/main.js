document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.querySelector('.custom-cursor');
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const interactables = document.querySelectorAll('a, button, .clickable');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  document.addEventListener('mousedown', () => cursor.classList.add('hovering'));
  document.addEventListener('mouseup', () => cursor.classList.remove('hovering'));

  window.changeHeroImage = function(newSrc, index) {
    const mainImg = document.getElementById('hero-main-img');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const indicator = document.getElementById('image-indicator');
    
    mainImg.style.opacity = '0';
    mainImg.style.filter = 'blur(10px)';
    
    setTimeout(() => {
      mainImg.src = newSrc;
      mainImg.onload = () => {
        mainImg.style.opacity = '1';
        mainImg.style.filter = 'blur(0px)';
      };
    }, 400);

    thumbnails.forEach((thumb, i) => {
      if (i === index) {
        thumb.classList.add('border-white/60', 'opacity-100');
        thumb.classList.remove('border-transparent', 'opacity-50');
      } else {
        thumb.classList.remove('border-white/60', 'opacity-100');
        thumb.classList.add('border-transparent', 'opacity-50');
      }
    });

    if (indicator) {
      indicator.textContent = `0${index + 1} — 07`;
    }
  };
});
