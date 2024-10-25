document.addEventListener('DOMContentLoaded', () => {
    // Cursor functionality
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

    // Menu functionality
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

    // Interactive elements cursor effect
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

    // Video functionality
    function initializeVideo(section) {
        const video = document.createElement('video');
        video.className = 'fullscreen-video';
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        
        // Set the source based on section id
        const videoSource = document.createElement('source');
        videoSource.type = 'video/mp4';
        videoSource.src = `videos/${section.id.toLowerCase()}.mp4`;
        
        video.appendChild(videoSource);
        section.insertBefore(video, section.firstChild);
        
        // Play video when it's loaded
        video.addEventListener('loadeddata', () => {
            video.play().catch(err => {
                console.error(`Error playing video for ${section.id}:`, err);
            });
        });
    }

    // Initialize videos for sections that need them
    const videoSections = ['hero']; // Add section IDs that should have videos
    videoSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            initializeVideo(section);
        }
    });

    // Replace or update the slideshow initialization code in main.js
const slideshowSections = {
    "FarmersDaughters": [
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
        'images/farmers-daughters/fd (15).jpg'
    ]
};

function initializeSlideshows() {
    Object.entries(slideshowSections).forEach(([sectionId, images]) => {
        const section = document.getElementById(sectionId);
        if (!section) {
            console.error(`Section with ID ${sectionId} not found`);
            return;
        }

        const slideshowContainer = section.querySelector('.slideshow-container');
        if (!slideshowContainer) {
            console.error(`Slideshow container not found in section ${sectionId}`);
            return;
        }

        // Clear any existing content
        slideshowContainer.innerHTML = '';

        // Create and append images
        images.forEach((src, index) => {
            const img = document.createElement('div');
            img.className = `slideshow-image ${index === 0 ? 'active' : ''}`;
            img.style.backgroundImage = `url(${src})`;
            slideshowContainer.appendChild(img);
        });

        let currentImageIndex = 0;
        const totalImages = images.length;

        function nextImage() {
            const currentImage = slideshowContainer.querySelector('.slideshow-image.active');
            if (currentImage) {
                currentImage.classList.remove('active');
            }

            currentImageIndex = (currentImageIndex + 1) % totalImages;
            const nextImage = slideshowContainer.children[currentImageIndex];
            if (nextImage) {
                nextImage.classList.add('active');
            }
        }

        // Start the slideshow
        setInterval(nextImage, 5000);
    });
}

// Call this function when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSlideshows();
});

    // Scroll animation functionality (optional)
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        root: null,
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelector('.section-content')?.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});