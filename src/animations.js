/**
 * @file animations.js
 * @description Manages all animations for the portfolio website.
 */

let scrollTimeline = null;
let heroTextParallaxHandler = null;

// Helper function to split titles into words and letters for animation
function splitTitleForAnimation(title) {
    if (!title.querySelector('span.letter')) {
        const words = title.textContent.trim().split(' ');
        title.innerHTML = words.map(word => {
            const letters = word.split('').map(letter => `<span class='letter' style='display: inline-block;'>${letter}</span>`).join('');
            return `<span class="word" style="display: inline-block;">${letters}</span>`;
        }).join(' ');
    }
}

// Function to handle the scroll-to-zoom effect on the homepage image gallery
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
    // MODIFIED: The trigger is now the list wrapper, not the video itself
    const listWrapper = document.querySelector('.workex-content-wrapper');
    
    if (video && listWrapper && typeof gsap !== 'undefined') {
        gsap.to(video, {
            scrollTrigger: {
                trigger: listWrapper,
                start: "center center", // Start when the center of the wrapper hits the center of the screen
                end: "bottom top",      // End when the bottom of the wrapper hits the top of the screen
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

export function initScrollAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof gsap === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);
}

export function killScrollAnimations() {
    if (scrollTimeline) {
        scrollTimeline.kill();
        scrollTimeline = null;
    }
}

export function initializeHomePageAnimations() {
    enableHeroTextParallax();
    animateHeroText();
    initImageScrollZoom();
}

export function cleanupPageAnimations() {
    disableHeroTextParallax();
    killScrollAnimations();
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
}

export function initInteractiveCards() {
    // --- Home Page Feature Card Animations (Anime.js) ---
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
                    complete: () => {
                        isAnimating = false;
                    }
                });
            });

            card.addEventListener('mouseleave', () => {
                if (isAnimating) {
                    anime.remove(title);
                    anime.remove(title.querySelectorAll('.letter'));
                }
                isAnimating = false;
                anime({
                    targets: title,
                    translateY: 0,
                    duration: 400,
                    easing: 'easeOutExpo'
                });
                anime({
                    targets: title.querySelectorAll('.letter'),
                    translateY: 0,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
        });
    }

    // --- Projects Page Card Animations (Anime.js) ---
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
                    delay: anime.stagger(35)
                });

                anime.remove(card);
                anime({
                    targets: card,
                    scale: 1.05,
                    translateY: -8,
                    easing: 'spring(1, 80, 10, 0)'
                });
            });

            card.addEventListener('mouseleave', () => {
                if (titleAnimation) titleAnimation.pause();
                
                anime({
                    targets: title.querySelectorAll('.letter'),
                    translateY: 0,
                    rotateZ: 0,
                    duration: 300,
                    easing: 'easeOutQuad'
                });

                anime.remove(card);
                anime({
                    targets: card,
                    scale: 1,
                    translateY: 0,
                    easing: 'spring(1, 80, 10, 0)'
                });
            });
        });
    }

    // --- About Me Section Title Animation ---
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

            anime({
                targets: title.querySelectorAll('.letter'),
                translateY: 0,
                rotateZ: 0,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    }
}

export function initWorkexDetailAnimations() {
    if (typeof gsap === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const detailElements = gsap.utils.toArray([
        '.workex-brand-screen',
        '.key-point-card',
        '.key-point-card-zs',
        '.workex-motto-container'
    ]);

    if (detailElements.length > 0) {
        gsap.set(detailElements, { autoAlpha: 0, y: 100, scale: 0.9 });

        ScrollTrigger.batch(detailElements, {
            start: 'top 85%',
            onEnter: batch => gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 1.2,
                ease: 'power4.out',
                stagger: 0.15
            }),
        });
    }

    const title = document.querySelector('.workex-detail-title');
    if (title) {
        splitTitleForAnimation(title);
        gsap.from(title.querySelectorAll('.letter'), {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
            y: 50,
            opacity: 0,
            rotationZ: 15,
            duration: 0.8,
            ease: 'back.out(1.7)',
            stagger: 0.03,
        });
    }
}
