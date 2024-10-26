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

// Image preloader with priority handling
function preloadImages(sectionId, images) {
    debug(`Starting image preload for ${sectionId}`, 'log');
    
    return new Promise((resolve) => {
        // Load first image with high priority
        const firstImage = new Image();
        firstImage.loading = "eager";
        firstImage.onload = () => {
            debug(`Priority image loaded for ${sectionId}`, 'success');
            // Start loading remaining images
            const remainingImages = images.slice(1).map(src => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.loading = "lazy";
                    img.onload = () => {
                        debug(`Lazy loaded: ${src}`, 'success');
                        resolve(src);
                    };
                    img.onerror = () => {
                        debug(`Failed to load: ${src}`, 'error');
                        resolve(null);
                    };
                    img.src = src;
                });
            });
            
            Promise.all(remainingImages).then(results => {
                const loadedCount = results.filter(Boolean).length + 1; // +1 for priority image
                debug(`Completed loading ${loadedCount}/${images.length} images for ${sectionId}`, 'success');
                resolve(results);
            });
        };
        firstImage.src = images[0];
    });
}

// Enhanced slideshow initialization
function initializeSlideshow(sectionId, images) {
    debug(`Initializing slideshow for ${sectionId}`, 'log');
    
    const section = document.getElementById(sectionId);
    if (!section) {
        debug(`Section #${sectionId} not found`, 'error');
        return;
    }

    const slideshowContainer = section.querySelector('.slideshow-container');
    if (!slideshowContainer) {
        debug(`Slideshow container not found in #${sectionId}`, 'error');
        return;
    }

    // Clear existing content
    slideshowContainer.innerHTML = '';
    
    // Create loading indicator
    const loader = document.createElement('div');
    loader.className = 'slideshow-loader';
    slideshowContainer.appendChild(loader);

    // Preload images
    preloadImages(sectionId, images).then(() => {
        // Remove loader
        loader.remove();
        
        // Create slideshow
        images.forEach((src, index) => {
            const slide = document.createElement('div');
            slide.className = `slideshow-image ${index === 0 ? 'active' : ''}`;
            slide.style.backgroundImage = `url('${src}')`;
            slideshowContainer.appendChild(slide);
        });

        // Initialize slideshow controls
        let currentIndex = 0;
        const slides = slideshowContainer.querySelectorAll('.slideshow-image');
        let isPlaying = true;
        let slideInterval;

        function nextSlide() {
            slides[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % slides.length;
            slides[currentIndex].classList.add('active');
            debug(`Changed to slide ${currentIndex + 1} in ${sectionId}`, 'log');
        }

        function startSlideshow() {
            if (!isPlaying) {
                isPlaying = true;
                slideInterval = setInterval(nextSlide, 5000);
                debug(`Started slideshow for ${sectionId}`, 'success');
            }
        }

        function pauseSlideshow() {
            if (isPlaying) {
                isPlaying = false;
                clearInterval(slideInterval);
                debug(`Paused slideshow for ${sectionId}`, 'log');
            }
        }

        // Start slideshow
        startSlideshow();

        // Pause when not visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startSlideshow();
                } else {
                    pauseSlideshow();
                }
            });
        }, {
            threshold: 0.3
        });

        observer.observe(section);
    });
}

// Initialize video with optimizations
function initializeVideo(section) {
    debug(`Initializing video for section: ${section.id}`, 'log');
    
    const video = document.createElement('video');
    video.className = 'fullscreen-video';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata"; // Only preload metadata initially
    
    const source = document.createElement('source');
    source.type = 'video/mp4';
    const videoPath = `videos/${section.id.toLowerCase()}.mp4`;
    source.src = videoPath;
    
    video.appendChild(source);
    section.insertBefore(video, section.firstChild);
    
    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.preload = "auto"; // Start loading when in view
                video.play().catch(err => {
                    debug(`Error playing video: ${err}`, 'error');
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    observer.observe(section);
    
    video.addEventListener('loadeddata', () => {
        debug(`Video loaded for ${section.id}`, 'success');
    });
    
    video.addEventListener('error', () => {
        debug(`Failed to load video for ${section.id}`, 'error');
    });
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    debug('Starting initialization', 'log');

    // Initialize cursor
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        debug('Initializing cursor', 'log');
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let isHovering = false;

        function updateCursor() {
            const smoothing = isHovering ? 0.35 : 0.25;
            cursorX += (mouseX - cursorX) * smoothing;
            cursorY += (mouseY - cursorY) * smoothing;
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            requestAnimationFrame(updateCursor);
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        updateCursor();
    }

    // Initialize menu and connect button
    const menuButton = document.querySelector('.menu-toggle');
    const connectButton = document.querySelector('.connect-button');
    const menu = document.querySelector('.menu');
    
    if (menuButton && menu) {
        menuButton.addEventListener('click', () => {
            menu.classList.toggle('active');
            menuButton.textContent = menu.classList.contains('active') ? 'Close' : 'Menu';
        });

        document.querySelectorAll('.menu-nav a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                menuButton.textContent = 'Menu';
            });
        });
    }

    // Initialize hover effects
    document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            isHovering = true;
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            isHovering = false;
        });
    });

    // Initialize videos
    document.querySelectorAll('.section').forEach(section => {
        if (section.id === 'hero') {
            initializeVideo(section);
        }
    });

    // Initialize slideshows with optimized loading
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
        // Add other slideshow sections here
    };

    Object.entries(slideshowSections).forEach(([sectionId, images]) => {
        initializeSlideshow(sectionId, images);
    });

    // Initialize scroll animations with optimization
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const content = entry.target.querySelector('.section-content');
                if (content) {
                    content.classList.add('visible');
                    debug(`Section visible: ${entry.target.id}`, 'success');
                }
                // Unobserve after animation
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    document.querySelectorAll('.section').forEach(section => {
        sectionObserver.observe(section);
    });

    debug('Initialization complete', 'success');
});