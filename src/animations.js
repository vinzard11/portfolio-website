/**
 * @file animations.js
 * @description Manages all animations for the portfolio website.
 */

let heroTextParallaxHandler = null;

// Helper function to split titles for animation
function splitTitleForAnimation(title) {
    if (!title.querySelector('span.letter')) {
        const words = title.textContent.trim().split(' ');
        title.innerHTML = words.map(word => {
            const letters = word.split('').map(letter => `<span class='letter' style='display: inline-block;'>${letter}</span>`).join('');
            return `<span class="word" style="display: inline-block;">${letters}</span>`;
        }).join(' ');
    }
}

// Function to handle scroll-to-zoom on the homepage image gallery
function initImageScrollZoom() {
    if (typeof gsap === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const target = document.getElementById('flipping-image-wrapper');
    if (!target) return;

    gsap.to(target, {
        scrollTrigger: {
            trigger: target,
            start: "top center+=100",
            end: "bottom top",
            scrub: 1.2,
        },
        scale: 1.25,
        ease: "power1.inOut"
    });
}

export function initWorkexPageAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const video = document.getElementById('workex-video');
    const listWrapper = document.querySelector('.workex-content-wrapper');
    
    if (video && listWrapper && typeof gsap !== 'undefined') {
        gsap.to(video, {
            scrollTrigger: {
                trigger: listWrapper,
                start: "center center",
                end: "bottom top",
                scrub: 1.5,
            },
            scale: 1.2,
        });
    }
}

export function animateHeroText() {
    if (typeof gsap === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.set('[data-animate]', { y: 30, opacity: 0 }); 
    const tl = gsap.timeline();
    tl.to('[data-animate="hero-title"]', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "+=0.3")
      .to('[data-animate="hero-subtitle"]', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.4")
      .to('[data-animate="hero-p"]', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6")
      .to('[data-animate="scroll-indicator"]', { opacity: 1, duration: 1, ease: 'power1.inOut' });
}

export function enableHeroTextParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || heroTextParallaxHandler) return;
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
        tx = -dx * 40; 
        ty = -dy * 30;
    }

    heroTextParallaxHandler = { onMove, raf: null };
    window.addEventListener('mousemove', onMove);
    frame();
}

export function disableHeroTextParallax() {
    if (!heroTextParallaxHandler) return;
    window.removeEventListener('mousemove', heroTextParallaxHandler.onMove);
    cancelAnimationFrame(heroTextParallaxHandler.raf);
    heroTextParallaxHandler = null;
    const textWrapper = document.getElementById('hero-text-wrapper');
    if (textWrapper) textWrapper.style.transform = '';
}

// OPTIMIZATION: New function using GSAP ScrollTrigger for robust scroll animations
export function initGsapScrollTriggers() {
    if (typeof gsap === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    gsap.registerPlugin(ScrollTrigger);

    // Animate .scroll-fade elements
    gsap.utils.toArray('.scroll-fade').forEach(el => {
        gsap.fromTo(el, 
            { opacity: 0, y: 30 },
            { 
                opacity: 1, 
                y: 0,
                duration: 0.6,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // Animate .scroll-reveal elements
    gsap.utils.toArray('.scroll-reveal').forEach(el => {
        gsap.fromTo(el, 
            { clipPath: 'inset(100% 0% 0% 0%)', y: 50 },
            { 
                clipPath: 'inset(0% 0% 0% 0%)', 
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
}

export function initializeHomePageAnimations() {
    enableHeroTextParallax();
    animateHeroText();
    initImageScrollZoom();
}

export function cleanupPageAnimations() {
    disableHeroTextParallax();
    // Kill all ScrollTrigger instances to prevent memory leaks between page loads
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
}

export function initInteractiveCards() {
    const featureCards = document.querySelectorAll('.home-feature-card-a, .home-feature-card-b, .home-feature-card-c');
    if (featureCards.length > 0 && typeof anime !== 'undefined' && window.innerWidth > 768) {
        featureCards.forEach(card => {
            const title = card.querySelector('.card-title');
            if (!title) return;

            splitTitleForAnimation(title);
            let isAnimating = false;

            card.addEventListener('mouseenter', () => {
                if (isAnimating) return;
                isAnimating = true;

                anime({
                    targets: title,
                    translateY: [
                        { value: card.classList.contains('home-feature-card-b') ? -40 : (card.classList.contains('home-feature-card-c') ? -100 : -70), duration: 400, easing: 'easeOutExpo' }
                    ],
                });

                anime({
                    targets: title.querySelectorAll('.letter'),
                    translateY: [
                        { value: -5, duration: 150, easing: 'easeOutSine' },
                        { value: 0, duration: 450, easing: 'spring(1, 80, 10, 0)' }
                    ],
                    delay: anime.stagger(30),
                    complete: () => { isAnimating = false; }
                });
            });

            card.addEventListener('mouseleave', () => {
                if (isAnimating) {
                    anime.remove(title);
                    anime.remove(title.querySelectorAll('.letter'));
                }
                isAnimating = false;
                anime({ targets: title, translateY: 0, duration: 400, easing: 'easeOutExpo' });
                anime({ targets: title.querySelectorAll('.letter'), translateY: 0, duration: 200, easing: 'easeOutQuad' });
            });
        });
    }

    const projectCards = document.querySelectorAll('#projects-grid .gradient-border-card');
    if (projectCards.length > 0 && typeof anime !== 'undefined') {
        projectCards.forEach(card => {
            const title = card.querySelector('h3');
            if (!title) return;

            splitTitleForAnimation(title);
            let titleAnimation;

            card.addEventListener('mouseenter', () => {
                if (titleAnimation) titleAnimation.pause();
                titleAnimation = anime({
                    targets: title.querySelectorAll('.letter'),
                    translateY: [
                        { value: [0, -8], duration: 200, easing: 'easeOutSine' },
                        { value: 0, duration: 600, easing: 'spring(1, 80, 15, 0)' }
                    ],
                    rotateZ: [
                        { value: [0, -5], duration: 200, easing: 'easeOutSine' },
                        { value: 0, duration: 600, easing: 'spring(1, 80, 15, 0)' }
                    ],
                    delay: anime.stagger(15)
                });
                anime({ targets: card, scale: 1.05, translateY: -8, easing: 'spring(1, 80, 10, 0)' });
            });

            card.addEventListener('mouseleave', () => {
                if (titleAnimation) titleAnimation.pause();
                anime({ targets: title.querySelectorAll('.letter'), translateY: 0, rotateZ: 0, duration: 300, easing: 'easeOutQuad' });
                anime({ targets: card, scale: 1, translateY: 0, easing: 'spring(1, 80, 10, 0)' });
            });
        });
    }

    const aboutSection = document.querySelector('.about-me-section');
    if (aboutSection && typeof anime !== 'undefined') {
        const title = aboutSection.querySelector('h2');
        if (!title) return;

        splitTitleForAnimation(title);
        let aboutTitleAnimation;

        aboutSection.addEventListener('mouseenter', () => {
            if (aboutTitleAnimation) aboutTitleAnimation.pause();
            aboutTitleAnimation = anime({
                targets: title.querySelectorAll('.letter'),
                translateY: [
                    { value: [0, -8], duration: 200, easing: 'easeOutSine' },
                    { value: 0, duration: 600, easing: 'spring(1, 80, 15, 0)' }
                ],
                rotateZ: [
                    { value: [0, -5], duration: 200, easing: 'easeOutSine' },
                    { value: 0, duration: 600, easing: 'spring(1, 80, 15, 0)' }
                ],
                delay: anime.stagger(35)
            });
        });

        aboutSection.addEventListener('mouseleave', () => {
            if (aboutTitleAnimation) aboutTitleAnimation.pause();
            anime({ targets: title.querySelectorAll('.letter'), translateY: 0, rotateZ: 0, duration: 300, easing: 'easeOutQuad' });
        });
    }
}

export function initWorkexDetailAnimations() {
    const customScrollbar = document.getElementById('custom-scrollbar');
    if (customScrollbar) {
        customScrollbar.style.display = 'none';
    }

    const sections = document.querySelectorAll('.workex-v-section');
    const navLinks = document.querySelectorAll('.workex-v-nav-link');

    if (sections.length > 0 && navLinks.length > 0) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                const navLink = document.querySelector(`.workex-v-nav-link[href="#${id}"]`);

                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (navLink) {
                        navLink.classList.add('active');
                    }
                }
            });
        }, { rootMargin: "-30% 0px -70% 0px", threshold: 0 });

        sections.forEach(section => { observer.observe(section); });

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        });
    }

    const mediaContainer = document.querySelector('.workex-v-media-container');
    if (mediaContainer && typeof gsap !== 'undefined') {
        gsap.to(mediaContainer, {
            scrollTrigger: {
                trigger: '.workex-v-body',
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
            },
            scale: 1.15,
        });
    }

    const bcVideo = document.getElementById('bc-workex-video');
    const bcLogo = document.getElementById('bc-workex-logo');
    const zsVideo = document.getElementById('zs-workex-video');
    const zsLogo = document.getElementById('zs-workex-logo');

    if (bcVideo && bcLogo) {
        bcVideo.onended = () => {
            gsap.to(bcVideo, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    bcVideo.style.display = 'none';
                    bcLogo.classList.remove('hidden');
                    gsap.fromTo(bcLogo, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 });
                }
            });
        };
    }

    if (zsVideo && zsLogo) {
        zsVideo.onended = () => {
            gsap.to(zsVideo, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    zsVideo.style.display = 'none';
                    zsLogo.classList.remove('hidden');
                    gsap.fromTo(zsLogo, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 });
                }
            });
        };
    }
}