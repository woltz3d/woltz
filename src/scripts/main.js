// Cursor simples e funcional
document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.getElementById('cursor');
  
  if (!cursor) {
    console.log('Cursor element not found');
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

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

  // Efeito hover
  const clickables = document.querySelectorAll('a, button, [onclick]');
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '60px';
      cursor.style.height = '60px';
      cursor.style.backgroundColor = 'rgba(255,255,255,0.1)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '24px';
      cursor.style.height = '24px';
      cursor.style.backgroundColor = 'transparent';
    });
  });

  // Troca de imagem
  window.changeHeroImage = function(newSrc, index) {
    const mainImg = document.getElementById('hero-main-img');
    const indicator = document.getElementById('image-indicator');
    
    if (mainImg) {
      mainImg.style.transition = 'opacity 0.5s ease, filter 0.5s ease';
      mainImg.style.opacity = '0';
      mainImg.style.filter = 'blur(10px)';
      
      setTimeout(() => {
        mainImg.src = newSrc;
        mainImg.style.opacity = '1';
        mainImg.style.filter = 'blur(0px)';
      }, 500);
    }
    
    if (indicator) {
      indicator.textContent = `0${index + 1} — 07`;
    }
    
    console.log('Image changed to:', index + 1);
  };
});
