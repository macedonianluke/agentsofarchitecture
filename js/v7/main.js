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

// Video initialization with debug and error handling
function initializeVideo(section) {
    debug(`Initializing video for section: ${section.id}`, 'log');
    
    // Check if video already exists
    const existingVideo = section.querySelector('.fullscreen-video');
    if (existingVideo) {
        debug(`Video already exists for ${section.id}`, 'warn');
        return;
    }
    
    const video = document.createElement('video');
    video.className = 'fullscreen-video';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    
    const videoSource = document.createElement('source');
    videoSource.type = 'video/mp4';
    const videoPath = `/videos/${section.id.toLowerCase()}.mp4`;
    videoSource.src = videoPath;
    
    debug(`Attempting to load video: ${videoPath}`, 'log');
    
    video.appendChild(videoSource);
    
    // Insert video before the first child, but after any existing overlay
    const overlay = section.querySelector('.overlay');
    if (overlay) {
        overlay.insertAdjacentElement('beforebegin', video);
    } else {
        section.insertBefore(video, section.firstChild);
    }
    
    // Add error handling and playback management
    video.addEventListener('loadeddata', () => {
        debug(`Video loaded successfully for ${section.id}`, 'success');
        video.play().catch(err => {
            debug(`Error playing video for ${section.id}: ${err}`, 'error');
        });
    });

    video.addEventListener('error', () => {
        debug(`Failed to load video for ${section.id}. Error code: ${video.error ? video.error.code : 'unknown'}`, 'error');
        video.remove();
    });
    
    // Intersection observer for playback control
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play().catch(err => {
                    debug(`Error playing video when section became visible: ${err}`, 'error');
                });
            } else {
                video.pause();
            }
        });
    }, {
        threshold: 0.5
    });
    
    observer.observe(section);
}

// Enhanced slideshow initialization
function initializeSlideshow(sectionId, images) {
    debug(`Starting slideshow initialization for ${sectionId}`, 'log');
    
    const section = document.getElementById(sectionId);
    if (!section) {
        debug(`ERROR: Section #${sectionId} not found!`, 'error');
        return;
    }
    
    const slideshowContainer = section.querySelector('.slideshow-container');
    if (!slideshowContainer) {
        debug(`ERROR: Slideshow container not found in #${sectionId}!`, 'error');
        return;
    }
    
    debug(`Found slideshow container for ${sectionId}`, 'success');
    
    // Test load each image
    const imageTests = images.map((imagePath, index) => {
        return new Promise((resolve) => {
            const testImage = new Image();
            
            testImage.onload = () => {
                debug(`Image ${index + 1} loaded successfully: ${imagePath}`, 'success');
                resolve({
                    success: true,
                    path: imagePath,
                    index: index
                });
            };
            
            testImage.onerror = () => {
                debug(`Failed to load image ${index + 1}: ${imagePath}`, 'error');
                resolve({
                    success: false,
                    path: imagePath,
                    index: index
                });
            };
            
            testImage.src = imagePath;
        });
    });

    // Process all images
    Promise.all(imageTests).then(results => {
        const loadedImages = results.filter(r => r.success);
        debug(`Successfully loaded ${loadedImages.length} of ${images.length} images for ${sectionId}`, 'log');

        if (loadedImages.length === 0) {
            debug(`No images loaded successfully for ${sectionId}! Check file paths and names`, 'error');
            return;
        }

        // Clear and create slideshow
        slideshowContainer.innerHTML = '';
        
        loadedImages.forEach((imageInfo, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = `slideshow-image ${index === 0 ? 'active' : ''}`;
            slideDiv.style.backgroundImage = `url('${imageInfo.path}')`;
            slideshowContainer.appendChild(slideDiv);
            debug(`Added slide ${index + 1} to ${sectionId}`, 'success');
        });

        // Initialize slideshow controls
        let currentIndex = 0;
        const slides = slideshowContainer.querySelectorAll('.slideshow-image');

        function nextSlide() {
            slides[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % slides.length;
            slides[currentIndex].classList.add('active');
            debug(`Changed to slide ${currentIndex + 1} in ${sectionId}`, 'log');
        }

        // Start slideshow with visibility handling
        let slideInterval = setInterval(nextSlide, 5000);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    clearInterval(slideInterval);
                    debug(`Paused slideshow - ${sectionId} not visible`, 'log');
                } else {
                    slideInterval = setInterval(nextSlide, 5000);
                    debug(`Resumed slideshow - ${sectionId} visible`, 'log');
                }
            });
        });

        observer.observe(section);
    });
}

// Cursor initialization
function initializeCursor() {
    const cursor = document.querySelector('.cursor');
    if (!cursor) {
        debug('Cursor element not found', 'error');
        return;
    }
    
    debug('Initializing cursor', 'log');
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
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

    // Handle cursor visibility
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        debug('Cursor visible - mouse entered document', 'log');
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        debug('Cursor hidden - mouse left document', 'log');
    });

    // Initialize cursor hover effects
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

    updateCursor();
    debug('Cursor initialization complete', 'success');
}

// Menu initialization
function initializeMenu() {
    const menuButton = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    
    if (!menuButton || !menu) {
        debug('Menu elements not found', 'error');
        return;
    }
    
    debug('Initializing menu', 'log');
    
    menuButton.addEventListener('click', () => {
        menu.classList.toggle('active');
        menuButton.textContent = menu.classList.contains('active') ? 'Close' : 'Menu';
        debug('Menu state toggled', 'log');
    });

    const menuLinks = document.querySelectorAll('.menu-nav a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            menuButton.textContent = 'Menu';
            debug('Menu closed via link click', 'log');
        });
    });

    debug('Menu initialization complete', 'success');
}

// Scroll animations initialization
function initializeScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    debug(`Found ${sections.length} sections for scroll animations`, 'log');
    
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
        debug(`Added scroll observer to section: ${section.id}`, 'log');
    });
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    debug('DOM Content Loaded - Starting initialization', 'success');

    // Initialize cursor
    initializeCursor();

    // Initialize menu
    initializeMenu();

    // Initialize videos for all sections that need them
    const videoSections = ['hero', 'About', 'Stella', 'Retreat', 'Brumby', 'LittleFella', 'Weekender', 'FarmersDaughters', 'FarmersDaughtersVictoria','ZonzoEstateTheChapel','ZonzoEstateNegozioDelOfficio','ZonzoEstateNegozioDelVino','CaffeineTrader'];
    debug(`Initializing videos for sections: ${videoSections.join(', ')}`, 'log');
    videoSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            initializeVideo(section);
        } else {
            debug(`Video section #${sectionId} not found`, 'error');
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
        ],
        "FarmersDaughtersVictoria": [
            'images/farmers-daughters-victoria/fdv (1).jpg',
            'images/farmers-daughters-victoria/fdv (2).jpg',
            'images/farmers-daughters-victoria/fdv (3).jpg',
            'images/farmers-daughters-victoria/fdv (4).jpg',
            'images/farmers-daughters-victoria/fdv (5).jpg',
            'images/farmers-daughters-victoria/fdv (6).jpg',
            'images/farmers-daughters-victoria/fdv (7).jpg',
            'images/farmers-daughters-victoria/fdv (8).jpg',
            'images/farmers-daughters-victoria/fdv (9).jpg',
            'images/farmers-daughters-victoria/fdv (10).jpg',
            'images/farmers-daughters-victoria/fdv (11).jpg',
            'images/farmers-daughters-victoria/fdv (12).jpg',
            'images/farmers-daughters-victoria/fdv (13).jpg',
            'images/farmers-daughters-victoria/fdv (14).jpg',
            'images/farmers-daughters-victoria/fdv (15).jpg',
            'images/farmers-daughters-victoria/fdv (16).jpg'
        ]
    ,
        "CaffeineTrader": [
            'images/caffeine-trader/ct (1).jpg',
            'images/caffeine-trader/ct (2).jpg',
            'images/caffeine-trader/ct (3).jpg'
    ]
    };

    Object.entries(slideshowSections).forEach(([sectionId, images]) => {
        debug(`Initializing slideshow for ${sectionId} with ${images.length} images`, 'log');
        initializeSlideshow(sectionId, images);
    });

    // Initialize scroll animations
    initializeScrollAnimations();

    debug('Full initialization complete', 'success');
});