// Debug utility function
function debug(message, type = 'log') {
    const styles = {
        log: 'color: #2196F3',
        error: 'color: #F44336',
        warn: 'color: #FF9800',
        success: 'color: #4CAF50'
    };
    
    console[type](`%c[Debug] ${message}`, styles[type]);
}

document.addEventListener('DOMContentLoaded', () => {
    debug('DOM Content Loaded', 'success');

    // Cursor functionality
    const cursor = document.querySelector('.cursor');
    
    if (!cursor) {
        debug('Cursor element not found', 'error');
        return;
    }
    debug('Cursor element found', 'success');

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
    debug('Cursor initialization complete', 'success');

    // Menu functionality
    const menuButton = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    
    if (menuButton && menu) {
        debug('Menu elements found', 'success');
        menuButton.addEventListener('click', () => {
            menu.classList.toggle('active');
            menuButton.textContent = menu.classList.contains('active') ? 'Close' : 'Menu';
            debug(`Menu ${menu.classList.contains('active') ? 'opened' : 'closed'}`);
        });

        const menuLinks = document.querySelectorAll('.menu-nav a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                menuButton.textContent = 'Menu';
                debug('Menu link clicked, menu closed');
            });
        });
    } else {
        debug('Menu elements not found', 'error');
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
    debug('Interactive elements initialized', 'success');

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    // Video functionality
    function initializeVideo(section) {
        debug(`Initializing video for section: ${section.id}`);
        const video = document.createElement('video');
        video.className = 'fullscreen-video';
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        
        const videoSource = document.createElement('source');
        videoSource.type = 'video/mp4';
        videoSource.src = `videos/${section.id.toLowerCase()}.mp4`;
        
        video.appendChild(videoSource);
        section.insertBefore(video, section.firstChild);
        
        video.addEventListener('loadeddata', () => {
            video.play().catch(err => {
                debug(`Error playing video for ${section.id}: ${err}`, 'error');
            });
            debug(`Video loaded and playing for ${section.id}`, 'success');
        });
    }

    // Initialize videos
    const videoSections = ['hero'];
    videoSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            initializeVideo(section);
            debug(`Video section found: ${sectionId}`, 'success');
        } else {
            debug(`Video section not found: ${sectionId}`, 'error');
        }
    });

    // Slideshow functionality
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

    // Initialize slideshows
    Object.entries(slideshowSections).forEach(([sectionId, images]) => {
        debug(`Starting slideshow initialization for ${sectionId}`);
        
        const section = document.getElementById(sectionId);
        if (!section) {
            debug(`Section #${sectionId} not found!`, 'error');
            return;
        }
        debug(`Found section #${sectionId}`, 'success');

        const slideshowContainer = section.querySelector('.slideshow-container');
        if (!slideshowContainer) {
            debug(`Slideshow container not found in #${sectionId}!`, 'error');
            debug(`Section HTML: ${section.innerHTML}`, 'warn');
            return;
        }
        debug(`Found slideshow container`, 'success');

        // Clear container
        slideshowContainer.innerHTML = '';
        debug(`Cleared slideshow container`);

        // Create and append images
        images.forEach((src, index) => {
            debug(`Creating image ${index + 1}: ${src}`);
            
            // Test image loading
            const testImg = new Image();
            testImg.onload = () => debug(`Image loaded successfully: ${src}`, 'success');
            testImg.onerror = () => debug(`Failed to load image: ${src}`, 'error');
            testImg.src = src;

            const img = document.createElement('div');
            img.className = `slideshow-image ${index === 0 ? 'active' : ''}`;
            img.style.backgroundImage = `url(${src})`;
            slideshowContainer.appendChild(img);
        });

        debug(`Created ${images.length} slideshow images`);

        let currentImageIndex = 0;
        const totalImages = images.length;

        function nextImage() {
            const currentImage = slideshowContainer.querySelector('.slideshow-image.active');
            if (currentImage) {
                currentImage.classList.remove('active');
                debug(`Deactivated image ${currentImageIndex}`);
            }

            currentImageIndex = (currentImageIndex + 1) % totalImages;
            const nextImage = slideshowContainer.children[currentImageIndex];
            if (nextImage) {
                nextImage.classList.add('active');
                debug(`Activated image ${currentImageIndex}`);
            }
        }

        // Start the slideshow
        const slideshowInterval = setInterval(nextImage, 5000);
        debug(`Started slideshow interval for ${sectionId}`, 'success');
        
        // Update debug overlay if it exists
        const debugOverlay = document.getElementById('debug-overlay');
        if (debugOverlay) {
            document.getElementById('debug-section').textContent = '✓';
            document.getElementById('debug-container').textContent = '✓';
            document.getElementById('debug-images').textContent = images.length;
        }
    });

    // Scroll animation functionality
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        root: null,
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const content = entry.target.querySelector('.section-content');
                if (content) {
                    content.classList.add('visible');
                    debug(`Section content visible: ${entry.target.id}`, 'success');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
        debug(`Observing section: ${section.id}`);
    });

    debug('All initializations complete', 'success');
});