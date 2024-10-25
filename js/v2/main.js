document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor');
    const menu = document.querySelector('.menu');
    const menuButton = document.querySelector('.menu-toggle');
    
    // Convert "Menu" text to a button if it doesn't exist
    if (!menuButton) {
        const menuText = document.querySelector('div:contains("Menu")');
        if (menuText) {
            const button = document.createElement('button');
            button.className = 'menu-toggle';
            button.textContent = 'Menu';
            menuText.replaceWith(button);
        }
    }
    
    // Add menu toggle functionality
    document.querySelector('.menu-toggle')?.addEventListener('click', () => {
        menu?.classList.toggle('active');
    });

    // Close menu when clicking menu links
    const menuLinks = document.querySelectorAll('.menu-nav a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menu?.classList.remove('active');
        });
    });

    // Existing cursor code
    if (!cursor) {
        console.error('Cursor element not found');
        return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    function updateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(updateCursor);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    updateCursor();

    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
});