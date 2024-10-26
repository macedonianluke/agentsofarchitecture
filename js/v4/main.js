// Debug utility function
function debug(message, type = 'log') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const styles = {
            log: 'color: #2196F3',
            error: 'color: #F44336',
            warn: 'color: #FF9800',
            success: 'color: #4CAF50'
        };
        console[type](`%c[Debug] ${message}`, styles[type]);
    }
}

// Slideshow initialization function
function initializeSlideshow(sectionId, images) {
    debug(`Initializing slideshow for ${sectionId}`);
    
    const section = document.getElementById(sectionId);
    if (!section) {
        debug(`Section #${sectionId} not found!`, 'error');
        return;
    }

    const slideshowContainer = section.querySelector('.slideshow-container');
    if (!slideshowContainer) {
        debug(`Slideshow container not found in #${sectionId}!`, 'error');
        return;
    }

    // Clear existing content
    slideshowContainer.innerHTML = '';

    // Preload images
    const imagePromises = images.map(src => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                debug(`Image loaded: ${src}`, 'success');
                resolve(src);
            };
            img.onerror = () => {
                debug(`Failed to load image: ${src}`, 'error');
                reject(new Error(`Failed to load ${src}`));
            };
            img.src = src;
        });
    });

    // Create slideshow once images are loaded
    Promise.allSettled(imagePromises).then(results => {
        const loadedImages = results
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);

        if (loadedImages.length === 0) {
            debug('No images loaded successfully', 'error');
            return;
        }

        debug(`${loadedImages.length} images loaded successfully`, 'success');

        // Create slideshow elements
        loadedImages.forEach((src, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = `slideshow-image ${index === 0 ? 'active' : ''}`;
            slideDiv.style.backgroundImage = `url('${src}')`;
            slideshowContainer.appendChild(slideDiv);
        });

        // Initialize slideshow controls
        let currentIndex = 0;
        const slides = slideshowContainer.querySelectorAll('.slideshow-image');

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        }

        // Start slideshow
        const intervalId = setInterval(nextSlide, 5000);

        // Cleanup on section leave
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    clearInterval(intervalId);
                }
            });
        }, { threshold: 0 });

        observer.observe(section);
    });
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    debug('DOM Content Loaded', 'success');

    // Cursor functionality
    const cursor = document.querySelector('.cursor');
    
    if (!cursor) {
        debug('Cursor element not found', 'error');
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
        });
    }

    // Initialize videos
    const videoSections = ['hero'];
    videoSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            initializeVideo(section);
        }
    });

    // Initialize slideshows
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

    Object.entries(slideshowSections).forEach(([sectionId, images]) => {
        initializeSlideshow(sectionId, images);
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
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});