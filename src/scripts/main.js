document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.getElementById('cursor');
  
  if (!cursor) {
    console.error('Cursor element not found!');
    return;
  }

  // Posição inicial do cursor (centro da tela)
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  // Atualiza posição do mouse constantemente
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
  
  // Inicia a animação imediatamente
  animateCursor();

  // Adiciona classe "hover" quando passa por elementos interativos
  const clickables = document.querySelectorAll('a, button, [onclick], .clickable, img[onclick]');
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.remove('normal');
      cursor.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursor.classList.add('normal');
    });
  });

  // Troca de imagem do hero
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
  };
});
