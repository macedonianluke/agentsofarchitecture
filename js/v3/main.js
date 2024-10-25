document.addEventListener('DOMContentLoaded', () => {
    // Original cursor code
    const cursor = document.querySelector('.cursor');
    
    if (!cursor) {
        console.error('Cursor element not found');
        return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let isHovering = false;

    function updateCursor() {
        const smoothing = isHovering ? 0.35 : 0.25;
        
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * smoothing;
        cursorY += dy * smoothing;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(updateCursor);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    updateCursor();

    // Original menu code
    const menuButton = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    
    if (menuButton && menu) {
        menuButton.addEventListener('click', () => {
            menu.classList.toggle('active');
            menuButton.textContent = menu.classList.contains('active') ? 'Close' : 'Menu';
        });

        const menuLinks = document.querySelectorAll('.menu-nav a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                menuButton.textContent = 'Menu';
            });
        });
    }

    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            isHovering = true;
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            isHovering = false;
        });
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    // New Slideshow Functionality
    const slideshowSections = {
        "Farmer'sDaughters": [
            'images/farmers-daughters/fd (1).jpg',
            'images/farmers-daughters/fd (2).jpg',
            'images/farmers-daughters/fd (3).jpg',
            'images/farmers-daughters/fd (4).jpg',
            'images/farmers-daughters/fd (5).jpg',
            'images/farmers-daughters/fd (6).jpg',
            'images/farmers-daughters/fd (7).jpg',
            'images/farmers-daughters/fd (8).jpg',
            'images/farmers-daughters/fd (9).jpg',
            'images/farmers-daughters/fd (10).jpg',
            'images/farmers-daughters/fd (11).jpg',
            'images/farmers-daughters/fd (12).jpg',
            'images/farmers-daughters/fd (13).jpg',
            'images/farmers-daughters/fd (14).jpg',
            'images/farmers-daughters/fd (15).jpg',
            
        ],
        "Farmer'sDaughtersVictoria": [
            'images/farmers-daughters-victoria/1.jpg',
            'images/farmers-daughters-victoria/2.jpg',
            'images/farmers-daughters-victoria/3.jpg',
            'images/farmers-daughters-victoria/4.jpg'
        ]
        // Add more sections as needed
    };

    // Initialize slideshows for specified sections
    Object.entries(slideshowSections).forEach(([sectionId, images]) => {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const slideshowContainer = section.querySelector('.slideshow-container');
        if (!slideshowContainer) return;

        // Create and append images
        images.forEach((src, index) => {
            const img = document.createElement('div');
            img.className = `slideshow-image ${index === 0 ? 'active' : ''}`;
            img.style.backgroundImage = `url(${src})`;
            slideshowContainer.appendChild(img);
        });

        let currentImageIndex = 0;

        function nextImage() {
            const currentImage = slideshowContainer.querySelector('.slideshow-image.active');
            const nextIndex = (currentImageIndex + 1) % images.length;
            const nextImage = slideshowContainer.querySelectorAll('.slideshow-image')[nextIndex];

            currentImage?.classList.remove('active');
            nextImage?.classList.add('active');
            
            currentImageIndex = nextIndex;
        }

        // Change image every 5 seconds
        setInterval(nextImage, 5000);
    });
});