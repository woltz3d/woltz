document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.querySelector('.custom-cursor');
  if (!cursor) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const interactables = document.querySelectorAll('a, button, .clickable, img[onclick]');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  // Troca de imagem do hero
  window.changeHeroImage = function(newSrc, index) {
    const mainImg = document.getElementById('hero-main-img');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const indicator = document.getElementById('image-indicator');
    if (!mainImg) return;

    mainImg.style.opacity = '0';
    mainImg.style.filter = 'blur(15px) scale(1.05)';

    setTimeout(() => {
      mainImg.src = newSrc;
      mainImg.onload = () => {
        mainImg.style.opacity = '1';
        mainImg.style.filter = 'blur(0px) scale(1)';
      };
    }, 500);

    thumbnails.forEach((thumb, i) => {
      if (i === index) {
        thumb.classList.add('border-white/70', 'opacity-100');
        thumb.classList.remove('border-transparent', 'opacity-40');
      } else {
        thumb.classList.remove('border-white/70', 'opacity-100');
        thumb.classList.add('border-transparent', 'opacity-40');
      }
    });

    if (indicator) {
      indicator.textContent = `0${index + 1} — 07`;
    }
  };
});
