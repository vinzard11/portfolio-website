/**
 * @file app.js
 * @description Main application logic for the portfolio website.
 * Handles routing, content rendering, and interactive elements.
 */

// Import data from the data.js file
import { workData, projectData } from './data.js';
// Import the new 3D Brand Model Animation
import { initHeroImage, cleanupHeroImage } from './hero-image.js';
// Import the particle background initializer
import { initThreeJS } from './3d-background.js';

// Wait for the entire page to load to prevent script errors.
window.addEventListener('load', () => {
    // ===================================
    // DOM ELEMENTS
    // ===================================
    const appRoot = document.getElementById('app-root');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const pdfModal = document.getElementById('pdf-viewer-modal');
    const pdfIframe = document.getElementById('pdf-iframe');
    const pdfTitle = document.getElementById('pdf-title');
    const pdfModalClose = document.getElementById('pdf-modal-close');
    const preloader = document.getElementById('preloader');
    // **NEW:** Custom scrollbar elements
    const scrollbarLiquid = document.getElementById('scrollbar-liquid');
    const scrollbarPercentage = document.getElementById('scrollbar-percentage');

    // Handle preloader fade-out
    preloader.classList.add('loaded');

    // Check for user's motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===================================
    // INITIALIZATION
    // ===================================
    
    if (!prefersReducedMotion) {
        // Initialize the particle background
        initThreeJS();
        // Initialize custom cursor
        initCustomCursor();
    } else {
        // Make animated elements visible immediately for reduced motion
        document.querySelectorAll('[data-animate]').forEach(el => el.style.opacity = 1);
    }

    // ===================================
    // ANIMATIONS & EFFECTS
    // ===================================
    
    /**
     * Animates the hero text into view using GSAP.
     */
    function animateHeroText() {
        if (typeof gsap === 'undefined' || prefersReducedMotion) return;
        gsap.set('[data-animate]', { y: 30, opacity: 0 }); // Initial state
        const tl = gsap.timeline();
        // Staggered animation sequence
        tl.to('[data-animate="hero-title"]', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "+=0.3")
          .to('[data-animate="hero-subtitle"]', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.4")
          .to('[data-animate="hero-p"]', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6")
          .to('[data-animate="scroll-indicator"]', { opacity: 1, duration: 1, ease: 'power1.inOut' });
    }

    // Parallax mouse interaction for hero text
    let heroTextParallaxHandler = null;
    function enableHeroTextParallax() {
        if (prefersReducedMotion || heroTextParallaxHandler) return;
        const textWrapper = document.getElementById('hero-text-wrapper');
        if (!textWrapper) return;

        let tx = 0, ty = 0, vx = 0, vy = 0;
        const speed = 0.08;

        function frame() {
            vx += (tx - vx) * speed;
            vy += (ty - vy) * speed;
            textWrapper.style.transform = `translate3d(${vx}px, ${vy}px, 0)`;
            heroTextParallaxHandler.raf = requestAnimationFrame(frame);
        }

        function onMove(e) {
            const rect = textWrapper.parentElement.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / rect.width;
            const dy = (e.clientY - cy) / rect.height;
            // Move opposite to cursor, creating depth
            tx = -dx * 40; // Adjust multiplier for desired effect
            ty = -dy * 30;
        }

        heroTextParallaxHandler = { onMove, raf: null };
        window.addEventListener('mousemove', onMove);
        frame();
    }

    function disableHeroTextParallax() {
        if (!heroTextParallaxHandler) return;
        window.removeEventListener('mousemove', heroTextParallaxHandler.onMove);
        cancelAnimationFrame(heroTextParallaxHandler.raf);
        heroTextParallaxHandler = null;
        const textWrapper = document.getElementById('hero-text-wrapper');
        if (textWrapper) textWrapper.style.transform = '';
    }

    /**
     * Initializes the custom cursor and its interactions.
     */
    function initCustomCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'cursor';
        document.body.appendChild(cursor);

        let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
        const speed = 0.1;

        function animate() {
            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            requestAnimationFrame(animate);
        }
        animate();

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, .router-link, .view-pdf-btn, .toggle-summary')) {
                cursor.classList.add('grow');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('a, button, .router-link, .view-pdf-btn, .toggle-summary')) {
                cursor.classList.remove('grow');
            }
        });

        document.addEventListener('mousedown', () => cursor.classList.add('clicked'));
        document.addEventListener('mouseup', () => cursor.classList.remove('clicked'));
        document.body.addEventListener('mouseleave', () => cursor.classList.add('hidden'));
        document.body.addEventListener('mouseenter', () => cursor.classList.remove('hidden'));
    }

    // --- Scroll-based animation for the sphere ---
    let scrollTimeline = null;
    function initScrollAnimations(sphere, camera) {
        if (prefersReducedMotion || !sphere || !camera || typeof gsap === 'undefined') return;
        
        gsap.registerPlugin(ScrollTrigger);

        scrollTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: "#main-content-wrapper",
                start: "top bottom", 
                end: "top top", 
                scrub: 0.5, 
            }
        });
        
        const xPosition = window.innerWidth > 768 ? 18 : 9;
        scrollTimeline.to(sphere.position, {
            x: xPosition, 
            y: -5,
            ease: "power1.inOut"
        }, 0);

        scrollTimeline.to(sphere.scale, {
            x: 1.2,
            y: 1.2,
            z: 1.2,
            ease: "power1.inOut"
        }, 0);
    }


    function killScrollAnimations() {
        if (scrollTimeline) {
            scrollTimeline.kill();
            scrollTimeline = null;
        }
    }

    // **NEW:** Function to handle custom scrollbar updates
    function handleScroll() {
        if (!scrollbarLiquid || !scrollbarPercentage) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        
        // Prevent division by zero if content is not scrollable
        if (scrollHeight === clientHeight) {
            scrollbarLiquid.style.height = '0%';
            scrollbarPercentage.textContent = '0%';
            return;
        }

        const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
        const clampedPercent = Math.min(100, scrollPercent);

        scrollbarLiquid.style.height = `${clampedPercent}%`;
        scrollbarPercentage.textContent = `${Math.round(clampedPercent)}%`;
    }


    // ===================================
    // RENDER FUNCTIONS (for dynamic content)
    // ===================================
    const createVisualHTML = (visual) => {
        if (!visual) return '';
        switch (visual.type) {
            case 'stat': return `<div class="text-center"><p class="text-4xl font-bold text-primary">${visual.value}</p><p class="text-xs text-text-light uppercase tracking-wider">${visual.label}</p></div>`;
            case 'circle': return `<div class="relative w-24 h-24"><svg class="w-full h-full" viewBox="0 0 36 36"><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(0,0,0,0.05)" stroke-width="3"></path><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="url(#circleGradient)" stroke-width="3" stroke-dasharray="${visual.value}, 100" stroke-linecap="round"></path><defs><linearGradient id="circleGradient" gradientTransform="rotate(90)"><stop offset="0%" stop-color="${'var(--color-accent)'}" /><stop offset="100%" stop-color="${'var(--color-primary)'}" /></linearGradient></defs></svg><div class="absolute inset-0 flex flex-col items-center justify-center"><span class="text-xl font-bold text-text-dark">${visual.value}%</span><span class="text-xs text-text-light">${visual.label}</span></div></div>`;
            case 'icon': return `<div class="text-primary"><svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>`;
            default: return '';
        }
    };

    const createWorkItemHTML = (exp, index) => {
        const isReversed = index % 2 !== 0;
        const alignmentClass = isReversed ? 'md:flex-row-reverse' : '';
        const textAlignClass = isReversed ? 'md:text-left md:pl-12' : 'md:text-right md:pr-12';

        let contentHTML = '';
        if (exp.projects) {
            contentHTML = `
                <div class="space-y-4 text-left">
                    ${exp.projects.map(proj => `
                        <div class="p-4 rounded-lg bg-white/50 border border-slate-200 expandable-item">
                            <div class="flex gap-4 items-center cursor-pointer toggle-summary">
                                <div class="flex-shrink-0 w-24 flex justify-center">${createVisualHTML(proj.visual)}</div>
                                <div class="flex-grow">
                                    <h4 class="font-semibold text-text-dark" style="font-family: 'Montserrat', sans-serif;">${proj.title}</h4>
                                </div>
                                <div class="toggle-icon text-primary text-2xl font-light ml-2">+</div>
                            </div>
                            <div class="details-content">
                                <p class="text-text-light">${proj.details}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>`;
        } else if (exp.details) {
            contentHTML = `<p class="text-text-light text-left">${exp.details}</p>`;
        }

        return `
            <div class="relative pl-12 md:pl-0 mb-24 scroll-fade">
                <div class="md:flex items-start ${alignmentClass}">
                    <div class="md:w-1/2 ${textAlignClass} expandable-item">
                        <div class="cursor-pointer toggle-summary">
                            <p class="text-lg font-semibold text-primary" style="font-family: 'Montserrat', sans-serif;">${exp.date}</p>
                            <h2 class="text-3xl font-bold text-text-dark mt-1">${exp.company}</h2>
                            <h3 class="text-xl font-semibold text-text-light mb-3" style="font-family: 'Montserrat', sans-serif;">${exp.role}</h3>
                            <p class="text-text-light mt-2">${exp.summary}</p>
                            <div class="flex-shrink-0 w-full flex ${isReversed ? 'justify-start' : 'md:justify-end'} mt-4">
                                ${exp.visual ? createVisualHTML(exp.visual) : ''}
                            </div>
                            <div class="absolute top-4 ${isReversed ? 'md:left-full md:ml-8' : 'md:right-full md:mr-8'} right-4 toggle-icon text-primary text-3xl font-light">+</div>
                        </div>
                        <div class="details-content">
                            ${contentHTML}
                        </div>
                    </div>
                </div>
                <div class="absolute left-4 top-1 h-4 w-4 bg-primary rounded-full border-4 border-white transform -translate-x-1/2 md:left-1/2"></div>
            </div>`;
    };
    
    const createProjectCardHTML = (proj, index) => {
        const docButtons = proj.documents.map(doc => 
            `<button class="btn text-sm mt-2 mr-2 view-pdf-btn" data-pdf-src="${doc.url}" data-pdf-title="${doc.name}">${doc.name}</button>`
        ).join('');

        return `
            <div class="gradient-border-card p-6 flex flex-col scroll-fade delay-${(index % 3) + 1} expandable-item">
                <div class="cursor-pointer toggle-summary flex-grow">
                    <div class="flex justify-between items-start">
                        <h3 class="text-2xl font-bold text-text-dark mb-2">${proj.title}</h3>
                        <div class="toggle-icon text-primary text-2xl font-light ml-2">+</div>
                    </div>
                    <p class="text-text-light">${proj.summary}</p>
                </div>
                <div class="details-content">
                    <p class="text-text-light">${proj.details}</p>
                    <div class="mt-4">
                        ${docButtons}
                    </div>
                </div>
            </div>
        `;
    };

    // ===================================
    // ROUTER & CONTENT LOADING
    // ===================================
    const loadContent = (path) => {
        // Cleanup animations from the previous page before loading new content
        cleanupHeroImage();
        disableHeroTextParallax();
        killScrollAnimations();

        const pageId = 'page-' + (path.substring(1) || 'home');
        const template = document.getElementById(pageId);
        
        appRoot.style.transition = 'opacity 0.3s ease-in-out';
        appRoot.style.opacity = 0;

        setTimeout(() => {
            if (template) {
                appRoot.innerHTML = '';
                const content = template.content.cloneNode(true);
                appRoot.appendChild(content);

                if (pageId === 'page-workex') {
                    const container = document.getElementById('workex-timeline');
                    if(container) container.innerHTML = `<div class="absolute left-1/2 -translate-x-1/2 top-0 w-1 bg-primary/20 h-full hidden md:block"></div>` + workData.map(createWorkItemHTML).join('');
                }
                if (pageId === 'page-projects') {
                    const container = document.getElementById('projects-grid');
                    if(container) container.innerHTML = projectData.map(createProjectCardHTML).join('');
                }

                if (pageId === 'page-home' && !prefersReducedMotion) {
                    const heroImageContainer = document.getElementById('hero-image-container');
                    if (heroImageContainer) {
                        const { sphere, camera } = initHeroImage(heroImageContainer);
                        initScrollAnimations(sphere, camera);
                    }
                    enableHeroTextParallax();
                    animateHeroText();
                } else {
                    document.querySelectorAll('[data-animate]').forEach(el => el.style.opacity = 1);
                }

                updateActiveLink(path);
                window.scrollTo(0, 0);
                initializePageListeners();
            } else {
                loadContent('#home');
            }
            appRoot.style.opacity = 1;
        }, 300);
    };
    
    const updateActiveLink = (path) => {
        document.querySelectorAll('header .nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === path);
        });
    };

    // ===================================
    // EVENT LISTENERS
    // ===================================
    const initializePageListeners = () => {
        if (!prefersReducedMotion) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) entry.target.classList.add('animate-in');
                });
            }, { threshold: 0.1 });
            document.querySelectorAll('.scroll-fade').forEach(el => observer.observe(el));
        } else {
            document.querySelectorAll('.scroll-fade').forEach(el => el.classList.add('animate-in'));
        }

        document.querySelectorAll('.expandable-item').forEach(item => {
            const button = item.querySelector('.toggle-summary');
            if(button) {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const content = item.querySelector('.details-content');
                    item.classList.toggle('open');
                    if(content) content.classList.toggle('open');
                });
            }
        });
        
        document.querySelectorAll('.view-pdf-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const src = button.dataset.pdfSrc;
                const title = button.dataset.pdfTitle;
                if (src && src !== '#') {
                    pdfTitle.textContent = title;
                    pdfIframe.src = src;
                    pdfModal.classList.add('visible');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    };

    // Main router link handler
    document.querySelectorAll('.router-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const path = e.currentTarget.hash;
            if (window.location.hash !== path) {
                history.pushState(null, '', path);
                loadContent(path);
            }
            if(!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
    
    window.addEventListener('popstate', () => loadContent(window.location.hash || '#home'));
    mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

    const closeModal = () => {
        pdfModal.classList.remove('visible');
        document.body.style.overflow = '';
        pdfIframe.src = '';
    };
    pdfModalClose.addEventListener('click', closeModal);
    pdfModal.addEventListener('click', (e) => {
        if (e.target === pdfModal) closeModal();
    });

    document.getElementById('year').textContent = new Date().getFullYear();
    
    // **NEW:** Add scroll listener for the custom scrollbar
    window.addEventListener('scroll', handleScroll);

    // Initial content load
    loadContent(window.location.hash || '#home');
});
