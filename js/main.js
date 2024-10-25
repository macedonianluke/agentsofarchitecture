// Menu toggle functionality
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const menuLinks = document.querySelectorAll('.menu-content a'); // Updated selector to match your HTML structure

menuToggle?.addEventListener('click', () => {
    menu?.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

// Smooth scrolling for anchor links
menuLinks.forEach((link, index) => {
    // Add transition delay for menu animation
    link.style.transitionDelay = `${0.1 * index}s`;
    
    // Handle click events
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get the target section id from the href
        const targetId = link.getAttribute('href')?.replace('#', '');
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            // Close the menu
            menu?.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Scroll to the section
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Custom cursor update
const cursor = document.querySelector('.cursor');
const links = document.querySelectorAll('a, button');

document.addEventListener('mousemove', (e) => {
    cursor?.style.left = e.clientX + 'px';
    cursor?.style.top = e.clientY + 'px';
});

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor?.classList.add('hover');
    });
    
    link.addEventListener('mouseleave', () => {
        cursor?.classList.remove('hover');
    });
});