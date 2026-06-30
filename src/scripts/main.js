document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.getElementById('cursor');
  
  if (!cursor) {
    console.error(' Cursor element not found!');
    return;
  }
  
  console.log('✅ Cursor initialized');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  // Rastreia movimento do mouse
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Animação suave
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();

  // Efeito hover em elementos interativos
  const clickables = document.querySelectorAll('a, button, [onclick], .clickable');
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '60px';
      cursor.style.height = '60px';
      cursor.style.borderColor = 'rgba(255, 255, 255, 0.9)';
      cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '24px';
      cursor.style.height = '24px';
      cursor.style.borderColor = 'rgba(255, 255, 255, 0.7)';
      cursor.style.backgroundColor = 'transparent';
    });
  });

  // Troca de imagem
  window.changeHeroImage = function(newSrc, index) {
    const mainImg = document.getElementById('hero-main-img');
    const indicator = document.getElementById('image-indicator');
    
    if (mainImg) {
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
  };
});
