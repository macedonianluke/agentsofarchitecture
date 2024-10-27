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

// Initialize custom cursor
function initializeCustomCursor() {
    debug('Initializing custom cursor', 'log');
    
    const cursor = document.querySelector('.cursor');
    if (!cursor) {
        debug('Cursor element not found', 'error');
        return null;
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
    debug('Custom cursor initialized', 'success');
    
    return {
        cursor,
        setHovering: (value) => isHovering = value,
        show: () => cursor.style.opacity = '1',
        hide: () => cursor.style.opacity = '0'
    };
}

// Initialize menu
function initializeMenu() {
    debug('Initializing menu', 'log');
    
    const menuButton = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    
    if (!menuButton || !menu) {
        debug('Menu elements not found', 'error');
        return;
    }
    
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
    
    debug('Menu initialized', 'success');
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

    debug(`Attempting to load ${images.length} images for ${sectionId}`, 'log');
    
    const imageTests = images.map((imagePath, index) => {
        return new Promise((resolve) => {
            const testImage = new Image();
            
            testImage.onload = () => {
                debug(`Image ${index + 1} loaded successfully: ${imagePath}`, 'success');
                resolve({ success: true, path: imagePath, index });
            };
            
            testImage.onerror = () => {
                debug(`Failed to load image ${index + 1}: ${imagePath}`, 'error');
                resolve({ success: false, path: imagePath, index });
            };
            
            testImage.src = imagePath;
        });
    });

    Promise.all(imageTests).then(results => {
        const loadedImages = results.filter(r => r.success);
        debug(`Successfully loaded ${loadedImages.length} of ${images.length} images`, 'log');

        if (loadedImages.length === 0) {
            debug('No images loaded successfully! Check file paths and names', 'error');
            return;
        }

        slideshowContainer.innerHTML = '';
        
        loadedImages.forEach((imageInfo, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = `slideshow-image ${index === 0 ? 'active' : ''}`;
            slideDiv.style.backgroundImage = `url('${imageInfo.path}')`;
            slideshowContainer.appendChild(slideDiv);
        });

        let currentIndex = 0;
        const slides = slideshowContainer.querySelectorAll('.slideshow-image');

        const nextSlide = () => {
            slides[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % slides.length;
            slides[currentIndex].classList.add('active');
        };

        const slideInterval = setInterval(nextSlide, 5000);

        // Pause slideshow when section not visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    clearInterval(slideInterval);
                }
            });
        });

        observer.observe(section);
    });
}

// Video initialization with debug
function initializeVideo(section) {
    debug(`Initializing video for section: ${section.id}`, 'log');
    
    const video = document.createElement('video');
    video.className = 'fullscreen-video';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    
    const videoSource = document.createElement('source');
    videoSource.type = 'video/mp4';
    const videoPath = `videos/${section.id.toLowerCase()}.mp4`;
    videoSource.src = videoPath;
    
    video.appendChild(videoSource);
    section.insertBefore(video, section.firstChild);
    
    video.addEventListener('loadeddata', () => {
        debug(`Video loaded successfully for ${section.id}`, 'success');
        video.play().catch(err => {
            debug(`Error playing video for ${section.id}: ${err}`, 'error');
        });
    });

    video.addEventListener('error', () => {
        debug(`Failed to load video for ${section.id}`, 'error');
    });
}

// Initialize descriptions with elegant toggle
function initializeDescriptionToggles() {
    debug('Initializing description toggles', 'log');
    
    const projectInfos = document.querySelectorAll('.project-info');
    
    projectInfos.forEach((projectInfo, index) => {
        const description = projectInfo.querySelector('.project-description');
        if (!description) return;
        
        const toggle = document.createElement('button');
        toggle.className = 'description-toggle';
        toggle.textContent = 'Details';
        projectInfo.appendChild(toggle);
        
        toggle.addEventListener('click', () => {
            const isExpanded = description.classList.contains('expanded');
            description.classList.toggle('expanded');
            toggle.classList.toggle('active');
            toggle.textContent = isExpanded ? 'Details' : 'Close';
            debug(`Description ${index + 1} ${isExpanded ? 'collapsed' : 'expanded'}`, 'log');
        });
        
        debug(`Initialized description toggle ${index + 1}`, 'success');
    });
}

// Initialize scroll animations
function initializeScrollAnimations() {
    debug('Initializing scroll animations', 'log');
    
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
        debug(`Added scroll observer to section: ${section.id}`, 'log');
    });
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    debug('DOM Content Loaded - Starting initialization', 'success');

    // Initialize custom cursor
    const cursorController = initializeCustomCursor();
    if (cursorController) {
        const { cursor, setHovering, show, hide } = cursorController;

        // Initialize interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                setHovering(true);
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                setHovering(false);
            });
        });

        // Mouse enter/leave handlers
        document.addEventListener('mouseenter', show);
        document.addEventListener('mouseleave', hide);
    }

    // Initialize menu
    initializeMenu();

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
        ],


        
    };

    Object.entries(slideshowSections).forEach(([sectionId, images]) => {
        initializeSlideshow(sectionId, images);
    });

    // Initialize description toggles
    initializeDescriptionToggles();

    // Initialize scroll animations
    initializeScrollAnimations();

    debug('Full initialization complete', 'success');
});