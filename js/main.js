document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor');
    
    if (!cursor) {
      console.error('Cursor element not found');
      return;
    }
  
    let cursorTimeout;
    
    document.addEventListener('mousemove', (e) => {
      if (!cursorTimeout) {
        cursorTimeout = setTimeout(() => {
          cursor.style.left = `${e.clientX}px`;
          cursor.style.top = `${e.clientY}px`;
          cursorTimeout = null;
        }, 16);
      }
    });
  
    const links = document.querySelectorAll('a, button');
    
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
      });
      
      link.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
      });
    });
  });