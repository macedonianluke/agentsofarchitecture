// Menu toggle functionality
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const menuLinks = document.querySelectorAll('.menu-content a');

menuToggle?.addEventListener('click', () => {
    menu?.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

// Smooth scrolling for anchor links
menuLinks.forEach((link, index) => {
    link.style.transitionDelay = `${0.1 * index}s`;
    
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get the target section id from the href, removing any encoded characters
        const targetId = link.getAttribute('href')?.replace('#', '').replace(/%20/g, '');
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
        } else {
            console.warn(`Section with id "${targetId}" not found`);
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