// Custom cursor
const cursor = document.querySelector('.cursor');
const links = document.querySelectorAll('a, button');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
    });
    
    link.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
    });
});

// Menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const menuLinks = document.querySelectorAll('.menu-nav a');

menuToggle.addEventListener('click', () => {
    menu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

menuLinks.forEach((link, index) => {
    link.style.transitionDelay = `${0.1 * index}s`;
    
    link.addEventListener('click', () => {
        menu.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Video lazy loading
const videos = document.querySelectorAll('.fullscreen-video');

const videoOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const videoObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const video = entry.target;
            video.play();
        } else {
            const video = entry.target;
            video.pause();
        }
    });
}, videoOptions);

videos.forEach(video => {
    videoObserver.observe(video);
});
