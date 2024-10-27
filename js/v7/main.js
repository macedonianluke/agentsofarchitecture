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

// Update the video initialization function
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
    
    // Updated video path handling
    let videoPath;
    switch(section.id.toLowerCase()) {
        case 'hero':
            videoPath = 'video/Hero3.mp4';
            break;
        case 'about':
            videoPath = 'video/Hero1.mp4';
            break;
        case 'stella':
            videoPath = 'video/Stella.mp4';
            break;
        case 'retreat':
            videoPath = 'video/Retreat.mp4';
            break;
        case 'brumby':
            videoPath = 'video/Brumby.mp4';
            break;
        case 'littlefella':
            videoPath = 'video/LittleFella.mp4';
            break;
        case 'weekender':
            videoPath = 'video/Weekender.mp4';
            break;
        case 'churchill':
            videoPath = 'video/Churchill.mp4';
            break;
        case 'farmersdaughters':
            videoPath = 'video/FarmersDaughters.mp4';
            break;
        case 'farmersdaughtersvictoria':
            videoPath = 'video/FarmersDaughtersVictoria.mp4';
            break;
        case 'zonzoestatechapel':
            videoPath = 'video/ZonzoEstateChapel.mp4';
            break;
        case 'zonzoestatenegoziodelofficio':
            videoPath = 'video/ZonzoEstateNegozioDelOfficio.mp4';
            break;
        case 'zonzoestatenegoziodelvino':
            videoPath = 'video/ZonzoEstateNegozioDelVino.mp4';
            break;        
        default:
            videoPath = `video/${section.id}.mp4`;
    }
    
    videoSource.src = videoPath;
    video.appendChild(videoSource);
    
    // Insert video before overlay
    const overlay = section.querySelector('.overlay');
    if (overlay) {
        overlay.insertAdjacentElement('beforebegin', video);
    } else {
        section.insertBefore(video, section.firstChild);
    }
    
    // Enhanced intersection observer for better performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Only play if video is ready
                if (video.readyState >= 2) {
                    video.play().catch(err => {
                        debug(`Error playing video when section became visible: ${err}`, 'error');
                    });
                }
            } else {
                // Important: Pause and reset when out of view
                video.pause();
                video.currentTime = 0; // Reset to start
            }
        });
    }, {
        threshold: 0.1, // Trigger earlier
        rootMargin: '0px' // No margin
    });
    
    // Video event listeners
    video.addEventListener('loadeddata', () => {
        debug(`Video loaded successfully for ${section.id}`, 'success');
        // Only play if section is visible
        if (isElementInViewport(section)) {
            video.play().catch(err => {
                debug(`Error playing video for ${section.id}: ${err}`, 'error');
            });
        }
    });

    video.addEventListener('error', (e) => {
        debug(`Failed to load video for ${section.id}. Path: ${videoPath}, Error: ${video.error ? video.error.code : 'unknown'}`, 'error');
        if (video.error) {
            switch (video.error.code) {
                case MediaError.MEDIA_ERR_ABORTED:
                    debug('Video loading aborted', 'error');
                    break;
                case MediaError.MEDIA_ERR_NETWORK:
                    debug('Network error while loading video', 'error');
                    break;
                case MediaError.MEDIA_ERR_DECODE:
                    debug('Video decode error', 'error');
                    break;
                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    debug('Video format not supported', 'error');
                    break;
                default:
                    debug('Unknown error while loading video', 'error');
            }
        }
        video.remove();
    });

    // Start observing
    observer.observe(section);
}

// Helper function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
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
    
    // Test load each image
    const imageTests = images.map((imagePath, index) => {
        return new Promise((resolve) => {
            const testImage = new Image();
            
            testImage.onload = () => {
                debug(`Image ${index + 1} loaded successfully: ${imagePath}`, 'success');
                resolve({ success: true, path: imagePath, index: index });
            };
            
            testImage.onerror = () => {
                debug(`Failed to load image ${index + 1}: ${imagePath}`, 'error');
                resolve({ success: false, path: imagePath, index: index });
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
        });

        let currentIndex = 0;
        const slides = slideshowContainer.querySelectorAll('.slideshow-image');
        let slideInterval = null;

        function nextSlide() {
            slides[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % slides.length;
            slides[currentIndex].classList.add('active');
        }

        // Visibility observer for performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    slideInterval = setInterval(nextSlide, 5000);
                    debug(`Started slideshow for ${sectionId}`, 'log');
                } else {
                    if (slideInterval) {
                        clearInterval(slideInterval);
                        debug(`Paused slideshow for ${sectionId}`, 'log');
                    }
                }
            });
        }, { threshold: 0.3 });

        observer.observe(section);
    });
}

// Cursor initialization
function initializeCursor() {
    const cursor = document.querySelector('.cursor');
    if (!cursor) {
        console.error('Cursor element not found');
        return;
    }

    function moveCursor(e) {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }

    // Add mouse move listener
    document.addEventListener('mousemove', moveCursor);

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
}

// Make sure to call initializeCursor after DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCursor);

// Menu initialization
function initializeMenu() {
    const menuButton = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    
    if (!menuButton || !menu) {
        debug('Menu elements not found', 'error');
        return;
    }
    
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

// Scroll animations
function initializeScrollAnimations() {
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
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    debug('Starting initialization', 'log');

    // Initialize cursor
    initializeCursor();

    // Initialize menu
    initializeMenu();

    // Initialize videos with proper paths
    const videoSections = {
        'Hero': true,
        'About': true,
        'Stella': true,
        'Retreat': true,
        'Brumby': true,
        'LittleFella': true,
        'Weekender': true,
        'Churchill': true,
        'FarmersDaughters': true,
        'FarmersDaughtersVictoria': true,
        'ZonzoEstateChapel': true,
        'ZonzoEstateNegozioDelOfficio': true,
        'ZonzoEstateNegozioDelVino': true,
        'ZonzoEstateSpritzBar': false,
        'CaffeineTrader': false
    };

    Object.keys(videoSections).forEach(sectionId => {
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
        ],
        "CaffeineTrader": [
            'images/caffeine-trader/ct (1).jpg',
            'images/caffeine-trader/ct (2).jpg',
            'images/caffeine-trader/ct (3).jpg'
        ]
    };

    Object.entries(slideshowSections).forEach(([sectionId, images]) => {
        initializeSlideshow(sectionId, images);
    });

    // Initialize scroll animations
    initializeScrollAnimations();

    debug('Initialization complete', 'success');
});